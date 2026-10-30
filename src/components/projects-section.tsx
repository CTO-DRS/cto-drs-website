"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, Info, FolderGit2, Star, GitFork, X, CalendarDays, Layers } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import { PROJECTS, type Project } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  return (
    <Dialog open={!!project} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass-strong max-h-[85vh] overflow-y-auto rounded-2xl border-border-strong sm:max-w-lg">
        {project && (
          <>
            <div className="relative h-52 w-full overflow-hidden rounded-xl">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 500px"
              />
            </div>
            <DialogHeader className="mt-4 text-right">
              <DialogTitle className="font-heading-cyber text-lg font-bold text-main">
                {project.title}
              </DialogTitle>
              <DialogDescription className="pt-2 text-sm leading-7 text-sec">
                {project.description}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <Badge key={t} variant="outline" className="tag-pill border" dir="ltr">
                  {t}
                </Badge>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-3 border-t border-border-soft pt-4 text-center">
              <div>
                <p className="font-heading-cyber text-lg font-bold text-main">{project.stars ?? 0}</p>
                <p className="flex items-center justify-center gap-1 text-[11px] text-mute">
                  <Star className="h-3 w-3" /> نجوم
                </p>
              </div>
              <div>
                <p className="font-heading-cyber text-lg font-bold text-main">{project.forks ?? 0}</p>
                <p className="flex items-center justify-center gap-1 text-[11px] text-mute">
                  <GitFork className="h-3 w-3" /> تفرعات
                </p>
              </div>
              <div>
                <p className="font-heading-cyber text-lg font-bold text-main">{project.tags.length}</p>
                <p className="flex items-center justify-center gap-1 text-[11px] text-mute">
                  <Layers className="h-3 w-3" /> تقنيات
                </p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ProjectsSection() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="PORTFOLIO • 04"
          title="المشاريع"
          highlight="المميزة"
          subtitle="مجموعة مختارة من أحدث المشاريع المنجزة"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 100}>
              <article className="card-glow group flex h-full flex-col overflow-hidden rounded-2xl">
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {p.featured && (
                    <span className="font-mono-cyber absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[9px] tracking-[0.2em] text-[#ffd700] backdrop-blur-sm">
                      FEATURED
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="font-heading-cyber line-clamp-2 text-[15px] font-bold leading-7 text-main transition group-hover:text-cyber">
                    {p.title}
                  </h3>
                  <p className="line-clamp-3 flex-1 text-xs leading-6 text-sec">{p.description}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 4).map((t) => (
                      <span key={t} className="tag-pill">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-1 flex items-center justify-between border-t border-border-soft pt-4">
                    <a
                      href="#projects"
                      className="btn-outline-cyber flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-bold"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      معاينة
                    </a>
                    <button
                      onClick={() => setSelected(p)}
                      className="flex h-9 items-center gap-1.5 rounded-full border border-border-strong bg-elev-2/50 px-4 text-xs font-bold text-sec transition hover:border-[rgba(255,42,109,0.4)] hover:text-[#ff2a6d]"
                    >
                      <Info className="h-3.5 w-3.5" />
                      تفاصيل
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <a href="#projects" className="btn-gradient inline-flex h-12 items-center gap-2 rounded-full px-8 text-sm">
            <FolderGit2 className="h-4 w-4" />
            استعرض كل المشاريع
          </a>
        </Reveal>
      </div>

      <ProjectDialog project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
