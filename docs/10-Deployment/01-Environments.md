# Ambientes de Execução (Environments)

| Campo | Valor |
|-------|--------|
| Documento | Environments |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Deployment |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

Este documento define a estratégia oficial de **Environments** utilizada pelo MedFlow.

Ambientes representam instâncias isoladas da plataforma destinadas a diferentes estágios do ciclo de desenvolvimento, validação e operação.

O objetivo não é apenas separar desenvolvimento de produção.

A estratégia de ambientes deverá garantir:

- Segurança.
- Isolamento.
- Reprodutibilidade.
- Previsibilidade.
- Rastreabilidade.
- Testabilidade.
- Controle de configuração.
- Proteção dos dados.
- Segurança de deploy.
- Recuperação operacional.
- Evolução sustentável da plataforma.

A regra fundamental é:

```text
Environment Isolation is Mandatory
```

Nenhum ambiente não produtivo deverá possuir capacidade implícita de modificar recursos de Production.

---

# Objetivos

A arquitetura de ambientes deverá permitir:

- Desenvolvimento local seguro.
- Integração contínua.
- Testes automatizados.
- Preview de alterações.
- Homologação.
- Validação antes de Production.
- Deploy reproduzível.
- Rollback.
- Investigação de incidentes.
- Testes de migrations.
- Validação de infraestrutura.
- Isolamento de dados.
- Gestão segura de Secrets.
- Feature Flags.
- Observabilidade por ambiente.
- Escalabilidade futura.

---

# Ambientes Oficiais

O MedFlow deverá trabalhar conceitualmente com:

```text
Local

Development

Preview

Staging

Production
```

Fluxo esperado:

```text
Developer Machine

↓

Local

↓

Development

↓

Preview / Pull Request

↓

Staging

↓

Production
```

Nem todo fluxo precisará atravessar manualmente todos os ambientes.

A pipeline definida em `02-CI-CD.md` determinará as regras de promoção.

---

# Environment Matrix

| Environment | Objetivo | Dados Reais | Persistência | Acesso |
|-------------|----------|-------------|--------------|--------|
| Local | Desenvolvimento individual | Não | Local | Developer |
| Development | Integração compartilhada | Não | Sim | Engineering |
| Preview | Validação de PR/Branch | Não | Temporária | Engineering / Reviewers |
| Staging | Homologação pré-produção | Não por padrão | Sim | Restrito |
| Production | Operação real | Sim | Sim | Altamente restrito |

---

# Regra de Dados

A seguinte política é obrigatória:

```text
Production Data

↓

Production Only
```

Dados pessoais reais não deverão ser copiados livremente para:

```text
Local

Development

Preview

Staging
```

---

# Local Environment

O ambiente `Local` representa a estação de desenvolvimento.

Seu objetivo é permitir:

- Desenvolvimento.
- Debug.
- Testes.
- Migrations locais.
- Experimentação.
- Desenvolvimento offline quando possível.
- Execução rápida da aplicação.

---

# Local Architecture

Conceitualmente:

```text
Developer Machine

├── Mobile App
├── Web App
├── Backend
├── Local Services
├── Database
└── Development Tools
```

Quando necessário:

```text
Docker

↓

Local Infrastructure
```

A estratégia específica de containers será definida em:

```text
03-Docker.md
```

---

# Local Data

Dados locais deverão ser:

- Sintéticos.
- Gerados.
- Seeded.
- Explicitamente aprovados.

Nunca utilizar dumps completos de Production como conveniência de desenvolvimento.

---

# Local Secrets

Secrets reais de Production nunca deverão existir em:

```text
.env

.env.local

Shell History

Source Code

Git

Documentation

Screenshots

Issue Tracker
```

O ambiente Local deverá utilizar credenciais próprias.

---

# Development Environment

`Development` representa o ambiente compartilhado de integração.

Seu objetivo é permitir:

- Integração entre módulos.
- Testes entre desenvolvedores.
- Validação inicial.
- Testes de Backend.
- Testes de Web.
- Testes de Mobile.
- Integrações externas não produtivas.

---

# Development Isolation

Development deverá possuir recursos próprios sempre que possível.

Exemplo:

```text
Development

├── Backend DEV
├── Database DEV
├── Storage DEV
├── Auth DEV
├── AI DEV
├── Cache DEV
└── External Sandbox Integrations
```

Evitar:

```text
Development Backend

↓

Production Database
```

Essa arquitetura é proibida.

---

# Development Stability

Development não possui o mesmo SLA de Production.

Poderá:

- Ser reiniciado.
- Receber migrations frequentes.
- Receber builds incompletos.
- Ser reconstruído.
- Possuir dados descartáveis.

Entretanto, alterações destrutivas deverão continuar sendo controladas.

---

# Preview Environment

O ambiente `Preview` representa uma instância temporária vinculada a uma alteração específica.

Normalmente:

```text
Pull Request

↓

CI

↓

Preview Deployment

↓

Review
```

---

# Objetivos de Preview

Preview poderá permitir:

- Revisão visual.
- QA.
- Product Review.
- Design Review.
- Testes de integração.
- Validação de feature.
- Demonstração interna.

---

# Preview Lifecycle

```text
Pull Request Created

↓

Preview Created

↓

Commits

↓

Preview Updated

↓

Pull Request Merged / Closed

↓

Preview Destroyed
```

Recursos temporários deverão ser removidos automaticamente quando possível.

---

# Preview Naming

Convenção recomendada:

```text
pr-123.medflow-preview.example
```

ou equivalente conforme a infraestrutura utilizada.

A convenção definitiva dependerá do Hosting Provider.

---

# Preview Data

Preview deverá utilizar:

- Dados sintéticos.
- Seeds.
- Dados temporários.
- Serviços Sandbox.

Não utilizar dados pessoais reais.

---

# Preview Security

Embora temporário, Preview continua sendo infraestrutura acessível.

Deverá possuir:

- HTTPS.
- Secrets isolados.
- Authentication quando necessário.
- Rate Limiting quando aplicável.
- Logs.
- Expiração.
- Proteção contra indexação pública quando necessário.

---

# Staging Environment

`Staging` representa o ambiente de homologação mais próximo de Production.

Seu objetivo é responder:

> Se esta versão for para Production, ela funcionará como esperado?

---

# Staging Parity

Staging deverá possuir alta similaridade arquitetural com Production.

```text
Staging ≈ Production
```

Isso inclui, quando economicamente e tecnicamente razoável:

- Runtime.
- Database Engine.
- Infrastructure Configuration.
- Container Images.
- Network Architecture.
- Authentication.
- Storage.
- Migrations.
- Environment Variables structure.
- Monitoring.
- Deployment Process.

---

# Paridade Não Significa Igualdade de Capacidade

Staging poderá possuir:

- Menos CPU.
- Menos memória.
- Menos replicas.
- Menor storage.
- Limites inferiores.

Desde que essas diferenças sejam conhecidas e não invalidem os testes executados.

---

# Staging Data

Por padrão:

```text
Staging Data = Synthetic / Test Data
```

Dados reais somente poderão ser utilizados quando existir:

- Necessidade comprovada.
- Processo aprovado.
- Minimização.
- Anonimização ou pseudonimização apropriada.
- Controle de acesso.
- Política de retenção.
- Avaliação de privacidade.

---

# Staging Integrations

Integrações externas deverão utilizar ambientes Sandbox quando disponíveis.

Exemplo conceitual:

```text
Staging

↓

Payment Sandbox

Email Sandbox

Notification Sandbox

AI Test Configuration
```

Evitar operações reais acidentais.

---

# Production Environment

`Production` representa o ambiente real do MedFlow.

Ele processará:

- Usuários reais.
- Clínicas reais.
- Pacientes reais.
- Dados reais.
- Operações reais.
- Informações clínicas.
- Informações financeiras.
- AI workloads reais.

Por isso:

```text
Production is Protected
```

---

# Production Principles

Production deverá priorizar:

```text
Availability

Security

Integrity

Confidentiality

Auditability

Recoverability
```

---

# Production Access

Acesso deverá seguir:

```text
Default Deny

↓

Explicit Authorization

↓

Least Privilege

↓

Audit
```

A existência de acesso técnico não significa autorização para consultar dados clínicos.

---

# Direct Production Access

Acesso direto deverá ser excepcional.

Evitar:

```text
Developer

↓

Production Database
```

Preferir:

```text
Approved Operational Tool

↓

Controlled Operation

↓

Audit
```

Quando acesso direto for inevitável:

- Deverá existir justificativa.
- O acesso deverá ser temporário quando possível.
- Least Privilege deverá ser aplicado.
- A atividade deverá ser auditável.
- Credenciais pessoais deverão ser utilizadas.
- Credenciais compartilhadas deverão ser evitadas.

---

# Break-Glass Access

Situações emergenciais poderão exigir acesso extraordinário.

Fluxo conceitual:

```text
Incident

↓

Break-Glass Request

↓

Strong Authentication

↓

Temporary Elevated Access

↓

Operational Action

↓

Audit

↓

Automatic Expiration

↓

Post-Incident Review
```

---

# Environment Identification

Toda aplicação deverá saber explicitamente em qual ambiente está sendo executada.

Exemplo:

```text
APP_ENV=local

APP_ENV=development

APP_ENV=preview

APP_ENV=staging

APP_ENV=production
```

---

# APP_ENV vs NODE_ENV

`APP_ENV` e `NODE_ENV` representam conceitos diferentes.

Exemplo:

```text
NODE_ENV=production
APP_ENV=staging
```

é válido.

`NODE_ENV` representa comportamento do runtime/build.

`APP_ENV` representa o ambiente operacional do MedFlow.

---

# Environment Configuration

Configuração deverá seguir:

```text
Code

+

Environment Configuration

=

Running Application
```

O mesmo código deverá poder operar em ambientes diferentes através de configuração.

---

# Environment Variables

Environment Variables poderão configurar:

- Database.
- Authentication.
- Storage.
- APIs.
- AI Providers.
- Logging.
- Observability.
- Feature Flags.
- External Integrations.
- Public URLs.
- Runtime Configuration.

---

# Naming Convention

Variáveis deverão possuir nomes claros.

Exemplo:

```text
DATABASE_URL

SUPABASE_URL

SUPABASE_ANON_KEY

AI_PROVIDER

LOG_LEVEL

APP_ENV

PUBLIC_WEB_URL

PUBLIC_API_URL
```

Nomes reais deverão refletir a implementação vigente.

---

# Public vs Secret Configuration

Configurações deverão ser classificadas.

## Public

Podem ser expostas ao cliente quando explicitamente projetadas para isso.

Exemplo:

```text
PUBLIC_API_URL
```

## Secret

Nunca deverão ser enviadas ao cliente.

Exemplo:

```text
DATABASE_PASSWORD

SERVICE_ROLE_KEY

AI_PROVIDER_SECRET

WEBHOOK_SECRET
```

---

# Mobile Environment Variables

Aplicações Mobile exigem atenção especial.

Regra:

```text
Anything shipped in the Mobile App
can eventually be inspected.
```

Portanto, aplicativos Mobile não deverão possuir Secrets de Backend.

---

# Web Environment Variables

Variáveis incluídas no bundle do navegador também devem ser consideradas públicas.

Prefixos como:

```text
PUBLIC_

VITE_

NEXT_PUBLIC_
```

não transformam informação em segura.

Eles explicitamente indicam que ela poderá chegar ao cliente.

---

# Backend Secrets

Secrets deverão permanecer exclusivamente em infraestrutura controlada.

```text
Client

✘

Backend

✓
```

---

# Secret Management

Secrets deverão ser armazenados através de mecanismo seguro fornecido pela infraestrutura ou Secret Manager dedicado.

Nunca:

```text
Hardcoded Secret

↓

Git Repository
```

---

# Secret Lifecycle

Todo Secret deverá possuir ciclo de vida.

```text
Created

↓

Distributed

↓

Used

↓

Rotated

↓

Revoked
```

---

# Secret Rotation

Secrets críticos deverão permitir rotação.

Exemplos:

- Database credentials.
- API keys.
- Signing secrets.
- Provider credentials.
- Service credentials.

A arquitetura deverá evitar dependências que tornem rotação inviável.

---

# Secret Scope

Preferir:

```text
One Environment

↓

One Credential
```

Evitar:

```text
Same Secret

↓

Development

↓

Staging

↓

Production
```

---

# Environment Validation

A aplicação deverá validar configuração durante startup.

Exemplo:

```text
Application Start

↓

Load Environment

↓

Schema Validation

↓

Valid?

├── Yes → Start
└── No  → Fail Fast
```

---

# Configuration Schema

Configurações deverão possuir schema.

Exemplo conceitual:

```text
APP_ENV

DATABASE_URL

AUTH_URL

LOG_LEVEL
```

com:

```text
Required

Optional

Type

Allowed Values
```

---

# Fail Fast

Configuração obrigatória ausente deverá causar falha durante inicialização.

Preferir:

```text
Startup Failure:
DATABASE_URL missing
```

a:

```text
Runtime Failure
3 hours later
```

---

# Secret Leakage Prevention

Pipelines e aplicações deverão evitar exibir Secrets em:

- Logs.
- Errors.
- Build Output.
- CI Output.
- Telemetry.
- Screenshots.
- Crash Reports.

---

# Git Policy

Arquivos contendo Secrets não deverão ser versionados.

Exemplo:

```text
.env

.env.local

.env.production
```

deverão ser ignorados quando contiverem credenciais.

---

# Environment Example

O repositório poderá conter:

```text
.env.example
```

Esse arquivo deverá possuir apenas:

- Nomes.
- Exemplos não sensíveis.
- Comentários.

Nunca credenciais reais.

---

# Environment Documentation

Toda variável obrigatória deverá ser documentada.

Exemplo:

| Variable | Required | Secret | Description |
|----------|----------|--------|-------------|
| APP_ENV | Sim | Não | Ambiente atual |
| DATABASE_URL | Sim | Sim | Conexão com Database |
| LOG_LEVEL | Sim | Não | Nível de logging |

A tabela real deverá acompanhar a implementação.

---

# Infrastructure Isolation

Ambientes deverão ser isolados em múltiplas camadas.

```text
Environment

├── Compute
├── Database
├── Storage
├── Secrets
├── Network
├── Logs
├── Cache
└── External Integrations
```

---

# Database Isolation

Cada ambiente persistente deverá possuir Database independente.

```text
Development DB

≠

Staging DB

≠

Production DB
```

---

# Storage Isolation

Uploads também deverão ser separados.

```text
development-storage

staging-storage

production-storage
```

ou mecanismo equivalente.

---

# Authentication Isolation

Quando suportado, ambientes deverão utilizar projetos/tenants de autenticação separados.

Isso reduz risco de:

- Login cruzado.
- Tokens válidos em ambiente incorreto.
- Dados compartilhados.
- Configuração acidental.

---

# Token Isolation

Tokens emitidos por um ambiente não deverão ser aceitos automaticamente em outro.

```text
Staging Token

✘

Production
```

---

# Cache Isolation

Chaves deverão incluir namespace do ambiente ou utilizar infraestrutura separada.

Exemplo:

```text
medflow:staging:...

medflow:production:...
```

Preferencialmente com instâncias separadas quando necessário.

---

# Queue Isolation

Filas deverão ser separadas.

```text
Development Queue

Staging Queue

Production Queue
```

Uma mensagem de Staging jamais deverá executar Worker de Production.

---

# Event Isolation

Eventos também deverão possuir escopo de ambiente.

```text
AppointmentCreated@staging

≠

AppointmentCreated@production
```

---

# Webhook Isolation

Webhooks representam risco importante.

Cada ambiente deverá utilizar:

- Endpoint próprio.
- Secret próprio.
- Provider configuration própria.

Nunca apontar Sandbox para webhook de Production.

---

# Email Safety

Ambientes não produtivos deverão evitar envio acidental de emails para usuários reais.

Estratégias:

- Email Sandbox.
- Recipient Allowlist.
- Address Override.
- Disabled External Delivery.

---

# Notification Safety

O mesmo princípio se aplica a:

- SMS.
- Push Notifications.
- WhatsApp.
- Outros canais.

---

# Payment Safety

Ambientes não produtivos deverão utilizar Sandbox de pagamentos quando disponível.

Regra:

```text
Non-Production

↓

No Real Charge
```

---

# AI Environment Isolation

AI Providers deverão possuir configuração por ambiente.

Exemplo:

```text
Development

↓

Low-cost / Test Configuration
```

```text
Production

↓

Approved Production Configuration
```

---

# AI Test Data

Prompts de desenvolvimento e avaliação não deverão utilizar dados clínicos reais sem processo explicitamente autorizado.

---

# AI Usage Isolation

Métricas de consumo deverão identificar ambiente.

```text
AIUsage

↓

environment
```

Isso evita misturar custos de Development com Production.

---

# Feature Flags

Feature Flags permitem separar:

```text
Deployment

≠

Release
```

Código poderá estar em Production sem estar disponível aos usuários.

---

# Feature Flag Scope

Flags poderão considerar:

- Environment.
- Tenant.
- User.
- Role.
- Percentage.
- Plan.
- Beta Group.

---

# Feature Flag Example

```text
ai_clinical_summary

development = enabled

staging = enabled

production = disabled
```

---

# Feature Flag Safety

Feature Flags não deverão substituir autorização.

```text
Feature Flag

≠

Permission
```

Flag controla disponibilidade.

Permission controla autorização.

---

# Kill Switch

Funcionalidades críticas poderão possuir Flag operacional para desativação rápida.

Exemplo:

```text
AI_SUMMARIES_ENABLED=false
```

Isso deverá ser utilizado em conjunto com mecanismos formais de Incident Response.

---

# Database Migrations

Migrations deverão seguir fluxo controlado.

```text
Local

↓

Development

↓

Staging

↓

Production
```

---

# Migration Testing

Toda migration relevante deverá ser testada antes de Production.

Verificar:

- Forward migration.
- Compatibility.
- Performance.
- Locks.
- Data transformation.
- Rollback strategy.

---

# Production Migration

Migrations de Production não deverão depender de execução manual improvisada em workstation.

Preferir:

```text
CI/CD

↓

Controlled Migration Job

↓

Production Database
```

---

# Backward Compatibility

Durante deploys, versões diferentes poderão coexistir temporariamente.

Portanto, migrations deverão preferir:

```text
Expand

↓

Deploy

↓

Migrate

↓

Contract
```

em vez de alterações destrutivas imediatas.

---

# Expand and Contract

Exemplo:

```text
1. Add new column

2. Deploy code supporting both columns

3. Migrate data

4. Switch reads/writes

5. Validate

6. Remove old column later
```

Isso reduz risco de downtime.

---

# Destructive Migrations

Operações como:

```text
DROP TABLE

DROP COLUMN

TRUNCATE

Mass UPDATE

Mass DELETE
```

deverão possuir revisão adicional antes de Production.

---

# Seed Data

Seeds deverão existir para facilitar:

- Local development.
- Automated tests.
- Preview.
- Staging.

---

# Seed Requirements

Seeds deverão ser:

- Determinísticos quando possível.
- Reexecutáveis quando apropriado.
- Não sensíveis.
- Documentados.
- Compatíveis com o schema atual.

---

# Synthetic Personas

O MedFlow poderá manter personas fictícias.

Exemplo:

```text
Dr. Teste

Paciente Exemplo

Clínica Sandbox
```

Elas poderão facilitar demonstrações e testes reproduzíveis.

---

# Production Seeds

Seeds de desenvolvimento não deverão executar automaticamente em Production.

---

# Environment Parity

O princípio de **Environment Parity** deverá reduzir diferenças desnecessárias entre ambientes.

Preferir:

```text
Same Artifact

Different Configuration
```

---

# Build Once, Deploy Many

Quando a stack permitir:

```text
Source

↓

Build

↓

Artifact

├── Staging
└── Production
```

Idealmente, o mesmo artifact validado em Staging deverá ser promovido para Production.

Isso reduz diferenças introduzidas por builds separados.

---

# Artifact Identity

Cada artifact deverá possuir identificação.

Exemplo:

```text
Git SHA

Release Version

Build ID
```

---

# Version Exposure

Sistemas internos de observabilidade deverão conseguir identificar:

```text
Environment

Version

Commit

Build

Deployment Time
```

Isso facilita incidentes.

---

# Logging

Logs deverão possuir ambiente explícito.

Exemplo:

```json
{
  "environment": "production",
  "service": "api",
  "version": "1.8.0"
}
```

---

# Log Separation

Logs de ambientes diferentes não deverão ser indistinguíveis.

Dashboards deverão permitir filtros por:

```text
environment

service

version

tenant
```

com cuidado para não expor informações sensíveis.

---

# Monitoring

Cada ambiente poderá possuir diferentes níveis de Monitoring.

```text
Local
    Minimal

Development
    Basic

Staging
    Production-like

Production
    Full
```

Detalhes serão definidos em:

```text
05-Monitoring.md
```

---

# Health Checks

Serviços deverão fornecer Health Checks quando aplicável.

Exemplo:

```text
/health
```

O endpoint não deverá expor:

- Secrets.
- Database credentials.
- Internal topology.
- Sensitive configuration.

---

# Readiness

Quando aplicável, distinguir:

```text
Liveness

Readiness
```

`Liveness`:

> O processo está vivo?

`Readiness`:

> O processo está pronto para receber tráfego?

---

# Deployment Promotion

Código não deverá chegar a Production diretamente da workstation de um desenvolvedor.

Fluxo esperado:

```text
Git

↓

Pull Request

↓

CI

↓

Review

↓

Staging

↓

Validation

↓

Production
```

Detalhes em:

```text
02-CI-CD.md
```

e:

```text
06-Release-Process.md
```

---

# Production Protection

Production deverá possuir proteções adicionais.

Exemplos:

- Protected Branch.
- Required Reviews.
- CI Required.
- Environment Protection.
- Restricted Secrets.
- Deployment Audit.
- Approval Gate quando apropriado.

---

# Manual Deployment

Deploy manual poderá existir como mecanismo emergencial, mas não deverá ser o fluxo padrão.

Se utilizado:

- Deve ser documentado.
- Deve ser auditável.
- Deve utilizar artifact identificado.
- Deve possuir rollback.

---

# Rollback

Todo ambiente crítico deverá possuir estratégia de rollback.

```text
Deployment

↓

Failure

↓

Rollback

↓

Previous Stable Version
```

---

# Rollback ≠ Database Rollback

Código e Database possuem ciclos diferentes.

Uma migration destrutiva pode tornar rollback de código impossível.

Por isso, Database Compatibility deverá ser considerada antes de cada release.

---

# Backup

Production deverá possuir estratégia de backup para dados persistentes críticos.

Backup deverá considerar:

- Database.
- Storage.
- Configuração crítica quando aplicável.

---

# Backup Is Not Recovery

A existência de backup não significa que recuperação funciona.

Regra:

```text
Untested Backup

≈

Unknown Recovery
```

Restores deverão ser testados periodicamente.

---

# Recovery Objectives

Quando o MedFlow atingir maturidade operacional suficiente, deverão ser definidos:

```text
RPO — Recovery Point Objective

RTO — Recovery Time Objective
```

Os valores deverão refletir necessidades reais do negócio e risco dos dados.

Não deverão ser inventados apenas para preencher documentação.

---

# Disaster Recovery

A estratégia futura poderá incluir:

```text
Primary Infrastructure

↓

Failure

↓

Recovery Procedure

↓

Restored Services

↓

Validation

↓

Traffic Recovery
```

Detalhes deverão evoluir conforme Hosting e escala.

---

# Environment Disaster

A perda de Development não deverá afetar Production.

A perda de Staging não deverá afetar Production.

Isso reforça a necessidade de isolamento.

---

# Access Control

Acesso aos ambientes deverá seguir Role-Based Access Control quando suportado.

Exemplo conceitual:

| Role | Development | Staging | Production |
|------|-------------|---------|------------|
| Developer | Write | Limited | No direct access |
| Senior Engineer | Write | Write | Controlled |
| DevOps/SRE | Write | Write | Controlled |
| QA | Use | Use | Read-limited |
| Support | Limited | Limited | Controlled |

A matriz real deverá acompanhar a estrutura da equipe.

---

# Offboarding

Quando um membro deixar a equipe:

```text
User Removed

↓

Repository Access Revoked

↓

Cloud Access Revoked

↓

Secrets Rotated when necessary

↓

Sessions Revoked

↓

Audit
```

---

# Shared Accounts

Contas compartilhadas deverão ser evitadas.

Preferir:

```text
Individual Identity

↓

Role

↓

Audit
```

Isso permite atribuição correta das ações.

---

# MFA

Acesso administrativo a Production deverá utilizar MFA quando suportado.

Para sistemas críticos, MFA deverá ser considerado requisito padrão.

---

# Environment Drift

Drift ocorre quando um ambiente diverge silenciosamente da configuração declarada.

Exemplo:

```text
Production manually changed

↓

Infrastructure differs from documentation
```

---

# Drift Prevention

Preferir:

- Infrastructure as Code.
- Automated Deployments.
- Versioned Configuration.
- Automated Validation.
- Controlled Changes.

---

# Infrastructure as Code

Conforme a infraestrutura crescer, recursos deverão ser progressivamente definidos como código.

Exemplo conceitual:

```text
infrastructure/

├── development/
├── staging/
├── production/
└── modules/
```

A tecnologia concreta será escolhida conforme necessidade.

---

# Configuration Drift

Alterações manuais em dashboards de providers deverão ser documentadas e, quando possível, posteriormente codificadas.

---

# Naming Conventions

Recursos deverão incluir identificação de ambiente.

Exemplo:

```text
medflow-api-development

medflow-api-staging

medflow-api-production
```

---

# Resource Tagging

Quando suportado:

```text
project=medflow

environment=production

service=api

owner=platform
```

Tags facilitam:

- Custos.
- Inventário.
- Segurança.
- Operações.

---

# Cost Attribution

Custos deverão poder ser separados por ambiente.

```text
Development Cost

Staging Cost

Production Cost
```

Isso será especialmente importante para:

- Compute.
- Database.
- Storage.
- AI.
- Observability.
- External APIs.

---

# Production Cost Protection

Ambientes não produtivos deverão possuir limites quando possível.

Isso evita:

```text
Development Bug

↓

Infinite Loop

↓

External API

↓

Unexpected Cost
```

---

# Rate Limits por Ambiente

Development poderá possuir limites menores.

Production deverá utilizar limites alinhados ao uso real e proteção operacional.

---

# External API Quotas

Quotas deverão ser monitoradas separadamente quando possível.

---

# Time Configuration

Servidores deverão preferencialmente operar internamente em:

```text
UTC
```

Conversão para timezone do usuário deverá ocorrer na camada apropriada.

---

# Locale

Locale de infraestrutura não deverá determinar regras de negócio.

Datas, números e formatos exibidos deverão seguir contexto do usuário e regras de internacionalização.

---

# Clock Synchronization

Serviços distribuídos dependem de relógios consistentes.

Infraestrutura deverá utilizar mecanismos confiáveis de sincronização fornecidos pela plataforma.

---

# Environment URLs

URLs deverão possuir convenção previsível.

Exemplo conceitual:

```text
Development
dev.medflow.example

Staging
staging.medflow.example

Production
app.medflow.example
```

Os domínios reais deverão ser definidos em `04-Hosting.md`.

---

# CORS

CORS deverá ser configurado por ambiente.

Nunca utilizar em Production como solução genérica:

```text
Access-Control-Allow-Origin: *
```

quando recursos autenticados exigirem política restritiva.

---

# Cookie Isolation

Cookies deverão considerar:

- Domain.
- Secure.
- HttpOnly.
- SameSite.
- Environment.

Cookies de Staging não deverão interferir em Production.

---

# Session Isolation

Sessões deverão permanecer isoladas entre ambientes.

---

# OAuth

OAuth providers deverão utilizar Redirect URLs específicas por ambiente.

Exemplo:

```text
Development Callback

Staging Callback

Production Callback
```

---

# Mobile Builds

Aplicações Mobile deverão possuir perfis de build.

Exemplo:

```text
development

preview

production
```

Cada build deverá apontar para APIs apropriadas.

---

# Mobile Production Protection

Build distribuído aos usuários não deverá possuir mecanismo oculto que permita alternar livremente para Backend interno ou Development.

---

# Mobile Version Compatibility

Backend deverá considerar que versões antigas do Mobile podem permanecer instaladas.

Portanto:

```text
Backend Deployment

↓

Backward Compatibility Consideration
```

será especialmente importante.

---

# Web Deployment

Web poderá receber atualizações imediatamente.

Entretanto, assets antigos podem permanecer em:

- Browser Cache.
- CDN.
- Open Tabs.

APIs deverão considerar períodos curtos de coexistência entre versões.

---

# API Compatibility

Mudanças incompatíveis deverão utilizar:

- Versionamento.
- Migration Strategy.
- Compatibility Window.

conforme definido pela arquitetura de Backend.

---

# Scheduled Jobs

Cron Jobs deverão possuir escopo de ambiente.

Evitar que:

```text
Staging Scheduler

↓

Production Resource
```

---

# Workers

Workers deverão validar:

```text
APP_ENV
```

e consumir apenas recursos correspondentes.

---

# Background Jobs

Jobs deverão registrar:

- Environment.
- Version.
- Job ID.
- Execution status.

---

# Search Indexes

Caso existam mecanismos de Search:

```text
Development Index

Staging Index

Production Index
```

deverão permanecer separados.

---

# Vector Databases

O mesmo princípio vale para AI/RAG:

```text
Development Embeddings

≠

Production Embeddings
```

---

# Analytics

Eventos de Analytics deverão incluir ambiente.

Ambientes não produtivos deverão ser filtráveis para não contaminar métricas reais de produto.

---

# Telemetry

Telemetry deverá diferenciar:

```text
Synthetic Traffic

Internal Traffic

Production Traffic
```

quando necessário.

---

# Test Accounts

Production poderá possuir contas controladas para Smoke Tests somente quando explicitamente planejado.

Essas contas deverão:

- Ser identificáveis.
- Não representar pessoas reais.
- Possuir escopo mínimo.
- Ser excluídas de métricas quando apropriado.

---

# Smoke Tests

Após deploy:

```text
Deployment

↓

Health Check

↓

Smoke Tests

↓

Monitoring

↓

Release Healthy
```

---

# Production Verification

Smoke Tests não deverão executar operações destrutivas ou gerar dados clínicos reais indevidos.

---

# Environment Status

A plataforma poderá futuramente possuir Status Dashboard interno:

```text
Production

API       Healthy

Database  Healthy

Auth      Healthy

Storage   Healthy

AI        Degraded
```

---

# Incident Context

Todo incidente deverá registrar ambiente afetado.

Exemplo:

```text
Incident ID

Environment

Service

Version

Started At

Impact

Resolution
```

---

# Environment Change Log

Alterações significativas de infraestrutura deverão ser rastreáveis através de:

- Git.
- Deployment History.
- Audit Logs.
- ADR.
- Change Management.

---

# Environment Lifecycle

Um ambiente poderá seguir:

```text
Requested

↓

Provisioned

↓

Configured

↓

Validated

↓

Active

↓

Deprecated

↓

Destroyed
```

---

# Environment Destruction

Antes de remover ambiente persistente:

- Confirmar Environment ID.
- Confirmar ausência de Production Resources.
- Confirmar Backup quando necessário.
- Revogar Secrets.
- Remover DNS.
- Remover integrations.
- Registrar operação.

---

# Destructive Operation Protection

Operações destrutivas deverão possuir proteções adicionais.

Exemplo:

```text
if APP_ENV === "production":
    requireExplicitConfirmation()
```

Entretanto, verificações em código não substituem controles de infraestrutura.

---

# Production Safeguards

Ferramentas administrativas poderão exigir confirmação textual.

Exemplo:

```text
Type:

DELETE PRODUCTION RESOURCE
```

para ações extremamente sensíveis.

---

# Environment Banner

Interfaces administrativas de ambientes não produtivos poderão apresentar identificação visual:

```text
STAGING

DEVELOPMENT
```

Isso reduz ações realizadas no ambiente errado.

---

# Production Visual Safety

A distinção visual não deverá comprometer Design System público, mas ferramentas internas poderão utilizar indicadores claros.

---

# Compliance

Ambientes que processarem dados pessoais deverão respeitar os mesmos princípios fundamentais de:

- Privacidade.
- Segurança.
- Auditabilidade.
- Minimização.
- Controle de acesso.

Ambiente de teste não é justificativa para ignorar segurança.

---

# LGPD

A estratégia de ambientes deverá apoiar requisitos relacionados à proteção de dados pessoais.

Especial atenção para:

- Cópias de Production.
- Dumps.
- Backups.
- Logs.
- Analytics.
- AI datasets.
- Test environments.

---

# Data Classification

Antes de mover dados entre ambientes, sua classificação deverá ser conhecida.

Exemplo:

```text
Public

Internal

Confidential

Sensitive

Clinical
```

Dados `Sensitive` e `Clinical` deverão possuir controles superiores.

---

# Data Export

Exportações de Production para investigação deverão ser minimizadas.

Preferir:

```text
Query

↓

Minimum Required Result

↓

Secure Investigation
```

em vez de:

```text
Full Database Dump
```

---

# Local Production Debugging

Dados reais não deverão ser baixados para notebooks pessoais para debug como prática normal.

Quando investigação exigir dados reais, deverá utilizar ambiente controlado.

---

# Production Debugging

Preferir:

- Structured Logs.
- Metrics.
- Traces.
- Correlation IDs.
- Audit Events.

em vez de acesso indiscriminado ao banco.

---

# Correlation IDs

Requests deverão possuir identificador quando aplicável.

```text
Request

↓

API

↓

Service

↓

Database / Tool

↓

Logs
```

permitindo investigação sem depender de dados pessoais.

---

# Environment Readiness Checklist

Antes de considerar um novo ambiente operacional:

| Item | Obrigatório |
|------|-------------|
| APP_ENV definido | ✅ |
| Database isolado | ✅ |
| Storage isolado | ✅ |
| Secrets próprios | ✅ |
| Authentication configurada | ✅ |
| URLs definidas | ✅ |
| HTTPS | ✅ |
| CORS configurado | ✅ |
| Logs configurados | ✅ |
| Monitoring adequado | ✅ |
| Backup quando necessário | ✅ |
| Access Control | ✅ |
| External Integrations isoladas | ✅ |
| AI configuration isolada | ✅ |
| Payment Sandbox em non-production | ✅ |
| Email safety | ✅ |
| Migration strategy | ✅ |
| Deployment strategy | ✅ |
| Documentation | ✅ |

---

# Production Readiness Checklist

Antes do primeiro Production Launch:

| Item | Obrigatório |
|------|-------------|
| Production isolado | ✅ |
| Production Database | ✅ |
| Production Storage | ✅ |
| Secrets protegidos | ✅ |
| MFA administrativo | ✅ |
| Least Privilege | ✅ |
| Backup configurado | ✅ |
| Restore testado | ✅ |
| Monitoring | ✅ |
| Alerting | ✅ |
| Audit | ✅ |
| HTTPS | ✅ |
| Domain | ✅ |
| Production Auth | ✅ |
| Production integrations | ✅ |
| Rate Limiting | ✅ |
| Error Tracking | ✅ |
| Rollback Strategy | ✅ |
| Migration Strategy | ✅ |
| Health Checks | ✅ |
| Smoke Tests | ✅ |
| Incident Procedure | ✅ |
| Security Review | ✅ |
| Release Process | ✅ |

---

# Anti-Padrões

São considerados Anti-Padrões:

- Development utilizando Production Database.
- Staging utilizando Production Storage.
- Mesmo Secret em todos os ambientes.
- Secrets no Git.
- Secrets em Mobile.
- Secrets no bundle Web.
- Production Data em notebooks pessoais.
- Dumps completos de Production para desenvolvimento.
- Emails reais enviados por Staging.
- Cobranças reais executadas em Development.
- Webhooks Sandbox apontando para Production.
- Tokens compartilhados entre ambientes.
- Deploy de Production diretamente da workstation.
- Migration destrutiva não testada.
- Seed de desenvolvimento executado em Production.
- Logs sem identificação de ambiente.
- Preview Environment permanente sem necessidade.
- Alterações manuais de infraestrutura sem rastreabilidade.
- Feature Flag utilizada como autorização.
- Production sem Backup.
- Backup nunca testado.
- Shared Production Account.
- Debug baseado em acesso indiscriminado a dados clínicos.
- Dependência da AI Platform para acesso às funções essenciais.

---

# Decisões Arquiteturais

## ADR-128

O MedFlow adotará ambientes logicamente isolados para Local, Development, Preview, Staging e Production.

---

## ADR-129

Production Data permanecerá em Production por padrão e não será copiado livremente para ambientes inferiores.

---

## ADR-130

Development, Staging e Production deverão possuir Databases independentes.

---

## ADR-131

Secrets deverão possuir escopo por ambiente e não poderão ser armazenados no repositório.

---

## ADR-132

Aplicações Web e Mobile não poderão conter Secrets de Backend.

---

## ADR-133

A aplicação utilizará `APP_ENV` para identificar o ambiente operacional independentemente de `NODE_ENV`.

---

## ADR-134

Configurações obrigatórias deverão ser validadas durante startup utilizando estratégia Fail Fast.

---

## ADR-135

Staging deverá manter paridade arquitetural razoável com Production sem exigir igualdade de capacidade computacional.

---

## ADR-136

Preview Environments deverão ser temporários e vinculados ao ciclo de vida da alteração que os originou.

---

## ADR-137

Ambientes não produtivos utilizarão integrações Sandbox sempre que disponíveis para operações que possam gerar efeitos reais.

---

## ADR-138

Feature Flags não substituirão mecanismos de autorização.

---

## ADR-139

Migrations de Production deverão utilizar processo controlado e testado antes da execução.

---

## ADR-140

Migrations deverão priorizar compatibilidade progressiva através de estratégias como Expand and Contract quando aplicável.

---

## ADR-141

Production Deployments não deverão depender da workstation individual de um desenvolvedor.

---

## ADR-142

O MedFlow deverá buscar o princípio Build Once, Deploy Many quando a stack e infraestrutura permitirem.

---

## ADR-143

Cada artifact de deploy deverá ser identificável através de versão, commit ou Build ID.

---

## ADR-144

Production deverá possuir estratégia de Backup e os procedimentos de Restore deverão ser testados periodicamente.

---

## ADR-145

Acesso administrativo a Production seguirá Least Privilege, identidades individuais e auditoria.

---

## ADR-146

Acesso emergencial elevado deverá utilizar processo Break-Glass quando a maturidade da infraestrutura permitir.

---

## ADR-147

Recursos externos capazes de gerar efeitos reais, incluindo pagamentos e comunicações, deverão possuir isolamento por ambiente.

---

## ADR-148

AI Providers, AI Usage e recursos de Retrieval deverão manter contexto explícito de ambiente.

---

## ADR-149

Ambientes não produtivos não deverão contaminar Analytics e métricas reais de Production.

---

## ADR-150

Falhas de ambientes inferiores não deverão comprometer recursos de Production.

---

## ADR-151

Infraestrutura deverá evoluir progressivamente para Infrastructure as Code conforme a complexidade operacional justificar.

---

## ADR-152

Alterações manuais de infraestrutura deverão permanecer rastreáveis e ser reduzidas progressivamente.

---

## ADR-153

Serviços deverão utilizar UTC internamente como referência temporal padrão, realizando localização na camada apropriada.

---

## ADR-154

Backend deverá considerar coexistência temporária de diferentes versões de clientes, especialmente Mobile.

---

## ADR-155

A indisponibilidade da AI Platform não deverá impedir acesso às funcionalidades essenciais do MedFlow.

---

# Referência de Estrutura

Uma possível organização futura:

```text
deployment/

├── environments/
│   ├── development/
│   ├── staging/
│   └── production/
│
├── docker/
├── ci/
├── scripts/
├── migrations/
├── monitoring/
└── runbooks/
```

Configuração local poderá utilizar:

```text
.env.example

docker-compose.yml
```

ou equivalentes definidos posteriormente.

Essa estrutura é conceitual.

Não deverão ser criados diretórios vazios apenas para reproduzir a documentação.

---

# Fluxo Oficial Conceitual

```text
Developer

↓

Local

↓

Git Branch

↓

Pull Request

↓

CI

↓

Preview

↓

Code Review

↓

Merge

↓

Development / Integration

↓

Staging

↓

Validation

↓

Release Approval

↓

Production

↓

Smoke Test

↓

Monitoring
```

O fluxo definitivo será detalhado em:

```text
02-CI-CD.md

06-Release-Process.md
```

---

# Hierarquia de Proteção

Os controles deverão aumentar conforme a proximidade de Production.

```text
Local
  │
  │  Low Operational Risk
  ▼
Development
  │
  ▼
Preview
  │
  ▼
Staging
  │
  ▼
Production
     Highest Protection
```

---

# Regra Final

A arquitetura de ambientes deverá garantir que um erro humano em Development não possua caminho simples para se tornar um incidente em Production.

Em outras palavras:

```text
Environment Boundaries

are

Security Boundaries
```

Sempre que possível, essas fronteiras deverão ser reforçadas tecnicamente e não depender apenas de disciplina humana.

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

Além de:

```text
Architecture

Backend

Database

Mobile

Web

AI

Security

Audit

ADR
```

As políticas de segurança e proteção de dados possuem precedência sobre conveniências operacionais.

---

# Considerações Finais

A estratégia de ambientes do MedFlow existe para criar fronteiras claras entre desenvolvimento, validação e operação real.

Essas fronteiras não deverão existir apenas nos nomes dos ambientes.

Elas deverão existir na infraestrutura:

```text
Different Databases

Different Secrets

Different Storage

Different Credentials

Different Integrations

Different Access Policies
```

A maturidade operacional do MedFlow dependerá diretamente da capacidade de realizar mudanças com segurança.

Desenvolvedores deverão poder experimentar sem colocar Production em risco.

QA deverá poder validar sem interagir com pacientes reais.

Staging deverá permitir identificar problemas antes de uma release.

Production deverá permanecer protegida contra alterações acidentais.

E quando uma falha inevitavelmente ocorrer, a plataforma deverá possuir informações suficientes para identificar:

```text
What changed?

Who changed it?

Which version?

Which environment?

When?

What was affected?

Can we rollback?

Can we recover?
```

O objetivo final não é impedir mudanças.

É permitir que o MedFlow continue mudando durante anos sem transformar cada deploy em um risco para a plataforma.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação da especificação oficial de ambientes e isolamento operacional do MedFlow | Equipe MedFlow |