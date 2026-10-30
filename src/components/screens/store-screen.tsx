"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  Package,
  Puzzle,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/screen-state";
import { toast } from "@/hooks/use-toast";
import { useAppRouter } from "@/lib/router";
import { cartCount, useAppStore } from "@/lib/store";
import { useApi } from "@/lib/use-api";
import type { Product } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fmtPrice = (n: number) => n.toLocaleString("en-US") + " ر.س";

const CATEGORIES = ["الكل", "قوالب", "أدوات", "إضافات", "كتب"] as const;

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  قوالب: Package,
  أدوات: Wrench,
  إضافات: Puzzle,
  كتب: BookOpen,
};

type SortKey = "sales" | "rating" | "price-asc" | "price-desc";

export function StoreScreen() {
  const { navigate } = useAppRouter();
  const { cart, addToCart } = useAppStore();
  const count = cartCount(cart);

  const { data, loading, error, reload } = useApi<Product[]>("/api/products");

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("الكل");
  const [sort, setSort] = useState<SortKey>("sales");

  const products = useMemo(() => data ?? [], [data]);

  const filtered = useMemo(() => {
    const q = query.trim();
    let list = products.filter((p) => {
      const matchCategory = category === "الكل" || p.category === category;
      const matchQuery =
        !q ||
        p.name.includes(q) ||
        p.description.includes(q) ||
        p.category.includes(q);
      return matchCategory && matchQuery;
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "rating":
          return b.rating - a.rating;
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "sales":
        default:
          return b.sales - a.sales;
      }
    });
    return list;
  }, [products, query, category, sort]);

  const handleAddToCart = (p: Product) => {
    addToCart(p);
    toast({ title: "أُضيف إلى السلة", description: p.name });
  };

  const handleBuyNow = (p: Product) => {
    addToCart(p);
    navigate({ name: "checkout" });
  };

  return (
    <>
      <PageHero
        badge="STORE.DIGITAL"
        title="المتجر"
        highlight="الرقمي"
        subtitle="منتجات جاهزة تسرّع عملك — قوالب، أدوات، إضافات وكتب تقنية بتحميل فوري"
      />

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
        {/* toolbar */}
        <Reveal>
          <div className="mb-6 flex flex-col gap-4">
            {/* mini banner */}
            <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3">
              <p className="text-xs text-sec">
                <span className="font-mono-cyber font-bold text-cyber">
                  {filtered.length}
                </span>{" "}
                منتج متوفر — تحميل فوري بعد الشراء
              </p>
              <button
                type="button"
                onClick={() => navigate({ name: "cart" })}
                aria-label="عرض السلة"
                className="relative flex h-10 items-center gap-2 rounded-xl border border-[rgba(255,42,109,0.35)] bg-[rgba(255,42,109,0.08)] px-4 text-xs font-bold text-[#ff2a6d] transition hover:bg-[rgba(255,42,109,0.15)]"
              >
                <ShoppingCart className="h-4 w-4" />
                السلة
                {count > 0 && (
                  <span className="absolute -top-1.5 -end-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff2a6d] px-1 font-mono-cyber text-[10px] font-bold text-white">
                    {count}
                  </span>
                )}
              </button>
            </div>

            {/* search + sort */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mute"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ابحث عن منتج..."
                  aria-label="البحث في المتجر"
                  className="h-11 w-full rounded-xl border border-border-strong bg-elev-2/60 ps-10 pe-4 text-sm text-main outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.15)]"
                />
              </div>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger
                  aria-label="ترتيب المنتجات"
                  className="h-11 w-full rounded-xl border-border-strong bg-elev-2/60 text-sm font-medium text-main focus:border-[rgba(0,240,255,0.5)] focus:ring-0 sm:w-52"
                >
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border-strong bg-elev text-main">
                  <SelectItem value="sales">الأكثر مبيعاً</SelectItem>
                  <SelectItem value="rating">الأعلى تقييماً</SelectItem>
                  <SelectItem value="price-asc">السعر: من الأقل</SelectItem>
                  <SelectItem value="price-desc">السعر: من الأعلى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* category pills */}
            <div
              className="flex flex-wrap items-center gap-2"
              role="group"
              aria-label="تصفية حسب الفئة"
            >
              {CATEGORIES.map((c) => {
                const active = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                      active
                        ? "border-[rgba(0,240,255,0.5)] bg-[rgba(0,240,255,0.08)] text-cyber shadow-[0_0_14px_rgba(0,240,255,0.15)]"
                        : "border-border-strong text-sec hover:border-[rgba(0,240,255,0.35)] hover:text-cyber"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* states */}
        {loading && <ListSkeleton count={6} />}

        {!loading && error && <ErrorState message={error} onRetry={reload} />}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={Search}
            title="لا توجد نتائج"
            description="جرّب كلمة بحث مختلفة أو اختر فئة أخرى من الأعلى."
          />
        )}

        {/* grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => {
              const Icon = CATEGORY_ICONS[p.category] ?? Package;
              const discount =
                p.oldPrice && p.oldPrice > p.price
                  ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
                  : 0;
              return (
                <Reveal key={p.id} delay={Math.min(i * 60, 300)} className="h-full">
                  <article className="card-glow group flex h-full flex-col overflow-hidden rounded-2xl">
                    {/* image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-elev-2">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[rgba(0,240,255,0.15)] to-[rgba(255,42,109,0.15)]">
                          <Icon
                            className="h-12 w-12 text-cyber opacity-70 transition duration-500 group-hover:scale-110"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                      {p.featured && (
                        <span className="absolute start-3 top-3 flex items-center gap-1 rounded-full border border-[rgba(255,215,0,0.45)] bg-[rgba(255,215,0,0.15)] px-2.5 py-1 text-[10px] font-bold text-[#ffd700] backdrop-blur-sm">
                          <Sparkles className="h-3 w-3" aria-hidden="true" />
                          الأكثر طلباً
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="absolute end-3 top-3 rounded-full border border-[rgba(255,42,109,0.45)] bg-[rgba(255,42,109,0.18)] px-2.5 py-1 font-mono-cyber text-[10px] font-bold text-[#ff2a6d] backdrop-blur-sm">
                          خصم {discount}%
                        </span>
                      )}
                    </div>

                    {/* body */}
                    <div className="flex flex-1 flex-col gap-2.5 p-5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="tag-pill">{p.category}</span>
                        <div className="flex items-center gap-1.5">
                          <Star
                            className="h-3.5 w-3.5 text-[#ffd700]"
                            fill="#ffd700"
                            aria-hidden="true"
                          />
                          <span className="font-mono-cyber text-xs font-bold text-main">
                            {p.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-mute">
                            ({p.sales} عملية بيع)
                          </span>
                        </div>
                      </div>

                      <h3 className="line-clamp-1 text-base font-bold text-main">
                        {p.name}
                      </h3>

                      <p className="line-clamp-2 text-xs leading-5 text-sec">
                        {p.description}
                      </p>

                      <div className="mt-auto flex items-baseline gap-2 pt-2">
                        <span className="font-mono-cyber text-lg font-extrabold text-cyber">
                          {fmtPrice(p.price)}
                        </span>
                        {p.oldPrice && p.oldPrice > p.price && (
                          <span className="font-mono-cyber text-xs text-mute line-through">
                            {fmtPrice(p.oldPrice)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(p)}
                          aria-label="أضف إلى السلة"
                          title="أضف إلى السلة"
                          className="btn-gradient-pink flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition"
                        >
                          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBuyNow(p)}
                          className="btn-outline-cyber h-10 flex-1 rounded-xl text-xs font-bold"
                        >
                          شراء الآن
                        </button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* floating cart FAB (mobile) */}
      <button
        type="button"
        onClick={() => navigate({ name: "cart" })}
        aria-label="عرض السلة"
        className="btn-gradient fixed bottom-20 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full lg:hidden"
      >
        <ShoppingCart className="h-5 w-5" aria-hidden="true" />
        {count > 0 && (
          <span className="absolute -top-1 -end-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff2a6d] px-1 font-mono-cyber text-[10px] font-bold text-white">
            {count}
          </span>
        )}
      </button>
    </>
  );
}
