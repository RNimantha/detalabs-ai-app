import { type NextRequest, NextResponse } from "next/server"
import { getPublicBlogs } from "@/lib/blog-db"

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const posts = await getPublicBlogs()

    const formattedPosts = posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      author: post.author,
      excerpt: post.excerpt || "",
      content: post.content,
      image: post.image || undefined,
      keywords: post.keywords || [],
      isPublic: post.is_public,
    }))

    return NextResponse.json({
      posts: formattedPosts,
      isAuthenticated: false,
      totalPosts: formattedPosts.length,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
