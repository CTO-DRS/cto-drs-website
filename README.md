# CTO.DRS — منصة المطور المتكاملة | Full-Stack Developer Platform

المنصة الرسمية لهوية **CTO-DRS** التقنية (Software Engineering • Cybersecurity • Innovation) — بأسلوب **Cyber Dashboard** ومبنية بـ **Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui + Prisma (SQLite)**.

A full-featured personal platform / cyber-dashboard styled portfolio with a complete admin console, built with Next.js 16 App Router, TypeScript, Tailwind CSS 4, shadcn/ui and Prisma (SQLite).

---

## ✨ المميزات | Features

### الواجهة العامة (Frontend)
- **الصفحة الرئيسية**: هيرو تفاعلي مع تأثير كتابة، خلفية جسيمات، إحصائيات حية
- **الخدمات والمشاريع**: عرض الخدمات بالأسعار، معرض المشاريع مع فلاتر
- **الدورات والمدونة**: تفاصيل الدورات، مقالات مع تعليقات وعدد مشاهدات
- **المتجر الرسمي**: منتجات رقمية، سلة مشتريات، إتمام شراء، قائمة مفضلات
- **الحجوزات**: نظام حجز استشارات بالتاريخ والفترة الزمنية
- **صفحات إضافية**: آراء العملاء، الأسئلة الشائعة، معرض الصور، الفيديوهات، الأدوات، الفعاليات، الخصوصية، الشروط
- **الحساب المستخدم**: تسجيل دخول/إنشاء حساب، متابعة الطلبات والحجوزات
- **قنوات التواصل الرسمية**: واتساب (حساب تجاري)، تيليجرام، تيك توك، إكس، إنستغرام، يوتيوب، جيت هب — مدمجة في الهيرو، الفوتر، صفحة التواصل وشاشة الحساب
- **مساعد ذكي**: محادثة AI مدعومة مع تصعيد مباشر لواتساب

### لوحة تحكم المدير (Admin Console) `#/dashboard`
| القسم | الإمكانيات |
|---|---|
| نظرة عامة | مؤشرات KPI حية (الإيرادات، الطلبات، الحجوزات، الرسائل، المشتركون، المستخدمون) + رسوم بيانية شهرية (Recharts) |
| الحجوزات | عرض وتغيير حالة الحجز (قيد الانتظار / مؤكد / مكتمل / ملغي) |
| الطلبات | جدول الطلبات مع الإجماليات والحالات |
| الرسائل | قراءة الرسائل، تعليم مقروء/غير مقروء، حذف، نسخ البريد، رد عبر واتساب |
| المستخدمون | قائمة المستخدمين مع نشاطهم، تغيير الصلاحيات (عميل/مدير)، حذف — مع حماية آخر مدير |
| المشتركون | قائمة النشرة البريدية + تصدير CSV + إزالة |
| التعليقات | إشراف كامل على تعليقات المقالات مع حذف المخالف |
| آراء العملاء | مراجعة وحذف الشهادات المنشورة |

---

## ⬇️ روابط التنزيل المباشر | Direct Downloads

جميع التطبيقات متوفرة كملفات جاهزة من **GitHub Releases** — روابط مباشرة بصيغة
`https://github.com/CTO-DRS/{repo}/releases/latest/download/{asset}` (تُحدَّث تلقائياً مع كل إصدار جديد).
مركز التحميل داخل الموقع: `#/downloads`

| التطبيق | الإصدار | رابط تنزيل مباشر |
|---|---|---|
| NexusLink (Android) | v3.1.0 | [NexusLink-3.1.0-release.apk](https://github.com/CTO-DRS/NexusLink/releases/latest/download/NexusLink-3.1.0-release.apk) |
| SecureNet VPN (Android) | v1.8.23 | [SecureNetVPN-debug-v1.8.23.apk](https://github.com/CTO-DRS/SecureNetVPN/releases/latest/download/SecureNetVPN-debug-v1.8.23.apk) |
| SuperBiz (Android) | v3.5.2 | [SuperBiz-v3.5.2-debug.apk](https://github.com/CTO-DRS/SuperBiz/releases/latest/download/SuperBiz-v3.5.2-debug.apk) |
| DRS Smart Keyboard (Android) | v1.4.2 | [DRS-Smart-Keyboard-v1.4.2.apk](https://github.com/CTO-DRS/DRS-Smart-Keyboard/releases/latest/download/DRS-Smart-Keyboard-v1.4.2.apk) |
| Onyx Keyboard (Android) | v1.0.0-privacy | [OnyxKeyboard-v1.0.0-privacy-release.apk](https://github.com/CTO-DRS/OnyxKeyboard/releases/latest/download/OnyxKeyboard-v1.0.0-privacy-release.apk) |
| NovaFiles (Android) | v0.41.0 | [NovaFiles-v0.41.0-release.apk](https://github.com/CTO-DRS/NovaFiles/releases/latest/download/NovaFiles-v0.41.0-release.apk) |
| Violet Chat (Android) | v0.1.14 | [app-universal-release.apk](https://github.com/CTO-DRS/VioletChat/releases/latest/download/app-universal-release.apk) |
| Lumina Studio (Android) | v1.1.0 | [LuminaStudio-v1.1.0-debug.apk](https://github.com/CTO-DRS/Lumina-Studio/releases/latest/download/LuminaStudio-v1.1.0-debug.apk) |
| لغة عربي (Python) | v1.37.0 | [arabi-lang-1.37.0.zip](https://github.com/CTO-DRS/arabi-lang/releases/latest/download/arabi-lang-1.37.0.zip) |
| DRS AI (Self-Hosted) | main | [الكود المصدري ZIP](https://github.com/CTO-DRS/DRS-AI-Web/archive/refs/heads/main.zip) |

> الكود المصدري لأي مستودع: `https://github.com/CTO-DRS/{repo}/archive/refs/heads/main.zip`
> API مباشر للإصدارات داخل الموقع: `GET /api/github/apps` (تخزين مؤقت 10 دقائق)

---

## 🚀 النشر على استضافة Spaceship (Hyperlift) | Deploy

المشروع جاهز للنشر على منصة **Spaceship Hyperlift** (تطبيقات Docker مرتبطة بـ GitHub):

1. **أنشئ التطبيق** (مرة واحدة): لوحة Spaceship → Hyperlift → Create application
   - اربط المستودع: `CTO-DRS/cto-drs-website` (فرع `main`)
   - `dockerfilePath` = `./Dockerfile` (جاهز في المستودع — بناء متعدد المراحل + SQLite تلقائي)
2. **بيانات المصادقة**: من [API Manager](https://www.spaceship.com/application/api-manager/) خذ القيمتين وضعهما في `.env`:
   ```bash
   SPACESHIP_API_KEY=...      # X-Api-Key (قصير)
   SPACESHIP_API_SECRET=...   # X-Api-Secret (64 حرفاً)
   ```
3. **انشر بسطر واحد**:
   ```bash
   bun run deploy:spaceship          # يضبط البيئة + يبني + يتابع السجلات + يطبع الرابط
   ```
4. **اربط دومينك**:
   ```bash
   bun scripts/deploy-spaceship.ts bind <yourdomain.com> <appDomain>
   ```

أوامر إضافية: `apps` · `app <id>` · `env <id>` · `env-set <id> K=V` · `build <id>` · `dns <domain>` · `domains`

> حساب المدير يُنشأ تلقائياً عند أول تشغيل (`scripts/init-db.js`) — تحكم به عبر `ADMIN_EMAIL` / `ADMIN_PASSWORD` في متغيرات بيئة التطبيق.

---

## 🚀 التشغيل المحلي | Getting Started

```bash
# 1) تثبيت الحزم
bun install

# 2) إعداد قاعدة البيانات
cp .env.example .env
bun run db:push

# 3) تعبئة بيانات تجريبية (اختياري)
bunx tsx scripts/seed.ts

# 4) التشغيل
bun run dev
```

افتح `http://localhost:3000`

### حسابات تجريبية | Demo Accounts
| الدور | البريد | كلمة المرور |
|---|---|---|
| مدير النظام | `admin@ctodrs.com` | `admin123` |
| عميل | `demo@ctodrs.com` | `demo1234` |

> لوحة التحكم: `http://localhost:3000/#/dashboard` (تتطلب دخول بحساب مدير)

---

## 🛠 التقنيات | Tech Stack

- **Next.js 16** (App Router) + **TypeScript 5**
- **Tailwind CSS 4** + **shadcn/ui** (New York) + Lucide Icons
- **Prisma ORM** + SQLite
- **Recharts** للرسوم البيانية، **Framer Motion** للحركات
- **z-ai-web-dev-sdk** للمساعد الذكي (Chatbot API)

## 📁 البنية | Structure

```
src/
├── app/
│   ├── api/            # REST API (auth, admin, orders, bookings, contact, ...)
│   └── page.tsx        # SPA shell مع hash router
├── components/
│   ├── screens/        # شاشات الصفحات (dashboard, store, blog, ...)
│   └── ui/             # مكونات shadcn/ui
└── lib/                # router, store, db, social, types
```

---

© CTO.DRS — مبني بشغف وأمان 🛡️
