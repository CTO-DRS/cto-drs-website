"use client";

import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { EmptyState } from "@/components/screen-state";
import { Button } from "@/components/ui/button";
import { useAppRouter } from "@/lib/router";
import { cartCount, useAppStore } from "@/lib/store";

/** شاشة المفضلة — المنتجات المحفوظة محلياً في المتصفح */
export function WishlistScreen() {
  const { navigate } = useAppRouter();
  const { wishlist, removeFromWishlist, clearWishlist, addToCart } = useAppStore();

  const moveAllToCart = () => {
    wishlist.forEach((w) =>
      addToCart({ id: w.id, name: w.name, price: w.price, image: w.image } as never)
    );
    clearWishlist();
  };

  return (
    <>
      <PageHero
        badge="WISHLIST • ACCOUNT"
        title="قائمة"
        highlight="المفضلة"
        subtitle="المنتجات والدورات التي حفظتها للرجوع إليها لاحقاً — محفوظة في متصفحك"
      />

      <section className="px-4 py-14">
        <div className="mx-auto max-w-6xl">
          {wishlist.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="قائمة المفضلة فارغة"
              description="تصفح المتجر وأضف ما يعجبك هنا بالضغط على أيقونة القلب."
              action={
                <Button
                  onClick={() => navigate({ name: "store" })}
                  className="btn-gradient h-11 rounded-xl px-6"
                >
                  <ShoppingBag className="h-4 w-4" />
                  تصفح المتجر
                </Button>
              }
            />
          ) : (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-sec">
                  <span className="font-bold text-cyber">{wishlist.length}</span> عناصر محفوظة
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearWishlist}
                    className="rounded-full border-[rgba(255,42,109,0.35)] text-[#ff2a6d] hover:bg-[rgba(255,42,109,0.08)]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    إفراغ القائمة
                  </Button>
                  <Button size="sm" onClick={moveAllToCart} className="btn-gradient rounded-full">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    أضف الكل للسلة ({cartCount(wishlist as never)})
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {wishlist.map((w, i) => (
                  <Reveal key={w.id} delay={i * 60}>
                    <div className="card-glow group flex h-full flex-col rounded-2xl p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-2 min-w-0 text-sm font-bold text-main">
                          {w.name}
                        </h3>
                        <button
                          onClick={() => removeFromWishlist(w.id)}
                          aria-label={`إزالة ${w.name} من المفضلة`}
                          className="shrink-0 rounded-lg p-1.5 text-mute transition hover:bg-[rgba(255,42,109,0.08)] hover:text-[#ff2a6d]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-3 text-lg font-extrabold text-cyber">
                        {w.price.toLocaleString("en-US")} ر.س
                      </p>
                      <div className="mt-auto flex gap-2 pt-4">
                        <Button
                          size="sm"
                          onClick={() => addToCart({ id: w.id, name: w.name, price: w.price, image: w.image } as never)}
                          className="btn-gradient h-9 flex-1 rounded-xl text-xs"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          أضف للسلة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromWishlist(w.id)}
                          className="h-9 rounded-xl border-border-strong px-3 text-xs text-sec"
                        >
                          إزالة
                        </Button>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
