import Link from "next/link";
import type { ReactNode, HTMLAttributes } from "react";
import { BrainCircuit, ChartNoAxesCombined, Code2 } from "lucide-react";
import { home, site, type Service, type CaseStudy } from "@/content/site";

export function Container({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`marketing-container ${className}`} {...props}>
      {children}
    </div>
  );
}
export function Section({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section className={`marketing-section ${className}`} {...props}>
      {children}
    </section>
  );
}
export function Card({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <article className={`marketing-card ${className}`} {...props}>
      {children}
    </article>
  );
}
export function Action({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      className={`marketing-button ${secondary ? "marketing-button-secondary" : ""}`}
      href={href}
    >
      {children}
    </Link>
  );
}
export function ServiceCard({ service }: { service: Service }) {
  const Icon = {
    engineering: BrainCircuit,
    marketing: ChartNoAxesCombined,
    web: Code2,
  }[service.icon];
  return (
    <Card className="service-card">
      <div className="service-icon">
        <Icon size={25} aria-hidden="true" />
      </div>
      <h3>{service.title}</h3>
      <p>{service.intro}</p>
      <ul>
        {service.capabilities.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Link className="text-link" href={`/services/${service.slug}`}>
        {service.link}
      </Link>
    </Card>
  );
}
export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <Card className="case-card">
      <div className="case-visual" aria-hidden="true">
        <span>{study.category}</span>
        <div className="case-lines">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="case-copy">
        <span className="placeholder-label">{home.placeholder}</span>
        <h3>{study.title}</h3>
        <dl>
          {[
            [home.problem, study.problem],
            [home.built, study.built],
            [home.outcome, study.outcome],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Card>
  );
}
export function CTABand() {
  return (
    <Section className="cta-band">
      <Container>
        <div>
          <h2>{home.ctaTitle}</h2>
          <p>{home.ctaDescription}</p>
        </div>
        <Action href="/contact">{site.consultation}</Action>
      </Container>
    </Section>
  );
}
export function FAQ({
  title,
  items,
}: {
  title: string;
  items: { question: string; answer: string }[];
}) {
  return (
    <Section>
      <Container>
        <h2>{title}</h2>
        <div className="faq-list">
          {items.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: items.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            }).replace(/</g, "\u003c"),
          }}
        />
      </Container>
    </Section>
  );
}
export { default as Testimonials } from "@/components/marketing/Testimonials";
