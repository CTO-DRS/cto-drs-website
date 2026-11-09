#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════
#  build-static.sh — بناء نسخة ثابتة من موقع CTO-DRS للنشر
#  على GitHub Pages المربوط بدومين Spaceship (cto-drs.com)
#
#  الخطوات:
#    0) التقاط لقطات JSON من سيرفر التطوير (يجب أن يكون شغّالاً) — قبل البناء
#       لأن إخفاء API وتنظيف الأنواع أثناء البناء قد يُسقط Turbopack dev
#    1) إخفاء مسارات API الديناميكية مؤقتًا (غير مدعومة في export)
#    2) next build بوضع static export → يخرج في .next-static
#    3) استعادة مسارات API فورًا (ليعود سيرفر التطوير للعمل)
#    4) نسخ الموقع إلى out/  +  تركيب اللقطات الملتقطة → out/data/
#       (إن فشل الالتقاط كلياً: الاحتفاظ بلقطات out/data السابقة إن وجدت)
#    5) CNAME + .nojekyll
# ═══════════════════════════════════════════════════════════
set -euo pipefail
cd "$(dirname "$0")/.."

API_DIR="src/app/api"
API_BACKUP="scripts/.api-hidden"
BUILD_DIR=".next-static"
OUT="out"
DEV_BASE="http://127.0.0.1:3000/api"

restore_api() {
  if [ -d "$API_BACKUP" ] && [ ! -d "$API_DIR" ]; then
    mv "$API_BACKUP" "$API_DIR"
    echo "↩ تمت إعادة مسارات API"
  fi
}
trap restore_api EXIT

# ── 0) التقاط لقطات البيانات قبل البناء ─────────────────────
# تُلتقط الآن لأن الخطوات التالية (إخفاء API + تنظيف الأنواع) قد تُسقط
# سيرفر التطوير فتفشل كل اللقطات كما حدث فعلاً (2026-11-09).
STAGING=".snapshots-tmp"
OLD_DATA=".snapshots-prev"
ENDPOINTS=(
  courses testimonials services projects products blog
  bookings orders contact github/apps
  admin/stats admin/users admin/subscribers admin/comments
)

echo "→ التقاط لقطات البيانات من ${DEV_BASE} (قبل البناء)…"
rm -rf "$STAGING" "$OLD_DATA"
mkdir -p "$STAGING"
# الاحتفاظ بلقطات البناء السابق كخطة بديلة إن فشل الالتقاط كلياً
[ -d "$OUT/data" ] && cp -a "$OUT/data" "$OLD_DATA" 2>/dev/null || true

ok_total=0
for ep in "${ENDPOINTS[@]}"; do
  dir="$(dirname "$ep")"
  [ "$dir" != "." ] && mkdir -p "$STAGING/$dir"
  captured=0
  for try in 1 2 3; do
    if curl -sf --max-time 20 "$DEV_BASE/$ep" -o "$STAGING/$ep.json"; then
      captured=1; ok_total=$((ok_total+1)); break
    fi
    sleep 2
  done
  if [ "$captured" = "1" ]; then
    echo "  ✓ /data/$ep.json"
  else
    echo "  ⚠ فشل اللقطة: $ep"
    rm -f "$STAGING/$ep.json"
  fi
done

echo "  اللقطات الملتقطة: $ok_total من ${#ENDPOINTS[@]}"

# ── 1) إخفاء مسارات API أثناء البناء ─────────────────────────
if [ -d "$API_DIR" ]; then
  mv "$API_DIR" "$API_BACKUP"
  echo "→ تم إخفاء مسارات API مؤقتًا للبناء الثابت"
fi

# ── 1.5) تنظيف الأنواع المولدة القديمة ───────────────────────
# مخلفات next dev / next build سابقة تضمّ tsconfig (‎.next/types و‎.next/dev/types)
# وتشير إلى مسارات API المخفية أعلاه فتفشل type-check على checkout غير نظيف.
# يولّد next build الأنواع من جديد أثناء البناء الثابت.
rm -rf .next/dev/types .next/types

# ── 2) البناء الثابت ─────────────────────────────────────────
echo "→ بناء النسخة الثابتة (STATIC_EXPORT=1)…"
STATIC_EXPORT=1 NEXT_PUBLIC_STATIC=1 bunx next build

# ── 3) استعادة API فورًا بعد البناء ──────────────────────────
restore_api
trap - EXIT
sleep 3  # مهلة قصيرة ليعيد سيرفر التطوير تجميع المسارات

# ── 4) تجهيز مجلد النشر ─────────────────────────────────────
echo "→ نسخ الموقع من ${BUILD_DIR} إلى ${OUT}/…"
rm -rf "$OUT"
mkdir -p "$OUT"
cp -a "$BUILD_DIR"/. "$OUT"/

# ── 5) تركيب اللقطات الملتقطة قبل البناء ────────────────────
mkdir -p "$OUT/data"
if [ "$ok_total" -gt 0 ]; then
  echo "→ تركيب $ok_total لقطة من ${STAGING}/…"
  cp -a "$STAGING"/. "$OUT/data/"
  rm -rf "$STAGING"
elif [ -d "$OLD_DATA" ] && ls "$OLD_DATA"/*.json >/dev/null 2>&1 || [ -d "$OLD_DATA/github" ]; then
  echo "→ فشل الالتقاط كلياً — إعادة لقطات البناء السابق من ${OLD_DATA}/"
  cp -a "$OLD_DATA"/. "$OUT/data/"
  rm -rf "$OLD_DATA"
else
  echo "⚠ لا لقطات إطلاقاً — الشاشات الديناميكية ستعرض رسائل بديلة"
  rm -rf "$OLD_DATA"
fi

# ── 6) ملفات الدومين ────────────────────────────────────────
echo "cto-drs.com" > "$OUT/CNAME"
touch "$OUT/.nojekyll"

echo ""
echo "✅ النسخة الثابتة جاهزة في ./out — $(du -sh "$OUT" | cut -f1)"
