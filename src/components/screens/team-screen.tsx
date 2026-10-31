"use client";

import { Code2, ShieldCheck, Palette, LifeBuoy } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { useAppRouter } from "@/lib/router";
import { SocialRow } from "@/components/social-channels";

const ROLES = [
  {
    icon: Code2,
    title: "التطوير الكامل (Full-Stack)",
    desc: "بناء واجهات حديثة وأنظمة خلفية قوية بقواعد بيانات محسّنة",
    color: "#00f0ff",
  },
  {
    icon: ShieldCheck,
    title: "الأمن السيبراني",
    desc: "اختبار اختراق أخلاقي، تحصين الأنظمة، ومراجعة أمنية شاملة",
    color: "#ff2a6d",
  },
  {
    icon: Palette,
    title: "تجربة المستخدم والتصميم",
    desc: "واجهات Cyber عصرية سريعة ومتجاوبة تضع المستخدم أولاً",
    color: "#7c3aed",
  },
  {
    icon: LifeBuoy,
    title: "الدعم والصيانة",
    desc: "متابعة بعد التسليم، إصلاحات سريعة، وتحديثات مستمرة",
    color: "#00ff88",
  },
];

/** شاشة الفريق والعمل — تعريف بمن يقف خلف المنصة */
export function TeamScreen() {
  const { navigate } = useAppRouter();

  return (
    <>
      <PageHero
        badge="TEAM • BEHIND THE CODE"
        title="من"
        highlight="خلف المنصة"
        subtitle="مطور واحد بشغف كبير — بجودة فريق كامل، ومعايير هندسية صارمة"
      />

      <section className="px-4 py-14">
        <div className="mx-auto max-w-5xl">
          {/* بطاقة تعريف رئيسية */}
          <Reveal>
            <div className="card-glow flex flex-col items-center gap-6 rounded-3xl p-8 text-center sm:flex-row sm:p-10 sm:text-right">
              <span className="font-heading-cyber flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-[#00f0ff] via-[#7c3aed] to-[#ff2a6d] text-2xl font-extrabold text-[#030303] shadow-[0_0_35px_rgba(0,240,255,0.35)]">
                CD
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-heading-cyber text-2xl font-extrabold">
                  <span className="text-gradient-cyan">CTO</span>
                  <span className="text-main">-</span>
                  <span className="text-gradient-pink">DRS</span>
                </h2>
                <p className="mt-2 text-sm leading-7 text-sec">
                  مهندس برمجيات ومختبر اختراق أخلاقي — أبني حلولاً تقنية آمنة وقابلة للصيانة،
                  وأشارك معرفتي مع المجتمع العربي عبر الدورات والمحتوى المفتوح.
                </p>
                <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row">
                  <Button onClick={() => navigate({ name: "contact" })} className="btn-gradient h-10 rounded-full px-6 text-xs">
                    تواصل معي
                  </Button>
                  <SocialRow size="sm" />
                </div>
              </div>
            </div>
          </Reveal>

          {/* الأدوار */}
          <h3 className="font-heading-cyber mt-12 mb-5 text-center text-lg font-bold text-main">
            ماذا أفعل؟
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {ROLES.map((r, i) => (
              <Reveal key={r.title} delay={i * 80}>
                <div className="card-glow flex h-full gap-4 rounded-2xl p-5">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${r.color}14`, color: r.color }}
                  >
                    <r.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-main">{r.title}</p>
                    <p className="mt-1 text-xs leading-6 text-sec">{r.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* مبادئ العمل */}
          <Reveal delay={200}>
            <div className="card-glow mt-10 rounded-2xl p-6">
              <p className="font-mono-cyber text-[10px] tracking-[0.25em] text-cyber" dir="ltr">
                $ cat principles.md
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-sec">
                <li>🔐 الأمان أولاً — كل مشروع يُبنى من اليوم الأول بعقلية اختراق.</li>
                <li>📦 كود نظيف وموثّق — يفهمه أي مطور يأتي بعدي.</li>
                <li>🤝 شفافية كاملة — ترى التقدم أولاً بأول ولا مفاجآت في الفاتورة.</li>
                <li>🌍 عطاء للمجتمع — ما أتعلمه أعيده للناس بأدوات ومحتوى مجاني.</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
