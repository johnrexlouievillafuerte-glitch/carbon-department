const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { getDb } = require('./db');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
getDb();

// Security
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use((req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  next();
});

// CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions (SQLite-backed)
// Simple session store using better-sqlite3 directly
const db = getDb();

class SQLiteStore extends session.Store {
  constructor() {
    super();
    this.db = db;
  }

  get(sid, cb) {
    try {
      const row = this.db.prepare('SELECT sess FROM sessions WHERE sid = ? AND expired > datetime(\'now\')').get(sid);
      if (!row) return cb(null, null);
      cb(null, JSON.parse(row.sess));
    } catch (err) { cb(err); }
  }

  set(sid, sess, cb) {
    try {
      const maxAge = sess.cookie?.maxAge || 28800000; // 8 hours
      const expired = new Date(Date.now() + maxAge).toISOString();
      this.db.prepare(
        'INSERT OR REPLACE INTO sessions (sid, sess, expired) VALUES (?, ?, ?)'
      ).run(sid, JSON.stringify(sess), expired);
      cb?.(null);
    } catch (err) { cb?.(err); }
  }

  destroy(sid, cb) {
    try {
      this.db.prepare('DELETE FROM sessions WHERE sid = ?').run(sid);
      cb?.(null);
    } catch (err) { cb?.(err); }
  }

  // Cleanup expired sessions
  touch(sid, sess, cb) {
    this.set(sid, sess, cb);
  }
}

app.use(session({
  store: new SQLiteStore(),
  name: 'carbon.sid',
  secret: process.env.SESSION_SECRET || 'carbon-department-dev-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 8 * 60 * 60 * 1000, // 8 hours
  },
}));

// Cleanup expired sessions every 30 minutes
setInterval(() => {
  try {
    db.prepare("DELETE FROM sessions WHERE expired < datetime('now')").run();
  } catch (e) { /* ignore */ }
}, 30 * 60 * 1000);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 404 for admin/staff paths on wrong host
app.use('/admin', (_req, res) => res.status(404).json({ error: 'Not found' }));
app.use('/staff', (_req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => {
  console.log(`[Carbon Department] Server running on http://localhost:${PORT}`);
  console.log(`  Public API:  /api/public/*`);
  console.log(`  Admin API:   /api/admin/*`);
  console.log(`  Auth API:    /api/auth/*`);
});
