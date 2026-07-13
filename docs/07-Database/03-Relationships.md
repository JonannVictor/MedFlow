# Relationships

## Objetivo

Este documento define todos os relacionamentos existentes entre as entidades do MedFlow.

Seu objetivo é padronizar as dependências entre domínios, facilitar a implementação do banco de dados relacional e servir como referência para modelagem ORM, APIs e integrações.

---

# Convenções

## Cardinalidade

```text
1:1

Um para Um
```

```text
1:N

Um para Muitos
```

```text
N:N

Muitos para Muitos
```

---

## Obrigatoriedade

```text
Obrigatório

FK NOT NULL
```

```text
Opcional

FK NULL
```

---

## Integridade Referencial

Todos os relacionamentos deverão utilizar Foreign Keys reais sempre que possível.

Quando não for possível.

A aplicação deverá garantir a consistência dos dados.

---

# Organização

Os relacionamentos estão agrupados por domínio.

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

# Legenda

```text
↓

Pertence a

↑

Possui

↔

Relacionamento Muitos para Muitos
```

---

# Próximo

---

# Organization Domain

## Clinic

### Um para Muitos

```text
Clinic
    │ 1:N
    ▼
Users
```

Descrição.

Uma clínica poderá possuir diversos usuários.

Cada usuário pertence exatamente a uma clínica.

---

```text
Clinic
    │ 1:N
    ▼
Patients
```

Descrição.

Uma clínica poderá atender diversos pacientes.

Cada paciente pertence exatamente a uma clínica.

---

```text
Clinic
    │ 1:N
    ▼
Professionals
```

Descrição.

Uma clínica poderá possuir diversos profissionais.

Cada profissional pertence exatamente a uma clínica.

---

```text
Clinic
    │ 1:N
    ▼
Appointments
```

Descrição.

Cada atendimento pertence exatamente a uma clínica.

---

```text
Clinic
    │ 1:N
    ▼
MedicalRecords
```

Descrição.

Cada prontuário pertence exatamente a uma clínica.

---

```text
Clinic
    │ 1:N
    ▼
Subscriptions
```

Descrição.

Uma clínica poderá possuir diversas assinaturas ao longo do tempo.

Apenas uma poderá permanecer ativa.

---

```text
Clinic
    │ 1:N
    ▼
Payments
```

---

```text
Clinic
    │ 1:N
    ▼
Invoices
```

---

```text
Clinic
    │ 1:N
    ▼
Billings
```

---

```text
Clinic
    │ 1:N
    ▼
Notifications
```

---

```text
Clinic
    │ 1:N
    ▼
AIConversations
```

---

```text
Clinic
    │ 1:N
    ▼
ApiKeys
```

---

```text
Clinic
    │ 1:N
    ▼
Integrations
```

---

```text
Clinic
    │ 1:N
    ▼
AuditLogs
```

---

```text
Clinic
    │ 1:N
    ▼
BackgroundJobs
```

---

```text
Clinic
    │ 1:N
    ▼
Attachments
```

---

```text
Clinic
    │ 1:N
    ▼
FileStorage
```

---

# Plan

## Um para Muitos

```text
Plan
    │ 1:N
    ▼
Subscriptions
```

Descrição.

Um plano poderá ser contratado por diversas clínicas.

Cada assinatura pertence exatamente a um plano.

---

# Subscription

## Muitos para Um

```text
Subscriptions
    │ N:1
    ▼
Clinic
```

---

```text
Subscriptions
    │ N:1
    ▼
Plan
```

---

## Um para Muitos

```text
Subscription
    │ 1:N
    ▼
Invoices
```

---

```text
Subscription
    │ 1:N
    ▼
Payments
```

---

```text
Subscription
    │ 1:N
    ▼
Billings
```

---

```text
Subscription
    │ 1:N
    ▼
Refunds
```

---

# Resumo do Domínio

```text
Clinic

├── Users
├── Patients
├── Professionals
├── Appointments
├── MedicalRecords
├── Subscriptions
├── Payments
├── Invoices
├── Billings
├── Notifications
├── AIConversations
├── ApiKeys
├── Integrations
├── AuditLogs
├── BackgroundJobs
├── Attachments
└── FileStorage

Plan

└── Subscriptions
```

---

# Próximo

---

# Authentication Domain

## User

## Muitos para Um

```text
Users
    │ N:1
    ▼
Clinic
```

Cada usuário pertence exatamente a uma clínica.

---

## Muitos para Muitos

```text
Users
    │ N:N
    ▼
Roles
```

Relacionamento realizado através da entidade.

```text
UserRole
```

---

## Um para Muitos

```text
User
    │ 1:N
    ▼
Sessions
```

Cada usuário poderá possuir diversas sessões.

---

```text
User
    │ 1:N
    ▼
RefreshTokens
```

Cada usuário poderá possuir diversos Refresh Tokens ativos.

---

```text
User
    │ 1:N
    ▼
PasswordResetTokens
```

---

```text
User
    │ 1:N
    ▼
EmailVerificationTokens
```

---

```text
User
    │ 1:N
    ▼
MFATokens
```

---

```text
User
    │ 1:N
    ▼
AuditLogs
```

---

```text
User
    │ 1:N
    ▼
Notifications
```

---

```text
User
    │ 1:N
    ▼
AIConversations
```

---

```text
User
    │ 1:N
    ▼
BackgroundJobs
```

---

## Role

## Muitos para Muitos

```text
Roles
    │ N:N
    ▼
Users
```

Relacionamento através de.

```text
UserRole
```

---

## UserRole

## Muitos para Um

```text
UserRoles
    │ N:1
    ▼
User
```

---

```text
UserRoles
    │ N:1
    ▼
Role
```

---

Cada UserRole representa exatamente um vínculo entre um usuário e um perfil.

---

## Session

## Muitos para Um

```text
Sessions
    │ N:1
    ▼
User
```

Cada sessão pertence exatamente a um usuário.

---

## RefreshToken

## Muitos para Um

```text
RefreshTokens
    │ N:1
    ▼
User
```

---

## PasswordResetToken

## Muitos para Um

```text
PasswordResetTokens
    │ N:1
    ▼
User
```

---

## EmailVerificationToken

## Muitos para Um

```text
EmailVerificationTokens
    │ N:1
    ▼
User
```

---

## MFAToken

## Muitos para Um

```text
MFATokens
    │ N:1
    ▼
User
```

---

# Resumo do Domínio

```text
Clinic
        │
        ▼
User
        │
        ├── Sessions
        ├── RefreshTokens
        ├── PasswordResetTokens
        ├── EmailVerificationTokens
        ├── MFATokens
        ├── AuditLogs
        ├── Notifications
        ├── AIConversations
        └── BackgroundJobs

User
        ▲
        │
     UserRole
        │
        ▼
      Role
```

---

# Próximo

---

# Clinical Domain

## Patient

## Muitos para Um

```text
Patients
    │ N:1
    ▼
Clinic
```

Cada paciente pertence exatamente a uma clínica.

---

## Um para Muitos

```text
Patient
    │ 1:N
    ▼
Appointments
```

---

```text
Patient
    │ 1:N
    ▼
MedicalRecords
```

---

```text
Patient
    │ 1:N
    ▼
Allergies
```

---

```text
Patient
    │ 1:N
    ▼
VitalSigns
```

---

```text
Patient
    │ 1:N
    ▼
ClinicalNotes
```

---

```text
Patient
    │ 1:N
    ▼
Diagnoses
```

---

```text
Patient
    │ 1:N
    ▼
Prescriptions
```

---

```text
Patient
    │ 1:N
    ▼
Exams
```

---

```text
Patient
    │ 1:N
    ▼
AIConversations
```

---

```text
Patient
    │ 1:N
    ▼
AIRecommendations
```

---

## Professional

## Muitos para Um

```text
Professionals
    │ N:1
    ▼
Clinic
```

---

## Muitos para Muitos

```text
Professionals
    │ N:N
    ▼
Specialties
```

Relacionamento através de.

```text
ProfessionalSpecialty
```

---

## Um para Muitos

```text
Professional
    │ 1:N
    ▼
Appointments
```

---

```text
Professional
    │ 1:N
    ▼
MedicalRecords
```

---

```text
Professional
    │ 1:N
    ▼
ClinicalNotes
```

---

```text
Professional
    │ 1:N
    ▼
Diagnoses
```

---

```text
Professional
    │ 1:N
    ▼
Prescriptions
```

---

```text
Professional
    │ 1:N
    ▼
Exams
```

---

```text
Professional
    │ 1:N
    ▼
VitalSigns
```

---

## Specialty

## Muitos para Muitos

```text
Specialties
    │ N:N
    ▼
Professionals
```

Relacionamento através de.

```text
ProfessionalSpecialty
```

---

## ProfessionalSpecialty

## Muitos para Um

```text
ProfessionalSpecialties
    │ N:1
    ▼
Professional
```

---

```text
ProfessionalSpecialties
    │ N:1
    ▼
Specialty
```

---

Cada ProfessionalSpecialty representa exatamente uma especialidade vinculada a um profissional.

---

## Allergy

## Muitos para Um

```text
Allergies
    │ N:1
    ▼
Patient
```

---

## Muitos para Um (Opcional)

```text
Allergies
    │ N:1
    ▼
Professional
```

---

```text
Allergies
    │ N:1
    ▼
MedicalRecord
```

---

## Medication

## Um para Muitos

```text
Medication
    │ 1:N
    ▼
PrescriptionItems
```

Medication representa o catálogo oficial de medicamentos da plataforma.

---

## VitalSigns

## Muitos para Um

```text
VitalSigns
    │ N:1
    ▼
Patient
```

---

```text
VitalSigns
    │ N:1
    ▼
Professional
```

---

```text
VitalSigns
    │ N:1
    ▼
Appointment
```

---

```text
VitalSigns
    │ N:1
    ▼
MedicalRecord
```

---

# Resumo do Domínio

```text
Clinic
│
├── Patients
│      ├── Allergies
│      ├── VitalSigns
│      ├── Appointments
│      ├── MedicalRecords
│      ├── Diagnoses
│      ├── ClinicalNotes
│      ├── Prescriptions
│      ├── Exams
│      ├── AIConversations
│      └── AIRecommendations
│
└── Professionals
       │
       ├── ProfessionalSpecialty
       │        │
       │        ▼
       │    Specialty
       │
       ├── Appointments
       ├── MedicalRecords
       ├── ClinicalNotes
       ├── Diagnoses
       ├── Prescriptions
       ├── Exams
       └── VitalSigns

Medication
│
└── PrescriptionItems
```

---

# Próximo

---

# Medical Domain

## Appointment

## Muitos para Um

```text
Appointments
    │ N:1
    ▼
Clinic
```

---

```text
Appointments
    │ N:1
    ▼
Patient
```

---

```text
Appointments
    │ N:1
    ▼
Professional
```

---

## Um para Um

```text
Appointment
    │ 1:1
    ▼
MedicalRecord
```

Cada atendimento poderá gerar exatamente um prontuário eletrônico.

O prontuário pertence exatamente a um atendimento.

---

## MedicalRecord

## Muitos para Um

```text
MedicalRecords
    │ N:1
    ▼
Clinic
```

---

```text
MedicalRecords
    │ N:1
    ▼
Patient
```

---

```text
MedicalRecords
    │ N:1
    ▼
Professional
```

---

```text
MedicalRecords
    │ N:1
    ▼
Appointment
```

---

## Um para Muitos

```text
MedicalRecord
    │ 1:N
    ▼
Diagnoses
```

---

```text
MedicalRecord
    │ 1:N
    ▼
ClinicalNotes
```

---

```text
MedicalRecord
    │ 1:N
    ▼
VitalSigns
```

---

```text
MedicalRecord
    │ 1:N
    ▼
Prescriptions
```

---

```text
MedicalRecord
    │ 1:N
    ▼
Exams
```

---

```text
MedicalRecord
    │ 1:N
    ▼
Attachments
```

---

## Diagnosis

## Muitos para Um

```text
Diagnoses
    │ N:1
    ▼
MedicalRecord
```

---

```text
Diagnoses
    │ N:1
    ▼
Patient
```

---

```text
Diagnoses
    │ N:1
    ▼
Professional
```

---

## Prescription

## Muitos para Um

```text
Prescriptions
    │ N:1
    ▼
MedicalRecord
```

---

```text
Prescriptions
    │ N:1
    ▼
Patient
```

---

```text
Prescriptions
    │ N:1
    ▼
Professional
```

---

```text
Prescriptions
    │ N:1
    ▼
Appointment
```

---

## Um para Muitos

```text
Prescription
    │ 1:N
    ▼
PrescriptionItems
```

---

## PrescriptionItem

## Muitos para Um

```text
PrescriptionItems
    │ N:1
    ▼
Prescription
```

---

```text
PrescriptionItems
    │ N:1
    ▼
Medication
```

Opcional.

Quando houver utilização do catálogo oficial de medicamentos.

---

## Exam

## Muitos para Um

```text
Exams
    │ N:1
    ▼
MedicalRecord
```

---

```text
Exams
    │ N:1
    ▼
Patient
```

---

```text
Exams
    │ N:1
    ▼
Professional
```

---

```text
Exams
    │ N:1
    ▼
Appointment
```

---

## Um para Muitos

```text
Exam
    │ 1:N
    ▼
ExamItems
```

---

## ExamItem

## Muitos para Um

```text
ExamItems
    │ N:1
    ▼
Exam
```

---

```text
ExamItems
    │ N:1
    ▼
ExamCatalog
```

Opcional.

Quando existir catálogo padronizado de exames.

---

## ClinicalNote

## Muitos para Um

```text
ClinicalNotes
    │ N:1
    ▼
MedicalRecord
```

---

```text
ClinicalNotes
    │ N:1
    ▼
Patient
```

---

```text
ClinicalNotes
    │ N:1
    ▼
Professional
```

---

```text
ClinicalNotes
    │ N:1
    ▼
Appointment
```

---

## Attachment

## Associação Lógica

```text
Attachment

↓

Entity
```

O Attachment poderá estar associado a diferentes entidades.

Exemplos.

```text
MedicalRecord

ClinicalNote

Prescription

Exam

Patient
```

---

## Dependência Física

```text
Attachment
    │ N:1
    ▼
FileStorage
```

Cada Attachment referencia exatamente um arquivo físico armazenado.

---

# Resumo do Domínio

```text
Appointment
│
└── MedicalRecord
        │
        ├── Diagnosis
        ├── ClinicalNote
        ├── VitalSigns
        ├── Prescription
        │       └── PrescriptionItem
        │               └── Medication
        │
        ├── Exam
        │      └── ExamItem
        │
        └── Attachment
                │
                ▼
           FileStorage
```

---

# Próximo

---

# Financial Domain

## Payment

## Muitos para Um

```text
Payments
    │ N:1
    ▼
Clinic
```

---

```text
Payments
    │ N:1
    ▼
Subscription
```

---

## Muitos para Um (Opcional)

```text
Payments
    │ N:1
    ▼
Invoice
```

---

```text
Payments
    │ N:1
    ▼
Appointment
```

Quando houver cobrança relacionada a um atendimento.

---

## Um para Muitos

```text
Payment
    │ 1:N
    ▼
Refunds
```

Um pagamento poderá possuir diversos estornos.

---

## Invoice

## Muitos para Um

```text
Invoices
    │ N:1
    ▼
Clinic
```

---

```text
Invoices
    │ N:1
    ▼
Subscription
```

---

## Muitos para Um (Opcional)

```text
Invoices
    │ N:1
    ▼
Billing
```

---

## Um para Muitos

```text
Invoice
    │ 1:N
    ▼
Payments
```

Uma fatura poderá receber diversos pagamentos.

---

## Billing

## Muitos para Um

```text
Billings
    │ N:1
    ▼
Clinic
```

---

```text
Billings
    │ N:1
    ▼
Subscription
```

---

## Um para Muitos

```text
Billing
    │ 1:N
    ▼
Invoices
```

---

```text
Billing
    │ 1:N
    ▼
Payments
```

---

## Refund

## Muitos para Um

```text
Refunds
    │ N:1
    ▼
Payment
```

---

## Muitos para Um (Opcional)

```text
Refunds
    │ N:1
    ▼
Invoice
```

---

```text
Refunds
    │ N:1
    ▼
Subscription
```

---

## WebhookEvent

## Relações Lógicas

Dependendo do tipo de evento recebido.

```text
WebhookEvent

↓

Payment
```

---

```text
WebhookEvent

↓

Invoice
```

---

```text
WebhookEvent

↓

Refund
```

---

```text
WebhookEvent

↓

Subscription
```

---

```text
WebhookEvent

↓

Billing
```

Os relacionamentos dependerão do provedor e do evento recebido.

---

# Resumo do Domínio

```text
Subscription
│
├── Billing
│      ├── Invoices
│      │       └── Payments
│      │               └── Refunds
│      │
│      └── Payments
│
└── WebhookEvents
```

---

# Fluxo Financeiro

```text
Subscription

↓

Billing

↓

Invoice

↓

Payment

↓

Refund (Opcional)
```

---

# Integração Externa

```text
Gateway

↓

WebhookEvent

↓

Payment

↓

Invoice

↓

Billing
```

Os Webhooks poderão atualizar diferentes entidades conforme o tipo do evento recebido.

---

# Próximo

---

# Communication Domain

## Notification

## Muitos para Um

```text
Notifications
    │ N:1
    ▼
Clinic
```

---

## Muitos para Um (Opcional)

```text
Notifications
    │ N:1
    ▼
User
```

---

```text
Notifications
    │ N:1
    ▼
Patient
```

---

```text
Notifications
    │ N:1
    ▼
Professional
```

A entidade Notification poderá possuir diferentes destinatários conforme o contexto.

---

## Muitos para Um (Opcional)

```text
Notifications
    │ N:1
    ▼
NotificationTemplate
```

Uma notificação poderá ser criada a partir de um template.

Também poderá ser criada manualmente.

---

## Um para Muitos

```text
Notification
    │ 1:N
    ▼
NotificationDeliveries
```

Cada notificação poderá possuir diversas tentativas de entrega.

---

## NotificationTemplate

## Um para Muitos

```text
NotificationTemplate
    │ 1:N
    ▼
Notifications
```

Um template poderá originar diversas notificações.

---

## NotificationDelivery

## Muitos para Um

```text
NotificationDeliveries
    │ N:1
    ▼
Notification
```

Cada tentativa pertence exatamente a uma notificação.

---

# Fluxo de Comunicação

```text
NotificationTemplate

↓

Notification

↓

NotificationDelivery

↓

Provider
```

---

# Canais

A entidade NotificationDelivery poderá representar.

```text
Email

SMS

WhatsApp

Push Notification

In-App
```

Novos canais poderão ser adicionados sem alterações estruturais.

---

# Resumo do Domínio

```text
NotificationTemplate
        │
        ▼
Notification
        │
        ▼
NotificationDelivery
        │
        ├── Email
        ├── SMS
        ├── WhatsApp
        ├── Push
        └── In-App
```

---

# Próximo

---

# Infrastructure Domain

## AuditLog

## Muitos para Um (Opcional)

```text
AuditLogs
    │ N:1
    ▼
User
```

O evento poderá ter sido executado por um usuário autenticado.

---

```text
AuditLogs
    │ N:1
    ▼
Clinic
```

---

```text
AuditLogs
    │ N:1
    ▼
Session
```

---

```text
AuditLogs
    │ N:1
    ▼
ApiKey
```

Quando a operação tiver sido realizada através da API.

---

## BackgroundJob

## Muitos para Um (Opcional)

```text
BackgroundJobs
    │ N:1
    ▼
Clinic
```

---

```text
BackgroundJobs
    │ N:1
    ▼
User
```

---

```text
BackgroundJobs
    │ N:1
    ▼
WebhookEvent
```

Uma tarefa poderá ser originada por um Webhook.

---

## ApiKey

## Muitos para Um

```text
ApiKeys
    │ N:1
    ▼
Clinic
```

---

## Muitos para Um (Opcional)

```text
ApiKeys
    │ N:1
    ▼
User
```

---

```text
ApiKeys
    │ N:1
    ▼
Integration
```

Uma integração poderá utilizar exatamente uma ApiKey.

---

## Integration

## Muitos para Um (Opcional)

```text
Integrations
    │ N:1
    ▼
Clinic
```

---

```text
Integrations
    │ N:1
    ▼
ApiKey
```

---

## Um para Muitos

```text
Integration
    │ 1:N
    ▼
WebhookEvents
```

---

```text
Integration
    │ 1:N
    ▼
BackgroundJobs
```

---

## FileStorage

## Um para Muitos

```text
FileStorage
    │ 1:N
    ▼
Attachments
```

Diversos anexos poderão referenciar o mesmo arquivo físico quando permitido pelas regras da aplicação.

---

# Fluxo de Infraestrutura

```text
Integration

↓

WebhookEvent

↓

BackgroundJob

↓

Business Logic
```

---

# Fluxo de Armazenamento

```text
Attachment

↓

FileStorage

↓

Storage Provider
```

---

# Fluxo de Auditoria

```text
User

↓

Application

↓

AuditLog
```

ou

```text
ApiKey

↓

Application

↓

AuditLog
```

---

# Resumo do Domínio

```text
User
│
├── AuditLogs
├── BackgroundJobs
└── ApiKeys

Clinic
│
├── ApiKeys
├── Integrations
├── BackgroundJobs
└── AuditLogs

Integration
│
├── ApiKey
├── WebhookEvents
└── BackgroundJobs

Attachment
│
└── FileStorage
```

---

# Próximo

---

# Artificial Intelligence Domain

## AIConversation

## Muitos para Um

```text
AIConversations
    │ N:1
    ▼
Clinic
```

---

```text
AIConversations
    │ N:1
    ▼
User
```

---

## Muitos para Um (Opcional)

```text
AIConversations
    │ N:1
    ▼
Patient
```

---

```text
AIConversations
    │ N:1
    ▼
MedicalRecord
```

Quando a conversa estiver relacionada ao prontuário eletrônico.

---

## Um para Muitos

```text
AIConversation
    │ 1:N
    ▼
AIMessages
```

---

```text
AIConversation
    │ 1:N
    ▼
AIRecommendations
```

---

```text
AIConversation
    │ 1:N
    ▼
AIUsage
```

---

## AIMessage

## Muitos para Um

```text
AIMessages
    │ N:1
    ▼
AIConversation
```

---

## Um para Muitos

```text
AIMessage
    │ 1:N
    ▼
AIRecommendations
```

---

```text
AIMessage
    │ 1:N
    ▼
AIUsage
```

---

## AIRecommendation

## Muitos para Um

```text
AIRecommendations
    │ N:1
    ▼
AIConversation
```

---

```text
AIRecommendations
    │ N:1
    ▼
AIMessage
```

---

## Muitos para Um (Opcional)

```text
AIRecommendations
    │ N:1
    ▼
Patient
```

---

```text
AIRecommendations
    │ N:1
    ▼
MedicalRecord
```

---

```text
AIRecommendations
    │ N:1
    ▼
Appointment
```

---

## AIPrompt

## Um para Muitos

```text
AIPrompt
    │ 1:N
    ▼
AIUsage
```

---

## AIUsage

## Muitos para Um

```text
AIUsages
    │ N:1
    ▼
AIConversation
```

---

```text
AIUsages
    │ N:1
    ▼
AIMessage
```

---

```text
AIUsages
    │ N:1
    ▼
AIPrompt
```

---

## Muitos para Um (Opcional)

```text
AIUsages
    │ N:1
    ▼
Clinic
```

---

```text
AIUsages
    │ N:1
    ▼
User
```

---

# Fluxo de Inteligência Artificial

```text
AIConversation

↓

AIMessage

↓

AIRecommendation
```

---

# Fluxo de Consumo

```text
AIPrompt

↓

AIConversation

↓

AIMessage

↓

AIUsage
```

---

# Resumo do Domínio

```text
Clinic
        │
        ▼
AIConversation
        │
        ├── AIMessages
        │        │
        │        ├── AIRecommendations
        │        └── AIUsage
        │
        └── AIPrompt
                 │
                 ▼
             AIUsage
```

---

# Resumo Geral dos Relacionamentos

## Domínios

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

## Total de Relacionamentos

```text
1:1

Appointment
    ↔
MedicalRecord
```

---

```text
1:N

Clinic
    ↓
Users

Clinic
    ↓
Patients

MedicalRecord
    ↓
Diagnoses

Prescription
    ↓
PrescriptionItems

Notification
    ↓
NotificationDeliveries

AIConversation
    ↓
AIMessages

...
```

---

```text
N:N

Users
    ↔
Roles

Professionals
    ↔
Specialties
```

---

# Boas Práticas

Todos os relacionamentos deverão.

- utilizar Foreign Keys sempre que possível;
- possuir índices nas chaves estrangeiras;
- respeitar integridade referencial;
- evitar exclusões em cascata para dados clínicos;
- preservar histórico através de Soft Delete quando aplicável.

---

# Status

**Documento:** Relationships.md

**Versão:** 1.0

**Status:** ✅ Concluído

**Última atualização:** 2026