import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "detaLabsAI - Machine Learning & AI Solutions",
  description:
    "Leading provider of machine learning models, data analytics, AI SaaS tools, and intelligent automation solutions.",
  keywords: "machine learning, AI, data analytics, automation, SaaS, artificial intelligence",
  authors: [{ name: "detaLabsAI" }],
  openGraph: {
    title: "detaLabsAI - Machine Learning & AI Solutions",
    description:
      "Leading provider of machine learning models, data analytics, AI SaaS tools, and intelligent automation solutions.",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
