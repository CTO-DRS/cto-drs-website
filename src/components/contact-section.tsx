"use client";

import { useState } from "react";
import { Send, Clock3, Loader2, CheckCircle2, ExternalLink } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import { SocialChannels, SocialIcon } from "@/components/social-channels";
import { SOCIAL_BY_ID } from "@/lib/social";
import { toast } from "@/hooks/use-toast";

const INFO = [
  {
    id: "whatsapp",
    label: "واتساب — حساب تجاري",
    value: "محادثة مباشرة الآن",
    href: SOCIAL_BY_ID.whatsapp.url,
    ltr: false,
  },
  {
    id: "telegram",
    label: "تيليجرام",
    value: "@CTO_DRS",
    href: SOCIAL_BY_ID.telegram.url,
    ltr: true,
  },
  {
    id: "website",
    label: "الموقع الرسمي",
    value: "cto-drs.xo.je",
    href: SOCIAL_BY_ID.website.url,
    ltr: true,
  },
  {
    id: "reply",
    label: "أوقات الرد",
    value: "خلال 24 ساعة",
    href: undefined,
    ltr: false,
  },
];

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
        setForm({ name: "", email: "", message: "" });
        toast({ title: "تم إرسال رسالتك", description: "سأتواصل معك خلال 24 ساعة إن شاء الله" });
      } else {
        toast({ title: "تعذر الإرسال", description: data.error ?? "تحقق من الحقول وحاول مجدداً" });
      }
    } catch {
      toast({ title: "خطأ في الاتصال", description: "تحقق من اتصالك بالشبكة" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact-form" className="relative px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="CONTACT • 10"
          title="تواصل"
          highlight="معي"
          subtitle="أرسل تفاصيل مشروعك وسأرد عليك خلال 24 ساعة"
        />

        <div className="grid gap-6 lg:grid-cols-5">
          {/* info cards */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            {INFO.map((info, i) => {
              const card = (
                <div
                  className="card-glow flex items-center gap-4 rounded-2xl p-4"
                  style={
                    info.id === "whatsapp"
                      ? { backgroundColor: "rgba(37,211,102,0.05)", borderColor: "rgba(37,211,102,0.25)" }
                      : undefined
                  }
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[rgba(0,240,255,0.07)] text-cyber">
                    {info.id === "reply" ? (
                      <Clock3 className="h-5 w-5" />
                    ) : (
                      <SocialIcon id={info.id} className="h-5 w-5" />
                    )}
                  </span>
                  <div>
                    <p className="text-[11px] text-mute">{info.label}</p>
                    <p className="text-sm font-bold text-main" dir={info.ltr ? "ltr" : "rtl"}>
                      {info.value}
                    </p>
                  </div>
                  {info.href && <ExternalLink className="mr-auto h-4 w-4 shrink-0 text-mute" aria-hidden="true" />}
                </div>
              );
              return (
                <Reveal key={info.id} delay={i * 80}>
                  {info.href ? (
                    <a href={info.href} target="_blank" rel="noopener noreferrer" className="block">
                      {card}
                    </a>
                  ) : (
                    card
                  )}
                </Reveal>
              );
            })}
            <Reveal delay={340}>
              <div className="card-glow rounded-2xl p-5">
                <p className="font-mono-cyber text-[10px] tracking-[0.25em] text-cyber" dir="ltr">
                  $ PING RESPONSE
                </p>
                <p className="font-mono-cyber mt-2 text-[11px] leading-6 text-sec" dir="ltr">
                  <span className="text-[#00ff88]">status:</span> online<br />
                  <span className="text-[#00ff88]">latency:</span> &lt; 24h reply<br />
                  <span className="text-[#00ff88]">uptime:</span> 99.9%
                </p>
              </div>
            </Reveal>
          </div>

          {/* form */}
          <Reveal delay={150} className="lg:col-span-3">
            <form onSubmit={submit} className="card-glow flex h-full flex-col gap-4 rounded-2xl p-6 sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="mb-1.5 block text-xs font-bold text-sec">
                    الاسم الكامل
                  </label>
                  <input
                    id="c-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="ما اسمك الكريم؟"
                    className="h-11 w-full rounded-xl border border-border-strong bg-elev-2/50 px-4 text-sm text-main outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.12)]"
                  />
                </div>
                <div>
                  <label htmlFor="c-email" className="mb-1.5 block text-xs font-bold text-sec">
                    البريد الإلكتروني
                  </label>
                  <input
                    id="c-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@example.com"
                    dir="ltr"
                    className="h-11 w-full rounded-xl border border-border-strong bg-elev-2/50 px-4 text-sm text-main outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.12)]"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label htmlFor="c-msg" className="mb-1.5 block text-xs font-bold text-sec">
                  تفاصيل المشروع
                </label>
                <textarea
                  id="c-msg"
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="أخبرني عن فكرتك: نوع المشروع، الميزانية التقريبية، الجدول الزمني..."
                  className="min-h-32 w-full resize-none rounded-xl border border-border-strong bg-elev-2/50 p-4 text-sm leading-7 text-main outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.12)]"
                />
              </div>
              <button
                type="submit"
                disabled={loading || sent}
                className="btn-gradient flex h-12 items-center justify-center gap-2 rounded-full text-sm disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : sent ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {sent ? "تم الإرسال بنجاح" : "إرسال الرسالة"}
              </button>
            </form>
          </Reveal>
        </div>

        {/* قنوات التواصل الرسمية */}
        <Reveal delay={200} className="mt-10">
          <SocialChannels />
        </Reveal>
      </div>
    </section>
  );
}
