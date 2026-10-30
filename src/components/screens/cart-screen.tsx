"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { EmptyState } from "@/components/screen-state";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useAppRouter } from "@/lib/router";
import { cartTotal, useAppStore } from "@/lib/store";
import type { CartLine } from "@/lib/types";

const fmtPrice = (n: number) => n.toLocaleString("en-US") + " ر.س";

const VAT_RATE = 0.15;
const COUPON_CODE = "CTO10";
const COUPON_RATE = 0.1;

export function CartScreen() {
  const { navigate } = useAppRouter();
  const { cart, setQty, removeFromCart } = useAppStore();

  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(false);

  const subtotal = cartTotal(cart);
  const discount = applied ? subtotal * COUPON_RATE : 0;
  const afterDiscount = subtotal - discount;
  const vat = afterDiscount * VAT_RATE;
  const total = afterDiscount + vat;

  const applyCoupon = () => {
    if (code.trim().toUpperCase() === COUPON_CODE) {
      setApplied(true);
      try {
        sessionStorage.setItem("cto-drs-discount", String(COUPON_RATE));
      } catch {
        /* ignore */
      }
      toast({
        title: "تم تطبيق الخصم",
        description: `حصلت على خصم ${COUPON_RATE * 100}% عبر كود ${COUPON_CODE}`,
      });
    } else {
      toast({
        title: "كود غير صالح",
        description: "تحقق من الكود وحاول مرة أخرى",
        variant: "destructive",
      });
    }
  };

  const removeCoupon = () => {
    setApplied(false);
    setCode("");
    try {
      sessionStorage.removeItem("cto-drs-discount");
    } catch {
      /* ignore */
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <PageHero
          badge="CART.STAGE"
          title="سلة"
          highlight="المشتريات"
          subtitle="راجع طلبك قبل إتمام الشراء — خصم فوري عند استخدام كود الترحيب"
        />
        <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
          <EmptyState
            icon={ShoppingCart}
            title="سلتك فارغة"
            description="لم تضف أي منتجات بعد — تصفح المتجر واختر ما يناسب مشروعك."
            action={
              <button
                type="button"
                onClick={() => navigate({ name: "store" })}
                className="btn-gradient rounded-xl px-6 py-2.5 text-sm font-bold"
              >
                تصفح المتجر
              </button>
            }
          />
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        badge="CART.STAGE"
        title="سلة"
        highlight="المشتريات"
        subtitle="راجع طلبك قبل إتمام الشراء — خصم فوري عند استخدام كود الترحيب"
      />

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* lines */}
          <div className="space-y-4 lg:col-span-2">
            {cart.map((line, i) => (
              <Reveal key={line.id} delay={Math.min(i * 60, 240)}>
                <CartLineRow line={line} onRemove={removeFromCart} onQty={setQty} />
              </Reveal>
            ))}
          </div>

          {/* summary */}
          <Reveal delay={120} className="lg:col-span-1">
            <div className="card-glow self-start rounded-2xl p-6 lg:sticky lg:top-28">
              <h2 className="font-heading-cyber text-lg font-bold text-main">
                ملخص الطلب
              </h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between text-sec">
                  <span>المجموع الفرعي</span>
                  <span className="font-mono-cyber font-bold text-main">
                    {fmtPrice(subtotal)}
                  </span>
                </div>

                {applied ? (
                  <div className="flex items-center justify-between rounded-lg border border-[rgba(0,255,136,0.35)] bg-[rgba(0,255,136,0.07)] px-3 py-2 text-xs">
                    <span className="font-bold text-[#00ff88]">
                      كود {COUPON_CODE} مُفعّل — خصم {COUPON_RATE * 100}%
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      aria-label="إزالة كود الخصم"
                      className="text-[#00ff88] transition hover:text-main"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="coupon-code"
                      className="mb-1.5 block text-xs font-bold text-sec"
                    >
                      كود الخصم
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="coupon-code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            applyCoupon();
                          }
                        }}
                        placeholder="مثال: CTO10"
                        aria-label="كود الخصم"
                        dir="ltr"
                        className="h-10 flex-1 rounded-xl border border-border-strong bg-elev-2/60 px-3 font-mono-cyber text-sm text-main outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.15)]"
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        disabled={code.trim().length === 0}
                        className="btn-outline-cyber h-10 rounded-xl px-4 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        تطبيق
                      </button>
                    </div>
                  </div>
                )}

                {applied && (
                  <div className="flex items-center justify-between text-sec">
                    <span>الخصم</span>
                    <span className="font-mono-cyber font-bold text-[#00ff88]">
                      -{fmtPrice(discount)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sec">
                  <span>ضريبة القيمة المضافة (15%)</span>
                  <span className="font-mono-cyber font-bold text-main">
                    {fmtPrice(vat)}
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-main">الإجمالي</span>
                <span className="font-mono-cyber text-2xl font-extrabold text-cyber">
                  {fmtPrice(total)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate({ name: "checkout" })}
                className="btn-gradient mt-5 h-12 w-full rounded-xl text-sm"
              >
                إتمام الشراء
              </button>

              <button
                type="button"
                onClick={() => navigate({ name: "store" })}
                className="mt-3 w-full text-center text-xs text-mute underline-offset-4 transition hover:text-cyber hover:underline"
              >
                متابعة التسوق
              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-mute">
                <ShieldCheck
                  className="h-4 w-4 text-[#00ff88]"
                  aria-hidden="true"
                />
                <span>دفع آمن • تحميل فوري • ضمان 14 يوماً</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ── single cart line ── */
function CartLineRow({
  line,
  onRemove,
  onQty,
}: {
  line: CartLine;
  onRemove: (id: string) => void;
  onQty: (id: string, qty: number) => void;
}) {
  return (
    <div className="card-glow flex items-center gap-4 rounded-2xl p-4">
      {/* thumbnail */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border-soft bg-elev-2">
        {line.image ? (
          <Image src={line.image} alt={line.name} fill sizes="64px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[rgba(0,240,255,0.15)] to-[rgba(255,42,109,0.15)]">
            <LineThumbIcon />
          </div>
        )}
      </div>

      {/* info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-bold text-main">{line.name}</h3>
          <button
            type="button"
            onClick={() => onRemove(line.id)}
            aria-label="إزالة"
            title="إزالة من السلة"
            className="shrink-0 rounded-lg p-1.5 text-[#ff2a6d] transition hover:bg-[rgba(255,42,109,0.1)]"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-1 font-mono-cyber text-xs text-mute">
          {fmtPrice(line.price)} / للوحدة
        </p>

        <div className="mt-3 flex items-center justify-between">
          {/* qty controls */}
          <div className="flex items-center gap-1" role="group" aria-label="كمية المنتج">
            <button
              type="button"
              onClick={() => onQty(line.id, line.qty - 1)}
              aria-label="إنقاص الكمية"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong text-sec transition hover:border-[rgba(0,240,255,0.5)] hover:text-cyber"
            >
              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <span className="font-mono-cyber w-8 text-center text-sm font-bold text-main">
              {line.qty}
            </span>
            <button
              type="button"
              onClick={() => onQty(line.id, line.qty + 1)}
              aria-label="زيادة الكمية"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong text-sec transition hover:border-[rgba(0,240,255,0.5)] hover:text-cyber"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* line total */}
          <span className="font-mono-cyber text-sm font-bold text-cyber">
            {fmtPrice(line.qty * line.price)}
          </span>
        </div>
      </div>
    </div>
  );
}

function LineThumbIcon() {
  const Icon: LucideIcon = Package;
  return <Icon className="h-6 w-6 text-cyber opacity-70" aria-hidden="true" />;
}
