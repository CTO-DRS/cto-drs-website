"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ParticleBackground } from "@/components/particle-background";
import { Navbar } from "@/components/navbar";
import { CommandPalette } from "@/components/command-palette";
import { Hero } from "@/components/hero";
import { DashboardSection } from "@/components/dashboard-section";
import { ProfileSection } from "@/components/profile-section";
import { SkillsSection } from "@/components/skills-section";
import { ProjectsSection } from "@/components/projects-section";
import { MetricsBand } from "@/components/metrics-band";
import { VideosSection } from "@/components/videos-section";
import { CoursesSection } from "@/components/courses-section";
import { ToolsSection } from "@/components/tools-section";
import { GallerySection } from "@/components/gallery-section";
import { QuickAccess } from "@/components/quick-access";
import { ContactSection } from "@/components/contact-section";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { ChatWidget } from "@/components/chat-widget";
import { CookieConsent } from "@/components/cookie-consent";
import { AppRouterProvider, useAppRouter } from "@/lib/router";

import { ServicesScreen } from "@/components/screens/services-screen";
import { ProjectsScreen } from "@/components/screens/projects-screen";
import { CoursesScreen } from "@/components/screens/courses-screen";
import { CourseDetailScreen } from "@/components/screens/course-detail-screen";
import { BlogScreen } from "@/components/screens/blog-screen";
import { PostDetailScreen } from "@/components/screens/post-detail-screen";
import { FaqScreen } from "@/components/screens/faq-screen";
import { TestimonialsScreen } from "@/components/screens/testimonials-screen";
import { StoreScreen } from "@/components/screens/store-screen";
import { CartScreen } from "@/components/screens/cart-screen";
import { CheckoutScreen } from "@/components/screens/checkout-screen";
import { BookingScreen } from "@/components/screens/booking-screen";
import { LoginScreen } from "@/components/screens/login-screen";
import { RegisterScreen } from "@/components/screens/register-screen";
import { AccountScreen } from "@/components/screens/account-screen";
import { DashboardScreen } from "@/components/screens/dashboard-screen";
import { ContactScreen } from "@/components/screens/contact-screen";

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
      screen = <CoursesScreen />;
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
      screen = <DashboardScreen />;
      break;
    case "contact":
      screen = <ContactScreen />;
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

  return (
    <AppRouterProvider>
      <div className="relative flex min-h-screen flex-col">
        <ParticleBackground />
        <Navbar onOpenSearch={() => setSearchOpen(true)} />
        <CommandPalette open={searchOpen} setOpen={setSearchOpen} />

        <main className="relative z-10 flex-1">
          <ScreenSwitch />
        </main>

        <Footer />
        <ChatWidget />
        <CookieConsent />
      </div>
    </AppRouterProvider>
  );
}
