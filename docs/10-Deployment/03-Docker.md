# Containerização com Docker

| Campo | Valor |
|-------|--------|
| Documento | Docker |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Deployment |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

Este documento define a estratégia oficial de **Containerização com Docker** do MedFlow.

Docker deverá fornecer uma unidade padronizada, reproduzível e portátil para execução dos componentes da plataforma que se beneficiem de containerização.

O objetivo não é simplesmente "colocar o MedFlow dentro de containers".

A arquitetura deverá garantir:

- Reprodutibilidade.
- Portabilidade.
- Isolamento.
- Segurança.
- Builds determinísticos.
- Imagens pequenas.
- Inicialização previsível.
- Configuração externa.
- Compatibilidade com CI/CD.
- Observabilidade.
- Escalabilidade horizontal.
- Recuperação operacional.
- Desenvolvimento local consistente.
- Independência razoável do Hosting Provider.

Princípio fundamental:

```text
Container Image

=

Application

+

Runtime

+

Required Dependencies
```

Configuração operacional, Secrets e dados persistentes não deverão fazer parte da imagem.

---

# Objetivos

A estratégia Docker deverá permitir:

- Executar serviços de forma consistente.
- Reduzir diferenças entre máquinas.
- Padronizar Backend Runtime.
- Criar Artifacts imutáveis.
- Integrar CI/CD.
- Facilitar Local Development.
- Facilitar Staging.
- Facilitar Production.
- Permitir Horizontal Scaling.
- Melhorar isolamento entre serviços.
- Simplificar Rollback.
- Permitir Vulnerability Scanning.
- Reduzir dependências instaladas diretamente no Host.
- Preparar a plataforma para diferentes modelos de Hosting.

---

# O Que Deve Ser Containerizado

Docker deverá ser utilizado onde gerar benefício operacional real.

Possíveis candidatos:

```text
Backend API

Workers

Background Jobs

Schedulers

AI Services

Internal Services

Development Infrastructure
```

---

# O Que Não Precisa Ser Containerizado

Nem todo componente precisa obrigatoriamente utilizar Docker.

Por exemplo:

```text
Mobile App

↓

Native / Store Artifact
```

O Web poderá ser:

```text
Static Build

↓

CDN
```

ou:

```text
Web Runtime

↓

Container
```

dependendo da arquitetura de Hosting.

---

# Docker Não É um Objetivo

Regra:

```text
Use Containers
where Containers solve a problem.
```

Não:

```text
Use Docker
because Docker exists.
```

A decisão deverá considerar:

- Runtime.
- Hosting.
- Escalabilidade.
- Complexidade.
- Operação.
- Custo.

---

# Container Architecture

Arquitetura conceitual:

```text
Internet

↓

Load Balancer / Gateway

↓

API Containers

├── API Instance 1
├── API Instance 2
└── API Instance N

↓

External Persistent Services
```

Serviços persistentes poderão incluir:

```text
Database

Cache

Object Storage

Queue

External Providers
```

---

# Containers Devem Ser Descartáveis

Um Container deverá ser tratado como:

```text
Replaceable Runtime Instance
```

e não:

```text
Permanent Server
```

Se um Container falhar:

```text
Container Failure

↓

Destroy

↓

Create New Container

↓

Resume Service
```

---

# Stateless Application

Sempre que possível, serviços de aplicação deverão ser Stateless.

```text
Request A

↓

Container 1
```

```text
Request B

↓

Container 2
```

O resultado funcional não deverá depender de qual instância recebeu a requisição.

---

# Estado Persistente

Estado persistente deverá permanecer fora do Container.

Exemplos:

```text
Database

Object Storage

Cache when persistent

Queue

External State Store
```

Evitar:

```text
Container Filesystem

↓

Critical Persistent Data
```

---

# Container Filesystem

O filesystem interno deverá ser considerado efêmero.

Arquivos poderão desaparecer quando:

- Container reiniciar.
- Container for substituído.
- Deployment ocorrer.
- Host falhar.
- Autoscaling remover instância.

---

# Uploads

Uploads de usuários não deverão depender do filesystem local do Container.

Fluxo esperado:

```text
Client

↓

Backend

↓

Object Storage
```

ou Upload direto controlado quando a arquitetura permitir.

---

# Dockerfile

Cada serviço containerizado deverá possuir definição versionada.

Exemplo:

```text
Dockerfile
```

O Dockerfile deverá fazer parte do Source Control.

---

# Dockerfile Principles

Um Dockerfile deverá buscar:

- Determinismo.
- Clareza.
- Segurança.
- Cache eficiente.
- Imagem mínima.
- Startup previsível.

---

# Dockerfile Conceitual

Exemplo simplificado:

```dockerfile
FROM <runtime-version>

WORKDIR /app

COPY package*.json ./

RUN <deterministic-install>

COPY . .

RUN <build>

CMD ["<application-command>"]
```

Este exemplo é conceitual.

O Dockerfile real deverá refletir a stack vigente.

---

# Base Images

Base Images deverão possuir origem confiável.

Preferir:

- Imagens oficiais.
- Imagens mantidas.
- Versões específicas.
- Distribuições mínimas quando adequadas.

---

# Base Image Version

Evitar:

```text
runtime:latest
```

como única referência.

Preferir versão controlada.

Exemplo conceitual:

```text
runtime:22.x
```

ou referência ainda mais específica quando necessário.

---

# Digest Pinning

Para componentes críticos, poderá ser utilizado Image Digest.

Exemplo:

```text
image@sha256:...
```

Isso fornece identificação imutável da Base Image.

---

# Base Image Updates

Pinning não significa nunca atualizar.

Fluxo:

```text
Current Base Image

↓

Security / Runtime Update

↓

Pull Request

↓

CI

↓

Tests

↓

Image Scan

↓

Release
```

---

# Multi-Stage Builds

Production Images deverão utilizar Multi-Stage Builds quando isso reduzir dependências e superfície de ataque.

Conceitualmente:

```text
Builder Stage

↓

Compile / Build

↓

Runtime Stage

↓

Only Runtime Requirements
```

---

# Builder Stage

Poderá conter:

- Compiler.
- Dev Dependencies.
- Build Tools.
- Source Code.
- Test Tools quando necessário.

---

# Runtime Stage

Deverá conter apenas o necessário para execução.

```text
Runtime

+

Application Artifact

+

Production Dependencies
```

---

# Benefícios do Multi-Stage Build

- Menor Image Size.
- Menor Attack Surface.
- Menos dependências.
- Pull mais rápido.
- Deploy mais rápido.
- Scanning mais limpo.

---

# Development Dependencies

Dependências utilizadas apenas para desenvolvimento não deverão permanecer na Production Image sem necessidade.

---

# Build Context

O Build Context deverá ser mínimo.

Evitar enviar ao Docker Daemon:

- `.git`.
- Logs.
- Local Builds.
- Secrets.
- Test Artifacts.
- IDE Files.
- Temporary Files.
- Local Databases.

---

# .dockerignore

O repositório deverá utilizar:

```text
.dockerignore
```

quando Docker Builds estiverem presentes.

Exemplo conceitual:

```text
.git

node_modules

.env

.env.*

coverage

dist

logs

tmp
```

A lista real deverá acompanhar a estrutura do projeto.

---

# Secrets Durante Build

Secrets não deverão ser adicionados permanentemente às Image Layers.

Proibido:

```dockerfile
COPY .env.production /app/.env
```

ou equivalente.

---

# Docker Layers

É importante compreender que remover um Secret em uma camada posterior não garante sua remoção do histórico da imagem.

Exemplo inseguro:

```text
Layer 1
COPY secret.txt

Layer 2
DELETE secret.txt
```

O Secret poderá continuar presente em Layer anterior.

---

# Build Secrets

Quando Build exigir Secret temporário, deverá ser utilizado mecanismo seguro fornecido pela ferramenta de Build.

O Secret não deverá permanecer na imagem final.

---

# Runtime Secrets

Secrets deverão ser injetados durante execução.

```text
Secret Manager

↓

Container Runtime

↓

Environment / Mounted Secret

↓

Application
```

---

# Environment Variables

Containers deverão seguir a estratégia definida em:

```text
01-Environments.md
```

A mesma imagem deverá poder operar em ambientes diferentes quando tecnicamente possível.

```text
Same Image

+

Different Runtime Configuration

↓

Different Environment
```

---

# Build-Time Configuration

Configuração embutida durante Build deverá ser minimizada.

Isso é especialmente importante para manter:

```text
Build Once

Deploy Many
```

---

# Runtime Configuration

Preferir:

```text
Container Image

+

Runtime Environment Variables

+

Runtime Secrets
```

---

# Production Image

A Production Image não deverá conter:

- `.env`.
- Git History.
- Development Tools desnecessários.
- Source Maps sensíveis sem política.
- Test Fixtures desnecessárias.
- Local Credentials.
- Production Credentials.
- SSH Private Keys.
- Database Dumps.

---

# Non-Root User

Containers de aplicação deverão executar como usuário não-root sempre que tecnicamente possível.

Evitar:

```text
Application

↓

root
```

Preferir:

```text
Application

↓

Dedicated Unprivileged User
```

---

# Least Privilege

O Container deverá possuir apenas as capacidades necessárias.

Evitar:

- Privileged Containers.
- Host Network desnecessário.
- Host PID Namespace.
- Docker Socket Mount.
- Excessive Linux Capabilities.
- Writable Host Mounts.

---

# Privileged Containers

`--privileged` deverá ser proibido para serviços normais do MedFlow.

Qualquer exceção futura exigirá análise arquitetural e de segurança específica.

---

# Docker Socket

Montar:

```text
/var/run/docker.sock
```

dentro de Application Containers deverá ser evitado.

Acesso ao Docker Socket pode equivaler a controle significativo do Host.

---

# Read-Only Root Filesystem

Quando a aplicação permitir, Production Containers poderão utilizar:

```text
read-only root filesystem
```

com diretórios temporários explicitamente controlados.

---

# Temporary Files

Arquivos temporários deverão utilizar localização dedicada.

Exemplo:

```text
/tmp
```

Nunca assumir persistência desses arquivos.

---

# File Permissions

Arquivos dentro da imagem deverão possuir permissões mínimas necessárias.

Evitar:

```text
chmod 777
```

como solução genérica.

---

# Entrypoint

O Container deverá possuir processo de inicialização claro.

Conceitualmente:

```text
Container Start

↓

Configuration Validation

↓

Dependency Readiness when necessary

↓

Application Start
```

---

# Fail Fast

Configuração inválida deverá impedir startup.

Exemplo:

```text
DATABASE_URL missing

↓

Container exits
```

em vez de iniciar parcialmente.

---

# PID 1

Aplicações deverão lidar corretamente com sinais quando executadas como processo principal do Container.

---

# Graceful Shutdown

Quando o Runtime enviar:

```text
SIGTERM
```

a aplicação deverá:

```text
Stop accepting new work

↓

Finish safe in-flight work

↓

Close resources

↓

Exit
```

dentro do período permitido.

---

# Shutdown Timeout

O processo não deverá permanecer indefinidamente durante Shutdown.

O Hosting Provider poderá terminar a instância após Grace Period.

---

# HTTP Server Shutdown

Backend deverá, quando possível:

```text
SIGTERM

↓

Mark Not Ready

↓

Stop New Requests

↓

Complete Existing Requests

↓

Close Database Connections

↓

Exit
```

---

# Worker Shutdown

Workers deverão evitar abandonar Jobs em estado inconsistente.

```text
SIGTERM

↓

Stop Fetching Jobs

↓

Finish / Requeue Current Job

↓

Exit
```

---

# Health Checks

Containers deverão expor Health Checks quando aplicável.

Exemplo conceitual:

```text
/health
```

---

# Liveness

Responde:

> O processo está vivo?

Falha poderá indicar necessidade de reiniciar a instância.

---

# Readiness

Responde:

> Esta instância está pronta para receber tráfego?

Uma aplicação viva poderá não estar Ready.

---

# Startup Probe

Aplicações com inicialização demorada poderão possuir conceito de Startup Probe quando o Orchestrator suportar.

---

# Health Endpoint Security

Health Endpoint não deverá retornar:

- Secrets.
- Credentials.
- Internal Network Topology.
- Sensitive Configuration.
- Patient Data.

---

# Dependency Health

Um Health Check não deverá necessariamente falhar porque qualquer serviço externo está temporariamente indisponível.

A semântica deverá ser definida cuidadosamente.

---

# Container Restart

Restart Policy deverá evitar loops infinitos invisíveis.

```text
Crash

↓

Restart

↓

Crash

↓

Restart
```

deverá gerar sinal operacional.

---

# Crash Loop

Monitoring deverá detectar:

- Restart Frequency.
- Crash Loop.
- Startup Failure.
- OOM Kill.

---

# Resource Limits

Production Containers deverão possuir limites quando infraestrutura suportar.

Exemplo:

```text
CPU Limit

Memory Limit
```

Isso impede uma instância defeituosa de consumir recursos ilimitados.

---

# Resource Requests

Em Orchestrators que suportem o conceito, deverão existir Resource Requests realistas para scheduling adequado.

---

# Out of Memory

OOM deverá ser monitorado.

```text
Container

↓

Memory Limit Exceeded

↓

OOM Kill
```

A causa deverá ser investigada, não simplesmente resolvida aumentando memória indefinidamente.

---

# CPU Saturation

CPU Saturation deverá ser observável.

Ela poderá indicar:

- Traffic Increase.
- Expensive Operation.
- Infinite Loop.
- Poor Query.
- AI Processing.
- Insufficient Capacity.

---

# Horizontal Scaling

Stateless Containers deverão permitir:

```text
1 Instance

↓

N Instances
```

sem alteração de lógica.

---

# Scaling Principle

A aplicação não deverá assumir:

```text
There is only one server.
```

---

# In-Memory State

Estado em memória não deverá ser utilizado para informação que precisa sobreviver entre requests ou instâncias.

Exemplo perigoso:

```text
Container 1

↓

Stores Session in Memory

↓

Next Request

↓

Container 2

↓

Session Missing
```

---

# Sessions

Sessões deverão utilizar estratégia compatível com múltiplas instâncias.

Possibilidades:

- Signed Tokens.
- Shared Session Store.
- Database-backed Session.

A decisão concreta pertence à arquitetura de Authentication.

---

# Cache

Cache em memória poderá existir para otimização local, desde que a correção do sistema não dependa de sua presença.

---

# Background Jobs

Jobs não deverão depender de execução em um Container HTTP específico.

Preferir:

```text
Queue

↓

Worker Container
```

---

# API Container

Responsabilidade:

```text
HTTP Request

↓

Validation

↓

Application Logic

↓

Response
```

---

# Worker Container

Responsabilidade:

```text
Queue

↓

Job

↓

Processing

↓

Result
```

API e Worker poderão compartilhar Codebase sem necessariamente compartilhar processo.

---

# Scheduler

Scheduled Jobs deverão ser executados através de mecanismo apropriado.

Evitar executar Cron dentro de todas as replicas da API.

Exemplo perigoso:

```text
3 API Containers

↓

Each Runs Cron

↓

Job Executes 3 Times
```

---

# Scheduled Job Architecture

Preferir:

```text
Platform Scheduler

↓

Single Job Execution

↓

Worker / Command
```

ou mecanismo de Distributed Lock quando necessário.

---

# One Process Per Container

Como regra geral:

```text
One Primary Responsibility

per

Container
```

Isso não significa que literalmente apenas um processo de sistema possa existir, mas evita Containers que tentam substituir uma máquina inteira.

---

# Process Managers

Process Manager dentro do Container somente deverá existir quando houver razão concreta.

Horizontal Scaling deverá preferencialmente ser responsabilidade da plataforma.

---

# Logging

Containers deverão escrever Application Logs para:

```text
stdout

stderr
```

quando compatível com o Hosting.

---

# Log Files

Evitar depender de arquivos locais como:

```text
/app/logs/application.log
```

para logs operacionais permanentes.

---

# Structured Logging

Preferir logs estruturados.

Exemplo:

```json
{
  "level": "info",
  "service": "api",
  "environment": "production",
  "version": "2.4.1",
  "message": "request completed"
}
```

---

# Container Metadata

Logs deverão permitir identificar:

```text
service

environment

container / instance

version

git_sha
```

---

# Sensitive Logs

Logs não deverão conter:

- Tokens.
- Passwords.
- Secrets.
- Authorization Headers.
- Dados clínicos completos sem necessidade.
- Payloads sensíveis indiscriminadamente.

---

# Metrics

Containers deverão permitir observação de:

- CPU.
- Memory.
- Restarts.
- Request Rate.
- Error Rate.
- Latency.
- Active Connections.

Detalhes serão definidos em:

```text
05-Monitoring.md
```

---

# Tracing

Em arquitetura distribuída, Tracing poderá conectar:

```text
Web

↓

API

↓

Worker

↓

Database / External Service
```

através de Correlation Context.

---

# Docker Compose

Docker Compose poderá ser utilizado para desenvolvimento local.

Objetivo:

```text
One Command

↓

Local Infrastructure
```

---

# Local Compose Architecture

Exemplo conceitual:

```text
docker compose up

↓

API

Database

Cache

Queue

Development Services
```

A composição real dependerá da infraestrutura adotada.

---

# Production Docker Compose

Docker Compose não deverá ser automaticamente considerado Orchestrator oficial de Production.

Ele poderá ser suficiente em cenários pequenos, mas a decisão deverá considerar:

- Availability.
- Scaling.
- Rollback.
- Health Management.
- Secret Management.
- Operational Complexity.

---

# Local Database

Se Database local for utilizado:

```text
Docker Volume

↓

Development Database
```

poderá fornecer persistência entre restarts.

---

# Local Volumes

Volumes locais são aceitáveis para desenvolvimento.

Eles não representam estratégia oficial de Production Backup.

---

# Development Bind Mounts

Bind Mount poderá permitir Hot Reload.

Exemplo:

```text
Source Code

↓

Bind Mount

↓

Development Container
```

Isso não deverá existir automaticamente em Production.

---

# Development Image

Development Image poderá possuir:

- Dev Dependencies.
- Hot Reload.
- Debugger.
- Test Tools.

---

# Production Image

Production Image deverá priorizar:

- Minimal Runtime.
- No Hot Reload.
- No Debugger exposto.
- No Development Credentials.
- Non-Root User.
- Optimized Build.

---

# Dev/Prod Parity

Development e Production não precisam utilizar imagens idênticas em todos os detalhes.

Entretanto, diferenças relevantes deverão ser minimizadas.

---

# Container Networking

Containers deverão utilizar networking controlado.

Conceitualmente:

```text
Public Network

↓

Gateway

↓

Application Network

↓

Services
```

---

# Public Exposure

Somente serviços que precisam receber tráfego público deverão possuir exposição pública.

Exemplo:

```text
API Gateway

✓ Public
```

```text
Database

✘ Public by default
```

---

# Internal Services

Workers, Cache e outros serviços deverão permanecer internos quando possível.

---

# Database Network

Database deverá aceitar conexões apenas das origens necessárias.

---

# Service Discovery

Serviços não deverão depender de IPs hardcoded.

Preferir:

```text
Service Name

DNS

Platform Discovery
```

---

# Port Configuration

Aplicações deverão permitir configuração da porta através do ambiente quando Hosting exigir.

Exemplo:

```text
PORT
```

---

# CORS

CORS não é responsabilidade do Docker.

Deverá ser configurado pela aplicação conforme:

```text
01-Environments.md
```

---

# TLS

TLS poderá terminar em:

```text
CDN

Load Balancer

Reverse Proxy

Gateway
```

O Container não precisa necessariamente gerenciar certificados diretamente.

---

# Reverse Proxy

Um Reverse Proxy poderá ser utilizado para:

- TLS.
- Routing.
- Compression.
- Request Limits.
- Headers.
- Load Balancing.

A decisão concreta será definida em `04-Hosting.md`.

---

# Container Registry

Production Images deverão ser armazenadas em Registry controlado.

```text
CI

↓

Build Image

↓

Scan

↓

Registry

↓

Deployment
```

---

# Registry Access

Push deverá ser restrito a:

- CI autorizado.
- Administradores necessários.

Pull deverá seguir Least Privilege.

---

# Private Registry

Production Images proprietárias deverão utilizar Registry privado quando apropriado.

---

# Image Naming

Convenção conceitual:

```text
medflow/api

medflow/worker

medflow/ai-service
```

---

# Image Tags

Tags poderão incluir:

```text
Version

Git SHA

Build ID
```

Exemplo:

```text
medflow/api:2.4.1

medflow/api:sha-a8f2c91
```

---

# Production Deployment Reference

Production deverá preferencialmente referenciar:

```text
Immutable Image Digest
```

ou tag imutável controlada.

---

# Image Retention

Imagens anteriores necessárias para Rollback deverão permanecer disponíveis.

---

# Image Cleanup

Registry deverá possuir política para remover:

- Abandoned Preview Images.
- Old Development Builds.
- Unreferenced Images.

Sem remover Artifacts necessários para Rollback.

---

# Vulnerability Scanning

Images deverão ser verificadas antes de Production.

```text
Docker Build

↓

Vulnerability Scan

↓

Security Gate

↓

Registry / Deployment
```

---

# Vulnerability Sources

Problemas podem existir em:

- OS Packages.
- Runtime.
- Application Dependencies.
- Native Libraries.
- Build Tools.

---

# Critical Vulnerabilities

Vulnerabilidade Critical explorável deverá bloquear Production salvo processo formal de exceção.

---

# Image Rebuild

Uma aplicação poderá precisar de novo Build mesmo sem alteração no código quando Base Image receber Security Fix.

```text
Same Application Source

+

Patched Base Image

↓

New Artifact
```

---

# SBOM

Conforme a maturidade aumentar, Images poderão gerar:

```text
Software Bill of Materials
```

ou:

```text
SBOM
```

Ela permite identificar quais componentes fazem parte do Artifact.

---

# SBOM Contents

Poderá incluir:

- OS Packages.
- Runtime.
- Libraries.
- Application Dependencies.
- Versions.

---

# Image Signing

No futuro, Production Images poderão utilizar assinatura criptográfica.

Fluxo:

```text
CI

↓

Build

↓

Scan

↓

Sign

↓

Registry

↓

Verify

↓

Deploy
```

---

# Provenance

Build Provenance poderá registrar:

```text
Source Repository

Commit

Build System

Dependencies

Artifact Digest
```

Isso fortalece Software Supply Chain Security.

---

# CI/CD Integration

Docker deverá integrar-se ao processo definido em:

```text
02-CI-CD.md
```

Fluxo:

```text
Commit

↓

CI Validation

↓

Docker Build

↓

Image Scan

↓

Registry

↓

Staging

↓

Validation

↓

Production
```

---

# Docker Build em Pull Requests

PRs poderão executar Docker Build para garantir que a imagem continua construível.

Entretanto, Production Credentials não deverão ser disponibilizadas.

---

# Production Build

Idealmente:

```text
Merge

↓

Trusted CI Context

↓

Build

↓

Scan

↓

Immutable Image

↓

Registry
```

---

# Build Cache em CI

Docker Layer Cache poderá reduzir Build Time.

O cache não deverá comprometer:

- Determinismo.
- Secret Isolation.
- Artifact Integrity.

---

# Architecture Support

Se o MedFlow precisar suportar múltiplas arquiteturas:

```text
amd64

arm64
```

Images poderão utilizar Multi-Architecture Manifest.

Isso somente deverá ser adotado quando houver necessidade concreta.

---

# Platform Compatibility

Local Development em arquitetura diferente de Production deverá ser considerado nos testes.

---

# Database Containers em Production

Database Production não deverá ser containerizado apenas porque a aplicação utiliza Docker.

Preferir Managed Database quando os requisitos de:

- Backup.
- High Availability.
- Replication.
- Monitoring.
- Recovery.
- Security.

justificarem.

A decisão será detalhada em `04-Hosting.md`.

---

# Cache Containers em Production

O mesmo princípio se aplica a Cache.

Managed Service poderá ser preferível dependendo da escala.

---

# Queue Containers em Production

Message Broker deverá possuir estratégia operacional apropriada.

Executá-lo em Container próprio exige responsabilidade por:

- Persistence.
- Availability.
- Backup.
- Upgrade.
- Monitoring.

---

# Container Orchestration

Docker define Container Packaging.

Ele não define sozinho a estratégia completa de Orchestration.

Possibilidades futuras:

```text
Managed Container Platform

Kubernetes

Cloud Container Service

PaaS

Single Host Container Runtime
```

---

# Kubernetes

Kubernetes não será requisito inicial apenas por expectativa de escala futura.

A adoção deverá ocorrer somente quando benefícios superarem complexidade.

---

# Orchestration Requirements

Qualquer solução escolhida deverá considerar:

- Deployment.
- Restart.
- Health Checks.
- Scaling.
- Networking.
- Secrets.
- Logs.
- Metrics.
- Rollback.
- Resource Limits.

---

# Container Startup Time

Startup deverá ser razoavelmente rápido.

Startup lento afeta:

- Autoscaling.
- Rollout.
- Recovery.
- Health Checks.

---

# Lazy Initialization

Inicializações pesadas poderão ser avaliadas para evitar bloquear startup sem necessidade.

Entretanto, uma instância não deverá ficar Ready antes de estar realmente preparada para atender requisições.

---

# Database Connection Pool

Cada Container poderá possuir Connection Pool.

Com Horizontal Scaling:

```text
Containers

×

Connections per Container

=

Potential Database Connections
```

Esse valor deverá respeitar limites do Database.

---

# Scaling Example

Exemplo:

```text
10 API Containers

×

20 Connections

=

200 Possible Connections
```

A configuração deverá considerar capacidade real.

---

# Connection Cleanup

Shutdown deverá fechar Connections corretamente.

---

# AI Workloads

AI workloads pesados poderão ser separados da API principal.

Exemplo:

```text
API

↓

Queue

↓

AI Worker

↓

AI Provider
```

Isso impede operações demoradas de degradarem diretamente o Request Path.

---

# AI Container Scaling

AI Workers poderão possuir Scaling independente.

```text
API Scale

≠

AI Worker Scale
```

---

# CPU vs GPU Workloads

Caso o MedFlow futuramente execute Models próprios:

```text
CPU Container

or

GPU Container
```

deverão possuir Deployment Profiles separados.

---

# Sensitive AI Data

Container temporário não deverá persistir dados clínicos utilizados por AI além do necessário.

---

# Worker Idempotency

Como Containers podem falhar durante processamento, Jobs deverão ser Idempotent quando possível.

```text
Job Starts

↓

Container Dies

↓

Job Retried

↓

No Duplicate Harm
```

---

# Queue Acknowledgement

Acknowledgement deverá ocorrer somente após estado seguro de processamento conforme semântica da Queue.

---

# Deployment Rollout

Nova Container Image deverá substituir versão anterior de forma controlada.

```text
Version N

↓

Version N+1

↓

Health Validation

↓

Traffic Transition
```

---

# Mixed Versions

Durante Rolling Deployment poderão coexistir:

```text
Version N

+

Version N+1
```

Backend e Database deverão suportar essa janela.

---

# Rollback

Rollback deverá utilizar Artifact anterior.

```text
Image N+1

↓

Failure

↓

Image N
```

Não:

```text
Rebuild old source and hope it is identical
```

---

# Container Debugging

Production Containers deverão evitar ferramentas de debugging desnecessárias.

Diagnóstico deverá preferir:

- Logs.
- Metrics.
- Traces.
- Health Checks.
- Controlled Shell Access quando absolutamente necessário.

---

# Shell Access

Acesso Shell a Production Container deverá ser excepcional.

Containers poderão inclusive não possuir Shell em imagens minimalistas.

---

# SSH

Application Containers não deverão executar SSH Server como padrão.

Acesso operacional deverá utilizar mecanismos do Hosting/Orchestrator.

---

# Immutable Infrastructure

A abordagem deverá preferir:

```text
Do not repair the Container.

Replace the Container.
```

---

# Manual Package Installation

Não instalar pacotes manualmente em Container Production em execução.

Exemplo proibido:

```text
Production Container

↓

apt install something

↓

Continue running modified instance
```

A mudança deverá ocorrer no Dockerfile e gerar novo Artifact.

---

# Drift Prevention

Containerização deverá reduzir Environment Drift.

```text
Dockerfile

↓

Image

↓

Known Runtime
```

---

# Docker Version

Versões de Docker/Build tooling utilizadas no CI deverão ser controladas quando diferenças puderem afetar Build.

---

# Local Developer Experience

O projeto deverá buscar onboarding simples.

Ideal:

```text
Clone Repository

↓

Configure Local Environment

↓

Start Dependencies

↓

Run Application
```

---

# Local Bootstrap

Poderá existir comando como:

```text
docker compose up
```

ou script equivalente.

O comando real deverá ser documentado no Developer Setup.

---

# Seed Integration

Ambiente local poderá integrar Seed Data.

```text
Database Start

↓

Migrations

↓

Seed

↓

Ready
```

Production jamais deverá executar Development Seeds automaticamente.

---

# Local Reset

Poderá existir procedimento explícito:

```text
Reset Local Database

↓

Recreate

↓

Migrate

↓

Seed
```

Esse comando deverá possuir proteção contra Production.

---

# Test Containers

CI poderá utilizar Containers efêmeros para:

- Database.
- Cache.
- Queue.
- Mock Services.

---

# Test Cleanup

Após CI:

```text
Test Infrastructure

↓

Destroy
```

---

# Environment Isolation

Containers de Development, Staging e Production deverão utilizar:

- Secrets diferentes.
- Networks diferentes.
- Databases diferentes.
- Storage diferente.
- Configuration diferente.

Conforme definido em `01-Environments.md`.

---

# Naming Convention

Recursos poderão seguir:

```text
medflow-api-development

medflow-api-staging

medflow-api-production
```

---

# Labels

Container Images poderão possuir Labels.

Exemplo conceitual:

```text
org.opencontainers.image.version

org.opencontainers.image.revision

org.opencontainers.image.source
```

Isso aumenta rastreabilidade.

---

# Timezone

Containers deverão preferencialmente operar em:

```text
UTC
```

conforme estratégia geral da plataforma.

---

# Locale

Business Logic não deverá depender do Locale da Base Image.

---

# Time Synchronization

Containers deverão utilizar tempo do Host/Platform.

---

# DNS

Aplicações deverão tolerar mudanças de IP de dependências e utilizar DNS corretamente.

---

# Retry de Dependências

Startup não deverá depender de loops infinitos como:

```text
while database unavailable:
    sleep forever
```

Retries deverão possuir:

- Backoff.
- Limits.
- Logging.
- Failure behavior.

---

# Runtime Dependency Failure

Serviço externo indisponível após startup deverá utilizar estratégia de Resilience definida pela aplicação.

Docker não substitui:

- Timeout.
- Retry.
- Circuit Breaker.
- Fallback.

---

# Container Security Updates

Production Images deverão ser reconstruídas regularmente para incorporar correções das Base Images.

---

# Image Freshness

Uma imagem antiga pode conter vulnerabilidades mesmo que o código da aplicação não tenha mudado.

---

# Patch Process

Fluxo:

```text
Security Advisory

↓

Base Image / Dependency Update

↓

Build

↓

Tests

↓

Scan

↓

Staging

↓

Production
```

---

# Emergency Container Patch

Correção emergencial deverá gerar nova Image.

Nunca modificar manualmente o Container existente como solução permanente.

---

# Backup

Container Images não substituem Backup.

```text
Image

=

Application Runtime
```

```text
Backup

=

Recoverable Persistent State
```

---

# Disaster Recovery

Em recuperação:

```text
Infrastructure Restored

↓

Known Container Images

↓

Runtime Configuration

↓

Secrets

↓

Persistent Data Restore

↓

Services Start
```

---

# Container Registry Availability

Disaster Recovery deverá considerar disponibilidade das Images necessárias.

---

# Artifact Retention

Versões relevantes deverão permanecer recuperáveis durante período definido pela política de Release.

---

# Production Readiness Checklist

Antes de colocar um serviço containerizado em Production:

| Item | Obrigatório |
|------|-------------|
| Dockerfile versionado | ✅ |
| Base Image controlada | ✅ |
| Multi-Stage Build quando aplicável | ✅ |
| `.dockerignore` | ✅ |
| Nenhum Secret na Image | ✅ |
| Non-Root User quando possível | ✅ |
| Health Check | ✅ |
| Graceful Shutdown | ✅ |
| stdout/stderr logging | ✅ |
| Resource Limits | ✅ |
| Vulnerability Scan | ✅ |
| Image identificável | ✅ |
| Registry configurado | ✅ |
| Runtime Secrets isolados | ✅ |
| Persistent State externo | ✅ |
| Rollback Image disponível | ✅ |
| Staging validado | ✅ |

---

# Dockerfile Review Checklist

| Verificação | Esperado |
|-------------|----------|
| Base Image confiável | Sim |
| Version pinning | Sim |
| `latest` evitado | Sim |
| Build determinístico | Sim |
| Dev Dependencies removidas | Quando aplicável |
| Multi-Stage | Quando aplicável |
| Non-Root | Sim |
| Secrets ausentes | Obrigatório |
| Build Context mínimo | Sim |
| Layer Cache adequado | Sim |
| Runtime mínimo | Sim |
| Entrypoint correto | Sim |

---

# Security Checklist

| Verificação | Obrigatório |
|-------------|-------------|
| No Production Secrets in Image | ✅ |
| No Private Keys | ✅ |
| No `.env` | ✅ |
| No privileged mode | ✅ |
| No Docker Socket | ✅ |
| Least Privilege | ✅ |
| Vulnerability Scan | ✅ |
| Controlled Registry | ✅ |
| Image Traceability | ✅ |
| Security Updates | ✅ |

---

# Anti-Padrões

São considerados Anti-Padrões:

- Utilizar `latest` como única identificação de Production.
- Colocar `.env.production` na Image.
- Colocar Secrets em Dockerfile.
- Executar aplicação como root sem necessidade.
- Utilizar `--privileged`.
- Montar Docker Socket em Application Container.
- Persistir uploads no filesystem efêmero.
- Armazenar Database dentro do API Container.
- Executar múltiplos Crons em todas as replicas.
- Manter Logs críticos apenas no filesystem local.
- Instalar pacotes manualmente em Production Container.
- Modificar Container em execução.
- Utilizar Container como servidor permanente.
- Não implementar Graceful Shutdown.
- Não possuir Health Checks.
- Não definir Resource Limits quando suportado.
- Ignorar OOM.
- Utilizar Build Context contendo Secrets.
- Copiar Git History desnecessariamente.
- Manter Development Tools na Production Image sem necessidade.
- Expor Database publicamente por conveniência.
- Hardcode de IPs.
- Misturar Staging e Production Networks.
- Compartilhar Secrets entre ambientes.
- Utilizar Development Seed em Production.
- Rebuildar versão antiga em vez de utilizar Artifact imutável.
- Ignorar Vulnerability Scan.
- Utilizar Kubernetes sem necessidade operacional real.
- Assumir que Docker substitui Backup.
- Assumir que Docker substitui Monitoring.
- Assumir que Docker sozinho fornece High Availability.

---

# Decisões Arquiteturais

## ADR-187

Docker será utilizado para componentes do MedFlow quando fornecer benefício real de portabilidade, isolamento ou padronização operacional.

---

## ADR-188

Containers de aplicação serão tratados como instâncias descartáveis e substituíveis.

---

## ADR-189

Estado persistente crítico não deverá depender do filesystem interno de Application Containers.

---

## ADR-190

Serviços de aplicação deverão ser Stateless sempre que tecnicamente possível.

---

## ADR-191

Dockerfiles deverão permanecer versionados junto ao código correspondente.

---

## ADR-192

Production Images deverão utilizar Base Images confiáveis e versões controladas.

---

## ADR-193

Multi-Stage Builds serão utilizados quando reduzirem dependências ou superfície de ataque da Production Image.

---

## ADR-194

Secrets não poderão ser incorporados permanentemente às Container Images ou suas Layers.

---

## ADR-195

Runtime Secrets deverão ser fornecidos externamente através da infraestrutura de execução.

---

## ADR-196

Application Containers deverão executar como Non-Root sempre que tecnicamente possível.

---

## ADR-197

Privileged Containers não serão utilizados para serviços normais do MedFlow.

---

## ADR-198

Application Containers não deverão possuir acesso ao Docker Socket sem decisão arquitetural e de segurança explícita.

---

## ADR-199

Containers deverão implementar Graceful Shutdown quando executarem operações que possam permanecer em andamento durante Deployment ou Scale Down.

---

## ADR-200

Serviços containerizados deverão disponibilizar Health Checks apropriados quando aplicável.

---

## ADR-201

Application Logs deverão utilizar stdout/stderr quando compatível com a infraestrutura de Hosting.

---

## ADR-202

Uploads e outros dados persistentes deverão utilizar Storage externo ao Application Container.

---

## ADR-203

Horizontal Scaling não deverá depender de estado local da instância.

---

## ADR-204

Scheduled Jobs não deverão executar implicitamente em todas as replicas da API.

---

## ADR-205

Production Images deverão ser identificáveis através de Version, Git SHA, Digest ou combinação equivalente.

---

## ADR-206

Production deverá utilizar Artifact previamente construído e não modificar Container Images após Build.

---

## ADR-207

Images deverão passar por Vulnerability Scanning antes de Production conforme política de segurança.

---

## ADR-208

Images necessárias para Rollback deverão permanecer disponíveis durante período apropriado.

---

## ADR-209

Docker Compose será considerado principalmente ferramenta de desenvolvimento e não será automaticamente adotado como Orchestrator de Production.

---

## ADR-210

Kubernetes não será requisito inicial e somente será adotado quando sua complexidade for justificada por necessidades operacionais reais.

---

## ADR-211

Production Databases não serão containerizados apenas para manter uniformidade com Application Containers; Managed Services serão avaliados preferencialmente quando apropriados.

---

## ADR-212

Application Containers não executarão SSH Server como mecanismo padrão de administração.

---

## ADR-213

Alterações de Runtime deverão gerar nova Image em vez de modificar Containers existentes.

---

## ADR-214

Docker Images não serão consideradas mecanismo de Backup de dados persistentes.

---

## ADR-215

Container Images deverão ser reconstruídas quando atualizações relevantes de segurança da Base Image ou Runtime exigirem.

---

## ADR-216

O mesmo Artifact deverá ser promovido entre Staging e Production sempre que a infraestrutura permitir.

---

## ADR-217

Workers destinados a processamento assíncrono deverão possuir lifecycle independente da API quando a carga ou confiabilidade justificar.

---

## ADR-218

Jobs executados por Workers deverão ser Idempotent sempre que tecnicamente possível para suportar retries após falhas de Container.

---

## ADR-219

Container Networking deverá seguir Least Exposure, mantendo serviços internos privados sempre que possível.

---

## ADR-220

O MedFlow deverá evoluir progressivamente para mecanismos de Supply Chain Security como SBOM, Artifact Signing e Build Provenance conforme a maturidade operacional justificar.

---

# Estrutura Recomendada

Exemplo conceitual:

```text
/
├── apps/
│   ├── api/
│   │   ├── Dockerfile
│   │   └── .dockerignore
│   │
│   ├── worker/
│   │   ├── Dockerfile
│   │   └── .dockerignore
│   │
│   └── web/
│       └── Dockerfile
│
├── docker/
│   ├── development/
│   └── scripts/
│
├── docker-compose.yml
└── docker-compose.override.yml
```

Essa estrutura é apenas referência arquitetural.

A implementação deverá refletir o estado real do repositório.

Não deverão ser criados arquivos ou Containers sem necessidade apenas para reproduzir esta documentação.

---

# Fluxo de Build

```text
Source Code

↓

Docker Build

↓

Application Build

↓

Runtime Image

↓

Vulnerability Scan

↓

Image Tag

↓

Registry
```

---

# Fluxo de Deployment

```text
Container Registry

↓

Immutable Image

↓

Staging

↓

Health Check

↓

Smoke Test

↓

Production Approval

↓

Production

↓

Health Check

↓

Monitoring
```

---

# Fluxo de Rollback

```text
Version N+1

↓

Deployment

↓

Failure

↓

Stop Rollout

↓

Version N Image

↓

Redeploy

↓

Health Check

↓

Verify
```

---

# Fluxo de Atualização de Segurança

```text
Security Advisory

↓

Base Image Update

↓

New Build

↓

Tests

↓

Vulnerability Scan

↓

Staging

↓

Production
```

---

# Fluxo de Runtime

```text
Container Start

↓

Load Runtime Configuration

↓

Validate Environment

↓

Initialize Application

↓

Readiness = Ready

↓

Receive Traffic

↓

SIGTERM

↓

Readiness = Not Ready

↓

Drain Requests / Jobs

↓

Close Resources

↓

Exit
```

---

# Relação com CI/CD

A fronteira entre os documentos é:

```text
02-CI-CD.md

defines

HOW SOFTWARE MOVES
```

```text
03-Docker.md

defines

HOW CONTAINERIZED SOFTWARE IS PACKAGED
```

```text
04-Hosting.md

defines

WHERE SOFTWARE RUNS
```

```text
05-Monitoring.md

defines

HOW RUNNING SOFTWARE IS OBSERVED
```

```text
06-Release-Process.md

defines

HOW A VERSION BECOMES AN OFFICIAL RELEASE
```

---

# Critérios de Maturidade

A estratégia Docker poderá ser considerada madura quando:

- Builds forem reproduzíveis.
- Images forem pequenas e controladas.
- Production Images não contiverem Secrets.
- Artifacts forem imutáveis.
- Containers forem Stateless quando aplicável.
- Persistent State estiver externo.
- Health Checks existirem.
- Graceful Shutdown funcionar.
- Logs forem centralizáveis.
- Resource Limits estiverem definidos.
- Images forem escaneadas.
- Rollback utilizar Artifact conhecido.
- Registry possuir controle de acesso.
- Environment Isolation estiver preservado.
- CI/CD construir e promover Images automaticamente.
- Runtime puder ser reconstruído sem configuração manual do Host.

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

Security

AI

Audit

Web

Mobile
```

As políticas de Security e Environment Isolation possuem precedência sobre conveniências de containerização.

---

# Considerações Finais

Docker deverá tornar o MedFlow mais previsível, não mais complexo.

A pergunta central não deverá ser:

> "Como colocamos tudo em Docker?"

Mas:

> "Como garantimos que o software executado hoje seja reproduzível, seguro e substituível amanhã?"

Uma aplicação containerizada corretamente deverá permitir:

```text
Known Source

↓

Known Build

↓

Known Image

↓

Known Configuration

↓

Known Runtime
```

Se uma instância desaparecer, outra deverá poder substituí-la.

Se Production apresentar problema, uma versão anterior conhecida deverá poder ser restaurada.

Se um novo desenvolvedor entrar na equipe daqui a anos, ele não deverá precisar descobrir manualmente quais dependências estavam instaladas em um servidor antigo.

A definição deverá estar no código:

```text
Dockerfile

+

Lockfile

+

Configuration Contract

+

CI/CD

=

Reproducible Runtime
```

O Container não será o lugar onde os dados do MedFlow vivem.

O Container será o lugar onde o código do MedFlow executa.

Dados clínicos, arquivos, estado permanente e Secrets deverão possuir ciclos de vida independentes da instância.

Essa separação permitirá que a plataforma evolua de:

```text
One Instance
```

para:

```text
Many Instances
```

e eventualmente para infraestruturas mais sofisticadas sem exigir reconstrução completa da aplicação.

A arquitetura deverá continuar válida mesmo se o Hosting Provider mudar no futuro.

Esse é o objetivo da estratégia de containerização do MedFlow:

```text
Build predictably.

Run securely.

Replace safely.

Scale when necessary.

Recover when something fails.
```

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação da especificação oficial de Containerização, Docker Images, Runtime Security e Container Lifecycle do MedFlow | Equipe MedFlow |