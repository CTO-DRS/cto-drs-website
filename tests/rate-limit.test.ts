/**
 * اختبارات تقييد السرعة الخادمي — بطاقة P1/10 (F-11)، يغلق F-03.
 * تُغطي: السماح حتى الحد، الرفض بعده مع Retry-After، عزل IP والمجموعات،
 * انتهاء النافذة، وتحديد أولوية x-forwarded-for ثم x-real-ip.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// الوحدة تحمل خزين buckets في مستواها — إعادة تحميل بمعزل لكل مجموعة اختبارات
let rateLimit: typeof import("@/lib/rate-limit").rateLimit;
let clientIp: typeof import("@/lib/rate-limit").clientIp;

async function fresh() {
  vi.resetModules();
  const mod = await import("@/lib/rate-limit");
  rateLimit = mod.rateLimit;
  clientIp = mod.clientIp;
}

function reqWith(ipHeaders: Record<string, string> = {}): Request {
  return new Request("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json", ...ipHeaders },
  });
}

describe("rateLimit — نافذة ثابتة", () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-09T12:00:00Z"));
    await fresh();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("يسمح بالطلبات حتى الحد ثم يرفض", () => {
    const req = reqWith({ "x-forwarded-for": "1.2.3.4" });
    for (let i = 0; i < 10; i++) {
      const r = rateLimit(req, "chat", 10, 60_000);
      expect(r.ok).toBe(true);
    }
    const denied = rateLimit(req, "chat", 10, 60_000);
    expect(denied.ok).toBe(false);
    expect(denied.retryAfter).toBeGreaterThan(0);
    expect(denied.retryAfter).toBeLessThanOrEqual(60);
  });

  it("عزل عناوين IP المختلفة", () => {
    const a = reqWith({ "x-forwarded-for": "10.0.0.1" });
    const b = reqWith({ "x-forwarded-for": "10.0.0.2" });
    for (let i = 0; i < 5; i++) expect(rateLimit(a, "chat", 5, 60_000).ok).toBe(true);
    expect(rateLimit(a, "chat", 5, 60_000).ok).toBe(false);
    // العنوان الآخر لم يتأثر
    expect(rateLimit(b, "chat", 5, 60_000).ok).toBe(true);
  });

  it("عزل المجموعات (bucket) لنفس الـ IP", () => {
    const req = reqWith({ "x-forwarded-for": "10.0.1.1" });
    for (let i = 0; i < 3; i++) expect(rateLimit(req, "login", 3, 60_000).ok).toBe(true);
    expect(rateLimit(req, "login", 3, 60_000).ok).toBe(false);
    // مجموعة أخرى لنفس الـ IP مستقلة
    expect(rateLimit(req, "chat", 3, 60_000).ok).toBe(true);
  });

  it("انتهاء النافذة يعيد السماح ويصفّر العداد", () => {
    const req = reqWith({ "x-forwarded-for": "10.0.2.1" });
    for (let i = 0; i < 4; i++) expect(rateLimit(req, "contact", 4, 60_000).ok).toBe(true);
    expect(rateLimit(req, "contact", 4, 60_000).ok).toBe(false);
    // تقدم الزمن 61 ثانية — نافذة جديدة
    vi.advanceTimersByTime(61_000);
    const r = rateLimit(req, "contact", 4, 60_000);
    expect(r.ok).toBe(true);
  });

  it("Retry-After يتناقص مع الزمن داخل نفس النافذة", () => {
    const req = reqWith({ "x-forwarded-for": "10.0.3.1" });
    rateLimit(req, "chat", 1, 60_000);
    const denied1 = rateLimit(req, "chat", 1, 60_000);
    expect(denied1.ok).toBe(false);
    const r1 = denied1.retryAfter;
    vi.advanceTimersByTime(30_000);
    const denied2 = rateLimit(req, "chat", 1, 60_000);
    expect(denied2.retryAfter).toBeLessThan(r1);
  });
});

describe("clientIp — استخراج عنوان المصدر", () => {
  beforeEach(async () => {
    await fresh();
  });

  it("أول قفزة من x-forwarded-for (قائمة مفصولة)", () => {
    expect(clientIp(reqWith({ "x-forwarded-for": "203.0.113.9, 70.41.3.7" }))).toBe("203.0.113.9");
  });

  it("x-real-ip بديل عند غياب x-forwarded-for", () => {
    expect(clientIp(reqWith({ "x-real-ip": "198.51.100.7" }))).toBe("198.51.100.7");
  });

  it("افتراضي local عند غياب الترويستين", () => {
    expect(clientIp(reqWith())).toBe("local");
  });
});
