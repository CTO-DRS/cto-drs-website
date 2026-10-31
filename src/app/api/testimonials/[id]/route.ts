import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** DELETE /api/testimonials/[id] — إزالة رأي عميل (إشراف المدير) */
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    await db.testimonial.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("testimonial DELETE error:", err);
    return NextResponse.json({ error: "تعذر حذف الرأي" }, { status: 500 });
  }
}
