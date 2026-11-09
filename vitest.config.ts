import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";

/**
 * إعداد vitest — بطاقة P1/10 (F-11) من تقرير الفحص الشامل.
 * نطاق الاختبارات: وحدات المنطق الحسّاس (التشفير/الجلسات/تقييد السرعة/كلمات المرور)
 * بمحاكاة الاعتماديات الخارجية (Prisma) لضمان عزلها عن أي قاعدة بيانات فعلية.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // كل ملف اختبار بعملية مستقلة: متغيرات البيئة والذاكرة معزولة بين الملفات
    pool: "forks",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
