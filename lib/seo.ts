import type { Metadata } from "next";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://detalabsai.com"
).replace(/\/$/, "");

export const siteName = "DetaLabs AI";
export const defaultOgImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "DetaLabs AI: AI engineering, AI marketing, and web development",
};

/** Stable IDs let every page's structured data point at the same entities. */
export const schemaIds = {
  organization: `${siteUrl}/#organization`,
  website: `${siteUrl}/#website`,
};

export const absoluteUrl = (path = "/") =>
  path.startsWith("http") ? path : `${siteUrl}${path === "/" ? "" : path}`;

/**
 * Page metadata with a canonical URL, Open Graph, and Twitter card.
 * Next.js replaces (rather than merges) openGraph per page, so every field is set here.
 */
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const fullTitle = `${title} | ${siteName}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName,
      locale: "en_US",
      type: "website",
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [defaultOgImage.url],
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
