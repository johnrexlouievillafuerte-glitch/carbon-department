const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = path.join(__dirname, '..', '..', '..', 'data', 'carbon.db');
const UPLOADS_DIR = path.join(__dirname, '..', '..', '..', 'uploads');

let db;

function getDb() {
  if (!db) {
    db = new DatabaseSync(DB_PATH);
    db.exec('PRAGMA journal_mode = WAL;');
    db.exec('PRAGMA foreign_keys = ON;');
    initTables();
  }
  return db;
}

function initTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('Admin','Staff')),
      display_name TEXT NOT NULL,
      must_change_password INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT DEFAULT '',
      address TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL REFERENCES customers(id),
      plate_number TEXT NOT NULL,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year TEXT DEFAULT '',
      color TEXT DEFAULT '',
      body_type TEXT DEFAULT '',
      vin TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS job_orders (
      id TEXT PRIMARY KEY,
      job_no TEXT UNIQUE NOT NULL,
      customer_id TEXT NOT NULL REFERENCES customers(id),
      vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
      division TEXT NOT NULL,
      services TEXT DEFAULT '[]',
      customer_concern TEXT DEFAULT '',
      stage TEXT DEFAULT 'Received',
      assigned_technicians TEXT DEFAULT '[]',
      intake_checklist TEXT DEFAULT '{}',
      intake_notes TEXT DEFAULT '',
      date_received TEXT DEFAULT (date('now')),
      estimated_release TEXT DEFAULT '',
      released_at TEXT,
      is_archived INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS intake_photos (
      id TEXT PRIMARY KEY,
      job_order_id TEXT NOT NULL REFERENCES job_orders(id),
      vehicle_id TEXT NOT NULL,
      customer_id TEXT NOT NULL,
      angle TEXT NOT NULL,
      label TEXT DEFAULT '',
      file_path TEXT NOT NULL,
      caption TEXT DEFAULT '',
      has_damage INTEGER DEFAULT 0,
      uploaded_by TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS progress_logs (
      id TEXT PRIMARY KEY,
      job_order_id TEXT NOT NULL REFERENCES job_orders(id),
      stage TEXT NOT NULL,
      note TEXT DEFAULT '',
      technician TEXT DEFAULT '',
      photo_path TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT DEFAULT '',
      plate_number TEXT DEFAULT '',
      make_model TEXT DEFAULT '',
      year TEXT DEFAULT '',
      division TEXT DEFAULT '',
      service_requested TEXT DEFAULT '',
      preferred_date TEXT NOT NULL,
      preferred_time TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending','Approved','Rescheduled','Declined','Converted')),
      pin TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      job_order_id TEXT,
      job_no TEXT DEFAULT '',
      plate_number TEXT DEFAULT '',
      customer_name TEXT DEFAULT '',
      title TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      file_path TEXT NOT NULL,
      file_size_kb INTEGER DEFAULT 0,
      archived_by TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      username TEXT NOT NULL,
      role TEXT DEFAULT '',
      action TEXT NOT NULL,
      target TEXT DEFAULT '',
      details TEXT DEFAULT '',
      ip_address TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      contact TEXT NOT NULL,
      message TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      sid TEXT PRIMARY KEY,
      sess TEXT NOT NULL,
      expired TEXT NOT NULL
    );
  `);
}

function generateJobNo() {
  const year = new Date().getFullYear();
  const row = db.prepare(
    `SELECT job_no FROM job_orders WHERE job_no LIKE ? ORDER BY job_no DESC LIMIT 1`
  ).get(`CD-${year}-%`);

  let seq = 1;
  if (row) {
    const parts = row.job_no.split('-');
    seq = parseInt(parts[2], 10) + 1;
  }
  return `CD-${year}-${String(seq).padStart(4, '0')}`;
}

function generatePin() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

module.exports = { getDb, UPLOADS_DIR, generateJobNo, generatePin };
