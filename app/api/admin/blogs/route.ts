import { type NextRequest, NextResponse } from "next/server"
import { validateAdminSession } from "@/lib/admin-auth"
import { getAllBlogs, createBlog } from "@/lib/blog-db"
import type { CreateBlogInput } from "@/supabase/types"

// GET - Get all blogs (admin only)
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

    const blogs = await getAllBlogs()
    return NextResponse.json({ blogs })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new blog (admin only)
export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("admin_session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = await validateAdminSession(sessionToken)
    if (!admin) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const body: CreateBlogInput = await request.json()

    // Validate required fields
    if (!body.title || !body.content || !body.author || !body.date) {
      return NextResponse.json(
        { error: "Title, content, author, and date are required" },
        { status: 400 }
      )
    }

    const blog = await createBlog(body)
    return NextResponse.json({ blog }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating blog:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

