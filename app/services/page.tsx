import ServiceStack from "@/components/marketing/ServiceStack";
import { services } from "@/content/site";
import { pageLabels } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";
import {
  Section,
  Container,
  CTABand,
} from "@/components/marketing/shared";
export const metadata = pageMetadata(
  "Services",
  pageLabels.servicesDescription,
  "/services",
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
          <ServiceStack services={services} />
        </Container>
      </Section>
      <CTABand />
    </>
  );
}
