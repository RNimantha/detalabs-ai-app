import { type NextRequest, NextResponse } from "next/server"
import { validateSession } from "./auth"

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: any) => Promise<NextResponse>,
) {
  const sessionId = request.cookies.get("session")?.value

  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await validateSession(sessionId)
  if (!user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 })
  }

  return handler(request, user)
}

export async function withAdminAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: any) => Promise<NextResponse>,
) {
  return withAuth(request, async (req, user) => {
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }
    return handler(req, user)
  })
}
