import { blog } from "@/content/pages";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBlogBySlug } from "@/lib/blog-db";
import { Calendar, User, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import BlogInteractions from "@/components/blog/BlogInteractions";
import CommentSection from "@/components/blog/CommentSection";
import { supabase } from "@/supabase/server";

// Force dynamic rendering to prevent caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Generate metadata for each blog post
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? await getBlogBySlug((await params).slug)
      : null;
  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }
  return {
    title: `${post.title} | DetaLabs AI Blog`,
    description: post.excerpt || post.title,
    keywords:
      post.keywords?.join(", ") || "AI, Machine Learning, Data Analytics, Blog",
    authors: [{ name: post.author }],
    openGraph: {
      title: `${post.title} | DetaLabs AI Blog`,
      description: post.excerpt || post.title,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? await getBlogBySlug((await params).slug)
      : null;

  if (!post) {
    notFound();
  }

  // Get initial interaction data
  const { count: likesCount } = await supabase
    .from("blog_likes")
    .select("*", { count: "exact", head: true })
    .eq("blog_id", post.id);

  const { count: commentsCount } = await supabase
    .from("blog_comments")
    .select("*", { count: "exact", head: true })
    .eq("blog_id", post.id)
    .eq("is_approved", true);

  return (
    <div className="blog-shell relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          {blog.back}
        </Link>

        <article className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12">
          <div className="mb-6">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-gray-300 leading-relaxed mb-8 border-l-4 border-cyan-500 pl-4 italic">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center gap-x-6 text-sm mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center text-cyan-400">
                <Calendar className="h-4 w-4 mr-2" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <div className="flex items-center text-gray-300">
                <User className="h-4 w-4 mr-2" />
                <span>{post.author}</span>
              </div>
              {post.keywords && post.keywords.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {post.keywords.slice(0, 3).map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-medium rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {post.image && (
            <div className="relative w-full h-96 mb-12 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 900px) 100vw, 896px"
                style={{ objectFit: "cover" }}
                className="animate-scale-in"
              />
            </div>
          )}

          <div
            className="blog-content text-gray-200 leading-relaxed prose prose-lg max-w-none prose-invert prose-headings:text-white prose-p:text-gray-200 prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-cyan-400 prose-pre:bg-slate-800 prose-pre:border prose-pre:border-white/10 prose-blockquote:border-l-cyan-500 prose-blockquote:text-gray-300 prose-blockquote:bg-slate-800/50 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-ul:text-gray-200 prose-ol:text-gray-200 prose-li:text-gray-200 prose-img:rounded-lg prose-img:border prose-img:border-white/10"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Blog Interactions */}
        <BlogInteractions
          slug={(await params).slug}
          initialLikes={likesCount || 0}
          initialViews={post.view_count || 0}
          initialCommentsCount={commentsCount || 0}
        />

        {/* Comment Section */}
        <CommentSection slug={(await params).slug} />
      </div>
    </div>
  );
}
