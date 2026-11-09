import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** DELETE /api/admin/subscribers/[id] — إزالة مشترك — جلسة إدارية مطلوبة */
export async function DELETE(req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;
  try {
    const { id } = await ctx.params;
    await db.subscriber.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin subscriber DELETE error:", err);
    return NextResponse.json({ error: "تعذر حذف المشترك" }, { status: 500 });
  }
}
