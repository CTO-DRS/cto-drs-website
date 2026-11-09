import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSessionToken, attachSessionCookie } from "@/lib/session";
import { rateLimit, tooManyRequests, RATE_LIMITS } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // تقييد السرعة: مقاومة القوة الغاشمة على كلمات المرور (F-03)
  const rl = rateLimit(req, "login", RATE_LIMITS.login.limit, RATE_LIMITS.login.windowMs);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
    }

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }

    // جلسة خادمية موقّعة (HMAC) في كوكي HttpOnly — تُغلق F-02
    const token = createSessionToken({ id: user.id, email: user.email ?? "", role: user.role });
    const res = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    });
    return attachSessionCookie(res, token);
  } catch (err) {
    console.error("auth login error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}
