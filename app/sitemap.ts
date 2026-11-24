import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/services",
    "/services/ai-engineering",
    "/services/ai-marketing",
    "/services/web-development",
    "/products/stelvoice",
    "/work",
    "/about",
    "/contact",
    "/blog",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly" as const,
    priority: path ? 0.7 : 1,
  }));
}
