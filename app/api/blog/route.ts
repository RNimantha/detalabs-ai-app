import { type NextRequest, NextResponse } from "next/server"
import { getPublicBlogs } from "@/lib/blog-db"

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
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
