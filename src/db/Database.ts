import Database from '@tauri-apps/plugin-sql';

let db: Database;

export async function getDb(): Promise<Database> {
  if (!db) {
    db = await Database.load('sqlite:widget.db');
    await db.execute("PRAGMA foreign_keys = ON;");
  }
  return db;
}
