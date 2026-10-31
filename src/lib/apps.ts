/* ═══════════════════════════════════════════════════════════
   مركز التحميل — تطبيقات CTO-DRS على GitHub Releases
   المصدر الرسمي: https://github.com/CTO-DRS
   روابط التنزيل المباشرة بصيغة:
   https://github.com/{owner}/{repo}/releases/latest/download/{asset}
   ─────────────────────────────────────────────────────────── */

export type AppCategory = "android" | "web" | "language" | "tool";

export interface AppReleaseAsset {
  /** اسم الملف داخل GitHub Release */
  file: string;
  /** وصف عربي مختصر للملف */
  label: string;
}

export interface AppEntry {
  id: string;
  repo: string;
  title: string;
  titleEn: string;
  description: string;
  category: AppCategory;
  platforms: string[];
  icon: string; // lucide icon name
  accent: "cyan" | "pink" | "purple" | "green" | "gold" | "orange";
  version: string;
  size: string;
  /** ملف التنزيل المباشر الأساسي (أحدث إصدار) */
  directFile: string;
  /** نوع الملف الأساسي: APK / AAB / ZIP */
  fileType: "APK" | "AAB" | "ZIP" | "SRC";
  /** ملفات إضافية داخل نفس الإصدار */
  extraAssets: AppReleaseAsset[];
  downloads: string; // عدّاد تقريبي محفوظ محليًا (يُحدَّث مباشرة من الـ API إن توفر)
  featured?: boolean;
}

export const GITHUB_OWNER = "CTO-DRS";

/** رابط تنزيل مباشر لأحدث إصدار يحتوي على ملف بهذا الاسم */
export function directReleaseUrl(repo: string, file: string): string {
  return `https://github.com/${GITHUB_OWNER}/${repo}/releases/latest/download/${file}`;
}

/** رابط تنزيل الكود المصدري ZIP من الفرع الافتراضي main */
export function sourceZipUrl(repo: string): string {
  return `https://github.com/${GITHUB_OWNER}/${repo}/archive/refs/heads/main.zip`;
}

/** صفحة الإصدارات الكاملة */
export function releasesPageUrl(repo: string): string {
  return `https://github.com/${GITHUB_OWNER}/${repo}/releases`;
}

/** صفحة المستودع */
export function repoPageUrl(repo: string): string {
  return `https://github.com/${GITHUB_OWNER}/${repo}`;
}

export const CATEGORY_LABELS: Record<AppCategory, string> = {
  android: "تطبيق أندرويد",
  web: "تطبيق ويب",
  language: "لغة برمجة",
  tool: "أداة مطورين",
};

export const CATEGORY_ICONS: Record<AppCategory, string> = {
  android: "Smartphone",
  web: "Globe",
  language: "Code2",
  tool: "Wrench",
};

/* ─── الكتالوج الرسمي: تطبيقات لها إصدارات حقيقية على GitHub ─── */

export const APPS: AppEntry[] = [
  {
    id: "nexuslink",
    repo: "NexusLink",
    title: "NexusLink — مركز أجهزتك المحلي",
    titleEn: "NexusLink",
    description:
      "مرآة الشاشة والتحكم عن بُعد، نقل الملفات، مزامنة الحافظة وبث الوسائط بين أجهزتك على الشبكة المحلية — بتشفير تام E2E بلا سحابة ولا حسابات. متوفر لأندرويد وماك.",
    category: "android",
    platforms: ["Android", "macOS"],
    icon: "MonitorSmartphone",
    accent: "cyan",
    version: "v3.1.0",
    size: "134 MB",
    directFile: "NexusLink-3.1.0-release.apk",
    fileType: "APK",
    extraAssets: [
      { file: "app-release.aab", label: "حزمة AAB للنشر على Google Play" },
      { file: "NexusLink.app.tar.gz", label: "إصدار macOS (شاشة وتحكم)" },
    ],
    downloads: "2K+",
    featured: true,
  },
  {
    id: "securenet-vpn",
    repo: "SecureNetVPN",
    title: "SecureNet VPN — خصوصية بمستوى المؤسسات",
    titleEn: "SecureNet VPN",
    description:
      "شبكة افتراضية خاصة ببروتوكول WireGuard مع ماسح أمان للجهاز ومحسّن شبكة — Kotlin + C++ (NDK) + Go بمعمارية MVVM نظيفة.",
    category: "android",
    platforms: ["Android"],
    icon: "ShieldCheck",
    accent: "green",
    version: "v1.8.23",
    size: "32 MB",
    directFile: "SecureNetVPN-debug-v1.8.23.apk",
    fileType: "APK",
    extraAssets: [],
    downloads: "4+",
    featured: true,
  },
  {
    id: "super-biz",
    repo: "SuperBiz",
    title: "SuperBiz — إدارة الأعمال دون اتصال",
    titleEn: "SuperBiz",
    description:
      "نظام إدارة أعمال أندرويد متكامل يعمل دون اتصال 100% — فواتير ومخزون ونقاط بيع متوافقة مع ZATCA مع أكثر من 1400 اختبار وحدة.",
    category: "android",
    platforms: ["Android"],
    icon: "Briefcase",
    accent: "purple",
    version: "v3.5.2",
    size: "26 MB",
    directFile: "SuperBiz-v3.5.2-debug.apk",
    fileType: "APK",
    extraAssets: [],
    downloads: "3+",
    featured: true,
  },
  {
    id: "drs-smart-keyboard",
    repo: "DRS-Smart-Keyboard",
    title: "DRS Smart Keyboard — لوحة مفاتيح عربية واعية بالخصوصية",
    titleEn: "DRS Smart Keyboard",
    description:
      "IME عربي أصلي بالكامل على أندرويد: ذكاء يعمل على الجهاز بلا إنترنت، خصوصية مثبتة، ونظام امتدادات (حزم ثيمات) موقّع تشفيرياً.",
    category: "android",
    platforms: ["Android"],
    icon: "Keyboard",
    accent: "pink",
    version: "v1.4.2",
    size: "12 MB",
    directFile: "DRS-Smart-Keyboard-v1.4.2.apk",
    fileType: "APK",
    extraAssets: [
      { file: "DRS-Smart-Keyboard-v1.4.2.aab", label: "حزمة AAB للنشر على Google Play" },
      { file: "pkg-amethyst-v1.0.0.flex", label: "حزمة ثيم Amethyst" },
      { file: "pkg-carbon-v1.0.0.flex", label: "حزمة ثيم Carbon" },
    ],
    downloads: "6+",
    featured: true,
  },
  {
    id: "onyx-keyboard",
    repo: "OnyxKeyboard",
    title: "Onyx Keyboard — حزمة الخصوصية والتخصيص",
    titleEn: "Onyx Keyboard",
    description:
      "لوحة مفاتيح أندرويد بتركيز كامل على الخصوصية والتخصيص — نسخة release خفيفة (2.4MB) ونسخة debug كاملة الميزات.",
    category: "android",
    platforms: ["Android"],
    icon: "SquareKanban",
    accent: "gold",
    version: "v1.0.0-privacy",
    size: "2.4 MB",
    directFile: "OnyxKeyboard-v1.0.0-privacy-release.apk",
    fileType: "APK",
    extraAssets: [
      { file: "OnyxKeyboard-v1.0.0-privacy-debug.apk", label: "نسخة Debug كاملة الميزات (19MB)" },
    ],
    downloads: "1+",
  },
  {
    id: "novafiles",
    repo: "NovaFiles",
    title: "NovaFiles — مدير ملفات حديث لأندرويد",
    titleEn: "NovaFiles",
    description:
      "مدير ملفات أندرويد بواجهة عصرية وإدارة كاملة للملفات والمجلدات — نسخة release مستقرة وخفيفة.",
    category: "android",
    platforms: ["Android"],
    icon: "FolderOpen",
    accent: "cyan",
    version: "v0.41.0",
    size: "6.4 MB",
    directFile: "NovaFiles-v0.41.0-release.apk",
    fileType: "APK",
    extraAssets: [
      { file: "NovaFiles-v0.41.0-src.zip", label: "الكود المصدري ZIP" },
    ],
    downloads: "30 إصدار",
  },
  {
    id: "violetchat",
    repo: "VioletChat",
    title: "Violet Chat — محادثات فورية أنيقة",
    titleEn: "Violet Chat",
    description:
      "تطبيق محادثة مفتوح المصدر مبني بـ Flutter/Dart — النسخة الشاملة universal متوافقة مع كل المعماريات مع ملف SHA256 للتحقق.",
    category: "android",
    platforms: ["Android"],
    icon: "MessagesSquare",
    accent: "purple",
    version: "v0.1.14",
    size: "43 MB",
    directFile: "app-universal-release.apk",
    fileType: "APK",
    extraAssets: [
      { file: "SHA256SUMS.txt", label: "ملف التحقق SHA256" },
    ],
    downloads: "6+",
  },
  {
    id: "lumina-studio",
    repo: "Lumina-Studio",
    title: "Lumina Studio — استوديو إبداعي",
    titleEn: "Lumina Studio",
    description:
      "تطبيق استوديو إبداعي لأندرويد — متوفر كنسخة APK جاهزة للتجربة وحزمة مصدر كاملة للمطورين.",
    category: "android",
    platforms: ["Android"],
    icon: "Sparkles",
    accent: "orange",
    version: "v1.1.0",
    size: "22 MB",
    directFile: "LuminaStudio-v1.1.0-debug.apk",
    fileType: "APK",
    extraAssets: [
      { file: "lumina-studio-v1.1.0-source.zip", label: "الكود المصدري ZIP" },
    ],
    downloads: "5+",
  },
  {
    id: "arabi-lang",
    repo: "arabi-lang",
    title: "لغة عربي — برمجة بالعربية الفصحى",
    titleEn: "Arabi Language",
    description:
      "لغة برمجة عربية بالكامل مثل بايثون: متغيرات، دوال، حلقات، قوائم وقواميس ومفسّر تفاعلي — حزمة ZIP جاهزة للتشغيل بـ Python.",
    category: "language",
    platforms: ["Python", "CLI"],
    icon: "Languages",
    accent: "green",
    version: "v1.37.0",
    size: "529 KB",
    directFile: "arabi-lang-1.37.0.zip",
    fileType: "ZIP",
    extraAssets: [],
    downloads: "18 إصدار",
    featured: true,
  },
  {
    id: "drs-ai",
    repo: "DRS-AI-Web",
    title: "DRS AI — نظام ذكاء اصطناعي خاص",
    titleEn: "DRS AI",
    description:
      "نظام تشغيل ذكاء اصطناعي مؤسسي بأكثر من 40 خدمة مصغرة — مستضاف ذاتياً، يعمل دون اتصال، ويدعم العربية والإنجليزية والفرنسية والألمانية. يتوفر حالياً كمصدر مباشر.",
    category: "web",
    platforms: ["Self-Hosted", "Electron"],
    icon: "BrainCircuit",
    accent: "cyan",
    version: "main",
    size: "—",
    directFile: "",
    fileType: "SRC",
    extraAssets: [],
    downloads: "مصدر",
    featured: true,
  },
];

/** المستودعات الإضافية الجاهزة للتنزيل كمصدر ZIP */
export const SOURCE_REPOS = [
  {
    id: "ultimate-ai-suite",
    repo: "Ultimate-AI-Suite",
    title: "Ultimate AI Suite",
    description: "صندوق أدوات ذكاء اصطناعي بلا مفاتيح API: محول عملات، مولد كلمات مرور، QR، منسق JSON — يعمل دون اتصال",
    icon: "Boxes",
    accent: "purple",
  },
  {
    id: "tiktok-bot",
    repo: "TikTokIntelligenceBot",
    title: "TikTok Intelligence Bot",
    description: "بوت تيليجرام للتحليلات والتتبع بتقارير متعددة الصيغ — Python",
    icon: "Bot",
    accent: "pink",
  },
  {
    id: "drs-bot-host",
    repo: "DRS-Bot-Host",
    title: "DRS Bot Host",
    description: "نظام استضافة وإدارة بوتات تيليجرام على الخوادم — Python",
    icon: "Server",
    accent: "green",
  },
  {
    id: "masar-al-lugha",
    repo: "masar-al-lugha",
    title: "مسار اللغة",
    description: "تطبيق تعلم لغات مفتوح المصدر مبني بـ Flutter/Dart",
    icon: "GraduationCap",
    accent: "gold",
  },
  {
    id: "battle-arena-lan",
    repo: "battle-arena-lan",
    title: "Battle Arena LAN",
    description: "لعبة قتال محلية عبر الشبكة LAN مبني بـ Godot/GDScript",
    icon: "Gamepad2",
    accent: "orange",
  },
  {
    id: "drs-os",
    repo: "drs-os",
    title: "DRS OS",
    description: "نظام تشغيل تجريبي لأندرويد مبني بـ Kotlin",
    icon: "Cpu",
    accent: "cyan",
  },
] as const;
