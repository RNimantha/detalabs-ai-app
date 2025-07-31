"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Brain, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/AuthProvider"
import Image from "next/image"

const navigation = [
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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex mr-48">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <Image
                src="/ss.png"
                alt="DetaLabs AI Logo"
                width={100}
                height={100}
                className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold text-gray-900">DetaLabs AI</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden md:flex md:gap-x-8 lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-semibold leading-6 transition-colors hover:text-blue-600 whitespace-nowrap ${
                pathname === item.href ? "text-blue-600" : "text-gray-900"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user.name}</span>
              {user.role === "admin" && (
                <Button href="/admin/dashboard" variant="outline" size="sm">
                  Dashboard
                </Button>
              )}
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Button href="/login" variant="outline">
                Sign In
              </Button>
              <Button href="/contact" variant="primary">
                Get Started
              </Button>
            </div>
          )}
        </div>
      </nav>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-50"></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
                <Image
                src="/ss.png"
                alt="DetaLabs AI Logo"
                width={100}
                height={100}
                className="h-8 w-8 object-contain"
            />
                <span className="text-xl font-bold text-gray-900">DetaLabs AI</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-50 ${
                        pathname === item.href ? "text-blue-600" : "text-gray-900"
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
                      <div className="text-sm text-gray-700">Welcome, {user.name}</div>
                      {user.role === "admin" && (
                        <Button href="/admin/dashboard" variant="outline" className="w-full bg-transparent">
                          Dashboard
                        </Button>
                      )}
                      <Button onClick={logout} variant="secondary" className="w-full">
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button href="/login" variant="outline" className="w-full bg-transparent">
                        Sign In
                      </Button>
                      <Button href="/contact" variant="primary" className="w-full">
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
