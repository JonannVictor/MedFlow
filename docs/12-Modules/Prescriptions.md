# Módulo de Agendamento (Scheduling)

| Campo | Valor |
|-------|--------|
| Documento | Scheduling |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Modules |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# 1. Visão Geral

O módulo **Scheduling** é responsável pelo gerenciamento da agenda clínica da plataforma MedFlow.

Seu objetivo é controlar disponibilidade, horários, bloqueios e reservas de atendimento.

---

# 2. Princípio Fundamental

```text
Appointment

≠

Encounter
```

Appointment representa um horário reservado.

Encounter representa um atendimento clínico realizado.

Um Appointment pode nunca acontecer.

Um Encounter somente existe quando houve atendimento.

---

# 3. Objetivo

O módulo deverá responder:

```text
Quem possui agenda?

Quais horários estão disponíveis?

Quem marcou a consulta?

Qual profissional atenderá?

Onde ocorrerá o atendimento?

Qual o status do agendamento?
```

---

# 4. Source of Truth

Scheduling será o Source of Truth para:

```text
Appointments

Schedules

Availability

Calendar Rules

Time Slots

Booking History
```

---

# 5. Escopo

O módulo será responsável por:

- Agenda
- Horários disponíveis
- Agendamentos
- Cancelamentos
- Reagendamentos
- Bloqueios
- Disponibilidade
- Calendários
- Fila de espera

---

# 6. Fora do Escopo

Não pertence ao módulo:

- Prontuário
- Diagnósticos
- Prescrições
- Pagamentos
- Notificações
- Atendimento clínico

---

# 7. Filosofia

Scheduling administra tempo.

Medical Records administra informações clínicas.

Essa separação deverá permanecer durante toda evolução da plataforma.

---

# 8. Bounded Context

```text
Patients

↓

Scheduling

↓

Appointments

↓

Medical Records

↓

Encounter
```

---

# 9. Domain Boundary

Scheduling nunca deverá armazenar:

```text
SOAP

Diagnósticos

Medicamentos

Resultados de exames

Notas clínicas
```

---

# 10. Aggregate Root

```text
Appointment

├── id
├── organizationId
├── patientId
├── professionalId
├── clinicId
├── scheduleId
├── status
├── startsAt
├── endsAt
├── createdAt
└── metadata
```

---

# 11. Identity

Todo Appointment possuirá:

```text
id
```

imutável.

---

# 12. Ownership

Todo Appointment pertence a:

```text
Organization

+

Patient

+

Professional
```

---

# 13. Clinic Context

O atendimento poderá ocorrer em:

```text
Clinic

Telemedicine

Home Care
```

---

# 14. Appointment Status

Estados possíveis:

```text
scheduled

confirmed

checked_in

completed

cancelled

no_show

rescheduled
```

---

# 15. Scheduled

Representa um horário reservado.

---

# 16. Confirmed

O paciente confirmou presença.

---

# 17. Check-in

Representa a chegada do paciente.

Não significa início do atendimento.

---

# 18. Completed

O Appointment foi concluído.

Poderá originar um Encounter.

---

# 19. No Show

Paciente não compareceu.

---

# 20. Cancelled

Cancelamentos deverão preservar histórico.

---

# 21. Rescheduled

Reagendamento deverá gerar vínculo entre os agendamentos.

---

# 22. Schedule

Cada profissional poderá possuir uma agenda.

---

# 23. Schedule Entity

```text
Schedule

├── id
├── organizationId
├── professionalId
├── timezone
├── status
└── metadata
```

---

# 24. Availability

Disponibilidade representa períodos livres para agendamento.

---

# 25. Availability Entity

```text
Availability

├── id
├── scheduleId
├── startsAt
├── endsAt
├── recurrence
└── metadata
```

---

# 26. Time Slots

A agenda poderá ser dividida em Time Slots.

---

# 27. Slot Duration

Exemplos:

```text
15 min

20 min

30 min

45 min

60 min
```

---

# 28. Recurrence

Disponibilidades poderão ser recorrentes.

---

# 29. Recurrence Types

Exemplos:

```text
Daily

Weekly

Monthly

Custom
```

---

# 30. Exceptions

Regras recorrentes poderão possuir exceções.

---

# 31. Blocked Time

Profissionais poderão bloquear horários.

---

# 32. Block Entity

```text
ScheduleBlock

├── id
├── scheduleId
├── startsAt
├── endsAt
├── reason
└── metadata
```

---

# 33. Block Reasons

Exemplos:

```text
Vacation

Lunch

Meeting

Holiday

Training

Personal
```

---

# 34. Working Hours

Cada agenda deverá possuir horário de funcionamento.

---

# 35. Timezone

Toda agenda deverá utilizar timezone explícita.

---

# 36. Double Booking

Por padrão, não será permitido conflito de horários.

---

# 37. Overbooking

Organizações poderão permitir overbooking mediante configuração.

---

# 38. Waiting List

O módulo poderá manter lista de espera.

---

# 39. Waiting List Entity

```text
WaitingList

├── id
├── patientId
├── professionalId
├── preferredDate
├── priority
└── metadata
```

---

# 40. Booking Rules

O domínio deverá validar conflitos antes da confirmação.

---

# 41. Validation

Validar:

```text
Disponibilidade

Bloqueios

Conflitos

Permissões

Status
```

---

# 42. Reschedule

Reagendamentos deverão preservar histórico.

---

# 43. Cancellation Policy

Políticas de cancelamento poderão ser configuráveis.

---

# 44. Appointment History

Todo agendamento deverá manter histórico completo.

---

# 45. Audit

Alterações relevantes deverão gerar auditoria.

---

# 46. Audit Entity

```text
AppointmentAudit

├── id
├── appointmentId
├── actorId
├── action
├── occurredAt
├── before
├── after
└── metadata
```

---

# 47. Events

Scheduling poderá publicar:

```text
appointment.created

appointment.confirmed

appointment.cancelled

appointment.rescheduled

appointment.checked_in

appointment.completed
```

---

# 48. APIs Conceituais

```text
GET /appointments

GET /appointments/{id}

POST /appointments

PUT /appointments/{id}

POST /appointments/{id}/confirm

POST /appointments/{id}/cancel

POST /appointments/{id}/reschedule
```

---

# 49. Domain Invariants

```text
Every Appointment belongs to one Organization.

Every Appointment belongs to one Patient.

Every Appointment belongs to one Professional.

Appointments preserve history.

Scheduling never stores clinical information.

Availability controls booking.

Double booking is prevented by default.
```

---

# 50. Continuação

Na Parte 2 serão abordados:

- Calendários
- Disponibilidade avançada
- Regras recorrentes
- Feriados
- Telemedicina
- Check-in
- Fila de espera avançada
- Auditoria
- ADR-1091 em diante
---

# 51. Calendários

Cada profissional poderá possuir um ou mais calendários operacionais.

Exemplos:

```text
Consultório

Telemedicina

Cirurgias

Plantão

Procedimentos
```

---

# 52. Calendar Entity

```text
Calendar

├── id
├── organizationId
├── scheduleId
├── name
├── timezone
├── status
└── metadata
```

---

# 53. Calendar Status

Estados possíveis:

```text
active

inactive

archived
```

---

# 54. Calendar Rules

Cada calendário poderá possuir regras independentes de disponibilidade.

---

# 55. Working Days

Exemplo:

```text
Monday

Tuesday

Wednesday

Thursday

Friday
```

---

# 56. Business Hours

Cada dia poderá possuir horários distintos.

Exemplo:

```text
Monday

08:00 - 12:00

13:30 - 18:00
```

---

# 57. Holiday Rules

A agenda poderá considerar feriados nacionais, estaduais, municipais ou internos.

---

# 58. Holiday Entity

```text
Holiday

├── id
├── organizationId
├── date
├── description
├── scope
└── metadata
```

---

# 59. Holiday Scope

Exemplos:

```text
National

State

City

Organization

Clinic
```

---

# 60. Availability Generation

Time Slots poderão ser gerados automaticamente a partir das regras da agenda.

---

# 61. Slot Generator

Fluxo conceitual:

```text
Working Hours

↓

Availability Rules

↓

Time Slots
```

---

# 62. Dynamic Availability

A disponibilidade deverá ser recalculada sempre que ocorrer:

- novo agendamento;
- cancelamento;
- bloqueio;
- alteração de horário.

---

# 63. Slot Status

Estados possíveis:

```text
Available

Reserved

Blocked

Unavailable
```

---

# 64. Slot Lock

Durante o processo de agendamento o horário poderá ser temporariamente reservado.

---

# 65. Lock Timeout

Locks deverão expirar automaticamente caso a reserva não seja concluída.

---

# 66. Concurrency

O domínio deverá impedir reservas simultâneas para o mesmo horário.

---

# 67. Optimistic Locking

Sempre que possível utilizar mecanismos de concorrência otimista.

---

# 68. Conflict Detection

Antes da confirmação validar:

```text
Professional

Room

Equipment

Time

Organization Rules
```

---

# 69. Appointment Types

Exemplos:

```text
Consultation

Return

Exam

Procedure

Telemedicine
```

---

# 70. Duration Rules

Cada tipo de atendimento poderá possuir duração padrão.

---

# 71. Buffer Time

O sistema poderá reservar tempo adicional antes ou após um atendimento.

---

# 72. Buffer Types

Exemplos:

```text
Before Appointment

After Appointment

Cleaning

Preparation
```

---

# 73. Room Reservation

Consultórios poderão ser reservados juntamente com o agendamento.

---

# 74. Room Entity

```text
Room

├── id
├── clinicId
├── name
├── capacity
├── status
└── metadata
```

---

# 75. Equipment Reservation

Equipamentos poderão ser vinculados ao horário reservado.

---

# 76. Resource Booking

Fluxo:

```text
Appointment

↓

Professional

+

Room

+

Equipment
```

---

# 77. Telemedicine

O módulo deverá suportar consultas remotas.

---

# 78. Telemedicine Entity

```text
TelemedicineSession

├── id
├── appointmentId
├── provider
├── meetingUrl
├── status
└── metadata
```

---

# 79. Meeting Providers

Exemplos:

```text
Zoom

Google Meet

Microsoft Teams

Internal Platform
```

---

# 80. Waiting Room

Consultas remotas poderão possuir sala de espera virtual.

---

# 81. Check-in

O paciente poderá realizar check-in antes do atendimento.

---

# 82. Check-in Methods

Exemplos:

```text
Reception

QR Code

Mobile App

Patient Portal
```

---

# 83. Early Check-in

A organização poderá configurar antecedência máxima para check-in.

---

# 84. Queue Management

Após o check-in o paciente poderá entrar na fila de atendimento.

---

# 85. Queue Entity

```text
AppointmentQueue

├── id
├── appointmentId
├── position
├── estimatedTime
└── metadata
```

---

# 86. Queue Priority

Exemplos:

```text
Normal

Priority

Emergency
```

---

# 87. Waiting List

Caso exista cancelamento, pacientes poderão ser promovidos automaticamente.

---

# 88. Waiting List Promotion

Fluxo:

```text
Cancellation

↓

Waiting List

↓

Offer

↓

Confirmation

↓

Appointment
```

---

# 89. Confirmation Window

A oferta poderá expirar após tempo configurável.

---

# 90. Recurrence

Consultas poderão ser recorrentes.

---

# 91. Recurrence Entity

```text
RecurringAppointment

├── id
├── recurrenceRule
├── occurrences
├── endsAt
└── metadata
```

---

# 92. Recurrence Exceptions

Ocorrências individuais poderão ser alteradas sem modificar toda a série.

---

# 93. Series

Cada recorrência representará uma série de agendamentos relacionados.

---

# 94. Cancellation Scope

Exemplos:

```text
Only This Appointment

This And Future

Entire Series
```

---

# 95. Domain Events

Eventos adicionais:

```text
appointment.locked

appointment.unlocked

appointment.checkin

appointment.waiting

appointment.started

appointment.queue.updated
```

---

# 96. Observability

Métricas adicionais:

```text
Appointments Per Day

No Show Rate

Cancellation Rate

Average Waiting Time

Check-in Rate
```

---

# 97. Domain Invariants

```text
Every Appointment belongs to one Calendar.

Only one confirmed booking exists per time slot by default.

Room reservations respect availability.

Recurring appointments preserve relationships.

Waiting lists never bypass booking rules.

Time slots are generated from availability rules.
```

---

# 98. Decisões Arquiteturais e de Produto

## ADR-1091

Calendários suportarão múltiplos contextos operacionais.

---

## ADR-1092

Disponibilidade será derivada das regras da agenda.

---

## ADR-1093

Conflitos serão detectados antes da confirmação.

---

## ADR-1094

Telemedicina será tratada como contexto do Appointment.

---

## ADR-1095

Check-in permanecerá separado do Encounter.

---

## ADR-1096

Recorrências serão modeladas como séries independentes.

---

## ADR-1097

Waiting Lists poderão promover pacientes automaticamente.

---

## ADR-1098

Locks temporários impedirão reservas simultâneas.

---

## ADR-1099

Recursos físicos poderão ser reservados junto ao agendamento.

---

## ADR-1100

Scheduling permanecerá exclusivamente responsável pelo gerenciamento de agendas.

---

# 99. Continuação

Na Parte 3 serão abordados:

- Segurança
- LGPD
- Multi-tenant
- Multi-clinic
- Auditoria avançada
- APIs públicas
- Integrações
- Escalabilidade
- ADR-1101 em diante
---

# 100. Segurança

O módulo Scheduling manipula informações relacionadas à agenda dos profissionais e dos pacientes.

Esses dados deverão ser protegidos durante todo o seu ciclo de vida.

---

# 101. Princípios

Toda implementação deverá seguir:

```text
Confidencialidade

Integridade

Disponibilidade

Rastreabilidade

Menor Privilégio

Need to Know
```

---

# 102. Dados Sensíveis

Exemplos:

```text
Nome do paciente

Horário do atendimento

Profissional

Clínica

Tipo de atendimento

Sala
```

---

# 103. LGPD

O módulo deverá respeitar integralmente a Lei Geral de Proteção de Dados (LGPD).

A agenda somente poderá ser acessada por usuários autorizados.

---

# 104. Controle de Acesso

Toda operação deverá validar:

```text
Organization

↓

Role

↓

Permission

↓

Clinic Scope
```

---

# 105. Least Privilege

Cada usuário visualizará apenas as agendas necessárias para executar suas atividades.

---

# 106. Multi-Tenant

Toda agenda pertence exatamente a uma Organization.

---

# 107. Tenant Isolation

Nenhum usuário poderá visualizar ou modificar agendas de outra organização.

---

# 108. Multi-Clinic

Uma organização poderá possuir diversas clínicas.

Cada Appointment deverá estar associado ao contexto correto.

---

# 109. Clinic Scope

Fluxo:

```text
Organization

↓

Clinic

↓

Schedule

↓

Appointment
```

---

# 110. Compartilhamento

Profissionais poderão compartilhar agendas quando permitido pela organização.

---

# 111. Delegação

Um profissional poderá autorizar outro usuário a gerenciar sua agenda.

---

# 112. Delegate Entity

```text
ScheduleDelegate

├── id
├── scheduleId
├── delegatedTo
├── permissions
├── validUntil
└── metadata
```

---

# 113. Permissões Delegadas

Exemplos:

```text
View Only

Create

Edit

Cancel

Full Access
```

---

# 114. Auditoria

Toda alteração relevante deverá produzir auditoria.

---

# 115. Audit Trail

Registrar:

```text
Actor

Timestamp

Action

Appointment

Before

After

Reason
```

---

# 116. Audit Actions

Exemplos:

```text
Appointment Created

Cancelled

Rescheduled

Confirmed

Check-in

Completed

No Show
```

---

# 117. Read Audit

Quando exigido pela organização, visualizações também poderão ser auditadas.

---

# 118. Exportação

Exportações de agendas deverão respeitar permissões administrativas.

---

# 119. APIs Públicas

Contratos deverão permanecer estáveis.

---

# 120. API Versioning

Mudanças incompatíveis deverão gerar novas versões.

---

# 121. External Integrations

Scheduling poderá integrar:

```text
Google Calendar

Microsoft Outlook

Apple Calendar

FHIR Scheduling

Telemedicine Providers
```

---

# 122. Calendar Sync

Sincronizações deverão ser explícitas.

Nunca implícitas.

---

# 123. Source of Truth

Mesmo sincronizando com sistemas externos:

```text
Scheduling

↓

Source of Truth
```

---

# 124. Conflict Resolution

Conflitos entre agendas deverão exigir resolução explícita.

Nunca sobrescrever automaticamente um compromisso confirmado.

---

# 125. Provenance

Toda sincronização deverá registrar:

```text
Source

ImportedAt

ImportedBy

SynchronizationId
```

---

# 126. Event Bus

Fluxo:

```text
Scheduling

↓

Domain Event

↓

Event Bus

↓

Subscribers
```

---

# 127. Published Events

Exemplos:

```text
appointment.created

appointment.updated

appointment.cancelled

appointment.rescheduled

appointment.completed

appointment.no_show
```

---

# 128. Event Consumers

Exemplos:

```text
Medical Records

Notifications

Billing

Analytics

AI
```

---

# 129. Idempotência

Consumidores deverão suportar processamento duplicado dos eventos.

---

# 130. Retry

Eventos poderão ser reenviados automaticamente quando necessário.

---

# 131. Dead Letter Queue

Eventos não processados deverão ser enviados para análise após número máximo de tentativas.

---

# 132. Performance

Consultas deverão responder rapidamente mesmo em agendas extensas.

---

# 133. Search

Permitir pesquisa por:

```text
Paciente

Profissional

Data

Clínica

Status

Tipo
```

---

# 134. Search Projection

Pesquisas poderão utilizar índices especializados.

---

# 135. Pagination

Grandes consultas deverão utilizar paginação consistente.

---

# 136. Sorting

Ordenações comuns:

```text
Start Time

Professional

Patient

CreatedAt

Status
```

---

# 137. Escalabilidade

O módulo deverá suportar milhões de agendamentos ao longo dos anos.

---

# 138. Horizontal Scaling

Consultas e workers poderão escalar horizontalmente.

---

# 139. Cache

Cache poderá acelerar leitura de agendas frequentemente acessadas.

---

# 140. Cache Invalidation

Qualquer alteração em Appointment deverá invalidar projeções afetadas.

---

# 141. Observabilidade

O módulo deverá produzir:

```text
Logs

Metrics

Distributed Traces
```

---

# 142. Logs

Logs nunca deverão expor informações sensíveis desnecessárias dos pacientes.

---

# 143. Métricas

Exemplos:

```text
Appointments Created

Appointments Completed

Average Waiting Time

Cancellation Rate

No Show Rate

Check-in Rate
```

---

# 144. Dashboards

Administradores poderão acompanhar indicadores operacionais da agenda.

---

# 145. Alertas

Exemplos:

```text
Agenda sobrecarregada

Grande número de cancelamentos

Alta taxa de No Show

Falhas de sincronização

Conflitos recorrentes
```

---

# 146. Disaster Recovery

O módulo deverá possuir plano de recuperação para falhas críticas.

---

# 147. Backup

Backups deverão preservar:

```text
Appointments

Schedules

Availability

Blocks

Audit

Recurrences
```

---

# 148. Restore

Processos de restauração deverão ser testados periodicamente.

---

# 149. Resiliência

Falhas em integrações externas nunca deverão impedir agendamentos locais.

---

# 150. Domain Invariants

```text
Every Appointment belongs to one Organization.

Every Appointment belongs to one Professional.

Scheduling is the Source of Truth.

Appointments preserve history.

Tenant Isolation is mandatory.

External integrations never bypass the domain.

Availability controls booking consistency.
```

---

# 151. Decisões Arquiteturais e de Produto

## ADR-1101

Scheduling adotará isolamento completo entre organizações.

---

## ADR-1102

Sincronizações externas nunca substituirão registros locais silenciosamente.

---

## ADR-1103

Toda alteração relevante produzirá auditoria.

---

## ADR-1104

Integrações utilizarão eventos versionados.

---

## ADR-1105

Scheduling permanecerá o Source of Truth das agendas.

---

## ADR-1106

Conflitos de sincronização exigirão resolução explícita.

---

## ADR-1107

Exportações serão auditáveis.

---

## ADR-1108

Agendas poderão ser delegadas mediante permissões específicas.

---

## ADR-1109

Calendários externos serão tratados como integrações, nunca como domínio.

---

## ADR-1110

Scheduling permanecerá responsável exclusivamente pela gestão do tempo e disponibilidade.

---

# 152. Continuação

Na Parte 4 serão abordados:

- CQRS
- Read Models
- Arquitetura avançada
- Recursos (salas e equipamentos)
- KPIs
- Checklists
- Testabilidade
- ADR-1111 até ADR-1120
---

# 153. Arquitetura do Domínio

O módulo Scheduling deverá permanecer responsável exclusivamente pelo gerenciamento de tempo, disponibilidade e reservas.

Nenhuma informação clínica deverá ser armazenada neste domínio.

---

# 154. Aggregate Root

A entidade **Appointment** será o Aggregate Root.

Todas as alterações relevantes deverão ocorrer através dela ou de serviços de domínio apropriados.

---

# 155. Aggregate Boundary

O Aggregate deverá garantir consistência entre:

```text
Appointment

Availability

Schedule

Calendar

ScheduleBlock

WaitingList
```

---

# 156. Entidades Externas

O Aggregate não controla diretamente:

```text
Patient

Professional

Medical Record

Encounter

Billing

Notifications
```

Esses domínios serão apenas referenciados.

---

# 157. CQRS

A arquitetura deverá permitir adoção futura de CQRS.

---

# 158. Command Side

Operações de escrita:

```text
Create Appointment

Confirm Appointment

Cancel Appointment

Reschedule Appointment

Check-in

Complete Appointment
```

---

# 159. Query Side

Consultas poderão utilizar projeções independentes.

---

# 160. Read Models

Exemplos:

```text
Reception Calendar

Professional Agenda

Patient Schedule

Daily Dashboard

Clinic Occupancy
```

---

# 161. Daily Agenda Projection

Uma projeção poderá conter:

```text
Professional

Appointments

Available Slots

Blocked Slots

Waiting List
```

---

# 162. Patient Schedule Projection

Outra projeção poderá listar:

```text
Upcoming Appointments

Past Appointments

Cancelled

No Shows
```

---

# 163. Occupancy Projection

Indicadores poderão demonstrar:

```text
Available Hours

Reserved Hours

Blocked Hours

Occupancy Rate
```

---

# 164. Event Sourcing (Future)

O domínio deverá permanecer compatível com futura adoção de Event Sourcing.

---

# 165. Cache

Cache poderá acelerar consultas frequentes.

Jamais substituirá o Source of Truth.

---

# 166. Cache Invalidation

Alterações em Appointments deverão invalidar automaticamente as projeções afetadas.

---

# 167. Search Optimization

Pesquisas deverão permanecer eficientes mesmo com milhões de registros.

---

# 168. Resource Management

A agenda poderá reservar recursos físicos.

---

# 169. Resource Entity

```text
Resource

├── id
├── organizationId
├── type
├── name
├── status
└── metadata
```

---

# 170. Resource Types

Exemplos:

```text
Room

Equipment

Operating Room

MRI

Ultrasound

Wheelchair
```

---

# 171. Resource Availability

Cada recurso poderá possuir sua própria disponibilidade.

---

# 172. Shared Resources

Recursos poderão ser compartilhados entre profissionais.

---

# 173. Resource Conflicts

Antes da confirmação deverão ser verificados conflitos de recursos.

---

# 174. Booking Policy

A política de reserva poderá considerar:

```text
Professional

Room

Equipment

Duration

Priority
```

---

# 175. KPIs

Indicadores possíveis:

```text
Appointments per Day

Occupancy Rate

Average Waiting Time

Cancellation Rate

No Show Rate
```

---

# 176. Operational KPIs

Exemplos:

```text
Average Check-in Time

Average Delay

Average Appointment Duration

Resource Utilization

Calendar Utilization
```

---

# 177. Business KPIs

Exemplos:

```text
Revenue Appointments

Telemedicine Usage

Peak Hours

Professional Productivity
```

---

# 178. Health Checks

O módulo deverá expor indicadores de saúde.

---

# 179. Dependency Monitoring

Monitorar:

```text
Database

Calendar Sync

Telemedicine Provider

Notification Queue

Event Bus
```

---

# 180. Failure Scenarios

Exemplos:

```text
Double Booking Attempt

Calendar Conflict

Synchronization Failure

Resource Unavailable

Meeting Creation Failed

Queue Failure
```

---

# 181. Recovery

Falhas deverão permitir recuperação sem perda do histórico do agendamento.

---

# 182. Consistência

Mesmo após falhas deverão permanecer preservados:

```text
Appointment

Audit

Availability

Resource Reservation

History
```

---

# 183. Checklists

## Criar Agendamento

```text
[ ] Paciente válido

[ ] Profissional disponível

[ ] Horário disponível

[ ] Recursos disponíveis

[ ] Auditoria criada
```

---

## Confirmar Agendamento

```text
[ ] Horário reservado

[ ] Status atualizado

[ ] Evento publicado

[ ] Auditoria registrada
```

---

## Cancelar Agendamento

```text
[ ] Justificativa registrada

[ ] Horário liberado

[ ] Waiting List atualizada

[ ] Auditoria criada
```

---

## Reagendar

```text
[ ] Novo horário disponível

[ ] Histórico preservado

[ ] Relação entre agendamentos registrada

[ ] Evento publicado
```

---

## Check-in

```text
[ ] Paciente identificado

[ ] Horário válido

[ ] Status atualizado

[ ] Fila atualizada
```

---

# 184. Checklist de Code Review

```text
[ ] Sem conflitos de horário

[ ] Aggregate preservado

[ ] Eventos publicados

[ ] Auditoria implementada

[ ] Testes atualizados

[ ] APIs documentadas

[ ] Tenant Isolation preservado

[ ] Recursos validados
```

---

# 185. Testabilidade

O domínio deverá possuir alta cobertura de testes automatizados.

---

# 186. Testes Unitários

Cobrir:

```text
Appointment

Availability

Calendar

Blocks

Waiting List

Resource Booking
```

---

# 187. Testes de Integração

Validar:

```text
Persistence

API

Calendar Sync

Telemedicine

Audit

Event Bus
```

---

# 188. Testes de Concorrência

Validar reservas simultâneas para o mesmo horário e recursos.

---

# 189. Testes de Segurança

Verificar:

```text
Permissions

Tenant Isolation

Delegation

Audit

Calendar Access
```

---

# 190. Testes de Performance

Avaliar:

```text
Agenda diária

Pesquisa

Sincronização

Grande volume de horários

Recorrências
```

---

# 191. Anti-Patterns

Evitar:

```text
Misturar agenda com prontuário.

Permitir Double Booking sem política explícita.

Modificar histórico de agendamentos.

Acoplar o domínio ao Google Calendar.

Persistir disponibilidade manualmente quando pode ser derivada.

Ignorar conflitos de recursos.
```

---

# 192. Future Evolution

Possíveis evoluções:

```text
AI Scheduling

Automatic Optimization

Smart Waiting List

Predictive No Show

Resource Optimization

Multi Timezone Scheduling
```

---

# 193. Domain Invariants

```text
Appointments preserve history.

Availability generates Time Slots.

Resources cannot be double-booked.

Schedules remain the Source of Truth.

Read Models never modify domain state.

Bookings respect organization policies.

Every Appointment belongs to exactly one Schedule.
```

---

# 194. Decisões Arquiteturais e de Produto

## ADR-1111

Appointment continuará sendo o Aggregate Root.

---

## ADR-1112

Disponibilidade será derivada das regras da agenda.

---

## ADR-1113

Recursos físicos possuirão gerenciamento independente.

---

## ADR-1114

CQRS poderá ser adotado futuramente.

---

## ADR-1115

Read Models especializados serão permitidos.

---

## ADR-1116

Toda alteração relevante produzirá eventos.

---

## ADR-1117

Double Booking será bloqueado por padrão.

---

## ADR-1118

Integrações externas permanecerão desacopladas.

---

## ADR-1119

Recursos compartilharão regras consistentes de disponibilidade.

---

## ADR-1120

Scheduling continuará exclusivamente responsável pelo gerenciamento temporal da plataforma.

---

# 195. Continuação

Na Parte 5 serão abordados:

- Observabilidade avançada
- Arquitetura Hexagonal
- Ports & Adapters
- Disaster Recovery
- Backup
- Resiliência
- APIs avançadas
- ADR-1121 até ADR-1130
---

# 196. Observabilidade

O módulo Scheduling deverá fornecer informações suficientes para monitoramento operacional da agenda sem comprometer dados sensíveis.

---

# 197. Logs

Os logs deverão registrar apenas informações técnicas necessárias.

Nunca registrar:

```text
Dados clínicos

Notas médicas

Conteúdo de prontuário

Informações desnecessárias do paciente
```

---

# 198. Structured Logging

Sempre que possível utilizar logs estruturados.

Exemplo:

```text
Timestamp

Level

OrganizationId

AppointmentId

ProfessionalId

PatientId

CorrelationId

Event
```

---

# 199. Correlation ID

Toda operação distribuída deverá possuir um Correlation ID único.

Isso permitirá rastreamento completo entre Scheduling e os demais módulos.

---

# 200. Distributed Tracing

Fluxos distribuídos deverão ser rastreados ponta a ponta.

Exemplo:

```text
Scheduling

↓

Notifications

↓

Medical Records

↓

Analytics
```

---

# 201. Métricas

Exemplos:

```text
Appointments Created

Appointments Completed

Appointments Cancelled

Appointments Rescheduled

Check-ins

No Shows
```

---

# 202. Dashboards

Administradores poderão visualizar:

```text
Agenda diária

Taxa de ocupação

Cancelamentos

No Shows

Teleconsultas

Fila de espera
```

---

# 203. Alertas

Exemplos:

```text
Agenda acima da capacidade

Grande volume de cancelamentos

Fila excessiva

Sincronização interrompida

Recursos indisponíveis
```

---

# 204. Health Checks

O módulo deverá expor indicadores de saúde.

---

# 205. Dependency Monitoring

Monitorar:

```text
Database

Event Bus

Calendar Providers

Notification Service

Telemedicine Provider
```

---

# 206. Resiliência

Falhas externas não deverão impedir o gerenciamento local da agenda.

---

# 207. Retry

Integrações externas poderão utilizar política controlada de Retry.

---

# 208. Circuit Breaker

Falhas recorrentes em provedores externos poderão ativar Circuit Breaker.

---

# 209. Timeout

Toda integração externa deverá possuir timeout configurável.

---

# 210. Fallback

Sempre que possível deverá existir estratégia de degradação controlada.

---

# 211. Disaster Recovery

O módulo deverá possuir plano de recuperação para falhas críticas.

---

# 212. Backup

Backups deverão preservar:

```text
Appointments

Schedules

Calendars

Availability

Blocks

Waiting Lists

Audit
```

---

# 213. Restore

Processos de restauração deverão ser testados periodicamente.

---

# 214. Data Integrity

Após restauração deverão permanecer preservados:

```text
Appointment History

Relationships

Audit Trail

Recurrences
```

---

# 215. Long-Term Storage

Histórico de agendamentos poderá ser mantido por longos períodos conforme políticas organizacionais e legislação aplicável.

---

# 216. Retention Policy

A política de retenção deverá ser configurável.

---

# 217. Arquivamento

Arquivamento nunca representa exclusão.

---

# 218. Exclusão

Exclusão física somente deverá ocorrer quando permitida por políticas específicas.

---

# 219. Arquitetura Hexagonal

O domínio deverá seguir os princípios de Ports & Adapters.

---

# 220. Ports

O domínio dependerá apenas de interfaces.

Nunca de implementações concretas.

---

# 221. Adapters

Integrações externas deverão ser implementadas através de adaptadores.

---

# 222. External Providers

Exemplos:

```text
Google Calendar

Microsoft Outlook

Zoom

Google Meet

Teams
```

---

# 223. Dependency Rule

O domínio nunca dependerá diretamente da infraestrutura.

---

# 224. Repository

Exemplo conceitual:

```text
AppointmentRepository

↓

Find

Save

Search

Update
```

---

# 225. Domain Services

Regras compartilhadas poderão ser encapsuladas em Domain Services.

---

# 226. Application Services

Casos de uso deverão ser coordenados por Application Services.

---

# 227. Value Objects

Exemplos:

```text
TimeRange

AppointmentDuration

Timezone

Slot

BusinessHours
```

---

# 228. Imutabilidade

Value Objects deverão ser imutáveis.

---

# 229. Factory

Factories poderão simplificar criação de agendas complexas.

---

# 230. Specification Pattern

Consultas complexas poderão utilizar Specifications.

---

# 231. APIs Internas

APIs internas deverão permanecer estáveis.

---

# 232. APIs Públicas

Integrações públicas deverão possuir versionamento.

---

# 233. Compatibilidade

Sempre preservar backward compatibility quando possível.

---

# 234. Versionamento

Mudanças incompatíveis deverão gerar nova versão.

---

# 235. Domain Invariants

```text
Repositories abstract persistence.

Ports isolate infrastructure.

Adapters integrate external systems.

Value Objects are immutable.

Audit is preserved.

Scheduling remains technology independent.

Availability remains deterministic.
```

---

# 236. Decisões Arquiteturais e de Produto

## ADR-1121

Observabilidade será requisito obrigatório.

---

## ADR-1122

Scheduling seguirá Arquitetura Hexagonal.

---

## ADR-1123

Integrações utilizarão Ports & Adapters.

---

## ADR-1124

Value Objects permanecerão imutáveis.

---

## ADR-1125

Factories poderão encapsular criação de agendas.

---

## ADR-1126

Repositories abstrairão persistência.

---

## ADR-1127

Application Services coordenarão casos de uso.

---

## ADR-1128

Domain Services centralizarão regras compartilhadas.

---

## ADR-1129

Toda integração permanecerá desacoplada do domínio.

---

## ADR-1130

Scheduling permanecerá independente da tecnologia utilizada para persistência.

---

# 237. Continuação

Na Parte 6 serão abordados:

- Arquitetura orientada a eventos
- CQRS avançado
- Read Models
- KPIs
- Checklists
- Definition of Done
- Failure Scenarios
- ADR-1131 até ADR-1140
---

# 238. Arquitetura Orientada a Eventos

O módulo Scheduling deverá publicar eventos de domínio para informar mudanças relevantes no ciclo de vida dos agendamentos.

Esses eventos representam alterações administrativas, nunca informações clínicas.

---

# 239. Event Bus

Fluxo conceitual:

```text
Scheduling

↓

Domain Event

↓

Event Bus

↓

Subscribers
```

---

# 240. Eventos Publicados

Exemplos:

```text
appointment.created

appointment.confirmed

appointment.checked_in

appointment.completed

appointment.cancelled

appointment.rescheduled

appointment.no_show

appointment.waiting_list.promoted
```

---

# 241. Consumidores

Exemplos:

```text
Medical Records

Notifications

Billing

Analytics

AI

Reporting
```

---

# 242. Responsabilidade

Scheduling informa:

```text
Um evento relacionado à agenda ocorreu.
```

Os módulos consumidores decidem como reagir.

---

# 243. Event Versioning

Todo evento deverá possuir:

```text
Event Name

Version

OccurredAt

OrganizationId

AppointmentId
```

---

# 244. Event Payload

Os eventos deverão conter apenas os dados necessários.

Sempre que possível utilizar apenas referências como:

```text
AppointmentId

PatientId

ProfessionalId
```

---

# 245. Idempotência

Consumidores deverão suportar processamento duplicado.

---

# 246. Retry

Eventos poderão ser reenviados automaticamente quando necessário.

---

# 247. Dead Letter Queue

Eventos que excederem o número máximo de tentativas deverão ser enviados para análise.

---

# 248. CQRS

O domínio deverá permanecer preparado para adoção futura de CQRS.

---

# 249. Command Side

Operações de escrita:

```text
Create Appointment

Confirm Appointment

Cancel Appointment

Reschedule Appointment

Check-in

Complete Appointment

Block Schedule
```

---

# 250. Query Side

Consultas poderão utilizar modelos especializados.

---

# 251. Read Models

Exemplos:

```text
Reception Dashboard

Professional Calendar

Patient Portal

Waiting List

Room Schedule
```

---

# 252. Occupancy Projection

Uma projeção poderá apresentar:

```text
Occupied Slots

Available Slots

Blocked Slots

Occupancy Percentage
```

---

# 253. Daily Schedule Projection

Outra projeção poderá conter:

```text
Morning

Afternoon

Evening

Appointments

Free Slots
```

---

# 254. Search Projection

Pesquisas poderão utilizar índices especializados.

---

# 255. Cache

Cache deverá acelerar operações de leitura.

Jamais substituir o Source of Truth.

---

# 256. Cache Invalidation

Mudanças em agendamentos deverão invalidar automaticamente as projeções afetadas.

---

# 257. KPIs

Indicadores sugeridos:

```text
Appointments per Day

Occupancy Rate

Average Waiting Time

No Show Rate

Cancellation Rate

Reschedule Rate
```

---

# 258. Operational Metrics

Exemplos:

```text
Check-in Duration

Queue Time

Calendar Latency

Synchronization Time

API Latency
```

---

# 259. Business Metrics

Exemplos:

```text
Professional Productivity

Clinic Utilization

Telemedicine Adoption

Peak Hours

Resource Usage
```

---

# 260. Health Checks

O módulo deverá disponibilizar endpoints de saúde.

---

# 261. Dependency Monitoring

Monitorar:

```text
Database

Event Bus

Calendar Providers

Telemedicine Providers

Notification Queue
```

---

# 262. Failure Scenarios

Exemplos:

```text
Double Booking Attempt

Calendar Sync Failure

Waiting List Failure

Resource Conflict

Meeting Creation Failure

Schedule Lock Failure
```

---

# 263. Recovery

Falhas deverão permitir recuperação sem perda do histórico do agendamento.

---

# 264. Consistência

Mesmo após falhas deverão permanecer preservados:

```text
Appointment

Availability

Audit

History

Waiting List
```

---

# 265. Checklists

## Criar Agendamento

```text
[ ] Paciente válido

[ ] Profissional disponível

[ ] Horário disponível

[ ] Recursos disponíveis

[ ] Auditoria criada

[ ] Evento publicado
```

---

## Confirmar Agendamento

```text
[ ] Horário reservado

[ ] Status atualizado

[ ] Auditoria registrada

[ ] Evento publicado
```

---

## Cancelar Agendamento

```text
[ ] Justificativa registrada

[ ] Horário liberado

[ ] Waiting List atualizada

[ ] Auditoria criada
```

---

## Reagendar

```text
[ ] Novo horário disponível

[ ] Histórico preservado

[ ] Relação criada

[ ] Evento publicado
```

---

## Check-in

```text
[ ] Paciente identificado

[ ] Horário válido

[ ] Status atualizado

[ ] Queue atualizada
```

---

# 266. Checklist de Code Review

```text
[ ] Sem Double Booking

[ ] Aggregate preservado

[ ] Eventos publicados

[ ] Auditoria implementada

[ ] APIs documentadas

[ ] Testes atualizados

[ ] Tenant Isolation preservado

[ ] Recursos validados
```

---

# 267. Definition of Done

Uma funcionalidade somente será considerada concluída quando atender:

```text
Consistência

+

Segurança

+

Auditabilidade

+

Observabilidade

+

Escalabilidade

+

Testes Automatizados

+

Documentação Atualizada
```

---

# 268. Testabilidade

O domínio deverá possuir cobertura automatizada para regras críticas.

---

# 269. Testes Unitários

Cobrir:

```text
Appointment

Availability

Calendar

ScheduleBlock

WaitingList

Resource Reservation
```

---

# 270. Testes de Integração

Validar:

```text
Persistence

API

Calendar Sync

Telemedicine

Audit

Event Bus
```

---

# 271. Testes de Concorrência

Validar reservas simultâneas para o mesmo horário e os mesmos recursos.

---

# 272. Testes de Segurança

Verificar:

```text
Permissions

Tenant Isolation

Delegation

Audit Trail

Calendar Access
```

---

# 273. Testes de Performance

Avaliar:

```text
Pesquisa

Agenda diária

Grande volume de Slots

Recorrências

Sincronizações
```

---

# 274. Domain Invariants

```text
Events preserve history.

Aggregate controls consistency.

Appointments preserve identity.

Read Models never modify domain state.

Commands preserve business rules.

Audit remains mandatory.

Scheduling remains the Source of Truth.
```

---

# 275. Decisões Arquiteturais e de Produto

## ADR-1131

Eventos serão publicados após alterações relevantes.

---

## ADR-1132

Payloads permanecerão mínimos e versionados.

---

## ADR-1133

CQRS poderá ser adotado sem remodelar o domínio.

---

## ADR-1134

Read Models especializados serão permitidos.

---

## ADR-1135

Medical Records consumirá apenas eventos administrativos do agendamento.

---

## ADR-1136

Toda alteração relevante permanecerá auditável.

---

## ADR-1137

Testes automatizados serão obrigatórios para regras críticas.

---

## ADR-1138

Observabilidade fará parte da arquitetura padrão.

---

## ADR-1139

Eventos deverão ser idempotentes.

---

## ADR-1140

Scheduling permanecerá desacoplado dos módulos consumidores.

---

# 276. Continuação

Na Parte 7 serão apresentados:

- Arquitetura consolidada
- Anti-Patterns completos
- Future Evolution
- Considerações finais
- Histórico de versões
- Encerramento oficial do módulo
- ADRs finais
---

# 277. Arquitetura Consolidada

O módulo Scheduling deverá permanecer responsável exclusivamente pelo gerenciamento da disponibilidade e dos agendamentos da plataforma.

Seu domínio deverá permanecer desacoplado de:

- Medical Records
- Finance
- Prescriptions
- Notifications
- Analytics
- AI

Esses módulos apenas consomem eventos produzidos pelo Scheduling.

---

# 278. Arquitetura Conceitual

```text
Patient

↓

Appointment

↓

Schedule

↓

Availability

↓

Resources

↓

Calendar

↓

Events

↓

Consumers
```

O fluxo deverá permanecer simples e previsível.

---

# 279. Responsabilidade

Scheduling deverá responder apenas:

```text
Quando ocorrerá o atendimento?

Quem atenderá?

Onde ocorrerá?

Existe disponibilidade?
```

Jamais:

```text
O paciente foi diagnosticado?

Qual medicamento foi prescrito?

O pagamento foi realizado?

O atendimento foi concluído clinicamente?
```

Essas responsabilidades pertencem a outros domínios.

---

# 280. Relação com Outros Módulos

```text
Patients
      │
      ▼
Scheduling
      │
 ┌────┼───────────────┐
 ▼    ▼               ▼
Medical Records   Notifications   Finance
```

O Scheduling fornece contexto temporal para os demais módulos.

---

# 281. Anti-Corruption Layer

Integrações externas nunca deverão conhecer a estrutura interna do Aggregate Appointment.

Toda comunicação deverá ocorrer através de:

- APIs públicas;
- eventos de domínio;
- contratos versionados;
- adaptadores.

---

# 282. Future Evolution

O domínio foi projetado para suportar futuras evoluções como:

```text
AI Scheduling

Predictive Scheduling

Automatic Waiting List

Smart Resource Allocation

Multi-Clinic Optimization

Cross-Timezone Scheduling

FHIR Scheduling

Calendar Federation
```

Sem necessidade de remodelar o domínio principal.

---

# 283. Evolução Funcional

Possíveis funcionalidades futuras:

- encaixes inteligentes;
- previsão de atrasos;
- sugestão automática de horários;
- redistribuição automática da agenda;
- previsão de No Show utilizando IA;
- otimização automática de recursos.

---

# 284. Anti-Patterns

Evitar:

```text
Misturar agenda com prontuário.

Permitir Double Booking sem regra explícita.

Modificar histórico de agendamentos.

Acoplar Scheduling ao Google Calendar.

Persistir disponibilidade manualmente.

Ignorar Timezone.

Criar regras clínicas dentro da agenda.

Permitir reservas sem validação de recursos.
```

---

# 285. Arquitetura de Longo Prazo

O domínio deverá permanecer válido mesmo após:

- migração para microsserviços;
- troca de banco de dados;
- mudança de linguagem;
- adoção de Event Sourcing;
- adoção completa de CQRS;
- integração com novos provedores de calendário.

A modelagem deverá sobreviver às mudanças tecnológicas.

---

# 286. Princípios Permanentes

Independentemente da evolução do MedFlow:

```text
Scheduling manages time.

Appointments preserve history.

Availability is deterministic.

Resources respect availability.

Audit is mandatory.

Clinical data belongs to Medical Records.

External integrations never control the domain.
```

Esses princípios deverão permanecer inalterados.

---

# 287. ADRs Finais

## ADR-1141

Appointment continuará sendo o Aggregate Root exclusivo do domínio.

---

## ADR-1142

Availability continuará sendo derivada das regras da agenda.

---

## ADR-1143

Double Booking permanecerá bloqueado por padrão.

---

## ADR-1144

Recursos físicos utilizarão gerenciamento independente.

---

## ADR-1145

Scheduling será preparado para integração completa com FHIR Scheduling.

---

## ADR-1146

Toda alteração relevante produzirá auditoria obrigatória.

---

## ADR-1147

Eventos permanecerão versionados e idempotentes.

---

## ADR-1148

Read Models permanecerão desacoplados do Aggregate.

---

## ADR-1149

Integrações externas nunca alterarão diretamente o domínio.

---

## ADR-1150

Scheduling será a única fonte oficial de disponibilidade e agendamentos da plataforma MedFlow.

---

# 288. Checklist Arquitetural

| Item | Status |
|------|--------|
| Aggregate Root definido | ✓ |
| Schedules modelados | ✓ |
| Calendários | ✓ |
| Disponibilidade | ✓ |
| Time Slots | ✓ |
| Recorrências | ✓ |
| Check-in | ✓ |
| Waiting List | ✓ |
| Recursos físicos | ✓ |
| Telemedicina | ✓ |
| Auditoria | ✓ |
| LGPD | ✓ |
| Multi-tenant | ✓ |
| Multi-clinic | ✓ |
| Eventos de domínio | ✓ |
| CQRS preparado | ✓ |
| Read Models | ✓ |
| Arquitetura Hexagonal | ✓ |
| Observabilidade | ✓ |
| KPIs | ✓ |
| ADRs documentadas | ✓ |

---

# 289. Definition of Success

O módulo Scheduling será considerado bem projetado quando:

- impedir conflitos de agenda;
- preservar histórico completo;
- suportar milhões de agendamentos;
- integrar-se facilmente com calendários externos;
- permanecer desacoplado dos domínios clínicos;
- otimizar a utilização de profissionais e recursos;
- atender requisitos regulatórios;
- evoluir sem quebrar consumidores.

---

# 290. Considerações Finais

O módulo Scheduling representa o coração operacional da plataforma MedFlow.

Seu papel é garantir que pacientes, profissionais, salas e recursos estejam sincronizados de forma consistente, auditável e escalável.

Todas as decisões arquiteturais apresentadas neste documento têm como objetivo preservar:

```text
Consistência

Disponibilidade

Escalabilidade

Auditabilidade

Interoperabilidade

Simplicidade

Sustentabilidade
```

Esses princípios deverão orientar toda evolução futura do módulo.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação da documentação oficial do módulo Scheduling, incluindo agendas, disponibilidade, calendários, recursos, recorrências, check-in, telemedicina, auditoria, CQRS, observabilidade e ADR-1091 a ADR-1150 | Equipe MedFlow |