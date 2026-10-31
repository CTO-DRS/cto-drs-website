#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════
#  build-static.sh — بناء نسخة ثابتة من موقع CTO-DRS للنشر
#  على GitHub Pages المربوط بدومين Spaceship (cto-drs.com)
#
#  الخطوات:
#    1) إخفاء مسارات API الديناميكية مؤقتًا (غير مدعومة في export)
#    2) next build بوضع static export → يخرج في .next-static
#    3) استعادة مسارات API فورًا (ليعود سيرفر التطوير للعمل)
#    4) نسخ الموقع إلى out/  +  لقطات JSON حية → out/data/
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

# ── 1) إخفاء مسارات API أثناء البناء ─────────────────────────
if [ -d "$API_DIR" ]; then
  mv "$API_DIR" "$API_BACKUP"
  echo "→ تم إخفاء مسارات API مؤقتًا للبناء الثابت"
fi

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

echo "→ التقاط لقطات البيانات من ${DEV_BASE}…"
mkdir -p "$OUT/data"
ENDPOINTS=(
  courses testimonials services projects products blog
  bookings orders contact github/apps
  admin/stats admin/users admin/subscribers admin/comments
)
for ep in "${ENDPOINTS[@]}"; do
  dir="$(dirname "$ep")"
  [ "$dir" != "." ] && mkdir -p "$OUT/data/$dir"
  ok=0
  for try in 1 2 3; do
    if curl -sf --max-time 20 "$DEV_BASE/$ep" -o "$OUT/data/$ep.json"; then
      ok=1; break
    fi
    sleep 2
  done
  if [ "$ok" = "1" ]; then
    echo "  ✓ /data/$ep.json"
  else
    echo "  ⚠ فشل اللقطة: $ep (ستعرض الشاشة رسالة بديلة)"
  fi
done

# ── 5) ملفات الدومين ────────────────────────────────────────
echo "cto-drs.com" > "$OUT/CNAME"
touch "$OUT/.nojekyll"

echo ""
echo "✅ النسخة الثابتة جاهزة في ./out — $(du -sh "$OUT" | cut -f1)"
