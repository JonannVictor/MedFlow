# Indexes

## Objetivo

Este documento define a estratégia oficial de indexação do banco de dados do MedFlow.

Os índices têm como objetivo otimizar consultas, reduzir a latência das operações e garantir desempenho consistente conforme o volume de dados cresce.

---

# Escopo

As estratégias deste documento aplicam-se a todas as tabelas do banco de dados.

Incluindo.

```text
Organization

Authentication

Clinical

Medical

Financial

Communication

Infrastructure

Artificial Intelligence
```

---

# Princípios

Todo índice deverá possuir uma justificativa técnica.

Os índices deverão ser revisados periodicamente para evitar desperdício de armazenamento e degradação de desempenho em operações de escrita.

Sempre considerar.

- frequência das consultas;
- seletividade dos dados;
- custo de manutenção;
- impacto nas operações de INSERT, UPDATE e DELETE.

---

# Tipos de Índices

## Primary Key

Todas as tabelas deverão possuir.

```sql
PRIMARY KEY (id)
```

---

## Foreign Keys

Toda Foreign Key deverá possuir índice próprio.

Exemplos.

```text
clinic_id

patient_id

professional_id

appointment_id

medical_record_id

subscription_id
```

---

## Índices Compostos

Utilizados em consultas frequentes.

Exemplos.

```sql
(clinic_id, status)

(clinic_id, created_at)

(patient_id, created_at)

(professional_id, scheduled_at)
```

---

## Índices Únicos

Garantem unicidade.

Exemplos.

```text
email

cpf

crm

cnpj

invoice_number

external_id

key_hash
```

---

# Organização por Domínio

## Organization

### Clinic

```text
PRIMARY KEY (id)

UNIQUE (cnpj)

INDEX (status)
```

---

### Subscription

```text
INDEX (clinic_id)

INDEX (plan_id)

INDEX (status)

INDEX (expires_at)
```

---

## Authentication

### User

```text
PRIMARY KEY (id)

UNIQUE (email)

INDEX (clinic_id)

INDEX (status)

INDEX (last_login_at)
```

---

### Session

```text
INDEX (user_id)

INDEX (expires_at)
```

---

### UserRole

```text
INDEX (user_id)

INDEX (role_id)
```

---

## Clinical

### Patient

```text
PRIMARY KEY (id)

INDEX (clinic_id)

INDEX (cpf)

INDEX (name)

INDEX (birth_date)
```

---

### Professional

```text
INDEX (clinic_id)

INDEX (crm)

INDEX (name)
```

---

### Appointment

```text
INDEX (clinic_id)

INDEX (patient_id)

INDEX (professional_id)

INDEX (scheduled_at)

INDEX (status)
```

---

## Medical

### MedicalRecord

```text
INDEX (patient_id)

INDEX (appointment_id)

INDEX (professional_id)

INDEX (created_at)
```

---

### Diagnosis

```text
INDEX (medical_record_id)

INDEX (cid10_code)
```

---

### Prescription

```text
INDEX (medical_record_id)

INDEX (patient_id)

INDEX (created_at)
```

---

### Exam

```text
INDEX (medical_record_id)

INDEX (status)
```

---

### Attachment

```text
INDEX (entity_type)

INDEX (entity_id)

INDEX (file_storage_id)
```

---

## Financial

### Payment

```text
INDEX (clinic_id)

INDEX (status)

INDEX (paid_at)

INDEX (subscription_id)
```

---

### Invoice

```text
INDEX (clinic_id)

INDEX (invoice_number)

INDEX (due_date)

INDEX (status)
```

---

### Refund

```text
INDEX (payment_id)

INDEX (status)
```

---

### Billing

```text
INDEX (clinic_id)

INDEX (next_billing_date)

INDEX (status)
```

---

## Communication

### Notification

```text
INDEX (clinic_id)

INDEX (recipient_id)

INDEX (status)

INDEX (scheduled_at)
```

---

### NotificationDelivery

```text
INDEX (notification_id)

INDEX (provider)

INDEX (status)
```

---

## Infrastructure

### AuditLog

```text
INDEX (user_id)

INDEX (entity_type)

INDEX (entity_id)

INDEX (created_at)
```

---

### BackgroundJob

```text
INDEX (queue)

INDEX (status)

INDEX (scheduled_at)
```

---

### ApiKey

```text
UNIQUE (key_hash)

INDEX (clinic_id)

INDEX (status)
```

---

### Integration

```text
INDEX (provider)

INDEX (status)
```

---

### FileStorage

```text
UNIQUE (provider, bucket, storage_key)

INDEX (checksum)
```

---

## Artificial Intelligence

### AIConversation

```text
INDEX (clinic_id)

INDEX (user_id)

INDEX (last_message_at)
```

---

### AIMessage

```text
INDEX (conversation_id)

INDEX (created_at)
```

---

### AIRecommendation

```text
INDEX (patient_id)

INDEX (status)

INDEX (recommendation_type)
```

---

### AIUsage

```text
INDEX (provider)

INDEX (model)

INDEX (clinic_id)

INDEX (created_at)
```

---

# Índices Compostos Recomendados

Consultas mais frequentes.

```sql
(clinic_id, status)

(clinic_id, created_at)

(patient_id, created_at)

(professional_id, scheduled_at)

(status, created_at)

(clinic_id, patient_id)

(clinic_id, professional_id)
```

---

# Monitoramento

O desempenho dos índices deverá ser acompanhado utilizando.

```text
EXPLAIN

EXPLAIN ANALYZE

pg_stat_statements

Slow Query Log

Query Planner
```

Índices não utilizados deverão ser avaliados e removidos após análise técnica.

---

# Boas Práticas

Sempre.

- indexar Foreign Keys;
- evitar excesso de índices;
- utilizar índices compostos quando apropriado;
- revisar índices periodicamente;
- documentar alterações;
- monitorar impacto nas operações de escrita.

---

# Status

**Documento:** Indexes.md

**Versão:** 1.0

**Status:** ✅ Concluído

**Última atualização:** 2026

---

