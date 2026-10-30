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

/* ═══════════════ ABOUT / TIMELINE / VALUES ═══════════════ */

export interface TimelineItem {
  year: string;
  title: string;
  text: string;
}

export const ABOUT_TIMELINE: TimelineItem[] = [
  {
    year: "2019",
    title: "انطلاقة الرحلة",
    text: "البداية بتطوير مواقع شخصية ومتاجر صغيرة، وبناء أساس قوي في PHP و JavaScript وقواعد البيانات.",
  },
  {
    year: "2021",
    title: "أول نظام مؤسسي",
    text: "تطوير أول نظام إدارة أعمال متكامل بنقاط بيع وفواتير متوافقة مع الفاتورة الإلكترونية.",
  },
  {
    year: "2023",
    title: "التخصص في الأمن السيبراني",
    text: "التركيز على الأمن الدفاعي: اختبارات اختراق، تحصين خوادم، وبناء REST APIs آمنة بمعايير OWASP.",
  },
  {
    year: "2024",
    title: "إطلاق منصة CTO.DRS",
    text: "إطلاق المنصة الشخصية الرسمية كمركز معرفة ومساحة لعرض المشاريع والخدمات والدورات.",
  },
  {
    year: "2025",
    title: "منتجات رقمية عالمية",
    text: "إطلاق سيكيورنت VPN، نظام DRS AI، ولغة عربي للبرمجة — منتجات تخدم آلاف المستخدمين.",
  },
];

export interface AboutValue {
  title: string;
  text: string;
  icon: string; // lucide icon name
}

export const ABOUT_VALUES: AboutValue[] = [
  {
    title: "الأمان أولاً",
    text: "كل سطر كود يُكتب بمنظور Security by Design — الأمان جزء من التصميم وليس إضافة لاحقة.",
    icon: "ShieldCheck",
  },
  {
    title: "كود نظيف قابل للتوسع",
    text: "معايير صارمة في التنظيم والتوثيق، لأن الكود الجيد يُقرأ قبل أن يُنفَّذ.",
    icon: "Code2",
  },
  {
    title: "الالتزام بالمواعيد",
    text: "جدول زمني واضح منذ اليوم الأول، وتسليم منضبط دون تنازل عن الجودة.",
    icon: "Clock",
  },
  {
    title: "شفافية كاملة",
    text: "تواصل مستمر وتقارير تقدم دورية — تعرف حالة مشروعك في أي لحظة.",
    icon: "Eye",
  },
  {
    title: "تعلم مستمر",
    text: "متابعة يومية لأحدث التقنيات والتهديدات الأمنية لتبقى أنظمتك في المقدمة.",
    icon: "GraduationCap",
  },
  {
    title: "دعم ما بعد التسليم",
    text: "العلاقة لا تنتهي بالإطلاق — صيانة وتحديثات ودعم فني طويل الأمد.",
    icon: "LifeBuoy",
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
    name: "رشيد نجيب الحداد",
    role: "المؤسس · المدير التقني CTO",
    bio: "خبير أمن سيبراني دفاعي ومطور Full-Stack، يقود الرؤية التقنية ويعتمد معايير الجودة والأمان في كل مشروع.",
    initials: "ر.ح",
    skills: ["PHP", "Security", "Architecture"],
    accent: "cyan",
  },
  {
    name: "سارة العتيبي",
    role: "مهندسة واجهات أمامية",
    bio: "تحوّل التصاميم إلى واجهات حية سريعة وسلسة، مع شغف خاص بالتفاصيل الدقيقة وتجربة المستخدم.",
    initials: "س.ع",
    skills: ["React", "Next.js", "Animation"],
    accent: "pink",
  },
  {
    name: "محمد الغامدي",
    role: "مهندس خلفية وأنظمة",
    bio: "يبني قواعد البيانات وواجهات REST API بمعايير أمنية صارمة وأداء عالٍ تحت الضغط.",
    initials: "م.غ",
    skills: ["Node.js", "MySQL", "APIs"],
    accent: "purple",
  },
  {
    name: "لينا حسان",
    role: "مصممة تجربة مستخدم",
    bio: "تصميم واجهات عربية أنيقة تُحترم تفاصيلها — من التحليل حتى نموذج التصميم النهائي.",
    initials: "ل.ح",
    skills: ["UI/UX", "Figma", "Design Systems"],
    accent: "gold",
  },
  {
    name: "كريم الشامي",
    role: "مهندس DevOps",
    bio: "يشغّل البنية التحتية: خوادم مؤمنة، نشر آلي، مراقبة مستمرة، ونسخ احتياطي دون توقف.",
    initials: "ك.ش",
    skills: ["Linux", "Docker", "CI/CD"],
    accent: "green",
  },
  {
    name: "نور الهدى",
    role: "أخصائية محتوى تقني",
    bio: "توثّق الأنظمة وتكتب المحتوى التقني بالعربية بدقة، وتدير المدونة ومركز المعرفة.",
    initials: "ن.ه",
    skills: ["Technical Writing", "SEO", "Docs"],
    accent: "orange",
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
    title: "مرحباً بك في CTO.DRS 👋",
    body: "شكراً لانضمامك — استكشف الخدمات والدورات واحصل على استشارتك المجانية الأولى.",
    time: "منذ أسبوع",
    type: "system",
    read: true,
  },
];
