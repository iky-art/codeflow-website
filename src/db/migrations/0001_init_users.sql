-- Phase 1: hanya tabel users untuk validasi setup D1.
-- Tabel lain (courses, chat_sessions, dll) akan ditambahkan lewat
-- migration bernomor berikutnya sesuai phase masing-masing.

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,               -- UUID v4
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER', -- USER | ADMIN
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
