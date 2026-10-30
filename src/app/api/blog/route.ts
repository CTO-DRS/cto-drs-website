import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("slug");

    const posts = await db.post.findMany({
      where: slug ? { slug } : undefined,
      orderBy: { publishedAt: "desc" },
    });

    const parsed = posts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      cover: p.cover,
      author: p.author,
      tags: JSON.parse(p.tags) as string[],
      views: p.views,
      publishedAt: p.publishedAt.toISOString(),
    }));

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("blog error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}
