import type { Metadata } from "next";
import Link from "next/link";
import {
  BrainCircuit,
  Code2,
  ChartNoAxesCombined,
  Layers3,
} from "lucide-react";
import {
  site,
  home,
  services,
  caseStudies,
  testimonials,
} from "@/content/site";
import {
  Container,
  Section,
  Action,
  ServiceCard,
  CaseStudyCard,
  CTABand,
  Testimonials,
} from "@/components/marketing/shared";
export const metadata: Metadata = {
  title: "DetaLabs AI | AI Engineering, Marketing & Web Development",
  description: site.description,
  openGraph: {
    title: "DetaLabs AI | Build it. Ship it. Grow it.",
    description: site.description,
    type: "website",
  },
};
export default function Home() {
  return (
    <>
      <Section className="hero">
        <Container>
          <div className="hero-copy">
            <p className="eyebrow">{home.eyebrow}</p>
            <h1>
              {home.headline.split(". ").map((line, i) => (
                <span key={line} className={i === 2 ? "hero-emphasis" : ""}>
                  {line}
                  {i < 2 ? "." : ""}
                </span>
              ))}
            </h1>
            <p className="hero-description">{home.subhead}</p>
            <div className="hero-actions">
              <Action href="/contact">{site.consultation}</Action>
              <Action href="/products/stelvoice" secondary>
                {site.exploreProduct}
              </Action>
            </div>
            <p className="hero-note">{home.heroNote}</p>
          </div>
          <div
            className="hero-diagram"
            role="img"
            aria-label={`${home.diagramLabel}: ${home.diagramNodes.join(", ")}. ${home.diagramCaption}`}
          >
            <div className="diagram-grid" />
            <div className="diagram-top">
              <span className="diagram-symbol">
                <Layers3 size={22} />
              </span>
              <span>{home.diagramCenter}</span>
            </div>
            <div className="diagram-connector" />
            <div className="diagram-nodes">
              {[BrainCircuit, Code2, ChartNoAxesCombined].map((Icon, i) => (
                <div className="diagram-node" key={i}>
                  <Icon size={25} />
                  <span>{home.diagramNodes[i]}</span>
                </div>
              ))}
            </div>
            <div className="diagram-caption">{home.diagramCaption}</div>
          </div>
        </Container>
      </Section>
      <Section className="services-section">
        <Container>
          <div className="section-heading">
            <p className="eyebrow">{home.servicesEyebrow}</p>
            <h2>{home.servicesTitle}</h2>
            <p>{home.servicesIntro}</p>
          </div>
          <div className="three-grid">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Container>
      </Section>
      <Section className="product-band">
        <Container>
          <div className="product-copy">
            <p className="eyebrow">{home.productEyebrow}</p>
            <h2>{home.productTitle}</h2>
            <p>{home.productDescription}</p>
            <ul>
              {home.productBenefits.map((benefit, i) => (
                <li key={i}>{benefit}</li>
              ))}
            </ul>
            <Action href="/products/stelvoice">{home.productLink}</Action>
          </div>
          <figure className="home-product-preview">
            <video
              controls
              playsInline
              preload="none"
              poster={home.productVideoPoster}
              aria-label={home.productVideoLabel}
            >
              <source src={home.productVideoSrc} type="video/mp4" />
              <a href={home.productVideoSrc}>{home.productVideoFallback}</a>
            </video>
            <figcaption>{home.productVideoLabel}</figcaption>
          </figure>
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="section-heading heading-with-link">
            <div>
              <p className="eyebrow">{home.workEyebrow}</p>
              <h2>{home.workTitle}</h2>
              <p>{home.workIntro}</p>
            </div>
            <Link className="text-link" href="/work">
              {home.workLink}
            </Link>
          </div>
          <div className="three-grid">
            {caseStudies.map((study) => (
              <CaseStudyCard key={study.title} study={study} />
            ))}
          </div>
        </Container>
      </Section>
      <Section className="process-section">
        <Container>
          <div className="section-heading">
            <p className="eyebrow">{home.processEyebrow}</p>
            <h2>{home.processTitle}</h2>
          </div>
          <ol className="process-grid">
            {home.steps.map((step) => (
              <li key={step.title}>
                <div className="process-dot" aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="section-heading">
            <p className="eyebrow">{home.techEyebrow}</p>
            <h2>{home.techTitle}</h2>
            <p>{home.techDescription}</p>
          </div>
          <ul className="tech-row">
            {home.technologies.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <div className="industries">
            <h3>{home.industriesTitle}</h3>
            <div>
              <p>{home.industriesDescription}</p>
              <p className="editorial-placeholder">{home.industriesNote}</p>
            </div>
          </div>
        </Container>
      </Section>
      <Testimonials entries={testimonials} />
      <CTABand />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.name,
            description: site.description,
            email: site.email,
            telephone: site.phone,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Colombo",
              addressCountry: "LK",
            },
          }).replace(/</g, "\u003c"),
        }}
      />
    </>
  );
}
