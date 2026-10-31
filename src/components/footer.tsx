"use client";

import { useState } from "react";
import { Terminal, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAppRouter, routeHref, type AppRoute } from "@/lib/router";
import { SocialRow } from "@/components/social-channels";
import { BRAND } from "@/lib/social";
import { STATIC_MODE } from "@/lib/static-mode";

const QUICK: { route: AppRoute; label: string }[] = [
  { route: { name: "home" }, label: "الرئيسية" },
  { route: { name: "services" }, label: "الخدمات" },
  { route: { name: "projects" }, label: "المشاريع" },
  { route: { name: "courses" }, label: "الدورات" },
  { route: { name: "store" }, label: "المتجر الرقمي" },
  { route: { name: "blog" }, label: "المدونة" },
  { route: { name: "downloads" }, label: "مركز التحميل" },
  { route: { name: "events" }, label: "الفعاليات" },
];

const MORE_LINKS: { route: AppRoute; label: string }[] = [
  { route: { name: "booking" }, label: "احجز استشارة" },
  { route: { name: "testimonials" }, label: "آراء العملاء" },
  { route: { name: "faq" }, label: "الأسئلة الشائعة" },
  { route: { name: "contact" }, label: "تواصل معي" },
  { route: { name: "account" }, label: "حسابي" },
  { route: { name: "cart" }, label: "سلة المشتريات" },
];

const SERVICE_LINKS = [
  "تطبيقات أندرويد أصلية",
  "مواقع وتطبيقات ويب آمنة",
  "اختبار اختراق أخلاقي",
  "أدوات وأتمتة Python",
  "مشاريع مفتوحة المصدر",
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { navigate } = useAppRouter();

  const go = (r: AppRoute) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(r);
  };

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast({ title: "بريد غير صالح", description: "الرجاء إدخال بريد إلكتروني صحيح" });
      return;
    }
    setLoading(true);
    try {
      /* النسخة الثابتة: الاشتراك يتم عبر البريد المباشر بدل قاعدة البيانات */
      if (STATIC_MODE) {
        window.location.href = `mailto:${BRAND.email}?subject=${encodeURIComponent(
          "اشتراك في النشرة البريدية — CTO-DRS"
        )}&body=${encodeURIComponent(email)}`;
        toast({
          title: "تم تجهيز رسالة الاشتراك",
          description: "أكمل الإرسال من بريدك — سيتم إضافتك للنشرة فوراً",
        });
        setEmail("");
        return;
      }
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "تم الاشتراك بنجاح",
          description: "ستصلك أحدث المقالات والتحديثات مباشرة إلى بريدك",
        });
        setEmail("");
      } else {
        toast({ title: "تعذر الاشتراك", description: data.error ?? "حاول مرة أخرى" });
      }
    } catch {
      toast({ title: "خطأ في الاتصال", description: "تحقق من اتصالك بالشبكة" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="mt-auto border-t border-border-soft bg-elev/50 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* brand */}
          <div>
            <a
              href={routeHref({ name: "home" })}
              onClick={go({ name: "home" })}
              className="flex items-center gap-2"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00f0ff] via-[#7c3aed] to-[#ff2a6d] text-[#030303]">
                <Terminal className="h-4.5 w-4.5" strokeWidth={2.5} />
              </span>
              <span className="font-heading-cyber whitespace-nowrap text-lg font-extrabold tracking-wider" dir="ltr">
                <span className="text-gradient-cyan">CTO</span>
                <span className="text-main">-</span>
                <span className="text-gradient-pink">DRS</span>
              </span>
            </a>
            <p className="mt-4 text-xs leading-6 text-sec">
              هندسة البرمجيات والأمن السيبراني والابتكار مفتوح المصدر — تقنية مفيدة وآمنة وقابلة للصيانة ومتاحة للجميع.
            </p>
            <p className="font-mono-cyber mt-3 text-[10px] tracking-[0.2em] text-mute" dir="ltr">
              {BRAND.websiteLabel}
            </p>
            <SocialRow size="sm" className="mt-5" />
          </div>

          {/* quick links */}
          <nav aria-label="روابط سريعة">
            <h4 className="font-heading-cyber mb-4 text-sm font-bold text-main">روابط سريعة</h4>
            <ul className="space-y-2.5">
              {QUICK.map((l) => (
                <li key={l.route.name}>
                  <a
                    href={routeHref(l.route)}
                    onClick={go(l.route)}
                    className="text-xs text-sec transition hover:pr-1 hover:text-cyber"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* services + more */}
          <nav aria-label="الخدمات والمزيد">
            <h4 className="font-heading-cyber mb-4 text-sm font-bold text-main">الخدمات والمزيد</h4>
            <ul className="space-y-2.5">
              {SERVICE_LINKS.map((s) => (
                <li key={s}>
                  <a
                    href={routeHref({ name: "services" })}
                    onClick={go({ name: "services" })}
                    className="text-xs text-sec transition hover:pr-1 hover:text-cyber"
                  >
                    {s}
                  </a>
                </li>
              ))}
              {MORE_LINKS.slice(0, 2).map((l) => (
                <li key={l.route.name}>
                  <a
                    href={routeHref(l.route)}
                    onClick={go(l.route)}
                    className="text-xs text-sec transition hover:pr-1 hover:text-cyber"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* newsletter */}
          <div>
            <h4 className="font-heading-cyber mb-4 text-sm font-bold text-main">النشرة البريدية</h4>
            <p className="text-xs leading-6 text-sec">اشترك ليصلك كل جديد عن مشاريعي ومقالاتي التقنية</p>
            <form onSubmit={subscribe} className="mt-4 flex gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                بريدك الإلكتروني
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                required
                className="h-10 min-w-0 flex-1 rounded-full border border-border-strong bg-elev-2/60 px-4 text-xs text-main outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.15)]"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-gradient-pink flex h-10 shrink-0 items-center gap-1.5 rounded-full px-5 text-xs disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                اشتراك
              </button>
            </form>
            <p className="font-mono-cyber mt-3 text-[10px] text-mute" dir="ltr">
              NO SPAM • UNSUBSCRIBE ANYTIME
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {MORE_LINKS.slice(2).map((l) => (
                <a
                  key={l.route.name}
                  href={routeHref(l.route)}
                  onClick={go(l.route)}
                  className="text-[11px] text-mute transition hover:text-cyber"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border-soft pt-6 sm:flex-row">
          <p className="font-mono-cyber text-[11px] text-mute" dir="ltr">
            © {new Date().getFullYear()} CTO-DRS — ALL SYSTEMS OPERATIONAL
          </p>
          <div className="flex items-center gap-4">
            <a
              href={routeHref({ name: "privacy" })}
              onClick={go({ name: "privacy" })}
              className="text-[11px] text-mute transition hover:text-cyber"
            >
              سياسة الخصوصية
            </a>
            <span className="h-1 w-1 rounded-full bg-border-strong" aria-hidden="true" />
            <a
              href={routeHref({ name: "terms" })}
              onClick={go({ name: "terms" })}
              className="text-[11px] text-mute transition hover:text-cyber"
            >
              الشروط والأحكام
            </a>
          </div>
          <p className="flex items-center gap-1.5 text-[11px] text-mute">
            <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-[#00ff88]" />
            مبني بشغف وأمان
          </p>
        </div>
      </div>
    </footer>
  );
}
