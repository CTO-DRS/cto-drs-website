import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit, tooManyRequests, RATE_LIMITS } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

function serialize(c: {
  id: string;
  postId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}) {
  return {
    id: c.id,
    postId: c.postId,
    authorName: c.authorName,
    content: c.content,
    createdAt: c.createdAt.toISOString(),
  };
}

export async function GET(req: NextRequest) {
  try {
    const postId = req.nextUrl.searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "معرف المقال مطلوب" }, { status: 400 });
    }

    const post = await db.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "المقال غير موجود" }, { status: 400 });
    }

    const comments = await db.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments.map(serialize));
  } catch (err) {
    console.error("comments GET error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, "comments", RATE_LIMITS.comments.limit, RATE_LIMITS.comments.windowMs);
  if (!rl.ok) return tooManyRequests(rl.retryAfter);
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
    }

    const postId = typeof body.postId === "string" ? body.postId.trim() : "";
    const authorName = typeof body.authorName === "string" ? body.authorName.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";

    if (!postId) {
      return NextResponse.json({ error: "معرف المقال مطلوب" }, { status: 400 });
    }

    const post = await db.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "المقال غير موجود" }, { status: 400 });
    }

    if (authorName.length < 2) {
      return NextResponse.json({ error: "الرجاء إدخال اسم لا يقل عن حرفين" }, { status: 400 });
    }
    if (content.length < 3) {
      return NextResponse.json({ error: "الرجاء كتابة تعليق لا يقل عن 3 أحرف" }, { status: 400 });
    }

    const created = await db.comment.create({
      data: {
        postId,
        authorName: authorName.slice(0, 80),
        content: content.slice(0, 2000),
      },
    });

    return NextResponse.json(serialize(created), { status: 201 });
  } catch (err) {
    console.error("comments POST error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}
