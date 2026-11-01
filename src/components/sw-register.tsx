"use client";

import { useEffect } from "react";

/**
 * تسجيل Service Worker — تمكين العمل دون اتصال (PWA).
 * الاستراتيجية: network-first لضمان محتوى حديث دائماً،
 * مع الرجوع للنسخة المخزنة عند تعذر الوصول للشبكة.
 */
export function SWRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    // لا تُفعَّل في بيئة التطوير
    if (process.env.NODE_ENV !== "production") return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((err) => console.warn("[SW] registration failed:", err));
    };

    if (document.readyState === "complete") register();
    else {
      window.addEventListener("load", register, { once: true });
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
