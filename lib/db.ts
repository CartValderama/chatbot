// Database connection utility
// This file will handle database connections and queries using SQLite

import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

// Get database instance
export function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'database', 'healthcare_chatbot.db');
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
  }
  return db;
}

// Query helper function that mimics async behavior for compatibility
export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  try {
    const database = getDb();

    // Determine if it's a SELECT query or a modification query
    const isSelect = sql.trim().toUpperCase().startsWith('SELECT');

    if (isSelect) {
      // For SELECT queries, return all rows
      const stmt = database.prepare(sql);
      const results = params ? stmt.all(...params) : stmt.all();
      return results as T;
    } else {
      // For INSERT, UPDATE, DELETE queries
      const stmt = database.prepare(sql);
      const result = params ? stmt.run(...params) : stmt.run();
      return result as T;
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Close database connection
export async function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
