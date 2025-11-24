"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import type { ContactFormData } from "@/lib/types"
import { motion } from "framer-motion"

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "info@detalabsai.com",
      subtitle: "We'll respond within 2 hours",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+94 (74) 195-7668",
      subtitle: "Mon-Fri from 8am to 5pm IST",
    },
    {
      icon: MapPin,
      title: "Office",
      content: "9/2 Divulpitiya-Bellanwila Road, Colombo, 94105",
      subtitle: "",
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Monday - Friday: 8:00 AM - 5:00 PM PST",
      subtitle: "Weekend: By appointment",
    },
  ]

  return (
    <div className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h2 className="text-base font-semibold leading-7 text-cyan-400">Get in Touch</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to transform your business with AI?
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Let's discuss your project and explore how we can help you achieve your goals.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Contact Information Cards */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={index}
              >
                <Card className="bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 flex-shrink-0">
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{info.title}</h3>
                      <p className="text-gray-200">{info.content}</p>
                      {info.subtitle && (
                        <p className="text-sm text-gray-400 mt-1">{info.subtitle}</p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={4}
          >
            <Card className="bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 p-8">
              <h3 className="text-xl font-bold text-white mb-6">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What's this about?"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us about your project and how we can help..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </div>

                {submitStatus === "success" && (
                  <div className="rounded-lg bg-green-500/20 border border-green-500/50 p-4">
                    <div className="text-sm text-green-400">
                      Thank you for your message! We'll get back to you within 2 hours.
                    </div>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-4">
                    <div className="text-sm text-red-400">
                      Sorry, there was an error sending your message. Please try again or contact us directly.
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
