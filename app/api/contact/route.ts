import { randomUUID } from "node:crypto";
import { sendGoogleLead, LeadDeliveryError } from "@/lib/google-leads";
import { NextRequest, NextResponse } from "next/server";
import { stelvoice } from "@/content/stelvoice";
import { contactSchema, productInquirySchema } from "@/lib/contact-validation";
import { contact } from "@/content/pages";
export async function POST(request: NextRequest) {
  if (Number(request.headers.get("content-length")) > 30000)
    return NextResponse.json({ error: contact.oversized }, { status: 413 });
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 30000)
      return NextResponse.json({ error: contact.oversized }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: contact.invalidBody }, { status: 400 });
  }
  const isProduct =
    typeof body === "object" &&
    body !== null &&
    "kind" in body &&
    body.kind === "stelvoice";
  const productResult = isProduct ? productInquirySchema.safeParse(body) : null;
  const result = productResult ?? contactSchema.safeParse(body);
  if (!result.success)
    return NextResponse.json(
      { error: contact.invalid, fields: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  const suppliedId =
    typeof body === "object" && body !== null && "leadId" in body
      ? body.leadId
      : undefined;
  if (
    suppliedId !== undefined &&
    (typeof suppliedId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        suppliedId,
      ))
  ) {
    return NextResponse.json({ error: contact.invalidBody }, { status: 400 });
  }
  const leadId = typeof suppliedId === "string" ? suppliedId : randomUUID();
  try {
    const saved = await sendGoogleLead(result.data, leadId);
    return NextResponse.json(
      {
        message: isProduct ? stelvoice.form.success : contact.success,
        id: saved.id,
      },
      { status: 201 },
    );
  } catch (error) {
    const code =
      error instanceof LeadDeliveryError ? error.code : "UNEXPECTED_ERROR";
    // Operational code only: do not log the secret or visitor's inquiry.
    console.error("Lead webhook failed:", code);
    const notConfigured =
      code === "NOT_CONFIGURED" || code === "REMOTE_NOT_CONFIGURED";
    return NextResponse.json(
      { error: notConfigured ? contact.unavailable : contact.error },
      { status: notConfigured ? 503 : 502 },
    );
  }
}
