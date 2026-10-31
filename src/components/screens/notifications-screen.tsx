"use client";

import { useState } from "react";
import { Bell, BellOff, BookOpen, CalendarCheck, CheckCheck, Package, ShieldAlert, Wrench } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { EmptyState } from "@/components/screen-state";
import { Button } from "@/components/ui/button";
import { NOTIFICATIONS } from "@/lib/data";

const TYPE_META: Record<string, { icon: typeof Bell; color: string; glow: string; label: string }> = {
  order: { icon: Package, color: "#ffd700", glow: "rgba(255,215,0,0.1)", label: "طلب" },
  booking: { icon: CalendarCheck, color: "#00f0ff", glow: "rgba(0,240,255,0.1)", label: "حجز" },
  course: { icon: BookOpen, color: "#7c3aed", glow: "rgba(124,58,237,0.12)", label: "دورة" },
  blog: { icon: BookOpen, color: "#00ff88", glow: "rgba(0,255,136,0.1)", label: "مدونة" },
  system: { icon: Wrench, color: "#a0aec0", glow: "rgba(160,174,192,0.1)", label: "نظام" },
  security: { icon: ShieldAlert, color: "#ff2a6d", glow: "rgba(255,42,109,0.1)", label: "أمني" },
};

const READ_KEY = "cto-drs-notices-read";

/** شاشة مركز التنبيهات — البيانات من المصدر الرسمي مع حالة القراءة المحلية */
export function NotificationsScreen() {
  const [readIds, setReadIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(READ_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const unread = NOTIFICATIONS.filter((n) => !readIds.includes(n.id)).length;

  const markAllRead = () => {
    setReadIds(NOTIFICATIONS.map((n) => n.id));
    try {
      localStorage.setItem(READ_KEY, JSON.stringify(NOTIFICATIONS.map((n) => n.id)));
    } catch {
      /* تجاهل */
    }
  };

  const toggleRead = (id: string) => {
    const next = readIds.includes(id) ? readIds.filter((x) => x !== id) : [...readIds, id];
    setReadIds(next);
    try {
      localStorage.setItem(READ_KEY, JSON.stringify(next));
    } catch {
      /* تجاهل */
    }
  };

  return (
    <>
      <PageHero
        badge="NOTIFICATIONS • HUB"
        title="مركز"
        highlight="التنبيهات"
        subtitle="آخر الطلبات والحجوزات والدورات والتنبيهات الأمنية — كل ما يخصك في مكان واحد"
      />

      <section className="px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-sec">
              {unread > 0 ? (
                <>
                  لديك <span className="font-bold text-cyber">{unread}</span> تنبيهات غير مقروءة
                </>
              ) : (
                "كل التنبيهات مقروءة ✓"
              )}
            </p>
            {unread > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={markAllRead}
                className="rounded-full border-[rgba(0,240,255,0.35)] text-cyber hover:bg-[rgba(0,240,255,0.08)]"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                تعليم الكل كمقروء
              </Button>
            )}
          </div>

          {NOTIFICATIONS.length === 0 ? (
            <EmptyState icon={BellOff} title="لا توجد تنبيهات" description="ستظهر هنا كل المستجدات." />
          ) : (
            <div className="flex flex-col gap-3">
              {NOTIFICATIONS.map((n, i) => {
                const meta = TYPE_META[n.type] ?? TYPE_META.system;
                const isUnread = !readIds.includes(n.id);
                return (
                  <Reveal key={n.id} delay={i * 60}>
                    <article
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleRead(n.id)}
                      onKeyDown={(e) => e.key === "Enter" && toggleRead(n.id)}
                      aria-label={`${n.title} — ${isUnread ? "اضغط للتعليم كمقروء" : "مقروءة"}`}
                      className={`card-glow flex cursor-pointer gap-4 rounded-2xl p-5 transition-all ${isUnread ? "" : "opacity-70"}`}
                      style={isUnread ? { borderColor: `${meta.color}44`, backgroundColor: meta.glow } : undefined}
                    >
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: meta.glow, color: meta.color }}
                      >
                        <meta.icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                            style={{ color: meta.color, backgroundColor: meta.glow }}
                          >
                            {meta.label}
                          </span>
                          <h3 className="text-sm font-bold text-main">{n.title}</h3>
                          {isUnread && (
                            <span
                              className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-cyber shadow-[0_0_8px_rgba(0,240,255,0.6)]"
                              aria-label="غير مقروء"
                            />
                          )}
                        </div>
                        <p className="mt-1.5 text-xs leading-6 text-sec">{n.body}</p>
                        <p className="mt-2 text-[11px] text-mute">{n.time}</p>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}

          <Reveal delay={200}>
            <div className="card-glow mt-8 flex items-center gap-3 rounded-2xl p-5">
              <Bell className="h-5 w-5 shrink-0 text-cyber" />
              <p className="text-xs leading-6 text-sec">
                نصيحة: اضغط على أي تنبيه لتبديل حالته بين مقروء وغير مقروء — حالة القراءة محفوظة في متصفحك.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
