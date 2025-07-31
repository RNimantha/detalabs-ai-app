"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/AuthProvider"
import { Button } from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import { Mail, TrendingUp, MessageSquare, CheckCircle, Send, TestTube } from "lucide-react"

interface ContactSubmission {
  id: number
  name: string
  email: string
  subject: string
  message: string
  status: "new" | "in_progress" | "completed"
  created_at: string
}

interface Stats {
  total: number
  new_count: number
  in_progress_count: number
  completed_count: number
}

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [testingNotifications, setTestingNotifications] = useState(false)

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login")
      return
    }

    if (user?.role === "admin") {
      fetchContacts()
    }
  }, [user, loading, router])

  const fetchContacts = async () => {
    try {
      console.log("Fetching contacts...")

      // First test if API is working at all
      const testResponse = await fetch("/api/test")
      console.log("Test API status:", testResponse.status)

      const response = await fetch("/api/admin/contacts")
      console.log("Response status:", response.status)
      console.log("Response URL:", response.url)

      if (response.status === 404) {
        console.error("API route not found - check file structure")
        setContacts([])
        setStats({ total: 0, new_count: 0, in_progress_count: 0, completed_count: 0 })
        return
      }

      if (response.ok) {
        const data = await response.json()
        console.log("Fetched data:", data)
        setContacts(data.contacts || [])
        setStats(data.stats || { total: 0, new_count: 0, in_progress_count: 0, completed_count: 0 })
      } else {
        const errorText = await response.text()
        console.error("API Error:", response.status, errorText)
        setContacts([])
        setStats({ total: 0, new_count: 0, in_progress_count: 0, completed_count: 0 })
      }
    } catch (error) {
      console.error("Error fetching contacts:", error)
      setContacts([])
      setStats({ total: 0, new_count: 0, in_progress_count: 0, completed_count: 0 })
    } finally {
      setLoadingData(false)
    }
  }

  const testNotifications = async () => {
    setTestingNotifications(true)
    try {
      const response = await fetch("/api/test-notifications", {
        method: "POST",
      })

      if (response.ok) {
        const result = await response.json()
        alert(
          `Test notifications sent!\nEmail: ${result.results.email ? "Success" : "Failed"}\nWhatsApp: ${result.results.whatsapp ? "Success" : "Failed"}`,
        )
      } else {
        alert("Failed to send test notifications")
      }
    } catch (error) {
      console.error("Error testing notifications:", error)
      alert("Error testing notifications")
    } finally {
      setTestingNotifications(false)
    }
  }

  const updateContactStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchContacts() // Refresh data
      }
    } catch (error) {
      console.error("Error updating contact status:", error)
    }
  }

  const deleteContact = async (id: number) => {
    if (!confirm("Are you sure you want to delete this contact?")) return

    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchContacts() // Refresh data
      }
    } catch (error) {
      console.error("Error deleting contact:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={testNotifications}
                variant="outline"
                disabled={testingNotifications}
                className="flex items-center space-x-2 bg-transparent"
              >
                <TestTube className="h-4 w-4" />
                <span>{testingNotifications ? "Testing..." : "Test Notifications"}</span>
              </Button>
              <Button href="/" variant="outline">
                Back to Site
              </Button>
              <Button onClick={logout} variant="secondary">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification Info Card */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <Send className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-blue-900">Notification System Active</h3>
              <p className="text-blue-700 mt-1">New contact submissions automatically send notifications to:</p>
              <ul className="mt-2 text-sm text-blue-600 space-y-1">
                <li>📧 Email: info@detalabsai.com</li>
                <li>📱 WhatsApp: +94716113385</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.new_count}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.in_progress_count}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed_count}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Contacts Table */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Contact Submissions</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                        <div className="text-sm text-gray-500">{contact.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{contact.subject}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{contact.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}
                      >
                        {contact.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contact.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <select
                        value={contact.status}
                        onChange={(e) => updateContactStatus(contact.id, e.target.value)}
                        className="text-sm border-gray-300 rounded-md"
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="text-red-600 hover:text-red-900 ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {contacts.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts</h3>
              <p className="mt-1 text-sm text-gray-500">No contact submissions yet.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
