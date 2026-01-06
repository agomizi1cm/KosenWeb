const DataBase = require('better-sqlite3');
const db = new DataBase('kosenweb.db');

db.prepare(`
    CREATE TABLE IF NOT EXISTS rescheduled_classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        koma INTEGER NOT NULL,
        subject_code TEXT NOT NULL
    )
`).run();

module.exports = db;