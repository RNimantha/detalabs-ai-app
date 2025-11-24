"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import Image from "next/image"
import TestimonialModal from "./TestimonialModal"

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

interface TestimonialMarqueeProps {
  testimonials: Testimonial[]
  speed?: number
}

export default function TestimonialMarquee({ testimonials, speed = 50 }: TestimonialMarqueeProps) {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  const handleCardClick = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedTestimonial(null), 300)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'
        }`}
      />
    ))
  }

  return (
    <>
      <div className="relative w-full overflow-hidden py-8">
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
      
      <div className="flex gap-6 animate-marquee" style={{ animationDuration: `${speed}s` }}>
        {duplicatedTestimonials.map((testimonial, index) => (
          <div
            key={`${testimonial.id}-${index}`}
            onClick={() => handleCardClick(testimonial)}
            className="flex-shrink-0 w-[380px] sm:w-[400px] bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover border-2 border-cyan-400/50"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-white font-semibold text-lg">{testimonial.name}</h3>
                  {testimonial.handle && (
                    <span className="text-gray-400 text-sm">@{testimonial.handle}</span>
                  )}
                </div>
                
                <p className="text-cyan-400 text-sm font-medium mb-1">{testimonial.title}</p>
                <p className="text-gray-400 text-xs mb-3">{testimonial.company}</p>

                {/* Stars */}
                <div className="flex gap-1 mb-3">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-200 text-sm leading-relaxed line-clamp-3">
                  "{testimonial.text}"
                </p>
                <p className="text-cyan-400 text-xs mt-2 font-medium">Click to read full testimonial →</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Testimonial Modal */}
    <TestimonialModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      testimonial={selectedTestimonial}
    />
    </>
  )
}

