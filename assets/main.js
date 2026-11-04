/* ============================================================
   CTO.DRS — main.js
   i18n (AR default / EN) · nav · reveal · counters · form
   Progressive enhancement: every feature degrades safely.
   ============================================================ */
(function () {
  "use strict";

  var docEl = document.documentElement;
  docEl.classList.add("js");

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- i18n ---------------- */
  var I18N = {
    "nav.home": { ar: "الرئيسية", en: "Home" },
    "nav.services": { ar: "الخدمات", en: "Services" },
    "nav.projects": { ar: "المشاريع", en: "Projects" },
    "nav.contact": { ar: "التواصل", en: "Contact" },
    "nav.cta": { ar: "ابدأ مشروعك", en: "Start a project" },
    "nav.skip": { ar: "تخطَّ إلى المحتوى", en: "Skip to content" },

    "home.status": { ar: "CTO.DRS • النظام يعمل", en: "CTO.DRS • SYSTEM ONLINE" },
    "home.h1a": { ar: "رشيد نجيب ", en: "Rashid " },
    "home.h1b": { ar: "الحداد", en: "Al-Haddad" },
    "home.role": { ar: "مطوّر Full-Stack ومهندس أمن سيبراني دفاعي", en: "Full-Stack Developer & Defensive Security Engineer" },
    "home.lede": {
      ar: "أبني أنظمة ويب متكاملة من الفكرة إلى الإطلاق — أداء عالٍ، بنية آمنة، وكود نظيف قابل للصيانة. PHP وJavaScript وPython بمعايير إنتاج صارمة.",
      en: "I build complete web systems from idea to launch — high performance, secure architecture, and clean, maintainable code. PHP, JavaScript and Python with strict production standards."
    },
    "home.cta1": { ar: "ابدأ مشروعك", en: "Start a project" },
    "home.cta2": { ar: "استعرض الأعمال", en: "View the work" },
    "home.term.title": { ar: "cto-drs — stack", en: "cto-drs — stack" },

    "home.stats.title": { ar: "أرقام تلخّص المسار", en: "The track record" },
    "home.stats.lede": { ar: "أرقام معلنة على منصتي منذ سنوات — تُحدَّث مع كل تسليم.", en: "Figures published on my platform for years — updated with every delivery." },
    "home.stat1": { ar: "سنوات خبرة", en: "years of experience" },
    "home.stat2": { ar: "مشروع مُسلَّم", en: "projects delivered" },
    "home.stat3": { ar: "ساعة هندسة", en: "hours of engineering" },
    "home.stat4": { ar: "عميل وشريك", en: "clients & partners" },

    "home.serv.eyebrow": { ar: "CAPABILITIES • 01", en: "CAPABILITIES • 01" },
    "home.serv.title": { ar: "خدمات تُنجَز من البداية إلى النهاية", en: "End-to-end services" },
    "home.serv.lede": { ar: "أربعة مجالات تتقاطع فيها الهندسة مع الأمن — كلها تحت سقف واحد.", en: "Four disciplines where engineering meets security — all under one roof." },
    "home.serv1.t": { ar: "تطوير Full-Stack", en: "Full-Stack Engineering" },
    "home.serv1.d": { ar: "أنظمة ويب ومنصات كاملة: من قاعدة البيانات والخادم حتى آخر سطر في الواجهة.", en: "Complete web systems and platforms: from database and server to the last line of the interface." },
    "home.serv2.t": { ar: "أمن سيبراني دفاعي", en: "Defensive Cybersecurity" },
    "home.serv2.d": { ar: "تحصين الأنظمة ومراقبتها بمنهجية دفاعية مستدامة، لا إصلاحات مؤقتة.", en: "Hardening and monitoring systems with a sustainable defensive methodology — no quick patches." },
    "home.serv3.t": { ar: "واجهات عربية RTL", en: "Native Arabic RTL Interfaces" },
    "home.serv3.d": { ar: "واجهات مصمَّمة للعربية أولاً ثم للعالمية — خطوط صحيحة واتجاهات سليمة.", en: "Interfaces designed Arabic-first, then global — correct type, correct direction." },
    "home.serv4.t": { ar: "أداء وبنية تحتية", en: "Performance & Infrastructure" },
    "home.serv4.d": { ar: "مواقع سريعة على مقاييس Google، وبنية مستقرة قابلة للتوسع عند النمو.", en: "Fast sites on Google's vitals, on stable infrastructure that scales when you grow." },
    "home.serv.more": { ar: "التفاصيل الكاملة", en: "Full details" },

    "home.proj.eyebrow": { ar: "PORTFOLIO • 02", en: "PORTFOLIO • 02" },
    "home.proj.title": { ar: "مشاريع مميزة", en: "Featured projects" },
    "home.proj.lede": { ar: "مشاريع حقيقية منشورة ومفتوحة المصدر — والقائمة الكاملة في صفحة المشاريع.", en: "Three samples say enough about the way I work — the full list lives on the projects page." },
    "home.proj1.t": { ar: "منصة CTO.DRS الشخصية", en: "The CTO.DRS platform" },
    "home.proj1.d": { ar: "منصة مهنية بأداء عالٍ: ثيم داكن زجاجي، لوحة مؤشرات حية، وتجربة عربية أصيلة.", en: "A high-performance professional platform: dark glass theme, live metrics, native Arabic experience." },
    "home.proj2.t": { ar: "NexusLink", en: "NexusLink" },
    "home.proj2.d": { ar: "مركز محلي يربط أجهزتك على شبكتك: مرآة الشاشة، نقل الملفات، ومزامنة الحافظة — بتشفير طرفي وبلا سحابة.", en: "A local hub linking your devices over Wi-Fi: screen mirroring, file transfer and clipboard sync — end-to-end encrypted, no cloud." },
    "home.proj3.t": { ar: "Ultimate AI Suite", en: "Ultimate AI Suite" },
    "home.proj3.d": { ar: "صندوق أدوات ذكي شامل: مساعد AI و16 أداة احترافية في مكان واحد، مجاناً وبدون تثبيت.", en: "All-in-one AI toolbox: an assistant plus 16 pro tools, free and zero install." },
    "home.proj.more": { ar: "كل المشاريع", en: "All projects" },
    "home.proj.more2": { ar: "استعرض الأرشيف الكامل", en: "Browse the full archive" },
    "home.proj.more2p": { ar: "صفحة المشاريع فيها القائمة الكاملة مع التقنيات المستخدمة.", en: "The projects page holds the full list with the tech behind each build." },

    "cta.title": { ar: "جاهز نبني شيئاً استثنائياً؟", en: "Ready to build something exceptional?" },
    "cta.p": {
      ar: "أخبرني بفكرتك — أعود إليك بتصوّر هندسي واضح وخطة تنفيذ، لا بكلام عام.",
      en: "Tell me the idea — you get a clear engineering picture and an execution plan, not vague talk."
    },
    "cta.btn": { ar: "ابدأ المحادثة", en: "Start the conversation" },

    "serv.eyebrow": { ar: "SERVICES", en: "SERVICES" },
    "serv.h1": { ar: "الخدمات", en: "Services" },
    "serv.lede": {
      ar: "من فكرة على ورقة إلى نظام يعمل في الإنتاج — هذه الخدمات الأربع هي الطريق كاملاً، بمعايير أمنية من اليوم الأول.",
      en: "From a napkin idea to a system in production — these four services are the whole road, with security standards from day one."
    },
    "serv.s1.t": { ar: "تطوير Full-Stack", en: "Full-Stack Engineering" },
    "serv.s1.d": { ar: "أنظمة متكاملة بلغة الخادم والمتصفح، بمعمارية تتحمل النمو.", en: "Complete systems across server and browser, on architecture that survives growth." },
    "serv.s1.b1": { ar: "واجهات REST API آمنة بمصادقة JWT وتحقق CSRF", en: "Secure REST APIs with JWT auth and CSRF protection" },
    "serv.s1.b2": { ar: "أنظمة مصادقة وصلاحيات وأدوار متعددة المستويات", en: "Authentication, permissions and multi-level roles" },
    "serv.s1.b3": { ar: "تكامل بوابات الدفع والتقارير والخدمات الخارجية", en: "Payment gateways, reporting and third-party integrations" },
    "serv.s2.t": { ar: "الأمن السيبراني الدفاعي", en: "Defensive Cybersecurity" },
    "serv.s2.d": { ar: "حماية تبدأ قبل الاختراق ولا تتوقف بعده.", en: "Protection that starts before the breach and never stops after it." },
    "serv.s2.b1": { ar: "تقييم ثغرات وتحصين الأنظمة والخوادم", en: "Vulnerability assessment and system hardening" },
    "serv.s2.b2": { ar: "مراقبة السجلات وكشف المحاولات المشبوهة", en: "Log monitoring and suspicious-activity detection" },
    "serv.s2.b3": { ar: "سياسات نسخ احتياطي واستعادة بعد الكوارث", en: "Backup policies and disaster-recovery planning" },
    "serv.s3.t": { ar: "واجهات وتجربة استخدام", en: "Interfaces & Experience" },
    "serv.s3.d": { ar: "واجهات تُحترم: سريعة، متاحة، وصحيحة لغوياً واتجاهياً.", en: "Interfaces that earn respect: fast, accessible, linguistically and directionally correct." },
    "serv.s3.b1": { ar: "تصميم متجاوب من شاشة 320px حتى 4K", en: "Responsive design from 320px to 4K" },
    "serv.s3.b2": { ar: "واجهات عربية RTL أصيلة بلا ترجمة آلية", en: "Native Arabic RTL interfaces, never auto-translated" },
    "serv.s3.b3": { ar: "إتاحة وفق WCAG 2.2 AA وتباينات مدققة", en: "WCAG 2.2 AA accessibility with verified contrast" },
    "serv.s4.t": { ar: "الأداء والاستدامة", en: "Performance & Sustainability" },
    "serv.s4.d": { ar: "سرعة تُقاس، لا تُدّعى — وبنية تبقى بعد الإطلاق.", en: "Speed that is measured, not claimed — and infrastructure that outlives launch day." },
    "serv.s4.b1": { ar: "تحسين Core Web Vitals: LCP وINP وCLS", en: "Core Web Vitals tuning: LCP, INP, CLS" },
    "serv.s4.b2": { ar: "تخزين مؤقت وشبكات توزيع محتوى", en: "Caching strategy and CDN setup" },
    "serv.s4.b3": { ar: "مراقبة مستمرة وتنبيهات مبكرة", en: "Continuous monitoring with early alerting" },

    "serv.how.title": { ar: "كيف نشتغل معاً", en: "How we work together" },
    "serv.how.lede": { ar: "أربع مراحل واضحة — تعرف في كل مرحلة أين وصلنا وماذا تبقّى.", en: "Four clear phases — at every stage you know where we are and what remains." },
    "serv.step1.t": { ar: "التحليل والاستكشاف", en: "Discover" },
    "serv.step1.d": { ar: "جلسة تفهم فيها احتياجك، ومخرجها نطاق مكتوب لا اجتهادات.", en: "A session to understand the need — output is a written scope, not assumptions." },
    "serv.step2.t": { ar: "التصميم والمعمارية", en: "Design" },
    "serv.step2.d": { ar: "مخططات واجهة وقرارات معمارية قبل أول سطر كود.", en: "Wireframes and architecture decisions before the first line of code." },
    "serv.step3.t": { ar: "التطوير والاختبار", en: "Build" },
    "serv.step3.d": { ar: "تسليمات دورية قابلة للمعاينة، واختبار على أجهزة حقيقية.", en: "Previewable periodic deliveries, tested on real devices." },
    "serv.step4.t": { ar: "الحماية والإطلاق", en: "Secure & Launch" },
    "serv.step4.d": { ar: "تدقيق أمني، تحسين أداء، إطلاق — ثم متابعة بعد النشر.", en: "Security audit, performance pass, launch — then post-deploy care." },

    "serv.stack.title": { ar: "صندوق الأدوات", en: "The toolbox" },
    "serv.stack.lede": { ar: "أدوات اختبرتها في إنتاج حقيقي — لا موضة تقنية.", en: "Tools battle-tested in real production — no tech fashion." },

    "proj.eyebrow": { ar: "PORTFOLIO", en: "PORTFOLIO" },
    "proj.h1": { ar: "المشاريع", en: "Projects" },
    "proj.lede": {
      ar: "نماذج من أنظمة ومشاريع عملت عليها. لطلب دراسة حالة كاملة أو معاينة، تواصل معي مباشرة.",
      en: "Samples of systems and projects I've worked on. For a full case study or a walkthrough, reach out directly."
    },
    "proj.p1.t": { ar: "منصة CTO.DRS الشخصية", en: "The CTO.DRS platform" },
    "proj.p1.d": { ar: "منصة مهنية متكاملة: ملف تعريفي، مدونة تقنية عربية، لوحة مؤشرات حية، وثيم داكن زجاجي بأداء ممتاز على الجوال.", en: "A complete professional platform: profile, Arabic tech blog, live metrics board, and a dark glass theme with excellent mobile performance." },
    "proj.p2.t": { ar: "سيكيورنت VPN", en: "Securent VPN" },
    "proj.p2.d": { ar: "خدمة خصوصية بمستوى المؤسسات: تشفير حديث، سياسات صفرية الثقة، وتوثيق واضح للمستخدم.", en: "Enterprise-grade privacy service: modern encryption, zero-trust policies, and clear user documentation." },
    "proj.p3.t": { ar: "لوحات بيانات حية", en: "Live dashboards" },
    "proj.p3.d": { ar: "لوحات تحكم تعرض مؤشرات الأداء لحظياً، مع بدائل نصية متاحة لكل رسم بياني.", en: "Dashboards streaming KPIs in real time, with text alternatives for every chart." },
    "proj.p4.t": { ar: "بوابة REST API آمنة", en: "Secure REST API gateway" },
    "proj.p4.d": { ar: "بوابة خدمات بمصادقة JWT وتحديد معدل الطلبات وسجلات تدقيق كاملة.", en: "A service gateway with JWT auth, rate limiting and full audit logs." },
    "proj.p5.t": { ar: "نظام إدارة محتوى عربي", en: "Arabic content system" },
    "proj.p5.d": { ar: "نشر سلس للنصوص العربية مع تشكيل سليم واتجاهات bidi محفوظة في كل مكان.", en: "Smooth Arabic publishing with correct diacritics and bidi order preserved everywhere." },
    "proj.p6.t": { ar: "تدقيق أمني شامل", en: "Full security audit" },
    "proj.p6.d": { ar: "فحص ثغرات، مراجعة صلاحيات، وتقرير أولويات إصلاح قابل للتنفيذ فوراً.", en: "Vulnerability scan, permission review, and an actionable fix-priority report." },
    "proj.ask": { ar: "اطلب دراسة الحالة", en: "Request case study" },

    "contact.eyebrow": { ar: "CONTACT", en: "CONTACT" },
    "contact.h1": { ar: "لنتحدث عن مشروعك", en: "Let's talk about your project" },
    "contact.lede": {
      ar: "اكتب سطراً عن الفكرة، وسأعود إليك بتصوّر أوضح وخطة زمنية. الرد خلال يوم عمل.",
      en: "Write a line about the idea and you'll get back a clearer picture and a timeline. Replies within one business day."
    },
    "contact.ch.email": { ar: "البريد الإلكتروني", en: "Email" },
    "contact.ch.github": { ar: "الحساب على GitHub", en: "GitHub profile" },
    "contact.ch.site": { ar: "المنصة الأصلية", en: "The original platform" },
    "contact.ch.githubv": { ar: "github.com/CTO-DRS", en: "github.com/CTO-DRS" },
    "contact.ch.sitev": { ar: "cto-drs.xo.je", en: "cto-drs.xo.je" },
    "contact.form.title": { ar: "أرسل رسالة", en: "Send a message" },
    "contact.form.p": { ar: "النموذج يفتح تطبيق البريد لديك مباشرة — لا تُرسل بياناتك إلى أي خادم وسيط.", en: "The form opens your email app directly — your data never touches any intermediate server." },
    "contact.f.name": { ar: "الاسم", en: "Name" },
    "contact.f.email": { ar: "البريد الإلكتروني", en: "Email" },
    "contact.f.subject": { ar: "الموضوع", en: "Subject" },
    "contact.f.message": { ar: "الرسالة", en: "Message" },
    "contact.f.name.ph": { ar: "ما اسمك الكريم؟", en: "Your name" },
    "contact.f.email.ph": { ar: "name@example.com", en: "name@example.com" },
    "contact.f.subject.ph": { ar: "مثال: متجر إلكتروني بأمن عالٍ", en: "e.g. a high-security e-commerce store" },
    "contact.f.message.ph": { ar: "صف الفكرة باختصار: الهدف، الجمهور، والموعد المتوقع…", en: "Describe the idea briefly: the goal, the audience, the target date…" },
    "contact.f.send": { ar: "إرسال عبر بريدك", en: "Open in my email app" },
    "contact.f.err.name": { ar: "أدخل اسمك من فضلك.", en: "Please enter your name." },
    "contact.f.err.email": { ar: "أدخل بريداً إلكترونياً صالحاً.", en: "Please enter a valid email address." },
    "contact.f.err.message": { ar: "الرسالة قصيرة جداً — اكتب 20 حرفاً على الأقل.", en: "The message is too short — at least 20 characters." },
    "contact.f.ok": { ar: "فُتح تطبيق البريد برسالتك جاهزة — أضف أي تفاصيل وأرسل.", en: "Your email app opened with the message ready — add details and hit send." },

    "foot.blurb": {
      ar: "رشيد نجيب سنان الحداد — مطوّر Full-Stack ومهندس أمن سيبراني دفاعي. أنظمة تُبنى لتدوم.",
      en: "Rashid Najib Sinan Al-Haddad — Full-Stack developer and defensive security engineer. Systems built to last."
    },
    "foot.nav": { ar: "روابط سريعة", en: "Quick links" },
    "foot.reach": { ar: "قنوات التواصل", en: "Reach me" },
    "foot.rights": { ar: "جميع الحقوق محفوظة.", en: "All rights reserved." },
    "foot.built": { ar: "مُهندَس ومؤمَّن بواسطة CTO.DRS", en: "Engineered & secured by CTO.DRS" },

    "soc.wa": { ar: "واتساب", en: "WhatsApp" },
    "soc.tg": { ar: "تيليجرام", en: "Telegram" },
    "soc.x": { ar: "إكس", en: "X" },
    "soc.ig": { ar: "إنستغرام", en: "Instagram" },
    "soc.tt": { ar: "تيك توك", en: "TikTok" },
    "soc.yt": { ar: "يوتيوب", en: "YouTube" },
    "soc.wa.aria": { ar: "تواصل عبر واتساب", en: "Chat on WhatsApp" },
    "foot.social": { ar: "حسابات التواصل الاجتماعي", en: "Social accounts" },
    "contact.ch.wa": { ar: "واتساب للأعمال — الأسرع ردّاً", en: "WhatsApp Business — fastest reply" },
    "contact.ch.tg": { ar: "قناة تيليجرام", en: "Telegram channel" },
    "proj.view": { ar: "عرض المشروع", en: "Live demo" },
    "proj.code": { ar: "الكود المصدري", en: "Source code" },
    "real.title": { ar: "مشاريع منشورة ومفتوحة المصدر", en: "Shipped, open-source projects" },
    "real.lede": { ar: "منتجات حقيقية تعمل الآن، بكودها المصدري على GitHub.", en: "Real products running today, with their source on GitHub." },
    "client.title": { ar: "نماذج من أعمال العملاء", en: "Selected client work" },
    "client.lede": { ar: "أنظمة نُفّذت لعملاء — التفاصيل الكاملة تُشارَك عند الطلب.", en: "Systems delivered for clients — full details shared on request." },
    "real.nexus.d": { ar: "مركز محلي يربط كل أجهزتك على شبكتك: مرآة الشاشة والتحكم، نقل الملفات، مزامنة الحافظة — بتشفير طرفي، بلا سحابة ولا حسابات.", en: "One local hub for your devices: screen mirroring and control, file transfer, clipboard sync — end-to-end encrypted, no cloud, no accounts." },
    "real.suite.d": { ar: "صندوق أدوات ذكي: مساعد AI و16 أداة احترافية في مكان واحد — مجاناً، خاص، وبدون تثبيت.", en: "All-in-one AI toolbox: an assistant plus 16 pro tools — free, private, zero install." },
    "real.kbd.d": { ar: "لوحة مفاتيح عربية أصلية لأندرويد: ذكاء على الجهاز، خصوصية مثبتة، ونظام امتدادات موقّع تشفيرياً.", en: "A native Arabic keyboard for Android: on-device intelligence, proven privacy and cryptographically signed extensions." },
    "real.vpn.d": { ar: "VPN بمستوى المؤسسات مبني على WireGuard، مع فاحص أمان للجهاز ومحسّن للشبكة — Clean Architecture.", en: "Enterprise-grade WireGuard VPN with a device security scanner and network optimizer — Clean Architecture." },
    "real.arsenal.d": { ar: "أداة تصميم واجهات موحّدة تدمج 7 أدوات مفتوحة المصدر: استخراج أنظمة التصميم، حركات GSAP، و218 مكوّن React.", en: "One unified frontend design tool merging 7 open-source tools: design-system extraction, GSAP motion and 218 React components." },
    "real.dnexus.d": { ar: "حقيبة أدوات مطوّرين أصلية لأندرويد تعمل بلا إنترنت: 11 أداة حقيقية، ثنائية اللغة مع دعم RTL كامل.", en: "A native offline developer toolkit for Android: 11 real tools, bilingual AR/EN with full RTL." },

    "err.code": { ar: "404", en: "404" },
    "err.title": { ar: "الصفحة غير موجودة", en: "Page not found" },
    "err.p": { ar: "الرابط الذي تبحث عنه انتقل أو لم يُبنَ بعد — القائمة أعلاه تُعيدك إلى الصحيح.", en: "The link you followed moved or was never built — the menu above takes you back to reality." },
    "err.btn": { ar: "العودة إلى الرئيسية", en: "Back home" },

    "meta.home": { ar: "رشيد نجيب سنان الحداد | مطوّر برمجيات متكامل وأمن سيبراني", en: "Rashid Al-Haddad | Full-Stack Developer & Security Engineer" },
    "meta.services": { ar: "الخدمات | CTO.DRS", en: "Services | CTO.DRS" },
    "meta.projects": { ar: "المشاريع | CTO.DRS", en: "Projects | CTO.DRS" },
    "meta.contact": { ar: "التواصل | CTO.DRS", en: "Contact | CTO.DRS" },
    "meta.404": { ar: "404 | CTO.DRS", en: "404 | CTO.DRS" }
  };

  var LANG_KEY = "cto-drs-lang";

  function initialLang() {
    /* ?lang=en / ?lang=ar wins — shareable, testable, no flash on reload */
    try {
      var qp = new URLSearchParams(window.location.search).get("lang");
      if (qp === "en" || qp === "ar") return qp;
    } catch (e) { /* older parsers */ }
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) { /* private mode */ }
    if (saved === "ar" || saved === "en") return saved;
    return "ar"; /* Arabic-first, per brand */
  }

  function t(key, lang) {
    var entry = I18N[key];
    if (!entry) return null;
    return entry[lang] || entry.ar;
  }

  function applyLang(lang) {
    docEl.setAttribute("lang", lang);
    docEl.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

    /* plain text swaps */
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var val = t(nodes[i].getAttribute("data-i18n"), lang);
      if (val !== null) nodes[i].textContent = val;
    }
    /* html swaps (rich strings with spans/bdi) */
    var rich = document.querySelectorAll("[data-i18n-html]");
    for (var j = 0; j < rich.length; j++) {
      var v = t(rich[j].getAttribute("data-i18n-html"), lang);
      if (v !== null) rich[j].innerHTML = v;
    }
    /* aria-labels */
    var aria = document.querySelectorAll("[data-i18n-aria]");
    for (var k = 0; k < aria.length; k++) {
      var a = t(aria[k].getAttribute("data-i18n-aria"), lang);
      if (a !== null) aria[k].setAttribute("aria-label", a);
    }
    /* placeholders */
    var ph = document.querySelectorAll("[data-i18n-ph]");
    for (var m = 0; m < ph.length; m++) {
      var p = t(ph[m].getAttribute("data-i18n-ph"), lang);
      if (p !== null) ph[m].setAttribute("placeholder", p);
    }

    /* toggle button shows the *other* language */
    var btn = document.querySelector(".lang-toggle");
    if (btn) btn.textContent = lang === "ar" ? "EN" : "عربي";

    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ }
  }

  /* boot with saved/default language (no flash — pages ship Arabic default) */
  var currentLang = initialLang();
  if (currentLang !== "ar") applyLang(currentLang);
  else {
    /* still set the toggle label correctly */
    var tBtn = document.querySelector(".lang-toggle");
    if (tBtn) tBtn.textContent = "EN";
  }

  document.addEventListener("click", function (ev) {
    var btn = ev.target.closest ? ev.target.closest(".lang-toggle") : null;
    if (!btn) return;
    currentLang = currentLang === "ar" ? "en" : "ar";
    applyLang(currentLang);
  });

  /* ---------------- header ---------------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onHeaderScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 12);
    };
    onHeaderScroll();
    window.addEventListener("scroll", onHeaderScroll, { passive: true });
  }

  var burger = document.querySelector(".nav-burger");
  var links = document.querySelector(".nav-links");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) {
        links.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        burger.focus();
      }
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------------- reveal on scroll ----------------
     Scroll-driven (bulletproof): any element at or above the reading
     line gets revealed — jumps (End key), anchors, and fast flicks
     can never leave content stranded hidden. rAF-throttled. */
  var revealEls = document.querySelectorAll("[data-reveal]");
  var pending = Array.prototype.slice.call(revealEls);
  var ticking = false;

  function sweep() {
    ticking = false;
    var line = window.innerHeight - 40;
    for (var i = pending.length - 1; i >= 0; i--) {
      var r = pending[i].getBoundingClientRect();
      if (r.top <= line || r.bottom <= 0) {          /* reached or passed */
        pending[i].classList.add("in");
        pending.splice(i, 1);
      }
    }
    if (!pending.length) {
      window.removeEventListener("scroll", onRevealScroll);
      window.removeEventListener("resize", onRevealScroll);
    }
  }
  function onRevealScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(sweep);
    }
  }
  if (REDUCED) {
    pending.forEach(function (el) { el.classList.add("in"); });
    pending = [];
  } else {
    window.addEventListener("scroll", onRevealScroll, { passive: true });
    window.addEventListener("resize", onRevealScroll, { passive: true });
    window.addEventListener("beforeprint", function () {
      pending.forEach(function (el) { el.classList.add("in"); });
      pending = [];
    });
    onRevealScroll();
  }

  /* ---------------- counters (western digits, LTR island) ---------------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;
    if (REDUCED) { el.textContent = target.toLocaleString("en-US") + "+"; return; }
    var dur = 1300, start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-US") + "+";
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window && !REDUCED) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          animateCount(en.target);
          cio.unobserve(en.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------------- contact form → mailto (honest, no fake backend) ---------------- */
  var form = document.querySelector("#contact-form");
  if (form) {
    var status = form.querySelector(".form-status");
    var setFieldError = function (fieldName, msg) {
      var err = form.querySelector('[data-err="' + fieldName + '"]');
      if (err) err.textContent = msg || "";
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var lang = docEl.getAttribute("lang") === "en" ? "en" : "ar";
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var subject = form.elements.subject.value.trim();
      var message = form.elements.message.value.trim();

      var ok = true;
      setFieldError("name", null); setFieldError("email", null); setFieldError("message", null);

      if (!name) { setFieldError("name", t("contact.f.err.name", lang)); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setFieldError("email", t("contact.f.err.email", lang)); ok = false; }
      if (message.length < 20) { setFieldError("message", t("contact.f.err.message", lang)); ok = false; }

      if (!ok) {
        status.className = "form-status err";
        status.textContent = lang === "en" ? "Please fix the highlighted fields." : "صحّح الحقول المعلَّمة من فضلك.";
        return;
      }

      var body = name + " <" + email + ">\n\n" + message;
      var mailto = "mailto:contact@cto-drs.com" +
        "?subject=" + encodeURIComponent(subject || "CTO.DRS") +
        "&body=" + encodeURIComponent(body);
      window.location.href = mailto;
      status.className = "form-status ok";
      status.textContent = t("contact.f.ok", lang);
    });
  }

  /* ---------------- footer year ---------------- */
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
