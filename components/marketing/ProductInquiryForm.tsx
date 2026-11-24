"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, CircleAlert, Send } from "lucide-react";
import { useLeadSubmissionId } from "@/hooks/use-lead-submission-id";
import { stelvoice } from "@/content/stelvoice";
import { contact } from "@/content/pages";
import SuccessDialog from "@/components/marketing/SuccessDialog";
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
  const [outcome, setOutcome] = useState<"error" | "success">("error");
  const [pending, setPending] = useState(false);
  const [thanks, setThanks] = useState(false);
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
      setOutcome("error");
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
        setOutcome("error");
        setStatus(data.error || contact.error);
        return;
      }
      // A request is counted only after the backend confirms it was stored.
      productEvent(`stelvoice_${parsed.data.requestType}_request`);
      submissionId.clear();
      form.reset();
      setIntent(initialRequest);
      setThanks(true);
    } catch {
      setOutcome("error");
      setStatus(contact.error);
    } finally {
      setPending(false);
    }
  }
  const required = ["name", "email", "company"];
  return (
    <form
      className="contact-form consultation-form sv-inquiry"
      onSubmit={submit}
      noValidate
      aria-busy={pending}
    >
      <div className="consultation-form-header">
        <p className="eyebrow">{stelvoice.form.formEyebrow}</p>
        <small>{stelvoice.form.requiredNote}</small>
      </div>
      <fieldset
        className="consultation-services"
        data-invalid={!!errors.requestType}
        aria-describedby={errors.requestType ? "sv-requestType-error" : undefined}
      >
        <legend>
          {stelvoice.form.labels.requestType}
          <span aria-hidden="true"> *</span>
        </legend>
        <div className="consultation-service-grid sv-intent-grid">
          {stelvoice.form.intents.map((item) => (
            <label className="consultation-service" key={item.value}>
              <input
                type="radio"
                name="requestType"
                value={item.value}
                checked={intent === item.value}
                onChange={() => setIntent(item.value)}
                required
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
        {errors.requestType && (
          <p className="field-error" id="sv-requestType-error">
            {errors.requestType}
          </p>
        )}
      </fieldset>
      <div className="form-grid consultation-fields">
        {(
          ["name", "email", "company", "role", "teamSize", "volume"] as const
        ).map((name) => (
          <div className="consultation-field" key={name}>
            <label htmlFor={`sv-${name}`}>
              {stelvoice.form.labels[name]}
              {required.includes(name) && <span aria-hidden="true"> *</span>}
            </label>
            <input
              id={`sv-${name}`}
              name={name}
              type={name === "email" ? "email" : "text"}
              required={required.includes(name)}
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
      <div className="consultation-field">
        <label htmlFor="sv-message">{stelvoice.form.labels.message}</label>
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
      </div>
      <div className="consultation-submit">
        <p className="form-privacy">
          {contact.privacy} <Link href="/privacy">{contact.privacyLink}</Link>.
        </p>
        <button type="submit" className="marketing-button" disabled={pending}>
          <Send size={17} aria-hidden="true" />
          {pending
            ? stelvoice.form.pending
            : intent === "trial"
              ? stelvoice.form.submitTrial
              : intent === "pricing"
                ? stelvoice.form.submitPricing
                : stelvoice.form.submit}
        </button>
      </div>
      <div
        role="status"
        aria-live="polite"
        className={`consultation-status ${status ? "has-message" : ""}`}
        data-outcome={outcome}
      >
        {status && (
          <>
            {outcome === "success" ? (
              <CheckCircle2 size={22} aria-hidden="true" />
            ) : (
              <CircleAlert size={22} aria-hidden="true" />
            )}
            <p>{status}</p>
          </>
        )}
      </div>
      <SuccessDialog open={thanks} onClose={() => setThanks(false)} />
    </form>
  );
}
