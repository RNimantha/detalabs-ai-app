import type React from "react";
import { siteUrl, siteName, defaultOgImage } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { organizationGraph } from "@/lib/structured-data";
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "DetaLabs AI", template: "%s | DetaLabs AI" },
  description:
    "AI engineering, data science & machine learning, AI marketing, and web development from one team in Colombo, Sri Lanka, serving clients worldwide.",
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    title: "DetaLabs AI",
    description: "One team to build the AI, ship the product, and market it.",
    url: "/",
    siteName,
    locale: "en_US",
    type: "website",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "DetaLabs AI",
    description: "One team to build the AI, ship the product, and market it.",
    images: [defaultOgImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${inter.variable} ${manrope.variable} antialiased`}
      >
        <JsonLd data={organizationGraph()} />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
