/* ═══════════════ PORTFOLIO DATA — CTO-DRS Cyber Dashboard ═══════════════ */

export interface Skill {
  name: string;
  level: "EXPERT" | "ADVANCED" | "INTERMEDIATE";
  percent: number;
  icon: string; // lucide icon name
  category: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  url?: string;
  language?: string;
  stars?: number;
  forks?: number;
  featured?: boolean;
}

export interface Course {
  title: string;
  description: string;
  lessons: number;
  hours: number;
  level: string;
  students: string;
}

export interface Video {
  title: string;
  description: string;
  duration: string;
  thumb: string;
}

export interface ToolItem {
  name: string;
  description: string;
  version: string;
  size: string;
  downloads: string;
  icon: string;
}

export interface GalleryItem {
  title: string;
  description: string;
  image: string;
}

export interface Achievement {
  text: string;
  year: string;
}

/**
 * الملف التعريفي الرسمي — المصدر: GitHub Profile README (CTO-DRS/CTO-DRS)
 * https://github.com/CTO-DRS
 */
export const PROFILE = {
  brand: "CTO-DRS",
  name: "CTO-DRS",
  fullName: "CTO-DRS",
  role: "مهندس برمجيات وأمن سيبراني",
  roleEn: "Software Engineering • Cybersecurity • Innovation",
  tagline: "هندسة تجارب رقمية آمنة — تقنية مفيدة وقابلة للصيانة ومتاحة للجميع",
  bio1:
    "مطور تقني مهتم بهندسة البرمجيات والأمن السيبراني وتطوير تطبيقات أندرويد الأصلية والابتكار مفتوح المصدر. يجمع أسلوبي بين الاستكشاف التقني وحل المشكلات العملية ومبادئ الهندسة الآمنة والتعلم المستمر — أسعى لفهم كيف تعمل الأنظمة البرمجية، وتحسين موثوقيتها، وتقوية أمنها، وتحويل الأفكار إلى منتجات رقمية مفيدة.",
  bio2:
    "أؤمن بأن البرمجيات العظيمة يجب أن تكون أكثر من مجرد مظهر جذاب: موثوقة، سهلة الصيانة، واعية بالخصوصية، ومصممة بهدف واضح. هدفي:",
  philosophy: "Useful • Secure • Maintainable • Accessible",
  heroDesc:
    "مطور تقني مهتم بهندسة البرمجيات والأمن السيبراني وتطوير تطبيقات أندرويد الأصلية والابتكار مفتوح المصدر — أجمع بين الاستكشاف التقني وحل المشكلات العملية ومبادئ الهندسة الآمنة في مشاريع مفتوحة المصدر.",
};

/** إحصائيات حقيقية: 26 مستودعاً عاماً + 14 تقنية + 8 مجالات + 7 مبادئ (GitHub + Profile README) */
export const HERO_STATS = [
  { value: 26, suffix: "+", label: "REPOS" },
  { value: 14, suffix: "+", label: "TECH" },
  { value: 8, suffix: "", label: "DOMAINS" },
  { value: 7, suffix: "", label: "PRINCIPLES" },
];

export const SKILLS: Skill[] = [
  { name: "Kotlin & Jetpack Compose", level: "ADVANCED", percent: 85, icon: "Smartphone", category: "Android" },
  { name: "Cybersecurity", level: "ADVANCED", percent: 88, icon: "ShieldCheck", category: "Defensive Security" },
  { name: "Python", level: "ADVANCED", percent: 82, icon: "Terminal", category: "Automation" },
  { name: "JavaScript", level: "ADVANCED", percent: 85, icon: "Braces", category: "Web" },
  { name: "PHP", level: "ADVANCED", percent: 80, icon: "Code2", category: "Back-end" },
  { name: "Java", level: "INTERMEDIATE", percent: 74, icon: "Coffee", category: "Native Apps" },
  { name: "MySQL & SQLite", level: "ADVANCED", percent: 82, icon: "Database", category: "Data" },
  { name: "Linux & Bash", level: "ADVANCED", percent: 85, icon: "Laptop", category: "Systems" },
  { name: "Git & GitHub", level: "EXPERT", percent: 92, icon: "GitBranch", category: "Tooling" },
  { name: "Privacy Engineering", level: "ADVANCED", percent: 86, icon: "Lock", category: "Offline-First" },
];

export const MASTERY_BARS = [
  { name: "Kotlin / Android", percent: 85 },
  { name: "Cybersecurity", percent: 88 },
  { name: "Python", percent: 82 },
  { name: "JavaScript", percent: 85 },
  { name: "MySQL / SQLite", percent: 82 },
];

export const DASHBOARD_METRICS = [
  { label: "مستودعات مفتوحة المصدر", value: 26, suffix: "+", badge: "GitHub", icon: "FolderGit2", color: "cyan" },
  { label: "التقنيات والأدوات", value: 14, suffix: "+", badge: "تنوع", icon: "Cpu", color: "purple" },
  { label: "مجالات اهتمام تقني", value: 8, suffix: "", badge: "تركيز", icon: "Users", color: "pink" },
  { label: "مبادئ هندسية ملزمة", value: 7, suffix: "", badge: "التزام", icon: "ShieldCheck", color: "green" },
];

export const ACHIEVEMENTS: Achievement[] = [
  { text: "إطلاق المنصة الرسمية CTO-DRS — cto-drs.com", year: "2026" },
  { text: "بناء NexusLink — مركز أجهزة محلي بتشفير تام E2E", year: "2026" },
  { text: "إطلاق SecureNet VPN بمعمارية WireGuard", year: "2026" },
  { text: "تطوير لغة عربي — لغة برمجة عربية بالكامل", year: "2026" },
];

/** مشاريع حقيقية من مستودعات GitHub الرسمية (CTO-DRS) */
export const PROJECTS: Project[] = [
  {
    id: "nexuslink",
    title: "NexusLink — مركز أجهزتك المحلي",
    description:
      "ربط كل أجهزتك على شبكتك المحلية: مرآة الشاشة والتحكم عن بُعد، نقل الملفات، مزامنة الحافظة وبث الوسائط — بتشفير تام من طرف إلى طرف، بلا سحابة ولا حسابات",
    image: "/images/project-nexuslink.jpg",
    tags: ["TYPESCRIPT", "E2E-ENCRYPTED", "LOCAL-FIRST"],
    url: "https://github.com/CTO-DRS/NexusLink",
    language: "TypeScript",
    stars: 1,
    featured: true,
  },
  {
    id: "securenet-vpn",
    title: "SecureNet VPN — خصوصية بمستوى المؤسسات",
    description:
      "شبكة افتراضية خاصة ببروتوكول WireGuard مع ماسح أمان للجهاز ومحسّن شبكة — Kotlin + C++ (NDK) + Go بمعمارية MVVM نظيفة",
    image: "/images/project-vpn.jpg",
    tags: ["KOTLIN", "WIREGUARD", "SECURITY"],
    url: "https://github.com/CTO-DRS/SecureNetVPN",
    language: "Kotlin",
    featured: true,
  },
  {
    id: "super-biz",
    title: "SuperBiz — إدارة الأعمال دون اتصال",
    description:
      "نظام إدارة أعمال أندرويد متكامل يعمل دون اتصال 100% — فواتير ومخزون ونقاط بيع مع أكثر من 1400 اختبار وحدة",
    image: "/images/project-superbiz.jpg",
    tags: ["KOTLIN", "ANDROID", "OFFLINE-FIRST"],
    url: "https://github.com/CTO-DRS/SuperBiz",
    language: "Kotlin",
    featured: true,
  },
  {
    id: "drs-ai",
    title: "DRS AI — نظام ذكاء اصطناعي خاص",
    description:
      "نظام تشغيل ذكاء اصطناعي مؤسسي بأكثر من 40 خدمة مصغرة — مستضاف ذاتياً، يعمل دون اتصال بالكامل، ويدعم العربية والإنجليزية والفرنسية والألمانية",
    image: "/images/project-drsai.jpg",
    tags: ["TYPESCRIPT", "AI", "SELF-HOSTED"],
    url: "https://github.com/CTO-DRS/DRS-AI-Web",
    language: "TypeScript",
    stars: 1,
    featured: true,
  },
  {
    id: "arabi-lang",
    title: "لغة عربي — برمجة بالعربية الفصحى",
    description:
      "لغة برمجة عربية بالكامل مثل بايثون: متغيرات، دوال، حلقات، قوائم وقواميس ومفسّر تفاعلي — مبنية بـ Python",
    image: "/images/project-arabiclang.jpg",
    tags: ["PYTHON", "ARABIC", "LANGUAGES"],
    url: "https://github.com/CTO-DRS/arabi-lang",
    language: "Python",
    stars: 1,
    featured: true,
  },
  {
    id: "drs-smart-keyboard",
    title: "DRS Smart Keyboard — لوحة مفاتيح واعية بالخصوصية",
    description:
      "IME عربي أصلي بالكامل على أندرويد: ذكاء يعمل على الجهاز، خصوصية مثبتة، ونظام امتدادات موقّع تشفيرياً",
    image: "/images/project-platform.jpg",
    tags: ["KOTLIN", "IME", "PRIVACY"],
    url: "https://github.com/CTO-DRS/DRS-Smart-Keyboard",
    language: "Kotlin",
    featured: true,
  },
];

export const PERFORMANCE_STATS = [
  { value: 26, suffix: "+", label: "مستودع مفتوح المصدر", icon: "Rocket" },
  { value: 14, suffix: "+", label: "تقنية وأداة", icon: "Cpu" },
  { value: 8, suffix: "", label: "مجالات تقنية", icon: "Users" },
  { value: 7, suffix: "", label: "مبادئ هندسية", icon: "Server" },
  { value: 7, suffix: "+", label: "لغات برمجة", icon: "Code2" },
];

export const VIDEOS: Video[] = [
  {
    title: "بناء REST API آمن بـ PHP 8.2",
    description: "شرح عملي لبناء واجهة RESTful آمنة مع JWT و CSRF",
    duration: "15:32",
    thumb: "/images/video-1.jpg",
  },
  {
    title: "الأمن السيبراني الدفاعي في 2026",
    description: "مقدمة شاملة في الأمن الدفاعي وممارسات الحماية",
    duration: "22:10",
    thumb: "/images/video-2.jpg",
  },
  {
    title: "أتمتة المهام بـ Python و Cron",
    description: "دليل عملي لأتمتة المهام المتكررة على خوادم Linux",
    duration: "18:45",
    thumb: "/images/video-3.jpg",
  },
];

export const COURSES: Course[] = [
  {
    title: "احتراف PHP 8 من الصفر",
    description: "دورة شاملة لتعلم PHP 8 من الأساسيات حتى الاحتراف",
    lessons: 45,
    hours: 12,
    level: "متوسط",
    students: "1.2K",
  },
  {
    title: "الأمن السيبراني الدفاعي",
    description: "تعلم ممارسات الأمن الدفاعي وحماية الأنظمة",
    lessons: 30,
    hours: 10,
    level: "متقدم",
    students: "860",
  },
  {
    title: "بناء بوتات تيليجرام بـ Python",
    description: "دورة عملية لبناء بوتات تيليجرام احترافية",
    lessons: 20,
    hours: 8,
    level: "مبتدئ",
    students: "540",
  },
];

export const TOOLS: ToolItem[] = [
  {
    name: "DRS Security Scanner",
    description: "أداة فحص أمني للأنظمة وكشف الثغرات الشائعة",
    version: "v2.1.0",
    size: "4.2 MB",
    downloads: "1.3K",
    icon: "ShieldCheck",
  },
  {
    name: "Telegram Bot Framework",
    description: "إطار عمل PHP لبناء بوتات تيليجرام بسرعة",
    version: "v1.5.2",
    size: "2.8 MB",
    downloads: "890",
    icon: "Bot",
  },
  {
    name: "API Doc Generator",
    description: "مولد وثائق OpenAPI/Swagger تلقائياً من الكود",
    version: "v1.0.0",
    size: "1.5 MB",
    downloads: "430",
    icon: "FileCode2",
  },
];

export const GALLERY: GalleryItem[] = [
  {
    title: "لوحة تحكم متجر إلكتروني",
    description: "تصميم احترافي للوحة تحكم متجر إلكتروني",
    image: "/images/gallery-dashboard.jpg",
  },
  {
    title: "الأمن السيبراني الدفاعي",
    description: "مجال التركيز الأساسي: تقييم أمني وترميز آمن وإفصاح مسؤول",
    image: "/images/gallery-cert-v2.jpg",
  },
  {
    title: "مكتب العمل",
    description: "مساحة العمل الخاصة مع أحدث الأجهزة",
    image: "/images/gallery-workspace.jpg",
  },
  {
    title: "لوحات تحكم إدارية",
    description: "واجهات إدارية عربية بأسلوب Cyber Dashboard",
    image: "/images/gallery-hospital-v4.jpg",
  },
  {
    title: "TikTok Intelligence Bot",
    description: "بوت تيليجرام للتحليلات والتتبع بتقارير متعددة الصيغ",
    image: "/images/gallery-bot.jpg",
  },
];

export const QUICK_TOOLS = [
  {
    title: "حاسبة التكلفة",
    description: "احصل على تقدير فوري لتكلفة مشروعك في ثوانٍ",
    icon: "Calculator",
    color: "cyan",
    href: "#/booking",
  },
  {
    title: "حجز استشارة",
    description: "استشارة مجانية 30 دقيقة — اختر الوقت المناسب",
    icon: "CalendarClock",
    color: "purple",
    href: "#/booking",
  },
  {
    title: "الندوات والورش",
    description: "ندوات مباشرة ومسجلة في البرمجة والأمن السيبراني",
    icon: "Presentation",
    color: "pink",
    href: "#/events",
  },
  {
    title: "الأسعار والباقات",
    description: "ابدأ مجاناً اليوم — باقات شفافة بدون رسوم خفية",
    icon: "Tags",
    color: "green",
    href: "#/pricing",
  },
  {
    title: "مركز التحميل",
    description: "تنزيل مباشر لتطبيقاتي وأدواتي من GitHub Releases",
    icon: "Download",
    color: "orange",
    href: "#/downloads",
  },
];

export const SERVICES = [
  "تطوير تطبيقات أندرويد أصلية",
  "تطوير مواقع وتطبيقات ويب آمنة",
  "تقييم أمني واختبار اختراق أخلاقي",
  "أدوات وأتمتة بـ Python",
  "مشاريع مفتوحة المصدر",
  "هندسة الخصوصية وأنظمة offline-first",
];

export const NAV_LINKS = [
  { href: "#home", label: "الرئيسية", icon: "Home" },
  { href: "#about", label: "نبذة عني", icon: "User" },
  { href: "#services", label: "الخدمات", icon: "Wrench" },
  { href: "#projects", label: "المشاريع", icon: "Package" },
  { href: "#blog", label: "المدونة", icon: "BookOpen" },
  { href: "#contact", label: "التواصل", icon: "Mail" },
];

/** أسطر الكتابة المتحركة — من Profile README الرسمي */
export const TYPING_ROLES = [
  "Software Engineering",
  "Cybersecurity",
  "هندسة تجارب رقمية آمنة",
  "Native Android Development",
  "Open Source & Innovation",
  "Building Technology with Purpose",
];

/* ═══════════════ ABOUT / TIMELINE / VALUES ═══════════════ */

export interface TimelineItem {
  year: string;
  title: string;
  text: string;
}

export const ABOUT_TIMELINE: TimelineItem[] = [
  {
    year: "2024",
    title: "أساسيات الهندسة",
    text: "بناء قاعدة قوية في تطوير الويب: PHP و JavaScript و SQL، مع أولى أدوات الأتمتة بلغة Python.",
  },
  {
    year: "2025",
    title: "أندرويد أصلي",
    text: "التحول إلى تطوير تطبيقات أندرويد أصلية بـ Kotlin و Jetpack Compose مع تصميم يعمل دون اتصال أولاً.",
  },
  {
    year: "2026",
    title: "الأمن والخصوصية",
    text: "دمج الأمن الدفاعي وهندسة الخصوصية في كل مشروع: تقييم أمني، ترميز آمن، وتقليل جمع البيانات.",
  },
  {
    year: "2026",
    title: "هوية CTO-DRS",
    text: "توحيد المشاريع تحت مظلة واحدة مفتوحة المصدر: NexusLink، SecureNet VPN، SuperBiz، DRS AI، ولغة عربي.",
  },
];

export interface AboutValue {
  title: string;
  text: string;
  icon: string; // lucide icon name
}

/** المبادئ الهندسية السبعة — من Profile README الرسمي */
export const ABOUT_VALUES: AboutValue[] = [
  {
    title: "Security by Design",
    text: "اعتبار الأمن منذ المراحل الأولى للتطوير وليس كإضافة لاحقة — الأمان جزء من التصميم نفسه.",
    icon: "ShieldCheck",
  },
  {
    title: "Privacy by Design",
    text: "تقليل جمع البيانات غير الضرورية والحد من تعريضها — خصوصية المستخدم أولاً.",
    icon: "Lock",
  },
  {
    title: "هندسة قائمة على الأدلة",
    text: "التحقق من الادعاءات والنتائج التقنية بالتجربة والأدلة بدل الاعتماد على الافتراضات.",
    icon: "FlaskConical",
  },
  {
    title: "كود قابل للصيانة",
    text: "بنية واضحة وتنفيذ مفهوم وموثّق — يُقرأ قبل أن يُنفَّذ ويبقى قابلاً للتطور.",
    icon: "Code2",
  },
  {
    title: "بحث مسؤول",
    text: "احترام الترخيص والخصوصية والقوانين، والإفصاح المسؤول عن الثغرات عبر القنوات المناسبة.",
    icon: "Scale",
  },
  {
    title: "تحسين مستمر",
    text: "تعلم، تقييم، تحسين، ثم تحقق — دورة مستمرة تواكب التقنيات والتهديدات الناشئة.",
    icon: "GraduationCap",
  },
  {
    title: "تعاون مفتوح",
    text: "دعم الشفافية والتوثيق والتعلم المشترك عبر المشاريع مفتوحة المصدر.",
    icon: "GitBranch",
  },
];

/* ═══════════════ TEAM ═══════════════ */

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
  skills: string[];
  accent: "cyan" | "pink" | "purple" | "gold" | "green" | "orange";
}

export const TEAM: TeamMember[] = [
  {
    name: "CTO-DRS",
    role: "المؤسس · مهندس برمجيات وأمن سيبراني",
    bio: "مطور تقني مهتم بهندسة البرمجيات والأمن السيبراني وتطوير تطبيقات أندرويد الأصلية والابتكار مفتوح المصدر — يبني كل المشاريع تحت هوية CTO-DRS الموحدة: تقنية مفيدة، آمنة، قابلة للصيانة، ومتاحة للجميع.",
    initials: "CD",
    skills: ["Kotlin", "Cybersecurity", "Open Source"],
    accent: "cyan",
  },
];

/* ═══════════════ PRICING PLANS ═══════════════ */

export interface PricingPlan {
  name: string;
  tagline: string;
  monthly: number; // 0 = مجاني
  yearly: number; // سعر السنوي (شهرين مجاناً)
  featured?: boolean;
  cta: string;
  features: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "الأساسية",
    tagline: "للمشاريع الشخصية والبدايات",
    monthly: 0,
    yearly: 0,
    cta: "ابدأ مجاناً",
    features: [
      "استشارة تعريفية 30 دقيقة",
      "صفحة هبوط واحدة متجاوبة",
      "استضافة مجانية للمشاريع الصغيرة",
      "دعم عبر البريد الإلكتروني",
      "تقرير فحص أمني أساسي",
      "تحديثات شهرية للصيانة",
    ],
  },
  {
    name: "الاحترافية",
    tagline: "الأكثر طلباً — للشركات النامية",
    monthly: 999,
    yearly: 9990,
    featured: true,
    cta: "اشترك الآن",
    features: [
      "موقع أو متجر إلكتروني متكامل",
      "لوحة تحكم مخصصة بالعربية",
      "حماية OWASP Top 10 كاملة",
      "تحسين SEO وأداء 90+ في Lighthouse",
      "دعم فني ذو أولوية 24/7",
      "نسخ احتياطي يومي تلقائي",
      "تقارير أداء وأمان شهرية",
      "تحديثات المحتوى أسبوعياً",
    ],
  },
  {
    name: "المؤسسية",
    tagline: "للأنظمة المعقدة والفرق الكبيرة",
    monthly: 2499,
    yearly: 24990,
    cta: "تواصل للمفاضلة",
    features: [
      "نظام مخصص بالكامل حسب الطلب",
      "تطبيق موبايل مصاحب (اختياري)",
      "فريق مخصص للمشروع",
      "اختبار اختراق دوري معتمد",
      "اتفاقية مستوى خدمة SLA 99.9%",
      "تدريب فريقك على النظام",
      "تكامل مع أنظمتك الحالية",
      "دعم مخصص على مدار الساعة",
    ],
  },
];

export const PRICING_COMPARE = [
  { feature: "عدد الصفحات / الشاشات", basic: "حتى 5", pro: "غير محدود", ent: "غير محدود" },
  { feature: "لوحة تحكم إدارية", basic: "—", pro: "✓", ent: "✓ متقدمة" },
  { feature: "متجر إلكتروني", basic: "—", pro: "✓", ent: "✓ + نقاط بيع" },
  { feature: "فحص أمني دوري", basic: "شهري", pro: "أسبوعي", ent: "يومي" },
  { feature: "مدة الاستجابة للدعم", basic: "48 ساعة", pro: "8 ساعات", ent: "ساعة واحدة" },
  { feature: "نسخ احتياطي", basic: "أسبوعي", pro: "يومي", ent: "لحظي" },
];

/* ═══════════════ EVENTS (ندوات وورش) ═══════════════ */

export interface EventItem {
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  mode: "أونلاين" | "حضوري" | "مباشر";
  status: "upcoming" | "past";
  seats: string;
  topics: string[];
}

export const EVENTS: EventItem[] = [
  {
    title: "أساسيات الأمن السيبراني للأعمال الصغيرة",
    description: "ندوة عملية تشرح كيف تحمي شركتك الصغيرة من أشهر الهجمات الإلكترونية بخطوات بسيطة وقابلة للتطبيق فوراً.",
    date: "2026-02-12",
    time: "8:00 مساءً",
    duration: "90 دقيقة",
    mode: "أونلاين",
    status: "upcoming",
    seats: "متاح — 120 مقعداً",
    topics: ["التصيد الاحتيالي", "كلمات المرور", "النسخ الاحتياطي"],
  },
  {
    title: "ورشة: بناء REST API آمن بـ PHP 8",
    description: "ورشة تطبيقية نبني فيها واجهة برمجية كاملة مع مصادقة JWT وحماية CSRF وتوثيق OpenAPI.",
    date: "2026-02-25",
    time: "7:30 مساءً",
    duration: "3 ساعات",
    mode: "مباشر",
    status: "upcoming",
    seats: "مقاعد محدودة — 40 مقعداً",
    topics: ["PHP 8", "JWT", "OpenAPI"],
  },
  {
    title: "الذكاء الاصطناعي في تطوير الويب",
    description: "كيف توظف نماذج الذكاء الاصطناعي لتسريع كتابة الكود والاختبار والتوثيق دون التضحية بالأمان.",
    date: "2026-03-08",
    time: "9:00 مساءً",
    duration: "75 دقيقة",
    mode: "أونلاين",
    status: "upcoming",
    seats: "متاح — 200 مقعد",
    topics: ["AI Coding", "أتمتة", "أدوات"],
  },
  {
    title: "هاكاثون: بوت تيليجرام في 48 ساعة",
    description: "تحدي مفتوح لبناء بوت تيليجرام متكامل لإدارة الأعمال — جوائز للمشاريع الثلاثة الأولى.",
    date: "2026-03-20",
    time: "على مدار اليومين",
    duration: "48 ساعة",
    mode: "أونلاين",
    status: "upcoming",
    seats: "تسجيل الفرق مفتوح",
    topics: ["Python", "Bots", "Teamwork"],
  },
  {
    title: "ورشة: Python للمبتدئين من الصفر",
    description: "أُقيمت في يناير 2026 بحضور أكثر من 300 متدرب — تغطي الأساسيات والأتمتة وبناء أول سكربت عملي.",
    date: "2026-01-18",
    time: "انتهت",
    duration: "4 ساعات",
    mode: "مباشر",
    status: "past",
    seats: "اكتمل الحضور",
    topics: ["Python", "أتمتة", "أساسيات"],
  },
  {
    title: "ندوة: حماية تطبيقات الويب من OWASP Top 10",
    description: "أُقيمت في ديسمبر 2025 — جولة شاملة على أشهر الثغرات وكيفية صدّها مع أمثلة حية.",
    date: "2025-12-14",
    time: "انتهت",
    duration: "120 دقيقة",
    mode: "أونلاين",
    status: "past",
    seats: "اكتمل الحضور",
    topics: ["OWASP", "Web Security", "Pentest"],
  },
];

/* ═══════════════ NOTIFICATIONS ═══════════════ */

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  type: "order" | "booking" | "course" | "blog" | "system" | "security";
  read: boolean;
}

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    title: "تم تأكيد حجز استشارتك",
    body: "استشارتك المجانية مؤكدة يوم الأحد القادم الساعة 8 مساءً عبر Google Meet.",
    time: "منذ 5 دقائق",
    type: "booking",
    read: false,
  },
  {
    id: "n2",
    title: "طلبك قيد التجهيز",
    body: "طلب رقم #ORD-2841 (قوالب متجر إلكتروني) قيد المعالجة وسيصلك رابط التحميل قريباً.",
    time: "منذ ساعة",
    type: "order",
    read: false,
  },
  {
    id: "n3",
    title: "درس جديد أُضيف لدورتك",
    body: "أُضيف الدرس 32 «حماية الجلسات والكوكيز» لدورة الأمن السيبراني الدفاعي.",
    time: "منذ 3 ساعات",
    type: "course",
    read: false,
  },
  {
    id: "n4",
    title: "مقال جديد على المدونة",
    body: "«دليل حماية خادم Linux في 2026» — قراءة موصى بها لكل من يدير خوادماً.",
    time: "أمس",
    type: "blog",
    read: true,
  },
  {
    id: "n5",
    title: "تنبيه أمني",
    body: "ثغرة خطيرة في إضافات WordPress الشائعة — راجع موقعك وحدّث الإضافات فوراً.",
    time: "أمس",
    type: "security",
    read: false,
  },
  {
    id: "n6",
    title: "خصم على عنصر في مفضلتك",
    body: "قالب لوحة التحكم الاحترافية الذي في المفضلة أصبح بخصم 30% لفترة محدودة.",
    time: "منذ يومين",
    type: "order",
    read: true,
  },
  {
    id: "n7",
    title: "صيانة مجدولة للمنصة",
    body: "ستتوقف المنصة 15 دقيقة الجمعة 3 فجراً للترقية — لن تتأثر بياناتك.",
    time: "منذ 3 أيام",
    type: "system",
    read: true,
  },
  {
    id: "n8",
    title: "مرحباً بك في CTO-DRS 👋",
    body: "شكراً لانضمامك — استكشف الخدمات والدورات واحصل على استشارتك المجانية الأولى.",
    time: "منذ أسبوع",
    type: "system",
    read: true,
  },
];
