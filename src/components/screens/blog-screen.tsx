"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Eye,
  Newspaper,
  Search,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/screen-state";
import { useApi } from "@/lib/use-api";
import { useAppRouter, routeHref } from "@/lib/router";
import type { Post } from "@/lib/types";

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

/* ─────────── sub components ─────────── */

function PostCover({ post, sizes }: { post: Post; sizes: string }) {
  return (
    <>
      {post.cover ? (
        <Image
          src={post.cover}
          alt={post.title}
          fill
          sizes={sizes}
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[rgba(0,240,255,0.15)] to-[rgba(255,42,109,0.15)]">
          <Newspaper className="h-12 w-12 text-cyber/60" />
        </div>
      )}
      <span className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
        <Clock className="h-3 w-3" />
        {readingTime(post.content)} دقائق
      </span>
    </>
  );
}

function AuthorAvatar({ name, size = "h-8 w-8" }: { name: string; size?: string }) {
  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center rounded-full border border-[rgba(0,240,255,0.3)] bg-gradient-to-br from-[rgba(0,240,255,0.22)] to-[rgba(255,42,109,0.22)] text-[11px] font-bold text-cyber`}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

function FeaturedCard({ post }: { post: Post }) {
  const { navigate } = useAppRouter();
  return (
    <Reveal>
      <article className="card-glow group grid overflow-hidden rounded-2xl md:grid-cols-2">
        <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[340px]">
          <PostCover post={post} sizes="(max-width:768px) 100vw, 50vw" />
        </div>
        <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[rgba(255,215,0,0.35)] bg-[rgba(255,215,0,0.1)] px-3 py-1 text-[11px] font-bold text-[#ffd700]">
            <Sparkles className="h-3.5 w-3.5" />
            أحدث مقال
          </span>
          <h2 className="font-heading-cyber text-2xl font-extrabold leading-snug text-main transition group-hover:text-cyber md:text-3xl">
            {post.title}
          </h2>
          <p className="line-clamp-3 text-sm leading-7 text-sec">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-mute">
            <span className="flex items-center gap-2">
              <AuthorAvatar name={post.author} />
              <span className="font-bold text-sec">{post.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {fmtDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              {fmtViews(post.views)} قراءة
            </span>
          </div>
          <a
            href={routeHref({ name: "post-detail", slug: post.slug })}
            onClick={(e) => {
              e.preventDefault();
              navigate({ name: "post-detail", slug: post.slug });
            }}
            className="btn-gradient mt-1 inline-flex w-fit items-center gap-2 rounded-full px-6 py-2.5 text-sm"
          >
            اقرأ المقال
            <ArrowLeft className="h-4 w-4" />
          </a>
        </div>
      </article>
    </Reveal>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const { navigate } = useAppRouter();
  return (
    <Reveal delay={(index % 3) * 80} className="h-full">
      <a
        href={routeHref({ name: "post-detail", slug: post.slug })}
        onClick={(e) => {
          e.preventDefault();
          navigate({ name: "post-detail", slug: post.slug });
        }}
        className="group block h-full focus-visible:outline-none"
        aria-label={`قراءة مقال: ${post.title}`}
      >
        <article className="card-glow flex h-full flex-col overflow-hidden rounded-2xl group-focus-visible:border-[rgba(0,240,255,0.5)]">
          <div className="relative aspect-[16/9] overflow-hidden">
            <PostCover post={post} sizes="(max-width:768px) 100vw, 33vw" />
          </div>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="tag-pill">
                  #{tag}
                </span>
              ))}
            </div>
            <h3 className="line-clamp-2 font-bold leading-snug text-main transition group-hover:text-cyber">
              {post.title}
            </h3>
            <p className="line-clamp-2 text-sm leading-7 text-sec">{post.excerpt}</p>
            <footer className="mt-auto flex items-center justify-between gap-2 border-t border-border-soft pt-3 text-[11px] text-mute">
              <span className="flex min-w-0 items-center gap-2">
                <AuthorAvatar name={post.author} size="h-6 w-6" />
                <span className="truncate font-bold text-sec">{post.author}</span>
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <span>{fmtDate(post.publishedAt)}</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {fmtViews(post.views)}
                </span>
              </span>
            </footer>
          </div>
        </article>
      </a>
    </Reveal>
  );
}

/* ─────────── screen ─────────── */

export function BlogScreen() {
  const { data, loading, error, reload } = useApi<Post[]>("/api/blog");
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const posts = useMemo(() => data ?? [], [data]);
  const tags = useMemo(
    () => [...new Set(posts.flatMap((p) => p.tags))].slice(0, 8),
    [posts]
  );

  const filtered = useMemo(() => {
    let list = posts;
    if (activeTag) list = list.filter((p) => p.tags.includes(activeTag));
    const q = query.trim();
    if (q) {
      list = list.filter((p) =>
        [p.title, p.excerpt, p.author, ...p.tags].join(" ").includes(q)
      );
    }
    return list;
  }, [posts, activeTag, query]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      <PageHero
        badge="BLOG.KNOWLEDGE"
        title="المدونة"
        highlight="التقنية"
        subtitle="مقالات عميقة في الأمن السيبراني وتطوير الويب — خبرات مقتصدة من الميدان"
      />

      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-12">
        {/* ── toolbar ── */}
        <Reveal>
          <div className="mb-10 flex flex-col gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative max-w-md flex-1">
                <Search
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ابحث عن مقال، كاتب، أو وسم..."
                  aria-label="ابحث في المقالات"
                  className="h-11 w-full rounded-xl border border-border-strong bg-elev-2/60 pr-11 pl-4 text-sm outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.15)]"
                />
              </div>
              <p className="font-mono-cyber shrink-0 text-xs text-mute" aria-live="polite">
                النتائج: {filtered.length} من {posts.length} مقالاً
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="تصفية حسب الوسم">
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                aria-pressed={activeTag === null}
                className={`rounded-full border px-4 py-1.5 font-mono-cyber text-[11px] font-bold transition ${
                  activeTag === null
                    ? "border-[rgba(0,240,255,0.55)] bg-[rgba(0,240,255,0.12)] text-cyber shadow-[0_0_14px_rgba(0,240,255,0.15)]"
                    : "border-border-soft text-sec hover:border-[rgba(0,240,255,0.4)] hover:text-cyber"
                }`}
              >
                الكل
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  aria-pressed={activeTag === tag}
                  className={`rounded-full border px-4 py-1.5 font-mono-cyber text-[11px] font-bold transition ${
                    activeTag === tag
                      ? "border-[rgba(0,240,255,0.55)] bg-[rgba(0,240,255,0.12)] text-cyber shadow-[0_0_14px_rgba(0,240,255,0.15)]"
                      : "border-border-soft text-sec hover:border-[rgba(0,240,255,0.4)] hover:text-cyber"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── states ── */}
        {error && !data ? (
          <ErrorState message={error} onRetry={reload} />
        ) : !data ? (
          <ListSkeleton count={6} />
        ) : filtered.length === 0 ? (
          <Reveal>
            <EmptyState
              icon={Search}
              title="لا توجد نتائج مطابقة"
              description="جرّب كلمة بحث مختلفة أو أزل عوامل التصفية لعرض جميع المقالات."
              action={
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setActiveTag(null);
                  }}
                  className="btn-outline-cyber rounded-full px-6 py-2.5 text-xs font-bold"
                >
                  إعادة تعيين البحث
                </button>
              }
            />
          </Reveal>
        ) : (
          <>
            {featured && <FeaturedCard post={featured} />}
            {rest.length > 0 && (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
