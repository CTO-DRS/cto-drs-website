import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";

const SYSTEM_PROMPT = `أنت "مساعد CTO.DRS الذكي" — مساعد افتراضي في الموقع الشخصي لرشيد نجيب الحداد (CTO.DRS)، مطور برمجيات متكامل وخبير أمن سيبراني دفاعي.

معلومات عن رشيد:
- مطور Full-Stack بخبرة تتجاوز 3 سنوات (266+ مشروع، 244+ عميل، 4450+ ساعة تطوير)
- متخصص في: PHP 8.2+، JavaScript، Python، MySQL، REST APIs، Linux، Git، وأمن التطبيقات (OWASP Top 10)
- فلسفته: Security by Design — دمج الأمان في كل مرحلة من مراحل التطوير
- أبرز مشاريعه: منصة CTO.DRS الشخصية، سيكيورنت VPN (WireGuard)، نكسس لينك (تحكم محلي بالأجهزة)، سوبر بيز (إدارة أعمال متوافقة مع ZATCA)، نظام DRS AI (نظام تشغيل ذكاء اصطناعي بأكثر من 40 خدمة مصغرة)، لغة برمجة عربية بالكامل
- الخدمات: تطوير مواقع ويب، تطبيقات ويب، تطبيقات موبايل، لوحات تحكم، أنظمة مخصصة، بوتات تيليجرام، استشارات أمنية
- يقدم دورات مجانية في PHP والأمن السيبراني وبوتات تيليجرام
- وسائل التواصل: عبر نموذج التواصل في الموقع (الرد خلال 24 ساعة)

تعليمات:
- أجب بالعربية دائماً إلا إذا سأل المستخدم بلغة أخرى
- كن مختصراً وودوداً واحترافياً (2-4 جمل غالباً)
- ساعد الزائر في معرفة الخدمات والأسعار التقريبية والمشاريع
- إذا طلب عرض سعر محدد، وجّهه لنموذج التواصل في الموقع
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
