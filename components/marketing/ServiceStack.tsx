"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  ChartNoAxesCombined,
  ChartScatter,
  Code2,
} from "lucide-react";
import type { Service } from "@/content/site";

const icons = {
  engineering: BrainCircuit,
  data: ChartScatter,
  marketing: ChartNoAxesCombined,
  web: Code2,
};

/**
 * Sticky stacking cards: each service card pins below the header while the
 * next one slides up over it. Covered cards shrink and dim slightly.
 * The stacking itself is CSS (position: sticky); this only adds the scale.
 */
export default function ServiceStack({
  services,
}: {
  services: readonly Service[];
}) {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(
      list.querySelectorAll<HTMLElement>(".stack-card"),
    );
    let frame = 0;

    function update() {
      frame = 0;
      cards.forEach((card, index) => {
        const next = cards[index + 1];
        if (!next) return;
        const top = card.getBoundingClientRect().top;
        const height = card.offsetHeight;
        // 0 while the next card is a full card-height away, 1 once it covers this one.
        const covered = Math.min(
          1,
          Math.max(0, 1 - (next.getBoundingClientRect().top - top) / height),
        );
        card.style.setProperty("--covered", covered.toFixed(3));
      });
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <ol className="service-stack" ref={listRef}>
      {services.map((service, index) => {
        const Icon = icons[service.icon];
        return (
          <li
            className="stack-card"
            key={service.slug}
            style={{ "--i": index } as CSSProperties}
          >
            <article className="stack-card-inner">
              <div className="stack-card-main">
                <div className="stack-card-top">
                  <span className="stack-card-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="service-icon" aria-hidden="true">
                    <Icon size={25} />
                  </span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.intro}</p>
                <Link
                  className="marketing-button marketing-button-secondary stack-card-link"
                  href={`/services/${service.slug}`}
                >
                  {service.link}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
              <ul className="stack-card-list">
                {service.capabilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
