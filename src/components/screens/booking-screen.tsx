"use client";

import { useEffect, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Phone,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAppRouter } from "@/lib/router";
import { sendJson } from "@/lib/use-api";
import { STATIC_MODE } from "@/lib/static-mode";
import { useI18n } from "@/i18n";
import { Honeypot } from "@/components/honeypot";
import { sendContactEmail, KIND_EMAIL, mailtoHref, shortRef, type ContactKind } from "@/lib/contact-email";
import type { Booking } from "@/lib/types";

const SERVICE_TYPES = [
  "استشارة تقنية عامة",
  "تطوير موقع/متجر",
  "تطبيق جوال",
  "اختبار اختراق",
  "تدقيق أمني",
  "دورة تدريبية",
  "أخرى",
] as const;

const TIME_SLOTS = [
  "09:00 - 11:00",
  "11:00 - 13:00",
  "13:00 - 15:00",
  "16:00 - 18:00",
  "20:00 - 22:00",
] as const;

const HOW_STEPS = [
  "أرسل طلبك",
  "نؤكد الموعد عبر البريد",
  "جلسة مكالمة/زوم 45 دقيقة",
  "تستلم تقريراً وتوصيات",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputCls =
  "h-11 w-full rounded-xl border border-border-strong bg-elev-2/60 px-4 text-sm text-main outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.15)]";

function fmtDate(iso: string) {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString("ar-EG", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function BookingScreen() {
  const { navigate } = useAppRouter();
  const { lang } = useI18n();
  const en = lang === "en";
  const [hp, setHp] = useState("");
  const [mailFail, setMailFail] = useState<{ kind: ContactKind; body: string } | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [today, setToday] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    date?: string;
    timeSlot?: string;
  }>({});
  const [sending, setSending] = useState(false);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  /* on mount: read preselected service from sessionStorage + today's date */
  useEffect(() => {
    queueMicrotask(() => {
      setToday(new Date().toISOString().split("T")[0]);
      try {
        const stored = sessionStorage.getItem("cto-drs-booking-service");
        if (stored) {
          sessionStorage.removeItem("cto-drs-booking-service");
          if ((SERVICE_TYPES as readonly string[]).includes(stored)) {
            setServiceType(stored);
          } else if (stored.startsWith("دورة: ")) {
            setServiceType("دورة تدريبية");
            setNotes(`أرغب بالتسجيل في ${stored}`);
          } else {
            setNotes(`أرغب بحجز خدمة: ${stored}`);
          }
        }
      } catch {
        /* sessionStorage unavailable — ignore */
      }
    });
  }, []);

  const validate = () => {
    const errs: typeof errors = {};
    if (name.trim().length < 2) errs.name = "الاسم مطلوب (حرفان على الأقل)";
    if (!EMAIL_RE.test(email.trim())) errs.email = "أدخل بريداً إلكترونياً صحيحاً";
    if (!date) errs.date = "اختر تاريخاً للحجز";
    else if (today && date < today) errs.date = "لا يمكن اختيار تاريخ في الماضي";
    if (!timeSlot) errs.timeSlot = "اختر فترة زمنية مناسبة";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSending(true);
    setMailFail(null);
    /* الدورات التدريبية → academy@ ، بقية الحجوزات → contact@ (التوجيه النهائي في الخادم) */
    const kind: ContactKind = serviceType === "دورة تدريبية" ? "academy" : "booking";
    try {
      let booking: Booking | null = null;
      if (!STATIC_MODE) {
        booking = await sendJson<Booking>("/api/bookings", {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          serviceType,
          date,
          timeSlot,
          notes: notes.trim() || undefined,
        }).catch(() => null);
      }
      const ref = booking?.id ?? shortRef("BK");
      const service = serviceType || "استشارة تقنية عامة";
      const mail = await sendContactEmail({
        kind,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        subject: `حجز: ${service} — ${date} ${timeSlot}`,
        message: notes.trim() || undefined,
        details: [
          { label: "رقم الحجز", value: ref },
          { label: "الخدمة", value: service },
          { label: "التاريخ", value: `${date} (${fmtDate(date)})` },
          { label: "الفترة (توقيت الرياض)", value: timeSlot },
        ],
        lang: en ? "en" : "ar",
        website: hp,
      });
      if (!mail.ok) {
        setMailFail({
          kind,
          body: [`الاسم: ${name.trim()}`, `البريد: ${email.trim()}`, phone.trim() ? `الجوال: ${phone.trim()}` : "", `الخدمة: ${service}`, `التاريخ: ${date}`, `الفترة: ${timeSlot}`, notes.trim()].filter(Boolean).join("\n"),
        });
        toast({
          title: en ? "Booking request not sent" : "تعذّر إرسال طلب الحجز",
          description: `${en ? "Email us directly at" : "راسلنا مباشرة على"} ${KIND_EMAIL[kind]}`,
          variant: "destructive",
        });
        return;
      }
      setConfirmed(
        booking ?? {
          id: ref,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          serviceType: service,
          date,
          timeSlot,
          notes: notes.trim() || null,
          status: "pending",
          createdAt: new Date().toISOString(),
        }
      );
      setHp("");
      toast({
        title: en ? "Booking request received!" : "تم استلام طلب الحجز!",
        description: `${service} — ${fmtDate(date)}`,
      });
    } catch (err) {
      toast({
        title: en ? "Booking request not sent" : "فشل إرسال طلب الحجز",
        description: err instanceof Error ? err.message : "خطأ غير معروف",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setServiceType("");
    setDate("");
    setTimeSlot("");
    setNotes("");
    setErrors({});
    setConfirmed(null);
  };

  return (
    <>
      <PageHero
        badge="BOOKING.DESK"
        title="احجز"
        highlight="استشارتك"
        subtitle="جلسة مكالمة مباشرة لتحديد احتياجك ووضع خطة عمل واضحة — الأولى مجانية"
      />

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* form / success */}
          <div className="lg:col-span-2">
            {confirmed ? (
              <Reveal>
                <div className="card-glow rounded-2xl p-8 text-center">
                  <CheckCircle2
                    className="mx-auto h-16 w-16 text-[#00ff88]"
                    aria-hidden="true"
                  />
                  <h2 className="font-heading-cyber mt-4 text-2xl font-extrabold text-main">
                    {en ? "Booking request received!" : "تم استلام طلب الحجز!"}
                  </h2>
                  <p className="mt-2 text-sm text-sec">
                    {en ? "We'll email you to confirm the slot — a copy is on its way to your inbox." : "سنراسلك على البريد لتثبيت الموعد — وصلتك نسخة تأكيد على بريدك."}{" "}
                    <a href={`mailto:${KIND_EMAIL.booking}`} dir="ltr" className="text-cyber underline decoration-dotted">
                      {KIND_EMAIL.booking}
                    </a>
                  </p>

                  <div className="mt-6 space-y-3 rounded-xl border border-border-soft bg-elev-2/40 p-5 text-sm">
                    <div className="flex items-center justify-between text-sec">
                      <span>رقم الحجز</span>
                      <span dir="ltr" className="font-mono-cyber font-bold text-cyber">
                        {confirmed.id}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sec">
                      <span>الخدمة</span>
                      <span className="font-bold text-main">{confirmed.serviceType}</span>
                    </div>
                    <div className="flex items-center justify-between text-sec">
                      <span>التاريخ</span>
                      <span className="font-bold text-main">{fmtDate(confirmed.date)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sec">
                      <span>الوقت</span>
                      <span dir="ltr" className="font-mono-cyber font-bold text-cyber">
                        {confirmed.timeSlot}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sec">
                      <span>الاسم</span>
                      <span className="font-bold text-main">{confirmed.name}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn-outline-cyber h-11 flex-1 rounded-xl text-sm font-bold"
                    >
                      حجز آخر
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate({ name: "home" })}
                      className="btn-gradient h-11 flex-1 rounded-xl text-sm"
                    >
                      عودة للرئيسية
                    </button>
                  </div>
                </div>
              </Reveal>
            ) : (
              <Reveal>
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="card-glow relative rounded-2xl p-6"
                >
                  <h2 className="font-heading-cyber text-lg font-bold text-main">
                    تفاصيل الحجز
                  </h2>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="bk-name" className="mb-1.5 block text-xs font-bold text-sec">
                        الاسم <span className="text-[#ff2a6d]">*</span>
                      </label>
                      <input
                        id="bk-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="اسمك الكامل"
                        aria-label="الاسم"
                        aria-invalid={!!errors.name}
                        autoComplete="name"
                        className={inputCls}
                      />
                      {errors.name && (
                        <p className="mt-1.5 text-xs text-[#ff2a6d]">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="bk-email" className="mb-1.5 block text-xs font-bold text-sec">
                        البريد الإلكتروني <span className="text-[#ff2a6d]">*</span>
                      </label>
                      <input
                        id="bk-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        aria-label="البريد الإلكتروني"
                        aria-invalid={!!errors.email}
                        autoComplete="email"
                        dir="ltr"
                        className={cn(inputCls, "text-left")}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-xs text-[#ff2a6d]">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="bk-phone" className="mb-1.5 block text-xs font-bold text-sec">
                        الجوال <span className="text-mute">(اختياري)</span>
                      </label>
                      <input
                        id="bk-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="05xxxxxxxx"
                        aria-label="رقم الجوال"
                        autoComplete="tel"
                        dir="ltr"
                        className={cn(inputCls, "text-left")}
                      />
                    </div>

                    <div>
                      <label htmlFor="bk-service" className="mb-1.5 block text-xs font-bold text-sec">
                        نوع الخدمة <span className="text-[#ff2a6d]">*</span>
                      </label>
                      <Select value={serviceType} onValueChange={setServiceType}>
                        <SelectTrigger
                          id="bk-service"
                          aria-label="نوع الخدمة"
                          className="h-11 w-full rounded-xl border-border-strong bg-elev-2/60 text-sm font-medium text-main focus:border-[rgba(0,240,255,0.5)] focus:ring-0"
                        >
                          <SelectValue placeholder="اختر نوع الخدمة" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border-strong bg-elev text-main">
                          {SERVICE_TYPES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="bk-date" className="mb-1.5 block text-xs font-bold text-sec">
                        التاريخ <span className="text-[#ff2a6d]">*</span>
                      </label>
                      <input
                        id="bk-date"
                        type="date"
                        value={date}
                        min={today || undefined}
                        onChange={(e) => setDate(e.target.value)}
                        aria-label="التاريخ"
                        aria-invalid={!!errors.date}
                        dir="ltr"
                        className={cn(inputCls, "text-left")}
                      />
                      {errors.date && (
                        <p className="mt-1.5 text-xs text-[#ff2a6d]">{errors.date}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <span className="mb-1.5 block text-xs font-bold text-sec">
                        الوقت <span className="text-[#ff2a6d]">*</span>
                      </span>
                      <div
                        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                        role="radiogroup"
                        aria-label="الفترة الزمنية"
                      >
                        {TIME_SLOTS.map((slot) => {
                          const selected = timeSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              onClick={() => {
                                setTimeSlot(slot);
                                setErrors((er) => ({ ...er, timeSlot: undefined }));
                              }}
                              dir="ltr"
                              className={cn(
                                "font-mono-cyber h-10 rounded-xl border text-xs transition",
                                selected
                                  ? "border-cyber bg-[rgba(0,240,255,0.06)] text-cyber shadow-[0_0_12px_rgba(0,240,255,0.12)]"
                                  : "border-border-strong bg-elev-2/60 text-sec hover:border-[rgba(0,240,255,0.4)] hover:text-cyber"
                              )}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                      {errors.timeSlot && (
                        <p className="mt-1.5 text-xs text-[#ff2a6d]">{errors.timeSlot}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="bk-notes" className="mb-1.5 block text-xs font-bold text-sec">
                        ملاحظات <span className="text-mute">(اختياري)</span>
                      </label>
                      <textarea
                        id="bk-notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="اشرح باختصار ما تحتاجه من الجلسة..."
                        aria-label="ملاحظات"
                        rows={3}
                        className="min-h-24 w-full rounded-xl border border-border-strong bg-elev-2/60 p-4 text-sm text-main outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.15)]"
                      />
                    </div>
                  </div>

                  <Honeypot value={hp} onChange={setHp} />
                  {mailFail && (
                    <div role="alert" className="mt-5 rounded-xl border border-[rgba(255,42,109,0.45)] bg-[rgba(255,42,109,0.07)] p-3.5 text-xs leading-6 text-sec">
                      <p className="font-bold text-main">{en ? "Your request didn't reach us" : "لم يصلنا طلبك بعد"}</p>
                      <p>
                        {en ? "Send it directly to" : "أرسله مباشرة إلى"}{" "}
                        <a href={mailtoHref(mailFail.kind, "طلب حجز استشارة — CTO.DRS", mailFail.body)} dir="ltr" className="font-bold text-cyber underline decoration-dotted">
                          {KIND_EMAIL[mailFail.kind]}
                        </a>
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-gradient mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        جارٍ إرسال الطلب...
                      </>
                    ) : (
                      <>
                        <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                        تأكيد الحجز
                      </>
                    )}
                  </button>
                </form>
              </Reveal>
            )}
          </div>

          {/* sidebar */}
          <div className="space-y-6">
            <Reveal delay={100}>
              <div className="card-glow rounded-2xl p-6">
                <h2 className="font-heading-cyber text-base font-bold text-main">
                  كيف تتم الجلسة؟
                </h2>
                <ol className="mt-5 space-y-4">
                  {HOW_STEPS.map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="font-mono-cyber flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(0,240,255,0.35)] bg-[rgba(0,240,255,0.06)] text-xs font-bold text-cyber">
                        {i + 1}
                      </span>
                      <span className="pt-1 text-sm leading-6 text-sec">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="glass rounded-2xl p-6 text-center">
                <Phone className="mx-auto h-8 w-8 text-cyber" aria-hidden="true" />
                <h2 className="font-heading-cyber mt-3 text-base font-bold text-main">
                  تفضل التواصل المباشر؟
                </h2>
                <p className="mt-2 text-xs leading-5 text-sec">
                  راسلنا مباشرة وسنجيبك في أسرع وقت ممكن
                </p>
                <button
                  type="button"
                  onClick={() => navigate({ name: "contact" })}
                  className="btn-outline-cyber mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold"
                >
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  راسلنا
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
