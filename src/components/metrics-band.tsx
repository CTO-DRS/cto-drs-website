"use client";

import { Rocket, Clock, Users, Cpu, Server, Code2, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import { Counter } from "@/components/counter";
import { useI18n, useContent } from "@/i18n";

const ICONS: Record<string, LucideIcon> = { Rocket, Clock, Users, Cpu, Server, Code2 };

export function MetricsBand() {
  const { t } = useI18n();
  const { PERFORMANCE_STATS } = useContent();
  return (
    <section className="relative px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="METRICS • 05"
          title={t.metrics.title}
          highlight={t.metrics.highlight}
          subtitle={t.metrics.subtitle}
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {PERFORMANCE_STATS.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Rocket;
            return (
              <Reveal key={s.label} delay={i * 80}>
                <div className="group flex flex-col items-center gap-2 rounded-2xl border border-border-soft bg-elev/70 px-4 py-8 text-center backdrop-blur-sm transition hover:border-[rgba(0,240,255,0.35)] hover:shadow-[0_0_24px_rgba(0,240,255,0.1)]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(0,240,255,0.07)] text-cyber transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <p className="font-heading-cyber text-3xl font-extrabold">
                    <Counter value={s.value} suffix={s.suffix} className="text-gradient-static" />
                  </p>
                  <p className="text-xs text-sec">{s.label}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
