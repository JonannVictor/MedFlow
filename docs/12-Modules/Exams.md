# Módulo de Exames

| Campo | Valor |
|-------|--------|
| Documento | Exams |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Modules |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# 1. Visão Geral

O módulo **Exams** é responsável pelo ciclo operacional dos exames relacionados aos pacientes dentro do MedFlow.

Um Exam não deverá ser tratado simplesmente como:

```text
Exam Name

+

Result File
```

O domínio poderá envolver:

```text
Exam Request

Patient

Professional

Clinic

Exam Type

Scheduling

Collection

Execution

Result

Attachments

Review

Clinical Context

Notifications

Audit
```

O objetivo do módulo é permitir que o MedFlow represente exames de maneira estruturada, segura, rastreável e preparada para integrações futuras.

---

# 2. Princípio Fundamental

```text
Exam

≠

File
```

Um arquivo PDF, imagem ou documento pode representar parte do resultado de um exame.

O exame em si representa um objeto de domínio com:

```text
Identity

Patient

Type

Lifecycle

Clinical Context

Result

History
```

---

# 3. Objetivo

O módulo deverá permitir responder com segurança:

```text
Which patient does this exam belong to?

What exam was requested?

Who requested it?

When was it requested?

Where was it performed?

What is its current status?

Was a result received?

Who reviewed the result?

What files are associated with it?

Has the result changed?

Who accessed or modified it?
```

---

# 4. Source of Truth

O módulo `Exams` deverá ser a fonte de verdade para o lifecycle operacional do exame dentro do MedFlow.

Entretanto:

```text
Exam

≠

Medical Record
```

e:

```text
Exam

≠

External Laboratory System
```

O MedFlow poderá armazenar ou referenciar resultados recebidos de sistemas externos, preservando sua própria identidade e rastreabilidade.

---

# 5. Escopo

O módulo poderá ser responsável por:

- Cadastro de Exam Types.
- Solicitação de exames.
- Associação com Patient.
- Associação com Professional solicitante.
- Associação com Clinic.
- Status operacional.
- Datas relevantes.
- Recebimento de resultados.
- Estruturação de resultados quando suportado.
- Arquivos associados.
- Histórico.
- Revisão por Professional.
- Integrações laboratoriais.
- Eventos de domínio.
- Auditoria das operações relevantes.

---

# 6. Fora do Escopo

Exams não deverá ser responsável diretamente por:

- Cadastro completo do Patient.
- Cadastro completo do Professional.
- Appointment Scheduling geral.
- Medical Record completo.
- Prescription Lifecycle.
- File Storage Infrastructure.
- Payment Processing.
- Notification Delivery.
- Authentication.
- AI Model Execution.

---

# 7. Bounded Context

```text
Patients
   │
   ▼
 Exams
   │
   ├────────► Professionals
   ├────────► Clinics
   ├────────► Medical Records
   ├────────► Appointments
   ├────────► Files
   ├────────► Notifications
   ├────────► Finance / Payments
   └────────► AI
```

Exams deverá conhecer somente as informações necessárias desses módulos.

---

# 8. Entidades Principais

O domínio poderá evoluir para entidades como:

```text
Exam

ExamType

ExamResult

ExamAttachment

ExamReview

ExamHistory

ExternalExamReference
```

A implementação deverá evitar criar entidades sem necessidade real.

---

# 9. Exam

Entidade conceitual principal:

```text
Exam

├── id
├── organizationId
├── patientId
├── clinicId
├── examTypeId
├── requestedByProfessionalId
├── status
├── priority
├── requestedAt
├── scheduledAt
├── performedAt
├── resultedAt
├── reviewedAt
├── source
├── externalReference
├── createdAt
├── updatedAt
└── version
```

A estrutura definitiva deverá acompanhar o ERD oficial.

---

# 10. Exam ID

Todo Exam deverá possuir identificador único e estável.

O ID não deverá depender de:

```text
Patient Name

Exam Name

Date

External Provider
```

---

# 11. Tenant Ownership

Todo Exam deverá possuir:

```text
organizationId
```

explicitamente.

Tenant Ownership não deverá ser inferido apenas através do Patient ou Clinic.

---

# 12. Patient Association

Todo Exam clínico deverá estar associado a um Patient válido.

---

# 13. Patient Identity

O módulo deverá referenciar:

```text
patientId
```

e não criar uma segunda identidade de Patient.

---

# 14. Historical Patient Data

Quando exigido por requisitos clínicos, legais ou de interoperabilidade, determinados dados poderão precisar de Snapshot.

Isso deverá ser definido explicitamente.

---

# 15. Clinic Context

Exam poderá possuir:

```text
clinicId
```

quando uma Clinic for responsável pela solicitação, execução ou gestão do exame.

---

# 16. Clinic Is Context

Clinic não é dona do lifecycle clínico completo do Exam.

Ela representa contexto operacional.

---

# 17. Professional

O Exam poderá possuir Professional solicitante.

```text
requestedByProfessionalId
```

---

# 18. Requester Identity

O Professional deverá existir no domínio Professionals.

Exams não deverá duplicar seu cadastro.

---

# 19. External Requester

Integrações futuras poderão exigir representação de solicitantes externos.

Essa situação deverá possuir modelagem explícita.

Não utilizar texto livre como substituto permanente de identidade quando integração estruturada for necessária.

---

# 20. Exam Type

`ExamType` representa o tipo de exame.

Exemplos conceituais:

```text
Complete Blood Count

Glucose

MRI

CT

Ultrasound

X-Ray

Urinalysis
```

Os exemplos não definem catálogo oficial.

---

# 21. Exam Type Entity

Possível estrutura:

```text
ExamType

├── id
├── organizationId
├── code
├── name
├── category
├── description
├── active
├── metadata
├── createdAt
└── updatedAt
```

---

# 22. Exam Type Identity

Nome não deverá ser utilizado como identidade técnica.

---

# 23. Exam Type Code

Codes poderão ser utilizados para:

```text
Internal Catalog

Integration Mapping

Standard Terminology
```

---

# 24. Standard Terminologies

No futuro, o MedFlow poderá mapear exames para terminologias padronizadas.

Exemplos incluem padrões de interoperabilidade clínica reconhecidos pelo mercado.

Esses mappings deverão permanecer separados do nome apresentado ao usuário.

---

# 25. Local Catalog

Organizations poderão possuir catálogo próprio quando necessário.

---

# 26. Global vs Tenant Catalog

Uma possível arquitetura futura:

```text
Platform Catalog

↓

Organization Mapping / Override
```

A necessidade deverá ser validada antes de introduzir complexidade.

---

# 27. Exam Categories

Categorias poderão incluir:

```text
laboratory

imaging

pathology

functional

other
```

Somente categorias úteis ao produto deverão existir.

---

# 28. Exam Request

Solicitar um Exam representa uma operação de domínio.

---

# 29. Request Flow

```text
Professional

↓

Select Patient

↓

Select Exam Type

↓

Provide Clinical Context

↓

Validate Permission

↓

Create Exam Request

↓

Emit Event

↓

Optional Scheduling / Notification
```

---

# 30. Exam Request Is Not Exam Result

```text
Request

≠

Result
```

Um Exam poderá existir antes que qualquer resultado esteja disponível.

---

# 31. Request Metadata

Poderá conter:

```text
Priority

Clinical Indication

Requested At

Requester

Clinic

Instructions
```

Dados clínicos deverão seguir regras apropriadas de proteção.

---

# 32. Priority

Possíveis valores conceituais:

```text
routine

urgent
```

Outras prioridades somente deverão existir se houver significado operacional definido.

---

# 33. Priority Is Not UI Color

Priority representa Business State.

A UI apenas apresenta esse estado.

---

# 34. Exam Lifecycle

Possível lifecycle:

```text
requested

scheduled

in_progress

completed

result_available

reviewed

cancelled
```

O conjunto final deverá refletir os workflows realmente suportados.

---

# 35. State Machine

```text
requested
    │
    ├──────────────► cancelled
    │
    ▼
 scheduled
    │
    ├──────────────► cancelled
    │
    ▼
in_progress
    │
    ▼
 completed
    │
    ▼
result_available
    │
    ▼
 reviewed
```

Nem todo Exam precisará passar por todos os estados.

---

# 36. Flexible Workflow

Laboratory e Imaging poderão possuir workflows diferentes.

O modelo não deverá forçar etapas sem significado.

---

# 37. Explicit Transitions

Preferir:

```text
scheduleExam()

startExam()

completeExam()

registerResult()

reviewResult()

cancelExam()
```

em vez de:

```text
exam.status = arbitraryValue
```

---

# 38. Transition Validation

Toda transição deverá verificar:

```text
Current State

Requested State

Actor

Permission

Tenant

Required Data

Business Rules
```

---

# 39. Requested

Representa exame solicitado.

---

# 40. Scheduled

Representa exame com execução programada quando Scheduling for aplicável.

---

# 41. In Progress

Representa execução iniciada quando esse estado fizer sentido.

---

# 42. Completed

Representa conclusão operacional da realização do exame.

Isso não significa necessariamente que o resultado já está disponível.

---

# 43. Result Available

Indica que resultado foi recebido ou registrado.

---

# 44. Reviewed

Indica que Professional autorizado registrou revisão do resultado quando o workflow exigir.

---

# 45. Cancelled

Indica cancelamento operacional.

Cancelamento não deverá remover histórico.

---

# 46. Cancellation

```text
Cancel Exam

≠

Delete Exam
```

---

# 47. Cancellation Metadata

Poderá incluir:

```text
cancelledAt

cancelledBy

cancellationReason
```

---

# 48. Invalid Transitions

Exemplo:

```text
reviewed

↓

requested
```

não deverá acontecer silenciosamente.

---

# 49. Result

`ExamResult` representa o resultado associado ao Exam.

---

# 50. Result Is Not Necessarily Text

Resultados podem possuir:

```text
Structured Values

Text

PDF

Image

External Reference

Combination
```

---

# 51. Structured Result

Exemplo conceitual:

```text
ExamResultItem

├── code
├── name
├── value
├── unit
├── referenceRange
├── interpretation
└── metadata
```

---

# 52. Do Not Store Everything as PDF

Armazenar todo resultado apenas como arquivo impede ou dificulta:

```text
Search

Trends

Clinical Decision Support

AI

Interoperability

Analytics
```

quando dados estruturados estiverem disponíveis.

---

# 53. Do Not Force Structure

Ao mesmo tempo:

```text
Not every exam result
can be represented
as simple key/value pairs.
```

O modelo deverá suportar resultados complexos.

---

# 54. Hybrid Result Model

Preferir arquitetura capaz de representar:

```text
Structured Data

+

Human-Readable Document

+

External Source Metadata
```

quando necessário.

---

# 55. Result Versioning

Resultados poderão ser corrigidos por laboratório ou Professional autorizado.

---

# 56. No Silent Overwrite

Resultado existente não deverá ser sobrescrito silenciosamente.

---

# 57. Result Revision

Possível modelo:

```text
ExamResult

↓

Revision 1

↓

Revision 2
```

ou mecanismo equivalente.

---

# 58. Amendment

Correção deverá preservar:

```text
Previous Value

New Value

Reason

Actor / Source

Timestamp
```

quando aplicável.

---

# 59. Current Result

Sistema poderá apontar qual revisão é atualmente válida sem apagar versões anteriores.

---

# 60. Result Status

Possíveis conceitos:

```text
preliminary

final

corrected
```

Somente utilizar se workflows reais exigirem.

---

# 61. Preliminary Result

Resultado preliminar não deverá ser apresentado como final sem indicação clara.

---

# 62. Corrected Result

Resultado corrigido deverá preservar histórico.

---

# 63. Attachments

Um Exam poderá possuir múltiplos Attachments.

---

# 64. Exam Attachment

Conceitualmente:

```text
ExamAttachment

├── id
├── organizationId
├── examId
├── fileId
├── type
├── title
├── source
├── uploadedBy
├── createdAt
└── metadata
```

---

# 65. File Ownership

Exams não deverá implementar Storage físico diretamente.

Deverá referenciar infraestrutura de Files/Storage.

---

# 66. Attachment Types

Possíveis:

```text
report

image

document

external_export

other
```

---

# 67. File Security

Arquivos de exames deverão ser tratados como dados altamente sensíveis.

---

# 68. File Access

Download deverá validar:

```text
Authentication

Tenant

Permission

Patient Scope

Exam Scope
```

---

# 69. No Public Files

Arquivos clínicos não deverão possuir URL pública permanente.

---

# 70. Signed Access

Quando Storage exigir acesso por URL, preferir mecanismo temporário e autorizado.

---

# 71. Expiration

Links temporários deverão possuir duração limitada.

---

# 72. File Metadata

Evitar incluir Patient Data sensível em nomes públicos de arquivos ou URLs.

---

# 73. File Validation

Uploads deverão validar:

```text
Allowed Type

Size

Integrity

Security Policy
```

---

# 74. Malware Protection

Infraestrutura de Files deverá considerar análise de arquivos quando apropriado.

---

# 75. Imaging

Imaging possui requisitos diferentes de exames laboratoriais.

---

# 76. Imaging Files

Imagens médicas poderão utilizar formatos e sistemas especializados.

O MedFlow não deverá assumir que:

```text
Medical Imaging = JPEG
```

---

# 77. DICOM

Integração futura com ecossistemas de imagem poderá exigir suporte ou integração com DICOM/PACS.

---

# 78. PACS Boundary

O MedFlow não deverá tentar se transformar em PACS sem decisão arquitetural explícita.

---

# 79. Imaging Reference

Uma estratégia poderá ser armazenar:

```text
Exam Metadata

+

Report

+

External Imaging Reference
```

em vez de copiar grandes volumes de imagens.

---

# 80. Laboratory Integration

Laboratórios externos poderão fornecer resultados através de:

```text
API

Webhook

File Exchange

Healthcare Interoperability Standards
```

---

# 81. External Provider

O módulo deverá conseguir identificar origem externa.

---

# 82. External Reference

Conceitualmente:

```text
ExternalExamReference

├── provider
├── externalExamId
├── externalPatientId
├── receivedAt
└── metadata
```

---

# 83. External ID Is Not Internal ID

```text
externalExamId

≠

exam.id
```

---

# 84. Provider Namespace

External IDs deverão ser interpretados dentro do Provider correspondente.

---

# 85. Integration Mapping

```text
Provider A / 123

≠

Provider B / 123
```

---

# 86. Webhooks

Integrações poderão enviar eventos duplicados.

---

# 87. Webhook Idempotency

Handlers deverão evitar criação duplicada de resultados.

---

# 88. Webhook Authentication

Eventos externos deverão possuir mecanismo de autenticação/verificação apropriado.

---

# 89. Webhook Replay

Quando Provider suportar assinatura temporal ou equivalente, proteção contra Replay deverá ser considerada.

---

# 90. Out-of-Order Events

Integrações poderão enviar:

```text
Final Result

before

Previous Status Event
```

Handlers deverão considerar ordering.

---

# 91. Integration Failure

Falha temporária não deverá apagar ou corromper Exam existente.

---

# 92. Retry

Retries deverão ser:

```text
Bounded

Observable

Idempotent
```

---

# 93. Dead-Letter Strategy

Eventos que falham repetidamente poderão exigir mecanismo de análise manual.

---

# 94. Integration Reconciliation

Deverá ser possível identificar:

```text
External exams not synchronized

Internal exams awaiting result

Conflicting external state
```

---

# 95. Appointments Integration

Alguns Exams poderão exigir Appointment.

---

# 96. Appointment Is Separate

```text
Exam

≠

Appointment
```

Exam representa a necessidade/execução clínica.

Appointment representa reserva de tempo.

---

# 97. Relationship

Possível:

```text
Exam

↓

Appointment
```

quando necessário.

---

# 98. Cancellation Independence

Cancelar Appointment não deverá necessariamente apagar ou cancelar Exam Request automaticamente.

Policy deverá determinar comportamento.

---

# 99. Medical Records Integration

Resultados de Exams poderão ser apresentados dentro do contexto do Medical Record.

---

# 100. Source of Truth Boundary

Medical Records não deverá criar cópia independente do Exam Result apenas para exibição.

Preferir referência ou Projection.

---

# 101. Clinical Timeline

Exam poderá aparecer na Timeline do Patient.

---

# 102. Timeline Event

Exemplos:

```text
Exam Requested

Exam Performed

Result Available

Result Reviewed
```

---

# 103. Review

Resultado poderá necessitar revisão por Professional.

---

# 104. Review Is Explicit

Abrir a tela não deverá automaticamente significar:

```text
reviewed
```

---

# 105. Exam Review

Possível entidade:

```text
ExamReview

├── id
├── examId
├── professionalId
├── reviewedAt
├── resultVersion
└── metadata
```

---

# 106. Review Version

Se resultado for corrigido após revisão, o sistema deverá conseguir determinar qual versão foi revisada.

---

# 107. Corrected After Review

Fluxo:

```text
Result v1

↓

Reviewed

↓

Provider sends corrected Result v2

↓

Exam requires new review indication
```

quando política exigir.

---

# 108. Review Does Not Mean Diagnosis

O estado `reviewed` significa apenas que workflow de revisão foi realizado conforme regra.

Não deverá inferir automaticamente diagnóstico ou conduta.

---

# 109. Notifications

Exams poderá emitir eventos que gerem Notifications.

---

# 110. Notification Examples

```text
Exam Scheduled

Exam Reminder

Result Available

Result Corrected
```

---

# 111. Notification Boundary

Exams decide:

```text
What happened.
```

Notifications decide:

```text
How to communicate it.
```

---

# 112. Sensitive Notifications

Mensagens deverão evitar expor detalhes clínicos desnecessários.

---

# 113. Lock Screen Privacy

Push Notifications deverão considerar que conteúdo pode aparecer em tela bloqueada.

---

# 114. Email Privacy

Email poderá não ser canal adequado para conteúdo clínico completo.

Preferir comunicação mínima com acesso autenticado quando apropriado.

---

# 115. AI Integration

AI poderá auxiliar em:

```text
Result Summarization

Trend Detection

Organization

Search

Clinical Documentation Assistance
```

sempre dentro dos limites definidos pela arquitetura de AI.

---

# 116. AI Is Not Source of Truth

```text
AI Interpretation

≠

Exam Result
```

---

# 117. Raw Result Preservation

Resultado original deverá permanecer disponível conforme política aplicável.

---

# 118. AI Output Separation

Saída de AI deverá ser distinguível de:

```text
Laboratory Result

Professional Note

Official Report
```

---

# 119. AI Provenance

Quando AI produzir Summary, sistema deverá conseguir identificar que conteúdo foi gerado por AI.

---

# 120. AI Version Context

Para análises relevantes, poderá ser necessário registrar qual versão do Exam Result foi utilizada.

---

# 121. AI Hallucination Boundary

AI não deverá inventar:

```text
Missing Values

Reference Ranges

Diagnoses

Exam Results
```

---

# 122. Human Review

Features clínicas de maior impacto deverão seguir as políticas de Human Oversight definidas na arquitetura de AI.

---

# 123. Trends

Dados estruturados poderão permitir visualização histórica.

Exemplo:

```text
Exam Value

Time
```

---

# 124. Trend Source

Trend deverá utilizar resultados estruturados válidos.

---

# 125. Unit Consistency

Comparações exigem cuidado com:

```text
Units

Methods

Reference Ranges

Laboratories
```

---

# 126. Unit Conversion

Conversões clínicas não deverão ser feitas implicitamente sem regras validadas.

---

# 127. Reference Range

Reference Range poderá depender de diversos fatores.

Não deverá ser hardcoded globalmente de maneira simplista.

---

# 128. Provider Reference Range

Quando Provider fornecer Reference Range, o valor original deverá ser preservado.

---

# 129. Interpretation Flags

Providers poderão fornecer indicadores estruturados.

Esses dados deverão ser armazenados sem substituir interpretação profissional.

---

# 130. Search

Usuários autorizados poderão buscar Exams por:

```text
Patient

Exam Type

Status

Date

Clinic

Professional
```

---

# 131. Search Scope

Toda Search deverá respeitar Tenant e Permission Scope.

---

# 132. Patient Search

Busca de Patient deverá utilizar o domínio Patients.

---

# 133. Pagination

Listagens grandes deverão possuir Pagination.

---

# 134. Sorting

Sorting padrão deverá ser determinístico.

Possível:

```text
requestedAt DESC
```

---

# 135. Filters

Possíveis:

```text
patientId

examTypeId

status

clinicId

requestedBy

dateRange

priority
```

---

# 136. Date Range

Queries deverão limitar intervalos excessivos quando necessário.

---

# 137. API Conceitual

Possíveis endpoints:

```text
GET    /exams

POST   /exams

GET    /exams/{id}

POST   /exams/{id}/schedule

POST   /exams/{id}/start

POST   /exams/{id}/complete

POST   /exams/{id}/results

POST   /exams/{id}/review

POST   /exams/{id}/cancel

GET    /exams/{id}/history

GET    /exam-types
```

Contratos são conceituais.

---

# 138. Create Exam

Exemplo conceitual:

```json
{
  "patientId": "pat_...",
  "examTypeId": "exam_type_...",
  "clinicId": "clinic_...",
  "priority": "routine"
}
```

---

# 139. No Arbitrary Actor

Cliente não deverá enviar:

```text
requestedByProfessionalId
```

e conseguir personificar outro Professional sem validação.

---

# 140. Mass Assignment

Não permitir atualização arbitrária de:

```text
organizationId

patientId

status

result

reviewedAt

requestedBy
```

através de DTO genérico.

---

# 141. Commands

Operações clínicas relevantes deverão utilizar comandos explícitos.

---

# 142. Service Contract

Exemplo conceitual:

```ts
interface ExamService {
  request(input: RequestExamInput): Promise<Exam>;

  schedule(
    examId: string,
    input: ScheduleExamInput
  ): Promise<Exam>;

  complete(examId: string): Promise<Exam>;

  cancel(
    examId: string,
    input: CancelExamInput
  ): Promise<Exam>;

  registerResult(
    examId: string,
    input: RegisterExamResultInput
  ): Promise<ExamResult>;

  review(
    examId: string,
    input: ReviewExamInput
  ): Promise<ExamReview>;
}
```

---

# 143. Result Service

```ts
interface ExamResultService {
  getCurrent(examId: string): Promise<ExamResult>;

  getHistory(examId: string): Promise<ExamResult[]>;

  register(
    examId: string,
    input: RegisterExamResultInput
  ): Promise<ExamResult>;

  correct(
    resultId: string,
    input: CorrectExamResultInput
  ): Promise<ExamResult>;
}
```

---

# 144. Domain Events

Possíveis eventos:

```text
exam.requested

exam.scheduled

exam.started

exam.completed

exam.result_available

exam.result_corrected

exam.reviewed

exam.cancelled
```

---

# 145. Event Payload

Payload deverá ser mínimo.

Exemplo:

```json
{
  "event": "exam.result_available",
  "examId": "exam_...",
  "organizationId": "org_...",
  "occurredAt": "..."
}
```

---

# 146. Avoid Clinical Payloads

Event Bus não deverá receber automaticamente resultado clínico completo.

---

# 147. Event Consumers

Possíveis:

```text
Notifications

Medical Records

Reports

AI

Integrations

Audit
```

---

# 148. Event Idempotency

Consumers deverão tolerar Duplicate Delivery quando aplicável.

---

# 149. Transactional Consistency

Operações importantes poderão exigir:

```text
Persist Exam

+

Persist Result

+

Persist Outbox Event
```

na mesma transação lógica quando arquitetura utilizar Outbox.

---

# 150. Result Registration Transaction

Resultado não deverá ficar em estado parcialmente persistido.

---

# 151. Concurrency

Dois resultados poderão chegar simultaneamente de:

```text
Manual Upload

External Provider
```

---

# 152. Concurrent Result Update

Sistema deverá possuir estratégia para evitar perda silenciosa de dados.

---

# 153. Optimistic Concurrency

Versioning poderá ser utilizado.

Exemplo:

```text
version
```

---

# 154. Conflict

Se duas alterações competirem, sistema deverá:

```text
Reject

Merge safely

or

Create explicit revision
```

Nunca sobrescrever silenciosamente.

---

# 155. Idempotency

Integrações e uploads deverão considerar Retry.

---

# 156. Duplicate Result

Mesmo resultado recebido duas vezes não deverá criar duas versões clínicas diferentes sem motivo.

---

# 157. External Deduplication

Pode utilizar:

```text
Provider

+

External Result ID

+

Version
```

quando disponível.

---

# 158. Security

Exams contém dados de saúde altamente sensíveis.

---

# 159. Authorization

Toda operação deverá validar:

```text
Authentication

Organization

Permission

Patient Scope

Clinic Scope when applicable

Professional Context when applicable
```

---

# 160. Permissions

Possíveis:

```text
exams.read

exams.request

exams.update

exams.cancel

exams.results.read

exams.results.create

exams.results.correct

exams.review

exams.attachments.read

exams.attachments.create
```

---

# 161. Permission Separation

Usuário autorizado a visualizar Exam não deverá automaticamente poder alterar Result.

---

# 162. Professional Scope

Professional poderá acessar exames necessários ao atendimento conforme Policies.

---

# 163. Reception Scope

Reception poderá precisar visualizar status operacional sem acessar conteúdo clínico completo.

---

# 164. Least Privilege

Exemplo:

```text
Reception

can see:

Exam scheduled at 14:00

but may not need:

Full clinical result
```

---

# 165. Patient Access

Patient Portal poderá permitir acesso aos próprios resultados conforme políticas do produto e requisitos aplicáveis.

---

# 166. Patient Result Release

Disponibilidade de resultado ao Patient poderá possuir workflow próprio.

---

# 167. Result Release

Não assumir:

```text
Result received

=

Immediately visible everywhere
```

---

# 168. Release Policy

Poderá depender de:

```text
Exam Type

Organization Policy

Professional Review

External Provider

Applicable Regulation
```

---

# 169. Internal Status vs Patient Visibility

Esses conceitos deverão ser separados.

---

# 170. Break-Glass Access

Se futuramente existir Emergency Access, deverá possuir:

```text
Explicit Action

Reason

Strong Audit

Limited Scope
```

---

# 171. Audit

Operações relevantes deverão ser auditadas.

---

# 172. Audit Events

Exemplos:

```text
Exam Viewed

Result Viewed

Result Downloaded

Result Added

Result Corrected

Exam Cancelled

Result Reviewed
```

O nível de Audit deverá acompanhar política de segurança e compliance.

---

# 173. Audit vs Domain History

```text
Domain History

≠

Security Audit
```

---

# 174. Domain History

Explica:

```text
What happened to the Exam?
```

---

# 175. Security Audit

Explica:

```text
Who accessed or changed sensitive information?
```

---

# 176. Logging

Logs técnicos deverão evitar conteúdo clínico.

---

# 177. Never Log Full Result

Evitar:

```text
logger.info(examResult)
```

se o objeto contém dados clínicos.

---

# 178. Correlation

Preferir:

```text
examId

organizationId

requestId
```

para diagnóstico técnico.

---

# 179. Observability

Módulo deverá possuir:

```text
Logs

Metrics

Traces

Audit
```

---

# 180. Technical Metrics

Possíveis:

```text
exam_request_latency

exam_result_processing_latency

exam_integration_failure_rate

exam_webhook_duplicate_count

exam_result_correction_count
```

---

# 181. Operational Metrics

Possíveis:

```text
Pending Exams

Completed Exams

Awaiting Results

Results Awaiting Review

Average Result Turnaround
```

---

# 182. Clinical Metrics

Métricas clínicas exigem governança adicional.

Não deverão ser criadas casualmente a partir de dados sensíveis.

---

# 183. Reports Integration

Reports poderá utilizar dados agregados autorizados.

---

# 184. Data Minimization

Reports não deverá receber resultado clínico completo quando apenas contagem é necessária.

---

# 185. Performance

Queries comuns deverão orientar índices.

Possíveis dimensões:

```text
organizationId

patientId

clinicId

examTypeId

status

requestedAt

resultedAt
```

---

# 186. N+1 Queries

Listagem de Exams não deverá realizar consulta separada desnecessária para cada Patient, Professional ou Type.

---

# 187. Large Attachments

Arquivos grandes não deverão trafegar pelo Backend principal de maneira ineficiente quando Storage permitir arquitetura melhor.

---

# 188. Streaming

Downloads grandes poderão utilizar mecanismos adequados de Streaming ou acesso temporário.

---

# 189. Imaging Scale

Medical Imaging poderá possuir volume muito superior a PDFs comuns.

Arquitetura futura deverá considerar isso antes de armazenar grandes estudos diretamente.

---

# 190. Retention

Exams e Results poderão possuir requisitos específicos de retenção.

---

# 191. No Hardcoded Retention

Não definir prazo arbitrário no código.

---

# 192. Retention Policy

Deverá ser determinada conforme:

```text
Applicable Regulation

Organization Policy

Data Category

Contractual Requirements
```

---

# 193. Data Deletion Requests

Pedidos de exclusão deverão considerar obrigações de retenção aplicáveis.

---

# 194. Anonymization

Quando aplicável, processos de anonimização deverão preservar requisitos técnicos e legais definidos pela plataforma.

---

# 195. Backup

Exam Results deverão fazer parte da estratégia de Backup adequada.

---

# 196. Restore

Restore deverá preservar relações entre:

```text
Exam

Result

Attachment

Patient

Audit
```

---

# 197. Disaster Recovery

Resultados clínicos não deverão depender de um único ponto de armazenamento sem estratégia apropriada.

---

# 198. Interoperability

O módulo deverá ser projetado para futura integração com ecossistemas de saúde.

---

# 199. FHIR

Integrações futuras poderão mapear conceitos do MedFlow para recursos de interoperabilidade como:

```text
ServiceRequest

DiagnosticReport

Observation
```

quando apropriado.

---

# 200. Internal Domain First

O domínio interno não deverá ser modelado cegamente como cópia de um padrão externo.

---

# 201. Mapping Layer

Preferir:

```text
MedFlow Domain

↓

Mapping Layer

↓

External Standard
```

---

# 202. Standard Evolution

Versões de padrões externos poderão mudar.

O domínio interno deverá permanecer protegido por Adapter Layer.

---

# 203. Provider Adapter

Possível arquitetura:

```text
Exam Integration

├── Provider A Adapter
├── Provider B Adapter
├── FHIR Adapter
└── Manual Import Adapter
```

---

# 204. Anti-Corruption Layer

Providers externos não deverão impor diretamente seu modelo ao domínio MedFlow.

---

# 205. Data Provenance

Resultado deverá possuir informação suficiente sobre origem.

Possíveis:

```text
manual

laboratory_api

fhir

import

external_provider
```

---

# 206. Provenance Is Critical

Quando resultado vier externamente, deverá ser possível determinar:

```text
Where did this data come from?
```

---

# 207. Manual Result Entry

Entrada manual deverá exigir Permission apropriada.

---

# 208. Manual Entry Audit

Registrar:

```text
Actor

Timestamp

Exam

Result Version
```

---

# 209. Manual Correction

Correção manual deverá exigir Reason quando apropriado.

---

# 210. Validation of Structured Results

Valores estruturados deverão validar:

```text
Data Type

Unit

Allowed Format

Required Fields
```

---

# 211. Numeric Precision

Não utilizar tipos inadequados que causem perda de precisão.

---

# 212. Decimal Values

Resultados decimais deverão possuir representação apropriada ao domínio.

---

# 213. Units

Units deverão ser representadas de forma consistente.

---

# 214. Original Unit

Se conversão ocorrer em algum contexto futuro, preservar unidade original quando necessário.

---

# 215. Result Presentation

UI deverá distinguir claramente:

```text
Value

Unit

Reference Range

Status

Source
```

---

# 216. Corrected Result UI

Resultado corrigido deverá possuir indicação visível.

---

# 217. Preliminary Result UI

Resultado preliminar deverá ser claramente identificado.

---

# 218. Historical Results

Usuário autorizado poderá visualizar histórico de versões quando necessário.

---

# 219. Accessibility

Resultados não deverão depender apenas de cor.

---

# 220. Abnormal Indicators

Se indicadores forem exibidos:

```text
High

Low

Critical
```

deverão possuir texto ou semântica equivalente além da cor.

---

# 221. Tables

Tabelas de resultados deverão possuir estrutura acessível.

---

# 222. Mobile

Resultados complexos deverão permanecer legíveis em telas menores.

---

# 223. PDF Viewer

Se houver visualização integrada, deverá existir alternativa adequada quando Viewer não estiver disponível.

---

# 224. Error Model

Possíveis códigos:

```text
EXAM_NOT_FOUND

EXAM_NOT_ALLOWED

EXAM_INVALID_STATE

EXAM_INVALID_TYPE

EXAM_INVALID_PATIENT

EXAM_INVALID_PROFESSIONAL

EXAM_ALREADY_CANCELLED

EXAM_RESULT_ALREADY_EXISTS

EXAM_RESULT_CONFLICT

EXAM_RESULT_INVALID

EXAM_RESULT_VERSION_CONFLICT

EXAM_ATTACHMENT_INVALID

EXAM_EXTERNAL_REFERENCE_CONFLICT

EXAM_REVIEW_NOT_ALLOWED

EXAM_RESULT_NOT_RELEASED
```

---

# 225. Stable Errors

Clients deverão depender de Error Codes estáveis, não de mensagens humanas.

---

# 226. Current / Planned / Future

Esta tabela deverá ser sincronizada com a implementação real.

| Capacidade | Estado |
|------------|--------|
| Cadastro básico de Exams | Current / validar com implementação |
| Patient Association | Current / validar com implementação |
| Professional Association | Current / validar com implementação |
| Exam Status | Current / validar com implementação |
| Basic Result Storage | Current / validar com implementação |
| Exam Attachments | Planned / validar com implementação |
| Structured Results | Planned |
| Result Review | Planned |
| Result Versioning | Planned |
| Notifications | Planned |
| Laboratory Integrations | Future |
| FHIR Integration | Future |
| DICOM/PACS Integration | Future |
| Patient Result Portal | Future |
| AI Result Summaries | Future |
| Result Trends | Future |
| Automated Reconciliation | Future |

> Capacidades marcadas como `Current / validar com implementação` deverão ser confirmadas no código e ERD antes de serem tratadas como contratos definitivos.

---

# 227. Testing Strategy

O módulo deverá possuir testes proporcionais à sensibilidade dos dados.

---

# 228. Unit Tests

Cobrir:

```text
State Transitions

Result Validation

Result Versioning

Cancellation

Review

Permission Rules
```

---

# 229. Integration Tests

Cobrir:

```text
Database

Files

Events

External References

Transactions

Audit
```

---

# 230. Tenant Isolation Tests

Essenciais:

```text
Organization A

cannot access

Organization B Exam
```

---

# 231. Patient Scope Tests

Validar acesso somente aos Patients autorizados.

---

# 232. Professional Scope Tests

Validar escopo profissional quando aplicável.

---

# 233. Reception Tests

Garantir que Reception não obtenha conteúdo clínico além do necessário.

---

# 234. Result Version Tests

Fluxo:

```text
Result v1

↓

Correction

↓

Result v2

↓

v1 preserved
```

---

# 235. Integration Idempotency Tests

Enviar o mesmo Webhook múltiplas vezes.

Resultado esperado:

```text
One logical result
```

---

# 236. Out-of-Order Tests

Enviar eventos externos fora de ordem e validar comportamento.

---

# 237. File Security Tests

Cobrir:

```text
Unauthorized Download

Expired Link

Wrong Tenant

Invalid File

Missing Permission
```

---

# 238. E2E Tests

Fluxos prioritários:

```text
Request Exam

↓

Complete Exam

↓

Register Result

↓

Review Result

↓

Patient Timeline
```

e:

```text
External Result

↓

Integration

↓

Result Available

↓

Notification

↓

Professional Review
```

---

# 239. Domain Invariants

```text
Every Exam belongs to one Organization.

Every clinical Exam belongs to one Patient.

Exam identity is independent from external provider IDs.

Exam Request is different from Exam Result.

Exam is different from Appointment.

Exam is different from Medical Record.

Cancellation does not delete history.

Results are never silently overwritten.

Corrected results preserve previous versions.

Attachments require authorization.

Clinical files are not permanently public.

External events are idempotently processed.

AI output never becomes official Exam Result implicitly.

Review refers to a known Result Version.

Cross-tenant access is forbidden.
```

---

# 240. Decisões Arquiteturais e de Produto

## ADR-841

Exams será o Source of Truth para o lifecycle operacional dos exames no MedFlow.

---

## ADR-842

Exam não será modelado como simples arquivo.

---

## ADR-843

Todo Exam possuirá Tenant Ownership explícito.

---

## ADR-844

Patient Identity será referenciada através do módulo Patients e não duplicada dentro de Exams.

---

## ADR-845

Clinic será contexto operacional do Exam e não substituirá Organization Ownership.

---

## ADR-846

Professional solicitante será referenciado através de identidade estável do módulo Professionals.

---

## ADR-847

Exam Type possuirá identidade técnica independente de seu nome.

---

## ADR-848

Mappings para terminologias externas serão separados da identidade interna do Exam Type.

---

## ADR-849

Exam Request e Exam Result serão conceitos distintos.

---

## ADR-850

Priority será estado de domínio e não propriedade puramente visual.

---

## ADR-851

Mudanças de Status utilizarão transições validadas em vez de atribuição arbitrária.

---

## ADR-852

Cancelamento de Exam preservará histórico.

---

## ADR-853

O modelo de Result deverá permitir evolução além de documentos PDF.

---

## ADR-854

Resultados estruturados serão utilizados quando disponíveis, sem forçar estrutura inadequada a exames complexos.

---

## ADR-855

Resultados corrigidos não sobrescreverão silenciosamente versões anteriores.

---

## ADR-856

A versão atual do Result poderá ser identificada sem apagar histórico.

---

## ADR-857

Attachments serão referências à infraestrutura de Files e não armazenamento implementado diretamente pelo módulo Exams.

---

## ADR-858

Arquivos clínicos não possuirão acesso público permanente.

---

## ADR-859

URLs temporárias de arquivos deverão possuir escopo e expiração apropriados.

---

## ADR-860

Patient Data sensível não deverá ser incorporado desnecessariamente em nomes de arquivos ou URLs.

---

## ADR-861

Medical Imaging não será reduzido conceitualmente a arquivos de imagem comuns.

---

## ADR-862

O MedFlow não assumirá responsabilidade de PACS sem decisão arquitetural explícita.

---

## ADR-863

External Exam IDs permanecerão separados dos IDs internos.

---

## ADR-864

External IDs serão interpretados dentro do namespace do Provider correspondente.

---

## ADR-865

Webhooks de Providers deverão ser processados de forma idempotente.

---

## ADR-866

Integrações externas deverão possuir mecanismos adequados de autenticação e verificação.

---

## ADR-867

Handlers deverão tolerar eventos externos fora de ordem quando a integração permitir essa condição.

---

## ADR-868

Falhas de integração não deverão corromper o Exam interno existente.

---

## ADR-869

Retries de integração deverão ser observáveis, limitados e idempotentes.

---

## ADR-870

Exam e Appointment permanecerão entidades independentes.

---

## ADR-871

Cancelamento de Appointment não cancelará automaticamente Exam Request sem Policy explícita.

---

## ADR-872

Medical Records deverá consumir ou referenciar Exam Results sem criar cópias independentes desnecessárias.

---

## ADR-873

Review de Result será operação explícita e não consequência automática de visualização.

---

## ADR-874

Review deverá identificar a versão do Result revisada quando Versioning existir.

---

## ADR-875

Correção posterior de Result poderá exigir nova revisão conforme Policy.

---

## ADR-876

Notifications receberá eventos de Exams sem se tornar Source of Truth do Exam.

---

## ADR-877

Notifications relacionadas a Exams deverão minimizar exposição de dados clínicos.

---

## ADR-878

AI Interpretation permanecerá separada do resultado clínico oficial.

---

## ADR-879

O resultado original utilizado por AI deverá permanecer preservado.

---

## ADR-880

Conteúdo gerado por AI deverá possuir Provenance identificável.

---

## ADR-881

AI não poderá preencher valores clínicos ausentes por inferência e registrá-los como resultado factual.

---

## ADR-882

Trend Analysis deverá considerar Unit, Method e Reference Range antes de comparar resultados.

---

## ADR-883

Reference Ranges não serão hardcoded globalmente sem contexto clínico apropriado.

---

## ADR-884

APIs de Exams deverão utilizar comandos explícitos para operações clínicas sensíveis.

---

## ADR-885

Mass Assignment não poderá alterar Tenant, Patient, Status, Result ou Review arbitrariamente.

---

## ADR-886

Domain Events deverão possuir Payload mínimo e não transportar resultados clínicos completos por padrão.

---

## ADR-887

Persistência de Result deverá evitar estados parciais.

---

## ADR-888

Concorrência entre resultados manuais e externos deverá possuir estratégia explícita.

---

## ADR-889

Resultados duplicados provenientes de Retry não deverão gerar revisões clínicas falsas.

---

## ADR-890

Permissions de leitura e alteração de Result serão separadas.

---

## ADR-891

Reception poderá possuir acesso operacional limitado sem acesso automático ao resultado clínico completo.

---

## ADR-892

Patient Result Visibility permanecerá separada do estado interno de disponibilidade do Result.

---

## ADR-893

Emergency Access, caso implementado, exigirá ação explícita e Audit reforçado.

---

## ADR-894

Domain History e Security Audit permanecerão conceitos separados.

---

## ADR-895

Logs técnicos não deverão conter Result completo.

---

## ADR-896

Reports utilizará Data Minimization ao consumir dados de Exams.

---

## ADR-897

Retention não será hardcoded sem política regulatória e organizacional apropriada.

---

## ADR-898

Interoperabilidade externa utilizará Mapping/Adapter Layer para proteger o domínio interno.

---

## ADR-899

Provider-specific models não deverão contaminar diretamente o domínio principal.

---

## ADR-900

Data Provenance será preservada para resultados recebidos de fontes externas ou inseridos manualmente.

---

## ADR-901

Manual Result Entry exigirá Permission e Audit adequados.

---

## ADR-902

Structured Results deverão preservar precisão e Units apropriadas.

---

## ADR-903

Correções deverão ser visualmente identificáveis na UI.

---

## ADR-904

Indicadores clínicos não dependerão exclusivamente de cor.

---

## ADR-905

Exam Result Access seguirá Least Privilege.

---

## ADR-906

Future Healthcare Standards Integration não substituirá o domínio interno do MedFlow.

---

## ADR-907

Exams deverá permanecer preparado para múltiplos Providers sem criar dependência estrutural de um único laboratório.

---

## ADR-908

A arquitetura deverá distinguir dados factuais recebidos de Providers, conteúdo inserido por Professionals e conteúdo derivado por AI.

---

## ADR-909

Mudanças futuras no módulo deverão preservar Provenance, Versioning e Historical Integrity.

---

## ADR-910

A evolução do módulo Exams deverá priorizar segurança e integridade clínica sobre conveniência de implementação.

---

# 241. Relação com Outros Módulos

```text
                         Patients
                            │
                            ▼
                           Exams
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
 Professionals          Clinics            Appointments
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
  Medical Records         Files         Notifications
          │
          ├──────────────► Reports
          ├──────────────► AI
          ├──────────────► Finance
          └──────────────► Integrations
```

---

# 242. Dependency Rules

```text
Exams

owns

Exam Lifecycle.
```

```text
Patients

owns

Patient Identity.
```

```text
Professionals

owns

Professional Identity.
```

```text
Appointments

owns

Scheduling Lifecycle.
```

```text
Files

owns

File Storage.
```

```text
Medical Records

owns

Clinical Record Context.
```

```text
Notifications

owns

Message Delivery.
```

```text
AI

owns

AI Processing,
not clinical truth.
```

---

# 243. Checklist — Request Exam

```text
[ ] Actor authenticated
[ ] Tenant resolved
[ ] Permission validated
[ ] Patient exists
[ ] Patient belongs to authorized scope
[ ] Exam Type exists
[ ] Exam Type active
[ ] Professional context valid
[ ] Clinic valid when required
[ ] Priority valid
[ ] Clinical context validated
[ ] Exam persisted
[ ] Domain event emitted
[ ] Audit recorded
```

---

# 244. Checklist — Register Result

```text
[ ] Exam exists
[ ] Tenant matches
[ ] Actor/source authorized
[ ] Exam state accepts result
[ ] Result format valid
[ ] Units valid
[ ] External reference checked
[ ] Duplicate checked
[ ] Previous result preserved when correction
[ ] Result version assigned
[ ] Provenance recorded
[ ] Transaction completed
[ ] Event emitted
[ ] Audit recorded
```

---

# 245. Checklist — Review Result

```text
[ ] Exam exists
[ ] Result exists
[ ] Result version identified
[ ] Professional authenticated
[ ] Permission valid
[ ] Patient scope valid
[ ] Review not duplicated incorrectly
[ ] reviewedAt recorded
[ ] Reviewer recorded
[ ] Domain event emitted
[ ] Audit recorded
```

---

# 246. Checklist — Attachment Access

```text
[ ] User authenticated
[ ] Tenant validated
[ ] Exam validated
[ ] Patient scope validated
[ ] Permission validated
[ ] File belongs to Exam
[ ] File access temporary
[ ] Sensitive metadata minimized
[ ] Download audit applied when required
```

---

# 247. Checklist — External Integration

```text
[ ] Provider identified
[ ] Request authenticated
[ ] Signature validated when supported
[ ] External ID scoped by Provider
[ ] Duplicate event checked
[ ] Event ordering considered
[ ] Patient mapping validated
[ ] Exam mapping validated
[ ] Result validated
[ ] Provenance recorded
[ ] Retry safe
[ ] Error observable
[ ] Audit/integration history recorded
```

---

# 248. Checklist — Code Review

```text
[ ] No cross-tenant access
[ ] No Patient duplication
[ ] No Professional duplication
[ ] No arbitrary status mutation
[ ] No silent result overwrite
[ ] No public clinical files
[ ] No clinical data in logs
[ ] No result exposed to Reception unnecessarily
[ ] No AI output stored as factual result implicitly
[ ] No Provider model leaking into core domain
[ ] External handlers are idempotent
[ ] Result provenance is preserved
[ ] Result versions are preserved
[ ] Permissions are server-side
[ ] Tests updated
[ ] Documentation updated
```

---

# 249. Definition of Done

Uma Feature de Exams não estará concluída apenas porque um PDF pode ser enviado e aberto.

Ela deverá ser:

```text
Clinically Traceable

+

Tenant Safe

+

Authorized

+

Versioned

+

Auditable

+

Privacy-Aware

+

Integration-Safe

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

# 250. Failure Scenarios

A arquitetura deverá considerar:

```text
A laboratory sends the same result twice.

A corrected result arrives after professional review.

A provider sends events out of order.

A receptionist tries to access the full result.

A user changes examId manually in the request.

An attachment URL is shared after expiration.

An external provider is temporarily offline.

A manual result and API result arrive simultaneously.

An AI summary is generated from an outdated result version.

A Clinic is archived after the Exam was performed.

A Professional leaves the Organization.

A Patient requests historical results years later.

A result file exists but structured processing fails.
```

Nenhum desses cenários deverá destruir a verdade histórica do Exam.

---

# 251. Anti-Patterns

Evitar:

```text
Exam = PDF.
```

```text
Exam = Appointment.
```

```text
Result overwritten on correction.
```

```text
Public S3 URL for clinical files.
```

```text
Reception has full clinical access because it can see the appointment.
```

```text
AI summary stored as laboratory result.
```

```text
External provider ID used as internal primary key.
```

```text
Webhook creates a new result every retry.
```

```text
Patient name used to identify exam ownership.
```

```text
Full result serialized into application logs.
```

---

# 252. Future Evolution

Possível evolução:

```text
Basic Exam Registry

↓

Exam Requests

↓

Attachments

↓

Structured Results

↓

Result Versioning

↓

Professional Review

↓

Patient Result Access

↓

Laboratory Integrations

↓

FHIR Interoperability

↓

Imaging Integration

↓

Clinical Trends

↓

AI-Assisted Interpretation
```

Essa sequência não representa compromisso de Release.

---

# 253. Para Futuros Desenvolvedores

Se você estiver trabalhando neste módulo anos depois, não assuma que o objeto principal é o arquivo.

Pergunte:

```text
What happened clinically?

What happened operationally?

Where did this result come from?

Which version is authoritative?

Who reviewed it?

Who can see it?

What must remain historically preserved?
```

Antes de sobrescrever um Result:

```text
Will we lose clinical history?
```

Antes de expor um Attachment:

```text
Is this user authorized
to see this patient's data?
```

Antes de integrar um laboratório:

```text
Are we adapting the provider
to MedFlow

or

adapting MedFlow
to the provider?
```

A resposta deverá ser a primeira.

---

# 254. Invariante Final

Independentemente da evolução tecnológica:

```text
A clinical result must never lose

its patient,

its origin,

its meaning,

its version,

or its history.
```

Se um resultado corrigido apagar o anterior, o módulo falhou.

Se um arquivo clínico puder ser acessado sem autorização, o módulo falhou.

Se um resultado de outro Tenant puder ser consultado, o módulo falhou.

Se uma inferência de AI puder ser confundida com resultado laboratorial, o módulo falhou.

Se uma integração externa puder sobrescrever silenciosamente a verdade clínica, o módulo falhou.

---

# 255. Considerações Finais

Exames poderão começar no MedFlow como uma Feature relativamente simples:

```text
Patient

+

Exam

+

Result
```

Mas um sistema de saúde real rapidamente introduz:

```text
Requests

+

Providers

+

Results

+

Versions

+

Files

+

Structured Data

+

Interoperability

+

Permissions

+

Audit

+

Clinical History
```

O domínio deverá estar preparado para essa evolução sem transformar o sistema em um conjunto de PDFs associados a Patients.

A longo prazo:

```text
Appointments
```

poderá organizar quando o exame ocorrerá.

```text
Files
```

poderá armazenar documentos.

```text
Medical Records
```

poderá apresentar o resultado no contexto clínico.

```text
Notifications
```

poderá informar que um resultado está disponível.

```text
AI
```

poderá ajudar a organizar e resumir informações.

```text
Reports
```

poderá produzir métricas autorizadas.

Mas:

```text
Exams
```

continuará responsável por preservar a identidade e o lifecycle do exame.

A arquitetura deverá garantir que, mesmo anos depois, seja possível determinar:

```text
What was requested?

What was received?

From where?

When?

Which version?

Who reviewed it?

What changed?
```

Essa rastreabilidade é mais importante do que qualquer implementação específica utilizada hoje.

```text
Technology changes.

Providers change.

Standards evolve.

Clinical history must remain trustworthy.
```

Esse deverá ser o princípio duradouro do módulo `Exams`.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação da documentação oficial do módulo Exams, cobrindo lifecycle, solicitações, resultados estruturados, versionamento, arquivos, integrações laboratoriais, imaging, interoperabilidade, AI, segurança, permissões, auditoria, observabilidade, testes e decisões ADR-841 a ADR-910 | Equipe MedFlow |