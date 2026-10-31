"use client";

import { useMemo, useState } from "react";
import {
  Loader2,
  MessageSquareQuote,
  PenLine,
  Quote,
  Send,
  Star,
  ThumbsUp,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/screen-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useApi, sendJson } from "@/lib/use-api";
import type { Testimonial } from "@/lib/types";

/* ─────────── helpers ─────────── */

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ar", { year: "numeric", month: "long", day: "numeric" });

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("");

const INPUT_CLS =
  "h-11 w-full rounded-xl border border-border-strong bg-elev-2/60 px-4 text-sm outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.15)]";

const TEXTAREA_CLS =
  "min-h-[110px] w-full rounded-xl border border-border-strong bg-elev-2/60 px-4 py-3 text-sm outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.15)]";

/* ─────────── screen ─────────── */

export function TestimonialsScreen() {
  const { data, loading, error, reload } = useApi<Testimonial[]>("/api/testimonials");

  const list = useMemo(() => data ?? [], [data]);
  const avg = list.length ? list.reduce((s, t) => s + t.rating, 0) / list.length : 0;
  const satisfaction = list.length ? Math.round((avg / 5) * 100) : 0;

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [errors, setErrors] = useState<{ name?: string; role?: string; content?: string }>({});
  const [sending, setSending] = useState(false);

  function resetForm() {
    setName("");
    setRole("");
    setContent("");
    setRating(5);
    setErrors({});
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) resetForm();
  }

  async function submitTestimonial() {
    const errs: { name?: string; role?: string; content?: string } = {};
    if (name.trim().length < 2) errs.name = "الاسم قصير جداً — حرفان على الأقل";
    if (role.trim().length < 2) errs.role = "اذكر صفتك أو جهة عملك";
    if (content.trim().length < 5) errs.content = "أخبرنا بتجربتك — 5 أحرف على الأقل";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSending(true);
    try {
      await sendJson<Testimonial>("/api/testimonials", {
        name: name.trim(),
        role: role.trim(),
        content: content.trim(),
        rating,
      });
      toast({
        title: "شكراً لتقييمك!",
        description: "تمت إضافة رأيك إلى حائط الشهادات بنجاح",
      });
      setOpen(false);
      resetForm();
      reload();
    } catch (err) {
      toast({
        title: "تعذّر إرسال التقييم",
        description: err instanceof Error ? err.message : "حاول مرة أخرى لاحقاً",
      });
    } finally {
      setSending(false);
    }
  }

  const stats = [
    {
      icon: Star,
      value: list.length ? avg.toFixed(1) : "—",
      label: "متوسط التقييم",
      sub: "من 5 نجوم",
      color: "#ffd700",
    },
    {
      icon: Users,
      value: String(list.length),
      label: "عدد التقييمات",
      sub: "شهادة من عملاء حقيقيين",
      color: "#00f0ff",
    },
    {
      icon: ThumbsUp,
      value: `${satisfaction}%`,
      label: "نسبة الرضا",
      sub: "من إجمالي التقييمات",
      color: "#00ff88",
    },
  ];

  return (
    <>
      <PageHero
        badge="REVIEWS.WALL"
        title="آراء"
        highlight="العملاء"
        subtitle="شهادات حقيقية من عملاء وطلاب ثقوا بالخبرة — انضم إليهم اليوم"
      />

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
        {error && !data ? (
          <ErrorState message={error} onRetry={reload} />
        ) : !data ? (
          <ListSkeleton count={6} />
        ) : (
          <>
            {/* ── stats band ── */}
            {list.length > 0 && (
              <div className="mb-10 grid gap-4 sm:grid-cols-3">
                {stats.map((s, i) => (
                  <Reveal key={s.label} delay={i * 80}>
                    <div className="glass flex items-center gap-4 rounded-2xl p-5">
                      <span
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
                        style={{
                          borderColor: `${s.color}44`,
                          background: `${s.color}14`,
                        }}
                        aria-hidden="true"
                      >
                        <s.icon className="h-5 w-5" style={{ color: s.color }} />
                      </span>
                      <div>
                        <div className="font-heading-cyber text-2xl font-extrabold text-main">
                          {s.value}
                        </div>
                        <div className="text-xs font-bold text-sec">{s.label}</div>
                        <div className="text-[11px] text-mute">{s.sub}</div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}

            {/* ── toolbar ── */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <p className="font-mono-cyber text-xs text-mute" aria-live="polite">
                {list.length > 0 ? `${list.length} تقييماً موثقاً على الحائط` : "الحائط بانتظار أول تقييم"}
              </p>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="btn-gradient-pink inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm"
              >
                <PenLine className="h-4 w-4" aria-hidden="true" />
                أضف تقييمك
              </button>
            </div>

            {/* ── masonry ── */}
            {list.length === 0 ? (
              <Reveal>
                <EmptyState
                  icon={MessageSquareQuote}
                  title="لا توجد تقييمات بعد"
                  description="كن أول من يشارك تجربته مع خدماتنا ودوراتنا — رأيك يصنع الفرق."
                  action={
                    <button
                      type="button"
                      onClick={() => setOpen(true)}
                      className="btn-gradient-pink rounded-full px-6 py-2.5 text-sm"
                    >
                      أضف تقييمك
                    </button>
                  }
                />
              </Reveal>
            ) : (
              <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
                {list.map((t, i) => {
                  const stars = Math.min(5, Math.max(0, Math.round(t.rating)));
                  return (
                    <Reveal key={t.id} delay={(i % 3) * 80} className="mb-5 break-inside-avoid">
                      <article className="card-glow relative overflow-hidden rounded-2xl p-6">
                        <Quote
                          className="pointer-events-none absolute left-5 top-5 h-8 w-8 text-[rgba(255,42,109,0.18)]"
                          aria-hidden="true"
                        />
                        <div
                          className="flex items-center gap-1"
                          role="img"
                          aria-label={`التقييم: ${t.rating} من 5 نجوم`}
                        >
                          {Array.from({ length: 5 }).map((_, si) => (
                            <Star
                              key={si}
                              className={`h-4 w-4 ${
                                si < stars ? "fill-[#ffd700] text-[#ffd700]" : "text-mute/40"
                              }`}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <p className="mt-4 text-sm leading-7 text-sec">{t.content}</p>
                        <footer className="mt-5 flex items-center gap-3 border-t border-border-soft pt-4">
                          <span
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(255,42,109,0.25)] bg-gradient-to-br from-[rgba(124,58,237,0.25)] to-[rgba(255,42,109,0.25)] text-sm font-bold text-[#ff2a6d]"
                            aria-hidden="true"
                          >
                            {initials(t.name)}
                          </span>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-bold text-main">{t.name}</div>
                            <div className="truncate text-xs text-mute">{t.role}</div>
                          </div>
                          <span className="mr-auto shrink-0 text-[11px] text-mute">
                            {fmtDate(t.createdAt)}
                          </span>
                        </footer>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>

      {/* ── add testimonial dialog ── */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-border-strong bg-elev sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading-cyber text-xl font-bold text-main">
              أضف تقييمك
            </DialogTitle>
            <DialogDescription className="text-sec">
              شاركنا تجربتك مع خدماتنا أو دوراتنا — رأيك يساعد بقية العملاء على اتخاذ القرار.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label htmlFor="t-name" className="mb-2 block text-xs font-bold text-sec">
                الاسم
              </label>
              <input
                id="t-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اسمك الكريم"
                className={INPUT_CLS}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="mt-1.5 text-xs text-[#ff2a6d]">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="t-role" className="mb-2 block text-xs font-bold text-sec">
                الصفة / جهة العمل
              </label>
              <input
                id="t-role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="مثال: مديرة تقنية في شركة ناشئة"
                className={INPUT_CLS}
                aria-invalid={!!errors.role}
              />
              {errors.role && <p className="mt-1.5 text-xs text-[#ff2a6d]">{errors.role}</p>}
            </div>

            <div>
              <span className="mb-2 block text-xs font-bold text-sec">تقييمك</span>
              <div
                className="flex items-center gap-1.5"
                role="radiogroup"
                aria-label="اختر تقييماً من 1 إلى 5 نجوم"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={rating === n}
                    aria-label={`${n} من 5 نجوم`}
                    onClick={() => setRating(n)}
                    className="transition-transform hover:scale-110 focus-visible:outline-none"
                  >
                    <Star
                      className={`h-7 w-7 transition ${
                        n <= rating
                          ? "fill-[#ffd700] text-[#ffd700] drop-shadow-[0_0_6px_rgba(255,215,0,0.45)]"
                          : "text-mute/40"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                ))}
                <span className="mr-2 font-mono-cyber text-xs text-mute">{rating} / 5</span>
              </div>
            </div>

            <div>
              <label htmlFor="t-content" className="mb-2 block text-xs font-bold text-sec">
                تجربتك معنا
              </label>
              <textarea
                id="t-content"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="حدّثنا عن جودة العمل، الالتزام بالمواعيد، والنتائج التي حصلت عليها..."
                className={TEXTAREA_CLS}
                aria-invalid={!!errors.content}
              />
              {errors.content && (
                <p className="mt-1.5 text-xs text-[#ff2a6d]">{errors.content}</p>
              )}
            </div>

            <button
              type="button"
              onClick={submitTestimonial}
              disabled={sending}
              className="btn-gradient-pink inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
              {sending ? "جارٍ الإرسال..." : "إرسال التقييم"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
