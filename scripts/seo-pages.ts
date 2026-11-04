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
import { PROFILE, PROJECTS, SERVICES, SKILLS, COURSES, TOOLS } from "../src/lib/data";
import { FAQS } from "../src/lib/faq-data";
import { APPS, repoPageUrl, releasesPageUrl } from "../src/lib/apps";
import { SOCIALS, BRAND } from "../src/lib/social";
import * as EN from "../src/i18n/content-en";

const OUT = process.argv[2] || "out";
const SITE = "https://cto-drs.com";
const TODAY = new Date().toISOString().slice(0, 10);

type Lang = "ar" | "en";

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const PERSON = { "@type": "Person", "@id": `${SITE}/#person`, name: "CTO-DRS", url: `${SITE}/`, jobTitle: PROFILE.role, sameAs: SOCIALS.map((s) => s.url) };
const PERSON_EN = { ...PERSON, jobTitle: EN.PROFILE_EN.role };

interface Page {
  slug: string;
  hash: string;
  title: string;
  description: string;
  h1: string;
  body: string;
  jsonld: object[];
  priority: string;
}

const NAV: Record<Lang, [string, string][]> = {
  ar: [
    ["", "الرئيسية"],
    ["about", "من أنا"],
    ["services", "الخدمات"],
    ["projects", "المشاريع"],
    ["downloads", "التطبيقات"],
    ["courses", "الدورات"],
    ["faq", "الأسئلة الشائعة"],
    ["contact", "تواصل"],
  ],
  en: [
    ["", "Home"],
    ["about", "About"],
    ["services", "Services"],
    ["projects", "Projects"],
    ["downloads", "Apps"],
    ["courses", "Courses"],
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
  const graph = { "@context": "https://schema.org", "@graph": [isAr ? PERSON : PERSON_EN, crumbs, ...p.jsonld] };
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
    .join("")}<a class="lang" href="${pathFor(other, p.slug)}" hreflang="${other}" lang="${other}">${switchLabel}</a></nav>
</header>
<main id="main">
<h1>${esc(p.h1)}</h1>
${p.body}
<a class="cta" href="${appLink(lang, p.hash)}">${ctaLabel}</a>
</main>
<footer>
<p>© ${new Date().getFullYear()} CTO-DRS — ${esc(PROFILE.roleEn)} · <a href="mailto:${BRAND.email}">${BRAND.email}</a></p>
<p>${SOCIALS.map((s) => `<a href="${s.url}" rel="me noopener">${esc(isAr ? s.label : EN.SOCIALS_EN[s.id]?.label ?? s.label)}</a>`).join("")}</p>
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

/* الدورات */
arPages.push({
  slug: "courses",
  hash: "courses",
  title: "دورات CTO-DRS | برمجة وأمن سيبراني بالعربي",
  description: "دورات تقنية بالعربي من CTO-DRS: " + COURSES.map((c) => c.title).join("، ") + ".",
  h1: "الدورات التدريبية",
  priority: "0.7",
  body:
    COURSES.map((c) => `<div class="card"><h2 style="margin:0 0 6px;font-size:19px">${esc(c.title)}</h2><p>${esc(c.description)}</p><p>${c.lessons} درس · ${c.hours} ساعة · المستوى: ${esc(c.level)}</p></div>`).join("") +
    `<h2>أدوات مجانية</h2>` +
    TOOLS.map((t) => `<div class="card"><strong>${esc(t.name)}</strong> ${esc(t.version)} — ${esc(t.description)}</div>`).join(""),
  jsonld: COURSES.map((c) => ({
    "@type": "Course",
    name: c.title,
    description: c.description,
    inLanguage: "ar",
    provider: { "@type": "Organization", name: "CTO-DRS", sameAs: `${SITE}/` },
  })),
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
    SOCIALS.map((s) => `<div class="card"><strong>${esc(s.label)}</strong> — <a href="${s.url}" rel="me noopener">${esc(s.handle)}</a></div>`).join(""),
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
      ["courses", "Courses & tools", "Practical courses in programming and cybersecurity, plus free tools."],
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

/* Courses */
enPages.push({
  slug: "courses",
  hash: "courses",
  title: "CTO-DRS Courses | Programming & Cybersecurity",
  description: "Technical courses from CTO-DRS: " + EN.COURSES_EN.map((c) => c.title).join(", ") + ".",
  h1: "Training Courses",
  priority: "0.7",
  body:
    COURSES.map((c, i) => {
      const e = EN.COURSES_EN[i];
      return `<div class="card"><h2 style="margin:0 0 6px;font-size:19px">${esc(e?.title ?? c.title)}</h2><p>${esc(e?.description ?? c.description)}</p><p>${c.lessons} lessons · ${c.hours} hours · Level: ${esc(e?.level ?? c.level)}</p></div>`;
    }).join("") +
    `<h2>Free tools</h2>` +
    TOOLS.map((t, i) => `<div class="card"><strong>${esc(t.name)}</strong> ${esc(t.version)} — ${esc(EN.TOOLS_EN[i] ?? t.description)}</div>`).join(""),
  jsonld: COURSES.map((c, i) => ({
    "@type": "Course",
    name: EN.COURSES_EN[i]?.title ?? c.title,
    description: EN.COURSES_EN[i]?.description ?? c.description,
    inLanguage: "ar",
    availableLanguage: ["ar"],
    provider: { "@type": "Organization", name: "CTO-DRS", sameAs: `${SITE}/` },
  })),
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
      return `<div class="card"><strong>${esc(e?.label ?? s.label)}</strong> — <a href="${s.url}" rel="me noopener">${esc(e?.handle ?? s.handle)}</a></div>`;
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
