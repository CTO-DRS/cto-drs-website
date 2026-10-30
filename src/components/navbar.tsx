"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Home,
  User,
  Wrench,
  Package,
  BookOpen,
  Mail,
  Search,
  Moon,
  SunMedium,
  Download,
  Menu,
  X,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "#home", label: "الرئيسية", icon: Home },
  { href: "#about", label: "نبذة عني", icon: User },
  { href: "#services", label: "الخدمات", icon: Wrench },
  { href: "#projects", label: "المشاريع", icon: Package },
  { href: "#blog", label: "المدونة", icon: BookOpen },
  { href: "#contact", label: "التواصل", icon: Mail },
];

export function Navbar({ onOpenSearch }: { onOpenSearch: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      // active section tracking
      const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean);
      let current = "#home";
      for (const s of sections) {
        if (s instanceof HTMLElement && s.getBoundingClientRect().top <= 140) current = `#${s.id}`;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-[100] flex justify-center px-3 sm:top-5">
      <nav
        className={`glass-strong flex w-full max-w-6xl items-center justify-between gap-2 rounded-2xl px-3 py-2 transition-all duration-500 sm:rounded-full sm:px-4 ${
          scrolled ? "shadow-[0_10px_40px_rgba(0,0,0,0.35)]" : ""
        }`}
        aria-label="التنقل الرئيسي"
      >
        {/* brand */}
        <a href="#home" className="group flex items-center gap-2 pl-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00f0ff] via-[#7c3aed] to-[#ff2a6d] text-[#030303] shadow-[0_0_18px_rgba(0,240,255,0.35)] transition-transform duration-300 group-hover:rotate-6">
            <Terminal className="h-4.5 w-4.5" strokeWidth={2.5} />
          </span>
          <span className="font-heading-cyber text-lg font-extrabold tracking-wider">
            <span className="text-gradient-cyan">CTO</span>
            <span className="text-main">.</span>
            <span className="text-gradient-pink">DRS</span>
          </span>
        </a>

        {/* desktop links */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium transition-all duration-300 ${
                  active === l.href
                    ? "bg-[rgba(0,240,255,0.10)] text-[#00f0ff] shadow-[inset_0_0_12px_rgba(0,240,255,0.08)]"
                    : "text-sec hover:bg-[rgba(0,240,255,0.06)] hover:text-main"
                }`}
              >
                <l.icon className="h-3.5 w-3.5" />
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* actions */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSearch}
            className="hidden h-9 items-center gap-2 rounded-full border border-border-soft bg-elev-2/60 px-3 text-xs text-mute transition hover:border-[rgba(0,240,255,0.3)] hover:text-cyber md:flex"
            aria-label="بحث سريع"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="font-mono-cyber">Ctrl K</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="hidden h-9 w-9 rounded-full text-sec hover:text-cyber sm:flex"
            aria-label="تبديل السمة"
            suppressHydrationWarning
          >
            <SunMedium className="hidden h-4 w-4 dark:block" />
            <Moon className="h-4 w-4 dark:hidden" suppressHydrationWarning />
          </Button>

          <a
            href="#contact"
            className="btn-gradient hidden h-9 items-center gap-1.5 rounded-full px-4 text-xs lg:flex"
          >
            <Download className="h-3.5 w-3.5" />
            تواصل معي
          </a>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-main lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="القائمة"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* mobile menu */}
      <div
        className={`fixed inset-0 top-0 z-[99] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={`fixed inset-y-0 right-0 z-[101] flex w-72 flex-col gap-1 p-5 pt-20 transition-transform duration-400 glass-strong lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-sec transition hover:bg-[rgba(0,240,255,0.08)] hover:text-cyber"
          >
            <l.icon className="h-4 w-4" />
            {l.label}
          </a>
        ))}
        <div className="mt-4 flex items-center gap-2 border-t border-border-soft pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSearch}
            className="flex-1 rounded-full text-xs"
          >
            <Search className="h-3.5 w-3.5" /> بحث سريع
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="تبديل السمة"
          >
            <SunMedium className="hidden h-4 w-4 dark:block" suppressHydrationWarning />
            <Moon className="h-4 w-4 dark:hidden" suppressHydrationWarning />
          </Button>
        </div>
      </div>
    </header>
  );
}
