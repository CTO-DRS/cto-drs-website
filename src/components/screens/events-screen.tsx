"use client";

import { CalendarDays, Clock3, Hourglass, MapPin, Users } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { EmptyState } from "@/components/screen-state";
import { Button } from "@/components/ui/button";
import { useAppRouter } from "@/lib/router";
import { EVENTS } from "@/lib/data";
import { splitEvents } from "@/lib/events";

const MODE_COLOR: Record<string, string> = {
  أونلاين: "#00f0ff",
  مباشر: "#7c3aed",
  حضوري: "#00ff88",
};

/** شاشة الفعاليات والورش — البيانات من المصدر الرسمي (data.ts)
 *  التصنيف تلقائي بالتاريخ (splitEvents): فعالية تمرّ تاريخها تنتقل لـ«السابقة»
 *  حتى لو بقيت status=upcoming في البيانات — يمنع بقاء المنتهية ضمن القادمة. */
export function EventsScreen() {
  const { navigate } = useAppRouter();

  const { upcoming, past } = splitEvents(EVENTS);

  const renderEvent = (ev: (typeof EVENTS)[number], i: number, isPast = false) => {
    const color = MODE_COLOR[ev.mode] ?? "#00f0ff";
    return (
      <Reveal key={ev.title} delay={i * 80}>
        <article
          className={`card-glow rounded-2xl p-6 transition-all ${isPast ? "opacity-70" : "hover:-translate-y-0.5"}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                  style={{ color, backgroundColor: `${color}1a` }}
                >
                  {ev.mode}
                </span>
                <span className="rounded-full border border-border-soft px-2.5 py-0.5 text-[10px] text-mute">
                  {ev.duration}
                </span>
              </div>
              <h2 className="mt-2.5 text-base font-bold text-main">{ev.title}</h2>
              <p className="mt-1.5 text-xs leading-6 text-sec">{ev.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {ev.topics.map((t) => (
                  <span key={t} className="rounded-md bg-elev-2/70 px-2 py-0.5 text-[10px] text-mute" dir="auto">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div
              className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border text-center"
              style={{ borderColor: `${color}55`, backgroundColor: `${color}0d` }}
            >
              <span className="font-heading-cyber text-lg font-extrabold" style={{ color }}>
                {new Date(ev.date).getDate()}
              </span>
              <span className="text-[10px] text-mute">
                {new Date(ev.date).toLocaleDateString("ar", { month: "long" })}
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border-soft pt-4 text-[11px] text-mute">
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-cyber" />
              {ev.time}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-cyber" />
              {ev.mode === "حضوري" ? "الرياض" : "أونلاين"}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-cyber" />
              {ev.seats}
            </span>
            {!isPast && (
              <Button
                size="sm"
                onClick={() => navigate({ name: "contact" })}
                className="btn-outline-cyber mr-auto h-8 rounded-full px-4 text-[11px]"
              >
                سجّل حضورك
              </Button>
            )}
          </div>
        </article>
      </Reveal>
    );
  };

  return (
    <>
      <PageHero
        badge="EVENTS • LIVE"
        title="الفعاليات"
        highlight="والورش"
        subtitle="ندوات وورش ولقاءات تقنية مباشرة — تعلّم معنا وشارك في النقاش"
      />

      <section className="px-4 py-14">
        <div className="mx-auto max-w-4xl">
          {upcoming.length === 0 ? (
            <EmptyState
              icon={Hourglass}
              title="لا توجد فعاليات قادمة حالياً"
              description="تابع قنواتنا ليصلك الجدول القادم — أو اطلب ورشة مخصصة لفريقك تُقدَّم عن بُعد أو في الرياض."
              action={
                <button
                  type="button"
                  onClick={() => navigate({ name: "booking" })}
                  className="btn-gradient rounded-xl px-6 py-2.5 text-sm font-bold"
                >
                  احجز ورشة لفريقك
                </button>
              }
            />
          ) : (
            <>
              <h2 className="font-heading-cyber mb-5 flex items-center gap-2 text-sm font-bold text-main">
                <CalendarDays className="h-4 w-4 text-cyber" />
                الفعاليات القادمة
              </h2>
              <div className="flex flex-col gap-4">
                {upcoming.map((ev, i) => renderEvent(ev, i))}
              </div>
            </>
          )}

          {past.length > 0 && (
            <>
              <h2 className="font-heading-cyber mt-12 mb-5 flex items-center gap-2 text-sm font-bold text-mute">
                <Hourglass className="h-4 w-4" />
                فعاليات سابقة
              </h2>
              <div className="flex flex-col gap-4">
                {past.map((ev, i) => renderEvent(ev, i, true))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
