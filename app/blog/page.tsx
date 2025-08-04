"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { BlogPost } from "@/lib/blog"
import {Card} from "@/components/ui/card"
import { Calendar, User, Lock } from "lucide-react"
import { useAuth } from "@/components/auth/AuthProvider"
import { Button } from "@/components/ui/button"

interface BlogResponse {
  posts: BlogPost[]
  isAuthenticated: boolean
  totalPosts: number
}

export default function BlogPage() {
  const { user, loading: authLoading } = useAuth()
  const [blogData, setBlogData] = useState<BlogResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blog")
        if (response.ok) {
          const data: BlogResponse = await response.json()
          setBlogData(data)
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [user]) // Refetch when user changes

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading blog posts...</div>
      </div>
    )
  }

  if (!blogData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Error loading blog posts</div>
      </div>
    )
  }

  const { posts, isAuthenticated, totalPosts } = blogData

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Our Insights</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Latest from the DetaLabs AI Blog
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Dive into our articles on cutting-edge AI, machine learning, data analytics, and intelligent automation.
          </p>
          {!isAuthenticated && posts.length < totalPosts && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800">
                <Lock className="inline h-4 w-4 mr-1" />
                Showing {posts.length} of {totalPosts} articles. Sign in to access exclusive content!
              </p>
            </div>
          )}
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post, index) => (
            <article
              key={post.slug}
              className={`flex flex-col items-start justify-between animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card hover className="w-full">
                <div className="relative w-full h-48 mb-6">
                  <Image
                    src={post.image || "/placeholder.svg?height=400&width=600&query=abstract AI background"}
                    alt={post.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-lg"
                  />
                  {!post.isPublic && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
                      <Lock className="h-3 w-3 mr-1" />
                      Premium
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-x-4 text-xs mb-2">
                  <time dateTime={post.date} className="text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span className="relative z-10 rounded-full bg-blue-50 px-3 py-1.5 font-medium text-blue-600">
                    AI & ML
                  </span>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{post.excerpt}</p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">
                  <User className="h-8 w-8 rounded-full bg-gray-50 text-gray-600 p-1" />
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900">
                      <span className="absolute inset-0" />
                      {post.author}
                    </p>
                    <p className="text-gray-600">DetaLabs AI Team</p>
                  </div>
                </div>
              </Card>
            </article>
          ))}
        </div>

        {!isAuthenticated && posts.length < totalPosts && (
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Unlock Premium Content for FREE</h3>
              <p className="text-lg text-gray-700 mb-6">
                Sign in to access our full library of {totalPosts - posts.length} exclusive blog posts and advanced AI
                insights!
              </p>
              <div className="flex justify-center space-x-4">
                <Button href="/login" variant="primary" size="lg">
                  Sign In to Read More
                </Button>
                <Button href="/register" variant="outline" size="lg" className="bg-transparent">
                  Create Account for Free
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
