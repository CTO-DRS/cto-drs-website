"use client";

import { School, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useI18n } from "@/i18n";
import { ACADEMY_URL } from "@/lib/social";

/** بطاقة ترويجية لأكاديمية الرشيد (academy.cto-drs.com) */
export function AcademySection() {
  const { t } = useI18n();
  const a = t.academy;
  return (
    <section id="academy" aria-labelledby="academy-title" className="relative px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-[2rem] border border-border-strong px-6 py-12 text-center sm:px-12">
            <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
            <div className="relative">
              <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00f0ff] via-[#7c3aed] to-[#ff2a6d] text-[#030303]" aria-hidden="true">
                <School className="h-6 w-6" strokeWidth={2.2} />
              </span>
              <p className="font-mono-cyber text-[11px] tracking-[0.2em] text-cyber">{a.eyebrow}</p>
              <h2 id="academy-title" className="font-heading-cyber mt-3 text-3xl font-extrabold sm:text-4xl">
                {a.title1} <span className="text-gradient-static">{a.title2}</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-sec sm:text-base">{a.body}</p>
              <a
                href={ACADEMY_URL}
                target="_blank"
                rel="noopener"
                className="btn-gradient mx-auto mt-8 inline-flex h-12 items-center gap-2 rounded-full px-8 text-sm"
              >
                {a.enter}
                <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                <span className="sr-only"> {t.nav.newTab}</span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
