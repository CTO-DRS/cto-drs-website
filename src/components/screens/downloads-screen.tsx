"use client";

import { useMemo, useState } from "react";
import {
  Download,
  Package,
  Tag,
  HardDrive,
  Github,
  FolderGit2,
  ShieldCheck,
  FileArchive,
  Copy,
  Check,
  ChevronDown,
  ExternalLink,
  RefreshCw,
  Smartphone,
  Globe,
  Code2,
  Wrench,
  Boxes,
  Bot,
  Server,
  GraduationCap,
  Gamepad2,
  Cpu,
  MonitorSmartphone,
  Briefcase,
  Keyboard,
  SquareKanban,
  FolderOpen,
  MessagesSquare,
  Sparkles,
  Languages,
  BrainCircuit,
  History,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/lib/use-api";
import { toast } from "@/hooks/use-toast";
import { useI18n, useContent } from "@/i18n";
import {
  SOURCE_REPOS,
  type AppCategory,
  type AppEntry,
  directReleaseUrl,
  sourceZipUrl,
  releasesPageUrl,
  repoPageUrl,
} from "@/lib/apps";

/* ─── الأيقونات ─── */
const ICONS: Record<string, LucideIcon> = {
  MonitorSmartphone, Briefcase, Keyboard, SquareKanban, FolderOpen,
  MessagesSquare, Sparkles, Languages, BrainCircuit, ShieldCheck,
};
const SOURCE_ICONS: Record<string, LucideIcon> = {
  Boxes, Bot, Server, GraduationCap, Gamepad2, Cpu,
};
const CATEGORY_ICONS: Record<AppCategory, LucideIcon> = {
  android: Smartphone,
  web: Globe,
  language: Code2,
  tool: Wrench,
};

/* ─── ألوان العناصر ─── */
const ACCENT: Record<string, { text: string; bg: string; glow: string }> = {
  cyan:   { text: "text-cyber",    bg: "bg-[rgba(0,240,255,0.07)]",   glow: "0 0 18px rgba(0,240,255,0.35)" },
  pink:   { text: "text-[#ff2a6d]", bg: "bg-[rgba(255,42,109,0.08)]",  glow: "0 0 18px rgba(255,42,109,0.35)" },
  purple: { text: "text-[#a78bfa]", bg: "bg-[rgba(124,58,237,0.1)]",   glow: "0 0 18px rgba(124,58,237,0.4)" },
  green:  { text: "text-[#00ff88]", bg: "bg-[rgba(0,255,136,0.07)]",   glow: "0 0 18px rgba(0,255,136,0.35)" },
  gold:   { text: "text-[#ffd700]", bg: "bg-[rgba(255,215,0,0.07)]",   glow: "0 0 18px rgba(255,215,0,0.3)" },
  orange: { text: "text-[#ff9900]", bg: "bg-[rgba(255,153,0,0.08)]",   glow: "0 0 18px rgba(255,153,0,0.35)" },
};

/* ─── بيانات مباشرة من /api/github/apps ─── */
interface LiveApp {
  repo: string;
  ok: boolean;
  tag: string | null;
  publishedAt: string | null;
  releaseUrl: string | null;
  totalDownloads: number;
  assets: { name: string; sizeMb: number; downloads: number; url: string }[];
  sourceZip: string;
}
interface LiveResponse {
  apps: LiveApp[];
  sourceRepos: LiveApp[];
}

type Filter = "all" | AppCategory;

const FILTERS: Filter[] = ["all", "android", "web", "language", "tool"];

function formatDate(iso: string | null, locale: string): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" }).format(new Date(iso));
  } catch {
    return "";
  }
}

/* ═════════════ بطاقة تطبيق ═════════════ */
function AppCard({ app, live }: { app: AppEntry; live?: LiveApp }) {
  const [openAssets, setOpenAssets] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();
  const dl = t.downloads;
  const a = ACCENT[app.accent] ?? ACCENT.cyan;
  const Icon = ICONS[app.icon] ?? Package;
  const CatIcon = CATEGORY_ICONS[app.category];

  const version = live?.ok && live.tag ? live.tag : app.version;
  const downloads = live?.ok && live.totalDownloads > 0 ? dl.downloadsCount(live.totalDownloads.toLocaleString("en")) : app.downloads;
  const published = live?.ok ? formatDate(live.publishedAt, t.meta.locale) : "";

  const hasDirect = !!app.directFile;
  const directUrl = hasDirect ? directReleaseUrl(app.repo, app.directFile) : sourceZipUrl(app.repo);

  const extraAssets = live?.ok && live.assets.length
    ? live.assets.filter((x) => x.name !== app.directFile).map((x) => ({ file: x.name, label: dl.assetLabel(x.sizeMb, x.downloads) }))
    : app.extraAssets;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(directUrl);
      setCopied(true);
      toast({ title: dl.copiedTitle, description: directUrl });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: dl.copyFailTitle, description: dl.copyFailDesc });
    }
  };

  return (
    <article className="card-glow group flex h-full flex-col rounded-2xl p-6">
      {/* رأس البطاقة */}
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${a.text} ${a.bg} group-hover:shadow-[var(--glow)]`}
          style={{ "--glow": a.glow } as React.CSSProperties}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="flex flex-col items-end gap-1.5">
          <span className="font-mono-cyber flex items-center gap-1 rounded-full border border-border-strong bg-elev-2/60 px-2.5 py-1 text-[10px] font-bold text-cyber" dir="ltr">
            <Tag className="h-3 w-3" aria-hidden="true" />
            {version}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-mute">
            <CatIcon className="h-3 w-3" aria-hidden="true" />
            {dl.categoryLabels[app.category]}
          </span>
        </div>
      </div>

      {/* العنوان والوصف */}
      <h3 className="font-heading-cyber mt-5 text-base font-bold leading-7 text-main transition group-hover:text-cyber">
        {app.title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-xs leading-6 text-sec">{app.description}</p>

      {/* المنصات والوسوم */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {app.platforms.map((p) => (
          <span key={p} className="tag-pill" dir="ltr">
            {p}
          </span>
        ))}
      </div>

      {/* بيانات الملف */}
      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border-soft pt-4 text-[11px] text-mute">
        {app.size !== "—" && (
          <span className="flex items-center gap-1">
            <HardDrive className="h-3 w-3" />
            {app.size}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Download className="h-3 w-3" />
          {downloads}
        </span>
        {published && (
          <span className="flex items-center gap-1">
            <History className="h-3 w-3" />
            {published}
          </span>
        )}
      </div>

      {/* أزرار التنزيل */}
      <div className="mt-4 flex items-center gap-2">
        <a
          href={directUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="btn-gradient flex h-10 flex-1 items-center justify-center gap-2 rounded-full text-xs font-bold"
          aria-label={dl.downloadAria(app.titleEn)}
        >
          {app.fileType === "APK" ? (
            <>
              <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
              {t.common.directApk}
            </>
          ) : app.fileType === "ZIP" ? (
            <>
              <FileArchive className="h-3.5 w-3.5" aria-hidden="true" />
              {t.common.directZip}
            </>
          ) : (
            <>
              <FileArchive className="h-3.5 w-3.5" aria-hidden="true" />
              {dl.sourceBtn}
            </>
          )}
        </a>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-full border-border-strong hover:border-cyber hover:text-cyber"
          onClick={copyLink}
          aria-label={dl.copyAria}
        >
          {copied ? <Check className="h-4 w-4 text-[#00ff88]" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
        </Button>
      </div>

      {/* ملفات إضافية */}
      {extraAssets.length > 0 && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setOpenAssets((v) => !v)}
            aria-controls={`assets-${app.id}`}
            className="flex h-8 w-full items-center justify-between rounded-full border border-border-strong bg-elev-2/40 px-4 text-[11px] font-bold text-sec transition hover:border-cyber/40 hover:text-cyber"
            aria-expanded={openAssets}
          >
            <span className="flex items-center gap-1.5">
              <FolderOpen className="h-3.5 w-3.5" aria-hidden="true" />
              {dl.otherFiles(extraAssets.length)}
            </span>
            <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 transition-transform duration-300 ${openAssets ? "rotate-180" : ""}`} />
          </button>
          {openAssets && (
            <ul id={`assets-${app.id}`} className="mt-2 max-h-40 space-y-1.5 overflow-y-auto rounded-xl border border-border-soft bg-elev/60 p-2.5">
              {extraAssets.map((asset) => {
                const url = live?.ok && live.assets.find((x) => x.name === asset.file)?.url
                  ? live.assets.find((x) => x.name === asset.file)!.url
                  : directReleaseUrl(app.repo, asset.file);
                return (
                  <li key={asset.file}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-[11px] transition hover:bg-[rgba(0,240,255,0.06)]"
                      dir="auto"
                    >
                      <span className="truncate font-mono-cyber text-sec" dir="ltr" title={asset.file}>
                        {asset.file}
                      </span>
                      <span className="flex shrink-0 items-center gap-1 text-cyber">
                        <Download className="h-3 w-3" aria-hidden="true" />
                        {dl.download}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* روابط ثانوية */}
      <div className="mt-3 flex items-center gap-2">
        <a
          href={releasesPageUrl(app.repo)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full border border-border-strong bg-elev-2/40 text-[11px] font-bold text-sec transition hover:border-[rgba(255,42,109,0.4)] hover:text-[#ff2a6d]"
        >
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
          {dl.allReleases}
        </a>
        <a
          href={repoPageUrl(app.repo)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full border border-border-strong bg-elev-2/40 text-[11px] font-bold text-sec transition hover:border-cyber/40 hover:text-cyber"
        >
          <Github className="h-3 w-3" aria-hidden="true" />
          {t.common.repo}
        </a>
      </div>
    </article>
  );
}

/* ═════════════ بطاقة مستودع مصدر ═════════════ */
function SourceRepoCard({ repo }: { repo: (typeof SOURCE_REPOS)[number] }) {
  const { t } = useI18n();
  const a = ACCENT[repo.accent] ?? ACCENT.cyan;
  const Icon = SOURCE_ICONS[repo.icon] ?? Boxes;
  return (
    <a
      href={sourceZipUrl(repo.repo)}
      target="_blank"
      rel="noopener noreferrer"
      download
      className="card-glow group flex items-center gap-4 rounded-2xl p-5"
      aria-label={t.downloads.sourceAria(repo.title)}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${a.text} ${a.bg} group-hover:shadow-[var(--glow)]`}
        style={{ "--glow": a.glow } as React.CSSProperties}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <h4 className="font-heading-cyber truncate text-sm font-bold text-main transition group-hover:text-cyber" dir="ltr">
          {repo.title}
        </h4>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-sec">{repo.description}</p>
      </div>
      <span className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-[rgba(0,240,255,0.35)] bg-[rgba(0,240,255,0.05)] px-3.5 text-[11px] font-bold text-cyber transition group-hover:bg-[rgba(0,240,255,0.12)]">
        <FileArchive className="h-3.5 w-3.5" aria-hidden="true" />
        ZIP
      </span>
    </a>
  );
}

/* ═════════════ الشاشة ═════════════ */
export function DownloadsScreen() {
  const { data, loading, reload } = useApi<LiveResponse>("/api/github/apps");
  const [filter, setFilter] = useState<Filter>("all");
  const { t } = useI18n();
  const dl = t.downloads;
  const { APPS, SOURCE_REPOS } = useContent();

  const liveByRepo = useMemo(() => {
    const map: Record<string, LiveApp> = {};
    if (data?.apps) for (const l of data.apps) map[l.repo] = l;
    return map;
  }, [data]);

  const totalDownloads = useMemo(() => {
    if (data?.apps?.length) return data.apps.reduce((s, a) => s + a.totalDownloads, 0);
    return 0;
  }, [data]);

  const filtered = useMemo(
    () => (filter === "all" ? APPS : APPS.filter((a) => a.category === filter)),
    [filter, APPS]
  );

  const latestTag = useMemo(() => {
    const withTags = (data?.apps ?? []).filter((a) => a.ok && a.tag);
    if (!withTags.length) return APPS[0]?.version ?? "—";
    return withTags[0].tag as string;
  }, [data, APPS]);

  const stats = [
    { label: dl.statApps, value: String(APPS.length), suffix: "" },
    { label: dl.statDownloads, value: totalDownloads > 0 ? totalDownloads.toLocaleString("en") : "—", suffix: "" },
    { label: dl.statRepos, value: String(SOURCE_REPOS.length + APPS.length), suffix: "+" },
    { label: dl.statLatest, value: latestTag, suffix: "", ltr: true },
  ];

  return (
    <>
      <PageHero
        badge="DOWNLOADS • GITHUB RELEASES"
        title={dl.title}
        highlight={dl.highlight}
        subtitle={dl.subtitle}
      />

      {/* شريط الإحصائيات */}
      <section className="relative px-4 pt-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 70}>
              <div className="card-glow rounded-2xl p-5 text-center">
                <p className="font-heading-cyber text-2xl font-extrabold text-cyber" dir={s.ltr ? "ltr" : undefined}>
                  {loading && s.value === "—" ? "…" : s.value}
                </p>
                <p className="mt-1 text-[11px] text-mute">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* الفلاتر */}
      <section className="relative px-4 pt-10" aria-label={dl.filterSectionAria}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={dl.filterAria}>
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-bold transition-all duration-300 ${
                  filter === f
                    ? "border border-[rgba(0,240,255,0.5)] bg-[rgba(0,240,255,0.1)] text-cyber shadow-[0_0_14px_rgba(0,240,255,0.25)]"
                    : "border border-border-strong bg-elev-2/50 text-sec hover:border-cyber/40 hover:text-cyber"
                }`}
              >
                {dl.filters[f]}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              reload();
              toast({ title: dl.refreshingTitle, description: dl.refreshingDesc });
            }}
            className="flex h-9 items-center gap-1.5 rounded-full border border-border-strong bg-elev-2/50 px-4 text-xs font-bold text-sec transition hover:border-cyber/40 hover:text-cyber"
            aria-label={dl.refreshAria}
          >
            <RefreshCw aria-hidden="true" className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            {dl.refresh}
          </button>
        </div>
      </section>

      {/* شبكة التطبيقات */}
      <section className="relative px-4 py-10" aria-label={dl.appsAria}>
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
          {filtered.map((app, i) => (
            <Reveal key={app.id} delay={(i % 2) * 90}>
              {loading ? (
                <div className="card-glow flex h-full flex-col gap-4 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-full rounded-full" />
                </div>
              ) : (
                <AppCard app={app} live={liveByRepo[app.repo]} />
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* تنبيه أمني */}
      <section className="relative px-4 pb-4" aria-label={dl.secAria}>
        <Reveal className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start gap-3 rounded-2xl border border-[rgba(0,255,136,0.3)] bg-[rgba(0,255,136,0.04)] p-5 sm:flex-row sm:items-center">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[rgba(0,255,136,0.08)] text-[#00ff88]">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <h3 className="font-heading-cyber text-sm font-bold text-main">{dl.secTitle}</h3>
              <p className="mt-1 text-xs leading-6 text-sec">{dl.secBody}</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* مستودعات المصدر */}
      <section className="relative px-4 pb-20 pt-8" aria-label={dl.sourceSectionAria}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(0,240,255,0.07)] text-cyber">
                <FolderGit2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-heading-cyber text-lg font-bold text-main">{dl.sourceTitle}</h2>
                <p className="text-xs text-mute">{dl.sourceDesc}</p>
              </div>
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            {SOURCE_REPOS.map((repo, i) => (
              <Reveal key={repo.id} delay={(i % 2) * 80}>
                <SourceRepoCard repo={repo} />
              </Reveal>
            ))}
            <Reveal delay={160}>
              <a
                href="https://github.com/CTO-DRS?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="card-glow group flex items-center gap-4 rounded-2xl p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[rgba(201,209,217,0.08)] text-[#c9d1d9] transition-all duration-300 group-hover:shadow-[0_0_18px_rgba(201,209,217,0.25)]">
                  <Github className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading-cyber text-sm font-bold text-main transition group-hover:text-cyber">
                    {dl.allReposTitle}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-sec">{dl.allReposDesc}</p>
                </div>
                <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0 text-mute transition group-hover:-translate-x-1 group-hover:text-cyber" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
