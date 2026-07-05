# MedFlow / Supabase Admin Guide

## Visao rapida

O app usa estas estruturas principais:

- `auth.users`
  login real de pacientes e profissionais
- `public.professionals`
  perfil publico do profissional no app
- `public.availability`
  horarios disponiveis do profissional
- `public.appointments`
  consultas e pagamento

Para leitura mais simples no dashboard, use:

- `public.patient_accounts`
- `public.professional_accounts`
- `public.appointments_overview`

## Onde olhar cada coisa

### Pacientes cadastrados

```sql
select * from public.patient_accounts order by created_at desc;
```

### Profissionais cadastrados

```sql
select * from public.professional_accounts order by auth_created_at desc;
```

### Consultas agendadas

```sql
select * from public.appointments_overview order by created_at desc;
```

### Horarios disponiveis de um profissional

```sql
select *
from public.availability
where professional_id = 'UUID_DO_PROFISSIONAL'
order by day_of_week, start_time;
```

## Apagar usuario

Para apagar a conta inteira:

```sql
delete from auth.users
where id = 'UUID_DO_USUARIO';
```

Efeito:

- se for paciente, remove login e consultas dele
- se for profissional, remove login, perfil, agenda e consultas vinculadas

## Apagar so o perfil profissional

Se quiser manter o login, mas remover o perfil:

```sql
delete from public.professionals
where id = 'UUID_DO_USUARIO';
```

## Aplicar schema atualizado

No SQL Editor do Supabase:

1. Abra `supabase/schema.sql`
2. Cole o conteudo
3. Execute

Isso garante:

- tabelas alinhadas com o app
- trigger de sincronizacao do profissional
- views administrativas
- policies de RLS

## Fluxo esperado no banco

### Cadastro de paciente

- entra em `auth.users`
- aparece em `public.patient_accounts`

### Cadastro de profissional

- entra em `auth.users`
- trigger cria/atualiza `public.professionals`
- aparece em `public.professional_accounts`

### Agendamento

- cria registro em `public.appointments`
- aparece em `public.appointments_overview`

### Agenda do profissional

- salva em `public.availability`

## Observacoes

- `price` esta em centavos nas tabelas principais
- `payment_status` controla pagamento
- `status` controla a situacao da consulta
- as views administrativas sao para leitura no dashboard, nao para o app
