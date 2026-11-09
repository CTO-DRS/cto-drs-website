"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  GraduationCap,
  PlaySquare,
  Star,
  User,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/screen-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApi } from "@/lib/use-api";
import { useAppRouter } from "@/lib/router";
import type { Course } from "@/lib/types";
import { useI18n, localizeApiCourse } from "@/i18n";

/** 1.2K style compact formatting for large numbers. */
const fmtCount = (n: number) =>
  n >= 1000 ? (n / 1000).toFixed(1) + "K" : n.toLocaleString("en-US");

type SortKey = "popular" | "rating" | "price-asc" | "price-desc";

const ALL = "__all__";
/* قيم المستوى الداخلية تبقى بالعربية (كما في البيانات) — تُترجم عند العرض */
const LEVELS = [ALL, "مبتدئ", "متوسط", "متقدم"] as const;

const SORTS: SortKey[] = ["popular", "rating", "price-asc", "price-desc"];

/** Color-coded level badge styles (allowed palette only). */
const levelStyle = (level: string) => {
  if (level.includes("متقدم"))
    return "border-[rgba(255,42,109,0.35)] bg-[rgba(255,42,109,0.15)] text-[#ff2a6d]";
  if (level.includes("متوسط"))
    return "border-[rgba(255,215,0,0.35)] bg-[rgba(255,215,0,0.15)] text-[#ffd700]";
  return "border-[rgba(0,255,136,0.35)] bg-[rgba(0,255,136,0.15)] text-[#00ff88]";
};

export function CoursesScreen() {
  const { data: rawCourses, loading, error, reload } = useApi<Course[]>("/api/courses");
  const { navigate } = useAppRouter();
  const { t, lang } = useI18n();
  const cs = t.courses;
  const fmtPrice = (n: number) => n.toLocaleString("en-US") + t.meta.currency;
  const courses = useMemo(() => rawCourses?.map((c) => localizeApiCourse(lang, c)), [rawCourses, lang]);
  const [activeCat, setActiveCat] = useState(ALL);
  const [level, setLevel] = useState<string>(ALL);
  useEffect(() => {
    queueMicrotask(() => setActiveCat(ALL));
  }, [lang]);
  const [sort, setSort] = useState<SortKey>("popular");

  const categories = useMemo(() => {
    if (!courses) return [] as string[];
    return Array.from(new Set(courses.map((c) => c.category)));
  }, [courses]);

  const stats = useMemo(() => {
    if (!courses || courses.length === 0) return null;
    const total = courses.length;
    const students = courses.reduce((acc, c) => acc + c.students, 0);
    const avg = courses.reduce((acc, c) => acc + c.rating, 0) / total;
    return { total, students, avg };
  }, [courses]);

  const filtered = useMemo(() => {
    if (!courses) return [] as Course[];
    const list = courses.filter(
      (c) =>
        (activeCat === ALL || c.category === activeCat) &&
        (level === ALL || c.level.includes(level))
    );
    const sorted = [...list].sort((a, b) => {
      switch (sort) {
        case "rating":
          return b.rating - a.rating;
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return b.students - a.students;
      }
    });
    return sorted;
  }, [courses, activeCat, level, sort]);

  return (
    <>
      <PageHero
        badge="COURSES.LAB"
        title={cs.title}
        highlight={cs.highlight}
        subtitle={cs.subtitle}
      />

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
        {/* ── Stats strip ── */}
        {stats && (
          <Reveal className="mb-10 grid gap-4 sm:grid-cols-3">
            <div className="glass flex items-center gap-4 rounded-2xl p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[rgba(0,240,255,0.25)] bg-[rgba(0,240,255,0.08)]">
                <BookOpen className="h-5 w-5 text-cyber" aria-hidden="true" />
              </span>
              <div>
                <p className="font-heading-cyber text-xl font-extrabold text-main">
                  {stats.total.toLocaleString("en-US")}
                </p>
                <p className="text-xs text-mute">{cs.statCourses}</p>
              </div>
            </div>
            <div className="glass flex items-center gap-4 rounded-2xl p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[rgba(0,255,136,0.25)] bg-[rgba(0,255,136,0.08)]">
                <Users className="h-5 w-5 text-[#00ff88]" aria-hidden="true" />
              </span>
              <div>
                <p className="font-heading-cyber text-xl font-extrabold text-main">
                  {fmtCount(stats.students)}
                </p>
                <p className="text-xs text-mute">{cs.statStudents}</p>
              </div>
            </div>
            <div className="glass flex items-center gap-4 rounded-2xl p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[rgba(255,215,0,0.25)] bg-[rgba(255,215,0,0.08)]">
                <Star className="h-5 w-5 fill-[#ffd700] text-[#ffd700]" aria-hidden="true" />
              </span>
              <div>
                <p className="font-heading-cyber text-xl font-extrabold text-main">
                  {stats.avg.toFixed(1)}
                  <span className="text-xs font-bold text-mute"> / 5</span>
                </p>
                <p className="text-xs text-mute">{cs.statRating}</p>
              </div>
            </div>
          </Reveal>
        )}

        {/* ── Filters: category pills + level & sort selects ── */}
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={cs.filterAria}>
            {[ALL, ...categories].map((cat) =>
              activeCat === cat ? (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCat(cat)}
                  className="btn-gradient rounded-full px-4 py-1.5 text-xs font-bold"
                  aria-pressed="true"
                >
                  {cat === ALL ? t.common.all : cat}
                </button>
              ) : (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCat(cat)}
                  className="tag-pill cursor-pointer transition hover:border-[rgba(0,240,255,0.6)] hover:bg-[rgba(0,240,255,0.1)]"
                  aria-pressed="false"
                >
                  {cat === ALL ? t.common.all : cat}
                </button>
              )
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger
                aria-label={cs.levelAria}
                className="h-10 w-[150px] rounded-xl border border-border-strong bg-elev-2/60 text-xs text-main"
              >
                <SelectValue placeholder={cs.levelPh} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border-soft">
                {LEVELS.map((lv) => (
                  <SelectItem key={lv} value={lv} className="text-xs">
                    {lv === ALL ? cs.allLevels : cs.levels[lv] ?? lv}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger
                aria-label={cs.sortAria}
                className="h-10 w-[180px] rounded-xl border border-border-strong bg-elev-2/60 text-xs text-main"
              >
                <SelectValue placeholder={cs.sortPh} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border-soft">
                {SORTS.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {cs.sorts[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="font-mono-cyber ms-auto text-[11px] text-mute" aria-live="polite">
              {cs.count(filtered.length)}
            </span>
          </div>
        </div>

        {/* ── States ── */}
        {loading && <ListSkeleton count={6} />}
        {!loading && error && <ErrorState message={error} onRetry={reload} />}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={GraduationCap}
            title={cs.emptyTitle}
            description={cs.emptyDesc}
            action={
              <button
                type="button"
                onClick={() => {
                  setActiveCat(ALL);
                  setLevel(ALL);
                  setSort("popular");
                }}
                className="btn-gradient rounded-full px-5 py-2 text-xs font-bold"
              >
                {cs.reset}
              </button>
            }
          />
        )}

        {/* ── Courses grid ── */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course, i) => (
              <Reveal key={course.id} delay={i * 60} className="h-full">
                <article className="card-glow group flex h-full flex-col overflow-hidden rounded-2xl">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {course.image ? (
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        sizes="(max-width:768px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[rgba(0,240,255,0.15)] to-[rgba(255,42,109,0.15)]">
                        <GraduationCap className="h-14 w-14 text-cyber" aria-hidden="true" />
                      </div>
                    )}
                    <span
                      className={`absolute start-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm ${levelStyle(course.level)}`}
                    >
                      {cs.levels[course.level] ?? course.level}
                    </span>
                    {course.featured && (
                      <span className="absolute end-3 top-3 flex items-center gap-1 rounded-full border border-[rgba(255,215,0,0.4)] bg-[rgba(255,215,0,0.15)] px-2.5 py-1 text-[10px] font-bold text-[#ffd700] backdrop-blur-sm">
                        <Star className="h-3 w-3 fill-[#ffd700]" aria-hidden="true" />
                        {t.common.featuredF}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-heading-cyber mb-2 text-base font-bold leading-snug text-main">
                      {course.title}
                    </h3>
                    <p className="mb-3 flex items-center gap-1.5 text-xs text-mute">
                      <User className="h-3.5 w-3.5" aria-hidden="true" />
                      {course.instructor}
                    </p>

                    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-mute">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-[#ffd700] text-[#ffd700]" aria-hidden="true" />
                        <span className="font-bold text-main">{course.rating.toFixed(1)}</span>
                      </span>
                      <span aria-hidden="true" className="text-[color:var(--border-strong)]">•</span>
                      <span className="flex items-center gap-1">
                        <PlaySquare className="h-3.5 w-3.5" aria-hidden="true" />
                        {cs.lessons(course.lessons)}
                      </span>
                      <span aria-hidden="true" className="text-[color:var(--border-strong)]">•</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" aria-hidden="true" />
                        {cs.students(fmtCount(course.students))}
                      </span>
                    </div>

                    <div className="mt-auto mb-3 flex items-center justify-between border-t border-border-soft pt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-extrabold text-cyber">
                          {fmtPrice(course.price)}
                        </span>
                        {course.oldPrice ? (
                          <span className="text-xs text-mute line-through">
                            {fmtPrice(course.oldPrice)}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate({ name: "course-detail", slug: course.slug })}
                      className="btn-outline-cyber h-10 w-full rounded-full text-xs font-bold"
                      aria-label={cs.detailsAria(course.title)}
                    >
                      {cs.details}
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
