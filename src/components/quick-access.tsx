"use client";

import { Calculator, CalendarClock, Presentation, Tags, Download, ArrowLeft, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import { QUICK_TOOLS } from "@/lib/data";

const ICONS: Record<string, LucideIcon> = { Calculator, CalendarClock, Presentation, Tags, Download };

const COLOR: Record<string, string> = {
  cyan: "text-cyber bg-[rgba(0,240,255,0.07)] group-hover:shadow-[0_0_18px_rgba(0,240,255,0.35)]",
  purple: "text-[#a78bfa] bg-[rgba(124,58,237,0.1)] group-hover:shadow-[0_0_18px_rgba(124,58,237,0.4)]",
  pink: "text-[#ff2a6d] bg-[rgba(255,42,109,0.08)] group-hover:shadow-[0_0_18px_rgba(255,42,109,0.35)]",
  green: "text-[#00ff88] bg-[rgba(0,255,136,0.07)] group-hover:shadow-[0_0_18px_rgba(0,255,136,0.35)]",
  orange: "text-[#ff9900] bg-[rgba(255,153,0,0.08)] group-hover:shadow-[0_0_18px_rgba(255,153,0,0.35)]",
};

export function QuickAccess() {
  return (
    <section className="relative px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="QUICK ACCESS • TOOLS"
          title="أدوات"
          highlight="ومميزات"
          subtitle="وصول سريع لأهم الأدوات والخدمات التفاعلية"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_TOOLS.map((t, i) => {
            const Icon = ICONS[t.icon] ?? Download;
            return (
              <Reveal key={t.title} delay={(i % 3) * 90}>
                <a
                  href="#contact"
                  className="card-glow group flex h-full items-center gap-4 rounded-2xl p-5"
                >
                  <span
                    className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${COLOR[t.color] ?? COLOR.cyan}`}
                    style={{ height: 52, width: 52 }}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <h3 className="font-heading-cyber text-[15px] font-bold text-main transition group-hover:text-cyber">
                      {t.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs text-sec">{t.description}</p>
                  </div>
                  <ArrowLeft className="h-4 w-4 shrink-0 text-mute transition-all duration-300 group-hover:-translate-x-1 group-hover:text-cyber" />
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
