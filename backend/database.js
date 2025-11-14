const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let db = null;
const dbPath = process.env.DB_PATH || './data/hopkinsconnect.db';

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

async function initDatabase() {
  const SQL = await initSqlJs();
  
  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  // Create tables
  db.run(`
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
  `);
  
  db.run(`CREATE INDEX IF NOT EXISTS idx_email ON users(email);`);
  
  // Create posts table for message board
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
  
  console.log('Database initialized at:', dbPath);
  
  return db;
}

// Save database to file
function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

// Wrapper functions for compatibility
const dbWrapper = {
  prepare: (sql) => {
    return {
      run: (...params) => {
        const result = db.run(sql, params);
        saveDatabase();
        return { lastInsertRowid: db.exec("SELECT last_insert_rowid()")[0].values[0][0] };
      },
      get: (...params) => {
        const result = db.exec(sql, params);
        if (result.length === 0 || result[0].values.length === 0) return null;
        
        const columns = result[0].columns;
        const values = result[0].values[0];
        const obj = {};
        columns.forEach((col, i) => {
          obj[col] = values[i];
        });
        return obj;
      },
      all: (...params) => {
        const result = db.exec(sql, params);
        if (result.length === 0) return [];
        
        const columns = result[0].columns;
        const rows = result[0].values;
        return rows.map(values => {
          const obj = {};
          columns.forEach((col, i) => {
            obj[col] = values[i];
          });
          return obj;
        });
      }
    };
  }
};

module.exports = { initDatabase, getDb: () => dbWrapper, saveDatabase };
