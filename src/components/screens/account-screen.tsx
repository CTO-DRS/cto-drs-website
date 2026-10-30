"use client";

import {
  CalendarDays,
  Clock,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Trash2,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { SocialChannels } from "@/components/social-channels";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/screen-state";
import { toast } from "@/hooks/use-toast";
import { useAppRouter } from "@/lib/router";
import { useAppStore } from "@/lib/store";
import { useApi } from "@/lib/use-api";
import type { Booking, Order } from "@/lib/types";

/* ── helpers ── */
const fmtPrice = (n: number) => n.toLocaleString("en-US") + " ر.س";
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ar", { year: "numeric", month: "long", day: "numeric" });

const STATUS_STYLES: Record<string, string> = {
  pending: "text-[#ffd700] bg-[rgba(255,215,0,0.1)] border-[rgba(255,215,0,0.3)]",
  confirmed: "text-cyber bg-[rgba(0,240,255,0.1)] border-[rgba(0,240,255,0.3)]",
  processing: "text-cyber bg-[rgba(0,240,255,0.1)] border-[rgba(0,240,255,0.3)]",
  completed: "text-[#00ff88] bg-[rgba(0,255,136,0.1)] border-[rgba(0,255,136,0.3)]",
  cancelled: "text-[#ff2a6d] bg-[rgba(255,42,109,0.1)] border-[rgba(255,42,109,0.3)]",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  processing: "قيد التنفيذ",
  completed: "مكتمل",
  cancelled: "ملغي",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
        STATUS_STYLES[status] ?? STATUS_STYLES.pending
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w.charAt(0))
      .join("") || "?"
  );
}

export function AccountScreen() {
  const { navigate } = useAppRouter();
  const { user, setUser, clearCart } = useAppStore();

  /* guard fetches until user exists (url null otherwise) */
  const ordersUrl = user ? `/api/orders?email=${encodeURIComponent(user.email)}` : null;
  const bookingsUrl = user ? `/api/bookings?email=${encodeURIComponent(user.email)}` : null;

  const {
    data: orders,
    loading: ordersLoading,
    error: ordersError,
    reload: reloadOrders,
  } = useApi<Order[]>(ordersUrl);

  const {
    data: bookings,
    loading: bookingsLoading,
    error: bookingsError,
    reload: reloadBookings,
  } = useApi<Booking[]>(bookingsUrl);

  /* ── not logged in ── */
  if (!user) {
    return (
      <>
        <PageHero
          badge="USER.HUB"
          title="حسابي"
          highlight="الملف الشخصي"
          subtitle="صفحتك المركزية لمتابعة الطلبات والحجوزات وإدارة إعدادات حسابك"
        />
        <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
          <EmptyState
            icon={UserRound}
            title="لم تسجل الدخول بعد"
            description="سجّل دخولك أو أنشئ حساباً جديداً لتتمكن من متابعة طلباتك وحجوزاتك وإدارة بياناتك."
            action={
              <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                <Button
                  onClick={() => navigate({ name: "login" })}
                  className="btn-gradient h-11 rounded-xl px-6"
                >
                  تسجيل الدخول
                </Button>
                <Button
                  onClick={() => navigate({ name: "register" })}
                  className="btn-outline-cyber h-11 rounded-xl px-6"
                >
                  إنشاء حساب
                </Button>
              </div>
            }
          />
          <Reveal delay={160} className="mt-12">
            <SocialChannels />
          </Reveal>
        </section>
      </>
    );
  }

  /* ── logged in ── */
  function handleLogout() {
    setUser(null);
    toast({ title: "تم تسجيل الخروج", description: "نراك قريباً!" });
    navigate({ name: "home" });
  }

  function handleClearCart() {
    clearCart();
    toast({ title: "تم تفريغ السلة", description: "أصبحت سلة التسوق فارغة الآن" });
  }

  function handleWipeSession() {
    clearCart();
    setUser(null);
    try {
      localStorage.removeItem("cto-drs-store");
    } catch {
      /* storage unavailable */
    }
    toast({ title: "تم مسح بيانات الجلسة المحلية", description: "تمت إزالة جميع البيانات المخزنة على جهازك" });
  }

  return (
    <>
      <PageHero
        badge="USER.HUB"
        title="حسابي"
        highlight="الملف الشخصي"
        subtitle="صفحتك المركزية لمتابعة الطلبات والحجوزات وإدارة إعدادات حسابك"
      />

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
        {/* profile header */}
        <Reveal>
          <div className="glass rounded-2xl p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div
                  aria-hidden="true"
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[rgba(0,240,255,0.35)] bg-gradient-to-br from-[rgba(0,240,255,0.2)] to-[rgba(124,58,237,0.25)] text-xl font-extrabold text-cyber shadow-[0_0_24px_rgba(0,240,255,0.2)]"
                >
                  {initials(user.name)}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-heading-cyber truncate text-lg font-extrabold text-main">
                      {user.name}
                    </h2>
                    {user.role === "admin" ? (
                      <Badge className="border-[rgba(255,215,0,0.35)] bg-[rgba(255,215,0,0.1)] text-[#ffd700]">
                        مدير النظام
                      </Badge>
                    ) : (
                      <Badge className="border-[rgba(0,240,255,0.35)] bg-[rgba(0,240,255,0.1)] text-cyber">
                        عميل
                      </Badge>
                    )}
                  </div>
                  <p dir="ltr" className="mt-0.5 truncate text-left font-mono-cyber text-xs text-mute">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2.5">
                {user.role === "admin" && (
                  <Button
                    onClick={() => navigate({ name: "dashboard" })}
                    className="btn-outline-cyber h-11 rounded-xl"
                  >
                    لوحة التحكم
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="h-11 rounded-xl text-[#ff2a6d]! hover:bg-[rgba(255,42,109,0.08)]!"
                >
                  <LogOut className="h-4 w-4" />
                  تسجيل خروج
                </Button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* tabs */}
        <Tabs defaultValue="orders" className="mt-8">
          <TabsList className="grid h-auto w-full grid-cols-3">
            <TabsTrigger value="orders" className="h-9 text-xs sm:text-sm">
              <Package className="h-4 w-4" />
              طلباتي
            </TabsTrigger>
            <TabsTrigger value="bookings" className="h-9 text-xs sm:text-sm">
              <CalendarDays className="h-4 w-4" />
              حجوزاتي
            </TabsTrigger>
            <TabsTrigger value="settings" className="h-9 text-xs sm:text-sm">
              <Settings className="h-4 w-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          {/* ── orders ── */}
          <TabsContent value="orders" className="mt-5">
            {ordersLoading ? (
              <ListSkeleton count={3} />
            ) : ordersError ? (
              <ErrorState message={ordersError} onRetry={reloadOrders} />
            ) : !orders || orders.length === 0 ? (
              <EmptyState
                icon={Package}
                title="لا توجد طلبات بعد"
                description="لم تقم بأي عملية شراء حتى الآن. تصفح المتجر واكتشف أدواتنا ودوراتنا."
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
              <div className="grid gap-4 lg:grid-cols-2">
                {orders.map((order) => (
                  <div key={order.id} className="card-glow rounded-2xl p-5">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span
                        dir="ltr"
                        className="font-mono-cyber truncate text-xs font-bold text-cyber"
                      >
                        #{order.id}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-mute">{fmtDate(order.createdAt)}</p>
                    <ul className="my-3 space-y-1.5 border-y border-border-soft py-3">
                      {order.items.map((item, i) => (
                        <li
                          key={item.id ?? i}
                          className="flex items-center justify-between gap-3 text-sm text-sec"
                        >
                          <span className="min-w-0 truncate">
                            {item.name} <span className="text-xs text-mute">× {item.qty}</span>
                          </span>
                          <span className="shrink-0 text-xs text-mute">
                            {fmtPrice(item.price * item.qty)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span className="text-sec">الإجمالي</span>
                      <span className="text-cyber">{fmtPrice(order.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── bookings ── */}
          <TabsContent value="bookings" className="mt-5">
            {bookingsLoading ? (
              <ListSkeleton count={3} />
            ) : bookingsError ? (
              <ErrorState message={bookingsError} onRetry={reloadBookings} />
            ) : !bookings || bookings.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="لا توجد حجوزات بعد"
                description="احجز استشارتك أو خدمتك المفضلة وسيظهر الحجز هنا مع حالته المباشرة."
                action={
                  <Button
                    onClick={() => navigate({ name: "booking" })}
                    className="btn-gradient h-11 rounded-xl px-6"
                  >
                    <CalendarDays className="h-4 w-4" />
                    احجز الآن
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {bookings.map((booking) => (
                  <div key={booking.id} className="card-glow rounded-2xl p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="font-heading-cyber truncate font-bold text-main">
                        {booking.serviceType}
                      </h3>
                      <StatusBadge status={booking.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-sec">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-cyber" />
                        {fmtDate(booking.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-cyber" />
                        {booking.timeSlot}
                      </span>
                    </div>
                    {booking.notes && (
                      <p className="mt-3 rounded-xl border border-border-soft bg-elev-2/60 p-3 text-xs leading-6 text-mute">
                        {booking.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── settings ── */}
          <TabsContent value="settings" className="mt-5">
            <div className="grid gap-5 lg:grid-cols-2">
              {/* info summary */}
              <div className="card-glow rounded-2xl p-6">
                <h3 className="font-heading-cyber mb-4 flex items-center gap-2 text-sm font-bold text-main">
                  <UserRound className="h-4 w-4 text-cyber" />
                  معلومات الحساب
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3 border-b border-border-soft pb-3">
                    <dt className="text-xs text-mute">الاسم</dt>
                    <dd className="truncate font-bold text-main">{user.name}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-b border-border-soft pb-3">
                    <dt className="text-xs text-mute">البريد الإلكتروني</dt>
                    <dd dir="ltr" className="truncate font-mono-cyber text-xs text-sec">
                      {user.email}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-b border-border-soft pb-3">
                    <dt className="text-xs text-mute">الصلاحية</dt>
                    <dd>
                      {user.role === "admin" ? (
                        <Badge className="border-[rgba(255,215,0,0.35)] bg-[rgba(255,215,0,0.1)] text-[#ffd700]">
                          مدير النظام
                        </Badge>
                      ) : (
                        <Badge className="border-[rgba(0,240,255,0.35)] bg-[rgba(0,240,255,0.1)] text-cyber">
                          عميل
                        </Badge>
                      )}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-xs text-mute">المعرّف</dt>
                    <dd dir="ltr" className="truncate font-mono-cyber text-xs text-sec">
                      {user.id}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* danger zone */}
              <div className="rounded-2xl border border-[rgba(255,42,109,0.3)] bg-[rgba(255,42,109,0.04)] p-6">
                <h3 className="font-heading-cyber mb-2 flex items-center gap-2 text-sm font-bold text-[#ff2a6d]">
                  <Trash2 className="h-4 w-4" />
                  منطقة الخطر
                </h3>
                <p className="mb-4 text-xs leading-6 text-sec">
                  إجراءات تنظيف سريعة — بعضها لا يمكن التراجع عنه، تأكد قبل المتابعة.
                </p>
                <div className="space-y-2.5">
                  <Button
                    onClick={handleClearCart}
                    className="h-11 w-full rounded-xl border border-[rgba(255,42,109,0.35)] bg-transparent text-[#ff2a6d] hover:bg-[rgba(255,42,109,0.08)]"
                    variant="outline"
                  >
                    <Trash2 className="h-4 w-4" />
                    تفريغ السلة
                  </Button>
                  <Button
                    onClick={handleWipeSession}
                    className="h-11 w-full rounded-xl border border-[rgba(255,42,109,0.35)] bg-transparent text-[#ff2a6d] hover:bg-[rgba(255,42,109,0.08)]"
                    variant="outline"
                  >
                    <LogOut className="h-4 w-4" />
                    مسح بيانات الجلسة المحلية
                  </Button>
                </div>
                <p className="mt-4 text-[11px] leading-5 text-mute">
                  ملاحظة: يمكنك تبديل الوضع الليلي والنهاري في أي وقت من أيقونة السمة في الشريط
                  العلوي — تُحفظ تفضيلاتك تلقائياً على جهازك.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* official channels */}
        <Reveal delay={140} className="mt-12">
          <SocialChannels />
        </Reveal>
      </section>
    </>
  );
}
