/* ─────────────────────────────────────────────
   قنوات التواصل الرسمية لـ CTO.DRS
   (المصدر: بطاقة الحسابات الرسمية)
   ───────────────────────────────────────────── */

export interface SocialLink {
  id: string;
  label: string;
  handle: string;
  url: string;
  color: string;
  glow: string;
}

export const BRAND = {
  name: "CTO.DRS",
  handle: "cto.drs",
  website: "https://cto-drs.xo.je/",
  websiteLabel: "cto-drs.xo.je",
} as const;

export const SOCIALS: SocialLink[] = [
  {
    id: "whatsapp",
    label: "واتساب (حساب تجاري)",
    handle: "wa.me/CTO.DRS",
    url: "https://wa.me/message/MVTVWPOPFOVFF1",
    color: "#25d366",
    glow: "rgba(37,211,102,0.22)",
  },
  {
    id: "telegram",
    label: "تيليجرام",
    handle: "@CTO_DRS",
    url: "https://t.me/CTO_DRS",
    color: "#2aabee",
    glow: "rgba(42,171,238,0.22)",
  },
  {
    id: "tiktok",
    label: "تيك توك",
    handle: "@cto.drs",
    url: "https://www.tiktok.com/@cto.drs",
    color: "#ff2a6d",
    glow: "rgba(255,42,109,0.22)",
  },
  {
    id: "x",
    label: "إكس (تويتر)",
    handle: "@cto_drs",
    url: "https://x.com/cto_drs",
    color: "#e7e9ea",
    glow: "rgba(231,233,234,0.18)",
  },
  {
    id: "instagram",
    label: "إنستغرام",
    handle: "@cto.drs",
    url: "https://www.instagram.com/cto.drs",
    color: "#e1306c",
    glow: "rgba(225,48,108,0.22)",
  },
  {
    id: "youtube",
    label: "يوتيوب",
    handle: "@cto-drs",
    url: "https://youtube.com/@cto-drs",
    color: "#ff0033",
    glow: "rgba(255,0,51,0.22)",
  },
  {
    id: "github",
    label: "جيت هب",
    handle: "CTO-DRS",
    url: "https://github.com/CTO-DRS",
    color: "#c9d1d9",
    glow: "rgba(201,209,217,0.18)",
  },
  {
    id: "website",
    label: "الموقع الرسمي",
    handle: "cto-drs.xo.je",
    url: "https://cto-drs.xo.je/",
    color: "#00f0ff",
    glow: "rgba(0,240,255,0.22)",
  },
];

export const SOCIAL_BY_ID = Object.fromEntries(SOCIALS.map((s) => [s.id, s])) as Record<string, SocialLink>;

/** القنوات السريعة الظاهرة كأيقونات مدمجة (الهيرو / الملف المهني) */
export const SOCIAL_ROW_IDS = ["whatsapp", "telegram", "tiktok", "x", "instagram", "youtube", "github"] as const;
