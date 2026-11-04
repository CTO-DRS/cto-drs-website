import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Plus_Jakarta_Sans, Fira_Code } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { APPS, directReleaseUrl, sourceZipUrl } from "@/lib/apps";
import { FAQS } from "@/lib/faq-data";
import { SOCIALS } from "@/lib/social";
import { LanguageProvider } from "@/i18n";
import { A11yProvider, EARLY_PREFS_SCRIPT } from "@/lib/a11y";

const SITE = "https://cto-drs.com";

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-app-sans",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cto-drs.com"),
  title: "CTO-DRS | هندسة البرمجيات والأمن السيبراني والابتكار",
  description:
    "CTO-DRS — مطور تقني مهتم بهندسة البرمجيات والأمن السيبراني وتطوير تطبيقات أندرويد الأصلية والابتكار مفتوح المصدر. تقنية مفيدة وآمنة وقابلة للصيانة ومتاحة للجميع.",
  keywords: [
    "CTO-DRS",
    "هندسة برمجيات",
    "أمن سيبراني",
    "Kotlin",
    "Python",
    "JavaScript",
    "PHP",
    "Android",
    "Open Source",
    "برمجة",
  ],
  authors: [{ name: "CTO-DRS", url: "https://github.com/CTO-DRS" }],
  alternates: {
    canonical: "/",
    languages: {
      ar: "/",
      en: "/en/",
      "x-default": "/",
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "CTO-DRS",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "CTO-DRS | Software Engineering • Cybersecurity • Innovation",
    description:
      "مطور تقني مهتم بهندسة البرمجيات والأمن السيبراني وتطوير تطبيقات أندرويد الأصلية والابتكار مفتوح المصدر",
    type: "website",
    url: "https://cto-drs.com",
    siteName: "CTO-DRS",
    locale: "ar_SA",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CTO-DRS — Software Engineer & Cybersecurity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cto_drs",
    creator: "@cto_drs",
    title: "CTO-DRS | Software Engineering • Cybersecurity • Innovation",
    description:
      "تطبيقات وأدوات مفتوحة المصدر — هندسة برمجيات وأمن سيبراني وابتكار",
    images: ["/og-image.png"],
  },
};

const CATEGORY_MAP: Record<string, string> = {
  android: "MobileApplication",
  web: "WebApplication",
  language: "ApplicationSuite",
  tool: "UtilitiesApplication",
};

/** كيانات التطبيقات — SoftwareApplication لكل تطبيق مع رابط التنزيل المباشر */
const APP_ENTITIES = APPS.map((app, i) => ({
  "@type": ["SoftwareApplication", CATEGORY_MAP[app.category] ?? "SoftwareApplication"],
  "@id": `${SITE}/#app-${app.id}`,
  name: app.titleEn,
  alternateName: app.title,
  description: app.description,
  url: `https://github.com/CTO-DRS/${app.repo}`,
  downloadUrl: app.directFile ? directReleaseUrl(app.repo, app.directFile) : sourceZipUrl(app.repo),
  softwareVersion: app.version.replace(/^v/, ""),
  applicationCategory: app.category === "android" ? "MobileApplication" : "DeveloperApplication",
  operatingSystem: app.platforms.join(", "),
  fileFormat: app.fileType === "APK" ? "application/vnd.android.package-archive" : app.fileType === "ZIP" ? "application/zip" : "application/octet-stream",
  isAccessibleForFree: true,
  author: { "@id": `${SITE}/#person` },
  publisher: { "@id": `${SITE}/#organization` },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  position: i + 1,
}));

/** أسئلة FAQ — FAQPage لعرض النتائج الغنية في البحث واستخراجها في نماذج الذكاء الاصطناعي */
const FAQ_ENTITY = {
  "@type": "FAQPage",
  "@id": `${SITE}/#faq`,
  url: `${SITE}/#/faq`,
  inLanguage: "ar",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    text: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE}/#person`,
      name: "CTO-DRS",
      url: SITE,
      email: "mailto:contact@cto-drs.com",
      jobTitle: "Software Engineer",
      description:
        "مطور تقني مهتم بهندسة البرمجيات والأمن السيبراني وتطوير تطبيقات أندرويد الأصلية والابتكار مفتوح المصدر",
      knowsAbout: [
        "Software Engineering",
        "Cybersecurity",
        "Android Development",
        "Kotlin",
        "Python",
        "Open Source",
      ],
      sameAs: [
        "https://github.com/CTO-DRS",
        "https://t.me/ctodrs",
        "https://x.com/cto_drs",
        "https://www.instagram.com/cto.drs",
        "https://www.tiktok.com/@cto.drs",
        "https://youtube.com/@cto-drs",
      ],
      mainEntityOfPage: { "@id": `${SITE}/#profilepage` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE}/#profilepage`,
      url: SITE,
      name: "CTO-DRS | هندسة البرمجيات والأمن السيبراني والابتكار",
      inLanguage: "ar",
      mainEntity: { "@id": `${SITE}/#person` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "CTO-DRS",
      alternateName: "CTO.DRS",
      url: SITE,
      email: "contact@cto-drs.com",
      logo: `${SITE}/icons/icon-512.png`,
      image: `${SITE}/og-image.png`,
      description:
        "جهة تطوير تقنية مفتوحة المصدر — تطبيقات أندرويد أصلية، أدوات خصوصية وأمن سيبراني، ولغات وأدوات مطورين",
      foundingDate: "2024",
      sameAs: SOCIALS.map((s) => s.url),
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "contact@cto-drs.com",
          availableLanguage: ["Arabic", "English"],
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "CTO-DRS",
      description: "منصة المطور المتكاملة — هندسة البرمجيات والأمن السيبراني والابتكار",
      inLanguage: "ar",
      publisher: { "@id": `${SITE}/#person` },
      author: { "@id": `${SITE}/#person` },
    },
    {
      "@type": "ItemList",
      "@id": `${SITE}/#apps`,
      name: "تطبيقات CTO-DRS مفتوحة المصدر",
      description: "قائمة تطبيقات وأدوات CTO-DRS المتاحة بتنزيل مباشر من GitHub Releases",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: APP_ENTITIES.length,
      itemListElement: APP_ENTITIES.map((a) => ({ "@type": "ListItem", position: a.position, item: a })),
    },
    FAQ_ENTITY,
  ],
};

export const viewport: Viewport = {
  themeColor: "#030303",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* تطبيق تفضيلات اللغة/حجم النص/الحركة قبل أول رسم */}
        <script id="early-prefs" dangerouslySetInnerHTML={{ __html: EARLY_PREFS_SCRIPT }} />
      </head>
      <body
        className={`${plexArabic.variable} ${jakarta.variable} ${firaCode.variable} antialiased bg-app text-main overflow-x-clip`}
      >
        {/* JSON-LD كوسم خام في HTML السيرفر — ليقرأه كل الزواحف بما فيها نماذج الذكاء الاصطناعي التي لا تنفّذ JavaScript */}
        <script
          id="json-ld-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <ThemeProvider>
          <LanguageProvider>
            <A11yProvider>
              {children}
              <Toaster />
            </A11yProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
