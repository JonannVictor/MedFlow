# Assistente de Inteligência Artificial (AI Assistant)

| Campo | Valor |
|-------|--------|
| Documento | AI Assistant |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | AI |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

O **MedFlow AI Assistant** representa a interface inteligente entre os usuários e as capacidades de Inteligência Artificial da plataforma.

Seu propósito é permitir que profissionais e equipes utilizem os recursos do MedFlow por meio de linguagem natural, oferecendo assistência contextual para consulta de informações, organização de dados, execução de tarefas autorizadas e apoio aos fluxos clínicos, administrativos e operacionais.

O AI Assistant deverá atuar exclusivamente como mecanismo de apoio.

Ele não constitui fonte oficial de dados, não substitui os mecanismos de autorização da plataforma e não substitui o julgamento de profissionais de saúde.

Toda operação deverá respeitar identidade, tenant, permissões, contexto, segurança, rastreabilidade e os princípios de **Human-in-the-Loop** definidos pela arquitetura do MedFlow.

---

# Objetivos

O AI Assistant possui os seguintes objetivos:

- Simplificar a interação com a plataforma.
- Reduzir tarefas operacionais repetitivas.
- Facilitar recuperação de informações.
- Oferecer assistência contextual.
- Permitir utilização segura de AI Tools.
- Apoiar fluxos clínicos e administrativos.
- Preservar permissões existentes.
- Reduzir carga cognitiva dos usuários.
- Manter respostas fundamentadas nos dados oficiais.
- Garantir auditoria das operações relevantes.
- Permitir evolução independente dos clientes Web e Mobile.

---

# Princípios Fundamentais

O AI Assistant deverá ser:

```text
Contextual

Seguro

Explicável

Auditável

Permission-Aware

Tool-Aware

Multi-Tenant

Grounded

Human-in-the-Loop
```

Esses princípios são obrigatórios para qualquer capacidade atual ou futura do assistente.

---

# Regra Arquitetural Fundamental

Duas regras são consideradas invariantes da arquitetura:

```text
AI Assistant ≠ Source of Truth
```

e:

```text
AI Assistant ≠ Authorization System
```

O assistente utiliza as fontes oficiais e os mecanismos de autorização existentes.

Ele nunca deverá criar uma fonte paralela de informação clínica, financeira, administrativa ou de segurança.

---

# Responsabilidades

O AI Assistant poderá auxiliar em:

- Navegação pela plataforma.
- Busca de informações.
- Resumo de informações.
- Organização de dados.
- Preparação de documentos.
- Consulta de agenda.
- Consulta de pacientes autorizados.
- Consulta de prontuários autorizados.
- Apoio administrativo.
- Apoio clínico.
- Interpretação contextual de informações.
- Sugestões.
- Recuperação de conhecimento.
- Execução de ferramentas autorizadas.

---

# Não Responsabilidades

O AI Assistant não deverá:

- Substituir profissionais de saúde.
- Realizar diagnóstico autônomo.
- Prescrever autonomamente.
- Assinar documentos clínicos.
- Alterar prontuários sem autorização.
- Executar ações críticas silenciosamente.
- Ignorar permissões.
- Acessar dados pertencentes a outro tenant.
- Inventar informações clínicas.
- Ocultar incerteza relevante.
- Criar permissões.
- Contornar regras de negócio.
- Tornar sua própria memória uma fonte oficial de dados.

---

# Arquitetura Geral

```text
User

↓

AI Assistant Interface

↓

AI Gateway

↓

AI Orchestrator

├── Identity Context
├── Permission Engine
├── Context Manager
├── Memory Manager
├── Retrieval Engine
├── Prompt Engine
├── Tool Router
├── Safety Layer
└── Observability

↓

Model Router

↓

AI Provider

↓

Response Pipeline

↓

Response / Proposed Action

↓

Human Confirmation
(quando aplicável)

↓

MedFlow
```

O `AI Gateway` permanece como ponto oficial de entrada da AI Platform, conforme definido em `02-AI-Architecture.md`.

---

# AI Orchestrator

O **AI Orchestrator** representa o núcleo operacional do assistente.

É responsável por coordenar:

- Identidade.
- Tenant.
- Permissões.
- Intenção.
- Contexto.
- Memória.
- Retrieval.
- Prompt.
- Skills.
- Tools.
- Modelo.
- Segurança.
- Validação.
- Observabilidade.

O Orchestrator não substitui os componentes especializados da AI Platform.

Sua função é coordená-los.

---

# Fluxo de Requisição

```text
Usuário envia mensagem

↓

AI Gateway

↓

Identificação do usuário

↓

Identificação do tenant

↓

Validação das permissões

↓

Classificação da intenção

↓

Identificação do Agent / Skill

↓

Recuperação do contexto necessário

↓

Seleção das Tools autorizadas

↓

Construção do Prompt

↓

Model Routing

↓

Execução

↓

Structured Output / Response

↓

Validation

↓

Safety Check

↓

Auditoria

↓

Resposta ao usuário
```

Quando uma ação exigir confirmação:

```text
Resposta / Proposta

↓

User Review

↓

Explicit Confirmation

↓

Permission Revalidation

↓

Tool Execution

↓

Audit Log
```

---

# Context Manager

O Context Manager determina quais informações são necessárias para atender à solicitação atual.

O contexto poderá incluir:

```text
User

Tenant

Role

Permissions

Current Screen

Current Module

Patient ID

Appointment ID

Medical Record ID

Selected Date

Conversation Context

Retrieved Information

Tool Results
```

---

# Contexto Mínimo

O princípio de **Data Minimization** é obrigatório.

Somente os dados necessários deverão ser fornecidos ao modelo.

Exemplo:

```text
Usuário:

"Quais são meus atendimentos de hoje?"
```

Contexto potencialmente necessário:

```text
User ID

Professional ID

Clinic ID

Current Date

Appointment Permissions
```

Não há justificativa para enviar:

```text
Prontuários completos

Prescrições

Dados financeiros

Histórico clínico completo

Dados de outros pacientes
```

O Context Manager deverá minimizar simultaneamente:

- Exposição de dados.
- Context Window.
- Tokens.
- Latência.
- Custo.

---

# Contexto da Interface

O AI Assistant poderá receber contexto controlado da interface atual.

Exemplo:

```text
currentScreen

currentModule

patientId

appointmentId

medicalRecordId

selectedDate
```

Isso permitirá comandos contextuais como:

```text
"Resuma este prontuário."

"Mostre as últimas consultas deste paciente."

"Explique estes dados."

"Organize esta evolução."
```

O contexto fornecido pelo cliente nunca deverá substituir validação de autorização no Backend.

---

# Permission Engine

Antes da recuperação de qualquer recurso interno:

```text
AI Request

↓

Identity Validation

↓

Permission Engine

↓

RBAC

↓

Tenant Validation

↓

Resource Authorization

↓

Tool Execution
```

---

# Regra de Permissão

A seguinte relação deverá permanecer verdadeira:

```text
AI Permissions ⊆ User Permissions
```

A IA nunca poderá aumentar privilégios.

Se determinado usuário não possui acesso a uma informação através dos fluxos normais do MedFlow, também não poderá acessá-la através do AI Assistant.

---

# Multi-Tenancy

Toda operação deverá possuir contexto explícito de tenant.

Exemplo:

```text
clinic_id
```

O AI Assistant jamais poderá utilizar informações pertencentes a outra organização.

As políticas de isolamento, autorização e RLS da plataforma continuam válidas para operações iniciadas por IA.

---

# Perfis de Usuário

O comportamento do assistente poderá variar conforme o perfil autenticado.

## Médico

Poderá receber assistência autorizada relacionada a:

- Prontuários.
- Histórico clínico.
- Consultas.
- Exames.
- Prescrições.
- Resumos.
- Documentação clínica.
- Informações clínicas autorizadas.

---

## Enfermagem

Poderá receber assistência relacionada a:

- Sinais vitais.
- Atendimentos.
- Pacientes.
- Registros permitidos.
- Rotinas assistenciais.

---

## Recepção

Poderá receber assistência relacionada a:

- Agenda.
- Pacientes.
- Cadastros.
- Horários.
- Comunicação.
- Fluxos administrativos.

O perfil não deverá receber informações clínicas restritas sem autorização específica.

---

## Financeiro

Poderá receber assistência relacionada a:

- Pagamentos.
- Faturas.
- Cobranças.
- Relatórios financeiros.
- Indicadores autorizados.

---

## Administrador

Poderá receber assistência relacionada a:

- Configurações.
- Usuários.
- Operação da clínica.
- Relatórios.
- Indicadores.

Permissões administrativas não implicam automaticamente acesso irrestrito às informações clínicas.

---

# Agents e Skills

O AI Assistant deverá utilizar a arquitetura modular definida em `03-AI-Modules.md`.

Exemplo:

```text
AI Assistant

↓

Intent Detection

↓

Agent

↓

Skill

↓

Tool
```

Exemplo clínico:

```text
Clinical Agent

↓

Summary Skill

↓

GetMedicalRecord Tool

↓

Structured Summary
```

O Assistant coordena a experiência conversacional.

Os Agents coordenam domínios.

As Skills executam capacidades específicas.

As Tools interagem com recursos controlados da plataforma.

---

# Tool System

O AI Assistant poderá utilizar ferramentas internas para consultar ou executar operações.

Exemplos:

```text
SearchPatient

GetPatient

SearchAppointments

GetAppointment

GetMedicalRecord

SearchExams

GetPrescription

SearchInvoices

GetDashboardMetrics

SendNotification
```

O catálogo real deverá evoluir juntamente com os módulos do MedFlow.

---

# Tool Registry

Todas as Tools deverão existir em um registro central.

Cada Tool deverá definir, no mínimo:

```text
name

version

description

input_schema

output_schema

required_permissions

allowed_roles

risk_level

requires_confirmation

timeout

audit_policy
```

Tools não registradas não poderão ser utilizadas pelo modelo.

---

# Tool Execution

O modelo nunca executará operações diretamente.

Fluxo obrigatório:

```text
Model requests Tool

↓

Tool Router

↓

Tool Registry

↓

Input Schema Validation

↓

Permission Validation

↓

Tenant Validation

↓

Risk Validation

↓

Confirmation Check

↓

Execution

↓

Result Sanitization

↓

Audit

↓

Model / Response Pipeline
```

---

# Classificação de Risco das Tools

As Tools deverão possuir classificação de risco.

## Low Risk

Consultas simples e autorizadas.

Exemplo:

```text
Consultar agenda
```

---

## Medium Risk

Operações que modificam informações de baixo impacto.

Exemplo:

```text
Atualizar dados administrativos
```

---

## High Risk

Operações sensíveis ou potencialmente irreversíveis.

Exemplos:

```text
Cancelar atendimento

Efetuar cobrança

Realizar estorno

Alterar permissões

Modificar informação clínica
```

High Risk deverá exigir confirmação explícita e revalidação de autorização.

---

# Ferramentas de Leitura

Operações de leitura poderão ser executadas automaticamente quando:

- O usuário estiver autenticado.
- O tenant estiver validado.
- A permissão estiver presente.
- A operação estiver dentro do escopo solicitado.

---

# Ferramentas de Escrita

Operações que modificam estado exigem controles adicionais.

Exemplos:

- Criar agendamento.
- Alterar agendamento.
- Atualizar cadastro.
- Enviar comunicação.
- Criar documento.

A política `requires_confirmation` deverá determinar quando confirmação explícita é necessária.

---

# Ações Críticas

Ações críticas nunca poderão ser executadas silenciosamente.

Exemplos:

- Emitir prescrição.
- Assinar prontuário.
- Excluir informação.
- Cancelar atendimento.
- Efetuar cobrança.
- Realizar estorno.
- Alterar permissões.

Fluxo:

```text
AI Suggestion

↓

User Review

↓

Explicit Confirmation

↓

Permission Revalidation

↓

Execution

↓

Audit Log
```

---

# Human-in-the-Loop

O MedFlow adota **Human-in-the-Loop** como princípio obrigatório.

A IA poderá:

```text
Analisar

Resumir

Organizar

Recuperar

Sugerir

Preparar
```

O profissional permanece responsável por:

```text
Revisar

Validar

Confirmar

Decidir

Assinar
```

---

# Memória

O AI Assistant poderá utilizar:

```text
Working Memory

Conversation Memory

User Preferences

Organizational Context
```

Cada categoria deverá possuir política própria de retenção e acesso.

---

# Working Memory

Representa contexto temporário necessário à interação atual.

Exemplos:

```text
Tela atual

Paciente selecionado

Consulta atual

Resultado de Tool
```

Deverá ser descartada quando deixar de ser necessária.

---

# Conversation Memory

Representa o histórico da conversa atual.

Poderá ser persistida através de entidades como:

```text
AIConversation

AIMessage
```

Conversas extensas deverão utilizar Context Compression.

---

# Long-Term Memory

Long-Term Memory deverá ser utilizada de maneira restritiva.

O sistema não deverá transformar automaticamente mensagens em memória permanente.

Somente informações:

- Permitidas.
- Necessárias.
- Não clínicas quando possível.
- Compatíveis com política de retenção.

poderão ser persistidas.

---

# Preferências Persistentes

Exemplos aceitáveis:

```text
Idioma preferido

Formato de relatório

Preferências de interface

Configurações operacionais não sensíveis
```

Informações clínicas não deverão ser transformadas em memória informal.

Elas pertencem às entidades clínicas oficiais.

---

# Source of Truth

A memória da IA nunca será considerada fonte oficial.

Exemplos de fontes oficiais:

```text
Patient

MedicalRecord

Appointment

Prescription

Exam

Financial Records

Demais entidades do MedFlow
```

Sempre que uma resposta depender de dados atuais, o Assistant deverá consultar a fonte oficial quando tecnicamente necessário.

---

# Retrieval

O Assistant poderá utilizar recuperação contextual.

```text
Question

↓

Intent Detection

↓

Retrieval Strategy

↓

Authorization

↓

Authorized Data Sources

↓

Relevant Context

↓

Generation
```

---

# RAG

Quando necessário, poderá ser utilizado **Retrieval-Augmented Generation (RAG)**.

Fontes possíveis:

- Documentação institucional.
- Protocolos internos.
- Base de conhecimento.
- Documentos autorizados.
- Conteúdo educacional validado.

Conteúdo recuperado não se torna confiável apenas por estar no RAG.

Documentos deverão possuir proveniência, permissões e processo de validação adequados.

---

# Proveniência

Toda informação recuperada deverá manter referência interna à origem quando aplicável.

Exemplo:

```text
source_type

source_id

source_version

retrieved_at

relevance
```

A proveniência permite:

- Auditoria.
- Explicabilidade.
- Investigação de falhas.
- Atualização de conteúdo.
- Avaliação de respostas.

---

# Personalidade

O MedFlow AI Assistant deverá possuir comportamento consistente.

Características:

- Profissional.
- Objetivo.
- Claro.
- Calmo.
- Respeitoso.
- Preciso.
- Transparente.

Deverá evitar:

- Excesso de informalidade.
- Linguagem alarmista.
- Julgamentos.
- Afirmações sem fundamento.
- Confiança artificial.
- Respostas excessivamente longas sem necessidade.

---

# Comunicação de Incerteza

Quando houver incerteza relevante, ela deverá ser comunicada.

Exemplo:

```text
"Os dados disponíveis não são suficientes para concluir isso."
```

Reconhecer ausência de informação é preferível a produzir conteúdo não fundamentado.

---

# Anti-Hallucination

Regra oficial:

```text
No Data

↓

No Claim
```

Quando determinada afirmação depender de dados do MedFlow e esses dados não estiverem disponíveis, o modelo não deverá inventá-los.

---

# Grounding

Respostas sobre informações internas deverão ser fundamentadas em dados autorizados recuperados das fontes oficiais.

```text
User Question

↓

Authorized Retrieval

↓

Grounded Context

↓

Generation

↓

Validation
```

---

# Clinical Safety

Informações clínicas exigem tratamento especial.

O AI Assistant poderá apoiar:

- Organização.
- Resumo.
- Recuperação de histórico.
- Comparação temporal.
- Preparação de informações.
- Documentação.
- Apoio à decisão.

Não deverá substituir avaliação profissional.

---

# AI Recommendations

Sugestões relevantes poderão possuir registro estruturado.

Exemplo:

```text
AIRecommendation
```

Uma recomendação deverá permitir rastrear, quando aplicável:

```text
conversation_id

message_id

prompt_version

model

context_reference

recommendation

status

professional_decision
```

O campo `confidence` somente deverá existir quando possuir significado mensurável e metodologia definida.

Não deverá representar uma porcentagem arbitrária produzida pelo LLM.

---

# Confirmação Profissional

Recomendações de impacto clínico deverão seguir:

```text
AI Recommendation

↓

Professional Review

↓

Accept / Reject

↓

Audit
```

Aceitação deverá representar ação explícita do profissional.

---

# Prompt Engine

O comportamento do Assistant deverá utilizar prompts registrados e versionados conforme `04-Prompt-Engineering.md`.

Prompts não deverão permanecer espalhados pelo código.

---

# Prompt Composition

O Prompt final poderá ser composto por:

```text
System Prompt

↓

Agent / Role Context

↓

Safety Rules

↓

Permission Context

↓

Feature Context

↓

Retrieved Context

↓

Conversation Context

↓

User Message
```

Conteúdo externo deverá permanecer claramente separado das instruções confiáveis do sistema.

---

# Model Routing

O Assistant poderá utilizar diferentes modelos conforme a tarefa.

Exemplo:

```text
Simple Task
    ↓
Fast Model

Complex Task
    ↓
Advanced Model

Summarization
    ↓
Optimized Model

Structured Extraction
    ↓
Structured Output Model
```

O Model Router deverá equilibrar:

- Qualidade.
- Segurança.
- Latência.
- Custo.
- Disponibilidade.

---

# Fallback

Em indisponibilidade:

```text
Primary Model

↓

Retry Policy

↓

Secondary Model

↓

Secondary Provider

↓

Controlled Failure
```

Fallback nunca poderá reduzir requisitos de:

- Segurança.
- Privacidade.
- Permissão.
- Output Validation.

---

# Structured Output

Operações consumidas programaticamente deverão utilizar Structured Output sempre que possível.

Preferência:

```text
JSON Schema
```

Exemplo:

```text
summary

findings

warnings

references
```

A aplicação deverá validar o resultado antes de utilizá-lo.

---

# Streaming

Respostas conversacionais poderão utilizar Streaming.

```text
Request

↓

Generation

↓

Token Stream

↓

UI
```

Operações estruturadas ou críticas somente deverão ser apresentadas como concluídas após validação integral.

---

# Cancelamento

O usuário deverá poder cancelar operações demoradas quando tecnicamente possível.

O cancelamento poderá interromper:

- Generation.
- Streaming.
- Tool Execution cancelável.

Operações já concluídas não deverão ser revertidas automaticamente.

---

# Conversation Lifecycle

```text
Created

↓

Active

↓

Messages

↓

Context Compression

↓

Archived

↓

Retention / Deletion
```

A retenção deverá respeitar políticas de privacidade e governança de dados.

---

# Context Compression

Conversas extensas não deverão enviar todo o histórico indefinidamente.

Estratégia:

```text
Recent Messages

+

Conversation Summary

+

Relevant Retrieved Context
```

Resumos de contexto não deverão transformar informação inferida em fato.

---

# Error Handling

Falhas deverão possuir tratamento controlado.

Tipos esperados:

```text
ModelUnavailable

ToolFailure

PermissionDenied

ContextUnavailable

RateLimitExceeded

InvalidOutput

Timeout

SafetyBlocked
```

O usuário deverá receber mensagem compreensível sem exposição de:

- Stack traces.
- Secrets.
- Prompts internos.
- Configurações sensíveis.
- Dados de outros tenants.

---

# Observabilidade

Toda operação deverá produzir telemetria apropriada.

Exemplos:

```text
Requests

Latency

Token Usage

Cost

Tool Calls

Errors

Fallbacks

Safety Blocks

User Feedback
```

---

# AI Usage

Consumo poderá ser registrado através de uma entidade como:

```text
AIUsage
```

Permitindo analisar:

```text
Provider

Model

Tokens

Latency

Cost

Clinic

User

Feature

Agent

Skill
```

Logs deverão respeitar políticas de minimização e proteção de dados.

---

# Auditoria

Eventos relevantes deverão produzir Audit Log.

Exemplos:

```text
AIConversationStarted

SensitiveResourceAccessed

ToolExecuted

CriticalActionRequested

CriticalActionConfirmed

AIRecommendationGenerated

AIRecommendationAccepted

AIRecommendationRejected
```

Auditoria deverá registrar o suficiente para reconstrução do evento sem armazenar conteúdo sensível desnecessário.

---

# Segurança

O AI Assistant deverá possuir controles contra:

- Prompt Injection.
- Indirect Prompt Injection.
- Data Exfiltration.
- Unauthorized Tool Calls.
- Cross-Tenant Access.
- Privilege Escalation.
- Sensitive Data Leakage.
- Malicious Retrieved Content.
- Tool Parameter Manipulation.

As regras detalhadas permanecem definidas em `05-AI-Security.md`.

---

# Rate Limiting

Limites poderão considerar:

```text
User

Clinic

Plan

Model

Feature

Time Window
```

Rate Limiting deverá proteger:

- Disponibilidade.
- Custos.
- Infraestrutura.
- Provedores externos.
- Uso abusivo.

---

# Cost Control

Estratégias permitidas:

- Model Routing.
- Context Compression.
- Cache seguro.
- Token Limits.
- Usage Quotas.
- Request Limits.
- Retrieval otimizado.

Redução de custo nunca deverá comprometer segurança clínica ou proteção de dados.

---

# Feedback

Usuários poderão avaliar respostas.

Exemplo:

```text
Helpful

Not Helpful
```

Feedback adicional poderá ser solicitado quando apropriado.

Esse conteúdo poderá alimentar avaliações do sistema, respeitando privacidade e governança.

---

# Quality Metrics

Indicadores recomendados:

```text
Groundedness

Task Success Rate

Tool Success Rate

User Satisfaction

Average Latency

Hallucination Rate

Fallback Rate

Safety Block Rate

Cost per Request
```

Métricas deverão possuir definição objetiva antes de serem utilizadas como KPI.

---

# Evaluation Pipeline

Mudanças relevantes deverão passar por avaliação antes de produção.

```text
Prompt / Model / Tool Change

↓

Evaluation Dataset

↓

Automated Evaluation

↓

Safety Evaluation

↓

Human Review

↓

Staging

↓

Controlled Rollout

↓

Production Monitoring
```

Mudanças de alto risco poderão exigir aprovação adicional.

---

# Interfaces

O mesmo núcleo do AI Assistant poderá atender:

```text
Mobile

Web

Future Interfaces
```

As regras críticas permanecerão no Backend.

Os clientes serão responsáveis principalmente por:

- Capturar interação.
- Fornecer contexto permitido.
- Apresentar Streaming.
- Exibir confirmações.
- Exibir fontes e feedback.
- Gerenciar estado visual.

---

# Evolução Futura

O AI Assistant poderá evoluir para:

- Voice.
- Multimodal Input.
- Document Analysis.
- OCR.
- Image Analysis.
- Advanced RAG.
- Workflow Automation.
- Specialized Agents.
- Proactive Assistance.

Capacidades futuras não são consideradas automaticamente aprovadas.

Cada nova capacidade deverá passar por revisão de:

- Segurança.
- Privacidade.
- Arquitetura.
- Risco clínico.
- Compliance.
- UX.
- Custos.

---

# Anti-Padrões

São considerados Anti-Padrões:

- Acesso direto do LLM ao banco.
- Bypass do AI Gateway.
- Tool sem registro.
- Tool sem Permission Check.
- Confiança arbitrária produzida pelo modelo.
- Prompt hardcoded.
- Dados de outro tenant no contexto.
- Memória informal usada como Source of Truth.
- Ação crítica sem confirmação.
- Contexto clínico excessivo.
- Persistência automática de toda conversa.
- Logs contendo dados sensíveis desnecessários.
- Cliente Web ou Mobile implementando regras críticas da IA.
- Resposta clínica apresentada como decisão definitiva.

---

# Decisões Arquiteturais

## ADR-088

O AI Assistant deverá utilizar arquitetura Backend-Centric.

Regras críticas de IA não deverão ser implementadas exclusivamente nos clientes Web ou Mobile.

---

## ADR-089

Toda recuperação de contexto e execução de Tool deverá respeitar autorização prévia.

---

## ADR-090

A IA nunca poderá possuir permissões superiores às do usuário autenticado.

---

## ADR-091

O modelo não possuirá acesso direto ao banco de dados ou à infraestrutura.

Toda operação interna deverá ocorrer através do Tool System.

---

## ADR-092

A memória do AI Assistant não será considerada Source of Truth.

---

## ADR-093

Ações críticas deverão utilizar Human-in-the-Loop e confirmação explícita.

---

## ADR-094

Informações internas deverão utilizar Grounding sempre que dependerem de dados da plataforma.

---

## ADR-095

Prompts utilizados pelo AI Assistant deverão ser registrados e versionados pelo Prompt Engine.

---

## ADR-096

O AI Assistant deverá preservar isolamento Multi-Tenant em todas as etapas do fluxo.

---

## ADR-097

Mudanças relevantes em Prompt, Model, Tool ou comportamento deverão passar pelo Evaluation Pipeline antes da liberação geral.

---

# Referência de Implementação

Estrutura conceitual recomendada:

```text
ai/

├── assistant/
│   ├── orchestrator/
│   ├── context/
│   ├── memory/
│   ├── retrieval/
│   ├── permissions/
│   └── response/
│
├── agents/
├── skills/
├── tools/
│   ├── registry/
│   ├── read/
│   └── write/
│
├── prompts/
├── models/
├── safety/
├── evaluation/
├── observability/
└── audit/
```

Essa estrutura representa responsabilidades arquiteturais.

A implementação concreta poderá variar conforme a evolução do Backend, desde que preserve os contratos definidos neste documento.

---

# Checklist de Conformidade

Antes da aprovação de qualquer capacidade do AI Assistant verificar:

| Item | Obrigatório |
|-------|-------------|
| AI Gateway utilizado | ✅ |
| Identidade validada | ✅ |
| Tenant validado | ✅ |
| Permissões validadas | ✅ |
| Contexto minimizado | ✅ |
| Prompt versionado | ✅ |
| Tool registrada | ✅ |
| Input/Output validados | ✅ |
| Grounding aplicado quando necessário | ✅ |
| Human-in-the-Loop para ações críticas | ✅ |
| Auditoria configurada | ✅ |
| Observabilidade configurada | ✅ |
| Proteção contra Prompt Injection | ✅ |
| Tratamento de erro definido | ✅ |
| Evaluation Pipeline executado | ✅ |
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
├── 02-Entities.md
├── 04-RLS.md
└── 07-Audit.md
```

Em caso de conflito relacionado a segurança ou autorização, os requisitos mais restritivos deverão prevalecer.

---

# Considerações Finais

O MedFlow AI Assistant constitui a camada conversacional e operacional que conecta os usuários às capacidades inteligentes da plataforma.

Sua arquitetura foi projetada para permitir uma experiência contextual e poderosa sem conceder autonomia irrestrita ao modelo de Inteligência Artificial.

Identidade, autorização, isolamento Multi-Tenant, Tool Isolation, Grounding, Human-in-the-Loop, auditoria e observabilidade são requisitos fundamentais e não opcionais.

O AI Assistant poderá evoluir significativamente ao longo da vida do MedFlow, incorporando novos Agents, Skills, Models, Tools e modalidades de interação. Essa evolução deverá preservar os princípios estabelecidos neste documento.

A inteligência pode evoluir.

Os limites arquiteturais de segurança permanecem.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação da especificação oficial do MedFlow AI Assistant | Equipe MedFlow |