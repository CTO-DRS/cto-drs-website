/* ─────────────────────────────────────────────
   بيانات نموذج التواصل: الدول + أهداف المراسلة
   ───────────────────────────────────────────── */

export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string; // الاسم بالعربية
  flag: string; // إيموجي العلم
  dial: string; // رمز الاتصال الدولي
}

/** الدول مرتبة: الخليج أولاً ثم العالم العربي ثم الدول الشائعة */
export const COUNTRIES: Country[] = [
  { code: "SA", name: "السعودية", flag: "🇸🇦", dial: "+966" },
  { code: "AE", name: "الإمارات", flag: "🇦🇪", dial: "+971" },
  { code: "KW", name: "الكويت", flag: "🇰🇼", dial: "+965" },
  { code: "QA", name: "قطر", flag: "🇶🇦", dial: "+974" },
  { code: "BH", name: "البحرين", flag: "🇧🇭", dial: "+973" },
  { code: "OM", name: "عمان", flag: "🇴🇲", dial: "+968" },
  { code: "JO", name: "الأردن", flag: "🇯🇴", dial: "+962" },
  { code: "LB", name: "لبنان", flag: "🇱🇧", dial: "+961" },
  { code: "PS", name: "فلسطين", flag: "🇵🇸", dial: "+970" },
  { code: "SY", name: "سوريا", flag: "🇸🇾", dial: "+963" },
  { code: "IQ", name: "العراق", flag: "🇮🇶", dial: "+964" },
  { code: "YE", name: "اليمن", flag: "🇾🇪", dial: "+967" },
  { code: "EG", name: "مصر", flag: "🇪🇬", dial: "+20" },
  { code: "SD", name: "السودان", flag: "🇸🇩", dial: "+249" },
  { code: "LY", name: "ليبيا", flag: "🇱🇾", dial: "+218" },
  { code: "TN", name: "تونس", flag: "🇹🇳", dial: "+216" },
  { code: "DZ", name: "الجزائر", flag: "🇩🇿", dial: "+213" },
  { code: "MA", name: "المغرب", flag: "🇲🇦", dial: "+212" },
  { code: "MR", name: "موريتانيا", flag: "🇲🇷", dial: "+222" },
  { code: "SO", name: "الصومال", flag: "🇸🇴", dial: "+252" },
  { code: "DJ", name: "جيبوتي", flag: "🇩🇯", dial: "+253" },
  { code: "KM", name: "جزر القمر", flag: "🇰🇲", dial: "+269" },
  { code: "TR", name: "تركيا", flag: "🇹🇷", dial: "+90" },
  { code: "US", name: "أمريكا", flag: "🇺🇸", dial: "+1" },
  { code: "GB", name: "بريطانيا", flag: "🇬🇧", dial: "+44" },
  { code: "DE", name: "ألمانيا", flag: "🇩🇪", dial: "+49" },
  { code: "FR", name: "فرنسا", flag: "🇫🇷", dial: "+33" },
  { code: "SE", name: "السويد", flag: "🇸🇪", dial: "+46" },
  { code: "CA", name: "كندا", flag: "🇨🇦", dial: "+1" },
  { code: "AU", name: "أستراليا", flag: "🇦🇺", dial: "+61" },
  { code: "IN", name: "الهند", flag: "🇮🇳", dial: "+91" },
  { code: "PK", name: "باكستان", flag: "🇵🇰", dial: "+92" },
  { code: "ID", name: "إندونيسيا", flag: "🇮🇩", dial: "+62" },
  { code: "MY", name: "ماليزيا", flag: "🇲🇾", dial: "+60" },
  { code: "NG", name: "نيجيريا", flag: "🇳🇬", dial: "+234" },
  { code: "ZA", name: "جنوب أفريقيا", flag: "🇿🇦", dial: "+27" },
];

export const COUNTRY_BY_CODE: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c])
);

/**
 * كشف الدولة تلقائياً من المنطقة الزمنية للمتصفح (بدون أي API خارجي).
 * مثال: "Asia/Riyadh" → SA
 */
const TZ_TO_COUNTRY: Record<string, string> = {
  "Asia/Riyadh": "SA",
  "Asia/Dubai": "AE",
  "Asia/Kuwait": "KW",
  "Asia/Qatar": "QA",
  "Asia/Bahrain": "BH",
  "Asia/Muscat": "OM",
  "Asia/Amman": "JO",
  "Asia/Beirut": "LB",
  "Asia/Gaza": "PS",
  "Asia/Hebron": "PS",
  "Asia/Damascus": "SY",
  "Asia/Baghdad": "IQ",
  "Asia/Aden": "YE",
  "Africa/Cairo": "EG",
  "Africa/Khartoum": "SD",
  "Africa/Tripoli": "LY",
  "Africa/Tunis": "TN",
  "Africa/Algiers": "DZ",
  "Africa/Casablanca": "MA",
  "Africa/Nouakchott": "MR",
  "Africa/Mogadishu": "SO",
  "Africa/Djibouti": "DJ",
  "Indian/Comoro": "KM",
  "Europe/Istanbul": "TR",
  "Europe/Berlin": "DE",
  "Europe/Paris": "FR",
  "Europe/Stockholm": "SE",
  "Europe/London": "GB",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "Australia/Sydney": "AU",
  "Asia/Kolkata": "IN",
  "Asia/Karachi": "PK",
  "Asia/Jakarta": "ID",
  "Asia/Kuala_Lumpur": "MY",
  "Africa/Lagos": "NG",
  "Africa/Johannesburg": "ZA",
};

/** يرجع رمز الدولة المكتشفة من المتصفح أو null */
export function detectCountryCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TZ_TO_COUNTRY[tz] ?? null;
  } catch {
    return null;
  }
}

/* ── أهداف المراسلة ── */

export interface ContactPurpose {
  id: string;
  label: string;
  desc: string;
  color: string; // لون الحد عند التحديد
  glow: string;
}

export const CONTACT_PURPOSES: ContactPurpose[] = [
  {
    id: "project",
    label: "مشروع جديد",
    desc: "موقع، تطبيق، أو نظام متكامل",
    color: "#00f0ff",
    glow: "rgba(0,240,255,0.15)",
  },
  {
    id: "consulting",
    label: "استشارة فنية",
    desc: "مراجعة كود، معمارية، أو خارطة طريق",
    color: "#7c3aed",
    glow: "rgba(124,58,237,0.18)",
  },
  {
    id: "security",
    label: "أمن سيبراني",
    desc: "اختبار اختراق أو تقييم حماية",
    color: "#ff2a6d",
    glow: "rgba(255,42,109,0.15)",
  },
  {
    id: "collab",
    label: "تعاون أو شراكة",
    desc: "عمل مشترك أو شراكة تجارية",
    color: "#ffd700",
    glow: "rgba(255,215,0,0.15)",
  },
  {
    id: "support",
    label: "دعم فني",
    desc: "مشكلة في مشروع قائم",
    color: "#00ff88",
    glow: "rgba(0,255,136,0.15)",
  },
  {
    id: "other",
    label: "أخرى",
    desc: "أي استفسار آخر",
    color: "#a0aec0",
    glow: "rgba(160,174,192,0.15)",
  },
];

export const PURPOSE_BY_ID: Record<string, ContactPurpose> = Object.fromEntries(
  CONTACT_PURPOSES.map((p) => [p.id, p])
);

/** تنقية رقم الجوال: أرقام فقط بحد أقصى 15（معيار E.164）*/
export function sanitizePhone(raw: string): string {
  return raw.replace(/[^\d]/g, "").slice(0, 15);
}
