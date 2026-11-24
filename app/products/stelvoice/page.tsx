import type { Metadata } from "next";
import { stelvoice as sv } from "@/content/stelvoice";
import { siteUrl, schemaIds, breadcrumbSchema } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import {
  Section,
  Container,
  Card,
  Action,
  FAQ,
} from "@/components/marketing/shared";
import ProductScreenshot from "@/components/marketing/ProductScreenshot";
import ProductInquiryForm from "@/components/marketing/ProductInquiryForm";
import ProductSignIn from "@/components/marketing/ProductSignIn";
export const metadata: Metadata = {
  title: { absolute: sv.metaTitle },
  description: sv.metaDescription,
  alternates: { canonical: sv.path },
  openGraph: {
    title: sv.metaTitle,
    description: sv.metaDescription,
    url: sv.path,
    type: "website",
    images: [
      {
        url: "/stelvoice/social-preview.webp",
        width: 1200,
        height: 630,
        alt: sv.metaTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: sv.metaTitle,
    description: sv.metaDescription,
    images: ["/stelvoice/social-preview.webp"],
  },
};
export default async function StelVoicePage({
  searchParams,
}: {
  searchParams: Promise<{ request?: string }>;
}) {
  const query = await searchParams;
  const initialRequest =
    query.request === "trial" || query.request === "pricing"
      ? query.request
      : "demo";
  return (
    <div className="stelvoice-page">
      <Section className="sv-hero" id="overview">
        <Container>
          <div>
            <p className="eyebrow">{sv.eyebrow}</p>
            <h1>{sv.headline}</h1>
            <p className="sv-description">{sv.description}</p>
            <div className="hero-actions">
              <Action href="#demo">{sv.demo}</Action>
              <Action href="#features" secondary>
                {sv.explore}
              </Action>
            </div>
            <ProductSignIn />
            <p className="sv-support-line">{sv.supportLine}</p>
          </div>
          <div className="sv-hero-preview">
            <div className="sv-preview-title">
              {sv.name}
              <span>{sv.assisted}</span>
            </div>
            <ProductScreenshot screen={sv.screenshots[0]} priority />
          </div>
        </Container>
      </Section>
      <nav className="sv-section-nav" aria-label={sv.name}>
        <Container>
          {sv.nav.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
        </Container>
      </nav>
      <Section>
        <Container>
          <div className="section-heading">
            <h2>{sv.problemTitle}</h2>
            <p>{sv.problemDescription}</p>
          </div>
          <div className="sv-four-grid">
            {sv.problems.map((item) => (
              <Card key={item.title} className="sv-problem">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
      <Section id="features" className="process-section">
        <Container>
          <div className="section-heading">
            <h2>{sv.featuresTitle}</h2>
          </div>
          <div className="sv-feature-groups">
            {sv.featureGroups.map((group) => (
              <div key={group.title}>
                <h3>{group.title}</h3>
                <dl>
                  {group.features.map((feature) => (
                    <div key={feature.title}>
                      <dt>{feature.title}</dt>
                      <dd>{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <Section className="sv-claims">
        <Container>
          <div className="sv-claims-intro">
            <div>
              <h2>{sv.claimTitle}</h2>
              <p>{sv.claimDescription}</p>
            </div>
            <div className="sv-claim-example">
              <p className="eyebrow">{sv.exampleLabel}</p>
              <dl>
                {[
                  [sv.statementLabel, sv.statement],
                  [sv.factLabel, sv.fact],
                  [sv.resultLabel, sv.result],
                  [sv.reviewLabel, sv.review],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <dl className="sv-claim-categories">
            {sv.claimCategories.map((item) => (
              <div key={item.title}>
                <dt>{item.title}</dt>
                <dd>{item.description}</dd>
              </div>
            ))}
          </dl>
          <p className="sv-claim-note">{sv.claimNote}</p>
        </Container>
      </Section>
      <Section id="how-it-works">
        <Container>
          <h2>{sv.howTitle}</h2>
          <ol className="sv-workflow">
            {sv.steps.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
          <p className="sv-quality-note">{sv.qualityNote}</p>
        </Container>
      </Section>
      <Section className="process-section">
        <Container>
          <div className="section-heading">
            <h2>{sv.screenshotsTitle}</h2>
          </div>
          <div className="sv-gallery">
            {sv.screenshots.map((screen) => (
              <ProductScreenshot key={screen.src} screen={screen} />
            ))}
          </div>
        </Container>
      </Section>
      <Section id="use-cases">
        <Container>
          <h2>{sv.useCasesTitle}</h2>
          <dl className="sv-use-cases">
            {sv.audiences.map((item) => (
              <div key={item.title}>
                <dt>{item.title}</dt>
                <dd>{item.description}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>
      <Section className="process-section">
        <Container>
          <div className="sv-technical">
            <div>
              <h2>{sv.languagesTitle}</h2>
              <p>{sv.languages}</p>
              <h3>{sv.formatsTitle}</h3>
              <p>{sv.formats}</p>
            </div>
            <div>
              <h2>{sv.controlsTitle}</h2>
              <p>{sv.controlsDescription}</p>
              <ul>
                {sv.controls.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>
      <Section id="pricing">
        <Container className="sv-pricing">
          <div>
            <p className="eyebrow">{sv.name}</p>
            <h2>{sv.pricingTitle}</h2>
            <p>{sv.pricingDescription}</p>
            <p>{sv.pricingNote}</p>
          </div>
          <div className="sv-pricing-actions">
            <Action href={`${sv.path}?request=pricing#demo`}>
              {sv.pricingCTA}
            </Action>
            <Action href={`${sv.path}?request=trial#demo`} secondary>
              {sv.trial}
            </Action>
          </div>
        </Container>
      </Section>
      <div id="faqs">
        <FAQ title={sv.faqTitle} items={[...sv.faqs]} />
      </div>
      <Section className="sv-demo-section" id="demo">
        <Container>
          <div className="section-heading">
            <h2>{sv.finalTitle}</h2>
            <p>{sv.finalDescription}</p>
            <p className="sv-quality-note">{sv.assisted}</p>
          </div>
          <ProductInquiryForm
            key={initialRequest}
            initialRequest={initialRequest}
          />
        </Container>
      </Section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: sv.name,
            description: sv.shortDescription,
            url: `${siteUrl}${sv.path}`,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            image: `${siteUrl}/stelvoice/social-preview.webp`,
            creator: { "@id": schemaIds.organization },
            publisher: { "@id": schemaIds.organization },
            offers: {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              url: `${siteUrl}${sv.path}?request=pricing`,
              description: "Pricing on request",
            },
          }).replace(/</g, "\\u003c"),
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: sv.name, path: sv.path },
        ])}
      />
    </div>
  );
}
