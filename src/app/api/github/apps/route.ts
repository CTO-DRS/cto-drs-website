import { NextResponse } from "next/server";
import { APPS, GITHUB_OWNER, SOURCE_REPOS } from "@/lib/apps";

/* ─────────────────────────────────────────────
   GET /api/github/apps
   يجلب أحدث إصدار حقيقي لكل تطبيق من GitHub API
   (Releases + Assets + عدّاد التنزيلات) مع تخزين
   مؤقت في الذاكرة لمدة 10 دقائق لتجنب تجاوز
   حدود المعدل.
   ───────────────────────────────────────────── */

interface GhAsset {
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
}

interface GhRelease {
  tag_name?: string;
  name?: string;
  published_at?: string;
  html_url?: string;
  assets?: GhAsset[];
  message?: string;
}

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

const CACHE_TTL_MS = 10 * 60 * 1000;
let cache: { at: number; data: { apps: LiveApp[]; sourceRepos: LiveApp[] } } | null = null;

function humanSizeMb(bytes: number): number {
  return Math.round((bytes / (1024 * 1024)) * 10) / 10;
}

async function fetchLatestRelease(repo: string): Promise<LiveApp> {
  const base: LiveApp = {
    repo,
    ok: false,
    tag: null,
    publishedAt: null,
    releaseUrl: `https://github.com/${GITHUB_OWNER}/${repo}/releases`,
    totalDownloads: 0,
    assets: [],
    sourceZip: `https://github.com/${GITHUB_OWNER}/${repo}/archive/refs/heads/main.zip`,
  };
  try {
    const token = process.env.GITHUB_TOKEN; // اختياري — يرفع الحد إلى 5000 طلب/ساعة
    const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${repo}/releases/latest`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "cto-drs-website",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return base;
    const rel = (await res.json()) as GhRelease;
    if (!rel.tag_name) return base;
    const assets = (rel.assets ?? []).map((a) => ({
      name: a.name,
      sizeMb: humanSizeMb(a.size),
      downloads: a.download_count ?? 0,
      url: a.browser_download_url,
    }));
    return {
      ...base,
      ok: true,
      tag: rel.tag_name,
      publishedAt: rel.published_at ?? null,
      releaseUrl: rel.html_url ?? base.releaseUrl,
      totalDownloads: assets.reduce((s, a) => s + a.downloads, 0),
      assets,
    };
  } catch {
    return base;
  }
}

async function fetchRepoMeta(repo: string): Promise<LiveApp> {
  const base = await fetchLatestRelease(repo);
  return base; // نفس الشكل — المستودعات بلا إصدار سترجع ok:false مع مصدر ZIP
}

export async function GET() {
  try {
    if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
      return NextResponse.json({ cached: true, fetchedAt: new Date(cache.at).toISOString(), ...cache.data });
    }

    const repos = [...APPS.map((a) => a.repo), ...SOURCE_REPOS.map((s) => s.repo)];
    const uniqueRepos = Array.from(new Set(repos));

    const results = await Promise.all(uniqueRepos.map((r) => fetchRepoMeta(r)));
    const appRepos = new Set(APPS.map((a) => a.repo));

    const data = {
      apps: results.filter((r) => appRepos.has(r.repo)),
      sourceRepos: results.filter((r) => !appRepos.has(r.repo)),
    };
    cache = { at: Date.now(), data };

    return NextResponse.json({
      cached: false,
      fetchedAt: new Date().toISOString(),
      ...data,
    });
  } catch (err) {
    console.error("[api/github/apps] failed:", err);
    return NextResponse.json({ error: "تعذر جلب بيانات الإصدارات من GitHub" }, { status: 502 });
  }
}
