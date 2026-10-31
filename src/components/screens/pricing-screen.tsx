"use client";

import { useState } from "react";
import { Check, Crown, Rocket, Sparkles } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { useAppRouter } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS, PRICING_COMPARE } from "@/lib/data";

const PLAN_ICONS: Record<string, typeof Sparkles> = {
  الأساسية: Sparkles,
  الاحترافية: Rocket,
  المؤسسية: Crown,
};
const PLAN_COLORS: Record<string, string> = {
  الأساسية: "#00ff88",
  الاحترافية: "#00f0ff",
  المؤسسية: "#ffd700",
};

/** شاشة الباقات والأسعار — البيانات من المصدر الرسمي (data.ts) */
export function PricingScreen() {
  const { navigate } = useAppRouter();
  const [yearly, setYearly] = useState(false);

  return (
    <>
      <PageHero
        badge="PRICING • PLANS"
        title="الباقات"
        highlight="والأسعار"
        subtitle="أسعار شفافة بدون مفاجآت — اختر ما يناسب مشروعك أو اطلب عرضاً مخصصاً"
      />

      <section className="px-4 py-14">
        <div className="mx-auto max-w-6xl">
          {/* مفتاح شهري/سنوي */}
          <Reveal>
            <div className="mb-8 flex items-center justify-center gap-3">
              <button
                onClick={() => setYearly(false)}
                aria-pressed={!yearly}
                className={`h-10 rounded-full px-5 text-xs font-bold transition ${
                  !yearly ? "btn-gradient" : "text-sec hover:text-cyber"
                }`}
              >
                شهري
              </button>
              <button
                onClick={() => setYearly(true)}
                aria-pressed={yearly}
                className={`flex h-10 items-center gap-1.5 rounded-full px-5 text-xs font-bold transition ${
                  yearly ? "btn-gradient" : "text-sec hover:text-cyber"
                }`}
              >
                سنوي
                <span className="rounded-full bg-[rgba(0,255,136,0.15)] px-2 py-0.5 text-[10px] text-[#00ff88]">
                  شهران مجاناً
                </span>
              </button>
            </div>
          </Reveal>

          <div className="grid gap-5 lg:grid-cols-3">
            {PRICING_PLANS.map((plan, i) => {
              const Icon = PLAN_ICONS[plan.name] ?? Sparkles;
              const color = PLAN_COLORS[plan.name] ?? "#00f0ff";
              const price = yearly ? plan.yearly : plan.monthly;
              return (
                <Reveal key={plan.name} delay={i * 90}>
                  <article
                    className={`card-glow relative flex h-full flex-col rounded-2xl p-7 transition-all duration-300 ${
                      plan.featured ? "border-[rgba(0,240,255,0.45)] shadow-[0_0_35px_rgba(0,240,255,0.12)]" : ""
                    }`}
                  >
                    {plan.featured && (
                      <span className="font-mono-cyber absolute -top-3 right-6 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#00aaff] px-3 py-1 text-[10px] font-bold text-[#030303]">
                        MOST POPULAR
                      </span>
                    )}
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: `${color}14`, color }}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <h2 className="mt-4 text-lg font-bold text-main">{plan.name}</h2>
                    <p className="mt-1 text-xs text-mute">{plan.tagline}</p>
                    <div className="mt-5 flex items-baseline gap-2">
                      <span className="font-heading-cyber text-3xl font-extrabold" style={{ color }}>
                        {price === 0 ? "مجانية" : price.toLocaleString("en-US")}
                      </span>
                      {price > 0 && (
                        <span className="text-xs text-mute">ر.س / {yearly ? "سنوياً" : "شهرياً"}</span>
                      )}
                    </div>
                    <ul className="mt-6 flex-1 space-y-2.5 border-t border-border-soft pt-5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm leading-6 text-sec">
                          <Check className="mt-1 h-4 w-4 shrink-0" style={{ color }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => navigate({ name: "contact" })}
                      className={`mt-7 h-11 w-full rounded-xl text-sm ${
                        plan.featured ? "btn-gradient" : "btn-outline-cyber"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </article>
                </Reveal>
              );
            })}
          </div>

          {/* جدول المقارنة */}
          <Reveal delay={200}>
            <div className="card-glow mt-12 overflow-x-auto rounded-2xl p-6">
              <h3 className="font-heading-cyber mb-4 text-base font-bold text-main">مقارنة تفصيلية</h3>
              <table className="w-full min-w-[560px] text-right text-xs">
                <thead>
                  <tr className="border-b border-border-soft text-mute">
                    <th className="py-3 font-medium">الميزة</th>
                    <th className="py-3 font-medium">الأساسية</th>
                    <th className="py-3 font-medium text-cyber">الاحترافية</th>
                    <th className="py-3 font-medium text-[#ffd700]">المؤسسية</th>
                  </tr>
                </thead>
                <tbody>
                  {PRICING_COMPARE.map((row) => (
                    <tr key={row.feature} className="border-b border-border-soft/50 last:border-0">
                      <td className="py-3 text-sec">{row.feature}</td>
                      <td className="py-3 text-mute">{row.basic}</td>
                      <td className="py-3 font-bold text-main">{row.pro}</td>
                      <td className="py-3 text-mute">{row.ent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={250}>
            <p className="mt-8 text-center text-xs leading-6 text-mute">
              كل الباقات تشمل: كود نظيف موثّق • تسليم ملفات المصدر • ضمان إصلاح الأخطاء
              — تحتاج شيئاً مختلفاً؟{" "}
              <button
                onClick={() => navigate({ name: "contact" })}
                className="font-bold text-cyber underline-offset-4 hover:underline"
              >
                تواصل معي
              </button>{" "}
              لعرض مخصص.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
