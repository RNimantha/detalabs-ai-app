"use client"

import { ArrowRight, Brain, BarChart3, Zap, Cog, Star, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Image from "next/image"
import TestimonialMarquee from "@/components/TestimonialMarquee"

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
    name: "Chamara Silva",
    handle: "chamarasilva",
    title: "CEO at FlexiTech",
    company: "FlexiTech",
    rating: 5,
    text: "DetaLabs AI transformed our data analytics completely. Their machine learning models increased our prediction accuracy by 40% and saved us countless hours of manual analysis.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    handle: "mrodriguez",
    title: "VP of Operations",
    company: "University of Toledo",
    rating: 5,
    text: "The AI automation solutions provided by DetaLabs have revolutionized our workflow. We've seen a 60% reduction in processing time and unprecedented accuracy in our operations.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Emily Watson",
    handle: "emilywatson",
    title: "Data Scientist",
    company: "FlexiTech AI",
    rating: 5,
    text: "Working with Nimantha and DetaLabs was a game-changer. Their expertise in AI and data science helped us unlock insights we never thought possible. Highly recommend their services!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "David Kim",
    handle: "davidkim",
    title: "Founder & CEO",
    company: "StartupLab",
    rating: 5,
    text: "DetaLabs team didn't just deliver a solution; they delivered a competitive advantage. Their SaaS tools are intuitive, powerful, and have scaled perfectly with our growth.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    handle: "lisathompson",
    title: "Head of Analytics",
    company: "MetricsMax",
    rating: 5,
    text: "The team at DetaLabs understands both the technical and business sides of AI implementation. Their solutions are not just cutting-edge but also practical and results-driven.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
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

// Customer Feedback Marquee Component
function CustomerFeedbackCarousel() {
  return (
    <div className="relative py-24 overflow-hidden">
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

        {/* Testimonial Marquee */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          custom={2}
        >
          <TestimonialMarquee testimonials={testimonials} speed={50} />
        </motion.div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-32 sm:pt-32 lg:px-8 relative z-10">
          {/* Text Section - Centered */}
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
              AI That Moves Your Business Forward
              <span className="block mt-2 text-base sm:text-lg font-normal text-cyan-400">
                Powered by <span className="text-cyan-300">DetaLabs AI</span>
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 max-w-3xl mx-auto">
              From predictive analytics to automated intelligence, we build scalable, enterprise-grade AI solutions that deliver measurable results and long-term value.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button href="/services" variant="primary" size="lg">
                Explore Services
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                Book FREE Consultation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32 relative z-10">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-cyan-400">Our Expertise</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to leverage AI
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
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
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-300">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
        
        {/* Explore More Services Button */}
        <motion.div
          className="mt-16 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          custom={4}
        >
          <Button
            href="/services"
            variant="primary"
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300"
          >
            Explore More Services
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>

      {/* Customer Feedback Carousel */}
      <CustomerFeedbackCarousel />

      {/* Stats section */}
      <div className="relative z-10 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Trusted by industry leaders
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-300">Our track record speaks for itself</p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  className="flex flex-col bg-white/10 backdrop-blur-md border border-white/20 p-8"
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                >
                  <dt className="text-sm font-semibold leading-6 text-gray-300">{stat.name}</dt>
                  <dd className="order-first text-3xl font-bold tracking-tight text-cyan-400">{stat.value}</dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="relative z-10">
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
        className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300"
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
          Book FREE Consultation
        </Button>
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