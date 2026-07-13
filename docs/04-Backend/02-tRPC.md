# tRPC Architecture

| Campo | Valor |
|-------|--------|
| Documento | tRPC |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Backend |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define a arquitetura oficial da camada tRPC do MedFlow.

O objetivo é estabelecer um padrão único para comunicação entre Frontend, Mobile e Backend, utilizando uma API totalmente tipada, segura e consistente.

Toda Procedure criada no MedFlow deverá seguir as convenções descritas neste documento.

---

# Filosofia

A camada tRPC representa apenas a porta de entrada do sistema.

Ela nunca deverá conter regras de negócio.

Sua responsabilidade é apenas:

- validar entradas;
- autenticar usuários;
- autorizar operações;
- chamar Services;
- retornar respostas.

Toda inteligência da aplicação pertence aos Services.

---

# Arquitetura

```text
Mobile / Web

↓

tRPC Client

↓

Router

↓

Procedure

↓

Service

↓

Repository

↓

Database
```

Cada camada possui responsabilidade única.

---

# Organização

Todos os routers deverão ficar organizados por domínio.

```text
trpc/

routers/

auth/

patients/

professionals/

appointments/

medicalRecords/

payments/

notifications/

reports/
```

Cada módulo possui seu próprio Router.

---

# Estrutura

Exemplo.

```text
patients/

patient.router.ts

patient.procedures.ts

patient.schemas.ts

index.ts
```

Nunca misturar Procedures de módulos diferentes.

---

# Tipos Oficiais

O MedFlow utilizará apenas três tipos de Procedures.

---

## Public Procedure

Não exige autenticação.

Exemplos.

- login;
- recuperação de senha;
- cadastro inicial.

---

## Protected Procedure

Exige autenticação.

Disponibiliza automaticamente.

- usuário;
- sessão;
- tenant;
- permissões.

Será utilizada na maior parte da aplicação.

---

## Admin Procedure

Exige autenticação e permissões administrativas.

Utilizada apenas para operações restritas.

---

# Fluxo de Execução

Toda Procedure deverá seguir exatamente este fluxo.

```text
Request

↓

Zod Validation

↓

Authentication

↓

Authorization

↓

Service

↓

Repository

↓

Database

↓

Response
```

Nenhuma etapa poderá ser ignorada.

---

# Responsabilidades

A Procedure pode.

- validar entrada;
- validar autenticação;
- validar permissões;
- chamar Services;
- retornar resposta.

Nunca poderá.

- acessar banco;
- implementar regra de negócio;
- chamar APIs externas;
- executar cálculos complexos.

---

# Validação

Toda entrada deverá utilizar Schemas Zod.

Exemplo.

```text
Request

↓

PatientSchema

↓

Dados válidos

↓

Service
```

Nenhum dado inválido poderá chegar ao Service.

---

# Context

Toda Procedure autenticada deverá possuir acesso ao Context.

```typescript
ctx.user

ctx.session

ctx.clinic

ctx.permissions

ctx.db

ctx.logger
```

Nunca buscar novamente informações já presentes no Context.

---

# Services

Cada Procedure deverá chamar apenas um Service principal.

Fluxo.

```text
Procedure

↓

Service

↓

Resultado

↓

Procedure

↓

Cliente
```

A Procedure apenas coordena a execução.

---

# Retorno

Todas as Procedures deverão retornar respostas consistentes.

Exemplo.

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Em caso de erro.

```json
{
  "success": false,
  "error": {
    "code": "PATIENT_NOT_FOUND",
    "message": "Paciente não encontrado."
  }
}
```

---

# Paginação

Listagens deverão utilizar.

```text
page

limit

total

hasNext

hasPrevious
```

Nunca retornar listas completas quando houver grande volume de dados.

---

# Ordenação

Toda listagem deverá permitir ordenação.

Exemplos.

- nome;
- data;
- criação;
- atualização.

---

# Filtros

Filtros deverão ser opcionais e combináveis.

Exemplo.

```text
Nome

↓

Status

↓

Profissional

↓

Especialidade
```

---

# Uploads

Uploads não deverão trafegar diretamente pelo tRPC.

Fluxo.

```text
Cliente

↓

Storage Service

↓

Arquivo

↓

Banco
```

O tRPC apenas orquestra o processo.

---

# Eventos

Após operações importantes.

As Procedures poderão disparar eventos.

Exemplo.

```text
AppointmentCreated

↓

Notification

↓

Audit

↓

AI

↓

Reports
```

A Procedure nunca conhece os consumidores desses eventos.

---

# Performance

Boas práticas.

- retornar apenas dados necessários;
- evitar consultas duplicadas;
- evitar processamento pesado;
- utilizar paginação;
- evitar payloads grandes.

---

# Segurança

Toda Procedure deverá.

- validar entrada;
- validar autenticação;
- validar autorização;
- validar Tenant;
- registrar auditoria quando necessário.

---

# Tratamento de Erros

Nenhuma Procedure deverá utilizar try/catch desnecessariamente.

Toda exceção deverá ser encaminhada para o Error Handler Global.

---

# Convenções

Procedures deverão utilizar verbos.

Exemplos.

```text
createPatient()

updatePatient()

deletePatient()

findPatient()

listPatients()

confirmAppointment()

cancelAppointment()
```

Evitar nomes genéricos.

---

# Estrutura Recomendada

```text
patients/

patient.router.ts

patient.schemas.ts

patient.service.ts

patient.repository.ts

patient.events.ts

index.ts
```

Todos os módulos deverão seguir exatamente a mesma organização.

---

# Checklist

Toda nova Procedure deverá responder.

- possui Schema?
- utiliza Service?
- valida autenticação?
- valida autorização?
- respeita Tenant?
- utiliza Context?
- retorna padrão oficial?
- possui documentação?

---

# Escalabilidade

A arquitetura deverá permitir.

- centenas de Procedures;
- dezenas de módulos;
- APIs públicas futuras;
- SDKs;
- integrações externas.

Sem necessidade de alterar a estrutura existente.

---

# Declaração Final

A camada tRPC representa o contrato oficial entre os clientes do MedFlow e o Backend.

Ela deve permanecer simples, consistente e totalmente tipada, delegando toda lógica de negócio para os Services e garantindo que a plataforma evolua de forma organizada e previsível.

---

# Documentos Relacionados

- Project Structure
- Services
- Validation
- Authentication
- Authorization
- API Architecture
- Error Handling