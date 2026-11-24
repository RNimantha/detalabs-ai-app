import Link from "next/link";
import Image from "next/image";
import { blog } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";
import { Section, Container, Card } from "@/components/marketing/shared";
import type { Blog } from "@/supabase/types";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata("Blog", blog.description);
export default async function BlogPage() {
  let posts: Blog[] = [];
  let unavailable = false;
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const { getPublicBlogs } = await import("@/lib/blog-db");
      posts = await getPublicBlogs();
    } catch {
      unavailable = true;
    }
  }
  return (
    <Section>
      <Container>
        <p className="eyebrow">{blog.eyebrow}</p>
        <h1>{blog.title}</h1>
        <p className="page-intro">{blog.description}</p>
        {posts.length ? (
          <div className="three-grid">
            {posts.map((post) => (
              <Card className="blog-card" key={post.id}>
                {post.image && (
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={640}
                    height={400}
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                )}
                <div className="p-7">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-GB")}
                  </time>
                  <h2>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p>{post.excerpt}</p>
                  <Link className="text-link" href={`/blog/${post.slug}`}>
                    {blog.read}
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p>{unavailable ? blog.unavailable : blog.empty}</p>
        )}
      </Container>
    </Section>
  );
}
