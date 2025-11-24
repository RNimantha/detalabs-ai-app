import { type NextRequest, NextResponse } from "next/server"
import { createContactSubmission } from "@/lib/contact-db"
import { sendNotifications } from "@/lib/notifications"
import type { ContactFormData } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()

    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const result = await createContactSubmission(name, email, subject, message)
    const submissionId = result.id
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

    sendNotifications(notificationData).catch((error) => {
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
