import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** DELETE /api/admin/subscribers/[id] — إزالة مشترك */
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    await db.subscriber.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin subscriber DELETE error:", err);
    return NextResponse.json({ error: "تعذر حذف المشترك" }, { status: 500 });
  }
}
