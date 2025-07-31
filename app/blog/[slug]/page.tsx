import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getBlogPostBySlugAsync, getBlogMetadata, getAllBlogPostsAsync } from "@/lib/blog"
import { Calendar, User, ArrowLeft, Lock } from "lucide-react"
import { validateSession } from "@/lib/auth"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"

// Generate static paths for all blog posts at build time
export async function generateStaticParams() {
  const posts = await getAllBlogPostsAsync()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlugAsync(params.slug)
  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    }
  }
  return getBlogMetadata(post)
}

async function isAuthenticated(): Promise<boolean> {
  const sessionId = cookies().get("session")?.value
  if (!sessionId) return false
  const user = await validateSession(sessionId)
  return !!user
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlugAsync(params.slug)

  if (!post) {
    notFound()
  }

  const userIsAuthenticated = await isAuthenticated()

  // If post is not public and user is not authenticated, show login prompt
  if (!post.isPublic && !userIsAuthenticated) {
    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>

          <div className="text-center py-16">
            <Lock className="mx-auto h-16 w-16 text-blue-600 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Premium Content</h1>
            <p className="text-lg text-gray-600 mb-8">
              This article is available to signed-in users only. Sign in to continue reading.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-center gap-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{post.author}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button href={`/login?redirect=/blog/${params.slug}`} variant="primary" size="lg">
                Sign In to Read
              </Button>
              <Button href="/register" variant="outline" size="lg" className="bg-transparent">
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>

        <article className="prose prose-lg prose-blue max-w-none">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-0">{post.title}</h1>
            {!post.isPublic && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <Lock className="h-3 w-3 mr-1" />
                Premium
              </span>
            )}
          </div>

          <div className="flex items-center gap-x-4 text-sm text-gray-500 mb-8">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{post.author}</span>
            </div>
          </div>

          {post.image && (
            <div className="relative w-full h-96 mb-12 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                fill
                style={{ objectFit: "cover" }}
                className="animate-scale-in"
              />
            </div>
          )}

          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </div>
    </div>
  )
}
