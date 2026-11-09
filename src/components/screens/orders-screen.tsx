"use client";

import { Package, LogIn } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/screen-state";
import { Button } from "@/components/ui/button";
import { useAppRouter } from "@/lib/router";
import { useAppStore } from "@/lib/store";
import { useApi } from "@/lib/use-api";
import type { Order } from "@/lib/types";

const fmtPrice = (n: number) => n.toLocaleString("en-US") + " ر.س";
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ar", { year: "numeric", month: "long", day: "numeric" });

const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: "قيد الانتظار", cls: "text-[#ffd700] bg-[rgba(255,215,0,0.1)] border-[rgba(255,215,0,0.3)]" },
  confirmed: { label: "مؤكد", cls: "text-cyber bg-[rgba(0,240,255,0.1)] border-[rgba(0,240,255,0.3)]" },
  processing: { label: "قيد التنفيذ", cls: "text-cyber bg-[rgba(0,240,255,0.1)] border-[rgba(0,240,255,0.3)]" },
  completed: { label: "مكتمل", cls: "text-[#00ff88] bg-[rgba(0,255,136,0.1)] border-[rgba(0,255,136,0.3)]" },
  cancelled: { label: "ملغي", cls: "text-[#ff2a6d] bg-[rgba(255,42,109,0.1)] border-[rgba(255,42,109,0.3)]" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? STATUS.pending;
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${s.cls}`}>
      {s.label}
    </span>
  );
}

/** شاشة طلباتي — تعرض طلبات المستخدم المسجل حسب بريده */
export function OrdersScreen() {
  const { navigate } = useAppRouter();
  const user = useAppStore((s) => s.user);

  const { data, error, loading, reload } = useApi<Order[]>(
    user ? `/api/orders?email=${encodeURIComponent(user.email)}` : null
  );

  return (
    <>
      <PageHero
        badge="ORDERS • ACCOUNT"
        title="طلبات"
        highlight="المشتريات"
        subtitle="سجل كامل لجميع طلباتك من المتجر الرقمي مع حالتها المباشرة"
      />

      <section className="px-4 py-14">
        <div className="mx-auto max-w-6xl">
          {!user ? (
            <EmptyState
              icon={LogIn}
              title="سجّل دخولك لعرض طلباتك"
              description="سيظهر هنا سجل جميع مشترياتك المرتبطة ببريدك الإلكتروني."
              action={
                <Button
                  onClick={() => navigate({ name: "login" })}
                  className="btn-gradient h-11 rounded-xl px-6"
                >
                  <LogIn className="h-4 w-4" />
                  تسجيل الدخول
                </Button>
              }
            />
          ) : loading ? (
            <ListSkeleton count={3} />
          ) : error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : !data || data.length === 0 ? (
            <EmptyState
              icon={Package}
              title="لا توجد طلبات بعد"
              description="لم تقم بأي عملية شراء بهذا الحساب حتى الآن."
              action={
                <Button
                  onClick={() => navigate({ name: "store" })}
                  className="btn-gradient h-11 rounded-xl px-6"
                >
                  <Package className="h-4 w-4" />
                  تصفح المتجر
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {data.map((order) => (
                <div key={order.id} className="card-glow rounded-2xl p-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span dir="ltr" className="font-mono-cyber truncate text-xs font-bold text-cyber">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-mute">{fmtDate(order.createdAt)}</p>
                  <ul className="my-3 space-y-1.5 border-y border-border-soft py-3">
                    {order.items.map((item, j) => (
                      <li key={item.id ?? j} className="flex items-center justify-between gap-3 text-sm text-sec">
                        <span className="min-w-0 truncate">
                          {item.name} <span className="text-xs text-mute">× {item.qty}</span>
                        </span>
                        <span className="shrink-0 text-xs text-mute">{fmtPrice(item.price * item.qty)}</span>
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
        </div>
      </section>
    </>
  );
}
