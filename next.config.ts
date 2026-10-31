import type { NextConfig } from "next";

/**
 * نسختان من الإعداد:
 *  - الوضع العادي (سيرفر كامل مع standalone) للبيئة الحية داخل المنصة
 *  - وضع STATIC_EXPORT=1 للنشر الثابت على GitHub Pages المربوط بدومين
 *    Spaceship (cto-drs.com) — distDir منفصل كي لا يتعارض مع سيرفر التطوير
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const shared = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
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
