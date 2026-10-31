"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { ParticleBackground } from "@/components/particle-background";
import { Navbar } from "@/components/navbar";
import { CommandPalette } from "@/components/command-palette";
import { Hero } from "@/components/hero";
import { ProfileSection } from "@/components/profile-section";
import { SkillsSection } from "@/components/skills-section";
import { ProjectsSection } from "@/components/projects-section";
import { MetricsBand } from "@/components/metrics-band";
import { ScrollProgress } from "@/components/scroll-progress";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Footer } from "@/components/footer";
import { ChatWidget } from "@/components/chat-widget";
import { CookieConsent } from "@/components/cookie-consent";
import { AppRouterProvider, useAppRouter } from "@/lib/router";
import { STATIC_MODE } from "@/lib/static-mode";

/* ─────────────────────────────────────────────
   تحميل كسول — الأقسام أسفل الطية والشاشات الأخرى
   تُجلب عند الحاجة فقط لتحسين زمن التحميل الأول
   ───────────────────────────────────────────── */

function ScreenLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00f0ff] via-[#7c3aed] to-[#ff2a6d] shadow-[0_0_36px_rgba(0,240,255,0.4)]">
          <Terminal className="h-6 w-6 text-[#030303]" strokeWidth={2.5} />
          <span className="animate-ping absolute inset-0 rounded-2xl border border-[rgba(0,240,255,0.5)]" />
        </span>
        <p className="font-mono-cyber text-[11px] tracking-[0.3em] text-mute" dir="ltr">
          LOADING MODULE…
        </p>
      </div>
    </div>
  );
}

/** أقسام الصفحة الرئيسية أسفل الطية — بلا مؤشر تحميل (غير مرئية أثناء الجلب) */
const dynSection = (mod: Promise<unknown>, exportName: string) =>
  dynamic(
    () =>
      mod.then((m) => {
        const comp = (m as Record<string, React.ComponentType>)?.[exportName];
        if (!comp) throw new Error(`Export ${exportName} not found`);
        return comp;
      }),
    { ssr: false },
  );

/** شاشات المسارات — مع مؤشر تحميل سيبراني أثناء جلب الوحدة */
const dynScreen = (mod: Promise<unknown>, exportName: string) =>
  dynamic(
    () =>
      mod.then((m) => {
        const comp = (m as Record<string, React.ComponentType>)?.[exportName];
        if (!comp) throw new Error(`Export ${exportName} not found`);
        return comp;
      }),
    { ssr: false, loading: () => <ScreenLoader /> },
  );

const DashboardSection = dynSection(import("@/components/dashboard-section"), "DashboardSection");
const VideosSection = dynSection(import("@/components/videos-section"), "VideosSection");
const CoursesSection = dynSection(import("@/components/courses-section"), "CoursesSection");
const ToolsSection = dynSection(import("@/components/tools-section"), "ToolsSection");
const GallerySection = dynSection(import("@/components/gallery-section"), "GallerySection");
const QuickAccess = dynSection(import("@/components/quick-access"), "QuickAccess");
const ContactSection = dynSection(import("@/components/contact-section"), "ContactSection");
const CtaSection = dynSection(import("@/components/cta-section"), "CtaSection");

const ServicesScreen = dynScreen(import("@/components/screens/services-screen"), "ServicesScreen");
const ProjectsScreen = dynScreen(import("@/components/screens/projects-screen"), "ProjectsScreen");
const CoursesScreenX = dynScreen(import("@/components/screens/courses-screen"), "CoursesScreen");
const CourseDetailScreen = dynScreen(import("@/components/screens/course-detail-screen"), "CourseDetailScreen");
const BlogScreen = dynScreen(import("@/components/screens/blog-screen"), "BlogScreen");
const PostDetailScreen = dynScreen(import("@/components/screens/post-detail-screen"), "PostDetailScreen");
const FaqScreen = dynScreen(import("@/components/screens/faq-screen"), "FaqScreen");
const TestimonialsScreen = dynScreen(import("@/components/screens/testimonials-screen"), "TestimonialsScreen");
const StoreScreen = dynScreen(import("@/components/screens/store-screen"), "StoreScreen");
const CartScreen = dynScreen(import("@/components/screens/cart-screen"), "CartScreen");
const CheckoutScreen = dynScreen(import("@/components/screens/checkout-screen"), "CheckoutScreen");
const BookingScreen = dynScreen(import("@/components/screens/booking-screen"), "BookingScreen");
const LoginScreen = dynScreen(import("@/components/screens/login-screen"), "LoginScreen");
const RegisterScreen = dynScreen(import("@/components/screens/register-screen"), "RegisterScreen");
const AccountScreen = dynScreen(import("@/components/screens/account-screen"), "AccountScreen");
const DashboardScreenX = dynScreen(import("@/components/screens/dashboard-screen"), "DashboardScreen");
const ContactScreen = dynScreen(import("@/components/screens/contact-screen"), "ContactScreen");
const WishlistScreen = dynScreen(import("@/components/screens/wishlist-screen"), "WishlistScreen");
const OrdersScreen = dynScreen(import("@/components/screens/orders-screen"), "OrdersScreen");
const NotificationsScreen = dynScreen(import("@/components/screens/notifications-screen"), "NotificationsScreen");
const PrivacyScreen = dynScreen(import("@/components/screens/privacy-screen"), "PrivacyScreen");
const TermsScreen = dynScreen(import("@/components/screens/terms-screen"), "TermsScreen");
const PricingScreen = dynScreen(import("@/components/screens/pricing-screen"), "PricingScreen");
const TeamScreen = dynScreen(import("@/components/screens/team-screen"), "TeamScreen");
const EventsScreen = dynScreen(import("@/components/screens/events-screen"), "EventsScreen");
const ToolsScreenX = dynScreen(import("@/components/screens/tools-screen"), "ToolsScreen");
const DownloadsScreen = dynScreen(import("@/components/screens/downloads-screen"), "DownloadsScreen");
const VideosScreenX = dynScreen(import("@/components/screens/videos-screen"), "VideosScreen");
const GalleryScreenX = dynScreen(import("@/components/screens/gallery-screen"), "GalleryScreen");

function HomeView() {
  return (
    <>
      <Hero />
      <DashboardSection />
      <ProfileSection />
      <SkillsSection />
      <ProjectsSection />
      <MetricsBand />
      <VideosSection />
      <CoursesSection />
      <ToolsSection />
      <GallerySection />
      <QuickAccess />
      <ContactSection />
      <CtaSection />
    </>
  );
}

function ScreenSwitch() {
  const { route } = useAppRouter();
  const key = `${route.name}${route.slug ? `-${route.slug}` : ""}`;

  let screen: React.ReactNode;
  switch (route.name) {
    case "services":
      screen = <ServicesScreen />;
      break;
    case "projects":
      screen = <ProjectsScreen />;
      break;
    case "courses":
      screen = <CoursesScreenX />;
      break;
    case "course-detail":
      screen = <CourseDetailScreen />;
      break;
    case "blog":
      screen = <BlogScreen />;
      break;
    case "post-detail":
      screen = <PostDetailScreen />;
      break;
    case "faq":
      screen = <FaqScreen />;
      break;
    case "testimonials":
      screen = <TestimonialsScreen />;
      break;
    case "store":
      screen = <StoreScreen />;
      break;
    case "cart":
      screen = <CartScreen />;
      break;
    case "checkout":
      screen = <CheckoutScreen />;
      break;
    case "booking":
      screen = <BookingScreen />;
      break;
    case "login":
      screen = <LoginScreen />;
      break;
    case "register":
      screen = <RegisterScreen />;
      break;
    case "account":
      screen = <AccountScreen />;
      break;
    case "dashboard":
      screen = <DashboardScreenX />;
      break;
    case "contact":
      screen = <ContactScreen />;
      break;
    case "wishlist":
      screen = <WishlistScreen />;
      break;
    case "orders":
      screen = <OrdersScreen />;
      break;
    case "notifications":
      screen = <NotificationsScreen />;
      break;
    case "privacy":
      screen = <PrivacyScreen />;
      break;
    case "terms":
      screen = <TermsScreen />;
      break;
    case "pricing":
      screen = <PricingScreen />;
      break;
    case "team":
      screen = <TeamScreen />;
      break;
    case "events":
      screen = <EventsScreen />;
      break;
    case "tools":
      screen = <ToolsScreenX />;
      break;
    case "downloads":
      screen = <DownloadsScreen />;
      break;
    case "videos":
      screen = <VideosScreenX />;
      break;
    case "gallery":
      screen = <GalleryScreenX />;
      break;
    default:
      screen = <HomeView />;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {screen}
      </motion.div>
    </AnimatePresence>
  );
}

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    console.log(
      "%c CTO-DRS %c SYSTEM ONLINE %c\nSoftware Engineering • Cybersecurity • Innovation\nhttps://cto-drs.com",
      "background:#00f0ff;color:#030303;font-weight:bold;padding:2px 8px;border-radius:6px 0 0 6px",
      "background:#7c3aed;color:#fff;font-weight:bold;padding:2px 8px;border-radius:0 6px 6px 0",
      "color:#00f0ff;padding:4px 0",
    );
  }, []);

  return (
    <AppRouterProvider>
      <ScrollProgress />
      <div className="relative flex min-h-screen flex-col">
        <ParticleBackground />
        <Navbar onOpenSearch={() => setSearchOpen(true)} />
        <CommandPalette open={searchOpen} setOpen={setSearchOpen} />

        <main className="relative z-10 flex-1">
          <ScreenSwitch />
        </main>

        <Footer />
        {!STATIC_MODE && <ChatWidget />}
        <CookieConsent />
        <ScrollToTop />
      </div>
    </AppRouterProvider>
  );
}
