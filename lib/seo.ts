import type { Metadata } from "next";
export function pageMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `${title} | DetaLabs AI`,
      description,
      type: "website",
    },
  };
}
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://detalabsai.com";
