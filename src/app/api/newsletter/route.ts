import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "الرجاء إدخال بريد إلكتروني صحيح" }, { status: 400 });
    }

    const existing = await db.subscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ ok: true, message: "أنت مشترك بالفعل في النشرة البريدية" });
    }

    await db.subscriber.create({ data: { email } });
    return NextResponse.json({ ok: true, message: "تم الاشتراك بنجاح" });
  } catch (err) {
    console.error("newsletter error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}
