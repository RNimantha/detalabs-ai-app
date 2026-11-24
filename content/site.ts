export const site = {
  name: "DetaLabs AI",
  description:
    "One team to build your AI and machine learning systems, turn your data into decisions, ship your web product, and run your marketing. Based in Colombo, Sri Lanka.",
  email: "info@detalabsai.com",
  phone: "+94 74 195 7668",
  location: "Colombo, Sri Lanka",
  consultation: "Book a consultation",
  exploreProduct: "Explore StelVoice",
  nav: [
    { label: "StelVoice", href: "/products/stelvoice" },
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
  ],
  footer: "Build it. Ship it. Grow it.",
  footerDescription:
    "AI engineering, data science, marketing, and web development. Connected by one team.",
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  servicesLabel: "Services",
  productsLabel: "Products",
  menuOpen: "Open navigation",
  menuClose: "Close navigation",
  skip: "Skip to content",
  rights: "All rights reserved.",
} as const;
export const services = [
  {
    slug: "ai-engineering",
    title: "AI Engineering",
    intro: "Turn your data and workflows into systems your team can use.",
    capabilities: [
      "LLM fine-tuning & RAG systems",
      "AI agents & multi-agent systems",
      "Custom machine learning models",
      "MLOps & production deployment",
    ],
    link: "Explore AI engineering",
    icon: "engineering",
  },
  {
    slug: "data-science",
    title: "Data Science & Machine Learning",
    intro: "Turn your data into forecasts, insights, and decisions you can trust.",
    capabilities: [
      "Predictive modelling & forecasting",
      "Data analysis & business insights",
      "Computer vision & NLP models",
      "Data pipelines & dashboards",
    ],
    link: "Explore data science & ML",
    icon: "data",
  },
  {
    slug: "ai-marketing",
    title: "AI Marketing",
    intro: "Connect your message to the right audience, then learn what works.",
    capabilities: [
      "Advertising & campaign management",
      "Content creation",
      "Audience targeting",
      "Performance analytics",
    ],
    link: "Explore AI marketing",
    icon: "marketing",
  },
  {
    slug: "web-development",
    title: "Web Development",
    intro: "Take your product from the first sketch to a working launch.",
    capabilities: [
      "Marketing websites",
      "Custom web applications",
      "SaaS product development",
      "Launch & ongoing support",
    ],
    link: "Explore web development",
    icon: "web",
  },
] as const;
export type Service = (typeof services)[number];
export type CaseStudy = {
  title: string;
  category: string;
  problem: string;
  built: string;
  outcome: string;
};
export const caseStudies: CaseStudy[] = [
  {
    title: "Knowledge retrieval system",
    category: "AI Engineering",
    problem: "[CLIENT PROBLEM]",
    built: "[APPROVED PROJECT DESCRIPTION]",
    outcome: "[CLIENT RESULT]",
  },
  {
    title: "Performance marketing campaign",
    category: "AI Marketing",
    problem: "[CLIENT PROBLEM]",
    built: "[APPROVED PROJECT DESCRIPTION]",
    outcome: "[CLIENT RESULT]",
  },
  {
    title: "Web product launch",
    category: "Web Development",
    problem: "[CLIENT PROBLEM]",
    built: "[APPROVED PROJECT DESCRIPTION]",
    outcome: "[CLIENT RESULT]",
  },
];
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  status: "sample" | "approved";
};
// Restored from the previous homepage, where these entries were explicitly sample data.
export const testimonials: Testimonial[] = [
  {
    name: "Chamara Silva",
    role: "CEO at FlexiTech",
    quote:
      "DetaLabs AI transformed our data analytics completely. Their machine learning models increased our prediction accuracy by 40% and saved us countless hours of manual analysis.",
    status: "sample",
  },
  {
    name: "Michael Rodriguez",
    role: "VP of Operations at University of Toledo",
    quote:
      "The AI automation solutions provided by DetaLabs have revolutionized our workflow. We've seen a 60% reduction in processing time and unprecedented accuracy in our operations.",
    status: "sample",
  },
  {
    name: "Emily Watson",
    role: "Data Scientist at FlexiTech AI",
    quote:
      "Working with Nimantha and DetaLabs was a game-changer. Their expertise in AI and data science helped us unlock insights we never thought possible. Highly recommend their services!",
    status: "sample",
  },
  {
    name: "David Kim",
    role: "Founder & CEO at StartupLab",
    quote:
      "DetaLabs team didn't just deliver a solution; they delivered a competitive advantage. Their SaaS tools are intuitive, powerful, and have scaled perfectly with our growth.",
    status: "sample",
  },
  {
    name: "Lisa Thompson",
    role: "Head of Analytics at MetricsMax",
    quote:
      "The team at DetaLabs understands both the technical and business sides of AI implementation. Their solutions are not just cutting-edge but also practical and results-driven.",
    status: "sample",
  },
];
export const home = {
  basedIn: "Based in Colombo, Sri Lanka",
  servingWorld: "Serving clients worldwide",
  eyebrow: "AI & DIGITAL STUDIO",
  headline: "Build the AI. Ship the product. Grow the business.",
  subhead:
    "AI engineering, data science & machine learning, AI marketing, and web development — one team connecting your idea to the people who need it.",
  heroNote: "From a focused first project to a full product launch.",
  diagramLabel: "How our services connect",
  diagramCenter: "Your business",
  diagramCaption: "One team. A connected approach.",
  diagramNodes: ["Intelligence", "Product", "Growth"],
  servicesEyebrow: "FOUR DISCIPLINES. ONE TEAM.",
  servicesTitle: "Everything your next idea needs.",
  servicesIntro:
    "Bring us a specific challenge or a product to build. We connect the technical work with the way it reaches your customers.",
  productEyebrow: "OUR OWN SAAS PRODUCT",
  productTitle: "Meet StelVoice.",
  productDescription:
    "AI sales conversation intelligence for real estate teams. Turn recorded calls into transcripts, verified project claims, KPI scorecards, and practical coaching.",
  productBenefits: [
    "Review call quality with shared KPI scorecards.",
    "Check sales claims against approved project facts.",
    "Turn customer needs and objections into useful coaching.",
  ],
  productLink: "Explore StelVoice",
  productVideoLabel: "StelVoice product video",
  productVideoSrc: "/stelvoice/stelvoice-hero.mp4",
  productVideoPoster: "/stelvoice/stelvoice-hero-poster.jpg",
  productVideoFallback: "Watch the StelVoice product video",
  productImageLabel: "StelVoice preview",
  productImageNote: "Illustrative application screen · Sample data",
  workEyebrow: "SELECTED WORK",
  workTitle: "The thinking behind the build.",
  workIntro:
    "Example case-study slots. These are placeholders, not completed projects or client results.",
  workLink: "View all work",
  placeholder: "PLACEHOLDER CASE STUDY",
  problem: "The problem",
  built: "What we built",
  outcome: "The outcome",
  processEyebrow: "HOW WE WORK",
  processTitle: "A clear path from idea to launch.",
  steps: [
    {
      title: "Discover",
      description:
        "Understand your goals, your users, and the constraints. Agree on what success should look like.",
    },
    {
      title: "Design",
      description:
        "Map the experience and technical approach. Test the important assumptions before building.",
    },
    {
      title: "Build & launch",
      description:
        "Deliver in focused stages, review together, and prepare the product for real use.",
    },
    {
      title: "Support & grow",
      description:
        "Monitor, maintain, and improve. Use feedback to decide what comes next.",
    },
  ],
  techEyebrow: "TOOLS TO FIT THE TASK",
  techTitle: "Built around your needs.",
  techDescription:
    "We select the stack around the problem, your existing systems, and the way your team works. Tools below illustrate the technologies in our service scope; they are not partner endorsements.",
  technologies: [
    "OpenAI",
    "Anthropic",
    "Hugging Face",
    "PyTorch",
    "Next.js",
    "GCP",
    "Azure",
  ],
  industriesTitle: "Your industry. Your context.",
  industriesDescription:
    "We start with how your business operates, then shape the work around it.",
  industriesNote: "[TODO: Confirm industries served and target markets.]",
  testimonialsTitle: "What our clients say",
  testimonialsPause: "Pause scrolling",
  testimonialsResume: "Resume scrolling",
  testimonialsSampleNote:
    "These entries are restored sample content from the previous website. Names, affiliations, and results have not been verified as client feedback.",
  ctaTitle: "Have a challenge worth solving?",
  ctaDescription:
    "Tell us what you want to build, improve, or bring to market.",
} as const;
