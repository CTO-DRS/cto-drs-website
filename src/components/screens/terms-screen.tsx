"use client";

import { Scale, Code2, CreditCard, RefreshCcw, Gavel, BrainCircuit } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

interface TermSection {
  icon: typeof Scale;
  title: string;
  points: string[];
}

const SECTIONS: TermSection[] = [
  {
    icon: Scale,
    title: "١ — قبول الشروط",
    points: [
      "باستخدامك هذا الموقع وخدماته فإنك توافق على هذه الشروط بالكامل.",
      "إذا لم توافق على أي بند، يرجى التوقف عن استخدام المنصة والتواصل معي لمناقشة أي إشكال.",
    ],
  },
  {
    icon: Code2,
    title: "٢ — الخدمات والاستخدام المقبول",
    points: [
      "تشمل الخدمات: تطوير المواقع والتطبيقات، الأمن السيبراني واختبار الاختراق الأخلاقي، والأدوات مفتوحة المصدر.",
      "يُمنع استخدام أي أداة أو معرفة من الموقع في أنشطة غير قانونية أو إيذاء أنظمة لا تملكها.",
      "اختبار الاختراق يُنفَّذ فقط بعد اتفاق كتابي مسبق يحدد النطاق والصلاحيات.",
    ],
  },
  {
    icon: CreditCard,
    title: "٣ — الطلبات والدفع",
    points: [
      "تُعرض الأسعار بالريال السعودي وتكون واضحة قبل إتمام أي طلب.",
      "تُنفَّذ الخدمات بعد تأكيد الطلب والاتفاق على المتطلبات والجدول الزمني.",
      "الدورات والمواد الرقمية المعروضة للأغراض التعليمية — والاستخدام التجاري المباشر يتطلب ترخيصاً.",
    ],
  },
  {
    icon: RefreshCcw,
    title: "٤ — التعديل والاسترجاع",
    points: [
      "للمشاريع البرمجية: مرحلة مراجعة وتعديل مجانية وفق الاتفاق المكتوب قبل التسليم النهائي.",
      "المحتوى الرقمي غير القابل للاسترجاع بعد الوصول الكامل له، وفق ما ينص عليه عرض البيع.",
      "يمكن إلغاء الحجز قبل موعده بـ 24 ساعة على الأقل دون رسوم.",
    ],
  },
  {
    icon: BrainCircuit,
    title: "٥ — الملكية الفكرية",
    points: [
      "الأدوات المنشورة مفتوحة المصدر تخضع لرخصتها المذكورة في مستودعها على GitHub.",
      "أكواد المشاريع المخصصة تُسلَّم للعميل بعد سداد كامل المستحقات وفق العقد.",
      "المحتوى التعليمي والنصوص في الموقع ملك للمنصة — ويُسمح بالمشاركة مع ذكر المصدر.",
    ],
  },
  {
    icon: Gavel,
    title: "٦ — المسؤولية والفصل",
    points: [
      "تُقدَّم الخدمات «كما هي» ولا تتحمل المنصة مسؤولية أي أضرار غير مباشرة ناتجة عن سوء الاستخدام.",
      "إذا بطل أي بند من هذه الشروط تظل بقية البنود سارية المفعول.",
      "تخضع هذه الشروط للأنظمة المعمول بها في المملكة العربية السعودية.",
    ],
  },
];

const LAST_UPDATED = "فبراير 2026";

/** شاشة الشروط والأحكام */
export function TermsScreen() {
  return (
    <>
      <PageHero
        badge="TERMS • LEGAL"
        title="الشروط"
        highlight="والأحكام"
        subtitle="إطار عمل واضح وعادل يحكم استخدام المنصة وتقديم الخدمات — بلغة بشرية مبسطة"
      />

      <section className="px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-6">
            {SECTIONS.map((s, i) => (
              <Reveal key={s.title} delay={i * 70}>
                <article className="card-glow rounded-2xl p-6">
                  <h2 className="flex items-center gap-3 text-base font-bold text-main">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(0,240,255,0.07)] text-cyber">
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
