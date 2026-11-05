"use client";

import {
  School,
  ArrowUpRight,
  Layers,
  BadgeCheck,
  Flag,
  FlaskConical,
  MessagesSquare,
  Trophy,
  Languages,
  ShieldCheck,
  UserPlus,
  Compass,
  ListChecks,
  Award,
  BookOpen,
  Clock3,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import { useI18n } from "@/i18n";
import { ACADEMY_URL } from "@/lib/social";
import {
  ACADEMY_REGISTER_URL,
  ACADEMY_TRACKS_URL,
  ACADEMY_STATS,
  ACADEMY_TRACKS,
  academyCourseUrl,
} from "@/lib/academy";

const FEATURE_ICONS: LucideIcon[] = [Layers, BadgeCheck, Flag, FlaskConical, MessagesSquare, Trophy, Languages, ShieldCheck];
const STEP_ICONS: LucideIcon[] = [UserPlus, Compass, ListChecks, Award];

/** رابط خارجي إلى الأكاديمية مع إعلان "نافذة جديدة" لقارئات الشاشة */
function ExtLink({
  href,
  className,
  children,
  newTab,
  ariaLabel,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
  newTab: string;
  ariaLabel?: string;
}) {
  return (
    <a href={href} target="_blank" rel="noopener" className={className} aria-label={ariaLabel ? `${ariaLabel} ${newTab}` : undefined}>
      {children}
      {!ariaLabel && <span className="sr-only"> {newTab}</span>}
    </a>
  );
}

/** قسم أكاديمية الرشيد (academy.cto-drs.com) — يحل محل قسم الدورات في الرئيسية */
export function AcademySection() {
  const { t, lang } = useI18n();
  const a = t.academy;
  const isAr = lang === "ar";
  const newTab = t.nav.newTab;
  const fmt = (v: number) => v.toLocaleString(isAr ? "ar-SA-u-nu-latn" : "en-US");

  const stats: [number, string][] = [
    [ACADEMY_STATS.tracks, a.stats.tracks],
    [ACADEMY_STATS.courses, a.stats.courses],
    [ACADEMY_STATS.lessons, a.stats.lessons],
    [ACADEMY_STATS.quizzes, a.stats.quizzes],
    [ACADEMY_STATS.ctf, a.stats.ctf],
  ];

  return (
    <section id="academy" aria-labelledby="academy-title" className="relative px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {/* ── Hero card ── */}
        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-[2rem] border border-border-strong px-6 py-12 text-center sm:px-12">
            <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
            <div className="relative">
              <span
                className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00f0ff] via-[#7c3aed] to-[#ff2a6d] text-[#030303]"
                aria-hidden="true"
              >
                <School className="h-6 w-6" strokeWidth={2.2} />
              </span>
              <p className="font-mono-cyber text-[11px] tracking-[0.2em] text-cyber">{a.badge}</p>
              <h2 id="academy-title" className="font-heading-cyber mt-3 text-3xl font-extrabold sm:text-4xl">
                {a.title1} <span className="text-gradient-static">{a.title2}</span>
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base font-bold text-main">{a.tagline}</p>
              <p className="mx-auto mt-4 max-w-3xl text-sm leading-8 text-sec sm:text-base">{a.body}</p>
              <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label={a.eyebrow}>
                {a.pills.map((p) => (
                  <li
                    key={p}
                    className="rounded-full border border-[rgba(0,240,255,0.25)] bg-[rgba(0,240,255,0.06)] px-3 py-1 text-xs font-bold text-cyber"
                  >
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <ExtLink href={ACADEMY_REGISTER_URL} newTab={newTab} className="btn-gradient inline-flex h-12 items-center gap-2 rounded-full px-8 text-sm">
                  <UserPlus className="h-4 w-4" aria-hidden="true" />
                  {a.register}
                </ExtLink>
                <ExtLink
                  href={ACADEMY_URL}
                  newTab={newTab}
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-border-strong bg-elev-2/40 px-8 text-sm font-bold text-sec transition hover:border-[rgba(0,240,255,0.4)] hover:text-cyber"
                >
                  {a.enter}
                  <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                </ExtLink>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Numbers row ── */}
        <Reveal delay={80}>
          <dl aria-label={a.statsAria} className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map(([v, l], i) => (
              <div key={l} className={`card-glow rounded-2xl px-4 py-5 text-center ${i === 4 ? "col-span-2 sm:col-span-1" : ""}`}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-heading-cyber text-3xl font-extrabold text-gradient-static" dir="ltr">
                  {fmt(v)}
                </dd>
                <dd className="mt-1 text-xs font-bold text-sec" aria-hidden="true">
                  {l}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* ── What it offers ── */}
        <div className="mt-20">
          <SectionHeader badge="FEATURES" title={a.featuresTitle} subtitle={a.tagline} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {a.features.map((f, i) => {
              const Icon = FEATURE_ICONS[i] ?? Layers;
              return (
                <Reveal key={f.t} as="li" delay={(i % 4) * 70}>
                  <div className="card-glow group flex h-full flex-col rounded-2xl p-5">
                    <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(0,240,255,0.08)] text-cyber" aria-hidden="true">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-heading-cyber text-sm font-bold text-main">{f.t}</h3>
                    <p className="mt-2 text-xs leading-6 text-sec">{f.d}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>

        {/* ── What you'll learn: 5 tracks × 3 courses ── */}
        <div className="mt-20">
          <SectionHeader badge="TRACKS" title={a.tracksTitle} subtitle={a.tracksSub} />
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ACADEMY_TRACKS.map((tr, i) => {
              const lessons = tr.courses.reduce((s, c) => s + c.lessons, 0);
              return (
                <Reveal key={tr.slug} as="li" delay={(i % 3) * 90}>
                  <article
                    className="card-glow flex h-full flex-col rounded-2xl p-6"
                    style={{ borderInlineStart: `3px solid ${tr.color}` }}
                    aria-labelledby={`track-${tr.slug}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-elev-2/60 text-xl" aria-hidden="true">
                        {tr.icon}
                      </span>
                      <div>
                        <h3 id={`track-${tr.slug}`} className="font-heading-cyber text-base font-bold text-main">
                          {isAr ? tr.titleAr : tr.title}
                        </h3>
                        <p className="text-[11px] font-bold text-mute">{a.trackMeta(tr.courses.length, lessons)}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-6 text-sec">{isAr ? tr.descAr : tr.desc}</p>
                    <ol className="mt-4 flex flex-1 flex-col gap-2">
                      {tr.courses.map((c) => {
                        const name = isAr ? c.titleAr : c.title;
                        return (
                          <li key={c.slug}>
                            <a
                              href={academyCourseUrl(c.slug)}
                              target="_blank"
                              rel="noopener"
                              aria-label={`${a.courseAria(name)} — ${a.levels[c.level]}${isAr ? "،" : ","} ${a.lessons(c.lessons)} ${newTab}`}
                              className="group flex items-center justify-between gap-3 rounded-xl border border-border-strong bg-elev-2/30 px-3 py-2.5 transition hover:border-[rgba(0,240,255,0.4)]"
                            >
                              <span className="text-sm font-bold text-main transition group-hover:text-cyber">{name}</span>
                              <span className="flex shrink-0 items-center gap-2 text-[11px] text-sec">
                                <span className="rounded-full border border-border-strong px-2 py-0.5">{a.levels[c.level]}</span>
                                <span className="hidden items-center gap-1 sm:flex">
                                  <BookOpen className="h-3 w-3 text-cyber/70" aria-hidden="true" />
                                  {a.lessons(c.lessons)}
                                </span>
                                <span className="hidden items-center gap-1 xl:flex">
                                  <Clock3 className="h-3 w-3 text-cyber/70" aria-hidden="true" />
                                  {a.hours(c.hours)}
                                </span>
                              </span>
                            </a>
                          </li>
                        );
                      })}
                    </ol>
                  </article>
                </Reveal>
              );
            })}
            {/* بطاقة دعوة لتصفح كل المسارات */}
            <Reveal as="li" delay={180}>
              <div className="glass-strong flex h-full flex-col items-center justify-center rounded-2xl border border-border-strong p-6 text-center">
                <Flag className="h-8 w-8 text-cyber" aria-hidden="true" />
                <p className="mt-3 font-heading-cyber text-base font-bold text-main">
                  {fmt(ACADEMY_STATS.ctf)} {a.stats.ctf}
                </p>
                <p className="mt-2 text-xs leading-6 text-sec">{a.features[2].d}</p>
                <ExtLink
                  href={ACADEMY_TRACKS_URL}
                  newTab={newTab}
                  className="btn-outline-cyber mt-5 inline-flex h-10 items-center gap-2 rounded-full px-6 text-xs font-bold"
                >
                  {a.browseTracks}
                  <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
                </ExtLink>
              </div>
            </Reveal>
          </ul>
        </div>

        {/* ── How it works ── */}
        <div className="mt-20">
          <SectionHeader badge="HOW IT WORKS" title={a.stepsTitle} subtitle={a.ctaBody} />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {a.steps.map((s, i) => {
              const Icon = STEP_ICONS[i] ?? Compass;
              return (
                <Reveal key={s.t} as="li" delay={i * 80}>
                  <div className="card-glow relative flex h-full flex-col rounded-2xl p-5">
                    <span className="font-mono-cyber absolute end-4 top-4 text-xs font-bold text-mute" dir="ltr" aria-hidden="true">
                      0{i + 1}
                    </span>
                    <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(124,58,237,0.12)] text-[#a78bfa]" aria-hidden="true">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-heading-cyber text-sm font-bold text-main">
                      <span className="sr-only">{i + 1}. </span>
                      {s.t}
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-sec">{s.d}</p>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>

        {/* ── Final CTA ── */}
        <Reveal>
          <div className="mt-14 flex flex-col items-center gap-4 text-center">
            <p className="font-heading-cyber text-xl font-extrabold text-main sm:text-2xl">{a.ctaTitle}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <ExtLink href={ACADEMY_REGISTER_URL} newTab={newTab} className="btn-gradient inline-flex h-12 items-center gap-2 rounded-full px-8 text-sm">
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                {a.register}
              </ExtLink>
              <ExtLink
                href={ACADEMY_URL}
                newTab={newTab}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border-strong bg-elev-2/40 px-8 text-sm font-bold text-sec transition hover:border-[rgba(0,240,255,0.4)] hover:text-cyber"
              >
                {a.enter}
                <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
              </ExtLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
