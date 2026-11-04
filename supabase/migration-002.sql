-- ═══════════════════════════════════════════════════════════
-- migration-002 — security fixes on top of schema.sql
-- Run once in Supabase → SQL Editor AFTER schema.sql. Idempotent.
--
-- Fixes:
--  1) Admin was granted by email at sign-up, BEFORE the email was confirmed
--     (if "Confirm email" is off, anyone registering as cto.drs@gmail.com
--     became admin). Now admin is granted only once email_confirmed_at is set.
--     ⚠ Keep Auth → "Confirm email" ENABLED: with it disabled Supabase
--     auto-confirms every sign-up, so the email check proves nothing.
--  2) phone from sign-up metadata was dropped → now saved to profiles.phone.
--  3) protect_role silently reverted role changes made from the SQL editor /
--     service_role (auth.uid() is null there) → now allowed when there is no
--     end-user JWT. Also stops users editing their own id/email/created_at.
--  4) contact_messages insert allowed spoofing user_id / status → user_id must
--     be null or the caller, status must be 'new'.
--  5) bookings: clients could insert or update their own booking to
--     'confirmed'/'done' or reassign user_id → clients may only create
--     'pending' bookings and only change status to 'cancelled'.
-- ═══════════════════════════════════════════════════════════

-- 1 + 2) new-user trigger
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    nullif(new.raw_user_meta_data->>'phone', ''),
    case when new.email_confirmed_at is not null
          and lower(new.email) in ('cto.drs@gmail.com','contact@cto-drs.com')
         then 'admin' else 'client' end
  )
  on conflict (id) do nothing;
  return new;
end; $$;

-- promote the owner emails when they confirm their address
create or replace function public.handle_user_confirmed() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.email_confirmed_at is not null and old.email_confirmed_at is null
     and lower(new.email) in ('cto.drs@gmail.com','contact@cto-drs.com') then
    update public.profiles set role = 'admin' where id = new.id;
  end if;
  return new;
end; $$;

drop trigger if exists on_auth_user_confirmed on auth.users;
create trigger on_auth_user_confirmed after update of email_confirmed_at on auth.users
  for each row execute function public.handle_user_confirmed();

-- 3) role / identity protection on profiles
create or replace function public.protect_role() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- no end-user JWT (SQL editor, service_role, internal triggers) → trusted
  if auth.uid() is null then
    return new;
  end if;
  if not public.is_admin() then
    new.role := old.role;
    new.id := old.id;
    new.email := old.email;
    new.created_at := old.created_at;
  end if;
  return new;
end; $$;
-- (trigger protect_role from schema.sql already points at this function)

-- 4) contact_messages insert
drop policy if exists "contact insert anyone" on public.contact_messages;
create policy "contact insert anyone" on public.contact_messages for insert
  with check ((user_id is null or user_id = auth.uid()) and status = 'new');

-- 5) bookings
drop policy if exists "bookings own insert" on public.bookings;
create policy "bookings own insert" on public.bookings for insert
  with check (user_id = auth.uid() and status = 'pending');

create or replace function public.protect_booking() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or public.is_admin() then
    return new;
  end if;
  -- clients: only cancel, nothing else changes
  if new.status is distinct from old.status and new.status <> 'cancelled' then
    raise exception 'clients can only cancel bookings' using errcode = '42501';
  end if;
  new.user_id := old.user_id;
  new.service := old.service;
  new.preferred_date := old.preferred_date;
  new.notes := old.notes;
  new.created_at := old.created_at;
  return new;
end; $$;

drop trigger if exists protect_booking on public.bookings;
create trigger protect_booking before update on public.bookings
  for each row execute function public.protect_booking();
