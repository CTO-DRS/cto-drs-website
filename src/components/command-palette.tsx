"use client";

import { useEffect, useMemo, useState } from "react";
import { smartSearch, type SearchHit } from "@/lib/smart-search";
import { useI18n } from "@/i18n";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Home,
  User,
  Package,
  Mail,
  Search,
  ShoppingBag,
  Moon,
  Sun,
  Terminal,
  Wrench,
  BookOpen,
  GraduationCap,
  Store,
  CalendarCheck,
  HelpCircle,
  MessageSquareQuote,
  ShoppingCart,
  LogIn,
  LayoutDashboard,
  Heart,
  Bell,
  ReceiptText,
  ShieldCheck,
  FileText,
  BadgeDollarSign,
  Users,
  CalendarDays,
  Camera,
  PlayCircle,
  Download,
  Sparkles,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAppRouter, type AppRoute } from "@/lib/router";
import { useSession } from "@/lib/auth";
import { useAppStore } from "@/lib/store";

export function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const { theme, setTheme } = useTheme();
  const { navigate } = useAppRouter();
  const { cart } = useAppStore();
  const { user } = useSession();
  const { t, lang } = useI18n();
  const s = t.search;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const [query, setQuery] = useState("");
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);
  const hits = useMemo(() => smartSearch(query), [query]);
  const en = lang === "en";
  const searching = query.trim().length > 0;

  const go = (r: AppRoute) => {
    setOpen(false);
    navigate(r);
  };

  const openHit = (h: SearchHit) => {
    if (h.route) go(h.route);
    else if (h.url) {
      setOpen(false);
      window.open(h.url, "_blank", "noopener");
    }
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      shouldFilter={false}
      title={s.title}
      description={s.description}
      className="glass-strong rounded-2xl"
    >
      <div className="flex items-center gap-2 border-b border-border-soft px-4 pt-3">
        <Sparkles className="h-4 w-4 text-cyber" aria-hidden="true" />
        <span className="font-mono-cyber text-[10px] tracking-[0.2em] text-mute">SMART SEARCH</span>
      </div>
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder={s.placeholder}
        aria-label={s.inputAria}
      />
      <CommandList className="max-h-[60vh]">
        {searching ? (
          hits.length ? (
            <CommandGroup heading={s.results(hits.length)}>
              {hits.map((h) => (
                <CommandItem key={h.id} value={h.id} onSelect={() => openHit(h)} className="items-start">
                  <span className="mt-0.5 shrink-0 rounded-md bg-[rgba(0,240,255,0.10)] px-1.5 py-0.5 text-[10px] text-cyber">
                    {s.kinds[h.kind] ?? h.kind}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm text-main">{en ? h.titleEn ?? h.title : h.title}</span>
                    {(h.subtitle || h.body) && (
                      <span className="line-clamp-1 text-[11px] text-mute">
                        {en ? h.subtitleEn || h.bodyEn || h.subtitle || h.body : h.subtitle || h.body}
                      </span>
                    )}
                  </span>
                  {h.url && !h.route ? (
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-mute" aria-hidden="true" />
                  ) : (
                    <ArrowLeft className="h-3.5 w-3.5 shrink-0 text-mute" aria-hidden="true" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-mute" role="status">
              {s.noResults(query)}
              <button type="button" className="mx-1 text-cyber underline" onClick={() => go({ name: "contact" })}>
                {s.contactMe}
              </button>
            </div>
          )
        ) : (
        <>
        <CommandGroup heading={s.suggestions}>
          {s.suggestionList.map((sg) => (
            <CommandItem key={sg} value={`sug-${sg}`} onSelect={() => setQuery(sg)}>
              <Search className="h-4 w-4 text-mute" aria-hidden="true" /> {sg}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={s.pages}>
          <CommandItem onSelect={() => go({ name: "home" })}>
            <Home className="h-4 w-4 text-cyber" aria-hidden="true" /> {s.p.home}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "services" })}>
            <Wrench className="h-4 w-4 text-cyber" aria-hidden="true" /> {s.p.services}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "projects" })}>
            <Package className="h-4 w-4 text-cyber" aria-hidden="true" /> {s.p.projects}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "courses" })}>
            <GraduationCap className="h-4 w-4 text-cyber" aria-hidden="true" /> {s.p.courses}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "store" })}>
            <Store className="h-4 w-4 text-cyber" aria-hidden="true" /> {s.p.store}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "blog" })}>
            <BookOpen className="h-4 w-4 text-cyber" aria-hidden="true" /> {s.p.blog}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "testimonials" })}>
            <MessageSquareQuote className="h-4 w-4 text-cyber" aria-hidden="true" /> {s.p.testimonials}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "faq" })}>
            <HelpCircle className="h-4 w-4 text-cyber" aria-hidden="true" /> {s.p.faq}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "contact" })}>
            <Mail className="h-4 w-4 text-cyber" aria-hidden="true" /> {s.p.contact}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "pricing" })}>
            <BadgeDollarSign className="h-4 w-4 text-cyber" aria-hidden="true" /> {s.p.pricing}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "team" })}>
            <Users className="h-4 w-4 text-cyber" aria-hidden="true" /> {s.p.team}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "events" })}>
            <CalendarDays className="h-4 w-4 text-cyber" aria-hidden="true" /> {s.p.events}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "tools" })}>
            <Terminal className="h-4 w-4 text-cyber" aria-hidden="true" /> {s.p.tools}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "downloads" })}>
            <Download className="h-4 w-4 text-cyber" aria-hidden="true" /> {s.p.downloads}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "videos" })}>
            <PlayCircle className="h-4 w-4 text-cyber" aria-hidden="true" /> {s.p.videos}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "gallery" })}>
            <Camera className="h-4 w-4 text-cyber" aria-hidden="true" /> {s.p.gallery}
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={s.quickActions}>
          <CommandItem onSelect={() => go({ name: "booking" })}>
            <CalendarCheck className="h-4 w-4 text-[#00ff88]" aria-hidden="true" /> {s.a.booking}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "cart" })}>
            <ShoppingCart className="h-4 w-4 text-[#00ff88]" />
            {s.a.cart} {cart.length ? `(${cart.length})` : ""}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: user ? "account" : "login" })}>
            {user ? <User className="h-4 w-4 text-[#a78bfa]" /> : <LogIn className="h-4 w-4 text-[#a78bfa]" />}
            {user ? s.a.account : s.a.login}
          </CommandItem>
          {user?.isAdmin && (
            <CommandItem onSelect={() => go({ name: "dashboard" })}>
              <LayoutDashboard className="h-4 w-4 text-[#a78bfa]" aria-hidden="true" /> {s.a.dashboard}
            </CommandItem>
          )}
          <CommandItem onSelect={() => go({ name: "projects" })}>
            <Terminal className="h-4 w-4 text-[#a78bfa]" aria-hidden="true" /> {s.a.viewWork}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "store" })}>
            <ShoppingBag className="h-4 w-4 text-[#a78bfa]" aria-hidden="true" /> {s.a.shop}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "wishlist" })}>
            <Heart className="h-4 w-4 text-[#a78bfa]" aria-hidden="true" /> {s.a.wishlist}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "orders" })}>
            <ReceiptText className="h-4 w-4 text-[#a78bfa]" aria-hidden="true" /> {s.a.orders}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "notifications" })}>
            <Bell className="h-4 w-4 text-[#a78bfa]" aria-hidden="true" /> {s.a.notifications}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "privacy" })}>
            <ShieldCheck className="h-4 w-4 text-[#a78bfa]" aria-hidden="true" /> {s.a.privacy}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "terms" })}>
            <FileText className="h-4 w-4 text-[#a78bfa]" aria-hidden="true" /> {s.a.terms}
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={s.settings}>
          <CommandItem
            onSelect={() => {
              setTheme(theme === "dark" ? "light" : "dark");
              setOpen(false);
            }}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-[#ffd700]" />
            ) : (
              <Moon className="h-4 w-4 text-[#ffd700]" />
            )}
            {s.toggleTheme(theme === "dark")}
          </CommandItem>
        </CommandGroup>
        </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
