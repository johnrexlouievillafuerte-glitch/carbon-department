#!/usr/bin/env node

/**
 * Carbon Department — First Admin Account Setup
 *
 * Usage:
 *   ADMIN_USERNAME=admin ADMIN_PASSWORD=yourpassword node setup.js
 *
 * Or run interactively (prompts for credentials).
 */

const readline = require('readline');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const { getDb } = require('./src/db');

async function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('\n  Carbon Department — Initial Setup\n');

  const db = getDb();
  console.log('  Database initialized.\n');

  const existing = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'Admin'").get();
  if (existing.c > 0) {
    console.log('  An admin account already exists. Skipping setup.');
    console.log('  To create additional users, use the admin portal.\n');
    process.exit(0);
  }

  let username = process.env.ADMIN_USERNAME;
  let password = process.env.ADMIN_PASSWORD;
  let displayName = process.env.ADMIN_NAME || '';

  if (!username) username = await prompt('  Admin username: ');
  if (!password) password = await prompt('  Admin password (min 8 chars): ');
  if (!displayName) displayName = await prompt('  Display name: ');

  if (!username || !password) {
    console.error('\n  Error: Username and password are required.\n');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('\n  Error: Password must be at least 8 characters.\n');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);
  const id = uuid();

  db.prepare(`
    INSERT INTO users (id, username, email, password_hash, role, display_name, must_change_password)
    VALUES (?, ?, ?, ?, 'Admin', ?, 1)
  `).run(id, username, '', hash, displayName || username);

  console.log(`\n  Admin account created: ${username}`);
  console.log('  You will be asked to change your password on first login.');
  console.log('\n  Start the server with: pnpm dev:server\n');
}

main().catch(console.error);
