"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, Trash2, MessageCircle, ArrowLeft, Filter, X, Eye, ExternalLink } from "lucide-react"
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
  const [selectedComment, setSelectedComment] = useState<CommentWithBlog | null>(null)

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

  const stats = {
    total: comments.length,
    pending: comments.filter((c) => !c.is_approved).length,
    approved: comments.filter((c) => c.is_approved).length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-xl text-white">Loading comments...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Link href="/admin/uploader">
                <Button variant="outline" size="sm" className="bg-slate-800/50 border-white/10 text-white hover:bg-slate-700/50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Blog Uploader
                </Button>
              </Link>
              <Link href="/admin/contacts">
                <Button variant="outline" size="sm" className="bg-slate-800/50 border-white/10 text-white hover:bg-slate-700/50">
                  Contact Queries
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-white">Comment Management</h1>
            <p className="text-gray-400 mt-1">Review and manage blog comments</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button href="/" variant="outline" size="sm" className="bg-slate-800/50 border-white/10 text-white hover:bg-slate-700/50">
              View Site
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm" className="bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30">
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-4">
            <div className="text-sm text-gray-400">Total</div>
            <div className="text-2xl font-bold text-white mt-1">{stats.total}</div>
          </Card>
          <Card className="bg-slate-900/60 backdrop-blur-xl border border-orange-500/50 p-4">
            <div className="text-sm text-orange-400">Pending</div>
            <div className="text-2xl font-bold text-orange-400 mt-1">{stats.pending}</div>
          </Card>
          <Card className="bg-slate-900/60 backdrop-blur-xl border border-green-500/50 p-4">
            <div className="text-sm text-green-400">Approved</div>
            <div className="text-2xl font-bold text-green-400 mt-1">{stats.approved}</div>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-cyan-500 hover:bg-cyan-600" : "bg-slate-800/50 border-white/10 text-white"}
          >
            <Filter className="h-4 w-4 mr-2" />
            All ({stats.total})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("pending")}
            className={filter === "pending" ? "bg-orange-500 hover:bg-orange-600" : "bg-slate-800/50 border-white/10 text-white"}
          >
            Pending ({stats.pending})
          </Button>
          <Button
            variant={filter === "approved" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("approved")}
            className={filter === "approved" ? "bg-green-500 hover:bg-green-600" : "bg-slate-800/50 border-white/10 text-white"}
          >
            Approved ({stats.approved})
          </Button>
        </div>

        {/* Comments Table */}
        <Card className="bg-slate-900/60 backdrop-blur-xl border border-white/10 overflow-hidden">
          {filteredComments.length === 0 ? (
            <div className="p-12 text-center">
              <MessageCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No comments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Blog Post</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Comment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredComments.map((comment) => (
                    <tr
                      key={comment.id}
                      className="bg-slate-900/30 hover:bg-slate-800/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedComment(comment)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{comment.author_name}</div>
                        <div className="text-xs text-cyan-400">{comment.author_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        {comment.blog_blogs ? (
                          <Link
                            href={`/blog/${comment.blog_blogs.slug}`}
                            target="_blank"
                            className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {comment.blog_blogs.title}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-500">Unknown</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300 max-w-md truncate">
                          {comment.content}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {comment.is_approved ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/50">
                            Approved
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/50">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">
                          {new Date(comment.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedComment(comment)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!comment.is_approved && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleApprove(comment.id)
                              }}
                              className="text-green-400 hover:text-green-300 hover:bg-green-500/20"
                              title="Approve comment"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(comment.id)
                            }}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            title="Delete comment"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Detail Modal */}
        <Dialog open={!!selectedComment} onOpenChange={(open) => !open && setSelectedComment(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-white/20">
            {selectedComment && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-white flex items-center justify-between">
                    <span>Comment Details</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedComment(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Author Name</label>
                      <p className="text-white font-medium">{selectedComment.author_name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Email</label>
                      <p className="text-cyan-400 break-all">{selectedComment.author_email}</p>
                    </div>
                  </div>
                  {selectedComment.blog_blogs && (
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Blog Post</label>
                      <Link
                        href={`/blog/${selectedComment.blog_blogs.slug}`}
                        target="_blank"
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2"
                      >
                        {selectedComment.blog_blogs.title}
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Comment</label>
                    <div className="text-white whitespace-pre-wrap bg-slate-800/50 p-4 rounded-lg border border-white/10 max-h-64 overflow-y-auto">
                      {selectedComment.content}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Submitted</label>
                    <p className="text-gray-300">
                      {new Date(selectedComment.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <label className="text-sm text-gray-400 mb-3 block">Actions</label>
                    <div className="flex gap-3">
                      {!selectedComment.is_approved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            handleApprove(selectedComment.id)
                            setSelectedComment(null)
                          }}
                          className="bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve Comment
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          handleDelete(selectedComment.id)
                          setSelectedComment(null)
                        }}
                        className="bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

