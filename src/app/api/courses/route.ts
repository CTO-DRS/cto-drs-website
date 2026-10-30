import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const courses = await db.course.findMany({
      orderBy: [{ featured: "desc" }, { students: "desc" }],
    });

    const parsed = courses.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      description: c.description,
      image: c.image,
      instructor: c.instructor,
      level: c.level,
      durationHours: c.durationHours,
      lessons: c.lessons,
      price: c.price,
      oldPrice: c.oldPrice,
      rating: c.rating,
      students: c.students,
      category: c.category,
      featured: c.featured,
    }));

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("courses error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}
