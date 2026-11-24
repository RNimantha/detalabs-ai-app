import type { Inquiry, ProductInquiry } from "@/lib/contact-validation";

// Server-only integration. The shared secret must never be prefixed NEXT_PUBLIC_.
const DEPLOYED_WEBHOOK =
  "https://script.google.com/macros/s/AKfycbwqCYSaUWQFDTJuRdw6J4dQwvp_zAnP3mt-QxqYas2WPyt0vbsPv_73yzi9RzeiTPWu/exec";

export class LeadDeliveryError extends Error {
  constructor(public readonly code: string) {
    super("Lead delivery did not complete");
    this.name = "LeadDeliveryError";
  }
}

type DeliveryResult = { id: string; emailed: boolean };

export async function sendGoogleLead(
  values: Inquiry | ProductInquiry,
  leadId: string,
): Promise<DeliveryResult> {
  const secret = process.env.GOOGLE_LEADS_WEBHOOK_SECRET;
  if (!secret?.trim()) throw new LeadDeliveryError("NOT_CONFIGURED");
  const endpoint = process.env.GOOGLE_LEADS_WEBHOOK_URL || DEPLOYED_WEBHOOK;
  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    throw new LeadDeliveryError("INVALID_ENDPOINT");
  }
  if (
    url.origin !== "https://script.google.com" ||
    !/^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url.pathname) ||
    url.search ||
    url.hash
  ) {
    throw new LeadDeliveryError("INVALID_ENDPOINT");
  }
  const body = JSON.stringify({ ...values, leadId, secret });
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        redirect: "follow", // ContentService redirects its JSON to googleusercontent.com.
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) {
        if (response.status >= 500 || response.status === 429)
          throw new Error("Retryable transport error");
        throw new LeadDeliveryError("HTTP_REJECTED");
      }
      const data: unknown = await response.json();
      if (
        data &&
        typeof data === "object" &&
        "ok" in data &&
        data.ok === true &&
        "stored" in data &&
        data.stored === true &&
        "id" in data &&
        data.id === leadId
      ) {
        // Email may be pending; Apps Script's scheduled job retries notifications.
        return {
          id: leadId,
          emailed: "emailed" in data && data.emailed === true,
        };
      }
      if (
        data &&
        typeof data === "object" &&
        "retryable" in data &&
        data.retryable === true
      )
        throw new Error("Retryable webhook result");
      if (
        data &&
        typeof data === "object" &&
        "code" in data &&
        typeof data.code === "string" &&
        [
          "NOT_CONFIGURED",
          "UNAUTHORIZED",
          "INVALID_LEAD",
          "ID_CONFLICT",
        ].includes(data.code)
      ) {
        throw new LeadDeliveryError(`REMOTE_${data.code}`);
      }
      throw new LeadDeliveryError("WEBHOOK_REJECTED");
    } catch (error) {
      if (error instanceof LeadDeliveryError) throw error;
      if (attempt === 1) throw new LeadDeliveryError("DELIVERY_UNCONFIRMED");
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  throw new LeadDeliveryError("DELIVERY_UNCONFIRMED");
}
