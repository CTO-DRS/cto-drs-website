"use client";

import { useState, type FormEvent } from "react";
import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  Mail,
  UserRoundPlus,
  UserRound,
  KeyRound,
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

const BENEFITS = [
  "متابعة طلباتك وحجوزاتك من لوحة واحدة",
  "تنبيهات فورية عند تحديث حالة الخدمات",
  "عروض حصرية لأعضاء شبكة CTO-DRS",
];

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterScreen() {
  const { navigate } = useAppRouter();
  const { user, setUser } = useAppStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!name.trim()) next.name = "الاسم مطلوب";
    else if (name.trim().length < 2) next.name = "الاسم يجب أن يكون حرفين على الأقل";
    if (!email.trim()) next.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "صيغة البريد الإلكتروني غير صحيحة";
    if (!password) next.password = "كلمة المرور مطلوبة";
    else if (password.length < 6) next.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    if (!confirmPassword) next.confirmPassword = "تأكيد كلمة المرور مطلوب";
    else if (confirmPassword !== password)
      next.confirmPassword = "كلمتا المرور غير متطابقتين";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setApiError(null);
    if (sending || !validate()) return;
    setSending(true);
    try {
      const res = await sendJson<AuthUser>("/api/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });
      setUser(res);
      toast({
        title: `أهلاً بك في الشبكة، ${res.name}`,
        description: "تم إنشاء حسابك بنجاح",
      });
      navigate({ name: "account" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "تعذر إنشاء الحساب، حاول مرة أخرى";
      setApiError(msg);
      toast({ title: "فشل إنشاء الحساب", description: msg, variant: "destructive" });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <PageHero
        badge="AUTH.CREATE"
        title="إنشاء"
        highlight="حساب"
        subtitle="انضم إلى شبكة عملاء CTO-DRS وتابع مشاريعك وطلباتك بسهولة"
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
                مرحباً <span className="font-bold text-cyber">{user.name}</span> — حسابك جاهز
                للاستخدام
              </p>
              <Button
                onClick={() => navigate({ name: "account" })}
                className="btn-gradient mt-6 h-11 w-full rounded-xl"
              >
                الانتقال إلى حسابي
              </Button>
            </div>
          </Reveal>
        ) : (
          <div className="mx-auto max-w-md space-y-5">
            <Reveal>
              <form onSubmit={handleSubmit} noValidate className="card-glow rounded-2xl p-8">
                {/* header */}
                <div className="mb-6 text-center">
                  <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(124,58,237,0.35)] bg-[rgba(124,58,237,0.08)] shadow-[0_0_20px_rgba(124,58,237,0.2)]">
                    <UserRoundPlus className="h-5 w-5 text-[#7c3aed]" />
                  </span>
                  <h2 className="font-heading-cyber text-xl font-extrabold text-main">
                    حساب جديد
                  </h2>
                  <p className="mt-1 text-xs text-mute">املأ البيانات التالية للانضمام</p>
                </div>

                {/* name */}
                <div className="mb-4 space-y-1.5">
                  <Label htmlFor="register-name" className="text-xs text-sec">
                    الاسم الكامل
                  </Label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
                    <input
                      id="register-name"
                      type="text"
                      autoComplete="name"
                      aria-label="الاسم الكامل"
                      aria-invalid={!!errors.name}
                      placeholder="مثال: أحمد العتيبي"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`${INPUT_CLS} pr-10`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[11px] font-medium text-[#ff2a6d]" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* email */}
                <div className="mb-4 space-y-1.5">
                  <Label htmlFor="register-email" className="text-xs text-sec">
                    البريد الإلكتروني
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
                    <input
                      id="register-email"
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
                <div className="mb-4 space-y-1.5">
                  <Label htmlFor="register-password" className="text-xs text-sec">
                    كلمة المرور
                  </Label>
                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
                    <input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      dir="ltr"
                      autoComplete="new-password"
                      aria-label="كلمة المرور"
                      aria-invalid={!!errors.password}
                      placeholder="6 أحرف على الأقل"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${INPUT_CLS} pr-10 pl-11 text-left`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                      className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-mute transition hover:bg-elev-2 hover:text-cyber"
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

                {/* confirm password */}
                <div className="mb-5 space-y-1.5">
                  <Label htmlFor="register-confirm" className="text-xs text-sec">
                    تأكيد كلمة المرور
                  </Label>
                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
                    <input
                      id="register-confirm"
                      type={showConfirm ? "text" : "password"}
                      dir="ltr"
                      autoComplete="new-password"
                      aria-label="تأكيد كلمة المرور"
                      aria-invalid={!!errors.confirmPassword}
                      placeholder="أعد إدخال كلمة المرور"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`${INPUT_CLS} pr-10 pl-11 text-left`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={showConfirm ? "إخفاء تأكيد كلمة المرور" : "إظهار تأكيد كلمة المرور"}
                      className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-mute transition hover:bg-elev-2 hover:text-cyber"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[11px] font-medium text-[#ff2a6d]" role="alert">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* api error */}
                {apiError && (
                  <p
                    role="alert"
                    className="mb-4 rounded-lg border border-[rgba(255,42,109,0.3)] bg-[rgba(255,42,109,0.06)] p-2.5 text-center text-[11px] font-medium leading-5 text-[#ff2a6d]"
                  >
                    {apiError}
                  </p>
                )}

                {/* submit */}
                <Button
                  type="submit"
                  disabled={sending}
                  className="btn-gradient h-12 w-full rounded-xl text-base"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      جارٍ إنشاء الحساب...
                    </>
                  ) : (
                    <>
                      <UserRoundPlus className="h-5 w-5" />
                      إنشاء الحساب
                    </>
                  )}
                </Button>
              </form>
            </Reveal>

            {/* benefits */}
            <Reveal delay={100}>
              <div className="glass rounded-xl p-4">
                <p className="mb-2.5 text-xs font-bold text-sec">لماذا تنشئ حساباً؟</p>
                <ul className="space-y-2 text-xs leading-6 text-sec">
                  {BENEFITS.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 shrink-0 text-[#00ff88]" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* footer link */}
            <p className="text-center text-sm text-sec">
              لديك حساب بالفعل؟{" "}
              <button
                type="button"
                onClick={() => navigate({ name: "login" })}
                className="font-bold text-cyber transition hover:underline"
              >
                سجّل دخولك
              </button>
            </p>
          </div>
        )}
      </section>
    </>
  );
}
