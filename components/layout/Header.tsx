"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/AuthProvider"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <header className="bg-slate-900/90 border border-purple-500/20 shadow-lg shadow-purple-500/10 sticky top-0 z-50 mx-4 my-2 rounded-xl">
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        {/* Company Name on the left */}
        <div className="flex">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              DetaLabs AI
            </span>
          </Link>
        </div>

        {/* Navigation links centered on desktop */}
        <div className="hidden md:flex md:flex-1 md:justify-center">
          <div className="flex md:gap-x-8 lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-semibold leading-6 transition-all duration-300 hover:text-cyan-400 whitespace-nowrap relative group ${
                  pathname === item.href ? "text-cyan-400" : "text-gray-300"
                }`}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>

        {/* Buttons on the right */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Welcome, {user.name}</span>
              {user.role === "admin" && (
                <Button href="/admin/dashboard" variant="outline" size="sm" className="border-purple-400/50 text-purple-300 hover:bg-purple-500/20">
                  Dashboard
                </Button>
              )}
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Button href="/login" variant="outline" className="border-purple-400/50 text-purple-300 hover:bg-purple-500/20">
                Sign In
              </Button>
              <Button href="/contact" variant="primary" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                Get Started
              </Button>
            </div>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-50"></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-slate-900/95 border-l border-purple-500/20 px-6 py-6 sm:max-w-sm rounded-l-xl">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
                {/* Note: Remove or use a more performant Next.js Image component here if needed */}
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">DetaLabs AI</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-300 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/20">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-purple-500/20 transition-colors ${
                        pathname === item.href ? "text-cyan-400" : "text-gray-300"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  {user ? (
                    <div className="space-y-4">
                      <div className="text-sm text-gray-300">Welcome, {user.name}</div>
                      {user.role === "admin" && (
                        <Button href="/admin/dashboard" variant="outline" className="w-full bg-transparent border-purple-400/50 text-purple-300">
                          Dashboard
                        </Button>
                      )}
                      <Button onClick={logout} variant="secondary" className="w-full bg-gray-800 hover:bg-gray-700">
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button href="/login" variant="outline" className="w-full bg-transparent border-purple-400/50 text-purple-300">
                        Sign In
                      </Button>
                      <Button href="/contact" variant="primary" className="w-full bg-gradient-to-r from-cyan-500 to-blue-500">
                        Get Started
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}