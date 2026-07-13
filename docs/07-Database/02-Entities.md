# Entities

| Campo | Valor |
|-------|--------|
| Documento | Entities |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Database |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define todas as entidades persistidas do MedFlow.

Cada entidade representa um conceito do domínio de negócio e descreve como as informações são armazenadas, relacionadas e utilizadas ao longo da plataforma.

Este documento funciona como o catálogo oficial de entidades do sistema.

---

# Filosofia

Uma entidade representa algo que possui identidade própria.

Ela não é apenas uma tabela.

Ela representa um conceito do negócio.

Exemplos.

- Paciente;
- Consulta;
- Clínica;
- Profissional;
- Prontuário;
- Pagamento.

Toda entidade deverá possuir uma responsabilidade clara.

Nenhuma entidade deverá acumular responsabilidades de outras.

---

# Objetivos

Este documento deverá responder.

- Qual o propósito da entidade?
- Quais informações ela armazena?
- Quais entidades dependem dela?
- Quais eventos ela produz?
- Quais regras se aplicam?
- Como ela evolui?

---

# Organização

As entidades serão organizadas por domínio.

```text
Organization

Clinical

Scheduling

Medical

Financial

Communication

Infrastructure

Artificial Intelligence
```

Essa organização deverá permanecer consistente com o ERD.

---

# Estrutura Padrão

Toda entidade documentada seguirá exatamente a estrutura abaixo.

```text
Nome

Objetivo

Domínio

Responsabilidades

Relacionamentos

Campos Obrigatórios

Campos Opcionais

Constraints

Índices

Soft Delete

Auditoria

Eventos Produzidos

Eventos Consumidos

Regras de Negócio

Observações
```

Essa estrutura é obrigatória para todas as entidades.

---

# Convenções

Toda entidade deverá seguir.

- Database.md
- ERD.md
- Relationships.md

Nenhuma entidade poderá contrariar esses documentos.

---

# Identidade

Toda entidade persistente deverá possuir.

```text
id (UUID)
```

Como identificador oficial.

Nunca utilizar chaves naturais.

---

# Tenant

Toda entidade pertencente a uma clínica deverá possuir.

```text
clinic_id
```

Garantindo isolamento Multi-Tenant.

---

# Auditoria

Toda entidade deverá indicar.

- se gera auditoria;
- quando gera auditoria;
- quais operações são auditadas.

---

# Eventos

Sempre que aplicável.

A entidade deverá informar.

Eventos produzidos.

Eventos consumidos.

Isso facilitará a integração orientada a eventos.

---

# Versionamento

Toda alteração estrutural em uma entidade deverá atualizar.

- Database.md
- ERD.md
- Entities.md

Sempre manter consistência entre os documentos.

---

# Boas Práticas

✔ Uma entidade representa um único conceito.

✔ Nome autoexplicativo.

✔ Responsabilidade única.

✔ Relacionamentos explícitos.

✔ Documentação completa.

---

# Anti-Patterns

Nunca fazer.

❌ Entidades genéricas.

❌ Entidades duplicadas.

❌ Responsabilidades múltiplas.

❌ Campos sem significado.

❌ Regras espalhadas.

---

# Fluxo de Documentação

Sempre documentar uma entidade seguindo a ordem.

```text
Objetivo

↓

Responsabilidades

↓

Relacionamentos

↓

Campos

↓

Regras

↓

Eventos

↓

Observações
```

---

---

# Entidade — Clinic

## Resumo

A entidade **Clinic** representa uma organização de saúde que utiliza o MedFlow.

Toda operação clínica, administrativa e financeira da plataforma pertence a uma clínica.

A Clinic é considerada o Tenant oficial do sistema.

---

# Objetivo

Representar uma organização de saúde responsável pelos dados, usuários, pacientes, profissionais e configurações pertencentes ao seu ambiente.

Ela define o limite de isolamento entre clientes da plataforma.

---

# Domínio

Organization

---

# Responsabilidades

A entidade Clinic é responsável por.

- identificar um Tenant;
- armazenar informações institucionais;
- definir configurações gerais;
- controlar assinaturas;
- servir como entidade raiz para dados clínicos;
- isolar informações entre clientes.

Nenhuma outra entidade possui essa responsabilidade.

---

# Dono da Entidade

Organization Domain

---

# Dependências

Nenhuma.

A Clinic representa a raiz da arquitetura do MedFlow.

---

# Dependentes

A Clinic é referenciada por diversas entidades.

Exemplos.

```text
Users

Patients

Professionals

Appointments

Medical Records

Prescriptions

Payments

Subscriptions

Notifications

Audit Logs

Settings
```

Quase todas as entidades Multi-Tenant dependem diretamente da Clinic.

---

# Relacionamentos

## Um para Muitos

```text
Clinic

↓

Users
```

---

```text
Clinic

↓

Patients
```

---

```text
Clinic

↓

Professionals
```

---

```text
Clinic

↓

Appointments
```

---

```text
Clinic

↓

Medical Records
```

---

```text
Clinic

↓

Payments
```

---

```text
Clinic

↓

Notifications
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

name

slug

email

document

plan_id

status

created_at

updated_at
```

Outros campos poderão ser adicionados conforme evolução da plataforma.

---

# Campos Opcionais

Exemplos.

```text
phone

website

logo_url

description

timezone

language

deleted_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Unique para slug.
- Unique para document.
- NOT NULL para campos obrigatórios.
- Foreign Key para plan_id.

---

# Índices

Índices recomendados.

```text
slug

document

status

plan_id
```

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo obrigatório.

```text
deleted_at
```

A exclusão física deverá ser evitada.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

ACTIVATE

SUSPEND

DELETE

RESTORE
```

Toda alteração relevante deverá gerar auditoria.

---

# Eventos Produzidos

Exemplos.

```text
ClinicCreated

ClinicUpdated

ClinicActivated

ClinicSuspended

ClinicDeleted

ClinicRestored
```

---

# Eventos Consumidos

Exemplos.

```text
SubscriptionApproved

SubscriptionExpired

PaymentApproved

PlanChanged
```

---

# Regras de Negócio

Uma Clinic.

- representa exatamente um Tenant;
- poderá possuir diversos usuários;
- poderá possuir diversos profissionais;
- poderá possuir diversos pacientes;
- deverá possuir exatamente um plano ativo;
- deverá permanecer isolada das demais clínicas.

---

# Ciclo de Vida

```text
Criada

↓

Configuração Inicial

↓

Ativa

↓

Suspensa

↓

Reativada

↓

Arquivada (Soft Delete)
```

---

# Segurança

Toda consulta envolvendo Clinic deverá respeitar.

- autenticação;
- autorização;
- Row Level Security;
- isolamento Multi-Tenant.

Nenhuma clínica poderá acessar informações pertencentes a outra.

---

# Performance

Consultas por.

- slug;
- status;
- plan_id.

Deverão utilizar índices apropriados.

---

# Observações

A entidade Clinic representa o ponto central da arquitetura Multi-Tenant do MedFlow.

Sua correta implementação é essencial para garantir isolamento entre clientes, segurança da plataforma e escalabilidade futura.

Todas as entidades Multi-Tenant deverão estar direta ou indiretamente relacionadas a uma Clinic.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- RLS.md
- Organization Domain

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

A entidade Clinic será a raiz de todo o modelo Multi-Tenant do MedFlow.

**Motivação**

- Isolamento de dados
- Escalabilidade
- Organização do domínio
- Segurança
- Facilidade de manutenção

**Alternativas Avaliadas**

- Banco separado por clínica
- Schema separado por Tenant
- Organização sem entidade raiz

**Resultado**

Toda informação pertencente a um cliente deverá estar associada direta ou indiretamente a uma Clinic, garantindo isolamento e consistência em toda a plataforma.

---

# Próxima Entidade

---

# Entidade — Plan

## Resumo

A entidade **Plan** representa os planos comerciais disponibilizados pelo MedFlow.

Ela define os limites, recursos e capacidades disponíveis para cada clínica, servindo como base para o sistema de assinaturas e controle de funcionalidades da plataforma.

Os planos são entidades globais e não pertencem a um Tenant específico.

---

# Objetivo

Centralizar a definição dos planos oferecidos pelo MedFlow, permitindo controlar funcionalidades, limites operacionais e regras comerciais de forma padronizada.

---

# Domínio

Organization

---

# Responsabilidades

A entidade Plan é responsável por.

- definir recursos disponíveis;
- controlar limites da plataforma;
- estabelecer regras comerciais;
- servir de base para assinaturas;
- permitir evolução dos produtos oferecidos.

---

# Dono da Entidade

Organization Domain

---

# Dependências

Nenhuma.

Os planos pertencem à plataforma.

Não pertencem às clínicas.

---

# Dependentes

A entidade Plan é utilizada por.

```text
Clinics

Subscriptions

Billing

Invoices

Feature Flags
```

---

# Relacionamentos

## Um para Muitos

```text
Plan

↓

Clinics
```

---

```text
Plan

↓

Subscriptions
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

name

slug

description

price

billing_cycle

status

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
trial_days

max_users

max_patients

max_storage

features

deleted_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Unique para slug.
- NOT NULL para campos obrigatórios.
- CHECK para valores monetários positivos.

---

# Índices

Índices recomendados.

```text
slug

status

billing_cycle
```

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo obrigatório.

```text
deleted_at
```

Planos descontinuados deverão permanecer disponíveis para fins históricos.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

ACTIVATE

DEACTIVATE

DELETE

RESTORE
```

---

# Eventos Produzidos

Exemplos.

```text
PlanCreated

PlanUpdated

PlanActivated

PlanDeactivated

PlanDeleted
```

---

# Eventos Consumidos

Exemplos.

```text
PaymentApproved

SubscriptionRenewed

FeatureReleased
```

---

# Regras de Negócio

Um plano.

- poderá ser utilizado por diversas clínicas;
- poderá possuir diversas assinaturas;
- poderá limitar funcionalidades;
- poderá limitar quantidade de usuários;
- poderá limitar armazenamento;
- poderá ser substituído por versões futuras.

---

# Ciclo de Vida

```text
Criado

↓

Disponível

↓

Em Uso

↓

Descontinuado

↓

Arquivado
```

---

# Segurança

Planos são entidades globais.

Sua administração deverá ser restrita aos administradores da plataforma.

Clínicas poderão visualizar apenas informações necessárias para contratação e gerenciamento da assinatura.

---

# Performance

Consultas por.

- slug;
- status;
- billing_cycle.

Deverão utilizar índices apropriados.

---

# Observações

A entidade Plan representa a camada comercial do MedFlow.

Ela não controla diretamente cobranças.

Sua função é definir quais capacidades estarão disponíveis para uma assinatura ativa.

Mudanças em um plano não deverão afetar automaticamente clínicas já contratantes, salvo quando previsto pela política comercial.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Subscription
- Billing

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

A entidade Plan será responsável por definir os recursos e limitações disponíveis para as clínicas do MedFlow.

**Motivação**

- Organização comercial
- Escalabilidade
- Facilidade de manutenção
- Flexibilidade para novos produtos
- Separação entre regras comerciais e regras de negócio

**Alternativas Avaliadas**

- Configurações diretamente na Clinic
- Planos definidos por código
- Limites distribuídos entre múltiplas tabelas

**Resultado**

Os planos serão entidades independentes, reutilizáveis e gerenciadas centralmente pela plataforma.

---

# Próxima Entidade

---

# Entidade — Subscription

## Resumo

A entidade **Subscription** representa a assinatura ativa ou histórica de uma clínica no MedFlow.

Ela registra qual plano foi contratado, seu período de vigência, situação atual, histórico de renovações e demais informações necessárias para controlar o acesso da clínica aos recursos da plataforma.

Enquanto o **Plan** define o produto, a **Subscription** representa a contratação desse produto por uma clínica.

---

# Objetivo

Representar o vínculo entre uma clínica e um plano comercial, permitindo controlar cobranças, vigência, renovações, cancelamentos e acesso às funcionalidades da plataforma.

---

# Domínio

Organization

---

# Responsabilidades

A entidade Subscription é responsável por.

- vincular uma clínica a um plano;
- controlar vigência da assinatura;
- registrar renovações;
- controlar status da assinatura;
- definir acesso aos recursos contratados;
- manter histórico contratual.

---

# Dono da Entidade

Organization Domain

---

# Dependências

A Subscription depende das entidades.

```text
Clinic

Plan
```

Uma assinatura não pode existir sem uma clínica e um plano válidos.

---

# Dependentes

A Subscription poderá ser utilizada por.

```text
Payments

Invoices

Billing

Feature Flags

Audit Logs
```

---

# Relacionamentos

## Muitos para Um

```text
Subscription

↓

Clinic
```

---

```text
Subscription

↓

Plan
```

---

## Um para Muitos

```text
Subscription

↓

Payments
```

---

```text
Subscription

↓

Invoices
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

clinic_id

plan_id

status

billing_cycle

starts_at

expires_at

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
trial_ends_at

cancelled_at

cancel_reason

renewed_at

external_subscription_id

deleted_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para clinic_id.
- Foreign Key para plan_id.
- NOT NULL para campos obrigatórios.
- CHECK para datas consistentes.

---

# Índices

Índices recomendados.

```text
clinic_id

plan_id

status

expires_at
```

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo obrigatório.

```text
deleted_at
```

O histórico contratual deverá ser preservado.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

RENEW

UPGRADE

DOWNGRADE

CANCEL

RESTORE
```

---

# Eventos Produzidos

Exemplos.

```text
SubscriptionCreated

SubscriptionActivated

SubscriptionRenewed

SubscriptionExpired

SubscriptionCancelled

SubscriptionUpgraded

SubscriptionDowngraded
```

---

# Eventos Consumidos

Exemplos.

```text
PaymentApproved

PaymentFailed

RefundProcessed

TrialExpired
```

---

# Regras de Negócio

Uma assinatura.

- pertence a exatamente uma clínica;
- referencia exatamente um plano;
- poderá gerar diversos pagamentos;
- poderá ser renovada diversas vezes;
- poderá ser cancelada;
- poderá mudar de plano;
- controla o acesso às funcionalidades contratadas.

Apenas uma assinatura poderá estar ativa por clínica em um determinado momento, salvo cenários especiais previamente documentados.

---

# Ciclo de Vida

```text
Criada

↓

Trial (Opcional)

↓

Ativa

↓

Renovada

↓

Expirada

↓

Cancelada

↓

Arquivada
```

---

# Segurança

A administração de assinaturas deverá respeitar as permissões do sistema.

Clínicas poderão visualizar apenas suas próprias assinaturas.

Operações administrativas deverão gerar auditoria obrigatória.

---

# Performance

Consultas por.

- clinic_id;
- status;
- expires_at.

Deverão possuir índices apropriados.

As consultas de validação de acesso deverão ser rápidas, pois ocorrem frequentemente durante o uso da plataforma.

---

# Observações

A Subscription representa o contrato comercial entre a clínica e o MedFlow.

Ela não registra pagamentos diretamente.

Os eventos financeiros pertencem ao domínio Financial e deverão referenciar a assinatura correspondente.

Essa separação mantém baixo acoplamento entre os domínios Organization e Financial.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Clinic
- Plan
- Payment
- Invoice

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

A entidade Subscription será responsável por controlar o ciclo de vida das assinaturas das clínicas, mantendo separação entre regras comerciais e operações financeiras.

**Motivação**

- Separação de responsabilidades
- Histórico contratual
- Escalabilidade
- Flexibilidade para upgrades e downgrades
- Integração com pagamentos

**Alternativas Avaliadas**

- Informações de assinatura diretamente na Clinic
- Controle apenas pelos pagamentos
- Assinaturas sem histórico

**Resultado**

As assinaturas serão entidades independentes, permitindo gerenciamento completo do relacionamento comercial entre as clínicas e o MedFlow.

---

# Próxima Entidade

---

# Entidade — ClinicSettings

## Resumo

A entidade **ClinicSettings** representa todas as configurações operacionais de uma clínica dentro do MedFlow.

Ela centraliza preferências, parâmetros de funcionamento, configurações regionais, integrações e personalizações específicas de cada Tenant.

Enquanto a entidade **Clinic** representa a organização, a **ClinicSettings** representa como essa organização utiliza a plataforma.

---

# Objetivo

Centralizar todas as configurações específicas da clínica em uma única entidade, evitando que informações de configuração fiquem distribuídas por diversas tabelas.

Essa abordagem facilita manutenção, evolução e futuras funcionalidades.

---

# Domínio

Organization

---

# Responsabilidades

A entidade ClinicSettings é responsável por.

- armazenar configurações da clínica;
- definir idioma;
- definir fuso horário;
- configurar horários de funcionamento;
- armazenar integrações;
- controlar preferências operacionais;
- armazenar configurações de notificações;
- definir parâmetros da plataforma.

---

# Dono da Entidade

Organization Domain

---

# Dependências

A entidade depende de.

```text
Clinic
```

Uma configuração nunca poderá existir sem uma clínica.

---

# Dependentes

As configurações poderão ser utilizadas por.

```text
Appointments

Notifications

Authentication

Payments

AI

Reports

Calendar

Integrations
```

---

# Relacionamentos

## Um para Um

```text
Clinic

↓

ClinicSettings
```

Cada clínica deverá possuir exatamente uma configuração principal.

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

clinic_id

timezone

language

currency

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
business_hours

appointment_interval

working_days

notification_settings

branding

ai_settings

payment_settings

calendar_settings

integrations

deleted_at
```

Campos altamente configuráveis poderão utilizar JSONB quando houver justificativa técnica.

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para clinic_id.
- Unique para clinic_id.
- NOT NULL para campos obrigatórios.

---

# Índices

Índices recomendados.

```text
clinic_id
```

Consultas para configurações normalmente serão realizadas pela clínica.

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo obrigatório.

```text
deleted_at
```

Entretanto.

Na maioria dos casos.

As configurações deverão ser atualizadas.

Não recriadas.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

RESTORE

DELETE
```

Toda alteração de configuração deverá gerar auditoria.

---

# Eventos Produzidos

Exemplos.

```text
ClinicSettingsCreated

ClinicSettingsUpdated

TimezoneChanged

LanguageChanged

BusinessHoursUpdated

NotificationSettingsUpdated
```

---

# Eventos Consumidos

Exemplos.

```text
ClinicCreated

SubscriptionChanged

FeatureReleased
```

---

# Regras de Negócio

Uma configuração.

- pertence exatamente a uma clínica;
- deverá existir durante todo o ciclo de vida da clínica;
- poderá ser atualizada diversas vezes;
- deverá refletir imediatamente no comportamento da plataforma;
- poderá controlar funcionalidades futuras.

---

# Ciclo de Vida

```text
Clinic criada

↓

ClinicSettings criada

↓

Atualizações

↓

Novas configurações

↓

Arquivamento (Soft Delete)
```

---

# Segurança

Somente usuários autorizados da própria clínica poderão alterar configurações.

Configurações críticas deverão exigir permissões administrativas.

Alterações deverão gerar auditoria obrigatória.

---

# Performance

As configurações da clínica serão consultadas frequentemente.

Sempre carregar utilizando.

```text
clinic_id
```

Essas consultas deverão possuir baixa latência.

Quando apropriado.

Poderão utilizar cache.

---

# Observações

A entidade ClinicSettings deverá permanecer relativamente pequena.

Informações extremamente específicas poderão ser movidas para entidades próprias conforme a plataforma evoluir.

Ela não deverá se tornar um repositório genérico de configurações.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Clinic
- Notifications
- Authentication
- AI

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

As configurações específicas das clínicas serão centralizadas na entidade ClinicSettings.

**Motivação**

- Organização
- Baixo acoplamento
- Facilidade de manutenção
- Escalabilidade
- Evolução futura

**Alternativas Avaliadas**

- Configurações diretamente na Clinic
- Múltiplas tabelas pequenas
- Configurações distribuídas por módulo

**Resultado**

Foi adotada uma entidade única de configurações por clínica, permitindo evolução consistente da plataforma e simplificando o gerenciamento das preferências operacionais.

---

# Próxima Entidade

---

# Entidade — User

## Resumo

A entidade **User** representa toda pessoa autorizada a acessar o MedFlow.

Ela é responsável pela identidade digital dos usuários da plataforma, controlando autenticação, autorização, auditoria e acesso aos recursos do sistema.

Todo acesso ao MedFlow deverá ocorrer através de uma entidade User.

---

# Objetivo

Representar a identidade de um usuário autenticado, permitindo controlar permissões, sessões, autenticação, auditoria e acesso às funcionalidades da plataforma.

A entidade User não representa um profissional de saúde ou um paciente.

Ela representa uma conta de acesso ao sistema.

---

# Domínio

Authentication

---

# Responsabilidades

A entidade User é responsável por.

- autenticação;
- identificação do usuário;
- autorização;
- controle de acesso;
- gerenciamento de credenciais;
- auditoria;
- gerenciamento de sessões;
- associação com papéis (Roles).

---

# Dono da Entidade

Authentication Domain

---

# Dependências

A entidade depende de.

```text
Clinic
```

Todo usuário pertence a uma clínica.

Exceto usuários internos da plataforma.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Sessions

Roles

Permissions

Audit Logs

Notifications

Appointments

Medical Records

Prescriptions

Payments

Background Jobs
```

Praticamente todos os módulos dependem da identidade do usuário.

---

# Relacionamentos

## Muitos para Um

```text
Users

↓

Clinic
```

---

## Muitos para Muitos

```text
Users

↓

UserRoles

↓

Roles
```

---

## Um para Muitos

```text
User

↓

Sessions
```

---

```text
User

↓

Audit Logs
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

clinic_id

email

password_hash

first_name

last_name

status

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
phone

avatar_url

last_login_at

email_verified_at

two_factor_enabled

locale

timezone

deleted_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para clinic_id.
- Unique para email dentro do Tenant.
- NOT NULL para campos obrigatórios.

---

# Índices

Índices recomendados.

```text
clinic_id

email

status

last_login_at
```

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo obrigatório.

```text
deleted_at
```

Usuários deverão ser desativados.

Não removidos fisicamente.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

LOGIN

LOGOUT

PASSWORD_CHANGED

EMAIL_CHANGED

STATUS_CHANGED

DELETE

RESTORE
```

---

# Eventos Produzidos

Exemplos.

```text
UserCreated

UserUpdated

UserLoggedIn

UserLoggedOut

PasswordChanged

EmailVerified

TwoFactorEnabled

UserDeleted
```

---

# Eventos Consumidos

Exemplos.

```text
ClinicCreated

RoleAssigned

RoleRemoved

InvitationAccepted
```

---

# Regras de Negócio

Um usuário.

- pertence a uma clínica;
- poderá possuir diversos papéis (Roles);
- poderá possuir diversas sessões;
- poderá realizar diversas operações auditáveis;
- poderá ser desativado;
- deverá possuir e-mail válido;
- nunca armazenará senha em texto puro.

---

# Ciclo de Vida

```text
Convite

↓

Cadastro

↓

Ativação

↓

Primeiro Login

↓

Uso Contínuo

↓

Desativação

↓

Arquivamento
```

---

# Segurança

A entidade deverá suportar.

- autenticação segura;
- hash de senha;
- verificação de e-mail;
- autenticação em dois fatores (2FA);
- bloqueio após tentativas excessivas;
- gerenciamento de sessões;
- revogação de acessos.

Nenhuma credencial sensível poderá ser armazenada em texto puro.

---

# Performance

Consultas por.

```text
email

clinic_id

status
```

Deverão possuir índices apropriados.

A autenticação deverá ocorrer com baixa latência.

---

# Observações

A entidade User representa exclusivamente uma identidade de acesso.

Ela não substitui entidades como Professional ou Patient.

Um profissional poderá possuir um User para acessar o sistema.

Entretanto.

As informações profissionais deverão permanecer na entidade Professional.

Essa separação reduz acoplamento e facilita futuras integrações.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Authentication.md
- Role
- Permission
- Session
- Audit

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

A identidade dos usuários será representada exclusivamente pela entidade User, separando autenticação das demais entidades de negócio.

**Motivação**

- Separação de responsabilidades
- Segurança
- Escalabilidade
- Flexibilidade
- Integração com RBAC

**Alternativas Avaliadas**

- Utilizar Professional como usuário
- Utilizar Patient como usuário
- Misturar autenticação com dados de negócio

**Resultado**

A entidade User será a única responsável pela identidade digital dos usuários do MedFlow, servindo como base para autenticação, autorização, auditoria e gerenciamento de acesso.

---

# Próxima Entidade

---

# Entidade — Role

## Resumo

A entidade **Role** representa um conjunto de permissões atribuídas aos usuários do MedFlow.

Ela implementa o modelo de controle de acesso baseado em papéis (RBAC), permitindo agrupar permissões de forma organizada, reutilizável e segura.

Uma Role não representa um usuário.

Ela representa um perfil de acesso.

---

# Objetivo

Definir perfis de acesso reutilizáveis para controlar quais funcionalidades um usuário poderá utilizar dentro da plataforma.

As Roles simplificam o gerenciamento de permissões e reduzem a necessidade de configurações individuais.

---

# Domínio

Authentication

---

# Responsabilidades

A entidade Role é responsável por.

- agrupar permissões;
- representar perfis de acesso;
- facilitar administração de usuários;
- permitir reutilização de permissões;
- suportar diferentes níveis de acesso.

---

# Dono da Entidade

Authentication Domain

---

# Dependências

A entidade Role não depende de outras entidades de negócio.

Ela apenas se relaciona com.

```text
Permissions

Users
```

---

# Dependentes

A entidade é utilizada por.

```text
Users

Permissions

Audit Logs

Authorization
```

---

# Relacionamentos

## Muitos para Muitos

```text
Users

↓

UserRoles

↓

Roles
```

---

```text
Roles

↓

RolePermissions

↓

Permissions
```

Uma Role poderá possuir diversas permissões.

Um usuário poderá possuir diversas Roles.

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

name

slug

description

is_system

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
display_name

color

icon

deleted_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Unique para slug.
- NOT NULL para campos obrigatórios.

---

# Índices

Índices recomendados.

```text
slug

is_system
```

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo obrigatório.

```text
deleted_at
```

Roles removidas deverão permanecer disponíveis para auditoria histórica.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

DELETE

RESTORE

PERMISSION_ATTACHED

PERMISSION_REMOVED
```

---

# Eventos Produzidos

Exemplos.

```text
RoleCreated

RoleUpdated

RoleDeleted

PermissionAssigned

PermissionRemoved
```

---

# Eventos Consumidos

Exemplos.

```text
UserCreated

PermissionCreated

PermissionDeleted
```

---

# Regras de Negócio

Uma Role.

- poderá ser atribuída a diversos usuários;
- poderá possuir diversas permissões;
- poderá ser padrão do sistema;
- poderá ser criada pela plataforma;
- poderá ser personalizada quando permitido.

Uma Role nunca deverá conter lógica de negócio.

Ela apenas agrupa permissões.

---

# Ciclo de Vida

```text
Criada

↓

Configuração

↓

Utilização

↓

Atualizações

↓

Arquivamento
```

---

# Segurança

Roles críticas.

Exemplos.

```text
Super Admin

Platform Admin

Clinic Admin
```

Somente poderão ser alteradas por usuários autorizados.

Alterações deverão gerar auditoria obrigatória.

---

# Performance

Consultas por.

```text
slug

is_system
```

Deverão utilizar índices apropriados.

As Roles poderão ser carregadas em cache para reduzir consultas repetitivas.

---

# Observações

As Roles representam apenas agrupamentos de permissões.

A autorização final será determinada pela combinação entre.

```text
User

↓

Role

↓

Permission
```

Essa arquitetura reduz duplicação e facilita manutenção.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- User
- Permission
- Authorization
- Security

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O MedFlow utilizará RBAC (Role-Based Access Control) como modelo oficial de autorização.

**Motivação**

- Segurança
- Escalabilidade
- Facilidade de administração
- Reutilização de permissões
- Padronização

**Alternativas Avaliadas**

- Permissões diretamente no usuário
- ACL individual
- Controle apenas por código

**Resultado**

As Roles representarão perfis reutilizáveis de acesso, agrupando permissões e simplificando a administração da plataforma.

---

# Próxima Entidade

---

# Entidade — Permission

## Resumo

A entidade **Permission** representa uma ação específica que poderá ser executada dentro do MedFlow.

Ela constitui a menor unidade do sistema de autorização da plataforma e serve como base para o modelo RBAC (Role-Based Access Control).

Permissões nunca são atribuídas diretamente aos usuários.

Elas são concedidas através das Roles.

---

# Objetivo

Definir ações individuais que poderão ser executadas na plataforma, permitindo construir perfis de acesso flexíveis, seguros e reutilizáveis.

---

# Domínio

Authentication

---

# Responsabilidades

A entidade Permission é responsável por.

- definir ações do sistema;
- controlar acesso às funcionalidades;
- servir de base para o RBAC;
- permitir granularidade na autorização;
- facilitar evolução das permissões.

---

# Dono da Entidade

Authentication Domain

---

# Dependências

A entidade Permission não depende de nenhuma entidade de negócio.

Ela apenas se relaciona com.

```text
Roles
```

---

# Dependentes

A entidade é utilizada por.

```text
Roles

Authorization

Audit Logs

Security
```

---

# Relacionamentos

## Muitos para Muitos

```text
Roles

↓

RolePermissions

↓

Permissions
```

Uma permissão poderá pertencer a diversas Roles.

Uma Role poderá possuir diversas permissões.

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

name

slug

resource

action

description

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
category

display_name

is_system

deleted_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Unique para slug.
- NOT NULL para campos obrigatórios.

---

# Índices

Índices recomendados.

```text
slug

resource

action
```

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo obrigatório.

```text
deleted_at
```

Permissões removidas deverão permanecer registradas para fins históricos.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

DELETE

RESTORE

ROLE_ASSIGNED

ROLE_REMOVED
```

---

# Eventos Produzidos

Exemplos.

```text
PermissionCreated

PermissionUpdated

PermissionDeleted

PermissionAssignedToRole

PermissionRemovedFromRole
```

---

# Eventos Consumidos

Exemplos.

```text
RoleCreated

RoleDeleted
```

---

# Regras de Negócio

Uma Permission.

- representa exatamente uma ação;
- poderá pertencer a diversas Roles;
- nunca deverá ser atribuída diretamente ao usuário;
- deverá possuir identificação única;
- deverá permanecer estável ao longo da evolução da plataforma.

---

# Convenção de Nomeação

As permissões deverão seguir o padrão.

```text
resource.action
```

Exemplos.

```text
patients.read

patients.create

patients.update

patients.delete

appointments.schedule

appointments.cancel

medical_records.read

medical_records.update

payments.refund

users.manage
```

Essa convenção facilita organização e pesquisa.

---

# Ciclo de Vida

```text
Criada

↓

Atribuída às Roles

↓

Utilizada

↓

Atualizada

↓

Arquivada
```

---

# Segurança

Permissões críticas.

Exemplos.

```text
users.manage

roles.manage

permissions.manage

billing.manage

system.manage
```

Somente poderão ser atribuídas por administradores autorizados.

Toda alteração deverá gerar auditoria obrigatória.

---

# Performance

Consultas por.

```text
slug

resource

action
```

Deverão utilizar índices apropriados.

As permissões poderão ser carregadas em memória durante autenticação para reduzir consultas repetitivas.

---

# Observações

As Permissions representam exclusivamente ações do sistema.

Exemplo.

```text
patients.read
```

Não representam cargos.

Não representam usuários.

Não representam regras de negócio.

Sua única responsabilidade é definir capacidades que poderão ser agrupadas por Roles.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- User
- Role
- Authorization
- Security

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O MedFlow utilizará permissões individuais como menor unidade do sistema de autorização.

**Motivação**

- Alta granularidade
- Escalabilidade
- Facilidade de manutenção
- Reutilização
- Segurança

**Alternativas Avaliadas**

- Permissões diretamente no código
- Permissões diretamente no usuário
- Perfis fixos sem granularidade

**Resultado**

Todas as ações protegidas da plataforma serão representadas por Permissions, agrupadas por Roles e atribuídas aos usuários através do modelo RBAC.

---

# Próxima Entidade

---

# Entidade — Session

## Resumo

A entidade **Session** representa uma sessão autenticada de um usuário no MedFlow.

Cada login bem-sucedido gera uma nova sessão, permitindo que um mesmo usuário esteja autenticado em múltiplos dispositivos de forma independente.

A Session controla o ciclo de vida da autenticação, permitindo gerenciamento de dispositivos, revogação de acesso e auditoria.

---

# Objetivo

Representar uma sessão autenticada de um usuário, armazenando informações necessárias para controle de acesso, segurança e rastreabilidade.

Cada sessão possui identidade própria e pode ser encerrada independentemente das demais.

---

# Domínio

Authentication

---

# Responsabilidades

A entidade Session é responsável por.

- controlar sessões autenticadas;
- identificar dispositivos ativos;
- permitir logout remoto;
- controlar expiração;
- registrar atividade;
- auxiliar auditoria de segurança.

---

# Dono da Entidade

Authentication Domain

---

# Dependências

A entidade depende de.

```text
User
```

Uma sessão nunca poderá existir sem um usuário.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Authentication

Audit Logs

Security

Notifications

Authorization
```

---

# Relacionamentos

## Muitos para Um

```text
Sessions

↓

User
```

Um usuário poderá possuir diversas sessões simultâneas.

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

user_id

token_hash

device_name

ip_address

user_agent

expires_at

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
last_activity_at

revoked_at

logout_at

device_type

operating_system

browser

location

deleted_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para user_id.
- NOT NULL para campos obrigatórios.
- CHECK para datas consistentes.

---

# Índices

Índices recomendados.

```text
user_id

expires_at

revoked_at

last_activity_at
```

---

# Soft Delete

A entidade normalmente não utilizará Soft Delete.

Sessões expiradas poderão ser removidas por rotinas de limpeza.

Quando houver necessidade de auditoria prolongada, poderão ser arquivadas antes da remoção.

---

# Auditoria

Operações auditadas.

```text
LOGIN

LOGOUT

SESSION_REVOKED

SESSION_EXPIRED

SESSION_REFRESHED
```

---

# Eventos Produzidos

Exemplos.

```text
SessionCreated

SessionExpired

SessionRevoked

SessionRefreshed

UserLoggedOut
```

---

# Eventos Consumidos

Exemplos.

```text
UserLoggedIn

PasswordChanged

AccountLocked

UserDeleted
```

---

# Regras de Negócio

Uma Session.

- pertence exatamente a um usuário;
- poderá ser revogada a qualquer momento;
- deverá possuir data de expiração;
- deverá registrar o dispositivo utilizado;
- poderá coexistir com outras sessões do mesmo usuário;
- deverá ser invalidada quando necessário por políticas de segurança.

---

# Ciclo de Vida

```text
Login

↓

Sessão Criada

↓

Sessão Ativa

↓

Renovação (Opcional)

↓

Logout ou Expiração

↓

Remoção
```

---

# Segurança

A entidade deverá suportar.

- revogação individual;
- logout global;
- controle de dispositivos;
- detecção de sessões expiradas;
- armazenamento apenas do hash do token;
- identificação do dispositivo de origem.

Tokens nunca deverão ser armazenados em texto puro.

---

# Performance

Consultas por.

```text
user_id

expires_at

revoked_at
```

Deverão possuir índices apropriados.

Rotinas automáticas deverão remover sessões expiradas periodicamente para manter o desempenho.

---

# Observações

A Session representa apenas a autenticação ativa.

Ela não substitui Refresh Tokens nem registros permanentes de auditoria.

O histórico de login deverá permanecer disponível através do módulo de Auditoria, mesmo após a remoção das sessões expiradas.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- User
- Authentication
- Security
- Audit

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O MedFlow utilizará uma entidade dedicada para gerenciamento de sessões autenticadas.

**Motivação**

- Segurança
- Controle de dispositivos
- Logout remoto
- Auditoria
- Escalabilidade

**Alternativas Avaliadas**

- Sessões armazenadas apenas em memória
- Controle apenas por JWT sem persistência
- Uma única sessão por usuário

**Resultado**

Cada autenticação gerará uma Session independente, permitindo gerenciamento completo das sessões ativas e fortalecendo a segurança da plataforma.

---

# Próxima Entidade

---

# Entidade — RefreshToken

## Resumo

A entidade **RefreshToken** representa os tokens utilizados para renovar sessões autenticadas sem exigir que o usuário realize um novo login.

Ela faz parte da estratégia de autenticação segura do MedFlow, permitindo a emissão de novos Access Tokens de forma controlada e auditável.

Os Refresh Tokens possuem ciclo de vida próprio e podem ser revogados individualmente.

---

# Objetivo

Permitir a renovação segura de sessões autenticadas, reduzindo a necessidade de logins frequentes sem comprometer a segurança da plataforma.

---

# Domínio

Authentication

---

# Responsabilidades

A entidade RefreshToken é responsável por.

- armazenar Refresh Tokens;
- permitir renovação de Access Tokens;
- controlar expiração;
- permitir revogação individual;
- aumentar a segurança da autenticação;
- registrar reutilizações indevidas.

---

# Dono da Entidade

Authentication Domain

---

# Dependências

A entidade depende de.

```text
User

Session
```

Todo Refresh Token pertence a um usuário e está associado a uma sessão.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Authentication

Security

Audit Logs
```

---

# Relacionamentos

## Muitos para Um

```text
RefreshTokens

↓

User
```

---

```text
RefreshTokens

↓

Session
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

user_id

session_id

token_hash

expires_at

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
revoked_at

last_used_at

replaced_by_token_id

revoke_reason

ip_address

user_agent
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para user_id.
- Foreign Key para session_id.
- NOT NULL para campos obrigatórios.

---

# Índices

Índices recomendados.

```text
user_id

session_id

expires_at

revoked_at
```

---

# Soft Delete

A entidade não utilizará Soft Delete.

Refresh Tokens expirados ou revogados poderão ser removidos periodicamente após o prazo definido pela política de retenção.

---

# Auditoria

Operações auditadas.

```text
CREATE

REFRESH

REVOKE

EXPIRE

TOKEN_REUSE_DETECTED
```

---

# Eventos Produzidos

Exemplos.

```text
RefreshTokenCreated

RefreshTokenUsed

RefreshTokenRevoked

RefreshTokenExpired

RefreshTokenReused
```

---

# Eventos Consumidos

Exemplos.

```text
UserLoggedIn

PasswordChanged

SessionRevoked

UserDeleted
```

---

# Regras de Negócio

Um Refresh Token.

- pertence exatamente a um usuário;
- pertence exatamente a uma sessão;
- deverá possuir data de expiração;
- poderá ser revogado individualmente;
- nunca poderá ser armazenado em texto puro;
- poderá ser substituído por outro durante a renovação.

Sempre que possível deverá ser utilizada a estratégia de **Refresh Token Rotation**.

---

# Ciclo de Vida

```text
Login

↓

Refresh Token Criado

↓

Renovação

↓

Novo Refresh Token

↓

Token Antigo Revogado

↓

Expiração

↓

Remoção
```

---

# Segurança

A entidade deverá suportar.

- Refresh Token Rotation;
- detecção de reutilização;
- revogação individual;
- revogação global;
- expiração automática;
- armazenamento apenas do hash.

Caso um Refresh Token revogado seja reutilizado.

Toda a sessão deverá ser considerada comprometida.

---

# Performance

Consultas por.

```text
session_id

user_id

expires_at
```

Deverão utilizar índices apropriados.

Rotinas automáticas deverão remover tokens expirados periodicamente.

---

# Observações

O Refresh Token não substitui a Session.

A Session representa a autenticação.

O Refresh Token representa o mecanismo de renovação dessa autenticação.

Essa separação aumenta a segurança e facilita futuras evoluções da arquitetura de autenticação.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- User
- Session
- Authentication
- Security

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O MedFlow utilizará Refresh Tokens persistidos com rotação automática e armazenamento por hash para aumentar a segurança da autenticação.

**Motivação**

- Segurança
- Renovação controlada
- Revogação individual
- Detecção de comprometimento
- Escalabilidade

**Alternativas Avaliadas**

- JWT sem Refresh Token
- Refresh Token em texto puro
- Um único token permanente

**Resultado**

Cada sessão autenticada possuirá seus próprios Refresh Tokens, permitindo renovação segura, revogação granular e proteção contra reutilização indevida.

---

# Próxima Entidade

---

# Entidade — LoginAttempt

## Resumo

A entidade **LoginAttempt** registra todas as tentativas de autenticação realizadas no MedFlow.

Seu objetivo é fortalecer a segurança da plataforma, permitindo detectar tentativas de acesso indevido, ataques de força bruta, comportamentos suspeitos e auxiliar investigações de segurança.

Cada tentativa de login gera um registro independente.

---

# Objetivo

Registrar eventos de autenticação para permitir monitoramento, auditoria, análise de segurança e aplicação de políticas de proteção contra acessos maliciosos.

---

# Domínio

Authentication

---

# Responsabilidades

A entidade LoginAttempt é responsável por.

- registrar tentativas de login;
- identificar falhas de autenticação;
- detectar ataques de força bruta;
- apoiar bloqueios automáticos;
- fornecer informações para auditoria;
- auxiliar investigações de segurança.

---

# Dono da Entidade

Authentication Domain

---

# Dependências

A entidade poderá depender de.

```text
User (Opcional)
```

Em tentativas utilizando e-mails inexistentes.

Não haverá User associado.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Authentication

Security

Audit Logs

Monitoring

Fraud Detection
```

---

# Relacionamentos

## Muitos para Um (Opcional)

```text
LoginAttempts

↓

User
```

Uma tentativa poderá não possuir usuário associado.

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

email

success

ip_address

user_agent

attempted_at

created_at
```

---

# Campos Opcionais

Exemplos.

```text
user_id

failure_reason

device_type

browser

operating_system

country

city

blocked

risk_score
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key opcional para user_id.
- NOT NULL para campos obrigatórios.

---

# Índices

Índices recomendados.

```text
email

user_id

ip_address

attempted_at

success
```

---

# Soft Delete

A entidade não utilizará Soft Delete.

Os registros representam histórico de segurança e deverão seguir a política de retenção definida pela plataforma.

---

# Auditoria

Toda tentativa representa um evento de auditoria.

Operações registradas.

```text
LOGIN_SUCCESS

LOGIN_FAILED

ACCOUNT_LOCKED

ACCOUNT_UNLOCKED
```

---

# Eventos Produzidos

Exemplos.

```text
LoginSucceeded

LoginFailed

AccountLocked

SuspiciousLoginDetected

BruteForceDetected
```

---

# Eventos Consumidos

Exemplos.

```text
UserCreated

PasswordChanged

AccountUnlocked
```

---

# Regras de Negócio

Uma tentativa.

- poderá possuir usuário associado;
- poderá falhar por diversos motivos;
- deverá registrar IP;
- deverá registrar User Agent;
- deverá registrar horário;
- poderá aumentar o nível de risco do usuário.

Após múltiplas falhas consecutivas.

Políticas de segurança poderão bloquear temporariamente novas tentativas.

---

# Ciclo de Vida

```text
Tentativa

↓

Validação

↓

Sucesso ou Falha

↓

Registro

↓

Monitoramento

↓

Expiração conforme política de retenção
```

---

# Segurança

A entidade deverá permitir.

- detecção de força bruta;
- detecção de ataques distribuídos;
- bloqueio automático;
- análise comportamental;
- geração de alertas.

Nunca armazenar senhas.

Nem mesmo parcialmente.

---

# Performance

Consultas por.

```text
email

ip_address

attempted_at

success
```

Deverão utilizar índices apropriados.

Como o volume tende a crescer rapidamente.

Políticas de arquivamento e retenção deverão ser consideradas.

---

# Observações

A LoginAttempt não representa uma sessão.

Ela representa apenas uma tentativa de autenticação.

Mesmo logins inválidos deverão ser registrados.

Essa entidade possui grande importância para auditoria, monitoramento e resposta a incidentes de segurança.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- User
- Session
- Authentication
- Security
- Audit

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O MedFlow registrará todas as tentativas de autenticação para fortalecer a segurança da plataforma.

**Motivação**

- Auditoria
- Detecção de ataques
- Bloqueio automático
- Monitoramento
- Conformidade

**Alternativas Avaliadas**

- Registrar apenas logins bem-sucedidos
- Não persistir tentativas
- Controle apenas em memória

**Resultado**

Toda tentativa de autenticação será registrada, permitindo análises de segurança, identificação de comportamentos suspeitos e aplicação de políticas de proteção.

---

# Próxima Entidade

---

# Entidade — UserRole

## Resumo

A entidade **UserRole** representa a associação entre usuários e papéis (Roles) dentro do MedFlow.

Ela implementa o relacionamento Muitos-para-Muitos (N:N) entre as entidades User e Role, permitindo que um usuário possua múltiplos papéis e que um papel seja atribuído a diversos usuários.

Essa entidade faz parte da infraestrutura do modelo RBAC (Role-Based Access Control).

---

# Objetivo

Registrar quais papéis estão atribuídos a cada usuário da plataforma, permitindo um sistema de autorização flexível, reutilizável e escalável.

---

# Domínio

Authentication

---

# Responsabilidades

A entidade UserRole é responsável por.

- vincular usuários às Roles;
- permitir múltiplos papéis por usuário;
- registrar atribuições;
- registrar remoções;
- apoiar auditoria de permissões.

---

# Dono da Entidade

Authentication Domain

---

# Dependências

A entidade depende de.

```text
User

Role
```

Sem essas entidades o relacionamento não existe.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Authorization

Security

Audit Logs

Permission Resolution
```

---

# Relacionamentos

## Muitos para Um

```text
UserRoles

↓

User
```

---

```text
UserRoles

↓

Role
```

---

## Relação Completa

```text
Users

↓

UserRoles

↓

Roles
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

user_id

role_id

assigned_at

created_at
```

---

# Campos Opcionais

Exemplos.

```text
assigned_by

expires_at

revoked_at

deleted_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para user_id.
- Foreign Key para role_id.
- UNIQUE para.

```text
user_id

+

role_id
```

Impedindo atribuições duplicadas.

---

# Índices

Índices recomendados.

```text
user_id

role_id

expires_at
```

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo recomendado.

```text
deleted_at
```

Isso permite preservar o histórico de permissões atribuídas.

---

# Auditoria

Operações auditadas.

```text
ROLE_ASSIGNED

ROLE_REMOVED

ROLE_RESTORED
```

Toda alteração deverá registrar.

- usuário afetado;
- Role;
- responsável pela alteração.

---

# Eventos Produzidos

Exemplos.

```text
RoleAssignedToUser

RoleRemovedFromUser

RoleExpired
```

---

# Eventos Consumidos

Exemplos.

```text
UserCreated

RoleCreated

RoleDeleted

UserDeleted
```

---

# Regras de Negócio

Um UserRole.

- pertence a exatamente um usuário;
- pertence a exatamente uma Role;
- não poderá existir duplicado;
- poderá possuir data de expiração;
- poderá ser revogado;
- deverá gerar auditoria.

---

# Ciclo de Vida

```text
Role Criada

↓

Atribuição

↓

Usuário Utiliza

↓

Revogação

↓

Arquivamento
```

---

# Segurança

Somente usuários autorizados poderão.

- atribuir Roles;
- remover Roles;
- alterar papéis administrativos.

Toda alteração deverá gerar auditoria obrigatória.

---

# Performance

Consultas por.

```text
user_id

role_id
```

Deverão utilizar índices apropriados.

A resolução de permissões deverá ocorrer rapidamente durante autenticação.

---

# Observações

Embora represente uma tabela intermediária.

A UserRole possui comportamento próprio.

Ela registra.

- quando uma Role foi atribuída;
- quem atribuiu;
- quando expirou;
- quando foi removida.

Essas informações são importantes para auditoria e conformidade.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- User
- Role
- Permission
- Authorization

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O relacionamento entre User e Role será implementado através da entidade UserRole, permitindo múltiplos papéis por usuário e preservando histórico de atribuições.

**Motivação**

- Flexibilidade
- Auditoria
- Escalabilidade
- Histórico
- Implementação do RBAC

**Alternativas Avaliadas**

- Role diretamente na tabela User
- Apenas uma Role por usuário
- Relacionamento implícito

**Resultado**

Toda associação entre usuários e papéis será registrada na entidade UserRole, garantindo rastreabilidade, integridade e suporte completo ao modelo RBAC.

---

# Próxima Entidade

---

# Entidade — RolePermission

## Resumo

A entidade **RolePermission** representa a associação entre papéis (Roles) e permissões (Permissions) no MedFlow.

Ela implementa o relacionamento Muitos-para-Muitos (N:N) entre essas entidades, permitindo que uma Role possua diversas permissões e que uma Permission seja reutilizada por múltiplas Roles.

Essa entidade constitui a base do mecanismo de autorização da plataforma.

---

# Objetivo

Registrar quais permissões pertencem a cada Role, permitindo construir perfis de acesso reutilizáveis, flexíveis e seguros.

---

# Domínio

Authentication

---

# Responsabilidades

A entidade RolePermission é responsável por.

- vincular Roles às Permissions;
- implementar o modelo RBAC;
- controlar capacidades dos perfis de acesso;
- registrar alterações nas permissões;
- apoiar auditoria de segurança.

---

# Dono da Entidade

Authentication Domain

---

# Dependências

A entidade depende de.

```text
Role

Permission
```

Sem essas entidades o relacionamento não existe.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Authorization

Security

Audit Logs

Permission Resolution
```

---

# Relacionamentos

## Muitos para Um

```text
RolePermissions

↓

Role
```

---

```text
RolePermissions

↓

Permission
```

---

## Relação Completa

```text
Roles

↓

RolePermissions

↓

Permissions
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

role_id

permission_id

assigned_at

created_at
```

---

# Campos Opcionais

Exemplos.

```text
assigned_by

expires_at

revoked_at

deleted_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para role_id.
- Foreign Key para permission_id.
- UNIQUE para.

```text
role_id

+

permission_id
```

Impedindo permissões duplicadas na mesma Role.

---

# Índices

Índices recomendados.

```text
role_id

permission_id

expires_at
```

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo recomendado.

```text
deleted_at
```

O histórico das permissões atribuídas deverá permanecer disponível para auditoria.

---

# Auditoria

Operações auditadas.

```text
PERMISSION_ASSIGNED

PERMISSION_REMOVED

PERMISSION_RESTORED
```

Toda alteração deverá registrar.

- Role afetada;
- Permission afetada;
- usuário responsável.

---

# Eventos Produzidos

Exemplos.

```text
PermissionAssignedToRole

PermissionRemovedFromRole

RolePermissionsUpdated
```

---

# Eventos Consumidos

Exemplos.

```text
RoleCreated

PermissionCreated

PermissionDeleted

RoleDeleted
```

---

# Regras de Negócio

Um RolePermission.

- pertence exatamente a uma Role;
- pertence exatamente a uma Permission;
- não poderá existir duplicado;
- poderá possuir data de expiração;
- poderá ser revogado;
- deverá gerar auditoria.

---

# Ciclo de Vida

```text
Permission Criada

↓

Atribuição à Role

↓

Role Utiliza

↓

Revogação

↓

Arquivamento
```

---

# Segurança

Somente usuários autorizados poderão.

- conceder permissões;
- remover permissões;
- alterar Roles administrativas.

Permissões críticas deverão exigir privilégios elevados.

Toda alteração deverá gerar auditoria obrigatória.

---

# Performance

Consultas por.

```text
role_id

permission_id
```

Deverão utilizar índices apropriados.

A resolução de permissões deverá ser altamente otimizada, pois ocorre em praticamente todas as requisições autenticadas.

---

# Observações

Embora seja uma tabela intermediária.

A RolePermission representa uma decisão de segurança da plataforma.

Ela registra.

- quando uma Permission foi atribuída;
- quem realizou a atribuição;
- quando foi removida;
- quando expirou.

Essas informações fortalecem auditoria, conformidade e rastreabilidade.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Role
- Permission
- UserRole
- Authorization
- Security

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O relacionamento entre Role e Permission será implementado através da entidade RolePermission, permitindo composição flexível de perfis de acesso e total rastreabilidade das alterações.

**Motivação**

- Flexibilidade
- Reutilização
- Auditoria
- Escalabilidade
- Implementação completa do RBAC

**Alternativas Avaliadas**

- Permissões diretamente na Role
- Permissões codificadas na aplicação
- Relações implícitas

**Resultado**

Toda associação entre Roles e Permissions será registrada na entidade RolePermission, garantindo integridade, auditoria e evolução segura do sistema de autorização.

---

# Encerramento do Domínio

## Authentication Domain ✅

Entidades concluídas.

```text
User

Role

Permission

Session

RefreshToken

LoginAttempt

UserRole

RolePermission
```

---

# Próxima Entidade

---

# Entidade — Patient

## Resumo

A entidade **Patient** representa uma pessoa que recebe atendimento em uma clínica cadastrada no MedFlow.

Ela concentra as informações cadastrais necessárias para identificar o paciente e funciona como ponto central para todo o histórico clínico produzido durante sua jornada na plataforma.

Toda informação clínica deverá estar direta ou indiretamente relacionada a um Patient.

---

# Objetivo

Representar o paciente atendido pela clínica, centralizando sua identificação e servindo como entidade raiz para prontuários, consultas, prescrições, exames e demais registros clínicos.

---

# Domínio

Clinical

---

# Responsabilidades

A entidade Patient é responsável por.

- identificar o paciente;
- armazenar dados cadastrais;
- manter vínculo com a clínica;
- servir como raiz do histórico clínico;
- permitir rastreamento completo da jornada do paciente.

Ela não deverá armazenar informações clínicas detalhadas.

Essas informações pertencem às entidades específicas.

---

# Dono da Entidade

Clinical Domain

---

# Dependências

A entidade depende de.

```text
Clinic
```

Todo paciente pertence exatamente a uma clínica.

---

# Dependentes

A entidade é utilizada por.

```text
Appointments

Medical Records

Prescriptions

Exams

Attachments

Diagnoses

Clinical Notes

Vital Signs

Allergies

Medications

Notifications

Payments
```

Grande parte da plataforma depende da entidade Patient.

---

# Relacionamentos

## Muitos para Um

```text
Patients

↓

Clinic
```

---

## Um para Muitos

```text
Patient

↓

Appointments
```

---

```text
Patient

↓

Medical Records
```

---

```text
Patient

↓

Prescriptions
```

---

```text
Patient

↓

Exams
```

---

```text
Patient

↓

Attachments
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

clinic_id

first_name

last_name

birth_date

gender

document

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
email

phone

mobile_phone

address

city

state

zip_code

country

marital_status

occupation

emergency_contact

emergency_phone

blood_type

photo_url

notes

deleted_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para clinic_id.
- NOT NULL para campos obrigatórios.
- Validação para data de nascimento.
- Documento válido quando informado.

---

# Índices

Índices recomendados.

```text
clinic_id

document

last_name

birth_date
```

Sempre considerar consultas por nome e documento.

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo obrigatório.

```text
deleted_at
```

Pacientes nunca deverão ser removidos fisicamente da base sem procedimento específico aprovado.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

DELETE

RESTORE

MERGE
```

Alterações cadastrais deverão gerar auditoria obrigatória.

---

# Eventos Produzidos

Exemplos.

```text
PatientCreated

PatientUpdated

PatientArchived

PatientRestored

PatientMerged
```

---

# Eventos Consumidos

Exemplos.

```text
AppointmentScheduled

MedicalRecordCreated

ExamRequested

PrescriptionIssued
```

---

# Regras de Negócio

Um Patient.

- pertence exatamente a uma clínica;
- poderá possuir diversas consultas;
- poderá possuir diversos prontuários;
- poderá possuir diversas prescrições;
- poderá possuir diversos exames;
- poderá possuir diversos anexos;
- nunca poderá existir sem uma clínica.

Pacientes duplicados deverão ser tratados através de processo de unificação (Merge).

---

# Ciclo de Vida

```text
Cadastro

↓

Primeiro Atendimento

↓

Histórico Clínico

↓

Atualizações

↓

Arquivamento (Soft Delete)
```

O histórico clínico deverá permanecer preservado durante todo o ciclo de vida do paciente.

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- Row Level Security;
- LGPD.

Somente usuários autorizados da própria clínica poderão acessar dados do paciente.

---

# Performance

Consultas por.

```text
clinic_id

document

last_name

birth_date
```

Deverão utilizar índices apropriados.

Listagens deverão utilizar paginação.

---

# Observações

A entidade Patient representa exclusivamente a identidade do paciente.

Informações clínicas deverão permanecer separadas em entidades específicas como.

```text
MedicalRecord

Diagnosis

Prescription

Exam

ClinicalNote
```

Essa separação reduz acoplamento e facilita evolução do sistema.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Clinic
- Appointment
- MedicalRecord
- Prescription
- Exam

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

A entidade Patient será a raiz de toda a informação clínica produzida no MedFlow.

**Motivação**

- Organização
- Escalabilidade
- Histórico permanente
- Integridade clínica
- Separação de responsabilidades

**Alternativas Avaliadas**

- Informações clínicas diretamente na entidade Patient
- Múltiplas entidades de cadastro
- Histórico distribuído sem entidade central

**Resultado**

Toda informação relacionada ao atendimento de um paciente deverá estar direta ou indiretamente vinculada à entidade Patient, garantindo consistência, rastreabilidade e facilidade de manutenção.

---

# Próxima Entidade

---

# Entidade — Professional

## Resumo

A entidade **Professional** representa um profissional de saúde vinculado a uma clínica do MedFlow.

Ela armazena as informações profissionais necessárias para identificar o responsável pelos atendimentos, permitindo rastrear toda atividade clínica realizada na plataforma.

Todo atendimento deverá possuir um Professional responsável.

---

# Objetivo

Representar profissionais habilitados para realizar atendimentos, emitir prescrições, registrar prontuários e executar atividades clínicas dentro da plataforma.

A entidade Professional representa a identidade profissional.

Ela não representa a conta de acesso ao sistema.

---

# Domínio

Clinical

---

# Classificação da Entidade

```text
Tipo: Entidade de Negócio

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Sim

LGPD: Dados Pessoais

Criticidade: Alta
```

---

# Responsabilidades

A entidade Professional é responsável por.

- identificar profissionais;
- armazenar dados profissionais;
- manter registros de licenças;
- controlar especialidades;
- servir como responsável pelos atendimentos;
- permitir rastreamento das ações clínicas.

---

# Dono da Entidade

Clinical Domain

---

# Dependências

A entidade depende de.

```text
Clinic
```

Opcionalmente.

```text
User
```

Nem todo profissional necessariamente possuirá acesso ao sistema.

---

# Dependentes

A entidade é utilizada por.

```text
Appointments

Medical Records

Prescriptions

Diagnoses

Exams

Clinical Notes

Schedules

Notifications
```

---

# Relacionamentos

## Muitos para Um

```text
Professionals

↓

Clinic
```

---

## Um para Um (Opcional)

```text
Professional

↓

User
```

---

## Muitos para Muitos

```text
Professionals

↓

ProfessionalSpecialties

↓

Specialties
```

---

## Um para Muitos

```text
Professional

↓

Appointments
```

---

```text
Professional

↓

Medical Records
```

---

```text
Professional

↓

Prescriptions
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

clinic_id

first_name

last_name

document

professional_license

status

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
user_id

email

phone

photo_url

biography

signature_url

license_state

license_type

deleted_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para clinic_id.
- Foreign Key opcional para user_id.
- NOT NULL para campos obrigatórios.
- Validação da licença profissional.

---

# Índices

Índices recomendados.

```text
clinic_id

professional_license

last_name

status
```

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo obrigatório.

```text
deleted_at
```

O histórico clínico nunca deverá ser perdido após o desligamento de um profissional.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

ACTIVATE

DEACTIVATE

DELETE

RESTORE
```

---

# Eventos Produzidos

Exemplos.

```text
ProfessionalCreated

ProfessionalUpdated

ProfessionalActivated

ProfessionalDeactivated

ProfessionalArchived
```

---

# Eventos Consumidos

Exemplos.

```text
UserCreated

AppointmentScheduled

ClinicCreated
```

---

# Regras de Negócio

Um Professional.

- pertence exatamente a uma clínica;
- poderá possuir diversas especialidades;
- poderá realizar diversos atendimentos;
- poderá emitir prescrições;
- poderá registrar prontuários;
- poderá possuir uma conta de acesso (User);
- poderá existir sem acesso ao sistema.

---

# Ciclo de Vida

```text
Cadastro

↓

Validação

↓

Ativo

↓

Atendimentos

↓

Desativação

↓

Arquivamento
```

Mesmo após a desativação.

Todo histórico clínico deverá permanecer preservado.

---

# Segurança

Somente usuários autorizados poderão.

- cadastrar profissionais;
- alterar dados profissionais;
- alterar especialidades;
- desativar profissionais.

Alterações deverão gerar auditoria obrigatória.

---

# Performance

Consultas por.

```text
clinic_id

professional_license

status

last_name
```

Deverão possuir índices apropriados.

Consultas relacionadas à agenda deverão priorizar baixa latência.

---

# Observações

A entidade Professional representa exclusivamente informações profissionais.

Credenciais de acesso pertencem à entidade User.

Especialidades pertencem à entidade Specialty.

Agenda pertence ao domínio Scheduling.

Essa separação mantém baixo acoplamento entre os módulos.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- User
- Patient
- Appointment
- MedicalRecord
- Specialty

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

A entidade Professional será responsável por representar os profissionais de saúde da plataforma, mantendo separação entre identidade profissional, autenticação e agenda.

**Motivação**

- Separação de responsabilidades
- Integridade clínica
- Escalabilidade
- Auditoria
- Facilidade de manutenção

**Alternativas Avaliadas**

- Profissional integrado à entidade User
- Informações profissionais diretamente na agenda
- Cadastro simplificado sem entidade própria

**Resultado**

Toda atividade clínica realizada no MedFlow deverá estar vinculada a um Professional, garantindo rastreabilidade, integridade e preservação do histórico.

---

# Próxima Entidade

---

# Entidade — Specialty

## Resumo

A entidade **Specialty** representa uma especialidade profissional disponível no MedFlow.

Ela padroniza as áreas de atuação dos profissionais de saúde, evitando duplicação de informações e garantindo consistência em cadastros, pesquisas e relatórios.

As especialidades são entidades de referência e pertencem à plataforma.

---

# Objetivo

Centralizar o cadastro das especialidades profissionais utilizadas pelo sistema, permitindo reutilização entre diferentes clínicas e profissionais.

---

# Domínio

Clinical

---

# Classificação da Entidade

```text
Tipo: Entidade de Referência

Persistência: Permanente

Multi-Tenant: Não

Auditoria: Obrigatória

Soft Delete: Sim

LGPD: Não se aplica

Criticidade: Média
```

---

# Responsabilidades

A entidade Specialty é responsável por.

- definir especialidades oficiais;
- padronizar nomenclaturas;
- evitar duplicação;
- permitir classificação dos profissionais;
- facilitar pesquisas e relatórios.

---

# Dono da Entidade

Clinical Domain

---

# Dependências

Nenhuma.

As especialidades pertencem à plataforma.

---

# Dependentes

A entidade é utilizada por.

```text
Professionals

ProfessionalSpecialties

Appointments

Reports

Search
```

---

# Relacionamentos

## Muitos para Muitos

```text
Professionals

↓

ProfessionalSpecialties

↓

Specialties
```

Uma especialidade poderá ser utilizada por diversos profissionais.

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

name

slug

status

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
description

display_order

icon

deleted_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Unique para name.
- Unique para slug.
- NOT NULL para campos obrigatórios.

---

# Índices

Índices recomendados.

```text
name

slug

status
```

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo obrigatório.

```text
deleted_at
```

Especialidades descontinuadas deverão permanecer disponíveis para preservar o histórico.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

ACTIVATE

DEACTIVATE

DELETE

RESTORE
```

---

# Eventos Produzidos

Exemplos.

```text
SpecialtyCreated

SpecialtyUpdated

SpecialtyActivated

SpecialtyDeactivated
```

---

# Eventos Consumidos

Exemplos.

```text
ProfessionalCreated

ProfessionalUpdated
```

---

# Regras de Negócio

Uma Specialty.

- poderá ser utilizada por diversos profissionais;
- poderá ser desativada;
- não deverá ser excluída fisicamente quando estiver em uso;
- deverá possuir nome único;
- deverá manter consistência histórica.

---

# Ciclo de Vida

```text
Criação

↓

Disponível

↓

Utilização

↓

Desativação

↓

Arquivamento
```

---

# Segurança

Somente administradores autorizados poderão.

- criar especialidades;
- editar especialidades;
- desativar especialidades.

Alterações deverão gerar auditoria obrigatória.

---

# Performance

Consultas por.

```text
name

slug

status
```

Deverão utilizar índices apropriados.

As especialidades poderão ser armazenadas em cache devido à baixa frequência de alterações.

---

# Observações

A entidade Specialty representa um catálogo de referência.

Ela não pertence a uma clínica específica.

Sua utilização garante padronização em toda a plataforma e facilita integrações futuras com órgãos reguladores e sistemas externos.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Professional
- ProfessionalSpecialties
- Appointment

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

A entidade Specialty será utilizada como catálogo centralizado de especialidades profissionais do MedFlow.

**Motivação**

- Padronização
- Reutilização
- Integridade dos dados
- Facilidade de manutenção
- Consistência em relatórios

**Alternativas Avaliadas**

- Especialidades em texto livre
- Especialidades cadastradas por clínica
- Lista fixa no código da aplicação

**Resultado**

Todas as especialidades utilizadas na plataforma serão cadastradas na entidade Specialty, garantindo padronização, reutilização e preservação do histórico.

---

# Próxima Entidade

---

# Entidade — ProfessionalSpecialty

## Resumo

A entidade **ProfessionalSpecialty** representa a associação entre profissionais e especialidades no MedFlow.

Ela implementa o relacionamento Muitos-para-Muitos (N:N) entre as entidades Professional e Specialty, permitindo que um profissional atue em diversas especialidades e que uma especialidade seja compartilhada por diversos profissionais.

Essa entidade faz parte da infraestrutura do domínio Clinical.

---

# Objetivo

Registrar quais especialidades pertencem a cada profissional, mantendo um relacionamento flexível, reutilizável e historicamente rastreável.

---

# Domínio

Clinical

---

# Classificação da Entidade

```text
Tipo: Entidade de Relacionamento

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Sim

LGPD: Não se aplica

Criticidade: Média
```

---

# Responsabilidades

A entidade ProfessionalSpecialty é responsável por.

- vincular profissionais às especialidades;
- permitir múltiplas especialidades;
- registrar atribuições;
- registrar remoções;
- manter histórico de alterações.

---

# Dono da Entidade

Clinical Domain

---

# Dependências

A entidade depende de.

```text
Professional

Specialty
```

Sem essas entidades o relacionamento não existe.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Appointments

Scheduling

Reports

Search

Professional Profile
```

---

# Relacionamentos

## Muitos para Um

```text
ProfessionalSpecialties

↓

Professional
```

---

```text
ProfessionalSpecialties

↓

Specialty
```

---

## Relação Completa

```text
Professionals

↓

ProfessionalSpecialties

↓

Specialties
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

professional_id

specialty_id

created_at
```

---

# Campos Opcionais

Exemplos.

```text
assigned_by

is_primary

notes

deleted_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para professional_id.
- Foreign Key para specialty_id.
- UNIQUE para.

```text
professional_id

+

specialty_id
```

Impedindo duplicidade de especialidades para o mesmo profissional.

---

# Índices

Índices recomendados.

```text
professional_id

specialty_id

is_primary
```

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo obrigatório.

```text
deleted_at
```

O histórico das especialidades deverá permanecer disponível.

---

# Auditoria

Operações auditadas.

```text
SPECIALTY_ASSIGNED

SPECIALTY_REMOVED

PRIMARY_SPECIALTY_CHANGED
```

---

# Eventos Produzidos

Exemplos.

```text
SpecialtyAssignedToProfessional

SpecialtyRemovedFromProfessional

PrimarySpecialtyUpdated
```

---

# Eventos Consumidos

Exemplos.

```text
ProfessionalCreated

ProfessionalUpdated

SpecialtyCreated

SpecialtyUpdated
```

---

# Regras de Negócio

Um ProfessionalSpecialty.

- pertence exatamente a um Professional;
- pertence exatamente a uma Specialty;
- não poderá existir duplicado;
- poderá possuir apenas uma especialidade principal por profissional;
- deverá preservar histórico de alterações.

---

# Ciclo de Vida

```text
Especialidade Criada

↓

Atribuição ao Profissional

↓

Utilização

↓

Alteração

↓

Remoção

↓

Arquivamento
```

---

# Segurança

Somente usuários autorizados poderão.

- atribuir especialidades;
- remover especialidades;
- alterar a especialidade principal.

Toda alteração deverá gerar auditoria obrigatória.

---

# Performance

Consultas por.

```text
professional_id

specialty_id

is_primary
```

Deverão utilizar índices apropriados.

Essas consultas deverão possuir baixa latência para alimentar agendas, pesquisas e filtros.

---

# Observações

Embora represente uma tabela intermediária.

A entidade ProfessionalSpecialty possui comportamento próprio.

Ela permite identificar.

- quando uma especialidade foi atribuída;
- qual é a especialidade principal;
- quem realizou a alteração;
- histórico completo de mudanças.

Essa abordagem aumenta a rastreabilidade e facilita futuras evoluções do sistema.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Professional
- Specialty
- Appointment

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O relacionamento entre Professional e Specialty será implementado através da entidade ProfessionalSpecialty, permitindo múltiplas especialidades por profissional com preservação do histórico.

**Motivação**

- Flexibilidade
- Padronização
- Auditoria
- Escalabilidade
- Integridade dos dados

**Alternativas Avaliadas**

- Especialidade diretamente na tabela Professional
- Apenas uma especialidade por profissional
- Lista de especialidades em JSON

**Resultado**

Toda associação entre profissionais e especialidades será registrada na entidade ProfessionalSpecialty, garantindo consistência, rastreabilidade e evolução sustentável da plataforma.

---

# Próxima Entidade

---

# Entidade — Appointment

## Resumo

A entidade **Appointment** representa um atendimento agendado entre um paciente e um profissional de saúde.

Ela controla todo o ciclo de vida da consulta, desde o agendamento até sua conclusão, servindo como ponto de integração entre agenda, prontuário, prescrições, exames, pagamentos e notificações.

Todo atendimento realizado no MedFlow deverá possuir um Appointment associado.

---

# Objetivo

Representar o agendamento e a execução de um atendimento clínico, permitindo controlar horários, profissionais responsáveis, pacientes atendidos e o estado operacional da consulta.

---

# Domínio

Scheduling

---

# Classificação da Entidade

```text
Tipo: Entidade de Negócio

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Sim

LGPD: Dados Sensíveis

Criticidade: Muito Alta
```

---

# Responsabilidades

A entidade Appointment é responsável por.

- registrar agendamentos;
- controlar horários;
- vincular paciente e profissional;
- acompanhar o status do atendimento;
- iniciar o fluxo clínico;
- servir como origem do prontuário eletrônico.

---

# Dono da Entidade

Scheduling Domain

---

# Dependências

A entidade depende de.

```text
Clinic

Patient

Professional
```

Opcionalmente.

```text
Room

Health Insurance

Procedure
```

---

# Dependentes

A entidade é utilizada por.

```text
Medical Records

Clinical Notes

Diagnoses

Prescriptions

Exams

Payments

Notifications

Audit Logs
```

---

# Relacionamentos

## Muitos para Um

```text
Appointments

↓

Clinic
```

---

```text
Appointments

↓

Patient
```

---

```text
Appointments

↓

Professional
```

---

## Um para Um

```text
Appointment

↓

Medical Record
```

---

## Um para Muitos

```text
Appointment

↓

Prescriptions
```

---

```text
Appointment

↓

Exams
```

---

```text
Appointment

↓

Clinical Notes
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

clinic_id

patient_id

professional_id

scheduled_start

scheduled_end

status

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
actual_start

actual_end

reason

notes

room_id

health_insurance_id

procedure_id

cancellation_reason

confirmed_at

checked_in_at

completed_at

deleted_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para clinic_id.
- Foreign Key para patient_id.
- Foreign Key para professional_id.
- NOT NULL para campos obrigatórios.
- Validação para horários consistentes.

---

# Índices

Índices recomendados.

```text
clinic_id

patient_id

professional_id

scheduled_start

status
```

Consultas por agenda deverão possuir baixa latência.

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo obrigatório.

```text
deleted_at
```

Consultas canceladas deverão permanecer registradas para fins históricos.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

CONFIRM

CHECK_IN

START

COMPLETE

CANCEL

DELETE

RESTORE
```

---

# Eventos Produzidos

Exemplos.

```text
AppointmentScheduled

AppointmentConfirmed

PatientCheckedIn

AppointmentStarted

AppointmentCompleted

AppointmentCancelled

AppointmentRescheduled
```

---

# Eventos Consumidos

Exemplos.

```text
PatientCreated

ProfessionalCreated

NotificationSent

PaymentApproved
```

---

# Regras de Negócio

Um Appointment.

- pertence exatamente a uma clínica;
- pertence exatamente a um paciente;
- pertence exatamente a um profissional;
- poderá originar um prontuário;
- poderá gerar diversas prescrições;
- poderá gerar diversos exames;
- poderá ser reagendado;
- poderá ser cancelado.

Um profissional não poderá possuir dois atendimentos simultâneos.

Um paciente não deverá possuir conflitos de horário na mesma clínica.

---

# Ciclo de Vida

```text
Agendado

↓

Confirmado

↓

Check-in

↓

Em Atendimento

↓

Concluído

↓

Arquivado
```

Fluxos alternativos.

```text
Agendado

↓

Cancelado
```

ou.

```text
Agendado

↓

Reagendado
```

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- Row Level Security;
- LGPD.

Somente usuários autorizados poderão visualizar ou alterar atendimentos.

---

# Performance

Consultas por.

```text
professional_id

patient_id

scheduled_start

status
```

Deverão utilizar índices apropriados.

A agenda diária deverá responder rapidamente mesmo com grande volume de consultas.

---

# Observações

O Appointment representa o evento operacional central da plataforma.

Ele conecta praticamente todos os módulos do MedFlow.

Embora seja responsável pelo fluxo do atendimento, ele não deverá armazenar informações clínicas detalhadas.

Essas informações pertencem ao MedicalRecord e às demais entidades clínicas.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Patient
- Professional
- MedicalRecord
- Prescription
- Exam
- Payment

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

A entidade Appointment será responsável por controlar todo o ciclo de vida dos atendimentos realizados na plataforma.

**Motivação**

- Organização do fluxo clínico
- Integridade dos dados
- Escalabilidade
- Auditoria
- Separação entre agendamento e prontuário

**Alternativas Avaliadas**

- Registrar atendimentos diretamente no prontuário
- Não separar agenda do histórico clínico
- Utilizar apenas eventos sem entidade própria

**Resultado**

Todo atendimento realizado no MedFlow deverá possuir uma entidade Appointment própria, funcionando como ponto central de integração entre agenda, atendimento, prontuário e demais módulos da plataforma.

---

# Próxima Entidade

---

# Entidade — MedicalRecord

## Resumo

A entidade **MedicalRecord** representa o prontuário eletrônico de um atendimento realizado no MedFlow.

Ela concentra as informações clínicas registradas durante a consulta, preservando o histórico médico do paciente de forma íntegra, rastreável e permanente.

O MedicalRecord constitui um documento oficial de saúde e possui valor clínico e jurídico.

---

# Objetivo

Registrar de forma estruturada todas as informações clínicas produzidas durante um atendimento, garantindo continuidade do cuidado, rastreabilidade e conformidade com requisitos legais.

---

# Domínio

Medical

---

# Classificação da Entidade

```text
Tipo: Entidade de Negócio

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Sensíveis

Criticidade: Máxima
```

---

# Valor Legal

```text
Documento Oficial

Sim

Valor Jurídico

Sim

Assinatura Digital

Recomendada

Retenção

Conforme legislação aplicável e políticas institucionais

Alteração Após Finalização

Restrita
```

O prontuário eletrônico representa um documento oficial da assistência prestada ao paciente.

---

# Responsabilidades

A entidade MedicalRecord é responsável por.

- registrar evolução clínica;
- armazenar histórico do atendimento;
- servir como documento oficial da consulta;
- consolidar informações clínicas;
- preservar rastreabilidade;
- manter integridade dos registros.

---

# Dono da Entidade

Medical Domain

---

# Dependências

A entidade depende de.

```text
Clinic

Patient

Professional

Appointment
```

Um prontuário nunca poderá existir sem um atendimento.

---

# Dependentes

A entidade é utilizada por.

```text
Diagnoses

Prescriptions

Exams

Clinical Notes

Attachments

Audit Logs
```

---

# Relacionamentos

## Muitos para Um

```text
Medical Records

↓

Clinic
```

---

```text
Medical Records

↓

Patient
```

---

```text
Medical Records

↓

Professional
```

---

## Um para Um

```text
Appointment

↓

Medical Record
```

---

## Um para Muitos

```text
Medical Record

↓

Diagnoses
```

---

```text
Medical Record

↓

Prescriptions
```

---

```text
Medical Record

↓

Exams
```

---

```text
Medical Record

↓

Clinical Notes
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

clinic_id

patient_id

professional_id

appointment_id

record_date

status

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
chief_complaint

clinical_history

physical_exam

assessment

plan

observations

signed_at

closed_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para clinic_id.
- Foreign Key para patient_id.
- Foreign Key para professional_id.
- Foreign Key para appointment_id.
- Unique para appointment_id.
- NOT NULL para campos obrigatórios.

Cada atendimento deverá possuir, no máximo, um prontuário principal.

---

# Índices

Índices recomendados.

```text
clinic_id

patient_id

professional_id

appointment_id

record_date
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

Prontuários representam documentos oficiais.

Não deverão ser removidos da base de dados.

Caso seja necessário corrigir informações.

Deverão ser registrados adendos ou novas versões, preservando o histórico.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

SIGN

CLOSE

ADDENDUM_CREATED
```

Toda alteração deverá preservar rastreabilidade.

---

# Eventos Produzidos

Exemplos.

```text
MedicalRecordCreated

MedicalRecordUpdated

MedicalRecordSigned

MedicalRecordClosed

MedicalRecordAddendumCreated
```

---

# Eventos Consumidos

Exemplos.

```text
AppointmentStarted

AppointmentCompleted

DiagnosisCreated

PrescriptionIssued

ExamRequested
```

---

# Regras de Negócio

Um MedicalRecord.

- pertence exatamente a uma clínica;
- pertence exatamente a um paciente;
- pertence exatamente a um profissional;
- pertence exatamente a um atendimento;
- poderá possuir diversos diagnósticos;
- poderá possuir diversas prescrições;
- poderá possuir diversos exames;
- poderá ser finalizado;
- deverá preservar histórico completo.

Após sua finalização.

Alterações deverão seguir regras específicas definidas pela política clínica da plataforma.

---

# Ciclo de Vida

```text
Atendimento Iniciado

↓

Prontuário Criado

↓

Preenchimento

↓

Assinatura

↓

Finalização

↓

Consulta Histórica
```

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- Row Level Security;
- LGPD.

O acesso ao prontuário deverá ser restrito aos profissionais autorizados e registrado em auditoria sempre que necessário.

---

# Performance

Consultas por.

```text
patient_id

professional_id

appointment_id

record_date
```

Deverão utilizar índices apropriados.

O histórico clínico deverá permitir consultas eficientes mesmo após muitos anos de utilização.

---

# Observações

O MedicalRecord representa o documento clínico principal do MedFlow.

Ele não deverá concentrar todas as informações clínicas em um único registro.

Diagnósticos, prescrições, exames, anexos e notas clínicas deverão permanecer em entidades próprias, relacionadas ao prontuário.

Essa separação favorece escalabilidade, manutenção e integridade do modelo de dados.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Patient
- Professional
- Appointment
- Diagnosis
- Prescription
- Exam
- ClinicalNote

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O MedicalRecord será o documento clínico oficial do MedFlow, representando o prontuário eletrônico do atendimento e preservando seu valor legal, clínico e histórico.

**Motivação**

- Integridade clínica
- Conformidade legal
- Continuidade do cuidado
- Rastreabilidade
- Escalabilidade

**Alternativas Avaliadas**

- Informações clínicas diretamente na Appointment
- Prontuário sem estrutura própria
- Documento único contendo todas as informações

**Resultado**

O prontuário eletrônico será implementado como entidade independente, funcionando como núcleo do domínio Medical e servindo como agregador dos registros clínicos produzidos durante o atendimento.

---

# Próxima Entidade

---

# Entidade — Diagnosis

## Resumo

A entidade **Diagnosis** representa um diagnóstico clínico registrado durante um atendimento no MedFlow.

Ela documenta a avaliação realizada pelo profissional de saúde, identificando condições, doenças, hipóteses diagnósticas ou problemas de saúde observados durante a consulta.

Todo diagnóstico deverá estar associado a um prontuário eletrônico.

---

# Objetivo

Registrar diagnósticos clínicos de forma estruturada, permitindo acompanhamento da evolução do paciente, continuidade do cuidado e rastreabilidade das decisões médicas.

---

# Domínio

Medical

---

# Classificação da Entidade

```text
Tipo: Entidade de Negócio

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Sensíveis

Criticidade: Máxima
```

---

# Valor Legal

```text
Documento Oficial

Sim

Valor Jurídico

Sim

Assinatura Digital

Herda do MedicalRecord

Retenção

Conforme legislação aplicável

Alteração Após Finalização

Restrita
```

O diagnóstico faz parte integrante do prontuário eletrônico.

---

# Imutabilidade

```text
Rascunho

Pode ser alterado

↓

Prontuário Assinado

Somente Adendo

↓

Prontuário Finalizado

Somente Leitura
```

O histórico deverá permanecer íntegro durante todo o ciclo de vida do prontuário.

---

# Responsabilidades

A entidade Diagnosis é responsável por.

- registrar diagnósticos;
- documentar hipóteses clínicas;
- registrar diagnósticos confirmados;
- permitir classificação clínica;
- preservar histórico diagnóstico.

---

# Dono da Entidade

Medical Domain

---

# Dependências

A entidade depende de.

```text
MedicalRecord

Patient

Professional
```

Opcionalmente.

```text
CID

ICD

SNOMED CT
```

Caso a plataforma utilize terminologias clínicas padronizadas.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Prescriptions

Exams

Clinical Decision Support

Reports

AI

Billing
```

---

# Relacionamentos

## Muitos para Um

```text
Diagnoses

↓

MedicalRecord
```

---

```text
Diagnoses

↓

Patient
```

---

```text
Diagnoses

↓

Professional
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

medical_record_id

patient_id

professional_id

description

diagnosis_date

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
cid_code

snomed_code

diagnosis_type

severity

clinical_notes

is_primary

confirmed_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para medical_record_id.
- Foreign Key para patient_id.
- Foreign Key para professional_id.
- NOT NULL para campos obrigatórios.

---

# Índices

Índices recomendados.

```text
medical_record_id

patient_id

professional_id

diagnosis_date

cid_code
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

Diagnósticos registrados fazem parte do prontuário oficial.

Caso haja necessidade de correção.

Deverá ser criado um adendo.

Nunca remover o registro original.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

CONFIRM

ADDENDUM_CREATED
```

Toda alteração deverá preservar histórico.

---

# Eventos Produzidos

Exemplos.

```text
DiagnosisCreated

DiagnosisConfirmed

DiagnosisUpdated

DiagnosisAddendumCreated
```

---

# Eventos Consumidos

Exemplos.

```text
MedicalRecordCreated

AppointmentCompleted

ExamResultReceived
```

---

# Regras de Negócio

Um Diagnosis.

- pertence exatamente a um MedicalRecord;
- pertence exatamente a um paciente;
- pertence exatamente a um profissional;
- poderá ser principal;
- poderá coexistir com diagnósticos secundários;
- poderá referenciar classificações padronizadas;
- deverá permanecer preservado permanentemente.

---

# Ciclo de Vida

```text
Hipótese Clínica

↓

Diagnóstico Registrado

↓

Confirmação

↓

Prontuário Assinado

↓

Consulta Histórica
```

---

# Segurança

O acesso deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- Row Level Security;
- LGPD.

Somente profissionais autorizados poderão registrar ou consultar diagnósticos.

---

# Performance

Consultas por.

```text
patient_id

medical_record_id

diagnosis_date

cid_code
```

Deverão utilizar índices apropriados.

Pesquisas históricas deverão permanecer eficientes mesmo após muitos anos.

---

# Observações

A entidade Diagnosis representa exclusivamente o diagnóstico clínico.

Ela não substitui.

- prescrições;
- exames;
- notas clínicas;
- evolução.

Cada informação deverá permanecer em sua entidade específica.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- MedicalRecord
- Patient
- Professional
- Prescription
- Exam

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

A entidade Diagnosis será responsável pelo registro estruturado dos diagnósticos clínicos produzidos durante os atendimentos realizados no MedFlow.

**Motivação**

- Integridade clínica
- Valor jurídico
- Continuidade do cuidado
- Padronização
- Escalabilidade

**Alternativas Avaliadas**

- Diagnóstico diretamente no MedicalRecord
- Diagnósticos em texto livre apenas
- Documento único sem estrutura própria

**Resultado**

Os diagnósticos serão registrados como entidades independentes, preservando rastreabilidade, padronização e evolução do prontuário eletrônico.

---

# Próxima Entidade

---

# Entidade — Prescription

## Resumo

A entidade **Prescription** representa uma prescrição emitida por um profissional de saúde durante um atendimento realizado no MedFlow.

Ela documenta orientações clínicas, medicamentos, solicitações, encaminhamentos e demais recomendações fornecidas ao paciente.

Toda prescrição deverá estar vinculada a um prontuário eletrônico.

---

# Objetivo

Registrar prescrições clínicas de forma estruturada, garantindo rastreabilidade, segurança, integridade e conformidade com requisitos legais.

---

# Domínio

Medical

---

# Classificação da Entidade

```text
Tipo: Entidade de Negócio

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Sensíveis

Criticidade: Máxima
```

---

# Valor Legal

```text
Documento Oficial

Sim

Valor Jurídico

Sim

Assinatura Digital

Obrigatória quando exigido pela legislação

Retenção

Conforme legislação aplicável

Alteração Após Finalização

Restrita
```

Prescrições fazem parte da documentação oficial do atendimento.

---

# Imutabilidade

```text
Rascunho

Pode ser alterada

↓

Assinada

Somente Adendo

↓

Finalizada

Somente Leitura
```

Após assinatura.

O conteúdo original deverá permanecer preservado.

---

# Responsabilidades

A entidade Prescription é responsável por.

- registrar prescrições médicas;
- registrar medicamentos;
- registrar posologia;
- registrar encaminhamentos;
- registrar solicitações clínicas;
- preservar histórico.

---

# Dono da Entidade

Medical Domain

---

# Dependências

A entidade depende de.

```text
MedicalRecord

Patient

Professional

Appointment
```

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Pharmacy

Reports

Notifications

Audit Logs

Patient Portal

Integrations
```

---

# Relacionamentos

## Muitos para Um

```text
Prescriptions

↓

MedicalRecord
```

---

```text
Prescriptions

↓

Patient
```

---

```text
Prescriptions

↓

Professional
```

---

```text
Prescriptions

↓

Appointment
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

medical_record_id

patient_id

professional_id

appointment_id

prescription_date

type

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
title

instructions

medications

dosage

frequency

duration

observations

signed_at

expires_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para medical_record_id.
- Foreign Key para patient_id.
- Foreign Key para professional_id.
- Foreign Key para appointment_id.
- NOT NULL para campos obrigatórios.

---

# Índices

Índices recomendados.

```text
medical_record_id

patient_id

professional_id

prescription_date

type
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

Prescrições emitidas fazem parte do prontuário oficial.

Caso seja necessária uma correção.

Criar adendo ou nova prescrição.

Nunca remover o documento original.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

SIGN

ADDENDUM_CREATED
```

Toda alteração deverá preservar rastreabilidade.

---

# Eventos Produzidos

Exemplos.

```text
PrescriptionCreated

PrescriptionSigned

PrescriptionUpdated

PrescriptionAddendumCreated

PrescriptionExpired
```

---

# Eventos Consumidos

Exemplos.

```text
MedicalRecordCreated

DiagnosisConfirmed

AppointmentCompleted
```

---

# Regras de Negócio

Uma Prescription.

- pertence exatamente a um MedicalRecord;
- pertence exatamente a um paciente;
- pertence exatamente a um profissional;
- pertence exatamente a um Appointment;
- poderá conter um ou mais itens prescritos;
- poderá possuir validade;
- poderá exigir assinatura digital.

Uma prescrição assinada não deverá ser editada diretamente.

---

# Ciclo de Vida

```text
Rascunho

↓

Preenchimento

↓

Assinatura

↓

Entrega ao Paciente

↓

Consulta Histórica
```

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- Row Level Security;
- LGPD.

Somente profissionais habilitados poderão emitir prescrições.

---

# Performance

Consultas por.

```text
patient_id

medical_record_id

professional_id

prescription_date
```

Deverão utilizar índices apropriados.

---

# Observações

A entidade Prescription representa o documento clínico.

Os medicamentos prescritos deverão ser armazenados em uma entidade própria (PrescriptionItem), permitindo múltiplos itens por prescrição, maior flexibilidade e melhor normalização do banco.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- MedicalRecord
- Diagnosis
- Patient
- Professional
- Appointment
- PrescriptionItem

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

A entidade Prescription representará o documento oficial de prescrição emitido durante um atendimento, separando o documento dos itens prescritos.

**Motivação**

- Integridade clínica
- Valor jurídico
- Normalização
- Escalabilidade
- Facilidade de manutenção

**Alternativas Avaliadas**

- Medicamentos diretamente na Prescription
- Prescrição em texto livre
- Prescrição incorporada ao MedicalRecord

**Resultado**

As prescrições serão implementadas como entidades independentes, contendo informações gerais do documento, enquanto os itens prescritos serão armazenados separadamente em PrescriptionItem.

---

# Próxima Entidade

---

# Entidade — PrescriptionItem

## Resumo

A entidade **PrescriptionItem** representa um item individual pertencente a uma prescrição emitida no MedFlow.

Cada registro corresponde a um medicamento, produto ou orientação específica prescrita ao paciente.

Uma única prescrição poderá possuir diversos itens.

---

# Objetivo

Registrar individualmente cada item de uma prescrição, permitindo controle detalhado de medicamentos, dosagens, frequências, duração do tratamento e futuras integrações com sistemas externos.

---

# Domínio

Medical

---

# Classificação da Entidade

```text
Tipo: Entidade de Negócio

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Sensíveis

Criticidade: Alta
```

---

# Valor Legal

```text
Documento Oficial

Sim

Valor Jurídico

Sim

Assinatura Digital

Herda da Prescription

Retenção

Conforme legislação aplicável

Alteração Após Finalização

Restrita
```

Cada item faz parte integrante da prescrição oficial.

---

# Imutabilidade

```text
Rascunho

Pode ser alterado

↓

Prescrição Assinada

Somente Adendo

↓

Finalizada

Somente Leitura
```

---

# Responsabilidades

A entidade PrescriptionItem é responsável por.

- registrar medicamentos prescritos;
- registrar dosagens;
- registrar frequência de administração;
- registrar duração do tratamento;
- registrar orientações específicas;
- preservar histórico da prescrição.

---

# Dono da Entidade

Medical Domain

---

# Dependências

A entidade depende de.

```text
Prescription
```

Opcionalmente.

```text
Medication
```

Caso exista um catálogo padronizado de medicamentos.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Reports

Integrations

Pharmacy

Clinical Decision Support

AI
```

---

# Relacionamentos

## Muitos para Um

```text
PrescriptionItems

↓

Prescription
```

---

## Muitos para Um (Opcional)

```text
PrescriptionItems

↓

Medication
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

prescription_id

description

dosage

frequency

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
medication_id

route

duration

quantity

unit

instructions

observations
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para prescription_id.
- Foreign Key opcional para medication_id.
- NOT NULL para campos obrigatórios.

---

# Índices

Índices recomendados.

```text
prescription_id

medication_id

description
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

Itens prescritos fazem parte do documento oficial.

Caso seja necessária uma alteração.

Deverá ser criado um adendo na prescrição.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

ADDENDUM_CREATED
```

---

# Eventos Produzidos

Exemplos.

```text
PrescriptionItemCreated

PrescriptionItemUpdated

PrescriptionItemAddendumCreated
```

---

# Eventos Consumidos

Exemplos.

```text
PrescriptionCreated

PrescriptionSigned
```

---

# Regras de Negócio

Um PrescriptionItem.

- pertence exatamente a uma Prescription;
- poderá representar medicamento, produto ou orientação;
- poderá utilizar catálogo de medicamentos;
- deverá possuir posologia definida;
- deverá permanecer preservado após assinatura da prescrição.

---

# Ciclo de Vida

```text
Item Criado

↓

Revisão

↓

Assinatura da Prescrição

↓

Consulta Histórica
```

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- Row Level Security;
- LGPD.

Somente profissionais autorizados poderão criar ou consultar itens prescritos.

---

# Performance

Consultas por.

```text
prescription_id

medication_id

description
```

Deverão utilizar índices apropriados.

---

# Observações

A separação entre Prescription e PrescriptionItem permite.

- múltiplos medicamentos por prescrição;
- reutilização de catálogos de medicamentos;
- integração com farmácias;
- validação de interações medicamentosas;
- geração de relatórios detalhados.

Essa modelagem favorece escalabilidade e evolução da plataforma.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Prescription
- Medication
- Patient
- Professional

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

Cada medicamento ou orientação prescrita será representado por uma entidade PrescriptionItem independente.

**Motivação**

- Normalização
- Escalabilidade
- Integrações futuras
- Relatórios detalhados
- Suporte a múltiplos itens

**Alternativas Avaliadas**

- Lista JSON dentro da Prescription
- Texto livre
- Um único medicamento por prescrição

**Resultado**

A entidade PrescriptionItem permitirá que cada prescrição contenha diversos itens independentes, facilitando manutenção, consultas, integrações e evolução futura da plataforma.

---

# Próxima Entidade

---

# Entidade — Exam

## Resumo

A entidade **Exam** representa uma solicitação ou registro de exame associado a um atendimento realizado no MedFlow.

Ela documenta os exames solicitados pelo profissional de saúde, permitindo acompanhar seu ciclo de vida desde a solicitação até o recebimento e análise dos resultados.

O Exam faz parte integrante do prontuário eletrônico.

---

# Objetivo

Registrar solicitações de exames clínicos, laboratoriais ou de imagem, garantindo rastreabilidade, integração com o prontuário e preservação do histórico assistencial.

---

# Domínio

Medical

---

# Classificação da Entidade

```text
Tipo: Entidade de Negócio

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Sensíveis

Criticidade: Máxima
```

---

# Valor Legal

```text
Documento Oficial

Sim

Valor Jurídico

Sim

Assinatura Digital

Herda do MedicalRecord

Retenção

Conforme legislação aplicável

Alteração Após Finalização

Restrita
```

A solicitação de exames integra oficialmente o prontuário eletrônico.

---

# Imutabilidade

```text
Rascunho

Pode ser alterado

↓

Solicitação Assinada

Somente Adendo

↓

Finalizada

Somente Leitura
```

Após a assinatura do prontuário.

O histórico deverá permanecer preservado.

---

# Responsabilidades

A entidade Exam é responsável por.

- registrar solicitações de exames;
- acompanhar o status da solicitação;
- registrar resultados quando aplicável;
- manter vínculo com o prontuário;
- preservar histórico clínico.

---

# Dono da Entidade

Medical Domain

---

# Dependências

A entidade depende de.

```text
MedicalRecord

Appointment

Patient

Professional
```

Opcionalmente.

```text
Health Insurance
```

Caso a autorização do exame dependa de convênio.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Reports

Notifications

Patient Portal

AI

Laboratory Integration

Billing
```

---

# Relacionamentos

## Muitos para Um

```text
Exams

↓

MedicalRecord
```

---

```text
Exams

↓

Appointment
```

---

```text
Exams

↓

Patient
```

---

```text
Exams

↓

Professional
```

---

## Um para Muitos (Futuro)

```text
Exam

↓

ExamItems
```

Permitirá múltiplos exames em uma única solicitação.

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

medical_record_id

appointment_id

patient_id

professional_id

request_date

status

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
title

clinical_indication

instructions

requested_laboratory

scheduled_date

performed_date

result_date

result_summary

attachments

signed_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para medical_record_id.
- Foreign Key para appointment_id.
- Foreign Key para patient_id.
- Foreign Key para professional_id.
- NOT NULL para campos obrigatórios.

---

# Índices

Índices recomendados.

```text
medical_record_id

patient_id

professional_id

status

request_date
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

Solicitações de exames fazem parte do histórico clínico permanente.

Caso haja necessidade de correção.

Registrar adendo.

Nunca remover o documento original.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

SIGN

RESULT_RECEIVED

ADDENDUM_CREATED
```

---

# Eventos Produzidos

Exemplos.

```text
ExamRequested

ExamScheduled

ExamPerformed

ExamResultReceived

ExamReviewed
```

---

# Eventos Consumidos

Exemplos.

```text
MedicalRecordCreated

DiagnosisCreated

AppointmentCompleted

LaboratoryWebhookReceived
```

---

# Regras de Negócio

Um Exam.

- pertence exatamente a um MedicalRecord;
- pertence exatamente a um Appointment;
- pertence exatamente a um Patient;
- pertence exatamente a um Professional;
- poderá possuir diversos itens futuramente;
- poderá receber anexos de resultados;
- poderá ser integrado com laboratórios externos.

Após sua finalização.

O documento deverá permanecer preservado.

---

# Ciclo de Vida

```text
Solicitação

↓

Agendamento (Opcional)

↓

Realização

↓

Resultado Recebido

↓

Análise

↓

Consulta Histórica
```

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- Row Level Security;
- LGPD.

Somente profissionais autorizados poderão solicitar, visualizar ou analisar exames.

---

# Performance

Consultas por.

```text
patient_id

medical_record_id

status

request_date
```

Deverão utilizar índices apropriados.

Resultados deverão permanecer acessíveis rapidamente durante consultas clínicas.

---

# Observações

A entidade Exam representa o documento de solicitação.

Os exames individuais poderão futuramente ser representados pela entidade **ExamItem**, permitindo.

- múltiplos exames por solicitação;
- integração laboratorial;
- controle individual de resultados;
- rastreamento detalhado.

Essa arquitetura mantém consistência com a modelagem adotada para Prescription e PrescriptionItem.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- MedicalRecord
- Patient
- Professional
- Appointment
- ExamItem

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

A entidade Exam representará o documento oficial de solicitação de exames, permitindo futura expansão através da entidade ExamItem.

**Motivação**

- Integridade clínica
- Valor jurídico
- Escalabilidade
- Integração com laboratórios
- Padronização da arquitetura

**Alternativas Avaliadas**

- Exames diretamente no MedicalRecord
- Solicitações em texto livre
- Um exame por documento

**Resultado**

As solicitações de exames serão implementadas como documentos independentes, preservando rastreabilidade, valor clínico e permitindo evolução futura da plataforma.

---

# Próxima Entidade

---

# Entidade — ExamItem

## Resumo

A entidade **ExamItem** representa um exame individual pertencente a uma solicitação registrada no MedFlow.

Cada registro corresponde a um procedimento laboratorial, exame de imagem ou outro exame complementar solicitado pelo profissional de saúde.

Uma solicitação poderá conter diversos itens.

---

# Objetivo

Registrar individualmente cada exame solicitado, permitindo controle detalhado do ciclo de vida, resultados, integrações laboratoriais e rastreabilidade clínica.

---

# Domínio

Medical

---

# Classificação da Entidade

```text
Tipo: Entidade de Negócio

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Sensíveis

Criticidade: Alta
```

---

# Valor Legal

```text
Documento Oficial

Sim

Valor Jurídico

Sim

Assinatura Digital

Herda do Exam

Retenção

Conforme legislação aplicável

Alteração Após Finalização

Restrita
```

Cada item faz parte integrante da solicitação oficial de exames.

---

# Imutabilidade

```text
Rascunho

Pode ser alterado

↓

Solicitação Assinada

Somente Adendo

↓

Finalizada

Somente Leitura
```

---

# Responsabilidades

A entidade ExamItem é responsável por.

- registrar exames individuais;
- controlar o status de cada exame;
- registrar resultados;
- armazenar valores de referência;
- permitir integração com laboratórios;
- preservar histórico clínico.

---

# Dono da Entidade

Medical Domain

---

# Dependências

A entidade depende de.

```text
Exam
```

Opcionalmente.

```text
ExamCatalog
```

Caso exista um catálogo padronizado de exames.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Laboratory Integration

Reports

AI

Patient Portal

Notifications
```

---

# Relacionamentos

## Muitos para Um

```text
ExamItems

↓

Exam
```

---

## Muitos para Um (Opcional)

```text
ExamItems

↓

ExamCatalog
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

exam_id

description

status

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
exam_catalog_id

result

reference_range

unit

performed_at

result_received_at

laboratory_name

laboratory_code

observations

attachment_url
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para exam_id.
- Foreign Key opcional para exam_catalog_id.
- NOT NULL para campos obrigatórios.

---

# Índices

Índices recomendados.

```text
exam_id

status

performed_at

result_received_at
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

Itens fazem parte do histórico clínico oficial.

Caso seja necessária uma correção.

Registrar adendo.

Nunca remover registros.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

RESULT_RECEIVED

RESULT_UPDATED

ADDENDUM_CREATED
```

---

# Eventos Produzidos

Exemplos.

```text
ExamItemCreated

ExamItemScheduled

ExamItemPerformed

ExamResultReceived

ExamResultUpdated
```

---

# Eventos Consumidos

Exemplos.

```text
ExamRequested

LaboratoryWebhookReceived

MedicalRecordSigned
```

---

# Regras de Negócio

Um ExamItem.

- pertence exatamente a um Exam;
- poderá possuir resultado;
- poderá possuir valores de referência;
- poderá integrar com laboratórios externos;
- poderá ser realizado independentemente dos demais itens;
- deverá permanecer preservado permanentemente.

---

# Ciclo de Vida

```text
Solicitado

↓

Agendado (Opcional)

↓

Coleta

↓

Processamento

↓

Resultado Recebido

↓

Análise

↓

Consulta Histórica
```

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- Row Level Security;
- LGPD.

Resultados laboratoriais deverão estar disponíveis apenas para profissionais autorizados.

---

# Performance

Consultas por.

```text
exam_id

status

performed_at

result_received_at
```

Deverão utilizar índices apropriados.

Integrações laboratoriais deverão localizar rapidamente exames pendentes.

---

# Observações

A entidade ExamItem permite.

- múltiplos exames em uma única solicitação;
- integração individual com laboratórios;
- recebimento parcial de resultados;
- controle independente do status de cada exame.

Essa modelagem torna o MedFlow preparado para integração com laboratórios, clínicas de imagem e futuras funcionalidades baseadas em IA.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Exam
- MedicalRecord
- Patient
- Professional
- ExamCatalog

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

Cada exame solicitado será representado por uma entidade ExamItem independente, permitindo granularidade, integração laboratorial e evolução futura da plataforma.

**Motivação**

- Normalização
- Escalabilidade
- Integração com laboratórios
- Rastreabilidade
- Flexibilidade

**Alternativas Avaliadas**

- Lista JSON dentro da Exam
- Texto livre
- Um exame por solicitação

**Resultado**

Os exames individuais serão armazenados em ExamItem, permitindo controle completo do ciclo de vida de cada exame, integração com sistemas externos e preservação do histórico clínico.

---

# Próxima Entidade

---

# Entidade — ClinicalNote

## Resumo

A entidade **ClinicalNote** representa uma anotação clínica registrada durante um atendimento realizado no MedFlow.

Ela documenta evoluções, observações, condutas, orientações e demais registros produzidos pelos profissionais de saúde ao longo da assistência ao paciente.

Cada nota clínica faz parte do prontuário eletrônico oficial.

---

# Objetivo

Registrar informações clínicas complementares produzidas durante o atendimento, permitindo documentar a evolução do paciente de forma estruturada, cronológica e rastreável.

---

# Domínio

Medical

---

# Classificação da Entidade

```text
Tipo: Entidade de Negócio

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Sensíveis

Criticidade: Máxima
```

---

# Valor Legal

```text
Documento Oficial

Sim

Valor Jurídico

Sim

Assinatura Digital

Herda do MedicalRecord

Retenção

Conforme legislação aplicável

Alteração Após Finalização

Restrita
```

As notas clínicas integram oficialmente o prontuário eletrônico.

---

# Imutabilidade

```text
Rascunho

Pode ser alterada

↓

Prontuário Assinado

Somente Adendo

↓

Prontuário Finalizado

Somente Leitura
```

Após a finalização do prontuário.

Nenhuma nota deverá ser modificada diretamente.

---

# Responsabilidades

A entidade ClinicalNote é responsável por.

- registrar evolução clínica;
- documentar observações;
- registrar condutas;
- registrar orientações;
- registrar intercorrências;
- preservar histórico assistencial.

---

# Dono da Entidade

Medical Domain

---

# Dependências

A entidade depende de.

```text
MedicalRecord

Patient

Professional

Appointment
```

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Reports

Audit Logs

AI

Patient Timeline

Clinical Analytics
```

---

# Relacionamentos

## Muitos para Um

```text
ClinicalNotes

↓

MedicalRecord
```

---

```text
ClinicalNotes

↓

Patient
```

---

```text
ClinicalNotes

↓

Professional
```

---

```text
ClinicalNotes

↓

Appointment
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

medical_record_id

patient_id

professional_id

appointment_id

note

note_date

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
title

category

observations

is_private

signed_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para medical_record_id.
- Foreign Key para patient_id.
- Foreign Key para professional_id.
- Foreign Key para appointment_id.
- NOT NULL para campos obrigatórios.

---

# Índices

Índices recomendados.

```text
medical_record_id

patient_id

professional_id

note_date
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

Notas clínicas fazem parte do prontuário oficial.

Caso seja necessária uma correção.

Registrar adendo.

Nunca remover registros.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

SIGN

ADDENDUM_CREATED
```

Toda alteração deverá preservar rastreabilidade.

---

# Eventos Produzidos

Exemplos.

```text
ClinicalNoteCreated

ClinicalNoteUpdated

ClinicalNoteSigned

ClinicalNoteAddendumCreated
```

---

# Eventos Consumidos

Exemplos.

```text
MedicalRecordCreated

AppointmentStarted

AppointmentCompleted
```

---

# Regras de Negócio

Uma ClinicalNote.

- pertence exatamente a um MedicalRecord;
- pertence exatamente a um Patient;
- pertence exatamente a um Professional;
- pertence exatamente a um Appointment;
- poderá possuir categorias;
- poderá ser privada quando permitido pela política clínica;
- deverá permanecer preservada permanentemente.

Após a assinatura do prontuário.

Alterações deverão ocorrer exclusivamente através de adendos.

---

# Ciclo de Vida

```text
Criação

↓

Atualizações Durante Atendimento

↓

Assinatura

↓

Consulta Histórica
```

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- Row Level Security;
- LGPD.

Notas privadas, quando existentes, deverão respeitar regras específicas de autorização.

---

# Performance

Consultas por.

```text
patient_id

medical_record_id

professional_id

note_date
```

Deverão utilizar índices apropriados.

A linha do tempo clínica deverá responder rapidamente mesmo para pacientes com muitos anos de histórico.

---

# Observações

A entidade ClinicalNote representa registros textuais produzidos durante o atendimento.

Ela não substitui.

- diagnósticos;
- prescrições;
- exames;
- anexos.

Cada tipo de informação deverá permanecer em sua entidade específica.

A organização dos registros por tipo facilita manutenção, pesquisa e evolução da plataforma.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- MedicalRecord
- Patient
- Professional
- Appointment
- Diagnosis
- Prescription
- Exam

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

A entidade ClinicalNote será responsável pelo registro estruturado das evoluções e observações clínicas produzidas durante o atendimento.

**Motivação**

- Integridade clínica
- Valor jurídico
- Rastreabilidade
- Organização do prontuário
- Escalabilidade

**Alternativas Avaliadas**

- Observações diretamente no MedicalRecord
- Texto livre em Appointment
- Documento único contendo toda evolução

**Resultado**

As evoluções clínicas serão armazenadas como entidades independentes, preservando o histórico, permitindo auditoria e mantendo o MedicalRecord como agregado raiz do domínio Medical.

---

# Próxima Entidade

---

# Entidade — Attachment

## Resumo

A entidade **Attachment** representa qualquer arquivo anexado a um registro do MedFlow.

Ela permite armazenar documentos, imagens, exames digitalizados, laudos, fotografias clínicas, PDFs e demais arquivos relacionados aos atendimentos.

Os anexos são independentes do tipo de documento ao qual pertencem, permitindo reutilização em toda a plataforma.

---

# Objetivo

Centralizar o gerenciamento de arquivos anexados ao sistema, fornecendo uma estrutura única para armazenamento, auditoria, segurança e integração com serviços externos.

---

# Domínio

Medical

---

# Classificação da Entidade

```text
Tipo: Entidade de Suporte

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Sensíveis

Criticidade: Alta
```

---

# Valor Legal

```text
Documento Oficial

Depende do contexto

Valor Jurídico

Pode possuir

Assinatura Digital

Herda do documento associado

Retenção

Conforme documento vinculado

Alteração Após Finalização

Não permitida
```

O valor legal do anexo depende da entidade à qual está associado.

---

# Imutabilidade

```text
Upload

↓

Validação

↓

Vinculação

↓

Documento Finalizado

↓

Somente Leitura
```

Após vinculado a um documento finalizado.

O arquivo não deverá ser substituído.

---

# Responsabilidades

A entidade Attachment é responsável por.

- armazenar metadados dos arquivos;
- controlar uploads;
- controlar downloads;
- registrar tipo do arquivo;
- preservar integridade;
- permitir associação com diversos módulos.

---

# Dono da Entidade

Medical Domain

---

# Dependências

Opcionalmente.

```text
MedicalRecord

ClinicalNote

Exam

Prescription

Patient
```

A associação ocorre através de uma referência genérica.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Patient Portal

AI

Reports

Notifications

Audit Logs

Laboratory Integration
```

---

# Relacionamentos

## Associação Polimórfica

```text
Attachment

↓

entity_type

↓

entity_id
```

Exemplos.

```text
MedicalRecord

↓

Attachment
```

---

```text
Exam

↓

Attachment
```

---

```text
Prescription

↓

Attachment
```

---

```text
ClinicalNote

↓

Attachment
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

clinic_id

entity_type

entity_id

file_name

storage_path

mime_type

file_size

uploaded_by

created_at
```

---

# Campos Opcionais

Exemplos.

```text
checksum

thumbnail_path

description

tags

virus_scan_status

encrypted

download_count
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para clinic_id.
- Foreign Key para uploaded_by.
- NOT NULL para campos obrigatórios.
- Validação de tamanho máximo.
- Validação de MIME Type.

---

# Índices

Índices recomendados.

```text
clinic_id

entity_type

entity_id

uploaded_by

mime_type
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

Arquivos vinculados a documentos oficiais deverão permanecer preservados.

Caso um anexo seja invalidado.

Seu status deverá ser alterado.

Nunca removido fisicamente sem política específica.

---

# Auditoria

Operações auditadas.

```text
UPLOAD

DOWNLOAD

VIEW

DELETE_REQUEST

VALIDATION_COMPLETED
```

Toda ação envolvendo anexos deverá ser registrada.

---

# Eventos Produzidos

Exemplos.

```text
AttachmentUploaded

AttachmentValidated

AttachmentDownloaded

AttachmentViewed

AttachmentLinked
```

---

# Eventos Consumidos

Exemplos.

```text
MedicalRecordCreated

ExamRequested

ClinicalNoteCreated

PrescriptionCreated
```

---

# Regras de Negócio

Um Attachment.

- pertence exatamente a uma clínica;
- deverá estar vinculado a uma entidade;
- poderá representar qualquer tipo de arquivo permitido;
- deverá possuir integridade validada;
- poderá possuir criptografia;
- poderá ser armazenado em serviço externo.

Arquivos nunca deverão ser armazenados diretamente no banco.

A entidade armazenará apenas seus metadados.

---

# Ciclo de Vida

```text
Upload

↓

Validação

↓

Armazenamento

↓

Vinculação

↓

Consulta

↓

Arquivamento
```

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- Row Level Security;
- LGPD.

Arquivos sensíveis deverão.

- possuir criptografia quando necessário;
- utilizar URLs temporárias para download;
- registrar todas as visualizações.

---

# Performance

Consultas por.

```text
entity_type

entity_id

clinic_id
```

Deverão utilizar índices apropriados.

Os arquivos deverão permanecer em armazenamento externo.

Exemplos.

```text
Amazon S3

Cloudflare R2

Google Cloud Storage

Azure Blob Storage
```

O banco armazenará apenas metadados.

---

# Observações

A entidade Attachment foi projetada para ser reutilizável em toda a plataforma.

A utilização de uma associação polimórfica evita duplicação de tabelas como.

```text
ExamAttachment

PrescriptionAttachment

PatientAttachment

MedicalRecordAttachment
```

Essa abordagem simplifica a arquitetura e reduz manutenção.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- MedicalRecord
- ClinicalNote
- Prescription
- Exam
- Patient

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O MedFlow utilizará uma entidade única de anexos baseada em associação polimórfica para gerenciar arquivos em toda a plataforma.

**Motivação**

- Reutilização
- Baixo acoplamento
- Escalabilidade
- Facilidade de manutenção
- Integração com serviços de armazenamento

**Alternativas Avaliadas**

- Tabelas de anexos específicas por entidade
- Arquivos armazenados diretamente no banco
- Relações fixas entre anexos e documentos

**Resultado**

Os anexos serão gerenciados por uma entidade única, armazenando apenas metadados no banco e permitindo associação com diferentes entidades da plataforma de forma flexível e consistente.

---

# Encerramento do Domínio

## Medical Domain ✅

Entidades concluídas.

```text
MedicalRecord

Diagnosis

Prescription

PrescriptionItem

Exam

ExamItem

ClinicalNote

Attachment
```

---

# Próxima Entidade

---

# Entidade — Allergy

## Resumo

A entidade **Allergy** representa uma alergia conhecida de um paciente cadastrada no MedFlow.

Ela registra substâncias, medicamentos, alimentos, materiais ou agentes capazes de provocar reações adversas, permitindo que o sistema auxilie os profissionais na tomada de decisão clínica.

As alergias fazem parte do histórico permanente do paciente.

---

# Objetivo

Registrar alergias conhecidas do paciente para aumentar a segurança clínica, prevenir eventos adversos e apoiar decisões durante prescrições, atendimentos e solicitações de exames.

---

# Domínio

Clinical

---

# Classificação da Entidade

```text
Tipo: Entidade de Negócio

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Sensíveis

Criticidade: Muito Alta
```

---

# Valor Clínico

```text
Impacto Assistencial

Muito Alto

Influência em Prescrições

Sim

Influência em Procedimentos

Sim

Histórico Permanente

Sim
```

A ausência ou incorreção dessas informações poderá comprometer a segurança do paciente.

---

# Imutabilidade

```text
Registro

↓

Atualizações Controladas

↓

Histórico Permanente
```

Registros não deverão ser removidos.

Quando necessário.

Registrar atualização preservando o histórico.

---

# Responsabilidades

A entidade Allergy é responsável por.

- registrar alergias;
- registrar intolerâncias quando aplicável;
- classificar gravidade;
- registrar reações conhecidas;
- auxiliar sistemas de alerta;
- preservar histórico clínico.

---

# Dono da Entidade

Clinical Domain

---

# Dependências

A entidade depende de.

```text
Patient
```

Opcionalmente.

```text
Professional

MedicalRecord
```

Caso seja registrado durante um atendimento.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Prescription

PrescriptionItem

MedicalRecord

Clinical Decision Support

AI

Patient Portal
```

---

# Relacionamentos

## Muitos para Um

```text
Allergies

↓

Patient
```

---

## Muitos para Um (Opcional)

```text
Allergies

↓

Professional
```

---

```text
Allergies

↓

MedicalRecord
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

patient_id

allergen

category

severity

status

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
medical_record_id

professional_id

reaction

notes

identified_at

resolved_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para patient_id.
- Foreign Key opcional para professional_id.
- Foreign Key opcional para medical_record_id.
- NOT NULL para campos obrigatórios.

---

# Índices

Índices recomendados.

```text
patient_id

allergen

severity

status
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

Alergias deverão permanecer preservadas para manter o histórico clínico.

Caso uma alergia deixe de existir.

Seu status deverá ser atualizado.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

STATUS_CHANGED

CONFIRMED

RESOLVED
```

---

# Eventos Produzidos

Exemplos.

```text
AllergyCreated

AllergyConfirmed

AllergyUpdated

AllergyResolved
```

---

# Eventos Consumidos

Exemplos.

```text
PatientCreated

MedicalRecordCreated

PrescriptionCreated
```

---

# Regras de Negócio

Uma Allergy.

- pertence exatamente a um Patient;
- poderá ser registrada durante qualquer atendimento;
- poderá ser confirmada posteriormente;
- poderá possuir diferentes níveis de gravidade;
- deverá permanecer disponível durante toda a vida clínica do paciente.

Sempre que possível.

O sistema deverá alertar o profissional quando houver conflito entre alergias registradas e medicamentos prescritos.

---

# Ciclo de Vida

```text
Registro

↓

Validação

↓

Confirmação

↓

Utilização Clínica

↓

Atualização (quando necessário)
```

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- Row Level Security;
- LGPD.

As informações de alergias deverão estar disponíveis aos profissionais autorizados durante o atendimento.

---

# Performance

Consultas por.

```text
patient_id

status

severity
```

Deverão possuir índices apropriados.

A consulta deverá ocorrer antes da emissão de prescrições para permitir alertas em tempo real.

---

# Observações

A entidade Allergy representa informações clínicas permanentes do paciente.

Ela não substitui eventos adversos nem contraindicações.

No futuro.

Poderá ser integrada com catálogos padronizados de alérgenos e sistemas de apoio à decisão clínica.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Patient
- MedicalRecord
- Prescription
- PrescriptionItem

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

A entidade Allergy será utilizada para registrar alergias conhecidas dos pacientes, permitindo alertas automáticos durante prescrições e fortalecendo a segurança assistencial.

**Motivação**

- Segurança do paciente
- Prevenção de eventos adversos
- Continuidade do cuidado
- Apoio à decisão clínica
- Conformidade com boas práticas médicas

**Alternativas Avaliadas**

- Armazenar alergias no MedicalRecord
- Registrar alergias apenas em texto livre
- Não manter histórico permanente

**Resultado**

As alergias serão armazenadas como entidades independentes, preservando histórico, permitindo validações automáticas e integração com futuras funcionalidades de apoio à decisão clínica.

---

# Próxima Entidade

---

# Entidade — Medication

## Resumo

A entidade **Medication** representa o catálogo oficial de medicamentos utilizados pelo MedFlow.

Ela fornece uma base padronizada para prescrições, validações clínicas, integração com sistemas externos e funcionalidades de apoio à decisão.

Os medicamentos pertencem à plataforma.

Não pertencem às clínicas.

---

# Objetivo

Centralizar o cadastro de medicamentos utilizados na plataforma, permitindo reutilização entre clínicas, padronização das prescrições e futuras integrações com bases oficiais.

---

# Domínio

Clinical

---

# Classificação da Entidade

```text
Tipo: Entidade de Referência

Persistência: Permanente

Multi-Tenant: Não

Auditoria: Obrigatória

Soft Delete: Sim

LGPD: Não se aplica

Criticidade: Alta
```

---

# Valor Clínico

```text
Catálogo Oficial

Sim

Utilizado em Prescrições

Sim

Integração Externa

Sim

Histórico

Permanente
```

O catálogo deverá servir como referência para toda a plataforma.

---

# Responsabilidades

A entidade Medication é responsável por.

- padronizar medicamentos;
- evitar duplicidade;
- servir como base para prescrições;
- permitir integração com catálogos oficiais;
- apoiar validações clínicas;
- fornecer informações farmacológicas.

---

# Dono da Entidade

Clinical Domain

---

# Dependências

Nenhuma.

O catálogo pertence à plataforma.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
PrescriptionItem

Allergy

Clinical Decision Support

AI

Reports

Patient Portal

Integrations
```

---

# Relacionamentos

## Um para Muitos

```text
Medication

↓

PrescriptionItems
```

---

## Relações Futuras

```text
Medication

↓

DrugInteractions
```

---

```text
Medication

↓

MedicationCategories
```

---

```text
Medication

↓

MedicationAliases
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

name

generic_name

status

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
brand_name

presentation

dosage_form

strength

manufacturer

anvisa_code

atc_code

description

deleted_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Unique para nome + apresentação quando aplicável.
- NOT NULL para campos obrigatórios.

Caso exista integração oficial.

O código regulatório deverá ser único.

---

# Índices

Índices recomendados.

```text
name

generic_name

anvisa_code

status
```

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo obrigatório.

```text
deleted_at
```

Medicamentos descontinuados deverão permanecer disponíveis para preservar prescrições históricas.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

ACTIVATE

DEACTIVATE

DELETE

RESTORE
```

---

# Eventos Produzidos

Exemplos.

```text
MedicationCreated

MedicationUpdated

MedicationActivated

MedicationDeactivated
```

---

# Eventos Consumidos

Exemplos.

```text
PrescriptionCreated

DrugDatabaseImported

MedicationCatalogUpdated
```

---

# Regras de Negócio

Um Medication.

- poderá ser utilizado em diversas prescrições;
- poderá possuir diversas apresentações;
- poderá possuir nomes comerciais;
- poderá possuir nome genérico;
- poderá ser descontinuado;
- nunca deverá ser removido quando existir histórico clínico associado.

---

# Ciclo de Vida

```text
Cadastro

↓

Validação

↓

Disponível

↓

Atualizações

↓

Descontinuação

↓

Arquivamento
```

---

# Segurança

Somente administradores autorizados da plataforma poderão.

- cadastrar medicamentos;
- alterar informações farmacológicas;
- descontinuar medicamentos.

As clínicas utilizarão apenas o catálogo disponibilizado.

---

# Performance

Consultas por.

```text
name

generic_name

anvisa_code
```

Deverão utilizar índices apropriados.

Pesquisas deverão oferecer resposta rápida para apoiar a emissão de prescrições.

---

# Observações

A entidade Medication representa exclusivamente um catálogo de referência.

Ela não registra.

- medicamentos prescritos;
- medicamentos administrados;
- estoque.

Essas responsabilidades pertencem a outras entidades.

A utilização de um catálogo centralizado permitirá futuras integrações com bases oficiais, mecanismos de interação medicamentosa, alertas clínicos e funcionalidades de inteligência artificial.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Prescription
- PrescriptionItem
- Allergy
- Clinical Decision Support

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O MedFlow utilizará uma entidade Medication como catálogo oficial de medicamentos, separando a definição dos medicamentos de sua utilização nas prescrições.

**Motivação**

- Padronização
- Reutilização
- Integração com bases oficiais
- Apoio à decisão clínica
- Escalabilidade

**Alternativas Avaliadas**

- Medicamentos em texto livre
- Catálogo por clínica
- Dados armazenados diretamente em PrescriptionItem

**Resultado**

Os medicamentos serão mantidos em um catálogo centralizado, reutilizado por toda a plataforma e preparado para futuras integrações, validações clínicas e evolução funcional.

---

# Próxima Entidade

---

# Entidade — VitalSigns

## Resumo

A entidade **VitalSigns** representa os sinais vitais registrados durante um atendimento realizado no MedFlow.

Ela armazena medições fisiológicas obtidas do paciente, permitindo acompanhamento clínico, análise da evolução, apoio à decisão e integração com dispositivos médicos.

Os sinais vitais fazem parte do prontuário eletrônico.

---

# Objetivo

Registrar medições fisiológicas do paciente de forma estruturada, preservando histórico clínico, facilitando análises evolutivas e permitindo integração com equipamentos médicos.

---

# Domínio

Clinical

---

# Classificação da Entidade

```text
Tipo: Entidade de Negócio

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Sensíveis

Criticidade: Alta
```

---

# Valor Clínico

```text
Documento Clínico

Sim

Valor Jurídico

Sim

Assinatura Digital

Herda do MedicalRecord

Retenção

Conforme legislação aplicável

Alteração Após Finalização

Restrita
```

Os sinais vitais integram oficialmente o histórico clínico do paciente.

---

# Imutabilidade

```text
Rascunho

Pode ser alterado

↓

Prontuário Assinado

Somente Adendo

↓

Finalizado

Somente Leitura
```

Após a assinatura do prontuário.

As medições deverão permanecer preservadas.

---

# Responsabilidades

A entidade VitalSigns é responsável por.

- registrar sinais vitais;
- armazenar medições fisiológicas;
- permitir acompanhamento evolutivo;
- apoiar decisões clínicas;
- fornecer dados para IA;
- preservar histórico.

---

# Dono da Entidade

Clinical Domain

---

# Dependências

A entidade depende de.

```text
MedicalRecord

Appointment

Patient

Professional
```

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Clinical Decision Support

AI

Reports

Patient Timeline

Medical Dashboard
```

---

# Relacionamentos

## Muitos para Um

```text
VitalSigns

↓

MedicalRecord
```

---

```text
VitalSigns

↓

Appointment
```

---

```text
VitalSigns

↓

Patient
```

---

```text
VitalSigns

↓

Professional
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

medical_record_id

appointment_id

patient_id

professional_id

measured_at

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
blood_pressure_systolic

blood_pressure_diastolic

heart_rate

respiratory_rate

temperature

oxygen_saturation

weight

height

body_mass_index

waist_circumference

blood_glucose

pain_scale

observations
```

Nem todos os sinais vitais serão obrigatórios em todos os atendimentos.

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para medical_record_id.
- Foreign Key para appointment_id.
- Foreign Key para patient_id.
- Foreign Key para professional_id.
- NOT NULL para campos obrigatórios.
- CHECK para valores fisiológicos válidos quando aplicável.

---

# Índices

Índices recomendados.

```text
patient_id

medical_record_id

measured_at
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

Os sinais vitais fazem parte do histórico clínico permanente.

Caso seja necessária uma correção.

Registrar adendo.

Nunca remover medições.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

ADDENDUM_CREATED
```

Toda alteração deverá preservar rastreabilidade.

---

# Eventos Produzidos

Exemplos.

```text
VitalSignsRecorded

VitalSignsUpdated

AbnormalVitalSignsDetected
```

---

# Eventos Consumidos

Exemplos.

```text
AppointmentStarted

MedicalRecordCreated
```

---

# Regras de Negócio

Um registro de VitalSigns.

- pertence exatamente a um MedicalRecord;
- pertence exatamente a um Appointment;
- pertence exatamente a um Patient;
- pertence exatamente a um Professional;
- poderá registrar uma ou diversas medições;
- deverá preservar histórico completo.

O sistema poderá emitir alertas automáticos quando valores críticos forem identificados.

---

# Ciclo de Vida

```text
Coleta

↓

Registro

↓

Validação

↓

Assinatura do Prontuário

↓

Consulta Histórica
```

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- Row Level Security;
- LGPD.

Somente profissionais autorizados poderão registrar ou consultar sinais vitais.

---

# Performance

Consultas por.

```text
patient_id

measured_at

medical_record_id
```

Deverão utilizar índices apropriados.

O histórico evolutivo deverá responder rapidamente mesmo após anos de utilização.

---

# Observações

A entidade VitalSigns deverá permitir múltiplos registros durante um mesmo atendimento.

Exemplo.

```text
08:00

PA 12x8

↓

09:30

PA 10x7

↓

11:00

PA 11x7
```

Essa abordagem permite acompanhar a evolução clínica durante consultas prolongadas, observações e internações futuras.

A estrutura também facilita integração com dispositivos médicos e wearables.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- MedicalRecord
- Patient
- Professional
- Appointment

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

A entidade VitalSigns será utilizada para registrar medições fisiológicas estruturadas do paciente, preservando histórico clínico e permitindo evolução futura da plataforma.

**Motivação**

- Continuidade do cuidado
- Estruturação dos dados
- Apoio à decisão clínica
- Integração com dispositivos
- Inteligência Artificial

**Alternativas Avaliadas**

- Registrar sinais vitais em texto livre
- Armazenar diretamente no MedicalRecord
- Utilizar apenas anexos

**Resultado**

Os sinais vitais serão armazenados como entidades independentes, permitindo consultas evolutivas, validações automáticas e integração com futuras funcionalidades analíticas.

---

# Encerramento do Clinical Domain

## Entidades concluídas

```text
Patient

Professional

Specialty

ProfessionalSpecialty

Allergy

Medication

VitalSigns
```

---

# Próxima Entidade

---

# Entidade — Payment

## Resumo

A entidade **Payment** representa um pagamento registrado no MedFlow.

Ela controla todo o ciclo financeiro de uma cobrança, desde sua criação até sua liquidação, estorno ou cancelamento, permitindo rastreamento completo das transações financeiras da plataforma.

Os pagamentos poderão estar relacionados a assinaturas, serviços clínicos ou futuras funcionalidades financeiras.

---

# Objetivo

Registrar transações financeiras de forma estruturada, garantindo rastreabilidade, auditoria, integração com gateways de pagamento e consistência financeira da plataforma.

---

# Domínio

Financial

---

# Classificação da Entidade

```text
Tipo: Entidade de Negócio

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Financeiros

Criticidade: Muito Alta
```

---

# Valor Financeiro

```text
Documento Financeiro

Sim

Valor Contábil

Sim

Integração Bancária

Sim

Retenção

Conforme legislação fiscal aplicável

Alteração Após Liquidação

Restrita
```

Pagamentos representam registros financeiros oficiais.

---

# Imutabilidade

```text
Criado

↓

Aguardando Pagamento

↓

Pago

↓

Somente Estorno

↓

Histórico Permanente
```

Após a confirmação do pagamento.

Os dados financeiros deverão permanecer preservados.

---

# Responsabilidades

A entidade Payment é responsável por.

- registrar pagamentos;
- controlar status financeiro;
- armazenar informações do gateway;
- registrar liquidação;
- registrar estornos;
- preservar histórico financeiro.

---

# Dono da Entidade

Financial Domain

---

# Dependências

A entidade depende de.

```text
Clinic

Subscription
```

Opcionalmente.

```text
Appointment

Invoice
```

Permitindo expansão futura para cobranças clínicas.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Billing

Reports

Notifications

Audit Logs

Webhook

Subscription
```

---

# Relacionamentos

## Muitos para Um

```text
Payments

↓

Clinic
```

---

```text
Payments

↓

Subscription
```

---

## Muitos para Um (Opcional)

```text
Payments

↓

Appointment
```

---

```text
Payments

↓

Invoice
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

clinic_id

subscription_id

amount

currency

status

payment_method

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
appointment_id

invoice_id

gateway

gateway_transaction_id

paid_at

due_date

refunded_at

refund_reason

external_reference
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para clinic_id.
- Foreign Key para subscription_id.
- Foreign Key opcional para appointment_id.
- Foreign Key opcional para invoice_id.
- NOT NULL para campos obrigatórios.
- CHECK para valores monetários positivos.

---

# Índices

Índices recomendados.

```text
clinic_id

subscription_id

status

paid_at

gateway_transaction_id
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

Pagamentos representam registros financeiros oficiais.

Nunca deverão ser removidos.

---

# Auditoria

Operações auditadas.

```text
CREATE

PAYMENT_PENDING

PAYMENT_CONFIRMED

PAYMENT_FAILED

PAYMENT_REFUNDED

PAYMENT_CANCELLED
```

---

# Eventos Produzidos

Exemplos.

```text
PaymentCreated

PaymentPending

PaymentApproved

PaymentFailed

PaymentRefunded

PaymentCancelled
```

---

# Eventos Consumidos

Exemplos.

```text
SubscriptionCreated

InvoiceGenerated

GatewayWebhookReceived
```

---

# Regras de Negócio

Um Payment.

- pertence exatamente a uma Clinic;
- pertence exatamente a uma Subscription;
- poderá estar associado a um Appointment;
- poderá gerar estornos;
- poderá ser conciliado automaticamente;
- deverá permanecer preservado permanentemente.

O status financeiro deverá ser atualizado exclusivamente através de eventos autorizados.

---

# Ciclo de Vida

```text
Criado

↓

Cobrança Gerada

↓

Aguardando Pagamento

↓

Pago

↓

Conciliação

↓

Histórico
```

Fluxos alternativos.

```text
Criado

↓

Cancelado
```

ou.

```text
Pago

↓

Estornado
```

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- Row Level Security;
- LGPD.

Informações sensíveis do meio de pagamento nunca deverão ser armazenadas diretamente.

Dados como número completo do cartão ou CVV não deverão ser persistidos.

---

# Performance

Consultas por.

```text
clinic_id

status

paid_at

gateway_transaction_id
```

Deverão utilizar índices apropriados.

Consultas financeiras deverão permitir geração eficiente de relatórios e conciliações.

---

# Observações

A entidade Payment representa a transação financeira.

Ela não substitui documentos fiscais nem faturas.

Integrações com gateways deverão armazenar apenas identificadores externos e metadados necessários para rastreamento.

Essa abordagem reduz riscos de segurança e facilita integração com diferentes provedores de pagamento.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Clinic
- Subscription
- Invoice
- Appointment

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

A entidade Payment será responsável pelo registro oficial das transações financeiras do MedFlow, mantendo separação entre cobranças, assinaturas e documentos fiscais.

**Motivação**

- Integridade financeira
- Auditoria
- Escalabilidade
- Integração com gateways
- Segurança

**Alternativas Avaliadas**

- Pagamentos diretamente na Subscription
- Controle apenas pelo gateway
- Registros financeiros em texto livre

**Resultado**

Os pagamentos serão armazenados como entidades independentes, permitindo conciliação, rastreabilidade, integração com múltiplos gateways e evolução futura do módulo financeiro.

---

# Próxima Entidade

---

# Entidade — Invoice

## Resumo

A entidade **Invoice** representa uma fatura gerada pelo MedFlow para cobrança de serviços, assinaturas ou outras obrigações financeiras.

Ela documenta o valor devido, vencimento, status da cobrança e sua relação com pagamentos efetuados.

Uma Invoice poderá possuir nenhum, um ou diversos pagamentos associados, dependendo das regras financeiras adotadas pela plataforma.

---

# Objetivo

Representar oficialmente uma cobrança emitida pela plataforma, permitindo acompanhar seu ciclo de vida desde a emissão até a liquidação ou cancelamento.

---

# Domínio

Financial

---

# Classificação da Entidade

```text
Tipo: Entidade de Negócio

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Financeiros

Criticidade: Muito Alta
```

---

# Valor Financeiro

```text
Documento Financeiro

Sim

Documento Fiscal

Opcional

Integração Bancária

Sim

Retenção

Conforme legislação fiscal

Alteração Após Emissão

Controlada
```

A Invoice representa o documento oficial da cobrança.

---

# Imutabilidade

```text
Rascunho

↓

Emitida

↓

Pagamento

↓

Quitada

↓

Histórico Permanente
```

Após a emissão.

As alterações deverão seguir regras financeiras específicas.

---

# Responsabilidades

A entidade Invoice é responsável por.

- registrar cobranças;
- controlar vencimentos;
- controlar valores;
- registrar descontos;
- registrar multas;
- acompanhar liquidação;
- preservar histórico financeiro.

---

# Dono da Entidade

Financial Domain

---

# Dependências

A entidade depende de.

```text
Clinic

Subscription
```

Opcionalmente.

```text
Appointment

Billing
```

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Payments

Notifications

Reports

Webhook

Billing
```

---

# Relacionamentos

## Muitos para Um

```text
Invoices

↓

Clinic
```

---

```text
Invoices

↓

Subscription
```

---

## Um para Muitos

```text
Invoice

↓

Payments
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

clinic_id

subscription_id

invoice_number

amount

currency

status

issue_date

due_date

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
appointment_id

billing_id

discount_amount

interest_amount

fine_amount

paid_amount

paid_at

cancelled_at

external_invoice_id
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para clinic_id.
- Foreign Key para subscription_id.
- NOT NULL para campos obrigatórios.
- CHECK para valores monetários válidos.

---

# Índices

Índices recomendados.

```text
clinic_id

invoice_number

status

due_date
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

Faturas representam documentos financeiros oficiais.

Nunca deverão ser removidas.

---

# Auditoria

Operações auditadas.

```text
CREATE

ISSUE

UPDATE

CANCEL

OVERDUE

PAID
```

---

# Eventos Produzidos

Exemplos.

```text
InvoiceCreated

InvoiceIssued

InvoiceOverdue

InvoicePaid

InvoiceCancelled
```

---

# Eventos Consumidos

Exemplos.

```text
SubscriptionCreated

PaymentApproved

BillingGenerated
```

---

# Regras de Negócio

Uma Invoice.

- pertence exatamente a uma Clinic;
- pertence exatamente a uma Subscription;
- poderá possuir diversos pagamentos;
- poderá receber pagamentos parciais;
- poderá ser cancelada;
- deverá permanecer preservada permanentemente.

Uma Invoice quitada não poderá retornar ao estado de rascunho.

---

# Ciclo de Vida

```text
Criada

↓

Emitida

↓

Aguardando Pagamento

↓

Parcialmente Paga (Opcional)

↓

Quitada
```

Fluxos alternativos.

```text
Emitida

↓

Cancelada
```

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- Row Level Security.

Somente usuários autorizados poderão emitir ou cancelar cobranças.

---

# Performance

Consultas por.

```text
clinic_id

status

due_date

invoice_number
```

Deverão utilizar índices apropriados.

Relatórios financeiros deverão utilizar paginação e filtros eficientes.

---

# Observações

A Invoice representa a cobrança.

Ela não representa o pagamento.

Essa separação permite.

- múltiplas tentativas de pagamento;
- pagamentos parciais;
- parcelamentos;
- conciliações bancárias;
- integração com diversos gateways.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Payment
- Subscription
- Clinic
- Billing

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

A entidade Invoice será utilizada para representar oficialmente as cobranças emitidas pela plataforma, separando o conceito de cobrança do conceito de pagamento.

**Motivação**

- Integridade financeira
- Escalabilidade
- Conciliação
- Múltiplos pagamentos
- Organização contábil

**Alternativas Avaliadas**

- Cobranças diretamente em Payment
- Sem entidade própria para faturas
- Uma cobrança por pagamento

**Resultado**

As faturas serão implementadas como entidades independentes, permitindo controle completo do ciclo financeiro e preparação para futuras integrações fiscais e bancárias.

---

# Próxima Entidade

---

# Entidade — Billing

## Resumo

A entidade **Billing** representa o processo de cobrança do MedFlow.

Ela é responsável por controlar a geração automática de cobranças, recorrências, renovações de assinaturas, tentativas de pagamento e demais operações relacionadas ao faturamento da plataforma.

Enquanto a Invoice representa a cobrança emitida e o Payment representa a liquidação financeira, o Billing representa o mecanismo que coordena todo esse fluxo.

---

# Objetivo

Centralizar as regras de faturamento da plataforma, permitindo automatizar cobranças recorrentes, controlar ciclos financeiros e integrar diferentes gateways de pagamento.

---

# Domínio

Financial

---

# Classificação da Entidade

```text
Tipo: Entidade de Processo

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Financeiros

Criticidade: Muito Alta
```

---

# Valor Financeiro

```text
Documento Financeiro

Não

Processo Financeiro

Sim

Automação

Sim

Retenção

Conforme política financeira

Alteração

Controlada
```

Billing representa um processo operacional.

Não um documento financeiro.

---

# Responsabilidades

A entidade Billing é responsável por.

- gerar cobranças;
- controlar recorrências;
- executar renovações;
- iniciar pagamentos;
- acompanhar inadimplência;
- automatizar faturamento.

---

# Dono da Entidade

Financial Domain

---

# Dependências

A entidade depende de.

```text
Clinic

Subscription

Plan
```

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Invoices

Payments

Notifications

Webhook

Reports

Audit Logs
```

---

# Relacionamentos

## Muitos para Um

```text
Billings

↓

Clinic
```

---

```text
Billings

↓

Subscription
```

---

## Um para Muitos

```text
Billing

↓

Invoices
```

---

```text
Billing

↓

Payments
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

clinic_id

subscription_id

billing_cycle

next_billing_date

status

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
last_billing_date

retry_count

last_retry_at

gateway

payment_method

notes

cancelled_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para clinic_id.
- Foreign Key para subscription_id.
- NOT NULL para campos obrigatórios.
- CHECK para datas consistentes.

---

# Índices

Índices recomendados.

```text
clinic_id

subscription_id

status

next_billing_date
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

O histórico do faturamento deverá permanecer disponível para auditoria.

---

# Auditoria

Operações auditadas.

```text
CREATE

GENERATE_INVOICE

RETRY_PAYMENT

CANCEL

REACTIVATE

UPDATE
```

---

# Eventos Produzidos

Exemplos.

```text
BillingCreated

BillingStarted

InvoiceGenerated

BillingRetryScheduled

BillingCancelled

BillingCompleted
```

---

# Eventos Consumidos

Exemplos.

```text
SubscriptionActivated

PaymentApproved

PaymentFailed

InvoiceOverdue
```

---

# Regras de Negócio

Um Billing.

- pertence exatamente a uma Clinic;
- pertence exatamente a uma Subscription;
- poderá gerar diversas Invoices;
- poderá gerar diversas tentativas de pagamento;
- poderá controlar cobranças recorrentes;
- deverá permanecer preservado para auditoria.

A recorrência deverá respeitar o ciclo definido no plano contratado.

---

# Ciclo de Vida

```text
Criado

↓

Ativo

↓

Geração de Cobrança

↓

Tentativa de Pagamento

↓

Sucesso ou Nova Tentativa

↓

Próximo Ciclo
```

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- Row Level Security.

Operações automáticas deverão ser executadas por processos autenticados da plataforma.

---

# Performance

Consultas por.

```text
clinic_id

status

next_billing_date
```

Deverão possuir índices apropriados.

Rotinas automáticas deverão localizar rapidamente cobranças pendentes.

---

# Observações

A entidade Billing representa o fluxo operacional do faturamento.

Ela não substitui.

- Invoice;
- Payment;
- Subscription.

Sua função é coordenar todo o processo financeiro.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Subscription
- Invoice
- Payment
- Plan

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

A entidade Billing será responsável pela automação e coordenação do faturamento recorrente da plataforma.

**Motivação**

- Automação
- Escalabilidade
- Organização
- Auditoria
- Integração com gateways

**Alternativas Avaliadas**

- Lógica de cobrança diretamente na Subscription
- Cobranças implementadas apenas por Jobs
- Processo financeiro distribuído em múltiplos módulos

**Resultado**

O faturamento será centralizado na entidade Billing, permitindo controle completo dos ciclos de cobrança, renovações e integrações financeiras.

---

# Próxima Entidade

---

# Entidade — Refund

## Resumo

A entidade **Refund** representa um estorno realizado sobre um pagamento registrado no MedFlow.

Ela documenta devoluções totais ou parciais de valores, preservando o histórico financeiro da plataforma e permitindo rastreabilidade completa das operações.

Um Refund nunca substitui um Payment.

Ele apenas registra uma operação financeira derivada.

---

# Objetivo

Registrar estornos financeiros de forma estruturada, garantindo integridade contábil, rastreabilidade e integração com gateways de pagamento.

---

# Domínio

Financial

---

# Classificação da Entidade

```text
Tipo: Entidade de Negócio

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Financeiros

Criticidade: Muito Alta
```

---

# Valor Financeiro

```text
Documento Financeiro

Sim

Documento Contábil

Sim

Integração Bancária

Sim

Retenção

Conforme legislação fiscal

Alteração Após Confirmação

Não Permitida
```

O estorno representa uma movimentação financeira oficial.

---

# Imutabilidade

```text
Solicitado

↓

Processamento

↓

Confirmado

↓

Histórico Permanente
```

Após confirmação.

O registro deverá permanecer imutável.

---

# Responsabilidades

A entidade Refund é responsável por.

- registrar estornos;
- controlar valores devolvidos;
- registrar motivos;
- acompanhar processamento;
- integrar gateways;
- preservar histórico financeiro.

---

# Dono da Entidade

Financial Domain

---

# Dependências

A entidade depende de.

```text
Payment
```

Opcionalmente.

```text
Invoice

Subscription
```

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Reports

Webhook

Audit Logs

Financial Dashboard
```

---

# Relacionamentos

## Muitos para Um

```text
Refunds

↓

Payment
```

---

## Muitos para Um (Opcional)

```text
Refunds

↓

Invoice
```

---

```text
Refunds

↓

Subscription
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

payment_id

amount

currency

reason

status

requested_at

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
invoice_id

subscription_id

gateway

gateway_refund_id

processed_at

processed_by

notes

external_reference
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para payment_id.
- Foreign Key opcional para invoice_id.
- Foreign Key opcional para subscription_id.
- NOT NULL para campos obrigatórios.
- CHECK para valores positivos.

O valor total dos estornos não poderá ultrapassar o valor do pagamento.

---

# Índices

Índices recomendados.

```text
payment_id

status

requested_at

processed_at
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

Estornos representam registros financeiros oficiais.

Nunca deverão ser removidos.

---

# Auditoria

Operações auditadas.

```text
CREATE

REQUEST

PROCESS

APPROVE

REJECT

COMPLETE
```

---

# Eventos Produzidos

Exemplos.

```text
RefundRequested

RefundProcessing

RefundApproved

RefundRejected

RefundCompleted
```

---

# Eventos Consumidos

Exemplos.

```text
PaymentApproved

PaymentCancelled

GatewayWebhookReceived
```

---

# Regras de Negócio

Um Refund.

- pertence exatamente a um Payment;
- poderá ser parcial;
- poderá ser total;
- não poderá exceder o valor do pagamento;
- deverá preservar histórico permanente.

Um pagamento poderá possuir diversos estornos, desde que o valor acumulado permaneça dentro do limite pago.

---

# Ciclo de Vida

```text
Solicitação

↓

Processamento

↓

Confirmação

↓

Histórico Permanente
```

Fluxos alternativos.

```text
Solicitação

↓

Rejeitado
```

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- Row Level Security.

Somente usuários autorizados poderão solicitar ou aprovar estornos.

---

# Performance

Consultas por.

```text
payment_id

status

requested_at

processed_at
```

Deverão utilizar índices apropriados.

Relatórios financeiros deverão localizar rapidamente pagamentos estornados.

---

# Observações

Refund representa exclusivamente operações de devolução financeira.

Ele não altera o Payment original.

O saldo líquido deverá ser calculado considerando pagamentos e respectivos estornos.

Essa abordagem preserva integridade contábil e facilita auditorias.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Payment
- Invoice
- Subscription

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

A entidade Refund será utilizada para registrar todas as operações de estorno realizadas pela plataforma, preservando integralmente o histórico financeiro.

**Motivação**

- Integridade financeira
- Auditoria
- Conciliação
- Escalabilidade
- Integração com gateways

**Alternativas Avaliadas**

- Alterar diretamente o Payment
- Excluir pagamentos estornados
- Registrar estornos apenas em logs

**Resultado**

Todos os estornos serão armazenados como entidades independentes, garantindo rastreabilidade, conformidade financeira e suporte a estornos totais e parciais.

---

# Próxima Entidade

---

# Entidade — WebhookEvent

## Resumo

A entidade **WebhookEvent** representa um evento recebido de um serviço externo através de Webhooks.

Ela registra integralmente as notificações enviadas por gateways de pagamento, serviços de assinatura e outras integrações, permitindo rastreabilidade, auditoria e reprocessamento quando necessário.

WebhookEvent representa o registro bruto do evento recebido.

---

# Objetivo

Registrar todos os Webhooks recebidos pela plataforma, garantindo processamento confiável, idempotência e histórico permanente das integrações.

---

# Domínio

Financial

---

# Classificação da Entidade

```text
Tipo: Entidade de Integração

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Operacionais

Criticidade: Muito Alta
```

---

# Valor Operacional

```text
Documento Financeiro

Não

Evento Oficial

Sim

Integração Externa

Sim

Retenção

Conforme política operacional

Alteração

Não Permitida
```

WebhookEvent representa evidência técnica da comunicação entre sistemas.

---

# Imutabilidade

```text
Recebido

↓

Validado

↓

Processado

↓

Arquivado
```

O payload original deverá permanecer preservado.

---

# Responsabilidades

A entidade WebhookEvent é responsável por.

- registrar payload recebido;
- validar assinaturas;
- controlar processamento;
- evitar duplicidade;
- permitir reprocessamento;
- preservar histórico das integrações.

---

# Dono da Entidade

Financial Domain

---

# Dependências

Nenhuma.

Os eventos poderão originar alterações em diversas entidades.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Payment

Invoice

Refund

Subscription

Audit Logs

Monitoring
```

---

# Relacionamentos

## Relações Lógicas

```text
WebhookEvent

↓

Payment
```

---

```text
WebhookEvent

↓

Invoice
```

---

```text
WebhookEvent

↓

Refund
```

---

```text
WebhookEvent

↓

Subscription
```

A associação dependerá do tipo do evento recebido.

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

provider

event_type

external_event_id

payload

signature

status

received_at

created_at
```

---

# Campos Opcionais

Exemplos.

```text
processed_at

processing_attempts

last_error

http_headers

response_payload

related_entity

related_entity_id
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- UNIQUE para external_event_id por provider.
- NOT NULL para campos obrigatórios.

Eventos duplicados não deverão ser processados novamente.

---

# Índices

Índices recomendados.

```text
provider

external_event_id

event_type

status

received_at
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

Eventos recebidos deverão permanecer disponíveis para auditoria.

---

# Auditoria

Operações auditadas.

```text
RECEIVED

VALIDATED

PROCESSED

FAILED

REPROCESSED
```

---

# Eventos Produzidos

Exemplos.

```text
WebhookReceived

WebhookValidated

WebhookProcessed

WebhookFailed

WebhookReprocessed
```

---

# Eventos Consumidos

Exemplos.

```text
GatewayNotificationReceived

PaymentGatewayWebhook

SubscriptionWebhook
```

---

# Regras de Negócio

Um WebhookEvent.

- deverá possuir identificador externo único;
- deverá preservar o payload original;
- poderá ser reprocessado;
- não poderá ser processado duas vezes quando já concluído;
- deverá registrar todas as tentativas de processamento.

A validação da assinatura deverá ocorrer antes do processamento.

---

# Ciclo de Vida

```text
Recebido

↓

Validação

↓

Processamento

↓

Sucesso
```

Fluxos alternativos.

```text
Recebido

↓

Falha

↓

Nova Tentativa

↓

Sucesso
```

---

# Segurança

A entidade deverá respeitar.

- autenticação da origem;
- validação criptográfica da assinatura;
- auditoria completa;
- proteção contra replay attacks.

Somente eventos autenticados deverão ser processados.

---

# Performance

Consultas por.

```text
provider

status

received_at
```

Deverão utilizar índices apropriados.

O processamento deverá ser assíncrono para evitar bloqueios na API.

---

# Observações

WebhookEvent representa exclusivamente o registro técnico dos eventos recebidos.

Ele não executa regras de negócio diretamente.

Seu processamento deverá ocorrer através de Workers ou Background Jobs especializados.

Essa arquitetura melhora escalabilidade, confiabilidade e tolerância a falhas.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Payment
- Invoice
- Refund
- Subscription

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

Todos os Webhooks recebidos pela plataforma serão registrados na entidade WebhookEvent antes de qualquer processamento de negócio.

**Motivação**

- Idempotência
- Auditoria
- Reprocessamento
- Escalabilidade
- Segurança

**Alternativas Avaliadas**

- Processamento direto na API
- Não armazenar Webhooks
- Logs simples sem persistência

**Resultado**

Os Webhooks serão persistidos como entidades independentes, permitindo processamento assíncrono, recuperação de falhas, auditoria e integração segura com múltiplos provedores externos.

---

# Encerramento do Domínio

## Financial Domain ✅

Entidades concluídas.

```text
Payment

Invoice

Billing

Refund

WebhookEvent
```

---

# Próxima Entidade

---

# Entidade — Notification

## Resumo

A entidade **Notification** representa uma notificação enviada ou agendada pelo MedFlow.

Ela centraliza todas as comunicações geradas pela plataforma, permitindo envio através de múltiplos canais, acompanhamento do status de entrega e rastreabilidade completa das mensagens.

Uma Notification representa o evento de comunicação.

Não necessariamente uma mensagem já entregue.

---

# Objetivo

Centralizar o gerenciamento das notificações da plataforma, permitindo comunicação consistente, auditoria, agendamento e integração com diferentes provedores de mensagens.

---

# Domínio

Communication

---

# Classificação da Entidade

```text
Tipo: Entidade de Comunicação

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Pessoais

Criticidade: Alta
```

---

# Valor Operacional

```text
Comunicação Oficial

Pode ser

Auditoria

Obrigatória

Agendamento

Sim

Retenção

Conforme política da plataforma
```

A Notification representa o registro oficial do processo de comunicação.

---

# Responsabilidades

A entidade Notification é responsável por.

- registrar notificações;
- controlar canais de envio;
- controlar status;
- registrar tentativas;
- permitir agendamento;
- preservar histórico de comunicação.

---

# Dono da Entidade

Communication Domain

---

# Dependências

Opcionalmente.

```text
User

Patient

Professional

Clinic
```

A notificação poderá possuir qualquer destinatário suportado pela plataforma.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Email

SMS

WhatsApp

Push Notification

Audit Logs

Reports
```

---

# Relacionamentos

## Associação Lógica

```text
Notification

↓

Recipient
```

O destinatário dependerá do contexto da notificação.

---

## Um para Muitos

```text
Notification

↓

Delivery Attempts
```

Cada notificação poderá possuir diversas tentativas de envio.

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

clinic_id

channel

recipient_type

recipient_id

subject

status

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
body

template_id

scheduled_at

sent_at

delivered_at

read_at

priority

retry_count

provider

provider_message_id
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para clinic_id.
- NOT NULL para campos obrigatórios.
- CHECK para canais válidos.
- CHECK para status válidos.

---

# Índices

Índices recomendados.

```text
clinic_id

recipient_id

channel

status

scheduled_at
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

O histórico das comunicações deverá permanecer preservado.

---

# Auditoria

Operações auditadas.

```text
CREATE

QUEUE

SEND

DELIVER

READ

FAIL

RETRY

CANCEL
```

---

# Eventos Produzidos

Exemplos.

```text
NotificationCreated

NotificationQueued

NotificationSent

NotificationDelivered

NotificationRead

NotificationFailed
```

---

# Eventos Consumidos

Exemplos.

```text
AppointmentScheduled

PaymentApproved

PrescriptionCreated

ExamResultReceived
```

---

# Regras de Negócio

Uma Notification.

- poderá utilizar diversos canais;
- poderá ser agendada;
- poderá possuir múltiplas tentativas;
- poderá registrar confirmação de leitura;
- deverá permanecer preservada para auditoria.

Falhas de envio deverão gerar nova tentativa conforme política configurada.

---

# Ciclo de Vida

```text
Criada

↓

Fila

↓

Enviada

↓

Entregue

↓

Lida
```

Fluxos alternativos.

```text
Criada

↓

Falha

↓

Nova Tentativa

↓

Entregue
```

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- LGPD;
- políticas de consentimento.

Notificações contendo informações sensíveis deverão utilizar canais seguros.

---

# Performance

Consultas por.

```text
recipient_id

status

channel

scheduled_at
```

Deverão utilizar índices apropriados.

Processamentos deverão ocorrer de forma assíncrona através de filas.

---

# Observações

A entidade Notification representa o processo de comunicação.

Ela não substitui logs específicos de e-mail, SMS ou Push.

Esses registros poderão existir em entidades próprias para armazenar informações específicas de cada provedor.

A separação facilita integrações futuras com diferentes serviços de comunicação.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- NotificationTemplate
- EmailLog
- SMSLog
- User
- Patient

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

A entidade Notification será utilizada como ponto central de toda comunicação realizada pelo MedFlow, abstraindo os diferentes canais de envio.

**Motivação**

- Centralização
- Auditoria
- Escalabilidade
- Reutilização
- Integração com múltiplos provedores

**Alternativas Avaliadas**

- Comunicação implementada diretamente por cada módulo
- Apenas logs de e-mail
- Entidades separadas sem camada central

**Resultado**

Toda comunicação será iniciada através da entidade Notification, permitindo gerenciamento unificado, rastreabilidade e expansão para novos canais.

---

# Próxima Entidade

---

# Entidade — NotificationTemplate

## Resumo

A entidade **NotificationTemplate** representa um modelo reutilizável de comunicação utilizado pelo MedFlow.

Ela permite padronizar mensagens enviadas por e-mail, SMS, WhatsApp, Push Notification ou notificações internas, utilizando variáveis dinâmicas para personalização.

Os templates pertencem à plataforma e podem ser reutilizados por diversos módulos.

---

# Objetivo

Centralizar os modelos de comunicação da plataforma, garantindo consistência visual, reutilização e facilidade de manutenção.

---

# Domínio

Communication

---

# Classificação da Entidade

```text
Tipo: Entidade de Referência

Persistência: Permanente

Multi-Tenant: Não

Auditoria: Obrigatória

Soft Delete: Sim

LGPD: Não se aplica

Criticidade: Média
```

---

# Valor Operacional

```text
Modelo Oficial

Sim

Reutilização

Sim

Versionamento

Recomendado

Retenção

Permanente
```

Os templates representam modelos reutilizáveis.

Não representam comunicações efetivamente enviadas.

---

# Responsabilidades

A entidade NotificationTemplate é responsável por.

- padronizar mensagens;
- armazenar modelos;
- permitir personalização;
- controlar versões;
- facilitar manutenção;
- reduzir duplicidade.

---

# Dono da Entidade

Communication Domain

---

# Dependências

Nenhuma.

Os templates pertencem à plataforma.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Notification

Email

SMS

WhatsApp

Push Notification

Reports
```

---

# Relacionamentos

## Um para Muitos

```text
NotificationTemplate

↓

Notifications
```

Um template poderá originar diversas notificações.

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

name

slug

channel

subject

body

status

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
description

language

version

variables

deleted_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Unique para slug.
- NOT NULL para campos obrigatórios.

O slug deverá identificar unicamente cada template.

---

# Índices

Índices recomendados.

```text
slug

channel

status
```

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo obrigatório.

```text
deleted_at
```

Templates antigos deverão permanecer preservados para manter o histórico das comunicações.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

PUBLISH

ARCHIVE

RESTORE
```

---

# Eventos Produzidos

Exemplos.

```text
NotificationTemplateCreated

NotificationTemplateUpdated

NotificationTemplatePublished

NotificationTemplateArchived
```

---

# Eventos Consumidos

Exemplos.

```text
NotificationRequested

SystemConfigurationUpdated
```

---

# Regras de Negócio

Um NotificationTemplate.

- poderá ser utilizado por diversas notificações;
- deverá possuir um canal definido;
- poderá possuir variáveis dinâmicas;
- poderá possuir múltiplas versões;
- poderá ser arquivado;
- deverá preservar histórico.

Templates publicados deverão passar por validação antes da utilização.

---

# Ciclo de Vida

```text
Criação

↓

Edição

↓

Publicação

↓

Utilização

↓

Arquivamento
```

---

# Segurança

Somente administradores autorizados poderão.

- criar templates;
- alterar templates;
- publicar versões;
- arquivar templates.

---

# Performance

Consultas por.

```text
slug

channel

status
```

Deverão utilizar índices apropriados.

Templates frequentemente utilizados poderão ser mantidos em cache.

---

# Observações

A entidade NotificationTemplate representa exclusivamente modelos reutilizáveis.

As mensagens efetivamente enviadas pertencem à entidade Notification.

O corpo do template poderá utilizar variáveis como.

```text
{{patient_name}}

{{appointment_date}}

{{clinic_name}}

{{professional_name}}

{{payment_due_date}}
```

As variáveis deverão ser resolvidas apenas durante a geração da notificação.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Notification
- Patient
- Appointment
- Payment

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

A plataforma utilizará NotificationTemplate para centralizar todos os modelos de comunicação utilizados pelo MedFlow.

**Motivação**

- Padronização
- Reutilização
- Facilidade de manutenção
- Versionamento
- Escalabilidade

**Alternativas Avaliadas**

- Mensagens escritas diretamente no código
- Templates duplicados em cada módulo
- Arquivos estáticos

**Resultado**

Todos os modelos de comunicação serão armazenados na entidade NotificationTemplate, permitindo reutilização, personalização dinâmica e evolução contínua da plataforma.

---

# Próxima Entidade

---

# Entidade — NotificationDelivery

## Resumo

A entidade **NotificationDelivery** representa uma tentativa de entrega de uma notificação gerada pelo MedFlow.

Ela registra todas as informações relacionadas ao envio, processamento, resposta do provedor e confirmação de entrega, independentemente do canal utilizado.

Uma única Notification poderá possuir diversas entregas.

---

# Objetivo

Registrar todas as tentativas de entrega das notificações da plataforma, permitindo auditoria, monitoramento, reprocessamento e integração com múltiplos provedores de comunicação.

---

# Domínio

Communication

---

# Classificação da Entidade

```text
Tipo: Entidade de Processo

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Pessoais

Criticidade: Alta
```

---

# Valor Operacional

```text
Entrega Oficial

Sim

Auditoria

Obrigatória

Reprocessamento

Permitido

Retenção

Conforme política operacional
```

A entidade representa o histórico operacional do envio das notificações.

---

# Responsabilidades

A entidade NotificationDelivery é responsável por.

- registrar tentativas de envio;
- registrar respostas dos provedores;
- controlar falhas;
- controlar reenvios;
- registrar confirmações de entrega;
- preservar histórico operacional.

---

# Dono da Entidade

Communication Domain

---

# Dependências

A entidade depende de.

```text
Notification
```

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Reports

Monitoring

Audit Logs

Retry Workers

Analytics
```

---

# Relacionamentos

## Muitos para Um

```text
NotificationDeliveries

↓

Notification
```

Uma notificação poderá possuir diversas tentativas de entrega.

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

notification_id

channel

provider

status

attempt_number

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
provider_message_id

provider_response

provider_error

sent_at

delivered_at

read_at

failed_at

processing_time

retry_reason
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para notification_id.
- NOT NULL para campos obrigatórios.
- CHECK para canais válidos.
- CHECK para status válidos.

---

# Índices

Índices recomendados.

```text
notification_id

provider

status

channel

sent_at
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

O histórico de entregas deverá permanecer preservado.

---

# Auditoria

Operações auditadas.

```text
CREATE

SEND

DELIVER

READ

FAIL

RETRY
```

Todas as tentativas deverão permanecer registradas.

---

# Eventos Produzidos

Exemplos.

```text
NotificationDeliveryCreated

NotificationSent

NotificationDelivered

NotificationRead

NotificationFailed

NotificationRetried
```

---

# Eventos Consumidos

Exemplos.

```text
NotificationQueued

ProviderWebhookReceived

RetryScheduled
```

---

# Regras de Negócio

Uma NotificationDelivery.

- pertence exatamente a uma Notification;
- representa apenas uma tentativa de envio;
- poderá registrar falhas;
- poderá registrar confirmação de leitura;
- poderá originar nova tentativa;
- deverá permanecer preservada permanentemente.

Cada tentativa deverá possuir número sequencial.

---

# Ciclo de Vida

```text
Criada

↓

Envio

↓

Entregue
```

Fluxos alternativos.

```text
Criada

↓

Falha

↓

Nova Tentativa

↓

Entregue
```

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- proteção de dados;
- LGPD.

Respostas completas dos provedores deverão ser armazenadas apenas quando estritamente necessárias.

---

# Performance

Consultas por.

```text
notification_id

status

provider

channel
```

Deverão utilizar índices apropriados.

Monitoramentos em tempo real deverão utilizar processamento assíncrono.

---

# Observações

NotificationDelivery elimina a necessidade de entidades específicas como.

```text
EmailLog

SMSLog

WhatsAppLog

PushLog
```

Novos canais poderão ser adicionados apenas incluindo novos valores para o campo `channel`, sem necessidade de alterações estruturais no banco.

Essa abordagem reduz duplicação e facilita a evolução da plataforma.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Notification
- NotificationTemplate

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O MedFlow utilizará uma única entidade NotificationDelivery para registrar todas as tentativas de entrega das notificações, independentemente do canal utilizado.

**Motivação**

- Escalabilidade
- Baixo acoplamento
- Reutilização
- Auditoria
- Facilidade de integração

**Alternativas Avaliadas**

- EmailLog
- SMSLog
- WhatsAppLog
- PushLog
- Logs separados por provedor

**Resultado**

Todas as entregas serão registradas em NotificationDelivery, permitindo monitoramento centralizado, suporte a múltiplos canais e expansão futura sem alterações estruturais.

---

# Encerramento do Domínio

## Communication Domain ✅

Entidades concluídas.

```text
Notification

NotificationTemplate

NotificationDelivery
```

---

# Próxima Entidade

---

# Entidade — AuditLog

## Resumo

A entidade **AuditLog** representa o registro oficial de auditoria do MedFlow.

Ela documenta todas as ações relevantes executadas por usuários, processos automáticos e integrações externas, permitindo rastrear alterações realizadas na plataforma.

O AuditLog constitui um dos principais mecanismos de segurança e conformidade do sistema.

---

# Objetivo

Registrar eventos de auditoria de forma estruturada, garantindo rastreabilidade, conformidade regulatória, investigação de incidentes e preservação do histórico operacional.

---

# Domínio

Infrastructure

---

# Classificação da Entidade

```text
Tipo: Entidade de Infraestrutura

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Não se aplica

Soft Delete: Não

LGPD: Dados Operacionais

Criticidade: Máxima
```

---

# Valor Operacional

```text
Registro Oficial

Sim

Conformidade

Sim

Investigação

Sim

Retenção

Conforme legislação e políticas internas

Alteração

Não Permitida
```

O AuditLog representa a evidência oficial das operações realizadas na plataforma.

---

# Imutabilidade

```text
Evento Registrado

↓

Persistido

↓

Somente Leitura

↓

Histórico Permanente
```

Após registrado.

O evento nunca deverá ser alterado.

---

# Responsabilidades

A entidade AuditLog é responsável por.

- registrar ações dos usuários;
- registrar ações automáticas;
- registrar eventos de segurança;
- registrar alterações em entidades;
- preservar evidências;
- apoiar investigações.

---

# Dono da Entidade

Infrastructure Domain

---

# Dependências

Opcionalmente.

```text
User

Clinic

Session

ApiKey
```

O evento poderá estar associado a diferentes origens.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Reports

Monitoring

Security

Compliance

Analytics
```

---

# Relacionamentos

## Muitos para Um (Opcional)

```text
AuditLogs

↓

User
```

---

```text
AuditLogs

↓

Clinic
```

---

```text
AuditLogs

↓

Session
```

---

```text
AuditLogs

↓

ApiKey
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

event_type

entity_type

entity_id

action

created_at
```

---

# Campos Opcionais

Exemplos.

```text
user_id

clinic_id

session_id

api_key_id

ip_address

user_agent

old_values

new_values

metadata

request_id
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key opcional para user_id.
- Foreign Key opcional para clinic_id.
- NOT NULL para campos obrigatórios.

Os dados históricos nunca deverão ser sobrescritos.

---

# Índices

Índices recomendados.

```text
user_id

clinic_id

entity_type

entity_id

event_type

created_at
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

Registros de auditoria representam evidências permanentes.

Nunca deverão ser removidos.

---

# Auditoria

A própria entidade representa o mecanismo de auditoria.

Operações administrativas relacionadas à retenção ou arquivamento deverão ser registradas separadamente.

---

# Eventos Produzidos

Exemplos.

```text
AuditLogCreated

SecurityEventDetected

SensitiveDataAccessed
```

---

# Eventos Consumidos

Praticamente todas as entidades da plataforma poderão originar registros.

Exemplos.

```text
UserUpdated

PatientCreated

MedicalRecordSigned

PaymentApproved

LoginSucceeded

LoginFailed

ApiKeyCreated
```

---

# Regras de Negócio

Um AuditLog.

- poderá estar associado a um usuário;
- poderá estar associado a uma clínica;
- poderá registrar alterações de qualquer entidade;
- deverá preservar valores anteriores e posteriores quando aplicável;
- deverá permanecer imutável.

Eventos críticos deverão ser registrados imediatamente.

---

# Ciclo de Vida

```text
Evento

↓

Registro

↓

Consulta

↓

Arquivamento
```

Não existe exclusão lógica ou física durante a retenção obrigatória.

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- LGPD.

Somente usuários autorizados poderão consultar registros de auditoria.

Eventos críticos deverão possuir proteção adicional contra alteração.

---

# Performance

Consultas por.

```text
user_id

entity_type

event_type

created_at
```

Deverão utilizar índices apropriados.

Registros antigos poderão ser arquivados em armazenamento de baixo custo, mantendo capacidade de consulta quando necessário.

---

# Observações

AuditLog representa a principal fonte de rastreabilidade do MedFlow.

Ele deverá registrar.

- quem realizou a ação;
- quando ocorreu;
- em qual entidade;
- quais dados foram alterados;
- origem da requisição;
- contexto operacional.

Sempre que possível.

Os registros deverão ser estruturados para facilitar buscas e geração de relatórios.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- User
- Session
- ApiKey
- Clinic

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

Toda operação relevante realizada no MedFlow será registrada na entidade AuditLog, garantindo rastreabilidade completa da plataforma.

**Motivação**

- Segurança
- Conformidade
- Investigação
- Auditoria
- Governança

**Alternativas Avaliadas**

- Logs apenas em arquivos
- Auditoria parcial
- Logs distribuídos sem persistência

**Resultado**

O AuditLog será a fonte oficial de auditoria do MedFlow, registrando eventos estruturados e imutáveis para apoiar segurança, conformidade e monitoramento.

---

# Próxima Entidade

---

# Entidade — BackgroundJob

## Resumo

A entidade **BackgroundJob** representa uma tarefa executada em segundo plano pelo MedFlow.

Ela registra operações assíncronas como envio de notificações, processamento de inteligência artificial, geração de relatórios, importações, exportações e integrações externas.

O BackgroundJob permite monitoramento, reprocessamento e auditoria das tarefas automatizadas da plataforma.

---

# Objetivo

Gerenciar tarefas assíncronas de forma estruturada, permitindo escalabilidade, tolerância a falhas, monitoramento e processamento distribuído.

---

# Domínio

Infrastructure

---

# Classificação da Entidade

```text
Tipo: Entidade de Infraestrutura

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Operacionais

Criticidade: Alta
```

---

# Valor Operacional

```text
Processamento Assíncrono

Sim

Monitoramento

Sim

Reprocessamento

Sim

Retenção

Conforme política operacional

Alteração

Controlada
```

BackgroundJob representa o histórico operacional das tarefas executadas.

---

# Responsabilidades

A entidade BackgroundJob é responsável por.

- registrar tarefas;
- controlar filas;
- acompanhar execução;
- registrar falhas;
- permitir reprocessamento;
- preservar histórico operacional.

---

# Dono da Entidade

Infrastructure Domain

---

# Dependências

Opcionalmente.

```text
User

Clinic

WebhookEvent
```

Uma tarefa poderá ser iniciada por usuários, eventos ou processos automáticos.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Notifications

Reports

AI

Import

Export

Monitoring

Audit Logs
```

---

# Relacionamentos

## Muitos para Um (Opcional)

```text
BackgroundJobs

↓

User
```

---

```text
BackgroundJobs

↓

Clinic
```

---

```text
BackgroundJobs

↓

WebhookEvent
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

job_type

queue

status

payload

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
user_id

clinic_id

webhook_event_id

scheduled_at

started_at

finished_at

attempts

max_attempts

priority

worker

last_error

result
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key opcional para user_id.
- Foreign Key opcional para clinic_id.
- NOT NULL para campos obrigatórios.
- CHECK para status válidos.
- CHECK para attempts <= max_attempts.

---

# Índices

Índices recomendados.

```text
status

queue

scheduled_at

started_at

job_type
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

O histórico das tarefas deverá permanecer disponível para auditoria e monitoramento.

---

# Auditoria

Operações auditadas.

```text
CREATE

QUEUE

START

COMPLETE

FAIL

RETRY

CANCEL
```

---

# Eventos Produzidos

Exemplos.

```text
BackgroundJobQueued

BackgroundJobStarted

BackgroundJobCompleted

BackgroundJobFailed

BackgroundJobRetried
```

---

# Eventos Consumidos

Exemplos.

```text
NotificationCreated

WebhookReceived

ReportRequested

AIRequestCreated
```

---

# Regras de Negócio

Um BackgroundJob.

- poderá ser executado apenas uma vez por tentativa;
- poderá falhar;
- poderá ser reprocessado;
- deverá registrar todas as tentativas;
- deverá preservar histórico completo.

Jobs concluídos não deverão retornar ao estado de execução.

---

# Ciclo de Vida

```text
Criado

↓

Fila

↓

Execução

↓

Concluído
```

Fluxos alternativos.

```text
Fila

↓

Falha

↓

Nova Tentativa

↓

Concluído
```

ou.

```text
Fila

↓

Cancelado
```

---

# Segurança

A entidade deverá respeitar.

- autenticação dos Workers;
- autorização;
- auditoria completa.

Payloads contendo dados sensíveis deverão ser protegidos e, quando necessário, criptografados.

---

# Performance

Consultas por.

```text
status

queue

scheduled_at

job_type
```

Deverão utilizar índices apropriados.

Workers deverão consumir tarefas utilizando consultas eficientes e mecanismos de bloqueio para evitar processamento duplicado.

---

# Observações

BackgroundJob representa exclusivamente o controle das tarefas.

Sua execução deverá ocorrer através de Workers especializados.

Exemplos.

```text
Notification Worker

AI Worker

Billing Worker

Import Worker

Report Worker
```

Essa arquitetura facilita escalabilidade horizontal e distribuição de carga.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Notification
- WebhookEvent
- AuditLog
- AIConversation

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

Toda tarefa assíncrona do MedFlow será registrada na entidade BackgroundJob antes de sua execução.

**Motivação**

- Escalabilidade
- Monitoramento
- Reprocessamento
- Auditoria
- Tolerância a falhas

**Alternativas Avaliadas**

- Execução síncrona
- Filas sem persistência
- Jobs apenas em memória

**Resultado**

O BackgroundJob será responsável pelo gerenciamento completo das tarefas assíncronas da plataforma, garantindo confiabilidade, rastreabilidade e capacidade de expansão.

---

# Próxima Entidade

---

# Entidade — ApiKey

## Resumo

A entidade **ApiKey** representa uma credencial utilizada para autenticação e autorização de aplicações externas que consomem a API do MedFlow.

Ela permite controlar integrações, limitar permissões, monitorar utilização e revogar acessos de forma segura.

Cada ApiKey pertence a uma clínica ou integração específica.

---

# Objetivo

Gerenciar credenciais de acesso à API da plataforma, garantindo autenticação segura, rastreabilidade e controle granular das permissões concedidas.

---

# Domínio

Infrastructure

---

# Classificação da Entidade

```text
Tipo: Entidade de Segurança

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Sim

LGPD: Dados Operacionais

Criticidade: Máxima
```

---

# Valor Operacional

```text
Autenticação

Sim

Integração

Sim

Auditoria

Obrigatória

Revogação

Permitida
```

A ApiKey representa uma credencial sensível da plataforma.

---

# Imutabilidade

```text
Criada

↓

Ativada

↓

Utilização

↓

Revogada

↓

Arquivada
```

A chave secreta deverá ser exibida apenas no momento da criação.

---

# Responsabilidades

A entidade ApiKey é responsável por.

- autenticar integrações;
- controlar permissões;
- limitar escopos;
- registrar utilização;
- permitir revogação;
- preservar histórico.

---

# Dono da Entidade

Infrastructure Domain

---

# Dependências

A entidade depende de.

```text
Clinic
```

Opcionalmente.

```text
User

Integration
```

---

# Dependentes

A entidade poderá ser utilizada por.

```text
AuditLog

Webhook

Integrations

API Gateway

Monitoring
```

---

# Relacionamentos

## Muitos para Um

```text
ApiKeys

↓

Clinic
```

---

## Muitos para Um (Opcional)

```text
ApiKeys

↓

User
```

---

```text
ApiKeys

↓

Integration
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

clinic_id

name

key_prefix

key_hash

status

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
user_id

integration_id

description

expires_at

last_used_at

last_ip

allowed_ips

scopes

revoked_at

deleted_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para clinic_id.
- Foreign Key opcional para user_id.
- Foreign Key opcional para integration_id.
- UNIQUE para key_hash.
- NOT NULL para campos obrigatórios.

A chave nunca deverá ser armazenada em texto puro.

---

# Índices

Índices recomendados.

```text
clinic_id

status

expires_at

last_used_at

key_prefix
```

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo obrigatório.

```text
deleted_at
```

O histórico de credenciais deverá permanecer preservado.

---

# Auditoria

Operações auditadas.

```text
CREATE

USE

ROTATE

REVOKE

DELETE

RESTORE
```

Toda utilização deverá gerar registro de auditoria.

---

# Eventos Produzidos

Exemplos.

```text
ApiKeyCreated

ApiKeyUsed

ApiKeyRevoked

ApiKeyExpired

ApiKeyRotated
```

---

# Eventos Consumidos

Exemplos.

```text
IntegrationCreated

ApiRequestReceived

SecurityPolicyUpdated
```

---

# Regras de Negócio

Uma ApiKey.

- pertence exatamente a uma Clinic;
- poderá possuir escopos específicos;
- poderá possuir data de expiração;
- poderá ser revogada;
- poderá ser rotacionada;
- deverá registrar toda utilização.

Após revogada.

A chave não poderá autenticar novas requisições.

---

# Ciclo de Vida

```text
Criação

↓

Ativação

↓

Utilização

↓

Rotação (Opcional)

↓

Revogação

↓

Arquivamento
```

---

# Segurança

A entidade deverá respeitar.

- hash criptográfico para armazenamento;
- autenticação segura;
- RBAC;
- limitação por escopo;
- limitação por IP quando configurado.

A chave secreta nunca deverá ser recuperável após sua criação.

---

# Performance

Consultas por.

```text
key_prefix

status

clinic_id

expires_at
```

Deverão utilizar índices apropriados.

A autenticação deverá ocorrer com baixa latência.

---

# Observações

A entidade ApiKey representa apenas a credencial.

As permissões efetivas deverão ser determinadas pelos escopos configurados e pelas políticas da plataforma.

A rotação periódica das chaves deverá ser incentivada para aumentar a segurança.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Clinic
- User
- Integration
- AuditLog

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O MedFlow utilizará ApiKeys para autenticação de integrações externas, armazenando apenas hashes das credenciais e oferecendo controle granular de permissões.

**Motivação**

- Segurança
- Escalabilidade
- Auditoria
- Controle de acesso
- Integrações externas

**Alternativas Avaliadas**

- Tokens em texto puro
- Credenciais compartilhadas
- Autenticação apenas por usuário e senha

**Resultado**

As integrações utilizarão ApiKeys independentes, permitindo autenticação segura, revogação imediata, auditoria completa e gerenciamento de escopos.

---

# Próxima Entidade

---

# Entidade — Integration

## Resumo

A entidade **Integration** representa uma integração configurada entre o MedFlow e um sistema externo.

Ela centraliza informações sobre serviços conectados à plataforma, permitindo controlar autenticação, disponibilidade, sincronização, monitoramento e configurações específicas de cada integração.

Cada integração representa um sistema externo independente.

---

# Objetivo

Gerenciar integrações externas de forma estruturada, permitindo configuração, monitoramento, autenticação e rastreabilidade das comunicações entre o MedFlow e serviços terceiros.

---

# Domínio

Infrastructure

---

# Classificação da Entidade

```text
Tipo: Entidade de Infraestrutura

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Sim

LGPD: Dados Operacionais

Criticidade: Muito Alta
```

---

# Valor Operacional

```text
Integração Oficial

Sim

Monitoramento

Sim

Sincronização

Sim

Retenção

Permanente

Alteração

Controlada
```

A entidade representa um sistema externo autorizado a se comunicar com o MedFlow.

---

# Imutabilidade

```text
Cadastro

↓

Configuração

↓

Ativação

↓

Utilização

↓

Desativação

↓

Arquivamento
```

As configurações poderão evoluir mantendo histórico de alterações.

---

# Responsabilidades

A entidade Integration é responsável por.

- registrar integrações;
- armazenar configurações;
- controlar autenticação;
- monitorar disponibilidade;
- registrar sincronizações;
- preservar histórico operacional.

---

# Dono da Entidade

Infrastructure Domain

---

# Dependências

Opcionalmente.

```text
Clinic

ApiKey
```

Nem toda integração utilizará ApiKey.

Algumas poderão utilizar OAuth2, certificados ou outros mecanismos.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
WebhookEvent

BackgroundJob

AuditLog

Notification

AI

Reports
```

---

# Relacionamentos

## Muitos para Um (Opcional)

```text
Integrations

↓

Clinic
```

---

```text
Integrations

↓

ApiKey
```

---

## Um para Muitos

```text
Integration

↓

WebhookEvents
```

---

```text
Integration

↓

BackgroundJobs
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

name

provider

integration_type

status

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
clinic_id

api_key_id

base_url

authentication_type

configuration

health_status

last_sync_at

last_health_check

version

deleted_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key opcional para clinic_id.
- Foreign Key opcional para api_key_id.
- NOT NULL para campos obrigatórios.
- CHECK para tipos de autenticação suportados.

---

# Índices

Índices recomendados.

```text
provider

integration_type

status

last_sync_at

health_status
```

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo obrigatório.

```text
deleted_at
```

Integrações descontinuadas deverão permanecer registradas para fins históricos.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

ACTIVATE

DEACTIVATE

HEALTH_CHECK

SYNC

DELETE

RESTORE
```

---

# Eventos Produzidos

Exemplos.

```text
IntegrationCreated

IntegrationActivated

IntegrationHealthChecked

IntegrationSynchronized

IntegrationFailed
```

---

# Eventos Consumidos

Exemplos.

```text
ApiKeyCreated

WebhookReceived

BackgroundJobCompleted

ConfigurationUpdated
```

---

# Regras de Negócio

Uma Integration.

- poderá pertencer a uma Clinic;
- poderá utilizar ApiKey;
- poderá utilizar OAuth2;
- poderá utilizar certificados digitais;
- poderá ser monitorada continuamente;
- deverá registrar sincronizações.

Integrações desativadas não deverão iniciar novos processos automáticos.

---

# Ciclo de Vida

```text
Cadastro

↓

Configuração

↓

Validação

↓

Ativação

↓

Operação

↓

Desativação
```

---

# Segurança

A entidade deverá respeitar.

- autenticação forte;
- criptografia de credenciais;
- auditoria completa;
- rotação de credenciais;
- validação de certificados quando aplicável.

Informações sensíveis deverão permanecer criptografadas.

---

# Performance

Consultas por.

```text
provider

status

integration_type

health_status
```

Deverão utilizar índices apropriados.

Verificações de disponibilidade deverão ocorrer de forma assíncrona.

---

# Observações

A entidade Integration representa exclusivamente a configuração da integração.

Ela não executa sincronizações diretamente.

Essas operações deverão ser realizadas por BackgroundJobs especializados.

Exemplos de integrações suportadas.

```text
Stripe

Mercado Pago

Asaas

Twilio

SendGrid

Google Calendar

OpenAI

Laboratórios

ERPs
```

A arquitetura deverá permitir adicionar novos provedores sem alterações estruturais.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- ApiKey
- BackgroundJob
- WebhookEvent
- AuditLog

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

Todas as integrações externas serão representadas pela entidade Integration, centralizando configurações, autenticação e monitoramento.

**Motivação**

- Padronização
- Escalabilidade
- Segurança
- Monitoramento
- Baixo acoplamento

**Alternativas Avaliadas**

- Configurações espalhadas no código
- Integrações específicas por módulo
- Arquivos de configuração independentes

**Resultado**

A entidade Integration será o ponto central para gerenciamento de sistemas externos, permitindo expansão da plataforma sem alterações significativas na arquitetura.

---

# Próxima Entidade

---

# Entidade — FileStorage

## Resumo

A entidade **FileStorage** representa um arquivo físico armazenado pela infraestrutura do MedFlow.

Ela centraliza os metadados dos arquivos enviados para serviços de armazenamento externos, permitindo controle de localização, integridade, criptografia e ciclo de vida.

A entidade não representa anexos clínicos.

Ela representa o armazenamento físico dos arquivos.

---

# Objetivo

Centralizar o gerenciamento dos arquivos armazenados pela plataforma, abstraindo o provedor de armazenamento e permitindo migração entre diferentes serviços sem impacto nas entidades de negócio.

---

# Domínio

Infrastructure

---

# Classificação da Entidade

```text
Tipo: Entidade de Infraestrutura

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Sim

LGPD: Dados Sensíveis

Criticidade: Alta
```

---

# Valor Operacional

```text
Armazenamento

Sim

Criptografia

Sim

Integridade

Sim

Versionamento

Opcional

Retenção

Configurável
```

A entidade representa exclusivamente o armazenamento físico.

---

# Responsabilidades

A entidade FileStorage é responsável por.

- registrar arquivos;
- armazenar metadados;
- controlar provedores;
- validar integridade;
- controlar versões;
- permitir migração entre storages.

---

# Dono da Entidade

Infrastructure Domain

---

# Dependências

Nenhuma.

Os arquivos poderão ser utilizados por diversas entidades.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Attachment

MedicalRecord

Exam

Prescription

ClinicalNote

Patient

AI
```

---

# Relacionamentos

## Um para Muitos

```text
FileStorage

↓

Attachments
```

Diversos anexos poderão referenciar o mesmo arquivo físico quando permitido.

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

provider

bucket

storage_key

file_name

mime_type

file_size

checksum

status

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
region

cdn_url

encrypted

encryption_algorithm

thumbnail_key

version

expires_at

deleted_at

metadata
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- UNIQUE para provider + bucket + storage_key.
- NOT NULL para campos obrigatórios.

O checksum deverá representar o conteúdo armazenado.

---

# Índices

Índices recomendados.

```text
provider

bucket

storage_key

status

checksum
```

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo obrigatório.

```text
deleted_at
```

Arquivos removidos logicamente deverão permanecer disponíveis para recuperação quando permitido.

---

# Auditoria

Operações auditadas.

```text
UPLOAD

DOWNLOAD

MOVE

DELETE

RESTORE

VERIFY_INTEGRITY
```

---

# Eventos Produzidos

Exemplos.

```text
FileUploaded

FileDeleted

FileRestored

FileIntegrityVerified

FileMigrated
```

---

# Eventos Consumidos

Exemplos.

```text
AttachmentCreated

StorageMigrationStarted

BackgroundJobCompleted
```

---

# Regras de Negócio

Um FileStorage.

- poderá ser utilizado por diversos anexos;
- poderá possuir versões;
- deverá possuir checksum válido;
- poderá ser criptografado;
- poderá ser migrado entre provedores;
- deverá preservar metadados históricos.

Arquivos não deverão ser armazenados diretamente no banco de dados.

---

# Ciclo de Vida

```text
Upload

↓

Validação

↓

Armazenamento

↓

Utilização

↓

Arquivamento

↓

Remoção Lógica
```

---

# Segurança

A entidade deverá respeitar.

- criptografia em repouso;
- criptografia em trânsito;
- URLs temporárias;
- auditoria de downloads;
- LGPD.

O acesso direto ao provedor de armazenamento nunca deverá ser exposto aos clientes.

---

# Performance

Consultas por.

```text
provider

storage_key

checksum

status
```

Deverão utilizar índices apropriados.

Uploads e downloads deverão utilizar URLs assinadas quando suportado pelo provedor.

---

# Observações

A entidade FileStorage desacopla o armazenamento físico das entidades de negócio.

Isso permite trocar provedores sem alterar.

```text
Attachment

MedicalRecord

Exam

Prescription

ClinicalNote
```

Provedores suportados poderão incluir.

```text
Amazon S3

Cloudflare R2

Google Cloud Storage

Azure Blob Storage

MinIO
```

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- Attachment
- BackgroundJob
- Integration

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O MedFlow utilizará uma entidade FileStorage para abstrair completamente o armazenamento físico dos arquivos.

**Motivação**

- Desacoplamento
- Escalabilidade
- Migração entre provedores
- Segurança
- Integridade

**Alternativas Avaliadas**

- Caminhos de arquivos diretamente em Attachment
- Arquivos armazenados no banco de dados
- Dependência de um único provedor de armazenamento

**Resultado**

Todos os arquivos físicos serão representados pela entidade FileStorage, permitindo flexibilidade, integridade e independência da infraestrutura de armazenamento.

---

# Encerramento do Domínio

## Infrastructure Domain ✅

Entidades concluídas.

```text
AuditLog

BackgroundJob

ApiKey

Integration

FileStorage
```

---

# Próxima Entidade

---

# Entidade — AIConversation

## Resumo

A entidade **AIConversation** representa uma sessão de interação entre um usuário e os serviços de Inteligência Artificial do MedFlow.

Ela agrupa todas as mensagens trocadas durante uma conversa, preservando contexto, histórico e configurações utilizadas pelo modelo de IA.

Cada conversa poderá conter diversas mensagens.

---

# Objetivo

Centralizar as sessões de conversação com Inteligência Artificial, permitindo manter contexto, auditoria, rastreamento e evolução das interações.

---

# Domínio

Artificial Intelligence

---

# Classificação da Entidade

```text
Tipo: Entidade de Negócio

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Sim

LGPD: Dados Sensíveis

Criticidade: Alta
```

---

# Valor Operacional

```text
Histórico

Sim

Contexto

Sim

Auditoria

Obrigatória

Retenção

Configurável
```

Cada conversa representa uma sessão lógica de interação com IA.

---

# Responsabilidades

A entidade AIConversation é responsável por.

- agrupar mensagens;
- preservar contexto;
- registrar participantes;
- controlar estado da conversa;
- permitir continuidade;
- manter histórico.

---

# Dono da Entidade

Artificial Intelligence Domain

---

# Dependências

A entidade depende de.

```text
Clinic

User
```

Opcionalmente.

```text
Patient

MedicalRecord
```

Quando a conversa estiver relacionada ao atendimento clínico.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
AIMessage

AIRecommendation

AuditLog

Reports

Analytics
```

---

# Relacionamentos

## Muitos para Um

```text
AIConversations

↓

Clinic
```

---

```text
AIConversations

↓

User
```

---

## Muitos para Um (Opcional)

```text
AIConversations

↓

Patient
```

---

```text
AIConversations

↓

MedicalRecord
```

---

## Um para Muitos

```text
AIConversation

↓

AIMessages
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

clinic_id

user_id

title

status

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
patient_id

medical_record_id

model

language

summary

last_message_at

deleted_at

metadata
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para clinic_id.
- Foreign Key para user_id.
- Foreign Key opcional para patient_id.
- Foreign Key opcional para medical_record_id.
- NOT NULL para campos obrigatórios.

---

# Índices

Índices recomendados.

```text
clinic_id

user_id

status

last_message_at
```

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo obrigatório.

```text
deleted_at
```

Conversas removidas logicamente deverão permanecer disponíveis para recuperação conforme a política de retenção.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

ARCHIVE

DELETE

RESTORE
```

---

# Eventos Produzidos

Exemplos.

```text
AIConversationCreated

AIConversationArchived

AIConversationDeleted
```

---

# Eventos Consumidos

Exemplos.

```text
AIRequestStarted

AIMessageCreated
```

---

# Regras de Negócio

Uma AIConversation.

- pertence exatamente a uma Clinic;
- pertence exatamente a um User;
- poderá estar vinculada a um Patient;
- poderá estar vinculada a um MedicalRecord;
- poderá conter diversas mensagens;
- deverá preservar contexto durante toda a sessão.

O contexto deverá permanecer disponível até o encerramento da conversa.

---

# Ciclo de Vida

```text
Criada

↓

Mensagens

↓

Resumo (Opcional)

↓

Arquivada
```

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- LGPD.

Conversas relacionadas a pacientes deverão seguir as mesmas regras de acesso do prontuário eletrônico.

---

# Performance

Consultas por.

```text
clinic_id

user_id

status

last_message_at
```

Deverão utilizar índices apropriados.

Conversas muito extensas poderão utilizar paginação para carregamento das mensagens.

---

# Observações

A entidade AIConversation representa exclusivamente a sessão de conversa.

As mensagens individuais serão armazenadas na entidade **AIMessage**.

O resumo automático da conversa poderá ser utilizado para reduzir consumo de contexto pelos modelos de IA.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- AIMessage
- AIRecommendation
- MedicalRecord
- User
- Patient

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

As interações com Inteligência Artificial serão agrupadas em conversas independentes, permitindo preservação de contexto, auditoria e continuidade das sessões.

**Motivação**

- Organização
- Contexto
- Escalabilidade
- Auditoria
- Reutilização

**Alternativas Avaliadas**

- Mensagens isoladas
- Conversas armazenadas em texto único
- Sem persistência do contexto

**Resultado**

Cada interação com IA será organizada em uma AIConversation, permitindo histórico estruturado, gerenciamento eficiente do contexto e evolução das funcionalidades inteligentes da plataforma.

---

# Próxima Entidade

---

# Entidade — AIMessage

## Resumo

A entidade **AIMessage** representa uma mensagem individual pertencente a uma conversa de Inteligência Artificial no MedFlow.

Ela registra perguntas, respostas, comandos e demais interações trocadas entre usuários e modelos de IA, preservando o histórico completo da sessão.

Cada mensagem pertence exatamente a uma AIConversation.

---

# Objetivo

Registrar individualmente cada interação realizada durante uma conversa com IA, permitindo rastreabilidade, auditoria, análise e reconstrução completa do contexto.

---

# Domínio

Artificial Intelligence

---

# Classificação da Entidade

```text
Tipo: Entidade de Negócio

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Sensíveis

Criticidade: Alta
```

---

# Valor Operacional

```text
Histórico

Sim

Contexto

Sim

Auditoria

Obrigatória

Retenção

Configurável
```

Cada mensagem representa uma unidade individual de comunicação com a IA.

---

# Responsabilidades

A entidade AIMessage é responsável por.

- registrar mensagens do usuário;
- registrar respostas da IA;
- preservar contexto;
- armazenar metadados da geração;
- permitir reconstrução da conversa;
- manter histórico completo.

---

# Dono da Entidade

Artificial Intelligence Domain

---

# Dependências

A entidade depende de.

```text
AIConversation
```

---

# Dependentes

A entidade poderá ser utilizada por.

```text
AIRecommendation

AIUsage

Analytics

Reports
```

---

# Relacionamentos

## Muitos para Um

```text
AIMessages

↓

AIConversation
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

conversation_id

role

content

created_at
```

---

# Campos Opcionais

Exemplos.

```text
model

tokens_input

tokens_output

processing_time

finish_reason

metadata

parent_message_id
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para conversation_id.
- NOT NULL para campos obrigatórios.
- CHECK para papéis válidos.

Papéis suportados.

```text
system

user

assistant

tool
```

---

# Índices

Índices recomendados.

```text
conversation_id

role

created_at
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

As mensagens deverão permanecer preservadas para manter a consistência do histórico da conversa.

---

# Auditoria

Operações auditadas.

```text
CREATE

GENERATE

REGENERATE
```

---

# Eventos Produzidos

Exemplos.

```text
AIMessageCreated

AIResponseGenerated

AIMessageRegenerated
```

---

# Eventos Consumidos

Exemplos.

```text
AIConversationCreated

PromptSubmitted
```

---

# Regras de Negócio

Uma AIMessage.

- pertence exatamente a uma AIConversation;
- poderá ser enviada pelo usuário;
- poderá ser gerada pela IA;
- deverá respeitar a sequência cronológica;
- deverá preservar integralmente o conteúdo original.

Mensagens não deverão ser alteradas após sua criação.

Caso seja necessária uma nova resposta.

Uma nova mensagem deverá ser criada.

---

# Ciclo de Vida

```text
Mensagem Recebida

↓

Processamento

↓

Resposta Gerada

↓

Histórico Permanente
```

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- LGPD.

Mensagens relacionadas ao prontuário deverão seguir as mesmas regras de acesso aplicadas ao MedicalRecord.

---

# Performance

Consultas por.

```text
conversation_id

created_at

role
```

Deverão utilizar índices apropriados.

Conversas extensas deverão utilizar paginação.

---

# Observações

A entidade AIMessage representa exclusivamente uma mensagem.

Ela não controla.

- consumo;
- custos;
- recomendações.

Essas responsabilidades pertencem às entidades AIUsage e AIRecommendation.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- AIConversation
- AIRecommendation
- AIUsage

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

Cada interação entre usuário e IA será representada por uma entidade AIMessage independente, preservando integralmente o histórico da conversa.

**Motivação**

- Organização
- Auditoria
- Contexto
- Escalabilidade
- Compatibilidade com modelos conversacionais

**Alternativas Avaliadas**

- Texto único por conversa
- Histórico serializado em JSON
- Atualização da última mensagem

**Resultado**

Todas as mensagens serão armazenadas individualmente, permitindo reconstrução completa das conversas, análise de uso e evolução futura das funcionalidades de Inteligência Artificial.

---

# Próxima Entidade

---

# Entidade — AIRecommendation

## Resumo

A entidade **AIRecommendation** representa uma recomendação gerada pelos serviços de Inteligência Artificial do MedFlow.

Ela armazena sugestões clínicas, administrativas ou operacionais produzidas pelos modelos de IA, permitindo rastreabilidade, auditoria e validação pelos usuários autorizados.

As recomendações possuem caráter de apoio à decisão.

Nunca substituem o julgamento profissional.

---

# Objetivo

Registrar recomendações produzidas pela IA, preservando histórico, contexto e justificativas utilizadas durante sua geração.

---

# Domínio

Artificial Intelligence

---

# Classificação da Entidade

```text
Tipo: Entidade de Negócio

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Sensíveis

Criticidade: Muito Alta
```

---

# Valor Clínico

```text
Apoio à Decisão

Sim

Decisão Automática

Não

Auditoria

Obrigatória

Validação Humana

Obrigatória
```

As recomendações servem como suporte ao profissional.

Jamais como decisão automática.

---

# Responsabilidades

A entidade AIRecommendation é responsável por.

- registrar recomendações;
- preservar justificativas;
- registrar confiança da IA;
- registrar aceitação ou rejeição;
- permitir auditoria;
- manter histórico das sugestões.

---

# Dono da Entidade

Artificial Intelligence Domain

---

# Dependências

A entidade depende de.

```text
AIConversation

AIMessage
```

Opcionalmente.

```text
Patient

MedicalRecord

Appointment
```

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Reports

Analytics

Clinical Decision Support

AuditLog
```

---

# Relacionamentos

## Muitos para Um

```text
AIRecommendations

↓

AIConversation
```

---

```text
AIRecommendations

↓

AIMessage
```

---

## Muitos para Um (Opcional)

```text
AIRecommendations

↓

Patient
```

---

```text
AIRecommendations

↓

MedicalRecord
```

---

```text
AIRecommendations

↓

Appointment
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

conversation_id

message_id

recommendation_type

content

confidence_score

status

created_at
```

---

# Campos Opcionais

Exemplos.

```text
patient_id

medical_record_id

appointment_id

reasoning_summary

accepted_by

accepted_at

rejected_at

feedback

metadata
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para conversation_id.
- Foreign Key para message_id.
- CHECK para confidence_score entre 0 e 1.
- NOT NULL para campos obrigatórios.

---

# Índices

Índices recomendados.

```text
recommendation_type

status

patient_id

created_at
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

As recomendações deverão permanecer disponíveis para auditoria.

---

# Auditoria

Operações auditadas.

```text
CREATE

ACCEPT

REJECT

EXPIRE
```

---

# Eventos Produzidos

Exemplos.

```text
AIRecommendationCreated

AIRecommendationAccepted

AIRecommendationRejected

AIRecommendationExpired
```

---

# Eventos Consumidos

Exemplos.

```text
AIResponseGenerated

MedicalRecordUpdated

AppointmentCompleted
```

---

# Regras de Negócio

Uma AIRecommendation.

- pertence exatamente a uma AIConversation;
- pertence exatamente a uma AIMessage;
- poderá estar associada a um Patient;
- poderá estar associada a um MedicalRecord;
- deverá possuir nível de confiança;
- nunca deverá executar ações automaticamente.

Toda recomendação clínica deverá ser validada por um profissional habilitado antes de qualquer utilização.

---

# Ciclo de Vida

```text
Gerada

↓

Apresentada

↓

Aceita ou Rejeitada

↓

Histórico Permanente
```

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- LGPD.

Recomendações clínicas deverão ser exibidas apenas para profissionais autorizados.

---

# Performance

Consultas por.

```text
status

recommendation_type

patient_id

created_at
```

Deverão utilizar índices apropriados.

Consultas analíticas poderão utilizar agregações por tipo e taxa de aceitação.

---

# Observações

A entidade AIRecommendation representa exclusivamente sugestões produzidas pela Inteligência Artificial.

Ela não altera automaticamente.

- prontuários;
- prescrições;
- diagnósticos;
- exames.

Qualquer ação deverá ocorrer somente após confirmação do usuário responsável.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- AIConversation
- AIMessage
- MedicalRecord
- Patient
- Appointment

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

Todas as recomendações produzidas pela IA serão registradas como entidades independentes, preservando histórico, contexto e validação humana.

**Motivação**

- Segurança clínica
- Auditoria
- Transparência
- Explicabilidade
- Conformidade

**Alternativas Avaliadas**

- Recomendações descartadas após exibição
- Alterações automáticas no prontuário
- Sugestões sem rastreabilidade

**Resultado**

O MedFlow armazenará todas as recomendações relevantes da IA, garantindo transparência, auditoria e apoio seguro à decisão clínica.

---

# Próxima Entidade

---

# Entidade — AIPrompt

## Resumo

A entidade **AIPrompt** representa um prompt reutilizável utilizado pelos serviços de Inteligência Artificial do MedFlow.

Ela armazena instruções, configurações e templates enviados aos modelos de IA, permitindo padronização, versionamento e auditoria das interações.

Os prompts pertencem à plataforma e podem ser reutilizados por diversos módulos.

---

# Objetivo

Centralizar o gerenciamento dos prompts utilizados pelos modelos de IA, garantindo consistência, rastreabilidade e facilidade de manutenção.

---

# Domínio

Artificial Intelligence

---

# Classificação da Entidade

```text
Tipo: Entidade de Referência

Persistência: Permanente

Multi-Tenant: Não

Auditoria: Obrigatória

Soft Delete: Sim

LGPD: Não se aplica

Criticidade: Alta
```

---

# Valor Operacional

```text
Padronização

Sim

Versionamento

Sim

Reutilização

Sim

Auditoria

Obrigatória
```

Os prompts representam ativos estratégicos da plataforma.

---

# Responsabilidades

A entidade AIPrompt é responsável por.

- armazenar prompts;
- controlar versões;
- permitir reutilização;
- documentar finalidade;
- controlar publicação;
- preservar histórico.

---

# Dono da Entidade

Artificial Intelligence Domain

---

# Dependências

Nenhuma.

Os prompts pertencem à plataforma.

---

# Dependentes

A entidade poderá ser utilizada por.

```text
AIConversation

AIMessage

AIRecommendation

BackgroundJob

Analytics
```

---

# Relacionamentos

## Um para Muitos

```text
AIPrompt

↓

AIConversations
```

---

```text
AIPrompt

↓

AIRecommendations
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

name

slug

prompt

purpose

status

version

created_at

updated_at
```

---

# Campos Opcionais

Exemplos.

```text
description

model

temperature

max_tokens

top_p

frequency_penalty

presence_penalty

metadata

deleted_at
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Unique para slug + version.
- NOT NULL para campos obrigatórios.

Cada versão deverá permanecer imutável após publicação.

---

# Índices

Índices recomendados.

```text
slug

status

version
```

---

# Soft Delete

A entidade utilizará Soft Delete.

Campo obrigatório.

```text
deleted_at
```

Prompts antigos deverão permanecer preservados para auditoria.

---

# Auditoria

Operações auditadas.

```text
CREATE

UPDATE

PUBLISH

ARCHIVE

RESTORE
```

---

# Eventos Produzidos

Exemplos.

```text
AIPromptCreated

AIPromptPublished

AIPromptArchived

AIPromptUpdated
```

---

# Eventos Consumidos

Exemplos.

```text
AIConversationStarted

AIRequestCreated
```

---

# Regras de Negócio

Um AIPrompt.

- poderá possuir diversas versões;
- deverá possuir finalidade definida;
- poderá ser reutilizado por diferentes módulos;
- deverá permanecer imutável após publicação;
- poderá ser arquivado.

Novas alterações deverão originar uma nova versão.

---

# Ciclo de Vida

```text
Criação

↓

Edição

↓

Publicação

↓

Utilização

↓

Arquivamento
```

---

# Segurança

Somente administradores autorizados poderão.

- criar prompts;
- alterar prompts;
- publicar versões;
- arquivar prompts.

Prompts clínicos deverão passar por validação antes da publicação.

---

# Performance

Consultas por.

```text
slug

status

version
```

Deverão utilizar índices apropriados.

Prompts frequentemente utilizados poderão ser mantidos em cache.

---

# Observações

A entidade AIPrompt representa apenas o template utilizado pelos modelos.

Ela não registra.

- conversas;
- mensagens;
- consumo.

Essas responsabilidades pertencem às demais entidades do domínio de IA.

A separação entre Prompt e Conversation facilita evolução, testes A/B e controle de qualidade dos modelos.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- AIConversation
- AIMessage
- AIRecommendation

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

Todos os prompts utilizados pela Inteligência Artificial serão armazenados na entidade AIPrompt, permitindo versionamento, reutilização e auditoria.

**Motivação**

- Padronização
- Governança
- Versionamento
- Reutilização
- Evolução dos modelos

**Alternativas Avaliadas**

- Prompts diretamente no código
- Arquivos de configuração
- Prompts sem versionamento

**Resultado**

Os prompts serão gerenciados como ativos da plataforma, permitindo controle completo do comportamento dos modelos de IA e facilitando melhorias contínuas.

---

# Próxima Entidade

---

# Entidade — AIUsage

## Resumo

A entidade **AIUsage** representa o registro de utilização dos serviços de Inteligência Artificial do MedFlow.

Ela documenta o consumo de modelos de IA, incluindo quantidade de tokens, custos, tempo de processamento e demais métricas operacionais necessárias para monitoramento, auditoria e otimização da plataforma.

Cada registro representa uma execução realizada pelos serviços de IA.

---

# Objetivo

Registrar o consumo dos recursos de Inteligência Artificial da plataforma, permitindo monitoramento, análise de custos, auditoria e otimização operacional.

---

# Domínio

Artificial Intelligence

---

# Classificação da Entidade

```text
Tipo: Entidade Operacional

Persistência: Permanente

Multi-Tenant: Sim

Auditoria: Obrigatória

Soft Delete: Não

LGPD: Dados Operacionais

Criticidade: Alta
```

---

# Valor Operacional

```text
Monitoramento

Sim

Controle de Custos

Sim

Auditoria

Obrigatória

Faturamento

Opcional

Retenção

Configurável
```

O AIUsage representa a utilização efetiva dos serviços de IA.

---

# Responsabilidades

A entidade AIUsage é responsável por.

- registrar consumo de tokens;
- registrar custos;
- registrar tempo de processamento;
- registrar modelo utilizado;
- fornecer métricas operacionais;
- permitir análises de utilização.

---

# Dono da Entidade

Artificial Intelligence Domain

---

# Dependências

A entidade depende de.

```text
AIConversation

AIMessage

AIPrompt
```

Opcionalmente.

```text
Clinic

User
```

---

# Dependentes

A entidade poderá ser utilizada por.

```text
Reports

Billing

Analytics

Monitoring

Dashboard
```

---

# Relacionamentos

## Muitos para Um

```text
AIUsages

↓

AIConversation
```

---

```text
AIUsages

↓

AIMessage
```

---

```text
AIUsages

↓

AIPrompt
```

---

## Muitos para Um (Opcional)

```text
AIUsages

↓

Clinic
```

---

```text
AIUsages

↓

User
```

---

# Campos Obrigatórios

A entidade deverá possuir, no mínimo.

```text
id

conversation_id

message_id

prompt_id

provider

model

tokens_input

tokens_output

processing_time

created_at
```

---

# Campos Opcionais

Exemplos.

```text
clinic_id

user_id

cached_tokens

reasoning_tokens

cost

currency

request_id

response_id

metadata
```

---

# Constraints

A entidade deverá possuir.

- Primary Key.
- Foreign Key para conversation_id.
- Foreign Key para message_id.
- Foreign Key para prompt_id.
- CHECK para valores não negativos.
- NOT NULL para campos obrigatórios.

---

# Índices

Índices recomendados.

```text
provider

model

clinic_id

created_at
```

---

# Soft Delete

A entidade **não utilizará Soft Delete**.

Os registros de utilização deverão permanecer preservados para análises históricas e auditoria.

---

# Auditoria

Operações auditadas.

```text
CREATE

EXPORT

ARCHIVE
```

---

# Eventos Produzidos

Exemplos.

```text
AIUsageRecorded

AIUsageThresholdReached

AIUsageExported
```

---

# Eventos Consumidos

Exemplos.

```text
AIResponseGenerated

AIConversationCompleted

BackgroundJobCompleted
```

---

# Regras de Negócio

Um AIUsage.

- pertence exatamente a uma AIConversation;
- pertence exatamente a uma AIMessage;
- pertence exatamente a um AIPrompt;
- poderá pertencer a uma Clinic;
- deverá registrar consumo real do modelo;
- deverá permanecer imutável após registrado.

Os custos deverão ser calculados utilizando a tabela de preços vigente do provedor utilizado.

---

# Ciclo de Vida

```text
Execução

↓

Registro

↓

Processamento

↓

Consulta

↓

Arquivamento
```

---

# Segurança

A entidade deverá respeitar.

- autenticação;
- autorização;
- RBAC;
- proteção de dados operacionais.

Os registros deverão estar disponíveis apenas para usuários autorizados e administradores da plataforma.

---

# Performance

Consultas por.

```text
provider

model

clinic_id

created_at
```

Deverão utilizar índices apropriados.

Relatórios deverão utilizar agregações para evitar consultas excessivamente custosas.

---

# Observações

A entidade AIUsage representa exclusivamente métricas de utilização.

Ela não registra.

- conteúdo das mensagens;
- recomendações;
- configurações dos prompts.

Essas responsabilidades pertencem às respectivas entidades do domínio de Inteligência Artificial.

O armazenamento dessas métricas permitirá.

- monitoramento de custos;
- análise de desempenho;
- planejamento de capacidade;
- otimização do uso dos modelos;
- cobrança futura por consumo, caso necessário.

---

# Referências Cruzadas

- Database.md
- ERD.md
- Relationships.md
- AIConversation
- AIMessage
- AIPrompt
- AIRecommendation

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

Toda utilização dos modelos de Inteligência Artificial será registrada na entidade AIUsage, permitindo monitoramento operacional, controle de custos e auditoria.

**Motivação**

- Controle financeiro
- Observabilidade
- Escalabilidade
- Auditoria
- Planejamento de capacidade

**Alternativas Avaliadas**

- Métricas apenas em logs
- Dados agregados sem histórico
- Dependência exclusiva dos dashboards dos provedores

**Resultado**

A entidade AIUsage será responsável pelo registro detalhado do consumo dos serviços de IA, permitindo análises históricas, monitoramento contínuo e evolução sustentável da plataforma.

---

# Encerramento do Domínio

## Artificial Intelligence Domain ✅

Entidades concluídas.

```text
AIConversation

AIMessage

AIRecommendation

AIPrompt

AIUsage
```

---

# Encerramento do Documento

# Entities.md ✅

## Domínios concluídos

```text
Organization

Authentication

Clinical

Medical

Financial

Communication

Infrastructure

Artificial Intelligence
```