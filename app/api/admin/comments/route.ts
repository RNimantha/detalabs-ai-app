import { type NextRequest, NextResponse } from "next/server"
import { validateAdminSession } from "@/lib/admin-auth"
import { supabaseAdmin } from "@/supabase/server"

// GET - Get all comments (admin only)
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

    const { data: comments, error } = await supabaseAdmin
      .from("blog_comments")
      .select(`
        *,
        blog_blogs (
          id,
          slug,
          title
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ comments: comments || [] })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

