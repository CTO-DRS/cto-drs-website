"use client";

import { useEffect, useRef, useState } from "react";
import {
  Code2,
  Braces,
  Terminal,
  Database,
  Share2,
  Laptop,
  GitBranch,
  ShieldCheck,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import { SKILLS } from "@/lib/data";

const ICONS: Record<string, LucideIcon> = {
  Code2,
  Braces,
  Terminal,
  Database,
  Share2,
  Laptop,
  GitBranch,
  ShieldCheck,
};

function SkillCard({
  name,
  level,
  percent,
  icon,
  delay,
}: {
  name: string;
  level: string;
  percent: number;
  icon: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const Icon = ICONS[icon] ?? Code2;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setW(percent);
          io.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [percent]);

  return (
    <Reveal delay={delay}>
      <div
        ref={ref}
        className="card-glow group h-full rounded-2xl p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-heading-cyber text-[15px] font-bold text-main">{name}</h3>
            <p className="font-mono-cyber mt-1 text-[10px] tracking-[0.15em] text-cyber/80">
              {level} • {percent}%
            </p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(0,240,255,0.07)] text-cyber transition-all duration-300 group-hover:bg-[rgba(0,240,255,0.15)] group-hover:shadow-[0_0_16px_rgba(0,240,255,0.35)]">
            <Icon className="h-5 w-5" />
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-elev-2" dir="ltr">
          <div
            className="progress-cyber h-full transition-[width] duration-1000 ease-out"
            style={{ width: `${w}%`, transitionDelay: `${delay}ms` }}
          />
        </div>
        <p className="font-mono-cyber mt-2 text-[10px] text-mute" dir="ltr">
          {percent}%
        </p>
      </div>
    </Reveal>
  );
}

export function SkillsSection() {
  return (
    <section id="services" className="relative px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="CAPABILITIES • 03"
          title="المهارات"
          highlight="التقنية"
          subtitle="مجموعة شاملة من المهارات موزعة على 6 تخصصات رئيسية"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SKILLS.map((s, i) => (
            <SkillCard key={s.name} {...s} delay={(i % 4) * 80} />
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <a href="#projects" className="btn-gradient-pink inline-flex h-12 items-center gap-2 rounded-full px-8 text-sm">
            <BarChart3 className="h-4 w-4" />
            استعرض كل المهارات
          </a>
        </Reveal>
      </div>
    </section>
  );
}
