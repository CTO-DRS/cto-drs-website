"use client";

import { useMemo, useState } from "react";
import {
  Bug,
  Check,
  Clock,
  Cloud,
  Code2,
  Database,
  Globe,
  LayoutDashboard,
  Lightbulb,
  Lock,
  Network,
  Radar,
  Server,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Star,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/screen-state";
import { Badge } from "@/components/ui/badge";
import { useAppRouter } from "@/lib/router";
import { useApi } from "@/lib/use-api";
import { toast } from "@/hooks/use-toast";
import type { Service } from "@/lib/types";

const fmtPrice = (n: number) => n.toLocaleString("en-US") + " ر.س";

const ICONS: Record<string, LucideIcon> = {
  Globe,
  ShoppingCart,
  Smartphone,
  LayoutDashboard,
  ShieldCheck,
  Bug,
  Radar,
  Lightbulb,
  TrendingUp,
  Wrench,
  Code2,
  Lock,
  Database,
  Cloud,
  Server,
  Network,
};

/** Cycling accent tones for icon tiles (allowed palette only). */
const TILE_TONES = [
  "border-[rgba(0,240,255,0.25)] bg-[rgba(0,240,255,0.08)] text-[#00f0ff]",
  "border-[rgba(255,42,109,0.25)] bg-[rgba(255,42,109,0.08)] text-[#ff2a6d]",
  "border-[rgba(124,58,237,0.3)] bg-[rgba(124,58,237,0.1)] text-[#7c3aed]",
  "border-[rgba(255,215,0,0.25)] bg-[rgba(255,215,0,0.08)] text-[#ffd700]",
  "border-[rgba(0,255,136,0.25)] bg-[rgba(0,255,136,0.08)] text-[#00ff88]",
  "border-[rgba(255,153,0,0.25)] bg-[rgba(255,153,0,0.08)] text-[#ff9900]",
];

export function ServicesScreen() {
  const { data: services, loading, error, reload } = useApi<Service[]>("/api/services");
  const { navigate } = useAppRouter();
  const [activeCat, setActiveCat] = useState("الكل");

  const categories = useMemo(() => {
    if (!services) return [] as string[];
    return Array.from(new Set(services.map((s) => s.category)));
  }, [services]);

  const filtered = useMemo(() => {
    if (!services) return [] as Service[];
    const list =
      activeCat === "الكل" ? services : services.filter((s) => s.category === activeCat);
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [services, activeCat]);

  const orderService = (service: Service) => {
    try {
      sessionStorage.setItem("cto-drs-booking-service", service.title);
    } catch {
      /* storage unavailable */
    }
    toast({
      title: "تم اختيار الخدمة",
      description: `أكمل بيانات الحجز لخدمة: ${service.title}`,
    });
    navigate({ name: "booking" });
  };

  return (
    <>
      <PageHero
        badge="SERVICES.MODULE"
        title="الخدمات"
        highlight="المهنية"
        subtitle="حلول تقنية متكاملة من الاستشارة حتى الإطلاق — اختر الخدمة وابدأ رحلتك الرقمية بأمان"
      />

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
        {/* ── Category filter pills ── */}
        <div className="mb-8 flex flex-wrap items-center gap-2" role="group" aria-label="تصفية الخدمات حسب التصنيف">
          {["الكل", ...categories].map((cat) =>
            activeCat === cat ? (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className="btn-gradient rounded-full px-4 py-1.5 text-xs font-bold"
                aria-pressed="true"
              >
                {cat}
              </button>
            ) : (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className="tag-pill cursor-pointer transition hover:border-[rgba(0,240,255,0.6)] hover:bg-[rgba(0,240,255,0.1)]"
                aria-pressed="false"
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* ── States ── */}
        {loading && <ListSkeleton count={6} />}
        {!loading && error && <ErrorState message={error} onRetry={reload} />}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={Wrench}
            title="لا توجد خدمات في هذا التصنيف"
            description="جرّب اختيار تصنيف آخر أو عُد لاحقاً — نضيف خدمات جديدة باستمرار."
            action={
              <button
                onClick={() => setActiveCat("الكل")}
                className="btn-gradient rounded-full px-5 py-2 text-xs font-bold"
              >
                عرض كل الخدمات
              </button>
            }
          />
        )}

        {/* ── Services grid ── */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((service, i) => {
              const Icon = ICONS[service.icon] ?? Code2;
              const tone = TILE_TONES[i % TILE_TONES.length];
              return (
                <Reveal key={service.id} delay={i * 60} className="h-full">
                  <article
                    className={`card-glow relative flex h-full flex-col rounded-2xl p-5 ${
                      service.featured ? "border-[rgba(0,240,255,0.35)]" : ""
                    }`}
                  >
                    {service.featured && (
                      <Badge className="absolute left-4 top-4 gap-1 border-[rgba(255,215,0,0.4)] bg-[rgba(255,215,0,0.12)] text-[10px] font-bold text-[#ffd700]">
                        <Star className="h-3 w-3 fill-[#ffd700]" />
                        مميزة
                      </Badge>
                    )}

                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${tone}`}
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="tag-pill mt-1">{service.category}</span>
                    </div>

                    <h3 className="font-heading-cyber mb-2 text-lg font-bold leading-snug text-main">
                      {service.title}
                    </h3>
                    <p className="mb-4 line-clamp-3 text-sm leading-6 text-sec">
                      {service.description}
                    </p>

                    <ul className="mb-5 space-y-2">
                      {service.features.slice(0, 4).map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-xs text-sec">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00ff88]" aria-hidden="true" />
                          <span className="leading-5">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto mb-4 flex items-center justify-between border-t border-border-soft pt-4">
                      <span className="flex items-center gap-1.5 text-xs text-mute">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        {service.duration}
                      </span>
                      <span className="text-xs text-sec">
                        تبدأ من{" "}
                        <span className="font-bold text-cyber">{fmtPrice(service.price)}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => orderService(service)}
                      className="btn-gradient h-10 w-full rounded-full px-5 text-xs"
                      aria-label={`اطلب خدمة ${service.title}`}
                    >
                      اطلب الخدمة
                    </button>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
