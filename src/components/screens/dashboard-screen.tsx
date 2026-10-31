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
  AtSign,
  CalendarCheck,
  CheckCheck,
  Copy,
  Download,
  LayoutDashboard,
  Lock,
  Mail,
  MessageSquareQuote,
  Phone,
  ShieldAlert,
  ShoppingBag,
  Star,
  Target,
  Trash2,
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
  AdminCommentItem,
  AdminStats,
  AdminUser,
  Booking,
  ContactMessageItem,
  MonthlyPoint,
  Order,
  SubscriberItem,
  Testimonial,
} from "@/lib/types";
import { SOCIAL_BY_ID } from "@/lib/social";
import { COUNTRY_BY_CODE, PURPOSE_BY_ID } from "@/lib/contact-options";
import { WhatsAppIcon } from "@/components/social-icons";

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

  const {
    data: users,
    loading: usersLoading,
    error: usersError,
    reload: reloadUsers,
  } = useApi<AdminUser[]>("/api/admin/users");

  const {
    data: subscribers,
    loading: subscribersLoading,
    error: subscribersError,
    reload: reloadSubscribers,
  } = useApi<SubscriberItem[]>("/api/admin/subscribers");

  const {
    data: comments,
    loading: commentsLoading,
    error: commentsError,
    reload: reloadComments,
  } = useApi<AdminCommentItem[]>("/api/admin/comments");

  const {
    data: testimonials,
    loading: testimonialsLoading,
    error: testimonialsError,
    reload: reloadTestimonials,
  } = useApi<Testimonial[]>("/api/testimonials");

  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null);
  const [patchingId, setPatchingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  async function toggleMessageRead(message: ContactMessageItem) {
    setPatchingId(message.id);
    try {
      await sendJson(`/api/contact/${message.id}`, { read: !message.read }, "PATCH");
      toast({
        title: message.read ? "أعيدت كغير مقروءة" : "تم تعليمها كمقروءة",
        description: `رسالة ${message.name}`,
      });
      setSelectedMessage(null);
      reloadMessages();
      reloadStats();
    } catch (err) {
      toast({
        title: "فشل التحديث",
        description: err instanceof Error ? err.message : "حاول مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setPatchingId(null);
    }
  }

  async function deleteMessage(message: ContactMessageItem) {
    setDeletingId(message.id);
    try {
      await sendJson(`/api/contact/${message.id}`, null, "DELETE");
      toast({ title: "تم حذف الرسالة", description: `رسالة ${message.name}` });
      setSelectedMessage(null);
      reloadMessages();
      reloadStats();
    } catch (err) {
      toast({
        title: "فشل الحذف",
        description: err instanceof Error ? err.message : "حاول مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  }

  async function changeUserRole(id: string, role: AdminUser["role"], name: string) {
    setPatchingId(id);
    try {
      await sendJson(`/api/admin/users/${id}`, { role }, "PATCH");
      toast({
        title: "تم تحديث الصلاحية",
        description: `${name} أصبح ${role === "admin" ? "مديراً" : "مستخدماً عادياً"}`,
      });
      reloadUsers();
      reloadStats();
    } catch (err) {
      toast({
        title: "فشل تحديث الصلاحية",
        description: err instanceof Error ? err.message : "حاول مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setPatchingId(null);
    }
  }

  async function deleteUser(id: string, name: string) {
    setDeletingId(id);
    try {
      await sendJson(`/api/admin/users/${id}`, null, "DELETE");
      toast({ title: "تم حذف المستخدم", description: name });
      reloadUsers();
      reloadStats();
    } catch (err) {
      toast({
        title: "فشل الحذف",
        description: err instanceof Error ? err.message : "حاول مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  }

  async function deleteSubscriber(id: string) {
    setDeletingId(id);
    try {
      await sendJson(`/api/admin/subscribers/${id}`, null, "DELETE");
      toast({ title: "تمت إزالة المشترك" });
      reloadSubscribers();
      reloadStats();
    } catch (err) {
      toast({
        title: "فشل الحذف",
        description: err instanceof Error ? err.message : "حاول مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  }

  function exportSubscribersCsv() {
    if (!subscribers || subscribers.length === 0) return;
    const rows = ["email,subscribed_at", ...subscribers.map((s) => `${s.email},${s.createdAt}`)];
    const blob = new Blob([`\ufeff${rows.join("\n")}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cto-drs-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "تم تصدير القائمة", description: `${subscribers.length} مشترك بصيغة CSV` });
  }

  async function deleteComment(id: string) {
    setDeletingId(id);
    try {
      await sendJson(`/api/admin/comments/${id}`, null, "DELETE");
      toast({ title: "تم حذف التعليق" });
      reloadComments();
      reloadStats();
    } catch (err) {
      toast({
        title: "فشل الحذف",
        description: err instanceof Error ? err.message : "حاول مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  }

  async function deleteTestimonial(id: string, name: string) {
    setDeletingId(id);
    try {
      await sendJson(`/api/testimonials/${id}`, null, "DELETE");
      toast({ title: "تم حذف الرأي", description: name });
      reloadTestimonials();
      reloadStats();
    } catch (err) {
      toast({
        title: "فشل الحذف",
        description: err instanceof Error ? err.message : "حاول مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
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
              <TabsList className="grid h-auto w-full grid-cols-4 gap-1 sm:grid-cols-4 lg:grid-cols-8">
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
                <TabsTrigger value="users" className="h-9 text-xs sm:text-sm">
                  <UserRound className="h-4 w-4" />
                  المستخدمون
                </TabsTrigger>
                <TabsTrigger value="subscribers" className="h-9 text-xs sm:text-sm">
                  <AtSign className="h-4 w-4" />
                  المشتركون
                </TabsTrigger>
                <TabsTrigger value="comments" className="h-9 text-xs sm:text-sm">
                  <MessageSquareQuote className="h-4 w-4" />
                  التعليقات
                </TabsTrigger>
                <TabsTrigger value="testimonials" className="h-9 text-xs sm:text-sm">
                  <Star className="h-4 w-4" />
                  آراء العملاء
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
                    {messages.map((message) => {
                      const PurposeIcon = message.purpose ? PURPOSE_BY_ID[message.purpose] : null;
                      const cFlag = message.country ? COUNTRY_BY_CODE[message.country]?.flag : null;
                      return (
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
                              {cFlag && <span className="mr-1" title={message.country}> {cFlag}</span>}
                            </p>
                            <p className="mt-2 line-clamp-2 text-xs leading-6 text-sec">
                              {message.message}
                            </p>
                            {(PurposeIcon || message.phone) && (
                              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                {PurposeIcon && (
                                  <span
                                    className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold"
                                    style={{
                                      color: PurposeIcon.color,
                                      borderColor: PurposeIcon.color + "55",
                                      backgroundColor: PurposeIcon.glow,
                                    }}
                                  >
                                    {PurposeIcon.label}
                                  </span>
                                )}
                                {message.phone && (
                                  <span
                                    dir="ltr"
                                    className="font-mono-cyber inline-flex items-center rounded-full border border-border-soft bg-elev-2/60 px-2 py-0.5 text-[10px] text-sec"
                                  >
                                    {message.phone}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              {/* ═════ users ═════ */}
              <TabsContent value="users" className="mt-5">
                {usersLoading ? (
                  <ScreenLoader label="جارٍ تحميل المستخدمين..." />
                ) : usersError ? (
                  <ErrorState message={usersError} onRetry={reloadUsers} />
                ) : !users || users.length === 0 ? (
                  <EmptyState
                    icon={UserRound}
                    title="لا يوجد مستخدمون"
                    description="لم يسجل أي مستخدم في المنصة حتى الآن."
                  />
                ) : (
                  <div className="max-h-[480px] overflow-y-auto rounded-2xl border border-border-soft">
                    <Table className="text-xs">
                      <TableHeader className="sticky top-0 z-10 bg-elev">
                        <TableRow className="border-border-soft">
                          <TableHead className="text-right">المستخدم</TableHead>
                          <TableHead className="text-right">الطلبات</TableHead>
                          <TableHead className="text-right">الحجوزات</TableHead>
                          <TableHead className="text-right">التعليقات</TableHead>
                          <TableHead className="text-right">الصلاحية</TableHead>
                          <TableHead className="text-right">إجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((u) => (
                          <TableRow key={u.id} className="border-border-soft">
                            <TableCell>
                              <p className="font-bold text-main">{u.name}</p>
                              <p dir="ltr" className="text-right text-[11px] text-mute">
                                {u.email}
                              </p>
                            </TableCell>
                            <TableCell className="text-sec">{u.orders}</TableCell>
                            <TableCell className="text-sec">{u.bookings}</TableCell>
                            <TableCell className="text-sec">{u.comments}</TableCell>
                            <TableCell>
                              <Select
                                value={u.role}
                                onValueChange={(value) =>
                                  changeUserRole(u.id, value as AdminUser["role"], u.name)
                                }
                              >
                                <SelectTrigger
                                  size="sm"
                                  disabled={patchingId === u.id}
                                  aria-label={`تغيير صلاحية ${u.name}`}
                                  className="h-8 min-w-28 border-border-strong bg-elev-2/60 text-xs"
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">عميل</SelectItem>
                                  <SelectItem value="admin">مدير النظام</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={deletingId === u.id}
                                onClick={() => deleteUser(u.id, u.name)}
                                aria-label={`حذف المستخدم ${u.name}`}
                                className="h-8 gap-1.5 rounded-lg px-2.5 text-[#ff2a6d] hover:bg-[rgba(255,42,109,0.08)] hover:text-[#ff2a6d]"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                حذف
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* ═════ subscribers ═════ */}
              <TabsContent value="subscribers" className="mt-5">
                {subscribersLoading ? (
                  <ScreenLoader label="جارٍ تحميل المشتركين..." />
                ) : subscribersError ? (
                  <ErrorState message={subscribersError} onRetry={reloadSubscribers} />
                ) : !subscribers || subscribers.length === 0 ? (
                  <EmptyState
                    icon={AtSign}
                    title="لا يوجد مشتركون"
                    description="لم يشترك أحد في النشرة البريدية حتى الآن."
                  />
                ) : (
                  <div className="card-glow rounded-2xl p-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-bold text-main">
                        {subscribers.length} مشترك في النشرة البريدية
                      </p>
                      <Button
                        onClick={exportSubscribersCsv}
                        className="btn-outline-cyber h-9 rounded-xl px-4 text-xs"
                      >
                        <Download className="h-4 w-4" />
                        تصدير CSV
                      </Button>
                    </div>
                    <ul className="max-h-[400px] space-y-2 overflow-y-auto pl-1">
                      {subscribers.map((s) => (
                        <li
                          key={s.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-border-soft bg-elev-2/40 px-4 py-2.5"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[rgba(0,240,255,0.08)] text-cyber">
                              <AtSign className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                              <p dir="ltr" className="truncate text-right text-sm font-bold text-main">
                                {s.email}
                              </p>
                              <p className="text-[11px] text-mute">{fmtDate(s.createdAt)}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={deletingId === s.id}
                            onClick={() => deleteSubscriber(s.id)}
                            aria-label={`إزالة المشترك ${s.email}`}
                            className="h-8 w-8 shrink-0 rounded-lg text-mute hover:bg-[rgba(255,42,109,0.08)] hover:text-[#ff2a6d]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>

              {/* ═════ comments ═════ */}
              <TabsContent value="comments" className="mt-5">
                {commentsLoading ? (
                  <ScreenLoader label="جارٍ تحميل التعليقات..." />
                ) : commentsError ? (
                  <ErrorState message={commentsError} onRetry={reloadComments} />
                ) : !comments || comments.length === 0 ? (
                  <EmptyState
                    icon={MessageSquareQuote}
                    title="لا توجد تعليقات"
                    description="لا توجد تعليقات على المقالات حتى الآن."
                  />
                ) : (
                  <div className="grid max-h-[520px] gap-4 overflow-y-auto pl-1 lg:grid-cols-2">
                    {comments.map((c) => (
                      <div key={c.id} className="card-glow rounded-2xl p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-main">{c.authorName}</p>
                            <p className="truncate text-[11px] text-mute">
                              على مقال: <span className="text-cyber">{c.postTitle}</span> ·{" "}
                              {fmtDate(c.createdAt)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={deletingId === c.id}
                            onClick={() => deleteComment(c.id)}
                            aria-label={`حذف تعليق ${c.authorName}`}
                            className="h-8 w-8 shrink-0 rounded-lg text-mute hover:bg-[rgba(255,42,109,0.08)] hover:text-[#ff2a6d]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <p className="mt-2 line-clamp-3 text-xs leading-6 text-sec">{c.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* ═════ testimonials ═════ */}
              <TabsContent value="testimonials" className="mt-5">
                {testimonialsLoading ? (
                  <ScreenLoader label="جارٍ تحميل آراء العملاء..." />
                ) : testimonialsError ? (
                  <ErrorState message={testimonialsError} onRetry={reloadTestimonials} />
                ) : !testimonials || testimonials.length === 0 ? (
                  <EmptyState
                    icon={Star}
                    title="لا توجد آراء"
                    description="لا توجد آراء عملاء منشورة حتى الآن."
                  />
                ) : (
                  <div className="grid max-h-[520px] gap-4 overflow-y-auto pl-1 sm:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((t) => (
                      <div key={t.id} className="card-glow flex flex-col rounded-2xl p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-main">{t.name}</p>
                            <p className="truncate text-[11px] text-mute">{t.role}</p>
                          </div>
                          <span className="shrink-0 text-xs font-bold text-[#ffd700]">
                            {"★".repeat(t.rating)}
                            <span className="text-mute">{"★".repeat(5 - t.rating)}</span>
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-4 flex-1 text-xs leading-6 text-sec">
                          {t.content}
                        </p>
                        <div className="mt-3 flex items-center justify-between border-t border-border-soft pt-3">
                          <span className="text-[11px] text-mute">{fmtDate(t.createdAt)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={deletingId === t.id}
                            onClick={() => deleteTestimonial(t.id, t.name)}
                            aria-label={`حذف رأي ${t.name}`}
                            className="h-8 gap-1.5 rounded-lg px-2.5 text-[#ff2a6d] hover:bg-[rgba(255,42,109,0.08)] hover:text-[#ff2a6d]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            حذف
                          </Button>
                        </div>
                      </div>
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

          {/* بيانات المُرسل الجديدة: الهدف + الدولة + الجوال */}
          {(selectedMessage?.purpose || selectedMessage?.phone || selectedMessage?.country) && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedMessage?.purpose && PURPOSE_BY_ID[selectedMessage.purpose] && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold"
                  style={{
                    color: PURPOSE_BY_ID[selectedMessage.purpose].color,
                    borderColor: PURPOSE_BY_ID[selectedMessage.purpose].color + "55",
                    backgroundColor: PURPOSE_BY_ID[selectedMessage.purpose].glow,
                  }}
                >
                  <Target className="h-3.5 w-3.5" />
                  {PURPOSE_BY_ID[selectedMessage.purpose].label}
                </span>
              )}
              {selectedMessage?.country && COUNTRY_BY_CODE[selectedMessage.country] && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-elev-2/60 px-3 py-1 text-xs text-sec">
                  {COUNTRY_BY_CODE[selectedMessage.country].flag} {COUNTRY_BY_CODE[selectedMessage.country].name}
                </span>
              )}
              {selectedMessage?.phone && (
                <a
                  href={`https://wa.me/${selectedMessage.phone.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  className="font-mono-cyber inline-flex items-center gap-1.5 rounded-full border border-[rgba(37,211,102,0.35)] bg-[rgba(37,211,102,0.08)] px-3 py-1 text-xs font-bold text-[#25d366] transition hover:bg-[rgba(37,211,102,0.18)]"
                >
                  <Phone className="h-3 w-3" />
                  {selectedMessage.phone}
                </a>
              )}
            </div>
          )}

          <div className="max-h-72 overflow-y-auto rounded-xl border border-border-soft bg-elev-2/60 p-4">
            <p className="whitespace-pre-wrap text-sm leading-7 text-sec">{selectedMessage?.message}</p>
          </div>
          <DialogFooter className="flex-row flex-wrap justify-start gap-2.5 sm:justify-start">
            <Button onClick={copyEmail} className="btn-outline-cyber h-10 rounded-xl">
              <Copy className="h-4 w-4" />
              نسخ البريد
            </Button>
            <a
              href={
                selectedMessage?.phone
                  ? `https://wa.me/${selectedMessage.phone.replace(/[^\d]/g, "")}`
                  : selectedMessage
                    ? `${SOCIAL_BY_ID.whatsapp.url}`
                    : "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center gap-1.5 rounded-xl border border-[rgba(37,211,102,0.35)] bg-[rgba(37,211,102,0.08)] px-4 text-sm font-bold text-[#25d366] transition hover:bg-[rgba(37,211,102,0.18)]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {selectedMessage?.phone ? "رد واتساب مباشر" : "رد عبر واتساب"}
            </a>
            <Button
              onClick={() => selectedMessage && toggleMessageRead(selectedMessage)}
              disabled={!!selectedMessage && patchingId === selectedMessage.id}
              className="h-10 rounded-xl border border-[rgba(0,240,255,0.35)] bg-transparent text-cyber hover:bg-[rgba(0,240,255,0.08)]"
              variant="outline"
            >
              <CheckCheck className="h-4 w-4" />
              {selectedMessage?.read ? "تعليم كغير مقروءة" : "تعليم كمقروءة"}
            </Button>
            <Button
              onClick={() => selectedMessage && deleteMessage(selectedMessage)}
              disabled={!!selectedMessage && deletingId === selectedMessage.id}
              className="h-10 rounded-xl border border-[rgba(255,42,109,0.35)] bg-transparent text-[#ff2a6d] hover:bg-[rgba(255,42,109,0.08)]"
              variant="outline"
            >
              <Trash2 className="h-4 w-4" />
              حذف
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
