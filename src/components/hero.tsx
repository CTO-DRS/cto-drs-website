"use client";

import { useEffect, useState } from "react";
import { Rocket, FolderGit2, UserRound, ChevronDown } from "lucide-react";
import { PROFILE, HERO_STATS, TYPING_ROLES } from "@/lib/data";
import { Counter } from "@/components/counter";
import { Reveal } from "@/components/reveal";
import { SocialRow } from "@/components/social-channels";

function useTypingEffect(words: string[], typeMs = 70, deleteMs = 32, holdMs = 1900) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx % words.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === word) {
      timeout = setTimeout(() => setDeleting(true), holdMs);
    } else if (deleting && text === "") {
      timeout = setTimeout(() => {
        setDeleting(false);
        setWordIdx((i) => (i + 1) % words.length);
      }, 60);
    } else {
      timeout = setTimeout(
        () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        deleting ? deleteMs : typeMs
      );
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, wordIdx, words, typeMs, deleteMs, holdMs]);

  return text;
}

export function Hero() {
  const typed = useTypingEffect(TYPING_ROLES);

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-28"
    >
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <Reveal>
          <div className="section-badge mb-7 flex items-center gap-2.5 rounded-full px-5 py-2">
            <span className="font-bold tracking-[0.22em]">CTO.DRS • SYSTEM ONLINE</span>
            <span className="animate-pulse-dot h-2 w-2 rounded-full bg-[#00ff88]" />
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="font-heading-cyber text-5xl font-extrabold leading-[1.15] sm:text-7xl md:text-[5.2rem]">
            <span className="text-gradient drop-shadow-[0_0_30px_rgba(0,240,255,0.25)]">
              {PROFILE.name}
            </span>
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p
            dir="auto"
            className="typing-caret font-mono-cyber mt-6 text-lg font-semibold tracking-wide text-cyber sm:text-2xl"
            aria-label="المسمى المهني"
          >
            {typed}
          </p>
        </Reveal>

        <Reveal delay={300}>
          <p className="mt-4 text-lg font-bold text-[#00aaff] sm:text-xl">{PROFILE.tagline}</p>
        </Reveal>

        <Reveal delay={400}>
          <p className="mt-6 max-w-2xl text-sm leading-8 text-sec sm:text-base">
            {PROFILE.heroDesc}
          </p>
        </Reveal>

        <Reveal delay={500}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href="#contact" className="btn-gradient flex h-12 items-center gap-2 rounded-full px-7 text-sm">
              <Rocket className="h-4 w-4" />
              ابدأ مشروعك
            </a>
            <a href="#projects" className="btn-outline-cyber flex h-12 items-center gap-2 rounded-full px-7 text-sm font-bold">
              <FolderGit2 className="h-4 w-4" />
              استعرض الأعمال
            </a>
            <a
              href="#about"
              className="flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold text-sec transition hover:text-cyber"
            >
              <UserRound className="h-4 w-4" />
              تعرف علي
            </a>
          </div>
        </Reveal>

        <Reveal delay={560}>
          <div className="mt-6 flex flex-col items-center gap-2">
            <span className="font-mono-cyber text-[10px] tracking-[0.3em] text-mute">FIND ME EVERYWHERE</span>
            <SocialRow />
          </div>
        </Reveal>

        <Reveal delay={650}>
          <dl className="mt-14 grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {HERO_STATS.map((s) => (
              <div
                key={s.label}
                className="glass rounded-2xl px-3 py-5 transition hover:border-[rgba(0,240,255,0.3)]"
              >
                <dd className="font-heading-cyber text-2xl font-extrabold sm:text-3xl">
                  <Counter value={s.value} suffix={s.suffix} className="text-gradient-static" />
                </dd>
                <dt className="font-mono-cyber mt-1 text-[10px] tracking-[0.25em] text-mute">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <a
        href="#dashboard"
        className="absolute bottom-7 z-10 flex flex-col items-center gap-1.5 text-[10px] tracking-[0.3em] text-mute transition hover:text-cyber"
        aria-label="مرر للأسفل"
      >
        SCROLL TO EXPLORE
        <ChevronDown className="animate-scroll-hint h-4 w-4" />
      </a>
    </section>
  );
}
