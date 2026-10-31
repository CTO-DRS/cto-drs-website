"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, X, Send, Loader2, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/social-icons";
import { SOCIAL_BY_ID } from "@/lib/social";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "ما هي خدماتك؟",
  "كم تكلفة موقع؟",
  "أخبرني عن خبرتك",
  "كيف أتواصل معك؟",
];

const WELCOME: Msg = {
  role: "assistant",
  content:
    "أهلاً بك في CTO-DRS 👋\nأنا المساعد الذكي، كيف يمكنني مساعدتك؟ اسألني عن الخدمات أو المشاريع أو التقنيات.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    const next: Msg[] = [...msgs, { role: "user", content }];
    setMsgs(next);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.slice(-10).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMsgs((m) => [
        ...m,
        { role: "assistant", content: data.reply ?? "عذراً، حدث خطأ. حاول مرة أخرى." },
      ]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "assistant", content: "تعذر الاتصال بالخادم، تحقق من الشبكة وحاول مجدداً." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* launcher */}
      <button
        onClick={() => {
          setOpen((v) => !v);
          setUnread(false);
        }}
        aria-label={open ? "إغلاق المحادثة" : "افتح المحادثة"}
        className="group fixed bottom-5 left-5 z-[120] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#00f0ff] via-[#7c3aed] to-[#ff2a6d] text-white shadow-[0_8px_30px_rgba(0,240,255,0.4)] transition-transform duration-300 hover:scale-110"
      >
        <span className="animate-ping pointer-events-none absolute inset-0 rounded-full border-2 border-white/20" aria-hidden="true" />
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
        {unread && !open && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff2a6d] text-[10px] font-bold text-white">
            1
          </span>
        )}
      </button>

      {/* panel */}
      <div
        className={`glass-strong fixed bottom-24 left-4 z-[120] flex h-[30rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.5)] transition-all duration-300 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
        role="dialog"
        aria-label="المحادثة مع المساعد الذكي"
      >
        {/* header */}
        <div className="flex items-center gap-3 border-b border-border-soft bg-elev/60 p-4">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00f0ff] to-[#7c3aed] text-[#030303]">
            <Terminal className="h-5 w-5" />
            <span className="animate-pulse-dot absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full border-2 border-elev bg-[#00ff88]" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold text-main">المساعد الذكي</p>
            <p className="font-mono-cyber text-[10px] text-[#00ff88]" dir="ltr">
              ONLINE • AI POWERED
            </p>
          </div>
          <a
            href={SOCIAL_BY_ID.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تواصل عبر واتساب — حساب تجاري"
            title="تواصل عبر واتساب — حساب تجاري"
            className="flex h-8 items-center gap-1.5 rounded-full border border-[rgba(37,211,102,0.35)] bg-[rgba(37,211,102,0.08)] px-3 text-[10px] font-bold text-[#25d366] transition hover:bg-[rgba(37,211,102,0.18)]"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            واتساب
          </a>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setOpen(false)} aria-label="إغلاق">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* messages */}
        <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-xs leading-6 ${
                  m.role === "user"
                    ? "rounded-bl-sm bg-elev-2 text-main"
                    : "rounded-br-sm bg-[rgba(0,240,255,0.08)] text-main"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-end">
              <div className="flex items-center gap-2 rounded-2xl rounded-br-sm bg-[rgba(0,240,255,0.08)] px-4 py-3">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-cyber" />
                <span className="font-mono-cyber text-[10px] tracking-widest text-cyber">PROCESSING...</span>
              </div>
            </div>
          )}
        </div>

        {/* suggestions */}
        {msgs.length <= 1 && (
          <div className="flex flex-wrap gap-1.5 px-4 pb-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-[rgba(0,240,255,0.25)] bg-[rgba(0,240,255,0.04)] px-3 py-1.5 text-[10px] text-cyber transition hover:bg-[rgba(0,240,255,0.12)]"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-center gap-2 border-t border-border-soft bg-elev/60 p-3"
        >
          <label htmlFor="chat-input" className="sr-only">
            رسالتك
          </label>
          <input
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="h-10 flex-1 rounded-full border border-border-strong bg-elev-2/60 px-4 text-xs text-main outline-none transition placeholder:text-mute focus:border-[rgba(0,240,255,0.5)]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="إرسال"
            className="btn-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-full disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
}
