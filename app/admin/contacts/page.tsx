"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Mail,
  Trash2,
  Eye,
  Archive,
  CheckCircle,
  Clock,
  MessageSquare,
  ArrowLeft,
  Filter,
  X,
} from "lucide-react"
import type { ContactSubmission } from "@/lib/contact-db"

export default function AdminContacts() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    archived: 0,
  })
  const [filter, setFilter] = useState<"all" | "new" | "read" | "replied" | "archived">("all")
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)

  useEffect(() => {
    checkAuth()
    fetchSubmissions()
    fetchStats()
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

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/admin/contacts")
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data || [])
      }
    } catch (error) {
      console.error("Error fetching contact submissions:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/contacts?stats=true")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleStatusUpdate = async (id: string, status: "new" | "read" | "replied" | "archived") => {
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchSubmissions()
        fetchStats()
        if (selectedSubmission?.id === id) {
          setSelectedSubmission({ ...selectedSubmission, status })
        }
      } else {
        const data = await response.json()
        alert(data.error || "Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update status")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission permanently?")) return

    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchSubmissions()
        fetchStats()
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(null)
        }
      } else {
        const data = await response.json()
        alert(data.error || "Failed to delete submission")
      }
    } catch (error) {
      console.error("Error deleting submission:", error)
      alert("Failed to delete submission")
    }
  }

  const filteredSubmissions = submissions.filter((submission) => {
    if (filter === "all") return true
    return submission.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
      case "read":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      case "replied":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "archived":
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Clock className="h-4 w-4" />
      case "read":
        return <Eye className="h-4 w-4" />
      case "replied":
        return <CheckCircle className="h-4 w-4" />
      case "archived":
        return <Archive className="h-4 w-4" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-white text-xl">Loading...</div>
          </div>
        </div>
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
              <Link href="/admin/comments">
                <Button variant="outline" size="sm" className="bg-slate-800/50 border-white/10 text-white hover:bg-slate-700/50">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Comments
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-white">Contact Queries</h1>
            <p className="text-gray-400 mt-1">Manage contact form submissions</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <Card className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-4">
            <div className="text-sm text-gray-400">Total</div>
            <div className="text-2xl font-bold text-white mt-1">{stats.total}</div>
          </Card>
          <Card className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/50 p-4">
            <div className="text-sm text-cyan-400">New</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">{stats.new}</div>
          </Card>
          <Card className="bg-slate-900/60 backdrop-blur-xl border border-blue-500/50 p-4">
            <div className="text-sm text-blue-400">Read</div>
            <div className="text-2xl font-bold text-blue-400 mt-1">{stats.read}</div>
          </Card>
          <Card className="bg-slate-900/60 backdrop-blur-xl border border-green-500/50 p-4">
            <div className="text-sm text-green-400">Replied</div>
            <div className="text-2xl font-bold text-green-400 mt-1">{stats.replied}</div>
          </Card>
          <Card className="bg-slate-900/60 backdrop-blur-xl border border-gray-500/50 p-4">
            <div className="text-sm text-gray-400">Archived</div>
            <div className="text-2xl font-bold text-gray-400 mt-1">{stats.archived}</div>
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
            All ({submissions.length})
          </Button>
          <Button
            variant={filter === "new" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("new")}
            className={filter === "new" ? "bg-cyan-500 hover:bg-cyan-600" : "bg-slate-800/50 border-white/10 text-white"}
          >
            New ({stats.new})
          </Button>
          <Button
            variant={filter === "read" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("read")}
            className={filter === "read" ? "bg-blue-500 hover:bg-blue-600" : "bg-slate-800/50 border-white/10 text-white"}
          >
            Read ({stats.read})
          </Button>
          <Button
            variant={filter === "replied" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("replied")}
            className={filter === "replied" ? "bg-green-500 hover:bg-green-600" : "bg-slate-800/50 border-white/10 text-white"}
          >
            Replied ({stats.replied})
          </Button>
          <Button
            variant={filter === "archived" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("archived")}
            className={filter === "archived" ? "bg-gray-500 hover:bg-gray-600" : "bg-slate-800/50 border-white/10 text-white"}
          >
            Archived ({stats.archived})
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submissions List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredSubmissions.length === 0 ? (
              <Card className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 text-center">
                <Mail className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No contact submissions found</p>
              </Card>
            ) : (
              filteredSubmissions.map((submission) => (
                <Card
                  key={submission.id}
                  className={`bg-slate-900/60 backdrop-blur-xl border ${
                    selectedSubmission?.id === submission.id
                      ? "border-cyan-500/50"
                      : "border-white/10 hover:border-cyan-500/30"
                  } p-6 cursor-pointer transition-all`}
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">{submission.name}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                            submission.status
                          )}`}
                        >
                          {getStatusIcon(submission.status)}
                          {submission.status}
                        </span>
                      </div>
                      <p className="text-cyan-400 text-sm mb-1">{submission.email}</p>
                      {submission.subject && (
                        <p className="text-gray-300 font-medium mb-2">{submission.subject}</p>
                      )}
                      <p className="text-gray-400 text-sm line-clamp-2">{submission.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-xs text-gray-500">
                      {new Date(submission.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-slate-800/50 border-white/10 text-white hover:bg-slate-700/50 h-7 px-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(submission.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedSubmission ? (
              <Card className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 sticky top-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Submission Details</h2>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedSubmission(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400">Name</label>
                      <p className="text-white font-medium">{selectedSubmission.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Email</label>
                      <p className="text-cyan-400">{selectedSubmission.email}</p>
                    </div>
                    {selectedSubmission.subject && (
                      <div>
                        <label className="text-sm text-gray-400">Subject</label>
                        <p className="text-white">{selectedSubmission.subject}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm text-gray-400">Message</label>
                      <p className="text-white whitespace-pre-wrap bg-slate-800/50 p-3 rounded border border-white/10">
                        {selectedSubmission.message}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Submitted</label>
                      <p className="text-gray-300 text-sm">
                        {new Date(selectedSubmission.created_at).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-t border-white/10 pt-4">
                  <label className="text-sm text-gray-400 mb-2 block">Update Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant={selectedSubmission.status === "read" ? "default" : "outline"}
                      onClick={() => handleStatusUpdate(selectedSubmission.id, "read")}
                      className={
                        selectedSubmission.status === "read"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-slate-800/50 border-white/10 text-white"
                      }
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Read
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedSubmission.status === "replied" ? "default" : "outline"}
                      onClick={() => handleStatusUpdate(selectedSubmission.id, "replied")}
                      className={
                        selectedSubmission.status === "replied"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-slate-800/50 border-white/10 text-white"
                      }
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Replied
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedSubmission.status === "archived" ? "default" : "outline"}
                      onClick={() => handleStatusUpdate(selectedSubmission.id, "archived")}
                      className={
                        selectedSubmission.status === "archived"
                          ? "bg-gray-500 hover:bg-gray-600"
                          : "bg-slate-800/50 border-white/10 text-white"
                      }
                    >
                      <Archive className="h-3 w-3 mr-1" />
                      Archive
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(selectedSubmission.id)}
                      className="bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 text-center">
                <Mail className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Select a submission to view details</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

