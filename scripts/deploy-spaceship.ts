#!/usr/bin/env bun
/* ═══════════════════════════════════════════════════════════
   deploy-spaceship.ts — أداة نشر موقع CTO-DRS على استضافة
   Spaceship (Hyperlift) وضبط DNS الدومين.

   المصادقة (من .env أو متغيرات البيئة):
     SPACESHIP_API_KEY=<مفتاح قصير من API Manager>
     SPACESHIP_API_SECRET=<سري طويل من API Manager>

   الأوامر:
     bun scripts/deploy-spaceship.ts domains          — قائمة الدومينات
     bun scripts/deploy-spaceship.ts dns <domain>     — سجلات DNS الحالية
     bun scripts/deploy-spaceship.ts apps             — تطبيقات Hyperlift
     bun scripts/deploy-spaceship.ts app <id>         — تفاصيل تطبيق
     bun scripts/deploy-spaceship.ts env <id>         — متغيرات البيئة
     bun scripts/deploy-spaceship.ts env-set <id> K=V — تعيين متغيرات
     bun scripts/deploy-spaceship.ts build <id>       — بناء + متابعة السجلات
     bun scripts/deploy-spaceship.ts bind <domain> <appDomain> — ربط دومين
     bun scripts/deploy-spaceship.ts deploy           — النشر الذكي الكامل
   ═══════════════════════════════════════════════════════════ */

const API = "https://spaceship.dev/api/v1";

const KEY = process.env.SPACESHIP_API_KEY || "";
const SECRET = process.env.SPACESHIP_API_SECRET || "";

const APP_NAME_HINTS = ["cto-drs-website", "cto-drs", "website"];
const REQUIRED_ENV: Record<string, string> = {
  NODE_ENV: "production",
  DATABASE_URL: "file:/app/db/custom.db",
  ADMIN_EMAIL: "contact@cto-drs.com",
};

interface HyperliftApp {
  id: string;
  status?: string;
  buildStatus?: string;
  plan?: string;
  domain?: string;
  scale?: number;
  branch?: string;
  githubRepositoryFullName?: string;
  githubInstallationId?: number;
  dockerfilePath?: string;
  automaticBuildEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [k: string]: unknown;
}

/* ─────────── HTTP helpers ─────────── */

function headers(json = false): Record<string, string> {
  const h: Record<string, string> = {
    "X-Api-Key": KEY,
    "X-Api-Secret": SECRET,
    Accept: "application/json",
  };
  if (json) h["Content-Type"] = "application/json";
  return h;
}

async function api<T = unknown>(
  method: string,
  path: string,
  body?: unknown
): Promise<{ ok: boolean; status: number; data: T | null; error?: string }> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: headers(!!body),
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data: T | null = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!res.ok) {
    const detail =
      (data as { detail?: string } | null)?.detail ?? text.slice(0, 300);
    return { ok: false, status: res.status, data, error: detail };
  }
  return { ok: true, status: res.status, data };
}

function die(msg: string): never {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

function requireAuth(): void {
  if (!KEY || !SECRET) {
    console.error(`✗ بيانات المصادقة ناقصة!
  يتطلب Spaceship API مفتاحين معاً (من API Manager في حسابك):
    1) SPACESHIP_API_KEY    (X-Api-Key)    — قصير مثل: JdIS8QYFMZpVKupJtdc3
    2) SPACESHIP_API_SECRET (X-Api-Secret) — طويل 64 حرفاً
  أضفهما في ملف .env ثم أعد المحاولة.`);
    process.exit(1);
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ─────────── Commands ─────────── */

async function cmdDomains(): Promise<void> {
  const r = await api<{ items?: { domain: string }[]; total?: number }>(
    "GET",
    "/domains?take=100&skip=0"
  );
  if (!r.ok) die(`فشل جلب الدومينات (${r.status}): ${r.error}`);
  const items = r.data?.items ?? [];
  console.log(`✓ الدومينات (${r.data?.total ?? items.length}):`);
  for (const d of items) console.log(`  • ${d.domain}`);
}

async function cmdDns(domain: string): Promise<void> {
  const r = await api("GET", `/dns/records/${domain}`);
  if (!r.ok) die(`فشل جلب سجلات DNS (${r.status}): ${r.error}`);
  console.log(`✓ سجلات DNS لـ ${domain}:`);
  console.log(JSON.stringify(r.data, null, 2));
}

async function cmdApps(): Promise<HyperliftApp[]> {
  const r = await api<{ items?: HyperliftApp[]; total?: number }>(
    "GET",
    "/hyperlift/applications?take=100&skip=0"
  );
  if (!r.ok) die(`فشل جلب التطبيقات (${r.status}): ${r.error}`);
  const items = r.data?.items ?? [];
  console.log(`✓ تطبيقات Hyperlift (${r.data?.total ?? items.length}):`);
  for (const a of items) {
    console.log(
      `  • ${a.id}\n    repo=${a.githubRepositoryFullName ?? "?"} branch=${a.branch ?? "?"} domain=${a.domain ?? "?"} buildStatus=${a.buildStatus ?? "?"}`
    );
  }
  return items;
}

async function cmdApp(id: string): Promise<HyperliftApp> {
  const r = await api<HyperliftApp>("GET", `/hyperlift/applications/${id}`);
  if (!r.ok) die(`فشل جلب التطبيق (${r.status}): ${r.error}`);
  console.log("✓ تفاصيل التطبيق:");
  console.log(JSON.stringify(r.data, null, 2));
  return r.data as HyperliftApp;
}

async function cmdEnv(id: string): Promise<void> {
  const r = await api("GET", `/hyperlift/applications/${id}/environment`);
  if (!r.ok) die(`فشل جلب متغيرات البيئة (${r.status}): ${r.error}`);
  console.log("✓ متغيرات البيئة:");
  console.log(JSON.stringify(r.data, null, 2));
}

async function cmdEnvSet(id: string, pairs: string[]): Promise<void> {
  const vars: Record<string, string> = {};
  for (const p of pairs) {
    const eq = p.indexOf("=");
    if (eq < 1) die(`صيغة غير صحيحة: ${p} (استخدم KEY=VALUE)`);
    vars[p.slice(0, eq)] = p.slice(eq + 1);
  }
  const r = await api("PUT", `/hyperlift/applications/${id}/environment`, {
    variables: vars,
  });
  if (!r.ok) die(`فشل تعيين المتغيرات (${r.status}): ${r.error}`);
  console.log(`✓ تم تعيين ${Object.keys(vars).length} متغيراً`);
}

async function streamBuildLogs(id: string): Promise<boolean> {
  let cursor: string | undefined;
  let finished = false;
  let sawLines = false;
  for (let round = 0; round < 120 && !finished; round++) {
    const q = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
    const r = await api<{ lines?: { message?: string }[]; cursor?: string; finished?: boolean }>(
      "GET",
      `/hyperlift/applications/${id}/build-logs${q}`
    );
    if (r.ok && r.data) {
      for (const l of r.data.lines ?? []) {
        sawLines = true;
        console.log(`  │ ${l.message ?? ""}`);
      }
      cursor = r.data.cursor ?? cursor;
      finished = !!r.data.finished;
    }
    if (!finished) await sleep(4000);
  }
  return sawLines;
}

async function cmdBuild(id: string): Promise<void> {
  console.log(`▶ بدء بناء التطبيق ${id} …`);
  const r = await api("POST", `/hyperlift/applications/${id}/build`);
  if (!r.ok) die(`فشل طلب البناء (${r.status}): ${r.error}`);
  console.log("✓ تم استقبال طلب البناء — متابعة السجلات:");
  await streamBuildLogs(id);
  const app = await api<HyperliftApp>("GET", `/hyperlift/applications/${id}`);
  const bs = app.data?.buildStatus;
  console.log(`${bs === "succeeded" || bs === "success" ? "✓" : "⚠"} buildStatus=${bs}`);
  if (app.data?.domain) console.log(`🔗 رابط التطبيق: https://${app.data.domain}`);
}

async function cmdBind(domain: string, appDomain: string): Promise<void> {
  // جلب السجلات الحالية ثم إضافة/تحديث CNAME
  const cur = await api<{ items?: unknown[] }>("GET", `/dns/records/${domain}`);
  const existing = cur.ok ? cur.data?.items ?? [] : [];
  console.log(`ℹ السجلات الحالية: ${existing.length} — سيتم وضع CNAME على ${domain} → ${appDomain}`);
  const body = {
    records: [
      {
        type: "CNAME",
        name: "@",
        value: appDomain,
        ttl: 3600,
      },
      {
        type: "CNAME",
        name: "www",
        value: appDomain,
        ttl: 3600,
      },
    ],
  };
  const r = await api("PUT", `/dns/records/${domain}`, body);
  if (!r.ok) die(`فشل تحديث DNS (${r.status}): ${r.error}`);
  console.log(`✓ تم ربط ${domain} (و www) → ${appDomain}`);
  console.log("ℹ انتظر انتشار DNS (عادة دقائق إلى ساعة) ثم فعّل الدومين في إعدادات التطبيق.");
}

/** سجلات GitHub Pages المعتمدة للنطاق الرئيسي + www */
async function cmdPagesDns(domain: string): Promise<void> {
  const GITHUB_PAGES_IPS = [
    "185.199.108.153",
    "185.199.109.153",
    "185.199.110.153",
    "185.199.111.153",
  ];
  const owner = "CTO-DRS";
  const body = {
    items: [
      ...GITHUB_PAGES_IPS.map((address) => ({
        type: "A",
        name: "@",
        address,
        ttl: 3600,
      })),
      {
        type: "CNAME",
        name: "www",
        cname: `${owner.toLowerCase()}.github.io`,
        ttl: 3600,
      },
    ],
  };
  const r = await api("PUT", `/dns/records/${domain}`, body);
  if (!r.ok) die(`فشل تحديث DNS (${r.status}): ${r.error}`);
  console.log(`✓ تم ربط ${domain} (+ www) بـ GitHub Pages (${GITHUB_PAGES_IPS.length}× A + CNAME)`);
}

async function findApp(apps: HyperliftApp[], hint?: string): Promise<HyperliftApp | undefined> {
  if (hint) {
    return apps.find(
      (a) =>
        a.id === hint ||
        (a.githubRepositoryFullName ?? "").toLowerCase().includes(hint.toLowerCase()) ||
        (a.domain ?? "").toLowerCase().includes(hint.toLowerCase())
    );
  }
  for (const h of APP_NAME_HINTS) {
    const hit = apps.find((a) =>
      `${a.githubRepositoryFullName ?? ""} ${a.domain ?? ""} ${a.id}`.toLowerCase().includes(h)
    );
    if (hit) return hit;
  }
  return apps.length === 1 ? apps[0] : undefined;
}

async function cmdDeploy(hint?: string): Promise<void> {
  console.log("════════ نشر CTO-DRS على Spaceship Hyperlift ════════");

  // 1) ابحث عن التطبيق
  const apps = await (async () => {
    const r = await api<{ items?: HyperliftApp[] }>(
      "GET",
      "/hyperlift/applications?take=100&skip=0"
    );
    if (!r.ok) die(`فشل جلب التطبيقات (${r.status}): ${r.error}`);
    return r.data?.items ?? [];
  })();

  const app = await findApp(apps, hint);
  if (!app) {
    console.error(`✗ لم أجد تطبيق Hyperlift مناسباً.
خطوات الإنشاء (مرة واحدة):
  1) لوحة Spaceship → Hyperlift → Create application
  2) اربط GitHub: CTO-DRS/cto-drs-website (فرع main)
  3) dockerfilePath = ./Dockerfile  و automaticBuild = Off (لنتحكم عبر API)
  4) أعد الأمر: bun scripts/deploy-spaceship.ts deploy`);
    process.exit(1);
  }
  console.log(`✓ التطبيق: ${app.id} (${app.githubRepositoryFullName ?? "?"} @ ${app.branch ?? "?"})`);

  // 2) اضبط متغيرات البيئة المطلوبة
  console.log("▶ ضبط متغيرات البيئة المطلوبة…");
  const envBody: Record<string, string> = { ...REQUIRED_ENV };
  if (process.env.SPACESHIP_DEPLOY_ADMIN_PASSWORD) {
    envBody.ADMIN_PASSWORD = process.env.SPACESHIP_DEPLOY_ADMIN_PASSWORD;
  }
  const er = await api("PUT", `/hyperlift/applications/${app.id}/environment`, {
    variables: envBody,
  });
  if (!er.ok) {
    console.warn(`⚠ تعذر ضبط المتغيرات تلقائياً (${er.status}): ${er.error}`);
    console.warn(`  عيّنها يدوياً: ${JSON.stringify(envBody)}`);
  } else {
    console.log(`✓ البيئة: ${Object.keys(envBody).join(", ")}`);
  }

  // 3) ابنِ وتابع
  console.log("▶ تشغيل البناء…");
  const br = await api("POST", `/hyperlift/applications/${app.id}/build`);
  if (!br.ok) die(`فشل بدء البناء (${br.status}): ${br.error}`);
  await streamBuildLogs(app.id);

  // 4) الحالة النهائية
  const fin = await api<HyperliftApp>("GET", `/hyperlift/applications/${app.id}`);
  const status = fin.data?.buildStatus;
  console.log(`${status === "succeeded" || status === "success" ? "✓" : "⚠"} البناء: ${status}`);
  if (fin.data?.domain) {
    console.log(`🔗 رابط التطبيق: https://${fin.data.domain}`);
    console.log(`📌 لربط دومينك: bun scripts/deploy-spaceship.ts bind <yourdomain.com> ${fin.data.domain}`);
  }
}

/* ─────────── main ─────────── */

async function main(): Promise<void> {
  const [, , cmd, ...rest] = process.argv;
  switch (cmd) {
    case "domains":
      requireAuth();
      return cmdDomains();
    case "dns":
      requireAuth();
      if (!rest[0]) die("استخدم: dns <domain>");
      return cmdDns(rest[0]);
    case "apps":
      requireAuth();
      await cmdApps();
      return;
    case "app":
      requireAuth();
      if (!rest[0]) die("استخدم: app <id>");
      await cmdApp(rest[0]);
      return;
    case "env":
      requireAuth();
      if (!rest[0]) die("استخدم: env <id>");
      return cmdEnv(rest[0]);
    case "env-set":
      requireAuth();
      if (!rest[0] || rest.length < 2) die("استخدم: env-set <id> KEY=VALUE [KEY=VALUE…]");
      return cmdEnvSet(rest[0], rest.slice(1));
    case "build":
      requireAuth();
      if (!rest[0]) die("استخدم: build <id>");
      return cmdBuild(rest[0]);
    case "bind":
      requireAuth();
      if (!rest[0] || !rest[1]) die("استخدم: bind <domain> <appDomain>");
      return cmdBind(rest[0], rest[1]);
    case "pages-dns":
      requireAuth();
      if (!rest[0]) die("استخدم: pages-dns <domain>");
      return cmdPagesDns(rest[0]);
    case "deploy":
      requireAuth();
      return cmdDeploy(rest[0]);
    default:
      console.log(`أداة نشر CTO-DRS على Spaceship
الأوامر: domains | dns <domain> | apps | app <id> | env <id> | env-set <id> K=V | build <id> | bind <domain> <appDomain> | deploy [hint]`);
  }
}

main().catch((e) => die(e instanceof Error ? e.message : String(e)));
