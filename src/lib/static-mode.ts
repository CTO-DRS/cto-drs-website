/**
 * وضع النسخة الثابتة (Static Export — GitHub Pages)
 * يُضبط عند بناء نسخة النشر: STATIC_EXPORT=1 NEXT_PUBLIC_STATIC=1
 *
 * في هذا الوضع:
 *  - قراءات GET تُقرأ من لقطات JSON مخبوزة في /data/*.json
 *  - الكتابات (تسجيل/حجز/طلبات) تعرض رسالة لطيفة بدل فشل الشبكة
 *  - ودردشة الذكاء الاصطناعي تُخفى لأنها تتطلب الخادم
 */
export const STATIC_MODE = process.env.NEXT_PUBLIC_STATIC === "1";

/** رسالة موحدة للميزات التي تحتاج خادمًا في النسخة الثابتة */
export const STATIC_SERVER_FEATURE =
  "هذه الميزة تتطلب النسخة الكاملة (خادم نشط) — أهلاً بك في تجربة النسخة الكاملة عبر النموذج المباشر أو واتساب";

/**
 * يحوّل مسار API داخلي إلى ملف لقطة JSON مكافئ في النسخة الثابتة.
 * مثال: /api/courses → /data/courses.json  |  /api/github/apps → /data/github-apps.json
 * يرجع null إن لم يكن هناك ملف مكافئ.
 */
export function staticSnapshotUrl(apiUrl: string): string | null {
  if (!apiUrl.startsWith("/api/")) return null;
  const rest = apiUrl
    .slice("/api/".length)
    .split(/[?#]/)[0]
    .replace(/\/+$/, "");
  if (!rest) return null;
  return `/data/${rest}.json`;
}
