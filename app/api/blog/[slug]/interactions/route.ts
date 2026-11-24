import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/supabase/server"
import { getBlogBySlug } from "@/lib/blog-db"

// GET - Get interactions (likes, comments, views) for a blog
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const blog = await getBlogBySlug((await params).slug)
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Get likes count (use admin client to bypass RLS)
    const { count: likesCount } = await supabaseAdmin
      .from("blog_likes")
      .select("*", { count: "exact", head: true })
      .eq("blog_id", blog.id)

    // Get approved comments (use admin client to bypass RLS)
    const { data: comments } = await supabaseAdmin
      .from("blog_comments")
      .select("*")
      .eq("blog_id", blog.id)
      .eq("is_approved", true)
      .order("created_at", { ascending: false })

    // Get view count from blog table
    const viewCount = blog.view_count || 0

    // Check if user has liked (by IP)
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0] || 
                     request.headers.get("x-real-ip") || 
                     "unknown"
    
    const { data: userLike } = await supabaseAdmin
      .from("blog_likes")
      .select("id")
      .eq("blog_id", blog.id)
      .eq("user_ip", clientIp)
      .single()

    return NextResponse.json({
      likes: likesCount || 0,
      comments: comments || [],
      commentsCount: comments?.length || 0,
      views: viewCount,
      userLiked: !!userLike,
    })
  } catch (error) {
    console.error("Error fetching interactions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Like a blog
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const blog = await getBlogBySlug((await params).slug)
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0] || 
                     request.headers.get("x-real-ip") || 
                     "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Check if already liked (use admin client)
    const { data: existingLike } = await supabaseAdmin
      .from("blog_likes")
      .select("id")
      .eq("blog_id", blog.id)
      .eq("user_ip", clientIp)
      .single()

    if (existingLike) {
      // Unlike - remove the like
      await supabaseAdmin
        .from("blog_likes")
        .delete()
        .eq("id", existingLike.id)

      // Update blog like count
      await supabaseAdmin
        .from("blog_blogs")
        .update({ like_count: (blog.like_count || 0) - 1 })
        .eq("id", blog.id)

      return NextResponse.json({ liked: false, message: "Unliked" })
    } else {
      // Like - add the like (use admin client)
      await supabaseAdmin
        .from("blog_likes")
        .insert({
          blog_id: blog.id,
          user_ip: clientIp,
          user_agent: userAgent,
        })

      // Update blog like count
      await supabaseAdmin
        .from("blog_blogs")
        .update({ like_count: (blog.like_count || 0) + 1 })
        .eq("id", blog.id)

      return NextResponse.json({ liked: true, message: "Liked" })
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

