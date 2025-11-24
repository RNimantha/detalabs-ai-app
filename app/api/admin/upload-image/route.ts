import { type NextRequest, NextResponse } from "next/server"
import { validateAdminSession } from "@/lib/admin-auth"
import { supabaseAdmin } from "@/supabase/server"

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

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    const filePath = `blog-images/${filename}`

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from("blog-images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error("Error uploading to Supabase:", error)
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      )
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("blog-images").getPublicUrl(filePath)

    return NextResponse.json({
      url: publicUrl,
      path: filePath,
    })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

