"use client";

import Image from "next/image";
import { ArrowLeft, Quote } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import { Counter } from "@/components/counter";
import { SocialRow } from "@/components/social-channels";
import { PROFILE } from "@/lib/data";

const MINI_STATS = [
  { value: 26, suffix: "+", label: "مستودع على GitHub" },
  { value: 14, suffix: "+", label: "تقنية وأداة" },
  { value: 8, suffix: "", label: "مجالات تخصص" },
];

export function ProfileSection() {
  return (
    <section id="about" className="relative px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="PROFILE • 02"
          title="الملف"
          highlight="المهني"
          subtitle="نبذة مختصرة عن مسيرتي في عالم البرمجة والأمن السيبراني"
        />

        <div className="grid items-stretch gap-6 lg:grid-cols-5">
          {/* photo card */}
          <Reveal className="lg:col-span-2">
            <div className="group relative h-80 overflow-hidden rounded-3xl border border-border-soft sm:h-full sm:min-h-[26rem]">
              <Image
                src="/images/profile.jpg"
                alt={PROFILE.fullName}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-heading-cyber text-xl font-bold text-white">{PROFILE.fullName}</h3>
                <p className="font-mono-cyber mt-1 text-[11px] tracking-[0.25em] text-cyber" dir="ltr">
                  SOFTWARE ENGINEER • CYBERSECURITY
                </p>
              </div>
              <span className="glass-strong absolute right-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] text-[#00ff88]">
                <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-[#00ff88]" />
                AVAILABLE
              </span>
            </div>
          </Reveal>

          {/* bio */}
          <Reveal delay={140} className="lg:col-span-3">
            <div className="card-glow relative flex h-full flex-col justify-between gap-8 rounded-3xl p-6 sm:p-8">
              <Quote className="absolute left-6 top-6 h-10 w-10 text-cyber/10" aria-hidden="true" />
              <div>
                <h3 className="font-heading-cyber mb-4 text-xl font-bold text-main">
                  الهوية الرقمية
                </h3>
                <p className="text-sm leading-8 text-sec sm:text-[15px]">{PROFILE.bio1}</p>
                <p className="mt-4 text-sm leading-8 text-sec sm:text-[15px]">
                  {PROFILE.bio2}{" "}
                  <strong className="text-gradient-cyan font-bold" dir="ltr">
                    {PROFILE.philosophy}
                  </strong>
                  .
                </p>
              </div>

              <div>
                <div className="grid grid-cols-3 gap-3">
                  {MINI_STATS.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl border border-border-soft bg-elev-2/60 px-3 py-4 text-center transition hover:border-[rgba(0,240,255,0.3)]"
                    >
                      <p className="font-heading-cyber text-2xl font-extrabold">
                        <Counter value={s.value} suffix={s.suffix} className="text-gradient-static" />
                      </p>
                      <p className="mt-1 text-[11px] text-mute">{s.label}</p>
                    </div>
                  ))}
                </div>
                <a
                  href="#contact"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-[rgba(0,240,255,0.4)] bg-[rgba(0,240,255,0.05)] px-6 text-sm font-bold text-cyber transition hover:bg-[rgba(0,240,255,0.12)] hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                >
                  اقرأ السيرة الكاملة
                  <ArrowLeft className="h-4 w-4" />
                </a>
                <div className="mt-5 border-t border-border-soft pt-5">
                  <p className="mb-3 text-[11px] text-mute">تابعني على منصات التواصل</p>
                  <SocialRow />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
