"use client";

import { useState } from "react";
import { home, type Testimonial } from "@/content/site";

export default function Testimonials({ entries }: { entries: Testimonial[] }) {
  const [paused, setPaused] = useState(false);
  if (!entries.length) return null;

  function cards() {
    return entries.map((entry) => (
      <li className="marketing-card testimonial-card" key={entry.name}>
        <blockquote>
          <p>{entry.quote}</p>
          <footer>
            {entry.name} · {entry.role}
          </footer>
        </blockquote>
      </li>
    ));
  }

  return (
    <section
      className="marketing-section testimonial-section"
      aria-labelledby="testimonials-heading"
      data-paused={paused}
    >
      <div className="marketing-container">
        <div className="testimonial-heading">
          <div className="section-heading">
            <h2 id="testimonials-heading">{home.testimonialsTitle}</h2>
            {entries.some((entry) => entry.status === "sample") && (
              <p>{home.testimonialsSampleNote}</p>
            )}
          </div>
          <button
            type="button"
            className="testimonial-motion-toggle marketing-button marketing-button-secondary"
            aria-pressed={paused}
            aria-controls="testimonial-carousel"
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? home.testimonialsResume : home.testimonialsPause}
          </button>
        </div>
        <div className="testimonial-viewport" id="testimonial-carousel">
          <div className="testimonial-track">
            <ul className="testimonial-group">{cards()}</ul>
            <ul
              className="testimonial-group testimonial-repeat"
              aria-hidden="true"
            >
              {cards()}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
