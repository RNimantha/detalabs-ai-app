import { type NextRequest, NextResponse } from "next/server"
import { sendNotifications } from "@/lib/notifications"

export async function POST(request: NextRequest) {
  try {
    const testData = {
      name: "Test User",
      email: "test@example.com",
      subject: "Test Notification",
      message: "This is a test notification to verify email and WhatsApp integration.",
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

    const results = await sendNotifications(testData)

    return NextResponse.json({
      message: "Test notifications sent",
      results,
    })
  } catch (error) {
    console.error("Test notification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
