"use client";

/* حسابي — نسخة Supabase: الملف الشخصي + حجوزاتي + رسائلي */

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { CalendarDays, Inbox, LayoutDashboard, Loader2, LogOut, Mail, Phone, Save, Send, UserRound, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { EmptyState, ErrorState, ListSkeleton, ScreenLoader } from "@/components/screen-state";
import { toast } from "@/hooks/use-toast";
import { useAppRouter } from "@/lib/router";
import { useAuth } from "@/lib/auth";
import { getSupabase, type BookingRow, type ContactMessageRow } from "@/lib/supabase";
import { useContent, useI18n } from "@/i18n";
import { sendContactEmail } from "@/lib/contact-email";
import { Field, INPUT_CLS } from "./auth-ui";

export const STATUS_CLS: Record<string, string> = {
  pending: "text-[#ffd700] bg-[rgba(255,215,0,0.1)] border-[rgba(255,215,0,0.3)]",
  new: "text-[#ffd700] bg-[rgba(255,215,0,0.1)] border-[rgba(255,215,0,0.3)]",
  confirmed: "text-cyber bg-[rgba(0,240,255,0.1)] border-[rgba(0,240,255,0.3)]",
  read: "text-cyber bg-[rgba(0,240,255,0.1)] border-[rgba(0,240,255,0.3)]",
  done: "text-[#00ff88] bg-[rgba(0,255,136,0.1)] border-[rgba(0,255,136,0.3)]",
  cancelled: "text-[#ff2a6d] bg-[rgba(255,42,109,0.1)] border-[rgba(255,42,109,0.3)]",
};

export function StatusPill({ status }: { status: string }) {
  const { t } = useI18n();
  const label = (t.auth.status as Record<string, string>)[status] ?? status;
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${STATUS_CLS[status] ?? STATUS_CLS.pending}`}>
      {label}
    </span>
  );
}

export function useFmtDate() {
  const { t } = useI18n();
  return (iso: string | null | undefined) =>
    iso ? new Date(iso).toLocaleDateString(t.meta.locale, { year: "numeric", month: "short", day: "numeric" }) : "—";
}

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function SbAccountScreen() {
  const { t } = useI18n();
  const a = t.auth;
  const { navigate } = useAppRouter();
  const { ready, session, profile, isAdmin, refreshProfile, signOut } = useAuth();

  if (!ready) {
    return (
      <>
        <PageHero badge="USER.HUB" title={a.accTitle} highlight={a.accHighlight} subtitle={a.accSubtitle} />
        <ScreenLoader label={a.loading} />
      </>
    );
  }

  if (!session) {
    return (
      <>
        <PageHero badge="USER.HUB" title={a.accTitle} highlight={a.accHighlight} subtitle={a.accSubtitle} />
        <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
          <EmptyState
            icon={UserRound}
            title={a.signedOutTitle}
            description={a.signedOutDesc}
            action={
              <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                <Button onClick={() => navigate({ name: "login" })} className="btn-gradient h-11 rounded-xl px-6">
                  {a.signIn}
                </Button>
                <Button onClick={() => navigate({ name: "register" })} className="btn-outline-cyber h-11 rounded-xl px-6">
                  {a.createAccount}
                </Button>
              </div>
            }
          />
        </section>
      </>
    );
  }

  const email = session.user.email ?? "";
  const name = profile?.full_name || email.split("@")[0];

  return (
    <>
      <PageHero badge="USER.HUB" title={a.accTitle} highlight={a.accHighlight} subtitle={a.accSubtitle} />
      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
        <Reveal>
          <div className="glass rounded-2xl p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div
                  aria-hidden="true"
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[rgba(0,240,255,0.35)] bg-gradient-to-br from-[rgba(0,240,255,0.2)] to-[rgba(124,58,237,0.25)] text-xl font-extrabold text-cyber"
                >
                  {name.trim().charAt(0).toUpperCase() || "?"}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-heading-cyber truncate text-lg font-extrabold text-main">{name}</h2>
                    <Badge
                      className={
                        isAdmin
                          ? "border-[rgba(255,215,0,0.35)] bg-[rgba(255,215,0,0.1)] text-[#ffd700]"
                          : "border-[rgba(0,240,255,0.35)] bg-[rgba(0,240,255,0.1)] text-cyber"
                      }
                    >
                      {isAdmin ? a.roleAdmin : a.roleClient}
                    </Badge>
                  </div>
                  <p dir="ltr" className="mt-0.5 truncate text-start font-mono-cyber text-xs text-mute">
                    {email}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2.5">
                {isAdmin && (
                  <Button onClick={() => navigate({ name: "dashboard" })} className="btn-outline-cyber h-11 rounded-xl">
                    <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                    {a.admin}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={async () => {
                    await signOut();
                    toast({ title: a.logoutTitle, description: a.logoutDesc });
                    navigate({ name: "home" });
                  }}
                  className="h-11 rounded-xl text-[#ff2a6d]! hover:bg-[rgba(255,42,109,0.08)]!"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  {a.logout}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>

        <Tabs defaultValue="bookings" className="mt-8">
          <TabsList aria-label={a.tabsAria} className="grid h-auto w-full grid-cols-3">
            <TabsTrigger value="bookings" className="h-9 text-xs sm:text-sm">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {a.tabBookings}
            </TabsTrigger>
            <TabsTrigger value="messages" className="h-9 text-xs sm:text-sm">
              <Inbox className="h-4 w-4" aria-hidden="true" />
              {a.tabMessages}
            </TabsTrigger>
            <TabsTrigger value="profile" className="h-9 text-xs sm:text-sm">
              <UserRound className="h-4 w-4" aria-hidden="true" />
              {a.tabProfile}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-5">
            <MyBookings userId={session.user.id} email={email} name={profile?.full_name ?? ""} phone={profile?.phone ?? ""} />
          </TabsContent>
          <TabsContent value="messages" className="mt-5">
            <MyMessages userId={session.user.id} />
          </TabsContent>
          <TabsContent value="profile" className="mt-5">
            <ProfileForm
              key={profile?.id ?? "none"}
              userId={session.user.id}
              email={email}
              initialName={profile?.full_name ?? ""}
              initialPhone={profile?.phone ?? ""}
              onSaved={refreshProfile}
            />
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}

/* ── الملف الشخصي ── */
function ProfileForm({
  userId,
  email,
  initialName,
  initialPhone,
  onSaved,
}: {
  userId: string;
  email: string;
  initialName: string;
  initialPhone: string;
  onSaved: () => Promise<void>;
}) {
  const { t } = useI18n();
  const a = t.auth;
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb || busy) return;
    const next: typeof errors = {};
    if (!name.trim()) next.name = a.errNameReq;
    if (phone.trim() && !/^\+?[0-9\s-]{7,20}$/.test(phone.trim())) next.phone = a.errPhoneFmt;
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    const { error } = await sb.from("profiles").update({ full_name: name.trim(), phone: phone.trim() || null }).eq("id", userId);
    setBusy(false);
    if (error) {
      toast({ title: a.genericError, description: error.message, variant: "destructive" });
      return;
    }
    await onSaved();
    toast({ title: a.profileSaved });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card-glow mx-auto max-w-xl space-y-4 rounded-2xl p-6">
      <h3 className="font-heading-cyber flex items-center gap-2 text-sm font-bold text-main">
        <UserRound className="h-4 w-4 text-cyber" aria-hidden="true" />
        {a.profileHeading}
      </h3>
      <Field label={a.nameLabel} icon={UserRound} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
      <Field
        label={a.phoneLabel}
        hint={a.optional}
        icon={Phone}
        ltr
        type="tel"
        autoComplete="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={errors.phone}
      />
      <Field label={a.emailLabel} hint={`— ${a.emailReadonly}`} icon={Mail} ltr type="email" value={email} readOnly disabled />
      <Button type="submit" disabled={busy} aria-busy={busy} className="btn-gradient h-11 w-full rounded-xl">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
        {busy ? a.saving : a.saveProfile}
      </Button>
    </form>
  );
}

/* ── حجوزاتي ── */
function MyBookings({ userId, email, name, phone }: { userId: string; email: string; name: string; phone: string }) {
  const { t, lang } = useI18n();
  const a = t.auth;
  const { SERVICES } = useContent();
  const fmtDate = useFmtDate();
  const [rows, setRows] = useState<BookingRow[] | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ service?: string; date?: string }>({});
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    setLoadErr(null);
    const { data, error } = await sb.from("bookings").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (error) setLoadErr(error.message);
    else setRows((data as BookingRow[]) ?? []);
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb || busy) return;
    const next: typeof errors = {};
    if (!service) next.service = a.errServiceReq;
    if (date && date < todayISO()) next.date = a.errDatePast;
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    const { error } = await sb.from("bookings").insert({ user_id: userId, service, preferred_date: date || null, notes: notes.trim() || null });
    setBusy(false);
    if (error) {
      toast({ title: a.genericError, description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: a.bookingCreated });
    /* إشعار بالبريد إلى contact@ (أفضل جهد — الحجز محفوظ في Supabase) */
    if (email) {
      void sendContactEmail({
        kind: "booking",
        name: name.trim() || email.split("@")[0],
        email,
        phone: phone.trim() || undefined,
        subject: `حجز من حساب العميل: ${service}`,
        message: notes.trim() || undefined,
        details: [
          { label: "الخدمة", value: service },
          { label: "التاريخ المفضل", value: date || "—" },
          { label: "المصدر", value: "صفحة حسابي (Supabase bookings)" },
        ],
        lang: lang === "en" ? "en" : "ar",
      });
    }
    setService("");
    setDate("");
    setNotes("");
    void load();
  }

  async function onCancel(b: BookingRow) {
    const sb = getSupabase();
    if (!sb || !window.confirm(a.cancelConfirm)) return;
    const { error } = await sb.from("bookings").update({ status: "cancelled" }).eq("id", b.id).eq("user_id", userId);
    if (error) {
      toast({ title: a.genericError, description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: a.bookingCancelled });
    void load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      <form onSubmit={onCreate} noValidate className="card-glow space-y-4 rounded-2xl p-6" aria-labelledby="new-booking-h">
        <h3 id="new-booking-h" className="font-heading-cyber flex items-center gap-2 text-sm font-bold text-main">
          <CalendarDays className="h-4 w-4 text-cyber" aria-hidden="true" />
          {a.bookingsHeading}
        </h3>
        <div className="space-y-1.5">
          <Label htmlFor="bk-service" className="text-xs text-sec">
            {a.serviceLabel}
          </Label>
          <select
            id="bk-service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
            aria-invalid={!!errors.service}
            aria-describedby={errors.service ? "bk-service-err" : undefined}
            className={INPUT_CLS}
          >
            <option value="">{a.servicePh}</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.service && (
            <p id="bk-service-err" role="alert" className="text-[11px] font-medium text-[#ff2a6d]">
              {errors.service}
            </p>
          )}
        </div>
        <Field label={a.dateLabel} hint={a.optional} type="date" min={todayISO()} value={date} onChange={(e) => setDate(e.target.value)} error={errors.date} />
        <div className="space-y-1.5">
          <Label htmlFor="bk-notes" className="text-xs text-sec">
            {a.notesLabel} <span className="text-mute">{a.optional}</span>
          </Label>
          <textarea
            id="bk-notes"
            rows={4}
            maxLength={2000}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={a.notesPh}
            className={`${INPUT_CLS} h-auto py-3`}
          />
        </div>
        <Button type="submit" disabled={busy} aria-busy={busy} className="btn-gradient h-11 w-full rounded-xl">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
          {busy ? a.submittingBooking : a.submitBooking}
        </Button>
      </form>

      <div>
        <h3 className="font-heading-cyber mb-3 text-sm font-bold text-main">{a.myBookings}</h3>
        {loadErr ? (
          <ErrorState message={loadErr} onRetry={load} />
        ) : !rows ? (
          <ListSkeleton count={2} className="lg:grid-cols-1" />
        ) : rows.length === 0 ? (
          <EmptyState icon={CalendarDays} title={a.noBookings} description="" />
        ) : (
          <ul className="space-y-3">
            {rows.map((b) => (
              <li key={b.id} className="card-glow rounded-2xl p-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h4 className="font-heading-cyber truncate font-bold text-main">{b.service}</h4>
                  <StatusPill status={b.status} />
                </div>
                <p className="flex items-center gap-1.5 text-xs text-sec">
                  <CalendarDays className="h-3.5 w-3.5 text-cyber" aria-hidden="true" />
                  {b.preferred_date ? fmtDate(b.preferred_date) : a.noDate}
                </p>
                {b.notes && <p className="mt-3 rounded-xl border border-border-soft bg-elev-2/60 p-3 text-xs leading-6 text-mute">{b.notes}</p>}
                {(b.status === "pending" || b.status === "confirmed") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCancel(b)}
                    aria-label={a.cancelBookingAria(b.service)}
                    className="mt-3 rounded-xl text-[#ff2a6d]! hover:bg-[rgba(255,42,109,0.08)]!"
                  >
                    <XCircle className="h-4 w-4" aria-hidden="true" />
                    {a.cancelBooking}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ── رسائلي ── */
function MyMessages({ userId }: { userId: string }) {
  const { t } = useI18n();
  const a = t.auth;
  const { navigate } = useAppRouter();
  const fmtDate = useFmtDate();
  const [rows, setRows] = useState<ContactMessageRow[] | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    setLoadErr(null);
    const { data, error } = await sb.from("contact_messages").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (error) setLoadErr(error.message);
    else setRows((data as ContactMessageRow[]) ?? []);
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loadErr) return <ErrorState message={loadErr} onRetry={load} />;
  if (!rows) return <ListSkeleton count={2} />;
  if (rows.length === 0)
    return (
      <EmptyState
        icon={Inbox}
        title={a.noMessages}
        description=""
        action={
          <Button onClick={() => navigate({ name: "contact" })} className="btn-gradient h-11 rounded-xl px-6">
            <Mail className="h-4 w-4" aria-hidden="true" />
            {a.writeMessage}
          </Button>
        }
      />
    );
  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {rows.map((m) => (
        <li key={m.id} className="card-glow rounded-2xl p-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h4 className="truncate font-bold text-main">{m.subject || "—"}</h4>
            <StatusPill status={m.status} />
          </div>
          <p className="text-xs text-mute">{fmtDate(m.created_at)}</p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-sec">{m.message}</p>
        </li>
      ))}
    </ul>
  );
}
