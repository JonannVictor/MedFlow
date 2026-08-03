# Módulo de Pacientes (Patients)

| Campo | Valor |
|-------|--------|
| Documento | Patients |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Modules |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# 1. Visão Geral

O módulo **Patients** representa a identidade clínica do paciente dentro do ecossistema MedFlow.

Seu objetivo não é armazenar toda a história clínica.

Essa responsabilidade pertence ao módulo **Medical Records**.

O módulo Patients existe para representar quem é o paciente.

---

# 2. Princípio Fundamental

```text
Patient

≠

Medical Record
```

Um paciente pode existir antes de possuir qualquer atendimento.

Da mesma forma, poderá existir durante anos sem possuir um prontuário completo.

---

# 3. Objetivo

O módulo deverá responder perguntas como:

```text
Quem é o paciente?

Como identificá-lo?

Como entrar em contato?

Quais organizações possuem cadastro deste paciente?

Quais clínicas pertencem ao paciente?

Qual seu status?

Quais contatos de emergência possui?

Quais documentos possui?

Quais preferências cadastrou?
```

---

# 4. Source of Truth

Patients será o Source of Truth para:

```text
Patient Identity

Demographic Data

Contact Information

Emergency Contacts

Identifiers

Patient Preferences

Basic Profile
```

---

# 5. Escopo

Este módulo será responsável por:

- Cadastro de pacientes
- Dados pessoais
- Documentos
- Telefones
- Emails
- Endereços
- Contatos de emergência
- Preferências
- Status do paciente
- Identificadores
- Relacionamentos organizacionais

---

# 6. Fora do Escopo

Não pertence ao módulo:

- Prontuário
- Exames
- Prescrições
- Agenda
- Financeiro
- IA
- Pagamentos

Esses módulos apenas referenciam o paciente.

---

# 7. Filosofia

Patients representa identidade.

Medical Records representa história clínica.

Essa separação deverá permanecer durante toda evolução da plataforma.

---

# 8. Bounded Context

```text
                Patients
                    │
 ┌────────────┬─────┼──────────────┬──────────────┐
 ▼            ▼     ▼              ▼              ▼
Appointments Medical Records Finance Prescriptions Exams
                    │
                    ▼
              Notifications
```

Patients fornece identidade.

Os demais módulos fornecem contexto.

---

# 9. Domain Boundary

Patients nunca deverá armazenar:

```text
Diagnósticos

SOAP

Medicamentos

Resultados laboratoriais

Procedimentos
```

---

# 10. Entidade Principal

```text
Patient

├── id
├── organizationId
├── fullName
├── preferredName
├── birthDate
├── gender
├── status
├── createdAt
├── updatedAt
└── metadata
```

---

# 11. Identity

Todo Patient possuirá:

```text
id
```

imutável.

---

# 12. Human Identifier

O sistema poderá gerar:

```text
PAT-000001
```

para facilitar atendimento.

Esse código nunca será Primary Key.

---

# 13. Organization Ownership

Todo paciente deverá possuir:

```text
organizationId
```

---

# 14. Multi-Tenant

Pacientes pertencem a uma organização.

Nenhum acesso cross-tenant deverá ser permitido.

---

# 15. Patient Status

Possíveis estados:

```text
active

inactive

deceased

archived
```

---

# 16. Status ≠ Exclusão

Paciente inativo continua existindo.

---

# 17. Soft Delete

Excluir pacientes deverá ser evitado.

Preferir:

```text
Inactive

Archived
```

---

# 18. Personal Information

Dados básicos:

```text
Nome

Nome Social

Sexo

Nascimento

Estado Civil

Nacionalidade
```

---

# 19. Preferred Name

O sistema deverá permitir nome preferencial.

---

# 20. Legal Name

Nome legal deverá permanecer preservado.

---

# 21. Birth Date

Nascimento deverá utilizar tipo de dado apropriado.

Nunca armazenar apenas idade.

---

# 22. Age

Idade deverá ser calculada.

Nunca persistida.

---

# 23. Gender

Modelo deverá permitir evolução futura.

Evitar implementações rígidas.

---

# 24. Civil Status

Exemplos:

```text
Single

Married

Divorced

Widowed
```

---

# 25. Nationality

Campo estruturado.

---

# 26. Contact Information

Patients deverá possuir contatos estruturados.

---

# 27. Contact Entity

```text
PatientContact

├── id
├── patientId
├── type
├── value
├── primary
└── verified
```

---

# 28. Contact Types

```text
Email

Phone

WhatsApp

Other
```

---

# 29. Primary Contact

Apenas um contato poderá ser marcado como principal por tipo.

---

# 30. Verification

Contatos poderão ser verificados.

---

# 31. Email

Emails deverão possuir validação.

---

# 32. Phone

Telefones deverão seguir padronização internacional quando possível.

---

# 33. Address

Endereço deverá possuir entidade própria.

---

# 34. Address Entity

```text
PatientAddress

├── id
├── patientId
├── street
├── number
├── city
├── state
├── postalCode
├── country
└── metadata
```

---

# 35. Multiple Addresses

Paciente poderá possuir vários endereços.

---

# 36. Address Types

```text
Home

Work

Temporary
```

---

# 37. Emergency Contacts

O domínio deverá suportar contatos de emergência.

---

# 38. Emergency Contact

```text
EmergencyContact

├── id
├── patientId
├── name
├── relationship
├── phone
├── email
└── metadata
```

---

# 39. Relationship

Exemplos:

```text
Father

Mother

Spouse

Friend

Guardian
```

---

# 40. Guardians

Pacientes menores poderão possuir responsáveis.

---

# 41. Guardian Entity

```text
Guardian

├── id
├── patientId
├── relationship
├── legalResponsible
└── metadata
```

---

# 42. Documents

Paciente poderá possuir múltiplos documentos.

---

# 43. Patient Document

```text
PatientDocument

├── id
├── patientId
├── type
├── number
├── issuingCountry
└── metadata
```

---

# 44. Document Types

```text
CPF

RG

Passport

Driver License

National ID
```

---

# 45. Validation

Cada país poderá possuir validações específicas.

---

# 46. Duplicates

Documentos duplicados deverão ser tratados.

---

# 47. Search

Pacientes poderão ser encontrados por:

```text
Nome

CPF

Telefone

Email

Código

Documento
```

---

# 48. Merge

O sistema poderá suportar fusão de pacientes duplicados.

---

# 49. Merge Policy

Nenhuma informação deverá ser perdida durante a fusão.

---

# 50. Continuação

Na Parte 2 serão abordados:

- Identificadores
- Preferências
- Consentimentos básicos
- Relacionamentos
- Multi-Clinic
- Auditoria
- Histórico
- Versionamento
- APIs
- Eventos
- ADR-981 em diante
---

# 51. Identifiers

Além do identificador interno, um paciente poderá possuir diversos identificadores externos.

Exemplos:

```text
CPF

RG

Passport

Health Insurance ID

National Health Number

Hospital Record Number
```

---

# 52. Internal ID

O identificador interno deverá ser:

- Imutável
- Único
- Não reutilizável
- Independente de regras de negócio

---

# 53. External Identifiers

Cada identificador deverá informar sua origem.

Exemplo:

```text
Identifier

↓

Type

↓

Issuer

↓

Country
```

---

# 54. Identifier Entity

```text
PatientIdentifier

├── id
├── patientId
├── type
├── value
├── issuingAuthority
├── country
├── createdAt
└── metadata
```

---

# 55. Duplicidade

Identificadores únicos não deverão existir em dois pacientes pertencentes à mesma organização.

---

# 56. Merge Candidates

O sistema poderá identificar possíveis duplicidades utilizando:

```text
Nome

Nascimento

CPF

Telefone

Email
```

A decisão final deverá ser humana.

---

# 57. Patient Preferences

O módulo deverá armazenar preferências não clínicas.

---

# 58. Preference Entity

```text
PatientPreference

├── id
├── patientId
├── category
├── value
├── updatedAt
└── metadata
```

---

# 59. Preference Categories

Exemplos:

```text
Language

Timezone

Communication

Accessibility

Notifications
```

---

# 60. Preferred Language

O idioma preferencial deverá ser utilizado pelos demais módulos sempre que possível.

---

# 61. Communication Preferences

Exemplos:

```text
Email

SMS

WhatsApp

Push

Phone Call
```

---

# 62. Accessibility

O sistema deverá permitir registrar necessidades de acessibilidade.

Exemplos:

```text
Visual Impairment

Hearing Impairment

Mobility Assistance

Interpreter Required
```

---

# 63. Accessibility ≠ Clinical Condition

Necessidades de acessibilidade não substituem diagnósticos médicos.

---

# 64. Patient Photo

O perfil poderá possuir fotografia.

O armazenamento físico deverá permanecer sob responsabilidade do módulo Files.

---

# 65. Avatar

```text
Patient

↓

Avatar Reference

↓

Files Module
```

---

# 66. Insurance

O módulo poderá manter referências aos convênios do paciente.

---

# 67. Insurance Entity

```text
PatientInsurance

├── id
├── patientId
├── provider
├── plan
├── memberNumber
├── validUntil
└── metadata
```

---

# 68. Multiple Insurance

O paciente poderá possuir mais de um convênio.

---

# 69. Primary Insurance

Um convênio poderá ser definido como principal.

---

# 70. Insurance History

Mudanças de convênio deverão preservar histórico.

---

# 71. Relationships

O módulo deverá permitir relacionamentos entre pacientes.

---

# 72. Relationship Entity

```text
PatientRelationship

├── id
├── patientId
├── relatedPatientId
├── relationship
├── createdAt
└── metadata
```

---

# 73. Relationship Types

Exemplos:

```text
Parent

Child

Sibling

Spouse

Guardian

Dependent
```

---

# 74. Dependents

Um responsável poderá possuir diversos dependentes.

---

# 75. Household

No futuro, o sistema poderá representar grupos familiares.

---

# 76. Family Unit

Exemplo:

```text
Household

↓

Guardian

↓

Dependents
```

---

# 77. Consent Reference

O módulo poderá manter referência para consentimentos vigentes.

A gestão detalhada permanecerá em módulos especializados quando necessário.

---

# 78. Demographic History

Alterações em informações demográficas relevantes poderão ser auditadas.

---

# 79. Name Changes

Mudanças de nome deverão preservar histórico quando exigido.

---

# 80. Historical Values

Valores históricos nunca deverão ser perdidos silenciosamente.

---

# 81. Versioning

Alterações significativas deverão permitir rastreabilidade.

---

# 82. Audit

Toda alteração relevante deverá gerar evento de auditoria.

---

# 83. Audit Entity

```text
PatientAudit

├── id
├── patientId
├── actorId
├── action
├── occurredAt
├── before
├── after
└── metadata
```

---

# 84. Audit Actions

Exemplos:

```text
Created

Updated

Merged

Archived

Activated

Identifier Added

Address Updated
```

---

# 85. Merge Audit

Processos de fusão deverão registrar todas as alterações realizadas.

---

# 86. Timeline

O módulo poderá manter uma timeline administrativa do cadastro.

Essa timeline não substitui a Timeline Clínica.

---

# 87. Administrative Events

Exemplos:

```text
Patient Created

Identifier Added

Insurance Updated

Address Changed

Guardian Added
```

---

# 88. Domain Events

Patients poderá publicar:

```text
patient.created

patient.updated

patient.archived

patient.merged

patient.identifier.created
```

---

# 89. Event Ownership

Patients informa mudanças cadastrais.

Não publica eventos clínicos.

---

# 90. APIs Conceituais

```text
GET /patients

GET /patients/{id}

POST /patients

PUT /patients/{id}

POST /patients/{id}/merge

POST /patients/{id}/archive

GET /patients/search
```

---

# 91. Commands

Preferir comandos explícitos:

```text
createPatient()

updatePatient()

archivePatient()

mergePatients()

addIdentifier()

addEmergencyContact()

updateInsurance()
```

---

# 92. Search

A pesquisa deverá permitir combinação de filtros.

---

# 93. Search Filters

Exemplos:

```text
Name

Document

Birth Date

Phone

Email

Insurance

Status

Organization
```

---

# 94. Pagination

Consultas deverão utilizar paginação.

---

# 95. Sorting

Ordenações comuns:

```text
Name

CreatedAt

UpdatedAt

BirthDate
```

---

# 96. Import

O sistema poderá suportar importação de pacientes.

---

# 97. Import Validation

Importações deverão validar:

```text
Identifiers

Required Fields

Duplicates

Organization
```

---

# 98. Export

Exportações deverão respeitar permissões e políticas de privacidade.

---

# 99. Observability

Métricas sugeridas:

```text
Patients Created

Patients Updated

Merge Operations

Duplicate Candidates

Import Success Rate
```

---

# 100. Domain Invariants

```text
Every Patient belongs to one Organization.

Patient Identity is immutable.

Medical Records are not stored here.

Historical changes are auditable.

Merge never silently discards information.

Cross-tenant access is forbidden.

Patient identifiers remain unique within an Organization.

Age is always calculated.

Primary identifiers remain stable.
```

---

# 101. Decisões Arquiteturais e de Produto

## ADR-981

Patients será o Source of Truth para identidade do paciente.

---

## ADR-982

Medical Records permanecerá completamente desacoplado do cadastro do paciente.

---

## ADR-983

Identificadores externos possuirão modelagem própria.

---

## ADR-984

O domínio suportará múltiplos convênios por paciente.

---

## ADR-985

Processos de Merge preservarão todo o histórico.

---

## ADR-986

Mudanças cadastrais relevantes serão auditáveis.

---

## ADR-987

O domínio suportará múltiplos responsáveis e dependentes.

---

## ADR-988

Patient Preferences permanecerão separadas dos dados clínicos.

---

## ADR-989

Patients publicará apenas eventos administrativos.

---

## ADR-990

Toda consulta respeitará isolamento entre organizações.

---

# 102. Continuação

Na Parte 3 serão abordados:

- Segurança
- LGPD
- Multi-clinic
- Compartilhamento
- Sincronização
- Integrações
- Performance
- Escalabilidade
- ADR-991 em diante
---

# 103. Segurança

O módulo Patients armazena informações pessoais identificáveis (PII).

Esses dados representam um dos ativos mais sensíveis da plataforma MedFlow e deverão ser protegidos durante todo o seu ciclo de vida.

---

# 104. Princípios

O tratamento das informações deverá seguir os princípios de:

```text
Confidencialidade

Integridade

Disponibilidade

Rastreabilidade

Menor Privilégio

Necessidade
```

---

# 105. Dados Pessoais

Exemplos:

```text
Nome

CPF

RG

Telefone

Email

Endereço

Nascimento

Foto

Documentos
```

---

# 106. Dados Sensíveis

Embora o domínio Patients não armazene dados clínicos, diversos dados pessoais possuem alto grau de sensibilidade.

Sua exposição poderá comprometer a privacidade do paciente.

---

# 107. LGPD

O módulo deverá ser compatível com a Lei Geral de Proteção de Dados (LGPD).

A arquitetura deverá permitir evolução para novas regulamentações internacionais.

---

# 108. Data Classification

Cada atributo poderá possuir classificação.

Exemplo:

```text
Public

Internal

Confidential

Restricted
```

---

# 109. Restricted Data

Exemplos:

```text
CPF

Passaporte

RG

Insurance Number

Emergency Contacts
```

---

# 110. Consentimento

O módulo poderá armazenar referências aos consentimentos concedidos pelo paciente.

A gestão detalhada poderá existir em módulo especializado.

---

# 111. Privacy by Design

Toda funcionalidade nova deverá considerar privacidade desde sua concepção.

---

# 112. Data Minimization

Nunca solicitar informações que não sejam necessárias.

---

# 113. Least Privilege

Cada usuário visualizará apenas as informações necessárias para sua função.

---

# 114. Recepção

A recepção poderá visualizar:

```text
Cadastro

Contato

Convênio

Agenda
```

Mas não necessariamente:

```text
Informações administrativas restritas

Histórico de auditoria

Exportações
```

---

# 115. Multi-Clinic

Um paciente poderá ser atendido em diversas clínicas pertencentes à mesma organização.

---

# 116. Organization vs Clinic

```text
Organization

↓

Clinic A

Clinic B

Clinic C
```

O paciente pertence à organização.

O atendimento ocorre na clínica.

---

# 117. Cross Clinic

O compartilhamento entre clínicas dependerá das políticas da organização.

---

# 118. Multi Organization

Por padrão, pacientes não serão compartilhados entre organizações distintas.

---

# 119. Shared Identity (Future)

No futuro, poderá existir uma camada de identidade compartilhada entre organizações.

Essa evolução não deverá alterar o domínio atual.

---

# 120. Data Ownership

O cadastro pertence à organização responsável.

---

# 121. Importação

Migrações de pacientes deverão preservar:

```text
Identifiers

CreatedAt

Historical References

Audit Origin
```

---

# 122. External Systems

O cadastro poderá ser sincronizado com:

```text
ERP

CRM

Government Systems

Health Insurance

FHIR Servers
```

---

# 123. Synchronization

Sincronizações deverão ser explícitas.

Nunca implícitas.

---

# 124. Source of Truth

Mesmo durante sincronizações:

```text
Patients

↓

Source of Truth
```

---

# 125. Conflict Resolution

Quando houver conflito entre sistemas:

```text
Internal Record

↓

Validation

↓

Merge

↓

Audit
```

Nunca substituir automaticamente informações sem rastreabilidade.

---

# 126. Provenance

Toda informação importada deverá registrar sua origem.

---

# 127. Synchronization Status

Exemplo:

```text
Pending

Synced

Conflict

Failed
```

---

# 128. APIs Externas

Integrações deverão utilizar contratos estáveis.

---

# 129. Versionamento

Mudanças de contrato deverão possuir versionamento.

---

# 130. API Stability

Mudanças incompatíveis deverão evitar quebrar consumidores existentes.

---

# 131. Event Driven

O módulo poderá publicar eventos administrativos.

---

# 132. Event Bus

Fluxo:

```text
Patients

↓

patient.updated

↓

Event Bus

↓

Consumers
```

---

# 133. Event Consumers

Exemplos:

```text
Appointments

Finance

Medical Records

Notifications

Analytics

AI
```

---

# 134. Idempotência

Consumidores deverão suportar eventos duplicados.

---

# 135. APIs Conceituais

```text
GET    /patients

GET    /patients/{id}

POST   /patients

PUT    /patients/{id}

PATCH  /patients/{id}

POST   /patients/import

POST   /patients/export

GET    /patients/search
```

---

# 136. Search Optimization

A pesquisa deverá ser otimizada para grandes volumes.

---

# 137. Search Index

Poderá existir índice dedicado para busca textual.

---

# 138. Performance

Consultas frequentes deverão utilizar índices apropriados.

---

# 139. Escalabilidade

O domínio deverá suportar milhões de pacientes.

---

# 140. Horizontal Scaling

A camada de leitura deverá permitir escalabilidade horizontal.

---

# 141. Caching

Cache poderá ser utilizado para consultas frequentes.

Nunca comprometer consistência.

---

# 142. Observabilidade

O módulo deverá produzir:

```text
Logs

Metrics

Distributed Traces
```

---

# 143. Logs

Logs nunca deverão armazenar documentos completos ou informações sensíveis desnecessárias.

---

# 144. Métricas

Exemplos:

```text
Patients Created

Patients Updated

Duplicate Candidates

Merge Count

Search Latency

Import Success Rate
```

---

# 145. Dashboards

Administradores poderão acompanhar indicadores operacionais do módulo.

---

# 146. Alertas

Exemplos:

```text
Falhas de Importação

Taxa elevada de duplicidade

Falhas de sincronização

Erros de integração
```

---

# 147. Auditoria

Toda alteração crítica deverá permanecer rastreável.

---

# 148. Audit Trail

Registrar:

```text
Who

When

Before

After

Reason

Source
```

---

# 149. Exportação

Toda exportação de dados pessoais deverá ser auditada.

---

# 150. Compartilhamento

Toda operação de compartilhamento deverá respeitar políticas da organização.

---

# 151. Domain Invariants

```text
Every Patient belongs to one Organization.

Patient Identity is immutable.

Identifiers remain unique within an Organization.

Cross-tenant access is forbidden.

Historical changes are auditable.

Imported records preserve provenance.

Synchronization never silently overwrites data.

Age is derived, never persisted.

Patients never store clinical history.
```

---

# 152. Decisões Arquiteturais e de Produto

## ADR-991

Patients adotará Privacy by Design como princípio arquitetural.

---

## ADR-992

Toda sincronização registrará Provenance.

---

## ADR-993

Conflitos de sincronização nunca serão resolvidos silenciosamente.

---

## ADR-994

Pacientes pertencerão a uma única Organization.

---

## ADR-995

Clínicas representarão contexto operacional e não propriedade do cadastro.

---

## ADR-996

O domínio suportará evolução futura para identidade compartilhada entre organizações.

---

## ADR-997

Eventos administrativos serão publicados através do Event Bus.

---

## ADR-998

Exportações de dados pessoais serão auditadas obrigatoriamente.

---

## ADR-999

Toda pesquisa deverá respeitar isolamento entre organizações.

---

## ADR-1000

Patients permanecerá exclusivamente responsável pela identidade administrativa do paciente, mantendo separação completa do domínio clínico.

---

# 153. Continuação

Na Parte 4 serão abordados:

- Arquitetura de domínio avançada
- Relacionamentos complexos
- Household
- Dependentes
- Representantes legais
- Internacionalização
- Estratégias de Merge
- Resolução de conflitos
- Anti-Patterns
- Future Evolution
---

# 154. Arquitetura do Domínio

O módulo Patients deverá permanecer pequeno, coeso e focado exclusivamente na identidade administrativa do paciente.

Toda informação clínica deverá permanecer desacoplada deste domínio.

---

# 155. Aggregate Root

A entidade **Patient** deverá atuar como Aggregate Root.

Todas as alterações relevantes deverão ocorrer através dela ou de serviços de domínio apropriados.

---

# 156. Aggregate Boundary

O Aggregate Patient será responsável por garantir consistência entre:

```text
Patient

PatientContact

PatientAddress

PatientIdentifier

EmergencyContact

Guardian

PatientPreference

PatientInsurance
```

---

# 157. Entidades Externas

O Aggregate não deverá controlar diretamente:

```text
Medical Records

Appointments

Finance

Prescriptions

Exams
```

Esses módulos apenas referenciam `patientId`.

---

# 158. Household

O domínio poderá evoluir para representar grupos familiares.

---

# 159. Household Entity

```text
Household

├── id
├── organizationId
├── name
├── createdAt
├── updatedAt
└── metadata
```

---

# 160. Household Members

Um Household poderá conter:

```text
Guardian

Parent

Child

Dependent

Spouse
```

---

# 161. Household Purpose

O objetivo não é compartilhar prontuários.

O objetivo é facilitar:

- faturamento;
- contatos;
- responsáveis;
- agendamentos familiares.

---

# 162. Household ≠ Family Tree

Household representa um agrupamento operacional.

Não modela genealogia completa.

---

# 163. Dependents

Dependentes deverão possuir relacionamento explícito.

---

# 164. Dependency Entity

```text
Dependency

├── guardianId
├── dependentId
├── relationship
├── validFrom
├── validUntil
└── metadata
```

---

# 165. Multiple Guardians

Um paciente poderá possuir múltiplos responsáveis.

---

# 166. Guardianship

Nem todo responsável legal representa um vínculo biológico.

---

# 167. Legal Representative

Representantes legais deverão possuir entidade própria.

---

# 168. Legal Representative Entity

```text
LegalRepresentative

├── id
├── patientId
├── type
├── name
├── document
├── validUntil
└── metadata
```

---

# 169. Representative Types

Exemplos:

```text
Parent

Legal Guardian

Attorney

Caregiver

Institution
```

---

# 170. Validity

Representações poderão possuir prazo de validade.

---

# 171. Authorization

O sistema deverá permitir verificar rapidamente quem possui autorização para agir em nome do paciente.

---

# 172. Contact Priority

Contatos poderão possuir prioridade.

Exemplo:

```text
Primary

Secondary

Emergency
```

---

# 173. Emergency Priority

Durante emergências, contatos marcados como emergência deverão ser facilmente identificáveis.

---

# 174. Internacionalização

O domínio deverá suportar pacientes internacionais.

---

# 175. International Documents

Nem todo país utiliza:

```text
CPF

RG
```

O modelo deverá permanecer flexível.

---

# 176. Locale

O paciente poderá possuir:

```text
Locale

Timezone

Language

Country
```

---

# 177. Address Format

O endereço deverá permitir adaptações conforme o país.

---

# 178. Phone Format

Telefones deverão utilizar padrão internacional quando possível.

---

# 179. Character Encoding

Todos os campos textuais deverão suportar Unicode.

---

# 180. Merge Strategy

O processo de Merge deverá ser tratado como operação de domínio.

---

# 181. Merge Workflow

Fluxo conceitual:

```text
Duplicate Candidate

↓

Review

↓

Approval

↓

Merge

↓

Audit

↓

Archive Old Record
```

---

# 182. Automatic Merge

O sistema nunca deverá fundir pacientes automaticamente.

---

# 183. Duplicate Detection

O sistema poderá sugerir duplicidades utilizando algoritmos de similaridade.

---

# 184. Similarity Factors

Exemplos:

```text
Nome

Nascimento

Documento

Telefone

Email
```

---

# 185. Merge Result

Após a fusão:

- nenhum histórico deverá ser perdido;
- identificadores deverão ser preservados;
- referências deverão continuar válidas.

---

# 186. Referential Integrity

Todos os módulos que utilizam `patientId` deverão permanecer consistentes após Merge.

---

# 187. Merge Audit

Todo Merge deverá registrar:

```text
Source Patient

Target Patient

Reason

Responsible

Timestamp
```

---

# 188. Archived Record

O registro antigo poderá permanecer arquivado para auditoria.

---

# 189. Restore

Caso permitido pela política da organização, um Merge poderá ser revertido apenas por procedimento administrativo controlado.

---

# 190. Search Ranking

Resultados de busca poderão utilizar ranking.

---

# 191. Ranking Factors

Exemplos:

```text
Exact Identifier

Exact Name

Partial Name

Birth Date

Phone

Email
```

---

# 192. Performance

Pesquisas deverão permanecer rápidas mesmo com milhões de pacientes.

---

# 193. Read Optimization

Consultas frequentes poderão utilizar projeções de leitura.

---

# 194. CQRS Read Model

No futuro poderão existir modelos especializados para:

```text
Reception

Emergency

Search

Administration
```

---

# 195. Bulk Operations

Operações em lote deverão respeitar auditoria.

---

# 196. Batch Import

Importações em massa deverão possuir:

```text
Validation

Preview

Conflict Report

Rollback Strategy
```

---

# 197. Export Policy

Exportações deverão informar:

```text
Who

When

Reason

Scope
```

---

# 198. API Stability

Contratos públicos deverão permanecer estáveis entre versões.

---

# 199. Backward Compatibility

Mudanças incompatíveis deverão possuir estratégia de migração.

---

# 200. Domain Events

Novos eventos poderão incluir:

```text
patient.guardian.created

patient.insurance.updated

patient.preference.updated

patient.identifier.verified
```

---

# 201. Observabilidade

O módulo deverá disponibilizar métricas de uso administrativo.

---

# 202. Métricas

Exemplos:

```text
Patients Imported

Merge Suggestions

Guardian Relationships

Insurance Updates

Search Accuracy
```

---

# 203. Dashboards

Administradores poderão acompanhar indicadores operacionais.

---

# 204. Domain Invariants

```text
Every Household belongs to one Organization.

Every Patient has one immutable identity.

Merge never destroys historical references.

Legal Representatives preserve validity periods.

Guardianship is explicit.

International patients are fully supported.

Search never bypasses tenant isolation.
```

---

# 205. Decisões Arquiteturais e de Produto

## ADR-1001

Patient continuará sendo o Aggregate Root do domínio.

---

## ADR-1002

Households serão agrupamentos administrativos, não clínicos.

---

## ADR-1003

Merge será uma operação explícita e auditável.

---

## ADR-1004

Nenhum Merge ocorrerá automaticamente.

---

## ADR-1005

Representantes legais possuirão modelagem própria.

---

## ADR-1006

O domínio suportará internacionalização desde sua concepção.

---

## ADR-1007

Read Models especializados poderão ser adicionados futuramente.

---

## ADR-1008

Importações em massa possuirão validação obrigatória.

---

## ADR-1009

Todos os contratos públicos deverão preservar compatibilidade sempre que possível.

---

## ADR-1010

Patients continuará sendo exclusivamente responsável pela identidade administrativa do paciente.

---

# 206. Continuação

Na Parte 5 serão abordados:

- Segurança avançada
- Auditoria detalhada
- Observabilidade
- Estratégias de recuperação
- Backup
- APIs avançadas
- Testabilidade
- Anti-Patterns
- Future Evolution
- ADR-1011 até ADR-1020
---

# 207. Segurança Avançada

O módulo Patients deverá proteger informações pessoais durante todo o ciclo de vida do cadastro.

A proteção deverá abranger:

- armazenamento;
- transmissão;
- consulta;
- exportação;
- integração;
- auditoria.

---

# 208. Security Principles

Toda implementação deverá seguir:

```text
Least Privilege

Defense in Depth

Zero Trust

Need to Know

Privacy by Default
```

---

# 209. Autorização

Toda operação deverá validar:

```text
Organization

↓

Role

↓

Permission

↓

Patient Scope
```

Nenhuma operação deverá depender apenas da autenticação.

---

# 210. Field-Level Security

Alguns atributos poderão possuir proteção individual.

Exemplo:

```text
CPF

Passport

Insurance Number

National Identifier
```

Nem todo usuário autorizado a visualizar o cadastro poderá visualizar esses campos.

---

# 211. Masking

Campos sensíveis poderão ser apresentados parcialmente.

Exemplo:

```text
CPF

123.***.***-45
```

---

# 212. Data Exposure

Interfaces deverão retornar apenas os atributos necessários para cada contexto.

---

# 213. Principle of Minimum Disclosure

Sempre retornar:

```text
Only what is needed.
```

Nunca:

```text
Everything available.
```

---

# 214. Encryption at Rest

Informações sensíveis deverão suportar criptografia em repouso.

---

# 215. Encryption in Transit

Toda comunicação deverá utilizar TLS.

---

# 216. Secrets

Credenciais nunca deverão ser armazenadas junto aos dados do paciente.

---

# 217. Auditoria Avançada

Toda alteração administrativa relevante deverá ser registrada.

---

# 218. Audit Trail

Registrar:

```text
Actor

Timestamp

Action

Before

After

Reason

Source

IP (quando disponível)

Session
```

---

# 219. Read Audit

Quando exigido pela política da organização, consultas ao cadastro poderão ser auditadas.

---

# 220. Export Audit

Toda exportação deverá registrar:

```text
Who

When

Why

Scope

Destination
```

---

# 221. Import Audit

Importações deverão registrar:

```text
Origin

Operator

Import File

Result

Conflicts
```

---

# 222. Merge Audit

Merge deverá registrar todas as entidades afetadas.

---

# 223. Restore Audit

Caso exista reversão de Merge, todo o processo deverá permanecer auditável.

---

# 224. Observabilidade

O domínio deverá fornecer informações operacionais suficientes para monitoramento.

---

# 225. Logs

Logs deverão conter apenas informações técnicas necessárias.

Nunca registrar documentos completos ou dados pessoais desnecessários.

---

# 226. Metrics

Exemplos:

```text
Patients Created

Patients Updated

Search Requests

Import Jobs

Export Jobs

Merge Operations
```

---

# 227. Distributed Tracing

Fluxos distribuídos deverão permitir rastreamento ponta a ponta.

---

# 228. Dashboards

Administradores poderão acompanhar:

```text
Novos Pacientes

Cadastros Arquivados

Duplicidades

Tempo Médio de Busca

Falhas de Importação
```

---

# 229. Alertas

Alertas poderão ser emitidos quando:

```text
Grande volume de exportações

Falhas consecutivas

Duplicidades elevadas

Importações inválidas
```

---

# 230. Disaster Recovery

O módulo deverá suportar recuperação após falhas críticas.

---

# 231. Backup

Backups deverão preservar:

```text
Identity

Identifiers

Relationships

Audit

Preferences
```

---

# 232. Restore

Processos de restauração deverão ser periodicamente testados.

---

# 233. Consistência

Após restauração, referências para outros módulos deverão permanecer válidas.

---

# 234. Availability

O cadastro do paciente deverá permanecer disponível mesmo durante indisponibilidade de módulos clínicos.

---

# 235. Resiliência

Falhas em integrações externas não deverão impedir operações administrativas locais.

---

# 236. APIs Avançadas

Operações complexas poderão incluir:

```text
POST /patients/merge

POST /patients/import

POST /patients/export

POST /patients/{id}/archive

POST /patients/{id}/restore

POST /patients/{id}/verify-identifier
```

---

# 237. Validation

Toda API deverá validar:

```text
Organization

Permission

Payload

Business Rules
```

---

# 238. Error Model

Possíveis erros:

```text
PATIENT_NOT_FOUND

IDENTIFIER_ALREADY_EXISTS

INVALID_DOCUMENT

MERGE_NOT_ALLOWED

IMPORT_FAILED

EXPORT_NOT_ALLOWED

GUARDIAN_REQUIRED
```

---

# 239. Pagination

Grandes consultas deverão utilizar paginação consistente.

---

# 240. Filtering

Filtros poderão ser combinados.

---

# 241. Sorting

Ordenações comuns:

```text
Name

Birth Date

CreatedAt

UpdatedAt

Status
```

---

# 242. Search Performance

Pesquisas deverão responder rapidamente mesmo em grandes volumes.

---

# 243. Testabilidade

O domínio deverá ser totalmente coberto por testes automatizados.

---

# 244. Testes Unitários

Cobrir:

```text
Patient

Merge

Identifiers

Contacts

Guardians

Insurance
```

---

# 245. Testes de Integração

Validar:

```text
Persistence

APIs

Import

Export

Search

Audit
```

---

# 246. Testes de Concorrência

Validar múltiplas atualizações simultâneas.

---

# 247. Testes de Segurança

Verificar:

```text
Permissions

Tenant Isolation

Field Security

Export Rules

Audit
```

---

# 248. Testes de Performance

Avaliar:

```text
Search

Import

Export

Merge

Bulk Operations
```

---

# 249. Anti-Patterns

Evitar:

```text
Duplicar dados clínicos.

Usar CPF como Primary Key.

Excluir pacientes definitivamente.

Realizar Merge automático.

Misturar cadastro com prontuário.

Compartilhar pacientes entre organizações sem política explícita.
```

---

# 250. Future Evolution

Possíveis evoluções:

```text
FHIR Patient

National Health Registry

International Patient Identity

Cross Organization Identity

Biometric Identification

Digital Identity Wallet
```

---

# 251. Domain Invariants

```text
Every Patient has one immutable identity.

Patient Profile never stores clinical history.

Audit is never optional.

Exports are auditable.

Imports preserve provenance.

Search respects tenant isolation.

Identifiers remain unique.

Relationships preserve referential integrity.
```

---

# 252. Decisões Arquiteturais e de Produto

## ADR-1011

Dados sensíveis poderão possuir segurança em nível de campo.

---

## ADR-1012

Exportações sempre serão auditadas.

---

## ADR-1013

Merge continuará sendo uma operação administrativa explícita.

---

## ADR-1014

Patients permanecerá disponível independentemente dos módulos clínicos.

---

## ADR-1015

Backup preservará identidade e relacionamentos.

---

## ADR-1016

Integrações externas nunca substituirão registros locais silenciosamente.

---

## ADR-1017

APIs validarão permissões antes das regras de negócio.

---

## ADR-1018

Todos os erros utilizarão códigos padronizados.

---

## ADR-1019

O domínio será preparado para integração futura com padrões internacionais.

---

## ADR-1020

Patients manterá foco exclusivo na identidade administrativa, preservando separação completa dos demais domínios.

---

# 253. Continuação

Na Parte 6 serão abordados:

- Arquitetura orientada a eventos
- Event Bus
- CQRS
- Read Models
- KPIs
- Failure Scenarios
- Checklists
- Definition of Done
- ADR-1021 até ADR-1030
---

# 254. Arquitetura Orientada a Eventos

O módulo Patients deverá publicar eventos administrativos para informar alterações relevantes aos demais módulos da plataforma.

Esses eventos representam mudanças cadastrais, nunca alterações clínicas.

---

# 255. Event Bus

Fluxo conceitual:

```text
Patients

↓

Domain Event

↓

Event Bus

↓

Subscribers
```

---

# 256. Eventos Publicados

Exemplos:

```text
patient.created

patient.updated

patient.archived

patient.restored

patient.merged

patient.identifier.created

patient.contact.updated

patient.address.updated

patient.guardian.created

patient.insurance.updated
```

---

# 257. Consumidores

Exemplos:

```text
Appointments

Medical Records

Finance

Prescriptions

Notifications

Analytics

AI

Audit
```

---

# 258. Responsabilidade

Patients informa:

```text
O cadastro mudou.
```

Os módulos consumidores decidem como utilizar essa informação.

---

# 259. Event Versioning

Todo evento deverá possuir:

```text
Event Name

Version

OccurredAt

OrganizationId

PatientId
```

---

# 260. Event Payload

Exemplo:

```json
{
  "event": "patient.updated",
  "version": 1,
  "patientId": "...",
  "organizationId": "...",
  "occurredAt": "..."
}
```

---

# 261. Idempotência

Consumidores deverão suportar processamento duplicado sem efeitos colaterais.

---

# 262. Retry

Eventos não processados poderão ser reenviados.

---

# 263. Dead Letter Queue

Eventos que excederem o limite de tentativas poderão ser enviados para análise.

---

# 264. CQRS

A arquitetura deverá permitir evolução para CQRS.

Sem alterar o domínio principal.

---

# 265. Command Side

Operações de escrita:

```text
Create Patient

Update Patient

Archive Patient

Merge Patient

Add Identifier

Add Contact
```

---

# 266. Query Side

Consultas especializadas poderão utilizar projeções.

---

# 267. Read Models

Exemplos:

```text
Reception View

Search View

Emergency View

Insurance View

Administration View
```

---

# 268. Search Projection

Pesquisas poderão utilizar índice otimizado.

---

# 269. Dashboard Projection

Painéis administrativos poderão utilizar projeções independentes.

---

# 270. Cache

Cache deverá acelerar consultas.

Nunca substituir o Source of Truth.

---

# 271. Cache Invalidation

Atualizações relevantes deverão invalidar projeções afetadas.

---

# 272. APIs Públicas

Contratos deverão permanecer estáveis.

---

# 273. API Versioning

Mudanças incompatíveis deverão gerar nova versão da API.

---

# 274. Backward Compatibility

Sempre que possível, preservar compatibilidade com integrações existentes.

---

# 275. KPIs

Indicadores possíveis:

```text
Patients Created

Patients Archived

Merge Operations

Duplicate Rate

Search Latency

Import Success

Export Success
```

---

# 276. Business Metrics

Exemplos:

```text
Pacientes ativos

Novos pacientes por mês

Pacientes inativos

Convênios cadastrados

Responsáveis cadastrados
```

---

# 277. Operational Metrics

Exemplos:

```text
API Latency

Error Rate

Merge Duration

Import Duration

Search Response Time
```

---

# 278. Health Checks

O módulo deverá expor indicadores de saúde.

---

# 279. Dependency Monitoring

Monitorar integrações críticas.

---

# 280. Failure Scenarios

Exemplos:

```text
Import interrompido

Export cancelado

Merge incompleto

Documento duplicado

Integração indisponível

Busca lenta

Evento duplicado
```

---

# 281. Recovery

Falhas deverão permitir recuperação sem perda de identidade do paciente.

---

# 282. Consistência

Mesmo após falhas:

```text
Patient Identity

↓

Preservada
```

---

# 283. Checklists

## Criar Paciente

```text
[ ] Organization válida

[ ] Nome informado

[ ] Data de nascimento válida

[ ] Documento validado

[ ] Auditoria criada
```

---

## Atualizar Cadastro

```text
[ ] Permissão validada

[ ] Campos obrigatórios preservados

[ ] Auditoria registrada

[ ] Eventos publicados
```

---

## Merge

```text
[ ] Pacientes revisados

[ ] Responsável autorizado

[ ] Auditoria criada

[ ] Referências preservadas

[ ] Histórico mantido
```

---

## Importação

```text
[ ] Arquivo validado

[ ] Duplicidades analisadas

[ ] Pré-visualização concluída

[ ] Auditoria criada
```

---

## Exportação

```text
[ ] Permissão confirmada

[ ] Escopo definido

[ ] Auditoria registrada

[ ] Arquivo gerado
```

---

# 284. Checklist de Code Review

```text
[ ] Tenant Isolation preservado

[ ] Identidade imutável

[ ] Sem dados clínicos

[ ] Eventos publicados

[ ] Auditoria implementada

[ ] Testes atualizados

[ ] APIs documentadas

[ ] Logs sem dados sensíveis
```

---

# 285. Definition of Done

Uma funcionalidade do módulo Patients somente estará concluída quando preservar:

```text
Identity

+

Security

+

Auditability

+

Scalability

+

Observability

+

Documentation

+

Automated Tests
```

---

# 286. Domain Invariants

```text
Patient Identity never changes.

Every Patient belongs to one Organization.

Historical references are preserved.

Merge never destroys data.

Clinical information remains outside this domain.

Identifiers remain unique.

Audit is mandatory.

Cross-tenant access is forbidden.
```

---

# 287. Performance Guidelines

O domínio deverá responder rapidamente às operações mais frequentes:

- pesquisa de pacientes;
- abertura de cadastro;
- atualização de contatos;
- validação de documentos.

---

# 288. Escalabilidade

A arquitetura deverá suportar dezenas de milhões de pacientes sem alteração do modelo de domínio.

---

# 289. Evolução

Novas funcionalidades deverão ampliar o domínio sem romper seus princípios fundamentais.

---

# 290. Continuação

Na Parte 7 serão apresentados:

- Considerações finais
- Future Evolution detalhado
- Anti-Patterns completos
- ADR-1021 até ADR-1030
- Arquitetura consolidada
- Histórico de versões
- Encerramento oficial do módulo
---

# 254. Arquitetura Orientada a Eventos

O módulo Patients deverá publicar eventos administrativos para informar alterações relevantes aos demais módulos da plataforma.

Esses eventos representam mudanças cadastrais, nunca alterações clínicas.

---

# 255. Event Bus

Fluxo conceitual:

```text
Patients

↓

Domain Event

↓

Event Bus

↓

Subscribers
```

---

# 256. Eventos Publicados

Exemplos:

```text
patient.created

patient.updated

patient.archived

patient.restored

patient.merged

patient.identifier.created

patient.contact.updated

patient.address.updated

patient.guardian.created

patient.insurance.updated
```

---

# 257. Consumidores

Exemplos:

```text
Appointments

Medical Records

Finance

Prescriptions

Notifications

Analytics

AI

Audit
```

---

# 258. Responsabilidade

Patients informa:

```text
O cadastro mudou.
```

Os módulos consumidores decidem como utilizar essa informação.

---

# 259. Event Versioning

Todo evento deverá possuir:

```text
Event Name

Version

OccurredAt

OrganizationId

PatientId
```

---

# 260. Event Payload

Exemplo:

```json
{
  "event": "patient.updated",
  "version": 1,
  "patientId": "...",
  "organizationId": "...",
  "occurredAt": "..."
}
```

---

# 261. Idempotência

Consumidores deverão suportar processamento duplicado sem efeitos colaterais.

---

# 262. Retry

Eventos não processados poderão ser reenviados.

---

# 263. Dead Letter Queue

Eventos que excederem o limite de tentativas poderão ser enviados para análise.

---

# 264. CQRS

A arquitetura deverá permitir evolução para CQRS.

Sem alterar o domínio principal.

---

# 265. Command Side

Operações de escrita:

```text
Create Patient

Update Patient

Archive Patient

Merge Patient

Add Identifier

Add Contact
```

---

# 266. Query Side

Consultas especializadas poderão utilizar projeções.

---

# 267. Read Models

Exemplos:

```text
Reception View

Search View

Emergency View

Insurance View

Administration View
```

---

# 268. Search Projection

Pesquisas poderão utilizar índice otimizado.

---

# 269. Dashboard Projection

Painéis administrativos poderão utilizar projeções independentes.

---

# 270. Cache

Cache deverá acelerar consultas.

Nunca substituir o Source of Truth.

---

# 271. Cache Invalidation

Atualizações relevantes deverão invalidar projeções afetadas.

---

# 272. APIs Públicas

Contratos deverão permanecer estáveis.

---

# 273. API Versioning

Mudanças incompatíveis deverão gerar nova versão da API.

---

# 274. Backward Compatibility

Sempre que possível, preservar compatibilidade com integrações existentes.

---

# 275. KPIs

Indicadores possíveis:

```text
Patients Created

Patients Archived

Merge Operations

Duplicate Rate

Search Latency

Import Success

Export Success
```

---

# 276. Business Metrics

Exemplos:

```text
Pacientes ativos

Novos pacientes por mês

Pacientes inativos

Convênios cadastrados

Responsáveis cadastrados
```

---

# 277. Operational Metrics

Exemplos:

```text
API Latency

Error Rate

Merge Duration

Import Duration

Search Response Time
```

---

# 278. Health Checks

O módulo deverá expor indicadores de saúde.

---

# 279. Dependency Monitoring

Monitorar integrações críticas.

---

# 280. Failure Scenarios

Exemplos:

```text
Import interrompido

Export cancelado

Merge incompleto

Documento duplicado

Integração indisponível

Busca lenta

Evento duplicado
```

---

# 281. Recovery

Falhas deverão permitir recuperação sem perda de identidade do paciente.

---

# 282. Consistência

Mesmo após falhas:

```text
Patient Identity

↓

Preservada
```

---

# 283. Checklists

## Criar Paciente

```text
[ ] Organization válida

[ ] Nome informado

[ ] Data de nascimento válida

[ ] Documento validado

[ ] Auditoria criada
```

---

## Atualizar Cadastro

```text
[ ] Permissão validada

[ ] Campos obrigatórios preservados

[ ] Auditoria registrada

[ ] Eventos publicados
```

---

## Merge

```text
[ ] Pacientes revisados

[ ] Responsável autorizado

[ ] Auditoria criada

[ ] Referências preservadas

[ ] Histórico mantido
```

---

## Importação

```text
[ ] Arquivo validado

[ ] Duplicidades analisadas

[ ] Pré-visualização concluída

[ ] Auditoria criada
```

---

## Exportação

```text
[ ] Permissão confirmada

[ ] Escopo definido

[ ] Auditoria registrada

[ ] Arquivo gerado
```

---

# 284. Checklist de Code Review

```text
[ ] Tenant Isolation preservado

[ ] Identidade imutável

[ ] Sem dados clínicos

[ ] Eventos publicados

[ ] Auditoria implementada

[ ] Testes atualizados

[ ] APIs documentadas

[ ] Logs sem dados sensíveis
```

---

# 285. Definition of Done

Uma funcionalidade do módulo Patients somente estará concluída quando preservar:

```text
Identity

+

Security

+

Auditability

+

Scalability

+

Observability

+

Documentation

+

Automated Tests
```

---

# 286. Domain Invariants

```text
Patient Identity never changes.

Every Patient belongs to one Organization.

Historical references are preserved.

Merge never destroys data.

Clinical information remains outside this domain.

Identifiers remain unique.

Audit is mandatory.

Cross-tenant access is forbidden.
```

---

# 287. Performance Guidelines

O domínio deverá responder rapidamente às operações mais frequentes:

- pesquisa de pacientes;
- abertura de cadastro;
- atualização de contatos;
- validação de documentos.

---

# 288. Escalabilidade

A arquitetura deverá suportar dezenas de milhões de pacientes sem alteração do modelo de domínio.

---

# 289. Evolução

Novas funcionalidades deverão ampliar o domínio sem romper seus princípios fundamentais.

---

# 290. Continuação

Na Parte 7 serão apresentados:

- Considerações finais
- Future Evolution detalhado
- Anti-Patterns completos
- ADR-1021 até ADR-1030
- Arquitetura consolidada
- Histórico de versões
- Encerramento oficial do módulo
---

# 291. Arquitetura Consolidada

O módulo Patients deverá permanecer um domínio administrativo, independente e altamente reutilizável.

Sua responsabilidade é representar a identidade do paciente durante todo o ciclo de vida dentro do MedFlow.

Arquitetura conceitual:

```text
                 Patients
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   Identity      Contacts     Documents
        │            │            │
        ├────────────┼────────────┤
        ▼
 Relationships
        │
        ▼
 Preferences
        │
        ▼
 Domain Events
```

---

# 292. Responsabilidade Arquitetural

Patients deverá responder apenas:

```text
Quem é o paciente?
```

Jamais:

```text
Como ele foi tratado?
```

Essa responsabilidade pertence ao Medical Records.

---

# 293. Relação com Outros Módulos

```text
Patients
    │
    ├────────► Appointments
    │
    ├────────► Medical Records
    │
    ├────────► Finance
    │
    ├────────► Prescriptions
    │
    ├────────► Exams
    │
    ├────────► Notifications
    │
    └────────► AI
```

Todos os módulos utilizam `patientId`.

Nenhum deles altera diretamente o domínio Patients.

---

# 294. Anti-Corruption Layer

Integrações externas nunca deverão alterar diretamente o Aggregate Patient.

Toda comunicação deverá ocorrer através de APIs ou Commands oficiais.

---

# 295. Future Evolution

O domínio foi projetado para suportar futuras evoluções, como:

```text
FHIR Patient Resource

National Health Registry

Digital Identity

Cross-Organization Identity

Biometric Identification

Patient Portal

Self Registration

Digital Wallet

International Health Standards
```

Sem necessidade de remodelar a entidade principal.

---

# 296. Anti-Patterns

Evitar:

```text
Misturar cadastro com prontuário.

Usar CPF como chave primária.

Excluir pacientes definitivamente.

Permitir Merge automático.

Duplicar informações clínicas.

Compartilhar dados entre organizações.

Persistir idade.

Criar dependência entre módulos clínicos e cadastro.

Modificar identidade do paciente silenciosamente.

Ignorar auditoria.
```

---

# 297. Arquitetura de Longo Prazo

O domínio deverá permanecer válido mesmo após:

- migração de banco de dados;
- troca de framework;
- mudança de linguagem;
- evolução para microsserviços;
- adoção de Event Sourcing;
- adoção de CQRS;
- integração internacional.

A modelagem de domínio deverá sobreviver às mudanças tecnológicas.

---

# 298. Princípios Permanentes

Independentemente da evolução do sistema:

```text
Identity is immutable.

Patient is not Medical Record.

Audit is mandatory.

History is preserved.

Organization boundaries are respected.

Clinical data remains outside this domain.
```

Esses princípios nunca deverão ser violados.

---

# 299. ADRs Finais

## ADR-1021

Patient continuará sendo o Aggregate Root exclusivo do domínio.

---

## ADR-1022

A identidade do paciente será permanente e imutável.

---

## ADR-1023

Dados clínicos jamais serão armazenados no módulo Patients.

---

## ADR-1024

Toda alteração relevante produzirá auditoria.

---

## ADR-1025

O domínio permanecerá preparado para padrões internacionais como FHIR.

---

## ADR-1026

Merge será sempre reversível apenas através de processo administrativo controlado.

---

## ADR-1027

Relacionamentos familiares serão tratados como contexto administrativo.

---

## ADR-1028

Integrações utilizarão eventos versionados e APIs estáveis.

---

## ADR-1029

Patients permanecerá desacoplado dos módulos consumidores.

---

## ADR-1030

O módulo Patients será a única fonte oficial de identidade administrativa dos pacientes em todo o ecossistema MedFlow.

---

# 300. Definition of Success

O domínio Patients será considerado bem projetado quando:

- puder evoluir sem quebrar integrações;
- suportar milhões de pacientes;
- preservar identidade e histórico;
- manter segurança e privacidade;
- permanecer desacoplado dos domínios clínicos;
- atender requisitos regulatórios;
- servir como base para toda a plataforma.

---

# 301. Considerações Finais

Patients representa o ponto de entrada de todos os pacientes no MedFlow.

Ele não contém a história clínica, os exames ou as prescrições.

Seu papel é garantir que exista uma identidade consistente, segura e auditável para cada pessoa cadastrada na plataforma.

Todas as decisões arquiteturais apresentadas neste documento têm como objetivo garantir:

```text
Integridade

Escalabilidade

Segurança

Privacidade

Auditabilidade

Interoperabilidade

Sustentabilidade
```

Esses princípios deverão orientar toda evolução futura do módulo.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação da documentação oficial do módulo Patients, definindo identidade do paciente, contatos, documentos, relacionamentos, segurança, auditoria, integrações, escalabilidade e ADR-981 a ADR-1030 | Equipe MedFlow |