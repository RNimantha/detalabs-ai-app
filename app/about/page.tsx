import Link from "next/link";
import Image from "next/image";
import { leadership } from "@/content/leadership";
import { about } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";
import { Section, Container, CTABand } from "@/components/marketing/shared";
export const metadata = pageMetadata("About", about.description);
export default function AboutPage() {
  return (
    <>
      <Section className="page-hero">
        <Container>
          <p className="eyebrow">{about.eyebrow}</p>
          <h1>{about.title}</h1>
          <p className="page-intro">{about.description}</p>
        </Container>
      </Section>
      <Section>
        <Container className="prose-container">
          <h2>{about.heading}</h2>
          {about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Container>
      </Section>
      <Section className="process-section">
        <Container className="prose-container">
          <h2>{about.productHeading}</h2>
          <p>{about.productDescription}</p>
          <Link className="text-link" href="/products/stelvoice">
            {about.productLink}
          </Link>
        </Container>
      </Section>
      <Section aria-labelledby="leadership-heading">
        <Container>
          <div className="section-heading">
            <h2 id="leadership-heading">{leadership.title}</h2>
            <p>{leadership.description}</p>
          </div>
          <ul className="leadership-grid">
            {leadership.members.map((person) => (
              <li className="marketing-card leadership-card" key={person.name}>
                <div className="leadership-portrait">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    sizes="72px"
                  />
                </div>
                <div className="leadership-copy">
                  <h3>
                    <a
                      href={person.profile}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {person.name}
                    </a>
                  </h3>
                  <p className="leadership-role">{person.role}</p>
                  <p>{person.bio}</p>
                  <div className="leadership-links">
                    <a
                      href={person.profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${person.name} — ${leadership.profileLabel}`}
                    >
                      {leadership.profileLabel}
                    </a>
                    {person.github && (
                      <a
                        href={person.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${person.name} — ${leadership.githubLabel}`}
                      >
                        {leadership.githubLabel}
                      </a>
                    )}
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${person.name} — ${leadership.linkedinLabel}`}
                    >
                      {leadership.linkedinLabel}
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <CTABand />
    </>
  );
}
