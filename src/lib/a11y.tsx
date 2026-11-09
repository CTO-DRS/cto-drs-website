"use client";

/* ═══════════════════════════════════════════════════════════
   إعدادات الوصولية (WCAG 2.1 AA)
   • حجم النص A- / A+ — يغيّر font-size الجذر (كل المقاسات rem)
   • تقليل الحركة — يدوياً أو حسب تفضيل النظام prefers-reduced-motion
   كلاهما محفوظ في localStorage ويُطبَّق مبكراً عبر سكربت <head> في layout
   ═══════════════════════════════════════════════════════════ */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export const TEXT_SCALES = [0.9, 1, 1.1, 1.25, 1.4] as const;
export const DEFAULT_SCALE_INDEX = 1;
export const SCALE_STORAGE_KEY = "cto-drs-text-scale";
export const MOTION_STORAGE_KEY = "cto-drs-reduce-motion";

interface A11yCtx {
  scaleIndex: number;
  canDecrease: boolean;
  canIncrease: boolean;
  decrease: () => void;
  increase: () => void;
  reset: () => void;
  /** تفضيل المستخدم اليدوي */
  userReduceMotion: boolean;
  /** النتيجة الفعلية: يدوي أو تفضيل النظام */
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
}

const Ctx = createContext<A11yCtx>({
  scaleIndex: DEFAULT_SCALE_INDEX,
  canDecrease: true,
  canIncrease: true,
  decrease: () => {},
  increase: () => {},
  reset: () => {},
  userReduceMotion: false,
  reduceMotion: false,
  toggleReduceMotion: () => {},
});

export function A11yProvider({ children }: { children: React.ReactNode }) {
  const [scaleIndex, setScaleIndex] = useState(DEFAULT_SCALE_INDEX);
  const [userReduceMotion, setUserReduceMotion] = useState(false);
  const [systemReduce, setSystemReduce] = useState(false);
  const [ready, setReady] = useState(false);

  /* قراءة القيم المحفوظة + متابعة تفضيل النظام */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(SCALE_STORAGE_KEY);
        const s = raw === null ? NaN : Number(raw);
        if (Number.isInteger(s) && s >= 0 && s < TEXT_SCALES.length) setScaleIndex(s);
        setUserReduceMotion(localStorage.getItem(MOTION_STORAGE_KEY) === "1");
      } catch {
        /* تجاهل */
      }
      setSystemReduce(mq.matches);
      setReady(true);
    });
    const onChange = (e: MediaQueryListEvent) => setSystemReduce(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const el = document.documentElement;
    const scale = TEXT_SCALES[scaleIndex];
    el.style.fontSize = scale === 1 ? "" : `${scale * 100}%`;
    el.classList.toggle("reduce-motion", userReduceMotion);
    try {
      localStorage.setItem(SCALE_STORAGE_KEY, String(scaleIndex));
      localStorage.setItem(MOTION_STORAGE_KEY, userReduceMotion ? "1" : "0");
    } catch {
      /* تجاهل */
    }
  }, [scaleIndex, userReduceMotion, ready]);

  const decrease = useCallback(() => setScaleIndex((i) => Math.max(0, i - 1)), []);
  const increase = useCallback(() => setScaleIndex((i) => Math.min(TEXT_SCALES.length - 1, i + 1)), []);
  const reset = useCallback(() => setScaleIndex(DEFAULT_SCALE_INDEX), []);
  const toggleReduceMotion = useCallback(() => setUserReduceMotion((v) => !v), []);

  const value = useMemo<A11yCtx>(
    () => ({
      scaleIndex,
      canDecrease: scaleIndex > 0,
      canIncrease: scaleIndex < TEXT_SCALES.length - 1,
      decrease,
      increase,
      reset,
      userReduceMotion,
      reduceMotion: userReduceMotion || systemReduce,
      toggleReduceMotion,
    }),
    [scaleIndex, decrease, increase, reset, userReduceMotion, systemReduce, toggleReduceMotion],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useA11y() {
  return useContext(Ctx);
}

/**
 * سكربت مبكر يُحقن في <head>: يطبّق اللغة/الاتجاه وحجم النص وتقليل الحركة
 * قبل أول رسم لتقليل الوميض. (يقرأ نفس مفاتيح localStorage)
 */
export const EARLY_PREFS_SCRIPT = `(function(){try{var d=document.documentElement,q=new URLSearchParams(location.search).get('lang'),l=(q==='en'||q==='ar')?q:localStorage.getItem('cto-drs-lang');if(l==='en'){d.lang='en';d.dir='ltr';}var si=localStorage.getItem('${SCALE_STORAGE_KEY}'),s=si===null?1:[${TEXT_SCALES.join(",")}][+si];if(s&&s!==1)d.style.fontSize=(s*100)+'%';if(localStorage.getItem('${MOTION_STORAGE_KEY}')==='1')d.classList.add('reduce-motion');}catch(e){}})();`;
