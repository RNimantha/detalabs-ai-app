import { notFound } from "next/navigation";
import { services, site, home } from "@/content/site";
import { serviceDetails, pageLabels } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";
import {
  Section,
  Container,
  Action,
  Card,
  CTABand,
  FAQ,
} from "@/components/marketing/shared";
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const service = services.find((s) => s.slug === (await params).slug);
  return service
    ? pageMetadata(service.title, serviceDetails[service.slug].description)
    : {};
}
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const service = services.find((s) => s.slug === (await params).slug);
  if (!service) notFound();
  const details = serviceDetails[service.slug];
  return (
    <>
      <Section className="page-hero">
        <Container>
          <p className="eyebrow">{pageLabels.serviceEyebrow}</p>
          <h1>{service.title}</h1>
          <p className="page-intro">{details.description}</p>
          <Action href="/contact">{site.consultation}</Action>
        </Container>
      </Section>
      <Section>
        <Container>
          <h2>{pageLabels.problems}</h2>
          <div className="three-grid">
            {details.problems.map((problem) => (
              <Card className="p-8" key={problem}>
                <p>{problem}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
      <Section className="process-section">
        <Container>
          <h2>{pageLabels.capabilities}</h2>
          <ul className="capabilities-list">
            {service.capabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
        </Container>
      </Section>
      <Section>
        <Container>
          <h2>{pageLabels.process}</h2>
          <ol className="three-grid process-list">
            {details.process.map((step, i) => (
              <li key={step}>
                <h3>{home.steps[i === 2 ? 2 : i].title}</h3>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
      <FAQ title={pageLabels.faq} items={details.faqs} />
      <CTABand />
    </>
  );
}
