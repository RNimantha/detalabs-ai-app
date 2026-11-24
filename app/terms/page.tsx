import { legal } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";
import { Section, Container } from "@/components/marketing/shared";
const content = legal.terms;
export const metadata = pageMetadata(content.title, content.description, "/terms");
export default function LegalPage() {
  return (
    <Section>
      <Container className="prose-container">
        <h1>{content.title}</h1>
        <p className="page-intro">{content.description}</p>
        {content.sections.map((section) => (
          <section key={section.title} className="legal-section">
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ))}
      </Container>
    </Section>
  );
}
