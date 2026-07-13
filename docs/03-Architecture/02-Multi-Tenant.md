# Multi-Tenant Architecture

| Campo | Valor |
|-------|--------|
| Documento | Multi-Tenant |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Architecture |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define a arquitetura Multi-Tenant oficial do MedFlow.

Seu objetivo é garantir que múltiplas clínicas utilizem a mesma plataforma de forma totalmente isolada, segura e escalável.

O isolamento entre tenants é um requisito obrigatório da arquitetura.

Nenhuma implementação poderá violar este princípio.

---

# O Que é um Tenant

No MedFlow, um Tenant representa uma organização independente.

Na primeira versão da plataforma, um Tenant corresponde a uma Clínica.

Cada Tenant possui seu próprio ambiente lógico dentro da plataforma.

Exemplos:

- usuários;
- pacientes;
- profissionais;
- consultas;
- prontuários;
- financeiro;
- configurações.

Nenhuma dessas informações poderá ser compartilhada automaticamente entre tenants.

---

# Filosofia

O MedFlow utiliza o modelo:

**Shared Database + Shared Schema + Logical Isolation**

Todos os clientes utilizam a mesma infraestrutura.

O isolamento acontece através das regras de negócio, banco de dados e políticas de acesso.

Essa abordagem oferece:

- menor custo operacional;
- alta escalabilidade;
- facilidade de manutenção;
- deploy único;
- atualizações centralizadas.

---

# Estrutura Geral

```text
                   MedFlow

                      │

        ┌─────────────┼─────────────┐

        │             │             │

     Clínica A     Clínica B     Clínica C

        │             │             │

     Dados A       Dados B       Dados C
```

Todos utilizam o mesmo sistema.

Nenhum consegue acessar dados dos demais.

---

# Identificação do Tenant

Todo contexto autenticado deverá possuir um Tenant ID.

Exemplo.

```text
tenantId

clinicId
```

Esse identificador acompanhará toda requisição.

---

# Fluxo

```text
Login

↓

Usuário autenticado

↓

Tenant identificado

↓

Contexto criado

↓

Todas as consultas utilizam o tenantId

↓

Resposta filtrada
```

---

# Princípio Fundamental

Todo dado pertence a exatamente um Tenant.

Nenhuma exceção.

---

# Entidades Obrigatórias

As seguintes entidades deverão possuir referência obrigatória para Clinic.

- User
- Patient
- Professional
- Appointment
- MedicalRecord
- Prescription
- Exam
- Payment
- Notification
- Invoice
- Report
- Setting

---

# Exemplo

Errado.

```text
Patient

id

name
```

Correto.

```text
Patient

id

clinicId

name
```

---

# Isolamento

Toda consulta deverá filtrar automaticamente pelo tenant.

Exemplo conceitual.

```text
Buscar pacientes

↓

WHERE clinic_id = tenantId
```

Nunca executar consultas sem considerar o Tenant.

---

# Row Level Security

O banco deverá utilizar Row Level Security (RLS) sempre que possível.

As políticas deverão impedir acesso entre clínicas.

Mesmo que ocorra erro na aplicação.

---

# APIs

Toda API deverá conhecer o Tenant atual.

Nenhuma Procedure poderá consultar informações sem contexto.

Fluxo.

```text
Request

↓

Authentication

↓

Tenant

↓

Authorization

↓

Business Rules

↓

Repository
```

---

# Repositories

Repositories nunca deverão receber consultas abertas.

Todo Repository deverá exigir contexto do Tenant.

Exemplo.

Correto.

```text
findPatients(tenantId)
```

Nunca.

```text
findAllPatients()
```

---

# Cache

Caso exista cache.

Ele deverá considerar o Tenant.

Exemplo.

```text
patients:clinic_01

patients:clinic_02

patients:clinic_03
```

Nunca compartilhar cache entre clínicas.

---

# Storage

Arquivos também deverão permanecer isolados.

Exemplo.

```text
clinic-001/

patients/

prescriptions/

exams/
```

Cada clínica possui seu próprio namespace.

---

# Logs

Logs administrativos deverão registrar.

- tenant;
- usuário;
- recurso;
- ação.

Isso facilita auditorias.

---

# Background Jobs

Toda tarefa em segundo plano deverá conhecer o Tenant.

Exemplos.

- notificações;
- IA;
- geração de PDFs;
- backups.

---

# Inteligência Artificial

A IA nunca poderá misturar informações entre clínicas.

Cada requisição deverá utilizar apenas dados pertencentes ao Tenant atual.

---

# Relatórios

Relatórios devem respeitar isolamento.

Administrador da Clínica.

↓

Relatórios apenas da própria clínica.

Nunca globais.

---

# Super Administrador

Super Administradores possuem exceções controladas.

Eles podem visualizar informações administrativas da plataforma.

Exemplos.

- quantidade de clínicas;
- faturamento do SaaS;
- utilização.

Entretanto.

Informações clínicas somente poderão ser acessadas quando houver justificativa operacional devidamente registrada.

---

# Migração

Caso um profissional atenda em múltiplas clínicas.

Ele possuirá múltiplos vínculos.

Nunca compartilhar registros clínicos automaticamente entre clínicas.

Cada clínica mantém seu histórico.

---

# Benefícios

A arquitetura Multi-Tenant oferece.

- escalabilidade;
- menor custo;
- deploy único;
- atualizações simultâneas;
- manutenção simplificada.

Sem comprometer segurança.

---

# Riscos

Os principais riscos são.

- consultas sem filtro;
- cache compartilhado;
- logs incorretos;
- Storage inadequado;
- falhas de autorização.

Esses riscos devem ser tratados como críticos.

---

# Checklist

Toda nova funcionalidade deverá responder.

- Possui tenantId?
- Respeita isolamento?
- Filtra consultas?
- Respeita RLS?
- Respeita permissões?
- Respeita logs?
- Respeita auditoria?
- Respeita Storage?

Caso alguma resposta seja negativa.

A implementação não poderá ser aprovada.

---

# Escalabilidade

A arquitetura deverá permitir.

- milhares de clínicas;
- milhões de pacientes;
- milhões de consultas;
- crescimento horizontal.

Sem alteração estrutural.

---

# Declaração Final

A arquitetura Multi-Tenant representa um dos pilares fundamentais do MedFlow.

O isolamento entre clínicas não é apenas uma funcionalidade.

É uma garantia permanente de segurança, privacidade e confiabilidade.

Toda implementação deverá preservar esse princípio.

---

# Documentos Relacionados

- System Architecture
- Authentication
- Authorization
- Permissions
- RLS
- Database
- Security
- LGPD
- Audit