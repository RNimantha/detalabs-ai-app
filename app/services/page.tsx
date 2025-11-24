"use client"

import { useState } from "react"
import {
  Brain,
  BarChart3,
  Zap,
  Cog,
  CheckCircle,
  Layout,
  TrendingUp,
  Database,
  Bot,
  MessageSquare,
  Code,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ServiceModal from "@/components/ServiceModal"

const services = [
  {
    id: "automation-ai-ops",
    title: "Automation & AI Ops",
    description: "Automate repetitive, time-consuming analytics tasks.",
    icon: Cog,
    color: "pink",
    details: [
      "Auto-generated reports",
      "Data quality checks",
      "Automated anomaly detection",
    ],
  },
  {
    id: "ai-analytics-saas",
    title: "AI-Powered Analytics SaaS",
    description: "Ready-to-use analytics tools built on top of your data.",
    icon: Zap,
    color: "yellow",
    details: [
      "Self-service dashboards",
      "Plug-and-play analytics modules",
      "No-code insights discovery",
    ],
  },
  {
    id: "customer-intelligence",
    title: "AI Customer Intelligence Platform",
    description: "An AI system that understands your customers and predicts behaviour.",
    icon: Bot,
    color: "teal",
    details: [
      "Customer segmentation",
      "Lifetime value prediction",
      "Personalized insights",
    ],
  },
  {
    id: "decision-intelligence",
    title: "Automated Decision Intelligence",
    description: "AI systems that make recommendations automatically.",
    icon: Zap,
    color: "red",
    details: [
      "Smart alerts & recommendations",
      "Marketing AI insights",
      "Finance & risk analytics modules",
    ],
  },
  {
    id: "data-assistant",
    title: "AI Data Assistant (Chat With Your Data)",
    description: "Conversational AI layer built on your company data.",
    icon: MessageSquare,
    color: "violet",
    details: [
      "Natural language queries",
      "Instant insights via chat",
      "Secure data-grounded responses",
    ],
  },
  {
    id: "custom-ai-saas",
    title: "Custom AI SaaS Development",
    description: "We build end-to-end AI SaaS products for enterprises.",
    icon: Code,
    color: "emerald",
    details: [
      "Data apps",
      "Internal AI tools",
      "White-label AI dashboards",
      "ML-powered SaaS platforms",
    ],
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "Custom web applications and websites built with modern technologies.",
    icon: Layout,
    color: "cyan",
    details: [
      "Responsive web design",
      "Full-stack development",
      "E-commerce solutions",
      "Progressive Web Apps (PWA)",
      "API development & integration",
      "Performance optimization",
    ],
  },
  {
    id: "business-intelligence",
    title: "Business Intelligence & Dashboards",
    description: "Turn data into real-time, actionable insights.",
    icon: BarChart3,
    color: "blue",
    details: [
      "Interactive dashboards (Power BI, Looker, Superset)",
      "KPI monitoring",
      "Automated reporting suites",
    ],
  },
  {
    id: "advanced-analytics",
    title: "Advanced Analytics & Data Insights",
    description: "Deep analytics to uncover patterns and opportunities.",
    icon: TrendingUp,
    color: "green",
    details: [
      "Customer journey analysis",
      "Revenue & profitability insights",
      "Cohort & funnel analysis",
    ],
  },
  {
    id: "ml-predictive",
    title: "Machine Learning & Predictive Modeling",
    description: "Use AI to predict outcomes and automate decision-making.",
    icon: Brain,
    color: "purple",
    details: [
      "Demand forecasting",
      "Customer churn prediction",
      "Lead scoring",
      "Price & inventory optimization",
    ],
  },
  {
    id: "data-science",
    title: "Data Science Solutions",
    description: "Custom AI models designed for your business.",
    icon: Brain,
    color: "indigo",
    details: [
      "Recommendation systems",
      "NLP & sentiment analysis",
      "Statistical modelling",
      "Text & document insights",
    ],
  },
  {
    id: "data-engineering",
    title: "Data Engineering & Infrastructure",
    description: "Reliable, scalable data foundation.",
    icon: Database,
    color: "orange",
    details: [
      "ETL/ELT pipelines",
      "Data warehouse & data lake setup",
      "Real-time data streaming",
      "API & database integrations",
    ],
  },
]

const colorClasses = {
  cyan: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  green: "bg-green-500/20 text-green-400 border-green-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  indigo: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  pink: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  teal: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  red: "bg-red-500/20 text-red-400 border-red-500/30",
  violet: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
}

export default function Services() {
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleServiceClick = (service: typeof services[0]) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedService(null), 300)
  }

  return (
    <div className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-cyan-400">Our Services</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Comprehensive AI & Analytics Solutions
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            We offer a full spectrum of AI services designed to transform your business operations and drive sustainable
            growth through intelligent automation and data-driven insights.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {services.map((service, index) => (
            <Card
              key={service.id}
              className={`group relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-500 cursor-pointer animate-slide-up hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30`}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => handleServiceClick(service)}
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-cyan-500/20 group-hover:via-purple-500/20 group-hover:to-blue-500/20 transition-all duration-500" />
              
              {/* Shine effect on hover - reduced opacity */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              <div className="relative z-10 p-6">
                {/* Icon with glow effect */}
                <div className="mb-6">
                  <div
                    className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${colorClasses[service.color as keyof typeof colorClasses]}`}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <service.icon className="h-8 w-8 relative z-10" />
                    <div className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 bg-current" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-6 leading-relaxed line-clamp-3">{service.description}</p>

                {/* Learn More Button */}
                <div className="mt-auto">
                  <button
                    className="w-full relative overflow-hidden rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-white/20 px-4 py-3 text-white font-medium transition-all duration-300 group-hover:from-cyan-500/30 group-hover:to-purple-500/30 group-hover:border-white/40 group-hover:shadow-lg group-hover:shadow-cyan-500/20"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleServiceClick(service)
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Learn More
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  </button>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </Card>
          ))}
        </div>

        {/* Process section */}
        <div className="mt-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Our Process</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              We follow a proven methodology to ensure successful AI implementation
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Discovery & Analysis",
                  description:
                    "We analyze your business needs, data, and objectives to design the optimal AI solution.",
                },
                {
                  step: "02",
                  title: "Development & Training",
                  description:
                    "Our experts develop and train custom AI models using your data and industry best practices.",
                },
                {
                  step: "03",
                  title: "Deployment & Support",
                  description: "We deploy your AI solution and provide ongoing support to ensure optimal performance.",
                },
              ].map((item, index) => (
                <div
                  key={item.step}
                  className={`text-center animate-fade-in`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-gray-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="mt-32 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-16 sm:px-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Ready to get started?</h2>
            <p className="mt-4 text-lg text-gray-300">Let's discuss how our AI services can transform your business</p>
            <div className="mt-8">
              <Button href="/contact" variant="primary" size="lg">
                Contact Us Today
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={
          selectedService
            ? {
                title: selectedService.title,
                description: selectedService.description,
                details: selectedService.details,
              }
            : null
        }
      />
    </div>
  )
}
