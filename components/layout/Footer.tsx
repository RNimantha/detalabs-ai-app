import Link from "next/link";
import { site, services } from "@/content/site";
import { Container } from "@/components/marketing/shared";
export default function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="wordmark" href="/">
              {site.name}
            </Link>
            <h2>{site.footer}</h2>
            <p>{site.footerDescription}</p>
          </div>
          <div>
            <h3>{site.servicesLabel}</h3>
            {services.map((service) => (
              <Link href={`/services/${service.slug}`} key={service.slug}>
                {service.title}
              </Link>
            ))}
            {site.nav
              .filter((item) => item.href === "/products/stelvoice")
              .map((item) => (
                <Link href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
          </div>
          <div>
            <h3>{site.consultation}</h3>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={`tel:${site.phone.replace(/ /g, "")}`}>{site.phone}</a>
            <p>{site.location}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {site.name}. {site.rights}
          </p>
          <div>
            {site.legal.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
