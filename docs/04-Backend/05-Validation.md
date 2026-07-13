# Repositories

| Campo | Valor |
|-------|--------|
| Documento | Repositories |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Backend |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define a arquitetura oficial da camada de Repositories do MedFlow.

Os Repositories representam a camada responsável exclusivamente pela persistência dos dados.

Eles são a única camada autorizada a comunicar-se diretamente com o banco de dados.

Toda leitura e escrita no PostgreSQL deverá ocorrer através de Repositories.

---

# Filosofia

Repositories existem para esconder os detalhes da persistência.

Os Services não precisam saber:

- qual ORM está sendo utilizado;
- qual banco de dados está sendo utilizado;
- como as consultas são escritas.

Eles apenas solicitam informações.

---

# Responsabilidades

Repositories podem:

- consultar dados;
- inserir registros;
- atualizar registros;
- remover registros;
- executar transações;
- mapear dados.

Repositories nunca podem:

- implementar regras de negócio;
- validar permissões;
- validar autenticação;
- enviar notificações;
- chamar APIs externas.

---

# Fluxo

```text
Service

↓

Repository

↓

Drizzle ORM

↓

PostgreSQL
```

---

# Estrutura

Cada módulo possui seus próprios Repositories.

Exemplo.

```text
patients/

repositories/

PatientRepository.ts

PatientRepository.interface.ts

index.ts
```

---

# Interface

Todo Repository deverá possuir uma interface.

Exemplo.

```typescript
export interface PatientRepository {

    create()

    update()

    delete()

    findById()

    findByCpf()

    list()

}
```

Os Services deverão depender da interface.

Nunca da implementação.

---

# Implementação

A implementação concreta utilizará Drizzle ORM.

Exemplo.

```text
PatientRepository

↓

DrizzlePatientRepository
```

No futuro, outra implementação poderá substituir a atual sem alterar os Services.

---

# Métodos

Os métodos devem representar operações de persistência.

Exemplos.

```text
findById()

findByEmail()

findByCpf()

create()

update()

delete()

exists()

count()

paginate()
```

Evitar métodos genéricos.

---

# Retorno

Repositories retornam entidades ou modelos de persistência.

Nunca DTOs.

Fluxo.

```text
Database

↓

Repository

↓

Entity

↓

Service

↓

DTO

↓

Procedure
```

---

# Consultas

Toda consulta deverá:

- utilizar índices;
- retornar apenas colunas necessárias;
- respeitar Tenant;
- evitar N+1 Queries.

---

# Multi-Tenant

Todo Repository deverá obrigatoriamente considerar o Tenant.

Exemplo.

```text
findById(

tenantId,

patientId
)
```

Jamais permitir consultas abertas.

---

# Soft Delete

Sempre que aplicável.

Utilizar Soft Delete.

Exemplo.

```text
deletedAt
```

Consultas padrão nunca deverão retornar registros removidos.

---

# Paginação

Toda listagem deverá possuir paginação.

Exemplo.

```text
page

limit

order

filters
```

Nunca retornar listas completas.

---

# Transações

Repositories poderão participar de transações.

Entretanto.

A decisão de iniciar uma transação pertence ao Service.

Fluxo.

```text
Service

↓

Transaction

↓

Repository A

↓

Repository B

↓

Commit
```

---

# Erros

Repositories nunca deverão lançar erros de negócio.

Exemplos incorretos.

```text
AppointmentConflictError
```

Exemplo correto.

```text
DatabaseConnectionError

UniqueConstraintViolation

RecordNotFound
```

---

# Logging

Repositories nunca registram logs de negócio.

Apenas erros técnicos relacionados à persistência.

---

# Performance

Boas práticas.

- utilizar índices;
- evitar SELECT *;
- evitar consultas duplicadas;
- evitar loops de consultas;
- limitar resultados.

---

# Mapeamento

Repositories poderão utilizar Mappers.

Fluxo.

```text
Database Row

↓

Mapper

↓

Entity
```

Nunca retornar linhas brutas do banco para os Services.

---

# Anti-Patterns

Nunca fazer.

❌ SQL dentro do Service.

```text
Service

↓

SELECT
```

---

❌ SQL dentro da Procedure.

---

❌ Regras de negócio dentro do Repository.

---

❌ Consultas sem Tenant.

---

❌ SELECT *

Sempre selecionar apenas os campos necessários.

---

# Testes

Todo Repository deverá possuir testes de integração.

Objetivo.

Garantir funcionamento correto das consultas.

---

# Estrutura Recomendada

```text
repositories/

PatientRepository.ts

PatientRepository.interface.ts

PatientMapper.ts

PatientQueries.ts

index.ts
```

---

# Escalabilidade

A arquitetura deverá permitir.

- troca do ORM;
- troca do banco;
- múltiplas implementações;
- otimizações futuras.

Sem alterar os Services.

---

# Checklist

Todo Repository deverá responder.

- utiliza interface?
- respeita Tenant?
- utiliza índices?
- evita SELECT *?
- utiliza paginação?
- retorna entidades?
- não possui regras de negócio?

Caso qualquer resposta seja negativa.

O Repository deverá ser revisado.

---

# Declaração Final

Os Repositories representam a única porta de entrada para o banco de dados do MedFlow.

Sua responsabilidade é abstrair completamente a persistência, permitindo que a camada de Services permaneça focada exclusivamente nas regras de negócio.

Uma arquitetura consistente de Repositories reduz acoplamento, facilita testes e prepara a plataforma para evoluções futuras sem comprometer a estabilidade do sistema.

---

# Documentos Relacionados

- Services
- Database
- Validation
- Project Structure
- Performance
- System Architecture
- Multi-Tenant