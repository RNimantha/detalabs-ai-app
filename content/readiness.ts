/** Editorial and deployment items to resolve before treating this site as publication-ready. */
export const readiness = {
  placeholders: [
    "Testimonials: five original sample entries restored with explicit sample labels. Confirm each quote, name, affiliation, result, and permission before changing its status to approved in content/site.ts.",
    "Home: confirmed industries served and target markets.",
    "Work and home: three illustrative case-study titles/categories; each needs [CLIENT PROBLEM], [APPROVED PROJECT DESCRIPTION], and [CLIENT RESULT].",
    "StelVoice: production sign-in URL, trial allowance/duration, plan limits, upload size/duration limits, and approved data-handling terms remain to be confirmed. Public pricing is quotation-based.",
    "Privacy: legal entity, effective date, governing requirements, privacy contact, lawful basis, purposes, retention, rights requests, providers, transfers, analytics, cookies, and consent requirements.",
    "Terms: contracting entity, effective date, governing law, disputes, approved project-agreement wording, permitted use, third parties, liability, intellectual property, and product-specific terms.",
  ],
  configuration: [
    "Confirm the canonical domain. NEXT_PUBLIC_SITE_URL currently defaults to https://detalabsai.com; metadata, sitemap, and robots use it.",
    "Configure NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY for blog/admin functionality. Lead forms now use Google Sheets independently.",
    "Configure GOOGLE_LEADS_WEBHOOK_SECRET to match LEADS_WEBHOOK_SECRET in Apps Script. The deployed /exec URL is configured in lib/google-leads.ts; GOOGLE_LEADS_WEBHOOK_URL can override it. Google sends both lead notifications; SMTP is not required for these forms.",
    "Set NEXT_PUBLIC_STELVOICE_SIGN_IN_URL to the verified HTTPS application sign-in URL to display Sign In. No destination is guessed.",
    "Consultation and StelVoice inquiries are saved to the Website Leads sheet and emailed to nimantha@detalabsai.com and info@detalabsai.com. Trial provisioning remains administrator-managed.",
    "Connect the stelvoice:analytics browser event hook in lib/product-analytics.ts to an approved analytics collector. It emits request-success and sign-in events without form data; no external collector is configured.",
    "Public previews are cropped/redacted from supplied screenshots and the proposal’s illustrative screens; sample labels are retained. Raw originals in app/Doc are not served as public assets.",
    "Replace sample testimonials in content/site.ts with approved feedback; the section still hides automatically if its data is empty.",
    "Social links are omitted because no verified URLs were supplied.",
  ],
} as const;
