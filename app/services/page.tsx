import { Brain, BarChart3, Zap, Cog, CheckCircle } from "lucide-react"
import {Card} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const services = [
  {
    id: "ml-models",
    title: "Machine Learning Models",
    description: "Custom ML models tailored to your specific business needs and challenges.",
    icon: Brain,
    features: [
      "Predictive Analytics",
      "Natural Language Processing",
      "Computer Vision",
      "Recommendation Systems",
      "Anomaly Detection",
      "Time Series Forecasting",
    ],
    color: "blue",
  },
  {
    id: "data-analytics",
    title: "Data Analytics",
    description: "Transform raw data into actionable insights with advanced analytics.",
    icon: BarChart3,
    features: [
      "Business Intelligence",
      "Real-time Dashboards",
      "Statistical Analysis",
      "Data Visualization",
      "Performance Metrics",
      "Trend Analysis",
    ],
    color: "green",
  },
  {
    id: "ai-saas",
    title: "AI SaaS Tools",
    description: "Ready-to-use AI-powered software solutions that scale with your business.",
    icon: Zap,
    features: [
      "Chatbots & Virtual Assistants",
      "Document Processing",
      "Image Recognition",
      "Sentiment Analysis",
      "Content Generation",
      "Process Automation",
    ],
    color: "purple",
  },
  {
    id: "ai-automation",
    title: "Intelligent Automation",
    description: "Automate complex workflows and processes with AI-driven systems.",
    icon: Cog,
    features: [
      "Workflow Optimization",
      "Decision Automation",
      "Quality Control",
      "Resource Planning",
      "Risk Assessment",
      "Compliance Monitoring",
    ],
    color: "orange",
  },
]

const colorClasses = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
}

export default function Services() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Our Services</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Comprehensive AI Solutions</p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We offer a full spectrum of AI services designed to transform your business operations and drive sustainable
            growth through intelligent automation and data-driven insights.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {services.map((service, index) => (
            <Card key={service.id} hover className={`animate-slide-up`} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center space-x-4 mb-6">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg flex-shrink-0 ${colorClasses[service.color as keyof typeof colorClasses]}`}
                >
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
              </div>

              <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>

              <div className="space-y-3 mb-8">
                <h4 className="font-medium text-gray-900">Key Features:</h4>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                <Button href="/contact" variant="outline" className="w-full bg-transparent">
                  Learn More
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Process section */}
        <div className="mt-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Process</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
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
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="mt-32 bg-gray-50 rounded-2xl px-6 py-16 sm:px-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Ready to get started?</h2>
            <p className="mt-4 text-lg text-gray-600">Let's discuss how our AI services can transform your business</p>
            <div className="mt-8">
              <Button href="/contact" variant="primary" size="lg">
                Contact Us Today
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
