/* ═══════════════════════════════════════════════════════════
   English content overlays for data-driven sections
   (src/lib/data.ts, apps.ts, faq-data.ts, social.ts, contact-options.ts
   and the API/DB records for services, projects and courses — keyed by slug/id).
   Arabic sources are untouched; these only apply when lang = "en".
   ═══════════════════════════════════════════════════════════ */

export const PROFILE_EN = {
  role: "Software & Cybersecurity Engineer",
  tagline: "Engineering secure digital experiences — technology that is useful, maintainable and accessible to everyone",
  bio1:
    "A technology developer focused on software engineering, cybersecurity, native Android development and open-source innovation. My approach combines technical exploration, practical problem-solving, secure engineering principles and continuous learning — I aim to understand how software systems work, improve their reliability, harden their security, and turn ideas into genuinely useful digital products.",
  bio2:
    "I believe great software must be more than good-looking: reliable, easy to maintain, privacy-aware and built with a clear purpose. My goal:",
  heroDesc:
    "A technology developer focused on software engineering, cybersecurity, native Android development and open-source innovation — combining technical exploration, practical problem-solving and secure engineering principles in open-source projects.",
};

export const TYPING_ROLES_EN = [
  "Software Engineering",
  "Cybersecurity",
  "Engineering Secure Digital Experiences",
  "Native Android Development",
  "Open Source & Innovation",
  "Building Technology with Purpose",
];

export const DASHBOARD_METRICS_EN = [
  { label: "Open-source repositories", badge: "GitHub" },
  { label: "Technologies & tools", badge: "Range" },
  { label: "Technical focus areas", badge: "Focus" },
  { label: "Binding engineering principles", badge: "Commitment" },
];

export const ACHIEVEMENTS_EN = [
  "Launched the official CTO-DRS platform — cto-drs.com",
  "Built NexusLink — a local device hub with full E2E encryption",
  "Released SecureNet VPN on a WireGuard architecture",
  "Developed Arabi — a fully Arabic programming language",
];

/** keyed by project id in data.ts */
export const PROJECTS_EN: Record<string, { title: string; description: string }> = {
  nexuslink: {
    title: "NexusLink — Your Local Device Hub",
    description:
      "Connect every device on your local network: screen mirroring and remote control, file transfer, clipboard sync and media streaming — fully end-to-end encrypted, with no cloud and no accounts",
  },
  "securenet-vpn": {
    title: "SecureNet VPN — Enterprise-Grade Privacy",
    description:
      "A WireGuard-based virtual private network with an on-device security scanner and network optimizer — Kotlin + C++ (NDK) + Go on a clean MVVM architecture",
  },
  "super-biz": {
    title: "SuperBiz — Offline Business Management",
    description:
      "A complete Android business management system that works 100% offline — invoicing, inventory and point of sale, backed by more than 1,400 unit tests",
  },
  "drs-ai": {
    title: "DRS AI — A Private AI System",
    description:
      "An enterprise AI operating system with 40+ microservices — self-hosted, fully offline, and supporting Arabic, English, French and German",
  },
  "arabi-lang": {
    title: "Arabi — Programming in Classical Arabic",
    description:
      "A fully Arabic programming language in the spirit of Python: variables, functions, loops, lists, dictionaries and an interactive interpreter — built with Python",
  },
  "drs-smart-keyboard": {
    title: "DRS Smart Keyboard — A Privacy-Aware Keyboard",
    description:
      "A fully native Arabic IME for Android: on-device intelligence, proven privacy and a cryptographically signed extension system",
  },
};

export const PERFORMANCE_STATS_EN = [
  "Open-source repositories",
  "Technologies & tools",
  "Technical domains",
  "Engineering principles",
  "Programming languages",
];

export const VIDEOS_EN = [
  { title: "Building a Secure REST API with PHP 8.2", description: "A practical walkthrough of a secure RESTful API with JWT and CSRF protection" },
  { title: "Defensive Cybersecurity in 2026", description: "A comprehensive introduction to defensive security and protection practices" },
  { title: "Task Automation with Python & Cron", description: "A practical guide to automating repetitive tasks on Linux servers" },
];

export const COURSES_EN = [
  { title: "Mastering PHP 8 from Scratch", description: "A complete course taking you from PHP 8 fundamentals to professional mastery", level: "Intermediate" },
  { title: "Defensive Cybersecurity", description: "Learn defensive security practices and how to protect systems", level: "Advanced" },
  { title: "Building Telegram Bots with Python", description: "A hands-on course for building professional Telegram bots", level: "Beginner" },
];

export const TOOLS_EN = [
  "A security scanning tool for systems that detects common vulnerabilities",
  "A PHP framework for building Telegram bots quickly",
  "Automatic OpenAPI/Swagger documentation generator from your code",
];

export const GALLERY_EN = [
  { title: "E-commerce Admin Dashboard", description: "A professional dashboard design for an online store" },
  { title: "Defensive Cybersecurity", description: "Core focus area: security assessment, secure coding and responsible disclosure" },
  { title: "The Workspace", description: "My personal workspace with the latest hardware" },
  { title: "Admin Dashboards", description: "Arabic admin interfaces in a Cyber Dashboard style" },
  { title: "TikTok Intelligence Bot", description: "A Telegram bot for analytics and tracking with multi-format reports" },
];

export const QUICK_TOOLS_EN = [
  { title: "Cost Calculator", description: "Get an instant estimate of your project cost in seconds" },
  { title: "Book a Consultation", description: "A free 30-minute consultation — pick a time that suits you" },
  { title: "Webinars & Workshops", description: "Live and recorded sessions on programming and cybersecurity" },
  { title: "Plans & Pricing", description: "Start free today — transparent plans with no hidden fees" },
  { title: "Download Center", description: "Direct downloads of my apps and tools from GitHub Releases" },
];

export const SERVICES_EN = [
  "Native Android app development",
  "Secure website & web app development",
  "Security assessment & ethical penetration testing",
  "Python tools & automation",
  "Open-source projects",
  "Privacy engineering & offline-first systems",
];

/** keyed by app id in apps.ts */
export const APPS_EN: Record<string, { title: string; description: string; extra?: string[] }> = {
  nexuslink: {
    title: "NexusLink — Your Local Device Hub",
    description:
      "Screen mirroring and remote control, file transfer, clipboard sync and media streaming between your devices on the local network — fully E2E encrypted with no cloud and no accounts. Available for Android and macOS.",
    extra: ["AAB bundle for Google Play publishing", "macOS build (screen & control)"],
  },
  "securenet-vpn": {
    title: "SecureNet VPN — Enterprise-Grade Privacy",
    description:
      "A WireGuard-based virtual private network with an on-device security scanner and network optimizer — Kotlin + C++ (NDK) + Go on a clean MVVM architecture.",
  },
  "super-biz": {
    title: "SuperBiz — Offline Business Management",
    description:
      "A complete Android business management system that works 100% offline — ZATCA-compliant invoicing, inventory and point of sale with more than 1,400 unit tests.",
  },
  "drs-smart-keyboard": {
    title: "DRS Smart Keyboard — A Privacy-Aware Arabic Keyboard",
    description:
      "A fully native Arabic IME for Android: on-device intelligence that works without internet, proven privacy, and a cryptographically signed extension system (theme packs).",
    extra: ["AAB bundle for Google Play publishing", "Amethyst theme pack", "Carbon theme pack"],
  },
  "onyx-keyboard": {
    title: "Onyx Keyboard — Privacy & Customization Pack",
    description:
      "An Android keyboard fully focused on privacy and customization — a lightweight release build (2.4MB) and a full-featured debug build.",
    extra: ["Full-featured debug build (19MB)"],
  },
  novafiles: {
    title: "NovaFiles — A Modern File Manager for Android",
    description:
      "An Android file manager with a modern interface and complete file and folder management — a stable, lightweight release build.",
    extra: ["Source code ZIP"],
  },
  violetchat: {
    title: "Violet Chat — Elegant Instant Messaging",
    description:
      "An open-source chat app built with Flutter/Dart — the universal build supports every architecture and ships with a SHA256 checksum file.",
    extra: ["SHA256 checksum file"],
  },
  "lumina-studio": {
    title: "Lumina Studio — A Creative Studio",
    description:
      "A creative studio app for Android — available as a ready-to-try APK and a complete source package for developers.",
    extra: ["Source code ZIP"],
  },
  "arabi-lang": {
    title: "Arabi — Programming in Classical Arabic",
    description:
      "A fully Arabic programming language in the spirit of Python: variables, functions, loops, lists, dictionaries and an interactive interpreter — a ready-to-run ZIP package for Python.",
  },
  "drs-ai": {
    title: "DRS AI — A Private AI System",
    description:
      "An enterprise AI operating system with 40+ microservices — self-hosted, works offline, and supports Arabic, English, French and German. Currently available as direct source.",
  },
};

/** keyed by SOURCE_REPOS id in apps.ts */
export const SOURCE_REPOS_EN: Record<string, string> = {
  "ultimate-ai-suite": "An AI toolbox with no API keys: currency converter, password generator, QR, JSON formatter — works offline",
  "tiktok-bot": "A Telegram bot for analytics and tracking with multi-format reports — Python",
  "drs-bot-host": "A system for hosting and managing Telegram bots on servers — Python",
  "masar-al-lugha": "An open-source language-learning app built with Flutter/Dart",
  "battle-arena-lan": "A local multiplayer fighting game over LAN built with Godot/GDScript",
  "drs-os": "An experimental Android operating system built with Kotlin",
};

/** English titles for SOURCE_REPOS whose title is Arabic */
export const SOURCE_REPO_TITLES_EN: Record<string, string> = {
  "masar-al-lugha": "Masar Al-Lugha (Language Path)",
};

/** FAQ in the same order as FAQS in faq-data.ts */
export const FAQS_EN: { q: string; a: string }[] = [
  {
    q: "How long does a project take?",
    a: "It depends on the project's size and complexity: a company website usually takes 5 to 10 working days, while complete systems and custom applications take 4 to 12 weeks. We give you a clear timeline with defined milestones before work begins — and we stick to it.",
  },
  {
    q: "How do I start a new project with you?",
    a: "Reach out through the contact page or book a free consultation. We discuss your idea and pin down the requirements, then send you a detailed technical and financial proposal within 48 hours. Once you approve, work starts immediately.",
  },
  {
    q: "Which technologies do you use?",
    a: "We use modern technologies: Next.js and React for front ends, Node.js with modern databases for back ends, plus advanced penetration-testing tools such as Burp Suite and Metasploit. We always choose the stack that best fits your project and its goals.",
  },
  {
    q: "How do you ensure the quality of delivered projects?",
    a: "We follow a strict methodology with weekly code reviews, automated and manual testing (unit & E2E), and a full security review before delivery — plus a staging environment where you follow progress and review each phase before we move on.",
  },
  {
    q: "Do you sign non-disclosure agreements (NDAs)?",
    a: "Yes. We sign an NDA before any detailed meeting, all client data is kept strictly confidential over encrypted channels, and your name or project details are never mentioned anywhere without your prior written permission.",
  },
  {
    q: "What does the post-delivery warranty cover?",
    a: "The warranty covers free fixes for any software defects for 30 days after delivery, along with technical support by email and direct contact to make sure the project runs fully stable in production.",
  },
  {
    q: "What payment methods and instalment terms are available?",
    a: "We accept bank transfers and online payment gateways. Projects use a flexible instalment plan: 40% at kickoff, 30% when the first version is delivered, and 30% at final delivery. Small projects are split 50/50.",
  },
  {
    q: "Do you issue official invoices?",
    a: "Yes. We issue an official tax invoice for every payment, sent to you electronically right away, and can provide any additional documents your company needs for accounting and auditing.",
  },
  {
    q: "What is the refund or cancellation policy?",
    a: "You can cancel a project at any time; the work actually completed up to the cancellation date is billed and the remaining balance is refunded automatically within 7 working days — with no hidden fees or complicated conditions.",
  },
  {
    q: "Do you offer technical support after delivery?",
    a: "Yes. Every project comes with 30 days of free technical support after delivery, after which flexible monthly support contracts are available, covering continuous monitoring, updates and rapid response to emergencies.",
  },
  {
    q: "What does the monthly maintenance contract include?",
    a: "It includes regular automatic backups, package updates and security patches, round-the-clock performance and security monitoring, a detailed monthly report, and extra development hours you can use when needed.",
  },
  {
    q: "How do follow-up meetings work during the project?",
    a: "We hold a weekly video call to show the progress made and the next phase, followed by a written report, and you can track tasks in real time on the project management board at any time.",
  },
];

/** keyed by social id */
export const SOCIALS_EN: Record<string, { label: string; handle?: string }> = {
  whatsapp: { label: "WhatsApp (Business)", handle: "Official WhatsApp" },
  telegram: { label: "Telegram" },
  tiktok: { label: "TikTok" },
  x: { label: "X (Twitter)" },
  instagram: { label: "Instagram" },
  youtube: { label: "YouTube" },
  github: { label: "GitHub" },
  website: { label: "Official website" },
};

/** keyed by contact purpose id */
export const PURPOSES_EN: Record<string, { label: string; desc: string }> = {
  project: { label: "New project", desc: "Website, app or complete system" },
  consulting: { label: "Technical consultation", desc: "Code review, architecture or roadmap" },
  security: { label: "Cybersecurity", desc: "Penetration test or security assessment" },
  collab: { label: "Collaboration or partnership", desc: "Joint work or business partnership" },
  support: { label: "Technical support", desc: "An issue with an existing project" },
  other: { label: "Other", desc: "Any other enquiry" },
};

/* ─── API / DB records (keyed by slug) ─── */

export const API_SERVICES_EN: Record<string, { title: string; description: string; duration: string; features: string[] }> = {
  "ecommerce-development": {
    title: "E-commerce Store Development",
    description:
      "We build your online store with the latest technologies, a seamless checkout experience and exceptional load speed — including full integration with local and international payment gateways.",
    duration: "6–8 weeks",
    features: [
      "Fully responsive design for every device",
      "Multiple secure payment gateways",
      "Integrated dashboard for managing orders",
      "Search engine optimization (SEO)",
      "Free technical support for 3 months",
    ],
  },
  "corporate-websites": {
    title: "Corporate Website Development",
    description:
      "Websites that reflect your brand professionally with a modern, attractive design. We design and build a fast site that turns visitors into customers.",
    duration: "3–5 weeks",
    features: [
      "Consistent visual identity across the site",
      "Easy-to-use content management system",
      "Contact forms linked to your channels",
      "Highly optimized performance and speed",
    ],
  },
  "analytics-dashboards": {
    title: "Analytics Dashboards",
    description:
      "Turn your data into smart decisions with live, interactive dashboards. We connect your multiple data sources into one clear interface.",
    duration: "4–6 weeks",
    features: [
      "Real-time interactive charts",
      "Automated periodic email reports",
      "Multi-level permissions",
      "Data export in multiple formats",
      "Integration with external analytics tools",
    ],
  },
  "web-pentesting": {
    title: "Web Application Penetration Testing",
    description:
      "We find your application's vulnerabilities before attackers do, using a comprehensive testing methodology — with a detailed report and a clearly prioritized remediation plan.",
    duration: "2–3 weeks",
    features: [
      "Testing against the OWASP Top 10",
      "Combined manual and automated testing",
      "Realistic attack simulation",
      "Detailed technical and executive report",
      "Review session with your technical team",
    ],
  },
  "security-audit": {
    title: "Comprehensive Security Audit",
    description:
      "An in-depth security review covering infrastructure, applications and internal policies — giving you a complete roadmap to strengthen your security posture.",
    duration: "3–4 weeks",
    features: [
      "Infrastructure and server audit",
      "Security-focused source code review",
      "Assessment of permission and access policies",
      "Prioritized remediation plan",
      "Re-test after fixes",
    ],
  },
  "threat-monitoring": {
    title: "Threat Monitoring & Response",
    description:
      "We monitor your systems around the clock and respond to incidents before they spread — a dedicated security team protecting your business day and night.",
    duration: "Monthly subscription",
    features: [
      "24/7 real-time monitoring",
      "Instant alerts for critical threats",
      "First incident response within minutes",
      "Comprehensive monthly security report",
    ],
  },
  "mobile-apps": {
    title: "iOS & Android App Development",
    description:
      "High-performance native and cross-platform mobile apps with a refined user experience — with you from idea to store launch.",
    duration: "8–12 weeks",
    features: [
      "Native-feeling interfaces for each platform",
      "Push notifications and native integrations",
      "Full app store publishing",
      "Testing on real devices",
      "Updates and support for 6 months",
    ],
  },
  "digital-transformation": {
    title: "Digital Transformation Consulting",
    description:
      "We help you map out a realistic digital strategy that fits your business size and budget — from assessing where you are today to a phased execution plan.",
    duration: "1–2 weeks",
    features: [
      "Full digital maturity assessment",
      "Realistic phased roadmap",
      "Recommendations for suitable tools and solutions",
      "Follow-up sessions with management",
    ],
  },
  "growth-optimization": {
    title: "Performance & Growth Optimization",
    description:
      "We analyse the user journey on your platform and precisely improve conversion points — measurable results that grow revenue without increasing ad spend.",
    duration: "2 weeks",
    features: [
      "User behaviour analysis",
      "Well-designed A/B tests",
      "Speed optimization of critical pages",
      "Before-and-after results report",
    ],
  },
  "maintenance-support": {
    title: "Maintenance & Technical Support",
    description:
      "Keep your systems up to date, secure and stable without hiring an in-house team — flexible plans that fit your projects' changing needs.",
    duration: "Monthly subscription",
    features: [
      "Regular security updates",
      "Scheduled backups",
      "Uptime and performance monitoring",
      "Guaranteed response times",
    ],
  },
};

export const API_PROJECTS_EN: Record<string, { title: string; description: string }> = {
  nexuslink: PROJECTS_EN.nexuslink,
  "securenet-vpn": PROJECTS_EN["securenet-vpn"],
  superbiz: {
    title: "SuperBiz — Offline Business Management",
    description:
      "A complete Android business management system that works 100% offline: invoicing, inventory and point of sale — with more than 1,400 unit tests for reliability.",
  },
  "drs-ai": {
    title: "DRS AI — A Private AI System",
    description:
      "An enterprise AI operating system with 40+ microservices — self-hosted, fully offline, supporting Arabic, English, French and German, with mobile and desktop apps.",
  },
  "arabi-lang": {
    title: "Arabi — Programming in Classical Arabic",
    description:
      "A fully Arabic programming language in the spirit of Python: variables, functions, loops, lists, dictionaries and an interactive interpreter — an open-source project built with Python.",
  },
  "drs-smart-keyboard": PROJECTS_EN["drs-smart-keyboard"],
  "tiktok-intelligence-bot": {
    title: "TikTok Intelligence Bot — A Telegram Analytics Bot",
    description:
      "A Telegram bot for analysing TikTok accounts: scanning, analytics and tracking, with bilingual reports in PDF/HTML/Excel/JSON — built with Python, Docker, Celery, Redis and PostgreSQL.",
  },
  "cto-drs-website": {
    title: "The CTO.DRS Platform — This Website",
    description:
      "The official CTO-DRS platform: project portfolio, store, courses, blog and a full admin dashboard — built with Next.js 16, TypeScript and Prisma.",
  },
};

export const API_COURSES_EN: Record<string, { title: string; description: string }> = {
  "nextjs-fullstack": {
    title: "Modern Web App Development with Next.js",
    description:
      "A complete course taking you from Next.js fundamentals to full applications with server components, authentication and databases. By the end you'll have built a production-ready platform.",
  },
  "cybersecurity-fundamentals": {
    title: "Practical Cybersecurity Fundamentals",
    description:
      "Start your cybersecurity journey from zero with a hands-on track built on real-world scenarios. Learn to protect systems, find vulnerabilities and respond to incidents.",
  },
  "typescript-mastery": {
    title: "Mastering TypeScript for Professional Projects",
    description:
      "Move from JavaScript to TypeScript with confidence and discover the power of types for building large, maintainable applications. Advanced patterns, tooling and best practices.",
  },
  "applied-ai-engineering": {
    title: "Applied AI Engineering",
    description:
      "An advanced course on building LLM-powered applications: prompt engineering, model fine-tuning and production deployment — with a real capstone project for your portfolio.",
  },
  "web-app-sec-owasp": {
    title: "Web Application Security with OWASP",
    description:
      "Dive deep into the most dangerous web vulnerabilities, how they're exploited and how to shut them down in practice — interactive labs simulating real attacks on training apps.",
  },
  "python-basics": {
    title: "Python Programming Fundamentals",
    description:
      "The ideal beginner Python course: from your first line of code to building complete tools and programs. Daily exercises and small projects that cement the concepts.",
  },
  "react-interfaces": {
    title: "Building Interactive UIs with React",
    description:
      "Learn to build modern, interactive interfaces with React and its modern toolchain — from components and state to data management and advanced optimizations.",
  },
  "machine-learning-zero": {
    title: "Machine Learning from Scratch",
    description:
      "Understand how machine learning algorithms really work instead of just calling libraries — from linear regression to neural networks, applied to real data.",
  },
};

/** Arabic category / level / misc label → English (API data and tags) */
export const TERMS_EN: Record<string, string> = {
  // service categories
  "تطوير الويب": "Web Development",
  "الأمن السيبراني": "Cybersecurity",
  "تطبيقات الجوال": "Mobile Apps",
  الاستشارات: "Consulting",
  // project categories
  أدوات: "Tools",
  أمن: "Security",
  موبايل: "Mobile",
  "ذكاء اصطناعي": "AI",
  أتمتة: "Automation",
  ويب: "Web",
  // course categories
  "لغات البرمجة": "Programming Languages",
  "الذكاء الاصطناعي": "Artificial Intelligence",
  // levels
  مبتدئ: "Beginner",
  متوسط: "Intermediate",
  متقدم: "Advanced",
  // project tags
  "تشفير E2E": "E2E encryption",
  "محلي أولاً": "Local-first",
  "لغة عربية": "Arabic language",
  "مفتوح المصدر": "Open source",
  خصوصية: "Privacy",
  // instructors
  "د. رشا التقني": "Dr. Rasha Al-Taqni",
  "م. خالد الحربي": "Eng. Khalid Al-Harbi",
  "م. سارة العتيبي": "Eng. Sarah Al-Otaibi",
  // durations
  "اشتراك شهري": "Monthly subscription",
};
