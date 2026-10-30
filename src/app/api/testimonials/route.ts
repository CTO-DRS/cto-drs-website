import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function serialize(t: {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  createdAt: Date;
}) {
  return {
    id: t.id,
    name: t.name,
    role: t.role,
    content: t.content,
    rating: t.rating,
    createdAt: t.createdAt.toISOString(),
  };
}

export async function GET(_req: NextRequest) {
  try {
    const testimonials = await db.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(testimonials.map(serialize));
  } catch (err) {
    console.error("testimonials GET error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const role = typeof body.role === "string" ? body.role.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const rating = body.rating;

    if (name.length < 2) {
      return NextResponse.json({ error: "الرجاء إدخال الاسم الكامل" }, { status: 400 });
    }
    if (!role) {
      return NextResponse.json({ error: "الرجاء إدخال المسمى الوظيفي" }, { status: 400 });
    }
    if (content.length < 5) {
      return NextResponse.json(
        { error: "الرجاء كتابة رأيك بما لا يقل عن 5 أحرف" },
        { status: 400 }
      );
    }
    if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "التقييم يجب أن يكون رقماً من 1 إلى 5" }, { status: 400 });
    }

    const created = await db.testimonial.create({
      data: {
        name: name.slice(0, 80),
        role: role.slice(0, 120),
        content: content.slice(0, 1000),
        rating,
      },
    });

    return NextResponse.json(serialize(created), { status: 201 });
  } catch (err) {
    console.error("testimonials POST error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}
