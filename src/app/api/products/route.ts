import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const products = await db.product.findMany({
      orderBy: [{ featured: "desc" }, { sales: "desc" }],
    });

    const parsed = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      oldPrice: p.oldPrice,
      image: p.image,
      category: p.category,
      rating: p.rating,
      sales: p.sales,
      featured: p.featured,
    }));

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("products error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي، حاول لاحقاً" }, { status: 500 });
  }
}
