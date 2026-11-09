import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

/** GET /api/admin/comments — جميع التعليقات مع عنوان المقال (للإشراف) — جلسة إدارية مطلوبة */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;
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
