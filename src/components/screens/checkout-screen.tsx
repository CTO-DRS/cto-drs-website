"use client";

import { useEffect, useState } from "react";
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  Landmark,
  Loader2,
  LockKeyhole,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { EmptyState } from "@/components/screen-state";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAppRouter } from "@/lib/router";
import { cartTotal, useAppStore } from "@/lib/store";
import { sendJson } from "@/lib/use-api";
import type { Order } from "@/lib/types";

const fmtPrice = (n: number) => n.toLocaleString("en-US") + " ر.س";

const inputCls =
  "h-11 w-full rounded-xl border border-border-strong bg-elev-2/60 px-4 text-sm text-main outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.15)]";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PAYMENT_METHODS: {
  value: string;
  label: string;
  desc: string;
  icon: LucideIcon;
}[] = [
  { value: "card", label: "بطاقة بنكية", desc: "فيزا / ماستركارد / مدى", icon: CreditCard },
  { value: "transfer", label: "تحويل بنكي", desc: "تحويل مباشر إلى حسابنا", icon: Landmark },
  { value: "cod", label: "دفع عند الاستلام", desc: "ادفع عند التسليم", icon: Banknote },
];

const STATUS_AR: Record<string, string> = {
  pending: "قيد المعالجة",
  processing: "جاري التنفيذ",
  completed: "مكتمل",
  cancelled: "ملغي",
};

const VAT_RATE = 0.15;

export function CheckoutScreen() {
  const { navigate } = useAppRouter();
  const { user, cart, clearCart } = useAppStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState("card");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [discountRate, setDiscountRate] = useState(0);

  /* prefill from authenticated user once available */
  useEffect(() => {
    queueMicrotask(() => {
      if (user) {
        setName((n) => n || user.name);
        setEmail((e) => e || user.email);
      }
    });
  }, [user]);

  /* carry over coupon applied in the cart screen */
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const stored = sessionStorage.getItem("cto-drs-discount");
        if (stored) setDiscountRate(parseFloat(stored) || 0);
      } catch {
        /* ignore */
      }
    });
  }, []);

  const subtotal = cartTotal(cart);
  const discount = subtotal * discountRate;
  const afterDiscount = subtotal - discount;
  const vat = afterDiscount * VAT_RATE;
  const total = afterDiscount + vat;

  const validate = () => {
    const errs: { name?: string; email?: string } = {};
    if (name.trim().length < 2) errs.name = "الاسم مطلوب (حرفان على الأقل)";
    if (!EMAIL_RE.test(email.trim())) errs.email = "أدخل بريداً إلكترونياً صحيحاً";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const order = await sendJson<Order>("/api/orders", {
        customerName: name.trim(),
        email: email.trim(),
        items: cart.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
        total: Math.round(total),
      });
      setLastOrder(order);
      clearCart();
      try {
        sessionStorage.removeItem("cto-drs-discount");
      } catch {
        /* ignore */
      }
      toast({
        title: "تم استلام طلبك بنجاح!",
        description: `رقم الطلب: ${order.id}`,
      });
    } catch (err) {
      toast({
        title: "فشل إتمام الطلب",
        description: err instanceof Error ? err.message : "خطأ غير معروف",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndGoStore = () => {
    setLastOrder(null);
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setPayment("card");
    setErrors({});
    navigate({ name: "store" });
  };

  /* empty guard */
  if (cart.length === 0 && !lastOrder) {
    return (
      <>
        <PageHero
          badge="CHECKOUT.SECURE"
          title="إتمام"
          highlight="الشراء"
          subtitle="خطوة أخيرة تفصلك عن منتجاتك — بيانات مشفرة ودفع مرن"
        />
        <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
          <EmptyState
            icon={ShoppingCart}
            title="لا يوجد ما يتم دفعه"
            description="سلتك فارغة حالياً — أضف منتجات من المتجر ثم عد لإتمام الشراء."
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

  /* success panel */
  if (lastOrder) {
    return (
      <>
        <PageHero
          badge="CHECKOUT.SECURE"
          title="إتمام"
          highlight="الشراء"
          subtitle="خطوة أخيرة تفصلك عن منتجاتك — بيانات مشفرة ودفع مرن"
        />
        <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
          <Reveal>
            <div className="card-glow mx-auto max-w-xl rounded-2xl p-8 text-center">
              <CheckCircle2
                className="mx-auto h-16 w-16 text-[#00ff88]"
                aria-hidden="true"
              />
              <h2 className="font-heading-cyber mt-4 text-2xl font-extrabold text-main">
                تم استلام طلبك بنجاح!
              </h2>
              <p className="mt-2 text-sm text-sec">
                رقم الطلب:{" "}
                <span dir="ltr" className="font-mono-cyber font-bold text-cyber">
                  {lastOrder.id}
                </span>
              </p>

              <div className="mt-6 space-y-3 rounded-xl border border-border-soft bg-elev-2/40 p-4 text-sm">
                <div className="flex items-center justify-between text-sec">
                  <span>العميل</span>
                  <span className="font-bold text-main">{lastOrder.customerName}</span>
                </div>
                <div className="flex items-center justify-between text-sec">
                  <span>البريد الإلكتروني</span>
                  <span dir="ltr" className="font-mono-cyber text-xs text-main">
                    {lastOrder.email}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sec">
                  <span>عدد العناصر</span>
                  <span className="font-mono-cyber font-bold text-main">
                    {lastOrder.items.reduce((n, it) => n + it.qty, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sec">
                  <span>الحالة</span>
                  <span className="tag-pill">{STATUS_AR[lastOrder.status] ?? lastOrder.status}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-main">الإجمالي المدفوع</span>
                  <span className="font-mono-cyber text-xl font-extrabold text-cyber">
                    {fmtPrice(lastOrder.total)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={resetAndGoStore}
                  className="btn-gradient h-11 flex-1 rounded-xl text-sm"
                >
                  متابعة التسوق
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ name: "account" })}
                  className="btn-outline-cyber h-11 flex-1 rounded-xl text-sm font-bold"
                >
                  طلباتي
                </button>
              </div>
            </div>
          </Reveal>
        </section>
      </>
    );
  }

  /* checkout form */
  return (
    <>
      <PageHero
        badge="CHECKOUT.SECURE"
        title="إتمام"
        highlight="الشراء"
        subtitle="خطوة أخيرة تفصلك عن منتجاتك — بيانات مشفرة ودفع مرن"
      />

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* form card */}
            <Reveal className="lg:col-span-2">
              <div className="card-glow h-full rounded-2xl p-6">
                <h2 className="font-heading-cyber text-lg font-bold text-main">
                  بيانات الدفع
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="co-name" className="mb-1.5 block text-xs font-bold text-sec">
                      الاسم الكامل <span className="text-[#ff2a6d]">*</span>
                    </label>
                    <input
                      id="co-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: عبدالله المطيري"
                      aria-label="الاسم الكامل"
                      aria-invalid={!!errors.name}
                      autoComplete="name"
                      className={inputCls}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-[#ff2a6d]">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="co-email" className="mb-1.5 block text-xs font-bold text-sec">
                      البريد الإلكتروني <span className="text-[#ff2a6d]">*</span>
                    </label>
                    <input
                      id="co-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      aria-label="البريد الإلكتروني"
                      aria-invalid={!!errors.email}
                      autoComplete="email"
                      dir="ltr"
                      className={cn(inputCls, "text-left")}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-[#ff2a6d]">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="co-phone" className="mb-1.5 block text-xs font-bold text-sec">
                      رقم الجوال <span className="text-mute">(اختياري)</span>
                    </label>
                    <input
                      id="co-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05xxxxxxxx"
                      aria-label="رقم الجوال"
                      autoComplete="tel"
                      dir="ltr"
                      className={cn(inputCls, "text-left")}
                    />
                  </div>
                </div>

                {/* payment method */}
                <fieldset className="mt-6">
                  <legend className="mb-1.5 block text-xs font-bold text-sec">
                    طريقة الدفع
                  </legend>
                  <RadioGroup
                    value={payment}
                    onValueChange={setPayment}
                    className="mt-2 grid gap-3 sm:grid-cols-3"
                    aria-label="طريقة الدفع"
                  >
                    {PAYMENT_METHODS.map((m) => {
                      const selected = payment === m.value;
                      return (
                        <Label
                          key={m.value}
                          htmlFor={`pay-${m.value}`}
                          className={cn(
                            "flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition",
                            selected
                              ? "border-[rgba(0,240,255,0.5)] bg-[rgba(0,240,255,0.05)] shadow-[0_0_16px_rgba(0,240,255,0.12)]"
                              : "border-border-strong bg-elev-2/60 hover:border-[rgba(0,240,255,0.3)]"
                          )}
                        >
                          <span className="flex items-center justify-between">
                            <m.icon
                              className={cn(
                                "h-5 w-5",
                                selected ? "text-cyber" : "text-mute"
                              )}
                              aria-hidden="true"
                            />
                            <RadioGroupItem
                              id={`pay-${m.value}`}
                              value={m.value}
                              className="sr-only"
                            />
                          </span>
                          <span className="text-sm font-bold text-main">{m.label}</span>
                          <span className="text-[11px] leading-4 text-mute">{m.desc}</span>
                        </Label>
                      );
                    })}
                  </RadioGroup>
                </fieldset>

                {/* notes */}
                <div className="mt-6">
                  <label htmlFor="co-notes" className="mb-1.5 block text-xs font-bold text-sec">
                    ملاحظات <span className="text-mute">(اختياري)</span>
                  </label>
                  <textarea
                    id="co-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="أي تفاصيل إضافية تريد إضافتها لطلبك..."
                    aria-label="ملاحظات"
                    rows={3}
                    className="min-h-24 w-full rounded-xl border border-border-strong bg-elev-2/60 p-4 text-sm text-main outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.15)]"
                  />
                </div>
              </div>
            </Reveal>

            {/* summary */}
            <Reveal delay={120} className="lg:col-span-1">
              <div className="card-glow self-start rounded-2xl p-6 lg:sticky lg:top-28">
                <h2 className="font-heading-cyber text-lg font-bold text-main">
                  ملخص الطلب
                </h2>

                <ul className="mt-4 max-h-40 space-y-2.5 overflow-y-auto pe-1">
                  {cart.map((line) => (
                    <li
                      key={line.id}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      <span className="line-clamp-1 text-sec">
                        {line.name} <span className="font-mono-cyber text-mute">×{line.qty}</span>
                      </span>
                      <span className="font-mono-cyber shrink-0 font-bold text-main">
                        {fmtPrice(line.qty * line.price)}
                      </span>
                    </li>
                  ))}
                </ul>

                <Separator className="my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-sec">
                    <span>المجموع الفرعي</span>
                    <span className="font-mono-cyber font-bold text-main">{fmtPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-[#00ff88]">
                      <span>الخصم ({Math.round(discountRate * 100)}%)</span>
                      <span className="font-mono-cyber font-bold">-{fmtPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sec">
                    <span>ضريبة القيمة المضافة (15%)</span>
                    <span className="font-mono-cyber font-bold text-main">{fmtPrice(vat)}</span>
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
                  type="submit"
                  disabled={submitting || cart.length === 0}
                  className="btn-gradient mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      جارٍ تأكيد الطلب...
                    </>
                  ) : (
                    `تأكيد الطلب — ${fmtPrice(total)}`
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-mute">
                  <LockKeyhole className="h-3.5 w-3.5 text-[#00ff88]" aria-hidden="true" />
                  <span>بياناتك مشفرة ولا تُشارك مع أي طرف ثالث</span>
                </div>
              </div>
            </Reveal>
          </div>
        </form>
      </section>
    </>
  );
}
