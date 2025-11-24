"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Trash2, MessageCircle } from "lucide-react"
import type { BlogComment } from "@/supabase/types"

interface CommentWithBlog extends BlogComment {
  blog_blogs: {
    id: string
    slug: string
    title: string
  } | null
}

export default function AdminComments() {
  const router = useRouter()
  const [comments, setComments] = useState<CommentWithBlog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all")

  useEffect(() => {
    checkAuth()
    fetchComments()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/me")
      if (!response.ok) {
        router.push("/admin/login")
      }
    } catch (error) {
      router.push("/admin/login")
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch("/api/admin/comments")
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: true }),
      })

      if (response.ok) {
        fetchComments()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to approve comment")
      }
    } catch (error) {
      console.error("Error approving comment:", error)
      alert("Failed to approve comment")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment permanently?")) return

    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchComments()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to delete comment")
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
      alert("Failed to delete comment")
    }
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  const filteredComments = comments.filter((comment) => {
    if (filter === "pending") return !comment.is_approved
    if (filter === "approved") return comment.is_approved
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading comments...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Comment Management</h1>
            <div className="flex items-center space-x-3">
              <Button href="/admin/uploader" variant="outline" size="sm">
                Blog Uploader
              </Button>
              <Button href="/" variant="outline" size="sm">
                View Site
              </Button>
              <Button onClick={handleLogout} variant="secondary" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({comments.length})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("pending")}
            className={filter === "pending" ? "bg-orange-600 hover:bg-orange-700" : ""}
          >
            Pending ({comments.filter((c) => !c.is_approved).length})
          </Button>
          <Button
            variant={filter === "approved" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("approved")}
            className={filter === "approved" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            Approved ({comments.filter((c) => c.is_approved).length})
          </Button>
        </div>

        {/* Comments List */}
        {filteredComments.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No comments found</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <Card key={comment.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{comment.author_name}</h3>
                      <span className="text-sm text-gray-500">{comment.author_email}</span>
                      {comment.is_approved ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Approved
                        </span>
                      ) : (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                          Pending
                        </span>
                      )}
                    </div>
                    {comment.blog_blogs && (
                      <p className="text-sm text-blue-600 mb-2">
                        On:{" "}
                        <Link
                          href={`/blog/${comment.blog_blogs.slug}`}
                          target="_blank"
                          className="hover:underline"
                        >
                          {comment.blog_blogs.title}
                        </Link>
                      </p>
                    )}
                    <p className="text-gray-700 mb-3 whitespace-pre-wrap">{comment.content}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!comment.is_approved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(comment.id)}
                        className="text-green-600 hover:bg-green-50 border-green-300"
                        title="Approve comment"
                      >
                        <Check className="h-5 w-5" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-600 hover:bg-red-50 border-red-300"
                      title="Delete comment"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

