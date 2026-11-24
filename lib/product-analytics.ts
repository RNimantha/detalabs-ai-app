// Connect a consent-aware analytics listener to this first-party event hook.
// No form fields, call data, or other identifying information are emitted.
export function productEvent(
  event:
    | "stelvoice_demo_request"
    | "stelvoice_trial_request"
    | "stelvoice_pricing_request"
    | "stelvoice_sign_in_click",
) {
  window.dispatchEvent(
    new CustomEvent("stelvoice:analytics", { detail: { event } }),
  );
}
