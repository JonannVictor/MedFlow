# Módulo de Agendamentos

| Campo | Valor |
|-------|--------|
| Documento | Appointments |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Modules |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# 1. Visão Geral

O módulo **Appointments** é responsável pelo ciclo de vida dos agendamentos dentro do MedFlow.

Ele representa muito mais do que o armazenamento de:

```text
Patient

+

Professional

+

Date

+

Time
```

O domínio deverá controlar regras relacionadas a:

```text
Availability

Scheduling

Rescheduling

Cancellation

Confirmation

Check-In

Attendance

No-Show

Professional

Patient

Clinic

Services

Duration

Resources

Notifications

Audit
```

O objetivo é garantir que o estado operacional de um atendimento seja previsível, consistente e rastreável.

---

# 2. Objetivo

O módulo deverá fornecer uma fonte confiável para responder perguntas como:

```text
Who is scheduled?

With whom?

Where?

When?

For what service?

For how long?

What is the current status?

Who created the appointment?

Was it rescheduled?

Was it cancelled?

Did the patient arrive?

Did the appointment occur?
```

---

# 3. Princípio Fundamental

```text
Appointment

≠

Calendar Event
```

Um Calendar Event representa principalmente tempo.

Um Appointment representa uma relação de negócio entre:

```text
Patient

Professional

Clinic

Service

Schedule

Operational State
```

com regras, histórico e efeitos em outros módulos.

---

# 4. Source of Truth

O módulo `Appointments` deverá ser a fonte de verdade para o estado dos agendamentos do MedFlow.

Sistemas externos como:

```text
Google Calendar

Microsoft Calendar

WhatsApp

Email

Telemedicine Provider
```

não deverão substituir o estado interno do Appointment.

---

# 5. Escopo

O módulo poderá ser responsável por:

- Criação de agendamentos.
- Consulta de disponibilidade.
- Validação de horários.
- Alteração de horários.
- Cancelamento.
- Confirmação.
- Check-In.
- No-Show.
- Histórico.
- Bloqueios.
- Duração.
- Motivo do agendamento.
- Associação com Patient.
- Associação com Professional.
- Associação com Clinic.
- Integração com Reception.
- Integração com Notifications.
- Integração futura com Telemedicine.
- Eventos de domínio relacionados.

---

# 6. Fora do Escopo

Appointments não deverá ser responsável diretamente por:

- Cadastro completo do Patient.
- Cadastro completo do Professional.
- Clinical Records.
- Prescriptions.
- Exams.
- Payment Processing.
- Notification Delivery.
- Authentication.
- AI Model Execution.

Esses pertencem aos respectivos módulos.

---

# 7. Bounded Context

```text
Patients
   │
   ▼
Appointments
   │
   ├────────► Professionals
   │
   ├────────► Clinics
   │
   ├────────► Reception
   │
   ├────────► Notifications
   │
   ├────────► Payments
   │
   └────────► Telemedicine
```

Appointments deverá conhecer apenas as informações necessárias desses domínios.

---

# 8. Entidade Principal

A entidade central será conceitualmente:

```text
Appointment
```

Exemplo lógico:

```text
Appointment

├── id
├── organizationId
├── clinicId
├── patientId
├── professionalId
├── serviceId
├── startAt
├── endAt
├── timezone
├── status
├── reason
├── notes
├── source
├── createdBy
├── createdAt
├── updatedAt
└── version
```

A estrutura real deverá acompanhar o schema oficial do banco.

Este documento define o domínio, não substitui o ERD.

---

# 9. Appointment ID

Cada Appointment deverá possuir identificador único e estável.

O ID não deverá ser reutilizado após cancelamento ou exclusão lógica.

---

# 10. Tenant Ownership

Todo Appointment deverá pertencer explicitamente a uma Organization.

```text
Appointment

↓

organizationId
```

Tenant Ownership não deverá ser inferido apenas através da Clinic.

---

# 11. Clinic

O Appointment deverá estar associado à unidade ou contexto operacional correspondente quando aplicável.

---

# 12. Patient

Um Appointment normalmente deverá possuir um Patient identificado.

Fluxos temporários sem Patient formal somente deverão existir se houver caso de negócio explicitamente definido.

---

# 13. Professional

O Professional representa quem deverá realizar o atendimento.

---

# 14. Service

Quando o produto possuir catálogo de serviços, o Appointment poderá referenciar:

```text
Service

Consultation Type

Procedure Type
```

Esse relacionamento poderá determinar:

```text
Duration

Price

Required Resource

Preparation

Eligibility
```

---

# 15. Time Model

Tempo é uma das partes mais críticas do módulo.

Um Appointment deverá possuir:

```text
startAt

endAt
```

ou:

```text
startAt

duration
```

A implementação deverá possuir uma representação canônica.

---

# 16. Timezone

Timezone não deverá ser tratada como detalhe visual.

O sistema deverá distinguir:

```text
Instant

from

Local Representation
```

---

# 17. Storage Time

Preferencialmente, instantes deverão possuir representação não ambígua.

Exemplo conceitual:

```text
UTC
```

enquanto a Clinic mantém sua Timezone operacional.

---

# 18. Display Time

A UI deverá converter o horário para o contexto correto.

---

# 19. Daylight Saving Time

O sistema deverá considerar mudanças de horário legal em regiões onde existam.

Não assumir:

```text
Every day has exactly
the same local-time mapping.
```

---

# 20. Duration

Duração deverá ser validada.

Não deverão existir Appointments com:

```text
endAt <= startAt
```

---

# 21. Duration Source

A duração poderá vir de:

```text
Service Default

Professional Configuration

Clinic Configuration

Explicit Override
```

A precedência deverá ser definida pela implementação correspondente.

---

# 22. Appointment Status

Status deverá representar estado de negócio.

Conjunto conceitual inicial:

```text
scheduled

confirmed

checked_in

in_progress

completed

cancelled

no_show
```

Estados adicionais somente deverão ser introduzidos quando possuírem significado real.

---

# 23. State Machine

```text
                  ┌─────────────┐
                  │  scheduled  │
                  └──────┬──────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
         confirmed    cancelled   no_show
              │
              ▼
          checked_in
              │
              ▼
          in_progress
              │
              ▼
           completed
```

Este diagrama representa o modelo conceitual.

Transições reais deverão ser validadas pelas Business Rules.

---

# 24. State Transition Principle

Não deverá ser permitido:

```text
status = anything
```

sem validação.

Preferir operações de domínio:

```text
confirmAppointment()

checkInAppointment()

startAppointment()

completeAppointment()

cancelAppointment()

markNoShow()
```

---

# 25. Invalid Transition

Exemplo:

```text
completed

↓

scheduled
```

não deverá ocorrer silenciosamente.

---

# 26. Transition Validation

Toda mudança deverá verificar:

```text
Current State

Requested Transition

Actor

Permissions

Business Rules

Temporal Context
```

---

# 27. Scheduled

Representa Appointment válido ainda não confirmado ou iniciado.

---

# 28. Confirmed

Representa confirmação apropriada do Appointment.

A confirmação poderá vir de:

```text
Patient

Reception

Professional

Authorized Automation
```

conforme regras.

---

# 29. Checked-In

Indica que o Patient chegou ou foi registrado no fluxo de atendimento.

---

# 30. In Progress

Indica que o atendimento foi iniciado operacionalmente.

---

# 31. Completed

Indica que o Appointment terminou do ponto de vista de Scheduling.

Isso não significa necessariamente que:

```text
Medical Record is complete

Payment is settled

Prescription exists

Exam is complete
```

Cada domínio possui seu próprio lifecycle.

---

# 32. Cancelled

Representa Appointment cancelado.

Cancelamento deverá preservar histórico.

---

# 33. No-Show

Representa ausência conforme regra operacional.

No-Show não deverá ser inferido prematuramente.

---

# 34. Cancellation Is Not Deletion

```text
Cancel Appointment

≠

Delete Appointment
```

O Appointment deverá continuar disponível para histórico e Audit conforme políticas aplicáveis.

---

# 35. Cancellation Metadata

Quando relevante:

```text
cancelledAt

cancelledBy

cancellationReason

cancellationSource
```

---

# 36. Cancellation Reason

Motivos poderão ser estruturados.

Exemplos:

```text
Patient Request

Professional Unavailable

Clinic Request

Scheduling Error

Other
```

---

# 37. Cancellation Policy

A plataforma poderá possuir regras futuras relacionadas a antecedência.

Exemplo:

```text
Cancellation Window
```

Essas regras deverão pertencer ao domínio e não apenas à UI.

---

# 38. Rescheduling

Reagendamento não deverá ser tratado como simples edição visual da data.

---

# 39. Reschedule Operation

Fluxo:

```text
Current Appointment

↓

Request New Slot

↓

Availability Validation

↓

Business Validation

↓

Conflict Validation

↓

Update Schedule

↓

History

↓

Domain Event

↓

Notification
```

---

# 40. Reschedule History

O sistema deverá preservar informação suficiente para entender alterações relevantes.

Exemplo:

```text
Previous Start

Previous End

New Start

New End

Changed By

Changed At
```

---

# 41. Appointment History

Mudanças importantes deverão ser rastreáveis.

Possíveis eventos:

```text
Created

Confirmed

Rescheduled

Checked In

Started

Completed

Cancelled

Marked No-Show
```

---

# 42. Audit vs History

```text
Appointment History

≠

Security Audit Log
```

History explica lifecycle do Appointment.

Audit explica ações relevantes do sistema e atores.

Os dois poderão se relacionar, mas não deverão ser confundidos.

---

# 43. Availability

Availability representa possibilidade de agendamento.

Ela não deverá ser inferida apenas pela ausência de Appointment.

---

# 44. Availability Sources

Disponibilidade poderá depender de:

```text
Professional Schedule

Clinic Hours

Service Duration

Breaks

Blocks

Existing Appointments

Resources

Exceptions

Holidays
```

---

# 45. Availability Calculation

```text
Base Schedule

-

Blocks

-

Existing Appointments

-

Unavailable Periods

-

Required Buffers

=

Available Slots
```

---

# 46. Professional Schedule

Professional poderá possuir configuração recorrente.

Exemplo:

```text
Monday
08:00 → 12:00
13:00 → 17:00

Tuesday
08:00 → 12:00
```

---

# 47. Schedule Exceptions

Exceções poderão representar:

```text
Vacation

Leave

Special Availability

Training

Holiday

Manual Block
```

---

# 48. Blocks

Um Block deverá impedir Scheduling dentro do período correspondente.

---

# 49. Block Entity

Conceitualmente:

```text
ScheduleBlock

├── id
├── organizationId
├── professionalId
├── clinicId
├── startAt
├── endAt
├── reason
├── createdBy
└── createdAt
```

---

# 50. Block Types

Possíveis:

```text
personal

administrative

vacation

meeting

unavailable

other
```

---

# 51. Clinic Hours

Availability deverá respeitar horário operacional da Clinic quando aplicável.

---

# 52. Holidays

Holidays poderão alterar Availability.

A configuração deverá considerar localização.

---

# 53. Slot

Um Slot representa oportunidade calculada de Scheduling.

Ele não precisa necessariamente existir como entidade persistida.

---

# 54. Derived Slots

Preferencialmente:

```text
Availability Rules

↓

Calculated Slots
```

em vez de armazenar milhões de Slots futuros sem necessidade.

---

# 55. Slot Duration

Slot Duration não deverá necessariamente ser global.

Pode depender do Service.

---

# 56. Buffers

O sistema poderá suportar:

```text
Buffer Before

Buffer After
```

para determinados serviços.

---

# 57. Overlapping Appointments

Por padrão, Appointments conflitantes para o mesmo recurso crítico não deverão ser permitidos.

---

# 58. Conflict Detection

Possível regra:

```text
new.start < existing.end

AND

new.end > existing.start
```

indica sobreposição temporal.

A regra final deverá considerar status e recursos.

---

# 59. Cancelled Conflict

Appointment `cancelled` normalmente não deverá bloquear disponibilidade futura.

---

# 60. Completed Conflict

Appointment histórico não deverá afetar Scheduling futuro, mas continua ocupando seu intervalo histórico.

---

# 61. Concurrency

Dois usuários poderão tentar reservar o mesmo Slot simultaneamente.

---

# 62. Race Condition

Fluxo problemático:

```text
User A sees 10:00 available

User B sees 10:00 available

User A books

User B books

↓

Double Booking
```

A UI não resolve isso.

---

# 63. Atomic Scheduling

A garantia final contra Double Booking deverá existir no Backend e/ou Database.

---

# 64. Optimistic UI Is Not Enough

```text
Frontend Check

≠

Concurrency Guarantee
```

---

# 65. Database Protection

Quando tecnicamente apropriado, Constraints, Transactions ou Locking deverão reforçar invariantes críticas.

---

# 66. Idempotency

Requests de criação poderão ser repetidas devido a:

```text
Network Retry

Double Click

Client Retry

Gateway Retry
```

O sistema deverá evitar Appointment duplicado quando aplicável.

---

# 67. Idempotency Key

Endpoints críticos poderão suportar:

```text
Idempotency-Key
```

ou mecanismo equivalente.

---

# 68. Appointment Source

O sistema deverá conseguir distinguir origem.

Possíveis:

```text
reception

professional

patient_portal

api

integration

automation

ai
```

---

# 69. Source Is Metadata

Source não substitui:

```text
createdBy
```

---

# 70. Created By

Quando uma pessoa autenticada criar Appointment, deverá ser possível identificar o ator.

---

# 71. Automated Creation

Quando criado por Automation:

```text
Actor

+

Automation Identity
```

deverão ser rastreáveis quando necessário.

---

# 72. AI Scheduling

AI poderá auxiliar interpretação de intenção.

Exemplo:

```text
"Quero marcar retorno
na sexta à tarde."
```

---

# 73. AI Boundary

AI poderá:

```text
Interpret

Search

Suggest

Prepare
```

Mas Availability e Business Rules deverão ser determinadas pelo domínio Appointments.

---

# 74. AI Cannot Invent Availability

```text
LLM says slot exists

≠

Slot exists
```

---

# 75. AI Write Flow

Preferir:

```text
User

↓

AI interprets

↓

Appointments searches

↓

AI presents

↓

User confirms

↓

Appointments creates
```

---

# 76. Patient Scheduling

Futuramente, Patients poderão agendar diretamente.

---

# 77. Patient Booking Rules

Self-Service poderá exigir:

```text
Allowed Service

Allowed Professional

Booking Window

Minimum Notice

Maximum Advance

Patient Eligibility

Confirmation
```

---

# 78. Booking Window

Exemplo:

```text
Minimum:

2 hours before

Maximum:

90 days ahead
```

Os valores são exemplos e não requisitos oficiais.

---

# 79. Professional Scheduling

Professional poderá criar Appointment quando autorizado.

---

# 80. Reception Scheduling

Reception deverá possuir ferramentas otimizadas para alto volume operacional.

---

# 81. Reception Workflow

```text
Search Patient

↓

Select Service

↓

Select Professional / Criteria

↓

Find Availability

↓

Select Slot

↓

Confirm Details

↓

Create Appointment
```

---

# 82. Quick Scheduling

UX poderá reduzir passos sem remover validações.

---

# 83. New Patient

Se Patient ainda não existir, Reception poderá utilizar fluxo apropriado de criação.

Appointments não deverá duplicar Patient Registry.

---

# 84. Patient Search

Busca deverá utilizar módulo Patients.

---

# 85. Professional Search

Busca deverá utilizar Professionals.

---

# 86. Clinic Selection

Em Organizations com múltiplas Clinics, Scheduling deverá preservar Clinic Context.

---

# 87. Multi-Clinic Professional

Um Professional poderá atuar em múltiplas Clinics.

Availability deverá considerar o contexto correspondente.

---

# 88. Cross-Clinic Conflict

Se Professional não puder estar em duas Clinics simultaneamente, conflitos deverão ser detectados entre unidades.

---

# 89. Resource Scheduling

No futuro, alguns Appointments poderão exigir recursos adicionais.

Exemplos:

```text
Room

Equipment

Procedure Chair

Device
```

---

# 90. Resource Availability

Um Slot somente será válido se todos os recursos obrigatórios estiverem disponíveis.

---

# 91. Resource Conflict

```text
Professional Available

+

Room Unavailable

=

Appointment Unavailable
```

---

# 92. Service Requirements

Service poderá declarar recursos necessários.

---

# 93. Appointment Type

Poderá existir distinção entre:

```text
in_person

telemedicine

home_visit

procedure
```

conforme evolução do produto.

---

# 94. Telemedicine Appointment

Quando `telemedicine`, o módulo Telemedicine poderá provisionar sessão correspondente.

---

# 95. Telemedicine Link

Meeting Link não deverá ser utilizado como identidade do Appointment.

---

# 96. Provisioning Failure

Se criação de sessão de Telemedicine falhar:

```text
Appointment State

and

Telemedicine State
```

deverão permanecer explicitamente reconciliáveis.

---

# 97. Appointment Reason

Reason poderá armazenar motivo operacional informado durante Scheduling.

---

# 98. Clinical Data Boundary

Reason não deverá se transformar em armazenamento clínico irrestrito.

---

# 99. Appointment Notes

Notas administrativas deverão ser diferenciadas de Medical Records.

---

# 100. Sensitive Notes

Notas poderão conter dados sensíveis.

Portanto, permissões e logging deverão ser considerados.

---

# 101. Confirmation

Appointments poderão exigir confirmação.

---

# 102. Confirmation Channels

Possíveis:

```text
Reception

Patient Portal

WhatsApp

SMS

Email

Phone

Automation
```

---

# 103. Confirmation State

Confirmação deverá alterar estado através de operação de domínio.

---

# 104. Confirmation Token

Links externos poderão utilizar Token seguro e limitado.

---

# 105. Token Requirements

Token deverá ser:

```text
Unpredictable

Scoped

Expiring

Revocable where necessary
```

---

# 106. Confirmation Link Privacy

Link não deverá expor Patient Data na URL.

---

# 107. Reminders

Appointments poderá emitir eventos para Notifications.

---

# 108. Notification Boundary

Appointments decide:

```text
An appointment requires reminder.
```

Notifications decide:

```text
How to deliver the reminder.
```

---

# 109. Reminder Scheduling

Possíveis regras:

```text
24 hours before

2 hours before
```

São exemplos configuráveis, não defaults obrigatórios deste documento.

---

# 110. Reminder Event

Exemplo:

```text
appointment.reminder_due
```

---

# 111. Domain Events

Appointments deverá emitir eventos relevantes.

Possíveis:

```text
appointment.created

appointment.confirmed

appointment.rescheduled

appointment.cancelled

appointment.checked_in

appointment.started

appointment.completed

appointment.no_show
```

---

# 112. Event Payload

Eventos deverão conter apenas informações necessárias.

---

# 113. Event Example

```json
{
  "event": "appointment.created",
  "appointmentId": "apt_...",
  "organizationId": "org_...",
  "occurredAt": "..."
}
```

Consumers deverão recuperar dados adicionais através de contratos apropriados quando necessário.

---

# 114. Avoid PHI in Events

Event Bus não deverá virar cópia indiscriminada de Patient Data.

---

# 115. Event Versioning

Eventos consumidos por múltiplos módulos deverão possuir contratos estáveis e Versioning quando necessário.

---

# 116. Event Delivery

Consumers deverão considerar possibilidade de:

```text
Duplicate Event

Delayed Event

Out-of-Order Event
```

---

# 117. Event Idempotency

Handlers deverão ser Idempotent quando apropriado.

---

# 118. Reception Integration

Reception poderá utilizar Appointments para:

```text
Today's Schedule

Arrival

Queue

Check-In

Status
```

---

# 119. Check-In

Check-In deverá representar evento operacional.

---

# 120. Check-In Actor

Poderá ser realizado por:

```text
Reception

Patient

Authorized Kiosk

Automation
```

dependendo do produto.

---

# 121. Early Check-In

Políticas poderão limitar Check-In muito antecipado.

---

# 122. Late Arrival

O sistema poderá registrar atraso sem automaticamente cancelar Appointment.

---

# 123. Queue

Queue pertence principalmente ao fluxo de Reception, mas deriva de Appointments.

---

# 124. Queue Position

Queue Position não deverá necessariamente ser persistida diretamente no Appointment.

---

# 125. Start Appointment

Professional poderá iniciar atendimento.

---

# 126. Start Validation

Verificar:

```text
Actor Permission

Appointment State

Professional Context

Clinic Context
```

---

# 127. Complete Appointment

Completion representa fim operacional do Appointment.

---

# 128. Completion Does Not Force Clinical Closure

Medical Record poderá possuir lifecycle independente.

---

# 129. No-Show Detection

No-Show poderá ser:

```text
Manual

Rule-Assisted

Automated
```

conforme maturidade.

---

# 130. Automatic No-Show

Automação deverá considerar:

```text
Appointment End

Grace Period

Check-In State

Current Status
```

---

# 131. No-Show Prediction

Predição futura poderá ajudar operação.

Ela não deverá substituir estado real.

---

# 132. Prediction Boundary

```text
Predicted No-Show

≠

No-Show
```

---

# 133. Waitlist

Futuramente, Appointments poderá integrar Smart Waitlist.

---

# 134. Waitlist Flow

```text
Appointment Cancelled

↓

Slot Available

↓

Eligible Waitlist Candidates

↓

Offer

↓

Patient Accepts

↓

Atomic Reservation
```

---

# 135. Waitlist Race

Múltiplos pacientes não deverão conseguir confirmar o mesmo Slot.

---

# 136. Recurring Appointments

Appointments recorrentes poderão ser suportados futuramente.

---

# 137. Recurrence Complexity

Recurrence envolve:

```text
Series

Occurrence

Exceptions

Rescheduling

Cancellation
```

---

# 138. Recurrence Identity

Cada ocorrência deverá possuir identidade suficiente para histórico.

---

# 139. Series Modification

Operações futuras poderão distinguir:

```text
Only This Appointment

This and Future

Entire Series
```

---

# 140. Recurrence Storage

Não assumir que uma RRULE isolada resolverá todos os requisitos de negócio.

---

# 141. Availability Search

API de disponibilidade deverá receber critérios claros.

Exemplo:

```text
clinic

professional

service

date range

timezone
```

---

# 142. Availability Response

Exemplo conceitual:

```json
{
  "date": "2026-08-10",
  "slots": [
    {
      "startAt": "...",
      "endAt": "..."
    }
  ]
}
```

---

# 143. Availability Is Ephemeral

Slot disponível agora poderá deixar de existir segundos depois.

---

# 144. Booking Validation

Ao criar Appointment:

```text
Revalidate Availability
```

---

# 145. Calendar UI

Calendar é uma representação do domínio.

Não deverá possuir regras próprias divergentes.

---

# 146. Calendar Views

Possíveis:

```text
Day

Week

Month

Agenda

Professional

Clinic
```

---

# 147. Month View

Month View poderá apresentar agregação e não todos os detalhes.

---

# 148. Agenda View

Agenda poderá otimizar fluxo de Reception.

---

# 149. Professional View

Deverá facilitar compreensão de disponibilidade individual.

---

# 150. Drag and Drop

Reagendamento via Drag and Drop deverá executar o mesmo comando de domínio utilizado por qualquer outro fluxo.

---

# 151. No UI Bypass

```text
Drag Event

↓

API

↓

Validation

↓

Reschedule
```

Nunca:

```text
Drag Event

↓

Direct Database Update
```

---

# 152. Optimistic Update

Pode ser utilizada para UX quando rollback seguro existir.

---

# 153. Permission Model

Possíveis permissões:

```text
appointments.read

appointments.create

appointments.update

appointments.reschedule

appointments.cancel

appointments.confirm

appointments.check_in

appointments.start

appointments.complete

appointments.mark_no_show

appointments.manage_schedule
```

---

# 154. Permission Granularity

Nem todo usuário com:

```text
appointments.read
```

deverá possuir:

```text
appointments.cancel
```

---

# 155. Professional Self-Scope

Professional poderá ter permissões limitadas aos próprios Appointments conforme Policy.

---

# 156. Reception Scope

Reception poderá acessar Appointments necessários para operação da Clinic.

---

# 157. Organization Admin

Admin poderá possuir escopo maior, ainda limitado ao Tenant.

---

# 158. Patient Permission

Patient deverá acessar apenas Appointments associados à própria identidade ou representação autorizada.

---

# 159. Authorization Boundary

Filtros no Frontend não são controle de acesso.

Backend deverá aplicar Authorization.

---

# 160. Cross-Tenant Access

Qualquer tentativa de acessar Appointment de Organization diferente deverá ser rejeitada.

---

# 161. ID Enumeration

Conhecer um `appointmentId` não deverá conceder acesso.

---

# 162. Security

Endpoints deverão validar:

```text
Authentication

Tenant

Permission

Resource Scope

Input
```

---

# 163. Input Validation

Validar:

```text
IDs

Dates

Duration

Status

Reason

Service

Professional

Clinic
```

conforme operação.

---

# 164. Mass Assignment

API não deverá permitir atualização arbitrária de campos.

Errado:

```text
PATCH appointment
{ ...anything }
```

para operações sensíveis.

Preferir comandos explícitos.

---

# 165. Command API

Exemplos:

```text
POST /appointments

POST /appointments/{id}/confirm

POST /appointments/{id}/reschedule

POST /appointments/{id}/cancel

POST /appointments/{id}/check-in

POST /appointments/{id}/start

POST /appointments/{id}/complete

POST /appointments/{id}/no-show
```

Endpoints são conceituais.

---

# 166. Query API

Possíveis:

```text
GET /appointments

GET /appointments/{id}

GET /appointments/availability
```

---

# 167. Filtering

Filtros possíveis:

```text
date

dateRange

professionalId

patientId

clinicId

status

serviceId
```

---

# 168. Pagination

Consultas grandes deverão utilizar Pagination apropriada.

---

# 169. Calendar Query

Calendar não deverá carregar anos de Appointments quando mostra apenas uma semana.

---

# 170. Query Boundaries

APIs poderão limitar Date Range máximo.

---

# 171. Sorting

Sorting padrão deverá ser determinístico.

Exemplo:

```text
startAt ASC
```

---

# 172. Search

Busca textual não deverá substituir filtros estruturados.

---

# 173. Performance

Índices deverão refletir padrões reais de consulta.

Possíveis dimensões:

```text
organizationId

clinicId

professionalId

patientId

startAt

status
```

A definição final pertence ao ERD e análise do Database.

---

# 174. N+1 Queries

Listagens de Calendar não deverão gerar Query individual para cada Appointment.

---

# 175. Caching

Caching de Availability exige cuidado devido à alta volatilidade.

---

# 176. Cache Invalidation

Se utilizado:

```text
Appointment Created

↓

Availability Cache Invalidated
```

e equivalentes.

---

# 177. Correctness Over Cache

Scheduling correto é mais importante que Cache Hit Rate.

---

# 178. Database Transaction

Criação poderá envolver:

```text
Validate

Reserve

Persist

Emit Event
```

Consistência deverá ser cuidadosamente projetada.

---

# 179. Transactional Outbox

Se eventos externos forem críticos, padrão Outbox poderá ser considerado.

```text
DB Transaction

├── Appointment
└── Outbox Event

↓

Publisher

↓

Event Bus
```

---

# 180. Eventual Consistency

Notifications e integrações externas poderão ser eventualmente consistentes.

Appointment principal não deverá depender de envio instantâneo de Email para existir.

---

# 181. Notification Failure

```text
Appointment Created

+

Reminder Failed

≠

Appointment Creation Failed
```

quando Notification não fizer parte da transação essencial.

---

# 182. External Calendar

Integrações futuras poderão sincronizar Appointment com calendário externo.

---

# 183. Calendar Integration Direction

Possíveis modelos:

```text
One-Way

MedFlow → Calendar
```

ou:

```text
Two-Way

MedFlow ↔ Calendar
```

Two-Way possui complexidade significativamente maior.

---

# 184. External Calendar Source of Truth

MedFlow deverá continuar autoritativo para Appointments.

---

# 185. Sync Identity

Integrações deverão mapear:

```text
appointmentId

↔

externalEventId
```

---

# 186. Sync Loop

Two-Way Sync deverá evitar:

```text
MedFlow Update

↓

Google Update

↓

Google Webhook

↓

MedFlow Update

↓

Google Update

...
```

---

# 187. External Conflict

Conflitos deverão possuir estratégia explícita.

---

# 188. Notification Integration

Eventos de Appointments poderão gerar:

```text
Confirmation

Reminder

Reschedule Notice

Cancellation Notice
```

---

# 189. Payment Integration

Alguns Services poderão exigir pagamento.

Appointments não deverá processar Payment diretamente.

---

# 190. Payment Status

Appointments poderá consumir informação necessária como:

```text
payment_required

payment_pending

payment_confirmed
```

sem se tornar Payment Source of Truth.

---

# 191. Payment Failure

Regra sobre manter ou liberar Slot deverá ser definida pela política do produto.

---

# 192. Reservation Hold

Futuramente poderá existir:

```text
Temporary Slot Hold
```

durante Checkout.

---

# 193. Hold Expiration

Hold deverá possuir TTL.

---

# 194. Abandoned Hold

Expiração deverá liberar disponibilidade automaticamente.

---

# 195. Reports Integration

Reports poderá consumir eventos ou consultas para métricas.

Exemplos:

```text
Appointments Created

Completed

Cancelled

No-Show

Utilization
```

---

# 196. Analytics Definitions

Métricas deverão possuir definições estáveis.

Exemplo:

```text
No-Show Rate
```

deverá especificar denominador.

---

# 197. Historical Accuracy

Mudanças futuras de cadastro do Professional ou Patient não deverão tornar histórico incompreensível.

---

# 198. Snapshot Data

Alguns dados poderão exigir Snapshot histórico quando o relacionamento atual não preservar significado suficiente.

Isso deverá ser decidido caso a caso.

---

# 199. Deletion

Appointments relacionados a registros operacionais ou clínicos não deverão ser fisicamente apagados arbitrariamente.

---

# 200. Soft Delete

Soft Delete não deverá ser introduzido automaticamente.

Status `cancelled` normalmente resolve cancelamento.

Deletion possui significado diferente.

---

# 201. Privacy

Appointment Metadata poderá revelar informação de saúde.

Portanto deverá ser tratada como dado sensível quando aplicável.

---

# 202. Data Minimization

Listagens deverão retornar apenas campos necessários à interface.

---

# 203. Logs

Não logar indiscriminadamente:

```text
Patient Name

Reason

Notes

Sensitive Details
```

---

# 204. Audit

Operações críticas deverão ser auditáveis.

Exemplos:

```text
Create

Reschedule

Cancel

Manual Status Change

Schedule Override
```

---

# 205. Override

Algumas Organizations poderão futuramente permitir Override de conflito ou regra.

---

# 206. Override Requirements

Se existir:

```text
Explicit Permission

Reason

Actor

Timestamp

Audit
```

deverão ser exigidos.

---

# 207. Override Is Exceptional

Override não deverá ser o caminho normal.

---

# 208. Error Model

Possíveis códigos:

```text
APPOINTMENT_NOT_FOUND

APPOINTMENT_CONFLICT

APPOINTMENT_INVALID_STATE

APPOINTMENT_NOT_ALLOWED

APPOINTMENT_SLOT_UNAVAILABLE

APPOINTMENT_OUTSIDE_SCHEDULE

APPOINTMENT_INVALID_DURATION

APPOINTMENT_INVALID_TIME

APPOINTMENT_ALREADY_CANCELLED

APPOINTMENT_ALREADY_COMPLETED

PROFESSIONAL_UNAVAILABLE

CLINIC_UNAVAILABLE

SERVICE_NOT_AVAILABLE
```

---

# 209. Error Stability

Clientes não deverão depender de mensagens humanas para lógica.

Preferir códigos estáveis.

---

# 210. Conflict Error

Quando Slot não estiver mais disponível, UI deverá permitir buscar alternativas.

---

# 211. Observability

Módulo deverá possuir:

```text
Logs

Metrics

Traces

Audit
```

---

# 212. Metrics Técnicas

Possíveis:

```text
appointment_create_latency

availability_query_latency

appointment_conflict_count

appointment_create_failure_rate

reschedule_failure_rate
```

---

# 213. Metrics de Produto

Possíveis:

```text
Appointments Created

Confirmation Rate

Cancellation Rate

No-Show Rate

Reschedule Rate

Average Lead Time
```

---

# 214. Metrics de Operação

Possíveis:

```text
Occupancy

Professional Utilization

Schedule Gaps

Wait Time
```

---

# 215. Metric Privacy

Analytics não deverá expor Patient Data desnecessariamente.

---

# 216. Testing Strategy

O módulo exige testes fortes.

---

# 217. Unit Tests

Testar:

```text
State Transitions

Conflict Logic

Duration

Availability Rules

Cancellation Rules

Permissions
```

---

# 218. Integration Tests

Testar:

```text
Database

Transactions

Constraints

Events

Notification Integration
```

---

# 219. Concurrency Tests

Essenciais.

Testar duas tentativas simultâneas de reserva do mesmo recurso.

---

# 220. Time Tests

Cobrir:

```text
Timezone

DST

Midnight

Month Boundary

Year Boundary

Leap Year
```

quando aplicável.

---

# 221. Authorization Tests

Cobrir:

```text
Different Organization

Different Clinic

Different Professional

Patient Self-Scope

Reception Scope
```

---

# 222. State Machine Tests

Toda transição permitida e proibida deverá ser verificável.

---

# 223. Event Tests

Validar:

```text
Correct Event

Correct Version

No Sensitive Payload

Idempotent Consumer
```

quando aplicável.

---

# 224. End-to-End Tests

Fluxos prioritários:

```text
Create Appointment

Reschedule

Cancel

Confirm

Check-In

Start

Complete

Mark No-Show
```

---

# 225. Availability E2E

Testar:

```text
Search Slot

↓

Book

↓

Slot Disappears
```

---

# 226. Accessibility

Calendar deverá ser utilizável além de interações exclusivamente por mouse.

---

# 227. Keyboard Navigation

Scheduling deverá possuir suporte adequado a teclado.

---

# 228. Color Is Not State

Status não deverá ser comunicado apenas por cor.

---

# 229. Screen Readers

Informações temporais e de status deverão possuir semântica adequada.

---

# 230. Mobile

Calendar complexo poderá exigir UX diferente em telas pequenas.

---

# 231. Responsive Strategy

Não simplesmente comprimir Desktop Week Calendar até ficar ilegível.

---

# 232. Localization

Datas e horários deverão respeitar Locale.

---

# 233. Internal Representation

Locale não deverá alterar representação canônica de dados.

---

# 234. Date Parsing

Evitar formatos ambíguos como:

```text
03/04/2026
```

em APIs internas.

---

# 235. ISO Representation

APIs deverão preferir formatos temporais não ambíguos.

---

# 236. Configuration

Regras configuráveis poderão incluir:

```text
Default Duration

Booking Window

Cancellation Window

Confirmation Requirement

Reminder Policy

Schedule Granularity

Check-In Window
```

---

# 237. Configuration Scope

Configuração poderá existir em:

```text
Platform

Organization

Clinic

Professional

Service
```

---

# 238. Configuration Precedence

Se múltiplos níveis existirem, precedência deverá ser explícita.

---

# 239. No Configuration Explosion

Nem toda regra deverá virar Setting.

Configuração excessiva aumenta:

```text
Complexity

Testing Matrix

Support Cost
```

---

# 240. Business Rule Ownership

Rules de Scheduling deverão permanecer no Domain.

Não espalhadas entre:

```text
Frontend

Database Trigger

Notification Worker

AI Prompt
```

---

# 241. Service Layer

Um serviço conceitual poderá expor:

```ts
interface AppointmentService {
  create(input: CreateAppointmentInput): Promise<Appointment>;

  reschedule(
    id: string,
    input: RescheduleAppointmentInput
  ): Promise<Appointment>;

  cancel(
    id: string,
    input: CancelAppointmentInput
  ): Promise<Appointment>;

  confirm(id: string): Promise<Appointment>;

  checkIn(id: string): Promise<Appointment>;

  start(id: string): Promise<Appointment>;

  complete(id: string): Promise<Appointment>;

  markNoShow(id: string): Promise<Appointment>;
}
```

O contrato é ilustrativo.

---

# 242. Availability Service

```ts
interface AvailabilityService {
  search(
    input: AvailabilitySearchInput
  ): Promise<AvailableSlot[]>;

  validate(
    input: AvailabilityValidationInput
  ): Promise<AvailabilityResult>;
}
```

---

# 243. Domain Invariants

Exemplos:

```text
Appointment belongs to one Organization.

End must be after Start.

Appointment must reference valid scheduling context.

Unauthorized actors cannot mutate Appointment.

Invalid state transitions are rejected.

Availability is revalidated at booking.

Critical resource conflicts are prevented.

Cancellation preserves history.

AI cannot bypass scheduling rules.
```

---

# 244. Current / Planned / Future

Este quadro deverá refletir o código real.

| Capacidade | Estado |
|------------|--------|
| Appointment CRUD básico | Current / validar com implementação |
| Calendar | Current / validar com implementação |
| Patient Association | Current / validar com implementação |
| Professional Association | Current / validar com implementação |
| Status Lifecycle | Current / validar com implementação |
| Availability Engine avançado | Planned |
| Conflict Protection avançada | Planned |
| Reminder Automation | Planned |
| Check-In Workflow | Planned |
| Waitlist | Future |
| Patient Self-Scheduling | Future |
| Recurring Appointments | Future |
| Resource Scheduling | Future |
| External Calendar Sync | Future |
| AI Scheduling Assistant | Future |
| Predictive No-Show | Future |

> Nenhum item marcado como `Current / validar com implementação` deverá ser assumido como contrato definitivo sem confirmação no código e no ERD atual.

---

# 245. Decisões Arquiteturais e de Produto

## ADR-721

Appointments será a fonte de verdade para o lifecycle de agendamentos do MedFlow.

---

## ADR-722

Appointment será tratado como entidade de negócio e não como simples Calendar Event.

---

## ADR-723

Todo Appointment deverá possuir Tenant Ownership explícito.

---

## ADR-724

Timezones serão tratadas como parte da corretude do domínio e não apenas como preocupação de apresentação.

---

## ADR-725

Appointments deverão possuir representação temporal não ambígua.

---

## ADR-726

Status deverá evoluir através de transições de domínio validadas.

---

## ADR-727

Cancelamento não será equivalente à exclusão do Appointment.

---

## ADR-728

Reagendamentos relevantes deverão preservar histórico suficiente para rastreabilidade.

---

## ADR-729

Availability não será definida apenas pela inexistência de Appointment.

---

## ADR-730

Slots poderão ser derivados dinamicamente das regras de Availability em vez de obrigatoriamente persistidos.

---

## ADR-731

Double Booking deverá ser prevenido por garantias Server-Side e não apenas por validação de UI.

---

## ADR-732

Availability deverá ser revalidada durante a operação final de Booking.

---

## ADR-733

Operações de criação deverão considerar Idempotency quando retries puderem produzir duplicações.

---

## ADR-734

Appointment Source será Metadata e não substituirá Actor Identity.

---

## ADR-735

AI poderá interpretar intenção de Scheduling, mas não será fonte de verdade para Availability.

---

## ADR-736

Patient Self-Scheduling deverá passar pelas mesmas regras de domínio utilizadas pela Reception.

---

## ADR-737

Multi-Clinic Scheduling deverá considerar conflitos reais de Professionals entre unidades quando aplicável.

---

## ADR-738

Resource Scheduling somente será introduzido quando houver casos de negócio que justifiquem sua complexidade.

---

## ADR-739

Telemedicine Session e Appointment permanecerão entidades distintas com lifecycles coordenados.

---

## ADR-740

Appointment Notes administrativas não substituirão Medical Records.

---

## ADR-741

Confirmation Links deverão utilizar Tokens seguros, limitados e não expor Patient Data diretamente na URL.

---

## ADR-742

Appointments determinará necessidade de Notification enquanto Notifications será responsável pela entrega.

---

## ADR-743

Domain Events de Appointment deverão minimizar Patient Data em Payloads.

---

## ADR-744

Consumers de Appointment Events deverão considerar Duplicate Delivery quando a infraestrutura correspondente permitir essa possibilidade.

---

## ADR-745

Check-In será tratado como transição operacional explícita.

---

## ADR-746

Completion de Appointment não implicará automaticamente encerramento do Medical Record.

---

## ADR-747

No-Show Prediction, caso implementada, não substituirá o estado factual do Appointment.

---

## ADR-748

Waitlist deverá realizar reserva final de Slot de forma segura contra concorrência.

---

## ADR-749

Recurring Appointments não serão modelados apenas como repetição visual sem identidade e histórico de ocorrências.

---

## ADR-750

Calendar UI não possuirá Business Rules exclusivas divergentes do Backend.

---

## ADR-751

Drag-and-Drop Scheduling deverá utilizar o mesmo comando de domínio de qualquer outro Reagendamento.

---

## ADR-752

Authorization de Appointments deverá ser aplicada Server-Side.

---

## ADR-753

Conhecimento de Appointment ID não concederá acesso ao recurso.

---

## ADR-754

Operações sensíveis deverão evitar Mass Assignment e preferir comandos explícitos.

---

## ADR-755

Queries de Calendar deverão ser limitadas ao intervalo necessário.

---

## ADR-756

Correctness de Scheduling terá prioridade sobre otimizações de Cache.

---

## ADR-757

Integrações não essenciais como Notifications poderão utilizar Eventual Consistency sem invalidar a criação principal do Appointment.

---

## ADR-758

MedFlow permanecerá Source of Truth para Appointments sincronizados com calendários externos.

---

## ADR-759

Integrações bidirecionais de calendário deverão possuir proteção contra Sync Loops.

---

## ADR-760

Appointments não processará Payments diretamente.

---

## ADR-761

Temporary Slot Holds, caso implementados, deverão possuir expiração explícita.

---

## ADR-762

Métricas operacionais deverão possuir definições consistentes e documentadas.

---

## ADR-763

Appointments não deverão ser fisicamente apagados arbitrariamente quando necessários para histórico, Audit ou requisitos aplicáveis.

---

## ADR-764

Appointment Metadata será tratada como potencialmente sensível.

---

## ADR-765

Schedule Overrides, caso permitidos, deverão exigir Permission, Reason e Audit.

---

## ADR-766

Erros de domínio deverão possuir códigos estáveis separados de mensagens de apresentação.

---

## ADR-767

Concurrency Tests serão considerados parte essencial da qualidade do Scheduling Engine.

---

## ADR-768

Testes temporais deverão cobrir Timezone e calendários relevantes ao mercado suportado.

---

## ADR-769

Calendar Accessibility não dependerá exclusivamente de Drag-and-Drop ou interação por mouse.

---

## ADR-770

Locale será preocupação de apresentação e parsing controlado, não da identidade temporal interna.

---

## ADR-771

Configurações de Scheduling deverão possuir escopo e precedência explícitos.

---

## ADR-772

Business Rules de Appointments permanecerão centralizadas no Domain Layer apropriado.

---

## ADR-773

Professional, Patient e Clinic permanecerão domínios externos ao Appointment e serão referenciados por contratos definidos.

---

## ADR-774

External Integration Failure não deverá corromper o estado principal do Appointment.

---

## ADR-775

Appointment History e Security Audit serão conceitos distintos, ainda que correlacionáveis.

---

## ADR-776

A introdução de novos Appointment Status exigirá significado operacional claro e transições definidas.

---

## ADR-777

Service Duration poderá influenciar Availability sem tornar o Appointment dependente de regras de UI.

---

## ADR-778

Availability Engine deverá considerar todos os recursos críticos necessários para determinar um Slot válido.

---

## ADR-779

Dados retornados por listagens de Appointments deverão seguir Data Minimization.

---

## ADR-780

A evolução do módulo deverá preservar a separação entre Scheduling State, Clinical State, Payment State e Communication State.

---

# 246. Relação com Outros Módulos

```text
Appointments
│
├── Patients
│     └── Patient Identity
│
├── Professionals
│     └── Professional Availability
│
├── Clinics
│     └── Operational Context
│
├── Reception
│     └── Check-In / Queue
│
├── Notifications
│     └── Confirmation / Reminder
│
├── Payments
│     └── Payment State
│
├── Medical Records
│     └── Clinical Documentation
│
├── Telemedicine
│     └── Virtual Session
│
├── Reports
│     └── Scheduling Analytics
│
└── AI
      └── Scheduling Assistance
```

---

# 247. Relação com Documentação

Este documento deverá ser interpretado junto de:

```text
Database ERD

Backend Architecture

API Documentation

Security Documentation

Reception Module

Patients Module

Professionals Module

Notifications Module

Telemedicine Module

Roadmap
```

Em caso de divergência com implementação atual, o comportamento real deverá ser investigado e a documentação corrigida.

---

# 248. Checklist — Create Appointment

Antes de persistir:

```text
[ ] Actor authenticated
[ ] Tenant resolved
[ ] Permission validated
[ ] Clinic valid
[ ] Patient valid
[ ] Professional valid
[ ] Service valid when required
[ ] Time valid
[ ] Timezone resolved
[ ] Duration valid
[ ] Professional available
[ ] Clinic available
[ ] Required resources available
[ ] Conflicts checked
[ ] Booking policy validated
[ ] Idempotency considered
```

---

# 249. Checklist — Reschedule

```text
[ ] Appointment exists
[ ] Tenant matches
[ ] Permission valid
[ ] State allows rescheduling
[ ] New time valid
[ ] Availability revalidated
[ ] Conflicts checked
[ ] History preserved
[ ] Event emitted
[ ] Notifications scheduled
```

---

# 250. Checklist — Cancel

```text
[ ] Appointment exists
[ ] Tenant matches
[ ] Permission valid
[ ] Current state allows cancellation
[ ] Policy validated
[ ] Reason captured when required
[ ] Actor captured
[ ] Cancellation persisted
[ ] History preserved
[ ] Slot released
[ ] Event emitted
[ ] External integrations informed
```

---

# 251. Checklist — Code Review

```text
[ ] No frontend-only scheduling rule
[ ] No tenant bypass
[ ] No direct status mutation
[ ] No unsafe time parsing
[ ] No missing conflict validation
[ ] No race condition introduced
[ ] No PHI unnecessarily logged
[ ] No direct Notification coupling where event is appropriate
[ ] No Payment logic moved into Appointment
[ ] No Clinical Record stored as Appointment Notes
[ ] Errors are stable
[ ] Tests cover transitions
[ ] Tests cover concurrency
[ ] Documentation updated
```

---

# 252. Definition of Done

Uma funcionalidade de Scheduling não estará concluída apenas porque aparece corretamente no Calendar.

Ela deverá ser:

```text
Functionally Correct

+

Concurrency Safe

+

Tenant Safe

+

Authorized

+

Time Correct

+

Auditable

+

Observable

+

Accessible

+

Tested

+

Documented
```

---

# 253. Failure Scenarios

O módulo deverá ser projetado assumindo que situações como estas acontecerão:

```text
Two receptionists book the same slot.

Patient confirms twice.

Browser retries the request.

Notification provider is offline.

Professional schedule changes.

Clinic timezone changes.

External calendar returns duplicate webhook.

User drags appointment to invalid time.

AI requests nonexistent slot.

Patient opens an expired confirmation link.

Worker processes an event twice.
```

A arquitetura deverá responder de maneira previsível.

---

# 254. Future Evolution

Uma possível evolução:

```text
Basic Scheduling

↓

Reliable Availability

↓

Confirmation & Reminders

↓

Reception Integration

↓

Patient Self-Service

↓

Waitlist

↓

Resource Scheduling

↓

Calendar Integrations

↓

AI Scheduling Assistance

↓

Operational Optimization
```

Essa sequência não representa Release Commitment.

---

# 255. Para Futuros Desenvolvedores

Se você estiver modificando este módulo anos depois, não trate Calendar como a arquitetura.

O Calendar é apenas uma visualização.

A arquitetura real está nas invariantes:

```text
Time

Availability

State

Conflict

Authorization

Tenant

History

Consistency
```

Antes de adicionar um novo Status, pergunte:

```text
Does this represent
a real business state?
```

Antes de adicionar uma nova configuração:

```text
Does an Organization
actually need to control this?
```

Antes de adicionar um novo campo:

```text
Does this belong
to Appointment?
```

Antes de permitir um Override:

```text
What invariant
are we allowing
someone to break?
```

---

# 256. Invariante Final

Independentemente de como o produto evolua:

```text
An appointment must represent
a trustworthy commitment
of time and resources.
```

Se duas telas diferentes apresentarem disponibilidade incompatível, o módulo falhou.

Se duas pessoas conseguirem reservar o mesmo recurso quando isso não deveria acontecer, o módulo falhou.

Se um usuário conseguir alterar Appointment de outro Tenant, o módulo falhou.

Se uma integração externa puder alterar silenciosamente a verdade interna sem regras, o módulo falhou.

O objetivo final não é possuir um calendário bonito.

É possuir um Scheduling Domain confiável.

---

# 257. Considerações Finais

Scheduling parece simples enquanto representado assim:

```text
Patient

+

Doctor

+

Date
```

Mas um sistema real rapidamente evolui para:

```text
People

+

Time

+

Availability

+

Resources

+

State

+

Concurrency

+

Communication

+

Permissions

+

History
```

É essa complexidade que o módulo `Appointments` deverá controlar.

Outros módulos poderão reagir ao Appointment.

Notifications poderá enviar lembretes.

Reception poderá organizar a chegada.

Payments poderá acompanhar cobrança.

Telemedicine poderá criar uma sessão virtual.

Medical Records poderá documentar o atendimento.

AI poderá auxiliar o usuário.

Mas nenhum deles deverá redefinir silenciosamente o que o Appointment significa.

```text
One Scheduling Domain.

One set of invariants.

Many consumers.
```

Essa separação permitirá que o MedFlow evolua de um calendário básico para uma plataforma de saúde muito maior sem precisar reconstruir seu conceito de agendamento a cada nova funcionalidade.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação da documentação oficial do módulo Appointments, incluindo lifecycle, state machine, disponibilidade, conflitos, concorrência, reagendamento, cancelamento, check-in, integrações, segurança, permissões, eventos, observabilidade, testes e decisões ADR-721 a ADR-780 | Equipe MedFlow |