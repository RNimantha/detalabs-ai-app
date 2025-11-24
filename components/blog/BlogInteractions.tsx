"use client"

import { useState, useEffect } from "react"
import { Heart, MessageCircle, Eye, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BlogInteractionsProps {
  slug: string
  initialLikes?: number
  initialViews?: number
  initialCommentsCount?: number
  initialUserLiked?: boolean
}

export default function BlogInteractions({
  slug,
  initialLikes = 0,
  initialViews = 0,
  initialCommentsCount = 0,
  initialUserLiked = false,
}: BlogInteractionsProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [views, setViews] = useState(initialViews)
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount)
  const [userLiked, setUserLiked] = useState(initialUserLiked)
  const [loading, setLoading] = useState(false)

  // Track view on mount
  useEffect(() => {
    fetch(`/api/blog/${slug}/view`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setViews((prev) => prev + 1)
        }
      })
      .catch(console.error)
  }, [slug])

  const handleLike = async () => {
    if (loading) return

    setLoading(true)
    try {
      const response = await fetch(`/api/blog/${slug}/interactions`, {
        method: "POST",
      })
      const data = await response.json()

      if (response.ok) {
        setUserLiked(data.liked)
        // Fetch updated likes count
        const interactionsRes = await fetch(`/api/blog/${slug}/interactions`)
        const interactionsData = await interactionsRes.json()
        if (interactionsRes.ok) {
          setLikes(interactionsData.likes)
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-6 py-6 border-t border-b border-white/10 my-8">
      <Button
        variant="outline"
        size="sm"
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center gap-2 bg-slate-800/50 border-white/10 text-white hover:bg-slate-700/50 ${
          userLiked ? "text-red-400 border-red-500/50 bg-red-500/20 hover:bg-red-500/30" : ""
        }`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart className={`h-4 w-4 ${userLiked ? "fill-current" : ""}`} />
        )}
        <span>{likes}</span>
        <span className="sr-only">Likes</span>
      </Button>

      <div className="flex items-center gap-2 text-gray-300">
        <MessageCircle className="h-4 w-4" />
        <span>{commentsCount}</span>
        <span className="sr-only">Comments</span>
      </div>

      <div className="flex items-center gap-2 text-gray-300">
        <Eye className="h-4 w-4" />
        <span>{views}</span>
        <span className="sr-only">Views</span>
      </div>
    </div>
  )
}

