# Monitoramento e Observabilidade

| Campo | Valor |
|-------|--------|
| Documento | Monitoring |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Deployment |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

Este documento define a arquitetura oficial de **Monitoring, Observability, Alerting e Operational Telemetry** do MedFlow.

Monitoramento não deverá ser tratado apenas como um conjunto de gráficos utilizados quando algo apresenta problema.

No MedFlow, Observability representa a capacidade de compreender o estado interno da plataforma através dos sinais produzidos durante sua execução.

A infraestrutura deverá permitir responder:

```text
Is MedFlow available?

Is MedFlow healthy?

Are users experiencing errors?

Which service is failing?

When did the problem start?

Which deployment introduced it?

Which tenants are affected?

Is patient data affected?

Is the database healthy?

Are background jobs processing?

Are external providers responding?

Is AI operating normally?

Are security boundaries behaving correctly?

What changed before the incident?

Can the system recover automatically?
```

O princípio fundamental será:

```text
If a critical system can fail,
we must be able to detect it.

If we can detect it,
we must be able to understand it.

If we understand it,
we must know how to respond.
```

---

# Objetivos

A estratégia de Monitoring deverá:

- Detectar indisponibilidade.
- Detectar degradação.
- Identificar regressões.
- Medir Performance.
- Medir Reliability.
- Detectar falhas de Database.
- Detectar falhas de Queue.
- Detectar falhas de Workers.
- Detectar problemas de integrações externas.
- Monitorar AI.
- Monitorar infraestrutura.
- Correlacionar eventos entre serviços.
- Apoiar Incident Response.
- Apoiar Capacity Planning.
- Apoiar Security Monitoring.
- Apoiar Cost Monitoring.
- Permitir análise histórica.
- Reduzir Mean Time to Detection.
- Reduzir Mean Time to Recovery.
- Fornecer evidências para decisões arquiteturais.

---

# Monitoring vs Observability

Os conceitos são relacionados, mas não idênticos.

## Monitoring

Responde principalmente:

```text
Is something wrong?
```

Exemplo:

```text
API Error Rate > Threshold
```

---

## Observability

Ajuda a responder:

```text
Why is it wrong?
```

Exemplo:

```text
API Error Rate increased

↓

Only appointment endpoints affected

↓

Requests waiting for Database

↓

Database connection pool exhausted

↓

Started after deployment X
```

---

# Observability Pillars

A arquitetura deverá considerar os principais sinais:

```text
Logs

Metrics

Traces

Events
```

Complementados por:

```text
Health Checks

Synthetic Monitoring

Audit Events

Deployment Metadata
```

---

# Observability Architecture

Arquitetura conceitual:

```text
Web ──────────────┐
                  │
Mobile ───────────┤
                  │
API ──────────────┤
                  │
Workers ──────────┤
                  ├──► Telemetry Platform
AI Services ──────┤
                  │
Database ─────────┤
                  │
Infrastructure ───┤
                  │
External Checks ──┘
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
           Logs        Metrics     Traces
             │           │           │
             └───────────┼───────────┘
                         ▼
                     Dashboards
                         │
                         ▼
                       Alerts
                         │
                         ▼
                 Incident Response
```

---

# Telemetry Principles

Telemetry deverá ser:

- Estruturada.
- Consistente.
- Pesquisável.
- Correlacionável.
- Segura.
- Proporcional ao risco.
- Econômica.
- Útil operacionalmente.

---

# Telemetry Is Production Data

Logs, Metrics e Traces poderão conter informações sensíveis.

Portanto:

```text
Telemetry

≠

Public Debug Information
```

Observability Infrastructure deverá ser tratada como infraestrutura sensível.

---

# Structured Logging

Production deverá preferir Structured Logs.

Exemplo:

```json
{
  "timestamp": "2026-07-25T18:00:00Z",
  "level": "info",
  "service": "api",
  "environment": "production",
  "version": "2.4.1",
  "request_id": "req_123",
  "message": "request completed"
}
```

---

# Log Levels

Níveis recomendados:

```text
TRACE

DEBUG

INFO

WARN

ERROR

FATAL
```

Nem toda aplicação precisará utilizar todos os níveis.

---

# TRACE

Destinado a diagnóstico extremamente detalhado.

Deverá normalmente permanecer desabilitado em Production.

---

# DEBUG

Informação de desenvolvimento e diagnóstico.

Production não deverá registrar DEBUG indiscriminadamente.

---

# INFO

Representa eventos operacionais normais relevantes.

Exemplos:

```text
Application started

Worker started

Job completed

Deployment version loaded
```

---

# WARN

Representa condição anormal que ainda não impede operação.

Exemplo:

```text
External provider retry

Slow query threshold exceeded

Queue delay increasing
```

---

# ERROR

Representa operação que falhou.

Exemplo:

```text
Database query failed

Payment provider unavailable

Background job failed
```

---

# FATAL

Representa falha que impede o serviço de continuar operando corretamente.

---

# Log Message Design

Logs deverão explicar eventos.

Preferir:

```text
"appointment creation failed"
```

com contexto estruturado.

Evitar:

```text
"error"
```

sem informação suficiente.

---

# Log Context

Logs poderão incluir:

```text
service

environment

version

git_sha

request_id

trace_id

operation

tenant_id

user_id

resource_type

duration_ms

status_code
```

Somente campos permitidos pela política de privacidade deverão ser registrados.

---

# Sensitive Logging

Logs não deverão registrar indiscriminadamente:

- Passwords.
- Access Tokens.
- Refresh Tokens.
- API Keys.
- Authorization Headers.
- Private Keys.
- Database Credentials.
- Full Patient Records.
- Medical Notes.
- Prescriptions completas.
- Sensitive Attachments.
- Raw AI Prompts contendo PHI sem necessidade.
- Raw AI Responses contendo dados clínicos sem necessidade.

---

# Sensitive Field Redaction

Campos sensíveis deverão ser removidos ou mascarados antes da persistência.

Exemplo:

```text
Authorization:

Bearer [REDACTED]
```

---

# Logging by Default

A aplicação deverá preferir:

```text
Minimal Necessary Context
```

em vez de:

```text
Log Entire Object
```

---

# Patient Data

Dados clínicos não deverão ser utilizados como contexto operacional comum.

Para diagnóstico, preferir identificadores técnicos.

Exemplo:

```text
patient_id

record_id
```

em vez do conteúdo do prontuário.

---

# Identifiers

Mesmo identificadores poderão possuir sensibilidade.

A política de acesso aos Logs deverá considerar isso.

---

# Request Logging

Requests poderão registrar:

```text
method

route pattern

status

duration

request_id
```

Evitar registrar Query Strings ou Bodies completos indiscriminadamente.

---

# Route Pattern

Preferir:

```text
/patients/:id
```

em vez de:

```text
/patients/8fa8...
```

quando o identificador não for necessário no Log.

---

# Response Logging

Response Body completo não deverá ser registrado por padrão.

---

# Error Logging

Errors deverão registrar informação suficiente para diagnóstico.

Exemplo:

```text
error_type

error_code

stack_trace

service

operation

request_id

trace_id
```

Stack Trace deverá permanecer em ambiente controlado.

---

# Stack Traces

Stack Traces são úteis para engenharia, mas podem revelar detalhes internos.

Não deverão ser retornados diretamente ao Client em Production.

---

# Error IDs

Erros apresentados ao usuário poderão possuir identificador.

Exemplo:

```text
Something went wrong.

Reference:
ERR-7A21F
```

Esse identificador poderá correlacionar a experiência do usuário com Telemetry interna.

---

# Correlation ID

Toda requisição relevante deverá possuir identificador de correlação.

```text
Client

↓

Request ID

↓

API

↓

Service

↓

Worker

↓

External Provider
```

---

# Request ID

Cada request deverá possuir identificador único.

Se o Client fornecer um identificador confiável conforme política definida, ele poderá ser propagado ou um novo poderá ser gerado.

---

# Trace ID

Em Distributed Tracing:

```text
Trace ID

↓

Multiple Spans
```

representará uma operação distribuída.

---

# Correlation Propagation

Contexto deverá ser propagado entre:

```text
API

↓

Queue

↓

Worker
```

quando possível.

---

# Metrics

Metrics representam valores agregáveis ao longo do tempo.

Exemplos:

```text
Requests per Second

Error Rate

Latency

CPU Usage

Memory Usage

Queue Depth
```

---

# Metric Types

Tipos comuns:

```text
Counter

Gauge

Histogram

Summary
```

A implementação concreta dependerá da plataforma utilizada.

---

# Golden Signals

Serviços deverão monitorar principalmente:

```text
Latency

Traffic

Errors

Saturation
```

---

# Latency

Medir tempo necessário para concluir operações.

Não utilizar apenas média.

---

# Percentiles

Preferir percentis como:

```text
p50

p95

p99
```

---

# Why Percentiles Matter

Uma média aceitável pode esconder usuários com experiência ruim.

Exemplo:

```text
Average = 200ms

p99 = 8s
```

A média isolada não representa a cauda de latência.

---

# Traffic

Monitorar volume.

Exemplos:

```text
HTTP Requests

Jobs

WebSocket Connections

AI Requests

Database Queries
```

---

# Errors

Monitorar:

```text
5xx

Unhandled Exceptions

Failed Jobs

Provider Failures

Database Errors
```

---

# Saturation

Monitorar recursos próximos do limite.

Exemplos:

```text
CPU

Memory

Database Connections

Storage

Queue Capacity

Worker Capacity
```

---

# RED Method

Para Request-based Services:

```text
Rate

Errors

Duration
```

---

# USE Method

Para infraestrutura:

```text
Utilization

Saturation

Errors
```

---

# Application Metrics

Backend deverá considerar métricas como:

```text
http_requests_total

http_request_duration

http_errors_total

active_requests

authentication_failures

rate_limit_rejections
```

Nomes concretos dependerão da stack.

---

# Business Metrics

Algumas métricas de negócio poderão ajudar a identificar problemas.

Exemplos:

```text
appointments_created

appointments_failed

documents_generated

notifications_sent
```

Essas métricas não deverão substituir Analytics de produto.

---

# Sensitive Business Metrics

Metrics não deverão utilizar Labels com alta cardinalidade ou informações clínicas sensíveis.

---

# Cardinality

Evitar Labels como:

```text
patient_id

request_id

email

full_url
```

em Metrics.

Alta cardinalidade pode tornar sistemas de métricas caros e instáveis.

---

# Tenant Metrics

`tenant_id` como Label deverá ser utilizado com cautela.

Com milhares de Tenants, cardinalidade poderá crescer significativamente.

---

# Database Monitoring

Database deverá possuir observabilidade específica.

Monitorar:

```text
CPU

Memory

Storage

Connections

Connection Pool

Query Latency

Slow Queries

Locks

Deadlocks

Replication

Backup Status
```

---

# Database Connections

Alertar antes da exaustão.

```text
Current Connections

↓

Connection Limit
```

---

# Slow Queries

Queries lentas deverão ser identificáveis.

Entretanto, parâmetros contendo dados sensíveis não deverão ser expostos indevidamente.

---

# Query Fingerprinting

Preferir agrupamento por formato da Query.

Exemplo:

```text
SELECT ... WHERE id = ?
```

em vez de registrar todos os valores.

---

# Database Locks

Locks prolongados podem causar degradação sistêmica.

---

# Deadlocks

Deadlocks deverão ser monitorados.

---

# Database Storage

Storage deverá possuir alertas progressivos.

Exemplo conceitual:

```text
70% → Observe

80% → Warning

90% → Critical
```

Thresholds reais deverão considerar crescimento e tempo necessário para resposta.

---

# Backup Monitoring

Não basta configurar Backup.

Monitorar:

```text
Last Successful Backup

Backup Failure

Backup Duration

Retention

Restore Verification
```

---

# PITR Monitoring

Quando Point-in-Time Recovery estiver habilitado, sua saúde deverá ser verificada.

---

# Replication Monitoring

Quando Replicas existirem:

```text
Replication Lag

Replica Health
```

deverão ser monitorados.

---

# Cache Monitoring

Cache deverá observar:

```text
Hit Rate

Miss Rate

Memory

Evictions

Connections

Latency

Errors
```

---

# Cache Hit Rate

Queda repentina poderá indicar:

- Deployment Regression.
- Key Change.
- Expiration Issue.
- Cache Flush.

---

# Queue Monitoring

Queues deverão observar:

```text
Queue Depth

Oldest Message Age

Processing Rate

Failure Rate

Retry Rate

Dead Letter Count
```

---

# Queue Depth

Crescimento contínuo poderá indicar:

```text
Incoming Work

>

Processing Capacity
```

---

# Oldest Message Age

Pode ser sinal mais importante que Queue Depth.

Uma fila pequena contendo Job parado há horas ainda representa problema.

---

# Worker Monitoring

Workers deverão observar:

```text
Active Workers

Jobs Started

Jobs Completed

Jobs Failed

Job Duration

Retries

Worker Restarts
```

---

# Dead Letter Queue

Novas mensagens na DLQ deverão gerar sinal operacional quando representarem processamento crítico.

---

# Scheduler Monitoring

Scheduled Jobs críticos deverão registrar:

```text
Expected Execution

Actual Start

Completion

Duration

Result
```

---

# Missing Job Detection

O sistema deverá conseguir detectar:

```text
Job was expected

but

Job never ran
```

---

# External Provider Monitoring

Dependências externas deverão possuir métricas separadas.

Exemplos:

```text
AI Provider

Email Provider

SMS Provider

Payment Provider

Authentication Provider

Storage Provider
```

---

# Provider Metrics

Monitorar:

```text
Request Count

Latency

Timeouts

Errors

Rate Limits

Retries
```

---

# Provider Attribution

Falha externa deverá ser distinguível de falha interna.

Exemplo:

```text
MedFlow API Healthy

↓

Email Provider Down
```

não deverá aparecer simplesmente como:

```text
MedFlow Down
```

---

# Dependency Health

Dashboards deverão permitir visualizar dependências relevantes.

---

# AI Monitoring

AI deverá possuir observabilidade específica.

Monitorar:

```text
AI Requests

Model

Latency

Failures

Timeouts

Token Usage

Estimated Cost

Tool Calls

Structured Output Failures

Safety Events

Evaluation Signals
```

---

# AI Model Identification

Telemetry deverá permitir identificar qual Model processou uma operação.

Exemplo:

```text
provider

model

model_version when available

prompt_version
```

---

# AI Prompt Version

Mudanças de Prompt deverão ser rastreáveis.

```text
AI Result

↓

Prompt Version

↓

Deployment / Configuration
```

---

# AI Latency

Separar quando possível:

```text
Queue Time

Provider Time

Tool Time

Total AI Operation Time
```

---

# AI Failure Categories

Exemplos:

```text
Provider Timeout

Rate Limit

Invalid Structured Output

Tool Failure

Safety Rejection

Context Limit

Internal Validation Failure
```

---

# AI Cost Monitoring

Uso de AI deverá possuir monitoramento de custo.

Observar:

```text
Input Tokens

Output Tokens

Requests

Model Distribution

Cost per Operation
```

---

# AI Cost Anomaly

Aumento inesperado poderá indicar:

- Prompt Loop.
- Agent Loop.
- Excessive Context.
- Abuse.
- Retry Storm.
- Model Configuration Error.

---

# AI Quality Monitoring

Nem toda regressão de AI gera Exception.

Um Model pode continuar respondendo tecnicamente, mas com pior qualidade.

Por isso, AI deverá combinar:

```text
Operational Monitoring

+

Evaluation
```

---

# AI Hallucination Monitoring

Hallucination não pode ser detectada perfeitamente apenas através de Metrics.

Deverão existir:

- Evaluation Suites.
- User Feedback.
- Structured Validation.
- Clinical Review quando aplicável.

---

# Tool Call Monitoring

Agents que utilizem Tools deverão registrar:

```text
Tool Name

Success / Failure

Duration

Retry

Trace Context
```

sem registrar parâmetros sensíveis desnecessários.

---

# Agent Loop Detection

Agents deverão possuir limites e sinais para detectar loops.

Exemplo:

```text
Tool Calls > Expected Maximum

↓

Stop / Alert
```

---

# Mobile Monitoring

Mobile deverá possuir observabilidade específica.

Monitorar:

```text
App Crashes

Unhandled Errors

API Failures

Startup Time

Screen Performance

Version Adoption
```

---

# Mobile Version

Todo evento relevante deverá permitir identificar:

```text
App Version

Build Number

Platform

OS Version
```

quando apropriado.

---

# Mobile Release Adoption

Como usuários podem permanecer em versões antigas:

```text
Version Distribution
```

deverá ser observável.

---

# Mobile Crash-Free Rate

Métrica útil:

```text
Crash-Free Sessions

or

Crash-Free Users
```

---

# Mobile Offline Errors

Falhas causadas por ausência de conexão deverão ser distinguidas de falhas do Backend.

---

# Web Monitoring

Web deverá observar:

```text
JavaScript Errors

Unhandled Promise Rejections

Page Load

Core User Flows

API Errors

Version
```

---

# Frontend Error Reporting

Erros Client-side deverão ser enviados para plataforma apropriada quando permitido.

---

# Source Maps

Source Maps poderão melhorar diagnóstico.

Production Source Maps deverão possuir política de exposição segura.

Preferir upload privado para ferramenta de Error Tracking quando suportado.

---

# Web Performance

Poderão ser observados indicadores como:

```text
LCP

INP

CLS
```

quando relevantes à experiência.

---

# Real User Monitoring

RUM poderá medir experiência real dos usuários.

Dados coletados deverão respeitar Privacy Requirements.

---

# Synthetic Monitoring

Synthetic Monitoring executa verificações artificiais.

Exemplo:

```text
External Monitor

↓

GET /health

↓

Expected 200
```

---

# Synthetic User Journey

Fluxos mais avançados poderão verificar:

```text
Open Login

↓

Authenticate Synthetic Account

↓

Load Safe Screen

↓

Verify Expected Result
```

---

# Synthetic Data

Contas e dados sintéticos deverão ser claramente separados de dados reais.

---

# Uptime Monitoring

Production deverá possuir monitoramento externo de disponibilidade para endpoints críticos.

---

# Internal vs External Monitoring

Internal Health:

```text
Service believes it is healthy.
```

External Health:

```text
User can actually reach it.
```

Ambos são importantes.

---

# Health Checks

Health Checks deverão seguir definições de:

```text
03-Docker.md

04-Hosting.md
```

---

# Health Check Types

```text
Liveness

Readiness

Startup
```

quando suportados.

---

# Health Check Simplicity

Health Endpoints deverão ser rápidos.

Não executar operações pesadas a cada Probe.

---

# Dashboards

Dashboards deverão responder perguntas operacionais.

Não deverão existir apenas para exibir grande quantidade de gráficos.

---

# Executive Dashboard

Poderá apresentar:

```text
Availability

Active Incidents

Error Rate

Latency

Critical Dependencies
```

---

# Backend Dashboard

Poderá apresentar:

```text
Request Rate

p50 / p95 / p99

Error Rate

Active Instances

CPU

Memory

Database Connections
```

---

# Database Dashboard

Poderá apresentar:

```text
Connections

Query Latency

Slow Queries

Storage

Locks

Backup Status
```

---

# Worker Dashboard

Poderá apresentar:

```text
Queue Depth

Oldest Message

Processing Rate

Failures

Retries

DLQ
```

---

# AI Dashboard

Poderá apresentar:

```text
Requests

Models

Latency

Errors

Tokens

Cost

Tool Failures

Evaluation Signals
```

---

# Release Dashboard

Poderá correlacionar:

```text
Deployments

Error Rate

Latency

Version
```

---

# Deployment Markers

Dashboards deverão marcar Deployments.

Exemplo:

```text
14:00

Deployment v2.4.1

↓

14:05

Error Rate increases
```

Isso reduz tempo de diagnóstico.

---

# Alerting

Alertas deverão indicar condições que exigem atenção.

Não criar alerta para toda métrica.

---

# Alert Principle

Pergunta:

> Se esse alerta disparar às 03:00, alguém precisa agir agora?

Se a resposta for não, provavelmente não deverá ser Paging Alert.

---

# Alert Severity

Classificação recomendada:

```text
SEV-1

Critical
```

```text
SEV-2

High
```

```text
SEV-3

Medium
```

```text
SEV-4

Low / Informational
```

---

# SEV-1

Exemplos:

- Production indisponível.
- Patient Data inaccessible em larga escala.
- Confirmed Security Incident.
- Critical Data Integrity Risk.
- Database unavailable.
- Major authentication outage.

---

# SEV-2

Exemplos:

- Significant degradation.
- Important workflow unavailable.
- Queue severely delayed.
- External dependency impacting major functionality.

---

# SEV-3

Exemplos:

- Partial degradation.
- Non-critical integration unavailable.
- Capacity warning requiring action durante horário operacional.

---

# SEV-4

Exemplos:

- Informational events.
- Non-urgent maintenance.
- Early capacity signal.

---

# Alert Routing

Alertas deverão ser encaminhados para responsáveis apropriados.

Exemplo:

```text
Database Alert

↓

Backend / Platform
```

```text
AI Quality Alert

↓

AI Team
```

---

# Alert Deduplication

Um único incidente não deverá gerar centenas de notificações idênticas.

---

# Alert Grouping

Alertas relacionados deverão ser agrupados quando possível.

---

# Alert Suppression

Durante Maintenance ou incidente conhecido, alertas derivados poderão ser suprimidos de forma controlada.

---

# Alert Fatigue

Excesso de alertas reduz confiança.

Regra:

```text
Every Alert

must have

Meaning + Owner + Expected Action
```

---

# Alert Runbook

Alertas críticos deverão apontar para Runbook quando maturidade permitir.

Exemplo:

```text
Database Connections > 90%

↓

Runbook:
database-connection-exhaustion
```

---

# Runbooks

Runbooks deverão explicar:

```text
What does this alert mean?

How do I confirm it?

What are common causes?

What can I safely do?

When should I escalate?

How do I verify recovery?
```

---

# Incident Response

Monitoring deverá alimentar Incident Response.

Fluxo:

```text
Signal

↓

Alert

↓

Triage

↓

Incident Declared

↓

Mitigation

↓

Recovery

↓

Verification

↓

Post-Incident Review
```

---

# Incident Commander

Incidentes maiores poderão possuir papel de:

```text
Incident Commander
```

responsável por coordenar resposta.

---

# Incident Timeline

Eventos importantes deverão ser registrados.

Exemplo:

```text
18:02 Alert fired

18:05 Incident declared

18:09 Deployment identified

18:12 Rollback started

18:16 Service recovered
```

---

# Incident Communication

Durante incidentes, comunicação deverá ser clara.

Separar:

```text
Technical Investigation

Operational Coordination

Stakeholder Communication
```

quando a escala justificar.

---

# Incident Evidence

Preservar:

- Relevant Logs.
- Metrics.
- Traces.
- Deployment IDs.
- Audit Events.
- Timeline.

---

# Post-Incident Review

Incidentes relevantes deverão gerar análise posterior.

Objetivo:

```text
Learn

not

Blame
```

---

# Post-Incident Questions

Responder:

```text
What happened?

What was the impact?

How was it detected?

Why did it happen?

Why was it not prevented?

Why was it not detected earlier?

How was it mitigated?

What prevents recurrence?
```

---

# Corrective Actions

Ações deverão possuir:

```text
Owner

Priority

Due Date

Status
```

quando processo formal existir.

---

# Monitoring the Monitor

A infraestrutura de Monitoring também pode falhar.

Deverão existir mecanismos para detectar:

```text
No Telemetry Received

Alert Pipeline Failure

Collector Failure
```

---

# Telemetry Gaps

Ausência inesperada de Metrics poderá ser problema.

```text
No Errors

≠

Healthy
```

se nenhuma Telemetry estiver chegando.

---

# Security Monitoring

Observability deverá apoiar Security.

Possíveis sinais:

```text
Authentication Failures

Authorization Denials

Rate Limit Events

Suspicious Access Patterns

Privilege Changes

Secret Access

Administrative Actions
```

---

# Authentication Monitoring

Monitorar aumento anormal de:

```text
Failed Logins

Invalid Tokens

Password Reset Requests
```

sem registrar credenciais.

---

# Authorization Monitoring

Negativas de autorização poderão fornecer sinais importantes.

Entretanto, volume normal deverá ser compreendido para evitar ruído.

---

# Cross-Tenant Attempts

Tentativas inesperadas de acesso Cross-Tenant deverão possuir Telemetry adequada.

---

# Rate Limiting

Rate Limit Events deverão ser observáveis.

Aumento poderá indicar:

- Bug.
- Abuse.
- Attack.
- Misconfigured Client.

---

# Audit vs Application Logs

Audit Logs e Application Logs possuem propósitos diferentes.

```text
Application Log

=

What happened operationally?
```

```text
Audit Log

=

Who performed which sensitive action?
```

Audit não deverá depender exclusivamente de Application Logs.

---

# Audit Integrity

Políticas específicas de Audit deverão ser definidas na documentação de Security/Audit.

---

# Privacy

Observability deverá seguir:

```text
Data Minimization
```

Coletar somente o necessário.

---

# Telemetry Retention

Retention deverá variar por tipo.

Exemplo conceitual:

```text
High-volume Debug Logs

↓

Short Retention
```

```text
Critical Security / Audit Records

↓

Longer Controlled Retention
```

Períodos oficiais deverão seguir políticas legais e operacionais.

---

# Log Retention

Não manter todos os Logs indefinidamente.

---

# Metrics Retention

Metrics agregadas poderão possuir retenção maior que Logs de alta granularidade.

---

# Trace Sampling

Distributed Tracing pode gerar grande volume.

Sampling poderá ser utilizado.

---

# Head Sampling

Decisão ocorre no início do Trace.

---

# Tail Sampling

Decisão ocorre após observar resultado do Trace.

Pode permitir preservar:

```text
Errors

Slow Requests

Interesting Events
```

com maior prioridade.

---

# Error Trace Retention

Traces de erro poderão possuir sampling maior que requests normais.

---

# Cost Management

Observability possui custo.

Principais fontes:

```text
Log Volume

Metric Cardinality

Trace Volume

Retention

Data Transfer
```

---

# Logging Cost Explosion

Um Loop poderá gerar milhões de Logs.

Deverão existir limites e alertas quando possível.

---

# Sampling

Eventos extremamente frequentes poderão utilizar Sampling quando não forem críticos individualmente.

---

# Never Sample Critical Audit

Audit Events críticos não deverão ser descartados por sampling genérico de observabilidade.

---

# PII Redaction Testing

Redaction deverá possuir testes automatizados quando possível.

---

# Monitoring Environments

Cada Environment deverá possuir identificação clara.

```text
environment=development

environment=staging

environment=production
```

---

# Production Separation

Production Telemetry deverá ser facilmente separável de Non-Production.

---

# Staging Monitoring

Staging também deverá possuir Monitoring suficiente para detectar regressões antes de Production.

---

# Preview Monitoring

Preview poderá utilizar observabilidade reduzida.

---

# Service Naming

Services deverão possuir nomes consistentes.

Exemplo:

```text
medflow-api

medflow-worker

medflow-web

medflow-ai
```

---

# Version Metadata

Toda Telemetry relevante deverá permitir identificar versão quando possível.

```text
service.version

git_sha

build_id
```

---

# Deployment Correlation

Fluxo:

```text
Error

↓

Trace

↓

Service Version

↓

Git SHA

↓

Deployment

↓

Pull Request
```

---

# OpenTelemetry

A arquitetura deverá preferir padrões abertos de instrumentação quando adequados.

```text
OpenTelemetry
```

poderá ser utilizado para reduzir acoplamento a um único Observability Vendor.

---

# Vendor Independence

A aplicação deverá evitar dependência excessiva de APIs proprietárias quando padrões abertos forem suficientes.

---

# Telemetry Collector

Uma arquitetura futura poderá utilizar:

```text
Applications

↓

OpenTelemetry Collector

↓

Observability Backend
```

---

# Instrumentation

Instrumentation poderá ser:

```text
Automatic

+

Manual
```

---

# Automatic Instrumentation

Útil para:

- HTTP.
- Database.
- Common Frameworks.

---

# Manual Instrumentation

Necessária para operações de negócio relevantes.

Exemplo:

```text
create_appointment

generate_clinical_summary

process_document
```

---

# Span Naming

Spans deverão utilizar nomes estáveis.

Evitar identificadores dinâmicos no nome.

Preferir:

```text
appointment.create
```

Não:

```text
appointment.create.patient.12345
```

---

# Trace Context Across Queue

Quando possível:

```text
HTTP Request

↓

Queue Message

↓

Worker

↓

External Provider
```

deverá preservar relação de Trace.

---

# SLO

O MedFlow deverá evoluir para Service Level Objectives.

Exemplo:

```text
99.9% successful requests
over a defined period
```

O valor oficial dependerá da criticidade.

---

# Availability SLI

Exemplo:

```text
Successful Requests

÷

Valid Requests
```

---

# Latency SLI

Exemplo:

```text
Percentage of requests
completed below threshold
```

---

# Error Budget

Se SLO for:

```text
99.9%
```

o restante representa Error Budget dentro da janela definida.

---

# Error Budget Usage

Burn Rate poderá indicar consumo acelerado do Error Budget.

---

# Burn Rate Alerts

Alertas baseados em Burn Rate poderão ser superiores a Thresholds instantâneos para SLOs maduros.

---

# Monitoring and CI/CD

Conforme `02-CI-CD.md`:

```text
Deployment

↓

Deployment Marker

↓

Production Verification

↓

Monitoring
```

---

# Automated Deployment Verification

Pipeline poderá verificar automaticamente:

```text
Health

Error Rate

Critical Endpoint

```

antes de considerar Release saudável.

---

# Rollback Signals

Sinais confiáveis poderão futuramente iniciar Automatic Rollback.

Exemplo:

```text
New Deployment

↓

5xx Rate increases dramatically

↓

Health fails

↓

Rollback
```

Automação deverá evitar False Positives.

---

# Monitoring and Hosting

Conforme `04-Hosting.md`, infraestrutura deverá fornecer Telemetry de:

```text
Compute

Database

Storage

Network

Queue

Cache
```

---

# Monitoring and Docker

Conforme `03-Docker.md`:

```text
Container CPU

Container Memory

Restarts

OOM

Health
```

deverão ser observáveis.

---

# Monitoring and Mobile Releases

Mobile deverá permitir comparar regressões entre versões.

Exemplo:

```text
Version 2.4.0

Crash-Free = baseline
```

```text
Version 2.5.0

Crash-Free decreases
```

---

# Monitoring and Feature Flags

Telemetry deverá permitir avaliar Rollouts.

```text
Feature Flag

↓

Enabled Cohort

↓

Metrics

↓

Compare
```

---

# Feature Flag Kill Switch

Quando uma Feature causar degradação:

```text
Disable Flag

↓

Verify Recovery
```

poderá ser mais rápido que Deployment Rollback.

---

# Monitoring and Multi-Tenancy

Problemas deverão poder ser classificados como:

```text
Global

Regional

Service-specific

Tenant-specific
```

sem expor dados entre Tenants.

---

# Noisy Neighbor

Monitoring deverá ajudar a detectar:

```text
Tenant A

↓

Excessive Resource Consumption

↓

Tenant B affected
```

---

# Tenant Rate Monitoring

Quando necessário, limites por Tenant poderão gerar Metrics agregadas.

---

# Capacity Planning

Dados históricos deverão apoiar decisões.

Exemplo:

```text
Database Storage Growth

↓

Projected Capacity Date
```

---

# Growth Forecasting

Observar tendências:

```text
Users

Tenants

Requests

Database Size

Storage

AI Usage

Queue Volume
```

---

# Capacity Alerts

Alertas deverão ocorrer antes de esgotamento.

---

# Monitoring Ownership

Cada serviço deverá possuir Owner quando a equipe crescer.

```text
Service

↓

Owner

↓

Dashboard

↓

Alerts

↓

Runbook
```

---

# Unknown Ownership

Alertas sem responsável tendem a ser ignorados.

---

# On-Call

Quando escala e criticidade justificarem, MedFlow poderá possuir On-Call Rotation.

---

# On-Call Scope

On-Call deverá receber somente eventos que exigem ação urgente.

---

# Escalation Policy

Incidentes não reconhecidos deverão possuir caminho de escalonamento.

---

# Status Page

Conforme o MedFlow ganhar usuários externos, poderá existir Status Page.

Ela poderá informar:

```text
Operational

Degraded Performance

Partial Outage

Major Outage

Maintenance
```

---

# Status Page Privacy

Status Page não deverá revelar detalhes internos sensíveis.

---

# Maintenance Communication

Manutenções planejadas que afetem usuários deverão possuir comunicação apropriada.

---

# Production Monitoring Checklist

| Item | Obrigatório |
|------|-------------|
| External Uptime Monitoring | ✅ |
| Structured Logging | ✅ |
| Error Tracking | ✅ |
| API Metrics | ✅ |
| Latency Percentiles | ✅ |
| Database Monitoring | ✅ |
| Storage Monitoring | ✅ |
| Queue Monitoring quando aplicável | ✅ |
| Worker Monitoring quando aplicável | ✅ |
| Deployment Markers | ✅ |
| Version Metadata | ✅ |
| Critical Alerts | ✅ |
| Sensitive Data Redaction | ✅ |
| Telemetry Access Control | ✅ |
| Backup Monitoring | ✅ |
| Cost Monitoring | ✅ |
| Health Checks | ✅ |

---

# Logging Checklist

| Item | Obrigatório |
|------|-------------|
| Structured Format | ✅ |
| Timestamp | ✅ |
| Service | ✅ |
| Environment | ✅ |
| Level | ✅ |
| Request/Trace Correlation | Quando aplicável |
| No Passwords | ✅ |
| No Tokens | ✅ |
| No Secrets | ✅ |
| No indiscriminate PHI | ✅ |
| Error Context | ✅ |
| Retention Defined | ✅ |

---

# Alert Checklist

Antes de criar Alert:

| Pergunta | Esperado |
|----------|----------|
| Representa problema real? | Sim |
| Exige ação? | Sim |
| Possui Owner? | Sim |
| Possui Severity? | Sim |
| Possui contexto? | Sim |
| Evita duplicação? | Sim |
| Possui Runbook quando crítico? | Preferencial |
| Threshold é baseado em comportamento real? | Sim |

---

# AI Monitoring Checklist

| Item | Obrigatório |
|------|-------------|
| Provider identificado | ✅ |
| Model identificado | ✅ |
| Prompt Version | Quando aplicável |
| Latency | ✅ |
| Failure Rate | ✅ |
| Token Usage | ✅ |
| Cost | ✅ |
| Structured Output Failures | Quando aplicável |
| Tool Failures | Quando aplicável |
| Safety Signals | Quando aplicável |
| Evaluation Integration | ✅ |

---

# Incident Checklist

Durante incidente:

| Item | Obrigatório |
|------|-------------|
| Impact identificado | ✅ |
| Severity definida | ✅ |
| Owner definido | ✅ |
| Timeline iniciada | ✅ |
| Recent Deployments verificados | ✅ |
| Metrics analisadas | ✅ |
| Logs analisados | ✅ |
| Mitigation definida | ✅ |
| Recovery verificada | ✅ |
| Communication realizada quando necessária | ✅ |
| Post-Incident Review avaliado | ✅ |

---

# Anti-Padrões

São considerados Anti-Padrões:

- Não possuir Monitoring em Production.
- Depender de usuário reclamar para descobrir outage.
- Registrar Passwords.
- Registrar Tokens.
- Registrar Authorization Headers.
- Registrar prontuários completos indiscriminadamente.
- Registrar Request Bodies completos por padrão.
- Expor Stack Trace ao usuário.
- Logs sem Timestamp.
- Logs sem Environment.
- Logs sem Service.
- Logs sem Correlation.
- Utilizar apenas médias para Latency.
- Ignorar p95 e p99.
- Metrics com `patient_id`.
- Metrics com `request_id`.
- Metrics com Labels de cardinalidade ilimitada.
- Criar alerta para toda métrica.
- Paging para eventos não urgentes.
- Alertas sem Owner.
- Alertas sem ação esperada.
- Ignorar Alert Fatigue.
- Considerar ausência de erros como prova de saúde.
- Não monitorar o próprio pipeline de Telemetry.
- Não monitorar Backup.
- Não monitorar Queue Age.
- Monitorar apenas Queue Depth.
- Não distinguir Provider Failure de Internal Failure.
- Não identificar versão em Errors.
- Não correlacionar Deployments com regressões.
- Não monitorar AI Cost.
- Não monitorar AI Failures.
- Tratar AI Operational Health como prova de qualidade.
- Não monitorar Mobile Crashes.
- Expor Source Maps publicamente sem avaliação.
- Manter Logs indefinidamente.
- Nunca revisar Retention.
- Ignorar Observability Cost.
- Utilizar Application Logs como único Audit Trail.
- Não possuir External Uptime Monitoring.
- Não testar Alertas.
- Criar Dashboard que ninguém utiliza.
- Não possuir Runbooks para falhas críticas.
- Não realizar Post-Incident Review de incidentes relevantes.

---

# Decisões Arquiteturais

## ADR-267

Observability será requisito obrigatório de Production e fará parte da arquitetura operacional do MedFlow.

---

## ADR-268

A estratégia de Observability deverá combinar Logs, Metrics, Traces, Events e Health Signals conforme a necessidade de cada componente.

---

## ADR-269

Production Logs deverão preferir formato estruturado e pesquisável.

---

## ADR-270

Passwords, Tokens, Secrets e credenciais não poderão ser registrados em Telemetry.

---

## ADR-271

Dados clínicos completos não deverão ser registrados indiscriminadamente em Logs, Traces ou Error Reports.

---

## ADR-272

Sensitive Data Redaction deverá ocorrer antes da persistência de Telemetry sempre que possível.

---

## ADR-273

Requests relevantes deverão possuir Correlation Identifier para permitir rastreamento entre componentes.

---

## ADR-274

Distributed Tracing deverá preservar Trace Context entre serviços e processamento assíncrono quando tecnicamente viável.

---

## ADR-275

Latency deverá utilizar Percentiles e não depender exclusivamente de médias.

---

## ADR-276

Metrics deverão evitar Labels de alta cardinalidade como Request IDs, Patient IDs e valores arbitrários.

---

## ADR-277

Production Database deverá possuir Monitoring específico de Connections, Query Performance, Storage, Locks e Backup Status.

---

## ADR-278

Queues deverão ser monitoradas por Depth, Processing Rate e Oldest Message Age quando aplicável.

---

## ADR-279

Scheduled Jobs críticos deverão possuir mecanismo para detectar execuções ausentes.

---

## ADR-280

External Providers deverão possuir Telemetry separada para Latency, Errors, Timeouts e Rate Limits.

---

## ADR-281

AI Operations deverão registrar Model, Latency, Failures, Token Usage e Cost quando aplicável.

---

## ADR-282

AI Operational Monitoring não substituirá Evaluation de qualidade.

---

## ADR-283

AI Agent Tool Calls deverão possuir Telemetry de execução sem expor parâmetros sensíveis desnecessários.

---

## ADR-284

Mobile Releases deverão possuir Error e Crash Monitoring por App Version.

---

## ADR-285

Web Production deverá possuir Client-side Error Monitoring quando compatível com requisitos de privacidade.

---

## ADR-286

Production deverá possuir External Uptime Monitoring independente do Health Check interno da aplicação.

---

## ADR-287

Deployments deverão gerar Markers ou Metadata correlacionáveis com Telemetry.

---

## ADR-288

Alertas deverão possuir Severity, Owner e ação operacional esperada.

---

## ADR-289

Paging Alerts serão reservados para condições que exijam resposta urgente.

---

## ADR-290

Alert Fatigue será tratado como problema de confiabilidade do sistema de Monitoring.

---

## ADR-291

Alertas críticos deverão evoluir para possuir Runbooks operacionais.

---

## ADR-292

Incidentes relevantes deverão possuir Timeline e Post-Incident Review proporcional ao impacto.

---

## ADR-293

Post-Incident Reviews deverão priorizar aprendizado sistêmico e ações corretivas em vez de atribuição de culpa individual.

---

## ADR-294

A própria infraestrutura de Observability deverá possuir Monitoring para detectar falhas de coleta e processamento de Telemetry.

---

## ADR-295

Audit Logs e Application Logs permanecerão sistemas conceitualmente distintos.

---

## ADR-296

Telemetry Retention deverá ser definida conforme sensibilidade, valor operacional, custo e requisitos legais.

---

## ADR-297

Distributed Tracing poderá utilizar Sampling para controlar volume, preservando prioridade para Errors e operações críticas quando possível.

---

## ADR-298

Critical Audit Events não poderão ser descartados por políticas genéricas de Telemetry Sampling.

---

## ADR-299

Production Telemetry deverá ser claramente separável de Non-Production Telemetry.

---

## ADR-300

Service Naming e Version Metadata deverão ser consistentes para permitir correlação entre Telemetry e Deployments.

---

## ADR-301

Open Standards como OpenTelemetry serão preferidos quando reduzirem Vendor Lock-In sem prejudicar requisitos operacionais.

---

## ADR-302

O MedFlow deverá evoluir para Service Level Objectives formais conforme a maturidade operacional aumentar.

---

## ADR-303

Observability Cost será monitorado como parte dos custos operacionais da plataforma.

---

## ADR-304

Feature Flag Rollouts deverão possuir Telemetry suficiente para avaliar regressões quando aplicável.

---

## ADR-305

Monitoring deverá permitir distinguir incidentes globais de problemas específicos de serviço, região ou Tenant sem violar isolamento de dados.

---

## ADR-306

Capacity Planning deverá utilizar dados históricos de infraestrutura e aplicação em vez de depender exclusivamente de estimativas manuais.

---

## ADR-307

Cada serviço crítico deverá evoluir para possuir Owner, Dashboard, Alerts e Runbook claramente definidos.

---

## ADR-308

Status Page externa poderá ser adotada conforme a plataforma ganhar dependência operacional de clientes externos.

---

# Arquitetura de Referência

```text
                            MEDFLOW
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
         Web                 Mobile                API
          │                    │                    │
          └──────────────┬─────┴─────────────┬─────┘
                         │                   │
                         ▼                   ▼
                      Errors              Traces
                         │                   │
                         └─────────┬─────────┘
                                   │
Workers ────────┐                  │
Database ───────┤                  │
Queue ──────────┼────► Telemetry Platform
Cache ──────────┤                  │
AI ─────────────┤                  │
Hosting ────────┘                  │
                                   │
                   ┌───────────────┼───────────────┐
                   ▼               ▼               ▼
                  Logs           Metrics          Traces
                   │               │               │
                   └───────────────┼───────────────┘
                                   ▼
                              Dashboards
                                   │
                                   ▼
                                Alerts
                                   │
                                   ▼
                           Incident Response
```

---

# Request Correlation

```text
Web / Mobile

↓

request_id
trace_id

↓

API

↓

Database
External Provider
Queue

↓

Worker

↓

Result
```

---

# Deployment Correlation

```text
Git Commit

↓

CI/CD

↓

Deployment ID

↓

Service Version

↓

Telemetry

↓

Incident / Regression
```

---

# Alert Lifecycle

```text
Metric / Log / Synthetic Check

↓

Condition Detected

↓

Alert

↓

Deduplication

↓

Severity

↓

Routing

↓

Owner

↓

Triage

↓

Mitigation

↓

Recovery

↓

Close
```

---

# Incident Lifecycle

```text
Detection

↓

Triage

↓

Declare Incident

↓

Assign Severity

↓

Contain / Mitigate

↓

Diagnose

↓

Recover

↓

Verify

↓

Communicate

↓

Post-Incident Review

↓

Corrective Actions
```

---

# Observability Maturity

A evolução poderá ocorrer em estágios.

```text
Level 1

Logs + Error Tracking + Uptime

↓

Level 2

Application Metrics + Infrastructure Metrics

↓

Level 3

Distributed Tracing + Alerting + Dashboards

↓

Level 4

SLO + Error Budgets + Runbooks

↓

Level 5

Advanced Automation + Predictive Capacity + Automated Recovery
```

Esses níveis não representam roadmap obrigatório.

---

# Critérios de Maturidade

Monitoring poderá ser considerado operacionalmente maduro quando:

- Production possuir External Uptime Monitoring.
- Backend possuir Structured Logging.
- Errors forem centralizados.
- Requests críticos forem correlacionáveis.
- Database possuir Monitoring.
- Queue e Workers possuírem Monitoring.
- Deployments forem visíveis na Telemetry.
- Versões forem identificáveis.
- Alertas críticos possuírem Owner.
- Sensitive Data estiver protegida.
- Retention estiver definida.
- Backups forem monitorados.
- AI possuir Operational Monitoring.
- Mobile possuir Crash Monitoring.
- Incidentes puderem ser reconstruídos historicamente.
- Dashboards responderem perguntas operacionais reais.
- Capacity Planning utilizar dados históricos.
- Monitoring não depender de inspeção manual de servidores.

---

# Relação com os Demais Documentos

```text
01-Environments.md

defines

WHERE TELEMETRY ORIGINATES
```

```text
02-CI-CD.md

defines

WHICH DEPLOYMENT PRODUCED THE RUNNING VERSION
```

```text
03-Docker.md

defines

CONTAINER RUNTIME SIGNALS
```

```text
04-Hosting.md

defines

INFRASTRUCTURE SIGNALS
```

```text
05-Monitoring.md

defines

HOW THE PLATFORM IS OBSERVED
```

```text
06-Release-Process.md

defines

HOW RELEASE HEALTH IS VALIDATED
```

---

# Referências Cruzadas

Este documento deverá ser interpretado em conjunto com:

```text
10-Deployment/
├── 01-Environments.md
├── 02-CI-CD.md
├── 03-Docker.md
├── 04-Hosting.md
├── 05-Monitoring.md
└── 06-Release-Process.md
```

Além das especificações de:

```text
Architecture

Backend

Database

Security

Audit

AI

Web

Mobile
```

Especialmente a documentação de Security e Audit deverá definir quais eventos possuem requisitos adicionais de integridade, acesso e retenção.

---

# Considerações Finais

Monitoring não deverá existir apenas para responder:

> "O servidor está online?"

O MedFlow é um sistema distribuído que poderá depender de múltiplas camadas:

```text
Web

Mobile

API

Database

Storage

Queue

Workers

AI Providers

Authentication Providers

Notification Providers

Cloud Infrastructure
```

Uma aplicação pode estar tecnicamente online enquanto uma funcionalidade crítica está completamente indisponível.

Por exemplo:

```text
API = Healthy

Database = Healthy

Queue = Healthy

Email Provider = Down

↓

Appointment Reminder = Broken
```

Ou:

```text
API = Healthy

AI Provider = Healthy

↓

Model starts returning invalid structured output

↓

Clinical AI Feature = Degraded
```

Por isso, Observability deverá compreender tanto infraestrutura quanto comportamento da aplicação.

A plataforma deverá conseguir seguir uma operação:

```text
User Action

↓

Frontend

↓

API

↓

Database

↓

Queue

↓

Worker

↓

External Provider

↓

Result
```

e, quando algo falhar, localizar a fronteira da falha.

Também deverá ser possível relacionar regressões com mudanças:

```text
Everything healthy

↓

Deployment v4.7.0

↓

Latency increases

↓

Trace identifies new Database Query

↓

Commit identified

↓

Fix deployed
```

Essa capacidade reduz o tempo entre:

```text
Something is wrong
```

e:

```text
We know what is wrong
and how to restore the service.
```

Ao mesmo tempo, Observability não poderá transformar dados sensíveis em material de diagnóstico irrestrito.

No contexto de saúde:

```text
More Logs

≠

Better Observability
```

A estratégia correta será:

```text
Right Signal

+

Right Context

+

Right Retention

+

Right Access
```

O objetivo final é que, daqui a anos, um engenheiro responsável pelo MedFlow consiga receber um alerta e rapidamente descobrir:

```text
What is failing?

Who is affected?

When did it start?

Which version is running?

What changed?

Which dependency is involved?

Is data integrity at risk?

How do we mitigate it?

How do we verify recovery?
```

Uma plataforma que consegue responder essas perguntas é operável.

Uma plataforma que não consegue depende de sorte, memória individual e tentativa e erro.

O MedFlow não deverá depender disso.

A Observability deverá funcionar como o sistema nervoso operacional da plataforma:

```text
Measure.

Correlate.

Detect.

Understand.

Respond.

Learn.
```

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação da especificação oficial de Monitoring, Observability, Logging, Metrics, Tracing, Alerting e Incident Response do MedFlow | Equipe MedFlow |