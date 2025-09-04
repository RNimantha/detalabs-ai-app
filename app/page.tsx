"use client"

import { ArrowRight, Brain, BarChart3, Zap, Cog, ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from 'react'

const features = [
  {
    name: "Machine Learning Models",
    description: "Custom ML models tailored to your business needs with state-of-the-art algorithms.",
    icon: Brain,
  },
  {
    name: "Data Analytics",
    description: "Transform raw data into actionable insights with advanced analytics and visualization.",
    icon: BarChart3,
  },
  {
    name: "AI SaaS Tools",
    description: "Ready-to-use AI-powered software solutions that scale with your business.",
    icon: Zap,
  },
  {
    name: "Intelligent Automation",
    description: "Automate complex workflows and processes with AI-driven intelligent systems.",
    icon: Cog,
  },
]

const stats = [
  { id: 1, name: "ML Models Deployed", value: "500+" },
  { id: 2, name: "Data Points Processed", value: "50M+" },
  { id: 3, name: "Happy Clients", value: "200+" },
  { id: 4, name: "Years of Experience", value: "4+" },
]

// Sample testimonials - replace with your actual data
const testimonials = [
  {
    id: 1,
    name: "Chamara Karunathilaka",
    title: "CEO at FHTS",
    company: "FHTS",
    rating: 5,
    text: "DetaLabs AI transformed our data analytics completely. Their machine learning models increased our prediction accuracy by 40% and saved us countless hours of manual analysis.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    title: "VP of Operations",
    company: "University of Toledo",
    rating: 5,
    text: "The AI automation solutions provided by DetaLabs have revolutionized our workflow. We've seen a 60% reduction in processing time and unprecedented accuracy in our operations.",
    avatar: "https://images.unsplash.com/photo1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Emily Watson",
    title: "Data Scientist",
    company: "Mortar AI",
    rating: 5,
    text: "Working with Nimantha and DetaLabs was a game-changer. Their expertise in AI and data science helped us unlock insights we never thought possible. Highly recommend their services!",
    avatar: "https://images.unsplash.com/phoo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "David Kim",
    title: "Founder & CEO",
    company: "StartupLab",
    rating: 5,
    text: "DetaLabs team didn't just deliver a solution; they delivered a competitive advantage. Their SaaS tools are intuitive, powerful, and have scaled perfectly with our growth.",
    avatar: "https://imaes.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    title: "Head of Analytics",
    company: "MetricsMax",
    rating: 5,
    text: "The team at DetaLabs understands both the technical and business sides of AI implementation. Their solutions are not just cutting-edge but also practical and results-driven.",
    avatar: "https://images.unslash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
  }
];

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
}

// Customer Feedback Carousel Component
function CustomerFeedbackCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] opacity-20" />
        
        {/* Glowing orbs */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            What Our <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Clients Say</span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={1}
          >
            Discover how we've helped businesses transform their operations with cutting-edge AI solutions
          </motion.p>
        </div>

        {/* Carousel Container */}
        <motion.div
          className="relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          custom={2}
        >
          {/* Main Testimonial */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 lg:p-12 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Quote Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Quote className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                {/* Stars */}
                <div className="flex justify-center lg:justify-start mb-4">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-xl lg:text-2xl text-gray-100 mb-8 leading-relaxed">
                  "{testimonials[currentIndex].text}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400/50"
                  />
                  <div>
                    <div className="text-lg font-semibold text-white">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-cyan-400 font-medium">
                      {testimonials[currentIndex].title}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {testimonials[currentIndex].company}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group"
          >
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </motion.div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-12 gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-400 scale-125'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Auto-play indicator */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            {isAutoPlaying ? 'Auto-playing' : 'Paused'} • Click to {isAutoPlaying ? 'pause' : 'resume'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          
          {/* Floating particles */}
          <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-60 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
          
          {/* Gradient orbs */}
          <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Moving lines */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-pulse" />
            <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 pt-20 pb-32 sm:pt-32 lg:flex lg:items-center lg:gap-x-12 lg:px-8 relative z-10">
          {/* Text Section */}
          <motion.div
            className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
              AI Solutions for the <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Future</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Transform your business with cutting-edge machine learning models, data analytics, AI SaaS tools, and
              intelligent automation solutions designed for modern enterprises.
            </p>
            <div className="mt-10 flex gap-x-6">
              <Button href="/services" variant="primary" size="lg">
                Explore Services
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                Book FREE Consultation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Illustration Section */}
          <motion.div
            className="relative mt-16 lg:mt-0 lg:flex-shrink-0 lg:w-[500px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* <Image
              src="hero_image.png"
              alt="AI Illustration"
              width={500}
              height={400}
              className="drop-shadow-xl relative z-20"
              priority
            /> */}
            {/* Enhanced animated glow */}
            <motion.div
              className="absolute -z-10 inset-0 rounded-full bg-gradient-to-r from-cyan-500/40 via-blue-500/40 to-purple-500/40 blur-3xl"
              animate={{ 
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.1, 1]
              }}
              transition={{ repeat: Infinity, duration: 4 }}
            />
            {/* Additional tech-like elements */}
            <div className="absolute -top-10 -right-10 w-20 h-20 border border-cyan-400/30 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute -bottom-10 -left-10 w-16 h-16 border border-purple-400/30 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
          </motion.div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Our Expertise</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to leverage AI
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            From custom machine learning models to intelligent automation, we provide comprehensive AI solutions that
            drive innovation and growth.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                className="relative pl-16"
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>

      {/* Customer Feedback Carousel */}
      <CustomerFeedbackCarousel />

      {/* Stats section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Trusted by industry leaders
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">Our track record speaks for itself</p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  className="flex flex-col bg-white p-8"
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                >
                  <dt className="text-sm font-semibold leading-6 text-gray-600">{stat.name}</dt>
                  <dd className="order-first text-3xl font-bold tracking-tight text-blue-600">{stat.value}</dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA section */}
     
{/* <div className="bg-slate-800">
  <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
    <div className="mx-auto max-w-2xl text-center">
      <motion.h2
        className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        Ready to transform your business with AI?
      </motion.h2>
      <motion.p
        className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        custom={1}
      >
        Let's discuss how our AI solutions can drive innovation and growth for your organization.
      </motion.p>
      <motion.div
        className="mt-10 flex items-center justify-center gap-x-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        custom={2}
      >
        <Button href="/contact" variant="secondary" size="lg" className="bg-cyan-400 text-slate-800 hover:bg-cyan-300">
          Get in touch
        </Button>
        <Button
          href="/services"
          variant="outline"
          size="lg"
          className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-800 bg-transparent"
        >
          Learn more
        </Button>
      </motion.div>
    </div>
  </div>
</div> */}


<div className="bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900">
  <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
    <div className="mx-auto max-w-2xl text-center">
      <motion.h2
        className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        Ready to transform your business with AI?
      </motion.h2>
      <motion.p
        className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-200"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        custom={1}
      >
        Let's discuss how our AI solutions can drive innovation and growth for your organization.
      </motion.p>
      <motion.div
        className="mt-10 flex items-center justify-center gap-x-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        custom={2}
      >
        <Button href="/contact" variant="secondary" size="lg" className="bg-cyan-400 text-slate-800 hover:bg-cyan-300">
          Book FREE Consultation
        </Button>
        {/* <Button
          href="/services"
          variant="outline"
          size="lg"
          className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-800 bg-transparent"
        >
          Learn more
        </Button> */}
      </motion.div>
    </div>
  </div>
</div>


{/* <div className="bg-slate-900">
  <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
    <div className="mx-auto max-w-2xl text-center">
      <motion.h2
        className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        Ready to transform your business with AI?
      </motion.h2>
      <motion.p
        className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-400"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        custom={1}
      >
        Let's discuss how our AI solutions can drive innovation and growth for your organization.
      </motion.p>
      <motion.div
        className="mt-10 flex items-center justify-center gap-x-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        custom={2}
      >
        <Button href="/contact" variant="secondary" size="lg" className="bg-cyan-400 text-slate-900 hover:bg-cyan-300">
          Get in touch
        </Button>
        <Button
          href="/services"
          variant="outline"
          size="lg"
          className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
        >
          Learn more
        </Button>
      </motion.div>
    </div>
  </div>
</div> */}
    </div>
  )
}