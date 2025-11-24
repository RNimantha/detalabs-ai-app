import { type NextRequest, NextResponse } from "next/server"
import { authenticateAdmin, createAdminSession, AdminAuthError } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const admin = await authenticateAdmin(email, password)
    const sessionToken = await createAdminSession(admin.id)

    const response = NextResponse.json({
      message: "Login successful",
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    })

    // Set session cookie
    response.cookies.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

