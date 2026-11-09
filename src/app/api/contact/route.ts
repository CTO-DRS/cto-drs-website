import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { COUNTRY_BY_CODE, PURPOSE_BY_ID, sanitizePhone } from "@/lib/contact-options";
import { requireAdmin } from "@/lib/session";
import { rateLimit, tooManyRequests, RATE_LIMITS } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(req: NextRequest) {
  // قراءة كل رسائل التواصل = بيانات شخصية — جلسة إدارية مطلوبة (F-01)
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;
  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    const parsed = messages.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      subject: m.subject,
      purpose: m.purpose,
      phone: m.phone,
      country: m.country,
      message: m.message,
      read: m.read,
      createdAt: m.createdAt.toISOString(),
    }));

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("contact GET error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const rl = rateLimit(req, "contact", RATE_LIMITS.contact.limit, RATE_LIMITS.contact.windowMs);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const purpose = typeof body.purpose === "string" ? body.purpose.trim() : "";
    const country = typeof body.country === "string" ? body.country.trim().toUpperCase() : "";
    const rawPhone = typeof body.phone === "string" ? sanitizePhone(body.phone) : "";

    if (name.length < 2) {
      return NextResponse.json({ error: "الرجاء إدخال الاسم الكامل" }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "الرجاء إدخال بريد إلكتروني صحيح" }, { status: 400 });
    }
    if (message.length < 10) {
      return NextResponse.json({ error: "الرجاء كتابة تفاصيل المشروع (10 أحرف على الأقل)" }, { status: 400 });
    }
    // هدف المراسلة: اختياري لكن يجب أن يكون من القائمة المعتمدة
    if (purpose && !PURPOSE_BY_ID[purpose]) {
      return NextResponse.json({ error: "هدف المراسلة غير صالح" }, { status: 400 });
    }
    // الدولة: اختيارية لكن يجب أن تكون من القائمة
    if (country && !COUNTRY_BY_CODE[country]) {
      return NextResponse.json({ error: "الدولة غير صالحة" }, { status: 400 });
    }
    // الجوال: إن وُجد يجب أن يكون 7–15 رقماً
    if (rawPhone && (rawPhone.length < 7 || rawPhone.length > 15)) {
      return NextResponse.json({ error: "رقم الجوال غير صحيح (7 أرقام على الأقل)" }, { status: 400 });
    }
    // رقم بدون دولة غير مقبول إذا اختار الدولة، والعكس مسموح
    const phone = country && rawPhone ? `${COUNTRY_BY_CODE[country].dial}${rawPhone}` : rawPhone || null;

    const saved = await db.contactMessage.create({
      data: {
        name,
        email,
        subject: subject ? subject.slice(0, 200) : purpose ? PURPOSE_BY_ID[purpose].label : null,
        purpose: purpose || null,
        phone,
        country: country || null,
        message: message.slice(0, 5000),
      },
    });

    return NextResponse.json({ ok: true, id: saved.id });
  } catch (err) {
    console.error("contact error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}
