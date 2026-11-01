/**
 * توليد أيقونات CTO-DRS الرسمية — بأسلوب الهوية السيبرانية
 * (بلاط متدرج #00f0ff→#7c3aed→#ff2a6d مع رمز الطرفية >_ )
 * الاستخدام: bun scripts/make-icons.mjs
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import pngToIco from "png-to-ico";

const OUT = "public/icons";

/* ── رمز الطرفية (محاكاة Lucide Terminal بسماكة أعرض) ── */
const GLYPH = `
  <g stroke="#030303" stroke-width="40" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M128 336 L224 240 L128 144"/>
    <path d="M256 368 L384 368"/>
  </g>`;

/* ── أيقونة قياسية (purpose: any) ── */
const iconSvg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff"/>
      <stop offset="50%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#ff2a6d"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="#030303"/>
  <rect x="64" y="64" width="384" height="384" rx="96" fill="url(#g)"/>
  ${GLYPH}
</svg>`;

/* ── أيقونة maskable (منطقة آمنة 80% + خلفية ممتدة) ── */
const maskableSvg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff"/>
      <stop offset="50%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#ff2a6d"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="#030303"/>
  <rect x="96" y="96" width="320" height="320" rx="80" fill="url(#g)"/>
  <g transform="translate(42.67,42.67) scale(0.83333)">
    ${GLYPH}
  </g>
</svg>`;

/* ── شعار SVG متجهي (نفس الهوية) ── */
const logoSvg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff"/>
      <stop offset="50%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#ff2a6d"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#g)"/>
  ${GLYPH}
</svg>`;

async function main() {
  const base = sharp(Buffer.from(iconSvg)).png();
  const maskable = sharp(Buffer.from(maskableSvg)).png();

  // الأحجام القياسية
  await base.clone().resize(512, 512).toFile(`${OUT}/icon-512.png`);
  await base.clone().resize(192, 192).toFile(`${OUT}/icon-192.png`);
  await maskable.clone().resize(512, 512).toFile(`${OUT}/icon-512-maskable.png`);
  await base.clone().resize(180, 180).toFile(`${OUT}/apple-touch-icon.png`);

  // favicon.ico (48 + 32 داخل ملف ico واحد)
  const png48 = await base.clone().resize(48, 48).png().toBuffer();
  const png32 = await base.clone().resize(32, 32).png().toBuffer();
  const ico = await pngToIco([png48, png32]);
  writeFileSync("public/favicon.ico", ico);

  // الشعار المتجهي
  writeFileSync("public/logo.svg", logoSvg.trim());

  console.log("✅ icons: 512, 192, maskable, apple-touch(180), favicon.ico, logo.svg");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
