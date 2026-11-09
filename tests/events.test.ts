/**
 * اختبارات تصنيف الفعاليات بالتاريخ — إصلاح 2026-11-09.
 * الخلل الذي عالجه هذا الملف: فعاليات بتواريخ مضيّة بقيت ضمن "القادمة"
 * لأن العرض كان يعتمد على حقل status النصي فقط.
 */
import { describe, it, expect } from "vitest";
import { isEventPast, splitEvents } from "@/lib/events";
import type { EventItem } from "@/lib/data";

/** لحظة مرجعية ثابتة: 2026-11-09 منتصف النهار */
const NOW = new Date("2026-11-09T12:00:00").getTime();

function ev(partial: Partial<EventItem> & Pick<EventItem, "date">): EventItem {
  return {
    title: "فعالية اختبار",
    description: "",
    time: "8:00 مساءً",
    duration: "60 دقيقة",
    mode: "أونلاين",
    status: "upcoming",
    seats: "متاح",
    topics: [],
    ...partial,
  };
}

describe("isEventPast", () => {
  it("فعالية قادمة بتاريخ مستقبلي → ليست منتهية", () => {
    expect(isEventPast(ev({ date: "2026-12-01" }), NOW)).toBe(false);
  });

  it("فعالية بتاريخ مضٍّ → منتهية حتى لو كانت status=upcoming (الخلل الأصلي)", () => {
    expect(isEventPast(ev({ date: "2026-02-12", status: "upcoming" }), NOW)).toBe(true);
  });

  it("نفس يوم الفعالية ما زالت قادمة (نهاية اليوم قبل الآن لا بعده)", () => {
    expect(isEventPast(ev({ date: "2026-11-09" }), NOW)).toBe(false);
  });

  it("اليوم السابق على الآن → منتهية", () => {
    expect(isEventPast(ev({ date: "2026-11-08" }), NOW)).toBe(true);
  });

  it("status=past يتجاوز التاريخ (تجاوز يدوي)", () => {
    expect(isEventPast(ev({ date: "2030-01-01", status: "past" }), NOW)).toBe(true);
  });

  it("تاريخ غير صالح يعامل كقادمة (لا يُرمى ولا يُصنَّف خطأً منتهياً)", () => {
    expect(isEventPast(ev({ date: "not-a-date" }), NOW)).toBe(false);
  });
});

describe("splitEvents", () => {
  const list: EventItem[] = [
    ev({ title: "قديم", date: "2025-12-14", status: "past" }),
    ev({ title: "قادم بعيد", date: "2027-01-20" }),
    ev({ title: "مضٍّ وسُئئ تصميمه upcoming", date: "2026-03-08", status: "upcoming" }),
    ev({ title: "قادم قريب", date: "2026-12-05" }),
    ev({ title: "حديث الانتهاء", date: "2026-10-30" }),
  ];

  it("القادمة فقط بتواريخ مستقبلية — والمنتهية بالتاريخ تنتقل للسابقة", () => {
    const { upcoming, past } = splitEvents(list, NOW);
    expect(upcoming.map((e) => e.title)).toEqual(["قادم قريب", "قادم بعيد"]);
    expect(past.map((e) => e.title)).toEqual([
      "حديث الانتهاء",
      "مضٍّ وسُئئ تصميمه upcoming",
      "قديم",
    ]);
  });

  it("القادمة تصاعدياً والسابقة تنازلياً", () => {
    const { upcoming, past } = splitEvents(list, NOW);
    expect(upcoming[0].date < upcoming[1].date).toBe(true);
    expect(past[0].date > past[1].date && past[1].date > past[2].date).toBe(true);
  });

  it("لا فعالية تظهر في القسمين معاً", () => {
    const { upcoming, past } = splitEvents(list, NOW);
    const overlap = upcoming.filter((u) => past.some((p) => p.title === u.title));
    expect(overlap).toHaveLength(0);
  });

  it("قائمة فارغة → قسمان فارغان", () => {
    const { upcoming, past } = splitEvents([], NOW);
    expect(upcoming).toHaveLength(0);
    expect(past).toHaveLength(0);
  });
});
