/**
 * تصنيف الفعاليات بالتاريخ — إصلاح 2026-11-09.
 *
 * المشكلة: فعاليات بتواريخ فبراير–مارس 2026 بقيت معروضة ضمن "القادمة"
 * بعد انقضائها بثمانية أشهر لأن العرض كان يعتمد على حقل status النصي فقط.
 *
 * الحل: الفعالية تُعدّ منتهية إذا كان status === "past" (تجاوز يدوي)
 * أو إذا مرّ تاريخها (نهاية يوم الفعالية) — فلا يمكن أن تبقى فعالية
 * منتهية في قسم "القادمة" مهما نسي من يحدّث البيانات.
 */
import type { EventItem } from "@/lib/data";

/** نهاية يوم الفعالية بالتوقيت المحلي — التاريخ بصيغة ISO القصيرة YYYY-MM-DD */
function endOfDay(date: string): number {
  const t = new Date(`${date}T23:59:59`).getTime();
  return Number.isFinite(t) ? t : Number.POSITIVE_INFINITY;
}

/** هل انتهت هذه الفعالية؟ (تجاوز يدوي status=past يكفي وحده) */
export function isEventPast(
  ev: Pick<EventItem, "date" | "status">,
  now: number = Date.now()
): boolean {
  if (ev.status === "past") return true;
  return endOfDay(ev.date) < now;
}

/**
 * تقسيم الفعاليات إلى قادمة وسابقة:
 *  - القادمة تصاعدياً (الأقرب موعداً أولاً)
 *  - السابقة تنازلياً (الأحدث حدوثاً أولاً)
 */
export function splitEvents(
  events: readonly EventItem[],
  now: number = Date.now()
): { upcoming: EventItem[]; past: EventItem[] } {
  const upcoming = events
    .filter((e) => !isEventPast(e, now))
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = events
    .filter((e) => isEventPast(e, now))
    .sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}
