import { permanentRedirect } from "next/navigation";
import { stelvoice } from "@/content/stelvoice";
export default function PreviousProductPage() {
  permanentRedirect(stelvoice.path);
}
