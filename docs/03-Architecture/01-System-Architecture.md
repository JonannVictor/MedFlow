# System Architecture

| Campo | Valor |
|-------|--------|
| Documento | System Architecture |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Architecture |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define a arquitetura oficial do MedFlow.

Toda decisão técnica, estrutural ou arquitetural deverá respeitar os princípios estabelecidos neste documento.

Ele representa a fonte oficial da arquitetura da plataforma e serve como referência para desenvolvedores, arquitetos de software e Inteligências Artificiais utilizadas durante o desenvolvimento.

---

# Filosofia Arquitetural

O MedFlow foi projetado para ser uma plataforma de longo prazo.

A arquitetura deve permitir evolução contínua sem necessidade de reescritas completas.

Toda decisão arquitetural deve priorizar:

- simplicidade;
- desacoplamento;
- escalabilidade;
- manutenibilidade;
- observabilidade;
- segurança.

---

# Objetivos da Arquitetura

A arquitetura deve permitir que o sistema:

- cresça por módulos;
- suporte milhares de clínicas;
- permita evolução independente dos módulos;
- mantenha baixo acoplamento;
- facilite testes;
- facilite manutenção;
- reduza dívida técnica.

---

# Princípios Arquiteturais

Toda implementação deve respeitar os seguintes princípios.

## Responsabilidade Única

Cada módulo possui apenas uma responsabilidade.

---

## Baixo Acoplamento

Os módulos não conhecem detalhes internos dos demais.

A comunicação acontece apenas através de contratos públicos.

---

## Alta Coesão

Cada módulo agrupa funcionalidades relacionadas ao mesmo domínio.

---

## Escalabilidade

Toda camada deve permitir crescimento horizontal.

---

## Independência Tecnológica

As regras de negócio não devem depender de frameworks específicos.

A troca de tecnologias deve impactar apenas a infraestrutura.

---

# Arquitetura Geral

```text
                 Mobile App
                      │
                      │
                 Web Dashboard
                      │
                      ▼
                tRPC / API Layer
                      │
                      ▼
             Application Services
                      │
                      ▼
             Domain Business Rules
                      │
                      ▼
              Repository Layer
                      │
                      ▼
          PostgreSQL / Supabase
```

---

# Camadas da Arquitetura

O MedFlow utiliza arquitetura em camadas.

Cada camada possui responsabilidades bem definidas.

---

## Presentation Layer

Responsável pela interação com o usuário.

Exemplos:

- React Native
- Web Dashboard

Responsabilidades:

- interface;
- navegação;
- formulários;
- consumo da API.

Nunca conter regras de negócio.

---

## API Layer

Responsável pela comunicação entre cliente e backend.

Tecnologia oficial:

- tRPC

Responsabilidades:

- validação;
- autenticação;
- autorização;
- serialização;
- controle de acesso.

Nunca implementar regras de negócio complexas.

---

## Application Layer

Responsável por orquestrar casos de uso.

Exemplos:

- Create Appointment
- Cancel Appointment
- Generate Report

Responsabilidades:

- coordenar serviços;
- validar fluxo;
- executar operações.

---

## Domain Layer

Coração do sistema.

Contém:

- entidades;
- regras;
- validações;
- comportamento do negócio.

Esta camada não conhece banco de dados.

Não conhece interface.

Não conhece framework.

---

## Infrastructure Layer

Responsável pela comunicação com recursos externos.

Exemplos:

- banco;
- storage;
- filas;
- email;
- push;
- IA;
- gateways.

---

# Organização por Módulos

A plataforma será organizada por domínio.

Exemplo:

```text
Appointments

Patients

Professionals

Finance

Medical Records

Notifications

AI

Reports
```

Cada módulo deverá possuir:

- controllers (quando aplicável);
- procedures;
- services;
- repositories;
- validators;
- entities;
- DTOs;
- testes.

Nenhum módulo poderá acessar diretamente estruturas internas de outro módulo.

---

# Fluxo de uma Requisição

```text
Usuário

↓

Interface

↓

tRPC Procedure

↓

Service

↓

Domain

↓

Repository

↓

Database

↓

Repository

↓

Service

↓

API

↓

Interface
```

Toda requisição deverá seguir este fluxo.

---

# Comunicação Entre Módulos

Os módulos comunicam-se apenas através de serviços públicos.

Exemplo:

Appointments necessita localizar um paciente.

Fluxo:

Appointments Service

↓

Patients Service

↓

Patients Repository

Nunca:

Appointments Repository

↓

Patients Table

Isso reduz acoplamento.

---

# Persistência

Toda persistência deverá ocorrer através de Repositories.

Nunca acessar o banco diretamente em:

- componentes;
- procedures;
- services.

---

# Banco de Dados

Banco oficial.

PostgreSQL.

ORM oficial.

Drizzle ORM.

Toda alteração estrutural deverá ocorrer através de migrations.

---

# Multi-Tenant

Todo dado pertence a uma clínica.

Nenhuma consulta poderá acessar registros de outro tenant.

O isolamento deverá existir em:

- banco;
- APIs;
- cache;
- storage;
- logs.

---

# Storage

Arquivos serão armazenados separadamente do banco.

Exemplos:

- exames;
- receitas;
- imagens;
- anexos.

O banco armazenará apenas metadados.

---

# Eventos

Eventos representam fatos ocorridos no sistema.

Exemplos.

AppointmentCreated

PatientCreated

PaymentApproved

MedicalRecordUpdated

NotificationSent

Esses eventos poderão alimentar:

- auditoria;
- notificações;
- IA;
- integrações futuras.

---

# Background Jobs

Operações demoradas deverão ser executadas de forma assíncrona.

Exemplos:

- envio de emails;
- geração de PDFs;
- notificações;
- processamento de IA;
- importações;
- backups.

Nunca bloquear requisições do usuário.

---

# Inteligência Artificial

A IA será tratada como um serviço externo.

Nunca deverá acessar banco diretamente.

Fluxo.

```text
Sistema

↓

AI Service

↓

Provider

↓

Resposta

↓

Validação

↓

Usuário
```

Toda resposta da IA deverá ser validada antes de impactar dados oficiais.

---

# Observabilidade

Toda operação importante deverá gerar:

- logs;
- métricas;
- auditoria;
- rastreamento.

O objetivo é permitir identificação rápida de problemas.

---

# Segurança

Toda requisição deverá passar por:

- autenticação;
- autorização;
- validação;
- auditoria.

Nenhuma exceção.

---

# Escalabilidade

A arquitetura deve permitir:

- múltiplos servidores;
- balanceamento;
- cache;
- filas;
- processamento distribuído;
- expansão modular.

Sem alterações estruturais.

---

# Evolução

Novos módulos poderão ser adicionados sem modificar módulos existentes.

A arquitetura deve favorecer crescimento incremental.

---

# Decisões Arquiteturais

São obrigatórias.

Toda mudança estrutural deverá gerar um ADR.

Nenhuma decisão arquitetural importante poderá ficar apenas em conversas.

---

# Definição de Arquitetura Saudável

Consideramos a arquitetura saudável quando:

- módulos permanecem independentes;
- responsabilidades são claras;
- regras de negócio permanecem isoladas;
- código é facilmente navegável;
- testes são simples;
- novas funcionalidades podem ser adicionadas sem grandes refatorações.

---

# Declaração Final

A arquitetura do MedFlow foi projetada para suportar muitos anos de evolução.

Ela existe para proteger o projeto da complexidade natural que surge conforme o software cresce.

Toda decisão técnica deve fortalecer essa arquitetura.

Nunca enfraquecê-la.

---

# Documentos Relacionados

- Multi-Tenant
- API Architecture
- Project Structure
- Services
- Repositories
- Database
- Authentication
- Authorization
- Logging
- Observability
- Performance