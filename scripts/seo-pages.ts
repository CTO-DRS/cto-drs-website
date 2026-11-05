/* ═══════════════════════════════════════════════════════════
   seo-pages.ts — صفحات HTML ثابتة قابلة للفهرسة لكل قسم
   الواجهة التفاعلية تعمل بروابط # (غير قابلة للفهرسة كصفحات مستقلة)،
   فهذه الصفحات تمنح محركات البحث ونماذج الذكاء الاصطناعي
   عناوين URL حقيقية بمحتوى كامل + JSON-LD، مع رابط للنسخة التفاعلية.
   • العربية: /about/ … /contact/   (dir=rtl)
   • الإنجليزية: /en/ + /en/about/ … /en/contact/   (dir=ltr)
   • hreflang (ar, en, x-default) على كل الصفحات + sitemap.xml بالبدائل
   الاستخدام: bun scripts/seo-pages.ts <outDir>
   ═══════════════════════════════════════════════════════════ */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PROFILE, PROJECTS, SERVICES, SKILLS } from "../src/lib/data";
import { ACADEMY_TRACKS, ACADEMY_COURSES, ACADEMY_STATS, ACADEMY_REGISTER_URL, academyCourseUrl } from "../src/lib/academy";
import { FAQS } from "../src/lib/faq-data";
import { APPS, repoPageUrl, releasesPageUrl } from "../src/lib/apps";
import { SOCIALS, BRAND, ACADEMY_URL } from "../src/lib/social";
import * as EN from "../src/i18n/content-en";

const OUT = process.argv[2] || "out";
const SITE = "https://cto-drs.com";
const TODAY = new Date().toISOString().slice(0, 10);

type Lang = "ar" | "en";

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const PERSON = { "@type": "Person", "@id": `${SITE}/#person`, name: "CTO-DRS", url: `${SITE}/`, jobTitle: PROFILE.role, sameAs: SOCIALS.map((s) => s.url) };
const PERSON_EN = { ...PERSON, jobTitle: EN.PROFILE_EN.role };
/** أكاديمية الرشيد — منصة تعليمية مستقلة على نطاق فرعي */
const ACADEMY_ORG = {
  "@type": "EducationalOrganization",
  "@id": `${ACADEMY_URL}/#organization`,
  name: "أكاديمية الرشيد",
  alternateName: "Al-Rasheed Academy",
  url: `${ACADEMY_URL}/`,
  parentOrganization: { "@type": "Organization", "@id": `${SITE}/#organization`, name: "CTO-DRS", url: `${SITE}/` },
};

interface Page {
  slug: string;
  hash: string;
  title: string;
  description: string;
  h1: string;
  body: string;
  jsonld: object[];
  priority: string;
  /** رابط زر الدعوة بدل النسخة التفاعلية (اختياري) */
  cta?: { href: string; label: string };
}

const NAV: Record<Lang, [string, string][]> = {
  ar: [
    ["", "الرئيسية"],
    ["about", "من أنا"],
    ["services", "الخدمات"],
    ["projects", "المشاريع"],
    ["downloads", "التطبيقات"],
    ["academy", "الأكاديمية"],
    ["faq", "الأسئلة الشائعة"],
    ["contact", "تواصل"],
  ],
  en: [
    ["", "Home"],
    ["about", "About"],
    ["services", "Services"],
    ["projects", "Projects"],
    ["downloads", "Apps"],
    ["academy", "Academy"],
    ["faq", "FAQ"],
    ["contact", "Contact"],
  ],
};

/** مسار الصفحة لكل لغة — slug فارغ = الرئيسية */
const pathFor = (lang: Lang, slug: string) => (lang === "ar" ? `/${slug ? slug + "/" : ""}` : `/en/${slug ? slug + "/" : ""}`);
const urlFor = (lang: Lang, slug: string) => `${SITE}${pathFor(lang, slug)}`;
/** رابط النسخة التفاعلية (SPA) */
const appLink = (lang: Lang, hash: string) => (lang === "ar" ? `/#/${hash}` : `/?lang=en#/${hash}`);

function layout(p: Page, lang: Lang) {
  const url = urlFor(lang, p.slug);
  const isAr = lang === "ar";
  const homeName = isAr ? "الرئيسية" : "Home";
  const crumbs = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeName, item: urlFor(lang, "") },
      ...(p.slug ? [{ "@type": "ListItem", position: 2, name: p.h1, item: url }] : []),
    ],
  };
  const graph = { "@context": "https://schema.org", "@graph": [isAr ? PERSON : PERSON_EN, ACADEMY_ORG, crumbs, ...p.jsonld] };
  const academyLabel = isAr ? "الأكاديمية" : "Academy";
  const newTab = isAr ? "(يفتح في نافذة جديدة)" : "(opens in a new tab)";
  const academyLink = `<a href="${ACADEMY_URL}" target="_blank" rel="noopener" aria-label="${academyLabel} ${newTab}">${academyLabel}</a>`;
  const other: Lang = isAr ? "en" : "ar";
  const switchLabel = isAr ? "English" : "العربية";
  const ctaLabel = isAr ? "افتح النسخة التفاعلية ←" : "Open the interactive version →";
  const skip = isAr ? "تخطي إلى المحتوى الرئيسي" : "Skip to main content";
  return `<!doctype html>
<html lang="${lang}" dir="${isAr ? "rtl" : "ltr"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="ar" href="${urlFor("ar", p.slug)}">
<link rel="alternate" hreflang="en" href="${urlFor("en", p.slug)}">
<link rel="alternate" hreflang="x-default" href="${urlFor("ar", p.slug)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#030303">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/icons/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="CTO-DRS">
<meta property="og:locale" content="${isAr ? "ar_SA" : "en_US"}">
<meta property="og:locale:alternate" content="${isAr ? "en_US" : "ar_SA"}">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@cto_drs">
<script type="application/ld+json">${JSON.stringify(graph)}</script>
<style>
:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#030303;color:#e6edf3;font:16px/1.8 system-ui,"Segoe UI",Tahoma,sans-serif}
a{color:#00f0ff}header,main,footer{max-width:960px;margin:auto;padding:16px 20px}
header{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;border-bottom:1px solid #1c2333}
.brand{font-weight:800;font-size:20px;text-decoration:none;color:#fff}.brand b{color:#00f0ff}.brand i{color:#ff2a6d;font-style:normal}
nav a{margin-inline-start:12px;color:#b4c0cf;text-decoration:none;font-size:14px}nav a:hover,nav a[aria-current]{color:#00f0ff}
h1{font-size:30px;line-height:1.4;background:linear-gradient(90deg,#00f0ff,#7c3aed,#ff2a6d);-webkit-background-clip:text;background-clip:text;color:transparent}
h2{font-size:21px;margin-top:28px}.card{background:#0d1117;border:1px solid #1c2333;border-radius:16px;padding:16px 18px;margin:12px 0}
.tags span{display:inline-block;font-size:12px;border:1px solid #1c2333;border-radius:999px;padding:2px 10px;margin:2px;color:#b4c0cf}
.cta{display:inline-block;margin:18px 0;padding:10px 20px;border-radius:999px;background:linear-gradient(90deg,#00f0ff,#7c3aed);color:#030303;font-weight:700;text-decoration:none}
footer{border-top:1px solid #1c2333;color:#9aa4b0;font-size:14px}footer a{margin-inline-end:10px}
.skip{position:absolute;inset-inline-start:12px;top:-60px;background:#00f0ff;color:#030303;padding:8px 16px;border-radius:999px;font-weight:700;z-index:10}.skip:focus{top:12px}
a:focus-visible{outline:3px solid #00f0ff;outline-offset:2px;border-radius:4px}
.lang{border:1px solid #1c2333;border-radius:999px;padding:2px 12px}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
</style>
</head>
<body>
<a class="skip" href="#main">${skip}</a>
<header>
<a class="brand" href="${pathFor(lang, "")}" dir="ltr"><b>CTO</b>-<i>DRS</i></a>
<nav aria-label="${isAr ? "التنقل الرئيسي" : "Main navigation"}">${NAV[lang]
    .map(([s, l]) => `<a href="${pathFor(lang, s)}"${s === p.slug ? ' aria-current="page"' : ""}>${l}</a>`)
    .join("")}${academyLink}<a class="lang" href="${pathFor(other, p.slug)}" hreflang="${other}" lang="${other}">${switchLabel}</a></nav>
</header>
<main id="main">
<h1>${esc(p.h1)}</h1>
${p.body}
${p.cta ? `<a class="cta" href="${p.cta.href}" target="_blank" rel="noopener">${esc(p.cta.label)}</a> ` : ""}<a class="cta" href="${appLink(lang, p.hash)}">${ctaLabel}</a>
</main>
<footer>
<p>© ${new Date().getFullYear()} CTO-DRS — ${esc(PROFILE.roleEn)} · <a href="mailto:${BRAND.email}">${BRAND.email}</a></p>
<p>${SOCIALS.map((s) => `<a href="${s.url}" target="_blank" rel="me noopener noreferrer">${esc(isAr ? s.label : EN.SOCIALS_EN[s.id]?.label ?? s.label)}</a>`).join("")}</p>
<p>${isAr ? "أكاديمية الرشيد" : "Al-Rasheed Academy"}: ${academyLink}</p>
</footer>
</body>
</html>`;
}

const arPages: Page[] = [];

/* من أنا */
arPages.push({
  slug: "about",
  hash: "about",
  title: "من هو CTO-DRS؟ | مهندس برمجيات وأمن سيبراني",
  description: PROFILE.heroDesc,
  h1: "من هو CTO-DRS؟",
  priority: "0.9",
  body: `<p>${esc(PROFILE.bio1)}</p><p>${esc(PROFILE.bio2)} <strong dir="ltr">${esc(PROFILE.philosophy)}</strong></p>
<h2>المهارات التقنية</h2>${SKILLS.map((s) => `<div class="card"><strong>${esc(s.name)}</strong> — ${esc(s.category)} · ${s.level} (${s.percent}%)</div>`).join("")}`,
  jsonld: [
    {
      "@type": "ProfilePage",
      url: `${SITE}/about/`,
      mainEntity: { "@id": `${SITE}/#person`, knowsAbout: SKILLS.map((s) => s.name), description: PROFILE.bio1 },
    },
  ],
});

/* الخدمات */
arPages.push({
  slug: "services",
  hash: "services",
  title: "خدمات CTO-DRS | تطوير أندرويد، مواقع آمنة، اختبار اختراق، أتمتة Python",
  description: "خدمات تقنية احترافية من CTO-DRS: " + SERVICES.join("، ") + ". احجز استشارة مجانية.",
  h1: "الخدمات التقنية",
  priority: "0.9",
  body:
    `<p>أقدّم حلولاً تقنية آمنة وقابلة للصيانة للأفراد والشركات في السعودية والعالم العربي، عن بُعد.</p>` +
    SERVICES.map((s) => `<div class="card"><h2 style="margin:0;font-size:18px">${esc(s)}</h2></div>`).join("") +
    `<p><a href="/#/booking">احجز استشارة</a> أو راسلني على <a href="${SOCIALS.find((s) => s.id === "whatsapp")?.url}">واتساب</a>.</p>`,
  jsonld: [
    {
      "@type": "ItemList",
      name: "خدمات CTO-DRS",
      itemListElement: SERVICES.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "Service", name: s, provider: { "@id": `${SITE}/#person` }, areaServed: ["SA", "Worldwide"], availableLanguage: ["ar", "en"] },
      })),
    },
  ],
});

/* المشاريع */
arPages.push({
  slug: "projects",
  hash: "projects",
  title: "مشاريع CTO-DRS مفتوحة المصدر | NexusLink، SecureNet VPN وغيرها",
  description: "مشاريع CTO-DRS على GitHub: " + PROJECTS.map((p) => p.title.split(" — ")[0]).join("، ") + ".",
  h1: "المشاريع المفتوحة المصدر",
  priority: "0.9",
  body: PROJECTS.map(
    (p) => `<div class="card"><h2 style="margin:0 0 6px;font-size:19px">${esc(p.title)}</h2><p>${esc(p.description)}</p>
<div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>${p.url ? `<p><a href="${p.url}" rel="noopener">الكود على GitHub</a></p>` : ""}</div>`,
  ).join(""),
  jsonld: [
    {
      "@type": "ItemList",
      name: "مشاريع CTO-DRS",
      itemListElement: PROJECTS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "SoftwareSourceCode",
          name: p.title,
          description: p.description,
          programmingLanguage: p.language,
          codeRepository: p.url,
          author: { "@id": `${SITE}/#person` },
          keywords: p.tags.join(", "),
        },
      })),
    },
  ],
});

/* التطبيقات */
arPages.push({
  slug: "downloads",
  hash: "downloads",
  title: "تحميل تطبيقات CTO-DRS | APK مباشر من GitHub Releases",
  description: "حمّل تطبيقات CTO-DRS مجاناً: " + APPS.slice(0, 8).map((a) => a.titleEn).join("، ") + " وغيرها — روابط مباشرة من GitHub.",
  h1: "مركز تحميل التطبيقات",
  priority: "0.9",
  body: APPS.map(
    (a) => `<div class="card"><h2 style="margin:0 0 6px;font-size:19px">${esc(a.title)}</h2><p>${esc(a.description)}</p>
<p>المنصات: ${a.platforms.map(esc).join("، ")} · الإصدار ${esc(a.version)} · الحجم ${esc(a.size)}</p>
<p><a href="${releasesPageUrl(a.repo)}" rel="noopener">التحميل</a> · <a href="${repoPageUrl(a.repo)}" rel="noopener">الكود</a></p></div>`,
  ).join(""),
  jsonld: [
    {
      "@type": "ItemList",
      name: "تطبيقات CTO-DRS",
      itemListElement: APPS.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "SoftwareApplication",
          name: a.titleEn,
          alternateName: a.title,
          description: a.description,
          applicationCategory: a.category === "android" ? "MobileApplication" : a.category === "web" ? "WebApplication" : "DeveloperApplication",
          operatingSystem: a.platforms.join(", "),
          softwareVersion: a.version,
          downloadUrl: releasesPageUrl(a.repo),
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          author: { "@id": `${SITE}/#person` },
        },
      })),
    },
  ],
});

/* أكاديمية الرشيد */
const LEVEL_AR = { beginner: "مبتدئ", intermediate: "متوسط", advanced: "متقدّم" } as const;
const LEVEL_EN = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" } as const;
const academyCourseList = (lang: Lang) => ({
  "@type": "ItemList",
  name: lang === "ar" ? "دورات أكاديمية الرشيد" : "Al-Rasheed Academy courses",
  numberOfItems: ACADEMY_COURSES.length,
  itemListElement: ACADEMY_COURSES.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Course",
      name: lang === "ar" ? c.titleAr : c.title,
      alternateName: lang === "ar" ? c.title : c.titleAr,
      description:
        lang === "ar"
          ? `${c.titleAr} — دورة ضمن ${c.trackAr} (${LEVEL_AR[c.level]}، ${c.lessons} دروس).`
          : `${c.title} — part of the ${c.track} (${LEVEL_EN[c.level]}, ${c.lessons} lessons).`,
      url: academyCourseUrl(c.slug),
      inLanguage: "ar",
      educationalLevel: c.level,
      isAccessibleForFree: true,
      provider: { "@id": `${ACADEMY_URL}/#organization` },
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD", category: "Free" },
      hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: `PT${c.hours}H` },
    },
  })),
});

arPages.push({
  slug: "academy",
  hash: "home",
  title: "أكاديمية الرشيد | تعلّم الأمن السيبراني والبرمجة والاختراق الأخلاقي مجاناً بالعربي",
  description: `أكاديمية الرشيد من CTO-DRS: ${ACADEMY_STATS.tracks} مسارات، ${ACADEMY_STATS.courses} دورة، ${ACADEMY_STATS.lessons} درساً، ${ACADEMY_STATS.quizzes} سؤال اختبار و${ACADEMY_STATS.ctf} تحديات CTF — مجاناً وبالعربي.`,
  h1: "أكاديمية الرشيد",
  priority: "0.8",
  cta: { href: ACADEMY_REGISTER_URL, label: "سجّل مجاناً في الأكاديمية" },
  body:
    `<p>أكاديمية الرشيد منصة تعلّم (LMS) عربية أولاً متخصصة في الأمن السيبراني والبرمجة والاختراق الأخلاقي، تأخذك من الأساسيات حتى المستوى المتقدّم. المحتوى مجاني بالكامل، ومتاح بالعربية والإنجليزية: <a href="${ACADEMY_URL}" rel="noopener">academy.cto-drs.com</a>.</p>` +
    `<p><strong>${ACADEMY_STATS.tracks}</strong> مسارات · <strong>${ACADEMY_STATS.courses}</strong> دورة · <strong>${ACADEMY_STATS.lessons}</strong> درساً · <strong>${ACADEMY_STATS.quizzes}</strong> سؤال اختبار · <strong>${ACADEMY_STATS.ctf}</strong> تحديات CTF</p>` +
    `<h2>ماذا تقدّم الأكاديمية؟</h2><ul>` +
    [
      "محتوى منظّم: مسارات ← دورات ← وحدات ← دروس، مع اختبار قصير لكل درس.",
      "شهادة إتمام قابلة للتحقق عند إكمال الدورة.",
      "تحديات CTF عملية في التشفير والويب والشبكات والتحليل الجنائي، والتحقق من الأعلام على الخادم.",
      "مختبرات وأدوات ومسرد مصطلحات وخريطة طريق للتعلّم.",
      "مجتمع: منتدى، أسئلة وأجوبة، تعليقات وتقييمات.",
      "تحفيز: نقاط XP ومستويات وسلاسل تعلّم وشارات ولوحة صدارة.",
      "ثنائية اللغة (RTL/LTR) مع وضع ليلي وفاتح، وتسجيل دخول بتحقق ثنائي (2FA).",
    ].map((x) => `<li>${esc(x)}</li>`).join("") +
    `</ul><h2>المسارات والدورات</h2>` +
    ACADEMY_TRACKS.map(
      (t) =>
        `<div class="card"><h2 style="margin:0 0 6px;font-size:19px">${t.icon} ${esc(t.titleAr)}</h2><p>${esc(t.descAr)}</p><ol>${t.courses
          .map((c) => `<li><a href="${academyCourseUrl(c.slug)}" rel="noopener">${esc(c.titleAr)}</a> — ${LEVEL_AR[c.level]} · ${c.lessons} دروس · ${c.hours} ساعات</li>`)
          .join("")}</ol></div>`,
    ).join("") +
    `<h2>كيف تبدأ؟</h2><ol><li>سجّل مجاناً.</li><li>اختر مساراً.</li><li>تعلّم واختبر نفسك بالاختبارات والتحديات.</li><li>أكمل الدورة واحصل على شهادة الإتمام.</li></ol>`,
  jsonld: [academyCourseList("ar")],
});

/* الأسئلة الشائعة */
arPages.push({
  slug: "faq",
  hash: "faq",
  title: "الأسئلة الشائعة | CTO-DRS",
  description: "إجابات عن مدة تنفيذ المشاريع، الأسعار، الدفع، الضمان والدعم الفني لدى CTO-DRS.",
  h1: "الأسئلة الشائعة",
  priority: "0.8",
  body: FAQS.map((f) => `<div class="card"><h2 style="margin:0 0 6px;font-size:18px">${esc(f.q)}</h2><p>${esc(f.a)}</p></div>`).join(""),
  jsonld: [{ "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }],
});

/* تواصل */
arPages.push({
  slug: "contact",
  hash: "contact",
  title: "تواصل مع CTO-DRS | واتساب، تيليجرام، البريد",
  description: `تواصل مع CTO-DRS لطلب مشروع أو استشارة تقنية: واتساب للأعمال، تيليجرام t.me/ctodrs، البريد ${BRAND.email}.`,
  h1: "تواصل معي",
  priority: "0.8",
  body:
    `<p>البريد: <a href="mailto:${BRAND.email}">${BRAND.email}</a></p>` +
    SOCIALS.map((s) => `<div class="card"><strong>${esc(s.label)}</strong> — <a href="${s.url}" target="_blank" rel="me noopener noreferrer">${esc(s.handle)}</a></div>`).join(""),
  jsonld: [
    {
      "@type": "ContactPage",
      url: `${SITE}/contact/`,
      mainEntity: { "@id": `${SITE}/#person`, email: BRAND.email, contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: BRAND.email, availableLanguage: ["ar", "en"] } },
    },
  ],
});


/* ═════════════ English pages (/en/…) ═════════════ */
const enPages: Page[] = [];
const enProject = (id: string) => EN.PROJECTS_EN[id];
const enApp = (id: string) => EN.APPS_EN[id];

/* Home */
enPages.push({
  slug: "",
  hash: "home",
  title: "CTO-DRS | Software Engineering, Cybersecurity & Innovation",
  description: EN.PROFILE_EN.heroDesc,
  h1: "CTO-DRS — Software Engineering • Cybersecurity • Innovation",
  priority: "1.0",
  body:
    `<p>${esc(EN.PROFILE_EN.tagline)}.</p><p>${esc(EN.PROFILE_EN.heroDesc)}</p>` +
    `<h2>Explore</h2>` +
    [
      ["about", "About CTO-DRS", "Profile, philosophy and technical skills."],
      ["services", "Services", EN.SERVICES_EN.join(" · ")],
      ["projects", "Open-source projects", PROJECTS.map((p) => enProject(p.id)?.title.split(" — ")[0] ?? p.title).join(" · ")],
      ["downloads", "App downloads", "Direct APK/ZIP downloads from GitHub Releases."],
      ["academy", "Al-Rasheed Academy", "Free Arabic-first learning platform: 5 tracks, 15 courses, 120 lessons and 6 CTF challenges."],
      ["faq", "FAQ", "Timelines, pricing, payments, warranty and support."],
      ["contact", "Contact", `WhatsApp Business, Telegram and ${BRAND.email}.`],
    ]
      .map(([s, t, d]) => `<div class="card"><h2 style="margin:0 0 6px;font-size:19px"><a href="/en/${s}/">${esc(t)}</a></h2><p>${esc(d)}</p></div>`)
      .join(""),
  jsonld: [
    {
      "@type": "WebSite",
      "@id": `${SITE}/en/#website`,
      url: `${SITE}/en/`,
      name: "CTO-DRS",
      inLanguage: "en",
      description: "The developer platform for software engineering, cybersecurity and innovation",
      publisher: { "@id": `${SITE}/#person` },
    },
  ],
});

/* About */
enPages.push({
  slug: "about",
  hash: "about",
  title: "Who is CTO-DRS? | Software & Cybersecurity Engineer",
  description: EN.PROFILE_EN.heroDesc,
  h1: "Who is CTO-DRS?",
  priority: "0.9",
  body: `<p>${esc(EN.PROFILE_EN.bio1)}</p><p>${esc(EN.PROFILE_EN.bio2)} <strong dir="ltr">${esc(PROFILE.philosophy)}</strong></p>
<h2>Technical skills</h2>${SKILLS.map((s) => `<div class="card"><strong>${esc(s.name)}</strong> — ${esc(s.category)} · ${s.level} (${s.percent}%)</div>`).join("")}`,
  jsonld: [
    {
      "@type": "ProfilePage",
      url: `${SITE}/en/about/`,
      inLanguage: "en",
      mainEntity: { "@id": `${SITE}/#person`, knowsAbout: SKILLS.map((s) => s.name), description: EN.PROFILE_EN.bio1 },
    },
  ],
});

/* Services */
enPages.push({
  slug: "services",
  hash: "services",
  title: "CTO-DRS Services | Android Development, Secure Websites, Penetration Testing, Python Automation",
  description: "Professional technical services from CTO-DRS: " + EN.SERVICES_EN.join(", ") + ". Book a free consultation.",
  h1: "Technical Services",
  priority: "0.9",
  body:
    `<p>I deliver secure, maintainable technical solutions for individuals and businesses in Saudi Arabia, the Arab world and beyond — fully remote.</p>` +
    EN.SERVICES_EN.map((s) => `<div class="card"><h2 style="margin:0;font-size:18px">${esc(s)}</h2></div>`).join("") +
    `<p><a href="/?lang=en#/booking">Book a consultation</a> or message me on <a href="${SOCIALS.find((s) => s.id === "whatsapp")?.url}">WhatsApp</a>.</p>`,
  jsonld: [
    {
      "@type": "ItemList",
      name: "CTO-DRS services",
      itemListElement: EN.SERVICES_EN.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "Service", name: s, provider: { "@id": `${SITE}/#person` }, areaServed: ["SA", "Worldwide"], availableLanguage: ["ar", "en"] },
      })),
    },
  ],
});

/* Projects */
enPages.push({
  slug: "projects",
  hash: "projects",
  title: "CTO-DRS Open-Source Projects | NexusLink, SecureNet VPN and more",
  description: "CTO-DRS projects on GitHub: " + PROJECTS.map((p) => (enProject(p.id)?.title ?? p.title).split(" — ")[0]).join(", ") + ".",
  h1: "Open-Source Projects",
  priority: "0.9",
  body: PROJECTS.map((p) => {
    const e = enProject(p.id);
    return `<div class="card"><h2 style="margin:0 0 6px;font-size:19px">${esc(e?.title ?? p.title)}</h2><p>${esc(e?.description ?? p.description)}</p>
<div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>${p.url ? `<p><a href="${p.url}" rel="noopener">Source code on GitHub</a></p>` : ""}</div>`;
  }).join(""),
  jsonld: [
    {
      "@type": "ItemList",
      name: "CTO-DRS projects",
      itemListElement: PROJECTS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "SoftwareSourceCode",
          name: enProject(p.id)?.title ?? p.title,
          description: enProject(p.id)?.description ?? p.description,
          programmingLanguage: p.language,
          codeRepository: p.url,
          author: { "@id": `${SITE}/#person` },
          keywords: p.tags.join(", "),
        },
      })),
    },
  ],
});

/* Downloads */
enPages.push({
  slug: "downloads",
  hash: "downloads",
  title: "Download CTO-DRS Apps | Direct APKs from GitHub Releases",
  description: "Download CTO-DRS apps for free: " + APPS.slice(0, 8).map((a) => a.titleEn).join(", ") + " and more — direct links from GitHub.",
  h1: "App Download Center",
  priority: "0.9",
  body: APPS.map((a) => {
    const e = enApp(a.id);
    return `<div class="card"><h2 style="margin:0 0 6px;font-size:19px">${esc(e?.title ?? a.titleEn)}</h2><p>${esc(e?.description ?? a.description)}</p>
<p>Platforms: ${a.platforms.map(esc).join(", ")} · Version ${esc(a.version)} · Size ${esc(a.size)}</p>
<p><a href="${releasesPageUrl(a.repo)}" rel="noopener">Download</a> · <a href="${repoPageUrl(a.repo)}" rel="noopener">Source code</a></p></div>`;
  }).join(""),
  jsonld: [
    {
      "@type": "ItemList",
      name: "CTO-DRS apps",
      itemListElement: APPS.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "SoftwareApplication",
          name: a.titleEn,
          description: enApp(a.id)?.description ?? a.description,
          applicationCategory: a.category === "android" ? "MobileApplication" : a.category === "web" ? "WebApplication" : "DeveloperApplication",
          operatingSystem: a.platforms.join(", "),
          softwareVersion: a.version,
          downloadUrl: releasesPageUrl(a.repo),
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          author: { "@id": `${SITE}/#person` },
        },
      })),
    },
  ],
});

/* Academy */
enPages.push({
  slug: "academy",
  hash: "home",
  title: "Al-Rasheed Academy | Learn Cybersecurity, Programming & Ethical Hacking for Free",
  description: `Al-Rasheed Academy by CTO-DRS: ${ACADEMY_STATS.tracks} tracks, ${ACADEMY_STATS.courses} courses, ${ACADEMY_STATS.lessons} lessons, ${ACADEMY_STATS.quizzes} quiz questions and ${ACADEMY_STATS.ctf} CTF challenges — free and Arabic-first.`,
  h1: "Al-Rasheed Academy",
  priority: "0.8",
  cta: { href: ACADEMY_REGISTER_URL, label: "Sign up free at the academy" },
  body:
    `<p>Al-Rasheed Academy is an Arabic-first learning platform (LMS) for cybersecurity, programming and ethical hacking that takes you from the fundamentals to advanced topics. All content is free, in Arabic with an English interface: <a href="${ACADEMY_URL}" rel="noopener">academy.cto-drs.com</a>.</p>` +
    `<p><strong>${ACADEMY_STATS.tracks}</strong> tracks · <strong>${ACADEMY_STATS.courses}</strong> courses · <strong>${ACADEMY_STATS.lessons}</strong> lessons · <strong>${ACADEMY_STATS.quizzes}</strong> quiz questions · <strong>${ACADEMY_STATS.ctf}</strong> CTF challenges</p>` +
    `<h2>What the academy offers</h2><ul>` +
    [
      "Structured content: tracks → courses → modules → lessons, with a short quiz for every lesson.",
      "A verifiable certificate of completion when you finish a course.",
      "Hands-on CTF challenges in cryptography, web, networking and forensics, with flags checked server-side.",
      "Labs, tools, a glossary of terms and a learning roadmap.",
      "Community: forum, Q&A, comments and ratings.",
      "Gamification: XP, levels, learning streaks, badges and a leaderboard.",
      "Bilingual (RTL/LTR) with dark and light themes, and sign-in with two-factor authentication (2FA).",
    ].map((x) => `<li>${esc(x)}</li>`).join("") +
    `</ul><h2>Tracks &amp; courses</h2>` +
    ACADEMY_TRACKS.map(
      (t) =>
        `<div class="card"><h2 style="margin:0 0 6px;font-size:19px">${t.icon} ${esc(t.title)}</h2><p>${esc(t.desc)}</p><ol>${t.courses
          .map((c) => `<li><a href="${academyCourseUrl(c.slug)}" rel="noopener">${esc(c.title)}</a> <span lang="ar">(${esc(c.titleAr)})</span> — ${LEVEL_EN[c.level]} · ${c.lessons} lessons · ${c.hours} hours</li>`)
          .join("")}</ol></div>`,
    ).join("") +
    `<h2>How it works</h2><ol><li>Sign up for free.</li><li>Pick a track.</li><li>Learn and test yourself with quizzes and challenges.</li><li>Finish the course and earn your certificate.</li></ol>`,
  jsonld: [academyCourseList("en")],
});

/* FAQ */
enPages.push({
  slug: "faq",
  hash: "faq",
  title: "Frequently Asked Questions | CTO-DRS",
  description: "Answers about project timelines, pricing, payments, warranty and technical support at CTO-DRS.",
  h1: "Frequently Asked Questions",
  priority: "0.8",
  body: EN.FAQS_EN.map((f) => `<div class="card"><h2 style="margin:0 0 6px;font-size:18px">${esc(f.q)}</h2><p>${esc(f.a)}</p></div>`).join(""),
  jsonld: [{ "@type": "FAQPage", inLanguage: "en", mainEntity: EN.FAQS_EN.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }],
});

/* Contact */
enPages.push({
  slug: "contact",
  hash: "contact",
  title: "Contact CTO-DRS | WhatsApp, Telegram, Email",
  description: `Contact CTO-DRS for a project or technical consultation: WhatsApp Business, Telegram t.me/ctodrs, email ${BRAND.email}.`,
  h1: "Get in Touch",
  priority: "0.8",
  body:
    `<p>Email: <a href="mailto:${BRAND.email}">${BRAND.email}</a></p>` +
    SOCIALS.map((s) => {
      const e = EN.SOCIALS_EN[s.id];
      return `<div class="card"><strong>${esc(e?.label ?? s.label)}</strong> — <a href="${s.url}" target="_blank" rel="me noopener noreferrer">${esc(e?.handle ?? s.handle)}</a></div>`;
    }).join(""),
  jsonld: [
    {
      "@type": "ContactPage",
      url: `${SITE}/en/contact/`,
      inLanguage: "en",
      mainEntity: { "@id": `${SITE}/#person`, email: BRAND.email, contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: BRAND.email, availableLanguage: ["ar", "en"] } },
    },
  ],
});

/* ═════════════ write ═════════════ */
for (const p of arPages) {
  const dir = join(OUT, p.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), layout(p, "ar"));
}
for (const p of enPages) {
  const dir = join(OUT, "en", p.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), layout(p, "en"));
}

/* sitemap — كل رابط مع بدائله اللغوية (hreflang) */
interface SitemapUrl {
  slug: string;
  lang: Lang;
  priority: string;
}
const slugs = ["", ...arPages.map((p) => p.slug)];
const prio = (slug: string) => (slug === "" ? "1.0" : arPages.find((p) => p.slug === slug)?.priority ?? "0.7");
const urls: SitemapUrl[] = [
  ...slugs.map((slug) => ({ slug, lang: "ar" as Lang, priority: prio(slug) })),
  ...enPages.map((p) => ({ slug: p.slug, lang: "en" as Lang, priority: p.slug === "" ? "0.9" : p.priority })),
];
const alt = (slug: string) =>
  `    <xhtml:link rel="alternate" hreflang="ar" href="${urlFor("ar", slug)}"/>\n` +
  `    <xhtml:link rel="alternate" hreflang="en" href="${urlFor("en", slug)}"/>\n` +
  `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor("ar", slug)}"/>`;
writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (u) =>
      `  <url>\n    <loc>${urlFor(u.lang, u.slug)}</loc>\n${alt(u.slug)}\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>
`,
);
console.log(`✓ ${arPages.length} AR + ${enPages.length} EN SEO pages + sitemap (${urls.length} URLs) → ${OUT}`);
