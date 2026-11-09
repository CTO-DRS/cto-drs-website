/* ═══════════════════════════════════════════════════════════
   academy.ts — بيانات أكاديمية الرشيد (academy.cto-drs.com)
   المصدر: مستودع منصة الرشيد (prisma/seed.js) ومطابَقة مع
   الواجهة الحية /api/tracks و /api/courses و /api/stats (نوفمبر 2026):
   5 مسارات · 15 دورة · 30 وحدة · 120 درساً · 240 سؤال اختبار · 6 تحديات CTF
   كل دورة = وحدتان × 4 دروس = 8 دروس، وسؤالا اختبار لكل درس.
   ═══════════════════════════════════════════════════════════ */
import { ACADEMY_URL } from "@/lib/social";

export const ACADEMY_REGISTER_URL = `${ACADEMY_URL}/register`;
export const ACADEMY_TRACKS_URL = `${ACADEMY_URL}/tracks`;
export const ACADEMY_CHALLENGES_URL = `${ACADEMY_URL}/challenges`;
export const academyCourseUrl = (slug: string) => `${ACADEMY_URL}/courses/${slug}`;

export const ACADEMY_STATS = { tracks: 5, courses: 15, lessons: 120, quizzes: 240, ctf: 6 } as const;

export type AcademyLevel = "beginner" | "intermediate" | "advanced";

export interface AcademyCourse {
  slug: string;
  titleAr: string;
  title: string;
  level: AcademyLevel;
  lessons: number;
  hours: number;
}

export interface AcademyTrack {
  slug: string;
  icon: string;
  color: string;
  titleAr: string;
  title: string;
  descAr: string;
  desc: string;
  courses: AcademyCourse[];
}

const c = (slug: string, titleAr: string, title: string, i: number): AcademyCourse => ({
  slug,
  titleAr,
  title,
  level: i === 0 ? "beginner" : i === 1 ? "intermediate" : "advanced",
  lessons: 8,
  hours: (i + 1) * 4,
});

export const ACADEMY_TRACKS: AcademyTrack[] = [
  {
    slug: "cybersecurity",
    icon: "🛡️",
    color: "#10b981",
    titleAr: "مسار الأمن السيبراني",
    title: "Cybersecurity Track",
    descAr: "تعلّم أساسيات وأسرار حماية الأنظمة والشبكات من الاختراق.",
    desc: "Learn the fundamentals of protecting systems and networks from attacks.",
    courses: [
      c("cybersecurity-course-1", "مقدمة في الأمن السيبراني", "Introduction to Cybersecurity", 0),
      c("cybersecurity-course-2", "أمن تطبيقات الويب", "Web Application Security", 1),
      c("cybersecurity-course-3", "الاستجابة للحوادث", "Incident Response", 2),
    ],
  },
  {
    slug: "ethical-hacking",
    icon: "💻",
    color: "#ef4444",
    titleAr: "مسار الاختراق الأخلاقي",
    title: "Ethical Hacking Track",
    descAr: "احترف تقنيات اختبار الاختراق واكتشاف الثغرات بشكل قانوني وأخلاقي.",
    desc: "Master penetration testing and vulnerability discovery — legally and ethically.",
    courses: [
      c("ethical-hacking-course-1", "أساسيات الاختراق الأخلاقي", "Ethical Hacking Fundamentals", 0),
      c("ethical-hacking-course-2", "اختبار الاختراق للشبكات", "Network Penetration Testing", 1),
      c("ethical-hacking-course-3", "تحديات CTF", "CTF Challenges", 2),
    ],
  },
  {
    slug: "programming",
    icon: "⌨️",
    color: "#3b82f6",
    titleAr: "مسار البرمجة",
    title: "Programming Track",
    descAr: "أساسيات البرمجة وبناء المنطق البرمجي بلغات متعددة.",
    desc: "Programming fundamentals and problem-solving across several languages.",
    courses: [
      c("programming-course-1", "أساسيات بايثون", "Python Basics", 0),
      c("programming-course-2", "أساسيات جافا سكريبت", "JavaScript Basics", 1),
      c("programming-course-3", "الخوارزميات وهياكل البيانات", "Algorithms & Data Structures", 2),
    ],
  },
  {
    slug: "linux",
    icon: "🐧",
    color: "#f59e0b",
    titleAr: "مسار لينكس",
    title: "Linux Track",
    descAr: "أتقن نظام لينكس وسطر الأوامر وإدارة الخوادم.",
    desc: "Master Linux, the command line and server administration.",
    courses: [
      c("linux-course-1", "أساسيات لينكس", "Linux Fundamentals", 0),
      c("linux-course-2", "إدارة الخوادم", "Server Administration", 1),
      c("linux-course-3", "أمن لينكس", "Linux Security", 2),
    ],
  },
  {
    slug: "networking",
    icon: "🌐",
    color: "#8b5cf6",
    titleAr: "مسار الشبكات",
    title: "Networking Track",
    descAr: "افهم كيف تعمل الشبكات وبروتوكولاتها وأدوات تحليلها.",
    desc: "Understand how networks work, their protocols and analysis tools.",
    courses: [
      c("networking-course-1", "أساسيات الشبكات", "Networking Fundamentals", 0),
      c("networking-course-2", "تحليل حركة الشبكة", "Network Traffic Analysis", 1),
      c("networking-course-3", "أمن الشبكات", "Network Security", 2),
    ],
  },
];

export const ACADEMY_COURSES: (AcademyCourse & { trackAr: string; track: string })[] = ACADEMY_TRACKS.flatMap((t) =>
  t.courses.map((x) => ({ ...x, trackAr: t.titleAr, track: t.title })),
);
