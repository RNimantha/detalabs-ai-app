import { site, services } from "@/content/site";
import { leadership } from "@/content/leadership";
import { stelvoice } from "@/content/stelvoice";
import { absoluteUrl, schemaIds, siteName, siteUrl } from "@/lib/seo";

export function personSchema(person: (typeof leadership.members)[number]) {
  return {
    "@type": "Person",
    "@id": `${siteUrl}/about#${person.name.toLowerCase().replace(/[^a-z]+/g, "-")}`,
    name: person.name,
    jobTitle: person.role,
    description: person.bio,
    ...(person.image ? { image: absoluteUrl(person.image) } : {}),
    sameAs: [person.linkedin, person.github, person.profile].filter(
      (url, index, all): url is string => !!url && all.indexOf(url) === index,
    ),
    worksFor: { "@id": schemaIds.organization },
  };
}

/** Site-wide entities: who DetaLabs AI is, what it offers, and the website itself. */
export function organizationGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": schemaIds.organization,
        name: siteName,
        url: siteUrl,
        logo: absoluteUrl("/apple-touch-icon.png"),
        image: absoluteUrl("/og-image.png"),
        description: site.description,
        slogan: site.footer,
        email: site.email,
        telephone: site.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Colombo",
          addressCountry: "LK",
        },
        areaServed: "Worldwide",
        knowsAbout: [
          "Artificial intelligence",
          "Machine learning",
          "Data science",
          "Predictive analytics",
          "Computer vision",
          "Natural language processing",
          "Large language models",
          "Retrieval-augmented generation",
          "AI agents",
          "AI marketing",
          "Digital marketing",
          "Web development",
          "SaaS product development",
          "Sales conversation intelligence",
        ],
        founder: leadership.members
          .filter((person) => /founder/i.test(person.role))
          .map(personSchema),
        employee: leadership.members.map(personSchema),
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: site.email,
          telephone: site.phone,
          url: absoluteUrl("/contact"),
          availableLanguage: ["English"],
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.title,
              description: service.intro,
              url: absoluteUrl(`/services/${service.slug}`),
            },
          })),
        },
        owns: {
          "@type": "SoftwareApplication",
          name: stelvoice.name,
          url: absoluteUrl(stelvoice.path),
        },
      },
      {
        "@type": "WebSite",
        "@id": schemaIds.website,
        url: siteUrl,
        name: siteName,
        description: site.description,
        inLanguage: "en",
        publisher: { "@id": schemaIds.organization },
      },
    ],
  };
}
