import { services } from "@/content/site";
import { pageLabels } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";
import {
  Section,
  Container,
  ServiceCard,
  CTABand,
} from "@/components/marketing/shared";
export const metadata = pageMetadata(
  "Services",
  pageLabels.servicesDescription,
);
export default function ServicesPage() {
  return (
    <>
      <Section className="page-hero">
        <Container>
          <p className="eyebrow">{pageLabels.serviceEyebrow}</p>
          <h1>{pageLabels.servicesTitle}</h1>
          <p className="page-intro">{pageLabels.servicesDescription}</p>
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="three-grid">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Container>
      </Section>
      <CTABand />
    </>
  );
}
