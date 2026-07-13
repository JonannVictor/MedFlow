# Services

| Campo | Valor |
|-------|--------|
| Documento | Services |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Backend |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define a arquitetura oficial da camada de Services do MedFlow.

Os Services representam a camada de aplicação responsável por implementar todos os casos de uso da plataforma.

Toda regra de negócio deverá existir exclusivamente nesta camada.

---

# Filosofia

Os Services representam o cérebro do sistema.

Eles sabem:

- o que fazer;
- quando fazer;
- como fazer.

Eles não sabem:

- como o banco funciona;
- como o frontend funciona;
- como a API funciona.

Essa separação torna a arquitetura mais simples, desacoplada e escalável.

---

# Responsabilidades

Os Services podem:

- implementar regras de negócio;
- validar fluxos;
- coordenar múltiplos repositórios;
- executar transações;
- publicar eventos;
- consumir serviços externos;
- aplicar políticas do domínio.

Os Services nunca deverão:

- acessar banco diretamente;
- receber objetos HTTP;
- conhecer React;
- conhecer tRPC;
- renderizar respostas.

---

# Fluxo

```text
Procedure

↓

Service

↓

Repository

↓

Database
```

Toda regra pertence ao Service.

---

# Estrutura

Cada módulo deverá possuir seus próprios Services.

Exemplo.

```text
patients/

services/

CreatePatient.service.ts

UpdatePatient.service.ts

DeletePatient.service.ts

FindPatient.service.ts

ListPatients.service.ts
```

Cada caso de uso possui um arquivo próprio.

Nunca criar arquivos gigantes contendo dezenas de métodos.

---

# Um Service = Um Caso de Uso

Cada Service deverá possuir uma única responsabilidade.

Exemplo.

✅ Correto

```text
CreateAppointmentService
```

❌ Incorreto

```text
AppointmentService

create()

update()

delete()

cancel()

confirm()

finish()

list()

find()
```

Classes enormes tornam o sistema difícil de manter.

---

# Estrutura Recomendada

```typescript
export class CreatePatientService {

    async execute(input: CreatePatientInput): Promise<CreatePatientOutput> {

    }

}
```

Todo Service deverá possuir apenas um método público.

```
execute()
```

---

# Fluxo Interno

O fluxo recomendado é:

```text
Receber entrada

↓

Validar regras

↓

Consultar repositórios

↓

Executar lógica

↓

Persistir alterações

↓

Publicar eventos

↓

Retornar resultado
```

---

# Exemplo

Criação de paciente.

```text
Procedure

↓

CreatePatientService

↓

Verificar CPF

↓

Verificar Tenant

↓

Criar entidade

↓

Salvar

↓

Publicar PatientCreated

↓

Retornar DTO
```

---

# Comunicação Entre Services

Um Service poderá utilizar outro Service quando fizer sentido.

Entretanto.

Evitar cadeias longas.

Exemplo aceitável.

```text
CreateAppointmentService

↓

CheckScheduleAvailabilityService
```

Exemplo ruim.

```text
Service A

↓

Service B

↓

Service C

↓

Service D

↓

Service E
```

---

# Uso de Repositories

Services nunca acessam banco diretamente.

Sempre.

```text
Service

↓

Repository

↓

Database
```

---

# Eventos

Após concluir operações importantes.

O Service poderá publicar eventos.

Exemplo.

```text
PatientCreated

↓

Notification

↓

Audit

↓

AI

↓

Reports
```

O Service não conhece os consumidores.

---

# Transações

Quando múltiplas operações precisarem ocorrer juntas.

Utilizar transações.

Exemplo.

```text
Criar consulta

↓

Criar prontuário

↓

Criar cobrança

↓

Publicar evento
```

Caso uma etapa falhe.

Toda operação deverá ser revertida.

---

# DTO

Services nunca retornam entidades do banco.

Sempre retornar DTOs.

```text
Database Entity

↓

Mapper

↓

DTO

↓

Procedure
```

---

# Validações

Existem dois tipos.

## Validação Estrutural

Responsabilidade do Zod.

Exemplos.

- campos obrigatórios;
- tipos;
- formatos.

---

## Validação de Negócio

Responsabilidade do Service.

Exemplos.

- CPF duplicado;
- conflito de agenda;
- assinatura expirada;
- consulta encerrada.

---

# Dependências

Os Services deverão receber dependências por injeção.

Nunca criar dependências internamente.

Exemplo.

```typescript
constructor(

    private patientRepository: PatientRepository,

    private eventBus: EventBus

){}
```

---

# Erros

Services lançam apenas erros específicos.

Exemplos.

```text
PatientAlreadyExistsError

AppointmentConflictError

SubscriptionExpiredError
```

Nunca lançar Error genérico.

---

# Logging

Toda operação importante deverá gerar logs.

Exemplos.

- criação;
- atualização;
- exclusão;
- falhas;
- integrações.

---

# Performance

Evitar.

- consultas duplicadas;
- loops desnecessários;
- processamento excessivo;
- chamadas repetidas.

---

# Anti-Patterns

Nunca fazer.

❌ Banco dentro da Procedure

```text
Procedure

↓

Database
```

---

❌ Regra no Repository

```text
Repository

↓

Validação
```

---

❌ Regra no Frontend

```text
Tela

↓

Lógica crítica
```

---

❌ Service gigante

```text
PatientService

4.000 linhas
```

---

# Boas Práticas

✔ Um caso de uso por Service.

✔ Um método execute().

✔ Services pequenos.

✔ Sem dependência de framework.

✔ Sem acesso direto ao banco.

✔ Regras centralizadas.

✔ Fácil de testar.

---

# Testes

Todo Service deverá possuir testes unitários.

Objetivo.

Validar apenas regras de negócio.

Repositories deverão ser simulados através de Mocks.

---

# Escalabilidade

A arquitetura deverá suportar centenas de Services.

A navegação deverá continuar simples.

Novos casos de uso deverão ser adicionados sem alterar os existentes.

---

# Checklist

Todo novo Service deverá responder.

- resolve apenas um caso de uso?
- possui execute()?
- utiliza Repository?
- publica eventos quando necessário?
- utiliza DTO?
- possui testes?
- registra logs?
- lança erros específicos?

Caso qualquer resposta seja negativa.

O Service deverá ser revisado.

---

# Declaração Final

Os Services representam o coração do MedFlow.

Toda regra de negócio da plataforma deverá existir nesta camada.

Uma arquitetura baseada em Services pequenos, independentes e bem definidos garante um sistema mais simples, previsível, testável e preparado para muitos anos de evolução.

---

# Documentos Relacionados

- Project Structure
- tRPC
- Repositories
- Validation
- Error Handling
- Testing
- System Architecture