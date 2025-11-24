"use client"

import { X, Star } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface Testimonial {
  id: number
  name: string
  handle?: string
  title: string
  company: string
  rating: number
  text: string
  avatar: string
}

interface TestimonialModalProps {
  isOpen: boolean
  onClose: () => void
  testimonial: Testimonial | null
}

export default function TestimonialModal({ isOpen, onClose, testimonial }: TestimonialModalProps) {
  if (!testimonial) return null

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'
        }`}
      />
    ))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50">
              {/* Header */}
              <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/30 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-white">Testimonial</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 relative z-0">
                {/* Author Info */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/20">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover border-2 border-cyan-400/50"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white">{testimonial.name}</h3>
                      {testimonial.handle && (
                        <span className="text-gray-400 text-sm">@{testimonial.handle}</span>
                      )}
                    </div>
                    <p className="text-cyan-400 font-medium mb-1">{testimonial.title}</p>
                    <p className="text-gray-400 text-sm">{testimonial.company}</p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Full Testimonial Text */}
                <div className="space-y-4">
                  <blockquote className="text-lg text-gray-200 leading-relaxed italic border-l-4 border-cyan-500/50 pl-4">
                    "{testimonial.text}"
                  </blockquote>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

