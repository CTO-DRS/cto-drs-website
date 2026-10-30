"use client";

import { ShieldCheck, Bot, FileCode2, Download, Tag, HardDrive, ArrowDownToLine, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import { TOOLS } from "@/lib/data";

const ICONS: Record<string, LucideIcon> = { ShieldCheck, Bot, FileCode2 };

export function ToolsSection() {
  return (
    <section className="relative px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="OPEN SOURCE • 08"
          title="أدوات"
          highlight="ومكتبات"
          subtitle="أدوات برمجية أطورها وأشاركها مع المجتمع"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {TOOLS.map((t, i) => {
            const Icon = ICONS[t.icon] ?? FileCode2;
            return (
              <Reveal key={t.name} delay={i * 100}>
                <article className="card-glow group flex h-full flex-col rounded-2xl p-6">
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(0,255,136,0.07)] text-[#00ff88] transition-all duration-300 group-hover:shadow-[0_0_18px_rgba(0,255,136,0.35)]">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="font-mono-cyber flex items-center gap-1 text-[10px] text-mute" dir="ltr">
                      <Tag className="h-3 w-3" />
                      {t.version}
                    </span>
                  </div>
                  <h3 className="font-heading-cyber mt-5 text-base font-bold text-main transition group-hover:text-cyber" dir="ltr">
                    {t.name}
                  </h3>
                  <p className="mt-2 flex-1 text-xs leading-6 text-sec">{t.description}</p>
                  <div className="mt-4 flex items-center gap-4 text-[11px] text-mute">
                    <span className="flex items-center gap-1">
                      <HardDrive className="h-3 w-3" />
                      {t.size}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {t.downloads}
                    </span>
                  </div>
                  <a
                    href="#projects"
                    className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[rgba(0,240,255,0.35)] bg-[rgba(0,240,255,0.05)] text-xs font-bold text-cyber transition hover:bg-[rgba(0,240,255,0.12)]"
                  >
                    <ArrowDownToLine className="h-3.5 w-3.5" />
                    تحميل الأداة
                  </a>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
