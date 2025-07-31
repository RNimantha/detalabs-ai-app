import { type NextRequest, NextResponse } from "next/server"
import { getPublicBlogPosts, getAllBlogPosts } from "@/lib/blog"
import { validateSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session")?.value
    let isAuthenticated = false

    if (sessionId) {
      const user = await validateSession(sessionId)
      isAuthenticated = !!user
    }

    const posts = isAuthenticated ? getAllBlogPosts() : getPublicBlogPosts()

    return NextResponse.json({
      posts,
      isAuthenticated,
      totalPosts: getAllBlogPosts().length,
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
