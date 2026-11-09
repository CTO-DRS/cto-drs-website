"use client";

import { useEffect, useRef } from "react";
import { FolderGit2, Clock, Users, Cpu, Globe, Network, Sparkles, ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import { Counter } from "@/components/counter";
import { useI18n, useContent } from "@/i18n";

const ICONS: Record<string, typeof FolderGit2> = {
  FolderGit2,
  Clock,
  Users,
  Cpu,
  ShieldCheck,
};

const COLOR_MAP: Record<string, { text: string; bg: string; border: string }> = {
  cyan: { text: "text-[#00f0ff]", bg: "bg-[rgba(0,240,255,0.08)]", border: "border-[rgba(0,240,255,0.3)]" },
  purple: { text: "text-[#a78bfa]", bg: "bg-[rgba(124,58,237,0.10)]", border: "border-[rgba(124,58,237,0.35)]" },
  pink: { text: "text-[#ff2a6d]", bg: "bg-[rgba(255,42,109,0.08)]", border: "border-[rgba(255,42,109,0.35)]" },
  green: { text: "text-[#00ff88]", bg: "bg-[rgba(0,255,136,0.08)]", border: "border-[rgba(0,255,136,0.35)]" },
};

/** Animated knowledge-network graph on canvas (like the reference). */
function KnowledgeCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.setTransform(2, 0, 0, 2, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const nodes = Array.from({ length: 26 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0016,
      vy: (Math.random() - 0.5) * 0.0016,
      r: Math.random() * 2.4 + 1.2,
      hue: Math.random() > 0.75 ? "255,42,109" : Math.random() > 0.5 ? "124,58,237" : "0,240,255",
    }));

    const tick = () => {
      const w = canvas.width / 2;
      const h = canvas.height / 2;
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0.03 || n.x > 0.97) n.vx *= -1;
        if (n.y < 0.05 || n.y > 0.95) n.vy *= -1;
      }
      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = (nodes[i].x - nodes[j].x) * w;
          const dy = (nodes[i].y - nodes[j].y) * h;
          const d = Math.hypot(dx, dy);
          if (d < w * 0.16) {
            ctx.strokeStyle = `rgba(0,240,255,${(1 - d / (w * 0.16)) * 0.28})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
            ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x * w, n.y * h, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.hue},0.85)`;
        ctx.shadowColor = `rgba(${n.hue},0.9)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

export function DashboardSection() {
  const { t } = useI18n();
  const d = t.dashboardSection;
  const { DASHBOARD_METRICS, MASTERY_BARS, ACHIEVEMENTS } = useContent();
  return (
    <section id="dashboard" className="relative px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="LIVE METRICS • 01"
          title={d.title}
          highlight={d.highlight}
          subtitle={d.subtitle}
        />

        {/* metric cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {DASHBOARD_METRICS.map((m, i) => {
            const Icon = ICONS[m.icon] ?? Cpu;
            const c = COLOR_MAP[m.color] ?? COLOR_MAP.cyan;
            return (
              <Reveal key={m.label} delay={i * 90}>
                <div className="card-glow group h-full rounded-2xl p-5">
                  <div className="flex items-start justify-between">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl border ${c.bg} ${c.border} ${c.text} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className={`font-mono-cyber rounded-full border px-2 py-0.5 text-[10px] ${c.text} ${c.border} ${c.bg}`}>
                      {m.badge}
                    </span>
                  </div>
                  <p className="font-heading-cyber mt-4 text-3xl font-extrabold">
                    <Counter value={m.value} suffix={m.suffix} className="text-gradient-static" />
                  </p>
                  <p className="mt-1 text-xs text-sec">{m.label}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-5">
          {/* knowledge network */}
          <Reveal className="lg:col-span-3">
            <div className="card-glow relative h-72 overflow-hidden rounded-2xl sm:h-80">
              <KnowledgeCanvas />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
                <span className="font-mono-cyber flex items-center gap-2 text-xs tracking-widest text-sec">
                  <Globe className="h-4 w-4 text-cyber" aria-hidden="true" />
                  {d.knowledge}
                </span>
                <Network className="h-4 w-4 text-mute" aria-hidden="true" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 pt-10">
                <span className="font-mono-cyber text-[10px] tracking-[0.25em] text-cyber/80">
                  SCANNING KNOWLEDGE GRAPH...
                </span>
              </div>
            </div>
          </Reveal>

          {/* mastery bars */}
          <Reveal delay={120} className="lg:col-span-2">
            <div className="card-glow flex h-full flex-col rounded-2xl p-5">
              <span className="font-mono-cyber mb-5 flex items-center gap-2 text-xs tracking-widest text-sec">
                <Sparkles className="h-4 w-4 text-cyber" aria-hidden="true" />
                {d.mastery}
              </span>
              <div className="flex flex-1 flex-col justify-between gap-4">
                {MASTERY_BARS.map((s, i) => (
                  <div key={s.name}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-medium text-main">{s.name}</span>
                      <span className="font-mono-cyber text-cyber">{s.percent}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-elev-2">
                      <div
                        className="progress-cyber h-full transition-[width] duration-1000 ease-out"
                        style={{ width: `${s.percent}%`, transitionDelay: `${i * 120}ms` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="#skills"
                className="mt-5 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-cyber transition hover:gap-3"
              >
                {d.allSkills}
              </a>
            </div>
          </Reveal>
        </div>

        {/* achievements timeline */}
        <Reveal className="mt-6">
          <div className="card-glow rounded-2xl p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-mono-cyber text-xs tracking-widest text-sec">{d.achievements}</span>
              <span className="font-mono-cyber text-[10px] tracking-[0.25em] text-cyber/70">
                SCANNING SKILLS...
              </span>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {ACHIEVEMENTS.map((a, i) => (
                <li key={i} className="group flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-cyber/50" />
                    <span className="h-2.5 w-2.5 rounded-full bg-cyber shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
                  </span>
                  <span className="flex-1 text-sm text-sec transition group-hover:text-main">{a.text}</span>
                  <span className="font-mono-cyber text-[10px] text-mute" dir="ltr">
                    {a.year}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
