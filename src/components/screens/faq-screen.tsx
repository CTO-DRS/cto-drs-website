"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  CreditCard,
  HelpCircle,
  Info,
  LifeBuoy,
  MessageCircle,
  Search,
  SearchX,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { EmptyState } from "@/components/screen-state";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAppRouter } from "@/lib/router";
import { type FaqCat } from "@/lib/faq-data";
import { useI18n, useContent } from "@/i18n";

const ALL = "__all__";

/* ─────────── data ─────────── */

const CATEGORIES: { name: FaqCat; icon: LucideIcon }[] = [
  { name: "عام", icon: Info },
  { name: "الخدمات", icon: Wrench },
  { name: "الدفع", icon: CreditCard },
  { name: "الدعم", icon: LifeBuoy },
];

/* ─────────── screen ─────────── */

export function FaqScreen() {
  const { navigate } = useAppRouter();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<typeof ALL | FaqCat>(ALL);
  const { t } = useI18n();
  const fq = t.faq;
  const { FAQS } = useContent();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((f) => {
      const matchCat = activeCat === ALL || f.cat === activeCat;
      const matchQuery = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [query, activeCat, FAQS]);

  const grouped = useMemo(
    () =>
      CATEGORIES.map(({ name, icon }) => ({
        name,
        icon,
        items: filtered.filter((f) => f.cat === name),
      })).filter((g) => g.items.length > 0),
    [filtered]
  );

  const pillCls = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-xs font-bold transition ${
      active
        ? "border-[rgba(0,240,255,0.55)] bg-[rgba(0,240,255,0.12)] text-cyber shadow-[0_0_14px_rgba(0,240,255,0.15)]"
        : "border-border-soft text-sec hover:border-[rgba(0,240,255,0.4)] hover:text-cyber"
    }`;

  return (
    <>
      <PageHero
        badge="FAQ.CENTER"
        title={fq.title}
        highlight={fq.highlight}
        subtitle={fq.subtitle}
      />

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
        {/* ── toolbar ── */}
        <Reveal>
          <div className="mb-10 flex flex-col gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative max-w-md flex-1">
                <Search
                  className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={fq.searchPh}
                  aria-label={fq.searchAria}
                  className="h-11 w-full rounded-xl border border-border-strong bg-elev-2/60 ps-11 pe-4 text-sm outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.15)]"
                />
              </div>
              <p className="font-mono-cyber shrink-0 text-xs text-mute" aria-live="polite">
                {fq.results(filtered.length, FAQS.length)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label={fq.filterAria}>
              {([ALL, ...CATEGORIES.map((c) => c.name)] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCat(cat)}
                  aria-pressed={activeCat === cat}
                  className={pillCls(activeCat === cat)}
                >
                  {cat === ALL ? t.common.all : fq.cats[cat] ?? cat}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── faq groups ── */}
        {filtered.length === 0 ? (
          <Reveal>
            <EmptyState
              icon={SearchX}
              title={fq.emptyTitle}
              description={fq.emptyDesc}
              action={
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setActiveCat(ALL);
                  }}
                  className="btn-outline-cyber rounded-full px-6 py-2.5 text-xs font-bold"
                >
                  {fq.reset}
                </button>
              }
            />
          </Reveal>
        ) : (
          <div className="space-y-10">
            {grouped.map(({ name, icon: CatIcon, items }, gi) => (
              <Reveal key={name} delay={gi * 80}>
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(0,240,255,0.25)] bg-[rgba(0,240,255,0.07)]">
                    <CatIcon className="h-4 w-4 text-cyber" aria-hidden="true" />
                  </span>
                  <h2 className="font-heading-cyber text-lg font-bold text-main">{fq.cats[name] ?? name}</h2>
                  <span className="tag-pill">{fq.count(items.length)}</span>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {items.map((f, i) => {
                    const value = `${name}-${i}`;
                    return (
                      <AccordionItem
                        key={value}
                        value={value}
                        className="card-glow hover:transform-none! mb-3 rounded-xl px-5"
                      >
                        <AccordionTrigger className="hover:no-underline text-start">
                          <span className="flex items-center gap-3">
                            <HelpCircle
                              className="h-4 w-4 shrink-0 text-cyber"
                              aria-hidden="true"
                            />
                            <span className="text-sm font-bold text-main">{f.q}</span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="ps-7 text-sm leading-7 text-sec">
                          {f.a}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </Reveal>
            ))}
          </div>
        )}

        {/* ── CTA ── */}
        <Reveal delay={120}>
          <div className="glass mt-14 rounded-2xl p-8 text-center md:p-10">
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(255,42,109,0.3)] bg-[rgba(255,42,109,0.08)]">
              <MessageCircle className="h-6 w-6 text-[#ff2a6d]" aria-hidden="true" />
            </span>
            <h2 className="font-heading-cyber text-2xl font-bold text-main">
              {fq.ctaTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-sec">{fq.ctaBody}</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate({ name: "contact" })}
                className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm"
              >
                {fq.ctaContact}
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => navigate({ name: "booking" })}
                className="btn-outline-cyber inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold"
              >
                <CalendarClock className="h-4 w-4" aria-hidden="true" />
                {fq.ctaBook}
              </button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
