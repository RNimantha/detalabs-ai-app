import { work } from "@/content/pages";
import { caseStudies } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import {
  Section,
  Container,
  CaseStudyCard,
  CTABand,
} from "@/components/marketing/shared";
export const metadata = pageMetadata("Work", work.description);
export default function WorkPage() {
  return (
    <>
      <Section className="page-hero">
        <Container>
          <p className="eyebrow">{work.eyebrow}</p>
          <h1>{work.title}</h1>
          <p className="page-intro">{work.description}</p>
        </Container>
      </Section>
      <Section>
        <Container>
          <div className="three-grid">
            {caseStudies.map((study) => (
              <CaseStudyCard key={study.title} study={study} />
            ))}
          </div>
        </Container>
      </Section>
      <CTABand />
    </>
  );
}
