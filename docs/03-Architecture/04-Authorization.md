# Authorization

| Campo | Valor |
|-------|--------|
| Documento | Authorization |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Architecture |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define o modelo oficial de autorização do MedFlow.

Enquanto a autenticação responde **"Quem é o usuário?"**, a autorização responde **"O que esse usuário pode fazer?"**.

Toda operação executada dentro da plataforma deverá passar obrigatoriamente pelo processo de autorização.

---

# Escopo

Este documento define:

- controle de acesso;
- papéis (Roles);
- permissões (Permissions);
- políticas de acesso;
- autorização por recurso;
- autorização por ação;
- autorização contextual;
- herança de permissões.

---

# Princípios

A autorização do MedFlow deverá seguir os seguintes princípios.

- Menor privilégio possível;
- Negação por padrão;
- Permissões explícitas;
- Auditoria completa;
- Escalabilidade.

Nenhum usuário deverá possuir acesso além do necessário.

---

# Fluxo Geral

```text
Request

↓

Authentication

↓

User

↓

Role

↓

Permissions

↓

Authorization

↓

Business Rules

↓

Execução
```

Caso a autorização falhe.

A requisição deverá ser encerrada imediatamente.

---

# Modelo de Controle de Acesso

O MedFlow utilizará um modelo híbrido baseado em:

- RBAC (Role-Based Access Control)
- ABAC (Attribute-Based Access Control)

---

## RBAC

As permissões são concedidas através dos papéis do usuário.

Exemplo.

Administrador

↓

Gerenciar usuários

↓

Gerenciar profissionais

↓

Gerenciar financeiro

---

Recepcionista

↓

Agenda

↓

Pacientes

↓

Check-in

↓

Pagamentos

---

Profissional

↓

Consultas

↓

Prontuários

↓

Receitas

↓

Exames

---

Paciente

↓

Agendamentos

↓

Histórico

↓

Receitas

↓

Exames

---

## ABAC

Além do papel, algumas decisões dependerão do contexto.

Exemplo.

Um profissional poderá visualizar apenas consultas das quais participa.

Mesmo que possua permissão para visualizar consultas.

---

# Papéis Oficiais

O sistema possui os seguintes papéis.

- Patient
- Professional
- Receptionist
- Clinic Administrator
- Super Administrator

Novos papéis poderão ser criados futuramente.

---

# Permissões

Toda permissão seguirá o padrão.

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

payments.refund

reports.export

users.invite
```

Esse padrão facilita organização e escalabilidade.

---

# Estrutura da Permissão

Cada permissão deverá conter.

- identificador;
- recurso;
- ação;
- descrição.

---

# Recursos

Exemplos de recursos.

- users
- patients
- professionals
- appointments
- medical_records
- prescriptions
- exams
- reports
- finance
- payments
- settings
- notifications

---

# Ações

Ações oficiais.

- create
- read
- update
- delete
- approve
- cancel
- export
- manage

Novas ações poderão ser adicionadas.

---

# Hierarquia

Nem todas as permissões possuem o mesmo nível.

Exemplo.

```text
manage

↓

create

↓

update

↓

read
```

Um usuário com "manage" poderá executar todas as ações daquele recurso.

---

# Autorização Contextual

Nem toda autorização depende apenas da permissão.

Exemplo.

Profissional.

↓

Possui permissão para visualizar pacientes.

↓

Pode visualizar apenas pacientes vinculados às suas consultas.

---

Outro exemplo.

Paciente.

↓

Pode visualizar prontuário.

↓

Apenas o próprio.

Nunca de outro paciente.

---

# Multi-Tenant

Antes de validar permissões.

O sistema deverá validar o Tenant.

Fluxo.

```text
Tenant

↓

Role

↓

Permission

↓

Business Rules
```

Mesmo que uma permissão exista.

Ela nunca poderá atravessar o isolamento entre clínicas.

---

# Fluxo de Validação

```text
Usuário autenticado

↓

Sessão válida

↓

Tenant identificado

↓

Role identificado

↓

Permissões carregadas

↓

Contexto validado

↓

Recurso autorizado

↓

Operação executada
```

---

# Permissões Dinâmicas

No futuro.

Administradores poderão criar papéis personalizados.

Exemplo.

Financeiro.

↓

Pode visualizar pagamentos.

↓

Não pode editar pacientes.

↓

Pode exportar relatórios financeiros.

Essa funcionalidade deverá utilizar a mesma arquitetura.

---

# Super Administrador

O Super Administrador possui permissões administrativas da plataforma.

Entretanto.

Mesmo esse perfil deverá respeitar políticas específicas para acesso a dados clínicos.

Operações sensíveis deverão gerar auditoria obrigatória.

---

# Auditoria

Toda falha de autorização deverá ser registrada.

Exemplos.

- acesso negado;
- recurso inexistente;
- tentativa de escalonamento de privilégios;
- acesso entre tenants.

---

# Erros

A API deverá retornar respostas padronizadas.

Exemplo.

```text
401 Unauthorized

Usuário não autenticado.
```

```text
403 Forbidden

Usuário autenticado.

Permissão insuficiente.
```

Nunca revelar informações internas da plataforma.

---

# Cache

Permissões poderão ser armazenadas temporariamente.

Toda alteração de papel ou permissão deverá invalidar imediatamente esse cache.

---

# Eventos

Eventos oficiais.

- PermissionGranted
- PermissionRevoked
- AccessDenied
- RoleAssigned
- RoleRemoved
- AuthorizationFailed

---

# Checklist

Toda nova funcionalidade deverá responder.

- Existe recurso?
- Existe ação?
- Existe permissão?
- Existe validação de Tenant?
- Existe auditoria?
- Existe tratamento para acesso negado?

Se qualquer resposta for negativa.

A implementação não poderá ser aprovada.

---

# Escalabilidade

O modelo deverá permitir.

- novos papéis;
- novas permissões;
- novos módulos;
- políticas contextuais;
- autorização por atributos.

Sem necessidade de reestruturação.

---

# Declaração Final

Authorization representa a principal barreira entre usuários e recursos do MedFlow.

Sua responsabilidade é garantir que cada usuário possa acessar apenas aquilo que realmente necessita.

Uma autorização consistente protege a plataforma, reduz riscos de segurança e preserva a privacidade dos dados de todas as clínicas.

---

# Documentos Relacionados

- Authentication
- Permissions
- Multi-Tenant
- Business Rules
- System Architecture
- Security
- LGPD
- Audit
```