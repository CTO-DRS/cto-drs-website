import type { NextConfig } from "next";

/**
 * نسختان من الإعداد:
 *  - الوضع العادي (سيرفر كامل مع standalone) للبيئة الحية داخل المنصة
 *  - وضع STATIC_EXPORT=1 للنشر الثابت على GitHub Pages المربوط بدومين
 *    Spaceship (cto-drs.com) — distDir منفصل كي لا يتعارض مع سيرفر التطوير
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const shared = {
  // F-07: حاجز الأنواع مفعّل — فشل البناء على أي خطأ نوع جديد
  // (examples/ مستثناة من tsconfig: ملفات أمثلة لحزم غير مثبتة)
  typescript: {
    ignoreBuildErrors: false,
  },
  // F-14: وضع React الصارم مفعّل في التطوير — يكشف الأعراض الجانبية
  // والاستدعاءات المزدوجة مبكراً (لا تأثير في الإنتاج)
  reactStrictMode: true,
};

const nextConfig: NextConfig = isStaticExport
  ? {
      ...shared,
      output: "export",
      distDir: ".next-static",
      trailingSlash: true,
      images: { unoptimized: true },
      env: {
        NEXT_PUBLIC_STATIC: "1",
      },
    }
  : {
      ...shared,
      output: "standalone",
    };

export default nextConfig;
