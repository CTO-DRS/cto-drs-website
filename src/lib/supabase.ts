/**
 * عميل Supabase من جهة المتصفح (الموقع ثابت — لا خادم).
 *
 * يُقرأ من متغيرات البناء:
 *   NEXT_PUBLIC_SUPABASE_URL        — رابط المشروع  (https://xxxx.supabase.co)
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY   — المفتاح العام anon (آمن للمتصفح؛ الحماية عبر RLS)
 *   NEXT_PUBLIC_SUPABASE_GOOGLE=1   — لإظهار زر "الدخول بحساب Google" (اختياري)
 *   NEXT_PUBLIC_SITE_URL            — رابط الموقع لإعادة التوجيه (افتراضي https://cto-drs.com)
 *
 * إن لم تُضبط المتغيرات: SUPABASE_ENABLED = false ويبقى الموقع على سلوكه الثابت السابق.
 * لا تضع أبداً مفتاح service_role هنا.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const ANON = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

export const SUPABASE_ENABLED = URL.length > 0 && ANON.length > 0;
export const SUPABASE_GOOGLE = SUPABASE_ENABLED && process.env.NEXT_PUBLIC_SUPABASE_GOOGLE === "1";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://cto-drs.com").replace(/\/+$/, "");

/** روابط إعادة التوجيه (يجب إضافتها في Supabase → Auth → URL Configuration → Redirect URLs) */
export const REDIRECTS = {
  home: `${SITE_URL}/`,
  account: `${SITE_URL}/#/account`,
  reset: `${SITE_URL}/#/reset`,
};

let client: SupabaseClient | null = null;

/** يرجع العميل أو null إن لم يكن Supabase مُعدّاً (أو أثناء التصيير على الخادم) */
export function getSupabase(): SupabaseClient | null {
  if (!SUPABASE_ENABLED || typeof window === "undefined") return null;
  if (!client) {
    client = createClient(URL, ANON, {
      auth: {
        // PKCE: يعود الرابط بـ ?code=… فلا يتعارض مع موجّه الهاش (#/route)
        flowType: "pkce",
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "cto-drs-auth",
      },
    });
  }
  return client;
}

/* ── أنواع جداول supabase/schema.sql ── */
export type ProfileRole = "client" | "admin";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  role: ProfileRole;
  created_at: string;
}

export interface ContactMessageRow {
  id: number;
  user_id: string | null;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string; // new | read
  created_at: string;
}

export type BookingStatus = "pending" | "confirmed" | "done" | "cancelled";

export interface BookingRow {
  id: number;
  user_id: string;
  service: string;
  preferred_date: string | null;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
}

export const BOOKING_STATUSES: BookingStatus[] = ["pending", "confirmed", "done", "cancelled"];
