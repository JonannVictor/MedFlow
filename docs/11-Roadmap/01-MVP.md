# Roadmap do MVP

| Campo | Valor |
|-------|--------|
| Documento | MVP |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Roadmap |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

Este documento define o escopo oficial do **Minimum Viable Product (MVP)** do MedFlow.

O MVP representa a primeira versão do produto capaz de validar, em ambiente real e controlado, a principal proposta de valor da plataforma.

O objetivo do MVP não é entregar toda a visão futura do MedFlow.

O objetivo é responder:

```text
Does MedFlow solve
a real healthcare workflow problem
well enough that users
want to keep using it?
```

O MVP deverá possuir qualidade suficiente para representar corretamente a arquitetura e a visão do produto, sem incorporar prematuramente toda funcionalidade planejada para versões futuras.

---

# Definição de MVP

No contexto do MedFlow:

```text
MVP

≠

Prototype
```

```text
MVP

≠

Incomplete Product
```

```text
MVP

=

Smallest Production-Ready Product
capable of validating
the core MedFlow value proposition.
```

---

# Objetivo Estratégico

O MVP deverá validar três hipóteses fundamentais.

## Hipótese 1 — Problema

Profissionais e organizações de saúde possuem workflows administrativos e clínicos suficientemente fragmentados para justificar uma plataforma integrada.

---

## Hipótese 2 — Produto

O MedFlow consegue reduzir fricção nesses workflows através de uma experiência centralizada.

---

## Hipótese 3 — Adoção

Usuários conseguem incorporar o MedFlow à rotina sem que o custo operacional de adoção seja maior que o benefício entregue.

---

# Pergunta Central

O MVP deverá permitir responder:

> O MedFlow consegue se tornar uma ferramenta utilizada repetidamente na rotina de uma operação de saúde?

Essa pergunta possui prioridade maior que quantidade de Features.

---

# Princípios do MVP

O MVP seguirá:

```text
Useful before complete.

Secure before complex.

Reliable before massive.

Observable before scalable.

Validated before expanded.
```

---

# Escopo Controlado

O MVP deverá possuir escopo deliberadamente limitado.

Uma Feature somente deverá entrar no MVP se contribuir diretamente para:

- Core Workflow.
- Segurança.
- Operação.
- Validação do produto.
- Requisito técnico necessário.
- Requisito regulatório aplicável.
- Capacidade de aprender com usuários reais.

---

# Critério de Inclusão

Para cada Feature proposta:

```text
Does the MVP fail
to validate its core hypothesis
without this feature?
```

Se:

```text
YES

↓

MVP Candidate
```

Se:

```text
NO

↓

Future Version / Backlog
```

---

# MVP Is Not Feature Competition

O MedFlow não deverá tentar competir no MVP através de quantidade de funcionalidades.

Evitar:

```text
Competitor has Feature X

↓

MedFlow must have Feature X
in MVP
```

A existência de uma Feature em outro produto não prova necessidade no MVP.

---

# Core Value Loop

O MVP deverá validar um ciclo de valor recorrente.

Conceitualmente:

```text
User enters MedFlow

↓

Accesses operational context

↓

Performs healthcare workflow

↓

Information is persisted

↓

Team can continue the workflow

↓

User returns later

↓

Previous context remains available
```

O valor real está na continuidade.

---

# Usuários Primários

O MVP deverá inicialmente priorizar um conjunto controlado de personas.

Possíveis usuários:

```text
Clinic Administrator

Receptionist

Healthcare Professional

Doctor
```

Outras personas poderão ser incorporadas posteriormente.

---

# Paciente

O paciente poderá participar de determinados workflows, mas um Patient Portal completo não deverá ser considerado requisito automático do MVP.

A necessidade deverá ser validada.

---

# Multi-Tenancy

O MVP deverá nascer compatível com a arquitetura Multi-Tenant definida pelo MedFlow.

Conceito:

```text
MedFlow

├── Organization A
│   ├── Users
│   ├── Patients
│   └── Data
│
└── Organization B
    ├── Users
    ├── Patients
    └── Data
```

---

# Tenant Isolation

Mesmo no MVP:

```text
Tenant A

must never access

Tenant B
```

Isolamento não é Feature futura.

É requisito fundamental.

---

# Authentication

MVP deverá possuir Authentication adequada para Production.

Requisitos:

- Secure Login.
- Session Management.
- Password Policy quando aplicável.
- Password Recovery.
- Session Expiration.
- Secure Token Handling.

---

# Authorization

MVP deverá possuir Authorization.

Authentication responde:

```text
Who are you?
```

Authorization responde:

```text
What are you allowed to do?
```

Ambas são necessárias.

---

# Roles

O conjunto inicial de Roles deverá permanecer simples.

Exemplo conceitual:

```text
Administrator

Healthcare Professional

Reception
```

A definição definitiva deverá seguir a documentação oficial de Authorization.

---

# Organization Management

MVP deverá permitir representar a organização ou clínica dentro do sistema.

Possíveis dados:

- Organization Name.
- Contact Information.
- Operational Settings.
- Users.
- Roles.

---

# User Management

Administradores autorizados deverão conseguir gerenciar usuários necessários à operação.

Operações poderão incluir:

```text
Invite

Activate

Deactivate

Assign Role
```

---

# Patient Management

Patient Management será parte central do MVP.

O sistema deverá permitir:

```text
Create Patient

Search Patient

View Patient

Update Patient
```

---

# Patient Identity

O sistema deverá reduzir risco de registros duplicados.

Não significa que Duplicate Detection avançado precise existir imediatamente.

O MVP deverá ao menos possuir regras básicas de identificação e validação.

---

# Patient Search

Busca deverá ser rápida e útil para operação cotidiana.

Possíveis critérios:

```text
Name

Identifier

Contact Information
```

conforme política de privacidade.

---

# Patient Profile

O Patient Profile deverá funcionar como ponto central de contexto.

Conceitualmente:

```text
Patient

├── Basic Information
├── Appointments
├── Clinical Records
├── Documents
└── Relevant History
```

Nem todas as subseções precisarão possuir funcionalidades avançadas no MVP.

---

# Appointment Management

Scheduling deverá fazer parte do Core Workflow quando aplicável ao modelo inicial do MedFlow.

Operações mínimas:

```text
Create Appointment

View Appointment

Update Appointment

Cancel Appointment
```

---

# Calendar

MVP deverá oferecer representação operacional da agenda.

Pode incluir:

```text
Day View

Week View

Professional Schedule
```

O nível exato dependerá da implementação validada.

---

# Appointment Status

Status básicos poderão incluir:

```text
Scheduled

Confirmed

In Progress

Completed

Cancelled

No Show
```

A nomenclatura definitiva deverá permanecer consistente em toda plataforma.

---

# Reception Workflow

Reception deverá conseguir realizar tarefas operacionais sem acessar dados clínicos além do necessário.

Exemplo:

```text
Patient arrives

↓

Reception identifies patient

↓

Appointment located

↓

Status updated

↓

Healthcare Professional sees update
```

---

# Clinical Workflow

O MVP deverá oferecer uma base segura para registro clínico quando esse fluxo estiver dentro do piloto.

Possível fluxo:

```text
Open Patient

↓

Open Appointment

↓

Clinical Context

↓

Record Information

↓

Save

↓

Audit
```

---

# Clinical Records

Clinical Records deverão seguir requisitos de:

- Authorization.
- Auditability.
- Data Integrity.
- Privacy.
- Traceability.

---

# Clinical Data Editing

Alterações de informações clínicas deverão possuir comportamento claramente definido.

Não deverá existir:

```text
Silent History Rewrite
```

quando rastreabilidade for necessária.

---

# Audit Trail

Ações sensíveis deverão gerar Audit Events.

Exemplos:

```text
Patient viewed

Clinical record created

Clinical record changed

User permission changed

Sensitive document accessed
```

O escopo definitivo deverá seguir a arquitetura de Audit.

---

# Documents

O MVP poderá suportar documentos essenciais aos workflows selecionados.

Arquivos deverão utilizar Storage seguro.

---

# File Upload

Uploads deverão possuir:

- Authorization.
- File Type Validation.
- Size Limits.
- Secure Storage.
- Ownership.
- Audit quando aplicável.

---

# Dashboard

O MVP deverá possuir Dashboard útil.

Não deverá ser:

```text
A page full of decorative charts.
```

Deverá responder:

```text
What requires attention today?
```

---

# Dashboard Information

Possíveis informações:

```text
Today's Appointments

Pending Activities

Operational Alerts

Recent Activity

Quick Actions
```

---

# Reception

A interface de Reception deverá priorizar velocidade operacional.

Recepcionistas frequentemente executam operações repetitivas.

Portanto:

```text
Fewer Steps

+

Clear Status

+

Fast Search
```

possuem prioridade.

---

# Reports

Reports avançados não serão requisito central do MVP.

Relatórios básicos poderão existir quando necessários para validação ou operação.

---

# Notifications

O MVP poderá possuir notificações essenciais.

Exemplos:

```text
User Invitation

Password Recovery

Operational Notification
```

SMS, WhatsApp e canais avançados deverão depender de necessidade validada.

---

# Search

Search será componente importante.

O usuário não deverá navegar por múltiplas telas apenas para encontrar um paciente ou informação operacional básica.

---

# Global Search

Global Search poderá ser introduzida se a implementação inicial justificar.

Não será requisito obrigatório caso buscas contextuais sejam suficientes.

---

# Mobile

O Mobile App deverá seguir o escopo definido pela documentação de Mobile.

Entretanto, o MVP não deverá duplicar automaticamente todas as funcionalidades Web.

---

# Mobile MVP Principle

Mobile deverá priorizar workflows que realmente se beneficiam de mobilidade.

```text
Mobile

≠

Web squeezed into a smaller screen.
```

---

# Web

Web será uma das principais superfícies operacionais do MVP.

Deverá suportar workflows administrativos e clínicos definidos para o piloto.

---

# Responsive Design

Mesmo com Mobile App separado, Web deverá permanecer responsivo para tamanhos suportados.

---

# AI no MVP

AI deverá possuir papel controlado no MVP.

O MedFlow não deverá depender de AI para operações críticas que possam funcionar deterministicamente.

---

# AI Principle

```text
AI assists.

Application controls.
```

---

# AI Candidate Features

Dependendo do estágio real de implementação, AI poderá apoiar:

```text
Summaries

Information Organization

Administrative Assistance

Search Assistance

Draft Generation
```

---

# AI Clinical Safety

AI não deverá substituir julgamento clínico.

Resultados relevantes deverão ser apresentados como assistência.

---

# AI Validation

Qualquer Feature de AI incluída no MVP deverá possuir:

- Defined Purpose.
- Input Boundaries.
- Output Validation quando possível.
- Monitoring.
- Failure Handling.
- Human Oversight quando necessário.

---

# AI Failure

Se Provider de AI ficar indisponível:

```text
Core MedFlow

should continue operating
```

sempre que o workflow permitir.

---

# AI Cost

O MVP deverá monitorar consumo de AI desde o início.

---

# Data Model

O MVP deverá utilizar Data Model consistente com a arquitetura futura.

Evitar atalhos que tornem impossível evoluir entidades fundamentais.

---

# Core Entities

Dependendo da arquitetura oficial, o MVP deverá contemplar entidades equivalentes a:

```text
Organization

User

Role

Patient

Appointment

Clinical Record

Document

Audit Event
```

---

# Data Integrity

Constraints fundamentais deverão existir desde o MVP.

---

# Database Migrations

Schema deverá evoluir através de Migrations versionadas.

---

# Production Database

O MVP Production não deverá utilizar Database descartável ou local.

---

# Backup

Production deverá possuir Backup.

---

# Restore

A equipe deverá saber como restaurar dados antes de considerar o MVP operacionalmente pronto.

---

# Privacy

Privacy não será Feature pós-MVP.

O sistema deverá seguir princípios como:

```text
Data Minimization

Purpose Limitation

Access Control

Secure Storage

Auditability
```

---

# LGPD

Operações brasileiras deverão considerar requisitos aplicáveis da LGPD.

A implementação jurídica e operacional deverá ser validada com profissionais adequados conforme o produto avançar para uso real.

---

# GDPR

Se o piloto ou operação envolver usuários ou organizações sujeitas ao GDPR, os requisitos aplicáveis deverão ser avaliados antes do processamento correspondente.

---

# Security

O MVP deverá possuir baseline de segurança compatível com o tipo de dados processados.

---

# Security Baseline

Inclui:

```text
HTTPS

Authentication

Authorization

Tenant Isolation

Secure Secrets

Input Validation

Rate Limiting where appropriate

Audit

Backup

Monitoring
```

---

# Security Testing

Antes de Production:

- Dependency Checks.
- Authentication Testing.
- Authorization Testing.
- Tenant Isolation Testing.
- Input Validation Testing.
- Secret Scanning.

deverão fazer parte da validação adequada.

---

# Observability

MVP Production deverá ser observável.

No mínimo:

```text
Application Logs

Error Tracking

Uptime Monitoring

Database Monitoring

Critical Alerts
```

---

# Product Analytics

Além de Monitoring técnico, o MVP deverá medir uso do produto.

---

# Product Questions

Analytics deverá ajudar a responder:

```text
Which features are actually used?

Where do users abandon workflows?

How often do users return?

Which workflows take too long?

Which features create value?
```

---

# Privacy-Safe Analytics

Analytics não deverá coletar conteúdo clínico indiscriminadamente.

---

# MVP Success Metrics

Métricas exatas deverão evoluir conforme piloto.

Categorias importantes:

```text
Activation

Engagement

Retention

Reliability

Workflow Efficiency

User Satisfaction
```

---

# Activation

Pergunta:

```text
Can a new organization
reach meaningful value?
```

---

# Time to Value

Medir quanto tempo uma organização leva entre:

```text
Account created

and

First meaningful workflow completed
```

---

# Engagement

Avaliar se usuários retornam e utilizam Core Workflows.

---

# Retention

Uso recorrente possui mais valor que cadastro inicial.

---

# Workflow Efficiency

Comparar, quando possível:

```text
Steps

Time

Errors

Manual Work
```

antes e depois do MedFlow.

---

# Qualitative Feedback

MVP deverá coletar feedback diretamente dos usuários.

Perguntas importantes:

```text
What is confusing?

What is slow?

What do you still do outside MedFlow?

What would make you stop using MedFlow?

What feature do you actually need next?
```

---

# Feedback Is Roadmap Input

Feedback não deverá ser automaticamente transformado em Feature.

Fluxo:

```text
Feedback

↓

Problem Identification

↓

Frequency

↓

Impact

↓

Validation

↓

Prioritization
```

---

# Pilot

O MVP deverá preferencialmente iniciar através de Pilot controlado.

---

# Pilot Goals

Pilot deverá validar:

- Core Workflow.
- Usability.
- Reliability.
- Security assumptions.
- Operational Support.
- Real-world behavior.

---

# Pilot Size

O primeiro Pilot deverá ser pequeno o suficiente para permitir acompanhamento próximo.

---

# Pilot Users

Usuários iniciais deverão compreender que estão participando de uma fase controlada de validação quando aplicável.

---

# Pilot Support

A equipe deverá possuir canal claro para:

- Bugs.
- Questions.
- Feedback.
- Incident Reporting.

---

# Founder-Led Observation

No estágio inicial, contato direto com usuários possui alto valor.

Problemas não deverão ser avaliados apenas por Analytics.

---

# MVP Support

Antes do primeiro uso real, deverá existir processo mínimo de Support.

---

# Bug Severity

Bugs poderão ser classificados:

```text
Critical

High

Medium

Low
```

---

# Critical Bug

Exemplos:

- Data Exposure.
- Tenant Isolation Failure.
- Data Corruption.
- Authentication Bypass.
- Core Platform Outage.

---

# High Bug

Exemplo:

- Critical Workflow unavailable sem workaround aceitável.

---

# Medium Bug

Problema relevante com workaround.

---

# Low Bug

Problema visual ou de baixo impacto.

---

# MVP Exit Criteria

O MVP somente deverá avançar para próxima fase quando critérios mínimos forem atendidos.

---

# Technical Exit Criteria

```text
Production Stable

Critical Workflows Functional

No Known Critical Security Issue

Backup Operational

Monitoring Operational

Deployment Reproducible

Audit Functional

Tenant Isolation Validated
```

---

# Product Exit Criteria

```text
Real Users Tested

Core Workflow Used

Feedback Collected

Repeated Usage Observed

Major Friction Identified

Next Priorities Supported by Evidence
```

---

# Business Exit Criteria

Dependendo da estratégia:

```text
Pilot Organization Active

Value Proposition Validated

Commercial Interest Observed

Pricing Hypothesis Tested
```

Não será necessário provar escala completa no MVP.

---

# MVP Completion

MVP não deverá ser declarado concluído porque:

```text
All planned tickets are closed.
```

Deverá ser concluído quando:

```text
The core hypothesis
has been sufficiently tested.
```

---

# What Is Not MVP

Por padrão, itens como os seguintes deverão permanecer fora do MVP salvo evidência contrária:

```text
Large Marketplace

Complex BI Platform

Advanced Custom Report Builder

Full Workflow Automation Engine

Large Integration Marketplace

Multi-Region Active-Active

Advanced Predictive AI

Custom AI Models per Tenant

Large Plugin Ecosystem

Highly Complex Permission Builder

Enterprise SSO for every provider

White Label Platform

Full Internationalization

Dozens of External Integrations
```

---

# Avoid Premature Enterprise Features

Enterprise requirements poderão chegar.

Mas não deverão dominar o MVP antes da validação.

---

# Avoid Premature Scale

O MVP não precisa suportar milhões de usuários.

Precisa possuir arquitetura que não bloqueie evolução.

---

# Technical Debt

Algum Technical Debt será inevitável.

Entretanto, não serão aceitos atalhos que comprometam:

```text
Security

Data Integrity

Tenant Isolation

Auditability

Recovery
```

---

# Acceptable Technical Debt

Pode incluir:

- Manual internal process.
- Limited automation.
- Simple UI implementation.
- Limited reporting.

desde que documentado quando relevante.

---

# Unacceptable Technical Debt

Exemplos:

```text
Shared passwords

No tenant isolation

No backups

Hardcoded secrets

Clinical data in logs

No authorization

Manual production database editing as normal workflow
```

---

# MVP Architecture

Arquitetura conceitual:

```text
                     USERS
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
            Web                Mobile
             │                   │
             └─────────┬─────────┘
                       ▼
                   Backend API
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
    Database        Storage          Queue
                                       │
                                       ▼
                                    Workers
                                       │
                      ┌────────────────┼─────────────┐
                      ▼                ▼             ▼
                     AI          Notifications    External
                                                 Services
```

Nem todos os componentes precisam estar presentes imediatamente.

---

# MVP Development Flow

```text
Problem

↓

Small Feature

↓

Implementation

↓

Automated Tests

↓

Staging

↓

Validation

↓

Production

↓

Observe Usage

↓

Collect Feedback

↓

Learn

↓

Prioritize Next Change
```

---

# Feature Prioritization

Features deverão ser avaliadas por:

```text
User Impact

Business Impact

Validation Value

Risk Reduction

Implementation Cost

Architectural Impact
```

---

# Priority Model

Modelo conceitual:

```text
Priority

≈

Impact × Confidence

───────────────

Effort
```

Não precisa ser utilizado matematicamente.

Serve como princípio.

---

# Must Have

Feature necessária para:

- Core Value.
- Security.
- Compliance.
- Production Operation.

---

# Should Have

Feature importante, mas MVP ainda consegue validar sem ela.

---

# Could Have

Feature útil com menor impacto imediato.

---

# Won't Have Yet

Feature explicitamente adiada.

Essa categoria é importante para controlar escopo.

---

# MVP Milestones

## Milestone 1 — Foundation

Objetivo:

```text
Platform can safely exist.
```

Inclui:

- Authentication.
- Authorization.
- Multi-Tenancy.
- Database.
- Environment Separation.
- CI/CD.
- Monitoring baseline.

---

## Milestone 2 — Core Data

Objetivo:

```text
Platform understands
its fundamental entities.
```

Inclui:

- Organizations.
- Users.
- Patients.
- Roles.
- Core relationships.

---

## Milestone 3 — Operational Workflow

Objetivo:

```text
Users can perform
a real workflow.
```

Inclui:

- Patient Management.
- Scheduling.
- Reception.
- Core operational flows.

---

## Milestone 4 — Clinical Foundation

Objetivo:

```text
Authorized professionals
can work with clinical context.
```

Quando incluído no piloto:

- Clinical Records.
- Clinical History.
- Secure Documents.
- Audit.

---

## Milestone 5 — Intelligence

Objetivo:

```text
AI provides measurable assistance.
```

Somente Features suficientemente seguras e úteis deverão entrar.

---

## Milestone 6 — Production Readiness

Objetivo:

```text
Real users can safely use MedFlow.
```

Inclui:

- Security Review.
- Backup.
- Restore.
- Monitoring.
- Alerts.
- Release Process.
- Support Process.

---

## Milestone 7 — Pilot

Objetivo:

```text
Validate with reality.
```

Inclui:

- Onboarding.
- Real Usage.
- Feedback.
- Metrics.
- Iteration.

---

# MVP Go-Live Checklist

| Área | Requisito |
|------|-----------|
| Authentication | ✅ |
| Authorization | ✅ |
| Tenant Isolation | ✅ |
| User Management | ✅ |
| Patient Management | ✅ |
| Core Workflow | ✅ |
| Audit | ✅ |
| Database Backup | ✅ |
| Restore Strategy | ✅ |
| HTTPS | ✅ |
| Secrets Protection | ✅ |
| Error Monitoring | ✅ |
| Uptime Monitoring | ✅ |
| Deployment Process | ✅ |
| Rollback | ✅ |
| Privacy Review | ✅ |
| Security Review | ✅ |
| Pilot Support | ✅ |

---

# Product Validation Checklist

| Pergunta | Necessário |
|----------|------------|
| Usuários reais utilizaram? | ✅ |
| Core Workflow foi concluído? | ✅ |
| Usuários retornaram? | ✅ |
| Feedback foi coletado? | ✅ |
| Fricções foram identificadas? | ✅ |
| Existe benefício percebido? | ✅ |
| Próximas prioridades possuem evidência? | ✅ |

---

# Security Gate

O MVP não deverá entrar em uso real caso exista conhecimento de:

```text
Authentication Bypass

Authorization Bypass

Cross-Tenant Data Exposure

Critical Data Corruption

Exposed Production Secrets

Missing Critical Backup
```

---

# Release Gate

Antes do Pilot:

```text
CI

↓

Staging

↓

Security Validation

↓

Production Deployment

↓

Smoke Tests

↓

Monitoring

↓

Pilot
```

---

# Scope Change

O escopo deste documento poderá mudar.

Entretanto, mudanças deverão possuir justificativa.

---

# Scope Addition

Antes de adicionar Feature ao MVP:

```text
What hypothesis does it validate?

What happens if we postpone it?

What complexity does it add?

What risk does it introduce?
```

---

# Scope Removal

Remover Feature do MVP não significa abandoná-la.

Ela poderá migrar para:

```text
02-v1.md

03-v2.md

04-v3.md

05-Long-Term.md

06-Idea-Backlog.md
```

---

# Roadmap Is Evidence-Driven

O Roadmap deverá mudar conforme aprendizados reais.

```text
Plan

↓

Build

↓

Measure

↓

Learn

↓

Update Roadmap
```

---

# Decisões Arquiteturais e de Produto

## ADR-353

O MVP do MedFlow será tratado como a menor versão Production-Ready capaz de validar a proposta central de valor, e não como Prototype descartável.

---

## ADR-354

Security, Tenant Isolation, Authorization, Backup e Auditability não serão classificados como Features opcionais pós-MVP quando necessários ao processamento realizado.

---

## ADR-355

O escopo do MVP será orientado pela validação de Core Workflows e não pela quantidade de funcionalidades oferecidas por concorrentes.

---

## ADR-356

O MVP deverá preservar fundamentos arquiteturais necessários à evolução futura sem implementar antecipadamente toda a infraestrutura de escala.

---

## ADR-357

Multi-Tenancy será considerado fundamento arquitetural do MVP.

---

## ADR-358

Patient Management será tratado como um dos domínios centrais do MVP.

---

## ADR-359

Scheduling e Reception serão priorizados quando fizerem parte do Core Workflow validado pelo piloto.

---

## ADR-360

Clinical Workflows incluídos no MVP deverão possuir Authorization, Auditability e Data Integrity desde sua introdução.

---

## ADR-361

AI no MVP será utilizada como camada assistiva e não como autoridade autônoma sobre decisões clínicas.

---

## ADR-362

Falha de AI não deverá indisponibilizar Core Workflows determinísticos sempre que a arquitetura permitir degradação segura.

---

## ADR-363

AI Features incluídas no MVP deverão possuir Monitoring e mecanismo definido de Failure Handling.

---

## ADR-364

Production MVP deverá possuir Observability mínima antes do início de uso real.

---

## ADR-365

Product Analytics deverá seguir Data Minimization e não coletará conteúdo clínico indiscriminadamente.

---

## ADR-366

O MVP deverá ser validado através de usuários reais em Pilot controlado sempre que operacionalmente possível.

---

## ADR-367

Feedback de usuários será tratado como evidência para investigação e priorização, não como comando automático para implementação de Features.

---

## ADR-368

O MVP será considerado validado por evidência de uso e valor, e não exclusivamente pela conclusão do Backlog planejado.

---

## ADR-369

Technical Debt poderá ser aceita no MVP desde que não comprometa Security, Data Integrity, Tenant Isolation, Auditability ou Recovery.

---

## ADR-370

Enterprise Features complexas não serão incorporadas ao MVP sem necessidade validada.

---

## ADR-371

O MedFlow não otimizará prematuramente a infraestrutura do MVP para escala que ainda não existe.

---

## ADR-372

O MVP deverá possuir Backup e Recovery Strategy antes de processar dados Production relevantes.

---

## ADR-373

O primeiro Pilot deverá possuir escopo suficientemente controlado para permitir acompanhamento próximo e aprendizado rápido.

---

## ADR-374

Features do MVP deverão ser priorizadas com base em User Impact, Validation Value, Risk, Cost e Architectural Impact.

---

## ADR-375

Mudanças significativas no escopo do MVP deverão ser registradas e justificadas para preservar histórico das decisões de produto.

---

## ADR-376

A evolução do Roadmap será Evidence-Driven e poderá alterar prioridades originalmente planejadas conforme dados reais forem coletados.

---

# Definition of Done — MVP

O MVP será considerado tecnicamente pronto quando:

```text
Core workflows work.

Critical data is protected.

Tenant boundaries are validated.

Production is observable.

Deployments are reproducible.

Backups exist.

Recovery is understood.

Critical actions are auditable.

Security baseline is satisfied.
```

Será considerado comercialmente validável quando:

```text
Real users can use it.

Users understand its value.

Users return.

The workflow improves something measurable.

Feedback produces clear next priorities.
```

---

# Após o MVP

A conclusão do MVP inicia a próxima fase.

```text
MVP

↓

Evidence

↓

Lessons

↓

Prioritization

↓

v1
```

O arquivo:

```text
02-v1.md
```

deverá definir a primeira evolução consolidada do produto após a validação inicial.

---

# Relação com o Roadmap

```text
01-MVP.md

defines

WHAT MUST EXIST TO VALIDATE MEDFLOW
```

```text
02-v1.md

defines

WHAT BECOMES THE FIRST CONSOLIDATED PRODUCT
```

```text
03-v2.md

defines

THE NEXT EXPANSION OF CAPABILITIES
```

```text
04-v3.md

defines

THE ADVANCED PRODUCT STAGE
```

```text
05-Long-Term.md

defines

THE LONG-TERM DIRECTION
```

```text
06-Idea-Backlog.md

captures

UNCOMMITTED POSSIBILITIES
```

---

# Continuidade Histórica

Este documento não deverá ser sobrescrito simplesmente porque o MVP terminou.

Quando o MVP for encerrado, seu estado final deverá permanecer preservado.

Mudanças posteriores deverão ocorrer nos documentos correspondentes às próximas versões.

Isso permitirá que futuros desenvolvedores compreendam:

```text
What was considered MVP?

Why?

What was postponed?

What assumptions existed?

What was actually validated?
```

Roadmap também é documentação histórica.

---

# Considerações Finais

O maior risco de um MVP não é possuir poucas Features.

É tentar resolver tudo antes de descobrir o que realmente importa.

O MedFlow possui uma visão ampla.

Essa visão poderá envolver futuramente:

```text
Clinical Operations

Administrative Operations

AI

Automation

Analytics

Integrations

Patient Experience

Healthcare Intelligence

Multi-Organization Operations
```

Mas a visão futura não deverá impedir a entrega da primeira unidade real de valor.

O MVP deverá encontrar:

```text
The smallest useful MedFlow.
```

Não o menor código possível.

Não a menor quantidade de telas possível.

Mas a menor versão capaz de criar um ciclo real:

```text
Real User

↓

Real Problem

↓

MedFlow

↓

Real Workflow

↓

Measurable Value

↓

User Returns
```

Se esse ciclo existir, existe uma base para crescimento.

Se esse ciclo não existir, adicionar dezenas de Features não resolverá o problema.

Por isso:

```text
MVP

↓

Validate

↓

Learn

↓

Improve

↓

v1

↓

Scale
```

O Roadmap não deverá ser uma promessa rígida feita em 2026 para desenvolvedores de 2036.

Ele deverá registrar **a intenção, as hipóteses e as decisões existentes naquele momento**.

Futuros desenvolvedores poderão mudar as soluções.

Mas deverão conseguir entender por que cada etapa existiu.

Esse é o objetivo desta documentação:

```text
Preserve decisions.

Preserve context.

Preserve intent.

Allow evolution.
```

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação da definição oficial do MVP, critérios de escopo, milestones, validação, Pilot, métricas e critérios de evolução do MedFlow | Equipe MedFlow |