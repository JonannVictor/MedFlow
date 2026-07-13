# Permissions

| Campo | Valor |
|-------|--------|
| Documento | Permissions |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Architecture |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define o sistema oficial de permissões do MedFlow.

As permissões representam a menor unidade de autorização da plataforma.

Enquanto os papéis (Roles) representam conjuntos de responsabilidades, as permissões representam exatamente quais ações um usuário pode executar.

Toda funcionalidade do MedFlow deverá possuir permissões claramente definidas.

---

# Princípios

O sistema de permissões deverá seguir os seguintes princípios.

- Menor privilégio possível;
- Permissões explícitas;
- Negação por padrão;
- Escalabilidade;
- Auditoria;
- Independência dos módulos.

---

# Filosofia

Papéis podem mudar.

Usuários podem mudar.

A arquitetura pode evoluir.

As permissões representam contratos permanentes entre o sistema e seus recursos.

Toda nova funcionalidade deverá nascer acompanhada de suas permissões.

---

# Estrutura

Cada permissão possui quatro componentes.

```text
Resource

↓

Action

↓

Scope

↓

Description
```

---

# Convenção Oficial

Toda permissão deverá seguir o padrão.

```text
resource.action
```

Exemplos.

```text
patients.read

patients.create

patients.update

patients.delete

appointments.create

appointments.cancel

reports.export

finance.manage

settings.update
```

Nunca utilizar nomes genéricos.

Exemplo incorreto.

```text
edit
```

Exemplo correto.

```text
patients.update
```

---

# Recursos Oficiais

Os recursos representam módulos da plataforma.

Lista inicial.

```text
authentication

users

roles

permissions

clinics

patients

professionals

appointments

schedules

medical_records

prescriptions

exams

payments

finance

subscriptions

billing

reports

dashboard

notifications

telemedicine

ai

settings

audit

logs
```

Novos recursos deverão ser adicionados conforme novos módulos surgirem.

---

# Ações Oficiais

As ações representam operações.

Lista oficial.

```text
create

read

update

delete

list

export

import

approve

reject

cancel

restore

archive

manage
```

Novas ações poderão ser adicionadas.

---

# Hierarquia

Nem todas as permissões possuem o mesmo peso.

```text
manage

↓

create

↓

update

↓

read
```

O uso de `manage` deve ser restrito.

Sempre que possível utilizar permissões específicas.

---

# Escopos

Algumas permissões dependem do contexto.

Exemplo.

```text
patients.read.own

patients.read.clinic

patients.read.all
```

Isso permite controlar acesso de forma mais granular.

---

# Exemplo

Profissional.

```text
patients.read.own

medical_records.read.own

appointments.update.own
```

Administrador.

```text
patients.manage

professionals.manage

reports.export

finance.manage
```

Paciente.

```text
appointments.read.own

prescriptions.read.own

exams.read.own
```

---

# Organização

Permissões deverão permanecer agrupadas por módulo.

```text
Patients

patients.create

patients.read

patients.update

patients.delete
```

```text
Appointments

appointments.create

appointments.read

appointments.update

appointments.cancel
```

---

# Convenções

Utilizar:

- inglês;
- minúsculas;
- ponto como separador;
- nomes curtos;
- nomes objetivos.

Nunca utilizar espaços.

Nunca utilizar acentos.

Nunca utilizar abreviações desconhecidas.

---

# Cadastro

Cada permissão deverá possuir.

- id;
- nome;
- descrição;
- recurso;
- ação;
- data de criação;
- status.

---

# Associação

Fluxo.

```text
Permission

↓

Role

↓

User
```

Usuários nunca recebem permissões diretamente.

Sempre através de papéis.

No futuro poderão existir exceções controladas.

---

# Permissões Herdadas

Papéis poderão herdar permissões.

Exemplo.

```text
Administrator

↓

Receptionist

↓

Patient Management
```

A implementação deverá evitar duplicação.

---

# Permissões Dinâmicas

No futuro.

Administradores poderão criar permissões compostas.

Exemplo.

```text
Finance Manager

↓

finance.read

↓

payments.read

↓

reports.export
```

Sem necessidade de alterar código.

---

# Validação

Toda requisição deverá validar.

```text
Usuário

↓

Role

↓

Permission

↓

Tenant

↓

Business Rules

↓

Execução
```

A ausência de qualquer etapa deverá impedir a operação.

---

# Auditoria

Toda alteração deverá registrar.

- usuário;
- data;
- horário;
- permissão alterada;
- papel afetado;
- motivo.

---

# Revogação

Quando uma permissão for removida.

O efeito deverá ser imediato.

Sessões existentes deverão atualizar automaticamente ou invalidar cache de permissões.

---

# Performance

Permissões poderão ser carregadas em memória durante a sessão.

Entretanto.

Toda alteração deverá invalidar imediatamente esse cache.

---

# Eventos

Eventos oficiais.

PermissionCreated

PermissionUpdated

PermissionDeleted

PermissionAssigned

PermissionRemoved

PermissionDenied

PermissionGranted

---

# Checklist

Toda nova funcionalidade deverá definir.

- recurso;
- ação;
- permissão;
- papel responsável;
- auditoria;
- validação;
- documentação.

Nenhum módulo poderá ser desenvolvido sem permissões definidas.

---

# Escalabilidade

O sistema deverá permitir.

- centenas de permissões;
- dezenas de papéis;
- papéis personalizados;
- módulos futuros;
- integrações externas.

Sem necessidade de alterar a arquitetura.

---

# Boas Práticas

Sempre preferir permissões específicas.

Evitar permissões extremamente amplas.

Documentar toda nova permissão.

Remover permissões obsoletas apenas após processo de migração.

Nunca reutilizar identificadores antigos.

---

# Declaração Final

O sistema de permissões representa a camada mais granular de controle de acesso do MedFlow.

Sua correta implementação garante segurança, previsibilidade e flexibilidade para toda a plataforma.

Toda funcionalidade deverá ser construída considerando suas permissões desde o início do desenvolvimento.

---

# Documentos Relacionados

- Authentication
- Authorization
- Multi-Tenant
- Business Rules
- System Architecture
- Security
- Audit
- LGPD