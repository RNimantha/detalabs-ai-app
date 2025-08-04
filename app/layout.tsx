import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { AuthProvider } from "@/components/auth/AuthProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DetaLabs AI | AI, Machine Learning, Data Science SaaS Solutions",
  description:
    "DetaLabs is a top AI SaaS company offering cutting-edge machine learning models, data science tools, automation platforms, and intelligent analytics for businesses.",
  keywords:  "DetaLabs, AI SaaS, machine learning, ML tools, artificial intelligence, data science, DS SaaS, data analytics, predictive analytics, AI automation, cloud AI, AI software, SaaS platform, smart data tools, AI for business, data intelligence, deep learning, AI startup",
  authors: [{ name: "DetaLabs AI" }],
  openGraph: {
    title: "DetaLabs AI - Machine Learning & AI Solutions",
    description:
      "Leading provider of machine learning models, data analytics, AI SaaS tools, and intelligent automation solutions.",
    type: "website",
  },
  icons: {
    icon: "/ss.png",      // for most browsers
    shortcut: "/ss.png",  // for Safari and others
    apple: "/apple-touch-icon.png", // optional for Apple touch devices
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
