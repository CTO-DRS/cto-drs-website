/* ═══════════════════════════════════════════════════════════
   seo-pages.ts — صفحات HTML ثابتة قابلة للفهرسة لكل قسم
   الواجهة التفاعلية تعمل بروابط # (غير قابلة للفهرسة كصفحات مستقلة)،
   فهذه الصفحات تمنح محركات البحث ونماذج الذكاء الاصطناعي
   عناوين URL حقيقية بمحتوى كامل + JSON-LD، مع رابط للنسخة التفاعلية.
   الاستخدام: bun scripts/seo-pages.ts <outDir>
   ═══════════════════════════════════════════════════════════ */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PROFILE, PROJECTS, SERVICES, SKILLS, COURSES, TOOLS } from "../src/lib/data";
import { FAQS } from "../src/lib/faq-data";
import { APPS, repoPageUrl, releasesPageUrl } from "../src/lib/apps";
import { SOCIALS, BRAND } from "../src/lib/social";

const OUT = process.argv[2] || "out";
const SITE = "https://cto-drs.com";
const TODAY = new Date().toISOString().slice(0, 10);

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const PERSON = { "@type": "Person", "@id": `${SITE}/#person`, name: "CTO-DRS", url: `${SITE}/`, jobTitle: PROFILE.role, sameAs: SOCIALS.map((s) => s.url) };

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

const NAV: [string, string][] = [
  ["", "الرئيسية"],
  ["about", "من أنا"],
  ["services", "الخدمات"],
  ["projects", "المشاريع"],
  ["downloads", "التطبيقات"],
  ["courses", "الدورات"],
  ["faq", "الأسئلة الشائعة"],
  ["contact", "تواصل"],
];

function layout(p: Page) {
  const url = `${SITE}/${p.slug}/`;
  const crumbs = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: p.h1, item: url },
    ],
  };
  const graph = { "@context": "https://schema.org", "@graph": [PERSON, crumbs, ...p.jsonld] };
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="ar" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#030303">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/icons/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="CTO-DRS">
<meta property="og:locale" content="ar_SA">
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
nav a{margin-inline-start:12px;color:#9fb0c3;text-decoration:none;font-size:14px}nav a:hover{color:#00f0ff}
h1{font-size:30px;line-height:1.4;background:linear-gradient(90deg,#00f0ff,#7c3aed,#ff2a6d);-webkit-background-clip:text;color:transparent}
h2{font-size:21px;margin-top:28px}.card{background:#0d1117;border:1px solid #1c2333;border-radius:16px;padding:16px 18px;margin:12px 0}
.tags span{display:inline-block;font-size:12px;border:1px solid #1c2333;border-radius:999px;padding:2px 10px;margin:2px;color:#9fb0c3}
.cta{display:inline-block;margin:18px 0;padding:10px 20px;border-radius:999px;background:linear-gradient(90deg,#00f0ff,#7c3aed);color:#030303;font-weight:700;text-decoration:none}
footer{border-top:1px solid #1c2333;color:#7d8590;font-size:14px}footer a{margin-inline-end:10px}
</style>
</head>
<body>
<header>
<a class="brand" href="/" dir="ltr"><b>CTO</b>-<i>DRS</i></a>
<nav>${NAV.map(([s, l]) => `<a href="/${s ? s + "/" : ""}">${l}</a>`).join("")}</nav>
</header>
<main>
<h1>${esc(p.h1)}</h1>
${p.body}
<a class="cta" href="/#/${p.hash}">افتح النسخة التفاعلية ←</a>
</main>
<footer>
<p>© ${new Date().getFullYear()} CTO-DRS — ${esc(PROFILE.roleEn)} · <a href="mailto:${BRAND.email}">${BRAND.email}</a></p>
<p>${SOCIALS.map((s) => `<a href="${s.url}" rel="me noopener">${esc(s.label)}</a>`).join("")}</p>
</footer>
</body>
</html>`;
}

const pages: Page[] = [];

/* من أنا */
pages.push({
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
pages.push({
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
pages.push({
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
pages.push({
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
pages.push({
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
pages.push({
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
pages.push({
  slug: "contact",
  hash: "contact",
  title: "تواصل مع CTO-DRS | واتساب، تيليجرام، البريد",
  description: `تواصل مع CTO-DRS لطلب مشروع أو استشارة تقنية: واتساب للأعمال، تيليجرام t.me/CTO_DRS، البريد ${BRAND.email}.`,
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

for (const p of pages) {
  const dir = join(OUT, p.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), layout(p));
}

/* sitemap */
const urls = [{ loc: `${SITE}/`, priority: "1.0" }, ...pages.map((p) => ({ loc: `${SITE}/${p.slug}/`, priority: p.priority }))];
writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join("\n")}
</urlset>
`,
);
console.log(`✓ ${pages.length} SEO pages + sitemap (${urls.length} URLs) → ${OUT}`);
