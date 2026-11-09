/**
 * جلسة خادمية موقّعة (HMAC-SHA256) — تُغلق F-01/F-02 من تقرير الفحص الشامل.
 *
 * الخلفية: نقطة الدخول كانت تُرجع بيانات المستخدم JSON خالصاً دون جلسة أو كوكي،
 * والحماية كانت تعتمد على حالة العميل (localStorage) حصراً.
 *
 * التصميم:
 *   - توكن موقّع: base64url(payload).hex(HMAC_SHA256) حيث payload = {sub, email, role, iat, exp}
 *   - يُرسل في كوكي HttpOnly + SameSite=Lax (ويُقبل أيضاً في ترويسة Authorization: Bearer)
 *   - صلاحية 8 ساعات، والتحقق من الدور يتم حياً من قاعدة البيانات عند كل طلب إداري
 *     (دفاع ضد رمز قديم بعد تغيير صلاحية المستخدم)
 *   - السر من AUTH_SECRET (≥ 32 حرفاً). إن لم يُضبط يُولَّد سر عشوائي لكل عملية تشغيل
 *     (الجلسات تسقط عند إعادة التشغيل) مع تحذير — للإنتاج اضبط AUTH_SECRET دائماً.
 *
 * هذه الطبقة تعمل في وضع الخادم (standalone) حيث توجد نقاط /api/*.
 * النسخة الثابتة (static export) لا تملك نقاط API أصلاً والحماية فيها عبر Supabase + RLS.
 */
import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const SESSION_COOKIE = "cto_drs_session";
/** مدة الجلسة بالثواني (8 ساعات) */
export const SESSION_TTL_SECONDS = 8 * 60 * 60;

interface SessionPayload {
  /** معرف المستخدم في قاعدة البيانات */
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

let bootSecret: Buffer | null = null;

/** سر التوقيع: AUTH_SECRET إن ضُبط، وإلا سر عشوائي مؤقت لهذه العملية مع تحذير */
function signingSecret(): Buffer {
  const envSecret = (process.env.AUTH_SECRET ?? "").trim();
  if (envSecret.length >= 32) return Buffer.from(envSecret, "utf8");
  if (!bootSecret) {
    bootSecret = randomBytes(32);
    console.warn(
      "[session] AUTH_SECRET غير مضبوط أو أقصر من 32 حرفاً — تم توليد سر مؤقت لهذه العملية؛ " +
        "ستفقد كل الجلسات صلاحيتها عند إعادة التشغيل. اضبط AUTH_SECRET في الإنتاج."
    );
  }
  return bootSecret;
}

function b64url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function sign(body: string): string {
  return createHmac("sha256", signingSecret()).update(body).digest("hex");
}

/** إنشاء توكن جلسة موقّع لمستخدم */
export function createSessionToken(user: { id: string; email: string; role: string }): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };
  const body = b64url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

/** التحقق من التوكن: توقيع صحيح + لم تنته صلاحيته. يرجع الحمولة أو null */
export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token || typeof token !== "string") return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0 || dot === token.length - 1) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(body);
  if (sig.length !== expected.length) return null;
  try {
    if (!timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (typeof payload.sub !== "string" || typeof payload.role !== "string") return null;
    if (typeof payload.exp !== "number" || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function extractToken(req: NextRequest): string | undefined {
  const bearer = req.headers.get("authorization");
  if (bearer && bearer.slice(0, 7).toLowerCase() === "bearer ") return bearer.slice(7).trim();
  return req.cookies.get(SESSION_COOKIE)?.value;
}

export type AdminGuard =
  | { ok: true; user: { id: string; email: string; name: string; role: string } }
  | { ok: false; response: NextResponse };

function deny(): AdminGuard {
  return {
    ok: false,
    response: NextResponse.json(
      { error: "غير مصرح — يتطلب هذا المسار جلسة إدارية صالحة" },
      { status: 401 }
    ),
  };
}

/**
 * حرس المصادقة الإدارية — يستخدم في أعلى كل نقطة /api/admin/* وكل قراءة حساسة.
 * يقبل الكوكي HttpOnly أو ترويسة Authorization: Bearer <token>.
 * يتحقق من: التوقيع + الصلاحية + الدور admin في التوكن + الدور الفعلي في قاعدة البيانات.
 */
export async function requireAdmin(req: NextRequest): Promise<AdminGuard> {
  const payload = verifySessionToken(extractToken(req));
  if (!payload || payload.role !== "admin") return deny();
  try {
    const user = await db.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user || user.role !== "admin") return deny();
    return { ok: true, user };
  } catch (err) {
    console.error("admin auth db error:", err);
    return {
      ok: false,
      response: NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 }),
    };
  }
}

/** إرفاق كوكي الجلسة بالاستجابة (HttpOnly) — يُستدعى بعد نجاح تسجيل الدخول */
export function attachSessionCookie(res: NextResponse, token: string): NextResponse {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}
