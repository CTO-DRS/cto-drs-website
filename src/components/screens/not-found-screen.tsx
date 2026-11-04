"use client";

import { motion } from "framer-motion";
import { Home, Compass, Terminal } from "lucide-react";
import { useAppRouter } from "@/lib/router";
import { useI18n } from "@/i18n";

/**
 * شاشة 404 — تظهر عند إدخال مسار غير معروف في شريط العنوان
 * بأسلوب «وحدة مفقودة» السيبراني المتوافق مع هوية الموقع.
 */
export function NotFoundScreen() {
  const { navigate } = useAppRouter();
  const { t } = useI18n();
  const nf = t.notFound;

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-16 text-center" aria-labelledby="nf-title">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-8"
      >
        <span className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#00f0ff] via-[#7c3aed] to-[#ff2a6d] p-[2px] shadow-[0_0_50px_rgba(0,240,255,0.35)]">
          <span className="flex h-full w-full items-center justify-center rounded-[calc(1.5rem-2px)] bg-[#05070c]">
            <Terminal className="h-10 w-10 text-cyber" strokeWidth={2} aria-hidden="true" />
          </span>
        </span>
        <span className="animate-ping absolute inset-0 rounded-3xl border border-[rgba(0,240,255,0.35)]" aria-hidden="true" />
      </motion.div>

      <p className="font-mono-cyber text-[11px] tracking-[0.4em] text-mute" dir="ltr">
        ERROR 404 — MODULE NOT FOUND
      </p>

      <h1 id="nf-title" className="font-heading-cyber mt-4 text-4xl font-extrabold text-main sm:text-5xl">
        {nf.title1} <span className="text-gradient-cyan">{nf.title2}</span>
      </h1>

      <p className="mt-4 max-w-md text-sm leading-7 text-sec sm:text-base">
        {nf.body}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => navigate({ name: "home" })}
          className="btn-primary-cyber inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          {nf.backHome}
        </button>
        <a
          href="#/faq"
          onClick={(e) => {
            e.preventDefault();
            navigate({ name: "faq" });
          }}
          className="btn-outline-cyber inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold"
        >
          <Compass className="h-4 w-4" aria-hidden="true" />
          {nf.faq}
        </a>
      </div>

      <nav aria-label={nf.quickAria} className="mt-10 flex flex-wrap items-center justify-center gap-2">
        {nf.links.map((l) => (
          <a
            key={l.hash}
            href={l.hash}
            className="card-glow rounded-full px-4 py-2 text-xs font-bold text-sec transition-colors hover:text-cyber"
          >
            {l.label}
          </a>
        ))}
      </nav>
    </section>
  );
}
