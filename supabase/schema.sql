create extension if not exists "pgcrypto";

create table if not exists public.professionals (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  specialty text not null,
  bio text default '',
  price integer not null default 0,
  location text default '',
  crm text not null,
  rating numeric(2,1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references auth.users(id) on delete cascade,
  professional_id uuid not null references public.professionals(id) on delete cascade,
  patient_name text,
  professional_name text,
  specialty text,
  price integer not null default 0,
  date date not null,
  time text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed', 'no-show')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_appointments_patient_id on public.appointments(patient_id);
create index if not exists idx_appointments_professional_id on public.appointments(professional_id);
create index if not exists idx_appointments_status on public.appointments(status);
create index if not exists idx_appointments_date_time on public.appointments(date, time);

create or replace function public.sync_professional_from_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(new.raw_user_meta_data ->> 'userType', '') = 'professional'
     and coalesce(new.raw_user_meta_data ->> 'specialty', '') <> ''
     and coalesce(new.raw_user_meta_data ->> 'crm', '') <> '' then
    insert into public.professionals (
      id,
      name,
      specialty,
      bio,
      price,
      location,
      crm,
      rating,
      updated_at
    )
    values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'name', new.email, 'Profissional'),
      new.raw_user_meta_data ->> 'specialty',
      coalesce(new.raw_user_meta_data ->> 'bio', ''),
      coalesce(nullif(new.raw_user_meta_data ->> 'price', '')::integer, 0),
      coalesce(new.raw_user_meta_data ->> 'location', ''),
      new.raw_user_meta_data ->> 'crm',
      null,
      now()
    )
    on conflict (id) do update
      set name = excluded.name,
          specialty = excluded.specialty,
          bio = excluded.bio,
          price = excluded.price,
          location = excluded.location,
          crm = excluded.crm,
          updated_at = now();
  end if;

  return new;
end;
$$;

drop trigger if exists sync_professional_from_auth_user on auth.users;
create trigger sync_professional_from_auth_user
after insert or update of email, raw_user_meta_data
on auth.users
for each row
execute function public.sync_professional_from_auth_user();

insert into public.professionals (
  id,
  name,
  specialty,
  bio,
  price,
  location,
  crm,
  rating,
  created_at,
  updated_at
)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'name', u.email, 'Profissional'),
  u.raw_user_meta_data ->> 'specialty',
  coalesce(u.raw_user_meta_data ->> 'bio', ''),
  coalesce(nullif(u.raw_user_meta_data ->> 'price', '')::integer, 0),
  coalesce(u.raw_user_meta_data ->> 'location', ''),
  u.raw_user_meta_data ->> 'crm',
  null,
  now(),
  now()
from auth.users u
where coalesce(u.raw_user_meta_data ->> 'userType', '') = 'professional'
  and coalesce(u.raw_user_meta_data ->> 'specialty', '') <> ''
  and coalesce(u.raw_user_meta_data ->> 'crm', '') <> ''
on conflict (id) do update
  set name = excluded.name,
      specialty = excluded.specialty,
      bio = excluded.bio,
      price = excluded.price,
      location = excluded.location,
      crm = excluded.crm,
      updated_at = now();

alter table public.professionals enable row level security;
alter table public.appointments enable row level security;

drop policy if exists "professionals_select_authenticated" on public.professionals;
create policy "professionals_select_authenticated"
on public.professionals
for select
to authenticated
using (true);

drop policy if exists "professionals_insert_own" on public.professionals;
create policy "professionals_insert_own"
on public.professionals
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "professionals_update_own" on public.professionals;
create policy "professionals_update_own"
on public.professionals
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "appointments_select_participants" on public.appointments;
create policy "appointments_select_participants"
on public.appointments
for select
to authenticated
using (auth.uid() = patient_id or auth.uid() = professional_id);

drop policy if exists "appointments_insert_patient" on public.appointments;
create policy "appointments_insert_patient"
on public.appointments
for insert
to authenticated
with check (auth.uid() = patient_id);

drop policy if exists "appointments_update_patient" on public.appointments;
create policy "appointments_update_patient"
on public.appointments
for update
to authenticated
using (auth.uid() = patient_id)
with check (auth.uid() = patient_id);

drop policy if exists "appointments_update_professional" on public.appointments;
create policy "appointments_update_professional"
on public.appointments
for update
to authenticated
using (auth.uid() = professional_id)
with check (auth.uid() = professional_id);
