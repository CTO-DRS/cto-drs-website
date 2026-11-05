/* ═══════════════════════════════════════════════════════════
   البحث الذكي — فهرس محلي لكل محتوى الموقع
   • تطبيع عربي (همزات، تاء مربوطة، ألف مقصورة، تشكيل، تطويل)
   • مرادفات عربي ⇄ إنجليزي (أمن = security = حماية …)
   • مطابقة تقريبية تتسامح مع الأخطاء الإملائية البسيطة
   • ترتيب حسب الصلة: العنوان أولاً ثم الوسوم ثم الوصف
   يعمل بالكامل في المتصفح — مناسب للنسخة الثابتة
   ═══════════════════════════════════════════════════════════ */
import type { AppRoute } from "@/lib/router";
import {
  PROJECTS,
  COURSES,
  TOOLS,
  VIDEOS,
  SERVICES,
  SKILLS,
  PRICING_PLANS,
  EVENTS,
  TEAM,
  GALLERY,
} from "@/lib/data";
import { FAQS } from "@/lib/faq-data";
import { APPS } from "@/lib/apps";
import * as EN from "@/i18n/content-en";

export type SearchKind =
  | "صفحة"
  | "مشروع"
  | "خدمة"
  | "دورة"
  | "تطبيق"
  | "أداة"
  | "مهارة"
  | "سؤال"
  | "باقة"
  | "فعالية"
  | "فيديو"
  | "معرض"
  | "فريق";

export interface SearchDoc {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle?: string;
  tags?: string[];
  body?: string;
  route?: AppRoute;
  url?: string;
  /** English display/search text (lang = "en") */
  titleEn?: string;
  subtitleEn?: string;
  bodyEn?: string;
}

export interface SearchHit extends SearchDoc {
  score: number;
}

/* ── التطبيع ─────────────────────────────────────────────── */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "") // تشكيل + تطويل
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[^\p{L}\p{N}\s.+#]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** يحذف "ال" التعريف وبعض اللواحق الشائعة للوصول للجذر التقريبي */
function stem(w: string): string {
  let t = w;
  if (t.length > 4 && (t.startsWith("وال") || t.startsWith("بال") || t.startsWith("فال") || t.startsWith("كال")))
    t = t.slice(3);
  else if (t.length > 3 && t.startsWith("ال")) t = t.slice(2);
  if (t.length > 4 && /(ات|ون|ين|يه|ها)$/.test(t)) t = t.slice(0, -2);
  return t;
}

/* ── المرادفات ───────────────────────────────────────────── */
const SYNONYM_GROUPS: string[][] = [
  ["امن", "امان", "حمايه", "سيبراني", "security", "cyber", "اختراق", "ثغرات", "pentest", "vpn", "تشفير", "encryption"],
  ["اندرويد", "android", "جوال", "موبايل", "تطبيق", "تطبيقات", "app", "apk", "mobile", "kotlin", "java"],
  ["موقع", "مواقع", "ويب", "web", "website", "html", "css", "react", "next", "nextjs", "واجهه"],
  ["ذكاء", "اصطناعي", "ai", "gpt", "llm", "بوت", "bot", "chatbot", "نماذج", "وكيل", "agent"],
  ["بايثون", "python", "اتمته", "automation", "سكربت", "script"],
  ["قاعده", "بيانات", "database", "mysql", "sqlite", "sql", "postgres", "supabase"],
  ["دوره", "دورات", "كورس", "course", "تعلم", "تعليم", "درس", "دروس"],
  ["سعر", "اسعار", "باقه", "باقات", "تكلفه", "price", "pricing", "خطه"],
  ["حجز", "احجز", "استشاره", "موعد", "booking", "consultation"],
  ["تواصل", "اتصال", "واتساب", "whatsapp", "تيليجرام", "telegram", "ايميل", "بريد", "contact"],
  ["تحميل", "تنزيل", "download", "release", "اصدار"],
  ["متجر", "شراء", "منتج", "منتجات", "store", "shop", "سله"],
  ["لينكس", "linux", "bash", "terminal", "طرفيه"],
  ["جيت", "git", "github", "قيت", "مستودع", "repo", "مفتوح", "مصدر", "opensource"],
  ["كيبورد", "keyboard", "لوحه", "مفاتيح"],
  ["شبكه", "شبكات", "network", "networking", "اجهزه", "محلي"],
  ["php", "laravel", "بي اتش بي"],
];
const SYN = new Map<string, string[]>();
for (const g of SYNONYM_GROUPS) {
  const ng = g.map((w) => normalize(w));
  for (const w of ng) SYN.set(w, ng);
}

/* ── الفهرس ──────────────────────────────────────────────── */
const PAGES: { title: string; titleEn: string; route: AppRoute; keys: string }[] = [
  { title: "الرئيسية", titleEn: "Home", route: { name: "home" }, keys: "home بدايه" },
  { title: "من أنا", titleEn: "About me", route: { name: "about" }, keys: "about نبذه سيره bio" },
  { title: "الخدمات", titleEn: "Services", route: { name: "services" }, keys: "services" },
  { title: "المشاريع", titleEn: "Projects", route: { name: "projects" }, keys: "projects اعمال portfolio work" },
  { title: "الأكاديمية", titleEn: "Academy", route: { name: "home", slug: "academy" }, keys: "academy courses الدورات دورات اكاديميه الرشيد تعلم" },
  { title: "المتجر الرقمي", titleEn: "Digital Store", route: { name: "store" }, keys: "store shop" },
  { title: "المدونة", titleEn: "Blog", route: { name: "blog" }, keys: "blog مقالات articles" },
  { title: "احجز استشارة", titleEn: "Book a consultation", route: { name: "booking" }, keys: "booking" },
  { title: "مركز التحميل", titleEn: "Download Center", route: { name: "downloads" }, keys: "downloads apk" },
  { title: "الباقات والأسعار", titleEn: "Plans & Pricing", route: { name: "pricing" }, keys: "pricing plans" },
  { title: "الأسئلة الشائعة", titleEn: "FAQ", route: { name: "faq" }, keys: "faq اسئله questions" },
  { title: "آراء العملاء", titleEn: "Testimonials", route: { name: "testimonials" }, keys: "testimonials تقييمات reviews" },
  { title: "تواصل معي", titleEn: "Contact", route: { name: "contact" }, keys: "contact" },
  { title: "الأدوات والمكتبات", titleEn: "Tools & Libraries", route: { name: "tools" }, keys: "tools" },
  { title: "الفيديوهات", titleEn: "Videos", route: { name: "videos" }, keys: "videos يوتيوب youtube" },
  { title: "معرض الأعمال", titleEn: "Work Gallery", route: { name: "gallery" }, keys: "gallery صور" },
  { title: "الفعاليات والورش", titleEn: "Events & Workshops", route: { name: "events" }, keys: "events ورش workshops" },
  { title: "من خلف المنصة", titleEn: "Behind the platform", route: { name: "team" }, keys: "team فريق" },
  { title: "السلة", titleEn: "Cart", route: { name: "cart" }, keys: "cart" },
  { title: "سياسة الخصوصية", titleEn: "Privacy Policy", route: { name: "privacy" }, keys: "privacy" },
  { title: "الشروط والأحكام", titleEn: "Terms & Conditions", route: { name: "terms" }, keys: "terms" },
];

let DOCS: SearchDoc[] | null = null;

function buildDocs(): SearchDoc[] {
  const d: SearchDoc[] = [];
  PAGES.forEach((p) => d.push({ id: `page-${p.route.name}`, kind: "صفحة", title: p.title, titleEn: p.titleEn, body: p.keys, route: p.route }));
  PROJECTS.forEach((p) =>
    d.push({
      id: `proj-${p.id}`,
      kind: "مشروع",
      title: p.title,
      titleEn: EN.PROJECTS_EN[p.id]?.title,
      subtitle: p.language,
      tags: p.tags,
      body: p.description,
      bodyEn: EN.PROJECTS_EN[p.id]?.description,
      route: { name: "projects" },
      url: p.url,
    }),
  );
  SERVICES.forEach((s, i) => d.push({ id: `svc-${i}`, kind: "خدمة", title: s, titleEn: EN.SERVICES_EN[i], route: { name: "services" } }));
  COURSES.forEach((c, i) =>
    d.push({
      id: `course-${i}`,
      kind: "دورة",
      title: c.title,
      titleEn: EN.COURSES_EN[i]?.title,
      subtitle: `${c.lessons} درس · ${c.level}`,
      subtitleEn: `${c.lessons} lessons · ${EN.COURSES_EN[i]?.level ?? c.level}`,
      body: c.description,
      bodyEn: EN.COURSES_EN[i]?.description,
      route: { name: "home", slug: "academy" },
    }),
  );
  APPS.forEach((a) =>
    d.push({
      id: `app-${a.id}`,
      kind: "تطبيق",
      title: a.title,
      titleEn: EN.APPS_EN[a.id]?.title ?? a.titleEn,
      subtitle: `${a.titleEn} · ${a.version}`,
      tags: a.platforms,
      body: `${a.description} ${a.repo}`,
      bodyEn: EN.APPS_EN[a.id]?.description,
      route: { name: "downloads" },
    }),
  );
  TOOLS.forEach((t, i) => d.push({ id: `tool-${i}`, kind: "أداة", title: t.name, subtitle: t.version, body: t.description, bodyEn: EN.TOOLS_EN[i], route: { name: "tools" } }));
  SKILLS.forEach((s, i) => d.push({ id: `skill-${i}`, kind: "مهارة", title: s.name, subtitle: `${s.level} · ${s.percent}%`, body: s.category, route: { name: "home" } }));
  FAQS.forEach((f, i) =>
    d.push({ id: `faq-${i}`, kind: "سؤال", title: f.q, titleEn: EN.FAQS_EN[i]?.q, subtitle: f.cat, body: f.a, bodyEn: EN.FAQS_EN[i]?.a, route: { name: "faq" } }),
  );
  PRICING_PLANS.forEach((p, i) =>
    d.push({ id: `plan-${i}`, kind: "باقة", title: p.name, subtitle: p.tagline, body: p.features.join(" "), route: { name: "pricing" } }),
  );
  EVENTS.forEach((e, i) => d.push({ id: `event-${i}`, kind: "فعالية", title: e.title, subtitle: `${e.date} · ${e.mode}`, body: e.description, route: { name: "events" } }));
  VIDEOS.forEach((v, i) =>
    d.push({ id: `video-${i}`, kind: "فيديو", title: v.title, titleEn: EN.VIDEOS_EN[i]?.title, subtitle: v.duration, body: v.description, bodyEn: EN.VIDEOS_EN[i]?.description, route: { name: "videos" } }),
  );
  GALLERY.forEach((g, i) =>
    d.push({ id: `gal-${i}`, kind: "معرض", title: g.title, titleEn: EN.GALLERY_EN[i]?.title, body: g.description, bodyEn: EN.GALLERY_EN[i]?.description, route: { name: "gallery" } }),
  );
  TEAM.forEach((t, i) => d.push({ id: `team-${i}`, kind: "فريق", title: t.name, subtitle: t.role, tags: t.skills, body: t.bio, route: { name: "team" } }));
  return d;
}

interface Prepared {
  doc: SearchDoc;
  title: string[];
  tags: string[];
  body: string[];
  full: string;
}
let PREP: Prepared[] | null = null;

function words(s: string) {
  return normalize(s).split(" ").filter(Boolean);
}

function prepare(): Prepared[] {
  if (PREP) return PREP;
  DOCS = buildDocs();
  PREP = DOCS.map((doc) => {
    // نفهرس النص العربي والإنجليزي معاً — البحث يعمل بأي من اللغتين
    const title = words(doc.title + " " + (doc.subtitle ?? "") + " " + (doc.titleEn ?? "") + " " + (doc.subtitleEn ?? ""));
    const tags = words((doc.tags ?? []).join(" "));
    const body = words((doc.body ?? "") + " " + (doc.bodyEn ?? ""));
    return { doc, title, tags, body, full: [...title, ...tags, ...body].join(" ") };
  });
  return PREP;
}

/* مسافة تحرير محدودة للتسامح مع الأخطاء الإملائية */
function withinOneEdit(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0,
    j = 0,
    edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

function termScore(term: string, list: string[]): number {
  let best = 0;
  const st = stem(term);
  for (const w of list) {
    const sw = stem(w);
    if (w === term || sw === st) best = Math.max(best, 1);
    else if (w.startsWith(term) || sw.startsWith(st)) best = Math.max(best, 0.8);
    else if (term.length >= 3 && w.includes(term)) best = Math.max(best, 0.55);
    else if (term.length >= 4 && withinOneEdit(st, sw)) best = Math.max(best, 0.45);
    if (best === 1) break;
  }
  return best;
}

function scoreDoc(p: Prepared, term: string): number {
  const t = termScore(term, p.title) * 3;
  const g = termScore(term, p.tags) * 2;
  const b = termScore(term, p.body);
  return Math.max(t, g, b);
}

const KIND_BOOST: Partial<Record<SearchKind, number>> = { صفحة: 0.3, مشروع: 0.25, خدمة: 0.2, تطبيق: 0.2 };

export function smartSearch(query: string, limit = 24): SearchHit[] {
  const q = normalize(query);
  if (!q) return [];
  const terms = q.split(" ").filter((w) => w.length > 1 || /\d/.test(w));
  if (!terms.length) return [];
  const prep = prepare();
  const hits: SearchHit[] = [];
  for (const p of prep) {
    let total = 0;
    let matched = 0;
    for (const term of terms) {
      let s = scoreDoc(p, term);
      const syns = SYN.get(term) ?? SYN.get(stem(term));
      if (syns) for (const alt of syns) if (alt !== term) s = Math.max(s, scoreDoc(p, alt) * 0.7);
      if (s > 0) matched++;
      total += s;
    }
    if (!matched) continue;
    const coverage = matched / terms.length;
    if (terms.length > 1 && coverage < 0.5) continue;
    let score = total * coverage;
    if (p.full.includes(q) && terms.length > 1) score += 2; // العبارة كاملة
    score += KIND_BOOST[p.doc.kind] ?? 0;
    hits.push({ ...p.doc, score });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** اقتراحات سريعة تظهر قبل الكتابة */
export const SEARCH_SUGGESTIONS = ["أمن سيبراني", "تطبيق أندرويد", "NexusLink", "ذكاء اصطناعي", "دورة PHP", "الأسعار", "حجز استشارة"];
