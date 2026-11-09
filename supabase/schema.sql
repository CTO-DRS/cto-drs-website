-- CTO-DRS accounts + admin schema
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role text not null default 'client' check (role in ('client','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  service text not null,
  preferred_date date,
  notes text,
  status text not null default 'pending' check (status in ('pending','confirmed','done','cancelled')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name',
          case when lower(new.email) in ('cto.drs@gmail.com','contact@cto-drs.com') then 'admin' else 'client' end);
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- prevent non-admins from changing their own role
create or replace function public.protect_role() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    new.role := old.role;
  end if;
  return new;
end; $$;
drop trigger if exists protect_role on public.profiles;
create trigger protect_role before update on public.profiles
  for each row execute function public.protect_role();

alter table public.profiles enable row level security;
alter table public.contact_messages enable row level security;
alter table public.bookings enable row level security;

create policy "profiles self read" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles self update" on public.profiles for update using (id = auth.uid() or public.is_admin());

-- موحّد مع migration-002.sql (إغلاق F-06): الإدخال من مجهول بلا user_id أو لصاحبه، وبالحالة new حصراً
create policy "contact insert anyone" on public.contact_messages for insert
  with check ((user_id is null or user_id = auth.uid()) and status = 'new');
create policy "contact admin read" on public.contact_messages for select using (public.is_admin() or user_id = auth.uid());
create policy "contact admin update" on public.contact_messages for update using (public.is_admin());
create policy "contact admin delete" on public.contact_messages for delete using (public.is_admin());

-- موحّد مع migration-002.sql (إغلاق F-06): الإدخال بحالة pending حصراً
create policy "bookings own insert" on public.bookings for insert
  with check (user_id = auth.uid() and status = 'pending');
create policy "bookings own or admin read" on public.bookings for select using (user_id = auth.uid() or public.is_admin());
create policy "bookings own cancel or admin update" on public.bookings for update using (user_id = auth.uid() or public.is_admin());
create policy "bookings admin delete" on public.bookings for delete using (public.is_admin());
