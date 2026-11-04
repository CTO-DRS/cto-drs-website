"use client";

import { GraduationCap, BookOpen, Clock3, SignalHigh, Users2, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import { useI18n, useContent } from "@/i18n";

export function CoursesSection() {
  const { t } = useI18n();
  const cs = t.coursesSection;
  const { COURSES } = useContent();
  return (
    <section className="relative px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="ACADEMY • 07"
          title={cs.title}
          highlight={cs.highlight}
          subtitle={cs.subtitle}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {COURSES.map((c, i) => (
            <Reveal key={c.title} delay={i * 100}>
              <article className="card-glow group flex h-full flex-col rounded-2xl p-6">
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(124,58,237,0.1)] text-[#a78bfa] transition-all duration-300 group-hover:shadow-[0_0_18px_rgba(124,58,237,0.4)]">
                  <GraduationCap className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="font-heading-cyber text-base font-bold text-main transition group-hover:text-cyber">
                  {c.title}
                </h3>
                <p className="mt-2 line-clamp-2 flex-1 text-xs leading-6 text-sec">{c.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-sec">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-cyber/70" aria-hidden="true" />
                    {cs.lessons(c.lessons)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5 text-cyber/70" aria-hidden="true" />
                    {cs.hours(c.hours)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <SignalHigh className="h-3.5 w-3.5 text-cyber/70" aria-hidden="true" />
                    {c.level}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users2 className="h-3.5 w-3.5 text-cyber/70" aria-hidden="true" />
                    {c.students}
                  </span>
                </div>

                <a
                  href="#/courses"
                  className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[rgba(0,255,136,0.35)] bg-[rgba(0,255,136,0.06)] text-xs font-bold text-[#00ff88] transition hover:bg-[rgba(0,255,136,0.14)]"
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  {cs.free}
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
