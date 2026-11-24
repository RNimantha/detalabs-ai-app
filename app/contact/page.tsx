import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { contact } from "@/content/pages";
import { site, services } from "@/content/site";
import { pageMetadata, absoluteUrl, schemaIds } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { Section, Container } from "@/components/marketing/shared";
import ContactForm from "@/components/marketing/ContactForm";
export const metadata = pageMetadata("Contact", contact.description, "/contact");
export default function ContactPage() {
  const { aside } = contact;
  return (
    <Section>
      <Container>
        <p className="eyebrow">{contact.eyebrow}</p>
        <h1>{contact.title}</h1>
        <p className="page-intro">{contact.description}</p>
        <div className="contact-layout">
          <ContactForm />
          <aside className="contact-aside">
            <div className="contact-aside-card contact-direct">
              <h2>{aside.directTitle}</h2>
              <ul>
                <li>
                  <span className="contact-icon" aria-hidden="true">
                    <Mail size={18} />
                  </span>
                  <span>
                    <small>{aside.emailLabel}</small>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </span>
                </li>
                <li>
                  <span className="contact-icon" aria-hidden="true">
                    <Phone size={18} />
                  </span>
                  <span>
                    <small>{aside.phoneLabel}</small>
                    <a href={`tel:${site.phone.replace(/ /g, "")}`}>
                      {site.phone}
                    </a>
                  </span>
                </li>
                <li>
                  <span className="contact-icon" aria-hidden="true">
                    <MapPin size={18} />
                  </span>
                  <span>
                    <small>{aside.locationLabel}</small>
                    {site.location}
                  </span>
                </li>
              </ul>
            </div>
            <div className="contact-aside-card">
              <h2>{aside.nextTitle}</h2>
              <ol className="contact-steps">
                {aside.steps.map((step) => (
                  <li key={step.title}>
                    <strong>{step.title}</strong>
                    <p>{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="contact-aside-card">
              <h2>{aside.exploreTitle}</h2>
              <ul className="contact-explore">
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link href={`/services/${service.slug}`}>
                      {service.title}
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/products/stelvoice">
                    {aside.stelvoiceLabel}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ContactPage",
            url: absoluteUrl("/contact"),
            name: "Contact DetaLabs AI",
            description: contact.description,
            about: { "@id": schemaIds.organization },
          }}
        />
      </Container>
    </Section>
  );
}
