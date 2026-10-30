"use client";

import { Send, ListChecks } from "lucide-react";
import { Reveal } from "@/components/reveal";

export function CtaSection() {
  return (
    <section id="contact" className="relative px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="animate-border-run relative overflow-hidden rounded-[2rem] p-[1.5px]" style={{ background: "linear-gradient(120deg, #00f0ff, #7c3aed, #ff2a6d, #00f0ff)" }}>
            <div className="relative rounded-[calc(2rem-1.5px)] bg-elev px-6 py-14 text-center sm:px-12 sm:py-20">
              <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
              <div className="relative">
                <h2 className="font-heading-cyber text-3xl font-extrabold sm:text-4xl">
                  جاهز لبدء <span className="text-gradient-static">مشروعك القادم؟</span>
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-sec sm:text-base">
                  سواء كنت تحتاج إلى موقع احترافي، نظام متكامل، أو استشارة أمنية — أنا هنا لتحويل
                  أفكارك إلى حلول رقمية تعمل بثبات وأمان.
                </p>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                  <a href="#contact-form" className="btn-gradient flex h-12 items-center gap-2 rounded-full px-8 text-sm">
                    <Send className="h-4 w-4" />
                    تواصل معي الآن
                  </a>
                  <a
                    href="#services"
                    className="flex h-12 items-center gap-2 rounded-full border border-border-strong bg-elev-2/40 px-8 text-sm font-bold text-sec transition hover:border-[rgba(0,240,255,0.4)] hover:text-cyber"
                  >
                    <ListChecks className="h-4 w-4" />
                    استعرض الخدمات
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
