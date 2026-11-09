"use client";

/* لوحة الإدارة — نسخة Supabase. الصلاحية من صف profiles (role=admin) والحماية الفعلية عبر RLS/is_admin() */

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarCheck, Check, Inbox, Mail, RefreshCw, ShieldAlert, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHero } from "@/components/page-hero";
import { EmptyState, ErrorState, ListSkeleton, ScreenLoader } from "@/components/screen-state";
import { toast } from "@/hooks/use-toast";
import { useAppRouter } from "@/lib/router";
import { useAuth } from "@/lib/auth";
import {
  BOOKING_STATUSES,
  getSupabase,
  type BookingRow,
  type BookingStatus,
  type ContactMessageRow,
  type Profile,
  type ProfileRole,
} from "@/lib/supabase";
import { useI18n } from "@/i18n";
import { StatusPill, useFmtDate } from "./sb-account-screen";

const SELECT_CLS =
  "h-9 rounded-lg border border-border-strong bg-elev-2/60 px-2 text-xs text-main outline-none focus:border-[rgba(0,240,255,0.5)]";

interface Data {
  users: Profile[];
  messages: ContactMessageRow[];
  bookings: BookingRow[];
}

export function SbAdminScreen() {
  const { t } = useI18n();
  const a = t.auth;
  const { navigate } = useAppRouter();
  const { ready, session, isAdmin, profileLoading } = useAuth();

  const hero = <PageHero badge="ADMIN.CORE" title={a.adminTitle} highlight={a.adminHighlight} subtitle={a.adminSubtitle} />;

  // ننتظر قراءة الملف الشخصي قبل الحكم بعدم التصريح
  if (!ready || profileLoading) {
    return (
      <>
        {hero}
        <ScreenLoader label={a.loading} />
      </>
    );
  }

  if (!session || !isAdmin) {
    return (
      <>
        {hero}
        <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
          <div role="alert" className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-[rgba(255,42,109,0.3)] bg-[rgba(255,42,109,0.05)] px-6 py-12 text-center">
            <ShieldAlert className="mb-4 h-10 w-10 text-[#ff2a6d]" aria-hidden="true" />
            <h2 className="font-heading-cyber text-lg font-bold text-main">{a.notAuthTitle}</h2>
            <p className="mt-2 text-sm text-sec">{a.notAuthDesc}</p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              {!session && (
                <Button onClick={() => navigate({ name: "login" })} className="btn-gradient h-11 rounded-xl px-6">
                  {a.signInAsAdmin}
                </Button>
              )}
              <Button onClick={() => navigate({ name: "home" })} className="btn-outline-cyber h-11 rounded-xl px-6">
                {a.backHome}
              </Button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {hero}
      <AdminPanel selfId={session.user.id} />
    </>
  );
}

function AdminPanel({ selfId }: { selfId: string }) {
  const { t } = useI18n();
  const a = t.auth;
  const fmtDate = useFmtDate();
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    setLoading(true);
    setErr(null);
    const [u, m, b] = await Promise.all([
      sb.from("profiles").select("*").order("created_at", { ascending: false }),
      sb.from("contact_messages").select("*").order("created_at", { ascending: false }),
      sb.from("bookings").select("*").order("created_at", { ascending: false }),
    ]);
    setLoading(false);
    const e = u.error || m.error || b.error;
    if (e) {
      setErr(e.message || a.loadError);
      return;
    }
    setData({ users: (u.data as Profile[]) ?? [], messages: (m.data as ContactMessageRow[]) ?? [], bookings: (b.data as BookingRow[]) ?? [] });
  }, [a.loadError]);

  useEffect(() => {
    void load();
  }, [load]);

  const byId = useMemo(() => new Map((data?.users ?? []).map((p) => [p.id, p])), [data]);

  const stats = useMemo(
    () => ({
      users: data?.users.length ?? 0,
      newMessages: data?.messages.filter((m) => m.status === "new").length ?? 0,
      pending: data?.bookings.filter((b) => b.status === "pending").length ?? 0,
    }),
    [data],
  );

  function fail(e: { message: string }) {
    toast({ title: a.genericError, description: e.message, variant: "destructive" });
  }

  async function setRole(p: Profile, role: ProfileRole) {
    const sb = getSupabase();
    if (!sb || role === p.role) return;
    if (p.id === selfId && role !== "admin") {
      toast({ title: a.cannotDemoteSelf, variant: "destructive" });
      return;
    }
    const { data: rows, error } = await sb.from("profiles").update({ role }).eq("id", p.id).select("role");
    if (error) return fail(error);
    if (!rows?.length || rows[0].role !== role) return fail({ message: a.genericError });
    toast({ title: a.roleUpdated });
    void load();
  }

  async function markRead(m: ContactMessageRow) {
    const sb = getSupabase();
    if (!sb) return;
    const { error } = await sb.from("contact_messages").update({ status: "read" }).eq("id", m.id);
    if (error) return fail(error);
    toast({ title: a.markedRead });
    void load();
  }

  async function removeMsg(m: ContactMessageRow) {
    const sb = getSupabase();
    if (!sb || !window.confirm(a.deleteConfirm)) return;
    const { error } = await sb.from("contact_messages").delete().eq("id", m.id);
    if (error) return fail(error);
    toast({ title: a.msgDeleted });
    void load();
  }

  async function setStatus(b: BookingRow, status: BookingStatus) {
    const sb = getSupabase();
    if (!sb || status === b.status) return;
    const { error } = await sb.from("bookings").update({ status }).eq("id", b.id);
    if (error) return fail(error);
    toast({ title: a.statusUpdated });
    void load();
  }

  const statCards = [
    { label: a.statUsers, value: stats.users, icon: Users },
    { label: a.statNewMessages, value: stats.newMessages, icon: Inbox },
    { label: a.statPendingBookings, value: stats.pending, icon: CalendarCheck },
  ];

  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
      <div className="mb-6 flex justify-end">
        <Button variant="outline" size="sm" onClick={load} disabled={loading} aria-busy={loading} className="rounded-full">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
          {a.refresh}
        </Button>
      </div>

      <ul aria-label={a.statsAria} className="grid gap-4 sm:grid-cols-3">
        {statCards.map((s) => (
          <li key={s.label} className="card-glow flex items-center gap-4 rounded-2xl p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(0,240,255,0.3)] bg-[rgba(0,240,255,0.06)]">
              <s.icon className="h-5 w-5 text-cyber" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono-cyber text-2xl font-extrabold text-main">{data ? s.value.toLocaleString("en-US") : "—"}</p>
              <p className="text-xs text-sec">{s.label}</p>
            </div>
          </li>
        ))}
      </ul>

      {err ? (
        <div className="mt-8">
          <ErrorState message={err} onRetry={load} />
        </div>
      ) : !data ? (
        <div className="mt-8">
          <ListSkeleton count={3} />
        </div>
      ) : (
        <Tabs defaultValue="messages" className="mt-8">
          <TabsList aria-label={a.adminTabsAria} className="grid h-auto w-full grid-cols-3">
            <TabsTrigger value="messages" className="h-9 text-xs sm:text-sm">
              <Inbox className="h-4 w-4" aria-hidden="true" />
              {a.tabInbox}
            </TabsTrigger>
            <TabsTrigger value="bookings" className="h-9 text-xs sm:text-sm">
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              {a.tabAllBookings}
            </TabsTrigger>
            <TabsTrigger value="users" className="h-9 text-xs sm:text-sm">
              <Users className="h-4 w-4" aria-hidden="true" />
              {a.tabUsers}
            </TabsTrigger>
          </TabsList>

          {/* ── الرسائل ── */}
          <TabsContent value="messages" className="mt-5">
            {data.messages.length === 0 ? (
              <EmptyState icon={Inbox} title={a.noInbox} description="" />
            ) : (
              <ul className="grid gap-4 lg:grid-cols-2">
                {data.messages.map((m) => (
                  <li key={m.id} className={`card-glow rounded-2xl p-5 ${m.status === "new" ? "ring-1 ring-[rgba(255,215,0,0.35)]" : ""}`}>
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <h3 className="truncate font-bold text-main">{m.subject || "—"}</h3>
                      <StatusPill status={m.status} />
                    </div>
                    <p className="text-xs text-mute">
                      {a.from}: <span className="font-bold text-sec">{m.name}</span> ·{" "}
                      <span dir="ltr" className="font-mono-cyber">
                        {m.email}
                      </span>{" "}
                      · {fmtDate(m.created_at)}
                    </p>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-sec">{m.message}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {m.status === "new" && (
                        <Button size="sm" variant="outline" onClick={() => markRead(m)} aria-label={a.markReadAria(m.name)} className="rounded-xl">
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          {a.markRead}
                        </Button>
                      )}
                      <Button size="sm" variant="outline" asChild className="rounded-xl">
                        <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject ?? "CTO-DRS"}`)}`}>
                          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                          {a.replyByEmail}
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeMsg(m)}
                        aria-label={a.deleteMsgAria(m.name)}
                        className="rounded-xl text-[#ff2a6d]! hover:bg-[rgba(255,42,109,0.08)]!"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        {a.deleteMsg}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          {/* ── الحجوزات ── */}
          <TabsContent value="bookings" className="mt-5">
            {data.bookings.length === 0 ? (
              <EmptyState icon={CalendarCheck} title={a.noAllBookings} description="" />
            ) : (
              <div className="card-glow rounded-2xl p-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead scope="col">{a.colClient}</TableHead>
                      <TableHead scope="col">{a.colService}</TableHead>
                      <TableHead scope="col">{a.colDate}</TableHead>
                      <TableHead scope="col">{a.colNotes}</TableHead>
                      <TableHead scope="col">{a.colStatus}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.bookings.map((b) => {
                      const p = byId.get(b.user_id);
                      const who = p?.full_name || p?.email || b.user_id.slice(0, 8);
                      return (
                        <TableRow key={b.id}>
                          <TableCell>
                            <div className="font-bold text-main">{who}</div>
                            {p?.email && (
                              <div dir="ltr" className="font-mono-cyber text-[11px] text-mute">
                                {p.email}
                              </div>
                            )}
                            {p?.phone && (
                              <div dir="ltr" className="font-mono-cyber text-[11px] text-mute">
                                {p.phone}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="whitespace-normal">{b.service}</TableCell>
                          <TableCell>{b.preferred_date ? fmtDate(b.preferred_date) : "—"}</TableCell>
                          <TableCell className="max-w-[16rem] whitespace-normal text-xs text-sec">{b.notes || "—"}</TableCell>
                          <TableCell>
                            <select
                              value={b.status}
                              onChange={(e) => setStatus(b, e.target.value as BookingStatus)}
                              aria-label={a.changeStatusAria(`${b.service} — ${who}`)}
                              className={SELECT_CLS}
                            >
                              {BOOKING_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {a.status[s]}
                                </option>
                              ))}
                            </select>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* ── المستخدمون ── */}
          <TabsContent value="users" className="mt-5">
            {data.users.length === 0 ? (
              <EmptyState icon={Users} title={a.noUsers} description="" />
            ) : (
              <div className="card-glow rounded-2xl p-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead scope="col">{a.colName}</TableHead>
                      <TableHead scope="col">{a.colEmail}</TableHead>
                      <TableHead scope="col">{a.colPhone}</TableHead>
                      <TableHead scope="col">{a.colJoined}</TableHead>
                      <TableHead scope="col">{a.colRole}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.users.map((p) => {
                      const nm = p.full_name || p.email || p.id.slice(0, 8);
                      return (
                        <TableRow key={p.id}>
                          <TableCell className="font-bold text-main">{nm}</TableCell>
                          <TableCell dir="ltr" className="font-mono-cyber text-xs">
                            {p.email ?? "—"}
                          </TableCell>
                          <TableCell dir="ltr" className="font-mono-cyber text-xs">
                            {p.phone ?? "—"}
                          </TableCell>
                          <TableCell>{fmtDate(p.created_at)}</TableCell>
                          <TableCell>
                            <select
                              value={p.role}
                              onChange={(e) => setRole(p, e.target.value as ProfileRole)}
                              aria-label={a.changeRoleAria(nm)}
                              disabled={p.id === selfId}
                              className={SELECT_CLS}
                            >
                              <option value="client">{a.roleClient}</option>
                              <option value="admin">{a.roleAdmin}</option>
                            </select>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </section>
  );
}
