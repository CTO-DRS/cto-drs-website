"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, Info, FolderGit2, Star, GitFork, X, CalendarDays, Layers, Github, Code2, Download, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import { type Project } from "@/lib/data";
import { useI18n, useContent } from "@/i18n";
import { APPS, directReleaseUrl, sourceZipUrl, type AppEntry } from "@/lib/apps";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const { t } = useI18n();
  const ps = t.projectsSection;
  const appEntry: AppEntry | undefined = APPS.find((a) => a.id === project?.id);

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
            <DialogHeader className="mt-4 text-start">
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
                <p className="font-heading-cyber text-lg font-bold text-main" dir="ltr">
                  {project.language ?? "—"}
                </p>
                <p className="flex items-center justify-center gap-1 text-[11px] text-mute">
                  <Code2 className="h-3 w-3" aria-hidden="true" /> {ps.language}
                </p>
              </div>
              <div>
                <p className="font-heading-cyber text-lg font-bold text-main">{project.stars ?? 0}</p>
                <p className="flex items-center justify-center gap-1 text-[11px] text-mute">
                  <Star className="h-3 w-3" aria-hidden="true" /> {ps.stars}
                </p>
              </div>
              <div>
                <p className="font-heading-cyber text-lg font-bold text-main">{project.tags.length}</p>
                <p className="flex items-center justify-center gap-1 text-[11px] text-mute">
                  <Layers className="h-3 w-3" aria-hidden="true" /> {ps.techs}
                </p>
              </div>
            </div>
            {project.url && (
              <div className="mt-4 flex items-center gap-2">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-border-strong bg-elev-2/50 text-sm font-bold text-sec transition hover:border-cyber/40 hover:text-cyber"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  {ps.viewOnGithub}
                </a>
                {appEntry && (
                  <a
                    href={appEntry.directFile ? directReleaseUrl(appEntry.repo, appEntry.directFile) : sourceZipUrl(appEntry.repo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="btn-gradient flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-sm font-bold"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    {appEntry.fileType === "APK" ? t.common.directApk : t.common.directZip}
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ProjectsSection() {
  const [selected, setSelected] = useState<Project | null>(null);
  const { t } = useI18n();
  const ps = t.projectsSection;
  const { PROJECTS } = useContent();

  return (
    <section id="projects" className="relative px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="PORTFOLIO • 04"
          title={ps.title}
          highlight={ps.highlight}
          subtitle={ps.subtitle}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />
                  {p.featured && (
                    <span className="font-mono-cyber absolute end-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[9px] tracking-[0.2em] text-[#ffd700] backdrop-blur-sm">
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
                      href={p.url ?? "#projects"}
                      target={p.url ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      aria-label={ps.repoAria(p.title)}
                      className="btn-outline-cyber flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-bold"
                    >
                      <Github className="h-3.5 w-3.5" aria-hidden="true" />
                      {t.common.repo}
                    </a>
                    <button
                      type="button"
                      onClick={() => setSelected(p)}
                      aria-haspopup="dialog"
                      aria-label={`${ps.details}: ${p.title}`}
                      className="flex h-9 items-center gap-1.5 rounded-full border border-border-strong bg-elev-2/50 px-4 text-xs font-bold text-sec transition hover:border-[rgba(255,42,109,0.4)] hover:text-[#ff2a6d]"
                    >
                      <Info className="h-3.5 w-3.5" aria-hidden="true" />
                      {ps.details}
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <a href="#projects" className="btn-gradient inline-flex h-12 items-center gap-2 rounded-full px-8 text-sm">
            <FolderGit2 className="h-4 w-4" aria-hidden="true" />
            {ps.viewAll}
          </a>
        </Reveal>
      </div>

      <ProjectDialog project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
