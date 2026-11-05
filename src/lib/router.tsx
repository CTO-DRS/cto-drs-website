"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import { useI18n } from "@/i18n";

/* ─────────────────────────────────────────────
   Hash based SPA router — works on the single
   `/` route by encoding views in location.hash
   e.g. #/courses  |  #/blog/my-post
   ───────────────────────────────────────────── */

export type RouteName =
  | "home"
  | "about"
  | "services"
  | "projects"
  | "courses"
  | "course-detail"
  | "blog"
  | "post-detail"
  | "store"
  | "cart"
  | "checkout"
  | "team"
  | "testimonials"
  | "faq"
  | "contact"
  | "booking"
  | "login"
  | "register"
  | "reset"
  | "account"
  | "dashboard"
  | "pricing"
  | "tools"
  | "downloads"
  | "videos"
  | "gallery"
  | "events"
  | "privacy"
  | "terms"
  | "wishlist"
  | "orders"
  | "notifications"
  | "not-found";

export interface AppRoute {
  name: RouteName;
  slug?: string;
}

const VALID: RouteName[] = [
  "home",
  "about",
  "services",
  "projects",
  "courses",
  "course-detail",
  "blog",
  "post-detail",
  "store",
  "cart",
  "checkout",
  "team",
  "testimonials",
  "faq",
  "contact",
  "booking",
  "login",
  "register",
  "reset",
  "account",
  "dashboard",
  "pricing",
  "tools",
  "downloads",
  "videos",
  "gallery",
  "events",
  "privacy",
  "terms",
  "wishlist",
  "orders",
  "notifications",
];

/* أقسام داخل الرئيسية لها رابط مباشر: #/academy → الرئيسية + التمرير لقسم id="academy" */
export const HOME_SECTIONS = ["academy"] as const;
export type HomeSection = (typeof HOME_SECTIONS)[number];
export const ACADEMY_ROUTE: AppRoute = { name: "home", slug: "academy" };

function isHomeSection(v: string | undefined): v is HomeSection {
  return !!v && (HOME_SECTIONS as readonly string[]).includes(v);
}

function hashFor(r: AppRoute) {
  if (r.name === "home" && isHomeSection(r.slug)) return `#/${r.slug}`;
  return `#/${r.name}${r.slug ? `/${r.slug}` : ""}`;
}

/** التمرير إلى قسم في الرئيسية — ينتظر تحميل القسم الديناميكي (حتى ~4 ثوانٍ) */
function scrollToSection(id: string) {
  let tries = 0;
  const attempt = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (++tries < 40) window.setTimeout(attempt, 100);
  };
  window.setTimeout(attempt, 60);
}

function parseHashFrom(hash: string): AppRoute {
  let raw: string;
  try {
    raw = decodeURIComponent(hash.replace(/^#\/?/, "")).trim();
  } catch {
    raw = hash.replace(/^#\/?/, "").trim();
  }
  if (!raw) return { name: "home" };
  const [name, slug] = raw.split("/");
  if (isHomeSection(name)) return { name: "home", slug: name };
  if (VALID.includes(name as RouteName)) {
    return { name: name as RouteName, slug: slug || undefined };
  }
  // مسار غير معروف → شاشة 404 (بدلاً من الانزلاق الصامت للرئيسية)
  return { name: "not-found", slug: raw || undefined };
}

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function getSnapshot() {
  return window.location.hash;
}

function getServerSnapshot() {
  return "";
}

interface RouterCtx {
  route: AppRoute;
  navigate: (r: AppRoute) => void;
  back: () => void;
}

const Ctx = createContext<RouterCtx>({
  route: { name: "home" },
  navigate: () => {},
  back: () => {},
});

/* عناوين المستند لكل مسار — من قاموس اللغة (src/i18n) */

export function AppRouterProvider({ children }: { children: React.ReactNode }) {
  const hash = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const route = useMemo(() => parseHashFrom(hash), [hash]);

  const historyRef = useRef<AppRoute[]>([]);
  const prevHashRef = useRef(hash);

  // scroll to top whenever the route changes (no state updates here)
  useEffect(() => {
    if (prevHashRef.current !== hash) {
      prevHashRef.current = hash;
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
    // رابط قسم داخل الرئيسية (مثل #/academy) — عند التنقل أو الفتح المباشر
    if (route.name === "home" && isHomeSection(route.slug)) scrollToSection(route.slug);
  }, [hash, route]);

  // تحديث عنوان المستند تلقائياً حسب الشاشة الحالية
  const { t } = useI18n();
  useEffect(() => {
    const section = t.routes[route.name];
    const desired = route.name === "home" || !section ? t.meta.baseTitle : `${section} — CTO-DRS`;
    const apply = () => {
      if (document.title !== desired) document.title = desired;
    };
    apply();
    // بيانات Next الوصفية قد تُحقن بعد التركيب وتعيد العنوان الافتراضي — نعيد تطبيق عنواننا
    const mo = new MutationObserver(apply);
    mo.observe(document.head, { subtree: true, childList: true, characterData: true });
    return () => mo.disconnect();
  }, [route.name, t]);

  const navigate = useCallback((r: AppRoute) => {
    const current = parseHashFrom(window.location.hash);
    historyRef.current = [...historyRef.current.slice(-20), current];
    const target = hashFor(r);
    if (window.location.hash === target) {
      if (r.name === "home" && isHomeSection(r.slug)) scrollToSection(r.slug);
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.location.hash = target;
  }, []);

  const back = useCallback(() => {
    const stack = historyRef.current;
    const prev = stack[stack.length - 1];
    if (prev) {
      historyRef.current = stack.slice(0, -1);
      window.location.hash = hashFor(prev);
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.hash = "#/home";
    }
  }, []);

  const value = useMemo(() => ({ route, navigate, back }), [route, navigate, back]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppRouter() {
  return useContext(Ctx);
}

/** helper to build a hash href (for <a> tags) */
export function routeHref(r: AppRoute) {
  return hashFor(r);
}
