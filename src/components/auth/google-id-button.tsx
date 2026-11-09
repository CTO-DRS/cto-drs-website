"use client";

/**
 * زر "المتابعة بحساب Google" عبر Google Identity Services (تدفق ID token).
 *
 * لماذا ليس signInWithOAuth؟ مزوّد Google في Supabase مضبوط بمعرّف عميل فقط (بدون client secret)،
 * لذا نحصل على ID token من Google مباشرة في المتصفح ثم نسلّمه لـ supabase.auth.signInWithIdToken.
 *
 * الحماية من إعادة الاستخدام (nonce):
 *   - نولّد nonce عشوائياً خاماً
 *   - نمرّر تجزئته SHA-256 (hex) إلى google.accounts.id.initialize({ nonce })
 *   - نمرّر النسخة الخام إلى signInWithIdToken({ nonce }) — Supabase يجزّئها ويقارنها بما في التوكن
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useAppRouter } from "@/lib/router";
import { getSupabase, GOOGLE_CLIENT_ID, SUPABASE_GOOGLE } from "@/lib/supabase";
import { useI18n } from "@/i18n";
import { useAuthErrorText } from "./auth-ui";

const GSI_SRC = "https://accounts.google.com/gsi/client";

/* ── أنواع مصغّرة لما نستخدمه من GIS ── */
interface GsiCredentialResponse {
  credential?: string;
  select_by?: string;
}
interface GsiIdApi {
  initialize(cfg: {
    client_id: string;
    callback: (r: GsiCredentialResponse) => void;
    nonce?: string;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    context?: "signin" | "signup" | "use";
    ux_mode?: "popup" | "redirect";
    itp_support?: boolean;
    use_fedcm_for_button?: boolean;
  }): void;
  renderButton(
    parent: HTMLElement,
    opts: {
      type?: "standard" | "icon";
      theme?: "outline" | "filled_blue" | "filled_black";
      size?: "large" | "medium" | "small";
      text?: "signin_with" | "signup_with" | "continue_with" | "signin";
      shape?: "rectangular" | "pill" | "circle" | "square";
      logo_alignment?: "left" | "center";
      width?: number;
      locale?: string;
    },
  ): void;
  cancel(): void;
}
declare global {
  interface Window {
    google?: { accounts?: { id?: GsiIdApi } };
  }
}

/* ── تحميل سكربت GIS عند الطلب (مرة واحدة لكل الصفحة) ── */
let gsiPromise: Promise<GsiIdApi> | null = null;

function loadGsi(): Promise<GsiIdApi> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.google?.accounts?.id) return Promise.resolve(window.google.accounts.id);
  if (gsiPromise) return gsiPromise;
  gsiPromise = new Promise<GsiIdApi>((resolve, reject) => {
    const done = () => {
      const api = window.google?.accounts?.id;
      if (api) resolve(api);
      else reject(new Error("gsi unavailable"));
    };
    let s = document.querySelector<HTMLScriptElement>(`script[src="${GSI_SRC}"]`);
    if (!s) {
      s = document.createElement("script");
      s.src = GSI_SRC;
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    }
    s.addEventListener("load", done, { once: true });
    s.addEventListener("error", () => reject(new Error("gsi load failed")), { once: true });
  }).catch((e) => {
    gsiPromise = null; // اسمح بإعادة المحاولة عند الزيارة التالية
    document.querySelector(`script[src="${GSI_SRC}"]`)?.remove();
    throw e;
  });
  return gsiPromise;
}

/* ── nonce ── */
function randomNonce(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

type Status = "loading" | "ready" | "busy" | "error";

export function GoogleIdButton({ context = "signin" }: { context?: "signin" | "signup" }) {
  const { t, lang } = useI18n();
  const a = t.auth;
  const errText = useAuthErrorText();
  const { navigate } = useAppRouter();
  const hostRef = useRef<HTMLDivElement>(null);
  const rawNonceRef = useRef<string>("");
  const [status, setStatus] = useState<Status>("loading");
  const [attempt, setAttempt] = useState(0);

  // نُبقي أحدث النصوص/الدوال في ref كي لا يُعاد تهيئة GIS عند كل تصيير
  const live = useRef({ a, errText, navigate });
  live.current = { a, errText, navigate };

  const onCredential = useCallback(async (resp: GsiCredentialResponse) => {
    const { a: tx, errText: errOf, navigate: nav } = live.current;
    const sb = getSupabase();
    if (!sb) return;
    if (!resp.credential) {
      toast({ title: tx.googleFailTitle, description: tx.googleNoCredential, variant: "destructive" });
      return;
    }
    setStatus("busy");
    const { data, error } = await sb.auth.signInWithIdToken({
      provider: "google",
      token: resp.credential,
      nonce: rawNonceRef.current,
    });
    if (error || !data.user) {
      setStatus("ready");
      setAttempt((n) => n + 1); // nonce جديد للمحاولة التالية
      toast({ title: tx.googleFailTitle, description: errOf(error), variant: "destructive" });
      return;
    }
    const { data: prof } = await sb.from("profiles").select("full_name, role").eq("id", data.user.id).maybeSingle();
    const meta = data.user.user_metadata as { full_name?: string; name?: string } | undefined;
    toast({
      title: tx.welcome(prof?.full_name || meta?.full_name || meta?.name || data.user.email || ""),
      description: tx.welcomeDesc,
    });
    nav({ name: prof?.role === "admin" ? "dashboard" : "account" });
  }, []);

  useEffect(() => {
    if (!SUPABASE_GOOGLE) return;
    let cancelled = false;
    setStatus((s) => (s === "busy" ? s : "loading"));
    (async () => {
      try {
        const api = await loadGsi();
        const raw = randomNonce();
        const hashed = await sha256Hex(raw);
        if (cancelled || !hostRef.current) return;
        rawNonceRef.current = raw;
        api.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: onCredential,
          nonce: hashed,
          auto_select: false,
          cancel_on_tap_outside: true,
          context,
          ux_mode: "popup",
          itp_support: true,
        });
        const host = hostRef.current;
        host.innerHTML = "";
        const width = Math.max(200, Math.min(400, Math.floor(host.getBoundingClientRect().width) || 320));
        api.renderButton(host, {
          type: "standard",
          theme: "filled_black",
          size: "large",
          text: context === "signup" ? "signup_with" : "continue_with",
          shape: "pill",
          logo_alignment: "center",
          width,
          locale: lang,
        });
        setStatus((s) => (s === "busy" ? s : "ready"));
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
      try {
        window.google?.accounts?.id?.cancel();
      } catch {
        /* ignore */
      }
    };
  }, [lang, context, attempt, onCredential]);

  if (!SUPABASE_GOOGLE) return null;

  return (
    <>
      <div className="my-5 flex items-center gap-3 text-[11px] text-mute" aria-hidden="true">
        <span className="h-px flex-1 bg-border-soft" />
        {a.or}
        <span className="h-px flex-1 bg-border-soft" />
      </div>

      <div className="relative" aria-busy={status === "loading" || status === "busy"}>
        {/* زر Google الرسمي (iframe من Google يحمل تسميته الخاصة ويدعم لوحة المفاتيح) */}
        <div
          ref={hostRef}
          className={`flex min-h-11 w-full justify-center ${status === "busy" ? "pointer-events-none opacity-50" : ""}`}
          hidden={status === "error"}
        />
        {status === "loading" && (
          <div className="absolute inset-0 animate-pulse rounded-full border border-border-soft bg-elev-2/60" aria-hidden="true" />
        )}
        {status === "error" && (
          <div role="alert" className="space-y-2 text-center">
            <p className="text-[12px] leading-6 text-[#ff2a6d]">{a.googleLoadError}</p>
            <button
              type="button"
              onClick={() => setAttempt((n) => n + 1)}
              className="text-xs font-medium text-cyber hover:underline"
            >
              {a.googleRetry}
            </button>
          </div>
        )}
      </div>

      {/* إعلان الحالة لقارئات الشاشة */}
      <p className="sr-only" role="status" aria-live="polite">
        {status === "loading" ? a.googleLoading : status === "busy" ? a.googleSigningIn : ""}
      </p>
    </>
  );
}
