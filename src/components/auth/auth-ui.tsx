"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n";

export const INPUT_CLS =
  "h-11 w-full rounded-xl border border-border-strong bg-elev-2/60 px-4 text-sm text-main outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.15)] disabled:opacity-60";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  hint?: ReactNode;
  error?: string;
  icon?: LucideIcon;
  ltr?: boolean;
}

/** حقل نصي موسوم مع رسالة خطأ مرتبطة عبر aria-describedby */
export function Field({ label, hint, error, icon: Icon, ltr, className = "", ...rest }: FieldProps) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-sec">
        {label} {hint && <span className="text-mute">{hint}</span>}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" aria-hidden="true" />
        )}
        <input
          id={id}
          dir={ltr ? "ltr" : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          className={`${INPUT_CLS} ${Icon ? "ps-10" : ""} ${ltr ? "text-left" : ""} ${className}`}
          {...rest}
        />
      </div>
      {error && (
        <p id={errId} className="text-[11px] font-medium text-[#ff2a6d]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** حقل كلمة مرور مع زر إظهار/إخفاء */
export function PasswordField({
  label,
  error,
  value,
  onChange,
  autoComplete,
  disabled,
}: {
  label: string;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: "current-password" | "new-password";
  disabled?: boolean;
}) {
  const id = useId();
  const errId = `${id}-err`;
  const [show, setShow] = useState(false);
  const { t } = useI18n();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-sec">
        {label}
      </Label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          dir="ltr"
          autoComplete={autoComplete}
          required
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          placeholder="••••••••"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${INPUT_CLS} ps-11 text-left`}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? t.auth.hidePass : t.auth.showPass}
          aria-pressed={show}
          aria-controls={id}
          className="absolute start-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-mute transition hover:bg-elev-2 hover:text-cyber"
        >
          {show ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
      {error && (
        <p id={errId} className="text-[11px] font-medium text-[#ff2a6d]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** أيقونة Google الرسمية (SVG مضمّن) */
export function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

/** يحوّل أخطاء Supabase الشائعة إلى رسائل مفهومة باللغة الحالية */
export function useAuthErrorText() {
  const { t } = useI18n();
  const a = t.auth;
  return (err: unknown): string => {
    const raw = err && typeof err === "object" && "message" in err ? String((err as { message: unknown }).message) : "";
    const code = err && typeof err === "object" && "code" in err ? String((err as { code: unknown }).code) : "";
    const m = raw.toLowerCase();
    if (code === "invalid_credentials" || m.includes("invalid login credentials")) return a.invalidCreds;
    if (code === "email_not_confirmed" || m.includes("email not confirmed")) return a.emailNotConfirmed;
    if (code === "user_already_exists" || m.includes("already registered")) return a.alreadyRegistered;
    if (code === "weak_password" || m.includes("password should be")) return a.errPassLen;
    // أخطاء signInWithIdToken (Google)
    if (code === "provider_disabled" || m.includes("provider is not enabled") || m.includes("unacceptable audience"))
      return a.googleConfigError;
    if (m.includes("nonce") || m.includes("id token") || m.includes("id_token")) return a.googleTokenError;
    return raw || a.genericError;
  };
}
