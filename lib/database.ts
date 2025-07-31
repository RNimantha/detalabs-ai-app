import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

const dbPath = path.join(process.cwd(), "database.sqlite")

// Initialize database
export const db = new Database(dbPath)

// Enable foreign keys
db.pragma("foreign_keys = ON")

// Initialize database schema
export function initializeDatabase() {
  try {
    const schemaPath = path.join(process.cwd(), "scripts", "init-database.sql")
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, "utf8")
      db.exec(schema)
      console.log("Database initialized successfully")
    }
  } catch (error) {
    console.error("Error initializing database:", error)
  }
}

// Initialize on import
initializeDatabase()

export interface User {
  id: number
  email: string
  password: string
  name: string
  role: "admin" | "user"
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: number
  name: string
  email: string
  subject: string
  message: string
  status: "new" | "in_progress" | "completed"
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  user_id: number
  expires_at: string
  created_at: string
}

// User queries
export const userQueries = {
  findByEmail: db.prepare("SELECT * FROM users WHERE email = ?"),
  findById: db.prepare("SELECT * FROM users WHERE id = ?"),
  create: db.prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)"),
  updateLastLogin: db.prepare("UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?"),
}

// Contact submission queries
export const contactQueries = {
  create: db.prepare("INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)"),
  findAll: db.prepare("SELECT * FROM contact_submissions ORDER BY created_at DESC"),
  findById: db.prepare("SELECT * FROM contact_submissions WHERE id = ?"),
  updateStatus: db.prepare("UPDATE contact_submissions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"),
  delete: db.prepare("DELETE FROM contact_submissions WHERE id = ?"),
  getStats: db.prepare(`
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN status = 'new' THEN 1 END) as new_count,
      COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_count,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count
    FROM contact_submissions
  `),
}

// Session queries
export const sessionQueries = {
  create: db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)"),
  findById: db.prepare("SELECT * FROM sessions WHERE id = ?"),
  delete: db.prepare("DELETE FROM sessions WHERE id = ?"),
  deleteExpired: db.prepare("DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP"),
  deleteByUserId: db.prepare("DELETE FROM sessions WHERE user_id = ?"),
}
