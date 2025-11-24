import { type NextRequest, NextResponse } from "next/server"
import { deleteAdminSession } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("admin_session")?.value

    if (sessionToken) {
      await deleteAdminSession(sessionToken)
    }

    const response = NextResponse.json({ message: "Logged out successfully" })
    response.cookies.delete("admin_session")

    return response
  } catch (error) {
    console.error("Error logging out:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

