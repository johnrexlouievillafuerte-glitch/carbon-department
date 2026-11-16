const { getDb } = require('./db');
const { v4: uuid } = require('uuid');

function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (req.session.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

function auditLog(req, action, target, details) {
  const db = getDb();
  const user = req.session?.user;
  db.prepare(`
    INSERT INTO audit_log (id, user_id, username, role, action, target, details, ip_address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    uuid(),
    user?.id || '',
    user?.display_name || 'System',
    user?.role || '',
    action,
    target || '',
    details || '',
    req.ip || ''
  );
}

module.exports = { requireAuth, requireAdmin, auditLog };
