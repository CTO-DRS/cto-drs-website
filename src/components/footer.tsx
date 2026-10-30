"use client";

import { useState } from "react";
import { Terminal, Github, Send, MessageCircle, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { SERVICES } from "@/lib/data";
import { toast } from "@/hooks/use-toast";

const QUICK = [
  { href: "#home", label: "الرئيسية" },
  { href: "#about", label: "نبذة عني" },
  { href: "#projects", label: "المشاريع" },
  { href: "#blog", label: "المدونة" },
  { href: "#dashboard", label: "مركز المعرفة" },
  { href: "#contact", label: "التواصل" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast({ title: "بريد غير صالح", description: "الرجاء إدخال بريد إلكتروني صحيح" });
      return;
    }
    setLoading(true);
    try {
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
            <a href="#home" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00f0ff] via-[#7c3aed] to-[#ff2a6d] text-[#030303]">
                <Terminal className="h-4.5 w-4.5" strokeWidth={2.5} />
              </span>
              <span className="font-heading-cyber text-lg font-extrabold tracking-wider">
                <span className="text-gradient-cyan">CTO</span>
                <span className="text-main">.</span>
                <span className="text-gradient-pink">DRS</span>
              </span>
            </a>
            <p className="mt-4 text-xs leading-6 text-sec">
              حلول برمجية متكاملة وأمن رقمي مستدام. مبني بأسلوب Cyber Dashboard حديث.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { icon: Mail, label: "البريد الإلكتروني" },
                { icon: MessageCircle, label: "واتساب" },
                { icon: Github, label: "GitHub" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#contact"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border-soft bg-elev-2/60 text-sec transition hover:border-[rgba(0,240,255,0.4)] hover:text-cyber hover:shadow-[0_0_14px_rgba(0,240,255,0.2)]"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* quick links */}
          <nav aria-label="روابط سريعة">
            <h4 className="font-heading-cyber mb-4 text-sm font-bold text-main">روابط سريعة</h4>
            <ul className="space-y-2.5">
              {QUICK.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-xs text-sec transition hover:pr-1 hover:text-cyber">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* services */}
          <nav aria-label="الخدمات">
            <h4 className="font-heading-cyber mb-4 text-sm font-bold text-main">الخدمات</h4>
            <ul className="space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s}>
                  <a href="#services" className="text-xs text-sec transition hover:pr-1 hover:text-cyber">
                    {s}
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
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border-soft pt-6 sm:flex-row">
          <p className="font-mono-cyber text-[11px] text-mute" dir="ltr">
            © {new Date().getFullYear()} CTO.DRS — ALL SYSTEMS OPERATIONAL
          </p>
          <p className="flex items-center gap-1.5 text-[11px] text-mute">
            <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-[#00ff88]" />
            مبني بشغف وأمان
          </p>
        </div>
      </div>
    </footer>
  );
}
