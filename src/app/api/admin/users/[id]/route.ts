import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** PATCH /api/admin/users/[id] — تغيير صلاحية المستخدم */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = await req.json().catch(() => null);
    const role = body?.role;

    if (role !== "user" && role !== "admin") {
      return NextResponse.json({ error: "الصلاحية غير صالحة" }, { status: 400 });
    }

    const target = await db.user.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    // منع إزالة صلاحية آخر مدير في النظام
    if (target.role === "admin" && role === "user") {
      const admins = await db.user.count({ where: { role: "admin" } });
      if (admins <= 1) {
        return NextResponse.json(
          { error: "لا يمكن إزالة صلاحية آخر مدير في النظام" },
          { status: 400 }
        );
      }
    }

    const updated = await db.user.update({
      where: { id },
      data: { role },
      select: { id: true, role: true },
    });

    return NextResponse.json({ ok: true, ...updated });
  } catch (err) {
    console.error("admin user PATCH error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}

/** DELETE /api/admin/users/[id] — حذف مستخدم */
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;

    const target = await db.user.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    // منع حذف آخر مدير في النظام
    if (target.role === "admin") {
      const admins = await db.user.count({ where: { role: "admin" } });
      if (admins <= 1) {
        return NextResponse.json(
          { error: "لا يمكن حذف آخر مدير في النظام" },
          { status: 400 }
        );
      }
    }

    await db.user.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin user DELETE error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}
