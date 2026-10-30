import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// أسماء الأشهر بالعربية (يناير = 0)
const AR_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export async function GET(_req: NextRequest) {
  try {
    const [
      users,
      bookings,
      messages,
      orders,
      subscribers,
      courses,
      products,
      posts,
    ] = await Promise.all([
      db.user.count(),
      db.booking.count(),
      db.contactMessage.count(),
      db.order.findMany({ select: { total: true, createdAt: true } }),
      db.subscriber.count(),
      db.course.count(),
      db.product.count(),
      db.post.count(),
    ]);

    const revenue = orders.reduce((sum, o) => sum + o.total, 0);

    // آخر 6 أشهر (الأقدم أولاً)
    const now = new Date();
    const monthly: { label: string; orders: number; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthly.push({ label: AR_MONTHS[d.getMonth()], orders: 0, revenue: 0 });
    }

    for (const o of orders) {
      const d = o.createdAt;
      const idx = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      if (idx >= 0 && idx <= 5) {
        const bucket = monthly[5 - idx];
        bucket.orders += 1;
        bucket.revenue += o.total;
      }
    }

    const [recentBookings, recentOrders, recentMessages] = await Promise.all([
      db.booking.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      db.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

    return NextResponse.json({
      users,
      bookings,
      messages,
      orders: orders.length,
      revenue,
      subscribers,
      courses,
      products,
      posts,
      monthly,
      recentBookings: recentBookings.map((b) => ({
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
      })),
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        customerName: o.customerName,
        email: o.email,
        items: JSON.parse(o.items),
        total: o.total,
        status: o.status,
        createdAt: o.createdAt.toISOString(),
      })),
      recentMessages: recentMessages.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        subject: m.subject,
        message: m.message,
        read: m.read,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("admin stats error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}
