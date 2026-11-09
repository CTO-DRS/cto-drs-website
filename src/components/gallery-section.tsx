"use client";

import Image from "next/image";
import { Camera } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import { useI18n, useContent } from "@/i18n";

export function GallerySection() {
  const { t } = useI18n();
  const { GALLERY } = useContent();
  return (
    <section className="relative px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="GALLERY • 09"
          title={t.gallerySection.title}
          highlight={t.gallerySection.highlight}
          subtitle={t.gallerySection.subtitle}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map((g, i) => (
            <Reveal
              key={g.title}
              delay={(i % 3) * 90}
              className={
                i === 2
                  ? "sm:col-span-2 lg:col-span-1"
                  : i === 4
                    ? "sm:col-span-2"
                    : ""
              }
            >
              <figure className="group relative h-56 cursor-pointer overflow-hidden rounded-2xl border border-border-soft">
                <Image
                  src={g.image}
                  alt={g.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
                <figcaption className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="flex items-center gap-2 font-heading-cyber text-sm font-bold text-white">
                    <Camera className="h-3.5 w-3.5 text-cyber" />
                    {g.title}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-[11px] text-white/70">{g.description}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
