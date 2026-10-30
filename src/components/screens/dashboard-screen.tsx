"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarCheck,
  Copy,
  LayoutDashboard,
  Lock,
  Mail,
  ShieldAlert,
  ShoppingBag,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { EmptyState, ErrorState, ScreenLoader } from "@/components/screen-state";
import { toast } from "@/hooks/use-toast";
import { useAppRouter } from "@/lib/router";
import { useAppStore } from "@/lib/store";
import { sendJson, useApi } from "@/lib/use-api";
import type {
  AdminStats,
  Booking,
  ContactMessageItem,
  MonthlyPoint,
  Order,
} from "@/lib/types";

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

const BOOKING_STATUSES: { value: Booking["status"]; label: string }[] = [
  { value: "pending", label: "قيد الانتظار" },
  { value: "confirmed", label: "مؤكد" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
];

const TOOLTIP_STYLE = {
  background: "#0e1018",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#f4f5f8",
  direction: "rtl" as const,
  fontSize: 12,
  boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
};

const AXIS_TICK = { fill: "#9aa0b4", fontSize: 11 };

interface Kpi {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  compact?: boolean;
}

export function DashboardScreen() {
  const { navigate } = useAppRouter();
  const { user } = useAppStore();

  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    reload: reloadStats,
  } = useApi<AdminStats>("/api/admin/stats");

  const {
    data: bookings,
    loading: bookingsLoading,
    error: bookingsError,
    reload: reloadBookings,
  } = useApi<Booking[]>("/api/bookings");

  const {
    data: orders,
    loading: ordersLoading,
    error: ordersError,
    reload: reloadOrders,
  } = useApi<Order[]>("/api/orders");

  const {
    data: messages,
    loading: messagesLoading,
    error: messagesError,
    reload: reloadMessages,
  } = useApi<ContactMessageItem[]>("/api/contact");

  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null);
  const [patchingId, setPatchingId] = useState<string | null>(null);

  async function updateBookingStatus(id: string, status: Booking["status"]) {
    setPatchingId(id);
    try {
      await sendJson<Booking>("/api/bookings", { id, status }, "PATCH");
      toast({
        title: "تم تحديث الحالة",
        description: `الحالة الجديدة: ${STATUS_LABELS[status] ?? status}`,
      });
      reloadBookings();
      reloadStats();
    } catch (err) {
      toast({
        title: "فشل تحديث الحالة",
        description: err instanceof Error ? err.message : "حاول مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setPatchingId(null);
    }
  }

  async function copyEmail() {
    if (!selectedMessage) return;
    try {
      await navigator.clipboard.writeText(selectedMessage.email);
      toast({ title: "تم النسخ", description: selectedMessage.email });
    } catch {
      toast({
        title: "تعذر النسخ",
        description: selectedMessage.email,
        variant: "destructive",
      });
    }
  }

  const kpis: Kpi[] = stats
    ? [
        { label: "الإيرادات", value: fmtPrice(stats.revenue), icon: Wallet, color: "#00ff88", compact: true },
        { label: "الطلبات", value: String(stats.orders), icon: ShoppingBag, color: "#00f0ff" },
        { label: "الحجوزات", value: String(stats.bookings), icon: CalendarCheck, color: "#7c3aed" },
        { label: "الرسائل", value: String(stats.messages), icon: Mail, color: "#ff9900" },
        { label: "المشتركون", value: String(stats.subscribers), icon: Users, color: "#ffd700" },
        { label: "المستخدمون", value: String(stats.users), icon: UserRound, color: "#ff2a6d" },
      ]
    : [];

  const monthly: MonthlyPoint[] = stats?.monthly ?? [];

  return (
    <>
      <PageHero
        badge="ADMIN.CONSOLE"
        title="لوحة"
        highlight="التحكم"
        subtitle="نظرة حية على أداء المنصة — الطلبات، الحجوزات، الرسائل والإيرادات"
      />

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
        {/* ── access control ── */}
        {!user ? (
          <EmptyState
            icon={Lock}
            title="منطقة للمدير فقط"
            description="هذه اللوحة مخصصة لمديري النظام. سجّل الدخول بحساب المدير للوصول إلى إدارة المنصة."
            action={
              <Button
                onClick={() => navigate({ name: "login" })}
                className="btn-gradient h-11 rounded-xl px-6"
              >
                تسجيل الدخول
              </Button>
            }
          />
        ) : user.role !== "admin" ? (
          <div className="card-glow mx-auto max-w-md rounded-2xl p-8 text-center">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(255,42,109,0.35)] bg-[rgba(255,42,109,0.08)] shadow-[0_0_24px_rgba(255,42,109,0.2)]">
              <ShieldAlert className="h-6 w-6 text-[#ff2a6d]" />
            </span>
            <h2 className="font-heading-cyber text-lg font-extrabold text-main">
              لا تملك صلاحية الوصول
            </h2>
            <p className="mt-2 text-sm leading-7 text-sec">
              هذه المنطقة مخصصة لمديري النظام فقط. إذا كنت تعتقد أن هذا خطأ، تواصل مع فريق الدعم.
            </p>
            <Button
              onClick={() => navigate({ name: "home" })}
              className="btn-gradient mt-6 h-11 rounded-xl px-6"
            >
              العودة للرئيسية
            </Button>
          </div>
        ) : statsLoading ? (
          <ScreenLoader label="جارٍ تحميل بيانات لوحة التحكم..." />
        ) : statsError || !stats ? (
          <ErrorState message={statsError ?? "تعذر تحميل إحصائيات المنصة"} onRetry={reloadStats} />
        ) : (
          <div className="space-y-8">
            {/* ── KPI grid ── */}
            <Reveal>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {kpis.map((kpi) => (
                  <div key={kpi.label} className="card-glow rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                        style={{ color: kpi.color, borderColor: `${kpi.color}44`, background: `${kpi.color}12` }}
                      >
                        <kpi.icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p
                          className={`truncate font-heading-cyber font-extrabold text-main ${
                            kpi.compact ? "text-lg sm:text-xl" : "text-2xl"
                          }`}
                        >
                          {kpi.value}
                        </p>
                        <p className="text-xs text-mute">{kpi.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* ── main tabs ── */}
            <Tabs defaultValue="overview">
              <TabsList className="grid h-auto w-full grid-cols-2 sm:inline-grid sm:w-auto">
                <TabsTrigger value="overview" className="h-9 text-xs sm:text-sm">
                  <LayoutDashboard className="h-4 w-4" />
                  نظرة عامة
                </TabsTrigger>
                <TabsTrigger value="bookings" className="h-9 text-xs sm:text-sm">
                  <CalendarCheck className="h-4 w-4" />
                  الحجوزات
                </TabsTrigger>
                <TabsTrigger value="orders" className="h-9 text-xs sm:text-sm">
                  <ShoppingBag className="h-4 w-4" />
                  الطلبات
                </TabsTrigger>
                <TabsTrigger value="messages" className="h-9 text-xs sm:text-sm">
                  <Mail className="h-4 w-4" />
                  الرسائل
                </TabsTrigger>
              </TabsList>

              {/* ═════ overview ═════ */}
              <TabsContent value="overview" className="mt-5 space-y-5">
                {/* charts */}
                <div className="grid gap-5 lg:grid-cols-2">
                  <Reveal>
                    <div className="card-glow rounded-2xl p-4">
                      <h3 className="mb-3 text-sm font-bold text-main">حجم الطلبات الشهري</h3>
                      <div dir="ltr" className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height={260}>
                          <AreaChart data={monthly} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                            <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={false} />
                            <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={36} />
                            <Tooltip
                              contentStyle={TOOLTIP_STYLE}
                              labelStyle={{ color: "#f4f5f8", marginBottom: 4 }}
                              itemStyle={{ color: "#00f0ff" }}
                              formatter={(value: unknown) => `${Number(value)} طلب`}
                            />
                            <Area
                              type="monotone"
                              dataKey="orders"
                              name="الطلبات"
                              stroke="#00f0ff"
                              strokeWidth={2}
                              fill="rgba(0,240,255,0.15)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={100}>
                    <div className="card-glow rounded-2xl p-4">
                      <h3 className="mb-3 text-sm font-bold text-main">الإيرادات الشهرية</h3>
                      <div dir="ltr" className="h-[260px] w-full">
                        <ResponsiveContainer width="100%" height={260}>
                          <BarChart data={monthly} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                            <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={false} />
                            <YAxis
                              tick={AXIS_TICK}
                              tickLine={false}
                              axisLine={false}
                              width={48}
                              tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                            />
                            <Tooltip
                              contentStyle={TOOLTIP_STYLE}
                              labelStyle={{ color: "#f4f5f8", marginBottom: 4 }}
                              itemStyle={{ color: "#ff2a6d" }}
                              cursor={{ fill: "rgba(255,42,109,0.06)" }}
                              formatter={(value: unknown) => fmtPrice(Number(value))}
                            />
                            <Bar
                              dataKey="revenue"
                              name="الإيرادات"
                              stroke="#ff2a6d"
                              strokeWidth={1.5}
                              fill="rgba(255,42,109,0.25)"
                              radius={[6, 6, 0, 0]}
                              maxBarSize={38}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </Reveal>
                </div>

                {/* recent lists */}
                <div className="grid gap-5 lg:grid-cols-2">
                  <Reveal>
                    <div className="card-glow rounded-2xl p-5">
                      <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-main">
                        <CalendarCheck className="h-4 w-4 text-[#7c3aed]" />
                        أحدث الحجوزات
                      </h3>
                      {stats.recentBookings.length === 0 ? (
                        <p className="py-6 text-center text-xs text-mute">لا توجد حجوزات حتى الآن</p>
                      ) : (
                        <ul>
                          {stats.recentBookings.map((booking) => (
                            <li
                              key={booking.id}
                              className="flex items-center justify-between gap-3 border-b border-border-soft py-2.5 last:border-0"
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-main">{booking.name}</p>
                                <p className="truncate text-xs text-mute">
                                  {booking.serviceType} · {fmtDate(booking.date)}
                                </p>
                              </div>
                              <StatusBadge status={booking.status} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Reveal>

                  <Reveal delay={100}>
                    <div className="card-glow rounded-2xl p-5">
                      <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-main">
                        <ShoppingBag className="h-4 w-4 text-cyber" />
                        أحدث الطلبات
                      </h3>
                      {stats.recentOrders.length === 0 ? (
                        <p className="py-6 text-center text-xs text-mute">لا توجد طلبات حتى الآن</p>
                      ) : (
                        <ul>
                          {stats.recentOrders.map((order) => (
                            <li
                              key={order.id}
                              className="flex items-center justify-between gap-3 border-b border-border-soft py-2.5 last:border-0"
                            >
                              <div className="min-w-0">
                                <p
                                  dir="ltr"
                                  className="truncate text-right font-mono-cyber text-xs font-bold text-cyber"
                                >
                                  #{order.id}
                                </p>
                                <p className="truncate text-xs text-mute">
                                  {order.customerName} ·{" "}
                                  <span className="text-cyber">{fmtPrice(order.total)}</span>
                                </p>
                              </div>
                              <StatusBadge status={order.status} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Reveal>
                </div>
              </TabsContent>

              {/* ═════ bookings ═════ */}
              <TabsContent value="bookings" className="mt-5">
                {bookingsLoading ? (
                  <ScreenLoader label="جارٍ تحميل الحجوزات..." />
                ) : bookingsError ? (
                  <ErrorState message={bookingsError} onRetry={reloadBookings} />
                ) : !bookings || bookings.length === 0 ? (
                  <EmptyState
                    icon={CalendarCheck}
                    title="لا توجد حجوزات"
                    description="لم يستلم النظام أي حجز حتى الآن."
                  />
                ) : (
                  <div className="max-h-[480px] overflow-y-auto rounded-2xl border border-border-soft">
                    <Table className="text-xs">
                      <TableHeader className="sticky top-0 z-10 bg-elev">
                        <TableRow className="border-border-soft">
                          <TableHead className="text-right">العميل</TableHead>
                          <TableHead className="text-right">الخدمة</TableHead>
                          <TableHead className="text-right">التاريخ</TableHead>
                          <TableHead className="text-right">الوقت</TableHead>
                          <TableHead className="text-right">الحالة</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking) => (
                          <TableRow key={booking.id} className="border-border-soft">
                            <TableCell className="font-bold text-main">{booking.name}</TableCell>
                            <TableCell className="text-sec">{booking.serviceType}</TableCell>
                            <TableCell className="text-sec">{fmtDate(booking.date)}</TableCell>
                            <TableCell className="text-sec">{booking.timeSlot}</TableCell>
                            <TableCell>
                              <Select
                                value={booking.status}
                                onValueChange={(value) =>
                                  updateBookingStatus(booking.id, value as Booking["status"])
                                }
                              >
                                <SelectTrigger
                                  size="sm"
                                  disabled={patchingId === booking.id}
                                  aria-label={`تغيير حالة حجز ${booking.name}`}
                                  className="h-8 min-w-32 border-border-strong bg-elev-2/60 text-xs"
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {BOOKING_STATUSES.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* ═════ orders ═════ */}
              <TabsContent value="orders" className="mt-5">
                {ordersLoading ? (
                  <ScreenLoader label="جارٍ تحميل الطلبات..." />
                ) : ordersError ? (
                  <ErrorState message={ordersError} onRetry={reloadOrders} />
                ) : !orders || orders.length === 0 ? (
                  <EmptyState
                    icon={ShoppingBag}
                    title="لا توجد طلبات"
                    description="لم يستلم النظام أي طلب حتى الآن."
                  />
                ) : (
                  <div className="max-h-[480px] overflow-y-auto rounded-2xl border border-border-soft">
                    <Table className="text-xs">
                      <TableHeader className="sticky top-0 z-10 bg-elev">
                        <TableRow className="border-border-soft">
                          <TableHead className="text-right">الطلب</TableHead>
                          <TableHead className="text-right">العميل</TableHead>
                          <TableHead className="text-right">البريد</TableHead>
                          <TableHead className="text-right">الإجمالي</TableHead>
                          <TableHead className="text-right">الحالة</TableHead>
                          <TableHead className="text-right">التاريخ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id} className="border-border-soft">
                            <TableCell dir="ltr" className="text-right font-mono-cyber font-bold text-cyber">
                              #{order.id}
                            </TableCell>
                            <TableCell className="font-bold text-main">{order.customerName}</TableCell>
                            <TableCell dir="ltr" className="text-right text-sec">
                              {order.email}
                            </TableCell>
                            <TableCell className="font-bold text-cyber">{fmtPrice(order.total)}</TableCell>
                            <TableCell>
                              <StatusBadge status={order.status} />
                            </TableCell>
                            <TableCell className="text-sec">{fmtDate(order.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* ═════ messages ═════ */}
              <TabsContent value="messages" className="mt-5">
                {messagesLoading ? (
                  <ScreenLoader label="جارٍ تحميل الرسائل..." />
                ) : messagesError ? (
                  <ErrorState message={messagesError} onRetry={reloadMessages} />
                ) : !messages || messages.length === 0 ? (
                  <EmptyState
                    icon={Mail}
                    title="لا توجد رسائل"
                    description="لم تستلم النظام أي رسالة تواصل حتى الآن."
                  />
                ) : (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {messages.map((message) => (
                      <button
                        key={message.id}
                        type="button"
                        onClick={() => setSelectedMessage(message)}
                        aria-label={`فتح رسالة من ${message.name}`}
                        className="card-glow w-full cursor-pointer rounded-2xl p-4 text-right"
                      >
                        <div className="flex items-start gap-3">
                          {!message.read && (
                            <span
                              aria-hidden="true"
                              className="mt-1.5 h-2 w-2 shrink-0 animate-pulse rounded-full bg-cyber shadow-[0_0_8px_rgba(0,240,255,0.6)]"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <h3
                                className={`truncate text-sm font-bold ${
                                  message.subject ? "text-main" : "italic text-mute"
                                }`}
                              >
                                {message.subject || "بدون عنوان"}
                              </h3>
                              <span className="shrink-0 text-[11px] text-mute">
                                {fmtDate(message.createdAt)}
                              </span>
                            </div>
                            <p className="mt-1 truncate text-xs text-mute">
                              {message.name} · <span dir="ltr">{message.email}</span>
                            </p>
                            <p className="mt-2 line-clamp-2 text-xs leading-6 text-sec">
                              {message.message}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </section>

      {/* ── message dialog ── */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-right">
              {selectedMessage?.subject || "بدون عنوان"}
            </DialogTitle>
            <DialogDescription className="text-right">
              {selectedMessage?.name} · <span dir="ltr">{selectedMessage?.email}</span> ·{" "}
              {selectedMessage && fmtDate(selectedMessage.createdAt)}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-72 overflow-y-auto rounded-xl border border-border-soft bg-elev-2/60 p-4">
            <p className="whitespace-pre-wrap text-sm leading-7 text-sec">{selectedMessage?.message}</p>
          </div>
          <DialogFooter className="flex-row justify-start gap-2.5 sm:justify-start">
            <Button onClick={copyEmail} className="btn-outline-cyber h-10 rounded-xl">
              <Copy className="h-4 w-4" />
              نسخ البريد
            </Button>
            <Button
              variant="ghost"
              onClick={() => setSelectedMessage(null)}
              className="h-10 rounded-xl text-sec hover:text-main"
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
