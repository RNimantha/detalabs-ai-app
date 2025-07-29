"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Card} from "@/components/ui/card"
import type { ContactFormData } from "@/lib/types"

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

  return (
    <div className="bg-white">
      <div className="relative isolate px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Contact Us</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Ready to transform your business with AI? Let's discuss your project and explore how we can help.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="animate-slide-up">
            <h3 className="text-lg font-semibold text-gray-900 mb-8">Get in Touch</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Email</h4>
                  <p className="text-gray-600">info@detalabsai.com</p>
                  <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Phone</h4>
                  <p className="text-gray-600">+94 (74) 195-7668</p>
                  <p className="text-sm text-gray-500">Mon-Fri from 8am to 5pm IST</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Office</h4>
                  <p className="text-gray-600">
                    9/2 Divulpitiya-Bellanwila Road
                    <br />
                    Colombo, 94105
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Business Hours</h4>
                  <p className="text-gray-600">
                    Monday - Friday: 8:00 AM - 5:00 PM PST
                    <br />
                    Weekend: By appointment
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  label="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              <Input
                id="subject"
                name="subject"
                type="text"
                label="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What's this about?"
              />
              <Textarea
                id="message"
                name="message"
                label="Message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell us about your project and how we can help..."
              />

              {submitStatus === "success" && (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="text-sm text-green-800">
                    Thank you for your message! We'll get back to you within 24 hours.
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-800">
                    Sorry, there was an error sending your message. Please try again or contact us directly.
                  </div>
                </div>
              )}

              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
