import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { rateLimit, tooManyRequests, RATE_LIMITS } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface IncomingItem {
  id?: string;
  name: string;
  price: number;
  qty: number;
}

function serialize(o: {
  id: string;
  customerName: string;
  email: string;
  items: string;
  total: number;
  status: string;
  createdAt: Date;
}) {
  return {
    id: o.id,
    customerName: o.customerName,
    email: o.email,
    items: JSON.parse(o.items) as IncomingItem[],
    total: o.total,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
  };
}

export async function GET(req: NextRequest) {
  // قراءة الطلبات = بيانات شخصية ومالية — جلسة إدارية مطلوبة (F-01)
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;
  try {
    const email = req.nextUrl.searchParams.get("email");

    const orders = await db.order.findMany({
      where: email ? { email: email.trim().toLowerCase() } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders.map(serialize));
  } catch (err) {
    console.error("orders GET error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, "orders", RATE_LIMITS.orders.limit, RATE_LIMITS.orders.windowMs);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
    }

    const customerName = typeof body.customerName === "string" ? body.customerName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const items = Array.isArray(body.items) ? body.items : [];
    const total = body.total;

    if (customerName.length < 2) {
      return NextResponse.json({ error: "الرجاء إدخال الاسم الكامل" }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "الرجاء إدخال بريد إلكتروني صحيح" }, { status: 400 });
    }
    if (items.length === 0) {
      return NextResponse.json({ error: "سلة الطلب فارغة، أضف منتجات أولاً" }, { status: 400 });
    }
    if (typeof total !== "number" || !Number.isFinite(total) || total < 0) {
      return NextResponse.json({ error: "قيمة الإجمالي غير صحيحة" }, { status: 400 });
    }

    const cleanItems: IncomingItem[] = items.map((it: Record<string, unknown>) => ({
      id: typeof it.id === "string" ? it.id : undefined,
      name: String(it.name ?? "").slice(0, 200),
      price: Number(it.price) || 0,
      qty: Math.max(1, Number(it.qty) || 1),
    }));

    const created = await db.order.create({
      data: {
        customerName,
        email,
        items: JSON.stringify(cleanItems),
        total: Math.round(total),
        status: "pending",
      },
    });

    return NextResponse.json(serialize(created), { status: 201 });
  } catch (err) {
    console.error("orders POST error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}
