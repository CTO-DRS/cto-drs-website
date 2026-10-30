import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (name.length < 2) {
      return NextResponse.json({ error: "الرجاء إدخال الاسم الكامل" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "الرجاء إدخال بريد إلكتروني صحيح" }, { status: 400 });
    }
    if (message.length < 10) {
      return NextResponse.json({ error: "الرجاء كتابة تفاصيل المشروع (10 أحرف على الأقل)" }, { status: 400 });
    }

    const saved = await db.contactMessage.create({
      data: { name, email, message: message.slice(0, 5000) },
    });

    return NextResponse.json({ ok: true, id: saved.id });
  } catch (err) {
    console.error("contact error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}
