import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const disallow = ["/admin", "/api/"];

// AI search engines and assistants that fetch pages to answer people's questions.
// Allowing them lets DetaLabs AI be cited in ChatGPT, Perplexity, Claude, and Gemini answers.
// Note: Cloudflare's "managed robots.txt" can prepend its own blocks; turn it off in the
// Cloudflare dashboard (AI Crawl Control) so these rules take effect.
const aiAgents = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: aiAgents, allow: "/", disallow },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
