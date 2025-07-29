import { ArrowRight, Brain, BarChart3, Zap, Cog } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  { id: 2, name: "Data Points Processed", value: "10B+" },
  { id: 3, name: "Happy Clients", value: "200+" },
  { id: 4, name: "Years of Experience", value: "8+" },
]

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-purple-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              AI Solutions for the <span className="text-blue-600">Future</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Transform your business with cutting-edge machine learning models, data analytics, AI SaaS tools, and
              intelligent automation solutions designed for modern enterprises.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button href="/services" variant="primary" size="lg">
                Explore Services
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-600 to-purple-600 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
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
              <div
                key={feature.name}
                className={`relative pl-16 animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

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
                <div
                  key={stat.id}
                  className={`flex flex-col bg-white p-8 animate-scale-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <dt className="text-sm font-semibold leading-6 text-gray-600">{stat.name}</dt>
                  <dd className="order-first text-3xl font-bold tracking-tight text-blue-600">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-blue-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your business with AI?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Let's discuss how our AI solutions can drive innovation and growth for your organization.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button href="/contact" variant="secondary" size="lg">
                Get in touch
              </Button>
              <Button
                href="/services"
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
