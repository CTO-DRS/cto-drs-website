/**
 * إرسال نماذج الموقع بالبريد عبر نقطة academy.cto-drs.com/api/contact
 * (الموقع ثابت على GitHub Pages ولا يحمل أسراراً — الإرسال الفعلي عبر Resend في الأكاديمية).
 * المستلم يُحدَّد في الخادم حسب `kind` فقط — لا يرسل العميل عنوان المستلم أبداً.
 */
import { BRAND } from "@/lib/social";

export const CONTACT_ENDPOINT =
  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "https://academy.cto-drs.com/api/contact";

export type ContactKind =
  | "general"
  | "project"
  | "consultation"
  | "booking"
  | "quote"
  | "service"
  | "order"
  | "support"
  | "academy"
  | "newsletter";

/** العنوان الظاهر لكل نوع (للعرض وروابط mailto الاحتياطية فقط — يطابق توجيه الخادم) */
export const KIND_EMAIL: Record<ContactKind, string> = {
  general: BRAND.email,
  newsletter: BRAND.email,
  project: BRAND.contactEmail,
  consultation: BRAND.contactEmail,
  booking: BRAND.contactEmail,
  quote: BRAND.contactEmail,
  service: BRAND.contactEmail,
  order: BRAND.contactEmail,
  support: BRAND.supportEmail,
  academy: BRAND.academyEmail,
};

/** هدف المراسلة في نموذج التواصل → النوع */
export const PURPOSE_KIND: Record<string, ContactKind> = {
  project: "project",
  consulting: "consultation",
  security: "service",
  collab: "project",
  support: "support",
  other: "general",
};

export interface ContactEmailInput {
  kind: ContactKind;
  name?: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  details?: Array<{ label: string; value: string }>;
  lang?: "ar" | "en";
  /** حقل المصيدة (honeypot) — يجب أن يبقى فارغاً */
  website?: string;
}

export interface ContactEmailResult {
  ok: boolean;
  status: number;
  error?: string;
  message?: string;
}

export async function sendContactEmail(input: ContactEmailInput): Promise<ContactEmailResult> {
  try {
    const res = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        page: typeof window !== "undefined" ? window.location.href.split("#")[0] : undefined,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; message?: string };
    return { ok: res.ok && data.ok === true, status: res.status, error: data.error, message: data.message };
  } catch {
    return { ok: false, status: 0, error: "network" };
  }
}

export function mailtoHref(kind: ContactKind, subject?: string, body?: string): string {
  const q = new URLSearchParams();
  if (subject) q.set("subject", subject);
  if (body) q.set("body", body);
  const qs = q.toString().replace(/\+/g, "%20");
  return `mailto:${KIND_EMAIL[kind]}${qs ? `?${qs}` : ""}`;
}

/** مرجع قصير للطلبات (حجز/طلب متجر) يظهر للزائر وفي رسالة البريد */
export function shortRef(prefix: string): string {
  const t = Date.now().toString(36).toUpperCase().slice(-6);
  const r = Math.floor(Math.random() * 36 ** 2).toString(36).toUpperCase().padStart(2, "0");
  return `${prefix}-${t}${r}`;
}
