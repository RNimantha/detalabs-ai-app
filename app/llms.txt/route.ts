import { site, services } from "@/content/site";
import { serviceDetails } from "@/content/pages";
import { leadership } from "@/content/leadership";
import { stelvoice } from "@/content/stelvoice";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

// llms.txt (https://llmstxt.org): a plain-language summary that AI assistants can read
// to understand and accurately describe DetaLabs AI. Generated from site content.
export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description} We serve clients worldwide.`,
    "",
    `${site.name} is an AI and digital studio. One team covers AI engineering, AI marketing, and web development, and builds its own product, StelVoice.`,
    "",
    "## Services",
    "",
    ...services.flatMap((service) => [
      `- [${service.title}](${siteUrl}/services/${service.slug}): ${service.intro} ${serviceDetails[service.slug]?.description ?? ""}`.trim(),
      ...service.capabilities.map((capability) => `  - ${capability}`),
    ]),
    "",
    "## Product",
    "",
    `- [${stelvoice.name}](${siteUrl}${stelvoice.path}): ${stelvoice.shortDescription}`,
    "",
    "## Leadership",
    "",
    ...leadership.members.map(
      (person) => `- ${person.name}, ${person.role}: ${person.bio}`,
    ),
    "",
    "## Contact",
    "",
    `- Email: ${site.email}`,
    `- Phone: ${site.phone}`,
    `- Location: ${site.location} (serving clients worldwide)`,
    `- [Book a consultation](${siteUrl}/contact)`,
    "",
    "## More",
    "",
    `- [About](${siteUrl}/about)`,
    `- [Work](${siteUrl}/work)`,
    `- [Blog](${siteUrl}/blog)`,
    `- [Privacy policy](${siteUrl}/privacy)`,
  ];
  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
