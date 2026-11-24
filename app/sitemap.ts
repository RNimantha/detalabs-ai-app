import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { services } from "@/content/site";
import { getPublicBlogs } from "@/lib/blog-db";

// Rendered on request so newly published blog posts appear without a redeploy.
export const dynamic = "force-dynamic";

const pages: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/services", priority: 0.9 },
  ...services.map((s) => ({ path: `/services/${s.slug}`, priority: 0.9 })),
  { path: "/products/stelvoice", priority: 0.9 },
  { path: "/about", priority: 0.7 },
  { path: "/work", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
  { path: "/blog", priority: 0.6 },
  { path: "/privacy", priority: 0.2 },
  { path: "/terms", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = pages.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
  try {
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      for (const post of await getPublicBlogs()) {
        entries.push({
          url: `${siteUrl}/blog/${post.slug}`,
          lastModified: post.updated_at || post.date,
          changeFrequency: "yearly",
          priority: 0.5,
        });
      }
    }
  } catch {
    // The static pages are still listed if the blog database is unavailable.
  }
  return entries;
}
