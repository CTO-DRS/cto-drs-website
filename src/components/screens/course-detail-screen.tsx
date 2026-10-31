"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Clock,
  GraduationCap,
  Heart,
  Lock,
  PlaySquare,
  Search,
  Star,
  User,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { EmptyState, ErrorState, ScreenLoader } from "@/components/screen-state";
import { useAppRouter } from "@/lib/router";
import { useApi } from "@/lib/use-api";
import { toast } from "@/hooks/use-toast";
import type { Course } from "@/lib/types";

const fmtPrice = (n: number) => n.toLocaleString("en-US") + " ر.س";

/** 1.2K style compact formatting for large numbers. */
const fmtCount = (n: number) =>
  n >= 1000 ? (n / 1000).toFixed(1) + "K" : n.toLocaleString("en-US");

/** Color-coded level badge styles (allowed palette only). */
const levelStyle = (level: string) => {
  if (level.includes("متقدم"))
    return "border-[rgba(255,42,109,0.35)] bg-[rgba(255,42,109,0.15)] text-[#ff2a6d]";
  if (level.includes("متوسط"))
    return "border-[rgba(255,215,0,0.35)] bg-[rgba(255,215,0,0.15)] text-[#ffd700]";
  return "border-[rgba(0,255,136,0.35)] bg-[rgba(0,255,136,0.15)] text-[#00ff88]";
};

/** Lesson plans per course category (fallback to a generic plan). */
const LESSONS_BY_CATEGORY: Record<string, string[]> = {
  "تطوير الويب": [
    "تهيئة بيئة العمل وأساسيات HTML5 و CSS3 الحديثة",
    "بناء واجهات تفاعلية باستخدام JavaScript و TypeScript",
    "مكوّنات React القابلة لإعادة الاستخدام والتصميم المتجاوب",
    "إدارة الحالة والتوجيه بين الصفحات (Routing)",
    "الاتصال بواجهات REST API وقواعد البيانات",
    "نشر المشروع على الإنترنت ومراجعة نهائية شاملة",
  ],
  "الأمن السيبراني": [
    "مقدمة في أمن المعلومات ونماذج التهديد الحديثة",
    "أساسيات الشبكات وتحليل حزم البيانات عملياً",
    "اختبار اختراق تطبيقات الويب (OWASP Top 10)",
    "هندسة اجتماعية وتقنيات التصيّد وكيفية الصد عنها",
    "أدوات Kali Linux و Metasploit في سيناريوهات حقيقية",
    "كتابة تقرير الاختبار وخطة تأمين الأنظمة",
  ],
  "البرمجة": [
    "تثبيت الأدوات وكتابة أول برنامج لك خطوة بخطوة",
    "المتغيرات والأنواع والعمليات المنطقية",
    "الشروط والحلقات وبناء الوظائف (Functions)",
    "هياكل البيانات: القوائم والقواميس والمجموعات",
    "البرمجة كائنية التوجه OOP مع مشاريع مصغّرة",
    "مشروع ختامي شامل ومراجعة مفاهيم الدورة",
  ],
};

const GENERIC_LESSONS: string[] = [
  "مقدمة شاملة: نظرة عامة على المسار والأهداف",
  "تهيئة الأدوات وبيئة العمل الاحترافية",
  "المفاهيم الأساسية مع تطبيقات عملية مباشرة",
  "المستوى المتوسط: سيناريوهات من سوق العمل الحقيقي",
  "مشاريع تطبيقية تبني معرض أعمالك",
  "مشروع ختامي وخطتك بعد إتمام الدورة",
];

const lessonsFor = (category: string): string[] =>
  LESSONS_BY_CATEGORY[category] ?? GENERIC_LESSONS;

/** 6 personalized learning outcomes derived from the course title. */
const benefitsFor = (title: string): string[] => [
  `إتقان أساسيات «${title}» من الصفر حتى الاحتراف دون خبرة سابقة`,
  `مشاريع عملية داخل «${title}» تبني لك معرض أعمال حقيقي`,
  "فهم عميق للأدوات الحديثة المطلوبة فعلياً في سوق العمل",
  "مهارات حل المشكلات وقراءة الأخطاء وتشخيصها باحترافية",
  "أفضل الممارسات الأمنية عند بناء أي تطبيق أو نظام",
  "شهادة إتمام معتمدة تضيفها إلى سيرتك الذاتية وملفك المهني",
];

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <span className="flex items-center gap-0.5" aria-label={`التقييم ${rating} من 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`h-3.5 w-3.5 ${i < filled ? "fill-[#ffd700] text-[#ffd700]" : "text-mute"}`}
        />
      ))}
    </span>
  );
}

export function CourseDetailScreen() {
  const { route, navigate, back } = useAppRouter();
  const slug = route.slug;
  const { data: courses, loading, error, reload } = useApi<Course[]>(
    slug ? "/api/courses" : null
  );

  const course = courses?.find((c) => c.slug === slug) ?? null;

  const backBtn = (
    <button
      onClick={() => navigate({ name: "courses" })}
      className="mb-8 inline-flex items-center gap-2 rounded-full border border-border-strong px-4 py-2 text-xs font-bold text-sec transition hover:border-[rgba(0,240,255,0.4)] hover:text-cyber"
    >
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
      عودة لكل الدورات
    </button>
  );

  /* ── No slug in route ── */
  if (!slug) {
    return (
      <>
        <PageHero
          badge="COURSES.LAB"
          title="تفاصيل"
          highlight="الدورة"
          subtitle="استعرض منهج الدورة كاملاً واحجز مقعدك في دقائق"
        />
        <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
          {backBtn}
          <EmptyState
            icon={Search}
            title="لم يتم تحديد دورة"
            description="يبدو أن رابط الدورة غير مكتمل — اختر دورة من قائمة الأكاديمية للمتابعة."
            action={
              <button
                onClick={() => navigate({ name: "courses" })}
                className="btn-gradient rounded-full px-5 py-2 text-xs font-bold"
              >
                استعرض الدورات
              </button>
            }
          />
        </section>
      </>
    );
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <PageHero
          badge="COURSES.LAB"
          title="تفاصيل"
          highlight="الدورة"
          subtitle="استعرض منهج الدورة كاملاً واحجز مقعدك في دقائق"
        />
        <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
          {backBtn}
          <ScreenLoader label="جارٍ تحميل الدورة..." />
        </section>
      </>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <>
        <PageHero
          badge="COURSES.LAB"
          title="تفاصيل"
          highlight="الدورة"
          subtitle="استعرض منهج الدورة كاملاً واحجز مقعدك في دقائق"
        />
        <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
          {backBtn}
          <ErrorState message={error} onRetry={reload} />
        </section>
      </>
    );
  }

  /* ── Not found ── */
  if (!course) {
    return (
      <>
        <PageHero
          badge="COURSES.LAB"
          title="تفاصيل"
          highlight="الدورة"
          subtitle="استعرض منهج الدورة كاملاً واحجز مقعدك في دقائق"
        />
        <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
          {backBtn}
          <EmptyState
            icon={Search}
            title="الدورة غير موجودة"
            description="قد يكون الرابط قديماً أو حُذفت الدورة — تصفّح أحدث دورات الأكاديمية."
            action={
              <button
                onClick={() => back()}
                className="btn-gradient rounded-full px-5 py-2 text-xs font-bold"
              >
                رجوع
              </button>
            }
          />
        </section>
      </>
    );
  }

  const discount =
    course.oldPrice && course.oldPrice > course.price
      ? Math.round((1 - course.price / course.oldPrice) * 100)
      : 0;

  const lessons = lessonsFor(course.category).slice(0, 6);
  const benefits = benefitsFor(course.title);
  const initials = course.instructor
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join(" ");

  const related = (courses ?? [])
    .filter((c) => c.id !== course.id && c.category === course.category)
    .slice(0, 3);

  const bookSeat = () => {
    try {
      sessionStorage.setItem("cto-drs-booking-service", `دورة: ${course.title}`);
    } catch {
      /* storage unavailable */
    }
    toast({
      title: "تم تثبيت الدورة",
      description: `أكمل بيانات الحجز لدورة: ${course.title}`,
    });
    navigate({ name: "booking" });
  };

  const addToFavorites = () => {
    toast({ title: "أُضيفت إلى المفضلة", description: course.title });
  };

  return (
    <>
      <PageHero
        badge="COURSES.LAB"
        title="تفاصيل"
        highlight="الدورة"
        subtitle="استعرض منهج الدورة كاملاً واحجز مقعدك في دقائق"
      />

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
        {backBtn}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ═══ Main column ═══ */}
          <div className="lg:col-span-2">
            {/* Banner */}
            <div className="relative aspect-[16/8] overflow-hidden rounded-2xl border border-border-soft">
              {course.image ? (
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  sizes="(max-width:1024px) 100vw, 66vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[rgba(0,240,255,0.15)] to-[rgba(255,42,109,0.15)]">
                  <GraduationCap className="h-16 w-16 text-cyber" aria-hidden="true" />
                </div>
              )}
              <span
                className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-[11px] font-bold backdrop-blur-sm ${levelStyle(course.level)}`}
              >
                {course.level}
              </span>
              {course.featured && (
                <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full border border-[rgba(255,215,0,0.4)] bg-[rgba(255,215,0,0.15)] px-3 py-1 text-[11px] font-bold text-[#ffd700] backdrop-blur-sm">
                  <Star className="h-3 w-3 fill-[#ffd700]" aria-hidden="true" />
                  مميزة
                </span>
              )}
            </div>

            {/* Title + meta */}
            <h1 className="font-heading-cyber mt-6 text-3xl font-extrabold leading-tight text-main lg:text-4xl">
              {course.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-mute">
              <span className="flex items-center gap-1.5">
                <Stars rating={course.rating} />
                <span className="font-bold text-main">{course.rating.toFixed(1)}</span>
              </span>
              <span aria-hidden="true" className="text-[color:var(--border-strong)]">•</span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                {fmtCount(course.students)} طالب
              </span>
              <span aria-hidden="true" className="text-[color:var(--border-strong)]">•</span>
              <span className="flex items-center gap-1.5">
                <PlaySquare className="h-3.5 w-3.5" aria-hidden="true" />
                {course.lessons.toLocaleString("en-US")} درساً
              </span>
              <span aria-hidden="true" className="text-[color:var(--border-strong)]">•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {course.durationHours.toLocaleString("en-US")} ساعة
              </span>
              <span aria-hidden="true" className="text-[color:var(--border-strong)]">•</span>
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" aria-hidden="true" />
                {course.instructor}
              </span>
            </div>

            {/* Description */}
            <p className="mt-5 text-sm leading-8 text-sec sm:text-base">
              {course.description}
            </p>

            {/* What you'll learn */}
            <div className="card-glow mt-8 rounded-2xl p-6">
              <h2 className="font-heading-cyber mb-5 flex items-center gap-2 text-lg font-bold text-main">
                <span className="h-4 w-1 rounded-full bg-cyber" aria-hidden="true" />
                ماذا ستتعلم؟
              </h2>
              <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5">
                    <Check
                      className="mt-1 h-4 w-4 shrink-0 text-[#00ff88]"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-6 text-sec">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Curriculum */}
            <div className="card-glow mt-6 rounded-2xl p-6">
              <h2 className="font-heading-cyber mb-5 flex items-center gap-2 text-lg font-bold text-main">
                <span className="h-4 w-1 rounded-full bg-cyber" aria-hidden="true" />
                المحتوى الدراسي
              </h2>
              <div className="space-y-2">
                {lessons.map((lesson, i) => {
                  const locked = i >= lessons.length - 2;
                  return (
                    <div
                      key={lesson}
                      className="flex items-center gap-3 rounded-xl border border-border-soft bg-elev-2/40 px-4 py-3"
                    >
                      <span
                        className="font-mono-cyber flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[rgba(0,240,255,0.25)] bg-[rgba(0,240,255,0.06)] text-xs font-bold text-cyber"
                        aria-hidden="true"
                      >
                        {(i + 1).toLocaleString("en-US").padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-sm leading-6 text-main">{lesson}</span>
                      {locked ? (
                        <span className="flex shrink-0 items-center gap-1.5 text-[10px] text-mute">
                          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                          متاح بعد التسجيل
                        </span>
                      ) : (
                        <span className="font-mono-cyber shrink-0 text-[10px] text-[#00ff88]">
                          مجاني
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instructor */}
            <div className="card-glow mt-6 rounded-2xl p-6">
              <h2 className="font-heading-cyber mb-5 flex items-center gap-2 text-lg font-bold text-main">
                <span className="h-4 w-1 rounded-full bg-cyber" aria-hidden="true" />
                عن المدرب
              </h2>
              <div className="flex items-start gap-4">
                <span
                  className="font-heading-cyber flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[rgba(0,240,255,0.3)] bg-gradient-to-br from-[rgba(0,240,255,0.2)] to-[rgba(255,42,109,0.2)] text-lg font-extrabold text-cyber"
                  aria-hidden="true"
                >
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="font-heading-cyber text-base font-bold text-main">
                    {course.instructor}
                  </p>
                  <p className="font-mono-cyber mt-0.5 text-xs text-cyber">
                    مدرب معتمد — CTO-DRS Academy
                  </p>
                  <p className="mt-2 text-sm leading-7 text-sec">
                    {course.instructor} مهندس برمجيات وخبير في مجال{" "}
                    {course.category}، بخبرة عملية تمتد لأكثر من عشر سنوات في بناء
                    الأنظمة الإنتاجية وتدريب المطورين داخل المنطقة العربية.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ Sidebar ═══ */}
          <aside className="lg:col-span-1">
            <div className="card-glow rounded-2xl p-6 lg:sticky lg:top-24">
              {discount > 0 && (
                <span className="mb-3 inline-flex items-center rounded-full border border-[rgba(255,215,0,0.4)] bg-[rgba(255,215,0,0.12)] px-2.5 py-1 text-[10px] font-bold text-[#ffd700]">
                  وفّر {discount.toLocaleString("en-US")}%
                </span>
              )}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-cyber">
                  {fmtPrice(course.price)}
                </span>
                {course.oldPrice ? (
                  <span className="text-sm text-mute line-through">
                    {fmtPrice(course.oldPrice)}
                  </span>
                ) : null}
              </div>
              <p className="mt-1.5 text-xs text-mute">دفعة واحدة — وصول فوري بعد التسجيل</p>

              <div className="my-5 h-px bg-[color:var(--border-soft)]" aria-hidden="true" />

              <ul className="space-y-3">
                {[
                  "وصول مدى الحياة",
                  "شهادة إتمام معتمدة",
                  "دعم فني مباشر",
                  "تحديثات مجانية",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-sec">
                    <Check className="h-4 w-4 shrink-0 text-[#00ff88]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={bookSeat}
                className="btn-gradient mt-6 h-12 w-full rounded-xl text-sm"
                aria-label={`احجز مقعدك في دورة ${course.title}`}
              >
                احجز مقعدك الآن
              </button>
              <button
                onClick={addToFavorites}
                className="btn-outline-cyber mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold"
              >
                <Heart className="h-4 w-4" aria-hidden="true" />
                أضف إلى المفضلة
              </button>
            </div>
          </aside>
        </div>

        {/* ═══ Related courses ═══ */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-heading-cyber mb-5 flex items-center gap-2 text-xl font-bold text-main">
              <span className="h-5 w-1 rounded-full bg-cyber" aria-hidden="true" />
              دورات ذات صلة
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((rel, i) => (
                <Reveal key={rel.id} delay={i * 60} className="h-full">
                  <button
                    onClick={() => navigate({ name: "course-detail", slug: rel.slug })}
                    className="card-glow group flex h-full w-full items-center gap-3 rounded-2xl p-3 text-right"
                    aria-label={`الدورة: ${rel.title}`}
                  >
                    <span className="relative block h-16 w-24 shrink-0 overflow-hidden rounded-xl">
                      {rel.image ? (
                        <Image
                          src={rel.image}
                          alt={rel.title}
                          fill
                          sizes="96px"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[rgba(0,240,255,0.15)] to-[rgba(255,42,109,0.15)]">
                          <GraduationCap
                            className="h-6 w-6 text-cyber"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-main">
                        {rel.title}
                      </span>
                      <span className="mt-1 block text-xs font-bold text-cyber">
                        {fmtPrice(rel.price)}
                      </span>
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
