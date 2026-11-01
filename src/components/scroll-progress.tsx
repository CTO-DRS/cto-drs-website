"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * شريط تقدم القراءة — خط سيبراني رفيع أعلى الصفحة
 * ينمو من اليمين (RTL) بتدرج أزرق→بنفسجي→وردي مع حركة نابضة ناعمة
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[105] h-[3px] origin-right bg-gradient-to-l from-[#00f0ff] via-[#7c3aed] to-[#ff2a6d] shadow-[0_0_12px_rgba(0,240,255,0.55)]"
    />
  );
}
