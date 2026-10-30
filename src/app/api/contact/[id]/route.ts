import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** PATCH /api/contact/[id] — تعليم الرسالة كمقروءة / غير مقروءة */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = await req.json().catch(() => null);
    const read = body?.read;

    if (typeof read !== "boolean") {
      return NextResponse.json({ error: "قيمة القراءة غير صالحة" }, { status: 400 });
    }

    const updated = await db.contactMessage.update({
      where: { id },
      data: { read },
    });

    return NextResponse.json({
      ok: true,
      id: updated.id,
      read: updated.read,
    });
  } catch (err) {
    console.error("contact PATCH error:", err);
    return NextResponse.json({ error: "تعذر تحديث الرسالة" }, { status: 500 });
  }
}

/** DELETE /api/contact/[id] — حذف رسالة */
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact DELETE error:", err);
    return NextResponse.json({ error: "تعذر حذف الرسالة" }, { status: 500 });
  }
}
