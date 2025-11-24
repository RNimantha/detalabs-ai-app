import { type NextRequest, NextResponse } from "next/server"
import { validateAdminSession } from "@/lib/admin-auth"
import { supabaseAdmin } from "@/supabase/server"

// PUT - Approve or reject a comment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionToken = request.cookies.get("admin_session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = await validateAdminSession(sessionToken)
    if (!admin) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const body = await request.json()
    const { is_approved } = body

    const { data: comment, error } = await supabaseAdmin
      .from("blog_comments")
      .update({ is_approved: is_approved === true })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ comment })
  } catch (error: any) {
    console.error("Error updating comment:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionToken = request.cookies.get("admin_session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = await validateAdminSession(sessionToken)
    if (!admin) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    await supabaseAdmin
      .from("blog_comments")
      .delete()
      .eq("id", params.id)

    return NextResponse.json({ message: "Comment deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting comment:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

