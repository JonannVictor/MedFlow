# Módulo de Clínicas

| Campo | Valor |
|-------|--------|
| Documento | Clinics |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Modules |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# 1. Visão Geral

O módulo **Clinics** é responsável pela representação das unidades operacionais de saúde dentro do MedFlow.

Uma Clinic não deverá ser tratada apenas como:

```text
Name

+

Address
```

Ela representa um contexto operacional no qual atividades da organização acontecem.

Dependendo da evolução do MedFlow, uma Clinic poderá influenciar:

```text
Appointments

Professionals

Reception

Patients

Rooms

Operating Hours

Services

Telemedicine

Notifications

Finance

Reports

Permissions

Settings
```

O módulo deverá permitir que uma Organization opere uma ou múltiplas unidades sem comprometer:

```text
Tenant Isolation

Operational Isolation

Data Consistency

Authorization

Historical Integrity
```

---

# 2. Princípio Fundamental

```text
Organization

≠

Clinic
```

Uma Organization representa o Tenant principal.

Uma Clinic representa uma unidade operacional pertencente à Organization.

Exemplo:

```text
Organization
MedFlow Saúde

├── Clinic
│   └── Unidade Centro
│
├── Clinic
│   └── Unidade Norte
│
└── Clinic
    └── Unidade Sul
```

---

# 3. Regra Estrutural

```text
Organization

1

↓

N Clinics
```

Uma Clinic deverá pertencer a exatamente uma Organization.

---

# 4. Tenant Boundary

A Clinic não deverá substituir o Tenant Boundary.

```text
Tenant Boundary

=

Organization
```

e não:

```text
Tenant Boundary

=

Clinic
```

Isso é fundamental.

Duas Clinics pertencentes à mesma Organization podem compartilhar determinadas informações de acordo com Policies da plataforma.

Duas Clinics pertencentes a Organizations diferentes nunca deverão compartilhar dados implicitamente.

---

# 5. Objetivo

O módulo deverá fornecer uma fonte confiável para responder:

```text
Which organization owns this clinic?

Where is the clinic located?

Is the clinic active?

What timezone does it operate in?

What are its operating hours?

Which professionals work there?

Which services are available?

Which appointments belong there?

Which reception workflow applies?

What configuration applies?
```

---

# 6. Escopo

Clinics poderá ser responsável por:

- Identidade da unidade.
- Nome.
- Código interno.
- Endereço.
- Informações de contato.
- Timezone.
- Locale operacional.
- Status.
- Horários de funcionamento.
- Feriados e exceções.
- Configurações específicas da unidade.
- Associação de Professionals.
- Associação de Services.
- Rooms e Resources quando implementados.
- Contexto para Appointments.
- Contexto para Reception.
- Contexto para Reports.
- Branding limitado quando apropriado.

---

# 7. Fora do Escopo

Clinics não deverá ser responsável diretamente por:

- Authentication.
- Organization Ownership.
- Patient Records.
- Clinical Records.
- Appointment Lifecycle.
- Prescription Lifecycle.
- Exam Lifecycle.
- Payment Processing.
- AI Execution.
- Notification Delivery.

---

# 8. Entidade Principal

Entidade conceitual:

```text
Clinic
```

Possível estrutura:

```text
Clinic

├── id
├── organizationId
├── name
├── code
├── status
├── timezone
├── locale
├── phone
├── email
├── address
├── metadata
├── createdAt
├── updatedAt
└── version
```

A estrutura real deverá acompanhar o ERD oficial.

---

# 9. Clinic ID

Toda Clinic deverá possuir identificador único e estável.

Alterar:

```text
Name

Address

Phone
```

não deverá alterar sua identidade.

---

# 10. Organization Ownership

Toda Clinic deverá possuir:

```text
organizationId
```

explícito.

Não deverá existir Clinic órfã em Production.

---

# 11. Organization Immutability

Mover uma Clinic existente de uma Organization para outra não deverá ser tratado como edição comum.

Isso poderá alterar o significado de:

```text
Appointments

Professionals

Patients

Reports

Finance

Audit

Permissions
```

---

# 12. Clinic Code

Organization poderá possuir código interno para identificar unidade.

Exemplo:

```text
CENTRO

NORTE

SP-01
```

Se existir, unicidade deverá ser definida dentro da Organization.

---

# 13. Clinic Name

Nome deverá representar a unidade para usuários.

Não deverá ser utilizado como identificador técnico.

---

# 14. Status

Estados conceituais:

```text
active

inactive

archived
```

Estados adicionais somente deverão existir quando possuírem significado operacional.

---

# 15. Active

Clinic disponível para operação normal.

---

# 16. Inactive

Clinic temporariamente indisponível para novas operações.

Dados históricos continuam existindo.

---

# 17. Archived

Clinic retirada de operação, preservada para histórico.

---

# 18. Archive Is Not Delete

```text
Archive Clinic

≠

Delete Clinic
```

Arquivar uma Clinic não deverá apagar:

```text
Appointments

Records

Reports

Audit History

Financial History
```

---

# 19. Clinic Lifecycle

```text
Created

↓

Active

↓

Inactive

↓

Active
```

ou:

```text
Active

↓

Archived
```

Reativação de Clinic arquivada deverá possuir regra explícita caso suportada.

---

# 20. Deletion

Physical Deletion deverá ser excepcional.

Uma Clinic utilizada historicamente por outros módulos normalmente não deverá ser apagada fisicamente.

---

# 21. Address

Address deverá ser estruturado quando necessário.

Possível representação:

```text
Address

├── street
├── number
├── complement
├── district
├── city
├── state
├── postalCode
├── country
└── coordinates
```

A estrutura deverá ser adequada aos mercados suportados.

---

# 22. International Address

Não assumir que todos os países utilizam exatamente:

```text
CEP

Estado

Número
```

da mesma maneira.

---

# 23. Country

Country deverá utilizar representação padronizada quando persistido.

---

# 24. Coordinates

Latitude e Longitude poderão ser armazenadas futuramente para:

```text
Maps

Directions

Nearest Clinic

Geographic Analytics
```

---

# 25. Geocoding

Geocoding deverá ser tratado como integração externa.

---

# 26. Geocoding Failure

Falha ao encontrar Coordinates não deverá impedir cadastro básico da Clinic quando coordenadas não forem requisito.

---

# 27. Contact Information

Clinic poderá possuir:

```text
Phone

Email

WhatsApp

Website
```

conforme funcionalidades suportadas.

---

# 28. Contact Validation

Dados deverão possuir validação apropriada.

---

# 29. Phone Numbers

Evitar modelagem que assume somente formato brasileiro se internacionalização fizer parte da estratégia.

---

# 30. Email

Email deverá ser normalizado quando apropriado.

---

# 31. Timezone

Cada Clinic deverá possuir Timezone operacional explícita quando Scheduling depender dela.

Exemplo conceitual:

```text
America/Sao_Paulo
```

---

# 32. No Fixed UTC Offset

Evitar armazenar apenas:

```text
UTC-3
```

como identidade de Timezone.

Offsets podem mudar conforme regras locais.

---

# 33. Appointment Integration

Appointments deverão utilizar Timezone da Clinic como parte do contexto temporal quando apropriado.

---

# 34. Timezone Change

Alterar Timezone de Clinic existente é operação sensível.

Pode afetar interpretação de:

```text
Schedules

Future Appointments

Reports

Notifications
```

---

# 35. Timezone Change Strategy

Mudanças deverão ser explícitas e auditáveis.

Appointments persistidos como instantes absolutos não deverão ser silenciosamente deslocados.

---

# 36. Locale

Locale poderá influenciar:

```text
Date Formatting

Number Formatting

Language Defaults

Currency Presentation
```

Locale não deverá alterar dados canônicos internos.

---

# 37. Currency

Caso Finance necessite moeda por Clinic ou Organization, isso deverá ser modelado explicitamente no domínio financeiro/configuração correspondente.

Clinic não deverá assumir automaticamente que:

```text
Country = Currency
```

---

# 38. Operating Hours

Clinic poderá possuir horários de funcionamento.

Exemplo:

```text
Monday

08:00 → 12:00
13:00 → 18:00
```

---

# 39. Weekly Schedule

Representação conceitual:

```text
ClinicOperatingHours

├── clinicId
├── weekday
├── startTime
├── endTime
└── status
```

Uma Clinic poderá possuir múltiplos intervalos no mesmo dia.

---

# 40. Split Schedule

Deverá ser possível representar:

```text
08:00 → 12:00

14:00 → 18:00
```

sem considerar o intervalo como horário disponível.

---

# 41. Closed Day

Um dia poderá não possuir intervalos.

---

# 42. 24-Hour Clinic

Caso necessário, funcionamento contínuo deverá possuir representação não ambígua.

---

# 43. Operating Hours Are Not Professional Availability

```text
Clinic Open

≠

Professional Available
```

---

# 44. Availability Intersection

Para Scheduling:

```text
Clinic Operating Hours

∩

Professional Availability

∩

Service Rules

∩

Resource Availability

=

Potential Appointment Availability
```

---

# 45. Operating Exceptions

Horários recorrentes não representam exceções.

---

# 46. Clinic Exception

Possível entidade:

```text
ClinicScheduleException

├── id
├── clinicId
├── date
├── type
├── startTime
├── endTime
├── reason
└── createdBy
```

---

# 47. Exception Types

Possíveis:

```text
closed

special_hours

holiday

maintenance

emergency
```

---

# 48. Exception Precedence

Exceção específica deverá possuir precedência sobre horário semanal padrão.

---

# 49. Holidays

Holidays poderão ser:

```text
National

Regional

Municipal

Organization-Specific
```

---

# 50. Holiday Provider

Integrações externas poderão auxiliar, mas a plataforma deverá manter controle sobre regras efetivamente utilizadas.

---

# 51. Emergency Closure

Clinic poderá precisar fechar inesperadamente.

Exemplo:

```text
Infrastructure Failure

Local Emergency

Maintenance

Operational Incident
```

---

# 52. Closure Impact

Ao fechar Clinic com Appointments futuros, sistema deverá identificar impacto.

```text
Clinic Closed

↓

Affected Appointments

↓

Operational Workflow

↓

Reschedule / Cancel / Notify
```

---

# 53. No Silent Cancellation

Desativar Clinic não deverá automaticamente cancelar centenas de Appointments sem fluxo explícito.

---

# 54. Professionals

Professionals poderão atuar em uma ou múltiplas Clinics.

---

# 55. Professional Clinic Membership

Conceitualmente:

```text
ProfessionalClinic

├── organizationId
├── professionalId
├── clinicId
├── status
├── role
├── startedAt
└── endedAt
```

---

# 56. Membership Is Not Identity

Professional continua sendo uma entidade própria.

A relação apenas define atuação na Clinic.

---

# 57. Multi-Clinic Professional

```text
Professional A

├── Clinic Centro
└── Clinic Norte
```

deverá ser suportável sem duplicar Professional.

---

# 58. Membership Status

Possíveis:

```text
active

inactive
```

---

# 59. Removing Professional

Remover Professional de uma Clinic não deverá apagar histórico de Appointments anteriores.

---

# 60. Future Appointments

Ao remover vínculo com Clinic, Appointments futuros deverão ser analisados antes da alteração ser concluída quando aplicável.

---

# 61. Services

Uma Clinic poderá oferecer subconjunto dos serviços da Organization.

---

# 62. Clinic Service

Conceitualmente:

```text
ClinicService

├── clinicId
├── serviceId
├── status
├── localDurationOverride
├── localPriceOverride
└── metadata
```

Overrides somente deverão existir quando houver necessidade real.

---

# 63. Service Availability

```text
Service Exists

≠

Service Available at Every Clinic
```

---

# 64. Service Deactivation

Desativar Service em uma Clinic deverá considerar Appointments futuros associados.

---

# 65. Rooms

Rooms poderão ser introduzidas quando Resource Scheduling justificar.

---

# 66. Room Entity

Conceitualmente:

```text
Room

├── id
├── organizationId
├── clinicId
├── name
├── type
├── status
└── metadata
```

---

# 67. Room Identity

Room deverá pertencer a uma Clinic.

---

# 68. Room Types

Possíveis:

```text
consultation

procedure

exam

telemedicine

administrative
```

Somente introduzir categorias realmente necessárias.

---

# 69. Resource Scheduling

Room não deverá ser adicionada ao Scheduling apenas para tornar a arquitetura "mais completa".

Deverá existir necessidade operacional real.

---

# 70. Equipment

Equipamentos compartilhados poderão futuramente ser recursos.

---

# 71. Resource Domain

Se Resource Management crescer significativamente, poderá justificar módulo próprio.

---

# 72. Reception

Reception opera dentro de contexto de Clinic.

---

# 73. Reception Context

Ao selecionar uma Clinic:

```text
Today's Appointments

Waiting Patients

Professionals

Rooms

Operational Alerts
```

poderão ser filtrados.

---

# 74. Default Clinic

Usuários que trabalham predominantemente em uma unidade poderão possuir Default Clinic.

---

# 75. Default Is Not Permission

```text
Default Clinic

≠

Only Authorized Clinic
```

e também:

```text
Default Clinic

≠

Permission to Access Clinic
```

---

# 76. Clinic Switcher

Usuários com acesso a múltiplas unidades poderão utilizar Clinic Switcher.

---

# 77. Context Switch

Trocar Clinic deverá atualizar corretamente:

```text
Appointments

Reception

Reports

Professionals

Settings

Operational Data
```

---

# 78. No Stale Clinic Context

Frontend deverá evitar situação:

```text
UI shows Clinic A

but request mutates Clinic B.
```

---

# 79. Explicit Context

Requests sensíveis deverão possuir contexto de recurso suficiente para Backend validar Clinic e Organization.

---

# 80. Authorization

Acesso a uma Clinic deverá depender de:

```text
Authenticated User

Organization Membership

Permissions

Clinic Scope
```

quando Clinic Scope estiver habilitado.

---

# 81. Clinic Permissions

Possíveis permissões:

```text
clinics.read

clinics.create

clinics.update

clinics.archive

clinics.manage_hours

clinics.manage_services

clinics.manage_professionals

clinics.manage_resources
```

---

# 82. Scope Permissions

Usuário poderá possuir permissão em:

```text
All Clinics
```

ou subconjunto específico.

---

# 83. Organization Admin

Organization Admin poderá possuir acesso amplo conforme Role Policy.

---

# 84. Receptionist

Receptionist poderá possuir acesso apenas às Clinics onde trabalha.

---

# 85. Professional

Professional poderá possuir acesso às unidades relacionadas ao seu vínculo.

---

# 86. Patient

Patient não deverá possuir acesso administrativo ao objeto Clinic.

Poderá receber apenas informações públicas necessárias.

---

# 87. Public Clinic Information

Informações públicas poderão incluir:

```text
Name

Address

Contact

Opening Hours

Available Services
```

quando o produto oferecer Patient Portal.

---

# 88. Internal Clinic Information

Dados internos não deverão ser expostos em endpoints públicos.

---

# 89. Cross-Tenant Access

```text
Organization A / Clinic A

X

Organization B / Clinic B
```

IDs conhecidos não concedem acesso.

---

# 90. Clinic ID Enumeration

Backend deverá validar Tenant Ownership em toda operação.

---

# 91. Clinic Creation

Fluxo conceitual:

```text
Authorized Admin

↓

Validate Organization

↓

Validate Input

↓

Create Clinic

↓

Configure Defaults

↓

Audit

↓

Clinic Available
```

---

# 92. Creation Requirements

Possíveis campos obrigatórios:

```text
Name

Organization

Timezone
```

Outros dependerão do produto.

---

# 93. Defaults

Defaults poderão ser herdados da Organization.

---

# 94. Configuration Inheritance

Possível modelo:

```text
Platform Default

↓

Organization Setting

↓

Clinic Override
```

---

# 95. Override Rule

Override somente deverá existir para Settings explicitamente permitidas.

---

# 96. No Arbitrary Overrides

Clinic não deverá conseguir sobrescrever:

```text
Security Policy

Compliance Requirement

Tenant Isolation

Mandatory Platform Rule
```

---

# 97. Configuration Resolution

Quando existir herança:

```text
resolveSetting(key, clinic)
```

deverá produzir valor determinístico.

---

# 98. Configuration Provenance

UI administrativa poderá futuramente mostrar:

```text
Inherited from Organization
```

ou:

```text
Overridden by Clinic
```

---

# 99. Clinic Settings

Possíveis configurações:

```text
Timezone

Operating Hours

Appointment Defaults

Reception Preferences

Notification Defaults

Branding

Locale
```

---

# 100. Settings Boundary

Configuração geral poderá ser gerenciada pelo módulo `Settings`.

Clinics mantém apenas o contexto e ownership correspondente.

---

# 101. Branding

Clinic poderá possuir branding limitado quando produto justificar.

Exemplos:

```text
Display Name

Logo

Contact Details
```

---

# 102. Brand Boundary

Branding não deverá permitir CSS ou scripts arbitrários.

---

# 103. Clinic Logo

Uploads deverão utilizar infraestrutura segura de Files.

---

# 104. File Validation

Logo deverá possuir:

```text
Type Validation

Size Limit

Safe Storage
```

---

# 105. Clinics and Patients

Patient poderá estar relacionado a uma ou múltiplas Clinics dentro da Organization.

---

# 106. Patient Ownership

Clinic não deverá necessariamente ser dona do Patient.

Se o Tenant é Organization:

```text
Patient belongs to Organization context
```

e relações com Clinics deverão ser modeladas separadamente quando necessárias.

---

# 107. Avoid Patient Duplication

Não criar:

```text
Patient A — Clinic Centro

Patient A — Clinic Norte
```

como duas identidades independentes apenas porque houve atendimento em duas unidades.

---

# 108. Patient Clinic History

Histórico poderá ser derivado de:

```text
Appointments

Clinical Encounters

Clinic Relationships
```

conforme domínio.

---

# 109. Clinics and Medical Records

Medical Record deverá preservar contexto de Clinic quando clinicamente ou operacionalmente relevante.

---

# 110. Historical Clinic Reference

Arquivar Clinic não deverá invalidar Medical Records associados.

---

# 111. Clinics and Exams

Exam poderá possuir Clinic Context.

---

# 112. Clinics and Prescriptions

Prescription poderá registrar unidade de emissão quando necessário.

---

# 113. Clinics and Finance

Finance poderá segmentar dados por Clinic.

Exemplos:

```text
Revenue

Costs

Receivables

Performance
```

---

# 114. Financial Ownership

Clinic não deverá duplicar Ledger financeiro.

Finance continua Source of Truth.

---

# 115. Clinics and Payments

Payment poderá possuir referência à Clinic quando relevante.

Payment Processing continua pertencendo ao módulo Payments.

---

# 116. Clinics and Reports

Reports poderá filtrar:

```text
Organization

Clinic

Professional

Period
```

---

# 117. Cross-Clinic Reports

Usuário somente deverá agregar Clinics que possui autorização para visualizar.

---

# 118. Clinics and Notifications

Clinic poderá fornecer:

```text
Display Name

Phone

Address

Timezone
```

para Templates.

Notifications continua responsável pela entrega.

---

# 119. Clinics and Telemedicine

Telemedicine Appointment poderá estar associado a Clinic mesmo sem presença física.

Clinic poderá representar unidade organizacional responsável pelo atendimento.

---

# 120. Virtual Clinic

Futuramente poderá existir conceito de:

```text
Virtual Clinic
```

mas não deverá ser introduzido antes de necessidade real.

---

# 121. Clinics and AI

AI poderá utilizar Clinic Context.

Exemplo:

```text
"Mostre os horários disponíveis
na Unidade Centro amanhã."
```

---

# 122. AI Authorization

AI deverá receber apenas Clinics autorizadas ao usuário.

---

# 123. AI Cannot Create Scope

Se usuário possui acesso apenas à Clinic Centro:

```text
AI request for Clinic Norte

↓

Denied
```

---

# 124. Clinic Search

Busca administrativa poderá utilizar:

```text
Name

Code

City

Status
```

---

# 125. Pagination

Organizations grandes deverão utilizar Pagination.

---

# 126. Filtering

Filtros possíveis:

```text
status

city

state

country

service

professional
```

quando suportados.

---

# 127. API Conceitual

Possíveis endpoints:

```text
GET    /clinics
POST   /clinics
GET    /clinics/{id}
PATCH  /clinics/{id}

POST   /clinics/{id}/activate
POST   /clinics/{id}/deactivate
POST   /clinics/{id}/archive

GET    /clinics/{id}/hours
PUT    /clinics/{id}/hours

GET    /clinics/{id}/professionals
GET    /clinics/{id}/services
```

São contratos conceituais.

---

# 128. Explicit Lifecycle Commands

Para alterações de estado importantes, preferir:

```text
archiveClinic()

deactivateClinic()

activateClinic()
```

em vez de:

```text
status = arbitraryValue
```

---

# 129. Service Contract

Exemplo:

```ts
interface ClinicService {
  create(input: CreateClinicInput): Promise<Clinic>;

  update(
    clinicId: string,
    input: UpdateClinicInput
  ): Promise<Clinic>;

  activate(clinicId: string): Promise<Clinic>;

  deactivate(clinicId: string): Promise<Clinic>;

  archive(clinicId: string): Promise<Clinic>;
}
```

---

# 130. Operating Hours Service

```ts
interface ClinicHoursService {
  get(clinicId: string): Promise<ClinicOperatingHours>;

  update(
    clinicId: string,
    input: UpdateOperatingHoursInput
  ): Promise<ClinicOperatingHours>;

  resolveForDate(
    clinicId: string,
    date: string
  ): Promise<ResolvedOperatingHours>;
}
```

---

# 131. Domain Events

Possíveis:

```text
clinic.created

clinic.updated

clinic.activated

clinic.deactivated

clinic.archived

clinic.hours_updated

clinic.professional_added

clinic.professional_removed

clinic.service_enabled

clinic.service_disabled
```

---

# 132. Event Payload

Payload deverá ser mínimo.

Exemplo:

```json
{
  "event": "clinic.archived",
  "clinicId": "clinic_...",
  "organizationId": "org_...",
  "occurredAt": "..."
}
```

---

# 133. Event Consumers

Possíveis consumidores:

```text
Appointments

Notifications

Reports

Search

Audit

Integrations
```

---

# 134. Eventual Consistency

Atualizações secundárias poderão ser assíncronas.

---

# 135. Clinic Archive Workflow

Arquivar Clinic deverá verificar dependências.

```text
Archive Requested

↓

Permission

↓

Future Appointments?

↓

Active Professionals?

↓

Active Services?

↓

Operational Warning / Resolution

↓

Archive

↓

Events

↓

Audit
```

---

# 136. Archive Validation

Sistema não deverá permitir Archive destrutivo sem informar impactos relevantes.

---

# 137. Future Appointments

Se existirem Appointments futuros:

```text
Block Archive

or

Require Resolution
```

conforme Policy definida.

---

# 138. Deactivate vs Archive

`inactive` poderá representar pausa operacional.

`archived` representa retirada de operação.

Não deverão ser tratados como sinônimos.

---

# 139. Audit

Mudanças administrativas relevantes deverão ser auditadas.

Exemplos:

```text
Clinic Created

Clinic Archived

Timezone Changed

Operating Hours Changed

Professional Membership Changed

Service Availability Changed
```

---

# 140. Audit Metadata

Possível:

```text
actor

organization

clinic

action

timestamp

changedFields
```

sem armazenar dados desnecessários.

---

# 141. Sensitive Changes

Timezone e Schedule Changes poderão possuir alto impacto operacional.

---

# 142. Change History

Algumas configurações poderão necessitar histórico além do Audit.

---

# 143. Operating Hours History

Se alteração de horário impactar interpretação histórica, poderá ser necessário preservar versões.

---

# 144. Effective Dating

Futuramente, configurações poderão possuir:

```text
effectiveFrom

effectiveUntil
```

---

# 145. Scheduled Configuration

Exemplo:

```text
New operating hours
starting next month.
```

Poderá justificar configuração temporal.

---

# 146. Do Not Overbuild

Effective Dating não deverá ser implementado em todos os Settings antecipadamente.

---

# 147. Validation

Clinic Input deverá validar:

```text
Name

Timezone

Locale

Contact

Address

Operating Hours

Status
```

---

# 148. Operating Hours Validation

Não permitir intervalos inválidos:

```text
18:00 → 08:00
```

sem semântica explícita de overnight.

---

# 149. Overlapping Hours

Configuração como:

```text
08:00 → 12:00

11:00 → 14:00
```

deverá ser normalizada ou rejeitada.

---

# 150. Overnight Hours

Se Clinics 24h ou horários atravessando meia-noite forem suportados, regra deverá ser explícita.

---

# 151. Address Validation

Não depender exclusivamente de Geocoding Provider para validar existência de endereço.

---

# 152. Error Model

Possíveis códigos:

```text
CLINIC_NOT_FOUND

CLINIC_NOT_ALLOWED

CLINIC_ALREADY_ARCHIVED

CLINIC_HAS_FUTURE_APPOINTMENTS

CLINIC_INVALID_TIMEZONE

CLINIC_INVALID_HOURS

CLINIC_INVALID_ADDRESS

CLINIC_CODE_ALREADY_EXISTS

CLINIC_PROFESSIONAL_NOT_ALLOWED

CLINIC_SERVICE_NOT_AVAILABLE

CLINIC_CROSS_TENANT_ACCESS
```

---

# 153. Error Messages

API deverá separar:

```text
Stable Error Code

from

Human-Friendly Message
```

---

# 154. Observability

Módulo deverá possuir:

```text
Logs

Metrics

Traces

Audit
```

---

# 155. Technical Metrics

Possíveis:

```text
clinic_query_latency

clinic_update_failure_rate

clinic_context_switch_errors

clinic_schedule_resolution_latency
```

---

# 156. Product Metrics

Possíveis:

```text
Active Clinics

Clinics per Organization

Professionals per Clinic

Appointments per Clinic

Services per Clinic
```

---

# 157. Operational Metrics

Poderão alimentar Reports sem transformar Clinics em Analytics Engine.

---

# 158. Logs

Evitar registrar dados administrativos ou pessoais desnecessariamente.

---

# 159. Clinic Context Logging

IDs poderão ser utilizados para correlação quando apropriado.

---

# 160. Performance

Listagens de Clinics deverão evitar N+1 Queries.

---

# 161. Membership Queries

Consulta de Professionals por Clinic deverá possuir índices apropriados.

---

# 162. Appointment Queries

`clinicId` provavelmente será dimensão importante para Scheduling.

A estratégia final deverá acompanhar Database Design.

---

# 163. Caching

Dados relativamente estáveis como:

```text
Clinic Name

Timezone

Basic Settings
```

poderão ser candidatos a Cache.

---

# 164. Cache Invalidation

Alterações administrativas deverão invalidar Cache correspondente.

---

# 165. Timezone Cache

Timezone incorreta em Cache pode causar erros graves de Scheduling.

Correctness deverá prevalecer.

---

# 166. Security

Clinic Management é funcionalidade administrativa.

---

# 167. Create Clinic

Somente Roles autorizadas deverão criar unidade.

---

# 168. Archive Clinic

Deverá exigir Permission específica ou administrativa adequada.

---

# 169. Manage Hours

Não deverá ser implicitamente concedido a todo usuário que pode visualizar Clinic.

---

# 170. Manage Membership

Adicionar Professional a Clinic deverá verificar:

```text
Same Organization

Professional Status

Actor Permission
```

---

# 171. Cross-Organization Professional

Um vínculo não deverá conectar acidentalmente:

```text
Professional from Organization A

to

Clinic from Organization B
```

---

# 172. Database Constraints

Quando possível, Database deverá reforçar invariantes de Tenant.

---

# 173. Mass Assignment

Atualização de Clinic não deverá permitir alteração arbitrária de:

```text
organizationId

status

security-sensitive settings
```

---

# 174. Organization Transfer

`organizationId` não deverá fazer parte de Update DTO comum.

---

# 175. Privacy

Clinic em si possui muitos dados organizacionais, mas relações com Patients e Professionals podem envolver dados pessoais e de saúde.

Queries deverão respeitar minimização.

---

# 176. Public Endpoint

Caso existam páginas públicas de Clinics, DTO público deverá ser separado do DTO administrativo.

---

# 177. Public DTO

Exemplo:

```text
name

publicAddress

publicPhone

publicHours

availableServices
```

---

# 178. Internal DTO

Poderá possuir dados adicionais administrativos.

---

# 179. No Internal Leakage

Nunca serializar Entity completa e apenas "esconder no Frontend".

---

# 180. Testing Strategy

---

# 181. Unit Tests

Cobrir:

```text
Lifecycle

Operating Hours

Exception Resolution

Configuration Inheritance

Validation

Permissions
```

---

# 182. Integration Tests

Cobrir:

```text
Organization Ownership

Professional Membership

Service Membership

Database Constraints

Domain Events
```

---

# 183. Tenant Isolation Tests

Essenciais:

```text
User Organization A

cannot read/update

Clinic Organization B
```

---

# 184. Archive Tests

Testar:

```text
Clinic without dependencies

Clinic with future appointments

Already archived clinic

Unauthorized archive
```

---

# 185. Timezone Tests

Cobrir Timezones reais e mudanças relevantes.

---

# 186. Operating Hours Tests

Cobrir:

```text
Multiple intervals

Closed days

Exceptions

Holiday

Special hours
```

---

# 187. Context Switch Tests

Para UI multi-clinic:

```text
Switch A → B

↓

All relevant data changes
```

---

# 188. Authorization Tests

Cobrir:

```text
Admin

Reception

Professional

Restricted Clinic User

Unauthorized User
```

---

# 189. E2E Tests

Fluxos prioritários:

```text
Create Clinic

Configure Hours

Associate Professional

Enable Service

Schedule Appointment

Deactivate Clinic

Archive Clinic
```

---

# 190. Accessibility

Clinic Switcher deverá ser navegável por teclado.

---

# 191. Clinic Selector

Não depender apenas de:

```text
Logo

Color
```

para identificar unidade.

---

# 192. Long Lists

Organizations com muitas Clinics deverão possuir Search e navegação acessível.

---

# 193. Mobile

Clinic Context deverá permanecer visível o suficiente para evitar operações na unidade errada.

---

# 194. Destructive Operations

Archive deverá possuir confirmação clara.

---

# 195. Confirmation Content

Confirmação deverá explicar impacto, não apenas:

```text
Are you sure?
```

---

# 196. Current / Planned / Future

A matriz deverá ser sincronizada com o código real.

| Capacidade | Estado |
|------------|--------|
| Cadastro básico de Clinic | Current / validar com implementação |
| Organization Association | Current / validar com implementação |
| Clinic Status | Current / validar com implementação |
| Address / Contact | Current / validar com implementação |
| Clinic Context | Current / validar com implementação |
| Operating Hours | Planned |
| Professional Membership | Planned / validar com implementação |
| Clinic Services | Planned |
| Clinic-Specific Settings | Planned |
| Multi-Clinic Advanced Permissions | Planned |
| Schedule Exceptions | Planned |
| Rooms | Future |
| Equipment Resources | Future |
| Public Clinic Pages | Future |
| Virtual Clinic | Future |
| Geographic Search | Future |
| Advanced Configuration Effective Dating | Future |

> `Current / validar com implementação` significa que a capacidade deverá ser confirmada no código e ERD antes de ser considerada contrato definitivo.

---

# 197. Domain Invariants

```text
Every Clinic belongs to one Organization.

Clinic does not replace Organization as Tenant.

Clinic identity does not depend on its name.

Organization ownership is not casually mutable.

Archived Clinic preserves history.

Inactive Clinic is not the same as Archived Clinic.

Clinic timezone is explicit.

Clinic operating hours do not equal Professional availability.

Professional membership does not duplicate Professional identity.

Patient identity should not be duplicated per Clinic.

Cross-tenant Clinic access is forbidden.

Clinic configuration cannot weaken mandatory platform policies.
```

---

# 198. Decisões Arquiteturais e de Produto

## ADR-781

Organization permanecerá o Tenant Boundary principal e Clinic será uma unidade operacional dentro desse Tenant.

---

## ADR-782

Toda Clinic deverá possuir Organization Ownership explícito.

---

## ADR-783

Clinic Name não será utilizado como identificador técnico estável.

---

## ADR-784

Transferência de Clinic entre Organizations não será tratada como atualização administrativa comum.

---

## ADR-785

Clinic Lifecycle distinguirá estado ativo, inativo e arquivado quando esses estados forem suportados.

---

## ADR-786

Archive de Clinic não implicará exclusão de seu histórico.

---

## ADR-787

Physical Deletion de Clinics historicamente referenciadas será excepcional.

---

## ADR-788

Address será modelado de maneira compatível com expansão internacional quando necessário.

---

## ADR-789

Coordinates geográficas não serão requisito para existência básica de Clinic sem necessidade operacional.

---

## ADR-790

Timezone operacional de Clinic será explícita.

---

## ADR-791

Timezone não será representada apenas por UTC Offset fixo.

---

## ADR-792

Mudanças de Timezone serão tratadas como operações de impacto operacional.

---

## ADR-793

Locale afetará apresentação e defaults apropriados, não representação canônica dos dados.

---

## ADR-794

Operating Hours de Clinic permanecerão distintos da Availability de Professionals.

---

## ADR-795

Operating Hours deverão permitir múltiplos intervalos no mesmo dia quando necessário.

---

## ADR-796

Schedule Exceptions específicas terão precedência sobre Weekly Schedule padrão.

---

## ADR-797

Emergency Closure não cancelará silenciosamente Appointments futuros.

---

## ADR-798

Professional poderá atuar em múltiplas Clinics sem duplicação de sua identidade principal.

---

## ADR-799

Remoção de Professional de uma Clinic preservará histórico anterior.

---

## ADR-800

Desativação de vínculo de Professional deverá considerar impacto em Appointments futuros.

---

## ADR-801

Disponibilidade de Service poderá variar por Clinic.

---

## ADR-802

Overrides locais de Service somente serão introduzidos quando houver necessidade operacional validada.

---

## ADR-803

Rooms e Equipment não serão adicionados antecipadamente ao domínio sem necessidade real de Resource Scheduling.

---

## ADR-804

Reception utilizará Clinic como contexto operacional explícito.

---

## ADR-805

Default Clinic será preferência de contexto e não mecanismo de Authorization.

---

## ADR-806

Clinic Switcher não poderá causar divergência entre contexto apresentado e recurso realmente modificado.

---

## ADR-807

Clinic Scope será validado Server-Side quando utilizado para Authorization.

---

## ADR-808

Conhecimento de Clinic ID não concederá acesso ao recurso.

---

## ADR-809

Informações públicas de Clinic utilizarão DTOs separados de informações administrativas internas.

---

## ADR-810

Configuração poderá utilizar herança Platform → Organization → Clinic somente para Settings explicitamente suportadas.

---

## ADR-811

Clinic Overrides não poderão enfraquecer Security, Compliance ou Tenant Isolation obrigatórios.

---

## ADR-812

Configuration Resolution deverá ser determinística.

---

## ADR-813

Patient Identity não será duplicada por Clinic apenas porque o Patient utiliza múltiplas unidades da mesma Organization.

---

## ADR-814

Arquivamento de Clinic não invalidará referências históricas em Medical Records, Exams, Appointments ou Finance.

---

## ADR-815

Finance continuará sendo Source of Truth financeiro mesmo quando dados forem segmentados por Clinic.

---

## ADR-816

Reports multi-clinic somente agregarão unidades autorizadas ao usuário.

---

## ADR-817

Notifications poderá consumir informações da Clinic, mas continuará responsável por Delivery.

---

## ADR-818

Telemedicine poderá utilizar Clinic como contexto organizacional mesmo em atendimentos virtuais.

---

## ADR-819

AI não poderá ampliar o Clinic Scope autorizado do usuário.

---

## ADR-820

Lifecycle Changes importantes utilizarão operações explícitas em vez de Mass Assignment de Status.

---

## ADR-821

Domain Events de Clinic deverão possuir Payload mínimo e evitar dados desnecessários.

---

## ADR-822

Archive Workflow deverá avaliar dependências operacionais relevantes antes de conclusão.

---

## ADR-823

`inactive` e `archived` não serão tratados como estados equivalentes.

---

## ADR-824

Alterações administrativas de alto impacto deverão ser auditáveis.

---

## ADR-825

Effective Dating somente será introduzido em configurações quando houver necessidade real.

---

## ADR-826

Operating Hours inválidos ou ambiguamente sobrepostos deverão ser rejeitados ou normalizados de maneira determinística.

---

## ADR-827

Organization Ownership não será campo mutável em DTO administrativo comum de Clinic.

---

## ADR-828

Relações Professional–Clinic deverão garantir pertencimento válido ao Tenant.

---

## ADR-829

Database Constraints deverão reforçar invariantes de Tenant quando tecnicamente apropriado.

---

## ADR-830

Clinic Management deverá utilizar Permissions granulares separadas de Read Access.

---

## ADR-831

Clinic Context em Mobile deverá permanecer suficientemente claro para reduzir operações na unidade incorreta.

---

## ADR-832

Operações destrutivas ou de alto impacto deverão comunicar consequências antes da confirmação.

---

## ADR-833

Timezone, Clinic Status e Operating Hours serão considerados dados operacionais críticos.

---

## ADR-834

Caching de Clinic Configuration não poderá comprometer corretude de Scheduling.

---

## ADR-835

Clinic não armazenará cópias paralelas dos domínios Patients, Professionals ou Finance.

---

## ADR-836

Virtual Clinic permanecerá conceito futuro até existir necessidade operacional validada.

---

## ADR-837

Public Clinic Discovery não será confundida com acesso administrativo ao domínio Clinics.

---

## ADR-838

Módulos consumidores deverão referenciar Clinic por identidade estável e não por nome.

---

## ADR-839

Mudanças no módulo deverão preservar histórico mesmo após reorganizações físicas ou administrativas das unidades.

---

## ADR-840

Clinics deverá continuar sendo um domínio operacional subordinado ao Tenant Organization, evitando sua evolução acidental para um segundo modelo concorrente de tenancy.

---

# 199. Relação com Outros Módulos

```text
                     Organization
                          │
                          ▼
                       Clinics
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
   Professionals     Appointments      Reception
          │               │                │
          └───────────────┼────────────────┘
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
          Patients      Reports      Settings
             │
             ▼
      Medical Records

Clinics
   │
   ├────────► Notifications
   ├────────► Finance
   ├────────► Payments
   ├────────► Exams
   ├────────► Telemedicine
   └────────► AI
```

---

# 200. Dependency Rules

Clinics poderá fornecer contexto aos outros módulos.

Entretanto:

```text
Clinic

does not own

Appointment lifecycle.
```

```text
Clinic

does not own

Patient identity.
```

```text
Clinic

does not own

Professional identity.
```

```text
Clinic

does not own

Financial ledger.
```

---

# 201. Checklist — Create Clinic

```text
[ ] Actor authenticated
[ ] Organization resolved
[ ] Permission validated
[ ] Name valid
[ ] Code valid when provided
[ ] Code unique in Organization
[ ] Timezone valid
[ ] Locale valid when provided
[ ] Address validated
[ ] Contact validated
[ ] Tenant ownership explicit
[ ] Defaults resolved
[ ] Audit created
```

---

# 202. Checklist — Update Clinic

```text
[ ] Clinic exists
[ ] Tenant matches
[ ] Permission valid
[ ] organizationId cannot be changed
[ ] Changed fields allowed
[ ] Timezone impact evaluated
[ ] Hours validated
[ ] Cache invalidated
[ ] Audit recorded
```

---

# 203. Checklist — Archive Clinic

```text
[ ] Clinic exists
[ ] Tenant matches
[ ] Permission valid
[ ] Clinic not already archived
[ ] Future appointments checked
[ ] Active professional relationships checked
[ ] Active services checked
[ ] Operational impact shown
[ ] Required resolution completed
[ ] Archive persisted
[ ] Event emitted
[ ] Cache invalidated
[ ] Audit recorded
```

---

# 204. Checklist — Professional Membership

```text
[ ] Professional exists
[ ] Clinic exists
[ ] Same Organization
[ ] Actor authorized
[ ] Membership not duplicated
[ ] Future scheduling considered
[ ] Event emitted
[ ] Audit recorded
```

---

# 205. Checklist — Operating Hours

```text
[ ] Clinic active or administratively editable
[ ] Actor authorized
[ ] Timezone known
[ ] Weekdays valid
[ ] Start/end valid
[ ] No accidental overlap
[ ] Closed days represented correctly
[ ] Exceptions considered
[ ] Scheduling cache invalidated
[ ] Audit recorded
```

---

# 206. Checklist — Code Review

```text
[ ] Organization remains tenant boundary
[ ] organizationId cannot be arbitrarily changed
[ ] Clinic ID is used instead of name as identity
[ ] Cross-tenant access is impossible
[ ] Permissions are server-side
[ ] No patient duplication per clinic
[ ] No professional duplication per clinic
[ ] Timezone is explicit
[ ] Operating hours are not treated as professional availability
[ ] Archive preserves history
[ ] Future appointments are considered
[ ] Public/internal DTOs are separated
[ ] No arbitrary settings override
[ ] Events contain minimal payload
[ ] Audit exists for critical changes
[ ] Tests updated
[ ] Documentation updated
```

---

# 207. Definition of Done

Uma Feature do módulo Clinics não estará concluída apenas porque a unidade aparece em um Dropdown.

Ela deverá preservar:

```text
Tenant Correctness

+

Operational Correctness

+

Authorization

+

Historical Integrity

+

Timezone Correctness

+

Configuration Consistency

+

Auditability

+

Accessibility

+

Observability

+

Documentation
```

---

# 208. Failure Scenarios

A arquitetura deverá considerar situações como:

```text
Admin archives Clinic with future appointments.

Professional is removed while appointments still exist.

Clinic timezone is changed.

Receptionist switches Clinic in one browser tab.

Another tab still contains old context.

Two Clinics have the same display name.

A user manually changes clinicId in a request.

A Clinic is archived but reports still need historical data.

Geocoding provider is unavailable.

Operating hours overlap.

A holiday conflicts with custom special hours.

AI asks for data from an unauthorized Clinic.
```

Cada cenário deverá possuir comportamento previsível.

---

# 209. Anti-Patterns

Evitar:

```text
Clinic name as foreign key.
```

```text
One Patient copy per Clinic.
```

```text
One Professional copy per Clinic.
```

```text
Clinic used as Tenant.
```

```text
organizationId editable from generic form.
```

```text
Archive = DELETE FROM clinics.
```

```text
Timezone inferred from browser.
```

```text
Clinic hours = Professional availability.
```

```text
Frontend clinic filter = Authorization.
```

---

# 210. Future Evolution

Possível evolução:

```text
Basic Clinic Registry

↓

Multi-Clinic Context

↓

Operating Hours

↓

Professional Membership

↓

Service Availability

↓

Clinic-Specific Configuration

↓

Advanced Reception Operations

↓

Rooms / Resources

↓

Geographic Discovery

↓

International Operations
```

Essa sequência não representa compromisso de Release.

---

# 211. Para Futuros Desenvolvedores

Se este módulo estiver sendo alterado anos depois, a pergunta mais importante continuará sendo:

```text
Is this a property
of the Organization

or

of the Clinic?
```

Confundir essas duas coisas poderá criar problemas estruturais difíceis de corrigir.

Pergunte também:

```text
Does this belong to Clinic

or

is Clinic merely the context?
```

Exemplo:

```text
Appointment

belongs to Appointments.

Clinic is context.
```

```text
Payment

belongs to Payments.

Clinic may be context.
```

```text
Medical Record

belongs to Medical Records.

Clinic may be historical context.
```

Essa distinção protege os boundaries.

---

# 212. Invariante Final

Independentemente de quantas unidades uma Organization possua:

```text
One Organization

may operate

Many Clinics

without becoming

Many Tenants.
```

Clinics deverão permitir separação operacional sem fragmentar artificialmente o sistema.

---

# 213. Considerações Finais

Uma plataforma pequena pode começar com uma única unidade.

Nesse momento, parece desnecessário distinguir:

```text
Organization

from

Clinic.
```

Mas essa decisão se torna crítica quando a operação cresce.

Uma empresa poderá possuir:

```text
1 Clinic

↓

3 Clinics

↓

20 Clinics

↓

100 Clinics
```

e o modelo deverá continuar fazendo sentido.

O erro seria construir inicialmente:

```text
Organization = Clinic
```

e anos depois descobrir que:

```text
Patients

Professionals

Reports

Finance

Permissions

Settings
```

precisam funcionar entre múltiplas unidades.

O módulo Clinics existe para impedir esse acoplamento.

```text
Organization defines ownership.

Clinic defines operational context.
```

Essa separação permitirá que o MedFlow cresça sem duplicar Patients, Professionals ou regras de negócio apenas porque uma organização abriu uma nova unidade.

A unidade poderá mudar de nome.

Poderá mudar de endereço.

Poderá fechar temporariamente.

Poderá ser arquivada.

A Organization poderá continuar existindo.

E o histórico deverá continuar compreensível.

```text
Operational structures change.

Historical truth must survive.
```

Esse deverá ser o princípio duradouro do módulo `Clinics`.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação da documentação oficial do módulo Clinics, definindo relação Organization–Clinic, lifecycle, multi-clinic, timezone, horários operacionais, Professionals, Services, Reception, configuração, autorização, segurança, histórico, integrações e decisões ADR-781 a ADR-840 | Equipe MedFlow |