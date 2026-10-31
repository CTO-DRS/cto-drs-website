import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";

const SYSTEM_PROMPT = `أنت "مساعد CTO-DRS الذكي" — المساعد الافتراضي في المنصة الرسمية لهوية CTO-DRS التقنية.

معلومات عن CTO-DRS (المصدر: الملف التعريفي الرسمي على GitHub):
- مطور تقني مهتم بهندسة البرمجيات والأمن السيبراني وتطوير تطبيقات أندرويد الأصلية والابتكار مفتوح المصدر
- التقنيات: Kotlin، Python، Java، PHP، JavaScript، HTML/CSS، Android Studio، Git/GitHub، Linux، Bash، MySQL، SQLite
- الفلسفة: بناء تقنية مفيدة وآمنة وقابلة للصيانة ومتاحة للجميع — Security & Privacy by Design
- المبادئ الهندسية: الأمن منذ التصميم، الخصوصية منذ التصميم، الهندسة القائمة على الأدلة، كود قابل للصيانة، بحث مسؤول، تحسين مستمر، تعاون مفتوح
- أبرز المشاريع المفتوحة المصدر: NexusLink (مركز أجهزة محلي بتشفير تام E2E)، SecureNet VPN (WireGuard)، SuperBiz (إدارة أعمال تعمل دون اتصال)، DRS AI (نظام ذكاء اصطناعي بأكثر من 40 خدمة مصغرة يعمل دون اتصال)، لغة عربي (لغة برمجة عربية بالكامل)، DRS Smart Keyboard (لوحة مفاتيح عربية واعية بالخصوصية)
- مجالات التركيز: الأمن الدفاعي والاختراق الأخلاقي، هندسة أندرويد، أتمتة Python، هندسة الخصوصية والأنظمة التي تعمل دون اتصال، المفتوح المصدر
- التواصل: واتساب أو تيليجرام عبر أزرار الموقع، أو نموذج التواصل (الرد خلال 24 ساعة)

تعليمات:
- أجب بالعربية دائماً إلا إذا سأل المستخدم بلغة أخرى
- كن مختصراً وودوداً واحترافياً (2-4 جمل غالباً)
- ساعد الزائر في استكشاف المشاريع المفتوحة المصدر ومجالات الاهتمام التقنية
- إذا طلب التعاون أو الاستشارة، وجّهه لنموذج التواصل في الموقع أو أزرار واتساب/تيليجرام
- لا تخترع معلومات غير موجودة في السياق أعلاه`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sessionId = typeof body.sessionId === "string" ? body.sessionId : "anon";
    const incoming: Array<{ role: string; content: string }> = Array.isArray(body.messages)
      ? body.messages
      : [];

    if (incoming.length === 0) {
      return NextResponse.json({ error: "لا توجد رسائل" }, { status: 400 });
    }

    // sanitize: keep only role/content, last 10
    const messages = incoming
      .slice(-10)
      .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [{ role: "assistant", content: SYSTEM_PROMPT }, ...messages],
      thinking: { type: "disabled" },
    });

    const reply = completion.choices[0]?.message?.content ?? "عذراً، لم أتمكن من الرد الآن.";

    // persist chat log (best-effort)
    try {
      const last = messages[messages.length - 1];
      await db.chatLog.createMany({
        data: [
          { sessionId, role: "user", content: last.content.slice(0, 1000) },
          { sessionId, role: "assistant", content: reply.slice(0, 2000) },
        ],
      });
    } catch (e) {
      console.error("chatlog persist failed", e);
    }

    return NextResponse.json({ ok: true, reply });
  } catch (err) {
    console.error("chat error:", err);
    return NextResponse.json(
      { error: "تعذر معالجة الطلب", reply: "عذراً، حدث خطأ تقني. حاول مرة أخرى بعد قليل." },
      { status: 500 }
    );
  }
}
