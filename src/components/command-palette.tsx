"use client";

import { useEffect, useMemo, useState } from "react";
import { smartSearch, SEARCH_SUGGESTIONS, type SearchHit } from "@/lib/smart-search";
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
import { useAppStore } from "@/lib/store";

export function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const { theme, setTheme } = useTheme();
  const { navigate } = useAppRouter();
  const { user, cart } = useAppStore();

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
      title="البحث الذكي"
      description="ابحث في المشاريع والخدمات والدورات والتطبيقات"
      className="glass-strong rounded-2xl"
    >
      <div className="flex items-center gap-2 border-b border-border-soft px-4 pt-3">
        <Sparkles className="h-4 w-4 text-cyber" />
        <span className="font-mono-cyber text-[10px] tracking-[0.2em] text-mute">SMART SEARCH</span>
      </div>
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder="ابحث بذكاء: مشروع، خدمة، دورة، تطبيق…"
      />
      <CommandList className="max-h-[60vh]">
        {searching ? (
          hits.length ? (
            <CommandGroup heading={`${hits.length} نتيجة`}>
              {hits.map((h) => (
                <CommandItem key={h.id} value={h.id} onSelect={() => openHit(h)} className="items-start">
                  <span className="mt-0.5 shrink-0 rounded-md bg-[rgba(0,240,255,0.10)] px-1.5 py-0.5 text-[10px] text-cyber">
                    {h.kind}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm text-main">{h.title}</span>
                    {(h.subtitle || h.body) && (
                      <span className="line-clamp-1 text-[11px] text-mute">{h.subtitle || h.body}</span>
                    )}
                  </span>
                  {h.url && !h.route ? (
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-mute" />
                  ) : (
                    <ArrowLeft className="h-3.5 w-3.5 shrink-0 text-mute" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-mute">
              لا توجد نتائج لـ «{query}». جرّب كلمة أخرى أو
              <button className="mx-1 text-cyber underline" onClick={() => go({ name: "contact" })}>
                تواصل معي
              </button>
            </div>
          )
        ) : (
        <>
        <CommandGroup heading="اقتراحات">
          {SEARCH_SUGGESTIONS.map((s) => (
            <CommandItem key={s} value={`sug-${s}`} onSelect={() => setQuery(s)}>
              <Search className="h-4 w-4 text-mute" /> {s}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="الصفحات">
          <CommandItem onSelect={() => go({ name: "home" })}>
            <Home className="h-4 w-4 text-cyber" /> الرئيسية
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "services" })}>
            <Wrench className="h-4 w-4 text-cyber" /> الخدمات
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "projects" })}>
            <Package className="h-4 w-4 text-cyber" /> المشاريع
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "courses" })}>
            <GraduationCap className="h-4 w-4 text-cyber" /> الدورات
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "store" })}>
            <Store className="h-4 w-4 text-cyber" /> المتجر الرقمي
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "blog" })}>
            <BookOpen className="h-4 w-4 text-cyber" /> المدونة
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "testimonials" })}>
            <MessageSquareQuote className="h-4 w-4 text-cyber" /> آراء العملاء
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "faq" })}>
            <HelpCircle className="h-4 w-4 text-cyber" /> الأسئلة الشائعة
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "contact" })}>
            <Mail className="h-4 w-4 text-cyber" /> تواصل معي
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "pricing" })}>
            <BadgeDollarSign className="h-4 w-4 text-cyber" /> الباقات والأسعار
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "team" })}>
            <Users className="h-4 w-4 text-cyber" /> من خلف المنصة
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "events" })}>
            <CalendarDays className="h-4 w-4 text-cyber" /> الفعاليات والورش
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "tools" })}>
            <Terminal className="h-4 w-4 text-cyber" /> الأدوات والمكتبات
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "downloads" })}>
            <Download className="h-4 w-4 text-cyber" /> مركز التحميل المباشر
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "videos" })}>
            <PlayCircle className="h-4 w-4 text-cyber" /> الفيديوهات
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "gallery" })}>
            <Camera className="h-4 w-4 text-cyber" /> معرض الأعمال
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="إجراءات سريعة">
          <CommandItem onSelect={() => go({ name: "booking" })}>
            <CalendarCheck className="h-4 w-4 text-[#00ff88]" /> احجز استشارة
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "cart" })}>
            <ShoppingCart className="h-4 w-4 text-[#00ff88]" />
            السلة {cart.length ? `(${cart.length})` : ""}
          </CommandItem>
          <CommandItem onSelect={() => go({ name: user ? "account" : "login" })}>
            {user ? <User className="h-4 w-4 text-[#a78bfa]" /> : <LogIn className="h-4 w-4 text-[#a78bfa]" />}
            {user ? "حسابي" : "تسجيل الدخول"}
          </CommandItem>
          {user?.role === "admin" && (
            <CommandItem onSelect={() => go({ name: "dashboard" })}>
              <LayoutDashboard className="h-4 w-4 text-[#a78bfa]" /> لوحة التحكم
            </CommandItem>
          )}
          <CommandItem onSelect={() => go({ name: "projects" })}>
            <Terminal className="h-4 w-4 text-[#a78bfa]" /> استعرض الأعمال
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "store" })}>
            <ShoppingBag className="h-4 w-4 text-[#a78bfa]" /> تسوّق المنتجات
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "wishlist" })}>
            <Heart className="h-4 w-4 text-[#a78bfa]" /> قائمة المفضلة
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "orders" })}>
            <ReceiptText className="h-4 w-4 text-[#a78bfa]" /> طلباتي
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "notifications" })}>
            <Bell className="h-4 w-4 text-[#a78bfa]" /> مركز التنبيهات
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "privacy" })}>
            <ShieldCheck className="h-4 w-4 text-[#a78bfa]" /> سياسة الخصوصية
          </CommandItem>
          <CommandItem onSelect={() => go({ name: "terms" })}>
            <FileText className="h-4 w-4 text-[#a78bfa]" /> الشروط والأحكام
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="الإعدادات">
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
            تبديل السمة ({theme === "dark" ? "الفاتح" : "الداكن"})
          </CommandItem>
        </CommandGroup>
        </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
