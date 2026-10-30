import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const projects = await db.project.findMany({
      orderBy: [{ featured: "desc" }, { year: "desc" }],
    });

    const parsed = projects.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      image: p.image,
      tags: JSON.parse(p.tags) as string[],
      category: p.category,
      demoUrl: p.demoUrl,
      githubUrl: p.githubUrl,
      year: p.year,
      featured: p.featured,
    }));

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("projects error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}
