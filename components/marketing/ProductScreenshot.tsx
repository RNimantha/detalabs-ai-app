"use client";
import Image from "next/image";
import { useRef, type MouseEvent } from "react";
import { stelvoice } from "@/content/stelvoice";
type Screen = (typeof stelvoice.screenshots)[number];
export default function ProductScreenshot({
  screen,
  priority = false,
}: {
  screen: Screen;
  priority?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  function enlarge(event: MouseEvent<HTMLAnchorElement>) {
    if (dialog.current?.showModal) {
      event.preventDefault();
      dialog.current.showModal();
    }
  }
  return (
    <figure className="sv-screenshot">
      <a
        href={screen.src}
        onClick={enlarge}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${stelvoice.enlarge}: ${screen.title}`}
      >
        <Image
          src={screen.src}
          alt={`${screen.title}: ${screen.caption} Sample data.`}
          width={screen.width}
          height={screen.height}
          sizes={
            priority
              ? "(max-width: 900px) 100vw, 55vw"
              : "(max-width: 700px) 100vw, 50vw"
          }
          priority={priority}
        />
      </a>
      <figcaption>
        <strong>{screen.title}</strong>
        <span>{screen.caption}</span>
        <small>{stelvoice.sample}</small>
      </figcaption>
      <dialog
        ref={dialog}
        className="sv-lightbox"
        aria-label={screen.title}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className="marketing-button"
          type="button"
          onClick={() => dialog.current?.close()}
        >
          {stelvoice.close}
        </button>
        <Image
          src={screen.src}
          alt={`${screen.title}: ${screen.caption} Sample data.`}
          width={screen.width}
          height={screen.height}
          sizes="95vw"
        />
        <p>{stelvoice.sample}</p>
      </dialog>
    </figure>
  );
}
