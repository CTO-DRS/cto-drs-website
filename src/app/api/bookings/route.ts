import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { rateLimit, tooManyRequests, RATE_LIMITS } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;
type BookingStatus = (typeof VALID_STATUSES)[number];

function serialize(b: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  serviceType: string;
  date: string;
  timeSlot: string;
  notes: string | null;
  status: string;
  createdAt: Date;
}) {
  return {
    id: b.id,
    name: b.name,
    email: b.email,
    phone: b.phone,
    serviceType: b.serviceType,
    date: b.date,
    timeSlot: b.timeSlot,
    notes: b.notes,
    status: b.status,
    createdAt: b.createdAt.toISOString(),
  };
}

export async function GET(req: NextRequest) {
  // قراءة الحجوزات = بيانات شخصية — جلسة إدارية مطلوبة (F-01)
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;
  try {
    const email = req.nextUrl.searchParams.get("email");

    const bookings = await db.booking.findMany({
      where: email ? { email: email.trim().toLowerCase() } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings.map(serialize));
  } catch (err) {
    console.error("bookings GET error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, "bookings", RATE_LIMITS.bookings.limit, RATE_LIMITS.bookings.windowMs);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const serviceType = typeof body.serviceType === "string" ? body.serviceType.trim() : "";
    const date = typeof body.date === "string" ? body.date.trim() : "";
    const timeSlot = typeof body.timeSlot === "string" ? body.timeSlot.trim() : "";
    const notes = typeof body.notes === "string" ? body.notes.trim() : "";

    if (name.length < 2) {
      return NextResponse.json({ error: "الرجاء إدخال الاسم الكامل" }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "الرجاء إدخال بريد إلكتروني صحيح" }, { status: 400 });
    }
    if (!serviceType) {
      return NextResponse.json({ error: "الرجاء اختيار نوع الخدمة" }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: "الرجاء اختيار التاريخ" }, { status: 400 });
    }
    if (!timeSlot) {
      return NextResponse.json({ error: "الرجاء اختيار الفترة الزمنية" }, { status: 400 });
    }

    const created = await db.booking.create({
      data: {
        name,
        email,
        phone: phone || null,
        serviceType,
        date,
        timeSlot,
        notes: notes || null,
        status: "pending",
      },
    });

    return NextResponse.json(serialize(created), { status: 201 });
  } catch (err) {
    console.error("bookings POST error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  // تغيير حالة الحجز = عملية إدارية — جلسة إدارية مطلوبة (F-01)
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
    }

    const id = typeof body.id === "string" ? body.id.trim() : "";
    const status = typeof body.status === "string" ? body.status.trim() : "";

    if (!id) {
      return NextResponse.json({ error: "معرف الحجز مطلوب" }, { status: 400 });
    }
    if (!VALID_STATUSES.includes(status as BookingStatus)) {
      return NextResponse.json(
        { error: "حالة غير صالحة، القيم المسموحة: pending، confirmed، completed، cancelled" },
        { status: 400 }
      );
    }

    const existing = await db.booking.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "الحجز غير موجود" }, { status: 404 });
    }

    const updated = await db.booking.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(serialize(updated));
  } catch (err) {
    console.error("bookings PATCH error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}
