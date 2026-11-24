import { notFoundContent } from "@/content/pages";
import { Section, Container, Action } from "@/components/marketing/shared";
export default function NotFound() {
  return (
    <Section className="page-hero">
      <Container>
        <p className="eyebrow">{notFoundContent.eyebrow}</p>
        <h1>{notFoundContent.title}</h1>
        <p className="page-intro">{notFoundContent.description}</p>
        <Action href="/">{notFoundContent.link}</Action>
      </Container>
    </Section>
  );
}
