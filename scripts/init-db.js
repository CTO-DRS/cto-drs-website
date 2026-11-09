#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════
   init-db.js — تهيئة قاعدة البيانات عند أول تشغيل في الإنتاج
   - يضمن وجود مجلد قاعدة البيانات
   - ينشئ حساب المدير إن لم يوجد (idempotent — لا يحذف شيئاً)
   البيئة:
     DATABASE_URL   (افتراضي: file:/app/db/custom.db)
     ADMIN_EMAIL    (افتراضي: contact@cto-drs.com)
     ADMIN_PASSWORD (إلزامي — 12 حرفاً على الأقل، لا يوجد افتراضي — F-04)
   ═══════════════════════════════════════════════════════════ */
"use strict";

const { randomBytes, scryptSync } = require("crypto");
const path = require("path");
const fs = require("fs");

function hashPassword(pw) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(pw, salt, 64).toString("hex")}`;
}

/** حوّل DATABASE_URL إلى مسار مطلق وأنشئ مجلده */
function ensureDbFile() {
  const raw = (process.env.DATABASE_URL || "file:/app/db/custom.db").replace(/^file:/, "");
  const abs = path.isAbsolute(raw) ? raw : path.join("/app", raw);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  if (!fs.existsSync(abs)) fs.writeFileSync(abs, "");
  console.log(`[init-db] database file: ${abs}`);
}

async function main() {
  ensureDbFile();

  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  const email = (process.env.ADMIN_EMAIL || "contact@cto-drs.com").trim().toLowerCase();
  const password = (process.env.ADMIN_PASSWORD || "").trim();

  // F-04: لا كلمات مرور افتراضية إطلاقاً — الفشل المغلق قبل أي إنشاء حساب
  if (!password || password.length < 12) {
    console.error(
      "[init-db] FAILED: اضبط ADMIN_PASSWORD (12 حرفاً على الأقل) و ADMIN_EMAIL قبل التهيئة — لا يوجد افتراضي (F-04)"
    );
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`[init-db] admin already exists: ${email}`);
  } else {
    await prisma.user.create({
      data: {
        name: "CTO-DRS",
        email,
        password: hashPassword(password),
        role: "admin",
      },
    });
    console.log(`[init-db] admin created: ${email}`);
  }

  await prisma.$disconnect();
  console.log("[init-db] done ✓");
}

main().catch((err) => {
  console.error("[init-db] FAILED:", err && err.message ? err.message : err);
  process.exit(1);
});
