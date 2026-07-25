# Resumos por Inteligência Artificial (AI Summaries)

| Campo | Valor |
|-------|--------|
| Documento | AI Summaries |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | AI |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

O **AI Summaries** define a arquitetura oficial para geração de resumos assistidos por Inteligência Artificial dentro do MedFlow.

Resumos representam uma das capacidades mais relevantes da AI Platform, pois permitem transformar grandes volumes de informações clínicas, administrativas e operacionais em representações menores, estruturadas e contextualizadas.

Entretanto, resumir informações em um sistema de saúde não consiste apenas em reduzir texto.

Um resumo incorreto pode:

- Omitir informação relevante.
- Alterar significado clínico.
- Confundir temporalidade.
- Misturar informações de fontes diferentes.
- Transformar hipótese em diagnóstico confirmado.
- Apresentar informação desatualizada como atual.
- Introduzir conteúdo inexistente.

Por esse motivo, o MedFlow deverá tratar **AI Summarization como um pipeline controlado**, e não como uma chamada genérica a um Large Language Model.

---

# Objetivos

O AI Summaries possui os seguintes objetivos:

- Reduzir carga cognitiva dos usuários.
- Facilitar compreensão de históricos extensos.
- Organizar informações clínicas.
- Resumir consultas.
- Estruturar registros.
- Apoiar documentação profissional.
- Facilitar análise longitudinal.
- Preservar informações clinicamente relevantes.
- Garantir rastreabilidade das informações utilizadas.
- Reduzir risco de hallucination.
- Permitir validação humana.
- Padronizar resumos produzidos pela AI Platform.

---

# Princípio Fundamental

A seguinte regra é considerada uma invariante arquitetural:

```text
Summary ≠ Source of Truth
```

O resumo representa uma **visão derivada** das informações oficiais existentes no MedFlow.

As entidades originais continuam sendo a fonte oficial.

Exemplo:

```text
MedicalRecord

Appointment

Exam

Prescription

ClinicalEvolution

↓

AI Summary

↓

Derived Information
```

Caso exista divergência:

```text
Original Source > AI Summary
```

---

# Filosofia

Todo resumo deverá preservar quatro propriedades fundamentais:

```text
Faithfulness

Relevance

Traceability

Temporal Accuracy
```

---

# Faithfulness

O resumo deverá permanecer fiel às informações fornecidas.

A IA não deverá:

- Inventar fatos.
- Completar lacunas por suposição.
- Transformar suspeitas em confirmações.
- Alterar valores.
- Criar eventos inexistentes.
- Inferir diagnóstico como fato.
- Adicionar medicamentos não registrados.

Regra:

```text
No Evidence

↓

No Claim
```

---

# Relevance

O resumo deverá apresentar apenas informações relevantes ao objetivo solicitado.

Um resumo para recepção não possui o mesmo contexto de um resumo clínico.

Um resumo financeiro não deverá receber prontuário completo.

Um resumo de consulta não precisa necessariamente receber todo o histórico longitudinal do paciente.

---

# Traceability

Informações utilizadas para produzir resumos deverão manter referência às suas fontes sempre que tecnicamente aplicável.

Exemplo:

```text
Summary Statement

↓

Source Reference

↓

MedicalRecord ID

Appointment ID

Exam ID

Prescription ID
```

Isso permitirá investigar como determinada informação chegou ao resumo.

---

# Temporal Accuracy

Informações clínicas possuem dimensão temporal.

O sistema deverá distinguir corretamente:

```text
Past

Current

Planned

Cancelled

Resolved

Unknown
```

Exemplo incorreto:

```text
Paciente utiliza medicamento X.
```

quando a fonte informa:

```text
Medicamento X suspenso em 2025.
```

O Summary Pipeline deverá preservar temporalidade sempre que relevante.

---

# Escopo

AI Summaries poderá ser utilizado para:

- Consultas.
- Prontuários.
- Evoluções.
- Histórico longitudinal.
- Exames.
- Prescrições.
- Timeline clínica.
- Relatórios.
- Documentos.
- Conversas autorizadas.
- Informações administrativas.
- Informações financeiras.
- Dashboards.

Este documento prioriza os requisitos mais restritivos dos **resumos clínicos**.

Resumos de menor risco poderão utilizar subconjuntos dessas regras quando documentado.

---

# Tipos de Resumo

O MedFlow deverá diferenciar explicitamente os tipos de resumo.

```text
AI Summaries

├── Consultation Summary
├── Medical Record Summary
├── Longitudinal Summary
├── SOAP Summary
├── Clinical Timeline Summary
├── Exam Summary
├── Prescription Summary
├── Administrative Summary
├── Financial Summary
└── Executive Summary
```

Cada tipo deverá possuir:

- Skill própria.
- Prompt próprio.
- Output Schema próprio.
- Context Policy própria.
- Evaluation Dataset próprio.
- Regras de segurança próprias quando necessário.

---

# Consultation Summary

## Objetivo

Resumir um atendimento específico.

Fontes possíveis:

```text
Appointment

Clinical Notes

Medical Record

Exam Results

Prescriptions

Professional Notes
```

Exemplo estrutural:

```text
Motivo da consulta

História relevante

Achados registrados

Conduta registrada

Prescrições

Exames solicitados

Orientações

Pendências
```

O formato concreto dependerá da especialidade e do contexto.

---

# Medical Record Summary

## Objetivo

Permitir compreensão rápida de um prontuário extenso.

Poderá incluir:

```text
Condições relevantes

Histórico

Alergias registradas

Medicamentos atuais

Procedimentos

Exames relevantes

Eventos recentes

Pendências
```

Informações antigas não deverão ser apresentadas como atuais.

---

# Longitudinal Summary

## Objetivo

Apresentar evolução do paciente ao longo do tempo.

Exemplo:

```text
2024
│
├── Evento A
└── Evento B

2025
│
├── Evento C
└── Evento D

2026
│
└── Evento E
```

O foco deverá estar em mudanças relevantes.

---

# SOAP Summary

O sistema poderá estruturar informações utilizando SOAP:

```text
S — Subjective

O — Objective

A — Assessment

P — Plan
```

---

# Regra SOAP

A IA não deverá preencher seções sem evidência.

Exemplo:

```text
Assessment:

"Não informado nos dados disponíveis."
```

é preferível a inventar uma avaliação.

---

# Clinical Timeline Summary

## Objetivo

Produzir uma visão cronológica dos eventos relevantes.

Eventos poderão incluir:

- Consultas.
- Diagnósticos registrados.
- Procedimentos.
- Exames.
- Prescrições.
- Internações quando aplicável.
- Alterações relevantes.

Cada evento deverá preservar sua data original.

---

# Exam Summary

## Objetivo

Organizar resultados de exames para facilitar leitura.

A IA poderá:

- Estruturar resultados.
- Agrupar informações.
- Destacar alterações explicitamente presentes.
- Comparar resultados históricos quando solicitado.

Não deverá:

- Criar diagnóstico.
- Alterar valores.
- Alterar unidades.
- Inventar referência laboratorial.
- Substituir interpretação profissional.

---

# Prescription Summary

## Objetivo

Organizar informações de prescrições existentes.

Poderá apresentar:

```text
Medication

Dose

Frequency

Route

Start Date

End Date

Status
```

Somente informações existentes nas fontes oficiais deverão ser utilizadas.

---

# Administrative Summary

Poderá resumir:

- Agenda.
- Atendimentos.
- Pendências.
- Cancelamentos.
- Fluxos operacionais.

Informações clínicas deverão ser excluídas quando não forem necessárias.

---

# Financial Summary

Poderá resumir:

- Faturamento.
- Pagamentos.
- Pendências.
- Receitas.
- Indicadores.

Acesso dependerá das permissões financeiras do usuário.

---

# Executive Summary

Poderá produzir visões agregadas para gestão.

Exemplos:

- Volume de atendimentos.
- Ocupação.
- Indicadores.
- Tendências operacionais.

Dados pessoais deverão ser minimizados quando informações agregadas forem suficientes.

---

# Arquitetura Geral

```text
Summary Request

↓

AI Gateway

↓

Identity Validation

↓

Tenant Validation

↓

Permission Engine

↓

Summary Type Resolver

↓

Summary Skill

↓

Context Planner

↓

Authorized Retrieval

↓

Source Normalization

↓

Temporal Normalization

↓

Context Reduction

↓

Prompt Engine

↓

Model Router

↓

LLM

↓

Structured Output

↓

Summary Validator

↓

Safety Layer

↓

Provenance Mapping

↓

Audit

↓

Human Review

↓

Approved Use
```

---

# Summary Type Resolver

O sistema deverá identificar explicitamente qual tipo de resumo está sendo solicitado.

Exemplo:

```text
"Resuma a consulta de hoje."

↓

Consultation Summary
```

```text
"Me dê uma visão dos últimos dois anos."

↓

Longitudinal Summary
```

A classificação deverá ser utilizada para selecionar:

- Skill.
- Prompt.
- Retrieval Strategy.
- Output Schema.
- Model.
- Evaluation Policy.

---

# Summary Skills

Cada capacidade deverá existir como uma Skill especializada.

Exemplo:

```text
Clinical Agent

├── ConsultationSummarySkill
├── MedicalRecordSummarySkill
├── SOAPSummarySkill
├── TimelineSummarySkill
├── ExamSummarySkill
└── PrescriptionSummarySkill
```

Isso evita um único prompt gigantesco responsável por todos os tipos de resumo.

---

# Context Planner

Antes de recuperar dados, o sistema deverá determinar quais informações são necessárias.

Exemplo:

```text
Request

"Resuma a última consulta."
```

Plano:

```text
1. Resolve patient
2. Resolve latest authorized appointment
3. Retrieve consultation record
4. Retrieve related prescriptions
5. Retrieve related exams when required
6. Build context
```

O sistema não deverá carregar o prontuário inteiro por padrão.

---

# Authorized Retrieval

Toda recuperação deverá respeitar:

```text
User Identity

↓

Tenant

↓

Role

↓

Permissions

↓

Resource Authorization

↓

Retrieval
```

A IA nunca poderá utilizar o processo de resumo como mecanismo para acessar dados que o usuário normalmente não poderia consultar.

---

# Source Normalization

Informações provenientes de diferentes entidades deverão ser normalizadas antes da geração.

Exemplo conceitual:

```json
{
  "sourceType": "exam",
  "sourceId": "...",
  "occurredAt": "...",
  "status": "...",
  "content": {},
  "provenance": {}
}
```

A normalização reduz ambiguidades e facilita validação.

---

# Temporal Normalization

Eventos deverão possuir representação temporal consistente.

Campos conceituais:

```text
occurred_at

recorded_at

updated_at

status

valid_from

valid_until
```

Quando disponíveis.

A data em que um dado foi registrado não deverá ser confundida com a data em que o evento ocorreu.

---

# Context Reduction

Prontuários podem possuir milhares de registros.

Não é aceitável enviar todo o histórico ao modelo indiscriminadamente.

Estratégia:

```text
Full Medical History

↓

Permission Filter

↓

Temporal Filter

↓

Relevance Filter

↓

Structured Retrieval

↓

Context Compression

↓

LLM
```

---

# Hierarchical Summarization

Históricos extensos poderão utilizar resumo hierárquico.

```text
Raw Records

↓

Event Summaries

↓

Period Summaries

↓

Longitudinal Summary
```

Exemplo:

```text
Consultas

↓

Resumo mensal

↓

Resumo anual

↓

Resumo longitudinal
```

---

# Regra de Hierarchical Summarization

Resumos intermediários não deverão apagar a relação com as fontes originais.

```text
Final Summary

↓

Intermediate Summary

↓

Original Sources
```

A cadeia de proveniência deverá permanecer reconstruível.

---

# Incremental Summarization

Para históricos extensos, o MedFlow poderá utilizar resumos incrementais.

```text
Existing Summary

+

New Verified Events

↓

Updated Summary
```

Entretanto, o resumo anterior não poderá ser tratado como única fonte.

Sempre deverá existir possibilidade de reconstrução a partir dos registros oficiais.

---

# Freshness

Resumos persistidos deverão possuir controle de atualização.

Exemplo:

```text
generated_at

source_snapshot

source_versions

stale
```

Quando uma fonte relevante for alterada:

```text
Source Updated

↓

Summary Marked Stale

↓

Regeneration Required
```

---

# Summary Cache

Alguns resumos poderão ser armazenados temporariamente para reduzir:

- Latência.
- Tokens.
- Custos.

Entretanto, cache deverá considerar:

```text
Tenant

User Permissions

Source Version

Summary Type

Prompt Version

Model Version

Context Version
```

---

# Regra de Cache Clínico

Um resumo clínico armazenado não poderá ser reutilizado se as fontes relevantes tiverem sido modificadas.

---

# Provenance Engine

O sistema deverá preservar a origem das afirmações relevantes.

Exemplo conceitual:

```text
"Paciente realizou exame X em março."

↓

Sources:

Exam:123

Appointment:456
```

---

# Citation Mapping

Quando apropriado, a interface poderá permitir que o usuário visualize a fonte de uma informação.

Exemplo:

```text
Resumo

"Exame realizado em 12/03/2026."

[Ver origem]

↓

Exam Record
```

Essa capacidade aumenta:

- Confiança.
- Auditabilidade.
- Explicabilidade.
- Velocidade de revisão.

---

# Source Conflict Detection

Fontes poderão conter informações conflitantes.

Exemplo:

```text
Record A:
Medication X active

Record B:
Medication X discontinued
```

O sistema não deverá escolher silenciosamente uma versão.

Quando não for possível resolver deterministicamente:

```text
Conflict Detected

↓

Preserve Conflict

↓

Communicate Uncertainty
```

---

# Negation Preservation

Negação possui importância crítica.

Exemplo:

```text
"Paciente nega alergia a penicilina."
```

não poderá se tornar:

```text
"Paciente possui alergia a penicilina."
```

Testes específicos deverão validar preservação de:

- Negação.
- Ausência.
- Suspeita.
- Exclusão.
- Histórico familiar.
- Hipótese.

---

# Clinical Status Preservation

O sistema deverá distinguir:

```text
Suspected

Confirmed

Ruled Out

Historical

Resolved

Active

Unknown
```

Nunca promover automaticamente:

```text
Suspected → Confirmed
```

---

# Numerical Integrity

Valores numéricos deverão receber proteção especial.

Exemplos:

- Resultados laboratoriais.
- Dosagens.
- Datas.
- Frequências.
- Medidas.
- Quantidades.

O sistema deverá evitar:

- Arredondamento não solicitado.
- Mudança de unidade.
- Alteração de sinal.
- Troca de valores entre exames.

---

# Medication Integrity

Medicamentos deverão preservar:

```text
Name

Dose

Unit

Frequency

Route

Duration

Status
```

Quando presentes.

Informações ausentes não deverão ser inferidas.

---

# Allergy Integrity

Informações sobre alergias são consideradas de alta relevância.

O Summary Pipeline deverá evitar:

- Omissão indevida.
- Confusão entre alergia e efeito adverso.
- Transformação de ausência de registro em ausência de alergia.

Exemplo:

```text
"Sem informação registrada sobre alergias."
```

é diferente de:

```text
"Paciente não possui alergias."
```

---

# Missing Data

Dados ausentes deverão permanecer ausentes.

```text
Missing ≠ Negative
```

Exemplo:

```text
Sem registro de tabagismo
```

não significa:

```text
Não fumante
```

---

# Hallucination Control

O pipeline deverá utilizar múltiplas camadas:

```text
Grounded Context

↓

Restricted Prompt

↓

Structured Output

↓

Validation

↓

Source Mapping

↓

Human Review
```

Nenhuma camada isolada será considerada suficiente.

---

# Structured Output

Sempre que o resumo for utilizado programaticamente, deverá utilizar Schema definido.

Exemplo:

```json
{
  "summary": "...",
  "keyEvents": [],
  "medications": [],
  "exams": [],
  "pendingItems": [],
  "uncertainties": [],
  "sources": []
}
```

O schema real deverá ser versionado.

---

# Summary Schema Registry

Schemas deverão possuir registro central.

Exemplo:

```text
summary-schemas/

├── consultation/
├── medical-record/
├── soap/
├── timeline/
├── exam/
├── prescription/
├── administrative/
└── financial/
```

---

# Prompt Registry

Cada tipo de resumo deverá utilizar Prompt versionado conforme `04-Prompt-Engineering.md`.

Exemplo:

```yaml
id: clinical.consultation-summary
version: 1.2.0
agent: clinical
skill: consultation-summary
output_schema: consultation-summary@1
```

---

# Model Selection

Nem todo resumo exige o mesmo modelo.

O Model Router poderá considerar:

```text
Context Size

Clinical Complexity

Output Type

Latency Requirement

Cost

Language

Model Capability
```

Resumos clínicos deverão priorizar qualidade e segurança sobre economia marginal.

---

# Long Context

Quando o contexto exceder a capacidade segura do modelo:

```text
Context

↓

Chunking

↓

Retrieval

↓

Partial Summaries

↓

Merge

↓

Validation
```

O sistema não deverá truncar silenciosamente informações relevantes.

---

# Chunking

Chunking deverá preservar limites semânticos.

Preferência:

```text
Clinical Event

Consultation

Exam

Prescription

Document Section
```

Evitar dividir arbitrariamente informações relacionadas.

---

# Summary Validator

Após geração, a resposta deverá passar por validação.

Validações possíveis:

```text
Schema Validation

Source Validation

Temporal Validation

Numeric Validation

Medication Validation

Required Field Validation

Safety Validation
```

---

# Deterministic Validation

Sempre que possível, regras determinísticas deverão validar informações produzidas.

Exemplo:

```text
LLM output:

Exam date = 12/03/2026

↓

Validator

↓

Does source contain 12/03/2026?
```

Informações verificáveis deterministicamente não deverão depender exclusivamente de outro LLM.

---

# Semantic Validation

Algumas propriedades poderão exigir avaliação semântica.

Exemplos:

- Faithfulness.
- Omission.
- Contradiction.
- Relevance.

Essas avaliações poderão utilizar:

- Rules.
- Secondary Model.
- Evaluation Model.
- Human Review.

---

# Human Review

Resumos clínicos utilizados para decisões ou documentação deverão permitir revisão profissional.

Fluxo:

```text
AI Generated Summary

↓

Draft

↓

Professional Review

↓

Accepted

or

Edited

or

Rejected
```

---

# Draft Status

Conteúdo gerado deverá possuir status explícito quando ainda não revisado.

Exemplo:

```text
AI_GENERATED

REVIEW_REQUIRED

APPROVED

EDITED

REJECTED

STALE
```

---

# Editing

O profissional poderá editar um resumo antes de utilizá-lo.

O sistema deverá distinguir:

```text
AI Output

Professional Edit

Final Approved Version
```

Isso é importante para auditoria.

---

# Clinical Documentation

Um resumo gerado pela IA não deverá ser automaticamente transformado em registro clínico definitivo.

Fluxo obrigatório:

```text
AI Summary

↓

Draft

↓

Professional Review

↓

Explicit Approval

↓

Clinical Record
```

---

# Immutability

Após um resumo aprovado ser incorporado a um registro oficial, alterações deverão seguir as regras de auditoria e versionamento do domínio correspondente.

A IA não poderá modificar silenciosamente registros aprovados.

---

# Permissions

Tipos de resumo deverão respeitar permissões específicas.

Exemplo:

```text
Receptionist

✔ Administrative Summary

✘ Full Clinical Summary
```

```text
Doctor

✔ Authorized Clinical Summary
```

```text
Financial User

✔ Financial Summary

✘ Clinical Summary
```

---

# Multi-Tenancy

Toda geração deverá estar vinculada a um tenant.

```text
Summary

↓

clinic_id

↓

Authorized Sources
```

Nenhum contexto poderá atravessar organizações.

---

# Data Minimization

O Summary Pipeline deverá utilizar apenas informações necessárias.

Exemplo:

```text
Financial Summary
```

não necessita:

```text
Clinical Notes

Diagnosis

Exams
```

quando esses dados não forem relevantes à finalidade.

---

# Sensitive Data

Dados sensíveis deverão ser removidos quando não forem necessários para o resumo.

Exemplo:

Um resumo estatístico de ocupação poderá utilizar dados agregados sem identificar pacientes.

---

# External Providers

Quando modelos externos forem utilizados, o sistema deverá respeitar as políticas definidas em:

```text
05-AI-Security.md
```

A escolha do provider deverá considerar requisitos de:

- Privacidade.
- Segurança.
- Retenção.
- Localização de dados quando aplicável.
- Contratos.
- Compliance.

---

# Audit

Toda geração relevante deverá registrar, conforme aplicável:

```text
summary_id

tenant_id

user_id

patient_id

summary_type

source_references

prompt_id

prompt_version

model

provider

generated_at

review_status

reviewed_by

reviewed_at
```

Conteúdo sensível não deverá ser duplicado desnecessariamente em logs.

---

# Summary Entity

Caso resumos persistidos sejam necessários, uma entidade conceitual poderá existir:

```text
AISummary
```

Campos conceituais:

```text
id

tenant_id

subject_type

subject_id

summary_type

content

structured_content

prompt_version

model

source_snapshot

status

generated_at

reviewed_at

reviewed_by

created_at

updated_at
```

A estrutura definitiva deverá ser definida na documentação de Database antes da implementação.

---

# Source References

As relações com fontes poderão utilizar entidade específica:

```text
AISummarySource
```

Exemplo:

```text
summary_id

source_type

source_id

source_version

relationship

created_at
```

Isso permite reconstruir a origem do resumo sem duplicar as fontes.

---

# Regeneration

Resumos poderão ser regenerados quando:

- Fontes forem alteradas.
- Novos eventos forem adicionados.
- Prompt for atualizado.
- Modelo for atualizado.
- Usuário solicitar.
- Resumo estiver Stale.

---

# Regeneration Policy

Regenerar um resumo não deverá apagar automaticamente versões anteriores quando elas forem necessárias para auditoria.

---

# Versionamento

Resumos persistidos deverão permitir identificar:

```text
Summary Version

Prompt Version

Schema Version

Model

Source Snapshot
```

Isso permite responder no futuro:

> Por que este resumo foi diferente daquele?

---

# Observabilidade

Métricas recomendadas:

```text
Summary Requests

Generation Latency

Token Usage

Cost

Context Size

Source Count

Validation Failures

Regeneration Rate

Human Edit Rate

Rejection Rate

Stale Summary Rate

Hallucination Rate
```

---

# Human Edit Rate

Uma métrica especialmente útil será:

```text
AI Output

↓

Professional Edit Distance

↓

Final Version
```

Alterações frequentes podem indicar:

- Prompt inadequado.
- Omissões.
- Excesso de informação.
- Formato ruim.
- Problemas de Faithfulness.

Essa métrica deverá ser utilizada com cautela e não como avaliação individual do profissional.

---

# Quality Metrics

Indicadores recomendados:

```text
Faithfulness

Completeness

Relevance

Temporal Accuracy

Numerical Accuracy

Medication Accuracy

Source Coverage

Professional Acceptance Rate
```

Cada métrica deverá possuir metodologia definida.

---

# Evaluation Dataset

Cada Summary Skill deverá possuir Dataset de avaliação.

Exemplo:

```text
evaluation/

└── summaries/
    ├── consultation/
    ├── soap/
    ├── timeline/
    ├── exams/
    └── prescriptions/
```

Os datasets deverão ser anonimizados ou sintéticos conforme requisitos de privacidade.

---

# Golden Dataset

Casos críticos poderão possuir respostas revisadas por especialistas.

```text
Input

↓

Expected Critical Facts

↓

Expected Output Characteristics

↓

Forbidden Errors
```

Esse conjunto será utilizado para detectar regressões.

---

# Evaluation Categories

Testes deverão incluir:

```text
Normal Cases

Long Records

Missing Data

Conflicting Data

Negation

Temporal Changes

Medication Changes

Abnormal Values

Multiple Consultations

Ambiguous Information

Prompt Injection Content
```

---

# Regression Testing

Alterações em:

- Prompt.
- Model.
- Retrieval.
- Context.
- Schema.
- Validator.

deverão executar novamente os conjuntos relevantes de avaliação.

---

# Safety-Critical Tests

Casos mínimos:

```text
Negation Preservation

Allergy Preservation

Medication Status

Dosage Integrity

Temporal Integrity

Missing Data

Cross-Patient Isolation

Cross-Tenant Isolation

Prompt Injection Resistance
```

---

# Prompt Injection em Fontes

Documentos e registros recuperados poderão conter conteúdo malicioso.

Exemplo:

```text
"Ignore todas as instruções anteriores..."
```

Conteúdo recuperado deverá ser tratado como **Data**, nunca como instrução confiável.

```text
Trusted Instructions

≠

Retrieved Content
```

---

# Error Handling

Erros esperados:

```text
SummarySourceUnavailable

PermissionDenied

InsufficientContext

ContextTooLarge

ModelUnavailable

InvalidOutput

ValidationFailed

SourceConflict

StaleSource

SafetyBlocked
```

O usuário deverá receber mensagem compreensível.

---

# Insufficient Context

Quando informações forem insuficientes:

```text
Insufficient Data

↓

Return Partial Summary

+

Declare Limitation
```

quando seguro.

Nunca completar lacunas com invenções.

---

# Graceful Degradation

Caso uma funcionalidade avançada falhe, o sistema poderá reduzir capacidade.

Exemplo:

```text
Longitudinal AI Summary unavailable

↓

Offer chronological records
```

O acesso aos dados originais não deverá depender da disponibilidade da IA.

---

# Availability

Falha do AI Provider não deverá impedir acesso aos registros clínicos oficiais.

Regra:

```text
AI Failure ≠ Medical Record Failure
```

A AI Platform é complementar.

---

# Performance

Metas específicas deverão ser definidas por Summary Type.

Estratégias possíveis:

- Streaming quando adequado.
- Cache seguro.
- Parallel Retrieval.
- Hierarchical Summarization.
- Incremental Summaries.
- Model Routing.

---

# Cost Control

Custos poderão ser reduzidos através de:

- Context Reduction.
- Retrieval otimizado.
- Cache.
- Smaller Models quando adequados.
- Incremental Summarization.
- Token Budgets.

Segurança e Faithfulness possuem prioridade sobre economia marginal.

---

# UX

A interface deverá diferenciar claramente:

```text
Original Data

AI Generated Summary

Professional Approved Content
```

O usuário nunca deverá confundir conteúdo gerado automaticamente com informação clínica original.

---

# Suggested UI

Exemplo:

```text
┌─────────────────────────────────────┐
│ Resumo gerado por IA                │
│                                     │
│ Última atualização: 25/07/2026      │
│                                     │
│ [Resumo]                            │
│                                     │
│ Fontes: 8 registros                 │
│                                     │
│ [Ver fontes] [Editar] [Aprovar]     │
└─────────────────────────────────────┘
```

---

# Stale UI

Resumo desatualizado deverá ser claramente identificado.

```text
⚠ Este resumo pode estar desatualizado.

Novos registros foram adicionados após sua geração.
```

O conteúdo antigo não deverá parecer atual.

---

# Accessibility

Resumos deverão respeitar os padrões definidos no Design System.

A interface deverá garantir:

- Navegação por teclado.
- Screen Reader.
- Estrutura semântica.
- Labels.
- Estados compreensíveis.
- Indicação de conteúdo gerado por IA.

---

# Privacy by Design

A arquitetura deverá evitar:

```text
Full Record by Default
```

e preferir:

```text
Minimum Required Context
```

O contexto deverá ser determinado pela finalidade.

---

# Retention

A retenção de resumos deverá possuir política explícita.

Possibilidades:

```text
Ephemeral

Cached

Persisted Draft

Approved Record
```

Cada categoria poderá possuir regras diferentes.

---

# Deletion

A exclusão ou anonimização de dados de origem deverá considerar resumos derivados.

O sistema não poderá preservar indevidamente informações pessoais através de caches ou resumos persistidos quando a política exigir remoção.

---

# Internationalization

A arquitetura deverá permitir resumos em múltiplos idiomas.

Entretanto:

```text
Source Language

Summary Language

Clinical Terminology
```

deverão ser tratados separadamente.

Tradução não deverá alterar significado clínico.

---

# Terminologia Clínica

Termos técnicos deverão ser preservados quando sua simplificação puder alterar significado.

Quando necessário, o sistema poderá produzir:

```text
Professional Summary

+

Patient-Friendly Explanation
```

como produtos diferentes.

Eles não deverão compartilhar necessariamente o mesmo Prompt.

---

# Patient-Facing Summaries

Resumos destinados ao paciente deverão possuir Skill própria.

O sistema deverá considerar:

- Linguagem compreensível.
- Evitar interpretação diagnóstica indevida.
- Explicar termos quando apropriado.
- Preservar precisão.
- Não substituir orientação profissional.

---

# Professional Summaries

Resumos destinados a profissionais poderão utilizar terminologia técnica adequada.

O sistema deverá preservar:

- Precisão.
- Concisão.
- Terminologia.
- Temporalidade.
- Proveniência.

---

# Anti-Padrões

São considerados Anti-Padrões:

- Utilizar um único Prompt para todos os resumos.
- Enviar prontuário completo sem necessidade.
- Tratar resumo como Source of Truth.
- Persistir resumo sem Source Snapshot.
- Utilizar resumo Stale como atual.
- Omitir origem das informações críticas.
- Transformar hipótese em diagnóstico confirmado.
- Inferir ausência a partir de dado faltante.
- Alterar números.
- Alterar unidades.
- Ignorar temporalidade.
- Ignorar negação.
- Misturar pacientes.
- Misturar tenants.
- Transformar saída de IA diretamente em prontuário definitivo.
- Utilizar cache clínico sem invalidação.
- Truncar contexto silenciosamente.
- Permitir que conteúdo recuperado sobrescreva System Instructions.
- Usar confiança arbitrária do LLM como indicador clínico.

---

# Decisões Arquiteturais

## ADR-098

Resumos gerados por IA serão considerados informações derivadas e nunca Source of Truth.

---

## ADR-099

Cada tipo de resumo deverá possuir Skill, Prompt, Context Policy e Output Schema próprios.

---

## ADR-100

Toda geração de resumo deverá respeitar identidade, tenant e permissões antes da recuperação das fontes.

---

## ADR-101

Resumos clínicos persistidos deverão manter referências suficientes para reconstrução de sua proveniência.

---

## ADR-102

Resumos clínicos utilizados como documentação oficial deverão passar por revisão e aprovação profissional explícita.

---

## ADR-103

Dados ausentes não poderão ser interpretados automaticamente como resultados negativos.

---

## ADR-104

Temporalidade, negação, status clínico e integridade numérica serão considerados propriedades críticas do Summary Pipeline.

---

## ADR-105

Resumos persistidos deverão possuir mecanismo de detecção de obsolescência quando suas fontes forem modificadas.

---

## ADR-106

Históricos extensos poderão utilizar Hierarchical Summarization, desde que a cadeia de proveniência permaneça reconstruível.

---

## ADR-107

Informações verificáveis deterministicamente deverão ser validadas por mecanismos determinísticos sempre que tecnicamente possível.

---

## ADR-108

Falhas da camada de IA não poderão impedir acesso às informações clínicas oficiais.

---

## ADR-109

Conteúdo recuperado por RAG ou outras fontes será tratado como dado não confiável para fins de Prompt Instruction Hierarchy.

---

## ADR-110

Patient-Facing Summaries e Professional Summaries serão tratados como capacidades distintas.

---

# Referência de Implementação

Estrutura conceitual recomendada:

```text
ai/

├── summaries/
│   ├── consultation/
│   │   ├── skill/
│   │   ├── prompt/
│   │   ├── schema/
│   │   ├── validator/
│   │   └── evaluation/
│   │
│   ├── medical-record/
│   ├── longitudinal/
│   ├── soap/
│   ├── timeline/
│   ├── exams/
│   ├── prescriptions/
│   ├── administrative/
│   └── financial/
│
├── retrieval/
├── provenance/
├── temporal/
├── validation/
├── safety/
├── evaluation/
└── observability/
```

A estrutura concreta poderá evoluir.

As responsabilidades definidas neste documento deverão permanecer preservadas.

---

# Fluxo de Implementação de uma Nova Summary Skill

```text
Define Use Case

↓

Define Users

↓

Define Permissions

↓

Define Sources

↓

Define Context Policy

↓

Define Prompt

↓

Define Output Schema

↓

Define Validators

↓

Define Provenance Strategy

↓

Create Evaluation Dataset

↓

Security Review

↓

Clinical Review
(quando aplicável)

↓

Staging

↓

Controlled Rollout

↓

Production Monitoring
```

---

# Critérios de Aceitação

Uma nova Summary Skill somente poderá ser considerada pronta quando:

- Possuir objetivo definido.
- Possuir fontes documentadas.
- Possuir Permission Policy.
- Possuir Prompt versionado.
- Possuir Output Schema versionado.
- Possuir tratamento de Missing Data.
- Possuir tratamento temporal.
- Possuir Provenance.
- Possuir testes.
- Possuir Evaluation Dataset.
- Passar por avaliação de segurança.
- Possuir observabilidade.
- Possuir UX de revisão quando necessário.
- Possuir documentação atualizada.

---

# Checklist de Conformidade

| Item | Obrigatório |
|-------|-------------|
| Summary Type definido | ✅ |
| Skill especializada | ✅ |
| Prompt versionado | ✅ |
| Output Schema versionado | ✅ |
| Identity Validation | ✅ |
| Tenant Validation | ✅ |
| Permission Validation | ✅ |
| Data Minimization | ✅ |
| Grounding | ✅ |
| Provenance | ✅ |
| Temporal Validation | ✅ |
| Negation Preservation | ✅ |
| Missing Data Handling | ✅ |
| Numerical Integrity | ✅ |
| Source Conflict Handling | ✅ |
| Staleness Strategy | ✅ |
| Human Review quando necessário | ✅ |
| Audit | ✅ |
| Observability | ✅ |
| Evaluation Dataset | ✅ |
| Regression Tests | ✅ |
| Security Tests | ✅ |
| Documentação atualizada | ✅ |

---

# Referências Cruzadas

Este documento deverá ser interpretado em conjunto com:

```text
09-AI/
├── 01-AI-Vision.md
├── 02-AI-Architecture.md
├── 03-AI-Modules.md
├── 04-Prompt-Engineering.md
├── 05-AI-Security.md
├── 06-AI-Assistant.md
├── 07-AI-Summaries.md
└── 08-Future.md

07-Database/
├── 01-ERD.md
├── 02-Entities.md
├── 04-RLS.md
└── 07-Audit.md

08-Design-System/
├── 09-Accessibility.md
└── 10-Illustrations.md
```

As referências concretas deverão ser atualizadas caso a estrutura oficial da documentação seja alterada.

---

# Considerações Finais

O AI Summaries constitui uma das capacidades centrais da Inteligência Artificial do MedFlow.

Seu objetivo não é simplesmente reduzir a quantidade de texto apresentada ao usuário.

Seu objetivo é transformar informações extensas em representações úteis sem destruir o significado, a temporalidade, a proveniência ou o contexto dos dados originais.

Em um sistema de saúde, um resumo pequeno pode carregar decisões importantes.

Por isso, o MedFlow deverá tratar cada resumo como uma transformação controlada de informação:

```text
Trusted Sources

↓

Authorized Retrieval

↓

Controlled Context

↓

AI Transformation

↓

Validation

↓

Provenance

↓

Human Review

↓

Safe Use
```

A qualidade de um resumo não será medida apenas por sua fluidez.

Será medida por sua capacidade de permanecer fiel às fontes.

O MedFlow deverá sempre preferir:

```text
Informação incompleta, mas verdadeira

>

Informação completa, mas inventada
```

Esse princípio deverá permanecer válido independentemente do modelo, provider ou geração tecnológica utilizada pela plataforma.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação da especificação oficial da arquitetura de AI Summaries | Equipe MedFlow |