import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/admin/subscribers — قائمة المشتركين في النشرة البريدية */
export async function GET(_req: NextRequest) {
  try {
    const subscribers = await db.subscriber.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      subscribers.map((s) => ({
        id: s.id,
        email: s.email,
        createdAt: s.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    console.error("admin subscribers GET error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}
