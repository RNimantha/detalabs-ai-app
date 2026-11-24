export type FAQItem = { question: string; answer: string };
export const pageLabels = {
  problems: "Problems we solve",
  capabilities: "What we can build",
  process: "How we approach it",
  faq: "Questions, answered",
  serviceEyebrow: "OUR SERVICES",
  servicesTitle: "Build, launch, and grow with one team.",
  servicesDescription:
    "Choose the support you need today. Connect the other disciplines as your project develops.",
};
export const serviceDetails: Record<
  string,
  {
    description: string;
    problems: string[];
    process: string[];
    faqs: FAQItem[];
  }
> = {
  "ai-engineering": {
    description:
      "Build AI around the information, decisions, and workflows that matter to your business.",
    problems: [
      "Useful knowledge is scattered across documents and systems.",
      "Teams repeat tasks that could benefit from an AI assistant.",
      "A promising model or prototype needs a dependable path to production.",
    ],
    process: [
      "Review your data, workflows, and evaluation criteria.",
      "Prototype the approach and test it against representative tasks.",
      "Integrate, evaluate, and deploy with monitoring and human oversight.",
    ],
    faqs: [
      {
        question: "Do we need to fine-tune a model?",
        answer:
          "Not always. We assess prompting, retrieval, and fine-tuning against your task, data, and budget before choosing an approach.",
      },
      {
        question: "Can you work with our existing systems?",
        answer:
          "We review your APIs, data sources, access requirements, and deployment environment during discovery.",
      },
      {
        question: "How do you evaluate an AI system?",
        answer:
          "We agree on representative test cases and acceptance criteria, including incorrect answers, latency, cost, and situations that need human review.",
      },
      {
        question: "Can you build multi-agent systems?",
        answer:
          "Yes. We scope the agents, their tools, coordination, and operational controls around the workflow. We use multiple agents when the task benefits from them.",
      },
    ],
  },
  "ai-marketing": {
    description:
      "Plan and run campaigns with a clear message, relevant targeting, and reporting your team can act on.",
    problems: [
      "Campaigns lack a clear connection between audience, message, and offer.",
      "Content production is taking time away from testing and learning.",
      "Reporting shows activity without explaining what to change next.",
    ],
    process: [
      "Review your offer, audience, channels, and measurement setup.",
      "Develop campaign concepts, content, and a testing plan.",
      "Launch, review performance, and adjust using the available evidence.",
    ],
    faqs: [
      {
        question: "What does AI add to the marketing process?",
        answer:
          "AI can support content development, audience analysis, and campaign review. Strategy, approvals, and decisions remain accountable to people.",
      },
      {
        question: "Can you manage an existing campaign?",
        answer:
          "We can review the account, creative, tracking, and campaign goals before agreeing on a management scope.",
      },
      {
        question: "Is advertising spend included?",
        answer:
          "Media spend and service fees will be set out separately in your proposal so the budget is clear.",
      },
      {
        question: "Can you guarantee results?",
        answer:
          "No. Results depend on the offer, audience, budget, market, and execution. We agree on useful measures and a review process rather than promise a return.",
      },
    ],
  },
  "web-development": {
    description:
      "Design and develop marketing sites, web applications, and SaaS products from the first requirements to launch.",
    problems: [
      "Your website does not clearly explain your offer or guide visitors to act.",
      "A product idea needs a focused first release.",
      "Disconnected tools and manual steps make a web workflow harder than it needs to be.",
    ],
    process: [
      "Define the users, journeys, requirements, and launch scope.",
      "Design the interface and build the product in reviewable stages.",
      "Test accessibility and core flows, launch, and plan ongoing support.",
    ],
    faqs: [
      {
        question: "Can you build both the interface and backend?",
        answer:
          "Yes. We scope the interface, application logic, data storage, integrations, and hosting together.",
      },
      {
        question: "Can you improve an existing website?",
        answer:
          "We can assess your current code and user journeys, then propose a targeted improvement or a rebuild where justified.",
      },
      {
        question: "How long does a project take?",
        answer:
          "Timing depends on scope, integrations, content readiness, and review cycles. We provide a delivery plan after discovery.",
      },
      {
        question: "What happens after launch?",
        answer:
          "We can agree on maintenance, monitoring, fixes, and further development as a separate support scope.",
      },
    ],
  },
};
export const about = {
  title: "One team, from the first idea to what comes next.",
  eyebrow: "ABOUT DETALABS AI",
  description:
    "DetaLabs AI is a studio based in Colombo, Sri Lanka. We bring AI engineering, marketing, and web development together so the technical work and the way it reaches people can move in the same direction.",
  heading: "Connected work. Clear decisions.",
  paragraphs: [
    "A useful AI system needs a way into your workflow. A web product needs a clear experience. A campaign needs an offer that delivers. We work across these connections.",
    "We start by understanding the problem and agreeing on a focused scope. Then we design, build, and review the work with you, keeping decisions tied to your goals.",
  ],
  productHeading: "We build products, too.",
  productDescription:
    "StelVoice is our AI sales conversation intelligence platform for real estate teams. It brings together recorded-call analysis, project claim verification, KPI scoring, and coaching.",
  productLink: "Explore StelVoice",
};
export const work = {
  title: "Work, with the context behind it.",
  eyebrow: "CASE STUDIES",
  description:
    "These three entries are editorial placeholders. They do not represent completed client projects. Approved project details and results will replace them.",
};
export const legal = {
  privacy: {
    title: "Privacy policy",
    description:
      "Draft privacy notice for DetaLabs AI. Legal review and operational details are pending.",
    sections: [
      {
        title: "Draft notice — TODO",
        text: "This is placeholder legal text, not a completed privacy policy. TODO: Confirm the legal entity, effective date, applicable laws, and contact for privacy requests.",
      },
      {
        title: "Information you submit",
        text: "The consultation form requests your name, email, company, service interest, budget range, and message. TODO: Confirm lawful basis, purposes, retention periods, and how access and deletion requests are handled.",
      },
      {
        title: "Service providers and cookies",
        text: "TODO: Confirm hosting, database, email providers, international transfers, analytics, and any cookies or consent requirements before publishing this notice as final.",
      },
    ],
  },
  terms: {
    title: "Terms of use",
    description:
      "Draft website terms for DetaLabs AI. Legal review is pending.",
    sections: [
      {
        title: "Draft terms — TODO",
        text: "This is placeholder legal text, not final terms. TODO: Confirm the contracting entity, effective date, governing law, and dispute resolution process with legal counsel.",
      },
      {
        title: "Website information and inquiries",
        text: "The website describes services and invites inquiries. Project scope, fees, delivery terms, intellectual property, and support should be agreed in a separate written agreement. TODO: Review and approve this wording.",
      },
      {
        title: "Product terms and responsibilities",
        text: "TODO: Add approved terms for permitted use, third-party services, liability, and intellectual property. StelVoice requires confirmed product-specific terms before accepting subscriptions.",
      },
    ],
  },
};
export const notFoundContent = {
  eyebrow: "404 · PAGE NOT FOUND",
  title: "This page isn’t here.",
  description:
    "The address may have changed. Head back to the home page or tell us what you’re looking for.",
  link: "Back to home",
};
export const blog = {
  title: "Notes on AI, products, and growth.",
  eyebrow: "THE DETALABS AI BLOG",
  description: "Articles and perspectives from the studio.",
  empty: "No articles are available yet. Check back for new posts.",
  unavailable: "Articles are temporarily unavailable. Please try again later.",
  back: "Back to blog",
  read: "Read article",
};
export const contact = {
  formEyebrow: "START A CONVERSATION",
  formTitle: "Tell us about your project.",
  formDescription:
    "A few details will help us understand what you need and prepare for our conversation.",
  requiredNote:
    "* Required fields. Not sure about a budget? Choose “Not decided”.",
  messageHint:
    "Include your goals, timeline, and any existing tools or systems.",
  eyebrow: "LET’S TALK",
  title: "What would you like to build?",
  description:
    "Share the challenge, the context, and where you want to go. We’ll use your details to follow up on your inquiry.",
  fields: {
    name: "Name",
    email: "Email",
    company: "Company (optional)",
    service: "Service interest",
    budget: "Budget range (USD)",
    message: "Tell us about your project (optional)",
  },
  services: [
    "AI Engineering",
    "AI Marketing",
    "Web Development",
    "StelVoice",
    "Not sure yet",
  ],
  budgets: [
    "Not decided",
    "Under $5,000",
    "$5,000–$15,000",
    "$15,000–$50,000",
    "$50,000+",
  ],
  choose: "Select a service",
  chooseBudget: "Select a budget range",
  submit: "Send inquiry",
  pending: "Sending…",
  success: "Your inquiry has been saved. Thank you for getting in touch.",
  error:
    "We couldn’t send your inquiry. Please try again or email info@detalabsai.com.",
  invalid: "Please check the highlighted fields.",
  privacy: "Read how we handle your information in our",
  privacyLink: "privacy policy",
  required: "Required",
  emailError: "Enter a valid email address.",
  messageError: "Please keep this under 5,000 characters.",
  nameError: "Please enter a name between 2 and 100 characters.",
  serviceError: "Choose one of the listed services.",
  budgetError: "Choose one of the listed budget ranges.",
  companyError: "Use 200 characters or fewer.",
  unavailable:
    "We can’t accept your inquiry right now. Please email info@detalabsai.com.",
  oversized: "Your submission is too large.",
  invalidBody: "Invalid submission.",
};
