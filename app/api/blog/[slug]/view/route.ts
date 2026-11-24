import { type NextRequest, NextResponse } from "next/server"
import { supabase, supabaseAdmin } from "@/supabase/server"
import { getBlogBySlug } from "@/lib/blog-db"

// POST - Track a view
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

    // Check if viewed in last 24 hours (to avoid duplicate counts)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    const { data: recentView } = await supabaseAdmin
      .from("blog_views")
      .select("id")
      .eq("blog_id", blog.id)
      .eq("user_ip", clientIp)
      .gte("viewed_at", oneDayAgo)
      .single()

    if (!recentView) {
      // Record the view (use admin client to bypass RLS)
      await supabaseAdmin
        .from("blog_views")
        .insert({
          blog_id: blog.id,
          user_ip: clientIp,
          user_agent: userAgent,
        })

      // Update blog view count
      await supabaseAdmin
        .from("blog_blogs")
        .update({ view_count: (blog.view_count || 0) + 1 })
        .eq("id", blog.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking view:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

