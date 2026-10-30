import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const services = await db.service.findMany({
      orderBy: [{ featured: "desc" }, { price: "asc" }],
    });

    const parsed = services.map((s) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      description: s.description,
      icon: s.icon,
      price: s.price,
      duration: s.duration,
      features: JSON.parse(s.features) as string[],
      category: s.category,
      featured: s.featured,
    }));

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("services error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}
