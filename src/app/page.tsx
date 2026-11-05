"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
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
import { ErrorBoundary } from "@/components/error-boundary";
import { OfflineIndicator } from "@/components/offline-indicator";
import { SWRegister } from "@/components/sw-register";
import { SeoContent } from "@/components/seo-content";
import { AppRouterProvider, useAppRouter } from "@/lib/router";
import { STATIC_MODE } from "@/lib/static-mode";
import { AuthProvider } from "@/lib/auth";
import { SUPABASE_ENABLED } from "@/lib/supabase";
import { useI18n } from "@/i18n";
import { useA11y } from "@/lib/a11y";

/* ─────────────────────────────────────────────
   تحميل كسول — الأقسام أسفل الطية والشاشات الأخرى
   تُجلب عند الحاجة فقط لتحسين زمن التحميل الأول
   ───────────────────────────────────────────── */

function ScreenLoader() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite" aria-label={t.common.loadingAria}>
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
const ToolsSection = dynSection(import("@/components/tools-section"), "ToolsSection");
const GallerySection = dynSection(import("@/components/gallery-section"), "GallerySection");
const QuickAccess = dynSection(import("@/components/quick-access"), "QuickAccess");
const ContactSection = dynSection(import("@/components/contact-section"), "ContactSection");
const CtaSection = dynSection(import("@/components/cta-section"), "CtaSection");
const AcademySection = dynSection(import("@/components/academy-section"), "AcademySection");

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
const NotFoundScreen = dynScreen(import("@/components/screens/not-found-screen"), "NotFoundScreen");
/* شاشات Supabase (حسابات حقيقية) — تُستخدم فقط عند ضبط متغيرات Supabase وقت البناء */
const SbLoginScreen = SUPABASE_ENABLED ? dynScreen(import("@/components/auth/sb-auth-screens"), "SbLoginScreen") : NotFoundScreen;
const SbRegisterScreen = SUPABASE_ENABLED ? dynScreen(import("@/components/auth/sb-auth-screens"), "SbRegisterScreen") : NotFoundScreen;
const SbResetScreen = SUPABASE_ENABLED ? dynScreen(import("@/components/auth/sb-auth-screens"), "SbResetScreen") : NotFoundScreen;
const SbAccountScreen = SUPABASE_ENABLED ? dynScreen(import("@/components/auth/sb-account-screen"), "SbAccountScreen") : NotFoundScreen;
const SbAdminScreen = SUPABASE_ENABLED ? dynScreen(import("@/components/auth/sb-admin-screen"), "SbAdminScreen") : NotFoundScreen;

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
      <AcademySection />
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
  // أقسام الرئيسية (#/academy) لا تعيد تركيب الصفحة — فقط تمرير
  const key = route.name === "home" ? "home" : `${route.name}${route.slug ? `-${route.slug}` : ""}`;

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
      screen = SUPABASE_ENABLED ? <SbLoginScreen /> : <LoginScreen />;
      break;
    case "register":
      screen = SUPABASE_ENABLED ? <SbRegisterScreen /> : <RegisterScreen />;
      break;
    case "reset":
      screen = SUPABASE_ENABLED ? <SbResetScreen /> : <NotFoundScreen />;
      break;
    case "account":
      screen = SUPABASE_ENABLED ? <SbAccountScreen /> : <AccountScreen />;
      break;
    case "dashboard":
      screen = SUPABASE_ENABLED ? <SbAdminScreen /> : <DashboardScreenX />;
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
    case "not-found":
      screen = <NotFoundScreen />;
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
        <ErrorBoundary>{screen}</ErrorBoundary>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { t } = useI18n();
  const { reduceMotion } = useA11y();

  useEffect(() => {
    console.log(
      "%c CTO-DRS %c SYSTEM ONLINE %c\nSoftware Engineering • Cybersecurity • Innovation\nhttps://cto-drs.com",
      "background:#00f0ff;color:#030303;font-weight:bold;padding:2px 8px;border-radius:6px 0 0 6px",
      "background:#7c3aed;color:#fff;font-weight:bold;padding:2px 8px;border-radius:0 6px 6px 0",
      "color:#00f0ff;padding:4px 0",
    );
  }, []);

  return (
    <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
    <AppRouterProvider>
    <AuthProvider>
      {/* رابط تخطي التنقل — وصولية لوحة المفاتيح (بدون تغيير الهاش) */}
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          const main = document.getElementById("main-content");
          main?.setAttribute("tabindex", "-1");
          main?.focus({ preventScroll: false });
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-[#00f0ff] focus:px-5 focus:py-2.5 focus:text-sm focus:font-bold focus:text-[#030303] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#ff2a6d]"
      >
        {t.common.skipToContent}
      </a>
      <ScrollProgress />
      <div className="relative flex min-h-screen flex-col">
        {!reduceMotion && <ParticleBackground />}
        <Navbar onOpenSearch={() => setSearchOpen(true)} />
        <CommandPalette open={searchOpen} setOpen={setSearchOpen} />

        <main id="main-content" className="relative z-10 flex-1">
          <ScreenSwitch />
        </main>

        {/* طبقة محتوى HTML الثابت — فهرسة كاملة لمحركات البحث ونماذج الذكاء الاصطناعي */}
        <SeoContent />

        <Footer />
        {!STATIC_MODE && <ChatWidget />}
        <CookieConsent />
        <OfflineIndicator />
        <ScrollToTop />
        <SWRegister />
      </div>
    </AuthProvider>
    </AppRouterProvider>
    </MotionConfig>
  );
}
