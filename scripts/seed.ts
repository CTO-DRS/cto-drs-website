import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

function dateInDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function daysAgo(days: number, hour = 12) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d;
}

async function main() {
  // F-09: السكربت هدّام (deleteMany على كل الجداول) — يرفض العمل على بيئة إنتاج
  if (process.env.NODE_ENV === "production") {
    console.error(
      "🛑 رفض التنفيذ: NODE_ENV=production — هذا السكربت يحذف كل بيانات القاعدة (deleteMany). " +
        "لا تُشغَّل التهيئة على الإنتاج أبداً؛ استخدم الترحيلات (prisma migrate) وإنشاء المدير من متغيرات البيئة."
    );
    process.exit(1);
  }
  console.log("🌱 بدء تهيئة قاعدة البيانات...");

  // ---- حذف البيانات القديمة (بترتيب الاعتماديات) ----
  await prisma.comment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.post.deleteMany();
  await prisma.product.deleteMany();
  await prisma.course.deleteMany();
  await prisma.project.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.subscriber.deleteMany();

  // ---- الخدمات (10) ----
  const servicesData = [
    {
      title: "تطوير متاجر إلكترونية",
      slug: "ecommerce-development",
      description:
        "نبني متاجرك الإلكترونية بأحدث التقنيات مع تجربة شراء سلسة وسرعة تحميل استثنائية. يشمل المشروع تكاملاً كاملاً بوابات الدفع المحلية والعالمية.",
      icon: "ShoppingCart",
      price: 4500,
      duration: "6-8 أسابيع",
      features: [
        "تصميم متجاوب بالكامل مع جميع الأجهزة",
        "بوابات دفع آمنة متعددة",
        "لوحة تحكم متكاملة لإدارة الطلبات",
        "تحسين محركات البحث SEO",
        "دعم فني مجاني لمدة 3 أشهر",
      ],
      category: "تطوير الويب",
      featured: true,
    },
    {
      title: "تطوير مواقع الشركات",
      slug: "corporate-websites",
      description:
        "مواقع تعكس هوية علامتك التجارية باحترافية وتصميم عصري جذاب. نصمم ونطور موقعاً سريعاً يحول الزوار إلى عملاء.",
      icon: "Globe",
      price: 2500,
      duration: "3-5 أسابيع",
      features: [
        "هوية بصرية متكاملة عبر الموقع",
        "نظام إدارة محتوى سهل الاستخدام",
        "نماذج تواصل وربط بقنوات التواصل",
        "أداء وسرعة محسّنة للغاية",
      ],
      category: "تطوير الويب",
      featured: false,
    },
    {
      title: "لوحات تحكم تحليلية",
      slug: "analytics-dashboards",
      description:
        "حوّل بياناتك إلى قرارات بذكاء عبر لوحات تحكم تفاعلية حية. نربط مصادر بياناتك المتعددة في واجهة واحدة واضحة.",
      icon: "LayoutDashboard",
      price: 3800,
      duration: "4-6 أسابيع",
      features: [
        "رسوم بيانية تفاعلية لحظية",
        "تقارير آلية دورية بالبريد",
        "صلاحيات متعددة المستويات",
        "تصدير البيانات بصيغ متعددة",
        "تكامل مع أدوات التحليل الخارجية",
      ],
      category: "تطوير الويب",
      featured: true,
    },
    {
      title: "اختبار اختراق تطبيقات الويب",
      slug: "web-pentesting",
      description:
        "نكتشف ثغرات تطبيقك قبل أن يكتشفها المهاجمون عبر منهجية اختبار شاملة. تقرير مفصل مع خطة إصلاح واضحة الأولويات.",
      icon: "Bug",
      price: 6000,
      duration: "2-3 أسابيع",
      features: [
        "فحص وفق قائمة OWASP العشرة",
        "اختبار يدوي وآلي متكامل",
        "محاكاة هجمات واقعية",
        "تقرير تقني وتنفيذي مفصل",
        "جلسة مراجعة مع فريقك التقني",
      ],
      category: "الأمن السيبراني",
      featured: false,
    },
    {
      title: "تدقيق أمني شامل",
      slug: "security-audit",
      description:
        "مراجعة أمنية معمقة تغطي البنية التحتية والتطبيقات والسياسات الداخلية. نمنحك خارطة طريق كاملة لتقوية وضعك الأمني.",
      icon: "ShieldCheck",
      price: 7500,
      duration: "3-4 أسابيع",
      features: [
        "تدقيق البنية التحتية والخوادم",
        "مراجعة الشيفرة المصدرية الأمنية",
        "تقييم سياسات الصلاحيات والوصول",
        "خطة معالجة مرتبة بالأولوية",
        "إعادة فحص بعد الإصلاحات",
      ],
      category: "الأمن السيبراني",
      featured: true,
    },
    {
      title: "مراقبة التهديدات والاستجابة",
      slug: "threat-monitoring",
      description:
        "نراقب أنظمتك على مدار الساعة ونستجيب للحوادث قبل أن تتوسع. فريق أمني متخصص يحمي أعمالك أثناء النوم والعمل.",
      icon: "Radar",
      price: 3200,
      duration: "اشتراك شهري",
      features: [
        "مراقبة لحظية على مدار الساعة",
        "تنبيهات فورية للتهديدات الحرجة",
        "استجابة أولى للحوادث خلال دقائق",
        "تقرير أمني شهري شامل",
      ],
      category: "الأمن السيبراني",
      featured: false,
    },
    {
      title: "تطوير تطبيقات iOS و Android",
      slug: "mobile-apps",
      description:
        "تطبيقات جوال أصلية وعبر المنصات بأداء عالٍ وتجربة استخدام راقية. من الفكرة إلى النشر على المتاجر ونحن معك.",
      icon: "Smartphone",
      price: 8000,
      duration: "8-12 أسبوع",
      features: [
        "تصميم واجهات أصيلة لكل منصة",
        "إشعارات فورية وتكاملات أصلية",
        "نشر كامل على المتاجر",
        "اختبارات على أجهزة حقيقية",
        "تحديثات ودعم لمدة 6 أشهر",
      ],
      category: "تطبيقات الجوال",
      featured: false,
    },
    {
      title: "استشارات التحول الرقمي",
      slug: "digital-transformation",
      description:
        "نساعدك على رسم استراتيجية رقمية واقعية تناسب حجم أعمالك وميزانيتك. من تقييم الوضع الحالي إلى خطة تنفيذ مرحلية.",
      icon: "Lightbulb",
      price: 1500,
      duration: "1-2 أسبوع",
      features: [
        "تقييم شامل للنضج الرقمي",
        "خارطة طريق مرحلية واقعية",
        "توصيات أدوات وحلول مناسبة",
        "جلسات متابعة مع الإدارة",
      ],
      category: "الاستشارات",
      featured: false,
    },
    {
      title: "تحسين الأداء والنمو",
      slug: "growth-optimization",
      description:
        "نحلل رحلة المستخدم في منصتك ونحسن نقاط التحويل بدقة. نتائج قابلة للقياس ترفع الإيرادات دون زيادة ميزانية الإعلانات.",
      icon: "TrendingUp",
      price: 1200,
      duration: "أسبوعان",
      features: [
        "تحليل سلوك المستخدمين",
        "اختبارات A/B مدروسة",
        "تحسين سرعة الصفحات الحرجة",
        "تقرير نتائج قبل وبعد",
      ],
      category: "الاستشارات",
      featured: false,
    },
    {
      title: "صيانة ودعم تقني",
      slug: "maintenance-support",
      description:
        "حافظ على أنظمتك محدثة وآمنة ومستقرة دون توظيف فريق داخلي. باقات مرنة تناسب احتياج مشاريعك المتغيرة.",
      icon: "Wrench",
      price: 500,
      duration: "اشتراك شهري",
      features: [
        "تحديثات أمنية دورية",
        "نسخ احتياطية مجدولة",
        "مراقبة التوفر والأداء",
        "أوقات استجابة مضمونة",
      ],
      category: "الاستشارات",
      featured: false,
    },
  ];

  for (const s of servicesData) {
    await prisma.service.create({
      data: { ...s, features: JSON.stringify(s.features) },
    });
  }
  console.log(`✓ الخدمات: ${servicesData.length}`);

  // ---- المشاريع (8) ----
  const projectsData = [
    {
      title: "NexusLink — مركز أجهزتك المحلي",
      slug: "nexuslink",
      description:
        "ربط كل أجهزتك على شبكتك المحلية: مرآة الشاشة والتحكم عن بُعد، نقل الملفات، مزامنة الحافظة وبث الوسائط — بتشفير تام من طرف إلى طرف، بلا سحابة ولا حسابات.",
      image: "/images/project-nexuslink.jpg",
      tags: ["TypeScript", "تشفير E2E", "محلي أولاً"],
      category: "أدوات",
      demoUrl: null,
      githubUrl: "https://github.com/CTO-DRS/NexusLink",
      year: 2026,
      featured: true,
    },
    {
      title: "SecureNet VPN — خصوصية بمستوى المؤسسات",
      slug: "securenet-vpn",
      description:
        "شبكة افتراضية خاصة ببروتوكول WireGuard مع ماسح أمان للجهاز ومحسّن شبكة — مبنية بـ Kotlin و C++ (NDK) و Go بمعمارية MVVM نظيفة.",
      image: "/images/project-vpn.jpg",
      tags: ["Kotlin", "WireGuard", "أمن"],
      category: "أمن",
      demoUrl: null,
      githubUrl: "https://github.com/CTO-DRS/SecureNetVPN",
      year: 2026,
      featured: true,
    },
    {
      title: "SuperBiz — إدارة الأعمال دون اتصال",
      slug: "superbiz",
      description:
        "نظام إدارة أعمال أندرويد متكامل يعمل دون اتصال 100%: فواتير ومخزون ونقاط بيع — مع أكثر من 1400 اختبار وحدة لضمان الموثوقية.",
      image: "/images/project-superbiz.jpg",
      tags: ["Kotlin", "Android", "offline-first"],
      category: "موبايل",
      demoUrl: null,
      githubUrl: "https://github.com/CTO-DRS/SuperBiz",
      year: 2026,
      featured: true,
    },
    {
      title: "DRS AI — نظام ذكاء اصطناعي خاص",
      slug: "drs-ai",
      description:
        "نظام تشغيل ذكاء اصطناعي مؤسسي بأكثر من 40 خدمة مصغرة — مستضاف ذاتياً، يعمل دون اتصال بالكامل، ويدعم العربية والإنجليزية والفرنسية والألمانية مع تطبيقات موبايل وسطح مكتب.",
      image: "/images/project-drsai.jpg",
      tags: ["TypeScript", "ذكاء اصطناعي", "self-hosted"],
      category: "ذكاء اصطناعي",
      demoUrl: null,
      githubUrl: "https://github.com/CTO-DRS/DRS-AI-Web",
      year: 2026,
      featured: true,
    },
    {
      title: "لغة عربي — برمجة بالعربية الفصحى",
      slug: "arabi-lang",
      description:
        "لغة برمجة عربية بالكامل مثل بايثون: متغيرات، دوال، حلقات، قوائم وقواميس ومفسّر تفاعلي — مشروع مفتوح المصدر مبني بلغة Python.",
      image: "/images/project-arabiclang.jpg",
      tags: ["Python", "لغة عربية", "مفتوح المصدر"],
      category: "أدوات",
      demoUrl: null,
      githubUrl: "https://github.com/CTO-DRS/arabi-lang",
      year: 2026,
      featured: true,
    },
    {
      title: "DRS Smart Keyboard — لوحة مفاتيح واعية بالخصوصية",
      slug: "drs-smart-keyboard",
      description:
        "لوحة مفاتيح (IME) عربية أصلية بالكامل على أندرويد: ذكاء يعمل على الجهاز، خصوصية مثبتة، ونظام امتدادات موقّع تشفيرياً.",
      image: "/images/project-platform.jpg",
      tags: ["Kotlin", "IME", "خصوصية"],
      category: "موبايل",
      demoUrl: null,
      githubUrl: "https://github.com/CTO-DRS/DRS-Smart-Keyboard",
      year: 2026,
      featured: false,
    },
    {
      title: "TikTok Intelligence Bot — بوت تحليلات تيليجرام",
      slug: "tiktok-intelligence-bot",
      description:
        "بوت تيليجرام لتحليل حسابات تيك توك: مسح وتحليلات وتتبع، وتقارير ثنائية اللغة بصيغ PDF/HTML/Excel/JSON — مبني بـ Python مع Docker و Celery و Redis و PostgreSQL.",
      image: "/images/gallery-bot.jpg",
      tags: ["Python", "Telegram Bot", "أتمتة"],
      category: "أتمتة",
      demoUrl: null,
      githubUrl: "https://github.com/CTO-DRS/TikTokIntelligenceBot",
      year: 2026,
      featured: false,
    },
    {
      title: "منصة CTO.DRS — هذا الموقع",
      slug: "cto-drs-website",
      description:
        "المنصة الرسمية بهوية CTO-DRS: معرض مشاريع ومتجر ودورات ومدونة ولوحة تحكم إدارية كاملة — مبنية بـ Next.js 16 و TypeScript و Prisma.",
      image: "/images/project-platform.jpg",
      tags: ["Next.js 16", "TypeScript", "Prisma"],
      category: "ويب",
      demoUrl: "https://cto-drs.xo.je/",
      githubUrl: "https://github.com/CTO-DRS/cto-drs-website",
      year: 2026,
      featured: false,
    },
  ];

  for (const p of projectsData) {
    await prisma.project.create({
      data: { ...p, tags: JSON.stringify(p.tags) },
    });
  }
  console.log(`✓ المشاريع: ${projectsData.length}`);

  // ---- الدورات (8) ----
  const coursesData = [
    {
      title: "تطوير تطبيقات الويب الحديثة بـ Next.js",
      slug: "nextjs-fullstack",
      description:
        "دورة شاملة تأخذك من أساسيات Next.js حتى بناء تطبيقات كاملة بمكونات الخادم والمصادقة وقواعد البيانات. ستبني في نهايتها منصة متكاملة جاهزة للإنتاج.",
      image: "/images/video-1.jpg",
      instructor: "د. رشا التقني",
      level: "متوسط",
      durationHours: 36,
      lessons: 48,
      price: 599,
      oldPrice: 899,
      rating: 4.9,
      students: 3200,
      category: "تطوير الويب",
      featured: true,
    },
    {
      title: "أساسيات الأمن السيبراني العملي",
      slug: "cybersecurity-fundamentals",
      description:
        "ابدأ مسارك في الأمن السيبراني من الصفر بمسار عملي يعتمد على السيناريوهات الحقيقية. تعلم حماية الأنظمة واكتشاف الثغرات والاستجابة للحوادث.",
      image: "/images/gallery-cert-v2.jpg",
      instructor: "م. خالد الحربي",
      level: "مبتدئ",
      durationHours: 24,
      lessons: 32,
      price: 499,
      oldPrice: 699,
      rating: 4.8,
      students: 4500,
      category: "الأمن السيبراني",
      featured: true,
    },
    {
      title: "إتقان TypeScript للمشاريع الاحترافية",
      slug: "typescript-mastery",
      description:
        "انتقل من JavaScript إلى TypeScript بثقة واكتشف قوة الأنواع في بناء تطبيقات ضخمة قابلة للصيانة. أنماط متقدمة وأدوات وأفضل الممارسات.",
      image: "/images/gallery-workspace.jpg",
      instructor: "م. سارة العتيبي",
      level: "متوسط",
      durationHours: 18,
      lessons: 26,
      price: 399,
      oldPrice: null,
      rating: 4.7,
      students: 2100,
      category: "لغات البرمجة",
      featured: false,
    },
    {
      title: "هندسة الذكاء الاصطناعي التطبيقي",
      slug: "applied-ai-engineering",
      description:
        "دورة متقدمة لبناء تطبيقات مدعومة بالنماذج اللغوية: التصميم الهندسي للموجهات وضبط النماذج والنشر في الإنتاج. مشروع تخرج حقيقي يضاف لمعرض أعمالك.",
      image: "/images/project-drsai.jpg",
      instructor: "د. رشا التقني",
      level: "متقدم",
      durationHours: 40,
      lessons: 64,
      price: 899,
      oldPrice: 1199,
      rating: 5.0,
      students: 1200,
      category: "الذكاء الاصطناعي",
      featured: true,
    },
    {
      title: "أمن تطبيقات الويب وفق OWASP",
      slug: "web-app-sec-owasp",
      description:
        "تعمق في أخطر ثغرات تطبيقات الويب ووسائل استغلالها ودفنها عملياً. مختبرات تفاعلية تحاكي هجمات حقيقية على تطبيقات تدريبية.",
      image: "/images/video-3.jpg",
      instructor: "م. خالد الحربي",
      level: "متقدم",
      durationHours: 28,
      lessons: 38,
      price: 699,
      oldPrice: null,
      rating: 4.8,
      students: 950,
      category: "الأمن السيبراني",
      featured: false,
    },
    {
      title: "أساسيات بايثون للبرمجة",
      slug: "python-basics",
      description:
        "دورة المبتدئين المثالية لبايثون: من أول سطر كود إلى بناء أدوات وبرامج كاملة. تمارين يومية ومشاريع صغيرة تثبّت المفاهيم.",
      image: "/images/video-2.jpg",
      instructor: "م. سارة العتيبي",
      level: "مبتدئ",
      durationHours: 20,
      lessons: 30,
      price: 199,
      oldPrice: null,
      rating: 4.6,
      students: 3800,
      category: "لغات البرمجة",
      featured: false,
    },
    {
      title: "بناء واجهات مستخدم تفاعلية بـ React",
      slug: "react-interfaces",
      description:
        "تعلم بناء واجهات عصرية تفاعلية بـ React وسلسلة أدواتها الحديثة. من المكونات والحالة إلى إدارة البيانات والتحسينات المتقدمة.",
      image: "/images/project-platform.jpg",
      instructor: "د. رشا التقني",
      level: "مبتدئ",
      durationHours: 22,
      lessons: 34,
      price: 349,
      oldPrice: 449,
      rating: 4.5,
      students: 2700,
      category: "تطوير الويب",
      featured: false,
    },
    {
      title: "تعلم الآلة من الصفر",
      slug: "machine-learning-zero",
      description:
        "افهم كيف تعمل خوارزميات التعلم الآلي فعلياً بدل الاكتفاء باستدعاء المكتبات. من الانحدار الخطي إلى الشبكات العصبية مع تطبيقات على بيانات حقيقية.",
      image: "/images/gallery-dashboard.jpg",
      instructor: "م. خالد الحربي",
      level: "متوسط",
      durationHours: 32,
      lessons: 52,
      price: 749,
      oldPrice: null,
      rating: 4.9,
      students: 1600,
      category: "الذكاء الاصطناعي",
      featured: false,
    },
  ];

  for (const c of coursesData) {
    await prisma.course.create({ data: c });
  }
  console.log(`✓ الدورات: ${coursesData.length}`);

  // ---- المقالات (6) ----
  const post1Content = `يظل أمن تطبيقات الويب أحد أهم التحديات التي تواجه فرق التطوير حول العالم، فمع تنامي الهجمات السيبرانية وتطور أساليبها لم يعد كافياً أن نبني تطبيقاً يعمل بشكل جيد فقط، بل يجب أن نضمن حماية بيانات المستخدمين وسلامة الأنظمة من الاستغلال.

## أشهر الثغرات الأمنية

تصنف منظمة OWASP سنوياً أخطر مخاطر أمن تطبيقات الويب، وتتصدر القائمة ثغرات مثل حقن SQL والتصريف عبر المواقع المسنّن XSS وكسر إدارة الجلسات، وتشترك هذه الثغرات جميعها في أصل واحد: عدم التحقق الصارم من مدخلات المستخدم.

في تجربتنا مع تدقيق مئات المشاريع، لاحظنا أن أغلب الاختراقات يمكن تصنيفها ضمن الأنماط التالية:

- حقن أوامر SQL عبر حقول البحث ونماذج التسجيل
- ثغرات XSS عبر التعليقات والمحتوى الذي يعرضه المستخدمون
- ضعف إدارة الجلسات وتخزين الرموز في أماكن غير آمنة
- إعدادات افتراضية غير محمية في الخوادم ولوحات التحكم

## خطوات عملية للتأمين

ابدأ دائماً بتفعيل التحقق من المدخلات على الخادم وليس في المتصفح فقط، فالمهاجم يتجاوز التحقق من جانب العميل بسهولة تامة، ثم استخدم استعلامات معلمة في كل تفاعل مع قاعدة البيانات ولا تلجأ أبداً إلى دمج النصوص مباشرة في الاستعلامات.

فعّل رؤوس الأمان HTTP مثل Content-Security-Policy وX-Frame-Options، وفرض استخدام HTTPS مع شهادات TLS حديثة، ولا تنسَ تحديث مكتباتك باستمرار فثغرات المكتبات القديمة تمثل اليوم نسبة كبيرة من الاختراقات الناجحة.

## الخلاصة

الأمن ليس ميزة تضاف في النهاية بل ممارسة تبدأ من أول سطر برمجي، ابدأ اليوم بمراجعة تطبيقاتك الحالية أمام قائمة OWASP العشرة، وستتفاجأ بعدد الثغرات القابلة للإصلاح في ساعة واحدة فقط.`;

  const post2Content = `أصدرت شركة Vercel الإصدار الجديد من Next.js ومعه مجموعة من الميزات التي ستغير طريقة بناء التطبيقات، ويأتي هذا الإصدار بعد رحلة تطور طويلة بدأها الإطار منذ سنوات ليصبح الخيار الأول لملايين المطورين حول العالم، وفي هذا المقال نستعرض أهم ما جاء به.

## تحسينات الأداء والخادم

تميز الإصدار الجديد بسرعة بناء استثنائية بفضل محرك التجميع المعاد كتابته بلغة Rust، حيث انخفض زمن التجميع بنسبة تصل إلى خمسة وسبعين بالمئة في المشاريع الكبيرة، كما تحسنت آلية التخزين المؤقت للبيانات لتصبح أكثر قابلية للتنبؤ والتحكم.

وشهدت مكونات الخادم تحسيناً كبيراً في التعامل مع تدفقات البيانات، مما يسمح بعرض المحتوى الحرج مبكراً بينما تظل الأجزاء الأبطأ تُحمَّل في الخلفية دون حجب الواجهة أو تعطيل التفاعل.

## تجربة المطور أولاً

ركز الفريق هذا العام على تبسيط واجهات برمجة التطبيقات، فأصبح التعامل مع المعاملات الديناميكية في مسارات التوجيه غير متزامن افتراضياً، وهو تغيير يضمن الاتساق ويفتح الباب أمام تحسينات مستقبلية مهمة في أداء التوجيه.

ومن أبرز التحسينات التي ستعجب المطورين في عملهم اليومي:

- رسائل خطأ أوضح مع إشارة مباشرة إلى الملف والسطر المسبب للمشكلة
- دعم محسّن لوضع التطوير مع إعادة تحميل أسرع بكثير
- أدوات تصحيح مدمجة لمكونات الخادم دون إضافات خارجية
- تبسيط إعداد متغيرات البيئة بين بيئات التطوير والإنتاج

## هل يجب الترقية الآن؟

إذا كنت تبدأ مشروعاً جديداً فالإجابة ببساطة نعم، أما المشاريع القائمة فينصح بالترقية تدريجياً بعد مراجعة دليل الترحيل الرسمي، ومعظم التطبيقات المتوسطة تم ترقيتها خلال يوم عمل واحد فقط دون مشاكل تذكر.`;

  const post3Content = `في عالم أصبحت فيه بياناتنا العملة الأغلى، أصبحت حماية الخصوصية مهارة أساسية لا رفاهية، فكل تطبيق نستخدمه وكل موقع نزوره يترك أثراً رقمياً يمكن استغلاله بطرق لم نتصورها أبداً، والخبر الجيد أن خطوات بسيطة يمكن أن تحميك من أغلب المخاطر.

## لماذا تهم الخصوصية الرقمية؟

البيانات الشخصية تُجمع وتُحلل وتُباع على نطاق واسع، فتُستخدم لتصميم إعلانات مستهدفة أو لتسعير الخدمات بأسعار متفاوتة حسب ملفك الشخصي، وفي أسوأ الحالات تتسرب قواعد البيانات الضخمة إلى الأسواق السوداء حيث تُستخدم في الاحتيال وانتحال الشخصية.

## خطوات عملية تبدأ بها اليوم

لا تحتاج إلى خبرة تقنية عميقة لحماية نفسك، لكنك تحتاج إلى الالتزام بمجموعة من العادات الجيدة التي تتراكم أثرها مع الوقت:

- فعّل المصادقة الثنائية على جميع حساباتك المهمة فوراً
- استخدم مدير كلمات مرور لتوليد كلمة فريدة لكل خدمة
- راجع أذونات التطبيقات على هاتفك وألغِ غير الضروري منها
- أوقف تتبع الإعلانات في متصفحك وامسح ملفات التعقب دورياً
- استخدم شبكات VPN موثوقة عند الاتصال بشبكات الواي فاي العامة

## الوعي خط الدفاع الأول

احذر رسائل التصيد التي تطلب بياناتك عبر البريد أو الرسائل النصية، وتذكر أن أي جهة رسمية لن تطلب كلمة مرورك أبداً، وقبل الضغط على أي رابط افحص عنوان المرسل بدقة تامة، وكلما زاد وعيك بأساليب المهاجمين قلّت فرص وقوعك في الفخاخ.`;

  const post4Content = `يختلف أداء المطور بين يومين عمل: الأول بلا أدوات مناسبة والثاني معها، في هذا المقال نستعرض حزمة أدوات أساسية سترفع إنتاجيتك وجودة كودك في آن واحد، وهي أدوات نستخدمها فعلياً في مشاريعنا اليومية داخل الشركة.

## محرر الكود والإضافات

يظل Visual Studio Code الخيار الأشهر بين المطورين بفضل توازنه النادر بين الخفة والقوة، أضف إليه إضافات مثل ESLint لفحص الكود آلياً وPrettier لتنسيقه تلقائياً وGitLens لتتبع تاريخ كل سطر في المشروع، وستحصل على بيئة تطوير متكاملة دون أي تعقيد إضافي.

## أدوات لا غنى عنها في يوم العمل

بعد سنوات من التجربة والتجريب، هذه قائمتنا المختصرة للأدوات التي تستحق مكاناً دائماً في حقيبتك التقنية:

- Postman لاختبار واجهات برمجة التطبيقات وتوثيقها
- Docker لتوحيد بيئة التطوير بين أعضاء الفريق
- Figma للتنسيق السريع مع فريق التصميم
- Oh My Zsh لسطر أوامر أسرع وأكثر جمالاً
- Notion لتنظيم المهام وتوثيق القرارات التقنية

## كيف تختار أدواتك؟

القاعدة الذهبية: الأداة التي تحل مشكلة قائمة لديك أفضل من الأداة الأكثر رواجاً في السوق، لا تقع في فخ تجريب كل جديد يظهر أمامك، بل اختر أدواتك بعناية وأتقنها بعمق، فالإتقان في عدد محدود من الأدوات يوفر وقتاً أضعف ما تكلفه التعلم المتكرر المتقطع.`;

  const post5Content = `لم يعد الذكاء الاصطناعي في تطوير البرمجيات موضوع مستقبل بعيد، بل واقع يومي يعيد تشكيل طريقة عملنا، فمن كتابة الكود إلى اختباره ونشره، تتغلغل النماذج الذكية في كل مرحلة من مراحل دورة حياة البرمجيات الحديثة.

## كيف يغير الذكاء الاصطناعي التطوير؟

أسرع ما يلاحظه المطورون هو تسريع كتابة الكود، فالمساعدات الذكية تقترح دوالاً كاملة وتشرح الأخطاء وتكتب الاختبارات، لكن التأثير الأعمق يكمن في تحويل المطور من كاتب أسطر إلى مهندس يراجع ويصمم ويقرر، وهذا تحول في طبيعة المهنة نفسها لا مجرد أداة جديدة تضاف إلى صندوق الأدوات.

## مجالات التطبيق الأكثر نضجاً

بعد تجربة هذه التقنيات في مشاريع حقيقية مع عملائنا، حددنا المجالات التي تحقق اليوم أثراً ملموساً وقابلاً للقياس:

- الإكمال الذكي للكود مع فهم لسياق المشروع كاملاً
- توليد حالات الاختبار وتغطية الحالات الحدية تلقائياً
- مراجعة الكود الأولية وكشف المشاكل قبل التسليم البشري
- تحويل مواصفات العملاء إلى نماذج أولية سريعة

## حدود التقنية ومسؤوليتنا

النماذج الذكية تخطئ بثقة، فقد تقترح كوداً يعمل لكنه غير آمن أو غير كفء في الأداء، لذلك تبقى المراجعة البشرية صمام الأمان الأساسي في أي فريق، والفرق الناجحة هي التي تعامل الذكاء الاصطناعي كمتدرب سريع التعلم لا كمهندس كبير، فتستثمر سرعته وتحافظ على حكمتها وخبرتها.`;

  const post6Content = `يسألني كثير من المبتدئين: من أين أبدأ؟ ومتى أصبح محترفاً؟ لا يوجد جواب سحري واحد، لكن توجد خارطة طريق واضحة يتشاركها كل من انتقل من الصفر إلى الاحتراف، وفي هذا المقال أرسمها لك خطوة بخطوة بناء على تجربتي في تأهيل عشرات المطورين.

## المرحلة الأولى: بناء الأساس الصلب

ابدأ بتعلم لغة واحدة بعمق بدلاً من القفز بين اللغات باستمرار، اختر JavaScript أو Python وأتقن المتغيرات والدوال والكائنات وآلية عمل الذاكرة، وبالتوازي تعلم أساسيات Git وسطر الأوامر، فهذه أدوات سترافقك في مهنتك كلها بلا استثناء.

## مرحلة البناء: مشاريع حقيقية

المعرفة التي لا تتحول إلى مشاريع تتبخر خلال أسابيع معدودة، ابدأ بمشاريع صغيرة تنتهي منها فعلاً ثم زد التعقيد تدريجياً مع نمو ثقتك:

- صفحة شخصية تعرض سيرتك الذاتية وتنشرها على الإنترنت
- تطبيق مهام مع حفظ دائم في قاعدة بيانات
- واجهة برمجية بسيطة مع نظام مصادقة للمستخدمين
- مشروع متكامل بحجم جيد تحل فيه مشكلة حقيقية

## الانتقال إلى الاحتراف

الاحتراف يعني أن تدير مشروعاً من الفكرة إلى الإنتاج: تكتب كوداً نظيفاً يفهمه فريقك، وتتعامل مع الأخطاء بهدوء وثقة، وتتعلم من مراجعات الكود بدافع التطور لا الدفاع، ودوّن رحلتك في مدونة أو حساب تقني فالمحتوى الذي تكتبه هو سيرتك الذاتية الحقيقية، وتذكر أن الاستمرارية أهم من السرعة في هذه الرحلة.`;

  const postsData = [
    {
      title: "دليل شامل لأمن تطبيقات الويب",
      slug: "دليل-أمن-تطبيقات-الويب",
      excerpt:
        "من حقن SQL إلى كسر الجلسات: تعرف على أخطر ثغرات تطبيقات الويب وكيف تحمي مشروعك بخطوات عملية مجربة.",
      content: post1Content,
      cover: "/images/video-1.jpg",
      author: "د. رشا التقني",
      tags: ["الأمن السيبراني", "تطوير الويب", "OWASP"],
      views: 12400,
      publishedAt: new Date("2025-01-12T09:00:00.000Z"),
    },
    {
      title: "أهم ميزات Next.js 16 الجديدة",
      slug: "nextjs-16-ميزات",
      excerpt:
        "سرعة بناء استثنائية ومكونات خادم أذكى وتجربة مطور محسنة: جولة في أهم ما جاء به الإصدار الجديد من Next.js.",
      content: post2Content,
      cover: "/images/project-platform.jpg",
      author: "م. خالد الحربي",
      tags: ["Next.js", "React", "تطوير الويب"],
      views: 8700,
      publishedAt: new Date("2025-02-08T10:30:00.000Z"),
    },
    {
      title: "كيف تحمي خصوصيتك رقمياً؟",
      slug: "حماية-الخصوصية-رقميا",
      excerpt:
        "خطوات عملية بسيطة تحمي بياناتك من الاستغلال: من المصادقة الثنائية إلى ضبط أذونات التطبيقات ومتصفحك.",
      content: post3Content,
      cover: "/images/project-vpn.jpg",
      author: "د. رشا التقني",
      tags: ["الخصوصية", "الأمن السيبراني", "نصائح"],
      views: 15300,
      publishedAt: new Date("2025-03-15T08:00:00.000Z"),
    },
    {
      title: "أدوات المطور الأساسية في 2025",
      slug: "أدوات-المطور-الأساسية",
      excerpt:
        "حزمة أدوات مختارة بعناية سترفع إنتاجيتك اليومية وجودة كودك، من محرر الكود إلى إدارة المهام والاختبار.",
      content: post4Content,
      cover: "/images/gallery-workspace.jpg",
      author: "م. سارة العتيبي",
      tags: ["أدوات", "إنتاجية", "مطورين"],
      views: 6800,
      publishedAt: new Date("2025-04-20T11:00:00.000Z"),
    },
    {
      title: "الذكاء الاصطناعي في تطوير البرمجيات",
      slug: "الذكاء-الاصطناعي-في-التطوير",
      excerpt:
        "كيف تعيد النماذج الذكية تشكيل مهنة البرمجة؟ مجالات التطبيق الناضجة، وحدود التقنية، ودور المطور في العصر الجديد.",
      content: post5Content,
      cover: "/images/project-drsai.jpg",
      author: "د. رشا التقني",
      tags: ["الذكاء الاصطناعي", "برمجة", "مستقبل"],
      views: 11200,
      publishedAt: new Date("2025-05-10T09:30:00.000Z"),
    },
    {
      title: "من المبتدئ إلى المحترف: خارطة طريق البرمجة",
      slug: "من-المبتدئ-إلى-المحترف",
      excerpt:
        "خارطة طريق واضحة ومراحل عملية للانتقال من الصفر إلى الاحتراف، بمشاريع حقيقية تثبّت كل مهارة تتعلمها.",
      content: post6Content,
      cover: "/images/gallery-cert-v2.jpg",
      author: "م. خالد الحربي",
      tags: ["تعلم", "مسار مهني", "برمجة"],
      views: 9500,
      publishedAt: new Date("2025-06-01T07:45:00.000Z"),
    },
  ];

  const createdPosts: { id: string; slug: string }[] = [];
  for (const p of postsData) {
    const created = await prisma.post.create({
      data: { ...p, tags: JSON.stringify(p.tags) },
    });
    createdPosts.push({ id: created.id, slug: created.slug });
  }
  console.log(`✓ المقالات: ${createdPosts.length}`);

  // ---- المنتجات (12) ----
  const productsData = [
    {
      name: "قالب متجر إلكتروني سايبر",
      slug: "cyber-ecommerce-template",
      description:
        "قالب متجر إلكتروني بتصميم سايبر عصري متجاوب بالكامل، جاهز للربط بأي بوابة دفع ولوحة تحكم عربية كاملة.",
      price: 249,
      oldPrice: 349,
      image: "",
      category: "قوالب",
      rating: 4.8,
      sales: 1850,
      featured: true,
    },
    {
      name: "قالب لوحة تحكم إدارية",
      slug: "admin-dashboard-template",
      description:
        "لوحة تحكم إدارية غنية بالمكونات: رسوم بيانية، جداول، صلاحيات، ووضع داكن، مبنية بـ React و Tailwind.",
      price: 199,
      oldPrice: null,
      image: "/images/gallery-dashboard.jpg",
      category: "قوالب",
      rating: 4.7,
      sales: 940,
      featured: false,
    },
    {
      name: "قالب موقع شركة سايبر",
      slug: "corporate-cyber-template",
      description:
        "قالب موقع شركة متعدد الصفحات بهوية سايبر داكنة، يتضمن صفحات خدمات ومشاريع ومدونة ونماذج تواصل.",
      price: 149,
      oldPrice: 199,
      image: "",
      category: "قوالب",
      rating: 4.6,
      sales: 720,
      featured: false,
    },
    {
      name: "قالب مدونة تقنية عربية",
      slug: "arabic-tech-blog-template",
      description:
        "قالب مدونة مصمم خصيصاً للمحتوى العربي بدعم RTL كامل، قراءة مريحة وسرعة عالية وتحسين لمحركات البحث.",
      price: 99,
      oldPrice: null,
      image: "/images/video-3.jpg",
      category: "قوالب",
      rating: 4.5,
      sales: 480,
      featured: false,
    },
    {
      name: "أداة فحص الثغرات السيبرانية",
      slug: "vuln-scanner-tool",
      description:
        "أداة سطر أوامر تفحص تطبيقات الويب بحثاً عن الثغرات الشائعة وتصدر تقريراً مفصلاً بأولويات الإصلاح.",
      price: 399,
      oldPrice: null,
      image: "/images/project-vpn.jpg",
      category: "أدوات",
      rating: 4.9,
      sales: 310,
      featured: true,
    },
    {
      name: "مولّد التقارير الأمنية الآلي",
      slug: "security-report-generator",
      description:
        "يحول نتائج الفحص الخام إلى تقارير أمنية احترافية بالعربية والإنجليزية جاهزة للعرض على الإدارة.",
      price: 299,
      oldPrice: 399,
      image: "",
      category: "أدوات",
      rating: 4.7,
      sales: 260,
      featured: false,
    },
    {
      name: "أداة مراقبة الأداء اللحظية",
      slug: "perf-monitor-tool",
      description:
        "راقب استهلاك الموارد وأزمنة الاستجابة لوحداتك لحظياً مع تنبيهات ذكية عند تجاوز الحدود المسموحة.",
      price: 349,
      oldPrice: null,
      image: "/images/gallery-workspace.jpg",
      category: "أدوات",
      rating: 4.8,
      sales: 190,
      featured: false,
    },
    {
      name: "إضافة دردشة ذكية للمواقع",
      slug: "smart-chat-widget",
      description:
        "إضافة دردشة تعمل بالذكاء الاصطناعي تجيب زوار موقعك بالعربية وتجمع العملاء المحتملين على مدار الساعة.",
      price: 179,
      oldPrice: 229,
      image: "/images/gallery-bot.jpg",
      category: "إضافات",
      rating: 4.6,
      sales: 1250,
      featured: true,
    },
    {
      name: "إضافة تحسين الصور التلقائي",
      slug: "image-optimizer-plugin",
      description:
        "ضغط وتحويل الصور تلقائياً عند الرفع إلى صيغ حديثة، مواقع أسرع وتجربة أفضل دون مجهود يدوي.",
      price: 89,
      oldPrice: null,
      image: "",
      category: "إضافات",
      rating: 4.4,
      sales: 890,
      featured: false,
    },
    {
      name: "كتاب أساسيات الأمن الدفاعي",
      slug: "defense-security-book",
      description:
        "كتاب عملي يغطي مبادئ بناء طبقات دفاعية متعددة: من تأمين الخوادم إلى تصميم أنظمة كشف التسلل.",
      price: 79,
      oldPrice: null,
      image: "",
      category: "كتب",
      rating: 4.9,
      sales: 2400,
      featured: false,
    },
    {
      name: "كتاب تعلم البرمجة من الصفر",
      slug: "learn-programming-book",
      description:
        "دليل المبتدئين الشامل لفهم أساسيات البرمجة والمنطق الحاسوبي بأمثلة عربية وتمارين محلولة خطوة بخطوة.",
      price: 59,
      oldPrice: 89,
      image: "",
      category: "كتب",
      rating: 4.7,
      sales: 1500,
      featured: true,
    },
    {
      name: "كتاب هندسة البرمجيات الحديثة",
      slug: "software-engineering-book",
      description:
        "من تصميم الأنظمة إلى النشر المستمر: مبادئ هندسة البرمجيات التي تفرق بين مشروع ناجح وكابسة تقنية.",
      price: 99,
      oldPrice: null,
      image: "/images/video-2.jpg",
      category: "كتب",
      rating: 4.8,
      sales: 620,
      featured: false,
    },
  ];

  for (const p of productsData) {
    await prisma.product.create({ data: p });
  }
  console.log(`✓ المنتجات: ${productsData.length}`);

  // ---- المستخدمون ----
  // بيانات الدخول التجريبية الثابتة أزيلت نهائياً (F-04 من تقرير الفحص الشامل).
  // حساب المدير يُنشأ فقط من متغيرات البيئة — لا كلمة مرور افتراضية أبداً.
  const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  if (adminEmail && adminPassword.length >= 12) {
    await prisma.user.create({
      data: {
        name: "مدير النظام",
        email: adminEmail,
        password: hashPassword(adminPassword),
        role: "admin",
      },
    });
    console.log(`✓ المستخدمون: حساب المدير (${adminEmail})`);
  } else {
    console.warn(
      "! تخطي إنشاء حساب المدير — اضبط ADMIN_EMAIL و ADMIN_PASSWORD (12 حرفاً على الأقل) لإنشائه (F-04: لا كلمات مرور افتراضية)"
    );
  }
  console.log("✓ المستخدمون: تم");

  // ---- الحجوزات (4) ----
  const bookingsData = [
    {
      name: "مستخدم تجريبي",
      email: "demo@ctodrs.com",
      phone: "0501234567",
      serviceType: "تدقيق أمني شامل",
      date: dateInDays(5),
      timeSlot: "09:00 - 11:00",
      notes: "أرغب في تدقيق أمني لمنصتنا قبل إطلاق النسخة الجديدة.",
      status: "pending",
      createdAt: daysAgo(2, 10),
    },
    {
      name: "أحمد المطيري",
      email: "ahmed.m@example.com",
      phone: "0552345678",
      serviceType: "تطوير متاجر إلكترونية",
      date: dateInDays(10),
      timeSlot: "13:00 - 15:00",
      notes: "متجر ملابس يحتاج تكاملاً مع شركات الشحن المحلية.",
      status: "pending",
      createdAt: daysAgo(4, 14),
    },
    {
      name: "نورة السبيعي",
      email: "noura.s@example.com",
      phone: null,
      serviceType: "استشارات التحول الرقمي",
      date: dateInDays(3),
      timeSlot: "10:00 - 12:00",
      notes: null,
      status: "confirmed",
      createdAt: daysAgo(6, 9),
    },
    {
      name: "فهد القحطاني",
      email: "fahad.q@example.com",
      phone: "0567891234",
      serviceType: "تطوير تطبيقات iOS و Android",
      date: dateInDays(18),
      timeSlot: "15:00 - 17:00",
      notes: "تطبيق توصيل طلبات لمطعم متعدد الفروع.",
      status: "completed",
      createdAt: daysAgo(20, 11),
    },
  ];

  for (const b of bookingsData) {
    await prisma.booking.create({ data: b });
  }
  console.log(`✓ الحجوزات: ${bookingsData.length}`);

  // ---- الطلبات (3) ----
  const ordersData = [
    {
      customerName: "مستخدم تجريبي",
      email: "demo@ctodrs.com",
      items: [
        { name: "قالب متجر إلكتروني سايبر", price: 249, qty: 1 },
        { name: "كتاب أساسيات الأمن الدفاعي", price: 79, qty: 2 },
      ],
      total: 407,
      status: "pending",
      createdAt: daysAgo(10, 16),
    },
    {
      customerName: "ريم الدوسري",
      email: "reem.d@example.com",
      items: [{ name: "أداة فحص الثغرات السيبرانية", price: 399, qty: 1 }],
      total: 399,
      status: "processing",
      createdAt: daysAgo(60, 13),
    },
    {
      customerName: "عبدالله الغامدي",
      email: "abdullah.g@example.com",
      items: [
        { name: "قالب لوحة تحكم إدارية", price: 199, qty: 1 },
        { name: "إضافة دردشة ذكية للمواقع", price: 179, qty: 1 },
        { name: "كتاب تعلم البرمجة من الصفر", price: 59, qty: 1 },
      ],
      total: 437,
      status: "completed",
      createdAt: daysAgo(120, 15),
    },
  ];

  for (const o of ordersData) {
    await prisma.order.create({
      data: { ...o, items: JSON.stringify(o.items) },
    });
  }
  console.log(`✓ الطلبات: ${ordersData.length}`);

  // ---- رسائل التواصل (3) ----
  const contactData = [
    {
      name: "عمر الشهري",
      email: "omar@company.com",
      subject: "طلب عرض سعر لمتجر إلكتروني",
      message:
        "السلام عليكم، أملك مشروعاً تجارياً وأرغب في بناء متجر إلكتروني متكامل، أرجو تزويدي بعرض سعر مفصل ومدة التنفيذ المتوقعة.",
      read: true,
      createdAt: daysAgo(3, 12),
    },
    {
      name: "منى العتيبي",
      email: "mona@startup.sa",
      subject: "استشارة في الأمن السيبراني",
      message:
        "نحن شركة ناشئة في قطاع التقنية المالية ونحتاج استشارة لتقييم الوضع الأمني لأنظمتنا قبل جولة التمويل القادمة.",
      read: false,
      createdAt: daysAgo(7, 10),
    },
    {
      name: "خالد الزهراني",
      email: "khaled@edu.sa",
      subject: "تدريب فريق تقني",
      message:
        "نتطلع لعقد دورات تدريبية متخصصة في تطوير الويب لفريقنا المكوّن من عشرة مهندسين، نرجو التواصل لمناقشة التفاصيل.",
      read: false,
      createdAt: daysAgo(14, 9),
    },
  ];

  for (const m of contactData) {
    await prisma.contactMessage.create({ data: m });
  }
  console.log(`✓ رسائل التواصل: ${contactData.length}`);

  // ---- المشتركون (5) ----
  const subscriberEmails = [
    "sara.m@example.com",
    "faisal.o@example.com",
    "layla.h@example.com",
    "tariq.n@example.com",
    "reem.a@example.com",
  ];
  for (const email of subscriberEmails) {
    await prisma.subscriber.create({ data: { email } });
  }
  console.log(`✓ المشتركون: ${subscriberEmails.length}`);

  // ---- التعليقات (4) ----
  const commentsData = [
    {
      postId: createdPosts[0].id,
      authorName: "محمد السالم",
      content:
        "مقال رائع ومفيد جداً، طبقت التحقق من المدخلات على الخادم وفق ما ذكرت وأصبح تطبيقي أكثر أماناً بوضوح.",
      createdAt: daysAgo(5, 13),
    },
    {
      postId: createdPosts[0].id,
      authorName: "هند العمري",
      content:
        "شكراً على هذا الشرح المبسط، أرجو كتابة مقال مشابه عن تأمين واجهات برمجة التطبيقات أيضاً.",
      createdAt: daysAgo(3, 18),
    },
    {
      postId: createdPosts[1].id,
      authorName: "ياسر الدوسري",
      content:
        "جرّبت الترقية على مشروعي وانخفض زمن البناء فعلاً بنسبة كبيرة، ميزات جديدة ممتازة تستحق التجربة.",
      createdAt: daysAgo(8, 15),
    },
    {
      postId: createdPosts[2].id,
      authorName: "سارة القحطاني",
      content:
        "نصائح عملية وقيّمة، فعّلت المصادقة الثنائية على كل حساباتي بعد قراءة المقال وأشعر الآن براحة أكبر.",
      createdAt: daysAgo(6, 20),
    },
  ];

  for (const c of commentsData) {
    await prisma.comment.create({ data: c });
  }
  console.log(`✓ التعليقات: ${commentsData.length}`);

  // ---- آراء العملاء (8) ----
  const testimonialsData = [
    {
      name: "أحمد المطيري",
      role: "مدير تقنية، شركة نكسس",
      content:
        "تعاملت مع فرق تقنية كثيرة، لكن فريق CTO.DRS مختلف التزاماً وجودة، منصتنا أصبحت أسرع بثلاث مرات بعد إعادة البناء.",
      rating: 5,
      createdAt: daysAgo(30, 12),
    },
    {
      name: "نورة السبيعي",
      role: "مديرة تسويق رقمي، متاجر لمسة",
      content:
        "أعادوا بناء متجرنا الإلكتروني من الصفر وارتفعت نسبة إتمام الشراء بنسبة أربعين بالمئة، التواصل واضح والتقارير دورية.",
      rating: 5,
      createdAt: daysAgo(45, 14),
    },
    {
      name: "فهد القحطاني",
      role: "رئيس قسم تقنية المعلومات، مستشفى الرحمة",
      content:
        "التدقيق الأمني الذي أجريوه كشف ثغرات لم تكتشفها أدوات الفحص التجارية، نظامنا الآن أكثر أماناً وثقة.",
      rating: 5,
      createdAt: daysAgo(60, 10),
    },
    {
      name: "ريم الدوسري",
      role: "مؤسسة، منصة مهارات",
      content:
        "دوراتهم التدريبية عملية ومباشرة، فريقنا اكتسب مهارات Next.js خلال أسابيع وانعكس ذلك على سرعة تسليم مشاريعنا.",
      rating: 4,
      createdAt: daysAgo(20, 11),
    },
    {
      name: "سلطان الشمري",
      role: "مدير مشاريع، شركة أفق",
      content:
        "احترافية في إدارة المشاريع ووضوح في التقارير، الاستشارات التقنية وفرت علينا أخطاء كانت ستكلفنا كثيراً.",
      rating: 4,
      createdAt: daysAgo(75, 16),
    },
    {
      name: "لطيفة العنزي",
      role: "محللة أمن سيبراني، قطاع مصرفي",
      content:
        "محتوى الأمن السيبراني لديهم من الأفضل في المنطقة، عملي ومحدث ومبني على تجارب حقيقية لا نظريات فقط.",
      rating: 5,
      createdAt: daysAgo(15, 9),
    },
    {
      name: "عبدالله الغامدي",
      role: "صاحب متجر إلكتروني",
      content:
        "من أول اجتماع فهموا متطلباتي وحولوها لموقع يبيع فعلاً، الدعم الفني سريع ومتجاوب حتى بعد التسليم.",
      rating: 4,
      createdAt: daysAgo(90, 13),
    },
    {
      name: "جواهر الرشيد",
      role: "مديرة منتج رقمي، تطبيق وصل",
      content:
        "طوروا لنا تطبيق جوال متكامل خلال ثلاثة أشهر، تجربة المستخدم راقية والتقييمات على المتاجر تتجاوز أربع نجوم ونصف.",
      rating: 5,
      createdAt: daysAgo(50, 17),
    },
  ];

  for (const t of testimonialsData) {
    await prisma.testimonial.create({ data: t });
  }
  console.log(`✓ آراء العملاء: ${testimonialsData.length}`);

  // ---- ملخص ----
  const counts = {
    services: await prisma.service.count(),
    projects: await prisma.project.count(),
    courses: await prisma.course.count(),
    posts: await prisma.post.count(),
    products: await prisma.product.count(),
    users: await prisma.user.count(),
    bookings: await prisma.booking.count(),
    orders: await prisma.order.count(),
    contactMessages: await prisma.contactMessage.count(),
    subscribers: await prisma.subscriber.count(),
    comments: await prisma.comment.count(),
    testimonials: await prisma.testimonial.count(),
  };

  console.log("\n📊 ملخص تهيئة قاعدة البيانات:");
  for (const [table, count] of Object.entries(counts)) {
    console.log(`   ${table}: ${count}`);
  }
  console.log("\n✅ تمت تهيئة قاعدة البيانات بنجاح!");
}

main()
  .catch((err) => {
    console.error("❌ فشلت تهيئة قاعدة البيانات:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
