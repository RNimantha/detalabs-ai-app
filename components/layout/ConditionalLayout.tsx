"use client"

import { usePathname } from "next/navigation"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Orb from "@/components/Orb"

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin")

  if (isAdminRoute) {
    // Admin routes: no header/footer, no background
    return <div className="min-h-screen bg-gray-50">{children}</div>
  }

  // Regular routes: with header/footer and dark Orb background
  return (
    <div className="min-h-screen flex flex-col relative bg-slate-900">
      {/* Orb Background - Reduced opacity for less distraction */}
      <div className="fixed inset-0 w-full h-full z-0 opacity-30">
        <Orb
          hue={0}
          hoverIntensity={0.3}
          rotateOnHover={true}
          forceHoverState={false}
        />
      </div>
      
      {/* Content with backdrop */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </div>
  )
}

