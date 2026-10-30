"use client";

import { useEffect, useState } from "react";
import { Cookie, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!localStorage.getItem("cookie-consent")) setShow(true);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  const decide = (v: "accepted" | "rejected") => {
    localStorage.setItem("cookie-consent", v);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="إشعار ملفات تعريف الارتباط"
      className="glass-strong fixed bottom-5 right-1/2 z-[130] flex w-[calc(100vw-2rem)] max-w-2xl translate-x-1/2 flex-col items-center gap-3 rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:flex-row"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[rgba(255,153,0,0.12)] text-[#ff9900]">
        <Cookie className="h-5 w-5" />
      </span>
      <div className="flex-1 text-center sm:text-right">
        <p className="text-xs font-bold text-main">نحن نستخدم ملفات تعريف الارتباط (Cookies)</p>
        <p className="mt-1 text-[11px] leading-5 text-sec">
          نستخدم الكوكيز لتحسين تجربتك وتحليل أداء الموقع، بما يتوافق مع{" "}
          <a href="#" className="text-cyber underline underline-offset-4">
            سياسة الخصوصية
          </a>
          .
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => decide("rejected")}
          className="h-9 rounded-full px-5 text-xs"
        >
          رفض
        </Button>
        <Button size="sm" onClick={() => decide("accepted")} className="btn-gradient h-9 rounded-full px-6 text-xs">
          موافق
        </Button>
      </div>
      <ShieldCheck className="hidden h-4 w-4 text-mute sm:block" aria-hidden="true" />
    </div>
  );
}
