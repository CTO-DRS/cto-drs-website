"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

/**
 * مؤشر حالة الاتصال — شريط تنبيه يظهر عند فقدان الشبكة
 * (النسخة الثابتة تعمل دون اتصال بفضل التخزين المؤقت).
 */
export function OfflineIndicator() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[120] flex justify-center px-4 pb-4"
    >
      <div className="glass-strong flex items-center gap-2 rounded-full border border-[rgba(255,180,0,0.35)] px-5 py-2.5 text-xs font-bold text-main shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
        <WifiOff className="h-4 w-4 text-[#ffb400]" aria-hidden="true" />
        لا يوجد اتصال بالإنترنت — يتم العرض من النسخة المخزنة
      </div>
    </div>
  );
}
