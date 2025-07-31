import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { AuthProvider } from "@/components/auth/AuthProvider"

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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
