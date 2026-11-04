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

function parseHashFrom(hash: string): AppRoute {
  let raw: string;
  try {
    raw = decodeURIComponent(hash.replace(/^#\/?/, "")).trim();
  } catch {
    raw = hash.replace(/^#\/?/, "").trim();
  }
  if (!raw) return { name: "home" };
  const [name, slug] = raw.split("/");
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
  }, [hash]);

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
    const target = `#/${r.name}${r.slug ? `/${r.slug}` : ""}`;
    if (window.location.hash === target) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.location.hash = target;
  }, []);

  const back = useCallback(() => {
    const stack = historyRef.current;
    const prev = stack[stack.length - 1];
    if (prev) {
      historyRef.current = stack.slice(0, -1);
      window.location.hash = `#/${prev.name}${prev.slug ? `/${prev.slug}` : ""}`;
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
  return `#/${r.name}${r.slug ? `/${r.slug}` : ""}`;
}
