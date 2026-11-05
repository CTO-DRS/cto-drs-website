"use client";

import { useEffect, useRef, useState } from "react";
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
  Download,
  ChevronDown,
  LogIn,
  LogOut,
  UserPlus,
  School,
} from "lucide-react";
import { ACADEMY_URL } from "@/lib/social";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { useAppRouter, routeHref, type AppRoute } from "@/lib/router";
import { useAppStore, cartCount } from "@/lib/store";
import { useI18n } from "@/i18n";
import type { Dict } from "@/i18n/ar";
import { LanguageToggle } from "@/components/a11y-controls";

type NavKey = keyof Dict["nav"];

const LINKS: { route: AppRoute; label: NavKey; icon: typeof Home }[] = [
  { route: { name: "home" }, label: "home", icon: Home },
  { route: { name: "services" }, label: "services", icon: Wrench },
  { route: { name: "projects" }, label: "projects", icon: Package },
  { route: { name: "courses" }, label: "courses", icon: GraduationCap },
  { route: { name: "store" }, label: "store", icon: Store },
  { route: { name: "blog" }, label: "blog", icon: BookOpen },
];

const MORE: { route: AppRoute; label: NavKey; icon: typeof Home }[] = [
  { route: { name: "booking" }, label: "booking", icon: CalendarCheck },
  { route: { name: "downloads" }, label: "downloads", icon: Download },
  { route: { name: "testimonials" }, label: "testimonials", icon: MessageSquareQuote },
  { route: { name: "faq" }, label: "faq", icon: HelpCircle },
  { route: { name: "contact" }, label: "contact", icon: Mail },
];

const MOBILE_ALL = [...LINKS, ...MORE];

export function Navbar({ onOpenSearch }: { onOpenSearch: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { route, navigate } = useAppRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { cart } = useAppStore();
  const { user, signOut } = useSession();
  const count = cartCount(cart);
  const { t } = useI18n();
  const nt = t.nav;
  const at = t.auth;
  const doSignOut = async () => {
    await signOut();
    toast({ title: at.logoutTitle, description: at.logoutDesc });
    navigate({ name: "home" });
  };
  const label = (k: NavKey) => nt[k] as string;
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  /* القائمة الجانبية للجوال: Escape للإغلاق + نقل التركيز إليها ثم إعادته للزر */
  useEffect(() => {
    if (!mobileOpen) return;
    const drawer = drawerRef.current;
    drawer?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        menuBtnRef.current?.focus();
      } else if (e.key === "Tab" && drawer) {
        const items = Array.from(drawer.querySelectorAll<HTMLElement>("a,button")).filter((el) => !el.hasAttribute("disabled"));
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

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
        className={`glass-strong flex w-full max-w-6xl items-center xl:max-w-[78rem] justify-between gap-2 rounded-2xl px-3 py-2 transition-all duration-500 sm:rounded-full sm:px-4 ${
          scrolled ? "shadow-[0_10px_40px_rgba(0,0,0,0.35)]" : ""
        }`}
        aria-label={nt.mainAria}
      >
        {/* brand */}
        <a
          href={routeHref({ name: "home" })}
          onClick={(e) => {
            e.preventDefault();
            go({ name: "home" });
          }}
          className="group flex items-center gap-2 pl-1"
          aria-label={`CTO-DRS — ${nt.home}`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00f0ff] via-[#7c3aed] to-[#ff2a6d] text-[#030303] shadow-[0_0_18px_rgba(0,240,255,0.35)] transition-transform duration-300 group-hover:rotate-6" aria-hidden="true">
            <Terminal className="h-4.5 w-4.5" strokeWidth={2.5} />
          </span>
          <span className="font-heading-cyber hidden text-lg font-extrabold tracking-wider sm:block lg:hidden xl:block" dir="ltr">
            <span className="whitespace-nowrap">
              <span className="text-gradient-cyan">CTO</span>
              <span className="text-main">-</span>
              <span className="text-gradient-pink">DRS</span>
            </span>
          </span>
        </a>

        {/* smart search (mobile + tablet) */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="mx-1 flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full border border-border-strong bg-elev-2/60 px-3 text-xs text-mute transition hover:border-[rgba(0,240,255,0.3)] hover:text-cyber lg:hidden"
          aria-label={nt.smartSearch}
        >
          <Search className="h-3.5 w-3.5 shrink-0 text-cyber" aria-hidden="true" />
          <span className="truncate">{nt.searchPlaceholder}</span>
        </button>

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
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-2 text-[13px] xl:px-3 font-medium transition-all duration-300 ${
                  isActive(l.route)
                    ? "bg-[rgba(0,240,255,0.10)] text-[#00f0ff] shadow-[inset_0_0_12px_rgba(0,240,255,0.08)]"
                    : "text-sec hover:bg-[rgba(0,240,255,0.06)] hover:text-main"
                }`}
              >
                <l.icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label(l.label)}
              </a>
            </li>
          ))}
          <li>
            <a
              href={ACADEMY_URL}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-2 text-[13px] xl:px-3 font-medium text-sec transition-all duration-300 hover:bg-[rgba(0,240,255,0.06)] hover:text-main"
            >
              <School className="h-3.5 w-3.5" aria-hidden="true" />
              {nt.academy}
              <span className="sr-only"> {nt.newTab}</span>
            </a>
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`flex items-center gap-1 rounded-full px-3 py-2 text-[13px] font-medium outline-none transition-all duration-300 data-[state=open]:bg-[rgba(0,240,255,0.10)] data-[state=open]:text-[#00f0ff] ${
                  MORE.some((m) => m.route.name === route.name)
                    ? "bg-[rgba(0,240,255,0.10)] text-[#00f0ff]"
                    : "text-sec hover:bg-[rgba(0,240,255,0.06)] hover:text-main"
                }`}
                aria-label={nt.moreAria}
              >
                {nt.more}
                <ChevronDown className="h-3 w-3" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-strong border-border-strong rounded-2xl border p-2">
                {MORE.map((m) => (
                  <DropdownMenuItem
                    key={m.route.name}
                    onClick={() => go(m.route)}
                    className="cursor-pointer gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-sec transition hover:bg-[rgba(0,240,255,0.08)] hover:text-cyber focus:bg-[rgba(0,240,255,0.08)] focus:text-cyber"
                  >
                    <m.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {label(m.label)}
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
            className="hidden h-9 items-center gap-2 rounded-full border border-border-strong bg-elev-2/60 px-3 text-xs text-mute transition hover:border-[rgba(0,240,255,0.3)] hover:text-cyber lg:flex"
            aria-label={nt.smartSearch}
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden 2xl:inline">{nt.searchBtn}</span>
            <span className="font-mono-cyber text-[10px]" aria-hidden="true">Ctrl K</span>
          </Button>

          {/* cart */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => go({ name: "cart" })}
            className="relative h-9 w-9 rounded-full text-sec hover:text-cyber"
            aria-label={nt.cartAria(count)}
          >
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            {count > 0 && (
              <span aria-hidden="true" className="font-mono-cyber absolute -top-1 -start-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff2a6d] px-1 text-[9px] font-bold text-white">
                {count}
              </span>
            )}
          </Button>

          {/* account menu: دخول/تسجيل عند الخروج — حسابي/الإدارة/خروج عند الدخول */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`hidden h-9 w-9 rounded-full sm:flex ${user ? "text-cyber" : "text-sec hover:text-cyber"}`}
                aria-label={user ? `${at.accountMenu} — ${user.name}` : at.accountMenu}
              >
                <User className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-strong border-border-strong min-w-52 rounded-2xl border p-2">
              {user ? (
                <>
                  <DropdownMenuLabel className="px-3 py-2">
                    <span className="block truncate text-[13px] font-bold text-main">{user.name}</span>
                    <span dir="ltr" className="block truncate font-mono-cyber text-[11px] font-normal text-mute">{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => go({ name: "account" })} className="cursor-pointer gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-sec transition hover:bg-[rgba(0,240,255,0.08)] hover:text-cyber focus:bg-[rgba(0,240,255,0.08)] focus:text-cyber">
                    <User className="h-4 w-4" aria-hidden="true" />
                    {at.account}
                  </DropdownMenuItem>
                  {user.isAdmin && (
                    <DropdownMenuItem onClick={() => go({ name: "dashboard" })} className="cursor-pointer gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-sec transition hover:bg-[rgba(0,240,255,0.08)] hover:text-cyber focus:bg-[rgba(0,240,255,0.08)] focus:text-cyber">
                      <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                      {at.admin}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={doSignOut} className="cursor-pointer gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-[#ff2a6d] focus:bg-[rgba(255,42,109,0.08)] focus:text-[#ff2a6d]">
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    {at.logout}
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => go({ name: "login" })} className="cursor-pointer gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-sec transition hover:bg-[rgba(0,240,255,0.08)] hover:text-cyber focus:bg-[rgba(0,240,255,0.08)] focus:text-cyber">
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                    {at.login}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => go({ name: "register" })} className="cursor-pointer gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-sec transition hover:bg-[rgba(0,240,255,0.08)] hover:text-cyber focus:bg-[rgba(0,240,255,0.08)] focus:text-cyber">
                    <UserPlus className="h-4 w-4" aria-hidden="true" />
                    {at.register}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="hidden h-9 w-9 rounded-full text-sec hover:text-cyber sm:flex"
            aria-label={nt.toggleTheme}
            suppressHydrationWarning
          >
            <SunMedium className="hidden h-4 w-4 dark:block" aria-hidden="true" />
            <Moon className="h-4 w-4 dark:hidden" suppressHydrationWarning aria-hidden="true" />
          </Button>

          <LanguageToggle compact className="hidden sm:flex" />

          <a
            href={routeHref({ name: "booking" })}
            onClick={(e) => {
              e.preventDefault();
              go({ name: "booking" });
            }}
            className="btn-gradient hidden h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-xs lg:flex"
          >
            <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {nt.bookCta}
          </a>

          {user?.isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => go({ name: "dashboard" })}
              className="hidden h-9 w-9 rounded-full text-sec hover:text-[#ffd700] lg:flex"
              aria-label={nt.dashboard}
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-main lg:hidden"
            ref={menuBtnRef}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? nt.closeMenu : nt.menu}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </Button>
        </div>
      </nav>

      {/* mobile menu */}
      <div
        className={`fixed inset-0 top-0 z-[99] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
      <div
        id="mobile-menu"
        ref={drawerRef}
        role="dialog"
        aria-modal={mobileOpen}
        aria-label={nt.menu}
        inert={!mobileOpen}
        className={`glass-strong fixed inset-y-0 start-0 z-[101] flex w-72 flex-col gap-1 overflow-y-auto p-5 pt-20 transition-transform duration-400 lg:hidden ${
          mobileOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"
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
            <l.icon className="h-4 w-4" aria-hidden="true" />
            {label(l.label)}
          </a>
        ))}
        <a
          href={ACADEMY_URL}
          target="_blank"
          rel="noopener"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-sec transition hover:bg-[rgba(0,240,255,0.08)] hover:text-cyber"
        >
          <School className="h-4 w-4" aria-hidden="true" />
          {nt.academy}
          <span className="sr-only"> {nt.newTab}</span>
        </a>
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
            <Search className="h-3.5 w-3.5" aria-hidden="true" /> {nt.quickSearch}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label={nt.toggleTheme}
          >
            <SunMedium className="hidden h-4 w-4 dark:block" suppressHydrationWarning aria-hidden="true" />
            <Moon className="h-4 w-4 dark:hidden" suppressHydrationWarning aria-hidden="true" />
          </Button>
          <LanguageToggle className="border border-border-strong" />
        </div>
        {user ? (
          <div className="mt-2 flex flex-col gap-2">
            <a
              href={routeHref({ name: "account" })}
              onClick={(e) => {
                e.preventDefault();
                go({ name: "account" });
                setMobileOpen(false);
              }}
              className="btn-gradient flex h-10 items-center justify-center gap-2 rounded-full text-xs"
            >
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              {at.account}
            </a>
            {user.isAdmin && (
              <a
                href={routeHref({ name: "dashboard" })}
                onClick={(e) => {
                  e.preventDefault();
                  go({ name: "dashboard" });
                  setMobileOpen(false);
                }}
                className="btn-outline-cyber flex h-10 items-center justify-center gap-2 rounded-full text-xs"
              >
                <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" />
                {at.admin}
              </a>
            )}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                void doSignOut();
              }}
              className="flex h-10 items-center justify-center gap-2 rounded-full text-xs font-bold text-[#ff2a6d] hover:bg-[rgba(255,42,109,0.08)]"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              {at.logout}
            </button>
          </div>
        ) : (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <a
              href={routeHref({ name: "login" })}
              onClick={(e) => {
                e.preventDefault();
                go({ name: "login" });
                setMobileOpen(false);
              }}
              className="btn-gradient flex h-10 items-center justify-center gap-2 rounded-full text-xs"
            >
              <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
              {at.login}
            </a>
            <a
              href={routeHref({ name: "register" })}
              onClick={(e) => {
                e.preventDefault();
                go({ name: "register" });
                setMobileOpen(false);
              }}
              className="btn-outline-cyber flex h-10 items-center justify-center gap-2 rounded-full text-xs"
            >
              <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
              {at.register}
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
