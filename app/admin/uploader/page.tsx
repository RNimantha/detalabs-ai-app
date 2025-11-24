"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Trash2, Edit, Plus, Save, X, Image as ImageIcon, Eye } from "lucide-react"
import type { Blog } from "@/supabase/types"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(
  () => import("react-quill"),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-[500px] flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-400">Loading editor...</p>
      </div>
    )
  }
)
import "react-quill/dist/quill.snow.css"

interface BlogFormData {
  title: string
  content: string
  excerpt: string
  author: string
  date: string
  image: string
  keywords: string
  is_public: boolean
}

export default function AdminUploader() {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const editorKeyRef = useRef(0)


  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    content: "",
    excerpt: "",
    author: "",
    date: new Date().toISOString().split("T")[0],
    image: "",
    keywords: "",
    is_public: true,
  })


  useEffect(() => {
    if (typeof window !== "undefined") {
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    checkAuth()
    fetchBlogs()
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

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/admin/blogs")
      if (response.ok) {
        const data = await response.json()
        setBlogs(data.blogs || [])
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = useCallback((field: keyof BlogFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleContentChange = useCallback((value: string) => {
    handleInputChange("content", value)
  }, [handleInputChange])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        handleInputChange("image", data.url)
      } else {
        alert(data.error || "Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image")
    }
  }

  const insertImageInEditor = async () => {
    fileInputRef.current?.click()
  }

  const handleImageInsert = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        // Insert image into Quill editor
        const editor = editorContainerRef.current?.querySelector(".ql-editor") as HTMLElement
        if (editor) {
          try {
            // Try to access Quill instance from the editor element
            const quill = (editor as any).__quill || (editor.parentElement as any)?.__quill
            if (quill && typeof quill.getSelection === 'function') {
              const range = quill.getSelection(true) || { index: quill.getLength(), length: 0 }
              quill.insertEmbed(range.index, "image", data.url, "user")
              quill.setSelection(range.index + 1)
              return
            }
          } catch (error) {
            console.log("Quill API not available, using HTML fallback")
          }
          
          // Fallback: insert as HTML at cursor or end
          const selection = window.getSelection()
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            const img = document.createElement("img")
            img.src = data.url
            img.style.maxWidth = "100%"
            img.style.height = "auto"
            img.style.margin = "1rem 0"
            img.style.borderRadius = "0.5rem"
            range.insertNode(img)
            range.collapse(false)
            selection.removeAllRanges()
            selection.addRange(range)
          } else {
            // Insert at end
            const img = document.createElement("img")
            img.src = data.url
            img.style.maxWidth = "100%"
            img.style.height = "auto"
            img.style.margin = "1rem 0"
            img.style.borderRadius = "0.5rem"
            editor.appendChild(img)
          }
          
          // Update form data
          handleInputChange("content", editor.innerHTML)
        }
      } else {
        alert(data.error || "Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image")
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSave = async () => {
    if (!formData.title || !formData.content || !formData.author) {
      alert("Please fill in all required fields (Title, Content, Author)")
      return
    }

    setSaving(true)
    try {
      const keywordsArray = formData.keywords
        ? formData.keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : []

      const payload = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        author: formData.author,
        date: formData.date,
        image: formData.image || null,
        keywords: keywordsArray.length > 0 ? keywordsArray : null,
        is_public: formData.is_public,
      }

      const url = editingId ? `/api/admin/blogs/${editingId}` : "/api/admin/blogs"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        alert(editingId ? "Blog updated successfully!" : "Blog created successfully!")
        resetForm()
        fetchBlogs()
      } else {
        alert(data.error || "Failed to save blog")
      }
    } catch (error) {
      console.error("Error saving blog:", error)
      alert("Failed to save blog")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (blog: Blog) => {
    setEditingId(blog.id)
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || "",
      author: blog.author,
      date: blog.date,
      image: blog.image || "",
      keywords: blog.keywords?.join(", ") || "",
      is_public: blog.is_public,
    })
    // Force editor remount when editing
    editorKeyRef.current += 1
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        alert("Blog deleted successfully!")
        fetchBlogs()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to delete blog")
      }
    } catch (error) {
      console.error("Error deleting blog:", error)
      alert("Failed to delete blog")
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      author: "",
      date: new Date().toISOString().split("T")[0],
      image: "",
      keywords: "",
      is_public: true,
    })
    // Force editor remount by incrementing key
    editorKeyRef.current += 1
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link", "image"],
        [{ color: [] }, { background: [] }],
        ["blockquote", "code-block"],
        ["clean"],
      ],
      handlers: {
        image: insertImageInEditor,
      },
    },
  }), [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Blog Uploader</h1>
              <p className="text-sm text-gray-400 mt-1">Create and manage your blog posts</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button href="/admin/contacts" variant="outline" size="sm" className="bg-slate-800/50 border-white/10 text-white hover:bg-slate-700/50">
                Contact Queries
              </Button>
              <Button href="/admin/comments" variant="outline" size="sm" className="bg-slate-800/50 border-white/10 text-white hover:bg-slate-700/50">
                Comments
              </Button>
              <Button href="/" variant="outline" size="sm" className="bg-slate-800/50 border-white/10 text-white hover:bg-slate-700/50">
                View Site
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm" className="bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Editor Form */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-white">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter blog title"
                    className="mt-1 bg-slate-800/50 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt" className="text-white">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange("excerpt", e.target.value)}
                    placeholder="Brief description of the blog post"
                    rows={3}
                    className="mt-1 bg-slate-800/50 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <Label htmlFor="content" className="text-base font-semibold text-white">Blog Content *</Label>
                      <p className="text-sm text-gray-400 mt-1">Write your main blog post content here. Use the toolbar above to format text, add images, links, and more.</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={insertImageInEditor}
                      className="flex items-center gap-2 bg-slate-800/50 border-white/10 text-white hover:bg-slate-700/50"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Insert Image
                    </Button>
                  </div>
                  <div className="mt-1 border border-white/10 rounded-lg overflow-visible bg-white" style={{ position: 'relative', zIndex: 1 }}>
                    <div 
                      ref={(el) => {
                        if (editorContainerRef.current !== el) {
                          editorContainerRef.current = el
                          if (el) {
                          }
                        }
                      }}
                      style={{ position: 'relative', minHeight: '500px' }} 
                      key={`quill-editor-${editorKeyRef.current}`}
                    >
                      {mounted && typeof window !== "undefined" ? (
                        <ReactQuill
                          key={`react-quill-${editorKeyRef.current}`}
                          theme="snow"
                          value={formData.content}
                          onChange={handleContentChange}
                          modules={quillModules}
                          placeholder="Start writing your blog post here... You can format text, add headings, lists, images, links, and more using the toolbar above."
                          className="bg-white"
                          style={{ 
                            minHeight: '500px',
                            position: 'relative',
                            zIndex: 1
                          }}
                          formats={[
                            "header",
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "list",
                            "bullet",
                            "align",
                            "link",
                            "image",
                            "color",
                            "background",
                            "blockquote",
                            "code-block",
                          ]}
                        />
                      ) : (
                        <div className="min-h-[500px] flex items-center justify-center bg-gray-50">
                          <p className="text-gray-400">Initializing editor...</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {!formData.content && (
                    <p className="text-xs text-gray-400 mt-2">
                      💡 Tip: This is where you write the main body of your blog post. The content will be displayed on the blog post page.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author" className="text-white">Author *</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => handleInputChange("author", e.target.value)}
                      placeholder="Author name"
                      className="mt-1 bg-slate-800/50 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="date" className="text-white">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      className="mt-1 bg-slate-800/50 border-white/10 text-white focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image" className="text-white">Featured Image URL</Label>
                  <div className="mt-1 flex gap-2">
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => handleInputChange("image", e.target.value)}
                      placeholder="Image URL or upload below"
                      className="flex-1 bg-slate-800/50 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-slate-800/50 border-white/10 text-white hover:bg-slate-700/50"
                    >
                      Upload
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="keywords" className="text-white">Keywords (comma-separated)</Label>
                  <Input
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) => handleInputChange("keywords", e.target.value)}
                    placeholder="AI, Machine Learning, Data Science"
                    className="mt-1 bg-slate-800/50 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center space-x-2 p-4 bg-slate-800/30 rounded-lg border border-white/10">
                  <Switch
                    id="is_public"
                    checked={formData.is_public}
                    onCheckedChange={(checked) => handleInputChange("is_public", checked)}
                  />
                  <Label htmlFor="is_public" className="text-white cursor-pointer">Make this blog public</Label>
                </div>

                <div className="flex gap-4 pt-4 border-t border-white/10">
                  <Button
                    onClick={handleSave}
                    variant="primary"
                    disabled={saving}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : editingId ? "Update Blog" : "Create Blog"}
                  </Button>
                  {editingId && (
                    <Button onClick={resetForm} variant="outline" className="flex items-center gap-2 bg-slate-800/50 border-white/10 text-white hover:bg-slate-700/50">
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </Card>

          </div>

          {/* Real-time Preview Panel - Always Visible Split View */}
          <div className="xl:col-span-1">
            <Card className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Eye className="h-4 w-4 text-cyan-400" />
                  Live Preview
                </h2>
                <span className="text-xs text-cyan-400 bg-cyan-500/20 border border-cyan-500/50 px-2 py-1 rounded">
                  Real-time
                </span>
              </div>
              <div className="border border-white/10 rounded-lg p-4 bg-white max-h-[calc(100vh-180px)] overflow-y-auto shadow-inner">
                {/* Preview Content - Updates as you type */}
                <article className="prose prose-sm max-w-none">
                  {formData.title ? (
                    <h1 className="text-2xl font-bold mb-3 text-gray-900">{formData.title}</h1>
                  ) : (
                    <h1 className="text-2xl font-bold mb-3 text-gray-300">Your Blog Title</h1>
                  )}
                  
                  {formData.excerpt && (
                    <p className="text-gray-600 italic mb-4 border-l-4 border-blue-500 pl-3 text-sm">
                      {formData.excerpt}
                    </p>
                  )}
                  
                  {formData.image && (
                    <div className="mb-4">
                      <img
                        src={formData.image}
                        alt={formData.title || "Blog image"}
                        className="w-full h-auto rounded-lg shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  
                  {formData.content ? (
                    <div
                      className="blog-content text-sm"
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                    />
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <p className="italic mb-2">Start writing to see live preview...</p>
                      <p className="text-xs">The preview updates automatically as you type</p>
                    </div>
                  )}
                  
                  {(formData.author || formData.date) && (
                    <div className="mt-6 pt-4 border-t text-xs text-gray-500 space-y-1">
                      {formData.author && <p><strong>Author:</strong> {formData.author}</p>}
                      {formData.date && (
                        <p>
                          <strong>Date:</strong> {new Date(formData.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  )}
                </article>
              </div>
            </Card>
          </div>

        </div>

        {/* Blog List - Full Width Table */}
        <div className="mt-8">
          <Card className="bg-slate-900/60 backdrop-blur-xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">All Blogs</h2>
                <p className="text-sm text-gray-400 mt-1">{blogs.length} blog{blogs.length !== 1 ? 's' : ''} total</p>
              </div>
              <Button onClick={resetForm} variant="outline" size="sm" className="flex items-center gap-2 bg-cyan-500/20 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30">
                <Plus className="h-4 w-4" />
                New Blog
              </Button>
            </div>
            {blogs.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400">No blogs yet. Create your first blog!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Author</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {blogs.map((blog) => (
                      <tr
                        key={blog.id}
                        className="bg-slate-900/30 hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">{blog.title}</div>
                          {blog.excerpt && (
                            <div className="text-xs text-gray-400 mt-1 line-clamp-1">{blog.excerpt}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-cyan-400">{blog.author}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-400">
                            {new Date(blog.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {blog.is_public ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/50">
                              Public
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/50">
                              Private
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(blog)}
                              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20"
                              title="Edit blog"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(blog.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              title="Delete blog"
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
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageInsert}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        id="featured-image-upload"
      />
    </div>
  )
}

