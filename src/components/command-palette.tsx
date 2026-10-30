"use client";

import { useEffect } from "react";
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
  Calculator,
  Download,
  Moon,
  Sun,
  Terminal,
  Wrench,
  BookOpen,
} from "lucide-react";
import { useTheme } from "next-themes";

export function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const { theme, setTheme } = useTheme();

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

  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} className="glass-strong rounded-2xl">
      <div className="flex items-center gap-2 border-b border-border-soft px-4 pt-3">
        <Search className="h-4 w-4 text-cyber" />
        <span className="font-mono-cyber text-[10px] tracking-[0.2em] text-mute">COMMAND PALETTE</span>
      </div>
      <CommandInput placeholder="ابحث أو نفذ أمراً... (Esc للإغلاق)" />
      <CommandList className="max-h-80">
        <CommandEmpty>لا توجد نتائج مطابقة.</CommandEmpty>
        <CommandGroup heading="التنقل">
          <CommandItem onSelect={() => go("#home")}>
            <Home className="h-4 w-4 text-cyber" /> الرئيسية
          </CommandItem>
          <CommandItem onSelect={() => go("#about")}>
            <User className="h-4 w-4 text-cyber" /> نبذة عني
          </CommandItem>
          <CommandItem onSelect={() => go("#projects")}>
            <Package className="h-4 w-4 text-cyber" /> المشاريع
          </CommandItem>
          <CommandItem onSelect={() => go("#services")}>
            <Wrench className="h-4 w-4 text-cyber" /> الخدمات والمهارات
          </CommandItem>
          <CommandItem onSelect={() => go("#blog")}>
            <BookOpen className="h-4 w-4 text-cyber" /> المدونة والفيديوهات
          </CommandItem>
          <CommandItem onSelect={() => go("#contact")}>
            <Mail className="h-4 w-4 text-cyber" /> التواصل
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="أدوات سريعة">
          <CommandItem onSelect={() => go("#contact")}>
            <Calculator className="h-4 w-4 text-[#a78bfa]" /> حاسبة التكلفة
          </CommandItem>
          <CommandItem onSelect={() => go("#projects")}>
            <Terminal className="h-4 w-4 text-[#a78bfa]" /> استعرض الأعمال
          </CommandItem>
          <CommandItem onSelect={() => go("#contact")}>
            <Download className="h-4 w-4 text-[#a78bfa]" /> تحميل السيرة الذاتية
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
      </CommandList>
    </CommandDialog>
  );
}
