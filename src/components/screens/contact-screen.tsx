"use client";

import { Clock3, ShieldCheck, Zap } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContactSection } from "@/components/contact-section";
import { Reveal } from "@/components/reveal";
import { useI18n } from "@/i18n";

const ICONS = [Clock3, ShieldCheck, Zap];

/**
 * شاشة "تواصل معي" المستقلة — تحتوي فقط على أدوات التواصل
 * دون تكرار محتوى الشاشة الرئيسية.
 */
export function ContactScreen() {
  const { t } = useI18n();
  const cs = t.contactScreen;
  return (
    <>
      <PageHero
        badge="CONTACT • CTO-DRS"
        title={cs.title}
        highlight={cs.highlight}
        subtitle={cs.subtitle}
      />

      {/* شريط ضمانات سريع — معلومات فريدة غير مكررة */}
      <section className="px-4 pt-12" aria-label={cs.aria}>
        <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-3">
          {cs.features.map((x, i) => ({ ...x, icon: ICONS[i] })).map((f, i) => (
            <Reveal key={f.t} delay={i * 90}>
              <div className="card-glow flex items-center gap-3 rounded-2xl p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(0,240,255,0.07)] text-cyber">
                  <f.icon className="h-5 w-5" aria-hidden="true" />
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
