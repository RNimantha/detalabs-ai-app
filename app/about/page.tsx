import { Users, Target, Award, Lightbulb } from "lucide-react"
import {Card} from "@/components/ui/card"


const values = [
  {
    name: "Innovation",
    description:
      "We push the boundaries of what's possible with AI, constantly exploring new technologies and methodologies.",
    icon: Lightbulb,
  },
  {
    name: "Excellence",
    description: "We deliver high-quality solutions that exceed expectations and drive measurable business results.",
    icon: Award,
  },
  {
    name: "Collaboration",
    description:
      "We work closely with our clients as partners, ensuring solutions align with their unique needs and goals.",
    icon: Users,
  },
  {
    name: "Impact",
    description: "We focus on creating AI solutions that make a real difference in how businesses operate and grow.",
    icon: Target,
  },
]

const team = [
  {
    name: "Nimantha Bandara",
    role: "CEO & Founder",
    bio: "Former FHTS AI researcher with 10+ years in machine learning and deep learning. Msc in AI and Data Science in Sri J'Pura University.",
    image: "/nimantha.jpeg?height=500&width=300",
  },
  {
    name: "Dishara Hettiarachchi",
    role: "CTO & Co-Founder",
    bio: " Principal Engineer specializing in scalable AI systems. Msc in AI and Data Science in Sri J'Pura University.",
    image: "/dishara.jpeg?height=800&width=300",
  },
  // {
  //   name: "Dr. Emily Watson",
  //   role: "Head of Data Science",
  //   bio: "Former Netflix data scientist with expertise in recommendation systems and predictive analytics. PhD in Statistics.",
  //   image: "/IMG_8324.PNG?height=300&width=300",
  // },
  // {
  //   name: "David Kim",
  //   role: "Head of Engineering",
  //   bio: "Former Amazon senior engineer with 8+ years building large-scale distributed systems and ML infrastructure.",
  //   image: "/IMG_8324.PNG?height=300&width=300",
  // },
]

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-100/20 px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <p className="text-base font-semibold leading-7 text-blue-600">About DetaLabs AI</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Pioneering the Future of AI
                </h1>
                <p className="mt-6 text-xl leading-8 text-gray-700">
                  Founded in 2021, DetaLabs AI has been at the forefront of artificial intelligence innovation, helping
                  businesses transform their operations through cutting-edge AI solutions.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                <p>
                  Our journey began with a simple yet ambitious vision: to democratize artificial intelligence and make
                  it accessible to businesses of all sizes. What started as a small team of passionate AI researchers
                  has grown into a leading AI consultancy serving Fortune 500 companies and innovative startups alike.
                </p>
                <p className="mt-8">
                  We specialize in developing custom machine learning models, advanced data analytics platforms,
                  AI-powered SaaS solutions, and intelligent automation systems. Our multidisciplinary team combines
                  deep technical expertise with business acumen to deliver solutions that drive real-world impact.
                </p>
              </div>
            </div>
            <div className="lg:pl-8">
              <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                <p>
                  Today, we're proud to have deployed over 500 machine learning models, processed billions of data
                  points, and helped our clients achieve measurable improvements in efficiency, accuracy, and
                  innovation. Our commitment to excellence and continuous learning ensures we stay at the cutting edge
                  of AI technology.
                </p>
                <p className="mt-8">
                  As we look to the future, we remain dedicated to pushing the boundaries of what's possible with AI
                  while maintaining our core values of innovation, excellence, collaboration, and impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Our Values</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">What drives us forward</p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our core values guide everything we do, from how we approach problems to how we work with our clients.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {values.map((value, index) => (
              <div
                key={value.name}
                className={`flex flex-col animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <value.icon className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                  {value.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{value.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Team section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Leadership Team</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Meet the experts behind DetaLabs AI's success. Our leadership team brings together decades of experience in
              AI research, engineering, and business strategy.
            </p>
          </div>
          <ul
            role="list"
            className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-2"
          >
            {team.map((person, index) => (
              <li key={person.name} className={`animate-fade-in`} style={{ animationDelay: `${index * 0.1}s` }}>
                <Card>
                  <img
                    className="aspect-[3/2] w-full rounded-2xl object-cover"
                    src={person.image || "/placeholder.svg"}
                    alt={person.name}
                  />
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">{person.name}</h3>
                    <p className="text-base leading-7 text-blue-600">{person.role}</p>
                    <p className="mt-4 text-base leading-7 text-gray-600">{person.bio}</p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Stats section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our Impact in Numbers</h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">The results speak for themselves</p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {[
                { id: 1, name: "Years of Experience", value: "4+" },
                { id: 2, name: "ML Models Deployed", value: "500+" },
                { id: 3, name: "Happy Clients", value: "200+" },
                { id: 4, name: "Team Members", value: "10+" },
              ].map((stat, index) => (
                <div
                  key={stat.id}
                  className={`flex flex-col bg-gray-50 p-8 animate-scale-in`}
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
    </div>
  )
}
