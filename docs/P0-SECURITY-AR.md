# تنفيذ بطاقة P0 — التحصين الأمني الفوري (2026-11-09)

هذا المستند يوثق تنفيذ بنود بطاقة P0 من تقرير الفحص الشامل (2026-11-08)، مع طريقة التحقق من كل بند ومعيار قبوله. الدمج الأسبابي: فرع `feat/supabase-auth` دُمج في `main` (إغلاق F-05) قبل تطبيق هذه الطبقة.

## ملخص تنفيذي

| # | البند (P0) | المُخرَج | الحالة |
|---|---|---|---|
| 1 | طبقة حماية خادمية على `/api/admin/*` وقراءات البيانات الحساسة | `src/lib/session.ts` + حرس على 7 ملفات إدارية و3 قراءات حساسة | ✅ منفذ |
| 2 | إزالة حسابات العرض وأسرار `admin123`/`demo1234` | `scripts/seed.ts` + `scripts/init-db.js` + `README.md` | ✅ منفذ |
| 3 | التحقق الحي من RLS في Supabase | `supabase/verify-rls.sql` + توحيد `schema.sql` مع `migration-002.sql` | ⚙️ السكربت جاهز — التنفيذ الحي يتطلب لوحة Supabase |
| 4 | تقييد السرعة الخادمي على نقاط الكتابة العامة | `src/lib/rate-limit.ts` مطبق على 8 نقاط | ✅ منفذ |

## 1) المصادقة الخادمية (F-01 + F-02)

### التصميم
- **`src/lib/session.ts`**: توكن جلسة موقّع HMAC-SHA256 بصيغة `base64url(payload).hex(signature)`، حمولة `{sub, email, role, iat, exp}` وصلاحية 8 ساعات.
- يُرسل في **كوكي HttpOnly + SameSite=Lax** (وSecure في الإنتاج) ويُقبل أيضاً عبر `Authorization: Bearer <token>`.
- `requireAdmin(req)`: يتحقق من التوقيع والصلاحية ودور admin في التوكن، **ثم يتحقق حياً من الدور الفعلي في قاعدة البيانات** — فأي توكن قديم لمستخدم سُحبت صلاحيته يُرفض فوراً.
- **`POST /api/auth/login`** أصبح يصدر الجلسة (كوكي HttpOnly) بعد التحقق من كلمة المرور — لم تعد تُرجع JSON خالصاً بلا جلسة.
- نقاط `/api/auth/register` تُنشئ مستخدمين عاديين فقط (`role: "user"`) — لا مسار عام يمنح دور admin.

### النقاط المحمية بحرس `requireAdmin` (كل طلب بلا جلسة صالحة → 401)

| المسار | الطرق المحمية | الحماية السابقة |
|---|---|---|
| `/api/admin/users` | GET | لا شيء |
| `/api/admin/users/[id]` | PATCH (تغيير الأدوار)، DELETE | لا شيء |
| `/api/admin/comments` | GET | لا شيء |
| `/api/admin/comments/[id]` | DELETE | لا شيء |
| `/api/admin/stats` | GET | لا شيء |
| `/api/admin/subscribers` | GET | لا شيء |
| `/api/admin/subscribers/[id]` | DELETE | لا شيء |
| `/api/bookings` | GET (كل الحجوزات ببياناتها الشخصية)، PATCH (تغيير الحالة) | لا شيء — تسريب PII |
| `/api/contact` | GET (كل الرسائل ببيانات المرسلين) | لا شيء — تسريب PII |
| `/api/orders` | GET (كل الطلبات والتفاصيل المالية) | لا شيء — تسريب PII |

نقاط الكتابة العامة (`POST` على contact/bookings/comments/newsletter/orders) تبقى مفتوحة للزوار كما هو مصمم، وحمايتها عبر تقييد السرعة (البند 4).

### متغيرات البيئة المطلوبة في وضع الخادم
- `AUTH_SECRET` — سر التوقيع، **32 حرفاً على الأقل**. إن غاب: يُولَّد سر عشوائي مؤقت للعملية مع تحذير في السجل (الجلسات تسقط عند إعادة التشغيل) — **اضبطه دائماً في الإنتاج**.
- توليد قوي: `openssl rand -base64 48`

## 2) إزالة بيانات الدخول التجريبية (F-04)

- **`scripts/seed.ts`**: حُذف حساب المدير المعلن (`contact@cto-drs.com` / `admin123`) وحساب العميل التجريبي (`demo@ctodrs.com` / `demo1234`). حساب المدير الآن يُنشأ فقط عند ضبط `ADMIN_EMAIL` + `ADMIN_PASSWORD` (12 حرفاً على الأقل)، وإلا يُتخطى بتحذير واضح.
- **`scripts/init-db.js`**: حُذف الافتراضي `admin123` — السكربت **يفشل مغلقاً** (exit 1) بدون `ADMIN_PASSWORD` صالحة، فلا يمكن تهيئة بيئة بحساب ضعيف معروف.
- **`README.md`**: حُذف جدول «حسابات تجريبية» واستُبدل بتعليمات إنشاء حساب المدير من البيئة.
- **شاشة الدخول**: بطاقة بيانات الدخول السريعة كانت قد أزيلت في commit `ec14074` المدموج — الشجرة الآن بلا أي إشارة للنصين في الكود الفعلي.
- الاستثناء الوحيد للنصين في الشجرة: `docs/inspection-report.html` — وهو تقرير الفحص ذاته يقتبس النتيجة كدليل (توثيق تاريخي لا بيانات دخول فعالة).

### إجراء إلزامي على أي قاعدة حية
أي حساب مدير موجود بكلمة `admin123` في بيئة حية يجب إبطاله فوراً (تغيير كلمة المرور أو حذف الحساب وإنشاء حساب بديل قوي من متغيرات البيئة).

## 3) توحيد RLS + اختبار النفي (F-05 + F-06)

- **التوحيد**: `supabase/schema.sql` حُدّث ليطابق النسخة المشددة في `migration-002.sql`:
  - `contact_messages` insert: `with check ((user_id is null or user_id = auth.uid()) and status = 'new')` — بدل `with check (true)` المفتوح.
  - `bookings` insert: `with check (user_id = auth.uid() and status = 'pending')`.
  - أي تطبيق جديد للمخطط ينتج الحالة النهائية الصحيحة مباشرة، و`migration-002.sql` يبقى ترحيل البيئات المطبقة مسبقاً.
- **الاختبار الحي** (بند P0/3): افتح Supabase Dashboard → SQL Editor → نفّذ `supabase/verify-rls.sql` كاملاً.
  - المتوقع: **5 × PASS** — قراءة anon لـ contact_messages وbookings تفشل، إدخالات الحالات غير الصالحة ترفض، الإدخال المشروع (`status='new'` بلا user_id) ينجح.
  - المعاملة كاملة تتراجع في النهاية — لا بيانات تُكتب.
  - إن ظهر FAIL: طبّق `supabase/schema.sql` ثم `migration-002.sql` بالترتيب وأعد الاختبار.

> ⚠️ هذه الخطوة تحتاج دخولاً إلى لوحة Supabase الخاصة بالإنتاج — لا يمكن تنفيذها من المستودع وحده. سجّل النتيجة هنا بعد التنفيذ: **[ ] تم تنفيذ verify-rls.sql والنتيجة 5/5 PASS بتاريخ ______**

## 4) تقييد السرعة الخادمي (F-03)

**`src/lib/rate-limit.ts`**: نافذة ثابتة في الذاكرة لكل `bucket + IP` (أول قفزة من `x-forwarded-for` ثم `x-real-ip`)، مع سقف للمفاتيح (10,000) لمنع نمو الذاكرة بالعناوين المزيفة، واستجابة 429 موحدة مع ترويسة `Retry-After` ورسالة عربية.

| النقطة | الحد | النافذة |
|---|---|---|
| `POST /api/chat` (المساعد الذكي — أثر تكلفة مباشر) | 10 طلبات | 60 ثانية |
| `POST /api/auth/login` (مقاومة القوة الغاشمة) | 8 محاولات | 60 ثانية |
| `POST /api/auth/register` | 5 | 5 دقائق |
| `POST /api/contact` | 6 | 5 دقائق |
| `POST /api/bookings` | 6 | 5 دقائق |
| `POST /api/comments` | 6 | 5 دقائق |
| `POST /api/newsletter` | 6 | 5 دقائق |
| `POST /api/orders` | 10 | 5 دقائق |

ملاحظة معمارية: الخزين في الذاكرة يخدم البنية الحالية أحادية العملية (SQLite + standalone). عند التوزيع على عدة نسخ خلف موازن حمل ينتقل التخزين إلى Redis (خطة P1).

## التحقق العملي (معيار قبول P0)

بعد `bun run build && bun run start`:

```bash
# 1) كل الطلبات الإدارية بلا جلسة → 401
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/admin/users            # 401
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/admin/stats            # 401
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/bookings               # 401
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/contact                # 401
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/orders                 # 401

# 2) الدخول يصدر جلسة، وبعدها الواجهة الإدارية تعمل (200)
curl -s -c /tmp/cj -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"<بريد المدير>","password":"<كلمة مرور قوية>"}'                            # 200 + كوكي
curl -s -b /tmp/cj -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/admin/stats # 200

# 3) ضخ 20 طلباً متتالياً على /api/chat → 429 بعد الطلب العاشر
for i in $(seq 1 20); do
  curl -s -o /dev/null -w "%{http_code} " -X POST http://localhost:3000/api/chat \
    -H 'Content-Type: application/json' -d '{"messages":[{"role":"user","content":"hi"}]}'
done
# المتوقع: 200 ×10 ثم 429 ×10
```

## سجل التحقق

| التحقق | النتيجة | التاريخ |
|---|---|---|
| فحص الأنواع `tsc --noEmit` | ✅ نظيف لكل ملفات الإصلاح — الخطان الوحيدان في `examples/websocket` (سابقان: ملفات أمثلة لحزم غير مثبتة، خارج `src/`) | 2026-11-09 |
| بناء الإنتاج `bun run build` (standalone) | ✅ نجح — كل النقاط مسجلة كـ Dynamic | 2026-11-09 |
| اختبار 401 بلا جلسة | ✅ 401 على: users، stats، comments، subscribers، bookings، contact، orders | 2026-11-09 |
| الدخول والجلسة | ✅ دخول خاطئ 401 / صحيح 200 + كوكي `cto_drs_session` (HttpOnly + Secure + SameSite=lax + Max-Age 28800) | 2026-11-09 |
| النقاط الإدارية بالجلسة | ✅ 200 عبر الكوكي و200 عبر `Authorization: Bearer` | 2026-11-09 |
| تقييد سرعة `/api/chat` | ✅ ضخ 12 طلباً متتالياً: 200×10 ثم 429×2 (مع ترويسة Retry-After) | 2026-11-09 |
| `verify-rls.sql` على بيئة Supabase الحية | ⏳ يتطلب دخولاً إلى لوحة Supabase (خارج المستودع) | — |
| إبطال أي حساب مدير ضعيف حي | ⏳ يتطلب وصول الإنتاج | — |
