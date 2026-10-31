"use client";

import { ShieldCheck, Lock, Database, Eye, UserCheck, FileText } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

interface PolicySection {
  icon: typeof Lock;
  title: string;
  points: string[];
}

const SECTIONS: PolicySection[] = [
  {
    icon: Database,
    title: "البيانات التي نجمعها",
    points: [
      "بيانات نموذج التواصل: الاسم، البريد الإلكتروني، رقم الجوال (اختياري)، الدولة، وهدف المراسلة.",
      "بيانات الطلبات والحجوزات المرتبطة بحسابك في المنصة.",
      "بيانات تقنية عامة مثل نوع المتصفح — دون تتبع إعلاني أو ملفات تتبع من أطراف ثالثة.",
    ],
  },
  {
    icon: Eye,
    title: "كيف نستخدم بياناتك",
    points: [
      "الرد على استفساراتك وطلباتك خلال 24 ساعة في أيام العمل.",
      "تنفيذ الطلبات وإدارة الحجوزات وإشعارك بحالتها.",
      "إرسال النشرة البريدية للمشتركين فقط — ويمكنك إلغاء الاشتراك في أي وقت.",
    ],
  },
  {
    icon: Lock,
    title: "حماية المعلومات",
    points: [
      "كلمات المرور مخزنة مشفّرة (Hash) ولا يمكن لأي أحد — بما فيني — قراءتها.",
      "لا تُشارك بياناتك الشخصية مع أي طرف ثالث لأغراض تجارية أو إعلانية.",
      "الوصول إلى بيانات لوحة التحكم مقيّد بحسابات المدير فقط.",
    ],
  },
  {
    icon: UserCheck,
    title: "حقوقك",
    points: [
      "طلب نسخة من بياناتك المحفوظة أو تصحيحها في أي وقت.",
      "طلب حذف حسابك وبياناتك نهائياً عبر صفحة تواصل معي.",
      "إلغاء الاشتراك في النشرة البريدية بضغطة واحدة.",
    ],
  },
  {
    icon: FileText,
    title: "التعديلات على هذه السياسة",
    points: [
      "قد نحدّث هذه السياسة مع تطور المنصة، وسيظهر تاريخ آخر تحديث أدناه.",
      "استخدامك المستمر للموقع بعد التحديث يعني موافقتك على النسخة الأحدث.",
    ],
  },
];

const LAST_UPDATED = "فبراير 2026";

/** شاشة سياسة الخصوصية */
export function PrivacyScreen() {
  return (
    <>
      <PageHero
        badge="PRIVACY • LEGAL"
        title="سياسة"
        highlight="الخصوصية"
        subtitle="نحترم خصوصيتك ونلتزم بحماية بياناتك — هذه السياسة توضح ما نجمعه وكيف نستخدمه"
      />

      <section className="px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="card-glow mb-8 flex items-center gap-4 rounded-2xl p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[rgba(0,255,136,0.08)] text-[#00ff88]">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-bold text-main">التزام واضح</p>
                <p className="text-xs leading-6 text-sec">
                  لا نبيع بياناتك، لا نتتبعك إعلانياً، ولا نجمع أكثر مما نحتاج فعلاً لخدمتك.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-6">
            {SECTIONS.map((s, i) => (
              <Reveal key={s.title} delay={i * 70}>
                <article className="card-glow rounded-2xl p-6">
                  <h2 className="flex items-center gap-3 text-base font-bold text-main">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(0,240,255,0.07)] text-cyber">
                      <s.icon className="h-4.5 w-4.5" />
                    </span>
                    {s.title}
                  </h2>
                  <ul className="mt-4 space-y-2.5">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-sm leading-7 text-sec">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-cyber" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={150}>
            <p className="font-mono-cyber mt-8 text-center text-[11px] tracking-widest text-mute">
              LAST UPDATED • {LAST_UPDATED}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
