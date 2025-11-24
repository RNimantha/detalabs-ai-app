import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/supabase/server"
import { getBlogBySlug } from "@/lib/blog-db"

// GET - Get comments for a blog
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const blog = await getBlogBySlug(params.slug)
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    const { data: comments, error } = await supabaseAdmin
      .from("blog_comments")
      .select("*")
      .eq("blog_id", blog.id)
      .eq("is_approved", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching comments:", error)
      return NextResponse.json({ comments: [] })
    }

    return NextResponse.json({ comments: comments || [] })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Add a comment
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const blog = await getBlogBySlug(params.slug)
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    const body = await request.json()
    const { author_name, author_email, content } = body

    if (!author_name || !author_email || !content) {
      return NextResponse.json(
        { error: "Name, email, and content are required" },
        { status: 400 }
      )
    }

    // Insert comment (requires admin approval by default)
    // Use admin client to bypass RLS for inserts
    const { data: comment, error } = await supabaseAdmin
      .from("blog_comments")
      .insert({
        blog_id: blog.id,
        author_name,
        author_email,
        content,
        is_approved: false, // Requires admin approval
      })
      .select()
      .single()

    if (error) {
      console.error("Error inserting comment:", error)
      throw error
    }

    return NextResponse.json(
      { 
        comment,
        message: "Comment submitted! It will be visible after admin approval."
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

