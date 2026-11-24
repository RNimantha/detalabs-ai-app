"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useLeadSubmissionId } from "@/hooks/use-lead-submission-id";
import { stelvoice } from "@/content/stelvoice";
import { contact } from "@/content/pages";
import {
  productInquirySchema,
  type ProductInquiry,
} from "@/lib/contact-validation";
import { productEvent } from "@/lib/product-analytics";
export default function ProductInquiryForm({
  initialRequest = "demo",
}: {
  initialRequest?: ProductInquiry["requestType"];
}) {
  const submissionId = useLeadSubmissionId();
  const [intent, setIntent] = useState(initialRequest);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const parsed = productInquirySchema.safeParse({
      ...Object.fromEntries(new FormData(form)),
      kind: "stelvoice",
    });
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [
            String(issue.path[0]),
            issue.message,
          ]),
        ),
      );
      setStatus(contact.invalid);
      form
        .querySelector<HTMLElement>(
          `[name="${parsed.error.issues[0].path[0]}"]`,
        )
        ?.focus();
      return;
    }
    setErrors({});
    setPending(true);
    setStatus("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          leadId: submissionId.forPayload(parsed.data),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors(
          data.fields
            ? Object.fromEntries(
                Object.entries(data.fields).map(([key, value]) => [
                  key,
                  String((value as string[])[0]),
                ]),
              )
            : {},
        );
        setStatus(data.error || contact.error);
        return;
      }
      // A request is counted only after the backend confirms it was stored.
      productEvent(`stelvoice_${parsed.data.requestType}_request`);
      submissionId.clear();
      form.reset();
      setIntent(initialRequest);
      setStatus(stelvoice.form.success);
    } catch {
      setStatus(contact.error);
    } finally {
      setPending(false);
    }
  }
  return (
    <form className="contact-form sv-inquiry" onSubmit={submit} noValidate>
      <div className="form-grid">
        {(
          ["name", "email", "company", "role", "teamSize", "volume"] as const
        ).map((name) => (
          <div key={name}>
            <label htmlFor={`sv-${name}`}>{stelvoice.form.labels[name]}</label>
            <input
              id={`sv-${name}`}
              name={name}
              type={name === "email" ? "email" : "text"}
              required={["name", "email", "company"].includes(name)}
              maxLength={name === "name" ? 100 : name === "email" ? 254 : 200}
              autoComplete={
                {
                  name: "name",
                  email: "email",
                  company: "organization",
                  role: "organization-title",
                  teamSize: "off",
                  volume: "off",
                }[name]
              }
              inputMode={
                name === "teamSize" || name === "volume" ? "numeric" : undefined
              }
              aria-invalid={!!errors[name]}
              aria-describedby={errors[name] ? `sv-${name}-error` : undefined}
            />
            {errors[name] && (
              <p className="field-error" id={`sv-${name}-error`}>
                {errors[name]}
              </p>
            )}
          </div>
        ))}
      </div>
      <label htmlFor="sv-requestType">
        {stelvoice.form.labels.requestType}
      </label>
      <select
        name="requestType"
        id="sv-requestType"
        value={intent}
        onChange={(event) =>
          setIntent(event.target.value as ProductInquiry["requestType"])
        }
        required
      >
        {stelvoice.form.intents.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <label className="sv-message-label" htmlFor="sv-message">
        {stelvoice.form.labels.message}
      </label>
      <textarea
        name="message"
        id="sv-message"
        rows={4}
        maxLength={5000}
        aria-invalid={!!errors.message}
        aria-describedby={errors.message ? "sv-message-error" : undefined}
      />
      {errors.message && (
        <p className="field-error" id="sv-message-error">
          {errors.message}
        </p>
      )}
      <p className="form-privacy">
        {contact.privacy} <Link href="/privacy">{contact.privacyLink}</Link>.
      </p>
      <button type="submit" className="marketing-button" disabled={pending}>
        {pending
          ? stelvoice.form.pending
          : intent === "trial"
            ? stelvoice.form.submitTrial
            : intent === "pricing"
              ? stelvoice.form.submitPricing
              : stelvoice.form.submit}
      </button>
      <p role="status" aria-live="polite" className="form-status">
        {status}
      </p>
    </form>
  );
}
