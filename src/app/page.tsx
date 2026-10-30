"use client";

import { useState } from "react";
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

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col">
      <ParticleBackground />
      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      <CommandPalette open={searchOpen} setOpen={setSearchOpen} />

      <main className="relative z-10">
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
      </main>

      <Footer />
      <ChatWidget />
      <CookieConsent />
    </div>
  );
}
