# Infraestrutura de Hosting

| Campo | Valor |
|-------|--------|
| Documento | Hosting |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Deployment |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

Este documento define os princípios, responsabilidades e requisitos oficiais de **Hosting e Infrastructure Runtime** do MedFlow.

Hosting representa a infraestrutura responsável por manter os componentes do MedFlow disponíveis para seus usuários.

Isso inclui, direta ou indiretamente:

```text
Web

Backend API

Workers

AI Services

Database

Cache

Queues

Object Storage

CDN

DNS

Networking

TLS

Secrets

Observability Infrastructure
```

O objetivo deste documento não é amarrar permanentemente o MedFlow a um único Cloud Provider.

A arquitetura deverá permitir que decisões de infraestrutura evoluam conforme:

- Número de usuários.
- Número de clínicas.
- Volume de dados.
- Tráfego.
- Requisitos regulatórios.
- Disponibilidade necessária.
- Custo.
- Complexidade operacional.
- Expansão geográfica.
- Necessidades de segurança.

O princípio fundamental será:

```text
Infrastructure must serve
the Architecture.

Architecture must not exist
only to serve a Provider.
```

---

# Objetivos

A infraestrutura de Hosting deverá buscar:

- Alta disponibilidade.
- Segurança.
- Escalabilidade.
- Performance.
- Observabilidade.
- Recuperação.
- Isolamento entre ambientes.
- Deploy automatizado.
- Rollback.
- Gestão segura de Secrets.
- Proteção de dados.
- Controle de acesso.
- Previsibilidade de custos.
- Portabilidade.
- Redução de operações manuais.
- Evolução progressiva.

---

# Princípio de Simplicidade Operacional

O MedFlow não deverá adotar infraestrutura complexa antes que exista necessidade real.

Preferir inicialmente:

```text
Managed Services

+

Managed Runtime

+

Managed Database

+

Managed Storage
```

quando essas soluções atenderem aos requisitos técnicos.

Evitar:

```text
Large Infrastructure Team

↓

Complex Cluster

↓

Complex Networking

↓

Complex Orchestration

↓

Few Users
```

Complexidade operacional possui custo.

---

# Infrastructure Evolution

A infraestrutura deverá evoluir progressivamente.

Exemplo conceitual:

```text
Phase 1

Managed PaaS
Managed Database
Managed Storage
CDN

↓

Phase 2

Horizontal Scaling
Workers
Queue
Cache
Advanced Monitoring

↓

Phase 3

Multi-Region Capabilities
Advanced Traffic Management
Dedicated Infrastructure Components

↓

Phase 4

Enterprise Infrastructure
Regional Isolation
Advanced Disaster Recovery
```

As fases não representam roadmap obrigatório.

Representam capacidade de evolução.

---

# Provider Independence

O MedFlow poderá utilizar serviços específicos de provedores quando eles oferecerem benefícios relevantes.

Entretanto, regras de negócio críticas não deverão depender desnecessariamente de APIs proprietárias.

Preferir abstrações nos pontos onde migração futura seja plausível.

---

# Vendor Lock-In

Vendor Lock-In não deverá ser tratado como algo absolutamente proibido.

Algum nível de dependência pode ser aceitável quando:

```text
Operational Benefit

>

Migration Risk
```

A decisão deverá ser consciente.

---

# Hosting Architecture

Arquitetura conceitual:

```text
Users
  │
  ▼
DNS
  │
  ▼
CDN / Edge
  │
  ▼
WAF / Gateway
  │
  ├───────────────┐
  ▼               ▼
Web            Backend API
                  │
          ┌───────┼────────┐
          ▼       ▼        ▼
       Database  Cache    Queue
                           │
                           ▼
                         Workers
                           │
                           ▼
                      AI / External
                        Services
```

---

# Public Entry Points

A superfície pública deverá ser mínima.

Possíveis Entry Points:

```text
Web Application

Public API Gateway

Authentication Callback

Webhook Endpoints
```

Serviços internos não deverão ser publicamente acessíveis sem necessidade.

---

# Private Services

Componentes como:

```text
Database

Cache

Queue

Internal Workers

Administrative Services
```

deverão permanecer privados sempre que a infraestrutura permitir.

---

# DNS

DNS deverá possuir gestão centralizada.

Domínios deverão ser tratados como ativos críticos.

---

# Domain Ownership

Domínios oficiais deverão permanecer sob contas controladas pela organização responsável pelo MedFlow.

Evitar domínio registrado exclusivamente em conta pessoal de desenvolvedor.

---

# DNS Access

Alterações de DNS deverão possuir acesso restrito.

Comprometimento de DNS poderá permitir:

- Traffic Hijacking.
- Phishing.
- Certificate Abuse.
- Service Disruption.

---

# DNS Records

Records deverão possuir documentação ou Infrastructure as Code quando a maturidade justificar.

Exemplos:

```text
A

AAAA

CNAME

TXT

MX

CAA
```

---

# Production Domain

Production deverá possuir domínio oficial estável.

Exemplo conceitual:

```text
app.medflow.<domain>
```

---

# API Domain

API poderá possuir domínio dedicado.

Exemplo:

```text
api.medflow.<domain>
```

A estrutura concreta dependerá da estratégia de domínio oficial.

---

# Staging Domain

Staging deverá ser claramente identificável.

Exemplo:

```text
staging.medflow.<domain>
```

Nunca utilizar domínio visualmente indistinguível de Production.

---

# TLS

Todo tráfego público deverá utilizar:

```text
HTTPS
```

---

# HTTP

HTTP não criptografado deverá redirecionar para HTTPS quando existir endpoint público correspondente.

---

# TLS Certificates

Certificados deverão preferencialmente possuir:

- Automated Provisioning.
- Automated Renewal.
- Monitoring.
- Modern TLS Configuration.

---

# Certificate Expiration

A infraestrutura deverá impedir indisponibilidade causada por certificados expirados.

---

# HSTS

Production poderá utilizar:

```text
HTTP Strict Transport Security
```

após validação adequada da configuração HTTPS.

---

# CDN

Web Assets deverão utilizar CDN quando apropriado.

Benefícios:

- Menor Latency.
- Edge Caching.
- Reduced Origin Load.
- Global Distribution.

---

# CDN Content

Bons candidatos:

```text
JavaScript Bundles

CSS

Fonts

Public Images

Static Assets
```

---

# Sensitive Content Caching

Dados sensíveis não deverão ser cacheados publicamente.

Respostas clínicas autenticadas deverão possuir política de cache apropriada.

---

# Cache-Control

Headers deverão refletir a sensibilidade do recurso.

Exemplo conceitual:

```text
Public Static Asset

↓

Long Cache
```

```text
Patient Record

↓

Private / No Store
```

---

# Web Hosting

A aplicação Web poderá utilizar:

```text
Static Hosting + CDN
```

quando sua arquitetura permitir.

Ou:

```text
Server Runtime

↓

Container / Managed Runtime
```

quando SSR ou processamento server-side exigir.

---

# Web Deployment

Fluxo:

```text
Source

↓

CI

↓

Web Build

↓

Artifact

↓

Hosting / CDN

↓

Production
```

---

# Web Atomic Deployment

Quando suportado, deploy do Web deverá ser atômico.

Evitar estado:

```text
New HTML

+

Old JavaScript

+

Missing Asset
```

---

# Web Asset Versioning

Assets compilados deverão utilizar Content Hash quando suportado.

Exemplo:

```text
app.a8f2c91.js
```

Isso permite caching seguro.

---

# Backend Hosting

Backend deverá utilizar runtime compatível com:

- Horizontal Scaling.
- Health Checks.
- Runtime Secrets.
- Graceful Shutdown.
- Centralized Logs.
- Metrics.
- Automated Deploy.
- Rollback.

---

# Backend Runtime

A infraestrutura não deverá exigir configuração manual de servidores para cada release.

Preferir:

```text
Artifact

↓

Managed Runtime

↓

Instances
```

---

# Backend Instances

Production deverá permitir múltiplas instâncias quando necessário.

```text
Load Balancer

├── API 1
├── API 2
└── API N
```

---

# Horizontal Scaling

Scaling poderá responder a:

- Request Rate.
- CPU.
- Memory.
- Queue Depth.
- Latency.
- Custom Metrics.

---

# Minimum Instances

Serviços críticos poderão possuir mínimo superior a zero quando Cold Start ou Availability tornarem Scale-to-Zero inadequado.

---

# Scale to Zero

Scale-to-Zero poderá ser utilizado em:

- Development.
- Preview.
- Low-priority services.

Production deverá avaliar impacto de Cold Start.

---

# Autoscaling

Autoscaling deverá possuir limites.

```text
Minimum Instances

↓

Desired Capacity

↓

Maximum Instances
```

Sem Maximum Limit, falhas podem gerar custo inesperado.

---

# Load Balancing

Quando múltiplas instâncias existirem:

```text
Client

↓

Load Balancer

↓

Healthy Instance
```

Instâncias Not Ready não deverão receber novas requisições.

---

# Sticky Sessions

Sticky Sessions deverão ser evitadas como requisito arquitetural.

Preferir Backend Stateless.

---

# Database Hosting

Production Database deverá preferencialmente utilizar Managed Database quando adequado.

Benefícios:

- Automated Backups.
- Replication.
- Monitoring.
- Managed Patching.
- High Availability.
- Point-in-Time Recovery.
- Operational Support.

---

# Database Isolation

Cada Environment deverá possuir Database separado conforme definido em:

```text
01-Environments.md
```

---

# Production Database

Production Database não deverá ser utilizado para:

- Local Development.
- Automated Tests.
- Preview Environments.
- Developer Experiments.

---

# Database Public Access

Production Database deverá permanecer privada sempre que possível.

```text
Internet

✘

Production Database
```

---

# Database Encryption

Dados deverão possuir Encryption at Rest quando suportado.

Conexões deverão utilizar Encryption in Transit.

---

# Database High Availability

Conforme criticidade e escala, Database deverá possuir estratégia de:

```text
Primary

↓

Standby / Replica
```

com Failover apropriado.

---

# Read Replicas

Read Replicas poderão ser adotadas quando leitura se tornar gargalo.

Não deverão ser adicionadas prematuramente.

---

# Replication Lag

Sistemas que utilizem Read Replicas deverão considerar:

```text
Write

↓

Primary

↓

Replication Delay

↓

Replica
```

Uma leitura imediata poderá não enxergar a escrita.

---

# Database Connection Limits

Application Scaling deverá respeitar limites do Database.

```text
Application Instances

×

Connections per Instance

=

Potential Connections
```

---

# Connection Pooling

Connection Pooling deverá ser utilizado quando necessário para evitar exaustão de conexões.

---

# Database Storage

Capacidade deverá possuir:

- Monitoring.
- Growth Alerts.
- Expansion Strategy.

Database não deverá chegar a 100% de armazenamento sem aviso.

---

# Database Backups

Backups deverão ser automáticos em Production.

---

# Backup Frequency

Frequência deverá ser definida pelos objetivos de recuperação.

Conceitos:

```text
RPO

Recovery Point Objective
```

```text
RTO

Recovery Time Objective
```

---

# Recovery Point Objective

RPO representa:

> Quanto de dados podemos aceitar perder em um desastre?

Exemplo conceitual:

```text
RPO = 15 minutes
```

significa que, no pior cenário planejado, até aproximadamente 15 minutos de alterações poderiam precisar ser reconstruídos ou perdidos.

O valor oficial deverá ser definido conforme maturidade e criticidade.

---

# Recovery Time Objective

RTO representa:

> Quanto tempo podemos levar para restaurar o serviço?

O valor deverá ser definido conforme criticidade.

---

# Point-in-Time Recovery

Production Database deverá preferencialmente suportar:

```text
PITR
```

quando tecnicamente e financeiramente viável.

---

# Backup Testing

Um Backup não deverá ser considerado confiável apenas porque existe.

Regra:

```text
Untested Backup

=

Unknown Recovery
```

Restore Tests deverão ser realizados periodicamente.

---

# Backup Isolation

Backups críticos deverão possuir proteção contra exclusão acidental ou comprometimento da aplicação.

---

# Backup Retention

Retention deverá considerar:

- Recovery Requirements.
- Compliance.
- Cost.
- Data Retention Policy.

---

# Object Storage

Arquivos persistentes deverão utilizar Object Storage apropriado.

Exemplos:

- Medical Attachments.
- Documents.
- Images.
- Generated Reports.
- Exports.
- AI-related files quando permitido.

---

# Object Storage Access

Buckets/Containers deverão ser privados por padrão.

---

# Public Files

Somente conteúdo explicitamente público deverá possuir acesso público.

---

# Signed URLs

Arquivos privados poderão utilizar:

```text
Signed URL

↓

Short Expiration

↓

Authorized Access
```

---

# File Authorization

Possuir URL não deverá automaticamente significar autorização permanente.

---

# Storage Encryption

Object Storage deverá utilizar Encryption at Rest quando suportado.

---

# Storage Lifecycle

Arquivos temporários deverão possuir Lifecycle Policy.

Exemplo:

```text
Temporary Export

↓

7 Days

↓

Automatic Deletion
```

O período real dependerá da política de dados.

---

# Storage Versioning

Versioning poderá ser utilizado em buckets críticos quando apropriado.

---

# Cache Hosting

Cache poderá ser utilizado para:

- Sessions.
- Rate Limiting.
- Query Caching.
- Distributed Locks.
- Temporary State.

A arquitetura concreta dependerá da implementação.

---

# Cache Is Not Database

Regra:

```text
Cache Loss

should not mean

Permanent Data Loss
```

salvo quando explicitamente projetado como sistema persistente.

---

# Managed Cache

Production poderá utilizar Managed Cache quando escala e confiabilidade justificarem.

---

# Queue Hosting

Message Queue deverá suportar processamento assíncrono confiável.

Fluxo:

```text
API

↓

Queue

↓

Worker
```

---

# Queue Durability

Jobs importantes deverão possuir durabilidade adequada.

---

# Dead Letter Queue

Falhas repetidas poderão ser direcionadas para:

```text
Dead Letter Queue
```

para análise.

---

# Queue Monitoring

Monitorar:

- Queue Depth.
- Processing Time.
- Failure Rate.
- Retry Rate.
- Dead Letters.

---

# Worker Hosting

Workers deverão possuir scaling independente da API.

```text
API Traffic

≠

Worker Demand
```

---

# Worker Autoscaling

Queue Depth poderá ser sinal para Scaling.

---

# Scheduler Hosting

Scheduled Jobs deverão utilizar mecanismo confiável.

Preferir:

```text
Managed Scheduler

↓

Job Trigger

↓

Worker / Command
```

---

# Cron Reliability

Jobs críticos deverão registrar:

- Start.
- Completion.
- Failure.
- Duration.

---

# AI Infrastructure

AI poderá utilizar:

```text
External AI Providers
```

e futuramente:

```text
Self-Hosted Models
```

quando necessário.

---

# AI Provider Connectivity

Backend deverá controlar acesso aos Providers.

Clients não deverão possuir Secrets dos AI Providers.

---

# AI Egress

Chamadas externas de AI deverão ser monitoradas.

Exemplos:

- Request Count.
- Latency.
- Failure Rate.
- Token Usage.
- Cost.

---

# Self-Hosted AI

Caso Models sejam hospedados internamente no futuro, infraestrutura poderá exigir:

- GPU.
- Specialized Runtime.
- Model Registry.
- Autoscaling.
- Large Artifact Storage.

Essa complexidade não deverá ser adotada antecipadamente.

---

# External Services

O MedFlow poderá depender de:

- Email.
- SMS.
- Push Notifications.
- Payments.
- AI.
- Authentication.
- Analytics.
- Monitoring.

Dependências externas deverão possuir Timeouts e tratamento de falhas.

---

# Outbound Network

Egress deverá ser controlado quando infraestrutura permitir.

Serviços não deverão possuir acesso irrestrito à Internet sem necessidade.

---

# Webhooks

Endpoints de Webhook deverão:

- Utilizar HTTPS.
- Validar assinatura quando Provider suportar.
- Ser idempotentes.
- Registrar processamento.
- Rejeitar payloads inválidos.

---

# Network Segmentation

Infraestrutura poderá separar:

```text
Public Layer

Application Layer

Data Layer
```

---

# Public Layer

Pode conter:

```text
CDN

Load Balancer

API Gateway
```

---

# Application Layer

Pode conter:

```text
API

Workers

Internal Services
```

---

# Data Layer

Pode conter:

```text
Database

Cache

Queue

Private Storage
```

---

# Firewall Rules

Network Rules deverão seguir:

```text
Deny by Default

Allow What Is Necessary
```

quando a infraestrutura suportar.

---

# Administrative Access

Acesso administrativo deverá ser restrito.

Preferir:

- SSO.
- MFA.
- Short-Lived Credentials.
- Audit Logs.

---

# Shared Accounts

Contas administrativas compartilhadas deverão ser evitadas.

---

# Root Accounts

Root/Owner Accounts deverão possuir proteção reforçada.

Exemplos:

- MFA.
- Recovery Codes protegidos.
- Uso mínimo.
- Sem uso diário.

---

# Service Accounts

Aplicações deverão utilizar identidades próprias.

```text
medflow-api

medflow-worker

medflow-ci
```

e não credenciais pessoais de desenvolvedor.

---

# Least Privilege

Cada Service Identity deverá possuir apenas as permissões necessárias.

---

# Secret Management

Production Secrets deverão utilizar Secret Manager ou mecanismo seguro equivalente.

---

# Secrets Proibidos no Git

Nunca versionar:

- Database Password.
- JWT Secret.
- API Keys.
- Cloud Credentials.
- AI Provider Keys.
- Payment Secrets.
- Private Keys.

---

# Secret Rotation

Secrets críticos deverão poder ser rotacionados.

Arquitetura não deverá assumir que uma credencial nunca muda.

---

# Zero-Downtime Secret Rotation

Quando possível:

```text
Old Secret

+

New Secret

↓

Transition

↓

Old Secret Revoked
```

---

# Secret Access Audit

Acesso a Secrets críticos deverá ser auditável quando Provider suportar.

---

# Infrastructure as Code

Conforme a infraestrutura crescer, recursos deverão migrar progressivamente para:

```text
Infrastructure as Code
```

---

# IaC Benefits

- Reproducibility.
- Review.
- Versioning.
- Auditability.
- Disaster Recovery.
- Reduced Manual Drift.

---

# IaC Scope

Poderá incluir:

```text
Networking

Compute

Storage

Databases

Queues

DNS

IAM

Monitoring
```

---

# Manual Infrastructure

Recursos criados manualmente deverão ser documentados até serem incorporados ao IaC.

---

# Infrastructure Drift

Diferenças entre definição e ambiente real deverão ser detectadas.

---

# Production Changes

Mudanças de infraestrutura Production deverão passar por processo controlado.

Preferir:

```text
Pull Request

↓

Review

↓

Plan

↓

Approval

↓

Apply
```

---

# Infrastructure Plan

IaC deverá permitir revisar impacto antes de Apply quando ferramenta suportar.

---

# Destructive Infrastructure Change

Operações como:

```text
Destroy Database

Delete Storage

Replace Critical Resource
```

deverão possuir proteção adicional.

---

# Deletion Protection

Production Database e recursos críticos deverão possuir Deletion Protection quando disponível.

---

# Resource Naming

Recursos deverão possuir nomenclatura consistente.

Exemplo:

```text
medflow-production-api

medflow-production-db

medflow-staging-api
```

---

# Resource Tags

Recursos poderão possuir Tags como:

```text
project=medflow

environment=production

service=api

managed_by=iac
```

---

# Cost Allocation

Tags poderão permitir identificar custos por:

- Environment.
- Service.
- Team.
- Feature.

---

# Cost Management

Cloud Cost deverá ser tratado como requisito operacional.

---

# Cost Monitoring

Monitorar:

- Compute.
- Database.
- Storage.
- Bandwidth.
- AI.
- Logs.
- Backups.
- Third-party APIs.

---

# Budget Alerts

Ambientes pagos deverão possuir Budget Alerts quando Provider suportar.

---

# Unexpected Cost Spike

Aumento inesperado poderá indicar:

- Traffic Spike.
- Attack.
- Infinite Loop.
- Queue Explosion.
- AI Abuse.
- Logging Explosion.
- Misconfigured Autoscaling.

---

# Autoscaling Cost Protection

Autoscaling deverá possuir Maximum Capacity adequada.

---

# Log Cost

Logs excessivos podem gerar custo significativo.

Retention deverá ser configurada.

---

# Data Transfer Cost

Arquitetura deverá considerar Egress Costs, especialmente para:

- Large Files.
- AI Data.
- Backups.
- Cross-Region Traffic.

---

# Region Selection

Production Region deverá considerar:

- Usuários.
- Latency.
- Data Residency.
- Provider Availability.
- Compliance.
- Cost.

---

# Brazil Operations

Para operações brasileiras, Region Selection deverá considerar proximidade dos usuários e requisitos relacionados à proteção de dados aplicáveis.

A escolha concreta deverá ser documentada quando o Provider for definido.

---

# Portugal / European Operations

Caso o MedFlow opere futuramente na União Europeia:

```text
EU Data Residency

GDPR

Regional Infrastructure
```

deverão ser considerados explicitamente.

---

# Multi-Region

Multi-Region não deverá ser adotado prematuramente.

É uma arquitetura significativamente mais complexa.

---

# Multi-Region Challenges

Incluem:

- Data Replication.
- Conflict Resolution.
- Routing.
- Session Consistency.
- Database Architecture.
- Failover.
- Cost.
- Compliance.

---

# Multi-Region Trigger

A adoção deverá ocorrer apenas quando requisitos como:

- Geographic Availability.
- Disaster Recovery.
- Latency.
- Data Residency.

justificarem.

---

# Availability Zones

Quando Provider suportar, Production poderá distribuir serviços críticos entre Failure Domains diferentes.

---

# Single Point of Failure

A arquitetura deverá identificar Single Points of Failure.

Exemplo:

```text
One API Instance

↓

Failure

↓

Total API Downtime
```

---

# High Availability

Alta disponibilidade deverá ser aplicada proporcionalmente à criticidade.

---

# Backend High Availability

Pode exigir:

```text
Multiple Instances

+

Load Balancer
```

---

# Database High Availability

Pode exigir:

```text
Primary

+

Standby
```

---

# Storage High Availability

Managed Object Storage normalmente fornecerá redundância própria, que deverá ser compreendida e documentada.

---

# Disaster Recovery

Hosting deverá possuir estratégia de Disaster Recovery.

Cenários:

- Application Failure.
- Database Corruption.
- Accidental Deletion.
- Provider Outage.
- Credential Compromise.
- Region Failure.
- Deployment Failure.

---

# Disaster Recovery Principle

A equipe deverá saber:

```text
What failed?

What data remains?

What must be restored?

From where?

In what order?

How long will it take?
```

---

# Recovery Order

Exemplo conceitual:

```text
Infrastructure

↓

Network

↓

Database

↓

Storage

↓

Application Services

↓

Workers

↓

External Integrations

↓

Traffic

↓

Verification
```

---

# Disaster Recovery Documentation

Procedimentos detalhados deverão existir conforme a plataforma amadurecer.

---

# Recovery Testing

Disaster Recovery não deverá existir apenas como documentação.

Exercícios periódicos deverão validar procedimentos.

---

# Region Failure

Caso Multi-Region não exista, Region Failure poderá exigir Recovery manual em outra região.

Esse risco deverá ser conhecido.

---

# Provider Failure

A arquitetura deverá distinguir:

```text
Temporary Provider Incident

vs

Long-Term Provider Loss
```

Migração completa de Provider é cenário extremo e não deverá ser confundida com High Availability normal.

---

# Observability

Toda infraestrutura Production deverá integrar:

```text
Logs

Metrics

Traces

Alerts
```

conforme aplicável.

Detalhes:

```text
05-Monitoring.md
```

---

# Infrastructure Metrics

Monitorar:

- CPU.
- Memory.
- Disk.
- Network.
- Instance Count.
- Restart Count.
- Database Connections.
- Storage Usage.
- Queue Depth.
- Cache Usage.

---

# Availability Monitoring

O sistema deverá possuir monitoramento externo quando apropriado.

```text
External Monitor

↓

Production Endpoint

↓

Availability Signal
```

---

# Provider Monitoring

Status do Cloud Provider poderá ser uma fonte auxiliar durante incidentes.

---

# Maintenance

Managed Services podem possuir Maintenance Windows.

A equipe deverá compreender:

- Automatic Updates.
- Database Maintenance.
- Runtime Updates.
- Restart Behavior.

---

# Provider Automatic Updates

Updates automáticos deverão ser avaliados quanto ao impacto.

Runtime crítico não deverá mudar de forma inesperada quando Provider permitir controle.

---

# Infrastructure Patching

Componentes administrados diretamente pela equipe deverão possuir política de Patch.

---

# OS Management

Preferir Managed Runtime reduz necessidade de administrar servidores diretamente.

---

# VM Usage

Virtual Machines poderão ser utilizadas quando necessário.

Entretanto, criam responsabilidade por:

- OS Updates.
- Firewall.
- Runtime.
- Monitoring.
- Disk.
- Security Patching.
- Backup.
- SSH Access.

---

# Pets vs Cattle

Servidores não deverão ser tratados como máquinas únicas e insubstituíveis.

Preferir:

```text
Replace

rather than

Repair Forever
```

---

# Bastion Hosts

Bastion Host somente deverá ser adotado se houver necessidade concreta.

Managed Access poderá ser preferível.

---

# SSH Keys

Quando SSH for inevitável:

- Keys individuais.
- No shared private key.
- Rotation.
- Access Review.

---

# Production Console Access

Acesso ao Provider Console deverá utilizar MFA.

---

# Access Review

Permissões de Production deverão ser revisadas periodicamente.

Usuários que deixarem a equipe deverão perder acesso rapidamente.

---

# Break-Glass Access

Acesso emergencial poderá existir para incidentes críticos.

Deverá ser:

- Restrito.
- Auditável.
- Protegido.
- Utilizado excepcionalmente.

---

# Environment Isolation

Development, Staging e Production deverão ser isolados.

Idealmente:

```text
Separate Projects / Accounts / Subscriptions
```

quando Provider e maturidade permitirem.

---

# Shared Cloud Account

No estágio inicial, ambientes poderão compartilhar conta administrativa se necessário.

Entretanto, recursos e Secrets deverão permanecer claramente isolados.

---

# Future Account Separation

Com aumento de risco e equipe:

```text
Development Account

Staging Account

Production Account
```

poderá ser adotado.

---

# Production Protection

Production deverá possuir controles mais rigorosos que Development.

---

# Preview Infrastructure

Preview Environments deverão possuir:

- Resources limitados.
- Secrets não produtivos.
- Expiration.
- Automatic Cleanup.

---

# Preview Cost

Preview Resources abandonados deverão ser removidos automaticamente quando possível.

---

# Staging Similarity

Staging deverá ser semelhante a Production nas características relevantes.

Isso não significa possuir a mesma capacidade.

Exemplo:

```text
Production

4 Instances
```

```text
Staging

1 Instance
```

mas ambos podem utilizar mesma tecnologia de Runtime.

---

# Production Data in Staging

Dados reais de pacientes não deverão ser copiados indiscriminadamente para Staging.

---

# Data Sanitization

Quando dados representativos forem necessários:

```text
Production Data

↓

Approved Sanitization

↓

Non-Production Dataset
```

---

# Hosting Health

A infraestrutura deverá permitir responder:

```text
Is the service reachable?

Is it healthy?

Is it overloaded?

Is it scaling?

Is the database healthy?

Are queues growing?

Are errors increasing?

Are costs abnormal?
```

---

# Capacity Planning

Mesmo com Autoscaling, capacidade deverá ser analisada.

---

# Capacity Signals

Considerar:

- Active Users.
- Clinics.
- Requests per Second.
- Database Size.
- File Storage.
- Queue Throughput.
- AI Usage.

---

# Load Testing

Antes de eventos de escala relevante, poderão ser realizados Load Tests em ambiente controlado.

---

# Production Load Testing

Não executar carga agressiva em Production sem planejamento explícito.

---

# Performance Baseline

Staging e Production deverão possuir métricas de baseline.

---

# Hosting Provider Evaluation

Ao escolher Provider, avaliar:

| Critério | Importância |
|----------|-------------|
| Reliability | Alta |
| Managed Database | Alta |
| Security | Alta |
| Region Availability | Alta |
| Backup | Alta |
| Monitoring | Alta |
| Scaling | Alta |
| Cost | Alta |
| Developer Experience | Média/Alta |
| Vendor Lock-In | Média |
| Global Expansion | Média |
| Compliance Support | Alta |

---

# Managed Service Evaluation

Antes de adotar um serviço gerenciado, avaliar:

```text
What does Provider manage?

What does MedFlow still manage?
```

---

# Shared Responsibility

Cloud não elimina responsabilidade.

Exemplo:

```text
Provider

↓

Physical Infrastructure

Managed Runtime

Platform Security
```

```text
MedFlow

↓

Application Security

Access Control

Data Usage

Configuration

Secrets

Business Logic
```

A divisão concreta depende do serviço.

---

# Service Level Objectives

A infraestrutura deverá evoluir para SLOs explícitos.

Exemplo conceitual:

```text
Availability

Latency

Error Rate
```

---

# SLA vs SLO

```text
SLA

=

External commitment
```

```text
SLO

=

Internal reliability target
```

Não deverão ser confundidos.

---

# Error Budget

Conforme maturidade, Reliability poderá utilizar Error Budget para equilibrar velocidade e estabilidade.

---

# Hosting Migration

Mudança de Provider deverá possuir plano.

Fluxo conceitual:

```text
Target Infrastructure

↓

Data Replication / Migration

↓

Application Validation

↓

Traffic Transition

↓

Observation

↓

Old Infrastructure Decommission
```

---

# Database Migration Between Providers

Deverá considerar:

- Downtime.
- Replication.
- Data Integrity.
- RPO.
- Rollback.
- DNS.
- Application Compatibility.

---

# DNS Migration

TTL poderá ser reduzido antes de migrações planejadas quando apropriado.

---

# Decommissioning

Infraestrutura antiga não deverá permanecer ativa indefinidamente após migração.

---

# Secure Decommissioning

Ao remover recursos:

- Revoke Secrets.
- Remove DNS.
- Delete temporary data.
- Remove IAM.
- Archive required logs.
- Confirm Backup requirements.

---

# Production Readiness Checklist

| Item | Obrigatório |
|------|-------------|
| Production Domain configurado | ✅ |
| HTTPS obrigatório | ✅ |
| TLS Renewal automático | ✅ |
| Backend Health Checks | ✅ |
| Production Secrets protegidos | ✅ |
| Database isolado | ✅ |
| Database Backup | ✅ |
| Restore Strategy | ✅ |
| Object Storage privado | ✅ |
| Logs centralizados | ✅ |
| Monitoring | ✅ |
| Alerts críticos | ✅ |
| Deployment automatizado | ✅ |
| Rollback disponível | ✅ |
| Access Control | ✅ |
| MFA administrativo | ✅ |
| Cost Monitoring | ✅ |
| Resource Limits | ✅ |
| Disaster Recovery documentado | ✅ |

---

# Database Hosting Checklist

| Item | Obrigatório |
|------|-------------|
| Production Isolation | ✅ |
| Encryption in Transit | ✅ |
| Encryption at Rest quando suportado | ✅ |
| Automated Backup | ✅ |
| PITR quando aplicável | ✅ |
| Connection Monitoring | ✅ |
| Storage Monitoring | ✅ |
| Access Restriction | ✅ |
| Deletion Protection | ✅ |
| Restore Test | ✅ |

---

# Storage Checklist

| Item | Obrigatório |
|------|-------------|
| Private by Default | ✅ |
| Authorization | ✅ |
| Encryption | ✅ |
| Lifecycle Rules | Quando aplicável |
| Backup/Versioning Strategy | Quando aplicável |
| Sensitive File Protection | ✅ |
| Environment Isolation | ✅ |

---

# Infrastructure Security Checklist

| Item | Obrigatório |
|------|-------------|
| MFA | ✅ |
| Least Privilege | ✅ |
| No Shared Admin Accounts | ✅ |
| Secrets Manager | ✅ |
| Private Database | ✅ |
| Restricted Network | ✅ |
| TLS | ✅ |
| Audit Logs | Quando suportado |
| Access Review | ✅ |
| Break-Glass Procedure | Quando aplicável |

---

# Anti-Padrões

São considerados Anti-Padrões:

- Hospedar Production em máquina pessoal.
- Production dependente de computador de desenvolvedor.
- Utilizar Database Production para testes.
- Database Production aberto publicamente sem necessidade.
- Compartilhar Production Credentials.
- Desabilitar MFA.
- Armazenar Secrets no Git.
- Utilizar contas pessoais como Service Accounts.
- Não possuir Backup.
- Nunca testar Restore.
- Copiar dados clínicos reais para Development.
- Utilizar Storage público para documentos privados.
- Expor Cache publicamente.
- Expor Queue publicamente sem necessidade.
- Não possuir Health Checks.
- Escalar manualmente como única estratégia de longo prazo.
- Autoscaling sem Maximum Limit.
- Não monitorar custos.
- Não monitorar Database Storage.
- Utilizar um único servidor insubstituível.
- Corrigir manualmente Production sem reconciliar infraestrutura.
- Não saber quais recursos pertencem ao MedFlow.
- Manter Preview Environments indefinidamente.
- Misturar Secrets entre ambientes.
- Tratar CDN Cache como seguro para dados clínicos.
- Adotar Multi-Region sem necessidade.
- Adotar Kubernetes apenas por expectativa futura.
- Ignorar Data Residency.
- Considerar Managed Service como livre de responsabilidade.
- Depender de acesso SSH para operação normal.
- Não possuir estratégia para Provider Outage.
- Considerar Backup equivalente a Disaster Recovery.
- Considerar Hosting Provider equivalente à arquitetura do MedFlow.

---

# Decisões Arquiteturais

## ADR-221

A infraestrutura do MedFlow deverá priorizar simplicidade operacional e Managed Services quando eles atenderem aos requisitos técnicos e de segurança.

---

## ADR-222

A arquitetura não será permanentemente acoplada a um único Hosting Provider sem necessidade técnica explícita.

---

## ADR-223

Vendor Lock-In será avaliado como trade-off e não tratado como proibição absoluta.

---

## ADR-224

A superfície pública da infraestrutura deverá ser mínima, mantendo serviços internos privados sempre que possível.

---

## ADR-225

Todo tráfego público oficial do MedFlow deverá utilizar HTTPS.

---

## ADR-226

TLS Certificates deverão possuir renovação automatizada sempre que a infraestrutura permitir.

---

## ADR-227

Dados clínicos autenticados não deverão utilizar Public CDN Caching.

---

## ADR-228

Backend Production deverá suportar Health Checks, Runtime Secrets, Graceful Shutdown e Horizontal Scaling quando necessário.

---

## ADR-229

Backend deverá permanecer Stateless sempre que possível para permitir distribuição de tráfego entre múltiplas instâncias.

---

## ADR-230

Production Database deverá preferencialmente utilizar Managed Database quando requisitos técnicos, financeiros e operacionais permitirem.

---

## ADR-231

Production Database deverá permanecer isolado dos ambientes não produtivos.

---

## ADR-232

Production Database não deverá possuir exposição pública desnecessária.

---

## ADR-233

Production Database deverá possuir Automated Backup.

---

## ADR-234

Backups deverão ser periodicamente validados através de Restore Tests.

---

## ADR-235

PITR deverá ser utilizado para Production quando suportado e compatível com requisitos de custo e recuperação.

---

## ADR-236

RPO e RTO deverão ser formalmente definidos conforme a maturidade e criticidade operacional do MedFlow aumentarem.

---

## ADR-237

Arquivos persistentes não deverão depender do filesystem de Application Instances.

---

## ADR-238

Object Storage deverá permanecer Private by Default para dados não explicitamente públicos.

---

## ADR-239

Arquivos privados deverão possuir autorização de acesso independente de sua localização física.

---

## ADR-240

Cache não será utilizado como única fonte de dados permanentes salvo decisão arquitetural específica.

---

## ADR-241

Workers deverão possuir capacidade de scaling independente da API quando processamento assíncrono justificar.

---

## ADR-242

Scheduled Jobs deverão utilizar mecanismo controlado que evite execução duplicada causada por múltiplas replicas da aplicação.

---

## ADR-243

Secrets de Providers externos deverão permanecer no Backend ou infraestrutura autorizada e não nos Clients.

---

## ADR-244

Network Access seguirá Least Exposure e Least Privilege.

---

## ADR-245

Contas administrativas de infraestrutura deverão utilizar MFA.

---

## ADR-246

Aplicações e CI/CD deverão utilizar Service Identities em vez de credenciais pessoais de desenvolvedores.

---

## ADR-247

Production Secrets deverão utilizar Secret Manager ou mecanismo seguro equivalente quando disponível.

---

## ADR-248

Infraestrutura deverá evoluir progressivamente para Infrastructure as Code conforme sua complexidade aumentar.

---

## ADR-249

Mudanças destrutivas de infraestrutura Production deverão possuir proteção e revisão adicionais.

---

## ADR-250

Recursos críticos de Production deverão utilizar Deletion Protection quando suportado.

---

## ADR-251

Cloud Costs serão tratados como parte da observabilidade operacional.

---

## ADR-252

Ambientes pagos deverão utilizar Budget Alerts quando o Provider oferecer suporte.

---

## ADR-253

Autoscaling deverá possuir limites máximos apropriados para reduzir risco técnico e financeiro.

---

## ADR-254

Region Selection deverá considerar Latency, Data Residency, Compliance, Availability e Cost.

---

## ADR-255

Multi-Region não será requisito inicial e somente será adotado quando necessidades reais justificarem sua complexidade.

---

## ADR-256

Single Points of Failure deverão ser identificados e progressivamente eliminados conforme criticidade e escala.

---

## ADR-257

Disaster Recovery deverá incluir procedimentos documentados de reconstrução e recuperação dos serviços críticos.

---

## ADR-258

Disaster Recovery deverá ser testado periodicamente conforme a maturidade operacional aumentar.

---

## ADR-259

Development, Staging e Production deverão possuir isolamento de dados, Secrets e recursos críticos.

---

## ADR-260

Production Data não deverá ser copiado indiscriminadamente para ambientes não produtivos.

---

## ADR-261

Acesso administrativo de Production deverá ser restrito, auditável e removido quando não for mais necessário.

---

## ADR-262

Servidores individuais não deverão ser tratados como infraestrutura insubstituível.

---

## ADR-263

Managed Runtime será preferido a administração direta de VMs quando os requisitos puderem ser atendidos adequadamente.

---

## ADR-264

Observability será requisito de Production e não melhoria opcional posterior.

---

## ADR-265

Infrastructure Resources deverão utilizar Naming e Metadata consistentes para permitir ownership, rastreabilidade e controle de custos.

---

## ADR-266

Mudanças de Hosting Provider deverão utilizar processo de migração controlado com validação, Rollback e Data Integrity Checks.

---

# Arquitetura de Referência Inicial

Uma arquitetura inicial poderá seguir:

```text
                         Internet
                            │
                            ▼
                      DNS / CDN / WAF
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
               Web                 API Gateway
                                       │
                                       ▼
                                 Backend Runtime
                                       │
                 ┌─────────────────────┼─────────────────────┐
                 │                     │                     │
                 ▼                     ▼                     ▼
             Database               Cache                  Queue
                                                             │
                                                             ▼
                                                           Worker
                                                             │
                                      ┌──────────────────────┼─────────┐
                                      ▼                      ▼         ▼
                                  AI Provider             Email     Storage
```

Esta arquitetura é conceitual.

Ela não obriga a existência imediata de todos os componentes.

---

# Arquitetura de Ambientes

```text
Development
│
├── Development API
├── Development Database
├── Development Storage
└── Development Secrets


Staging
│
├── Staging API
├── Staging Database
├── Staging Storage
└── Staging Secrets


Production
│
├── Production API
├── Production Database
├── Production Storage
└── Production Secrets
```

Nenhum recurso crítico deverá atravessar essas fronteiras sem decisão explícita.

---

# Fluxo de Request

```text
User

↓

DNS

↓

CDN / Edge

↓

TLS

↓

Gateway

↓

Healthy API Instance

↓

Application

↓

Database / Cache / Queue / Storage
```

---

# Fluxo de Deployment

```text
CI/CD

↓

Immutable Artifact

↓

Hosting Platform

↓

New Instances

↓

Health Checks

↓

Traffic

↓

Monitoring
```

---

# Fluxo de Scaling

```text
Traffic Increase

↓

Metrics

↓

Autoscaling Policy

↓

Additional Instances

↓

Load Balancer

↓

Traffic Distribution
```

---

# Fluxo de Disaster Recovery

```text
Incident

↓

Declare Recovery

↓

Restore Infrastructure

↓

Restore Persistent Data

↓

Deploy Known Artifacts

↓

Restore Configuration / Secrets

↓

Validate Services

↓

Restore Traffic

↓

Monitor

↓

Post-Incident Review
```

---

# Relação com os Demais Documentos

```text
01-Environments.md

defines

ENVIRONMENT ISOLATION
```

```text
02-CI-CD.md

defines

HOW SOFTWARE REACHES HOSTING
```

```text
03-Docker.md

defines

HOW CONTAINERIZED SOFTWARE IS PACKAGED
```

```text
04-Hosting.md

defines

WHERE AND UNDER WHICH INFRASTRUCTURE RULES
THE SOFTWARE RUNS
```

```text
05-Monitoring.md

defines

HOW THE RUNNING PLATFORM IS OBSERVED
```

```text
06-Release-Process.md

defines

HOW A DEPLOYMENT BECOMES
AN OFFICIAL RELEASE
```

---

# Critérios de Maturidade

A infraestrutura poderá ser considerada operacionalmente madura quando:

- Production estiver isolado.
- Deploy não depender de workstation.
- Production possuir HTTPS.
- Certificates forem renovados automaticamente.
- Backend possuir Health Checks.
- Application Instances forem substituíveis.
- Database possuir Backup.
- Restore tiver sido testado.
- Storage sensível for privado.
- Secrets estiverem protegidos.
- MFA estiver ativo.
- Logs estiverem centralizados.
- Monitoring estiver configurado.
- Alertas críticos existirem.
- Custos forem observáveis.
- Autoscaling possuir limites.
- Infrastructure Changes forem rastreáveis.
- Disaster Recovery estiver documentado.
- RPO e RTO forem conhecidos.
- Production Version puder ser identificada.
- A equipe souber reconstruir o ambiente.

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

A infraestrutura deverá implementar os requisitos definidos nesses documentos, e não redefinir suas regras de domínio.

---

# Considerações Finais

Hosting não deverá ser entendido simplesmente como:

```text
"Where do we put the server?"
```

Para o MedFlow, Hosting representa a camada operacional que transforma arquitetura e código em um sistema disponível para uso real.

Essa infraestrutura poderá armazenar e processar:

```text
Patient Data

Medical Records

Appointments

Documents

Authentication Data

Audit Events

Financial Information

AI Workloads
```

Portanto, uma decisão de Hosting também é uma decisão de:

```text
Security

Availability

Privacy

Performance

Recovery

Cost

Compliance
```

A infraestrutura deverá começar simples.

Mas simples não significa improvisada.

Mesmo uma arquitetura inicial deverá possuir fundamentos que permitam crescimento:

```text
Isolated Environments

Managed Services

Immutable Deployments

External Persistent State

Secure Secrets

Automated Backups

Centralized Monitoring

Replaceable Instances
```

Isso permitirá que o MedFlow cresça sem precisar reconstruir sua fundação a cada novo estágio.

A arquitetura também deverá evitar o extremo oposto.

Não será necessário operar:

```text
Kubernetes

Multi-Region Active-Active

Service Mesh

Hundreds of Microservices
```

quando a plataforma ainda puder operar de maneira segura e eficiente com infraestrutura muito mais simples.

A pergunta correta deverá permanecer:

> Qual é a infraestrutura mais simples capaz de atender com segurança e confiabilidade às necessidades atuais do MedFlow, sem impedir sua evolução futura?

Conforme usuários, clínicas, integrações e volume de dados crescerem, a infraestrutura poderá evoluir.

Mas os princípios permanecerão:

```text
Protect the data.

Keep environments isolated.

Automate deployments.

Make instances replaceable.

Observe everything important.

Know how to recover.

Scale when evidence requires it.

Control operational complexity.
```

Daqui a anos, um novo engenheiro deverá conseguir abrir esta documentação e compreender não apenas **onde** o MedFlow está hospedado, mas principalmente **quais princípios não podem ser violados caso a infraestrutura seja substituída**.

Providers podem mudar.

Services podem mudar.

Regions podem mudar.

A arquitetura de Hosting poderá evoluir.

Os requisitos de segurança, rastreabilidade, isolamento, recuperação e confiabilidade deverão permanecer.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação da especificação oficial de Hosting, Cloud Infrastructure, Networking, Storage, Database Hosting, Availability, Scaling e Disaster Recovery do MedFlow | Equipe MedFlow |