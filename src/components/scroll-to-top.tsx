"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

/**
 * زر العودة إلى الأعلى — يظهر بعد تمرير 600px
 * مثبت أسفل اليمين (مقابل أداة الدردشة) بأسلوب زجاجي سيبراني
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="العودة إلى الأعلى"
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 16 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="glass-strong fixed bottom-5 right-5 z-[110] flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(0,240,255,0.35)] text-cyber shadow-[0_0_24px_rgba(0,240,255,0.25)] transition-colors hover:border-[rgba(0,240,255,0.75)] hover:shadow-[0_0_32px_rgba(0,240,255,0.45)]"
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
