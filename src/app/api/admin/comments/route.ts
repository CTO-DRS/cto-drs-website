import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/admin/comments — جميع التعليقات مع عنوان المقال (للإشراف) */
export async function GET(_req: NextRequest) {
  try {
    const comments = await db.comment.findMany({
      include: { post: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      comments.map((c) => ({
        id: c.id,
        postId: c.postId,
        postTitle: c.post.title,
        authorName: c.authorName,
        content: c.content,
        createdAt: c.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    console.error("admin comments GET error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}
