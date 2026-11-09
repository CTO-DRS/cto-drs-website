/**
 * اختبارات جلسة المصادقة الخادمية — بطاقة P1/10 (F-11).
 * تُغطي: إنشاء/تحقق التوكن الموقّع HMAC، انتهاء الصلاحية، العبث بالتوقيع،
 * وحرس requireAdmin (الدور في التوكن + الدور الحي في قاعدة البيانات).
 */
process.env.AUTH_SECRET = "unit-test-secret-0123456789abcdef-0123456789abcdef"; // ≥ 32 حرفاً

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// محاكاة عميل Prisma بالكامل — لا قاعدة بيانات فعلية في الاختبارات
vi.mock("@/lib/db", () => ({
  db: { user: { findUnique: vi.fn() } },
}));

import { db } from "@/lib/db";
import {
  createSessionToken,
  verifySessionToken,
  requireAdmin,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
} from "@/lib/session";

const ADMIN = { id: "u-admin-1", email: "admin@ctodrs.test", role: "admin" };
const USER = { id: "u-user-1", email: "user@ctodrs.test", role: "user" };

/** بناء طلب NextRequest بترويسة Authorization أو كوكي */
function req(opts: { bearer?: string; cookie?: string } = {}): NextRequest {
  const headers = new Headers();
  if (opts.bearer) headers.set("authorization", `Bearer ${opts.bearer}`);
  if (opts.cookie) headers.set("cookie", opts.cookie);
  return new NextRequest("http://localhost:3000/api/admin/stats", { headers });
}

const findUnique = vi.mocked(db.user.findUnique);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createSessionToken / verifySessionToken", () => {
  it("جولة كاملة: توكن صحيح يعيد الحمولة مطابقة", () => {
    const token = createSessionToken(ADMIN);
    const payload = verifySessionToken(token);
    expect(payload).not.toBeNull();
    expect(payload!.sub).toBe(ADMIN.id);
    expect(payload!.email).toBe(ADMIN.email);
    expect(payload!.role).toBe("admin");
    expect(payload!.exp - payload!.iat).toBe(SESSION_TTL_SECONDS);
  });

  it("صيغة التوكن: base64url(payload).hex(signature)", () => {
    const token = createSessionToken(ADMIN);
    expect(token).toMatch(/^[A-Za-z0-9_-]+\.[0-9a-f]{64}$/);
  });

  it("عبث في الحمولة → رفض", () => {
    const token = createSessionToken(ADMIN);
    const [body, sig] = token.split(".");
    // حمولة مختلفة بنفس التوقيع الأصلي
    const forged = Buffer.from(JSON.stringify({ sub: "hacker", role: "admin", exp: 9999999999 })).toString("base64url");
    expect(verifySessionToken(`${forged}.${sig}`)).toBeNull();
    // حمولة أصلية بتوقيع مزيف
    const badSig = "0".repeat(64);
    expect(verifySessionToken(`${body}.${badSig}`)).toBeNull();
  });

  it("انتهاء الصلاحية → رفض (محاكاة مرور 9 ساعات)", () => {
    vi.useFakeTimers();
    const token = createSessionToken(ADMIN);
    vi.setSystemTime(Date.now() + (SESSION_TTL_SECONDS + 3600) * 1000);
    expect(verifySessionToken(token)).toBeNull();
    vi.useRealTimers();
  });

  it("مدخلات تالفة: فارغ/بلا نقطة/حمولة غير Base64/حمولة غير JSON", () => {
    expect(verifySessionToken(null)).toBeNull();
    expect(verifySessionToken(undefined)).toBeNull();
    expect(verifySessionToken("")).toBeNull();
    expect(verifySessionToken("nodot")).toBeNull();
    expect(verifySessionToken(".")).toBeNull();
    expect(verifySessionToken("!!!.####")).toBeNull();
    const junk = Buffer.from("not-json").toString("base64url");
    expect(verifySessionToken(`${junk}.${"0".repeat(64)}`)).toBeNull();
  });
});

describe("requireAdmin — الحرس الخادمي", () => {
  it("بلا أي توكن (كوكي أو Bearer) → 401", async () => {
    const g = await requireAdmin(req());
    expect(g.ok).toBe(false);
    if (!g.ok) expect(g.response.status).toBe(401);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("توكن بدور user → 401 بلا استعلام قاعدة", async () => {
    const g = await requireAdmin(req({ bearer: createSessionToken(USER) }));
    expect(g.ok).toBe(false);
    if (!g.ok) expect(g.response.status).toBe(401);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("توكن admin + الدور الحي admin → سماح مع بيانات المستخدم", async () => {
    findUnique.mockResolvedValueOnce({ id: ADMIN.id, email: ADMIN.email, name: "المدير", role: "admin" } as never);
    const g = await requireAdmin(req({ bearer: createSessionToken(ADMIN) }));
    expect(g.ok).toBe(true);
    if (g.ok) expect(g.user.id).toBe(ADMIN.id);
    expect(findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: ADMIN.id } })
    );
  });

  it("توكن admin لكن سُحب الدور في القاعدة (role=user) → 401", async () => {
    findUnique.mockResolvedValueOnce({ id: ADMIN.id, email: ADMIN.email, name: "م", role: "user" } as never);
    const g = await requireAdmin(req({ bearer: createSessionToken(ADMIN) }));
    expect(g.ok).toBe(false);
    if (!g.ok) expect(g.response.status).toBe(401);
  });

  it("توكن admin لمستخدم محذوف من القاعدة → 401", async () => {
    findUnique.mockResolvedValueOnce(null as never);
    const g = await requireAdmin(req({ bearer: createSessionToken(ADMIN) }));
    expect(g.ok).toBe(false);
  });

  it("كوكي HttpOnly يعمل بديلاً عن Bearer", async () => {
    findUnique.mockResolvedValueOnce({ id: ADMIN.id, email: ADMIN.email, name: "المدير", role: "admin" } as never);
    const token = createSessionToken(ADMIN);
    const g = await requireAdmin(req({ cookie: `${SESSION_COOKIE}=${token}` }));
    expect(g.ok).toBe(true);
  });

  it("خطأ قاعدة البيانات → 500 (لا انهيار ولا سماح)", async () => {
    findUnique.mockRejectedValueOnce(new Error("db down"));
    const g = await requireAdmin(req({ bearer: createSessionToken(ADMIN) }));
    expect(g.ok).toBe(false);
    if (!g.ok) expect(g.response.status).toBe(500);
  });
});
