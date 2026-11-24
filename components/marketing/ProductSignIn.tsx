"use client";
import { stelvoice } from "@/content/stelvoice";
import { productEvent } from "@/lib/product-analytics";
export default function ProductSignIn() {
  if (!stelvoice.signInUrl || !/^https:\/\//.test(stelvoice.signInUrl))
    return null;
  return (
    <a
      className="sv-sign-in"
      href={stelvoice.signInUrl}
      onClick={() => productEvent("stelvoice_sign_in_click")}
    >
      {stelvoice.signIn}
    </a>
  );
}
