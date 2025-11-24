import { supabaseAdmin } from '@/supabase/server'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

export interface AdminAuthUser {
  id: string
  email: string
  name: string
}

export class AdminAuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AdminAuthError'
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex')
}

export async function createAdminSession(adminId: string): Promise<string> {
  const sessionToken = generateSessionToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const { error } = await supabaseAdmin
    .from('blog_admin_sessions')
    .insert({
      admin_id: adminId,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
    })

  if (error) {
    throw new AdminAuthError('Failed to create session')
  }

  return sessionToken
}

export async function validateAdminSession(sessionToken: string): Promise<AdminAuthUser | null> {
  if (!sessionToken) return null

  // Clean up expired sessions
  await supabaseAdmin
    .from('blog_admin_sessions')
    .delete()
    .lt('expires_at', new Date().toISOString())

  const { data: session, error: sessionError } = await supabaseAdmin
    .from('blog_admin_sessions')
    .select('admin_id, blog_admin_users(id, email, name)')
    .eq('session_token', sessionToken)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (sessionError || !session) return null

  const admin = session.blog_admin_users as any
  if (!admin) return null

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
  }
}

export async function deleteAdminSession(sessionToken: string): Promise<void> {
  await supabaseAdmin
    .from('blog_admin_sessions')
    .delete()
    .eq('session_token', sessionToken)
}

export async function authenticateAdmin(email: string, password: string): Promise<AdminAuthUser> {
  const { data: admin, error } = await supabaseAdmin
    .from('blog_admin_users')
    .select('id, email, password, name')
    .eq('email', email)
    .single()

  if (error || !admin) {
    throw new AdminAuthError('Invalid email or password')
  }

  const isValidPassword = await verifyPassword(password, admin.password)
  if (!isValidPassword) {
    throw new AdminAuthError('Invalid email or password')
  }

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
  }
}

