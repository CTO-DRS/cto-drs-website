"use client";

import { Globe, Github, Youtube, Instagram, ArrowUpLeft } from "lucide-react";
import { SOCIAL_ROW_IDS, type SocialLink } from "@/lib/social";
import { useI18n, useContent } from "@/i18n";
import { TikTokIcon, XIcon, WhatsAppIcon, TelegramIcon } from "@/components/social-icons";
import { Reveal } from "@/components/reveal";

/* خريطة الأيقونات: Lucide للمعروف + SVG مخصصة للباقي */
export const SOCIAL_ICONS: Record<string, (p: { className?: string }) => React.ReactNode> = {
  whatsapp: WhatsAppIcon,
  telegram: TelegramIcon,
  tiktok: TikTokIcon,
  x: XIcon,
  instagram: Instagram,
  youtube: Youtube,
  github: Github,
  website: Globe,
};

function SocialIcon({ id, className }: { id: string; className?: string; "aria-hidden"?: boolean }) {
  const Icon = SOCIAL_ICONS[id] ?? Globe;
  return (
    <span aria-hidden="true" className="contents">
      <Icon className={className} />
    </span>
  );
}
export { SocialIcon };

/* ── صف أيقونات مدمج (الهيرو / الملف المهني / الفوتر) ── */
export function SocialRow({
  ids = SOCIAL_ROW_IDS,
  size = "md",
  className = "",
}: {
  ids?: readonly string[];
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { t } = useI18n();
  const { SOCIALS } = useContent();
  const items = ids.map((id) => SOCIALS.find((s) => s.id === id)).filter(Boolean) as SocialLink[];
  const box = size === "sm" ? "h-9 w-9" : size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const icon = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-5.5 w-5.5" : "h-[18px] w-[18px]";

  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`} aria-label={t.socials.channelsAria}>
      {items.map((s) => (
        <li key={s.id}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${s.label} — ${s.handle}`}
            title={`${s.label} • ${s.handle}`}
            className={`group flex ${box} items-center justify-center rounded-full border border-border-soft bg-elev-2/60 text-sec transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:shadow-lg`}
            style={{ ["--soc" as string]: s.color, ["--soc-glow" as string]: s.glow }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = s.color;
              e.currentTarget.style.boxShadow = `0 0 18px ${s.glow}`;
              e.currentTarget.style.color = s.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "";
              e.currentTarget.style.boxShadow = "";
              e.currentTarget.style.color = "";
            }}
          >
            <SocialIcon id={s.id} className={icon} />
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ── شبكة قنوات كاملة (قسم التواصل) ── */
export function SocialChannels() {
  const { t } = useI18n();
  const { SOCIALS } = useContent();
  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="font-heading-cyber text-base font-bold text-main">{t.socials.followPlatforms}</h3>
        <span className="font-mono-cyber text-[10px] tracking-[0.25em] text-mute" dir="ltr">
          ALL CHANNELS • VERIFIED
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SOCIALS.map((s, i) => (
          <Reveal key={s.id} delay={i * 60}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${s.label} — ${s.handle}`}
              className="card-glow group flex h-full items-center gap-3 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = s.color;
                e.currentTarget.style.boxShadow = `0 0 24px ${s.glow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: s.glow, color: s.color }}
                aria-hidden="true"
              >
                <SocialIcon id={s.id} className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] text-mute">{s.label}</span>
                <span className="block truncate text-sm font-bold text-main" dir="ltr">
                  {s.handle}
                </span>
              </span>
              <ArrowUpLeft
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-mute transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                style={{ color: s.color }}
              />
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
