"use client";

import { useState, type FormEvent } from "react";
import {
  Eye,
  EyeOff,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogIn,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { toast } from "@/hooks/use-toast";
import { useAppRouter } from "@/lib/router";
import { useAppStore } from "@/lib/store";
import { sendJson } from "@/lib/use-api";
import type { AuthUser } from "@/lib/types";

const INPUT_CLS =
  "h-11 w-full rounded-xl border border-border-strong bg-elev-2/60 px-4 text-sm text-main outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.15)]";

const DEMO_ACCOUNTS = [
  {
    label: "مدير النظام",
    email: "admin@ctodrs.com",
    password: "admin123",
    color: "#ffd700",
    icon: ShieldCheck,
  },
  {
    label: "حساب عميل تجريبي",
    email: "demo@ctodrs.com",
    password: "demo1234",
    color: "#00f0ff",
    icon: UserRound,
  },
];

export function LoginScreen() {
  const { navigate } = useAppRouter();
  const { user, setUser } = useAppStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [sending, setSending] = useState(false);

  function fillDemo(account: (typeof DEMO_ACCOUNTS)[number]) {
    setEmail(account.email);
    setPassword(account.password);
    setErrors({});
  }

  function validate() {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "صيغة البريد الإلكتروني غير صحيحة";
    if (!password) next.password = "كلمة المرور مطلوبة";
    else if (password.length < 6)
      next.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending || !validate()) return;
    setSending(true);
    try {
      const res = await sendJson<AuthUser>("/api/auth/login", {
        email: email.trim(),
        password,
      });
      setUser(res);
      toast({ title: `أهلاً بعودتك، ${res.name}`, description: "تم تسجيل الدخول بنجاح" });
      navigate({ name: res.role === "admin" ? "dashboard" : "account" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "تعذر تسجيل الدخول، حاول مرة أخرى";
      toast({ title: "فشل تسجيل الدخول", description: msg, variant: "destructive" });
    } finally {
      setSending(false);
    }
  }

  function handleLogout() {
    setUser(null);
    toast({ title: "تم تسجيل الخروج", description: "نراك قريباً!" });
  }

  return (
    <>
      <PageHero
        badge="AUTH.GATE"
        title="تسجيل"
        highlight="الدخول"
        subtitle="ادخل إلى حسابك لإدارة طلباتك وحجوزاتك ومتابعة كل شيء من مكان واحد"
      />

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
        {user ? (
          <Reveal>
            <div className="card-glow mx-auto max-w-md rounded-2xl p-8 text-center">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(0,240,255,0.3)] bg-[rgba(0,240,255,0.06)] shadow-[0_0_20px_rgba(0,240,255,0.15)]">
                <UserRound className="h-6 w-6 text-cyber" />
              </span>
              <h2 className="font-heading-cyber text-lg font-extrabold text-main">
                أنت مسجل الدخول بالفعل
              </h2>
              <p className="mt-1 text-sm text-sec">
                مرحباً <span className="font-bold text-cyber">{user.name}</span>
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <Button
                  onClick={() => navigate({ name: "account" })}
                  className="btn-gradient h-11 rounded-xl"
                >
                  حسابي
                </Button>
                {user.role === "admin" && (
                  <Button
                    onClick={() => navigate({ name: "dashboard" })}
                    className="btn-outline-cyber h-11 rounded-xl"
                  >
                    <LayoutDashboard className="h-4 w-4" />
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
          </Reveal>
        ) : (
          <div className="mx-auto max-w-md space-y-5">
            <Reveal>
              <form onSubmit={handleSubmit} noValidate className="card-glow rounded-2xl p-8">
                {/* header */}
                <div className="mb-6 text-center">
                  <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(0,240,255,0.3)] bg-[rgba(0,240,255,0.06)] shadow-[0_0_20px_rgba(0,240,255,0.15)]">
                    <LogIn className="h-5 w-5 text-cyber" />
                  </span>
                  <h2 className="font-heading-cyber text-xl font-extrabold text-main">
                    بوابة الدخول
                  </h2>
                  <p className="mt-1 text-xs text-mute">أدخل بياناتك للوصول إلى حسابك</p>
                </div>

                {/* email */}
                <div className="mb-4 space-y-1.5">
                  <Label htmlFor="login-email" className="text-xs text-sec">
                    البريد الإلكتروني
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
                    <input
                      id="login-email"
                      type="email"
                      dir="ltr"
                      autoComplete="email"
                      aria-label="البريد الإلكتروني"
                      aria-invalid={!!errors.email}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${INPUT_CLS} pr-10 text-left`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] font-medium text-[#ff2a6d]" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* password */}
                <div className="mb-5 space-y-1.5">
                  <Label htmlFor="login-password" className="text-xs text-sec">
                    كلمة المرور
                  </Label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      dir="ltr"
                      autoComplete="current-password"
                      aria-label="كلمة المرور"
                      aria-invalid={!!errors.password}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${INPUT_CLS} pr-11 text-left`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-mute transition hover:bg-elev-2 hover:text-cyber"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] font-medium text-[#ff2a6d]" role="alert">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* submit */}
                <Button
                  type="submit"
                  disabled={sending}
                  className="btn-gradient h-12 w-full rounded-xl text-base"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      جارٍ تسجيل الدخول...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" />
                      دخول
                    </>
                  )}
                </Button>
              </form>
            </Reveal>

            {/* demo credentials */}
            <Reveal delay={100}>
              <div className="glass rounded-xl p-4 text-xs">
                <p className="mb-3 flex items-center gap-2 font-bold text-sec">
                  <KeyRound className="h-3.5 w-3.5 text-cyber" />
                  حسابات تجريبية للتجربة السريعة
                </p>
                <div className="space-y-2">
                  {DEMO_ACCOUNTS.map((account) => (
                    <div
                      key={account.email}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border-soft bg-elev-2/60 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p
                          className="flex items-center gap-1.5 font-bold"
                          style={{ color: account.color }}
                        >
                          <account.icon className="h-3 w-3 shrink-0" />
                          {account.label}
                        </p>
                        <p
                          dir="ltr"
                          className="truncate text-left font-mono-cyber text-[11px] text-mute"
                        >
                          {account.email} / {account.password}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fillDemo(account)}
                        aria-label={`تعبئة تلقائية لبيانات ${account.label}`}
                        className="tag-pill shrink-0 cursor-pointer py-1.5 transition hover:shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                      >
                        تعبئة تلقائية
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* footer link */}
            <p className="text-center text-sm text-sec">
              ليس لديك حساب؟{" "}
              <button
                type="button"
                onClick={() => navigate({ name: "register" })}
                className="font-bold text-cyber transition hover:underline"
              >
                أنشئ حساباً
              </button>
            </p>
          </div>
        )}
      </section>
    </>
  );
}
