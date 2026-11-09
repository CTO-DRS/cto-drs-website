"use client";

/* ═══════════════════════════════════════════════════════════
   i18n خفيف من جهة العميل — العربية افتراضياً، الإنجليزية اختيارياً
   • القاموس: ar.ts / en.ts (نفس الشكل، يفرضه النوع Dict)
   • الاختيار يُحفظ في localStorage ويُحترم ?lang=en|ar في الرابط
   • يبدّل <html lang> و dir (rtl/ltr) ديناميكياً
   ═══════════════════════════════════════════════════════════ */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ar, type Dict } from "./ar";
import { en } from "./en";
import * as C from "./content-en";
import {
  PROFILE,
  HERO_STATS,
  SKILLS,
  PROJECTS,
  PERFORMANCE_STATS,
  VIDEOS,
  COURSES,
  TOOLS,
  GALLERY,
  QUICK_TOOLS,
  SERVICES,
  TYPING_ROLES,
  DASHBOARD_METRICS,
  MASTERY_BARS,
  ACHIEVEMENTS,
} from "@/lib/data";
import { APPS, SOURCE_REPOS } from "@/lib/apps";
import { FAQS } from "@/lib/faq-data";
import { SOCIALS } from "@/lib/social";
import { CONTACT_PURPOSES, type Country } from "@/lib/contact-options";
import type { Service, Project as ApiProject, Course as ApiCourse } from "@/lib/types";

export type Lang = "ar" | "en";
export const LANG_STORAGE_KEY = "cto-drs-lang";
const DICTS: Record<Lang, Dict> = { ar, en };

interface I18nCtx {
  lang: Lang;
  dir: "rtl" | "ltr";
  t: Dict;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
}

const Ctx = createContext<I18nCtx>({
  lang: "ar",
  dir: "rtl",
  t: ar,
  setLang: () => {},
  toggleLang: () => {},
});

function readInitialLang(): Lang {
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q === "en" || q === "ar") return q;
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === "en" || saved === "ar") return saved;
  } catch {
    /* تجاهل */
  }
  return "ar";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // التصيير الأول دائماً عربي (يطابق HTML المُصدَّر) ثم نطبّق اختيار المستخدم بعد التركيب
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const initial = readInitialLang();
    if (initial !== "ar") queueMicrotask(() => setLangState(initial));
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
      // مزامنة ?lang في الرابط إن وُجد مسبقاً (لا نضيفه للعربية الافتراضية)
      const url = new URL(window.location.href);
      const q = url.searchParams.get("lang");
      if (q && q !== lang) {
        if (lang === "ar") url.searchParams.delete("lang");
        else url.searchParams.set("lang", lang);
        window.history.replaceState(window.history.state, "", url.toString());
      }
    } catch {
      /* تجاهل */
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(() => setLangState((l) => (l === "ar" ? "en" : "ar")), []);

  const value = useMemo<I18nCtx>(
    () => ({ lang, dir: lang === "ar" ? "rtl" : "ltr", t: DICTS[lang], setLang, toggleLang }),
    [lang, setLang, toggleLang],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}

/* ─── ترجمة المصطلحات (تصنيفات/مستويات/وسوم) ─── */
export function term(lang: Lang, s: string): string {
  return lang === "en" ? (C.TERMS_EN[s] ?? s) : s;
}

const regionNames = (() => {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    return null;
  }
})();

export function countryName(lang: Lang, c: Country): string {
  if (lang === "ar") return c.name;
  return regionNames?.of(c.code) ?? c.name;
}

export function localizeService(lang: Lang, s: Service): Service {
  if (lang === "ar") return s;
  const o = C.API_SERVICES_EN[s.slug];
  return {
    ...s,
    title: o?.title ?? s.title,
    description: o?.description ?? s.description,
    duration: o?.duration ?? term(lang, s.duration),
    features: o?.features ?? s.features,
    category: term(lang, s.category),
  };
}

export function localizeApiProject(lang: Lang, p: ApiProject): ApiProject {
  if (lang === "ar") return p;
  const o = C.API_PROJECTS_EN[p.slug];
  return {
    ...p,
    title: o?.title ?? p.title,
    description: o?.description ?? p.description,
    category: term(lang, p.category),
    tags: p.tags.map((t) => term(lang, t)),
  };
}

export function localizeApiCourse(lang: Lang, c: ApiCourse): ApiCourse {
  if (lang === "ar") return c;
  const o = C.API_COURSES_EN[c.slug];
  return {
    ...c,
    title: o?.title ?? c.title,
    description: o?.description ?? c.description,
    category: term(lang, c.category),
    instructor: term(lang, c.instructor),
    // level يبقى بالعربية داخلياً (للتصفية والألوان) — يُترجم عند العرض فقط
  };
}

/** "30 إصدار" → "30 releases" ، "مصدر" → "Source" */
function enDownloads(s: string): string {
  if (s === "مصدر") return "Source";
  return s.replace(/^(\S+) إصدار$/, "$1 releases");
}

/* ─── بيانات الموقع مترجمة حسب اللغة ─── */
function buildContent(lang: Lang) {
  if (lang === "ar") {
    return {
      PROFILE,
      HERO_STATS,
      SKILLS,
      PROJECTS,
      PERFORMANCE_STATS,
      VIDEOS,
      COURSES,
      TOOLS,
      GALLERY,
      QUICK_TOOLS,
      SERVICES,
      TYPING_ROLES,
      DASHBOARD_METRICS,
      MASTERY_BARS,
      ACHIEVEMENTS,
      APPS,
      SOURCE_REPOS,
      FAQS,
      SOCIALS,
      CONTACT_PURPOSES,
    };
  }
  return {
    PROFILE: { ...PROFILE, ...C.PROFILE_EN },
    HERO_STATS,
    SKILLS,
    PROJECTS: PROJECTS.map((p) => ({ ...p, ...(C.PROJECTS_EN[p.id] ?? {}) })),
    PERFORMANCE_STATS: PERFORMANCE_STATS.map((s, i) => ({ ...s, label: C.PERFORMANCE_STATS_EN[i] ?? s.label })),
    VIDEOS: VIDEOS.map((v, i) => ({ ...v, ...(C.VIDEOS_EN[i] ?? {}) })),
    COURSES: COURSES.map((c, i) => ({ ...c, ...(C.COURSES_EN[i] ?? {}) })),
    TOOLS: TOOLS.map((t, i) => ({ ...t, description: C.TOOLS_EN[i] ?? t.description })),
    GALLERY: GALLERY.map((g, i) => ({ ...g, ...(C.GALLERY_EN[i] ?? {}) })),
    QUICK_TOOLS: QUICK_TOOLS.map((q, i) => ({ ...q, ...(C.QUICK_TOOLS_EN[i] ?? {}) })),
    SERVICES: SERVICES.map((s, i) => C.SERVICES_EN[i] ?? s),
    TYPING_ROLES: C.TYPING_ROLES_EN,
    DASHBOARD_METRICS: DASHBOARD_METRICS.map((m, i) => ({ ...m, ...(C.DASHBOARD_METRICS_EN[i] ?? {}) })),
    MASTERY_BARS,
    ACHIEVEMENTS: ACHIEVEMENTS.map((a, i) => ({ ...a, text: C.ACHIEVEMENTS_EN[i] ?? a.text })),
    APPS: APPS.map((a) => {
      const o = C.APPS_EN[a.id];
      if (!o) return { ...a, downloads: enDownloads(a.downloads) };
      return {
        ...a,
        downloads: enDownloads(a.downloads),
        title: o.title,
        description: o.description,
        extraAssets: a.extraAssets.map((x, i) => ({ ...x, label: o.extra?.[i] ?? x.label })),
      };
    }),
    SOURCE_REPOS: SOURCE_REPOS.map((r) => ({
      ...r,
      title: C.SOURCE_REPO_TITLES_EN[r.id] ?? r.title,
      description: C.SOURCE_REPOS_EN[r.id] ?? r.description,
    })),
    FAQS: FAQS.map((f, i) => ({ ...f, q: C.FAQS_EN[i]?.q ?? f.q, a: C.FAQS_EN[i]?.a ?? f.a })),
    SOCIALS: SOCIALS.map((s) => ({ ...s, ...(C.SOCIALS_EN[s.id] ?? {}) })),
    CONTACT_PURPOSES: CONTACT_PURPOSES.map((p) => ({ ...p, ...(C.PURPOSES_EN[p.id] ?? {}) })),
  };
}

const CONTENT_CACHE: Partial<Record<Lang, ReturnType<typeof buildContent>>> = {};

export function getContent(lang: Lang) {
  return (CONTENT_CACHE[lang] ??= buildContent(lang));
}

export function useContent() {
  const { lang } = useI18n();
  return getContent(lang);
}
