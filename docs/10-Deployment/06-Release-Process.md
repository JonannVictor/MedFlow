# Processo de Release

| Campo | Valor |
|-------|--------|
| Documento | Release Process |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Deployment |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

Este documento define o processo oficial de **Release Management** do MedFlow.

Um Release representa mais do que a execução de um Deployment.

```text
Deployment

=

Software foi colocado em um ambiente.
```

```text
Release

=

Uma versão foi formalmente considerada
apta para utilização.
```

Essa distinção é fundamental.

Uma nova versão poderá estar:

```text
Built

↓

Deployed

↓

Validated

↓

Released
```

O MedFlow deverá possuir um processo de Release:

- Reproduzível.
- Rastreável.
- Auditável.
- Reversível.
- Automatizado quando possível.
- Seguro.
- Compatível com Web.
- Compatível com Backend.
- Compatível com Mobile.
- Compatível com Database Migrations.
- Compatível com AI Changes.
- Compatível com Feature Flags.
- Compatível com múltiplos ambientes.

Princípio fundamental:

```text
A Release is not successful
because deployment finished.

A Release is successful
when the intended version
is safely serving its users.
```

---

# Objetivos

O processo deverá garantir:

- Versionamento consistente.
- Identificação exata do código em Production.
- Validação antes de Production.
- Controle de mudanças.
- Rollback seguro.
- Compatibilidade entre componentes.
- Rastreabilidade entre Commit e Release.
- Rastreabilidade entre Release e Deployment.
- Rastreabilidade entre Release e Incident.
- Proteção contra mudanças acidentais.
- Release Notes.
- Validação pós-Deployment.
- Controle de Database Migrations.
- Controle de Feature Flags.
- Controle de AI Configuration.
- Mobile Release Management.
- Histórico de versões.

---

# Release Lifecycle

Fluxo conceitual:

```text
Development

↓

Pull Request

↓

Review

↓

CI Validation

↓

Merge

↓

Build

↓

Artifact

↓

Staging Deployment

↓

Validation

↓

Release Candidate

↓

Production Deployment

↓

Production Verification

↓

Release

↓

Monitoring
```

---

# Release Unit

Uma Release deverá representar um estado identificável da plataforma.

Poderá incluir:

```text
Backend Version

Web Version

Mobile Version

Database Schema Version

AI Prompt Version

Feature Flag State

Infrastructure Changes
```

Nem todos os componentes precisarão mudar em cada Release.

---

# Release Identity

Cada Release deverá possuir identificador único.

Exemplo:

```text
v2.4.1
```

ou mecanismo equivalente.

---

# Semantic Versioning

Quando apropriado, o MedFlow poderá utilizar:

```text
MAJOR.MINOR.PATCH
```

Exemplo:

```text
2.4.1
```

---

# MAJOR

Representa mudança incompatível significativa.

```text
2.x.x

↓

3.0.0
```

---

# MINOR

Representa funcionalidade compatível adicionada.

```text
2.4.0

↓

2.5.0
```

---

# PATCH

Representa correção compatível.

```text
2.4.0

↓

2.4.1
```

---

# Versioning Reality

Nem todo componente precisará utilizar Semantic Versioning internamente.

Builds poderão também utilizar:

```text
Git SHA

Build ID

Artifact Digest
```

O requisito essencial é:

```text
Exact Version Identification
```

---

# Git Tag

Releases oficiais deverão preferencialmente possuir Git Tag.

Exemplo:

```text
v2.4.1
```

---

# Tag Immutability

Tags oficiais não deverão ser movidas para outro Commit após publicação.

```text
v2.4.1

↓

Commit A
```

deverá permanecer associado ao mesmo Commit.

---

# Release Branches

Branches dedicadas de Release somente deverão ser utilizadas se o fluxo realmente exigir.

Evitar complexidade desnecessária.

---

# Main Branch

A Branch principal deverá permanecer em estado potencialmente liberável conforme maturidade do projeto.

---

# Release Candidate

Antes de Production, uma versão poderá ser marcada como:

```text
Release Candidate
```

Exemplo:

```text
v2.4.0-rc.1
```

quando o processo justificar.

---

# Pre-Release

Possíveis identificadores:

```text
alpha

beta

rc
```

deverão possuir significado definido caso sejam utilizados.

---

# Alpha

Pode representar versão interna ainda instável.

---

# Beta

Pode representar versão funcional em validação ampliada.

---

# Release Candidate

Representa candidato próximo da versão final.

---

# Artifact Principle

O Artifact validado deverá ser o Artifact promovido.

Preferir:

```text
Build Once

↓

Test

↓

Promote

↓

Production
```

Evitar:

```text
Build for Staging

↓

Validate

↓

Rebuild from source

↓

Production
```

O segundo fluxo pode produzir Artifacts diferentes.

---

# Artifact Immutability

Após Build:

```text
Artifact

=

Immutable
```

Mudança exige novo Build e nova identidade.

---

# Artifact Metadata

Artifact deverá permitir identificar:

```text
Version

Git SHA

Build ID

Build Time

Runtime Version

Artifact Digest
```

quando aplicável.

---

# Release Manifest

Conforme o sistema crescer, cada Release poderá possuir Manifest.

Exemplo conceitual:

```yaml
release: 2.4.1

backend:
  version: 2.4.1
  git_sha: a8f2c91

web:
  version: 2.4.1
  git_sha: b4e19f2

database:
  migration: 20260725_01

ai:
  prompt_version: clinical-summary-v7
```

Esse Manifest poderá tornar a composição exata da Release reproduzível.

---

# Release Composition

Em arquitetura com múltiplos serviços:

```text
Release X

├── Web A
├── API B
├── Worker B
├── Database Schema C
└── AI Config D
```

A Release deverá registrar essa composição quando necessário.

---

# Release Preparation

Antes de Release, deverão ser avaliados:

- Código.
- Tests.
- Dependencies.
- Security.
- Database Migrations.
- Environment Variables.
- Secrets.
- Infrastructure Changes.
- Feature Flags.
- AI Changes.
- Backward Compatibility.
- Rollback Strategy.
- Monitoring.
- Documentation.

---

# Release Checklist

Uma Release não deverá depender apenas da memória do desenvolvedor.

Checklist deverá ser utilizada para mudanças relevantes.

---

# Code Freeze

Code Freeze poderá ser adotado em Releases críticas.

Não será obrigatório para todas as Releases.

---

# Change Scope

Antes da Release, a equipe deverá compreender:

```text
What changed?
```

---

# Risk Classification

Mudanças poderão ser classificadas.

Exemplo:

```text
Low Risk

Medium Risk

High Risk

Critical Risk
```

---

# Low Risk

Exemplos:

- Copy change.
- Internal refactor com cobertura adequada.
- Minor UI adjustment.

---

# Medium Risk

Exemplos:

- New endpoint.
- New workflow.
- New integration.

---

# High Risk

Exemplos:

- Authentication change.
- Authorization change.
- Database migration.
- Payment change.
- Clinical workflow change.
- Large infrastructure change.

---

# Critical Risk

Exemplos:

- Tenant isolation architecture.
- Encryption change.
- Patient data migration.
- Authentication provider migration.
- Large production database transformation.

---

# Risk-Based Release Process

Quanto maior o risco:

```text
More Review

+

More Validation

+

More Monitoring

+

More Explicit Rollback
```

---

# Staging Validation

Release relevante deverá passar por Staging antes de Production.

---

# Staging Goals

Validar:

```text
Artifact

Configuration

Database Migration

Integrations

Critical Flows

Observability

Deployment Process
```

---

# Staging Limitations

Staging não prova que Production funcionará perfeitamente.

Diferenças podem existir em:

- Scale.
- Traffic.
- Data Volume.
- External Provider Behavior.
- Network.
- User Behavior.

---

# Smoke Tests

Após Deployment:

```text
Deployment

↓

Smoke Tests
```

deverão validar funções essenciais.

---

# Smoke Test Examples

Exemplos conceituais:

```text
Application reachable

Authentication operational

Database reachable

Critical API endpoint operational

Worker processing

Storage accessible
```

---

# Critical User Journeys

Conforme o MedFlow amadurecer, Smoke Tests deverão cobrir fluxos como:

```text
Login

↓

Select Tenant / Clinic

↓

Open Patient

↓

Access Authorized Data

↓

Create / Update Allowed Resource

↓

Verify Result
```

Sempre utilizando dados seguros para testes.

---

# Production Synthetic Tests

Synthetic Accounts poderão validar fluxos sem utilizar dados reais de pacientes.

---

# Release Approval

Mudanças de maior risco poderão exigir aprovação explícita antes de Production.

---

# Approval Separation

Idealmente, mudanças críticas não deverão depender exclusivamente da mesma pessoa que as implementou.

---

# Small Team Reality

Enquanto a equipe for pequena, separação completa de funções poderá não ser possível.

Nesse caso:

```text
Automation

+

Checklists

+

Audit Trail

+

Explicit Confirmation
```

deverão reduzir risco.

---

# Production Deployment

Production Deployment deverá utilizar processo definido em:

```text
02-CI-CD.md
```

---

# Deployment Window

Mudanças de alto risco poderão possuir Deployment Window.

Preferir horários em que:

- Equipe esteja disponível.
- Monitoring possa ser acompanhado.
- Rollback possa ser executado.
- Impacto possa ser gerenciado.

---

# Friday Deployments

Não existe regra arquitetural universal proibindo Releases em sexta-feira.

A decisão deverá considerar:

```text
Risk

Support Availability

Rollback Confidence

Monitoring
```

---

# Production Verification

Deployment concluído não significa Release concluída.

Após Deployment:

```text
Health Checks

↓

Smoke Tests

↓

Metrics

↓

Error Rate

↓

Latency

↓

Critical Flows

↓

Release Confirmation
```

---

# Verification Window

Mudanças relevantes deverão possuir período de observação após Deployment.

A duração dependerá do risco.

---

# Deployment Marker

Toda Production Deployment deverá gerar sinal identificável no Monitoring.

Conforme:

```text
05-Monitoring.md
```

---

# Version Endpoint

Backend poderá expor endpoint seguro.

Exemplo:

```text
/version
```

retornando apenas Metadata não sensível.

Exemplo:

```json
{
  "version": "2.4.1",
  "commit": "a8f2c91"
}
```

---

# Release Health

Uma Release poderá ser classificada como:

```text
Healthy

Degraded

Failed

Rolled Back
```

---

# Failed Release

Uma Release deverá ser considerada falha quando produzir impacto incompatível com critérios de aceitação.

---

# Rollback

Rollback deverá ser planejado antes de mudanças de risco elevado.

Pergunta obrigatória:

> Se essa Release falhar, como retornamos ao estado seguro anterior?

---

# Application Rollback

Para aplicação:

```text
Version N+1

↓

Failure

↓

Deploy Version N
```

---

# Artifact Rollback

Rollback deverá utilizar Artifact conhecido.

Não rebuildar código antigo durante incidente se Artifact anterior estiver disponível.

---

# Database Rollback

Database Rollback é mais complexo.

Uma Migration poderá não ser reversível de forma segura.

---

# Forward Fix

Em muitos casos, Database deverá utilizar:

```text
Forward Fix
```

em vez de Migration Down destrutiva.

---

# Expand and Contract

Mudanças de Schema incompatíveis deverão preferir estratégia:

```text
Expand

↓

Deploy Compatible Code

↓

Migrate Data

↓

Switch Usage

↓

Contract
```

---

# Expand Phase

Adicionar nova estrutura sem remover imediatamente a antiga.

---

# Compatibility Phase

Versões antiga e nova da aplicação deverão continuar funcionando durante transição quando necessário.

---

# Data Migration

Dados poderão ser migrados progressivamente.

---

# Contract Phase

Estrutura antiga somente deverá ser removida quando nenhuma versão ativa depender dela.

---

# Destructive Migration

Exemplos:

```text
DROP COLUMN

DROP TABLE

Data Rewrite

Constraint Tightening
```

exigem cuidado adicional.

---

# Migration Backup

Mudanças críticas poderão exigir Backup ou Recovery Point validado antes da execução.

---

# Long-Running Migration

Migration longa não deverá bloquear Production indiscriminadamente.

Avaliar:

- Locks.
- Table Size.
- Traffic.
- Execution Time.
- Rollback.
- Online Migration Strategy.

---

# Migration Observability

Database Migrations relevantes deverão registrar:

```text
Start

End

Duration

Success

Failure

Version
```

---

# Migration Ownership

Migration deverá fazer parte do mesmo Change Review da funcionalidade que a exige.

---

# Backward Compatibility

Durante Rolling Deployments:

```text
Old Application

+

New Application

+

Current Database
```

podem coexistir.

Database e APIs internas deverão suportar essa janela.

---

# API Compatibility

Mudanças incompatíveis deverão possuir estratégia explícita.

Possibilidades:

```text
Versioned API

Compatibility Layer

Coordinated Client Migration
```

---

# Mobile Compatibility

Mobile exige atenção especial.

Usuários não atualizam imediatamente.

```text
Backend v10

↓

Mobile v8
Mobile v9
Mobile v10
```

podem coexistir.

---

# Minimum Supported Mobile Version

Backend poderá definir versão mínima suportada quando necessário.

---

# Forced Update

Forced Update deverá ser utilizado com cautela.

Pode ser necessário em casos como:

- Critical Security Issue.
- Protocol Incompatibility.
- Data Integrity Risk.

---

# Grace Period

Quando possível:

```text
New Mobile Version

↓

Adoption Window

↓

Old Version Warning

↓

Minimum Version Enforcement
```

---

# Mobile Release

Mobile possui ciclo diferente de Web.

```text
Build

↓

Signing

↓

Store Submission

↓

Review

↓

Approval

↓

Rollout

↓

User Adoption
```

---

# Store Review

App Store / Play Store Review não está sob controle completo do MedFlow.

Planejamento deverá considerar atraso.

---

# Mobile Build Identity

Mobile deverá possuir:

```text
Version

Build Number
```

---

# Mobile Signing

Signing Credentials deverão ser tratados como Secrets críticos.

---

# Signing Key Loss

Perda de Signing Credentials pode comprometer capacidade de atualizar o aplicativo.

Deverão possuir Backup e Access Control adequados.

---

# Mobile Rollout

Quando Store permitir, Releases poderão utilizar:

```text
Staged Rollout
```

---

# Staged Rollout

Exemplo conceitual:

```text
1%

↓

5%

↓

20%

↓

50%

↓

100%
```

Percentuais reais dependerão da plataforma e risco.

---

# Mobile Rollout Monitoring

A cada estágio:

```text
Crash Rate

Errors

User Feedback

Backend Compatibility
```

deverão ser observados.

---

# Mobile Rollback Reality

Mobile não possui Rollback instantâneo equivalente ao Backend.

Depois que usuários instalam uma versão, removê-la não desfaz instalações existentes.

---

# Mobile Kill Switch

Funcionalidades de risco poderão utilizar Feature Flag remota quando apropriado.

Isso permite:

```text
Problematic Feature

↓

Disable Server-Side

↓

App remains installed
```

---

# Web Release

Web normalmente possui adoção muito mais rápida.

```text
Deploy

↓

Users receive new version
```

---

# Cached Web Clients

Mesmo Web poderá possuir clientes com assets antigos temporariamente.

Compatibilidade deverá considerar caching.

---

# Service Worker

Caso Progressive Web App ou Service Worker seja utilizado, Update Strategy deverá ser documentada.

---

# Backend Release

Backend poderá utilizar:

```text
Rolling Deployment

Blue-Green

Canary
```

dependendo da infraestrutura.

---

# Rolling Deployment

```text
Old Instances

↓

Replace Gradually

↓

New Instances
```

---

# Blue-Green Deployment

```text
Blue

Current Production
```

```text
Green

New Version
```

Após validação:

```text
Traffic

Blue → Green
```

---

# Canary Release

```text
Small Traffic Percentage

↓

New Version

↓

Observe

↓

Increase
```

---

# Canary Requirements

Canary exige:

- Traffic Control.
- Version-aware Monitoring.
- Sufficient Traffic.
- Reliable Metrics.

Não deverá ser adotado apenas por sofisticação.

---

# Progressive Delivery

Feature Flags e Canary poderão permitir:

```text
Deploy

≠

Release to everyone
```

---

# Feature Flags

Feature Flag permite separar:

```text
Code Deployment

from

Feature Exposure
```

---

# Feature Flag Types

Possíveis categorias:

```text
Release Flag

Experiment Flag

Operational Flag

Permission Flag
```

---

# Release Flag

Controla rollout de funcionalidade nova.

---

# Operational Flag

Pode desabilitar comportamento problemático sem novo Deployment.

---

# Permission Flag

Não deverá substituir Authorization.

Feature Flag não é Security Boundary.

---

# Feature Flag Ownership

Flags deverão possuir:

```text
Owner

Purpose

Created At

Removal Plan
```

quando processo amadurecer.

---

# Flag Cleanup

Release Flags temporárias deverão ser removidas após rollout estável.

---

# Stale Flags

Flags antigas aumentam complexidade.

Deverão ser identificadas.

---

# Kill Switch

Funcionalidades críticas poderão possuir Kill Switch quando apropriado.

---

# AI Release Management

Mudanças de AI deverão ser tratadas como mudanças de software.

Isso inclui:

```text
Model Change

Prompt Change

Tool Change

Retrieval Change

Guardrail Change

Structured Output Schema Change
```

---

# Prompt Versioning

Prompts críticos deverão possuir versão.

Exemplo:

```text
clinical-summary-v7
```

---

# Model Upgrade

Trocar:

```text
Model A

↓

Model B
```

não deverá ser considerado mudança trivial.

---

# AI Release Validation

Antes de Production:

```text
Evaluation Dataset

↓

Current Version

vs

Candidate Version

↓

Quality

Safety

Latency

Cost
```

---

# AI Regression

Uma nova versão poderá:

- Responder melhor.
- Responder pior.
- Custar mais.
- Ficar mais lenta.
- Alterar formato.
- Alterar comportamento clínico.

Tudo deverá ser considerado.

---

# AI Canary

Mudanças de AI poderão utilizar rollout limitado quando apropriado.

---

# AI Rollback

Configuração deverá permitir retornar a:

```text
Previous Model

Previous Prompt

Previous Tool Configuration
```

quando tecnicamente possível.

---

# AI Configuration Identity

Telemetry deverá registrar:

```text
model

prompt_version

tool_version

evaluation_version
```

quando aplicável.

---

# External Provider Release Risk

Mudanças de Providers externos também podem afetar Release.

Exemplo:

```text
Authentication Provider

Payment Provider

AI Provider

Email Provider
```

---

# Provider API Version

Versões de APIs externas deverão ser controladas quando Provider oferecer versionamento.

---

# Provider Deprecation

Deprecation Notices deverão ser acompanhados.

---

# Dependency Updates

Dependency Update é mudança de Release.

---

# Automated Dependency Updates

Bots poderão abrir Pull Requests.

Isso não significa Auto-Merge irrestrito para Production.

---

# Major Dependency Upgrade

Mudanças Major deverão receber validação ampliada.

---

# Security Release

Security Fixes críticos poderão utilizar processo acelerado.

---

# Emergency Release

Fluxo:

```text
Critical Issue

↓

Minimal Fix

↓

Focused Review

↓

Required Tests

↓

Production

↓

Immediate Monitoring

↓

Follow-up Validation
```

Rapidez não significa ausência de controle.

---

# Hotfix

Hotfix deverá ser pequeno e focado.

---

# Hotfix Branch

Branch específica poderá existir quando necessária.

Não deverá se tornar fluxo paralelo permanente.

---

# Hotfix Back-Merge

Correção aplicada em Production deverá retornar à linha principal de desenvolvimento.

---

# Emergency Rollback

Quando risco de permanecer na versão atual for maior:

```text
Rollback First

↓

Investigate Second
```

poderá ser estratégia correta.

---

# Security Incident Release

Em incidente de segurança, mudanças poderão incluir:

- Credential Rotation.
- Access Revocation.
- Patch.
- Configuration Change.
- Infrastructure Change.

Tudo deverá permanecer rastreável.

---

# Release Notes

Releases oficiais deverão possuir Release Notes proporcionais à mudança.

---

# Release Notes Audience

Poderão existir:

```text
Internal Engineering Notes

User-facing Release Notes

Stakeholder Notes
```

---

# Internal Release Notes

Deverão registrar:

- Features.
- Fixes.
- Migrations.
- Breaking Changes.
- Operational Changes.
- Known Issues.

---

# User-Facing Release Notes

Não deverão expor:

- Security Weaknesses ainda exploráveis.
- Internal Architecture.
- Sensitive Technical Details.

---

# Changelog

O projeto poderá manter:

```text
CHANGELOG.md
```

quando útil.

---

# Changelog Entries

Exemplo:

```text
Added

Changed

Fixed

Deprecated

Removed

Security
```

---

# Release Documentation

Uma Release relevante deverá permitir reconstruir:

```text
What changed?

Who approved?

What was deployed?

When?

Where?

Which migration ran?

Which flags changed?

Was validation successful?

Was rollback required?
```

---

# Release Evidence

Evidências poderão incluir:

```text
CI Run

Test Results

Artifact Digest

Deployment ID

Migration Result

Smoke Test

Approval

Monitoring Snapshot
```

---

# Release Audit Trail

Histórico deverá ser preservado.

---

# Manual Production Change

Mudança manual emergencial deverá ser registrada posteriormente.

Não deverá permanecer invisível.

---

# Configuration Release

Mudança de Environment Variable ou configuração poderá alterar comportamento sem novo código.

Portanto:

```text
Configuration Change

=

Release-Relevant Change
```

---

# Secret Rotation Release

Secret Rotation deverá ser rastreável sem registrar o valor do Secret.

---

# Infrastructure Release

Mudança de infraestrutura poderá fazer parte da Release ou possuir Release própria.

---

# Release Calendar

Conforme a equipe crescer, Releases de alto impacto poderão utilizar calendário compartilhado.

---

# Change Collision

Evitar múltiplas mudanças críticas simultâneas quando isso dificultar diagnóstico.

---

# One Variable at a Time

Para mudanças de alto risco, reduzir mudanças simultâneas facilita:

```text
Observation

Diagnosis

Rollback
```

---

# Release Freeze

Períodos críticos poderão possuir Release Freeze.

Exemplos:

- Migração importante.
- Evento operacional relevante.
- Período de baixa disponibilidade da equipe.

---

# Freeze Exceptions

Security Fix crítico poderá justificar exceção.

---

# Communication

Releases que alterem workflows importantes deverão ser comunicadas às partes afetadas.

---

# Support Awareness

Support deverá conhecer mudanças que podem gerar dúvidas dos usuários.

---

# Deprecation

Funcionalidades e APIs não deverão desaparecer sem estratégia quando clientes ainda dependem delas.

---

# Deprecation Lifecycle

```text
Mark Deprecated

↓

Communicate

↓

Migration Window

↓

Measure Usage

↓

Remove
```

---

# API Deprecation

Telemetry deverá mostrar uso de versões antigas antes da remoção.

---

# Mobile Deprecation

Backend deverá observar adoção de versões antigas antes de retirar compatibilidade.

---

# Release Metrics

O processo poderá acompanhar:

```text
Deployment Frequency

Lead Time for Changes

Change Failure Rate

Mean Time to Recovery
```

---

# DORA Metrics

Essas métricas são frequentemente agrupadas como parte das métricas DORA.

O objetivo não deverá ser maximizar números artificialmente.

Elas deverão ajudar a compreender capacidade de entrega.

---

# Change Failure Rate

Pergunta:

```text
How many Releases
cause incidents, rollback
or urgent remediation?
```

---

# Release Reliability

Uma frequência alta com muitos Rollbacks não representa maturidade.

---

# Rollback Rate

Taxa de Rollback poderá indicar:

- Test Coverage insuficiente.
- Staging inadequado.
- Poor Release Validation.
- Excessive Change Size.

---

# Release Size

Mudanças menores geralmente são mais fáceis de:

- Review.
- Test.
- Deploy.
- Diagnose.
- Rollback.

---

# Batch Size

Preferir Releases menores e frequentes quando operacionalmente viável.

---

# Long-Lived Branches

Branches muito longas aumentam risco de integração.

---

# Trunk-Based Direction

O MedFlow deverá preferir fluxo próximo de Trunk-Based Development conforme maturidade permitir.

---

# Release Automation

Automação deverá reduzir tarefas repetitivas.

Possíveis automações:

```text
Version Generation

Changelog Generation

Git Tag

Artifact Build

Artifact Signing

Deployment

Smoke Tests

Release Creation

Deployment Marker
```

---

# Automation Safety

Automação deverá possuir Guardrails.

```text
Automation

≠

Uncontrolled Production Access
```

---

# Production Credentials

Release Pipeline deverá utilizar credenciais específicas e restritas.

---

# Release Permissions

Nem todo desenvolvedor deverá necessariamente possuir permissão direta para Production.

---

# Approval Policy

Permissões poderão variar por risco.

---

# Release Secrets

Release Metadata não deverá incluir valores secretos.

---

# Rollback Permissions

Pessoas responsáveis por Incident Response deverão possuir capacidade apropriada de Rollback.

---

# Release Monitoring

Toda Release deverá ser acompanhada por Monitoring.

---

# Post-Release Monitoring

Observar:

```text
Availability

Error Rate

Latency

Database

Queue

Workers

AI

External Providers

Client Errors
```

conforme componentes alterados.

---

# Release Baseline

Comparar:

```text
Before Release

vs

After Release
```

---

# Regression Detection

Mudanças estatisticamente ou operacionalmente relevantes deverão ser investigadas.

---

# Known Issues

Problemas conhecidos aceitos temporariamente deverão ser documentados.

---

# Release Acceptance

Release será considerada concluída quando:

- Deployment estiver completo.
- Health Checks estiverem saudáveis.
- Smoke Tests passarem.
- Critical Metrics permanecerem aceitáveis.
- Migrations concluírem.
- No Critical Alert estiver ativo.
- Release Metadata estiver registrada.

---

# Failed Acceptance

Se critérios falharem:

```text
Investigate

↓

Fix Forward

or

Rollback
```

---

# Release Ownership

Toda Release deverá possuir responsável identificável.

Isso não significa responsabilidade individual por todos os bugs.

Significa ownership operacional da mudança.

---

# Release Checklist — Geral

| Item | Obrigatório |
|------|-------------|
| PR aprovado | ✅ |
| CI aprovado | ✅ |
| Tests aprovados | ✅ |
| Artifact identificado | ✅ |
| Staging validado | ✅ |
| Database Migration revisada | Quando aplicável |
| Rollback Strategy definida | ✅ |
| Environment Changes documentadas | Quando aplicável |
| Feature Flags verificadas | Quando aplicável |
| AI Changes avaliadas | Quando aplicável |
| Security Impact avaliado | ✅ |
| Monitoring disponível | ✅ |
| Release Notes | ✅ |
| Production Approval | Conforme risco |

---

# Pre-Production Checklist

| Item | Obrigatório |
|------|-------------|
| Artifact imutável | ✅ |
| Version definida | ✅ |
| Git SHA conhecida | ✅ |
| Staging Healthy | ✅ |
| Smoke Tests | ✅ |
| Migrations compatíveis | ✅ |
| Backup validado para mudanças críticas | Quando aplicável |
| External Providers verificados | Quando aplicável |
| Team Availability | Conforme risco |
| Rollback disponível | ✅ |

---

# Post-Deployment Checklist

| Item | Obrigatório |
|------|-------------|
| Health Checks | ✅ |
| Version correta | ✅ |
| Smoke Tests | ✅ |
| Error Rate | ✅ |
| Latency | ✅ |
| Database Health | ✅ |
| Queue Health | Quando aplicável |
| Worker Health | Quando aplicável |
| AI Health | Quando aplicável |
| Frontend Errors | Quando aplicável |
| Critical Alerts | ✅ |
| Deployment Marker | ✅ |

---

# Mobile Release Checklist

| Item | Obrigatório |
|------|-------------|
| Version | ✅ |
| Build Number | ✅ |
| Signing | ✅ |
| Store Metadata | ✅ |
| Backend Compatibility | ✅ |
| Crash Monitoring | ✅ |
| Staged Rollout | Quando disponível |
| Minimum Version Policy | Quando aplicável |
| Kill Switch | Para funcionalidades críticas quando aplicável |

---

# Database Migration Checklist

| Item | Obrigatório |
|------|-------------|
| Migration versionada | ✅ |
| Tested in Staging | ✅ |
| Lock Impact avaliado | ✅ |
| Backward Compatibility | ✅ |
| Data Loss Risk avaliado | ✅ |
| Backup/Recovery Point | Conforme risco |
| Execution Time estimado | Conforme risco |
| Rollback/Forward Fix definido | ✅ |
| Monitoring | ✅ |

---

# AI Release Checklist

| Item | Obrigatório |
|------|-------------|
| Model identificado | ✅ |
| Prompt Version | Quando aplicável |
| Evaluation executada | ✅ |
| Structured Output validado | Quando aplicável |
| Safety Behavior validado | Quando aplicável |
| Latency comparada | ✅ |
| Cost comparado | ✅ |
| Rollback disponível | Quando possível |
| Monitoring | ✅ |

---

# Emergency Release Checklist

Mesmo em emergência:

| Item | Obrigatório |
|------|-------------|
| Problema identificado | ✅ |
| Fix mínimo | ✅ |
| Review proporcional | ✅ |
| Tests essenciais | ✅ |
| Rollback conhecido | ✅ |
| Deployment rastreável | ✅ |
| Monitoring imediato | ✅ |
| Follow-up obrigatório | ✅ |

---

# Anti-Padrões

São considerados Anti-Padrões:

- Deploy manual sem histórico.
- Production diretamente da máquina do desenvolvedor.
- Release sem Version.
- Release sem Git SHA identificável.
- Reutilizar mesma Version para códigos diferentes.
- Mover Git Tag oficial.
- Rebuildar Artifact para cada ambiente sem necessidade.
- Considerar Deployment concluído como Release automaticamente saudável.
- Não validar Production após Deployment.
- Não possuir Rollback Strategy.
- Executar Migration destrutiva sem análise.
- Executar `DROP` durante Rolling Deployment sem compatibilidade.
- Remover coluna utilizada pela versão anterior.
- Utilizar Production Database para testar Migration.
- Forçar Mobile Update sem necessidade.
- Assumir que todos os usuários atualizaram o Mobile.
- Alterar Prompt crítico sem versionamento.
- Alterar AI Model sem Evaluation.
- Utilizar Feature Flag como Authorization.
- Nunca remover Feature Flags antigas.
- Realizar mudanças críticas simultâneas sem necessidade.
- Fazer Hotfix e esquecer de integrá-lo à Branch principal.
- Não registrar configuração alterada.
- Não registrar Infrastructure Change.
- Não possuir Release Notes.
- Não monitorar após Release.
- Ignorar aumento de Error Rate após Deployment.
- Continuar rollout de Mobile com Crash Rate degradando.
- Não saber qual versão está em Production.
- Não saber qual Migration está aplicada.
- Não conseguir identificar qual Prompt Version produziu um comportamento.
- Utilizar Production Signing Credentials em workstation insegura.
- Não proteger Mobile Signing Keys.
- Fazer Emergency Release sem rastreabilidade.
- Confundir velocidade com ausência de processo.

---

# Decisões Arquiteturais

## ADR-309

Deployment e Release serão tratados como conceitos distintos no MedFlow.

---

## ADR-310

Toda Release oficial deverá possuir identidade única e rastreável.

---

## ADR-311

Production deverá permitir identificação do Git Commit e Artifact correspondentes à versão executada.

---

## ADR-312

Git Tags oficiais de Release serão consideradas imutáveis.

---

## ADR-313

O MedFlow deverá preferir estratégia Build Once, Promote Many sempre que a infraestrutura permitir.

---

## ADR-314

Artifacts de Release serão imutáveis após Build.

---

## ADR-315

Mudanças de maior risco deverão receber validação proporcionalmente maior antes de Production.

---

## ADR-316

Staging será etapa obrigatória para Releases relevantes salvo processo emergencial formal.

---

## ADR-317

Production Deployment deverá ser seguido por Health Validation, Smoke Tests e observação de Telemetry.

---

## ADR-318

Deployment somente será considerado Release saudável após critérios de aceitação pós-Deployment.

---

## ADR-319

Rollback Strategy deverá ser definida antes de Releases de risco elevado.

---

## ADR-320

Application Rollback deverá utilizar Artifact previamente conhecido sempre que disponível.

---

## ADR-321

Database Migrations incompatíveis deverão preferir padrões de Expand and Contract.

---

## ADR-322

Database Rollback destrutivo não será considerado mecanismo padrão; Forward Fix será preferido quando mais seguro.

---

## ADR-323

Database Migrations deverão ser compatíveis com coexistência temporária de versões durante Rolling Deployment quando aplicável.

---

## ADR-324

Mudanças destrutivas de Database deverão possuir análise explícita de Data Loss, Locking e Recovery.

---

## ADR-325

Backend deverá considerar compatibilidade com versões Mobile ainda suportadas.

---

## ADR-326

Forced Mobile Update somente será utilizado quando incompatibilidade, segurança ou integridade justificarem.

---

## ADR-327

Mobile Releases deverão possuir Version e Build Number identificáveis.

---

## ADR-328

Mobile Signing Credentials serão tratados como Secrets críticos.

---

## ADR-329

Staged Mobile Rollout será preferido para Releases de maior risco quando a Store suportar.

---

## ADR-330

Funcionalidades Mobile de maior risco poderão possuir Remote Kill Switch quando tecnicamente apropriado.

---

## ADR-331

Feature Flags não serão utilizadas como mecanismo de Authorization.

---

## ADR-332

Feature Flags temporárias deverão possuir estratégia de remoção após estabilização.

---

## ADR-333

Mudanças de AI Model, Prompt, Tools, Retrieval ou Guardrails serão consideradas Release-Relevant Changes.

---

## ADR-334

Prompts críticos de AI deverão possuir Versioning.

---

## ADR-335

Mudanças relevantes de AI deverão passar por Evaluation antes de Production.

---

## ADR-336

AI Release Validation deverá considerar Quality, Safety, Latency e Cost.

---

## ADR-337

AI Configuration deverá permitir identificação da combinação de Model e Prompt utilizada em operações relevantes.

---

## ADR-338

Security Fixes críticos poderão utilizar processo acelerado sem remover requisitos mínimos de Review, Testing, Traceability e Monitoring.

---

## ADR-339

Hotfixes aplicados em Production deverão ser reconciliados com a linha principal de desenvolvimento.

---

## ADR-340

Configuration Changes capazes de alterar comportamento de Production serão consideradas Release-Relevant Changes.

---

## ADR-341

Secret Rotations deverão ser rastreáveis sem registrar os valores dos Secrets.

---

## ADR-342

Infrastructure Changes relevantes deverão possuir histórico e correlação com Releases ou Deployments.

---

## ADR-343

Releases oficiais deverão possuir Release Notes proporcionais ao impacto da mudança.

---

## ADR-344

Production Deployments deverão gerar Deployment Markers correlacionáveis com Monitoring.

---

## ADR-345

Release Health deverá ser avaliada através de sinais de Application, Infrastructure e User Experience relevantes.

---

## ADR-346

Mudanças de alto risco deverão evitar múltiplas variáveis independentes simultaneamente quando isso prejudicar diagnóstico e Rollback.

---

## ADR-347

Deprecations deverão possuir período de migração quando clientes ativos dependerem da funcionalidade.

---

## ADR-348

O MedFlow deverá acompanhar progressivamente métricas de Delivery e Reliability para avaliar a qualidade do processo de Release.

---

## ADR-349

Release Automation será preferida para tarefas repetitivas, mantendo Guardrails para Production.

---

## ADR-350

Production Credentials utilizadas por Release Pipelines deverão seguir Least Privilege.

---

## ADR-351

Toda Release deverá possuir responsável operacional identificável.

---

## ADR-352

Emergency Releases deverão possuir Follow-up após estabilização para reconciliar documentação, código, configuração e infraestrutura.

---

# Arquitetura do Processo

```text
Developer

↓

Feature Branch

↓

Pull Request

↓

Code Review

↓

CI

↓

Merge

↓

Build

↓

Immutable Artifact

↓

Staging

↓

Automated Tests

↓

Manual Validation when required

↓

Release Candidate

↓

Production Deployment

↓

Health Checks

↓

Smoke Tests

↓

Monitoring

↓

Release Accepted
```

---

# Fluxo de Falha

```text
Production Deployment

↓

Regression Detected

↓

Assess Impact

↓

Can safely Fix Forward?
        │
    ┌───┴───┐
   Yes      No
    │        │
    ▼        ▼
Forward Fix Rollback
    │        │
    └───┬────┘
        ▼
Verify Recovery

↓

Incident Review when required
```

---

# Fluxo de Database Migration

```text
Schema N

↓

Expand Schema

↓

Deploy Compatible Application

↓

Migrate Data

↓

Switch Read/Write Path

↓

Observe

↓

Remove Legacy Dependency

↓

Contract Schema

↓

Schema N+1
```

---

# Fluxo de Mobile Release

```text
Source

↓

CI

↓

Build

↓

Automated Tests

↓

Signing

↓

Internal Testing

↓

Store Submission

↓

Store Review

↓

Approval

↓

Staged Rollout

↓

Crash / Error Monitoring

↓

Full Rollout
```

---

# Fluxo de AI Release

```text
Current AI Configuration

↓

Candidate Change

↓

Evaluation Dataset

↓

Quality Comparison

↓

Safety Validation

↓

Latency Comparison

↓

Cost Comparison

↓

Staging

↓

Limited Rollout

↓

Monitoring

↓

Full Release
```

---

# Fluxo de Emergency Release

```text
Critical Production Problem

↓

Incident Declared

↓

Minimal Change

↓

Focused Review

↓

Critical Tests

↓

Deploy

↓

Immediate Verification

↓

Monitor

↓

Stabilize

↓

Post-Incident Follow-up
```

---

# Release Traceability

O objetivo deverá ser permitir:

```text
User reports problem

↓

Timestamp

↓

Request / Error ID

↓

Service Version

↓

Release

↓

Deployment

↓

Artifact

↓

Git SHA

↓

Pull Request

↓

Code Change
```

E também:

```text
AI Result

↓

Model

↓

Prompt Version

↓

Release

↓

Evaluation
```

---

# Relação com os Demais Documentos

```text
01-Environments.md

defines

WHERE A RELEASE CAN RUN
```

```text
02-CI-CD.md

defines

HOW THE RELEASE IS BUILT AND DEPLOYED
```

```text
03-Docker.md

defines

HOW CONTAINER ARTIFACTS ARE PACKAGED
```

```text
04-Hosting.md

defines

WHERE PRODUCTION RUNS
```

```text
05-Monitoring.md

defines

HOW RELEASE HEALTH IS OBSERVED
```

```text
06-Release-Process.md

defines

WHEN A DEPLOYMENT BECOMES
AN ACCEPTED RELEASE
```

---

# Critérios de Maturidade

O processo de Release poderá ser considerado maduro quando:

- Toda Production Version for identificável.
- Git SHA estiver disponível.
- Artifacts forem imutáveis.
- Staging utilizar o mesmo Artifact de Production quando possível.
- CI for obrigatória.
- Smoke Tests forem automatizados.
- Database Migrations forem versionadas.
- Rollback estiver documentado.
- Mobile Compatibility estiver controlada.
- AI Changes forem versionadas e avaliadas.
- Feature Flags possuírem Lifecycle.
- Deployments aparecerem no Monitoring.
- Release Notes forem mantidas.
- Emergency Changes forem reconciliadas.
- Releases puderem ser auditadas historicamente.
- A equipe souber exatamente o que está em Production.

---

# Garantia de Continuidade

Um objetivo essencial desta documentação é permitir que futuras equipes operem o MedFlow sem depender de conhecimento tribal.

Daqui a anos, um novo desenvolvedor deverá conseguir responder:

```text
How do I create a Release?

What tests are required?

How do I deploy it?

How do I know it worked?

How do I roll it back?

How are Database Migrations handled?

How are Mobile Releases handled?

How are AI Changes released?

Where are Release Notes?

How do I identify what is currently in Production?
```

As respostas não deverão depender da memória de membros antigos da equipe.

---

# Referências Cruzadas

Este documento encerra:

```text
10-Deployment/
├── 01-Environments.md
├── 02-CI-CD.md
├── 03-Docker.md
├── 04-Hosting.md
├── 05-Monitoring.md
└── 06-Release-Process.md
```

Deverá ser interpretado em conjunto com as especificações de:

```text
Architecture

Backend

Database

Security

Audit

AI

Web

Mobile

Testing
```

---

# Considerações Finais

Release Management é a fronteira entre:

```text
Software that exists

and

Software that users depend on.
```

Antes de uma Release, uma mudança é código.

Depois de uma Release, ela passa a fazer parte do sistema que profissionais e pacientes poderão utilizar.

Por isso, a pergunta não deverá ser apenas:

> "O deploy terminou?"

A equipe deverá perguntar:

```text
Is the correct version running?

Is the application healthy?

Are critical workflows working?

Did the migration succeed?

Are error rates normal?

Did latency change?

Are Workers processing?

Are AI features behaving as expected?

Can we safely rollback?
```

O MedFlow deverá evitar dois extremos.

O primeiro:

```text
Every Release is scary.

Everything is manual.

Nobody knows what changed.

Nobody wants to deploy.
```

O segundo:

```text
Deploy everything immediately.

No review.

No validation.

No rollback.

Hope monitoring catches it.
```

A arquitetura correta deverá permitir:

```text
Small Changes

↓

Automated Validation

↓

Immutable Artifact

↓

Controlled Deployment

↓

Fast Verification

↓

Reliable Monitoring

↓

Safe Recovery
```

Com maturidade, Releases deverão se tornar eventos rotineiros.

Não porque tenham deixado de possuir risco, mas porque o sistema possui mecanismos para controlar esse risco.

O objetivo final é que qualquer Release possa responder claramente:

```text
WHAT changed?

WHY did it change?

WHO approved it?

WHICH code produced it?

WHICH artifact was deployed?

WHERE was it deployed?

WHEN was it released?

HOW was it validated?

HOW can it be rolled back?
```

Se essas perguntas puderem ser respondidas anos depois, o MedFlow possuirá rastreabilidade real.

Tecnologias irão mudar.

Cloud Providers poderão mudar.

Frameworks poderão mudar.

AI Models certamente mudarão.

Pessoas entrarão e sairão da equipe.

Mas o processo deverá continuar compreensível.

```text
Build once.

Validate thoroughly.

Release deliberately.

Observe continuously.

Rollback safely.

Document permanently.
```

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação da especificação oficial do processo de Release, Versioning, Rollback, Database Migration, Mobile Release, AI Release e Production Validation do MedFlow | Equipe MedFlow |