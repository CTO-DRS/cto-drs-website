"use client";

/* ═══════════════════════════════════════════════════════════
   جلسة المستخدم — Supabase Auth من المتصفح مباشرة.
   • AuthProvider: يتابع الجلسة ويقرأ صف profiles (الدور يأتي من القاعدة لا من localStorage)
   • useAuth():    الوصول الكامل (session/profile/refresh/signOut)
   • useSession(): واجهة موحّدة للمكوّنات العامة (الشريط العلوي…) تعمل
                   مع Supabase إن كان مُعدّاً، وإلا مع الجلسة المحلية القديمة.
   ═══════════════════════════════════════════════════════════ */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase, SUPABASE_ENABLED, type Profile } from "@/lib/supabase";
import { useAppStore } from "@/lib/store";

interface AuthCtx {
  enabled: boolean;
  /** انتهى التحقق الأولي من الجلسة */
  ready: boolean;
  session: Session | null;
  profile: Profile | null;
  /** جارٍ قراءة صف profiles للجلسة الحالية */
  profileLoading: boolean;
  isAdmin: boolean;
  /** خطأ عاد في رابط إعادة التوجيه (رابط منتهي…) */
  urlError: string | null;
  clearUrlError: () => void;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  enabled: false,
  ready: true,
  session: null,
  profile: null,
  profileLoading: false,
  isAdmin: false,
  urlError: null,
  clearUrlError: () => {},
  refreshProfile: async () => {},
  signOut: async () => {},
});

/** يزيل ?code / ?error من الرابط مع الحفاظ على الهاش (#/route) */
function cleanAuthParams() {
  try {
    const u = new URL(window.location.href);
    const keys = ["code", "error", "error_code", "error_description", "type"];
    let changed = false;
    for (const k of keys) {
      if (u.searchParams.has(k)) {
        u.searchParams.delete(k);
        changed = true;
      }
    }
    if (changed) window.history.replaceState(window.history.state, "", u.pathname + u.search + u.hash);
  } catch {
    /* تجاهل */
  }
}

function readUrlError(): string | null {
  try {
    const q = new URLSearchParams(window.location.search);
    const h = new URLSearchParams(window.location.hash.replace(/^#\/?[^?&=]*[?&]?/, ""));
    return q.get("error_description") || h.get("error_description") || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(!SUPABASE_ENABLED);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [profileFor, setProfileFor] = useState<string | null>(null);
  const setLegacyUser = useAppStore((s) => s.setUser);
  const userIdRef = useRef<string | null>(null);

  const loadProfile = useCallback(async (uid: string | null) => {
    const sb = getSupabase();
    if (!sb || !uid) {
      setProfile(null);
      setProfileFor(null);
      return;
    }
    let { data } = await sb.from("profiles").select("*").eq("id", uid).maybeSingle();
    if (!data) {
      // قد يتأخر مُشغّل إنشاء الملف الشخصي لحظة بعد التسجيل
      await new Promise((r) => setTimeout(r, 800));
      ({ data } = await sb.from("profiles").select("*").eq("id", uid).maybeSingle());
    }
    if (userIdRef.current === uid) {
      setProfile((data as Profile | null) ?? null);
      setProfileFor(uid);
    }
  }, []);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    const err = readUrlError();
    if (err) queueMicrotask(() => setUrlError(err));

    let alive = true;
    sb.auth.getSession().then(async ({ data }) => {
      if (!alive) return;
      userIdRef.current = data.session?.user.id ?? null;
      setSession(data.session);
      await loadProfile(userIdRef.current);
      if (alive) setReady(true);
      cleanAuthParams();
    });

    const { data: sub } = sb.auth.onAuthStateChange((event, s) => {
      userIdRef.current = s?.user.id ?? null;
      setSession(s);
      // لا نستدعي Supabase مباشرة داخل المستمع (توصية المكتبة) — نؤجل
      setTimeout(() => {
        void loadProfile(userIdRef.current);
      }, 0);
      if (event === "PASSWORD_RECOVERY" && !window.location.hash.startsWith("#/reset")) {
        window.location.hash = "#/reset";
      }
      if (event === "SIGNED_IN") cleanAuthParams();
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  // مرآة للعرض فقط (تعبئة نماذج قديمة مثل الدفع) — ليست مصدراً للصلاحيات
  useEffect(() => {
    if (!SUPABASE_ENABLED || !ready) return;
    if (!session) {
      setLegacyUser(null);
      return;
    }
    const email = session.user.email ?? "";
    setLegacyUser({
      id: session.user.id,
      email,
      name: profile?.full_name || (session.user.user_metadata?.full_name as string | undefined) || email.split("@")[0],
      role: profile?.role === "admin" ? "admin" : "user",
    });
  }, [ready, session, profile, setLegacyUser]);

  const refreshProfile = useCallback(async () => {
    await loadProfile(userIdRef.current);
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    userIdRef.current = null;
    setSession(null);
    setProfile(null);
    setLegacyUser(null);
  }, [setLegacyUser]);

  const value = useMemo<AuthCtx>(
    () => ({
      enabled: SUPABASE_ENABLED,
      ready,
      session,
      profile,
      profileLoading: !!session && profileFor !== session.user.id,
      isAdmin: !!session && profile?.role === "admin" && profile.id === session.user.id,
      urlError,
      clearUrlError: () => setUrlError(null),
      refreshProfile,
      signOut,
    }),
    [ready, session, profile, profileFor, urlError, refreshProfile, signOut],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

/** واجهة موحّدة: Supabase إن كان مُعدّاً، وإلا الجلسة المحلية القديمة */
export function useSession(): { user: SessionUser | null; signOut: () => Promise<void> } {
  const auth = useAuth();
  const legacy = useAppStore((s) => s.user);
  const setLegacy = useAppStore((s) => s.setUser);

  if (auth.enabled) {
    const s = auth.session;
    if (!s) return { user: null, signOut: auth.signOut };
    const email = s.user.email ?? "";
    return {
      user: {
        id: s.user.id,
        email,
        name: auth.profile?.full_name || (s.user.user_metadata?.full_name as string | undefined) || email.split("@")[0],
        isAdmin: auth.isAdmin,
      },
      signOut: auth.signOut,
    };
  }
  return {
    user: legacy ? { id: legacy.id, email: legacy.email, name: legacy.name, isAdmin: legacy.role === "admin" } : null,
    signOut: async () => setLegacy(null),
  };
}
