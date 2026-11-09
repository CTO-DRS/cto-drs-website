"use client";

import { ShieldCheck, Bot, FileCode2, Download, Tag, HardDrive, ArrowDownToLine, Github, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import { useI18n, useContent } from "@/i18n";

const ICONS: Record<string, LucideIcon> = { ShieldCheck, Bot, FileCode2 };

export function ToolsSection() {
  const { t: tr } = useI18n();
  const ts = tr.toolsSection;
  const { TOOLS } = useContent();
  return (
    <section className="relative px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="OPEN SOURCE • 08"
          title={ts.title}
          highlight={ts.highlight}
          subtitle={ts.subtitle}
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
                  <div className="mt-5 flex items-center gap-2">
                    <a
                      href="#/downloads"
                      className="btn-gradient flex h-10 flex-1 items-center justify-center gap-2 rounded-full text-xs font-bold"
                      aria-label={ts.downloadAria(t.name)}
                    >
                      <ArrowDownToLine className="h-3.5 w-3.5" aria-hidden="true" />
                      {ts.download}
                    </a>
                    <a
                      href="https://github.com/CTO-DRS?tab=repositories"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={ts.githubAria}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-strong bg-elev-2/50 text-sec transition hover:border-cyber/40 hover:text-cyber"
                    >
                      <Github className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
