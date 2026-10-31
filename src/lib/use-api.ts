"use client";

import { useCallback, useEffect, useState } from "react";
import {
  STATIC_MODE,
  STATIC_SERVER_FEATURE,
  staticSnapshotUrl,
} from "@/lib/static-mode";

interface CacheEntry<T> {
  data?: T;
  error?: string;
}

/**
 * Simple GET data hook with loading/error state and manual reload.
 * Results are cached per (url, tick) so `loading` can be derived
 * without synchronous setState calls inside the effect.
 */
export function useApi<T>(url: string | null) {
  const [cache, setCache] = useState<Record<string, CacheEntry<T>>>({});
  const [tick, setTick] = useState(0);

  const key = url ? `${url}#${tick}` : null;
  /* النسخة الثابتة: لا توجد لقطة لهذا المسار → خطأ اصطناعي بلا setState داخل effect */
  const noSnapshot = STATIC_MODE && !!url && !staticSnapshotUrl(url);
  const entry = key
    ? noSnapshot
      ? { error: STATIC_SERVER_FEATURE }
      : cache[key]
    : undefined;

  useEffect(() => {
    if (!url) return;
    if (noSnapshot) return;
    let cancelled = false;
    /* في النسخة الثابتة نقرأ من لقطات JSON المخبوزة بدل الخادم */
    const target = staticSnapshotUrl(url)!;
    fetch(target)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: T) => {
        if (!cancelled) {
          setCache((c) => ({ ...c, [`${url}#${tick}`]: { data: json } }));
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setCache((c) => ({
            ...c,
            [`${url}#${tick}`]: {
              error:
                err instanceof Error && err.message === "HTTP 404"
                  ? STATIC_SERVER_FEATURE
                  : err instanceof Error
                    ? err.message
                    : "خطأ غير معروف",
            },
          }));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [url, tick, noSnapshot]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  const loading = !!url && !entry;
  const error = entry?.error ?? null;
  const data = entry?.data ?? null;

  return { data, loading, error, reload };
}

/** POST/PUT/PATCH JSON helper — throws on non-ok responses. */
export async function sendJson<T = unknown>(
  url: string,
  body: unknown,
  method: "POST" | "PATCH" | "PUT" | "DELETE" = "POST"
): Promise<T> {
  /* في النسخة الثابتة لا يوجد خادم — رسالة واضحة بدل فشل الشبكة */
  if (STATIC_MODE) {
    throw new Error(STATIC_SERVER_FEATURE);
  }
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (json as { error?: string }).error ?? `فشل الطلب (${res.status})`
    );
  }
  return json as T;
}
