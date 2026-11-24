import { contact } from "@/content/pages";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { Section, Container } from "@/components/marketing/shared";
import ContactForm from "@/components/marketing/ContactForm";
export const metadata = pageMetadata("Contact", contact.description);
export default function ContactPage() {
  return (
    <Section>
      <Container>
        <p className="eyebrow">{contact.eyebrow}</p>
        <h1>{contact.title}</h1>
        <p className="page-intro">{contact.description}</p>
        <div className="contact-layout">
          <ContactForm />
          <aside>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={`tel:${site.phone.replace(/ /g, "")}`}>{site.phone}</a>
            <p>{site.location}</p>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
