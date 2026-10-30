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
  CalendarCheck,
  Menu,
  X,
  Terminal,
  ShoppingCart,
  GraduationCap,
  Store,
  HelpCircle,
  MessageSquareQuote,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppRouter, routeHref, type AppRoute } from "@/lib/router";
import { useAppStore, cartCount } from "@/lib/store";

const LINKS: { route: AppRoute; label: string; icon: typeof Home }[] = [
  { route: { name: "home" }, label: "الرئيسية", icon: Home },
  { route: { name: "services" }, label: "الخدمات", icon: Wrench },
  { route: { name: "projects" }, label: "المشاريع", icon: Package },
  { route: { name: "courses" }, label: "الدورات", icon: GraduationCap },
  { route: { name: "store" }, label: "المتجر", icon: Store },
  { route: { name: "blog" }, label: "المدونة", icon: BookOpen },
];

const MORE: { route: AppRoute; label: string; icon: typeof Home }[] = [
  { route: { name: "booking" }, label: "احجز استشارة", icon: CalendarCheck },
  { route: { name: "testimonials" }, label: "آراء العملاء", icon: MessageSquareQuote },
  { route: { name: "faq" }, label: "الأسئلة الشائعة", icon: HelpCircle },
  { route: { name: "contact" }, label: "تواصل معي", icon: Mail },
];

const MOBILE_ALL = [...LINKS, ...MORE];

export function Navbar({ onOpenSearch }: { onOpenSearch: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { route, navigate } = useAppRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { user, cart } = useAppStore();
  const count = cartCount(cart);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (r: AppRoute) => navigate(r);
  const isActive = (r: AppRoute) => route.name === r.name;

  return (
    <header className="fixed inset-x-0 top-4 z-[100] flex justify-center px-3 sm:top-5">
      <nav
        className={`glass-strong flex w-full max-w-6xl items-center justify-between gap-2 rounded-2xl px-3 py-2 transition-all duration-500 sm:rounded-full sm:px-4 ${
          scrolled ? "shadow-[0_10px_40px_rgba(0,0,0,0.35)]" : ""
        }`}
        aria-label="التنقل الرئيسي"
      >
        {/* brand */}
        <a
          href={routeHref({ name: "home" })}
          onClick={(e) => {
            e.preventDefault();
            go({ name: "home" });
          }}
          className="group flex items-center gap-2 pl-1"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00f0ff] via-[#7c3aed] to-[#ff2a6d] text-[#030303] shadow-[0_0_18px_rgba(0,240,255,0.35)] transition-transform duration-300 group-hover:rotate-6">
            <Terminal className="h-4.5 w-4.5" strokeWidth={2.5} />
          </span>
          <span className="font-heading-cyber hidden text-lg font-extrabold tracking-wider sm:block">
            <span className="text-gradient-cyan">CTO</span>
            <span className="text-main">.</span>
            <span className="text-gradient-pink">DRS</span>
          </span>
        </a>

        {/* desktop links */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map((l) => (
            <li key={l.route.name}>
              <a
                href={routeHref(l.route)}
                onClick={(e) => {
                  e.preventDefault();
                  go(l.route);
                }}
                className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium transition-all duration-300 ${
                  isActive(l.route)
                    ? "bg-[rgba(0,240,255,0.10)] text-[#00f0ff] shadow-[inset_0_0_12px_rgba(0,240,255,0.08)]"
                    : "text-sec hover:bg-[rgba(0,240,255,0.06)] hover:text-main"
                }`}
              >
                <l.icon className="h-3.5 w-3.5" />
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`flex items-center gap-1 rounded-full px-3 py-2 text-[13px] font-medium outline-none transition-all duration-300 data-[state=open]:bg-[rgba(0,240,255,0.10)] data-[state=open]:text-[#00f0ff] ${
                  MORE.some((m) => m.route.name === route.name)
                    ? "bg-[rgba(0,240,255,0.10)] text-[#00f0ff]"
                    : "text-sec hover:bg-[rgba(0,240,255,0.06)] hover:text-main"
                }`}
                aria-label="المزيد من الصفحات"
              >
                المزيد
                <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-strong border-border-strong rounded-2xl border p-2">
                {MORE.map((m) => (
                  <DropdownMenuItem
                    key={m.route.name}
                    onClick={() => go(m.route)}
                    className="cursor-pointer gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-sec transition hover:bg-[rgba(0,240,255,0.08)] hover:text-cyber focus:bg-[rgba(0,240,255,0.08)] focus:text-cyber"
                  >
                    <m.icon className="h-3.5 w-3.5" />
                    {m.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>

        {/* actions */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSearch}
            className="hidden h-9 items-center gap-2 rounded-full border border-border-strong bg-elev-2/60 px-3 text-xs text-mute transition hover:border-[rgba(0,240,255,0.3)] hover:text-cyber md:flex"
            aria-label="بحث سريع"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="font-mono-cyber">Ctrl K</span>
          </Button>

          {/* cart */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => go({ name: "cart" })}
            className="relative h-9 w-9 rounded-full text-sec hover:text-cyber"
            aria-label={`سلة المشتريات${count ? ` (${count})` : ""}`}
          >
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="font-mono-cyber absolute -top-1 -left-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff2a6d] px-1 text-[9px] font-bold text-white">
                {count}
              </span>
            )}
          </Button>

          {/* account */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => go({ name: user ? "account" : "login" })}
            className="hidden h-9 w-9 rounded-full text-sec hover:text-cyber sm:flex"
            aria-label={user ? "حسابي" : "تسجيل الدخول"}
          >
            <User className="h-4 w-4" />
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
            href={routeHref({ name: "booking" })}
            onClick={(e) => {
              e.preventDefault();
              go({ name: "booking" });
            }}
            className="btn-gradient hidden h-9 items-center gap-1.5 rounded-full px-4 text-xs lg:flex"
          >
            <CalendarCheck className="h-3.5 w-3.5" />
            احجز استشارة
          </a>

          {user?.role === "admin" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => go({ name: "dashboard" })}
              className="hidden h-9 w-9 rounded-full text-sec hover:text-[#ffd700] lg:flex"
              aria-label="لوحة التحكم"
            >
              <LayoutDashboard className="h-4 w-4" />
            </Button>
          )}

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
        className={`glass-strong fixed inset-y-0 right-0 z-[101] flex w-72 flex-col gap-1 overflow-y-auto p-5 pt-20 transition-transform duration-400 lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {MOBILE_ALL.map((l) => (
          <a
            key={l.route.name}
            href={routeHref(l.route)}
            onClick={(e) => {
              e.preventDefault();
              go(l.route);
              setMobileOpen(false);
            }}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              isActive(l.route)
                ? "bg-[rgba(0,240,255,0.10)] text-cyber"
                : "text-sec hover:bg-[rgba(0,240,255,0.08)] hover:text-cyber"
            }`}
          >
            <l.icon className="h-4 w-4" />
            {l.label}
          </a>
        ))}
        <div className="mt-4 flex items-center gap-2 border-t border-border-soft pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setMobileOpen(false);
              onOpenSearch();
            }}
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
        <a
          href={routeHref({ name: user ? "account" : "login" })}
          onClick={(e) => {
            e.preventDefault();
            go({ name: user ? "account" : "login" });
            setMobileOpen(false);
          }}
          className="btn-gradient mt-2 flex h-10 items-center justify-center gap-2 rounded-full text-xs"
        >
          <User className="h-3.5 w-3.5" />
          {user ? "حسابي" : "تسجيل الدخول"}
        </a>
      </div>
    </header>
  );
}
