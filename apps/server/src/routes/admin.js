const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const { getDb, UPLOADS_DIR, generateJobNo } = require('../db');
const { requireAuth, requireAdmin, auditLog } = require('../middleware');

const router = express.Router();
router.use(requireAuth);

// Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    cb(null, allowed.includes(file.mimetype));
  },
});

// ---------- Signed URL tokens (in-memory, short-lived) ----------
const signedTokens = new Map();

function createSignedUrl(filePath, expiresInSec = 60) {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + expiresInSec * 1000;
  signedTokens.set(token, { filePath, expires });
  return `/api/admin/files/download?token=${token}`;
}

// Cleanup expired tokens every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, val] of signedTokens) {
    if (val.expires < now) signedTokens.delete(token);
  }
}, 5 * 60 * 1000);

router.get('/files/download', (req, res) => {
  const { token } = req.query;
  const entry = signedTokens.get(token);
  if (!entry || entry.expires < Date.now()) {
    return res.status(403).json({ error: 'Link expired' });
  }
  signedTokens.delete(token);
  const abs = path.join(UPLOADS_DIR, entry.filePath);
  if (!fs.existsSync(abs)) return res.status(404).json({ error: 'File not found' });
  res.sendFile(abs);
});

// ---------- CUSTOMERS ----------
router.get('/customers', (_req, res) => {
  const rows = getDb().prepare('SELECT * FROM customers ORDER BY created_at DESC').all();
  res.json(rows);
});

router.post('/customers', (req, res) => {
  const { name, phone, email, address, notes } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });
  const id = uuid();
  getDb().prepare(
    `INSERT INTO customers (id, name, phone, email, address, notes) VALUES (?,?,?,?,?,?)`
  ).run(id, name, phone, email || '', address || '', notes || '');
  auditLog(req, 'CREATE_CUSTOMER', id, `Created customer: ${name}`);
  res.json({ id, name, phone, email, address, notes });
});

router.put('/customers/:id', (req, res) => {
  const { name, phone, email, address, notes } = req.body;
  getDb().prepare(
    `UPDATE customers SET name=?, phone=?, email=?, address=?, notes=? WHERE id=?`
  ).run(name, phone, email || '', address || '', notes || '', req.params.id);
  auditLog(req, 'UPDATE_CUSTOMER', req.params.id, `Updated customer: ${name}`);
  res.json({ ok: true });
});

// ---------- VEHICLES ----------
router.get('/vehicles', (_req, res) => {
  const rows = getDb().prepare('SELECT * FROM vehicles ORDER BY created_at DESC').all();
  res.json(rows);
});

router.post('/vehicles', (req, res) => {
  const { customer_id, plate_number, make, model, year, color, body_type, vin } = req.body;
  if (!customer_id || !plate_number || !make || !model) {
    return res.status(400).json({ error: 'Customer, plate, make, model required' });
  }
  const id = uuid();
  getDb().prepare(
    `INSERT INTO vehicles (id, customer_id, plate_number, make, model, year, color, body_type, vin)
     VALUES (?,?,?,?,?,?,?,?,?)`
  ).run(id, customer_id, plate_number.toUpperCase(), make, model, year || '', color || '', body_type || '', vin || '');
  auditLog(req, 'CREATE_VEHICLE', id, `Registered vehicle: ${plate_number}`);
  res.json({ id, customer_id, plate_number, make, model, year, color, body_type, vin });
});

// ---------- JOB ORDERS ----------
router.get('/job-orders', (_req, res) => {
  const rows = getDb().prepare('SELECT * FROM job_orders ORDER BY created_at DESC').all();
  res.json(rows.map(r => ({
    ...r,
    services: JSON.parse(r.services || '[]'),
    assigned_technicians: JSON.parse(r.assigned_technicians || '[]'),
    intake_checklist: JSON.parse(r.intake_checklist || '{}'),
  })));
});

router.get('/job-orders/:id', (req, res) => {
  const row = getDb().prepare('SELECT * FROM job_orders WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json({
    ...row,
    services: JSON.parse(row.services || '[]'),
    assigned_technicians: JSON.parse(row.assigned_technicians || '[]'),
    intake_checklist: JSON.parse(row.intake_checklist || '{}'),
  });
});

router.post('/job-orders', (req, res) => {
  const {
    customer_id, vehicle_id, division, services, customer_concern,
    assigned_technicians, intake_checklist, intake_notes, estimated_release
  } = req.body;

  if (!customer_id || !vehicle_id || !division) {
    return res.status(400).json({ error: 'Customer, vehicle, division required' });
  }

  const db = getDb();
  const id = uuid();
  const job_no = generateJobNo();

  db.prepare(`
    INSERT INTO job_orders (
      id, job_no, customer_id, vehicle_id, division, services, customer_concern,
      stage, assigned_technicians, intake_checklist, intake_notes, estimated_release
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(
    id, job_no, customer_id, vehicle_id, division,
    JSON.stringify(services || []),
    customer_concern || '',
    'Received',
    JSON.stringify(assigned_technicians || []),
    JSON.stringify(intake_checklist || {}),
    intake_notes || '',
    estimated_release || ''
  );

  // Initial progress log
  db.prepare(
    `INSERT INTO progress_logs (id, job_order_id, stage, note, technician) VALUES (?,?,?,?,?)`
  ).run(uuid(), id, 'Received', 'Job order created', req.session.user.display_name);

  auditLog(req, 'CREATE_JOB_ORDER', id, `Created job order ${job_no}`);
  res.json({ id, job_no });
});

router.put('/job-orders/:id/stage', (req, res) => {
  const { stage, note } = req.body;
  const validStages = [
    'Received', 'Pre-Inspection', 'Estimate/Approval', 'In Repair',
    'Finishing/Paint', 'Final Assessment', 'Ready for Release', 'Released'
  ];
  if (!validStages.includes(stage)) {
    return res.status(400).json({ error: 'Invalid stage' });
  }

  const db = getDb();
  const updates = { stage, updated_at: new Date().toISOString() };
  if (stage === 'Released') updates.released_at = new Date().toISOString();

  db.prepare(
    `UPDATE job_orders SET stage = ?, updated_at = ?, released_at = COALESCE(?, released_at) WHERE id = ?`
  ).run(stage, updates.updated_at, updates.released_at || null, req.params.id);

  db.prepare(
    `INSERT INTO progress_logs (id, job_order_id, stage, note, technician) VALUES (?,?,?,?,?)`
  ).run(uuid(), req.params.id, stage, note || `Stage advanced to ${stage}`, req.session.user.display_name);

  const job = db.prepare('SELECT job_no FROM job_orders WHERE id = ?').get(req.params.id);
  auditLog(req, 'UPDATE_STAGE', req.params.id, `${job?.job_no} → ${stage}`);
  res.json({ ok: true });
});

router.put('/job-orders/:id', (req, res) => {
  const {
    division, services, customer_concern, assigned_technicians,
    intake_checklist, intake_notes, estimated_release
  } = req.body;

  getDb().prepare(`
    UPDATE job_orders SET division=?, services=?, customer_concern=?,
    assigned_technicians=?, intake_checklist=?, intake_notes=?, estimated_release=?,
    updated_at=datetime('now') WHERE id=?
  `).run(
    division, JSON.stringify(services || []), customer_concern || '',
    JSON.stringify(assigned_technicians || []),
    JSON.stringify(intake_checklist || {}),
    intake_notes || '', estimated_release || '', req.params.id
  );
  auditLog(req, 'UPDATE_JOB_ORDER', req.params.id, 'Updated job order details');
  res.json({ ok: true });
});

// ---------- PROGRESS LOGS ----------
router.get('/job-orders/:id/progress', (req, res) => {
  const rows = getDb().prepare(
    'SELECT * FROM progress_logs WHERE job_order_id = ? ORDER BY created_at ASC'
  ).all(req.params.id);
  res.json(rows);
});

router.post('/job-orders/:id/progress', (req, res) => {
  const { note, stage } = req.body;
  const job = getDb().prepare('SELECT * FROM job_orders WHERE id = ?').get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const id = uuid();
  getDb().prepare(
    `INSERT INTO progress_logs (id, job_order_id, stage, note, technician) VALUES (?,?,?,?,?)`
  ).run(id, req.params.id, stage || job.stage, note || '', req.session.user.display_name);

  auditLog(req, 'ADD_PROGRESS_NOTE', req.params.id, note);
  res.json({ id });
});

// ---------- INTAKE PHOTOS ----------
router.get('/intake-photos', (_req, res) => {
  const rows = getDb().prepare('SELECT * FROM intake_photos ORDER BY created_at DESC').all();
  res.json(rows.map(r => ({ ...r, url: createSignedUrl(r.file_path) })));
});

router.get('/intake-photos/job/:jobId', (req, res) => {
  const rows = getDb().prepare(
    'SELECT * FROM intake_photos WHERE job_order_id = ? ORDER BY created_at ASC'
  ).all(req.params.jobId);
  res.json(rows.map(r => ({ ...r, url: createSignedUrl(r.file_path) })));
});

router.post('/intake-photos', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    const { job_order_id, angle, label, caption, has_damage } = req.body;
    if (!job_order_id || !angle) {
      return res.status(400).json({ error: 'Job order and angle required' });
    }

    const job = getDb().prepare('SELECT * FROM job_orders WHERE id = ?').get(job_order_id);
    if (!job) return res.status(404).json({ error: 'Job order not found' });

    // Strip EXIF and save
    const filename = `${uuid()}.jpg`;
    const subdir = path.join('intake', job.job_no);
    const dir = path.join(UPLOADS_DIR, subdir);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(path.join(dir, filename), req.file.buffer);

    const filePath = path.join(subdir, filename);
    const id = uuid();

    getDb().prepare(`
      INSERT INTO intake_photos (id, job_order_id, vehicle_id, customer_id, angle, label, file_path, caption, has_damage, uploaded_by)
      VALUES (?,?,?,?,?,?,?,?,?,?)
    `).run(
      id, job_order_id, job.vehicle_id, job.customer_id,
      angle, label || '', filePath, caption || '',
      has_damage === 'true' || has_damage === true ? 1 : 0,
      req.session.user.display_name
    );

    auditLog(req, 'UPLOAD_PHOTO', id, `Intake photo (${angle}) for ${job.job_no}`);
    res.json({ id, url: createSignedUrl(filePath) });
  } catch (err) {
    console.error('Photo upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// ---------- BOOKINGS ----------
router.get('/bookings', (_req, res) => {
  const rows = getDb().prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
  res.json(rows);
});

router.put('/bookings/:id/status', (req, res) => {
  const { status } = req.body;
  const valid = ['Approved', 'Rescheduled', 'Declined', 'Converted'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  getDb().prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, req.params.id);
  auditLog(req, 'UPDATE_BOOKING', req.params.id, `Booking status → ${status}`);
  res.json({ ok: true });
});

// ---------- DOCUMENTS ----------
router.get('/documents', (_req, res) => {
  const rows = getDb().prepare('SELECT * FROM documents ORDER BY created_at DESC').all();
  res.json(rows.map(r => ({ ...r, url: r.file_path ? createSignedUrl(r.file_path) : null })));
});

router.post('/documents', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    const { title, category, job_no, plate_number, customer_name, job_order_id } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });

    const filename = `${uuid()}${path.extname(req.file.originalname) || '.pdf'}`;
    const subdir = 'documents';
    const dir = path.join(UPLOADS_DIR, subdir);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(path.join(dir, filename), req.file.buffer);
    const filePath = path.join(subdir, filename);
    const id = uuid();

    getDb().prepare(`
      INSERT INTO documents (id, job_order_id, job_no, plate_number, customer_name, title, category, file_path, file_size_kb, archived_by)
      VALUES (?,?,?,?,?,?,?,?,?,?)
    `).run(
      id, job_order_id || null, job_no || '', plate_number || '',
      customer_name || '', title, category || 'General', filePath,
      Math.round(req.file.size / 1024),
      req.session.user.display_name
    );

    auditLog(req, 'UPLOAD_DOCUMENT', id, `Archived: ${title}`);
    res.json({ id });
  } catch (err) {
    console.error('Document upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// ---------- AUDIT LOG ----------
router.get('/audit-log', requireAdmin, (_req, res) => {
  const rows = getDb().prepare('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 200').all();
  res.json(rows);
});

// ---------- USERS ----------
router.get('/users', requireAdmin, (_req, res) => {
  const rows = getDb().prepare(
    'SELECT id, username, email, role, display_name, must_change_password, created_at FROM users ORDER BY created_at ASC'
  ).all();
  res.json(rows);
});

router.post('/users', requireAdmin, async (req, res) => {
  const { username, password, email, role, display_name } = req.body;
  if (!username || !password || !display_name) {
    return res.status(400).json({ error: 'Username, password, display name required' });
  }
  if (!['Admin', 'Staff'].includes(role)) {
    return res.status(400).json({ error: 'Role must be Admin or Staff' });
  }

  const hash = await bcrypt.hash(password, 12);
  const id = uuid();
  try {
    getDb().prepare(
      `INSERT INTO users (id, username, email, password_hash, role, display_name) VALUES (?,?,?,?,?,?)`
    ).run(id, username, email || '', hash, role, display_name);
    auditLog(req, 'CREATE_USER', id, `Created user: ${username} (${role})`);
    res.json({ id, username, role, display_name });
  } catch (err) {
    if (err.message?.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    throw err;
  }
});

// ---------- DASHBOARD STATS ----------
router.get('/stats', (_req, res) => {
  const db = getDb();
  const total = db.prepare('SELECT COUNT(*) as c FROM job_orders WHERE is_archived = 0').get();
  const active = db.prepare("SELECT COUNT(*) as c FROM job_orders WHERE stage != 'Released' AND is_archived = 0").get();
  const inRepair = db.prepare("SELECT COUNT(*) as c FROM job_orders WHERE stage IN ('In Repair','Finishing/Paint') AND is_archived = 0").get();
  const ready = db.prepare("SELECT COUNT(*) as c FROM job_orders WHERE stage = 'Ready for Release' AND is_archived = 0").get();
  const bookingsToday = db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'Pending'").get();

  const stages = ['Received', 'Pre-Inspection', 'Estimate/Approval', 'In Repair', 'Finishing/Paint', 'Final Assessment', 'Ready for Release'];
  const pipeline = {};
  for (const s of stages) {
    const row = db.prepare("SELECT COUNT(*) as c FROM job_orders WHERE stage = ? AND is_archived = 0").get(s);
    pipeline[s] = row.c;
  }

  res.json({
    total: total.c,
    active: active.c,
    in_repair: inRepair.c,
    ready: ready.c,
    bookings_pending: bookingsToday.c,
    pipeline,
  });
});

// Needs attention items
router.get('/attention', (_req, res) => {
  const db = getDb();

  // Jobs missing intake photos
  const missingPhotos = db.prepare(`
    SELECT jo.id, jo.job_no, jo.stage FROM job_orders jo
    LEFT JOIN intake_photos ip ON ip.job_order_id = jo.id
    WHERE jo.stage != 'Released' AND jo.is_archived = 0
    GROUP BY jo.id HAVING COUNT(ip.id) = 0
    LIMIT 5
  `).all();

  // Approvals waiting (Estimate/Approval stage)
  const waitingApproval = db.prepare(`
    SELECT id, job_no, date_received FROM job_orders
    WHERE stage = 'Estimate/Approval' AND is_archived = 0
    ORDER BY date_received ASC LIMIT 5
  `).all();

  // Pending bookings
  const pendingBookings = db.prepare(`
    SELECT id, customer_name, preferred_date FROM bookings
    WHERE status = 'Pending' ORDER BY preferred_date ASC LIMIT 5
  `).all();

  res.json({
    items: [
      ...missingPhotos.map(j => ({ type: 'missing_photos', id: j.id, label: `${j.job_no} — no intake photos`, job_no: j.job_no })),
      ...waitingApproval.map(j => ({ type: 'waiting_approval', id: j.id, label: `${j.job_no} — waiting customer approval`, job_no: j.job_no })),
      ...pendingBookings.map(b => ({ type: 'pending_booking', id: b.id, label: `Booking from ${b.customer_name} on ${b.preferred_date}` })),
    ].slice(0, 5),
  });
});

module.exports = router;
