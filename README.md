# cto-drs.com

الموقع الرسمي لـ CTO.DRS — موقع ثابت ثنائي اللغة (عربي/إنجليزي) يُنشر عبر GitHub Pages من فرع `main`.

## البنية
- `index.html`, `services.html`, `projects.html`, `contact.html`, `404.html` — الصفحات
- `assets/styles.css` — التصميم كاملاً (خطوط مستضافة ذاتياً)
- `assets/main.js` — الترجمة (قاموس `I18N`)، القائمة، الحركات، نموذج التواصل
- `assets/og-image.png`, `assets/apple-touch-icon.png`, `assets/icon-512.png`, `site.webmanifest` — الهوية والمشاركة
- `CNAME` — النطاق المخصص `cto-drs.com`
- `deploy/` — دليل النشر وسكربت DNS على Spaceship

## إضافة نص جديد
أضف العنصر في HTML مع `data-i18n="key"` ثم أضف المفتاح في `I18N` داخل `assets/main.js` بالقيمتين `ar` و`en`.
