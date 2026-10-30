"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Code2, ExternalLink, Github, Search, Star } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/screen-state";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApi } from "@/lib/use-api";
import type { Project } from "@/lib/types";

export function ProjectsScreen() {
  const { data: projects, loading, error, reload } = useApi<Project[]>("/api/projects");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Project | null>(null);

  const categories = useMemo(() => {
    if (!projects) return [] as string[];
    return Array.from(new Set(projects.map((p) => p.category)));
  }, [projects]);

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!projects) return [] as Project[];
    return projects.filter((p) => {
      const inCat = activeCategory === "الكل" || p.category === activeCategory;
      if (!inCat) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [projects, activeCategory, q]);

  const resetFilters = () => {
    setActiveCategory("الكل");
    setQuery("");
  };

  return (
    <>
      <PageHero
        badge="PROJECTS.ARCHIVE"
        title="سجل"
        highlight="المشاريع"
        subtitle="مجموعة مختارة من المشاريع المنجزة — من المتاجر الإلكترونية إلى أنظمة الأمن والذكاء الاصطناعي"
      />

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
        {/* ── Toolbar: search + category pills ── */}
        <div className="mb-8 flex flex-col gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن مشروع، تقنية أو وسم..."
              aria-label="ابحث في المشاريع"
              className="h-11 w-full rounded-xl border border-border-strong bg-elev-2/60 px-4 pr-11 text-sm outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.15)]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="تصفية المشاريع حسب التصنيف">
            {["الكل", ...categories].map((cat) =>
              activeCategory === cat ? (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="btn-gradient rounded-full px-4 py-1.5 text-xs font-bold"
                  aria-pressed="true"
                >
                  {cat}
                </button>
              ) : (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="tag-pill cursor-pointer transition hover:border-[rgba(0,240,255,0.6)] hover:bg-[rgba(0,240,255,0.1)]"
                  aria-pressed="false"
                >
                  {cat}
                </button>
              )
            )}
            <span className="font-mono-cyber mr-auto text-[11px] text-mute">
              {filtered.length} مشروع
            </span>
          </div>
        </div>

        {/* ── States ── */}
        {loading && <ListSkeleton count={6} />}
        {!loading && error && <ErrorState message={error} onRetry={reload} />}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={Search}
            title="لا توجد نتائج مطابقة"
            description="لم نعثر على مشاريع تطابق بحثك — جرّب كلمة أخرى أو أعد ضبط الفلاتر."
            action={
              <button
                onClick={resetFilters}
                className="btn-gradient rounded-full px-5 py-2 text-xs font-bold"
              >
                إعادة ضبط الفلاتر
              </button>
            }
          />
        )}

        {/* ── Projects grid ── */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, i) => (
              <Reveal key={project.id} delay={i * 60} className="h-full">
                <article className="card-glow group flex h-full flex-col overflow-hidden rounded-2xl">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width:768px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[rgba(0,240,255,0.15)] to-[rgba(255,42,109,0.15)]">
                        <Code2 className="h-14 w-14 text-cyber" aria-hidden="true" />
                      </div>
                    )}
                    <span className="font-mono-cyber glass-strong absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold text-main">
                      {project.year}
                    </span>
                    {project.featured && (
                      <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-[rgba(255,215,0,0.4)] bg-[rgba(255,215,0,0.15)] px-2.5 py-1 text-[10px] font-bold text-[#ffd700]">
                        <Star className="h-3 w-3 fill-[#ffd700]" aria-hidden="true" />
                        مميز
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-heading-cyber mb-2 text-base font-bold leading-snug text-main">
                      {project.title}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-sm leading-6 text-sec">
                      {project.description}
                    </p>

                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="tag-pill">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-border-soft pt-4">
                      <span className="tag-pill">{project.category}</span>
                      <div className="flex items-center gap-1.5">
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`معاينة مشروع ${project.title}`}
                            className="btn-outline-cyber flex h-8 w-8 items-center justify-center rounded-full"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`مصدر مشروع ${project.title} على GitHub`}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-border-strong text-sec transition hover:border-[rgba(255,42,109,0.4)] hover:text-[#ff2a6d]"
                          >
                            <Github className="h-3.5 w-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => setSelected(project)}
                          className="rounded-full px-3 py-1.5 text-xs font-bold text-cyber transition hover:bg-[rgba(0,240,255,0.08)]"
                        >
                          التفاصيل
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* ── Project details dialog ── */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl gap-0 overflow-hidden rounded-2xl border-border-soft bg-elev p-0 sm:max-w-2xl">
          {selected && (
            <div className="max-h-[85vh] overflow-y-auto">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                {selected.image ? (
                  <Image
                    src={selected.image}
                    alt={selected.title}
                    fill
                    sizes="(max-width:768px) 100vw, 672px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[rgba(0,240,255,0.15)] to-[rgba(255,42,109,0.15)]">
                    <Code2 className="h-16 w-16 text-cyber" aria-hidden="true" />
                  </div>
                )}
                <span className="font-mono-cyber glass-strong absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold text-main">
                  {selected.year}
                </span>
              </div>

              <div className="p-6">
                <DialogTitle className="font-heading-cyber text-xl font-extrabold text-main">
                  {selected.title}
                </DialogTitle>
                <DialogDescription className="mt-3 text-sm leading-7 text-sec">
                  {selected.description}
                </DialogDescription>

                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-mute">التصنيف:</span>
                  <span className="tag-pill">{selected.category}</span>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 border-t border-border-soft pt-5">
                  {selected.demoUrl && (
                    <a
                      href={selected.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline-cyber inline-flex h-10 items-center gap-2 rounded-full px-5 text-xs font-bold"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      معاينة مباشرة
                    </a>
                  )}
                  {selected.githubUrl && (
                    <a
                      href={selected.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline-cyber inline-flex h-10 items-center gap-2 rounded-full px-5 text-xs font-bold"
                    >
                      <Github className="h-3.5 w-3.5" />
                      الكود المصدري
                    </a>
                  )}
                  <DialogClose asChild>
                    <button className="h-10 rounded-full border border-border-strong px-5 text-xs font-bold text-sec transition hover:border-[rgba(255,42,109,0.4)] hover:text-[#ff2a6d]">
                      إغلاق
                    </button>
                  </DialogClose>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
