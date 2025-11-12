const Database = require('better-sqlite3');
const path = require('path');

// Create/open database
const dbPath = process.env.DB_PATH || './data/hopkinsconnect.db';
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    major TEXT,
    interests TEXT,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE INDEX IF NOT EXISTS idx_email ON users(email);
`);

console.log('Database initialized at:', dbPath);

module.exports = db;

