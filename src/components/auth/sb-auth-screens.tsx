"use client";

/* شاشات الدخول/التسجيل/الاستعادة المعتمدة على Supabase Auth (تُستخدم عند ضبط متغيرات Supabase) */

import { useEffect, useRef, useState, type FormEvent } from "react";
import { KeyRound, LayoutDashboard, Loader2, LogIn, LogOut, Mail, MailCheck, Phone, UserPlus, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ScreenLoader } from "@/components/screen-state";
import { toast } from "@/hooks/use-toast";
import { useAppRouter } from "@/lib/router";
import { useAuth } from "@/lib/auth";
import { getSupabase, REDIRECTS, SUPABASE_GOOGLE } from "@/lib/supabase";
import { useI18n } from "@/i18n";
import { EMAIL_RE, Field, GoogleMark, PasswordField, useAuthErrorText } from "./auth-ui";

const ICON_WRAP =
  "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(0,240,255,0.3)] bg-[rgba(0,240,255,0.06)] shadow-[0_0_20px_rgba(0,240,255,0.15)]";

/* ── Google ── */
function GoogleButton() {
  const { t } = useI18n();
  const errText = useAuthErrorText();
  const [busy, setBusy] = useState(false);
  if (!SUPABASE_GOOGLE) return null;

  async function go() {
    const sb = getSupabase();
    if (!sb) return;
    setBusy(true);
    const { error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: REDIRECTS.home },
    });
    if (error) {
      setBusy(false);
      toast({ title: t.auth.loginFailTitle, description: errText(error), variant: "destructive" });
    }
  }

  return (
    <>
      <div className="my-5 flex items-center gap-3 text-[11px] text-mute" aria-hidden="true">
        <span className="h-px flex-1 bg-border-soft" />
        {t.auth.or}
        <span className="h-px flex-1 bg-border-soft" />
      </div>
      <Button type="button" variant="outline" onClick={go} disabled={busy} className="h-11 w-full rounded-xl">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <GoogleMark />}
        {busy ? t.auth.googleRedirecting : t.auth.google}
      </Button>
    </>
  );
}

/* ── بطاقة "مسجل بالفعل" ── */
function AlreadySignedIn() {
  const { t } = useI18n();
  const a = t.auth;
  const { navigate } = useAppRouter();
  const { session, profile, isAdmin, signOut } = useAuth();
  const name = profile?.full_name || session?.user.email || "";
  return (
    <Reveal>
      <div className="card-glow mx-auto max-w-md rounded-2xl p-8 text-center">
        <span className={ICON_WRAP}>
          <UserRound className="h-6 w-6 text-cyber" aria-hidden="true" />
        </span>
        <h2 className="font-heading-cyber text-lg font-extrabold text-main">{a.alreadyIn}</h2>
        <p className="mt-1 text-sm text-sec">
          {a.hello} <span className="font-bold text-cyber">{name}</span>
        </p>
        <div className="mt-6 flex flex-col gap-2.5">
          <Button onClick={() => navigate({ name: "account" })} className="btn-gradient h-11 rounded-xl">
            {a.account}
          </Button>
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
            }}
            className="h-11 rounded-xl text-[#ff2a6d]! hover:bg-[rgba(255,42,109,0.08)]!"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {a.logout}
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

/** يعرض خطأ رابط إعادة التوجيه (إن وُجد) مرة واحدة */
function useUrlErrorToast() {
  const { urlError, clearUrlError } = useAuth();
  const { t } = useI18n();
  useEffect(() => {
    if (!urlError) return;
    toast({ title: t.auth.linkErrorTitle, description: urlError, variant: "destructive" });
    clearUrlError();
  }, [urlError, clearUrlError, t]);
}

/* ═════════════ تسجيل الدخول + نسيت كلمة المرور ═════════════ */
export function SbLoginScreen() {
  const { t } = useI18n();
  const a = t.auth;
  const { route, navigate } = useAppRouter();
  const { ready, session } = useAuth();
  const errText = useAuthErrorText();
  useUrlErrorToast();

  const [mode, setMode] = useState<"login" | "forgot" | "sent">(route.slug === "forgot" ? "forgot" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [busy, setBusy] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // نقل التركيز لعنوان البطاقة عند تبديل الوضع (قارئات الشاشة)
  useEffect(() => {
    headingRef.current?.focus();
  }, [mode]);

  function validate(needPass: boolean) {
    const next: typeof errors = {};
    if (!email.trim()) next.email = a.errEmailReq;
    else if (!EMAIL_RE.test(email.trim())) next.email = a.errEmailFmt;
    if (needPass && !password) next.password = a.errPassReq;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb || busy || !validate(true)) return;
    setBusy(true);
    const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      toast({ title: a.loginFailTitle, description: errText(error), variant: "destructive" });
      return;
    }
    const { data: prof } = await sb.from("profiles").select("full_name, role").eq("id", data.user.id).maybeSingle();
    toast({ title: a.welcome(prof?.full_name || data.user.email || ""), description: a.welcomeDesc });
    navigate({ name: prof?.role === "admin" ? "dashboard" : "account" });
  }

  async function onForgot(e: FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb || busy || !validate(false)) return;
    setBusy(true);
    const { error } = await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: REDIRECTS.reset });
    setBusy(false);
    if (error) {
      toast({ title: a.linkErrorTitle, description: errText(error), variant: "destructive" });
      return;
    }
    setMode("sent");
  }

  return (
    <>
      <PageHero badge="AUTH.GATE" title={a.loginTitle} highlight={a.loginHighlight} subtitle={a.loginSubtitle} />
      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
        {!ready ? (
          <ScreenLoader label={a.loading} />
        ) : session ? (
          <AlreadySignedIn />
        ) : (
          <div className="mx-auto max-w-md space-y-5">
            <Reveal>
              {mode === "sent" ? (
                <div className="card-glow rounded-2xl p-8 text-center" role="status">
                  <span className={ICON_WRAP}>
                    <MailCheck className="h-5 w-5 text-cyber" aria-hidden="true" />
                  </span>
                  <h2 ref={headingRef} tabIndex={-1} className="font-heading-cyber text-xl font-extrabold text-main outline-none">
                    {a.resetSentTitle}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-sec">{a.resetSentDesc(email.trim())}</p>
                  <Button onClick={() => setMode("login")} className="btn-outline-cyber mt-6 h-11 w-full rounded-xl">
                    {a.backToLogin}
                  </Button>
                </div>
              ) : (
                <form onSubmit={mode === "login" ? onLogin : onForgot} noValidate className="card-glow rounded-2xl p-8">
                  <div className="mb-6 text-center">
                    <span className={ICON_WRAP}>
                      {mode === "login" ? (
                        <LogIn className="h-5 w-5 text-cyber" aria-hidden="true" />
                      ) : (
                        <KeyRound className="h-5 w-5 text-cyber" aria-hidden="true" />
                      )}
                    </span>
                    <h2 ref={headingRef} tabIndex={-1} className="font-heading-cyber text-xl font-extrabold text-main outline-none">
                      {mode === "login" ? a.gate : a.forgotTitle}
                    </h2>
                    <p className="mt-1 text-xs text-mute">{mode === "login" ? a.gateDesc : a.forgotDesc}</p>
                  </div>

                  <div className="space-y-4">
                    <Field
                      label={a.emailLabel}
                      icon={Mail}
                      ltr
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={errors.email}
                    />
                    {mode === "login" && (
                      <PasswordField
                        label={a.passwordLabel}
                        autoComplete="current-password"
                        value={password}
                        onChange={setPassword}
                        error={errors.password}
                      />
                    )}
                  </div>

                  {mode === "login" && (
                    <div className="mt-2 text-end">
                      <button
                        type="button"
                        onClick={() => {
                          setErrors({});
                          setMode("forgot");
                        }}
                        className="text-xs font-medium text-cyber hover:underline"
                      >
                        {a.forgotLink}
                      </button>
                    </div>
                  )}

                  <Button type="submit" disabled={busy} aria-busy={busy} className="btn-gradient mt-5 h-12 w-full rounded-xl text-base">
                    {busy && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
                    {mode === "login" ? (busy ? a.signingIn : a.signIn) : busy ? a.sendingReset : a.sendReset}
                  </Button>

                  {mode === "login" ? (
                    <GoogleButton />
                  ) : (
                    <Button type="button" variant="ghost" onClick={() => setMode("login")} className="mt-3 h-10 w-full rounded-xl text-sm">
                      {a.backToLogin}
                    </Button>
                  )}
                </form>
              )}
            </Reveal>

            <p className="text-center text-sm text-sec">
              {a.noAccount}{" "}
              <button type="button" onClick={() => navigate({ name: "register" })} className="font-bold text-cyber transition hover:underline">
                {a.createLink}
              </button>
            </p>
          </div>
        )}
      </section>
    </>
  );
}

/* ═════════════ إنشاء حساب ═════════════ */
export function SbRegisterScreen() {
  const { t } = useI18n();
  const a = t.auth;
  const { navigate } = useAppRouter();
  const { ready, session } = useAuth();
  const errText = useAuthErrorText();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [busy, setBusy] = useState(false);
  const [confirmFor, setConfirmFor] = useState<string | null>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (confirmFor) doneRef.current?.focus();
  }, [confirmFor]);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function validate() {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = a.errNameReq;
    if (!form.email.trim()) e.email = a.errEmailReq;
    else if (!EMAIL_RE.test(form.email.trim())) e.email = a.errEmailFmt;
    if (form.phone.trim() && !/^\+?[0-9\s-]{7,20}$/.test(form.phone.trim())) e.phone = a.errPhoneFmt;
    if (!form.password) e.password = a.errPassReq;
    else if (form.password.length < 8) e.password = a.errPassLen;
    if (form.confirm !== form.password) e.confirm = a.errPassMatch;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const sb = getSupabase();
    if (!sb || busy || !validate()) return;
    setBusy(true);
    const email = form.email.trim();
    const phone = form.phone.trim() || null;
    const { data, error } = await sb.auth.signUp({
      email,
      password: form.password,
      options: {
        data: { full_name: form.name.trim(), phone },
        emailRedirectTo: REDIRECTS.account,
      },
    });
    setBusy(false);
    if (error) {
      toast({ title: a.registerFailTitle, description: errText(error), variant: "destructive" });
      return;
    }
    // Supabase يُخفي وجود البريد: مستخدم بلا هويات = مسجّل مسبقاً
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      toast({ title: a.registerFailTitle, description: a.alreadyRegistered, variant: "destructive" });
      return;
    }
    if (data.session) {
      // التأكيد بالبريد معطّل: الجلسة جاهزة — نضمن حفظ الاسم والجوال في الملف الشخصي
      await sb.from("profiles").update({ full_name: form.name.trim(), phone }).eq("id", data.session.user.id);
      toast({ title: a.registeredTitle, description: a.welcome(form.name.trim()) });
      navigate({ name: "account" });
      return;
    }
    setConfirmFor(email);
  }

  return (
    <>
      <PageHero badge="AUTH.NEW" title={a.registerTitle} highlight={a.registerHighlight} subtitle={a.registerSubtitle} />
      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
        {!ready ? (
          <ScreenLoader label={a.loading} />
        ) : session ? (
          <AlreadySignedIn />
        ) : confirmFor ? (
          <Reveal>
            <div className="card-glow mx-auto max-w-md rounded-2xl p-8 text-center" role="status">
              <span className={ICON_WRAP}>
                <MailCheck className="h-5 w-5 text-cyber" aria-hidden="true" />
              </span>
              <h2 ref={doneRef} tabIndex={-1} className="font-heading-cyber text-xl font-extrabold text-main outline-none">
                {a.confirmTitle}
              </h2>
              <p className="mt-2 text-sm leading-7 text-sec">{a.confirmDesc(confirmFor)}</p>
              <Button onClick={() => navigate({ name: "login" })} className="btn-gradient mt-6 h-11 w-full rounded-xl">
                {a.signIn}
              </Button>
            </div>
          </Reveal>
        ) : (
          <div className="mx-auto max-w-md space-y-5">
            <Reveal>
              <form onSubmit={onSubmit} noValidate className="card-glow rounded-2xl p-8">
                <div className="mb-6 text-center">
                  <span className={ICON_WRAP}>
                    <UserPlus className="h-5 w-5 text-cyber" aria-hidden="true" />
                  </span>
                  <h2 className="font-heading-cyber text-xl font-extrabold text-main">{a.createAccount}</h2>
                </div>
                <div className="space-y-4">
                  <Field
                    label={a.nameLabel}
                    icon={UserRound}
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    error={errors.name}
                  />
                  <Field
                    label={a.emailLabel}
                    icon={Mail}
                    ltr
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    error={errors.email}
                  />
                  <Field
                    label={a.phoneLabel}
                    hint={a.optional}
                    icon={Phone}
                    ltr
                    type="tel"
                    autoComplete="tel"
                    placeholder="+966 5x xxx xxxx"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    error={errors.phone}
                  />
                  <PasswordField
                    label={a.passwordLabel}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(v) => set("password", v)}
                    error={errors.password}
                  />
                  <PasswordField
                    label={a.confirmPasswordLabel}
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={(v) => set("confirm", v)}
                    error={errors.confirm}
                  />
                </div>
                <Button type="submit" disabled={busy} aria-busy={busy} className="btn-gradient mt-6 h-12 w-full rounded-xl text-base">
                  {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <UserPlus className="h-5 w-5" aria-hidden="true" />}
                  {busy ? a.creating : a.createAccount}
                </Button>
                <GoogleButton />
              </form>
            </Reveal>
            <p className="text-center text-sm text-sec">
              {a.haveAccount}{" "}
              <button type="button" onClick={() => navigate({ name: "login" })} className="font-bold text-cyber transition hover:underline">
                {a.signInLink}
              </button>
            </p>
          </div>
        )}
      </section>
    </>
  );
}

/* ═════════════ تعيين كلمة مرور جديدة (من رابط البريد) ═════════════ */
export function SbResetScreen() {
  const { t } = useI18n();
  const a = t.auth;
  const { navigate } = useAppRouter();
  const { ready, session } = useAuth();
  const errText = useAuthErrorText();
  useUrlErrorToast();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb || busy) return;
    const next: typeof errors = {};
    if (!password) next.password = a.errPassReq;
    else if (password.length < 8) next.password = a.errPassLen;
    if (confirm !== password) next.confirm = a.errPassMatch;
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    const { error } = await sb.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast({ title: a.linkErrorTitle, description: errText(error), variant: "destructive" });
      return;
    }
    toast({ title: a.resetOkTitle, description: a.resetOkDesc });
    navigate({ name: "account" });
  }

  return (
    <>
      <PageHero badge="AUTH.RESET" title={a.resetTitle} highlight={a.resetHighlight} subtitle={a.resetSubtitle} />
      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
        {!ready ? (
          <ScreenLoader label={a.loading} />
        ) : !session ? (
          <div className="card-glow mx-auto max-w-md rounded-2xl p-8 text-center" role="alert">
            <span className={ICON_WRAP}>
              <KeyRound className="h-5 w-5 text-[#ff2a6d]" aria-hidden="true" />
            </span>
            <h2 className="font-heading-cyber text-lg font-extrabold text-main">{a.linkErrorTitle}</h2>
            <p className="mt-2 text-sm leading-7 text-sec">{a.resetNoSession}</p>
            <Button onClick={() => navigate({ name: "login", slug: "forgot" })} className="btn-gradient mt-6 h-11 w-full rounded-xl">
              {a.requestNewLink}
            </Button>
          </div>
        ) : (
          <Reveal>
            <form onSubmit={onSubmit} noValidate className="card-glow mx-auto max-w-md space-y-4 rounded-2xl p-8">
              <PasswordField label={a.newPassword} autoComplete="new-password" value={password} onChange={setPassword} error={errors.password} />
              <PasswordField label={a.confirmPasswordLabel} autoComplete="new-password" value={confirm} onChange={setConfirm} error={errors.confirm} />
              <Button type="submit" disabled={busy} aria-busy={busy} className="btn-gradient h-12 w-full rounded-xl text-base">
                {busy && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
                {busy ? a.savingPassword : a.savePassword}
              </Button>
            </form>
          </Reveal>
        )}
      </section>
    </>
  );
}
