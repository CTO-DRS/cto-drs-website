import { Terminal, ArrowDownToLine, ShieldCheck } from "lucide-react";
import { APPS, directReleaseUrl, sourceZipUrl } from "@/lib/apps";
import { FAQS } from "@/lib/faq-data";
import { SERVICES } from "@/lib/data";
import { BRAND, SOCIALS } from "@/lib/social";

/**
 * دليل الموقع المُصدَّر في HTML الثابت — طبقة محتوى كاملة
 * تقرؤها محركات البحث ونماذج الذكاء الاصطناعي دون تنفيذ JavaScript
 * (الواجهة التفاعلية مبنية عميلياً، وهذا القسم يضمن فهرسة الحقائق كاملة)
 * مكوّن بلا حالات — يُعرض مسبقاً في التصدير الثابت.
 */
export function SeoContent() {
  return (
    <section
      id="site-directory"
      lang="ar"
      dir="rtl"
      aria-label="دليل موقع CTO-DRS الكامل"
      className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-14"
    >
      <details className="card-glow group overflow-hidden rounded-2xl">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 sm:px-6">
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00f0ff] via-[#7c3aed] to-[#ff2a6d]">
              <Terminal className="h-5 w-5 text-[#030303]" strokeWidth={2.5} aria-hidden="true" />
            </span>
            <span>
              <span className="font-heading-cyber block text-base font-extrabold text-main sm:text-lg">
                دليل الموقع الكامل
              </span>
              <span className="block text-xs text-sec">
                نبذة، خدمات، تطبيقات، أسئلة شائعة وطرق التواصل — نص كامل قابل للفهرسة
              </span>
            </span>
          </span>
          <span className="font-mono-cyber shrink-0 text-[10px] tracking-widest text-mute transition-transform group-open:rotate-180" aria-hidden="true">
            ▼
          </span>
        </summary>

        <div className="space-y-8 border-t border-[rgba(0,240,255,0.12)] px-5 py-6 sm:px-6">
          {/* ── نبذة ── */}
          <article>
            <h2 className="font-heading-cyber text-lg font-extrabold text-main">نبذة عن CTO-DRS</h2>
            <p className="mt-2 text-sm leading-7 text-sec">
              CTO-DRS مطور تقني وجهة تطوير مفتوحة المصدر تعمل في مجالات هندسة البرمجيات والأمن
              السيبراني وتطوير تطبيقات أندرويد الأصلية والابتكار التقني. تبنّى فلسفة «تقنية مفيدة
              وآمنة وقابلة للصيانة ومتاحة للجميع»: برمجيات offline-first تحترم الخصوصية، كود
              مفتوح المصدر قابل للتدقيق، وتجارب رقمية آمنة بمعايير إنتاج حقيقية. الموقع الرسمي{" "}
              <a href="https://cto-drs.com/" className="text-cyber underline decoration-dotted">
                cto-drs.com
              </a>{" "}
              وهو دليل التطبيقات والخدمات الرسمي، والمستودعات منشورة على{" "}
              <a href="https://github.com/CTO-DRS" className="text-cyber underline decoration-dotted" rel="noopener">
                GitHub
              </a>
              .
            </p>
          </article>

          {/* ── الخدمات ── */}
          <article>
            <h2 className="font-heading-cyber text-lg font-extrabold text-main">الخدمات</h2>
            <ul className="mt-3 grid gap-2 text-sm text-sec sm:grid-cols-2">
              {SERVICES.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00f0ff]" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-sec">
              جميع الخدمات تبدأ باستشارة مجانية، بمنهجية شفافة (عرض فني ومالي خلال 48 ساعة)،
              وضمان 30 يوماً بعد التسليم. التفاصيل والأسعار:{" "}
              <a href="#/services" className="text-cyber underline decoration-dotted">صفحة الخدمات</a>.
            </p>
          </article>

          {/* ── التطبيقات ── */}
          <article>
            <h2 className="font-heading-cyber text-lg font-extrabold text-main">
              التطبيقات مفتوحة المصدر (تنزيل مباشر)
            </h2>
            <p className="mt-2 text-sm text-sec">
              كل التطبيقات مجانية ومفتوحة المصدر وتُنزَّل مباشرة من إصدارات GitHub الرسمية.
            </p>
            <ul className="mt-4 space-y-3">
              {APPS.map((app) => (
                <li
                  key={app.id}
                  className="rounded-xl border border-[rgba(0,240,255,0.12)] bg-[rgba(0,240,255,0.03)] p-4"
                >
                  <h3 className="font-heading-cyber text-sm font-bold text-main">
                    {app.titleEn}
                    <span className="font-mono-cyber mr-2 text-[10px] tracking-wider text-mute" dir="ltr">
                      {app.version} • {app.platforms.join(" / ")}
                    </span>
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-6 text-sec">{app.description}</p>
                  <a
                    href={app.directFile ? directReleaseUrl(app.repo, app.directFile) : sourceZipUrl(app.repo)}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-cyber hover:underline"
                    rel="noopener"
                  >
                    <ArrowDownToLine className="h-3.5 w-3.5" aria-hidden="true" />
                    تنزيل مباشر ({app.fileType}) — {app.repo}
                  </a>
                </li>
              ))}
            </ul>
          </article>

          {/* ── الأسئلة الشائعة ── */}
          <article>
            <h2 className="font-heading-cyber text-lg font-extrabold text-main">الأسئلة الشائعة</h2>
            <div className="mt-3 space-y-4">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <h3 className="text-sm font-bold text-main">{f.q}</h3>
                  <p className="mt-1 text-[13px] leading-6 text-sec">{f.a}</p>
                </div>
              ))}
            </div>
          </article>

          {/* ── التواصل ── */}
          <article>
            <h2 className="font-heading-cyber text-lg font-extrabold text-main">تواصل مع CTO-DRS</h2>
            <p className="mt-2 text-sm text-sec">
              البريد العام:{" "}
              <a href={`mailto:${BRAND.email}`} className="text-cyber underline decoration-dotted">
                {BRAND.email}
              </a>
              {" "}· الدعم الفني:{" "}
              <a href={`mailto:${BRAND.supportEmail}`} className="text-cyber underline decoration-dotted">
                {BRAND.supportEmail}
              </a>
              {" "}· الأكاديمية:{" "}
              <a href={`mailto:${BRAND.academyEmail}`} className="text-cyber underline decoration-dotted">
                {BRAND.academyEmail}
              </a>{" "}
              — أو عبر أي قناة أدناه. للحالات العاجلة استخدم واتساب أو تيليجرام.
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {SOCIALS.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="inline-block rounded-full border border-[rgba(0,240,255,0.2)] px-3 py-1.5 text-xs font-bold text-sec transition-colors hover:text-cyber"
                  >
                    {s.label} — {s.handle}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-sec">
              أكاديمية الرشيد — مسارات في الأمن السيبراني والبرمجة والاختراق الأخلاقي:{" "}
              <a href="https://academy.cto-drs.com" target="_blank" rel="noopener" className="text-cyber underline decoration-dotted">
                academy.cto-drs.com
              </a>
            </p>
            <p className="mt-4 flex items-center gap-1.5 text-[11px] text-mute">
              <ShieldCheck className="h-3.5 w-3.5 text-[#00ff88]" aria-hidden="true" />
              جميع بيانات التواصل تُعالج بسرية تامة، وتوقّع اتفاقيات NDA عند الطلب.
            </p>
          </article>
        </div>
      </details>
    </section>
  );
}
