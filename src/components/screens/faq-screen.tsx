"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  CreditCard,
  HelpCircle,
  Info,
  LifeBuoy,
  MessageCircle,
  Search,
  SearchX,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { EmptyState } from "@/components/screen-state";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAppRouter } from "@/lib/router";

/* ─────────── data ─────────── */

type FaqCat = "عام" | "الخدمات" | "الدفع" | "الدعم";

interface FaqEntry {
  q: string;
  a: string;
  cat: FaqCat;
}

const FAQS: FaqEntry[] = [
  {
    cat: "عام",
    q: "كم تستغرق مدة تنفيذ المشاريع؟",
    a: "تعتمد المدة على حجم المشروع وتعقيده؛ الموقع التعريفي يستغرق عادة من 5 إلى 10 أيام عمل، بينما تستغرق الأنظمة المتكاملة والتطبيقات المخصصة من 4 إلى 12 أسبوعاً. نقدّم لك جدولاً زمنياً واضحاً بمراحل محددة قبل بدء التنفيذ، ونلتزم به.",
  },
  {
    cat: "عام",
    q: "كيف أبدأ مشروعاً جديداً معكم؟",
    a: "تواصل معنا عبر صفحة التواصل أو احجز استشارة مجانية؛ نناقش فكرتك ونحدد المتطلبات بدقة، ثم نرسل لك عرضاً فنياً ومالياً مفصلاً خلال 48 ساعة، وبعد موافقتك يبدأ فريق العمل فوراً.",
  },
  {
    cat: "عام",
    q: "ما التقنيات التي تستخدمونها في العمل؟",
    a: "نعتمد أحدث التقنيات: Next.js وReact للواجهات، وNode.js مع قواعد بيانات حديثة للخلفية، إلى جانب أدوات اختبار الاختراق المتقدمة مثل Burp Suite وMetasploit. نختار دائماً الحزمة التقنية الأنسب لطبيعة مشروعك وأهدافه.",
  },
  {
    cat: "الخدمات",
    q: "كيف تضمنون جودة المشاريع المُسلَّمة؟",
    a: "نتبع منهجية صارمة تشمل مراجعات كود أسبوعية، واختبارات آلية ويدوية (Unit & E2E)، ومراجعة أمنية شاملة قبل التسليم، مع بيئة تجريبية تتابع فيها التقدم أولاً بأول وتراجع كل مرحلة قبل الانتقال للتالية.",
  },
  {
    cat: "الخدمات",
    q: "هل توقّعون اتفاقيات سرية وعدم إفصاح (NDA)؟",
    a: "نعم، نوقّع اتفاقية NDA قبل أي اجتماع تفصيلي، وتُخزَّن جميع بيانات العميل بسرية تامة عبر قنوات مشفّرة، ولا يُذكر اسمك أو تفاصيل مشروعك في أي مكان دون إذن خطي مسبق منك.",
  },
  {
    cat: "الخدمات",
    q: "ما الذي يشمله الضمان بعد التسليم؟",
    a: "يشمل الضمان إصلاح أي عيوب برمجية مجاناً لمدة 30 يوماً بعد التسليم، إلى جانب دعم فني عبر البريد والتواصل المباشر لضمان استقرار المشروع بشكل كامل في بيئة الإنتاج.",
  },
  {
    cat: "الدفع",
    q: "ما طرق الدفع المتاحة ونظام الدفعات؟",
    a: "نقبل التحويل البنكي وبوابات الدفع الإلكتروني. تعمل المشاريع بنظام دفعات مرنة: 40% عند بدء التنفيذ، 30% عند تسليم النسخة الأولى، و30% عند التسليم النهائي. أما المشاريع الصغيرة فتُقسم 50/50.",
  },
  {
    cat: "الدفع",
    q: "هل تصدرون فواتير رسمية معتمدة؟",
    a: "نعم، نصدر فاتورة ضريبية رسمية لكل عملية دفع وتصلك إلكترونياً فوراً، مع إمكانية إصدار مستندات إضافية تحتاجها شركتك لأغراض المحاسبة والمراجعة.",
  },
  {
    cat: "الدفع",
    q: "ما سياسة الاسترجاع أو إلغاء المشروع؟",
    a: "يمكنك إلغاء المشروع في أي وقت؛ تُحسب قيمة الأعمال المنجزة فعلياً حتى تاريخ الإلغاء ويُسترد الفرق المتبقي تلقائياً خلال 7 أيام عمل — دون أي رسوم خفية أو شروط معقدة.",
  },
  {
    cat: "الدعم",
    q: "هل تقدمون دعماً فنياً بعد التسليم؟",
    a: "نعم، كل مشروع يأتي مع دعم فني مجاني لمدة 30 يوماً بعد التسليم، وتتوفر بعدها عقود دعم شهرية مرنة تشمل المراقبة المستمرة والتحديثات والاستجابة السريعة للحالات الطارئة.",
  },
  {
    cat: "الدعم",
    q: "ماذا يشمل عقد الصيانة الشهرية؟",
    a: "يشمل النسخ الاحتياطي التلقائي الدوري، وتحديث الحزم والثغرات الأمنية، ومراقبة الأداء والأمان على مدار الساعة، وتقريراً شهرياً مفصلاً، مع ساعات تطوير إضافية يمكن استخدامها عند الحاجة.",
  },
  {
    cat: "الدعم",
    q: "كيف تتم اجتماعات المتابعة خلال التنفيذ؟",
    a: "نعقد اجتماع متابعة أسبوعياً عبر مكالمة فيديو نعرض فيه التقدم المحرز والمرحلة القادمة، ويصلك بعده تقرير مكتوب، ويمكنك متابعة المهام لحظياً عبر لوحة إدارة المشروع في أي وقت.",
  },
];

const CATEGORIES: { name: FaqCat; icon: LucideIcon }[] = [
  { name: "عام", icon: Info },
  { name: "الخدمات", icon: Wrench },
  { name: "الدفع", icon: CreditCard },
  { name: "الدعم", icon: LifeBuoy },
];

/* ─────────── screen ─────────── */

export function FaqScreen() {
  const { navigate } = useAppRouter();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<"الكل" | FaqCat>("الكل");

  const filtered = useMemo(() => {
    const q = query.trim();
    return FAQS.filter((f) => {
      const matchCat = activeCat === "الكل" || f.cat === activeCat;
      const matchQuery = !q || f.q.includes(q) || f.a.includes(q);
      return matchCat && matchQuery;
    });
  }, [query, activeCat]);

  const grouped = useMemo(
    () =>
      CATEGORIES.map(({ name, icon }) => ({
        name,
        icon,
        items: filtered.filter((f) => f.cat === name),
      })).filter((g) => g.items.length > 0),
    [filtered]
  );

  const pillCls = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-xs font-bold transition ${
      active
        ? "border-[rgba(0,240,255,0.55)] bg-[rgba(0,240,255,0.12)] text-cyber shadow-[0_0_14px_rgba(0,240,255,0.15)]"
        : "border-border-soft text-sec hover:border-[rgba(0,240,255,0.4)] hover:text-cyber"
    }`;

  return (
    <>
      <PageHero
        badge="FAQ.CENTER"
        title="الأسئلة"
        highlight="الشائعة"
        subtitle="كل ما تحتاج معرفته عن الخدمات، آلية العمل، الدفع والدعم — بإجابات مباشرة"
      />

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
        {/* ── toolbar ── */}
        <Reveal>
          <div className="mb-10 flex flex-col gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative max-w-md flex-1">
                <Search
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ابحث في الأسئلة والإجابات..."
                  aria-label="ابحث في الأسئلة الشائعة"
                  className="h-11 w-full rounded-xl border border-border-strong bg-elev-2/60 pr-11 pl-4 text-sm outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.15)]"
                />
              </div>
              <p className="font-mono-cyber shrink-0 text-xs text-mute" aria-live="polite">
                النتائج: {filtered.length} من {FAQS.length}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="تصفية حسب التصنيف">
              {(["الكل", ...CATEGORIES.map((c) => c.name)] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCat(cat)}
                  aria-pressed={activeCat === cat}
                  className={pillCls(activeCat === cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── faq groups ── */}
        {filtered.length === 0 ? (
          <Reveal>
            <EmptyState
              icon={SearchX}
              title="لا توجد أسئلة مطابقة"
              description="لم نجد سؤالاً يحتوي على كلمة البحث — جرّب كلمات أخرى أو أعد تعيين التصفية."
              action={
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setActiveCat("الكل");
                  }}
                  className="btn-outline-cyber rounded-full px-6 py-2.5 text-xs font-bold"
                >
                  إعادة تعيين البحث
                </button>
              }
            />
          </Reveal>
        ) : (
          <div className="space-y-10">
            {grouped.map(({ name, icon: CatIcon, items }, gi) => (
              <Reveal key={name} delay={gi * 80}>
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(0,240,255,0.25)] bg-[rgba(0,240,255,0.07)]">
                    <CatIcon className="h-4 w-4 text-cyber" aria-hidden="true" />
                  </span>
                  <h2 className="font-heading-cyber text-lg font-bold text-main">{name}</h2>
                  <span className="tag-pill">{items.length} أسئلة</span>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {items.map((f, i) => {
                    const value = `${name}-${i}`;
                    return (
                      <AccordionItem
                        key={value}
                        value={value}
                        className="card-glow hover:transform-none! mb-3 rounded-xl px-5"
                      >
                        <AccordionTrigger className="hover:no-underline text-right">
                          <span className="flex items-center gap-3">
                            <HelpCircle
                              className="h-4 w-4 shrink-0 text-cyber"
                              aria-hidden="true"
                            />
                            <span className="text-sm font-bold text-main">{f.q}</span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pr-7 text-sm leading-7 text-sec">
                          {f.a}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </Reveal>
            ))}
          </div>
        )}

        {/* ── CTA ── */}
        <Reveal delay={120}>
          <div className="glass mt-14 rounded-2xl p-8 text-center md:p-10">
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(255,42,109,0.3)] bg-[rgba(255,42,109,0.08)]">
              <MessageCircle className="h-6 w-6 text-[#ff2a6d]" aria-hidden="true" />
            </span>
            <h2 className="font-heading-cyber text-2xl font-bold text-main">
              لم تجد إجابتك؟
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-sec">
              فريقنا جاهز للرد على كل استفساراتك — راسلنا مباشرة أو احجز استشارة مجانية
              وسنعود إليك خلال ساعات العمل.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate({ name: "contact" })}
                className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm"
              >
                تواصل معنا
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => navigate({ name: "booking" })}
                className="btn-outline-cyber inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold"
              >
                <CalendarClock className="h-4 w-4" aria-hidden="true" />
                احجز استشارة
              </button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
