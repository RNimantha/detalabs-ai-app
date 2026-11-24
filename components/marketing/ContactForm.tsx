"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useLeadSubmissionId } from "@/hooks/use-lead-submission-id";
import { CheckCircle2, CircleAlert, Send, ChevronDown } from "lucide-react";
import { contact } from "@/content/pages";
import { contactSchema } from "@/lib/contact-validation";

export default function ContactForm() {
  const submissionId = useLeadSubmissionId();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [outcome, setOutcome] = useState<"error" | "success">("error");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const result = contactSchema.safeParse(
      Object.fromEntries(new FormData(form)),
    );
    if (!result.success) {
      setErrors(
        Object.fromEntries(
          result.error.issues.map((issue) => [
            String(issue.path[0]),
            issue.message,
          ]),
        ),
      );
      setOutcome("error");
      setStatus(contact.invalid);
      form
        .querySelector<HTMLElement>(
          `[name="${result.error.issues[0].path[0]}"]`,
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
          ...result.data,
          leadId: submissionId.forPayload(result.data),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setOutcome("error");
        setStatus(data.error || contact.error);
        if (data.fields)
          setErrors(
            Object.fromEntries(
              Object.entries(data.fields).map(([key, value]) => [
                key,
                String((value as string[])[0]),
              ]),
            ),
          );
        return;
      }
      submissionId.clear();
      form.reset();
      setOutcome("success");
      setStatus(contact.success);
    } catch {
      setOutcome("error");
      setStatus(contact.error);
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className="contact-form consultation-form"
      method="post"
      action="/api/contact"
      noValidate
      onSubmit={submit}
      aria-labelledby="inquiry-heading"
      aria-busy={pending}
    >
      <div className="consultation-form-header">
        <p className="eyebrow">{contact.formEyebrow}</p>
        <h2 id="inquiry-heading">{contact.formTitle}</h2>
        <p>{contact.formDescription}</p>
        <small>{contact.requiredNote}</small>
      </div>
      <div className="form-grid consultation-fields">
        {(["name", "email", "company"] as const).map((name) => (
          <div className="consultation-field" key={name}>
            <label htmlFor={name}>
              {contact.fields[name]}
              {name !== "company" && <span aria-hidden="true"> *</span>}
            </label>
            <input
              id={name}
              name={name}
              type={name === "email" ? "email" : "text"}
              autoComplete={
                { name: "name", email: "email", company: "organization" }[name]
              }
              required={name !== "company"}
              maxLength={
                name === "company" ? 200 : name === "email" ? 254 : 100
              }
              aria-invalid={!!errors[name]}
              aria-describedby={errors[name] ? `${name}-error` : undefined}
            />
            {errors[name] && (
              <p className="field-error" id={`${name}-error`}>
                {errors[name]}
              </p>
            )}
          </div>
        ))}
        <div className="consultation-field">
          <label htmlFor="budget">
            {contact.fields.budget}
            <span aria-hidden="true"> *</span>
          </label>
          <div className="consultation-select">
            <select
              id="budget"
              name="budget"
              required
              defaultValue=""
              aria-invalid={!!errors.budget}
              aria-describedby={errors.budget ? "budget-error" : undefined}
            >
              <option value="" disabled>
                {contact.chooseBudget}
              </option>
              {contact.budgets.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <ChevronDown size={18} aria-hidden="true" />
          </div>
          {errors.budget && (
            <p className="field-error" id="budget-error">
              {errors.budget}
            </p>
          )}
        </div>
      </div>
      <fieldset
        className="consultation-services"
        data-invalid={!!errors.service}
        aria-describedby={errors.service ? "service-error" : undefined}
      >
        <legend>
          {contact.fields.service}
          <span aria-hidden="true"> *</span>
        </legend>
        <div className="consultation-service-grid">
          {contact.services.map((service) => (
            <label className="consultation-service" key={service}>
              <input type="radio" name="service" value={service} required />
              <span>{service}</span>
            </label>
          ))}
        </div>
        {errors.service && (
          <p className="field-error" id="service-error">
            {errors.service}
          </p>
        )}
      </fieldset>
      <div className="consultation-field">
        <label htmlFor="message">
          {contact.fields.message}
        </label>
        <p id="message-hint" className="consultation-hint">
          {contact.messageHint}
        </p>
        <textarea
          id="message"
          name="message"
          rows={5}
          maxLength={5000}
          aria-invalid={!!errors.message}
          aria-describedby={`message-hint${errors.message ? " message-error" : ""}`}
        />
        {errors.message && (
          <p className="field-error" id="message-error">
            {errors.message}
          </p>
        )}
      </div>
      <div className="consultation-submit">
        <p className="form-privacy">
          {contact.privacy} <Link href="/privacy">{contact.privacyLink}</Link>.
        </p>
        <button className="marketing-button" disabled={pending} type="submit">
          <Send size={17} aria-hidden="true" />
          {pending ? contact.pending : contact.submit}
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
    </form>
  );
}
