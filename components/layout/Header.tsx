"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { site, services } from "@/content/site";
import { Container } from "@/components/marketing/shared";

export default function Header() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  function closeDropdowns(except?: Element | null) {
    headerRef.current
      ?.querySelectorAll<HTMLDetailsElement>("details[open]")
      .forEach((detail) => {
        if (detail !== except) detail.open = false;
      });
  }

  useEffect(() => {
    setOpen(false);
    closeDropdowns();
  }, [pathname]);

  useEffect(() => {
    let pointerActive = false;
    function endPointer() {
      pointerActive = false;
    }
    function dismissOutside(event: Event) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (event.type === "pointerdown") pointerActive = true;
      if (!headerRef.current?.contains(target)) {
        closeDropdowns();
        setOpen(false);
        return;
      }
      // Keep mobile targets still until their click completes. Keyboard focus
      // changes can safely dismiss a previous dropdown immediately.
      if (pointerActive) return;
      const detail =
        target instanceof Element ? target.closest("details") : null;
      closeDropdowns(detail);
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const focused = document.activeElement;
      if (!focused || !headerRef.current?.contains(focused)) return;
      const detail = focused.closest("details[open]");
      closeDropdowns();
      if (detail) detail.querySelector<HTMLElement>("summary")?.focus();
      else {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("pointerup", endPointer);
    document.addEventListener("pointercancel", endPointer);
    document.addEventListener("focusin", dismissOutside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("pointerup", endPointer);
      document.removeEventListener("pointercancel", endPointer);
      document.removeEventListener("focusin", dismissOutside);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  return (
    <>
      <a className="skip-link" href="#main-content">
        {site.skip}
      </a>
      <header className="site-header" ref={headerRef}>
        <Container>
          <Link
            href="/"
            className="wordmark"
            onClick={() => {
              closeDropdowns();
              setOpen(false);
            }}
            aria-label={site.name}
          >
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            DetaLabs<span className="brand-ai">AI</span>
          </Link>
          <button
            className="mobile-toggle"
            ref={toggleRef}
            aria-expanded={open}
            aria-controls="site-navigation"
            aria-label={open ? site.menuClose : site.menuOpen}
            onClick={() => {
              closeDropdowns();
              setOpen(!open);
            }}
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav
            id="site-navigation"
            className={`site-nav ${open ? "is-open" : ""}`}
            aria-label="Main navigation"
            onClick={(event) => {
              if (!(event.target instanceof Element)) return;
              const summary = event.target.closest("summary");
              if (summary) closeDropdowns(summary.closest("details"));
              if (event.target.closest("a")) {
                closeDropdowns();
                setOpen(false);
              }
            }}
          >
            <details className="services-dropdown">
              <summary>
                {site.servicesLabel}
                <ChevronDown size={14} aria-hidden="true" />
              </summary>
              <div className="dropdown-panel">
                {services.map((service) => (
                  <Link
                    href={`/services/${service.slug}`}
                    key={service.slug}
                    onClick={(event) => {
                      setOpen(false);
                      event.currentTarget
                        .closest("details")
                        ?.removeAttribute("open");
                    }}
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
            </details>
            <details className="services-dropdown">
              <summary>
                {site.productsLabel}
                <ChevronDown size={14} aria-hidden="true" />
              </summary>
              <div className="dropdown-panel">
                {site.nav
                  .filter((item) => item.href === "/products/stelvoice")
                  .map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={(event) => {
                        setOpen(false);
                        event.currentTarget
                          .closest("details")
                          ?.removeAttribute("open");
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
              </div>
            </details>
            {site.nav
              .filter((item) => item.href !== "/products/stelvoice")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            <Link
              className="marketing-button nav-cta"
              href="/contact"
              onClick={() => setOpen(false)}
            >
              {site.consultation}
            </Link>
          </nav>
        </Container>
      </header>
    </>
  );
}
