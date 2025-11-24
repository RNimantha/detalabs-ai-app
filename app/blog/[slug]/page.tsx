import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getBlogBySlug } from "@/lib/blog-db"
import { Calendar, User, ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import BlogInteractions from "@/components/blog/BlogInteractions"
import CommentSection from "@/components/blog/CommentSection"
import { supabase } from "@/supabase/server"

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogBySlug(params.slug)
  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    }
  }
  return {
    title: `${post.title} | DetaLabs AI Blog`,
    description: post.excerpt || post.title,
    keywords: post.keywords?.join(", ") || "AI, Machine Learning, Data Analytics, Blog",
    authors: [{ name: post.author }],
    openGraph: {
      title: `${post.title} | DetaLabs AI Blog`,
      description: post.excerpt || post.title,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: post.image ? [{ url: post.image }] : [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // Get initial interaction data
  const { count: likesCount } = await supabase
    .from("blog_likes")
    .select("*", { count: "exact", head: true })
    .eq("blog_id", post.id)

  const { count: commentsCount } = await supabase
    .from("blog_comments")
    .select("*", { count: "exact", head: true })
    .eq("blog_id", post.id)
    .eq("is_approved", true)

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
                src={post.image}
                alt={post.title}
                fill
                style={{ objectFit: "cover" }}
                className="animate-scale-in"
              />
            </div>
          )}

          <div 
            className="text-gray-700 leading-relaxed prose prose-lg max-w-none" 
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </article>

        {/* Blog Interactions */}
        <BlogInteractions
          slug={params.slug}
          initialLikes={likesCount || 0}
          initialViews={post.view_count || 0}
          initialCommentsCount={commentsCount || 0}
        />

        {/* Comment Section */}
        <CommentSection slug={params.slug} />
      </div>
    </div>
  )
}
