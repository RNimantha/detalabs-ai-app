import { type NextRequest, NextResponse } from "next/server"
import { validateAdminSession } from "@/lib/admin-auth"

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("admin_session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = await validateAdminSession(sessionToken)
    if (!admin) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    return NextResponse.json({ admin })
  } catch (error) {
    console.error("Error validating admin session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

