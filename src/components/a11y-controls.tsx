"use client";

import { Languages, Pause, Play } from "lucide-react";
import { useI18n } from "@/i18n";
import { useA11y } from "@/lib/a11y";

/** زر تبديل اللغة AR / EN */
export function LanguageToggle({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const { t, toggleLang, lang } = useI18n();
  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={t.lang.toggleAria}
      title={t.lang.toggleAria}
      lang={lang === "ar" ? "en" : "ar"}
      className={`flex h-9 min-w-9 items-center justify-center gap-1 rounded-full px-2 text-xs font-bold text-sec transition hover:text-cyber ${className}`}
    >
      {!compact && <Languages className="h-3.5 w-3.5" aria-hidden="true" />}
      <span>{t.lang.toggleLabel}</span>
    </button>
  );
}

/** أدوات الوصولية: حجم النص A- / A / A+ + تقليل الحركة */
export function A11yControls({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  const a = useA11y();
  const btn =
    "flex h-8 min-w-8 items-center justify-center rounded-full border border-border-strong bg-elev-2/50 px-2 text-[11px] font-bold text-sec transition hover:border-[rgba(0,240,255,0.4)] hover:text-cyber disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div role="group" aria-label={t.a11y.group} className={`flex items-center gap-1.5 ${className}`}>
      <span className="text-[11px] text-mute" aria-hidden="true">
        {t.a11y.textSize}
      </span>
      <button type="button" className={btn} onClick={a.decrease} disabled={!a.canDecrease} aria-label={t.a11y.decrease} title={t.a11y.decrease}>
        A−
      </button>
      <button type="button" className={btn} onClick={a.reset} aria-label={t.a11y.reset} title={t.a11y.reset}>
        A
      </button>
      <button type="button" className={btn} onClick={a.increase} disabled={!a.canIncrease} aria-label={t.a11y.increase} title={t.a11y.increase}>
        A+
      </button>
      <button
        type="button"
        className={btn}
        onClick={a.toggleReduceMotion}
        aria-pressed={a.userReduceMotion}
        aria-label={a.userReduceMotion ? t.a11y.reduceMotionOn : t.a11y.reduceMotion}
        title={a.userReduceMotion ? t.a11y.reduceMotionOn : t.a11y.reduceMotion}
      >
        {a.userReduceMotion ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
      </button>
    </div>
  );
}
