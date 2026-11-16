const express = require('express');
const rateLimit = require('express-rate-limit');
const { v4: uuid } = require('uuid');
const { getDb, generatePin } = require('../db');

const router = express.Router();

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many submissions. Please try again later.' },
});

const trackerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many lookups. Please try again later.' },
});

// Submit a booking request
router.post('/bookings', formLimiter, (req, res) => {
  const {
    customer_name, phone, email, plate_number, make_model, year,
    division, service_requested, preferred_date, preferred_time, notes,
    privacy_consent, _hp // honeypot
  } = req.body;

  // Honeypot check
  if (_hp) return res.status(200).json({ ok: true, ref: 'FAKE' });

  if (!customer_name || !phone || !preferred_date) {
    return res.status(400).json({ error: 'Name, phone, and preferred date are required.' });
  }

  if (!privacy_consent) {
    return res.status(400).json({ error: 'You must agree to the data privacy notice.' });
  }

  // Validate PH phone format (basic)
  const cleanPhone = phone.replace(/[\s-]/g, '');
  if (!/^(09|\+639)\d{9}$/.test(cleanPhone)) {
    return res.status(400).json({ error: 'Please enter a valid Philippine mobile number.' });
  }

  // Block Sundays
  const dayOfWeek = new Date(preferred_date).getDay();
  if (dayOfWeek === 0) {
    return res.status(400).json({ error: 'We are closed on Sundays. Please select another date.' });
  }

  // Block past dates
  const today = new Date().toISOString().split('T')[0];
  if (preferred_date < today) {
    return res.status(400).json({ error: 'Please select a future date.' });
  }

  const id = uuid();
  const pin = generatePin();

  getDb().prepare(`
    INSERT INTO bookings (id, customer_name, phone, email, plate_number, make_model, year, division, service_requested, preferred_date, preferred_time, notes, pin)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, customer_name, cleanPhone, email || '', plate_number || '', make_model || '', year || '', division || '', service_requested || '', preferred_date, preferred_time || '', notes || '', pin);

  // Return reference number and PIN
  const ref = `BK-${new Date().getFullYear()}-${id.slice(0, 4).toUpperCase()}`;
  res.json({ ok: true, ref, pin });
});

// Submit a contact inquiry
router.post('/inquiries', formLimiter, (req, res) => {
  const { name, contact, message, _hp } = req.body;
  if (_hp) return res.status(200).json({ ok: true });

  if (!name || !contact || !message) {
    return res.status(400).json({ error: 'Name, contact, and message are required.' });
  }

  getDb().prepare(
    'INSERT INTO inquiries (id, name, contact, message) VALUES (?,?,?,?)'
  ).run(uuid(), name, contact, message || '');

  res.json({ ok: true });
});

// Repair tracker lookup
router.post('/tracker', trackerLimiter, (req, res) => {
  const { plate_number, job_no, pin } = req.body;
  if (!plate_number || !job_no || !pin) {
    return res.status(400).json({ error: 'Plate number, job order number, and PIN are required.' });
  }

  const cleanPlate = plate_number.toUpperCase().replace(/\s+/g, '');
  const cleanJobNo = job_no.toUpperCase().trim();
  const cleanPin = pin.trim();

  const db = getDb();
  const job = db.prepare(`
    SELECT jo.stage, jo.estimated_release, jo.date_received
    FROM job_orders jo
    JOIN vehicles v ON v.id = jo.vehicle_id
    JOIN bookings b ON REPLACE(UPPER(b.plate_number), ' ', '') = REPLACE(UPPER(v.plate_number), ' ', '')
    WHERE REPLACE(UPPER(v.plate_number), ' ', '') = ? AND UPPER(jo.job_no) = ? AND b.pin = ?
    LIMIT 1
  `).get(cleanPlate, cleanJobNo, cleanPin);

  if (!job) {
    return res.status(404).json({ error: 'No matching record found. Please check your details.' });
  }

  const STAGE_PROGRESS = {
    'Received': 12, 'Pre-Inspection': 25, 'Estimate/Approval': 40,
    'In Repair': 65, 'Finishing/Paint': 82, 'Final Assessment': 94,
    'Ready for Release': 100, 'Released': 100,
  };

  res.json({
    stage: job.stage,
    progress: STAGE_PROGRESS[job.stage] || 0,
    estimated_release: job.estimated_release,
    date_received: job.date_received,
  });
});

module.exports = router;
