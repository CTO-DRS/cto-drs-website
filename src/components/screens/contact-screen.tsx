"use client";

import { Clock3, ShieldCheck, Zap } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContactSection } from "@/components/contact-section";
import { Reveal } from "@/components/reveal";

/**
 * شاشة "تواصل معي" المستقلة — تحتوي فقط على أدوات التواصل
 * دون تكرار محتوى الشاشة الرئيسية.
 */
export function ContactScreen() {
  return (
    <>
      <PageHero
        badge="CONTACT • CTO-DRS"
        title="تواصل"
        highlight="معي"
        subtitle="اختر القناة الأنسب لك أو أرسل رسالة مباشرة — سأرد عليك خلال 24 ساعة كحد أقصى"
      />

      {/* شريط ضمانات سريع — معلومات فريدة غير مكررة */}
      <section className="px-4 pt-12" aria-label="ضمانات التواصل">
        <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-3">
          {[
            { icon: Clock3, t: "رد خلال 24 ساعة", d: "في أيام العمل الرسمية" },
            { icon: ShieldCheck, t: "خصوصية تامة", d: "بياناتك لا تُشارك مع أي طرف" },
            { icon: Zap, t: "رد سريع", d: "أسرع تواصل عبر واتساب أو تيليجرام" },
          ].map((f, i) => (
            <Reveal key={f.t} delay={i * 90}>
              <div className="card-glow flex items-center gap-3 rounded-2xl p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(0,240,255,0.07)] text-cyber">
                  <f.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-main">{f.t}</p>
                  <p className="text-[11px] text-mute">{f.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <ContactSection showHeader={false} />
    </>
  );
}
