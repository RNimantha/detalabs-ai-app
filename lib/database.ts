import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

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

// Initialize database schema
export async function initializeDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create contact_submissions table
    await sql`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `

    // Insert default admin user (password: admin123)
    await sql`
      INSERT INTO users (email, password, name, role) 
      VALUES ('admin@detalabsai.com', '$2b$10$rOzJqQqQqQqQqQqQqQgQgOzJqQqQqQgQgQgQgQgQgOzJqQqQgQgQqu', 'Admin User', 'admin')
      ON CONFLICT (email) DO NOTHING
    `

    // Insert sample contact submissions
    await sql`
      INSERT INTO contact_submissions (name, email, subject, message, status) 
      SELECT * FROM (VALUES
        ('John Doe', 'john@example.com', 'AI Consultation Request', 'I would like to discuss implementing AI solutions for my e-commerce business.', 'new'),
        ('Sarah Smith', 'sarah@company.com', 'Data Analytics Project', 'We need help with analyzing our customer data to improve retention rates.', 'in_progress'),
        ('Mike Johnson', 'mike@startup.com', 'ML Model Development', 'Looking for assistance in developing a recommendation system for our platform.', 'completed')
      ) AS v(name, email, subject, message, status)
      WHERE NOT EXISTS (SELECT 1 FROM contact_submissions LIMIT 1)
    `

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Error initializing database:", error)
  }
}

// User queries
export const userQueries = {
  findByEmail: async (email: string) => {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`
    return result[0] as User | undefined
  },

  findById: async (id: number) => {
    const result = await sql`SELECT * FROM users WHERE id = ${id}`
    return result[0] as User | undefined
  },

  create: async (email: string, password: string, name: string, role = "user") => {
    const result = await sql`
      INSERT INTO users (email, password, name, role) 
      VALUES (${email}, ${password}, ${name}, ${role})
      RETURNING id
    `
    return result[0]
  },

  updateLastLogin: async (id: number) => {
    await sql`UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`
  },
}

// Contact submission queries
export const contactQueries = {
  create: async (name: string, email: string, subject: string, message: string) => {
    const result = await sql`
      INSERT INTO contact_submissions (name, email, subject, message) 
      VALUES (${name}, ${email}, ${subject}, ${message})
      RETURNING id
    `
    return result[0]
  },

  findAll: async () => {
    return (await sql`SELECT * FROM contact_submissions ORDER BY created_at DESC`) as ContactSubmission[]
  },

  findById: async (id: number) => {
    const result = await sql`SELECT * FROM contact_submissions WHERE id = ${id}`
    return result[0] as ContactSubmission | undefined
  },

  updateStatus: async (id: number, status: string) => {
    await sql`
      UPDATE contact_submissions 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${id}
    `
  },

  delete: async (id: number) => {
    await sql`DELETE FROM contact_submissions WHERE id = ${id}`
  },

  getStats: async () => {
    const result = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'new' THEN 1 END) as new_count,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_count,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count
      FROM contact_submissions
    `
    return result[0]
  },
}

// Session queries
export const sessionQueries = {
  create: async (id: string, userId: number, expiresAt: string) => {
    await sql`
      INSERT INTO sessions (id, user_id, expires_at) 
      VALUES (${id}, ${userId}, ${expiresAt})
    `
  },

  findById: async (id: string) => {
    const result = await sql`SELECT * FROM sessions WHERE id = ${id}`
    return result[0] as Session | undefined
  },

  delete: async (id: string) => {
    await sql`DELETE FROM sessions WHERE id = ${id}`
  },

  deleteExpired: async () => {
    await sql`DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP`
  },

  deleteByUserId: async (userId: number) => {
    await sql`DELETE FROM sessions WHERE user_id = ${userId}`
  },
}
