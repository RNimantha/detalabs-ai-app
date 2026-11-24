import { z } from "zod";
import { contact } from "@/content/pages";
export const contactSchema = z.object({
  name: z.string().trim().min(2, contact.nameError).max(100, contact.nameError),
  email: z
    .string()
    .trim()
    .email(contact.emailError)
    .max(254, contact.emailError),
  company: z
    .string()
    .trim()
    .max(200, contact.companyError)
    .optional()
    .default(""),
  service: z
    .string({ required_error: contact.serviceError })
    .refine((v) => contact.services.includes(v), contact.serviceError),
  budget: z
    .string()
    .refine((v) => contact.budgets.includes(v), contact.budgetError),
  message: z
    .string()
    .trim()
    .min(20, contact.messageError)
    .max(5000, contact.messageError),
});
export type Inquiry = z.infer<typeof contactSchema>;

// Product inquiries share delivery/storage with consultations, but have their own fields.
import { stelvoice } from "@/content/stelvoice";
export const productInquirySchema = z.object({
  kind: z.literal("stelvoice"),
  requestType: z.enum(["demo", "trial", "pricing"], {
    errorMap: () => ({ message: stelvoice.form.intentError }),
  }),
  name: z.string().trim().min(2, contact.nameError).max(100, contact.nameError),
  email: z
    .string()
    .trim()
    .email(contact.emailError)
    .max(254, contact.emailError),
  company: z
    .string()
    .trim()
    .min(2, stelvoice.form.companyError)
    .max(200, stelvoice.form.companyError),
  role: z
    .string()
    .trim()
    .max(200, stelvoice.form.optionalError)
    .optional()
    .default(""),
  teamSize: z
    .string()
    .trim()
    .max(200, stelvoice.form.optionalError)
    .optional()
    .default(""),
  volume: z
    .string()
    .trim()
    .max(200, stelvoice.form.optionalError)
    .optional()
    .default(""),
  message: z
    .string()
    .trim()
    .max(5000, stelvoice.form.messageError)
    .optional()
    .default(""),
});
export type ProductInquiry = z.infer<typeof productInquirySchema>;
