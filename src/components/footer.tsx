"use client";

import { useState } from "react";
import { Terminal, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAppRouter, routeHref, ACADEMY_ROUTE, type AppRoute } from "@/lib/router";
import { SocialRow } from "@/components/social-channels";
import { BRAND, ACADEMY_URL } from "@/lib/social";
import { STATIC_MODE } from "@/lib/static-mode";
import { useI18n } from "@/i18n";
import { Honeypot } from "@/components/honeypot";
import { sendContactEmail, mailtoHref } from "@/lib/contact-email";
import { A11yControls, LanguageToggle } from "@/components/a11y-controls";

/* التسميات من القاموس: t.footer.links[route.name] */
const QUICK: { route: AppRoute }[] = [
  { route: { name: "home" } },
  { route: { name: "services" } },
  { route: { name: "projects" } },
  { route: ACADEMY_ROUTE },
  { route: { name: "store" } },
  { route: { name: "blog" } },
  { route: { name: "downloads" } },
  { route: { name: "events" } },
];

const MORE_LINKS: { route: AppRoute }[] = [
  { route: { name: "booking" } },
  { route: { name: "testimonials" } },
  { route: { name: "faq" } },
  { route: { name: "contact" } },
  { route: { name: "account" } },
  { route: { name: "cart" } },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [hp, setHp] = useState("");
  const [nlFail, setNlFail] = useState(false);
  const { navigate } = useAppRouter();
  const { t, lang } = useI18n();
  const f = t.footer;
  const label = (r: AppRoute) => (r.slug && f.links[r.slug]) || f.links[r.name] || r.name;

  const go = (r: AppRoute) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(r);
  };

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast({ title: f.invalidTitle, description: f.invalidDesc });
      return;
    }
    setLoading(true);
    try {
      /* الاشتراك يُرسَل بالبريد إلى info@ ويصل المشترك تأكيد (عبر نقطة الأكاديمية) */
      setNlFail(false);
      const mail = await sendContactEmail({ kind: "newsletter", email: email.trim(), lang: lang === "en" ? "en" : "ar", website: hp });
      if (!STATIC_MODE) {
        await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }).catch(() => null);
      }
      if (mail.ok) {
        toast({ title: f.okTitle, description: f.okDesc });
        setEmail("");
        setHp("");
      } else {
        setNlFail(true);
        toast({ title: f.failTitle, description: `${f.mailFailDesc} ${BRAND.email}`, variant: "destructive" });
      }
    } catch {
      toast({ title: t.common.connErrTitle, description: t.common.connErrDesc });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="mt-auto border-t border-border-soft bg-elev/50 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* brand */}
          <div>
            <a
              href={routeHref({ name: "home" })}
              onClick={go({ name: "home" })}
              className="flex items-center gap-2"
              aria-label={`CTO-DRS — ${t.common.home}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00f0ff] via-[#7c3aed] to-[#ff2a6d] text-[#030303]" aria-hidden="true">
                <Terminal className="h-4.5 w-4.5" strokeWidth={2.5} />
              </span>
              <span className="font-heading-cyber whitespace-nowrap text-lg font-extrabold tracking-wider" dir="ltr">
                <span className="text-gradient-cyan">CTO</span>
                <span className="text-main">-</span>
                <span className="text-gradient-pink">DRS</span>
              </span>
            </a>
            <p className="mt-4 text-xs leading-6 text-sec">
              {f.tagline}
            </p>
            <p className="font-mono-cyber mt-3 text-[10px] tracking-[0.2em] text-mute" dir="ltr">
              {BRAND.websiteLabel}
            </p>
            <SocialRow size="sm" className="mt-5" />
            <div className="mt-5">
              <h2 className="font-heading-cyber mb-2 text-xs font-bold text-main">{f.contactTitle}</h2>
              <ul className="space-y-1.5">
                {[
                  { label: f.emailGeneral, email: BRAND.email },
                  { label: f.emailSupport, email: BRAND.supportEmail },
                  { label: f.emailAcademy, email: BRAND.academyEmail },
                ].map((e) => (
                  <li key={e.email} className="text-[11px] text-mute">
                    {e.label}:{" "}
                    <a href={`mailto:${e.email}`} dir="ltr" className="text-sec transition hover:text-cyber">
                      {e.email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* quick links */}
          <nav aria-label={f.quickLinks}>
            <h2 className="font-heading-cyber mb-4 text-sm font-bold text-main">{f.quickLinks}</h2>
            <ul className="space-y-2.5">
              {QUICK.map((l) => (
                <li key={`${l.route.name}-${l.route.slug ?? ""}`}>
                  <a
                    href={routeHref(l.route)}
                    onClick={go(l.route)}
                    className="text-xs text-sec transition hover:ps-1 hover:text-cyber"
                  >
                    {label(l.route)}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={ACADEMY_URL}
                  target="_blank"
                  rel="noopener"
                  className="text-xs text-sec transition hover:ps-1 hover:text-cyber"
                >
                  {t.academy.enter} ↗
                  <span className="sr-only"> {t.nav.newTab}</span>
                </a>
              </li>
            </ul>
          </nav>

          {/* services + more */}
          <nav aria-label={f.servicesMore}>
            <h2 className="font-heading-cyber mb-4 text-sm font-bold text-main">{f.servicesMore}</h2>
            <ul className="space-y-2.5">
              {f.serviceLinks.map((s) => (
                <li key={s}>
                  <a
                    href={routeHref({ name: "services" })}
                    onClick={go({ name: "services" })}
                    className="text-xs text-sec transition hover:ps-1 hover:text-cyber"
                  >
                    {s}
                  </a>
                </li>
              ))}
              {MORE_LINKS.slice(0, 2).map((l) => (
                <li key={l.route.name}>
                  <a
                    href={routeHref(l.route)}
                    onClick={go(l.route)}
                    className="text-xs text-sec transition hover:ps-1 hover:text-cyber"
                  >
                    {label(l.route)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* newsletter */}
          <div>
            <h2 className="font-heading-cyber mb-4 text-sm font-bold text-main">{f.newsletter}</h2>
            <p className="text-xs leading-6 text-sec">{f.newsletterDesc}</p>
            <form onSubmit={subscribe} className="relative mt-4 flex gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                {f.yourEmail}
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={f.yourEmail}
                autoComplete="email"
                required
                className="h-10 min-w-0 flex-1 rounded-full border border-border-strong bg-elev-2/60 px-4 text-xs text-main outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)] focus:shadow-[0_0_16px_rgba(0,240,255,0.15)]"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-gradient-pink flex h-10 shrink-0 items-center gap-1.5 rounded-full px-5 text-xs disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />}
                {f.subscribe}
              </button>
              <Honeypot value={hp} onChange={setHp} />
            </form>
            {nlFail && (
              <p role="alert" className="mt-2 text-[11px] leading-5 text-sec">
                {f.mailFailDesc}{" "}
                <a href={mailtoHref("newsletter", f.mailSubject, email)} dir="ltr" className="font-bold text-cyber underline decoration-dotted">
                  {BRAND.email}
                </a>
              </p>
            )}
            <p className="font-mono-cyber mt-3 text-[10px] text-mute" dir="ltr">
              NO SPAM • UNSUBSCRIBE ANYTIME
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {MORE_LINKS.slice(2).map((l) => (
                <a
                  key={l.route.name}
                  href={routeHref(l.route)}
                  onClick={go(l.route)}
                  className="text-[11px] text-mute transition hover:text-cyber"
                >
                  {label(l.route)}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border-soft pt-6 sm:flex-row">
          <p className="font-mono-cyber text-[11px] text-mute" dir="ltr">
            © {new Date().getFullYear()} CTO-DRS — ALL SYSTEMS OPERATIONAL
          </p>
          <div className="flex items-center gap-4">
            <a
              href={routeHref({ name: "privacy" })}
              onClick={go({ name: "privacy" })}
              className="text-[11px] text-mute transition hover:text-cyber"
            >
              {f.privacy}
            </a>
            <span className="h-1 w-1 rounded-full bg-border-strong" aria-hidden="true" />
            <a
              href={routeHref({ name: "terms" })}
              onClick={go({ name: "terms" })}
              className="text-[11px] text-mute transition hover:text-cyber"
            >
              {f.terms}
            </a>
          </div>
          <p className="flex items-center gap-1.5 text-[11px] text-mute">
            <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-[#00ff88]" aria-hidden="true" />
            {f.builtWith}
          </p>
        </div>

        {/* أدوات الوصولية واللغة */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-border-soft pt-5 sm:justify-between">
          <A11yControls />
          <LanguageToggle className="border border-border-strong" />
        </div>
      </div>
    </footer>
  );
}
