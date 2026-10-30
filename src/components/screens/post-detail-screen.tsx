"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Eye,
  FileQuestion,
  Link2,
  Loader2,
  MessageCircle,
  MessageSquare,
  MessageSquarePlus,
  Newspaper,
  Send,
  Share2,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { EmptyState, ErrorState, ScreenLoader } from "@/components/screen-state";
import { toast } from "@/hooks/use-toast";
import { useApi, sendJson } from "@/lib/use-api";
import { useAppRouter, routeHref } from "@/lib/router";
import type { CommentItem, Post } from "@/lib/types";

/* ─────────── helpers ─────────── */

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ar", { year: "numeric", month: "long", day: "numeric" });

const fmtViews = (n: number) => (n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n));

const readingTime = (content: string) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 180));
};

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

/** Parses post content into styled blocks: "## " → h2, consecutive "- " → check list, else paragraph. */
function parseContent(content: string): ReactNode[] {
  const blocks = content
    .split("\n\n")
    .map((b) => b.trim())
    .filter(Boolean);
  const nodes: ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      nodes.push(
        <ul key={`ul-${nodes.length}`} className="mb-6 space-y-2.5">
          {listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 leading-7 text-sec">
              <Check className="mt-1.5 h-4 w-4 shrink-0 text-[#00ff88]" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    for (const line of lines) {
      if (line.startsWith("- ")) {
        listItems.push(line.slice(2));
      } else {
        flushList();
        if (line.startsWith("## ")) {
          nodes.push(
            <h2
              key={`h2-${nodes.length}`}
              className="font-heading-cyber mt-10 mb-4 border-r-4 border-cyber pr-4 text-2xl font-bold text-main"
            >
              {line.slice(3)}
            </h2>
          );
        } else {
          nodes.push(
            <p key={`p-${nodes.length}`} className="mb-5 leading-8 text-sec">
              {line}
            </p>
          );
        }
      }
    }
  }
  flushList();
  return nodes;
}

/* ─────────── screen ─────────── */

export function PostDetailScreen() {
  const { route, navigate } = useAppRouter();
  const slug = route.slug;
  const { data, loading, error, reload } = useApi<Post[]>("/api/blog");

  const post = useMemo(() => data?.find((p) => p.slug === slug) ?? null, [data, slug]);

  /* hooks are always called — url is null until the post is found */
  const comments = useApi<CommentItem[]>(
    post ? `/api/comments?postId=${post.id}` : null
  );

  const [cName, setCName] = useState("");
  const [cContent, setCContent] = useState("");
  const [cErrors, setCErrors] = useState<{ name?: string; content?: string }>({});
  const [sending, setSending] = useState(false);

  const related = useMemo(() => {
    if (!post || !data) return [];
    return data
      .filter((p) => p.id !== post.id && p.tags.some((t) => post.tags.includes(t)))
      .slice(0, 3);
  }, [data, post]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "نُسخ الرابط", description: "يمكنك الآن مشاركة المقال مع من تشاء" });
    } catch {
      toast({
        title: "تعذّر نسخ الرابط",
        description: "انسخ الرابط يدوياً من شريط عنوان المتصفح",
      });
    }
  }

  async function submitComment() {
    if (!post) return;
    const errs: { name?: string; content?: string } = {};
    if (cName.trim().length < 2) errs.name = "الاسم قصير جداً — حرفان على الأقل";
    if (cContent.trim().length < 2) errs.content = "التعليق قصير جداً — حرفان على الأقل";
    setCErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSending(true);
    try {
      await sendJson<CommentItem>("/api/comments", {
        postId: post.id,
        authorName: cName.trim(),
        content: cContent.trim(),
      });
      toast({
        title: "تم نشر تعليقك",
        description: "شكراً لمشاركتك — ظهر تعليقك الآن في القائمة",
      });
      setCName("");
      setCContent("");
      setCErrors({});
      comments.reload();
    } catch (err) {
      toast({
        title: "تعذّر إرسال التعليق",
        description: err instanceof Error ? err.message : "حاول مرة أخرى لاحقاً",
      });
    } finally {
      setSending(false);
    }
  }

  /* ── states ── */
  if (error && !data) {
    return (
      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-40">
        <ErrorState message={error} onRetry={reload} />
      </section>
    );
  }

  if (loading && !data) {
    return (
      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-40">
        <ScreenLoader label="جارٍ تحميل المقال..." />
      </section>
    );
  }

  if (!post) {
    return (
      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-40">
        <EmptyState
          icon={FileQuestion}
          title="المقال غير موجود"
          description="قد يكون الرابط قديماً أو تم حذف المقال — تصفّح باقي المقالات في المدونة."
          action={
            <button
              type="button"
              onClick={() => navigate({ name: "blog" })}
              className="btn-gradient rounded-full px-6 py-2.5 text-sm"
            >
              العودة للمدونة
            </button>
          }
        />
      </section>
    );
  }

  const contentNodes = parseContent(post.content);
  const commentList = comments.data ?? [];

  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
      <article className="mx-auto max-w-3xl">
        {/* ── back ── */}
        <button
          type="button"
          onClick={() => navigate({ name: "blog" })}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border-strong bg-elev-2/60 px-4 py-2 text-xs font-bold text-sec transition hover:border-[rgba(0,240,255,0.5)] hover:text-cyber"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          عودة للمدونة
        </button>

        {/* ── header ── */}
        <Reveal>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="font-heading-cyber mt-4 text-3xl font-extrabold leading-snug text-main md:text-4xl">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-mute">
            <span className="flex items-center gap-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(0,240,255,0.3)] bg-gradient-to-br from-[rgba(0,240,255,0.22)] to-[rgba(255,42,109,0.22)] text-[11px] font-bold text-cyber"
                aria-hidden="true"
              >
                {initials(post.author)}
              </span>
              <span className="font-bold text-sec">{post.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              {fmtDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              {fmtViews(post.views)} قراءة
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {readingTime(post.content)} دقائق قراءة
            </span>
          </div>
        </Reveal>

        {/* ── cover ── */}
        <Reveal delay={100}>
          <div className="relative mt-8 aspect-[16/7] overflow-hidden rounded-2xl border border-border-soft">
            {post.cover ? (
              <Image
                src={post.cover}
                alt={post.title}
                fill
                sizes="(max-width:768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[rgba(0,240,255,0.15)] to-[rgba(255,42,109,0.15)]">
                <Newspaper className="h-14 w-14 text-cyber/60" />
              </div>
            )}
          </div>
        </Reveal>

        {/* ── content ── */}
        <Reveal delay={160}>
          <div className="mt-8">{contentNodes}</div>
        </Reveal>

        {/* ── share row ── */}
        <div className="mt-10 flex flex-wrap items-center gap-3 rounded-2xl border border-border-soft bg-elev-2/40 px-5 py-4">
          <span className="text-sm font-bold text-sec">مشاركة المقال:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyLink}
              aria-label="نسخ رابط المقال"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-strong bg-elev-2/60 text-sec transition hover:border-[rgba(0,240,255,0.5)] hover:text-cyber hover:shadow-[0_0_16px_rgba(0,240,255,0.2)]"
            >
              <Link2 className="h-4 w-4" aria-hidden="true" />
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="مشاركة المقال على إكس (تويتر)"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-strong bg-elev-2/60 text-sec transition hover:border-[rgba(0,240,255,0.5)] hover:text-cyber hover:shadow-[0_0_16px_rgba(0,240,255,0.2)]"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="مشاركة المقال عبر واتساب"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-strong bg-elev-2/60 text-sec transition hover:border-[rgba(0,255,136,0.5)] hover:text-[#00ff88] hover:shadow-[0_0_16px_rgba(0,255,136,0.2)]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* ── comments ── */}
        <section id="comments" className="mt-16 scroll-mt-28" aria-label="التعليقات">
          <div className="flex items-center gap-3">
            <h2 className="font-heading-cyber text-xl font-bold text-main">التعليقات</h2>
            <span className="rounded-full border border-[rgba(0,240,255,0.3)] bg-[rgba(0,240,255,0.08)] px-3 py-0.5 font-mono-cyber text-xs text-cyber">
              {commentList.length}
            </span>
          </div>

          {comments.error ? (
            <div className="mt-6">
              <ErrorState message={comments.error} onRetry={comments.reload} />
            </div>
          ) : comments.loading ? (
            <div className="mt-6 flex items-center justify-center gap-2 py-8 text-mute">
              <Loader2 className="h-5 w-5 animate-spin text-cyber" aria-hidden="true" />
              <span className="font-mono-cyber text-xs">جارٍ تحميل التعليقات...</span>
            </div>
          ) : commentList.length === 0 ? (
            <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border border-border-soft bg-elev-2/40 px-6 py-10 text-center">
              <MessageSquare className="h-8 w-8 text-mute" aria-hidden="true" />
              <p className="text-sm text-sec">لا توجد تعليقات بعد — كن أول من يبدأ النقاش!</p>
            </div>
          ) : (
            <ul className="mt-6 max-h-96 space-y-4 overflow-y-auto pl-1" aria-label="قائمة التعليقات">
              {commentList.map((c) => (
                <li key={c.id} className="card-glow rounded-2xl p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(0,240,255,0.25)] bg-gradient-to-br from-[rgba(0,240,255,0.2)] to-[rgba(255,42,109,0.2)] text-sm font-bold text-cyber"
                      aria-hidden="true"
                    >
                      {initials(c.authorName)}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-main">{c.authorName}</div>
                      <div className="text-[11px] text-mute">{fmtDate(c.createdAt)}</div>
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-sec">{c.content}</p>
                </li>
              ))}
            </ul>
          )}

          {/* ── add comment form ── */}
          <div className="card-glow mt-8 rounded-2xl p-5 md:p-6">
            <h3 className="font-heading-cyber flex items-center gap-2 text-lg font-bold text-main">
              <MessageSquarePlus className="h-5 w-5 text-cyber" aria-hidden="true" />
              أضف تعليقاً
            </h3>
            <p className="mt-1 text-xs text-mute">
              شارك رأيك أو اطرح سؤالاً — نرحّب بالنقاش البنّاء فقط.
            </p>
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="comment-name" className="mb-2 block text-xs font-bold text-sec">
                  الاسم
                </label>
                <input
                  id="comment-name"
                  type="text"
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  placeholder="مثال: أحمد الغامدي"
                  className={INPUT_CLS}
                  aria-invalid={!!cErrors.name}
                />
                {cErrors.name && <p className="mt-1.5 text-xs text-[#ff2a6d]">{cErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="comment-content" className="mb-2 block text-xs font-bold text-sec">
                  التعليق
                </label>
                <textarea
                  id="comment-content"
                  rows={4}
                  value={cContent}
                  onChange={(e) => setCContent(e.target.value)}
                  placeholder="اكتب تعليقك هنا..."
                  className={TEXTAREA_CLS}
                  aria-invalid={!!cErrors.content}
                />
                {cErrors.content && (
                  <p className="mt-1.5 text-xs text-[#ff2a6d]">{cErrors.content}</p>
                )}
              </div>
              <button
                type="button"
                onClick={submitComment}
                disabled={sending}
                className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="h-4 w-4" aria-hidden="true" />
                )}
                {sending ? "جارٍ الإرسال..." : "نشر التعليق"}
              </button>
            </div>
          </div>
        </section>

        {/* ── related posts ── */}
        {related.length > 0 && (
          <section className="mt-16" aria-label="مقالات ذات صلة">
            <h2 className="font-heading-cyber border-r-4 border-cyber pr-4 text-xl font-bold text-main">
              مقالات ذات صلة
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((rp) => (
                <a
                  key={rp.id}
                  href={routeHref({ name: "post-detail", slug: rp.slug })}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate({ name: "post-detail", slug: rp.slug });
                  }}
                  className="card-glow group block rounded-2xl p-4"
                  aria-label={`قراءة مقال: ${rp.title}`}
                >
                  <div className="mb-2 flex items-center gap-1.5 text-[11px] text-mute">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {readingTime(rp.content)} دقائق
                    <span aria-hidden="true">•</span>
                    {fmtDate(rp.publishedAt)}
                  </div>
                  <h3 className="line-clamp-2 text-sm font-bold leading-snug text-main transition group-hover:text-cyber">
                    {rp.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-6 text-sec">{rp.excerpt}</p>
                </a>
              ))}
            </div>
          </section>
        )}
      </article>
    </section>
  );
}
