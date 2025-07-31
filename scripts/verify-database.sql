const Database = require("better-sqlite3")
const path = require("path")

const dbPath = path.join(process.cwd(), "database.sqlite")
console.log("Database path:", dbPath)

try {
  const db = new Database(dbPath)

  // Check if database file exists and is accessible
  console.log("Database connected successfully")

  // Check tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
  console.log(
    "Tables:",
    tables.map((t) => t.name),
  )

  // Check contact submissions
  const contactCount = db.prepare("SELECT COUNT(*) as count FROM contact_submissions").get()
  console.log("Contact submissions count:", contactCount.count)

  if (contactCount.count > 0) {
    const contacts = db.prepare("SELECT * FROM contact_submissions LIMIT 3").all()
    console.log("Sample contacts:", contacts)
  }

  // Check users
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get()
  console.log("Users count:", userCount.count)

  const users = db.prepare("SELECT email, role FROM users").all()
  console.log("Users:", users)

  db.close()
} catch (error) {
  console.error("Database error:", error)
}
