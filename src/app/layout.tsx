import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Plus_Jakarta_Sans, Fira_Code } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

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
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
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
  },
  twitter: {
    card: "summary_large_image",
    title: "CTO-DRS | Software Engineering • Cybersecurity • Innovation",
    description:
      "تطبيقات وأدوات مفتوحة المصدر — هندسة برمجيات وأمن سيبراني وابتكار",
  },
  robots: { index: true, follow: true },
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
      <body
        className={`${plexArabic.variable} ${jakarta.variable} ${firaCode.variable} antialiased bg-app text-main overflow-x-clip`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
