import { type NextRequest, NextResponse } from "next/server"
import { withAdminAuth } from "@/lib/middleware"
import { contactQueries } from "@/lib/database"

export async function GET(request: NextRequest) {
  return withAdminAuth(request, async () => {
    try {
      console.log("Admin contacts API called")

      const contacts = await contactQueries.findAll()
      console.log("Found contacts:", contacts.length)

      const stats = await contactQueries.getStats()
      console.log("Stats:", stats)

      return NextResponse.json({
        contacts,
        stats,
      })
    } catch (error) {
      console.error("Error fetching contacts:", error)
      return NextResponse.json(
        {
          error: "Internal server error",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  })
}
