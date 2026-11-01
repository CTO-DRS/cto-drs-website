"use client";

import { useEffect, useRef } from "react";

/**
 * Cyber starfield background — subtle floating particles + neon orbs,
 * rendered on canvas like the reference site.
 */
export function ParticleBackground({ density = 70 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    let isDark = document.documentElement.classList.contains("dark");

    const COLORS = ["0,240,255", "255,42,109", "124,58,237", "0,255,136"];
    const parts = Array.from({ length: density }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      a: Math.random() * 0.5 + 0.15,
      tw: Math.random() * Math.PI * 2,
    }));

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", onResize);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = (animate: boolean) => {
      ctx.clearRect(0, 0, w, h);
      isDark = document.documentElement.classList.contains("dark");

      if (animate) {
        for (const p of parts) {
          p.x += p.vx;
          p.y += p.vy;
          p.tw += 0.02;
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;
        }
      }

      for (const p of parts) {
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${isDark ? alpha : alpha * 0.55})`;
        ctx.fill();
      }

      // connective lines between close particles (knowledge-network feel)
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const dx = parts[i].x - parts[j].x;
          const dy = parts[i].y - parts[j].y;
          const d = dx * dx + dy * dy;
          if (d < 120 * 120) {
            const o = (1 - d / (120 * 120)) * (isDark ? 0.12 : 0.06);
            ctx.strokeStyle = `rgba(0,240,255,${o})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(parts[i].x, parts[i].y);
            ctx.lineTo(parts[j].x, parts[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // وصولية: مع تفضيل تقليل الحركة → إطار ثابت واحد بلا حلقة رسوم
    if (reducedMotion) {
      draw(false);
      return () => window.removeEventListener("resize", onResize);
    }

    const tick = () => {
      draw(true);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // أداء: إيقاف الرسم عند إخفاء التبويب
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
      {/* neon ambient orbs */}
      <div className="absolute -top-32 right-[8%] h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.10),transparent_65%)] blur-2xl" />
      <div className="absolute top-[38%] -left-40 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,42,109,0.07),transparent_65%)] blur-2xl" />
      <div className="absolute bottom-[-10%] right-[30%] h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.08),transparent_65%)] blur-2xl" />
    </div>
  );
}
