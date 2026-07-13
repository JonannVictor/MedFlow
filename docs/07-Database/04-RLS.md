# Row Level Security (RLS)

## Objetivo

Este documento define as políticas de **Row Level Security (RLS)** utilizadas pelo MedFlow.

O objetivo é garantir isolamento entre clínicas (multi-tenancy), proteger dados sensíveis e assegurar que cada usuário acesse apenas as informações autorizadas.

As políticas descritas neste documento deverão ser implementadas no banco de dados e complementadas pelas regras de autorização da aplicação.

---

# Escopo

As políticas de RLS aplicam-se a todas as entidades persistidas que contenham dados de negócio ou dados sensíveis.

Incluem os domínios:

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

---

# Princípios

## Multi-Tenancy

Cada clínica representa um tenant independente.

Nenhum usuário poderá visualizar dados pertencentes a outra clínica.

---

## Menor Privilégio

Usuários deverão possuir apenas as permissões estritamente necessárias para execução de suas funções.

---

## Defesa em Profundidade

O controle de acesso será realizado em múltiplas camadas.

```text
Frontend

↓

Backend

↓

Authorization

↓

Row Level Security

↓

Database
```

Mesmo que uma camada falhe.

As demais deverão impedir acessos indevidos.

---

# Identificação do Tenant

Todas as tabelas multi-tenant deverão possuir.

```text
clinic_id
```

Esse campo será utilizado pelas políticas de RLS para determinar quais registros poderão ser acessados.

---

# Fluxo de Autorização

```text
Usuário

↓

Autenticação

↓

JWT

↓

Extração do clinic_id

↓

Aplicação da política RLS

↓

Consulta ao banco
```

---

# Tipos de Políticas

## SELECT

Controla leitura.

---

## INSERT

Controla criação.

---

## UPDATE

Controla alteração.

---

## DELETE

Controla remoção.

---

# Estratégia Geral

Sempre que possível.

As políticas deverão seguir o padrão.

```sql
clinic_id = auth.clinic_id
```

ou equivalente ao mecanismo de autenticação utilizado.

---

# Próximo

---

# Organization Domain

## Clinic

### SELECT

Um usuário poderá visualizar apenas a própria clínica.

```sql
clinic.id = auth.clinic_id
```

---

### INSERT

Somente administradores da plataforma poderão criar clínicas.

---

### UPDATE

Somente administradores da clínica ou administradores da plataforma poderão alterar os dados da clínica.

---

### DELETE

Não permitido.

As clínicas deverão utilizar Soft Delete ou status de inativação.

---

## Plan

### SELECT

Todos os usuários autenticados poderão visualizar os planos disponíveis.

---

### INSERT

Somente administradores da plataforma.

---

### UPDATE

Somente administradores da plataforma.

---

### DELETE

Não permitido.

Planos deverão ser descontinuados através de status.

---

## Subscription

### SELECT

```sql
subscription.clinic_id = auth.clinic_id
```

---

### INSERT

Permitido apenas durante contratação ou renovação autorizada.

---

### UPDATE

Permitido apenas pelo módulo financeiro ou administradores autorizados.

---

### DELETE

Não permitido.

Assinaturas representam histórico financeiro.

---

# Política Geral do Domínio

Todas as tabelas do domínio Organization deverão respeitar.

```sql
clinic_id = auth.clinic_id
```

Exceto.

```text
Plan
```

Que representa catálogo global da plataforma.

---

# Observações

Entidades globais.

```text
Plan
```

Entidades Multi-Tenant.

```text
Clinic

Subscription
```

Nenhuma política permitirá acesso entre clínicas diferentes.

---

# Próximo

---

# Authentication Domain

## User

### SELECT

O usuário poderá visualizar apenas usuários pertencentes à própria clínica.

```sql
user.clinic_id = auth.clinic_id
```

Administradores da plataforma poderão visualizar todos os usuários.

---

### INSERT

Permitido apenas para.

- Administradores da clínica;
- Administradores da plataforma.

O usuário criado deverá pertencer à mesma clínica do criador.

---

### UPDATE

O usuário poderá alterar.

- seu próprio perfil;
- administradores poderão alterar usuários da própria clínica.

Nunca será permitido alterar usuários de outra clínica.

---

### DELETE

Não permitido.

Usuários deverão ser desativados utilizando.

```text
status

ou

deleted_at
```

---

## Role

### SELECT

Todas as Roles poderão ser consultadas.

Caso existam Roles específicas da clínica.

```sql
role.clinic_id = auth.clinic_id
```

---

### INSERT

Somente administradores da plataforma.

Ou administradores autorizados quando houver Roles customizadas.

---

### UPDATE

Somente administradores autorizados.

---

### DELETE

Não permitido.

Roles deverão ser arquivadas.

---

## UserRole

### SELECT

```sql
user_role.clinic_id = auth.clinic_id
```

---

### INSERT

Permitido apenas para administradores da clínica.

---

### UPDATE

Não recomendado.

Alterações deverão ocorrer removendo um vínculo e criando outro.

---

### DELETE

Permitido apenas para administradores autorizados.

---

## Session

### SELECT

O usuário visualizará apenas suas próprias sessões.

Administradores poderão visualizar sessões da própria clínica.

---

### INSERT

Executado automaticamente pelo processo de autenticação.

---

### UPDATE

Somente pelo sistema.

Exemplos.

```text
Refresh

Logout

Expiration
```

---

### DELETE

Executado automaticamente conforme política de retenção.

---

## RefreshToken

### SELECT

Somente o proprietário do token.

---

### INSERT

Automático.

---

### UPDATE

Automático.

---

### DELETE

Automático.

---

## PasswordResetToken

### SELECT

Somente processos internos da plataforma.

Usuários nunca deverão consultar diretamente esses registros.

---

### INSERT

Automático.

---

### UPDATE

Não permitido.

Tokens são imutáveis.

---

### DELETE

Executado automaticamente após utilização ou expiração.

---

## EmailVerificationToken

### SELECT

Somente processos internos.

---

### INSERT

Automático.

---

### UPDATE

Não permitido.

---

### DELETE

Automático.

---

## MFAToken

### SELECT

Somente processos internos.

---

### INSERT

Automático.

---

### UPDATE

Não permitido.

---

### DELETE

Automático.

---

# Política Geral do Domínio

Todas as entidades multi-tenant deverão utilizar.

```sql
clinic_id = auth.clinic_id
```

Entidades de autenticação temporárias.

```text
Session

RefreshToken

PasswordResetToken

EmailVerificationToken

MFAToken
```

Deverão possuir acesso exclusivamente através do proprietário ou de processos internos autenticados.

---

# Observações

Nenhum usuário poderá.

- visualizar sessões de outra clínica;
- alterar Roles sem autorização;
- redefinir senhas de outros usuários;
- acessar tokens temporários.

Todos os eventos deverão ser registrados em AuditLog.

---

# Próximo

---

# Clinical Domain

## Patient

### SELECT

Profissionais e usuários autorizados poderão visualizar apenas pacientes pertencentes à própria clínica.

```sql
patient.clinic_id = auth.clinic_id
```

---

### INSERT

Permitido apenas para.

- Recepcionistas;
- Profissionais;
- Administradores da clínica.

O paciente deverá ser criado na mesma clínica do usuário autenticado.

---

### UPDATE

Permitido apenas para usuários autorizados da mesma clínica.

Alterações deverão ser registradas em AuditLog.

---

### DELETE

Não permitido.

Pacientes deverão utilizar Soft Delete.

---

## Professional

### SELECT

```sql
professional.clinic_id = auth.clinic_id
```

---

### INSERT

Somente administradores da clínica.

---

### UPDATE

Administradores poderão alterar profissionais da própria clínica.

O profissional poderá atualizar apenas seus próprios dados permitidos.

---

### DELETE

Não permitido.

Profissionais deverão ser desativados.

---

## Specialty

### SELECT

Especialidades poderão ser consultadas por todos os usuários autenticados.

Caso existam especialidades personalizadas.

```sql
specialty.clinic_id = auth.clinic_id
```

---

### INSERT

Somente administradores autorizados.

---

### UPDATE

Somente administradores autorizados.

---

### DELETE

Não permitido.

Especialidades deverão ser arquivadas.

---

## ProfessionalSpecialty

### SELECT

```sql
clinic_id = auth.clinic_id
```

---

### INSERT

Somente administradores da clínica.

---

### UPDATE

Não recomendado.

---

### DELETE

Permitido apenas para administradores.

---

## Allergy

### SELECT

Permitido apenas para usuários autorizados da clínica.

```sql
allergy.clinic_id = auth.clinic_id
```

---

### INSERT

Profissionais autorizados.

---

### UPDATE

Profissionais autorizados.

Toda alteração deverá ser auditada.

---

### DELETE

Não permitido.

Allergias representam histórico clínico.

---

## Medication

### SELECT

Todos os usuários autenticados poderão consultar o catálogo oficial.

---

### INSERT

Somente administradores da plataforma.

---

### UPDATE

Somente administradores da plataforma.

---

### DELETE

Não permitido.

Medicamentos deverão permanecer preservados para manter histórico das prescrições.

---

## VitalSigns

### SELECT

Permitido apenas para profissionais autorizados da mesma clínica.

```sql
vital_signs.clinic_id = auth.clinic_id
```

---

### INSERT

Profissionais autorizados.

---

### UPDATE

Permitido apenas antes da finalização do atendimento.

Após assinatura do prontuário.

Não deverá ser permitido alterar os registros.

---

### DELETE

Não permitido.

---

# Política Geral do Domínio

Todas as entidades clínicas deverão utilizar.

```sql
clinic_id = auth.clinic_id
```

Além disso.

O acesso deverá respeitar o papel do usuário.

Exemplos.

- Recepcionista;
- Médico;
- Enfermeiro;
- Psicólogo;
- Administrador.

---

# Observações

Nenhum usuário poderá.

- acessar pacientes de outra clínica;
- visualizar prontuários sem autorização;
- alterar alergias históricas;
- excluir sinais vitais registrados;
- modificar dados clínicos após assinatura quando aplicável.

Todas as operações deverão gerar registros em AuditLog.

---

# Próximo

---

# Medical Domain

## Appointment

### SELECT

Permitido apenas para usuários autorizados da mesma clínica.

```sql
appointment.clinic_id = auth.clinic_id
```

Além disso.

O acesso deverá respeitar as permissões do profissional e do papel do usuário.

---

### INSERT

Permitido para.

- Recepcionistas;
- Profissionais;
- Administradores.

Sempre dentro da própria clínica.

---

### UPDATE

Permitido enquanto o atendimento não estiver finalizado.

Após o encerramento.

Somente usuários autorizados poderão realizar alterações administrativas.

---

### DELETE

Não permitido.

Atendimentos deverão permanecer preservados para auditoria e histórico clínico.

---

## MedicalRecord

### SELECT

```sql
medical_record.clinic_id = auth.clinic_id
```

Além do isolamento por clínica.

O acesso deverá respeitar as permissões clínicas do usuário.

---

### INSERT

Somente profissionais habilitados.

O prontuário deverá estar vinculado a um atendimento válido.

---

### UPDATE

Permitido apenas até a assinatura do prontuário.

Após assinatura.

O documento deverá tornar-se imutável.

Correções deverão ocorrer através de adendos.

---

### DELETE

Não permitido.

Prontuários representam documentos legais.

---

## Diagnosis

### SELECT

```sql
diagnosis.clinic_id = auth.clinic_id
```

---

### INSERT

Somente profissionais habilitados.

---

### UPDATE

Permitido apenas antes da assinatura do prontuário.

---

### DELETE

Não permitido.

---

## ClinicalNote

### SELECT

```sql
clinical_note.clinic_id = auth.clinic_id
```

---

### INSERT

Profissionais autorizados.

---

### UPDATE

Permitido apenas antes da assinatura do prontuário.

---

### DELETE

Não permitido.

Notas clínicas deverão permanecer preservadas.

---

## Prescription

### SELECT

```sql
prescription.clinic_id = auth.clinic_id
```

---

### INSERT

Somente profissionais habilitados para prescrição.

---

### UPDATE

Permitido apenas antes da assinatura ou emissão oficial.

---

### DELETE

Não permitido.

Prescrições emitidas deverão permanecer preservadas.

---

## PrescriptionItem

### SELECT

Mesmo acesso da Prescription.

---

### INSERT

Automático durante a criação da prescrição.

---

### UPDATE

Permitido apenas antes da emissão.

---

### DELETE

Permitido apenas antes da emissão da prescrição.

---

## Exam

### SELECT

```sql
exam.clinic_id = auth.clinic_id
```

---

### INSERT

Profissionais autorizados.

---

### UPDATE

Permitido enquanto o exame não estiver concluído.

---

### DELETE

Não permitido.

---

## ExamItem

### SELECT

Mesmo acesso do Exam.

---

### INSERT

Automático durante a solicitação do exame.

---

### UPDATE

Permitido apenas antes da conclusão.

---

### DELETE

Permitido apenas antes da conclusão do exame.

---

## Attachment

### SELECT

O acesso deverá seguir exatamente as permissões da entidade à qual o anexo pertence.

Exemplos.

```text
MedicalRecord

ClinicalNote

Exam

Prescription

Patient
```

Não será permitido acessar um Attachment sem autorização para sua entidade de origem.

---

### INSERT

Usuários autorizados conforme a entidade vinculada.

---

### UPDATE

Permitido apenas para metadados.

O arquivo físico não deverá ser alterado.

---

### DELETE

Utilizar Soft Delete quando permitido pelas regras de negócio.

---

# Política Geral do Domínio

Todas as entidades deverão respeitar.

```sql
clinic_id = auth.clinic_id
```

Além disso.

O acesso dependerá de.

- papel do usuário;
- vínculo profissional;
- situação do atendimento;
- assinatura do prontuário.

---

# Observações

Nenhum usuário poderá.

- acessar prontuários de outra clínica;
- visualizar prescrições sem autorização;
- alterar diagnósticos assinados;
- modificar documentos clínicos oficiais;
- excluir informações médicas permanentes.

Qualquer acesso extraordinário deverá ser registrado em AuditLog.

---

# Próximo

---

# Financial Domain

## Payment

### SELECT

Permitido apenas para usuários autorizados da mesma clínica.

```sql
payment.clinic_id = auth.clinic_id
```

Usuários do módulo financeiro poderão visualizar todos os pagamentos da clínica.

Outros usuários apenas quando permitido pelas regras de negócio.

---

### INSERT

Executado pelo módulo financeiro ou por integrações autorizadas.

O pagamento deverá pertencer à própria clínica.

---

### UPDATE

Permitido apenas enquanto o pagamento estiver em processamento.

Após confirmação.

O registro deverá tornar-se imutável.

---

### DELETE

Não permitido.

Pagamentos representam registros financeiros oficiais.

---

## Invoice

### SELECT

```sql
invoice.clinic_id = auth.clinic_id
```

---

### INSERT

Executado automaticamente pelo módulo Billing ou por usuários autorizados.

---

### UPDATE

Permitido apenas antes da emissão oficial.

Após emissão.

Somente alterações previstas pelas regras financeiras.

---

### DELETE

Não permitido.

Faturas deverão permanecer preservadas.

---

## Billing

### SELECT

```sql
billing.clinic_id = auth.clinic_id
```

---

### INSERT

Executado apenas por processos financeiros autorizados.

---

### UPDATE

Permitido apenas ao módulo financeiro.

---

### DELETE

Não permitido.

Billing representa histórico operacional.

---

## Refund

### SELECT

```sql
refund.clinic_id = auth.clinic_id
```

---

### INSERT

Permitido apenas para usuários autorizados do financeiro.

Ou automaticamente pelo gateway quando suportado.

---

### UPDATE

Permitido apenas durante o processamento.

Após conclusão.

O estorno deverá tornar-se imutável.

---

### DELETE

Não permitido.

---

## WebhookEvent

### SELECT

Somente.

- Administradores da plataforma;
- Equipe técnica autorizada;
- Processos internos.

Usuários comuns não deverão visualizar Webhooks.

---

### INSERT

Executado exclusivamente pelos endpoints internos responsáveis pelo recebimento dos Webhooks.

---

### UPDATE

Permitido apenas durante o processamento.

Após conclusão.

O evento deverá permanecer imutável.

---

### DELETE

Não permitido.

Eventos deverão permanecer disponíveis para auditoria.

---

# Política Geral do Domínio

Todas as entidades financeiras deverão utilizar.

```sql
clinic_id = auth.clinic_id
```

Além disso.

O acesso dependerá do papel do usuário.

Exemplos.

- Financeiro;
- Administrador;
- Plataforma;
- Processos internos.

---

# Observações

Nenhum usuário poderá.

- visualizar pagamentos de outra clínica;
- alterar pagamentos concluídos;
- excluir faturas;
- modificar estornos concluídos;
- consultar Webhooks diretamente sem autorização.

Todos os eventos financeiros deverão gerar registros em AuditLog.

---

# Próximo

---

# Communication Domain

## Notification

### SELECT

Permitido apenas para usuários autorizados da mesma clínica.

```sql
notification.clinic_id = auth.clinic_id
```

Além disso.

O usuário poderá visualizar apenas notificações das quais seja destinatário ou que possuam autorização explícita.

Administradores da clínica poderão consultar todas as notificações da própria clínica.

---

### INSERT

Executado.

- pelo sistema;
- por processos automáticos;
- por usuários autorizados.

---

### UPDATE

Permitido apenas durante o ciclo de envio.

Após conclusão da entrega.

A notificação deverá permanecer imutável.

---

### DELETE

Não permitido.

Notificações representam histórico operacional da comunicação.

---

## NotificationTemplate

### SELECT

Todos os usuários autenticados poderão consultar templates publicados.

Templates privados deverão respeitar.

```sql
clinic_id = auth.clinic_id
```

quando houver suporte para templates específicos por clínica.

---

### INSERT

Somente administradores autorizados.

---

### UPDATE

Somente administradores autorizados.

Após publicação.

Alterações deverão gerar uma nova versão.

---

### DELETE

Não permitido.

Templates deverão utilizar Soft Delete.

---

## NotificationDelivery

### SELECT

Permitido apenas para administradores e usuários autorizados.

```sql
notification_delivery.clinic_id = auth.clinic_id
```

Usuários comuns não deverão visualizar detalhes técnicos da entrega.

---

### INSERT

Executado automaticamente pelo sistema.

---

### UPDATE

Executado automaticamente durante.

- envio;
- confirmação;
- leitura;
- falha;
- retry.

---

### DELETE

Não permitido.

As tentativas de entrega deverão permanecer preservadas para auditoria.

---

# Política Geral do Domínio

Todas as entidades deverão respeitar.

```sql
clinic_id = auth.clinic_id
```

Além disso.

O acesso dependerá.

- do destinatário;
- do papel do usuário;
- da finalidade administrativa.

Informações técnicas sobre provedores deverão permanecer restritas.

---

# Observações

Nenhum usuário poderá.

- visualizar notificações de outra clínica;
- consultar entregas técnicas sem autorização;
- alterar notificações concluídas;
- remover histórico de comunicações.

Todos os envios deverão gerar registros em AuditLog.

---

# Próximo

---

# Infrastructure Domain

## AuditLog

### SELECT

Permitido apenas para.

- Administradores da clínica;
- Administradores da plataforma;
- Auditores autorizados.

```sql
audit_log.clinic_id = auth.clinic_id
```

Eventos globais poderão ser consultados apenas pela plataforma.

---

### INSERT

Executado automaticamente pelo sistema.

Usuários nunca deverão criar registros manualmente.

---

### UPDATE

Não permitido.

AuditLogs são imutáveis.

---

### DELETE

Não permitido.

Os registros representam evidências de auditoria.

---

## BackgroundJob

### SELECT

Permitido apenas para.

- Administradores;
- Equipe técnica;
- Processos internos.

```sql
background_job.clinic_id = auth.clinic_id
```

---

### INSERT

Executado automaticamente pelo sistema.

---

### UPDATE

Executado apenas pelos Workers responsáveis.

---

### DELETE

Não permitido.

Jobs deverão permanecer registrados para rastreabilidade.

---

## ApiKey

### SELECT

Permitido apenas para.

- Administradores da clínica;
- Administradores da plataforma.

```sql
api_key.clinic_id = auth.clinic_id
```

A chave secreta nunca deverá ser retornada após sua criação.

---

### INSERT

Permitido apenas para administradores autorizados.

---

### UPDATE

Permitido para.

- rotação;
- alteração de escopos;
- expiração;
- revogação.

---

### DELETE

Não permitido.

Credenciais deverão utilizar Soft Delete.

---

## Integration

### SELECT

```sql
integration.clinic_id = auth.clinic_id
```

Administradores poderão consultar apenas integrações da própria clínica.

Integrações globais poderão ser consultadas apenas pela plataforma.

---

### INSERT

Administradores autorizados.

---

### UPDATE

Administradores autorizados.

---

### DELETE

Não permitido.

Integrações deverão utilizar Soft Delete.

---

## FileStorage

### SELECT

O acesso dependerá da entidade proprietária do arquivo.

Exemplos.

```text
MedicalRecord

Exam

Prescription

Patient

ClinicalNote
```

Não será permitido acessar diretamente arquivos físicos sem autorização para a entidade vinculada.

---

### INSERT

Executado apenas por processos autorizados.

---

### UPDATE

Permitido apenas para metadados.

O conteúdo físico do arquivo nunca deverá ser alterado.

---

### DELETE

Executado apenas conforme política de retenção.

Preferencialmente utilizando Soft Delete.

---

# Política Geral do Domínio

Todas as entidades multi-tenant deverão respeitar.

```sql
clinic_id = auth.clinic_id
```

Além disso.

Entidades técnicas deverão possuir acesso restrito.

Exemplos.

```text
AuditLog

BackgroundJob

ApiKey

Integration
```

Essas entidades não deverão ser acessadas por usuários comuns.

---

# Observações

Nenhum usuário poderá.

- visualizar AuditLogs de outra clínica;
- alterar registros de auditoria;
- acessar ApiKeys de terceiros;
- consultar BackgroundJobs internos;
- acessar arquivos sem autorização para a entidade de origem.

Todos os acessos administrativos deverão ser registrados em AuditLog.

---

# Próximo

## Artificial Intelligence Domain