/**
 * تقييد سرعة خادمي بنافذة ثابتة في الذاكرة — يُغلق F-03 من تقرير الفحص الشامل.
 *
 * الحد الأقصى لكل مفتاح = bucket + عنوان IP (أول قفزة في x-forwarded-for، ثم x-real-ip).
 * النافذة الثابتة كافية لـ P0: البنية أحادية العملية (SQLite standalone).
 * ملاحظة: الخزين في الذاكرة — يُصفَّر عند إعادة التشغيل، ولا يُشارك بين عدة نسخ خلف
 * موازن حمل (يُغطى ذلك في خطة P1 عند الانتقال لتوزيع فعلي).
 */
import { NextResponse } from "next/server";

interface BucketEntry {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, BucketEntry>();
/** سقف للمفاتيح لمنع نمو الذاكرة بلا حدود عند فحص عناوين مزيفة */
const MAX_KEYS = 10_000;

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || "local";
}

export interface RateResult {
  ok: boolean;
  /** ثوانٍ حتى إعادة التعيين (تُستخدم في Retry-After) */
  retryAfter: number;
}

function pruneExpired(now: number): void {
  if (buckets.size < MAX_KEYS) return;
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}

/**
 * فحص النافذة الثابتة: يزيد العداد ويرجع السماح أو الرفض.
 * مثال: rateLimit(req, "chat", 10, 60_000) — 10 طلبات كحد أقصى لكل دقيقة لكل IP.
 */
export function rateLimit(req: Request, bucket: string, limit: number, windowMs: number): RateResult {
  const now = Date.now();
  const key = `${bucket}:${clientIp(req)}`;
  const entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    pruneExpired(now);
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  entry.count += 1;
  if (entry.count > limit) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
  }
  return { ok: true, retryAfter: 0 };
}

/** استجابة 429 موحدة مع Retry-After */
export function tooManyRequests(retryAfter: number): NextResponse {
  return NextResponse.json(
    { error: `تم تجاوز الحد المسموح من الطلبات — حاول بعد ${retryAfter} ثانية` },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}

/* ── حدود النقاط العامة (P0) — موثقة في docs/P0-SECURITY-AR.md ── */
export const RATE_LIMITS = {
  /** المساعد الذكي — يستدعي نموذج ذكاء اصطناعي بأثر تكلفة مباشر (F-03) */
  chat: { limit: 10, windowMs: 60_000 },
  /** الدخول — مقاومة القوة الغاشمة على كلمات المرور */
  login: { limit: 8, windowMs: 60_000 },
  /** التسجيل */
  register: { limit: 5, windowMs: 300_000 },
  /** نموذج التواصل */
  contact: { limit: 6, windowMs: 300_000 },
  /** الحجوزات */
  bookings: { limit: 6, windowMs: 300_000 },
  /** التعليقات */
  comments: { limit: 6, windowMs: 300_000 },
  /** النشرة البريدية */
  newsletter: { limit: 6, windowMs: 300_000 },
  /** الطلبات/الشراء */
  orders: { limit: 10, windowMs: 300_000 },
} as const;
