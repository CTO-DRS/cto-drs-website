"use client";

import { Reveal } from "@/components/reveal";

/** Cyber section header: mono badge + gradient title + muted subtitle */
export function SectionHeader({
  badge,
  title,
  highlight,
  subtitle,
}: {
  badge: string;
  title: string;
  /** trailing word rendered with pink gradient (like reference) */
  highlight?: string;
  subtitle: string;
}) {
  return (
    <Reveal className="mx-auto mb-12 flex max-w-2xl flex-col items-center text-center">
      <div className="section-badge mb-5 flex items-center gap-2.5 rounded-full px-4 py-1.5">
        <span className="font-bold tracking-[0.2em]">{badge}</span>
        <span className="h-1.5 w-1.5 rounded-full bg-cyber" />
      </div>
      <h2 className="font-heading-cyber text-3xl font-extrabold sm:text-4xl md:text-[2.75rem]">
        <span className="text-main">{title}</span>{" "}
        {highlight && <span className="text-gradient-static">{highlight}</span>}
      </h2>
      <p className="mt-4 text-sm leading-7 text-sec sm:text-base">{subtitle}</p>
    </Reveal>
  );
}
