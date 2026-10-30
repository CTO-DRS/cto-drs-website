"use client";

import { ChevronLeft, Home } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useAppRouter, routeHref } from "@/lib/router";

/**
 * Shared hero/banner for every sub-screen:
 * mono badge + gradient title + muted subtitle + breadcrumb.
 */
export function PageHero({
  badge,
  title,
  highlight,
  subtitle,
}: {
  badge: string;
  title: string;
  highlight?: string;
  subtitle: string;
}) {
  const { navigate } = useAppRouter();

  return (
    <section className="relative overflow-hidden border-b border-border-soft">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-24 right-1/4 h-64 w-64 rounded-full bg-[rgba(0,240,255,0.08)] blur-[90px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-16 left-1/4 h-56 w-56 rounded-full bg-[rgba(255,42,109,0.07)] blur-[90px]" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 pb-14 pt-32 text-center">
        <Reveal>
          <div className="section-badge mb-5 flex items-center gap-2.5 rounded-full px-4 py-1.5">
            <span className="font-bold tracking-[0.2em]">{badge}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyber" />
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-heading-cyber text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            <span className="text-main">{title}</span>{" "}
            {highlight && <span className="text-gradient-static">{highlight}</span>}
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-sec sm:text-base">
            {subtitle}
          </p>
        </Reveal>
        <Reveal delay={220}>
          <nav
            aria-label="مسار التنقل"
            className="font-mono-cyber mt-6 flex items-center gap-1.5 text-[11px] text-mute"
          >
            <a
              href={routeHref({ name: "home" })}
              onClick={(e) => {
                e.preventDefault();
                navigate({ name: "home" });
              }}
              className="flex items-center gap-1 transition hover:text-cyber"
            >
              <Home className="h-3 w-3" />
              الرئيسية
            </a>
            <ChevronLeft className="h-3 w-3" />
            <span className="text-cyber">{title}</span>
          </nav>
        </Reveal>
      </div>
    </section>
  );
}
