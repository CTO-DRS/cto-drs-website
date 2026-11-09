/**
 * اختبارات تشفير كلمات المرور (scrypt + salt عشوائي) — بطاقة P1/10 (F-11).
 * تُغطي: صيغة التخزين، التحقق الصحيح/الخاطئ، صيغ التخزين التالفة، وتنوع الـ salt.
 */
import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";

describe("hashPassword / verifyPassword", () => {
  it("الصيغة: salt:hash بصيغة hex (16 بايت salt + 64 بايت hash)", () => {
    const stored = hashPassword("s3cret-Passw0rd!");
    expect(stored).toMatch(/^[0-9a-f]{32}:[0-9a-f]{128}$/);
  });

  it("التحقق الصحيح ينجح", () => {
    const stored = hashPassword("My-Strong-Pass-2026");
    expect(verifyPassword("My-Strong-Pass-2026", stored)).toBe(true);
  });

  it("كلمة مرور خاطئة تفشل (لا ترمي استثناء)", () => {
    const stored = hashPassword("My-Strong-Pass-2026");
    expect(verifyPassword("wrong-password", stored)).toBe(false);
    expect(verifyPassword("", stored)).toBe(false);
  });

  it("salt عشوائي: نفس الكلمة تعطي بصمات مختلفة — والتحقق يعمل مع كلتيهما", () => {
    const a = hashPassword("same-password");
    const b = hashPassword("same-password");
    expect(a).not.toBe(b);
    expect(verifyPassword("same-password", a)).toBe(true);
    expect(verifyPassword("same-password", b)).toBe(true);
  });

  it("صيغ تخزين تالفة تفشل بأمان (بلا استثناء)", () => {
    const stored = hashPassword("x");
    expect(verifyPassword("x", "")).toBe(false);
    expect(verifyPassword("x", "no-colon-here")).toBe(false);
    expect(verifyPassword("x", "zz:zz")).toBe(false); // hex غير صالح
    expect(verifyPassword("x", `${stored.split(":")[0]}:short`)).toBe(false); // طول مختلف
  });
});
