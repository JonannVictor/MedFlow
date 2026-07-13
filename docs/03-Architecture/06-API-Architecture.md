# API Architecture

| Campo | Valor |
|-------|--------|
| Documento | API Architecture |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Architecture |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define a arquitetura oficial da API do MedFlow.

A API representa o ponto central de comunicação entre todos os clientes da plataforma (Mobile, Web, futuras integrações e Inteligência Artificial) e o Backend.

Toda comunicação deverá seguir os padrões definidos neste documento.

---

# Filosofia

A API do MedFlow deve ser:

- previsível;
- fortemente tipada;
- segura;
- consistente;
- versionável;
- escalável.

O cliente nunca deverá conhecer detalhes internos da implementação.

A API representa um contrato entre o Backend e seus consumidores.

---

# Tecnologia Oficial

O MedFlow utilizará oficialmente:

- tRPC
- TypeScript
- Zod
- Drizzle ORM

Essa combinação garante:

- tipagem ponta a ponta;
- validação automática;
- redução de erros;
- maior produtividade.

---

# Arquitetura Geral

```text
React Native

↓

tRPC Client

↓

HTTP

↓

tRPC Router

↓

Procedure

↓

Service

↓

Repository

↓

Database
```

Nenhuma camada poderá ser ignorada.

---

# Estrutura da API

A API será organizada por módulos.

Exemplo.

```text
auth

patients

professionals

appointments

medicalRecords

prescriptions

payments

reports

notifications

settings
```

Cada módulo possui seu próprio Router.

---

# Estrutura de Pastas

```text
server/

trpc/

routers/

auth/

patients/

appointments/

medicalRecords/

payments/

reports/
```

Cada Router deverá conter apenas Procedures relacionadas ao seu domínio.

---

# Procedures

Existem três tipos oficiais.

---

## Public Procedure

Não exige autenticação.

Exemplos.

- Login
- Recuperação de senha
- Cadastro inicial

---

## Protected Procedure

Exige autenticação.

Obtém automaticamente:

- usuário;
- sessão;
- tenant;
- permissões.

É o tipo mais utilizado.

---

## Admin Procedure

Exige autenticação e permissões administrativas.

Utilizada apenas para operações específicas.

---

# Fluxo de uma Procedure

```text
Request

↓

Validation

↓

Authentication

↓

Authorization

↓

Business Rules

↓

Service

↓

Repository

↓

Database

↓

Response
```

Toda Procedure deverá seguir exatamente este fluxo.

---

# Validação

Toda entrada deverá ser validada utilizando Zod.

Nenhum dado poderá chegar aos Services sem validação.

Exemplo conceitual.

```text
Request

↓

Zod Schema

↓

Dados válidos

↓

Service
```

---

# Services

Procedures nunca implementam regras de negócio.

Elas apenas:

- validam;
- autenticam;
- autorizam;
- chamam Services.

Toda regra pertence aos Services.

---

# Repositories

Services nunca acessam banco diretamente.

Toda persistência ocorre através dos Repositories.

Fluxo.

```text
Procedure

↓

Service

↓

Repository

↓

Database
```

---

# Respostas

Toda Procedure deverá retornar respostas padronizadas.

Exemplo.

```text
Success

↓

data

↓

metadata
```

Ou.

```text
Failure

↓

error

↓

message

↓

code
```

---

# Erros

Todos os erros deverão possuir código.

Exemplo.

```text
AUTH_INVALID_CREDENTIALS

PATIENT_NOT_FOUND

APPOINTMENT_CONFLICT

PAYMENT_FAILED

PERMISSION_DENIED
```

Nunca retornar mensagens técnicas do servidor.

---

# Contexto

Toda Procedure autenticada deverá possuir acesso ao Context.

```text
ctx.user

ctx.clinic

ctx.session

ctx.permissions

ctx.db
```

Nenhuma informação deverá ser buscada novamente caso já exista no Context.

---

# Multi-Tenant

Toda Procedure protegida deverá respeitar o Tenant.

Fluxo.

```text
Request

↓

Tenant

↓

Authorization

↓

Repository

↓

Database
```

Nunca executar consultas sem contexto.

---

# Paginação

Toda listagem deverá suportar paginação.

Padrão.

```text
page

limit

total

hasNext

hasPrevious
```

Paginação evita carregamentos excessivos.

---

# Ordenação

Listagens deverão permitir ordenação.

Exemplos.

- data
- nome
- criação
- atualização

---

# Filtros

Filtros deverão ser opcionais e combináveis.

Exemplo.

```text
Paciente

↓

Nome

↓

Status

↓

Profissional

↓

Data
```

---

# Versionamento

Inicialmente.

Não haverá múltiplas versões da API.

Mudanças incompatíveis deverão ser evitadas.

Quando inevitáveis.

Nova versão deverá ser criada.

---

# Uploads

Uploads nunca deverão trafegar diretamente pelo banco.

Fluxo.

```text
Cliente

↓

Storage

↓

URL

↓

Banco armazena metadados
```

---

# Eventos

Procedures poderão disparar eventos.

Exemplo.

AppointmentCreated

↓

Notification

↓

Audit

↓

AI

↓

Reports

As Procedures nunca deverão conhecer quem consome esses eventos.

---

# Performance

Evitar.

- consultas duplicadas;
- N+1 Queries;
- payloads grandes;
- processamento desnecessário.

Toda Procedure deve retornar apenas o necessário.

---

# Segurança

Toda Procedure deverá:

- validar entrada;
- validar sessão;
- validar permissões;
- validar tenant;
- registrar auditoria quando necessário.

---

# Documentação

Toda nova Procedure deverá possuir:

- descrição;
- entrada;
- saída;
- erros possíveis;
- permissões necessárias.

---

# Convenções

Procedures deverão utilizar verbos.

Exemplos.

```text
createPatient

updatePatient

deletePatient

listPatients

findPatient

confirmAppointment

cancelAppointment
```

Evitar nomes genéricos.

---

# Checklist

Toda nova Procedure deverá responder.

- Possui validação?
- Possui autenticação?
- Possui autorização?
- Respeita Tenant?
- Utiliza Service?
- Utiliza Repository?
- Possui tratamento de erros?
- Está documentada?

Caso qualquer resposta seja negativa.

A Procedure não poderá ser aprovada.

---

# Escalabilidade

A arquitetura deverá suportar.

- novos módulos;
- integrações;
- aplicações externas;
- Webhooks;
- APIs públicas;
- SDKs futuros.

Sem alterações estruturais.

---

# Declaração Final

A API do MedFlow representa a principal interface entre os clientes e o núcleo da plataforma.

Ela deve permanecer consistente, previsível, segura e altamente tipada durante toda a evolução do projeto.

Toda nova funcionalidade deverá integrar-se a essa arquitetura sem criar exceções.

---

# Documentos Relacionados

- System Architecture
- Authentication
- Authorization
- Multi-Tenant
- Services
- Repositories
- Validation
- Error Handling
- Webhooks