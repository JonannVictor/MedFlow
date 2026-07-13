# Migrations

## Objetivo

Este documento define a estratégia oficial de versionamento da estrutura do banco de dados do MedFlow.

Todas as alterações estruturais deverão ser realizadas exclusivamente através de migrations versionadas, garantindo rastreabilidade, repetibilidade e consistência entre todos os ambientes.

---

# Escopo

As migrations abrangem.

```text
Schemas

Tables

Columns

Constraints

Indexes

Views

Functions

Triggers

Policies (RLS)

Seeds
```

---

# Princípios

As migrations deverão ser.

- Versionadas.
- Imutáveis.
- Determinísticas.
- Reproduzíveis.
- Auditáveis.

Uma migration executada em produção nunca deverá ser modificada.

Correções deverão ocorrer através de novas migrations.

---

# Estrutura

Cada migration deverá possuir.

```text
Identificador

Descrição

Data

Autor

Objetivo

Script

Rollback

Dependências
```

---

# Convenção de Nome

Formato.

```text
YYYYMMDDHHMM_descricao.sql
```

Exemplo.

```text
202607131900_initial_schema.sql

202607141000_create_patient_table.sql

202607151530_add_indexes.sql
```

---

# Ordem de Execução

As migrations deverão seguir exatamente.

```text
Schemas

↓

Extensions

↓

Tables

↓

Foreign Keys

↓

Constraints

↓

Indexes

↓

Views

↓

Functions

↓

Triggers

↓

Policies (RLS)

↓

Seeds
```

---

# Estrutura Inicial

A primeira migration deverá criar.

```text
Schemas

Extensions

Organization

Authentication

Clinical

Medical

Financial

Communication

Infrastructure

Artificial Intelligence
```

---

# Organização por Domínio

Exemplo.

```text
001_initial.sql

002_organization.sql

003_authentication.sql

004_clinical.sql

005_medical.sql

006_financial.sql

007_communication.sql

008_infrastructure.sql

009_ai.sql

010_indexes.sql

011_rls.sql
```

---

# Alterações Permitidas

Uma migration poderá.

- criar tabelas;
- alterar tabelas;
- adicionar colunas;
- remover colunas;
- criar índices;
- criar constraints;
- criar triggers;
- criar funções;
- criar políticas RLS.

---

# Alterações Proibidas

Nunca.

- editar migrations já executadas;
- alterar histórico;
- renumerar migrations.

---

# Rollback

Sempre que possível.

Cada migration deverá possuir rollback documentado.

Exemplo.

```sql
DROP TABLE patient;
```

Quando não houver rollback seguro.

A migration deverá informar explicitamente.

---

# Transações

Sempre que possível.

As migrations deverão executar dentro de transações.

```sql
BEGIN;

...

COMMIT;
```

Em caso de erro.

```sql
ROLLBACK;
```

---

# Dependências

Uma migration nunca deverá depender de estrutura inexistente.

Exemplo.

```text
Patient

↓

MedicalRecord

↓

Diagnosis
```

A ordem deverá respeitar essas dependências.

---

# Versionamento

A versão do banco será determinada pela última migration executada.

Exemplo.

```text
Database Version

v1.0.15
```

---

# Seeds

Dados iniciais deverão possuir migrations independentes.

Exemplos.

```text
Roles

Permissions

Plans

ExamCatalog

MedicationCatalog

Specialties
```

---

# Ambientes

As migrations deverão seguir.

```text
Development

↓

Testing

↓

Staging

↓

Production
```

Nenhuma migration deverá ser aplicada diretamente em produção sem validação prévia.

---

# Auditoria

Cada execução deverá registrar.

```text
Migration

Versão

Data

Usuário

Ambiente

Tempo

Resultado
```

---

# Compatibilidade

As migrations deverão permitir deploy gradual.

Sempre que possível.

As alterações deverão permanecer compatíveis com a versão anterior durante o processo de implantação.

---

# Estratégia para Alterações Destrutivas

Sempre seguir.

```text
Adicionar Nova Estrutura

↓

Migrar Dados

↓

Atualizar Aplicação

↓

Remover Estrutura Antiga
```

Nunca remover colunas utilizadas pela aplicação durante o mesmo deploy.

---

# Ferramentas

As migrations poderão ser executadas utilizando.

```text
Drizzle Kit

Prisma Migrate

Flyway

Liquibase

SQL puro
```

A ferramenta deverá ser padronizada para toda a plataforma.

---

# Boas Práticas

Sempre.

- utilizar transações;
- validar scripts;
- testar rollback;
- revisar impacto em produção;
- documentar alterações relevantes;
- manter histórico completo.

---

# Status

**Documento:** Migrations.md

**Versão:** 1.0

**Status:** ✅ Concluído

**Última atualização:** 2026

---