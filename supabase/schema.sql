-- ============================================================================
-- MedFlow / Supabase Schema
-- ============================================================================
-- Este arquivo mantem a estrutura usada pelo app e tambem adiciona views
-- auxiliares para facilitar a visualizacao no dashboard do Supabase.
--
-- Estrutura principal:
-- 1. auth.users                 -> usuarios autenticados (Supabase Auth)
-- 2. public.professionals       -> perfil profissional usado no app
-- 3. public.availability        -> horarios disponiveis do profissional
-- 4. public.appointments        -> consultas e status de pagamento
--
-- Views administrativas para leitura no dashboard:
-- - public.patient_accounts
-- - public.professional_accounts
-- - public.appointments_overview
-- ============================================================================

create extension if not exists "pgcrypto";

-- ============================================================================
-- TABELAS PRINCIPAIS
-- ============================================================================

create table if not exists public.professionals (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  specialty text not null,
  bio text default '',
  price integer not null default 0,
  location text default '',
  crm text not null,
  meeting_url text,
  rating numeric(2,1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.professionals add column if not exists meeting_url text;

comment on table public.professionals is 'Perfil publico/comercial do profissional exibido no app.';
comment on column public.professionals.id is 'Mesmo id do auth.users para o profissional.';
comment on column public.professionals.price is 'Preco da consulta em centavos.';

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references auth.users(id) on delete cascade,
  professional_id uuid not null references public.professionals(id) on delete cascade,
  patient_name text,
  professional_name text,
  specialty text,
  price integer not null default 0,
  meeting_url text,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  payment_id text,
  payment_preference_id text,
  payment_checkout_url text,
  date date not null,
  time text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed', 'no-show')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.appointments add column if not exists meeting_url text;
alter table public.appointments add column if not exists payment_status text not null default 'pending';
alter table public.appointments add column if not exists payment_id text;
alter table public.appointments add column if not exists payment_preference_id text;
alter table public.appointments add column if not exists payment_checkout_url text;

comment on table public.appointments is 'Consultas agendadas entre paciente e profissional.';
comment on column public.appointments.patient_id is 'Usuario auth do paciente.';
comment on column public.appointments.professional_id is 'Perfil profissional vinculado a consulta.';
comment on column public.appointments.price is 'Valor da consulta em centavos.';

create table if not exists public.availability (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professionals(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time text not null,
  end_time text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.availability is 'Agenda semanal do profissional. Um registro representa um horario livre.';
comment on column public.availability.day_of_week is '0=Seg, 1=Ter, 2=Qua, 3=Qui, 4=Sex, 5=Sab, 6=Dom se usado futuramente.';

-- ============================================================================
-- INDICES
-- ============================================================================

create index if not exists idx_appointments_patient_id on public.appointments(patient_id);
create index if not exists idx_appointments_professional_id on public.appointments(professional_id);
create index if not exists idx_appointments_status on public.appointments(status);
create index if not exists idx_appointments_payment_status on public.appointments(payment_status);
create index if not exists idx_appointments_date_time on public.appointments(date, time);
create index if not exists idx_availability_professional_id on public.availability(professional_id);
create index if not exists idx_availability_day_of_week on public.availability(day_of_week);

-- ============================================================================
-- TRIGGER DE SINCRONIZACAO DO PROFISSIONAL
-- ============================================================================

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
      meeting_url,
      rating,
      updated_at
    )
    values (
      new.id,
      coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), new.email, 'Profissional'),
      new.raw_user_meta_data ->> 'specialty',
      coalesce(new.raw_user_meta_data ->> 'bio', ''),
      coalesce(nullif(new.raw_user_meta_data ->> 'price', '')::integer, 0),
      coalesce(new.raw_user_meta_data ->> 'location', ''),
      new.raw_user_meta_data ->> 'crm',
      nullif(new.raw_user_meta_data ->> 'meetingUrl', ''),
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
          meeting_url = excluded.meeting_url,
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
  meeting_url,
  rating,
  created_at,
  updated_at
)
select
  u.id,
  coalesce(nullif(u.raw_user_meta_data ->> 'name', ''), u.email, 'Profissional'),
  u.raw_user_meta_data ->> 'specialty',
  coalesce(u.raw_user_meta_data ->> 'bio', ''),
  coalesce(nullif(u.raw_user_meta_data ->> 'price', '')::integer, 0),
  coalesce(u.raw_user_meta_data ->> 'location', ''),
  u.raw_user_meta_data ->> 'crm',
  nullif(u.raw_user_meta_data ->> 'meetingUrl', ''),
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
      meeting_url = excluded.meeting_url,
      updated_at = now();

-- ============================================================================
-- VIEWS AUXILIARES PARA O DASHBOARD DO SUPABASE
-- ============================================================================
-- Estas views servem para voce enxergar os dados com mais clareza.
-- O app continua usando as tabelas principais.

create or replace view public.patient_accounts as
select
  u.id,
  coalesce(nullif(u.raw_user_meta_data ->> 'name', ''), u.email, 'Paciente') as name,
  u.email,
  u.phone,
  u.created_at,
  u.updated_at,
  coalesce(u.raw_user_meta_data ->> 'userType', 'patient') as user_type
from auth.users u
where coalesce(u.raw_user_meta_data ->> 'userType', '') = 'patient';

comment on view public.patient_accounts is 'View administrativa para localizar pacientes cadastrados no auth.users.';

create or replace view public.professional_accounts as
select
  u.id,
  coalesce(p.name, nullif(u.raw_user_meta_data ->> 'name', ''), u.email, 'Profissional') as name,
  u.email,
  u.phone,
  p.specialty,
  p.crm,
  p.location,
  p.price,
  p.meeting_url,
  p.rating,
  p.created_at as professional_created_at,
  p.updated_at as professional_updated_at,
  u.created_at as auth_created_at
from auth.users u
join public.professionals p
  on p.id = u.id
where coalesce(u.raw_user_meta_data ->> 'userType', '') = 'professional';

comment on view public.professional_accounts is 'View administrativa com dados de login + perfil do profissional.';

create or replace view public.appointments_overview as
select
  a.id,
  a.status,
  a.payment_status,
  a.date,
  a.time,
  a.price,
  coalesce(a.patient_name, nullif(patient_user.raw_user_meta_data ->> 'name', ''), patient_user.email, 'Paciente') as patient_name,
  patient_user.email as patient_email,
  coalesce(a.professional_name, p.name, nullif(professional_user.raw_user_meta_data ->> 'name', ''), professional_user.email, 'Profissional') as professional_name,
  professional_user.email as professional_email,
  coalesce(a.specialty, p.specialty) as specialty,
  a.payment_id,
  a.payment_preference_id,
  a.payment_checkout_url,
  a.meeting_url,
  a.created_at,
  a.updated_at
from public.appointments a
left join auth.users patient_user
  on patient_user.id = a.patient_id
left join public.professionals p
  on p.id = a.professional_id
left join auth.users professional_user
  on professional_user.id = a.professional_id;

comment on view public.appointments_overview is 'View administrativa para leitura rapida de consultas, paciente, profissional e pagamento.';

-- Nao expor views administrativas para clientes do app.
revoke all on public.patient_accounts from anon, authenticated;
revoke all on public.professional_accounts from anon, authenticated;
revoke all on public.appointments_overview from anon, authenticated;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table public.professionals enable row level security;
alter table public.appointments enable row level security;
alter table public.availability enable row level security;

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

drop policy if exists "availability_select_authenticated" on public.availability;
create policy "availability_select_authenticated"
on public.availability
for select
to authenticated
using (true);

drop policy if exists "availability_insert_own" on public.availability;
create policy "availability_insert_own"
on public.availability
for insert
to authenticated
with check (auth.uid() = professional_id);

drop policy if exists "availability_update_own" on public.availability;
create policy "availability_update_own"
on public.availability
for update
to authenticated
using (auth.uid() = professional_id)
with check (auth.uid() = professional_id);

drop policy if exists "availability_delete_own" on public.availability;
create policy "availability_delete_own"
on public.availability
for delete
to authenticated
using (auth.uid() = professional_id);
