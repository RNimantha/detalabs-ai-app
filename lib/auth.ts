import bcrypt from "bcryptjs"
import { randomBytes } from "crypto"
import { userQueries, sessionQueries, type User } from "./database"

export interface AuthUser {
  id: number
  email: string
  name: string
  role: "admin" | "user"
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthError"
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateSessionId(): string {
  return randomBytes(32).toString("hex")
}

export async function createSession(userId: number): Promise<string> {
  const sessionId = generateSessionId()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  sessionQueries.create.run(sessionId, userId, expiresAt.toISOString())
  return sessionId
}

export async function validateSession(sessionId: string): Promise<AuthUser | null> {
  if (!sessionId) return null

  // Clean up expired sessions
  sessionQueries.deleteExpired.run()

  const session = sessionQueries.findById.get(sessionId)
  if (!session) return null

  const user = userQueries.findById.get(session.user_id) as User
  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  sessionQueries.delete.run(sessionId)
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser> {
  const user = userQueries.findByEmail.get(email) as User
  if (!user) {
    throw new AuthError("Invalid email or password")
  }

  const isValidPassword = await verifyPassword(password, user.password)
  if (!isValidPassword) {
    throw new AuthError("Invalid email or password")
  }

  userQueries.updateLastLogin.run(user.id)

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }
}

export async function registerUser(email: string, password: string, name: string): Promise<AuthUser> {
  const existingUser = userQueries.findByEmail.get(email)
  if (existingUser) {
    throw new AuthError("User with this email already exists")
  }

  const hashedPassword = await hashPassword(password)
  const result = userQueries.create.run(email, hashedPassword, name, "user")

  return {
    id: result.lastInsertRowid as number,
    email,
    name,
    role: "user",
  }
}
