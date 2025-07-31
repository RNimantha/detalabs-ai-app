import { type NextRequest, NextResponse } from "next/server"
import { withAdminAuth } from "@/lib/middleware"
import { contactQueries } from "@/lib/database"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  return withAdminAuth(request, async () => {
    try {
      const { status } = await request.json()
      const id = Number.parseInt(params.id)

      if (!["new", "in_progress", "completed"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 })
      }

      contactQueries.updateStatus.run(status, id)

      return NextResponse.json({ message: "Status updated successfully" })
    } catch (error) {
      console.error("Error updating contact status:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return withAdminAuth(request, async () => {
    try {
      const id = Number.parseInt(params.id)
      contactQueries.delete.run(id)

      return NextResponse.json({ message: "Contact deleted successfully" })
    } catch (error) {
      console.error("Error deleting contact:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  })
}
