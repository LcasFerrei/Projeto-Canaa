const path = require("path");
const Database = require("better-sqlite3");

const dbPath = path.join(__dirname, "data", "church.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    foto_path TEXT,
    data_nascimento TEXT,
    data_conversao TEXT,
    endereco TEXT,
    casado INTEGER NOT NULL DEFAULT 0,
    conjuge_nome TEXT,
    conjuge_data_nascimento TEXT,
    conjuge_foto_path TEXT,
    tem_filhos INTEGER NOT NULL DEFAULT 0,
    trabalho_igreja INTEGER NOT NULL DEFAULT 0,
    trabalho_descricao TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS children (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    data_nascimento TEXT,
    foto_path TEXT
  );
`);

const memberColumns = db.prepare("PRAGMA table_info(members)").all().map((c) => c.name);
if (!memberColumns.includes("data_conversao")) {
  db.exec("ALTER TABLE members ADD COLUMN data_conversao TEXT");
}

module.exports = db;
