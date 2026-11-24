export const stelvoice = {
  name: "StelVoice",
  path: "/products/stelvoice",
  signInUrl: process.env.NEXT_PUBLIC_STELVOICE_SIGN_IN_URL || "",
  metaTitle: "StelVoice | AI Sales Conversation Intelligence for Real Estate",
  metaDescription:
    "Analyse real estate sales calls with AI transcripts, project claim verification, KPI scoring, coaching, and team insights. Book a StelVoice demo.",
  eyebrow: "AI SALES CONVERSATION INTELLIGENCE FOR REAL ESTATE",
  headline:
    "Turn sales conversations into clearer insights and better coaching.",
  description:
    "Understand what buyers need, evaluate how your team handles calls, and check project claims against approved information. StelVoice transforms recorded sales conversations into transcripts, quality scores, customer insights, and actionable coaching.",
  shortDescription:
    "AI sales conversation intelligence for real estate teams. Turn recorded calls into searchable transcripts, verified project claims, KPI scorecards, and practical coaching.",
  demo: "Book a Demo",
  explore: "Explore the Platform",
  signIn: "Sign In",
  trial: "Request a Trial",
  pricingCTA: "Request Pricing",
  supportLine:
    "Call transcription · Project claim verification · KPI scoring · AI coaching",
  assisted: "Demo-led access. Trial workspaces are set up with our team.",
  sample:
    "Illustrative application screen · Sample data, not customer results. Identifying details have been removed.",
  enlarge: "Enlarge screenshot",
  close: "Close screenshot",
  nav: [
    { label: "Overview", id: "overview" },
    { label: "Features", id: "features" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Use Cases", id: "use-cases" },
    { label: "Pricing", id: "pricing" },
    { label: "FAQs", id: "faqs" },
  ],
  problemTitle:
    "Your sales conversations contain information your reports may miss.",
  problemDescription:
    "Buyers explain their budgets, preferences, concerns, and reasons for hesitation during calls. Give managers a practical way to review those conversations and identify information that needs correction.",
  problems: [
    {
      title: "Limited visibility",
      description:
        "Understand what happened during a call without relying entirely on manual notes.",
    },
    {
      title: "Inconsistent call reviews",
      description:
        "Evaluate conversations against a shared set of quality criteria.",
    },
    {
      title: "Inaccurate project information",
      description:
        "Identify statements that conflict with approved project facts or need further checking.",
    },
    {
      title: "Missed coaching opportunities",
      description:
        "Turn specific moments in a conversation into useful feedback for the salesperson.",
    },
  ],
  featuresTitle: "From the words on a call to what your team does next.",
  featureGroups: [
    {
      title: "Understand the conversation",
      features: [
        {
          title: "Call transcription and search",
          description:
            "Turn uploaded recordings into searchable, speaker-attributed transcripts. Review relevant moments in their original context.",
        },
        {
          title: "AI call summaries",
          description:
            "Review customer requirements, objections, and key discussion points in a structured overview.",
        },
        {
          title: "Buyer requirements and intent",
          description:
            "Identify expressed preferences, purchase intent, and follow-up urgency to prepare the next conversation.",
        },
        {
          title: "Sentiment and tone analysis",
          description:
            "Explore indicators of customer sentiment and conversational tone alongside the transcript.",
        },
      ],
    },
    {
      title: "Review and coach with context",
      features: [
        {
          title: "Project claim verification",
          description:
            "Compare factual statements with approved project knowledge and identify claims that need attention.",
        },
        {
          title: "KPI scorecards",
          description:
            "Evaluate applicable call-quality criteria using configurable KPI definitions and weights.",
        },
        {
          title: "AI coaching recommendations",
          description:
            "Give salespeople feedback connected to the conversation and the areas where they can improve.",
        },
        {
          title: "Human review queue",
          description:
            "Let authorised reviewers inspect flagged calls, check supporting evidence, and make supported corrections.",
        },
      ],
    },
    {
      title: "Manage the wider picture",
      features: [
        {
          title: "Team and campaign analytics",
          description:
            "Compare call activity, quality scores, intent, and objections across salespeople, projects, and campaigns.",
        },
        {
          title: "Batch processing",
          description:
            "Upload multiple recordings or analyse groups of existing calls, monitor progress, and retry failed items.",
        },
        {
          title: "Project knowledge management",
          description:
            "Upload project documents, review extracted facts, and approve information before it is used for claim verification.",
        },
        {
          title: "Printable call reports",
          description:
            "View condensed reports and save them as PDFs through the browser’s print workflow.",
        },
      ],
    },
  ],
  claimTitle: "Check sales claims against your approved project information.",
  claimDescription:
    "Keep project documents and approved facts in one place. StelVoice compares factual statements from sales conversations with that knowledge, helping reviewers identify contradictions, outdated information, and claims that cannot yet be verified.",
  exampleLabel: "Illustrative example",
  statementLabel: "Salesperson’s statement",
  statement: "“The initial payment is 10%.”",
  factLabel: "Approved project information",
  fact: "“The initial payment is 20%.”",
  resultLabel: "Analysis result",
  result: "Incorrect",
  reviewLabel: "Reviewer action",
  review: "Check the source passage and review the call.",
  claimCategories: [
    { title: "Correct", description: "Matches approved information." },
    {
      title: "Partially correct",
      description: "Partly accurate or missing a condition.",
    },
    { title: "Incorrect", description: "Conflicts with approved information." },
    { title: "Outdated", description: "Matches an older knowledge version." },
    {
      title: "Unsupported",
      description: "No approved fact supports the statement.",
    },
    {
      title: "Unable to verify",
      description: "The system cannot reach a reliable conclusion.",
    },
  ],
  claimNote:
    "An unsupported claim is a prompt for review; it does not by itself establish that the statement is false.",
  howTitle: "From recorded call to reviewed insight.",
  steps: [
    {
      title: "Set up your workspace",
      description: "Organise projects, campaigns, salespeople, and leads.",
    },
    {
      title: "Add approved project knowledge",
      description:
        "Upload brochures, price sheets, payment plans, and other documents. Review and approve extracted facts.",
    },
    {
      title: "Upload recorded conversations",
      description:
        "Add recordings and associate them with the relevant salesperson, project, or campaign.",
    },
    {
      title: "Generate the analysis",
      description:
        "Process recordings into transcripts, summaries, customer insights, claim checks, KPI scores, and coaching.",
    },
    {
      title: "Review and act",
      description:
        "Inspect flagged findings and supporting evidence. Use the results in coaching and performance discussions.",
    },
  ],
  qualityNote:
    "Analysis quality depends on the recording quality and the accuracy and completeness of your approved project information.",
  screenshotsTitle: "See the work behind the insight.",
  screenshots: [
    {
      src: "/stelvoice/dashboard.webp",
      width: 1192,
      height: 776,
      title: "Dashboard",
      caption: "See call activity and performance in one workspace.",
    },
    {
      src: "/stelvoice/call-analysis.webp",
      width: 1800,
      height: 755,
      title: "Call analysis",
      caption: "Understand customer needs, objections, and call outcomes.",
    },
    {
      src: "/stelvoice/claim-verification.webp",
      width: 1800,
      height: 898,
      title: "Claim verification",
      caption: "Inspect statements alongside supporting project information.",
    },
    {
      src: "/stelvoice/kpi-coaching.webp",
      width: 1800,
      height: 898,
      title: "KPI and coaching",
      caption: "Turn call evaluations into focused coaching conversations.",
    },
    {
      src: "/stelvoice/knowledge-base.webp",
      width: 1800,
      height: 1276,
      title: "Knowledge base",
      caption: "Manage the approved facts used to check sales claims.",
    },
    {
      src: "/stelvoice/analytics.webp",
      width: 1192,
      height: 1090,
      title: "Analytics",
      caption: "Compare patterns across your team, projects, and campaigns.",
    },
  ],
  useCasesTitle: "A shared view for the people who shape each sale.",
  audiences: [
    {
      title: "Real estate developers",
      description: "Oversee sales conversations across projects and teams.",
    },
    {
      title: "Property sales agencies",
      description: "Understand buyer requirements and improve call quality.",
    },
    {
      title: "Sales managers",
      description:
        "Identify performance gaps and coach individual salespeople.",
    },
    {
      title: "Quality assurance teams",
      description: "Review questionable claims and calls needing attention.",
    },
    {
      title: "Marketing teams",
      description: "Compare customer interest and objections across campaigns.",
    },
  ],
  languagesTitle: "Made for multilingual conversations",
  languages:
    "English, Sinhala, and Tamil language options support multilingual sales teams. Evaluate representative recordings with us, including mixed-language calls.",
  formatsTitle: "Bring your recordings and project documents",
  formats:
    "Recordings: WAV, MP3, M4A, MP4, WEBM. Knowledge documents: PDF, DOCX, TXT, CSV. We confirm file-size and duration limits for your workspace during onboarding.",
  controlsTitle: "Give your team the access and review tools they need.",
  controlsDescription:
    "Manage access for administrators, sales managers, reviewers, and salespeople. Review uncertain findings, retain the context behind evaluations, and keep project knowledge under human oversight.",
  controls: [
    "Organisation-scoped records and role-based permissions.",
    "Salesperson access to their own calls.",
    "Approval of facts before claim verification.",
    "Transcript correction and review history.",
    "Human correction of individual KPI scores, with the original retained.",
  ],
  pricingTitle: "Find the right setup for your sales team.",
  pricingDescription:
    "Tell us about your team size, recording volume, projects, and review requirements. We’ll help you evaluate StelVoice and discuss a suitable subscription.",
  pricingNote:
    "Usage allowances, onboarding, support, and data-handling arrangements are agreed for your workspace. Trial access is assisted; there is no public self-service signup.",
  faqTitle: "Questions about StelVoice",
  faqs: [
    {
      question: "What is StelVoice?",
      answer:
        "StelVoice is an AI sales conversation intelligence platform for real estate teams. It analyses recorded conversations to produce transcripts, call quality evaluations, customer insights, claim verification, and coaching recommendations.",
    },
    {
      question: "Does StelVoice record our calls?",
      answer:
        "The current workflow analyses recordings uploaded by your team. Direct recording through a phone system would require a supported integration.",
    },
    {
      question: "What information can it identify?",
      answer:
        "Available analysis includes call summaries, customer requirements, objections, purchase intent, sentiment, tone, KPI scores, and coaching recommendations.",
    },
    {
      question: "How does claim verification work?",
      answer:
        "StelVoice compares factual statements from a call with approved project information. Reviewers can inspect results and supporting evidence.",
    },
    {
      question:
        "Do uploaded documents become approved knowledge automatically?",
      answer:
        "No. Extracted facts must be reviewed and approved before they are used for claim verification.",
    },
    {
      question: "Can managers review the AI results?",
      answer:
        "Yes. Human review workflows support checking results and making supported corrections, including individual KPI score corrections.",
    },
    {
      question: "Can we process multiple calls?",
      answer:
        "Yes. Batch workflows support multiple recordings and groups of existing calls, with progress tracking and retry options.",
    },
    {
      question: "Can we download reports?",
      answer:
        "Compact reports can be printed or saved as PDFs through the browser.",
    },
    {
      question: "Can everyone see every recording?",
      answer: "Access depends on the user’s assigned roles and permissions.",
    },
    {
      question: "How do we get started?",
      answer:
        "Book a demonstration or request a trial. Workspace access is arranged through an administrator.",
    },
  ],
  finalTitle: "See what your sales conversations can reveal.",
  finalDescription:
    "Explore how StelVoice can help your team review calls, check project information, and turn customer conversations into practical coaching.",
  form: {
    labels: {
      name: "Full name",
      email: "Work email",
      company: "Company name",
      role: "Role (optional)",
      teamSize: "Sales team size (optional)",
      volume: "Monthly recording volume, in minutes (optional)",
      message: "Main requirement (optional)",
      requestType: "I’m interested in",
    },
    intents: [
      { value: "demo", label: "A demonstration" },
      { value: "trial", label: "An assisted trial" },
      { value: "pricing", label: "Pricing for my team" },
    ],
    submit: "Request a Demo",
    submitTrial: "Request a Trial",
    submitPricing: "Request Pricing",
    pending: "Sending…",
    success:
      "Thank you. Your request has been received. Our team will contact you using the details provided.",
    companyError: "Please enter your company name (2–200 characters).",
    optionalError: "Please keep this field under 200 characters.",
    messageError: "Please use 5,000 characters or fewer.",
    intentError: "Choose a demo, trial, or pricing request.",
  },
} as const;
