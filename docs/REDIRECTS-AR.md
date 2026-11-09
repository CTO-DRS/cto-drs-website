# خريطة الروابط القديمة → الجديدة (2026-11-09)

## الخلفية

كانت النسخة المنشورة على `cto-drs.com` حتى 2026-11-06 تحتوي صفحات HTML تسويقية
مستقلة لكل مسار (`/about/`، `/services/` … إضافة إلى نظيراتها الإنجليزية).
انتقل الموقع بعدها إلى تصدير Next.js الثابت من `main` — تطبيق صفحة واحدة
يعمل بتوجيه هاش داخلي (`#/about`) — فأصبحت كل الروابط القديمة تُرجع 404،
و`sitemap.xml` كان يعلن 16 رابطاً بلا وجهة.

## الحل المعتمد

صفحات تحويل (`noindex,follow` + `meta refresh 0s` + `location.replace`) في
`public/` تُنسخ تلقائياً إلى كل بناء، تحوّل كل رابط قديم إلى وجهته داخل الـ SPA:

| الرابط القديم | الوجهة |
| --- | --- |
| `/about/` | `#/about` |
| `/services/` | `#/services` |
| `/projects/` | `#/projects` |
| `/downloads/` | `#/downloads` |
| `/academy/` | `#/academy` |
| `/faq/` | `#/faq` |
| `/contact/` | `#/contact` |
| `/courses/` | `#/academy` |
| `/en/` | `/?lang=en` |
| `/en/about/` | `/?lang=en#/about` |
| `/en/services/` | `/?lang=en#/services` |
| `/en/projects/` | `/?lang=en#/projects` |
| `/en/downloads/` | `/?lang=en#/downloads` |
| `/en/academy/` | `/?lang=en#/academy` |
| `/en/faq/` | `/?lang=en#/faq` |
| `/en/contact/` | `/?lang=en#/contact` |
| `/en/courses/` | `/?lang=en#/academy` |

ملاحظات:
- الصفحات العربية تحافظ على `?lang=en` إن وُجد في رابط المصدر (السطر البرمجي يمرّر `location.search`).
- صفحات `/en/*` تفرض `?lang=en` ويقرأه الـ i18n (`src/i18n/index.tsx`) عند الإقلاع ويحفظه في `localStorage`.
- `/courses/` حافظت على وجهتها التاريخية (`الأكاديمية`) لكن بوجهة عاملة داخل الـ SPA.
- قسم `#/academy` هو قسم داخل الرئيسية (`HOME_SECTIONS` في `src/lib/router.tsx`) — يفتح الرئيسية ويمرّر إليه.

## sitemap.xml

يعلن الآن الروابط الحقيقية القابلة للفهرسة فقط (الرئيسية). صفحات التحويل
`noindex` فلا مكان لها في الـ sitemap — إبقاؤها يولّد أخطاء «Submitted URL
marked noindex» في Search Console.

## أثر SEO

- الروابط القديمة من نتائج البحث لم تعد 404: محرك البحث يتبع التحويل ويُحدّث الفهرس تدريجياً.
- العنوان والوصف وJSON-LD للصفحة الرئيسية كما هي — لا تغيير على الرابط الوحيد المفهرس.
