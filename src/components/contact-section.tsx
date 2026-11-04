"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Send,
  Clock3,
  Loader2,
  CheckCircle2,
  CalendarDays,
  Target,
  Phone,
  Globe2,
  Zap,
  ClipboardCheck,
} from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { Reveal } from "@/components/reveal";
import { SocialChannels } from "@/components/social-channels";
import { Switch } from "@/components/ui/switch";
import {
  COUNTRIES,
  COUNTRY_BY_CODE,
  detectCountryCode,
  sanitizePhone,
} from "@/lib/contact-options";
import { SOCIAL_BY_ID } from "@/lib/social";
import { STATIC_MODE } from "@/lib/static-mode";
import { toast } from "@/hooks/use-toast";
import { useI18n, useContent, countryName } from "@/i18n";

const DRAFT_KEY = "cto-drs-contact-draft";
const MAX_MSG = 5000;

interface FormState {
  name: string;
  email: string;
  purpose: string;
  countryCode: string;
  phone: string;
  message: string;
  autoSend: boolean;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  purpose: "",
  countryCode: "SA",
  phone: "",
  message: "",
  autoSend: true,
};

export function ContactSection({ showHeader = true }: { showHeader?: boolean }) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const detectedRef = useRef(false);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const { t, lang } = useI18n();
  const c = t.contact;
  const { CONTACT_PURPOSES } = useContent();
  const country = form.countryCode ? COUNTRY_BY_CODE[form.countryCode] : undefined;
  const purpose = form.purpose ? CONTACT_PURPOSES.find((p) => p.id === form.purpose) : undefined;

  /* استرجاع مسودة + كشف الدولة تلقائياً مرة واحدة */
  useEffect(() => {
    queueMicrotask(() => {
      if (!detectedRef.current) {
        detectedRef.current = true;
        const cc = detectCountryCode();
        if (cc) set("countryCode", cc);
      }
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (raw) {
          const d = JSON.parse(raw) as Partial<FormState>;
          setForm((f) => ({
            ...f,
            name: typeof d.name === "string" ? d.name : "",
            email: typeof d.email === "string" ? d.email : "",
            purpose: typeof d.purpose === "string" ? d.purpose : "",
            countryCode: d.countryCode && COUNTRY_BY_CODE[d.countryCode] ? d.countryCode : f.countryCode,
            phone: typeof d.phone === "string" ? d.phone : "",
            message: typeof d.message === "string" ? d.message : "",
          }));
        }
      } catch {
        /* تجاهل */
      }
    });
  }, []);

  /* حفظ تلقائي للمسودة أثناء الكتابة */
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const { name, email, purpose, countryCode, phone, message } = form;
        if (name || email || message || phone) {
          localStorage.setItem(DRAFT_KEY, JSON.stringify({ name, email, purpose, countryCode, phone, message }));
        } else {
          localStorage.removeItem(DRAFT_KEY);
        }
      } catch {
        /* تجاهل */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [form]);

  const msgChars = form.message.length;
  const progress = useMemo(() => {
    let p = 0;
    if (form.name.trim().length >= 2) p += 20;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) p += 20;
    if (form.purpose) p += 20;
    if (form.countryCode && sanitizePhone(form.phone).length >= 7) p += 20;
    if (form.message.trim().length >= 10) p += 20;
    return p;
  }, [form]);

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) e.name = c.errName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = c.errEmail;
    if (!form.purpose) e.purpose = c.errPurpose;
    const ph = sanitizePhone(form.phone);
    if (ph && (ph.length < 7 || ph.length > 15)) e.phone = c.errPhone;
    if (form.message.trim().length < 10) e.message = c.errMessage;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /** تركيب نص الرسالة الكامل (يُستخدم للواتساب والحفظ) */
  function composeText(): string {
    const lines = [
      `${c.lineName}: ${form.name.trim()}`,
      `${c.lineEmail}: ${form.email.trim()}`,
      purpose ? `${c.linePurpose}: ${purpose.label}` : "",
      country ? `${c.lineCountry}: ${country.flag} ${countryName(lang, country)} (${country.dial})` : "",
      form.phone ? `${c.linePhone}: ${country?.dial ?? ""}${sanitizePhone(form.phone)}` : "",
      "",
      form.message.trim(),
    ].filter((l) => l !== "");
    return lines.join("\n");
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({ title: c.toastIncompleteTitle, description: c.toastIncompleteDesc });
      return;
    }
    setLoading(true);
    try {
      /* النسخة الثابتة: لا حفظ في الخادم — ننتقل مباشرة لنجاح + واتساب */
      if (!STATIC_MODE) {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            purpose: form.purpose,
            country: form.countryCode,
            phone: sanitizePhone(form.phone),
            message: form.message,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast({ title: c.toastFailTitle, description: data.error ?? c.toastFailDesc });
          return;
        }
      }

      setSent(true);
      toast({
        title: c.toastOkTitle,
        description: c.toastOkDesc,
      });

      /* الإرسال التلقائي: فتح واتساب بالرسالة جاهزة + نسخها احتياطاً */
      if (form.autoSend) {
        const text = encodeURIComponent(composeText());
        const waUrl = `${SOCIAL_BY_ID.whatsapp.url}?text=${text}`;
        try {
          await navigator.clipboard.writeText(composeText());
          toast({
            title: c.toastWaTitle,
            description: c.toastWaDesc,
          });
        } catch {
          /* الحافظة غير متاحة — الافتتاح يكفي */
        }
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }

      setForm({ ...EMPTY, countryCode: form.countryCode, autoSend: form.autoSend });
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* تجاهل */
      }
      setTimeout(() => setSent(false), 6000);
    } catch {
      toast({ title: t.common.connErrTitle, description: t.common.connErrDesc });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (bad?: string) =>
    `h-11 w-full rounded-xl border bg-elev-2/50 px-4 text-sm text-main outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.12)] ${
      bad ? "border-[rgba(255,42,109,0.6)]" : "border-border-strong"
    }`;

  return (
    <section id="contact-form" className="relative px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {showHeader && (
          <SectionHeader
            badge="CONTACT • 10"
            title={c.title}
            highlight={c.highlight}
            subtitle={c.subtitle}
          />
        )}

        <div className="grid gap-6 lg:grid-cols-5">
          {/* بطاقات معلومات فريدة — القنوات نفسها تُعرض مرة واحدة في شبكة SocialChannels أدناه */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Reveal>
              <div
                className="card-glow flex items-center gap-4 rounded-2xl p-4"
                style={{ backgroundColor: "rgba(0,255,136,0.05)", borderColor: "rgba(0,255,136,0.25)" }}
              >
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[rgba(0,255,136,0.08)]">
                  <span className="animate-pulse-dot h-2.5 w-2.5 rounded-full bg-[#00ff88]" />
                </span>
                <div>
                  <p className="text-[11px] text-mute">{c.statusLabel}</p>
                  <p className="text-sm font-bold text-main">{c.statusValue}</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="card-glow flex items-center gap-4 rounded-2xl p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[rgba(0,240,255,0.07)] text-cyber">
                  <Clock3 className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] text-mute">{c.replyLabel}</p>
                  <p className="text-sm font-bold text-main">{c.replyValue}</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <div className="card-glow flex items-center gap-4 rounded-2xl p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[rgba(0,240,255,0.07)] text-cyber">
                  <CalendarDays className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] text-mute">{c.daysLabel}</p>
                  <p className="text-sm font-bold text-main">{c.daysValue}</p>
                </div>
              </div>
            </Reveal>

            {/* مؤشر اكتمال النموذج */}
            <Reveal delay={200}>
              <div className="card-glow rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <p className="font-mono-cyber text-[10px] tracking-[0.25em] text-cyber" dir="ltr">
                    $ FORM COMPLETION
                  </p>
                  <span className="font-mono-cyber text-xs font-bold text-cyber">{progress}%</span>
                </div>
                <div
                  className="mt-3 h-1.5 overflow-hidden rounded-full bg-elev-2"
                  role="progressbar"
                  aria-label={lang === "ar" ? "اكتمال النموذج" : "Form completion"}
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00f0ff] to-[#00ff88] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2.5 text-[11px] leading-5 text-mute" aria-live="polite">
                  {progress === 100 ? c.formReady : c.formHint}
                </p>
              </div>
            </Reveal>

            <Reveal delay={240}>
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

          {/* النموذج المطوَّر */}
          <Reveal delay={150} className="lg:col-span-3">
            <form onSubmit={submit} noValidate className="card-glow flex h-full flex-col gap-5 rounded-2xl p-6 sm:p-7">
              {/* ١ — هدف المراسلة */}
              <fieldset>
                <legend className="mb-2.5 flex items-center gap-2 text-xs font-bold text-sec">
                  <Target className="h-3.5 w-3.5 text-cyber" aria-hidden="true" />
                  {c.purposeLegend} <span className="text-[#ff2a6d]" aria-hidden="true">*</span>
                  <span className="sr-only">({c.required})</span>
                </legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {CONTACT_PURPOSES.map((p) => {
                    const active = form.purpose === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          set("purpose", p.id);
                          setErrors((e) => ({ ...e, purpose: undefined }));
                        }}
                        aria-pressed={active}
                        className={`rounded-xl border p-2.5 text-start transition-all duration-300 ${
                          active ? "shadow-[0_0_18px_var(--pg)]" : "border-border-strong bg-elev-2/40 hover:border-[rgba(0,240,255,0.35)]"
                        }`}
                        style={
                          active
                            ? { borderColor: p.color, backgroundColor: p.glow, ["--pg" as string]: p.glow }
                            : undefined
                        }
                      >
                        <span
                          className="block text-xs font-bold"
                          style={active ? { color: p.color } : { color: undefined }}
                        >
                          <span className={active ? "text-main" : "text-sec"}>{p.label}</span>
                        </span>
                        <span className="mt-0.5 block text-[10px] leading-4 text-mute">{p.desc}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.purpose && <p className="mt-1.5 text-[11px] text-[#ff2a6d]" role="alert">{errors.purpose}</p>}
              </fieldset>

              {/* ٢ — الدولة + رقم الجوال */}
              <fieldset>
                <legend className="mb-2.5 flex items-center gap-2 text-xs font-bold text-sec">
                  <Phone className="h-3.5 w-3.5 text-cyber" aria-hidden="true" />
                  {c.phoneLegend} <span className="text-[11px] font-normal text-mute">{c.phoneOptional}</span>
                </legend>
                <div className="grid gap-3 sm:grid-cols-[1fr_1.2fr]">
                  <div>
                    <label htmlFor="ct-country" className="sr-only">
                      {c.country}
                    </label>
                    <div className="relative">
                      <Globe2 className="pointer-events-none absolute start-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-mute" aria-hidden="true" />
                      <select
                        id="ct-country"
                        value={form.countryCode}
                        onChange={(e) => set("countryCode", e.target.value)}
                        aria-describedby="ct-country-hint"
                        className="h-11 w-full appearance-none rounded-xl border border-border-strong bg-elev-2/50 ps-9 pe-3 text-sm text-main outline-none transition focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.12)]"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code} className="bg-elev text-main">
                            {c.flag} {countryName(lang, c)} ({c.dial})
                          </option>
                        ))}
                      </select>
                    </div>
                    <p id="ct-country-hint" className="mt-1 text-[10px] text-mute">
                      {t.contact.countryAuto}
                    </p>
                  </div>
                  <div>
                    <label htmlFor="ct-phone" className="sr-only">
                      {t.contact.phone}
                    </label>
                    <div
                      className={`flex h-11 items-center overflow-hidden rounded-xl border bg-elev-2/50 transition focus-within:border-[rgba(0,240,255,0.5)] focus-within:shadow-[0_0_16px_rgba(0,240,255,0.12)] ${
                        errors.phone ? "border-[rgba(255,42,109,0.6)]" : "border-border-strong"
                      }`}
                    >
                      <span aria-hidden="true" className="font-mono-cyber shrink-0 border-e border-border-strong px-3 text-sm font-bold text-cyber" dir="ltr">
                        {country?.dial}
                      </span>
                      <input
                        id="ct-phone"
                        type="tel"
                        inputMode="numeric"
                        dir="ltr"
                        value={form.phone}
                        onChange={(e) => {
                          set("phone", sanitizePhone(e.target.value));
                          setErrors((er) => ({ ...er, phone: undefined }));
                        }}
                        placeholder="5X XXX XXXX"
                        autoComplete="tel-national"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? "ct-phone-err" : undefined}
                        className="font-mono-cyber h-full min-w-0 flex-1 bg-transparent px-3 text-sm tracking-wider text-main outline-none placeholder:text-mute"
                      />
                    </div>
                    {errors.phone && <p id="ct-phone-err" className="mt-1 text-[11px] text-[#ff2a6d]" role="alert">{errors.phone}</p>}
                  </div>
                </div>
              </fieldset>

              {/* ٣ — الاسم والبريد */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="mb-1.5 block text-xs font-bold text-sec">
                    {t.contact.name} <span className="text-[#ff2a6d]" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="c-name"
                    value={form.name}
                    onChange={(e) => {
                      set("name", e.target.value);
                      setErrors((er) => ({ ...er, name: undefined }));
                    }}
                    placeholder={t.contact.namePh}
                    autoComplete="name"
                    required
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "c-name-err" : undefined}
                    className={inputCls(errors.name)}
                  />
                  {errors.name && <p id="c-name-err" className="mt-1 text-[11px] text-[#ff2a6d]" role="alert">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="c-email" className="mb-1.5 block text-xs font-bold text-sec">
                    {t.contact.email} <span className="text-[#ff2a6d]" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="c-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      set("email", e.target.value);
                      setErrors((er) => ({ ...er, email: undefined }));
                    }}
                    placeholder="name@example.com"
                    dir="ltr"
                    autoComplete="email"
                    required
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "c-email-err" : undefined}
                    className={inputCls(errors.email)}
                  />
                  {errors.email && <p id="c-email-err" className="mt-1 text-[11px] text-[#ff2a6d]" role="alert">{errors.email}</p>}
                </div>
              </div>

              {/* ٤ — تفاصيل المشروع */}
              <div className="flex-1">
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="c-msg" className="text-xs font-bold text-sec">
                    {t.contact.details} <span className="text-[#ff2a6d]" aria-hidden="true">*</span>
                  </label>
                  <span
                    className={`font-mono-cyber text-[10px] ${msgChars > MAX_MSG * 0.9 ? "text-[#ffd700]" : "text-mute"}`}
                    dir="ltr"
                  >
                    {msgChars}/{MAX_MSG}
                  </span>
                </div>
                <textarea
                  id="c-msg"
                  rows={5}
                  maxLength={MAX_MSG}
                  value={form.message}
                  onChange={(e) => {
                    set("message", e.target.value);
                    setErrors((er) => ({ ...er, message: undefined }));
                  }}
                  placeholder={
                    form.purpose && purpose ? t.contact.detailsPhPurpose(purpose.label) : t.contact.detailsPh
                  }
                  required
                  aria-required="true"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "c-msg-err" : undefined}
                  className={`min-h-28 w-full resize-none rounded-xl border bg-elev-2/50 p-4 text-sm leading-7 text-main outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.12)] ${
                    errors.message ? "border-[rgba(255,42,109,0.6)]" : "border-border-strong"
                  }`}
                />
                {errors.message && <p id="c-msg-err" className="mt-1 text-[11px] text-[#ff2a6d]" role="alert">{errors.message}</p>}
              </div>

              {/* ٥ — الإرسال التلقائي */}
              <div
                className="flex items-center justify-between gap-3 rounded-xl border border-[rgba(37,211,102,0.3)] bg-[rgba(37,211,102,0.06)] p-3.5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(37,211,102,0.12)] text-[#25d366]">
                    <Zap className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-main">{t.contact.autoSendTitle}</p>
                    <p className="text-[10px] leading-4 text-mute">
                      {t.contact.autoSendDesc}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={form.autoSend}
                  onCheckedChange={(v) => set("autoSend", v)}
                  aria-label={t.contact.autoSendAria}
                  className="data-[state=checked]:bg-[#25d366] data-[state=unchecked]:bg-input"
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
                ) : form.autoSend ? (
                  <Zap className="h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {sent ? t.contact.sentOk : form.autoSend ? t.contact.sendWa : t.contact.send}
              </button>
              {form.autoSend && (
                <p className="flex items-center justify-center gap-1.5 text-center text-[10px] text-mute">
                  <ClipboardCheck className="h-3 w-3" aria-hidden="true" />
                  {t.contact.clipboardNote}
                </p>
              )}
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
