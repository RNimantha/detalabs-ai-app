"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {Card} from "@/components/ui/card"
import { Calendar, User } from "lucide-react"

interface BlogPost {
  slug: string
  title: string
  date: string
  author: string
  excerpt: string
  image?: string
  isPublic: boolean
}

interface BlogResponse {
  posts: BlogPost[]
  totalPosts: number
}

export default function BlogPage() {
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
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-lg text-white">Loading blog posts...</div>
      </div>
    )
  }

  if (!blogData) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-lg text-red-400">Error loading blog posts</div>
      </div>
    )
  }

  const { posts } = blogData

  // Format posts for display
  const formattedPosts = posts.map((post: any) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    author: post.author,
    excerpt: post.excerpt || "",
    image: post.image,
    isPublic: post.isPublic,
  }))

  return (
    <div className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-cyan-400">Our Insights</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Latest from the DetaLabs AI Blog
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Dive into our articles on cutting-edge AI, machine learning, data analytics, and intelligent automation.
          </p>
        </div>

        {formattedPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">No blog posts available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {formattedPosts.map((post, index) => (
            <article
              key={post.slug}
              className={`flex flex-col items-start justify-between animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card hover className="w-full bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300">
                <div className="relative w-full h-48 mb-6">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-x-4 text-xs mb-2">
                  <time dateTime={post.date} className="text-gray-400 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span className="relative z-10 rounded-full bg-cyan-500/20 px-3 py-1.5 font-medium text-cyan-400">
                    AI & ML
                  </span>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-cyan-400 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-300">{post.excerpt}</p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">
                  <User className="h-8 w-8 rounded-full bg-white/10 text-gray-300 p-1" />
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-white">
                      <span className="absolute inset-0" />
                      {post.author}
                    </p>
                    <p className="text-gray-400">DetaLabs AI Team</p>
                  </div>
                </div>
              </Card>
            </article>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
