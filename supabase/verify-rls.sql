-- ═══════════════════════════════════════════════════════════════════════
-- verify-rls.sql — اختبار النفي المجهول لسياسات RLS  (بند P0/3 — إغلاق F-05 و F-06)
--
-- الهدف: إثبات فعلي أن العميل المجهول (anon) لا يستطيع قراءة بيانات
--         contact_messages أو bookings، وأن سياسات الإدخال المشددة
--         (الموحّدة مع migration-002.sql) ترفض الحالات غير الصالحة.
--
-- التشغيل: Supabase Dashboard → SQL Editor → الصق الملف كاملاً → Run
-- الأمان: كل الاختبارات داخل معاملة واحدة تُتراجع (rollback) في النهاية —
--         لا تُكتب أي بيانات ولا يُغيَّر أي شيء.
--
-- النتيجة المتوقعة: 5 أسطر PASS وصفر FAIL.
-- إن ظهر أي FAIL: سياسة RLS غير مطبقة على البيئة الحية → طبّق supabase/schema.sql
-- ثم supabase/migration-002.sql (بالترتيب) وأعد الاختبار، ودوّن النتيجة في docs/P0-SECURITY-AR.md
-- ═══════════════════════════════════════════════════════════════════════

begin;
set local role anon;

do $test$
declare
  c int;
begin

  -- ─── اختبار 1: قراءة contact_messages كعميل مجهول ───
  begin
    select count(*) into c from public.contact_messages;
    if c = 0 then
      raise notice 'PASS [1/5] anon: select contact_messages → 0 صفوف (RLS يمنع القراءة)';
    else
      raise notice 'FAIL [1/5] anon: رأى % صفوف في contact_messages — RLS غير مطبق!', c;
    end if;
  exception
    when insufficient_privilege then
      raise notice 'PASS [1/5] anon: select contact_messages → permission denied (مرفوض كلياً)';
  end;

  -- ─── اختبار 2: قراءة bookings كعميل مجهول ───
  begin
    select count(*) into c from public.bookings;
    if c = 0 then
      raise notice 'PASS [2/5] anon: select bookings → 0 صفوف (RLS يمنع القراءة)';
    else
      raise notice 'FAIL [2/5] anon: رأى % صفوف في bookings — RLS غير مطبق!', c;
    end if;
  exception
    when insufficient_privilege then
      raise notice 'PASS [2/5] anon: select bookings → permission denied (مرفوض كلياً)';
  end;

  -- ─── اختبار 3: إدخال رسالة تواصل بحالة غير مسموحة (read بدل new) — يجب أن يُرفض ───
  begin
    insert into public.contact_messages (name, email, subject, message, status)
    values ('rls-verify', 'rls-verify@example.com', null, 'اختبار RLS', 'read');
    raise notice 'FAIL [3/5] anon: نُفذ إدخال contact_messages بحالة read — سياسة migration-002 غير مطبقة!';
  exception
    when others then
      raise notice 'PASS [3/5] anon: insert contact_messages (status=read) → رُفض بنجاح';
  end;

  -- ─── اختبار 4: إدخال حجز بغير هوية مستخدم — يجب أن يُرفض ───
  begin
    insert into public.bookings (user_id, service, preferred_date, notes, status)
    values (null, 'rls-verify', null, 'اختبار RLS', 'pending');
    raise notice 'FAIL [4/5] anon: نُفذ إدخال bookings بلا user_id — سياسة bookings own insert غير مطبقة!';
  exception
    when others then
      raise notice 'PASS [4/5] anon: insert bookings (user_id=null) → رُفض بنجاح';
  end;

  -- ─── اختبار 5: الإدخال المشروع (رسالة تواصل مجهولة بحالة new) — يجب أن ينجح ───
  begin
    insert into public.contact_messages (name, email, subject, message, status)
    values ('rls-verify', 'rls-verify@example.com', null, 'اختبار RLS — سيُتراجع', 'new');
    raise notice 'PASS [5/5] anon: insert contact_messages (status=new, بلا user_id) → مسموح كما هو مصمم';
  exception
    when others then
      raise notice 'FAIL [5/5] anon: رُفض إدخال رسالة تواصل مشروعية (% ) — راجع سياسة الإدخال', sqlerrm;
  end;

end
$test$;

rollback;
