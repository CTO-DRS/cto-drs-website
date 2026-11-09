import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUT_DIR = '/home/z/my-project/public/images';

type ImgSize = '1152x864' | '1344x768' | '1024x1024' | '768x1344' | '864x1152' | '1440x720' | '720x1440';
const images: Array<{ name: string; prompt: string; size: ImgSize }> = [
  {
    name: 'profile.jpg',
    prompt:
      'Professional software developer working at a high-tech desk at night, RGB mechanical keyboard, multiple monitors displaying colorful code, cyan and magenta neon ambient lighting, cinematic, photorealistic, high quality, moody dark atmosphere',
    size: '1152x864',
  },
  {
    name: 'project-platform.jpg',
    prompt:
      'Modern personal brand website dashboard on a laptop screen, dark cyber theme UI with cyan and pink gradient accents, Arabic interface layout, glassmorphism cards, futuristic dashboard design, high quality screenshot mockup',
    size: '1344x768',
  },
  {
    name: 'project-vpn.jpg',
    prompt:
      'Smartphone showing a sleek VPN app interface, dark theme with glowing cyan shield icon and connection status, secure encryption concept, floating digital padlock hologram, dark tech background, high quality 3d render',
    size: '1344x768',
  },
  {
    name: 'project-nexuslink.jpg',
    prompt:
      'Multiple devices: laptop, tablet and phone connected with glowing cyan data streams, screen mirroring and file transfer concept, dark futuristic tech illustration with neon glow, high quality',
    size: '1344x768',
  },
  {
    name: 'project-superbiz.jpg',
    prompt:
      'Point of sale and business management app on Android tablet, invoice and inventory dashboard interface, dark modern UI with teal accents, retail store counter with receipt printer, photorealistic, high quality',
    size: '1344x768',
  },
  {
    name: 'project-drsai.jpg',
    prompt:
      'Futuristic AI operating system interface on a wide monitor, dark cyber dashboard with glowing neural network visualization, chat assistant panel, cyan and purple neon glow, high tech concept art, high quality',
    size: '1344x768',
  },
  {
    name: 'project-arabiclang.jpg',
    prompt:
      'Code editor screen displaying Arabic programming language syntax in right-to-left script, dark IDE theme with colorful syntax highlighting, terminal window beside it, futuristic developer workspace, high quality',
    size: '1344x768',
  },
  {
    name: 'video-1.jpg',
    prompt:
      'YouTube thumbnail for PHP REST API programming tutorial, laptop with code on screen, dark tech background with cyan neon glow, API architecture diagram overlay, professional educational style, high quality',
    size: '1344x768',
  },
  {
    name: 'video-2.jpg',
    prompt:
      'YouTube thumbnail for cybersecurity defensive tutorial, glowing digital shield and padlock hologram over dark server room, red and cyan neon lights, dramatic tech atmosphere, professional educational style, high quality',
    size: '1344x768',
  },
  {
    name: 'video-3.jpg',
    prompt:
      'YouTube thumbnail for Python automation tutorial, terminal window with green code on dark screen, automation gears and clock icons, glowing python snake logo neon, dark tech aesthetic, high quality',
    size: '1344x768',
  },
  {
    name: 'gallery-dashboard.jpg',
    prompt:
      'E-commerce admin dashboard UI on widescreen monitor, dark analytics theme with sales charts and product tables, modern SaaS interface design, purple and cyan accent colors, high quality screenshot',
    size: '1344x768',
  },
  {
    name: 'gallery-cert.jpg',
    prompt:
      'Elegant cybersecurity certificate of achievement with gold seal and ribbon, dark blue official document design with geometric security pattern border, professional, high quality',
    size: '1344x768',
  },
  {
    name: 'gallery-workspace.jpg',
    prompt:
      'Developer home office at night with ultrawide monitor setup, RGB lighting, mechanical keyboard, headphones on stand, plant, cozy cyberpunk atmosphere with cyan and pink LED glow, photorealistic, high quality',
    size: '1344x768',
  },
  {
    name: 'gallery-hospital.jpg',
    prompt:
      'Hospital management system interface on computer screen, medical dashboard with patient records and schedule, clean modern healthcare UI design with teal colors, professional medical technology, high quality',
    size: '1344x768',
  },
  {
    name: 'gallery-bot.jpg',
    prompt:
      'Telegram chatbot conversation interface on smartphone screen, business order management bot, dark theme messaging UI with robotic assistant avatar, glowing blue accents, high quality 3d render',
    size: '1344x768',
  },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const zai = await ZAI.create();

  for (const img of images) {
    const outPath = path.join(OUT_DIR, img.name);
    if (fs.existsSync(outPath)) {
      console.log(`skip ${img.name}`);
      continue;
    }
    let ok = false;
    for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
      try {
        const res = await zai.images.generations.create({
          prompt: img.prompt,
          size: img.size,
        });
        const b64 = res.data[0].base64;
        fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
        console.log(`ok ${img.name} (${(fs.statSync(outPath).size / 1024).toFixed(0)} KB)`);
        ok = true;
      } catch (e) {
        console.error(`fail ${img.name} attempt ${attempt}: ${e instanceof Error ? e.message : e}`);
        await new Promise((r) => setTimeout(r, 1500 * attempt));
      }
    }
  }
  console.log('ALL DONE');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
