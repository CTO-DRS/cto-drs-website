"use client";

import Image from "next/image";
import { PlayCircle, Clock3, ExternalLink } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import { useI18n, useContent } from "@/i18n";
import { SOCIAL_BY_ID } from "@/lib/social";

export function VideosSection() {
  const { t } = useI18n();
  const { VIDEOS } = useContent();
  return (
    <section id="videos" className="relative px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="VIDEOS • 06"
          title={t.videosSection.title}
          highlight={t.videosSection.highlight}
          subtitle={t.videosSection.subtitle}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {VIDEOS.map((v, i) => (
            <Reveal key={v.title} delay={i * 100}>
              <a
                href={v.url ?? SOCIAL_BY_ID.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${v.title} — ${t.videosSection.watchOnYouTube}`}
                className="card-glow group block overflow-hidden rounded-2xl"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={v.thumb}
                    alt={v.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/35 transition group-hover:bg-black/15">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                      <PlayCircle className="h-8 w-8 text-cyber" />
                    </span>
                  </div>
                  <span className="font-mono-cyber absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[10px] text-white backdrop-blur-sm" dir="ltr">
                    <Clock3 className="h-3 w-3" />
                    {v.duration}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-heading-cyber line-clamp-1 text-[15px] font-bold text-main transition group-hover:text-cyber">
                    {v.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-6 text-sec">{v.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-cyber opacity-0 transition group-hover:opacity-100" aria-hidden="true">
                    <ExternalLink className="h-3 w-3" />
                    {t.videosSection.watchOnYouTube}
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
