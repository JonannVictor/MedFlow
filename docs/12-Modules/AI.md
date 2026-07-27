# Módulo de Inteligência Artificial

| Campo | Valor |
|-------|--------|
| Documento | AI |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Modules |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# 1. Visão Geral

O módulo de **Inteligência Artificial (AI)** define como capacidades baseadas em modelos de inteligência artificial poderão ser utilizadas dentro do MedFlow.

Este módulo não representa apenas uma integração com um Large Language Model.

Ele representa a camada responsável por controlar:

```text
AI Requests

Models

Providers

Prompts

Context

Tools

Permissions

Evaluations

Safety

Observability

Costs

Audit
```

A arquitetura deverá permitir que diferentes módulos do MedFlow utilizem AI sem criar integrações independentes, inconsistentes ou inseguras.

O princípio central é:

```text
MedFlow Modules

        │
        ▼

AI Platform

        │
        ▼

Approved AI Providers
```

e nunca:

```text
Module A ──► Provider A

Module B ──► Provider B

Module C ──► Random Model

Module D ──► Direct LLM API
```

---

# 2. Objetivo

O módulo de AI deverá fornecer uma infraestrutura central para capacidades inteligentes do MedFlow.

Entre seus objetivos estão:

- Centralizar acesso a Models.
- Controlar quais Providers podem ser utilizados.
- Padronizar Prompt Management.
- Controlar Context Assembly.
- Aplicar Authorization antes do acesso a dados.
- Aplicar Data Minimization.
- Permitir Tool Calling controlado.
- Registrar AI Usage.
- Controlar custos.
- Executar Evaluations.
- Permitir troca de Models.
- Implementar Guardrails.
- Suportar futuras capacidades agentic.
- Evitar dependência direta dos módulos com Providers externos.

---

# 3. Princípio Fundamental

```text
AI is a capability.

Not an authority.
```

Um Model poderá possuir capacidade para sugerir uma ação.

Isso não significa que possua autorização para executá-la.

```text
Model Capability

≠

System Permission
```

Toda autoridade continuará pertencendo às regras do MedFlow.

---

# 4. Estado do Módulo

O módulo de AI deverá distinguir claramente entre capacidades atuais e futuras.

```text
CURRENT

Capabilities actually implemented
and available in the application.

PLANNED

Capabilities approved for future
implementation.

FUTURE

Capabilities being considered,
without implementation commitment.
```

A documentação não deverá fazer uma Feature futura parecer já disponível.

---

# 5. Escopo

O domínio de AI poderá incluir:

```text
AI Assistant

Summarization

Information Retrieval

Document Assistance

Operational Assistance

Prompt Management

Model Routing

Tool Calling

AI Evaluation

AI Observability

AI Feedback

AI Agents
```

dependendo da evolução do produto.

---

# 6. Fora do Escopo

O módulo não deverá ser responsável diretamente por:

- Patient Storage.
- Appointment Scheduling Rules.
- Clinical Record Storage.
- Authentication.
- Organization Management.
- Billing.
- Notification Delivery.
- Prescription Storage.
- Exam Storage.

Esses continuam pertencendo aos respectivos módulos.

AI poderá interagir com esses domínios somente através de contratos controlados.

---

# 7. Arquitetura Conceitual

```text
                    MedFlow Modules
                          │
                          ▼
                   AI Application Layer
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
           Context      Policies     Tools
              │           │           │
              └───────────┼───────────┘
                          ▼
                      AI Gateway
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
          Provider A   Provider B   Provider N
             │            │            │
             ▼            ▼            ▼
           Model        Model        Model
```

---

# 8. AI Gateway

O **AI Gateway** deverá ser o principal boundary entre o MedFlow e Providers de AI.

Responsabilidades potenciais:

```text
Model Selection

Provider Selection

Authentication

Request Normalization

Response Normalization

Timeout

Retry

Rate Limiting

Cost Tracking

Telemetry

Policy Enforcement
```

---

# 9. Provider Abstraction

O restante do sistema não deverá depender diretamente do formato específico de um Provider.

Exemplo conceitual:

```ts
ai.generate({
  task,
  context,
  policy,
});
```

em vez de espalhar chamadas específicas de Provider pelo projeto.

---

# 10. Provider Lock-In

O MedFlow deverá evitar dependência desnecessária de:

```text
One Provider

One Model

One Prompt Format

One Tool Protocol
```

Abstração não significa esconder todas as diferenças.

Models possuem capacidades diferentes.

O objetivo será isolar diferenças sem fingir que todos são equivalentes.

---

# 11. Approved Providers

Somente Providers explicitamente aprovados deverão processar dados do MedFlow.

A aprovação deverá considerar:

- Security.
- Privacy.
- Data Processing.
- Data Retention.
- Reliability.
- Geographic Requirements.
- Cost.
- Model Capabilities.
- Contractual Requirements.

---

# 12. Provider Registry

A plataforma poderá possuir um Registry conceitual:

```text
Provider

├── id
├── name
├── status
├── supportedModels
├── capabilities
├── regions
├── dataPolicy
└── configuration
```

Secrets não deverão ser armazenados como Metadata comum.

---

# 13. Model Registry

Models utilizados em Production deverão ser conhecidos pela plataforma.

Exemplo:

```text
AIModel

├── id
├── provider
├── providerModelId
├── version
├── capabilities
├── status
├── riskClass
├── approvedTasks
├── contextLimit
└── costProfile
```

---

# 14. Model Status

Possíveis estados:

```text
Candidate

Evaluation

Approved

Production

Deprecated

Retired
```

---

# 15. Model Lifecycle

```text
Candidate

↓

Evaluation

↓

Approval

↓

Production

↓

Monitoring

↓

Deprecation

↓

Retirement
```

---

# 16. Model Approval

Um Model não deverá entrar em Production apenas porque:

```text
It is newer.
```

ou:

```text
It scores higher
on a generic benchmark.
```

Ele deverá ser avaliado para os casos reais do MedFlow.

---

# 17. Task-Based AI

Requests deverão ser associados a uma finalidade.

Exemplos:

```text
appointment_summary

clinical_summary

document_classification

administrative_assistant

information_retrieval

report_explanation
```

---

# 18. Task Registry

Tasks relevantes poderão possuir definição formal.

```text
AITask

├── id
├── purpose
├── riskLevel
├── allowedModels
├── allowedData
├── allowedTools
├── outputSchema
└── evaluationSuite
```

---

# 19. Risk Classification

AI Tasks deverão possuir classificação proporcional ao impacto.

Exemplo conceitual:

```text
LOW

MODERATE

HIGH

CLINICAL
```

---

# 20. Low-Risk Example

Exemplo:

```text
Rewrite an administrative message.
```

---

# 21. Higher-Risk Example

Exemplo:

```text
Summarize clinical information
for professional review.
```

O segundo exige controles adicionais.

---

# 22. Prompt Architecture

Prompts importantes não deverão permanecer espalhados em componentes da aplicação.

Preferir:

```text
Prompt Registry
```

---

# 23. Prompt Registry

Um Prompt poderá possuir:

```text
Prompt

├── id
├── task
├── version
├── template
├── variables
├── status
├── createdAt
└── metadata
```

---

# 24. Prompt Versioning

Alterar um Prompt poderá alterar comportamento do produto.

Portanto:

```text
Prompt Change

=

Behavior Change
```

Prompts críticos deverão possuir Versioning.

---

# 25. Prompt Lifecycle

```text
Draft

↓

Evaluation

↓

Approved

↓

Production

↓

Deprecated
```

---

# 26. Prompt Ownership

Prompts importantes deverão possuir Owner ou domínio responsável.

---

# 27. Prompt Testing

Mudanças relevantes deverão ser testadas contra Evaluation Sets.

---

# 28. No Hidden Business Rules in Prompts

Business Rules críticas não deverão existir exclusivamente dentro de Prompt.

Errado:

```text
"Never allow appointments after 18:00."
```

se essa for regra oficial do Scheduling Domain.

Correto:

```text
AI proposes intent

↓

Scheduling Domain validates rule
```

---

# 29. Context Assembly

Um dos componentes mais importantes será o **Context Builder**.

```text
User Request

↓

Authorization

↓

Relevant Data Retrieval

↓

Data Minimization

↓

Context Assembly

↓

AI Request
```

---

# 30. Authorization Before Context

A ordem deverá ser:

```text
Authorize

↓

Retrieve

↓

Send to AI
```

Nunca:

```text
Retrieve Everything

↓

Send to AI

↓

Ask AI what user can see
```

---

# 31. AI Is Not Authorization

O Model nunca deverá decidir quais dados o usuário pode acessar.

Authorization pertence ao MedFlow.

---

# 32. Tenant Isolation

AI deverá respeitar Tenant Isolation exatamente como qualquer outra parte da plataforma.

```text
Organization A

X

Organization B
```

Contextos não poderão ser misturados.

---

# 33. Cross-Tenant Leakage

Qualquer possibilidade de dados de um Tenant aparecerem em resposta de outro deverá ser tratada como incidente crítico de segurança e privacidade.

---

# 34. Data Minimization

Somente dados necessários à Task deverão ser enviados.

```text
Minimum Required Context
```

deverá ser preferido a:

```text
Entire Patient Record
```

---

# 35. Sensitive Data

Dados de saúde deverão possuir tratamento especial.

AI integration não altera sua classificação.

---

# 36. Provider Data Policy

Antes de enviar dados a Provider externo, a plataforma deverá saber:

```text
What data is being sent?

Why?

To which provider?

Under which policy?

For which task?
```

---

# 37. Context Provenance

Quando necessário, o sistema deverá conseguir identificar de onde veio o contexto utilizado.

---

# 38. Retrieval

AI poderá recuperar informações através de serviços internos controlados.

```text
AI

↓

Retrieval Layer

↓

Authorized Domain Services
```

---

# 39. RAG

Retrieval-Augmented Generation poderá ser utilizado quando adequado.

Arquitetura conceitual:

```text
Question

↓

Authorization

↓

Retrieval

↓

Relevant Context

↓

Model

↓

Grounded Response
```

---

# 40. RAG Is Not Authorization

Vector Search ou Semantic Search não substituem Authorization.

Resultados recuperados deverão respeitar permissões.

---

# 41. Embeddings

Embeddings derivados de dados sensíveis deverão continuar sendo tratados como potencialmente sensíveis.

```text
Embedding

≠

Anonymous Data
```

---

# 42. Vector Storage

Caso Vector Database seja utilizada, deverá respeitar:

- Tenant Isolation.
- Access Control.
- Data Lifecycle.
- Deletion.
- Encryption.
- Backup Policy.
- Environment Separation.

---

# 43. Index Synchronization

Índices derivados deverão acompanhar alterações e exclusões dos dados de origem.

---

# 44. Stale Context

O sistema deverá considerar risco de informações desatualizadas em índices ou caches.

---

# 45. Grounding

Respostas baseadas em registros do MedFlow deverão, quando apropriado, ser grounded em fontes recuperadas.

---

# 46. Source References

Para casos importantes, a interface poderá permitir retorno às informações originais.

Exemplo:

```text
AI Summary

↓

Source Records
```

---

# 47. AI Assistant

O MedFlow poderá possuir um AI Assistant transversal.

---

# 48. Assistant Responsibilities

Possíveis capacidades:

```text
Navigate

Search

Explain

Summarize

Prepare

Suggest

Assist
```

---

# 49. Assistant Boundaries

O Assistant não deverá possuir acesso global simplesmente por ser transversal.

Seu contexto deverá ser derivado do usuário atual.

---

# 50. Assistant Context

```text
User

+

Organization

+

Role

+

Permissions

+

Current Screen

+

Explicit Request
```

poderão influenciar contexto.

---

# 51. Contextual Assistant

Quando aberto em um Patient:

```text
Current Patient Context
```

poderá ser disponibilizado se autorizado.

Quando aberto em Reports:

```text
Report Context
```

poderá ser utilizado.

---

# 52. Context Transparency

A interface deverá evitar deixar o usuário confuso sobre qual contexto a AI está utilizando.

---

# 53. AI Summaries

Summaries poderão reduzir carga cognitiva.

Exemplos:

```text
Patient Summary

Appointment Summary

Document Summary

Operational Summary

Report Summary
```

---

# 54. Summary Principle

```text
Summary

≠

Source of Truth
```

O dado original continuará sendo autoritativo.

---

# 55. Summary Freshness

Summaries persistidos deverão possuir mecanismo para identificar quando ficaram desatualizados.

---

# 56. Summary Metadata

Quando persistido:

```text
AISummary

├── id
├── subjectType
├── subjectId
├── generatedAt
├── model
├── promptVersion
├── sourceVersion
└── status
```

---

# 57. Clinical Summaries

Clinical Summaries deverão possuir controles superiores.

Possíveis requisitos:

- Professional Review.
- Source References.
- AI Identification.
- Evaluation.
- Audit.
- Restricted Task Configuration.

---

# 58. AI Output Is Untrusted

Todo Output de Model deverá ser tratado conceitualmente como:

```text
Untrusted Generated Content
```

até que o sistema ou usuário apropriado o valide para a finalidade correspondente.

---

# 59. Structured Output

Quando AI alimentar Software, preferir Outputs estruturados.

Exemplo:

```json
{
  "intent": "reschedule_appointment",
  "appointmentId": "...",
  "requestedDate": "..."
}
```

em vez de interpretar texto livre sempre que possível.

---

# 60. Schema Validation

Structured Outputs deverão ser validados contra Schema.

```text
Model Output

↓

Schema Validation

↓

Business Validation

↓

Authorization

↓

Possible Execution
```

---

# 61. Invalid Output

Output inválido deverá ser rejeitado.

O sistema não deverá tentar executar silenciosamente conteúdo parcialmente interpretável quando houver risco.

---

# 62. Tool Calling

Models poderão solicitar Tools.

Exemplo:

```text
AI

↓

get_available_slots()

↓

Scheduling Domain
```

---

# 63. Tool Registry

Tools deverão ser explicitamente registradas.

```text
AITool

├── id
├── description
├── inputSchema
├── outputSchema
├── permissions
├── riskLevel
└── handler
```

---

# 64. No Direct Database Tool

Não deverá existir uma Tool genérica como:

```text
execute_sql(query)
```

disponível para AI em Production.

---

# 65. Domain Tools

Preferir Tools específicas:

```text
get_patient()

search_appointments()

get_available_slots()

prepare_reschedule()

create_message_draft()
```

---

# 66. Tool Authorization

Toda chamada de Tool deverá passar pelas mesmas regras de Authorization utilizadas fora da AI.

---

# 67. Tool Input Validation

Argumentos gerados pelo Model deverão ser tratados como Input não confiável.

---

# 68. Tool Output Filtering

A Tool deverá retornar apenas dados necessários.

---

# 69. Read Tools

Ferramentas somente de leitura possuem risco menor, mas ainda exigem Authorization.

---

# 70. Write Tools

Tools capazes de modificar estado exigirão controles adicionais.

---

# 71. Prepare vs Execute

Para operações sensíveis, preferir:

```text
prepare_action()
```

antes de:

```text
execute_action()
```

---

# 72. Human Approval

Fluxo recomendado:

```text
User Request

↓

AI Interpretation

↓

Prepare Action

↓

Preview

↓

Human Approval

↓

Domain Execution

↓

Audit
```

---

# 73. Deterministic Execution

AI poderá interpretar intenção.

O Domain continuará executando regras deterministicamente.

---

# 74. Example — Appointment Rescheduling

Usuário:

```text
"Mova a consulta da Ana
para sexta à tarde."
```

Fluxo:

```text
AI interprets request

↓

Patient / Appointment resolved

↓

Scheduling Tool searches availability

↓

AI presents options

↓

User selects / approves

↓

Appointments Domain validates

↓

Appointment updated

↓

Audit Event
```

AI não deverá modificar diretamente tabelas.

---

# 75. High-Risk Actions

Ações de maior risco poderão exigir aprovação explícita independentemente da confiança do Model.

---

# 76. Tool Execution Audit

Registrar, quando apropriado:

```text
User

AI Task

Model

Tool

Arguments Metadata

Result

Timestamp
```

evitando conteúdo sensível desnecessário.

---

# 77. AI Agents

Agents representam evolução possível do módulo.

---

# 78. Agent Definition

Um Agent deverá possuir:

```text
Agent

├── id
├── purpose
├── version
├── allowedTasks
├── allowedTools
├── permissions
├── executionLimits
├── riskLevel
└── status
```

---

# 79. Agent Identity

Cada Agent deverá ser identificável.

---

# 80. Agent Authority

```text
Agent Authority

≤

User Authority

∩

System Policy

∩

Agent Policy
```

---

# 81. Agent Delegation

Um usuário não poderá utilizar AI para contornar suas próprias restrições.

---

# 82. Agent Execution Limits

Possíveis limites:

```text
Max Tool Calls

Max Runtime

Max Tokens

Max Cost

Max Retries

Max Actions
```

---

# 83. Loop Protection

Agents deverão possuir proteção contra loops.

---

# 84. Agent Kill Switch

Deverá existir mecanismo para desativar rapidamente um Agent problemático.

---

# 85. Agent State

Estado persistente deverá ser utilizado apenas quando necessário.

---

# 86. Agent Memory

Memory deverá ser cuidadosamente separada de:

```text
Patient Record

Clinical Record

Audit Log
```

Memory não deverá virar armazenamento paralelo informal de dados.

---

# 87. Long-Term Memory

Long-Term AI Memory somente deverá existir quando houver:

- Purpose.
- Retention Policy.
- User Value.
- Authorization.
- Deletion Strategy.
- Privacy Analysis.

---

# 88. Conversation History

Histórico de conversas com AI deverá possuir política explícita de retenção.

---

# 89. Chat Is Not Medical Record

Uma conversa com AI não deverá automaticamente se tornar parte do Medical Record.

---

# 90. Promotion to Record

Caso conteúdo produzido com AI deva entrar no registro oficial:

```text
AI Draft

↓

Professional Review

↓

Explicit Save

↓

Medical Record
```

---

# 91. AI Safety

Safety deverá ser implementada em múltiplas camadas.

```text
Input Controls

↓

Context Controls

↓

Model Policy

↓

Tool Controls

↓

Output Validation

↓

Human Oversight

↓

Monitoring
```

---

# 92. Prompt Injection

Conteúdo externo poderá tentar manipular o Model.

Exemplo:

```text
Uploaded Document

↓

"Ignore all previous instructions..."
```

Esse conteúdo deverá ser tratado como Data, não como autoridade.

---

# 93. Instruction Hierarchy

A arquitetura deverá distinguir:

```text
System Policy

Developer / Product Instructions

User Intent

Retrieved Content
```

Retrieved Content não deverá sobrescrever Policy.

---

# 94. Indirect Prompt Injection

Documentos, websites, integrações ou outros dados externos poderão conter instruções maliciosas.

Tool-enabled AI deverá assumir que isso pode acontecer.

---

# 95. Tool Injection Defense

A decisão de executar Tool não deverá depender exclusivamente de texto recuperado.

---

# 96. Data Exfiltration

AI não deverá conseguir enviar dados para destinos arbitrários.

---

# 97. External URLs

Acesso externo por Agents deverá ser restrito e governado quando existir.

---

# 98. Secret Protection

Secrets nunca deverão ser colocados em Prompt ou Context.

---

# 99. System Prompt Confidentiality

O sistema não deverá depender de segredo do Prompt para garantir Security.

```text
Prompt Secrecy

≠

Security Boundary
```

---

# 100. Hallucination

Hallucination deverá ser tratada como propriedade possível de sistemas generativos.

Não como Bug impossível de acontecer.

---

# 101. Hallucination Mitigation

Possíveis estratégias:

```text
Grounding

Structured Output

Validation

Source References

Task Restrictions

Human Review

Evaluation
```

---

# 102. Confidence

O MedFlow não deverá apresentar uma porcentagem de confiança inventada pelo próprio Model como medida objetiva de correção.

---

# 103. Uncertainty

Quando apropriado, a AI deverá conseguir indicar ausência de informação suficiente.

---

# 104. Refusal

A AI deverá conseguir recusar Tasks fora de suas capacidades ou permissões.

---

# 105. Fail Closed

Para ações sensíveis:

```text
Uncertain Authorization

↓

Do Not Execute
```

---

# 106. Clinical Safety

Clinical AI deverá possuir tratamento específico.

---

# 107. Clinical Assistance

Possíveis usos futuros:

```text
Clinical Summarization

Information Organization

Documentation Assistance

Relevant Information Retrieval
```

---

# 108. Clinical Authority

AI não deverá receber autoridade clínica apenas porque consegue produzir linguagem convincente.

---

# 109. Clinical Review

Outputs que possam afetar decisões clínicas deverão possuir nível adequado de Human Oversight.

---

# 110. Clinical Grounding

Quando possível, respostas deverão apontar para dados relevantes utilizados.

---

# 111. Clinical Hallucination Risk

O sistema deverá assumir que uma resposta plausível pode estar incorreta.

---

# 112. Clinical Evaluation

Evaluation deverá utilizar cenários representativos do domínio.

---

# 113. AI Evaluation

Nenhuma capacidade importante deverá depender apenas de:

```text
"It looked good when we tested manually."
```

---

# 114. Evaluation Framework

```text
Dataset

↓

Task

↓

Model + Prompt

↓

Output

↓

Evaluator

↓

Metrics

↓

Decision
```

---

# 115. Evaluation Dataset

Datasets deverão representar casos reais sem utilizar dados de Production inadequadamente.

Preferir:

```text
Synthetic Data

De-Identified Data

Approved Evaluation Data
```

conforme contexto.

---

# 116. Evaluation Types

Possíveis:

```text
Deterministic Evaluation

Human Evaluation

Model-Based Evaluation

Safety Evaluation

Regression Evaluation
```

---

# 117. Golden Dataset

Tasks críticas poderão possuir conjunto de exemplos esperado.

---

# 118. Regression Testing

Mudança de:

```text
Model

Prompt

Context Strategy

Tool

Provider
```

poderá exigir Regression Evaluation.

---

# 119. Model Upgrade

Fluxo:

```text
New Model

↓

Offline Evaluation

↓

Comparison

↓

Risk Review

↓

Canary

↓

Monitoring

↓

Full Rollout
```

---

# 120. Canary

Novo Model poderá ser liberado para pequena porcentagem de requests apropriadas.

---

# 121. Shadow Evaluation

Quando permitido:

```text
Production Request

├── Current Model → User
│
└── Candidate Model → Evaluation Only
```

Candidate Output não será mostrado ao usuário.

---

# 122. Human Evaluation

Algumas Tasks exigirão avaliação humana especializada.

---

# 123. AI Feedback

Usuários poderão fornecer Feedback.

Exemplo:

```text
Helpful

Incorrect

Incomplete

Unsafe
```

---

# 124. Feedback Is Not Ground Truth

Feedback deverá ser tratado como sinal.

Não como verdade absoluta.

---

# 125. Feedback Privacy

Feedback não deverá copiar indiscriminadamente contexto sensível.

---

# 126. Observability

AI deverá possuir observabilidade própria.

---

# 127. AI Request Telemetry

Possíveis Metadata:

```text
requestId

task

model

provider

latency

tokenUsage

cost

status

toolCalls

evaluationVersion
```

---

# 128. Sensitive Logging

Prompt completo e Response completa não deverão ser logados por padrão.

---

# 129. Log Redaction

Logs deverão evitar:

- Patient Data.
- Credentials.
- Tokens.
- Secrets.
- Clinical Content desnecessário.

---

# 130. Trace Correlation

AI Request poderá possuir correlação com Application Trace.

---

# 131. Metrics

Métricas potenciais:

```text
Request Count

Success Rate

Failure Rate

Latency

Timeout Rate

Token Usage

Cost

Tool Error Rate

User Feedback

Evaluation Score
```

---

# 132. AI Reliability

Dependência de Provider externo deverá ser considerada.

---

# 133. Provider Failure

Falhas possíveis:

```text
Timeout

Rate Limit

Provider Outage

Model Unavailable

Invalid Response

Authentication Failure
```

---

# 134. Timeout

Requests deverão possuir Timeout definido.

---

# 135. Retry

Retry somente quando seguro.

---

# 136. AI Write Retry

Operações envolvendo Tools com Side Effects deverão utilizar Idempotency e cuidado adicional.

---

# 137. Provider Fallback

Fallback poderá existir.

```text
Primary Model

↓

Failure

↓

Approved Fallback
```

---

# 138. Fallback Compatibility

Fallback somente deverá ocorrer quando outro Model estiver aprovado para a mesma Task.

---

# 139. Graceful Degradation

Quando AI não for essencial:

```text
AI unavailable

↓

Core workflow remains available
```

---

# 140. AI Must Not Become Single Point of Failure

Scheduling básico, Patient Access e outros workflows fundamentais não deverão parar apenas porque Provider de AI está indisponível, quando AI não for requisito essencial.

---

# 141. Rate Limiting

AI endpoints deverão possuir Rate Limits adequados.

---

# 142. Abuse Protection

Controles deverão impedir uso abusivo da infraestrutura.

---

# 143. Cost Management

AI possui custo variável.

Portanto deverá ser observável.

---

# 144. Cost Dimensions

```text
Provider

Model

Organization

Feature

Task

Environment
```

poderão ser utilizados para análise de custo.

---

# 145. Cost Per Task

O MedFlow deverá conseguir estimar:

```text
How much does this AI capability cost?
```

---

# 146. Cost Budget

Features poderão possuir Budgets.

---

# 147. Token Budget

Requests deverão evitar contexto desnecessariamente grande.

---

# 148. Context Optimization

Possíveis estratégias:

```text
Retrieval

Summarization

Caching

Context Pruning

Structured Context
```

---

# 149. Cost vs Quality

Model mais caro não significa automaticamente melhor escolha.

---

# 150. Model Routing

Routing poderá considerar:

```text
Task

Risk

Capability

Latency

Cost

Availability
```

---

# 151. Routing Policy

Model selection deverá ocorrer através de Policy controlada.

---

# 152. User Model Selection

Usuários comuns não deverão necessariamente escolher Models técnicos diretamente.

A interface deverá preferir capacidades.

Exemplo:

```text
Summarize Patient
```

em vez de:

```text
Use Model X Version Y.
```

---

# 153. Organization AI Policies

No futuro, Organizations poderão possuir políticas sobre AI.

---

# 154. Policy Examples

```text
AI Enabled

Allowed Features

Allowed Data Categories

Allowed Providers

Usage Limits
```

---

# 155. Platform Policy Wins

Organization Policy não poderá enfraquecer requisitos obrigatórios da plataforma.

---

# 156. Feature Entitlements

Disponibilidade comercial de AI poderá ser controlada separadamente de Safety.

```text
Entitlement

≠

Permission

≠

Safety Policy
```

---

# 157. AI Audit

Ações relevantes envolvendo AI deverão ser auditáveis.

---

# 158. Audit Scope

Dependendo da Task:

```text
Who initiated?

Which feature?

Which model?

Which prompt version?

Which tools?

Was an action executed?

Was human approval required?
```

---

# 159. Audit Content

Audit deverá registrar fatos relevantes sem armazenar desnecessariamente Prompt e Response completos.

---

# 160. Data Retention

Dados de AI deverão possuir políticas próprias quando necessário.

---

# 161. Categories

Possíveis categorias:

```text
Conversation

Prompt Metadata

Response Metadata

Evaluation

Feedback

Audit

Telemetry
```

Cada uma poderá possuir Retention diferente.

---

# 162. Conversation Storage

Conversas não deverão ser armazenadas indefinidamente apenas porque Storage é barato.

---

# 163. Deletion

Quando aplicável, exclusão de dados de origem deverá refletir em:

```text
AI Cache

Vector Index

Derived Context

Stored Summaries
```

conforme políticas correspondentes.

---

# 164. AI Cache

Caching deverá considerar sensibilidade e Tenant Isolation.

---

# 165. Cache Key

Cache não poderá permitir colisões entre Tenants.

---

# 166. Environment Isolation

```text
Development

Staging

Production
```

deverão possuir configurações e dados separados.

---

# 167. Development

Developers deverão utilizar preferencialmente dados sintéticos.

---

# 168. Production Data

Production Patient Data não deverá ser utilizado livremente para desenvolvimento de AI.

---

# 169. AI Testing

Testes deverão incluir:

```text
Unit Tests

Integration Tests

Contract Tests

Evaluation Tests

Safety Tests

Authorization Tests
```

---

# 170. Authorization Tests

Deverão testar explicitamente:

```text
User cannot ask AI
to retrieve data
they cannot access normally.
```

---

# 171. Cross-Tenant Tests

Testes automatizados deverão procurar vazamento entre Organizations.

---

# 172. Tool Tests

Cada Tool deverá ser testada independentemente do Model.

---

# 173. Prompt Tests

Prompt behavior poderá ser avaliado através de Evaluation Suite.

---

# 174. Provider Contract Tests

Adapters deverão validar compatibilidade com Providers.

---

# 175. Failure Tests

Testar:

```text
Provider Timeout

Invalid JSON

Tool Failure

Rate Limit

Partial Response

Model Refusal
```

---

# 176. Security Testing

AI Features deverão fazer parte de Threat Modeling.

---

# 177. AI Threat Model

Ameaças incluem:

```text
Prompt Injection

Indirect Prompt Injection

Cross-Tenant Leakage

Data Exfiltration

Unauthorized Tool Execution

Sensitive Logging

Model Abuse

Provider Compromise

Credential Leakage
```

---

# 178. API Boundary

Clientes não deverão acessar Provider Credentials.

---

# 179. Server-Side AI

Calls que utilizem Credentials privadas deverão ocorrer em ambiente seguro de servidor.

---

# 180. Client-Side AI

Integrações diretas do Browser com Providers externos deverão ser evitadas quando expuserem Secrets ou eliminarem controles centrais.

---

# 181. Streaming

Responses poderão utilizar Streaming quando melhorar UX.

---

# 182. Streaming Safety

Streaming não elimina necessidade de:

- Authorization.
- Rate Limits.
- Error Handling.
- Cancellation.
- Safety.

---

# 183. Cancellation

Usuário poderá cancelar operações longas quando tecnicamente apropriado.

---

# 184. Background AI Jobs

Tasks demoradas poderão utilizar Jobs assíncronos.

```text
Request

↓

Job Created

↓

Worker

↓

AI Provider

↓

Result

↓

Notification / UI Update
```

---

# 185. AI Job Status

Possíveis:

```text
queued

processing

completed

failed

cancelled
```

---

# 186. AI Job Idempotency

Jobs deverão evitar processamento duplicado quando houver Side Effects ou custos relevantes.

---

# 187. AI Job Retry

Retry Policy deverá considerar Provider, Task e Idempotency.

---

# 188. AI Job Ownership

Todo Job deverá estar associado ao contexto apropriado.

```text
organizationId

initiatedBy

task
```

quando aplicável.

---

# 189. AI Job Access

Usuário não deverá consultar Job de outro Tenant.

---

# 190. Notifications

Conclusão de Tasks assíncronas poderá integrar com `Notifications`.

---

# 191. Reports

AI poderá auxiliar interpretação de Reports.

Mas:

```text
AI Explanation

≠

Report Data
```

---

# 192. Patients

AI poderá recuperar informações de Patients somente através de permissões adequadas.

---

# 193. Appointments

AI poderá auxiliar Scheduling, mas Appointments continuará Source of Truth.

---

# 194. Medical Records

AI poderá preparar Drafts ou Summaries.

Medical Records continuará responsável pelo registro oficial.

---

# 195. Prescriptions

AI não deverá criar prescrição oficial apenas por geração textual.

Qualquer capacidade futura deverá respeitar requisitos clínicos, legais e de autorização aplicáveis.

---

# 196. Exams

AI poderá auxiliar organização ou resumo de informações de Exams.

Dados originais continuarão autoritativos.

---

# 197. Finance

AI poderá auxiliar explicação e análise.

Não deverá modificar registros financeiros sem fluxo autorizado.

---

# 198. Payments

AI não deverá manipular Payment Credentials.

---

# 199. Reception

AI poderá auxiliar tarefas administrativas da recepção.

---

# 200. Professionals

Professional Identity e Permissions deverão ser fornecidas pelo respectivo domínio.

---

# 201. Clinics

Organization / Clinic Context deverá limitar AI Requests.

---

# 202. Settings

AI Settings poderão ser administradas através do módulo de Settings quando apropriado.

---

# 203. Telemedicine

AI poderá futuramente auxiliar workflows de Telemedicine.

Gravação, transcrição ou processamento de consulta exigirá controles adicionais.

---

# 204. Notifications

AI poderá preparar conteúdo.

O módulo Notifications continuará responsável pela entrega.

---

# 205. API Concept

Possíveis endpoints internos:

```text
POST /ai/tasks/{task}
POST /ai/conversations
POST /ai/conversations/{id}/messages
POST /ai/feedback
GET  /ai/jobs/{id}
POST /ai/jobs/{id}/cancel
```

São contratos conceituais.

Não significam necessariamente endpoints já implementados.

---

# 206. Internal Service Contract

Exemplo conceitual:

```ts
interface AIService {
  executeTask(input: AITaskInput): Promise<AITaskResult>;

  createConversation(
    input: CreateConversationInput
  ): Promise<AIConversation>;

  submitFeedback(
    input: AIFeedbackInput
  ): Promise<void>;
}
```

---

# 207. Tool Contract

```ts
interface AITool<TInput, TOutput> {
  name: string;

  authorize(
    context: ExecutionContext,
    input: TInput
  ): Promise<void>;

  execute(
    context: ExecutionContext,
    input: TInput
  ): Promise<TOutput>;
}
```

O contrato final dependerá da implementação real.

---

# 208. Error Model

Possíveis categorias:

```text
AI_PROVIDER_UNAVAILABLE

AI_TIMEOUT

AI_RATE_LIMITED

AI_INVALID_OUTPUT

AI_TASK_NOT_ALLOWED

AI_MODEL_NOT_AVAILABLE

AI_TOOL_NOT_ALLOWED

AI_TOOL_FAILED

AI_CONTEXT_UNAVAILABLE

AI_POLICY_BLOCKED
```

---

# 209. User-Facing Errors

Usuários não deverão receber mensagens técnicas como:

```text
HTTP 429 from upstream provider.
```

Preferir mensagem compreensível.

---

# 210. Internal Error Detail

Detalhes técnicos deverão permanecer em Telemetry segura.

---

# 211. AI Feature Flags

Novas capacidades poderão ser liberadas gradualmente.

---

# 212. Feature Flag Dimensions

Possíveis:

```text
Environment

Organization

User Cohort

Feature

Model Version
```

---

# 213. Emergency Disable

Features críticas de AI deverão possuir mecanismo de desativação rápida.

---

# 214. Rollback

Mudança de Prompt ou Model deverá poder ser revertida quando possível.

---

# 215. Configuration

Configuração deverá permanecer separada do código quando apropriado.

---

# 216. Secrets

Provider API Keys deverão utilizar Secret Management apropriado.

---

# 217. Secret Rotation

Credentials deverão ser rotacionáveis.

---

# 218. No Secrets in Repository

Secrets não deverão ser commitados.

---

# 219. No Secrets in Logs

Também não deverão aparecer em Telemetry.

---

# 220. Performance

AI possui Latency maior que operações tradicionais.

UX deverá refletir isso.

---

# 221. Perceived Performance

Streaming, Progress Indicators e Background Jobs poderão melhorar experiência.

---

# 222. No Fake Progress

Interface não deverá fingir porcentagem de conclusão quando o sistema não possui essa informação.

---

# 223. Timeout UX

Usuário deverá receber estado claro quando Task falhar ou exceder tempo.

---

# 224. Accessibility

Interfaces de AI deverão seguir o Design System e requisitos de Accessibility.

---

# 225. AI Streaming Accessibility

Conteúdo em Streaming não deverá criar experiência impraticável para tecnologias assistivas.

---

# 226. User Control

Usuário deverá conseguir revisar Outputs importantes antes de ações relevantes.

---

# 227. AI Identification

Quando necessário para compreensão e segurança, a UI deverá deixar claro que determinado conteúdo foi gerado ou auxiliado por AI.

---

# 228. No Anthropomorphic Authority

A interface deverá evitar apresentar AI como autoridade médica ou humana.

---

# 229. Explainability

O nível de explicação deverá ser proporcional ao impacto da Task.

---

# 230. Provenance UI

Para Summaries importantes, poderá existir:

```text
View Sources
```

---

# 231. Product Metrics

Possíveis métricas:

```text
AI Feature Adoption

Task Completion Rate

User Acceptance

Edit Rate

Override Rate

Feedback Rate

Time Saved
```

---

# 232. Edit Rate

Para Drafts:

```text
How much did the user
change before accepting?
```

poderá ser sinal útil.

---

# 233. Acceptance Is Not Accuracy

Usuário aceitar Output não prova que ele estava correto.

---

# 234. AI Success

Sucesso deverá ser medido pelo problema resolvido.

Não pelo número de Tokens consumidos.

---

# 235. AI Feature Evaluation

Antes de lançar uma Feature, perguntar:

```text
Does AI meaningfully improve this workflow?

Is deterministic software sufficient?

What happens when AI is wrong?

Can the user detect the error?

Can the error be reversed?

What data must be sent?

What is the operational cost?
```

---

# 236. When Not to Use AI

AI não deverá ser utilizada quando solução determinística simples for melhor.

Exemplo:

```text
Validate CPF format
```

não precisa de LLM.

---

# 237. AI Anti-Pattern

```text
We have AI.

Therefore every feature
must use AI.
```

é explicitamente rejeitado.

---

# 238. Architecture Principle

```text
Deterministic Core

+

Controlled Intelligence

=

MedFlow AI Architecture
```

---

# 239. Data Flow

```text
User
 │
 ▼
MedFlow UI
 │
 ▼
Application Layer
 │
 ▼
Authorization
 │
 ▼
AI Task
 │
 ├────────────► Context Builder
 │                    │
 │                    ▼
 │             Authorized Data
 │
 ├────────────► Policy Engine
 │
 └────────────► Tool Registry
                      │
                      ▼
                  AI Gateway
                      │
                      ▼
                Approved Model
                      │
                      ▼
               Validated Output
                      │
              ┌───────┴────────┐
              ▼                ▼
          User Output      Tool Request
                               │
                               ▼
                          Authorization
                               │
                               ▼
                         Domain Service
```

---

# 240. Security Boundary

O AI Provider deverá ser tratado como sistema externo.

Mesmo quando altamente confiável.

---

# 241. Trust Boundary

```text
MedFlow

│ TRUST BOUNDARY │

External AI Provider
```

---

# 242. Failure Boundary

Falha do Provider não deverá corromper estado interno.

---

# 243. Provider Response Validation

Toda resposta deverá ser validada conforme Task.

---

# 244. Model Behavior Changes

Providers poderão alterar comportamento de Models.

Por isso Model Version e Evaluation são importantes.

---

# 245. Deprecated Models

Quando Provider anunciar descontinuação:

```text
Impact Analysis

↓

Candidate Replacement

↓

Evaluation

↓

Migration

↓

Monitoring
```

---

# 246. Emergency Provider Migration

A arquitetura deverá permitir troca quando Provider se tornar indisponível ou inadequado.

---

# 247. AI Governance Ownership

Conforme o produto amadurecer, deverá existir Ownership explícito para AI Governance.

---

# 248. Governance Responsibilities

Incluem:

```text
Provider Approval

Model Approval

Task Risk

Evaluation Standards

Data Policies

Incident Response

Cost Policies
```

---

# 249. AI Incident

Exemplos:

```text
Sensitive Data Leakage

Unauthorized Tool Execution

Cross-Tenant Exposure

Unsafe Clinical Output

Provider Security Incident
```

---

# 250. Incident Response

AI Incidents deverão integrar o processo geral de Incident Management.

---

# 251. Kill Paths

Deverá ser possível desativar:

```text
Feature

Task

Agent

Tool

Model

Provider
```

conforme arquitetura permitir.

---

# 252. Documentation

Toda AI Feature importante deverá documentar:

```text
Purpose

Inputs

Outputs

Data Used

Model

Risk

Tools

Human Oversight

Evaluation

Failure Behavior
```

---

# 253. Future Developer Guidance

Ao modificar este módulo, o desenvolvedor deverá perguntar:

```text
Am I giving the Model
more data than necessary?

Am I giving the Model
more authority than necessary?

Can this action be deterministic?

Is Authorization enforced
outside the Model?

Can this operation be audited?

What happens if the Model lies?

What happens if the Provider fails?

Can we change Provider later?
```

---

# 254. AI Module Invariants

Os seguintes princípios deverão permanecer verdadeiros:

```text
AI does not authorize access.

AI does not bypass domains.

AI does not own Patient Data.

AI does not directly own Clinical Records.

AI does not directly own Appointments.

AI does not receive unrestricted Database access.

AI Outputs are not automatically facts.

AI capability does not imply authority.

Sensitive actions remain controlled.

Tenant Isolation always applies.
```

---

# 255. Current / Planned / Future Matrix

A matriz deverá ser atualizada conforme implementação real evoluir.

| Capacidade | Estado |
|------------|--------|
| AI Infrastructure | Planned / conforme implementação atual |
| Central AI Gateway | Planned |
| Prompt Registry | Planned |
| Model Registry | Planned |
| AI Assistant | Planned |
| AI Summaries | Planned |
| Tool Calling | Planned |
| AI Evaluation | Planned |
| AI Feedback | Planned |
| Model Routing | Future |
| Provider Fallback | Future |
| AI Agents | Future |
| Agent Approval Queue | Future |
| Semantic Retrieval | Future |
| Clinical Decision Support | Future |
| Autonomous Clinical Actions | Não planejado como comportamento padrão |

> Este quadro deverá ser sincronizado com o código e Roadmap antes de Releases oficiais.

---

# 256. Decisões Arquiteturais e de Produto

## ADR-661

Todos os acessos a Providers de AI deverão ocorrer através de boundaries controlados pelo MedFlow.

---

## ADR-662

Módulos de negócio não deverão depender diretamente de SDKs específicos de AI Providers quando uma abstração central for apropriada.

---

## ADR-663

AI Models não serão considerados mecanismos de Authorization.

---

## ADR-664

Authorization deverá ocorrer antes da inclusão de dados sensíveis no AI Context.

---

## ADR-665

AI Requests deverão preservar Tenant Isolation.

---

## ADR-666

Somente dados necessários à Task deverão ser enviados aos Models.

---

## ADR-667

Providers e Models utilizados em Production deverão ser explicitamente aprovados.

---

## ADR-668

Models deverão ser avaliados em Tasks representativas do MedFlow antes de mudanças relevantes em Production.

---

## ADR-669

Prompts críticos deverão possuir Versioning e Evaluation.

---

## ADR-670

Business Rules críticas não deverão existir exclusivamente em Prompts.

---

## ADR-671

AI Outputs destinados a processamento automático deverão utilizar Structured Output quando apropriado.

---

## ADR-672

Structured Outputs deverão passar por Schema Validation antes de utilização.

---

## ADR-673

AI Tools deverão possuir contratos específicos e não fornecer acesso genérico ao Database.

---

## ADR-674

Tool Calls deverão aplicar Authorization independentemente da decisão do Model.

---

## ADR-675

Inputs gerados pelo Model deverão ser tratados como dados não confiáveis.

---

## ADR-676

Write Operations de maior risco deverão suportar Preview e Human Approval quando apropriado.

---

## ADR-677

Domain Services continuarão responsáveis por validar Business Rules de ações originadas por AI.

---

## ADR-678

AI Agents não poderão possuir autoridade superior à interseção entre User Permission, System Policy e Agent Policy.

---

## ADR-679

Agents deverão possuir Execution Limits e mecanismo de desativação.

---

## ADR-680

AI Memory não será utilizada como substituto de Medical Records, Patient Records ou Audit Logs.

---

## ADR-681

Conversas com AI não serão automaticamente promovidas a registros clínicos oficiais.

---

## ADR-682

Conteúdo clínico gerado por AI deverá ser tratado como Draft ou Assistance até passar pelo fluxo apropriado de validação.

---

## ADR-683

Retrieved Content será tratado como Data e não como instrução autoritativa para o Model.

---

## ADR-684

A arquitetura de AI deverá considerar Prompt Injection e Indirect Prompt Injection como ameaças permanentes.

---

## ADR-685

AI não possuirá mecanismo genérico para exfiltrar dados para destinos arbitrários.

---

## ADR-686

Secrets não serão enviados dentro de Prompts ou Context.

---

## ADR-687

System Prompt não será considerado Security Boundary.

---

## ADR-688

Hallucination será tratada como risco inerente de sistemas generativos.

---

## ADR-689

Medidas de confiança produzidas pelo próprio Model não serão apresentadas como probabilidade objetiva de correção sem metodologia validada.

---

## ADR-690

Clinical AI possuirá requisitos de avaliação e Human Oversight proporcionais ao risco.

---

## ADR-691

Mudanças relevantes de Model, Prompt ou Context Strategy poderão exigir Regression Evaluation.

---

## ADR-692

Production Patient Data não será utilizado livremente como Dataset de desenvolvimento ou Evaluation.

---

## ADR-693

Synthetic ou appropriately governed Evaluation Data serão preferidos para testes.

---

## ADR-694

AI Telemetry não armazenará Prompt e Response completos por padrão.

---

## ADR-695

AI Logs deverão minimizar exposição de Patient Data e outros dados sensíveis.

---

## ADR-696

Provider Fallback somente utilizará Models aprovados para a mesma categoria de Task.

---

## ADR-697

Core Workflows deverão continuar disponíveis durante indisponibilidade de AI quando AI não for requisito essencial daquele Workflow.

---

## ADR-698

AI deverá possuir controles de Rate Limiting e Abuse Protection.

---

## ADR-699

Custos de AI deverão ser observáveis por Feature ou Task quando tecnicamente possível.

---

## ADR-700

Model Routing poderá considerar Capability, Risk, Cost, Latency e Availability.

---

## ADR-701

Entitlements comerciais de AI permanecerão separados de Authorization e Safety Policies.

---

## ADR-702

AI Audit deverá registrar Metadata suficiente para reconstruir ações relevantes sem copiar conteúdo sensível desnecessariamente.

---

## ADR-703

Derived AI Data deverá possuir Lifecycle compatível com dados de origem quando aplicável.

---

## ADR-704

Vector Indexes contendo representações derivadas de dados sensíveis permanecerão sujeitos a Security, Privacy e Tenant Isolation.

---

## ADR-705

AI Integrations que dependam de Credentials privadas deverão ocorrer Server-Side.

---

## ADR-706

Background AI Jobs deverão possuir Ownership, Tenant Context e Status explícitos.

---

## ADR-707

Retries envolvendo AI Tools com Side Effects deverão considerar Idempotency.

---

## ADR-708

AI Features deverão possuir mecanismo de Emergency Disable proporcional à criticidade.

---

## ADR-709

AI Provider Credentials deverão utilizar Secret Management e nunca ser armazenadas no Source Repository.

---

## ADR-710

AI Interfaces deverão respeitar Accessibility e não utilizar Fake Progress.

---

## ADR-711

AI-generated content deverá ser identificado quando essa informação for relevante para segurança, compreensão ou decisão do usuário.

---

## ADR-712

AI Adoption não será utilizada isoladamente como métrica de sucesso.

---

## ADR-713

Uma solução determinística será preferida quando resolver o problema de maneira mais segura, simples e confiável.

---

## ADR-714

O MedFlow rejeita AI Everywhere como estratégia de produto.

---

## ADR-715

A arquitetura seguirá o princípio de Deterministic Core combinado com Controlled Intelligence.

---

## ADR-716

External AI Providers permanecerão fora do Trust Boundary principal do MedFlow.

---

## ADR-717

Responses de Providers deverão ser tratadas como Inputs externos e validadas.

---

## ADR-718

Model Deprecation deverá possuir processo de avaliação e migração.

---

## ADR-719

AI Governance deverá possuir Ownership explícito conforme a maturidade e criticidade da plataforma aumentarem.

---

## ADR-720

AI Incidents deverão integrar o processo oficial de Security e Incident Management do MedFlow.

---

# 257. Relação com Outros Documentos

Este documento deverá ser lido em conjunto com:

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
```

A pasta `09-AI/` define a arquitetura transversal de inteligência artificial.

Este documento define o módulo funcional correspondente dentro da organização de módulos do MedFlow.

---

# 258. Hierarquia de Autoridade

Em caso de conflito:

```text
Current Approved Specification

↓

Current Security / Privacy Requirements

↓

Current Architecture ADR

↓

Current Module Documentation

↓

Roadmap

↓

Idea Backlog
```

Código em Production deverá ser considerado evidência importante do estado atual, mas divergências entre código e documentação deverão ser investigadas em vez de simplesmente assumir que um dos dois está correto.

---

# 259. Checklist para Implementação

Antes de implementar uma AI Feature:

- [ ] Existe problema real que justifica AI?
- [ ] Task está claramente definida?
- [ ] Risk Level foi avaliado?
- [ ] Dados necessários foram identificados?
- [ ] Data Minimization foi aplicada?
- [ ] Authorization ocorre antes do Context?
- [ ] Tenant Isolation está garantido?
- [ ] Provider está aprovado?
- [ ] Model está aprovado?
- [ ] Prompt possui versão quando necessário?
- [ ] Output possui validação?
- [ ] Tools possuem Authorization?
- [ ] Human Approval é necessário?
- [ ] Failure Behavior foi definido?
- [ ] Provider Failure foi considerado?
- [ ] Telemetry foi definida?
- [ ] Sensitive Logging foi evitado?
- [ ] Cost foi considerado?
- [ ] Evaluation foi criada?
- [ ] Rollback é possível?
- [ ] Feature pode ser desativada?
- [ ] Documentação foi atualizada?

---

# 260. Checklist para Code Review

Reviewer deverá verificar:

```text
[ ] No direct provider coupling without justification
[ ] No authorization delegated to AI
[ ] No unrestricted database access
[ ] No cross-tenant data path
[ ] No secrets in prompts
[ ] No sensitive logs
[ ] Inputs validated
[ ] Outputs validated
[ ] Tool permissions enforced
[ ] Business rules remain in domain
[ ] Errors handled
[ ] Timeouts configured
[ ] Retries safe
[ ] Costs observable
[ ] Tests included
[ ] Documentation updated
```

---

# 261. Definition of Done

Uma AI Feature não estará concluída apenas porque:

```text
The model responds.
```

Definition of Done deverá considerar:

```text
Functional

+

Authorized

+

Secure

+

Evaluated

+

Observable

+

Cost-Aware

+

Accessible

+

Documented

+

Recoverable
```

---

# 262. Direção de Evolução

A evolução esperada do módulo poderá seguir:

```text
Central AI Access

↓

Task-Based AI

↓

Prompt + Model Governance

↓

Retrieval

↓

Controlled Tools

↓

Evaluation Platform

↓

Contextual Assistant

↓

Controlled Agents

↓

Advanced AI Platform
```

Essa sequência não representa compromisso de Release.

Cada estágio deverá ser justificado por necessidade real.

---

# 263. Invariante Final

Independentemente de quanto os Models evoluam:

```text
AI may become
more capable.

That does not mean
AI should become
less controlled.
```

Quanto maior a capacidade:

```text
More Capability

↓

More Potential Impact

↓

More Need for Governance
```

---

# 264. Considerações Finais

A inteligência artificial poderá se tornar uma das capacidades mais importantes do MedFlow.

Mas seu valor não estará em simplesmente possuir um Chatbot.

O verdadeiro valor estará em utilizar inteligência para reduzir trabalho, organizar informação e melhorar workflows sem comprometer os fundamentos da plataforma.

```text
AI without context

=

Generic Intelligence
```

```text
AI + MedFlow Context

=

Useful Intelligence
```

Mas ainda falta uma parte:

```text
AI

+

Context

+

Authorization

+

Domain Rules

+

Evaluation

+

Human Oversight

=

Responsible MedFlow Intelligence
```

O MedFlow não deverá competir para ser o sistema que dá mais liberdade à AI.

Deverá buscar ser o sistema que utiliza AI de maneira mais útil, controlada e confiável para os problemas que realmente importam.

Um Model poderá mudar.

Um Provider poderá desaparecer.

Uma técnica hoje considerada avançada poderá se tornar obsoleta.

Os boundaries não deverão depender disso.

```text
Models change.

Providers change.

Technology changes.

Patient trust must remain.
```

Por isso, o módulo de AI deverá ser construído sobre uma ideia simples:

```text
Intelligence assists.

MedFlow governs.
```

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação da documentação oficial do módulo de Inteligência Artificial, consolidando arquitetura, Provider e Model Governance, Prompt Management, Context Assembly, RAG, Tool Calling, Agents, Clinical Safety, Evaluation, Observability, custos, segurança, privacidade, integração com domínios e decisões ADR-661 a ADR-720 | Equipe MedFlow |