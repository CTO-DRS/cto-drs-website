/* ═══════════════ PORTFOLIO DATA — CTO.DRS Cyber Dashboard ═══════════════ */

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

export const PROFILE = {
  brand: "CTO.DRS",
  name: "رشيد نجيب الحداد",
  fullName: "رشيد نجيب سنان الحداد",
  role: "خبير أمن سيبراني دفاعي",
  roleEn: "Security Architect",
  tagline: "حلول برمجية متكاملة وأمن رقمي مستدام",
  bio1: "مطور برمجيات متكامل وخبير أمن سيبراني دفاعي، أؤمن بأن البرمجة ليست مجرد كتابة كود، بل هندسة لحلول مستدامة تدوم وتتطور مع نمو الأعمال. شغوف بكتابة كود نظيف وآمن وقابل للتوسع، مع التزام تام بمعايير الجودة العالمية.",
  bio2: "أعمل على مشاريع متنوعة من المواقع الشخصية وحتى الأنظمة المؤسسية المعقدة، مع تركيز خاص على دمج الأمان في كل مرحلة من مراحل التطوير. فلسفتي:",
  philosophy: "Security by Design",
  heroDesc:
    "مطور Full-Stack بخبرة تتجاوز 3 سنوات في بناء الأنظمة الرقمية وحلول الأمن السيبراني الدفاعي. متخصص في PHP و JavaScript و Python مع التزام تام بأعلى معايير الجودة والأمان.",
};

export const HERO_STATS = [
  { value: 266, suffix: "+", label: "PROJECTS" },
  { value: 4450, suffix: "+", label: "HOURS" },
  { value: 244, suffix: "+", label: "CLIENTS" },
  { value: 14, suffix: "+", label: "TECH" },
];

export const SKILLS: Skill[] = [
  { name: "PHP 8.2+", level: "EXPERT", percent: 88, icon: "Code2", category: "Back-end" },
  { name: "JavaScript", level: "EXPERT", percent: 90, icon: "Braces", category: "Front-end" },
  { name: "Python 3", level: "ADVANCED", percent: 80, icon: "Terminal", category: "Automation" },
  { name: "MySQL 8.0", level: "EXPERT", percent: 88, icon: "Database", category: "Database" },
  { name: "REST APIs", level: "EXPERT", percent: 90, icon: "Share2", category: "APIs" },
  { name: "Linux", level: "ADVANCED", percent: 85, icon: "Laptop", category: "Systems" },
  { name: "Git/GitHub", level: "EXPERT", percent: 90, icon: "GitBranch", category: "Tools" },
  { name: "OWASP Top 10", level: "EXPERT", percent: 90, icon: "ShieldCheck", category: "Security" },
];

export const MASTERY_BARS = [
  { name: "PHP 8.2+", percent: 88 },
  { name: "JavaScript", percent: 90 },
  { name: "Python", percent: 80 },
  { name: "MySQL", percent: 85 },
  { name: "Security", percent: 92 },
];

export const DASHBOARD_METRICS = [
  { label: "المشاريع المنشورة", value: 266, suffix: "+", badge: "نشط", icon: "FolderGit2", color: "cyan" },
  { label: "ساعات التطوير", value: 4450, suffix: "+", badge: "تراكمية", icon: "Clock", color: "purple" },
  { label: "العملاء الراضون", value: 244, suffix: "+", badge: "ولاء", icon: "Users", color: "pink" },
  { label: "التقنيات المتقنة", value: 14, suffix: "+", badge: "تنوع", icon: "Cpu", color: "green" },
];

export const ACHIEVEMENTS: Achievement[] = [
  { text: "إطلاق منصة CTO.DRS الشخصية", year: "2024" },
  { text: "تطوير نظام إدارة مستشفيات متكامل", year: "2024" },
  { text: "إطلاق سيكيورنت VPN للأندرويد", year: "2025" },
  { text: "تطوير REST API متكامل", year: "2023" },
];

export const PROJECTS: Project[] = [
  {
    id: "cto-drs-platform",
    title: "منصة CTO.DRS الشخصية",
    description:
      "الموقع الشخصي الرسمي — منصة تعريفية بنظام PHP آمن وأداء عالٍ ولوحة تحكم شاملة ومركز معرفة يغذي المساعد الذكي",
    image: "/images/project-platform.jpg",
    tags: ["PHP", "MYSQL", "JAVASCRIPT", "SECURITY"],
    stars: 42,
    forks: 8,
    featured: true,
  },
  {
    id: "securenet-vpn",
    title: "سيكيورنت VPN — خصوصية بمستوى المؤسسات",
    description: "شبكة افتراضية خاصة ببروتوكول WireGuard مع حماية شاملة للأجهزة وبمستوى المؤسسات",
    image: "/images/project-vpn.jpg",
    tags: ["KOTLIN", "ANDROID", "WIREGUARD"],
    stars: 128,
    forks: 24,
    featured: true,
  },
  {
    id: "nexus-link",
    title: "نكسس لينك — مركز تحكم أجهزتك محلياً",
    description:
      "مركز محلي واحد لأجهزتك: عرض الشاشة والتحكم عن بُعد، مزامنة الحافظة، ونقل الملفات — بتشفير تام من طرف إلى طرف عبر الشبكة المحلية",
    image: "/images/project-nexuslink.jpg",
    tags: ["TYPESCRIPT", "ANDROID", "CROSS-PLATFORM"],
    stars: 96,
    forks: 18,
    featured: true,
  },
  {
    id: "super-biz",
    title: "سوبر بيز — إدارة الأعمال المتكاملة",
    description:
      "نظام إدارة أعمال أندرويد متكامل: فواتير ومخزون ونقاط بيع متوافق مع فاتورة ZATCA ويعمل دون اتصال",
    image: "/images/project-superbiz.jpg",
    tags: ["KOTLIN", "ANDROID", "BUSINESS"],
    stars: 210,
    forks: 36,
    featured: true,
  },
  {
    id: "drs-ai",
    title: "نظام تشغيل الذكاء الاصطناعي DRS AI",
    description:
      "نظام تشغيل ذكاء اصطناعي مؤسسي بأكثر من 40 خدمة مصغرة — مستضاف ذاتياً، يعمل دون اتصال، ويدعم العربية بالكامل",
    image: "/images/project-drsai.jpg",
    tags: ["TYPESCRIPT", "AI", "ARABIC"],
    stars: 355,
    forks: 52,
    featured: true,
  },
  {
    id: "arabic-lang",
    title: "لغة عربي — برمجة بالعربية الفصحى",
    description: "لغة برمجة عربية بالكامل تشبه بايثون: متغيرات ودوال وحلقات وقوائم وقواميس ومفسّر كامل",
    image: "/images/project-arabiclang.jpg",
    tags: ["PYTHON", "ARABIC", "EDUCATIONAL"],
    stars: 480,
    forks: 65,
    featured: true,
  },
];

export const PERFORMANCE_STATS = [
  { value: 266, suffix: "+", label: "مشروع منجز", icon: "Rocket" },
  { value: 4450, suffix: "+", label: "ساعة تطوير", icon: "Clock" },
  { value: 244, suffix: "+", label: "عميل راضٍ", icon: "Users" },
  { value: 14, suffix: "+", label: "تقنية متقنة", icon: "Cpu" },
  { value: 8, suffix: "+", label: "نظام مُطور", icon: "Server" },
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
    title: "شهادة الأمن السيبراني",
    description: "شهادة معتمدة في الأمن السيبراني الدفاعي",
    image: "/images/gallery-cert-v2.jpg",
  },
  {
    title: "مكتب العمل",
    description: "مساحة العمل الخاصة مع أحدث الأجهزة",
    image: "/images/gallery-workspace.jpg",
  },
  {
    title: "نظام إدارة المستشفيات",
    description: "واجهة نظام إدارة المستشفيات المتكامل",
    image: "/images/gallery-hospital-v4.jpg",
  },
  {
    title: "بوت تيليجرام للأعمال",
    description: "لقطات من بوت تيليجرام لإدارة الطلبات",
    image: "/images/gallery-bot.jpg",
  },
];

export const QUICK_TOOLS = [
  {
    title: "حاسبة التكلفة",
    description: "احصل على تقدير فوري لتكلفة مشروعك في ثوانٍ",
    icon: "Calculator",
    color: "cyan",
  },
  {
    title: "حجز استشارة",
    description: "استشارة مجانية 30 دقيقة — اختر الوقت المناسب",
    icon: "CalendarClock",
    color: "purple",
  },
  {
    title: "الندوات والورش",
    description: "ندوات مباشرة ومسجلة في البرمجة والأمن السيبراني",
    icon: "Presentation",
    color: "pink",
  },
  {
    title: "الأسعار والباقات",
    description: "ابدأ مجاناً اليوم — باقات شفافة بدون رسوم خفية",
    icon: "Tags",
    color: "green",
  },
  {
    title: "مركز التحميل",
    description: "السيرة الذاتية، الشهادات، والموارد القابلة للتحميل",
    icon: "Download",
    color: "orange",
  },
];

export const SERVICES = [
  "تطوير مواقع ويب",
  "تطوير تطبيقات ويب",
  "تطوير تطبيقات الموبايل",
  "إنشاء لوحات تحكم",
  "برمجة أنظمة مخصصة",
  "تطوير بوتات تيليجرام",
];

export const NAV_LINKS = [
  { href: "#home", label: "الرئيسية", icon: "Home" },
  { href: "#about", label: "نبذة عني", icon: "User" },
  { href: "#services", label: "الخدمات", icon: "Wrench" },
  { href: "#projects", label: "المشاريع", icon: "Package" },
  { href: "#blog", label: "المدونة", icon: "BookOpen" },
  { href: "#contact", label: "التواصل", icon: "Mail" },
];

export const TYPING_ROLES = [
  "Security Architect",
  "Full-Stack Developer",
  "مطور برمجيات متكامل",
  "Cyber Defense Expert",
  "Systems Builder",
];
