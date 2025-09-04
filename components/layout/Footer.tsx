"use client"

import Link from "next/link"
import { Brain, Mail, MapPin, Phone, Github, Linkedin, Twitter, Send, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const navigation = {
  main: [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  services: [
    { name: "ML Models", href: "/services#ml-models" },
    { name: "Data Analytics", href: "/services#data-analytics" },
    { name: "AI SaaS", href: "/services#ai-saas" },
    { name: "AI Automation", href: "/services#ai-automation" },
  ],
  resources: [
    { name: "Blog", href: "/blog" },
    { name: "Case Studies", href: "/undermaintain" },
    { name: "Documentation", href: "/undermaintain" },
    { name: "API Reference", href: "/undermaintain" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/undermaintain" },
    { name: "Terms of Service", href: "/undermaintain" },
    { name: "Cookie Policy", href: "/undermaintain" },
    { name: "Security", href: "/undermaintain" },
  ],
  social: [
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "GitHub", href: "#", icon: Github },
  ]
}

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Add your newsletter signup logic here
    setTimeout(() => {
      setIsSubmitting(false)
      setEmail("")
      // You can add a success message here
    }, 1000)
  }

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden" aria-labelledby="footer-heading">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] opacity-20" />
        
        {/* Subtle gradient orbs */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
      </div>

      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Section */}
          <div className="space-y-8">
            <div className="flex items-center space-x-2">
              {/* <Image
                src="/ss.png"
                alt="DetaLabs AI Logo"
                width={100}
                height={100}
                className="h-8 w-8 object-contain"
              /> */}
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                DetaLabs AI
              </span>
            </div>
            <p className="text-sm leading-6 text-gray-300">
              Leading provider of machine learning models, data analytics, AI SaaS tools, and intelligent automation
              solutions for modern businesses.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-300 hover:text-cyan-400 transition-colors group">
                <div className="p-2 rounded-lg bg-white/10 group-hover:bg-cyan-500/20 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span>info@detalabsai.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300 hover:text-cyan-400 transition-colors group">
                <div className="p-2 rounded-lg bg-white/10 group-hover:bg-cyan-500/20 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <span>+94 (74) 195-7668</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300 hover:text-cyan-400 transition-colors group">
                <div className="p-2 rounded-lg bg-white/10 group-hover:bg-cyan-500/20 transition-colors">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Colombo, Sri Lanka</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {navigation.social.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="p-3 rounded-lg bg-white/10 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 text-gray-300 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white mb-6">Navigation</h3>
                <ul role="list" className="space-y-4">
                  {navigation.main.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white mb-6">Services</h3>
                <ul role="list" className="space-y-4">
                  {navigation.services.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white mb-6">Resources</h3>
                <ul role="list" className="space-y-4">
                  {navigation.resources.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white mb-6">Legal</h3>
                <ul role="list" className="space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Stay Updated</h3>
              <p className="text-sm text-gray-300">Get the latest AI insights and updates delivered to your inbox.</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-3 max-w-md lg:max-w-none">
              <div className="flex-1 lg:w-80">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs leading-5 text-gray-400">
            &copy; 2025 DetaLabs AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-400">
            {/* <span className="flex items-center gap-2">
              Made with <span className="text-red-400">❤️</span> for the future of AI
            </span> */}
          </div>
        </div>
      </div>
    </footer>
  )
}