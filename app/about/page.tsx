"use client"

import { Users, Target, Award, Lightbulb, Github as GitHub, Linkedin as LinkedIn } from "lucide-react"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import Image from "next/image"

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
}

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
    role: "Founder & CEO",
    bio: "Current FHTS AI Consultant with 6+ years in machine learning and deep learning. Msc in AI and Data Science in Sri J'Pura University.",
    image: "/nimantha.jpg?height=500&width=300",
    link: "https://nimantha.detalabsai.com/",
    github: "https://github.com/RNimantha",
    linkedin: "https://www.linkedin.com/in/nimantha-bandara-986192132/",
  },
  {
    name: "Dishara Hettiarachchi",
    role: "CTO & Co-Founder",
    bio: "Principal Engineer specializing in scalable AI systems. Msc in AI and Data Science in Sri J'Pura University.",
    image: "/dishara.jpeg?height=800&width=300",
    link: "https://www.linkedin.com/in/disharahettiarachchi/",
    github: "",
    linkedin: "https://www.linkedin.com/in/disharahettiarachchi/",
  },
]

export default function About() {
  return (
    <div className="relative z-10">
      {/* Hero section */}
      <div className="relative overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <motion.div
              className="lg:pr-4"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <h2 className="text-base font-semibold leading-7 text-cyan-400">About DetaLabs AI</h2>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Pioneering the Future of AI
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-300">
                Founded in 2021, DetaLabs AI has been at the forefront of artificial intelligence innovation, helping
                businesses transform their operations through cutting-edge AI solutions.
              </p>
            </motion.div>

            <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <motion.div
                className="lg:pr-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={1}
              >
                <p className="text-base leading-7 text-gray-300">
                  Our journey began with a simple yet ambitious vision: to democratize artificial intelligence and make
                  it accessible to businesses of all sizes. What started as a small team of passionate AI researchers
                  has grown into a leading AI consultancy serving Fortune 500 companies and innovative startups alike.
                </p>
                <p className="mt-8 text-base leading-7 text-gray-300">
                  We specialize in developing custom machine learning models, advanced data analytics platforms,
                  AI-powered SaaS solutions, and intelligent automation systems. Our multidisciplinary team combines
                  deep technical expertise with business acumen to deliver solutions that drive real-world impact.
                </p>
              </motion.div>
              <motion.div
                className="lg:pl-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={2}
              >
                <p className="text-base leading-7 text-gray-300">
                  Today, we're proud to have deployed over 500 machine learning models, processed billions of data
                  points, and helped our clients achieve measurable improvements in efficiency, accuracy, and
                  innovation. Our commitment to excellence and continuous learning ensures we stay at the cutting edge
                  of AI technology.
                </p>
                <p className="mt-8 text-base leading-7 text-gray-300">
                  As we look to the future, we remain dedicated to pushing the boundaries of what's possible with AI
                  while maintaining our core values of innovation, excellence, collaboration, and impact.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-cyan-400">Our Values</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">What drives us forward</p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Our core values guide everything we do, from how we approach problems to how we work with our clients.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {values.map((value, index) => (
              <motion.div
                key={value.name}
                className="relative pl-16"
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500">
                    <value.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {value.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                  <p className="flex-auto">{value.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>

      {/* Stats section */}
      <div className="relative z-10 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Our Impact in Numbers</h2>
              <p className="mt-4 text-lg leading-8 text-gray-300">The results speak for themselves</p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {[
                { id: 1, name: "Years of Experience", value: "4+" },
                { id: 2, name: "ML Models Deployed", value: "500+" },
                { id: 3, name: "Happy Clients", value: "200+" },
                { id: 4, name: "Team Members", value: "10+" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.id}
                  className="flex flex-col bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8"
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

      {/* Team section */}
      <div className="relative z-10 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Our Leadership Team</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Meet the experts behind DetaLabs AI's success. Our leadership team brings together decades of experience in
              AI research, engineering, and business strategy.
            </p>
          </div>
          <ul
            role="list"
            className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          >
            {team.map((person, index) => (
              <motion.li
                key={person.name}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={index}
              >
                <Card className="bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden">
                  <div className="relative h-64 w-full">
                    <Image
                      src={person.image || "/placeholder.svg"}
                      alt={person.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold leading-8 tracking-tight text-white">
                      <a
                        href={person.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400 transition-colors"
                      >
                        {person.name}
                      </a>
                    </h3>
                    <p className="text-base leading-7 text-cyan-400">{person.role}</p>
                    <p className="mt-4 text-base leading-7 text-gray-300">{person.bio}</p>
                    <div className="mt-6 flex space-x-4">
                      {person.github && (
                        <a
                          href={person.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <GitHub className="h-6 w-6" />
                        </a>
                      )}
                      {person.linkedin && (
                        <a
                          href={person.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-cyan-400 transition-colors"
                        >
                          <LinkedIn className="h-6 w-6" />
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
