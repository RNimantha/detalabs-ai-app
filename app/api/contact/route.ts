import { type NextRequest, NextResponse } from "next/server"
import { contactQueries } from "@/lib/database"
import { sendNotifications } from "@/lib/notifications"
import type { ContactFormData } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()

    // Validate required fields
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Save to database
    const result = await contactQueries.create(name, email, subject, message)
    const submissionId = result.id

    console.log("Contact form submission saved:", {
      id: submissionId,
      name,
      email,
      subject,
      timestamp: new Date().toISOString(),
    })

    // Send notifications
    const notificationData = {
      name,
      email,
      subject,
      message,
      submittedAt: new Date().toLocaleString("en-US", {
        timeZone: "Africa/Nairobi",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }

    // Send notifications asynchronously (don't wait for them to complete)
    sendNotifications(notificationData)
      .then((results) => {
        console.log("Notification results:", results)
      })
      .catch((error) => {
        console.error("Error sending notifications:", error)
      })

    return NextResponse.json(
      {
        message: "Message sent successfully",
        id: submissionId,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
