# Módulo de Notificações (Notifications)

| Campo | Valor |
|-------|--------|
| Documento | Notifications |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Modules |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# 1. Visão Geral

O módulo **Notifications** é responsável por toda comunicação gerada pelo MedFlow.

Ele não é responsável por decidir as regras de negócio.

Sua responsabilidade é entregar informações aos destinatários corretos através do canal apropriado.

---

# 2. Princípio Fundamental

```text
Notifications

≠

Business Logic
```

O módulo nunca deverá decidir:

```text
Quando um exame é criado.

Quando uma consulta termina.

Quando um pagamento é recebido.
```

Essas decisões pertencem aos módulos de origem.

---

# 3. Responsabilidade

Notifications deverá responder apenas:

```text
Quem deve ser notificado?

Por qual canal?

Quando?

Com qual conteúdo?

Qual foi o resultado da entrega?
```

---

# 4. Source of Truth

Notifications será o Source of Truth para:

```text
Notification Requests

Delivery Attempts

Delivery Status

Templates

Channels

Notification History
```

---

# 5. Escopo

O módulo poderá ser responsável por:

- Push Notifications
- Email
- SMS
- WhatsApp
- In-App Notifications
- Notification Center
- Templates
- Delivery Queue
- Retry
- Preferences
- Opt-out
- Histórico
- Auditoria

---

# 6. Fora do Escopo

Não pertence ao módulo:

- Agenda
- Financeiro
- IA
- Prontuário
- Prescrições
- Exames
- Autenticação

Esses módulos apenas solicitam notificações.

---

# 7. Filosofia

Notifications deverá funcionar como uma infraestrutura.

Os módulos de domínio apenas informam:

```text
Algo aconteceu.
```

Notifications decide:

```text
Como comunicar.
```

---

# 8. Bounded Context

```text
Appointments

Exams

Finance

Medical Records

Authentication

AI

↓

Notifications

↓

Email

SMS

Push

WhatsApp

Notification Center
```

---

# 9. Domain Boundary

Appointments nunca enviará Email diretamente.

Finance nunca enviará Push diretamente.

Medical Records nunca enviará WhatsApp diretamente.

Todos passam por Notifications.

---

# 10. Objetivo

Permitir comunicação consistente entre sistema e usuários.

---

# 11. Entidades

O domínio poderá evoluir para:

```text
Notification

NotificationTemplate

NotificationChannel

Delivery

DeliveryAttempt

NotificationPreference

NotificationSubscription

NotificationEvent

NotificationQueue
```

---

# 12. Notification

Entidade principal.

```text
Notification

├── id
├── organizationId
├── recipientId
├── templateId
├── channel
├── priority
├── status
├── payload
├── createdAt
├── scheduledAt
├── deliveredAt
└── metadata
```

---

# 13. Notification Identity

Toda Notification possuirá ID único.

Jamais utilizar:

```text
Email

Phone

AppointmentId
```

como identidade.

---

# 14. Organization Ownership

Toda Notification deverá possuir:

```text
organizationId
```

---

# 15. Recipient

Recipient representa quem receberá a mensagem.

Pode ser:

```text
Patient

Professional

Receptionist

Administrator

Organization
```

---

# 16. Recipient Type

Modelo conceitual:

```text
Recipient

↓

User

Professional

Patient

System
```

---

# 17. Notification Status

Possíveis estados:

```text
created

queued

processing

sent

delivered

failed

cancelled

expired
```

---

# 18. Delivery

Entrega representa tentativa real de comunicação.

---

# 19. Delivery Attempt

Uma Notification poderá possuir múltiplas tentativas.

---

# 20. Retry

Exemplo:

```text
Attempt 1

↓

Failed

↓

Retry

↓

Delivered
```

---

# 21. Delivery History

Todas as tentativas deverão permanecer registradas.

---

# 22. Delivery Entity

```text
Delivery

├── id
├── notificationId
├── provider
├── status
├── response
├── attemptedAt
└── metadata
```

---

# 23. Delivery Status

```text
pending

sent

delivered

failed

bounced

opened

clicked
```

Nem todos os canais suportarão todos os estados.

---

# 24. Channels

O domínio deverá suportar múltiplos canais.

---

# 25. Supported Channels

```text
Email

SMS

Push

WhatsApp

In-App
```

---

# 26. Future Channels

Arquitetura preparada para:

```text
Telegram

Signal

Voice

Webhook

Microsoft Teams

Slack
```

---

# 27. Channel Independence

O domínio não deverá depender de um fornecedor específico.

---

# 28. Provider

Exemplo:

```text
Email

↓

SendGrid

Amazon SES

Resend
```

---

# 29. Provider Boundary

Provider não pertence ao domínio.

É apenas infraestrutura.

---

# 30. Template

Toda mensagem deverá utilizar Template quando possível.

---

# 31. Notification Template

```text
NotificationTemplate

├── id
├── organizationId
├── code
├── channel
├── subject
├── body
├── variables
├── language
└── version
```

---

# 32. Template Versioning

Mudanças em Templates deverão preservar histórico.

---

# 33. Variables

Exemplo:

```text
{{patientName}}

{{appointmentDate}}

{{doctorName}}

{{clinicName}}
```

---

# 34. Rendering

Renderização deverá ocorrer antes da entrega.

---

# 35. Validation

Variáveis obrigatórias deverão ser validadas.

---

# 36. Missing Variables

Template não deverá ser enviado com placeholders quebrados.

---

# 37. Localization

Templates deverão suportar múltiplos idiomas.

---

# 38. Languages

Exemplos:

```text
pt-BR

en-US

es-ES
```

---

# 39. Fallback

Idioma indisponível poderá utilizar idioma padrão.

---

# 40. Priority

Possíveis prioridades:

```text
low

normal

high

critical
```

---

# 41. Priority ≠ Queue

Prioridade representa importância.

Não implementação.

---

# 42. Queue

Notificações deverão passar por fila.

---

# 43. Queue Benefits

Permite:

```text
Retry

Scaling

Rate Limiting

Observability
```

---

# 44. Queue Entity

```text
NotificationQueue

↓

Notification

↓

Worker

↓

Provider
```

---

# 45. Workers

Workers deverão processar filas independentemente.

---

# 46. Rate Limiting

Providers poderão limitar requisições.

Workers deverão respeitar esses limites.

---

# 47. Retry Strategy

Preferir:

```text
Exponential Backoff
```

---

# 48. Dead Letter Queue

Mensagens que falharem repetidamente poderão ser enviadas para DLQ.

---

# 49. Idempotência

Retries nunca deverão gerar duplicação indevida.

---

# 50. Duplicate Protection

Mesmo evento recebido duas vezes deverá gerar apenas uma Notification quando apropriado.

---

# 51. Domain Events

Notifications consumirá eventos como:

```text
appointment.created

payment.completed

exam.result_available

soap.signed

user.invited
```

---

# 52. Notifications Doesn't Own Events

O domínio apenas consome eventos.

Nunca os produz como regra de negócio principal.

---

# 53. Scheduling

Notificações poderão ser agendadas.

---

# 54. Scheduled Notification

Exemplo:

```text
Appointment

↓

24h Before

↓

Send Reminder
```

---

# 55. Delayed Delivery

Entrega poderá ocorrer no futuro.

---

# 56. Expiration

Uma notificação poderá expirar.

---

# 57. Example

```text
Reminder

↓

Appointment cancelled

↓

Reminder expires
```

---

# 58. Notification Preferences

Usuários poderão configurar preferências.

---

# 59. Preference Entity

```text
NotificationPreference

├── userId
├── channel
├── enabled
├── categories
└── metadata
```

---

# 60. Categories

Exemplos:

```text
Appointments

Payments

Marketing

Clinical

System
```

---

# 61. Opt-out

Usuário poderá desabilitar categorias permitidas.

---

# 62. Mandatory Notifications

Algumas notificações poderão ignorar preferências.

Exemplo:

```text
Security

Password Reset

Critical Clinical Alert
```

---

# 63. Consent

Preferências deverão respeitar consentimentos existentes.

---

# 64. Security

Notificações nunca deverão expor dados clínicos sensíveis desnecessariamente.

---

# 65. Email

Evitar incluir:

```text
Diagnóstico completo

Resultado de exame

Dados financeiros completos
```

---

# 66. Push

Push deverá conter informação mínima.

---

# 67. Example

```text
Seu resultado está disponível.
```

Em vez de:

```text
Seu exame de HIV foi positivo.
```

---

# 68. LGPD

Toda comunicação deverá respeitar a LGPD.

---

# 69. Observabilidade

Métricas:

```text
Sent

Delivered

Failed

Retries

Queue Size
```

---

# 70. Continuação

Na Parte 2 serão abordados:

- In-App Notifications
- Notification Center
- Read Status
- Batch Notifications
- Broadcast
- Webhooks
- APIs
- Eventos
- Observabilidade avançada
- ADR-961 em diante         
---

# 71. In-App Notifications

O MedFlow deverá suportar notificações internas, acessíveis diretamente pela interface da aplicação.

Essas notificações não dependem de provedores externos.

---

# 72. Notification Center

Todo usuário poderá possuir um centro de notificações.

Exemplo:

```text
┌────────────────────────────┐
│ 🔔 Notifications           │
├────────────────────────────┤
│ Appointment confirmed      │
│ Payment received           │
│ Exam available             │
│ Prescription updated       │
│ System maintenance         │
└────────────────────────────┘
```

---

# 73. Notification Center Entity

```text
NotificationCenter

├── recipientId
├── unreadCount
├── lastViewedAt
└── metadata
```

---

# 74. Read Status

Cada notificação deverá possuir estado de leitura.

```text
Unread

↓

Read

↓

Archived (optional)
```

---

# 75. Read Receipt

Registrar:

```text
readAt

readBy

device
```

quando aplicável.

---

# 76. Bulk Read

O sistema poderá permitir:

```text
Mark all as read
```

Essa operação não deverá remover notificações.

---

# 77. Archive

Arquivar não significa excluir.

---

# 78. Delete

Caso exclusão seja suportada, ela deverá respeitar regras de retenção definidas pelo produto.

---

# 79. Retention

Notificações poderão possuir política de retenção.

Exemplo:

```text
90 dias

180 dias

1 ano
```

A política definitiva dependerá da organização e da legislação aplicável.

---

# 80. Categories

Toda Notification deverá pertencer a uma categoria.

---

# 81. Notification Categories

Exemplos:

```text
Appointments

Medical Records

Exams

Finance

Prescriptions

Authentication

System

Marketing
```

---

# 82. Category Filtering

Usuários poderão filtrar notificações por categoria.

---

# 83. Search

Notification Center poderá permitir pesquisa textual.

---

# 84. Batch Notifications

Múltiplas notificações semelhantes poderão ser agrupadas.

---

# 85. Aggregation

Exemplo:

Em vez de:

```text
Exam A available

Exam B available

Exam C available
```

Poderá ser exibido:

```text
3 exam results are available.
```

---

# 86. Aggregation Rules

Agrupamentos deverão preservar significado.

Nunca ocultar eventos críticos.

---

# 87. Critical Notifications

Exemplos:

```text
Security Alert

Break Glass

Emergency Clinical Alert
```

Nunca deverão ser agrupados de forma que reduzam sua visibilidade.

---

# 88. Broadcast

O sistema poderá enviar mensagens para múltiplos destinatários.

---

# 89. Broadcast Entity

```text
Broadcast

├── id
├── audience
├── template
├── channels
├── createdAt
└── metadata
```

---

# 90. Broadcast Audience

Exemplos:

```text
All Users

All Professionals

Specific Organization

Specific Clinic

Role

Dynamic Segment
```

---

# 91. Broadcast Safety

Broadcast deverá possuir confirmação explícita antes do envio.

---

# 92. Preview

O usuário deverá conseguir visualizar a mensagem antes do envio.

---

# 93. Scheduling

Broadcast poderá ser agendado.

---

# 94. Cancel Scheduled Broadcast

Enquanto não iniciado, poderá ser cancelado.

---

# 95. Notification Preferences

Preferências poderão variar por categoria.

Exemplo:

```text
Appointments

↓

Email + Push

Finance

↓

Email Only
```

---

# 96. Quiet Hours

Usuários poderão definir horários silenciosos.

---

# 97. Quiet Hours Example

```text
22:00

↓

07:00
```

Exceto notificações críticas.

---

# 98. Do Not Disturb

Modo "Não Perturbe" poderá ser suportado.

---

# 99. Critical Override

Alertas críticos poderão ignorar horários silenciosos conforme política da organização.

---

# 100. Timezone

Agendamentos deverão utilizar timezone explícita do destinatário ou da organização.

Nunca depender apenas do navegador.

---

# 101. Localization

O idioma utilizado deverá respeitar:

```text
User Preference

↓

Organization Default

↓

Platform Default
```

---

# 102. Attachments

Alguns canais poderão suportar anexos.

---

# 103. Attachment Policy

O módulo deverá validar:

```text
Type

Size

Channel Support
```

---

# 104. Clinical Privacy

Anexos clínicos nunca deverão ser enviados automaticamente sem autorização adequada.

---

# 105. Webhooks

Notifications poderá disparar Webhooks para sistemas externos.

---

# 106. Webhook Event

Exemplo:

```text
notification.sent

notification.failed

notification.delivered
```

---

# 107. Webhook Delivery

Webhooks deverão utilizar:

```text
Retry

Signature

Idempotency
```

---

# 108. Webhook Security

Toda chamada deverá ser autenticada.

---

# 109. API Keys

Integrações deverão utilizar credenciais apropriadas.

Nunca hardcoded.

---

# 110. Provider Failure

Falha de um Provider não deverá comprometer o restante da fila.

---

# 111. Failover

Quando suportado, outro Provider poderá assumir a entrega.

---

# 112. Multi Provider

Exemplo:

```text
Email

↓

Provider A

↓

Fallback

↓

Provider B
```

---

# 113. Rate Limits

Workers deverão respeitar limites impostos pelos provedores.

---

# 114. Delivery Metrics

Registrar:

```text
Accepted

Sent

Delivered

Opened

Clicked

Failed

Bounced
```

quando disponíveis.

---

# 115. Bounce

Emails rejeitados deverão ser tratados separadamente.

---

# 116. Invalid Recipients

Destinatários inválidos poderão ser marcados para revisão.

---

# 117. Retry Policy

Não realizar retries infinitos.

---

# 118. Dead Letter Queue

Após número máximo de falhas:

```text
Notification

↓

DLQ

↓

Manual Analysis
```

---

# 119. APIs Conceituais

```text
GET /notifications

GET /notifications/{id}

POST /notifications

POST /notifications/{id}/read

POST /notifications/broadcast

GET /notification-preferences

PUT /notification-preferences
```

---

# 120. Commands

Preferir:

```text
sendNotification()

scheduleNotification()

broadcastNotification()

markAsRead()

archiveNotification()
```

---

# 121. Domain Events

Notifications poderá publicar:

```text
notification.sent

notification.delivered

notification.failed

notification.read

broadcast.completed
```

Esses eventos representam o domínio de Notifications.

---

# 122. Event Consumers

Exemplos:

```text
Analytics

Audit

Reports

Monitoring
```

---

# 123. Audit

Toda operação administrativa deverá possuir auditoria.

---

# 124. Observability

Métricas adicionais:

```text
Broadcast Count

Notification Read Rate

Open Rate

Click Rate

Average Delivery Time
```

---

# 125. Domain Invariants

```text
Every Notification belongs to one Organization.

Notification History is preserved.

Templates are versioned.

Delivery attempts are immutable.

Retries are idempotent.

Broadcasts never bypass authorization.

Critical notifications remain visible.

Notification preferences never affect mandatory security alerts.
```

---

# 126. Decisões Arquiteturais e de Produto

## ADR-961

Notification Center será parte integrante do domínio Notifications.

---

## ADR-962

Toda Notification possuirá histórico de leitura quando aplicável.

---

## ADR-963

Broadcast será tratado como entidade própria.

---

## ADR-964

Templates permanecerão versionados.

---

## ADR-965

O domínio suportará múltiplos Providers por canal.

---

## ADR-966

Retries utilizarão estratégia de Exponential Backoff.

---

## ADR-967

Dead Letter Queue fará parte da arquitetura padrão.

---

## ADR-968

Preferências do usuário respeitarão categorias e horários silenciosos.

---

## ADR-969

Notificações críticas poderão ignorar Quiet Hours conforme política definida.

---

## ADR-970

Webhooks utilizarão autenticação, assinatura e idempotência.

---

# 127. Continuação

Na Parte 3 serão abordados:

- Segurança
- LGPD
- Auditoria
- Escalabilidade
- Performance
- Testes
- Anti-Patterns
- Future Evolution
- ADR-971 até ADR-980
---

# 128. Segurança

O módulo Notifications deverá tratar informações potencialmente sensíveis.

Embora normalmente não armazene dados clínicos completos, ele poderá manipular referências e mensagens relacionadas ao atendimento do paciente.

---

# 129. Princípio

Toda notificação deverá conter apenas as informações necessárias para cumprir seu objetivo.

---

# 130. Data Minimization

Sempre aplicar:

```text
Need to Know

+

Least Privilege

+

Minimum Disclosure
```

---

# 131. Conteúdo Sensível

Evitar enviar por canais inseguros:

```text
Diagnósticos

Resultados laboratoriais

Prescrições completas

Dados financeiros

Informações pessoais desnecessárias
```

---

# 132. Mensagens Seguras

Preferir:

```text
Seu exame está disponível.
```

Ao invés de:

```text
Seu exame confirmou Diabetes Mellitus Tipo II.
```

---

# 133. Deep Links

Sempre que possível:

```text
Notification

↓

Deep Link

↓

Sistema autenticado

↓

Visualização segura
```

---

# 134. URLs Públicas

Notificações nunca deverão conter URLs públicas para documentos protegidos.

---

# 135. Tokens

Links temporários deverão utilizar tokens seguros e com expiração.

---

# 136. Expiração

Tokens de acesso deverão possuir tempo de vida limitado.

---

# 137. Revogação

Links poderão ser invalidados antes da expiração.

---

# 138. LGPD

Toda comunicação deverá seguir os princípios da LGPD.

---

# 139. Consentimento

Mensagens opcionais deverão respeitar os consentimentos do usuário.

---

# 140. Marketing

Notificações de marketing nunca deverão utilizar canais não autorizados.

---

# 141. Comunicação Obrigatória

Exemplos:

```text
Reset de senha

Alerta de segurança

Confirmação de autenticação

Avisos regulatórios
```

Essas notificações poderão ignorar preferências de marketing.

---

# 142. Auditoria

Toda ação administrativa relevante deverá gerar auditoria.

---

# 143. Audit Entity

```text
NotificationAudit

├── id
├── organizationId
├── actorId
├── action
├── notificationId
├── timestamp
├── metadata
```

---

# 144. Audit Actions

Exemplos:

```text
Template Updated

Template Deleted

Broadcast Sent

Notification Cancelled

Retry Triggered

Provider Changed
```

---

# 145. Histórico

O histórico operacional deverá permanecer preservado.

---

# 146. Exclusão

A exclusão física de registros deverá ocorrer apenas conforme política de retenção.

---

# 147. Multi-Tenant

Cada Notification pertence exatamente a uma organização.

---

# 148. Tenant Isolation

Toda consulta deverá filtrar obrigatoriamente por:

```text
organizationId
```

---

# 149. Cross-Tenant

Jamais permitir acesso cruzado entre organizações.

---

# 150. Escalabilidade

O módulo deverá suportar milhões de notificações.

---

# 151. Escalabilidade Horizontal

Workers deverão poder ser replicados horizontalmente.

---

# 152. Queue Partitioning

Filas poderão ser particionadas por:

```text
Organization

Priority

Channel

Region
```

---

# 153. Channel Isolation

Falhas em Email não deverão interromper Push.

---

# 154. Independent Workers

Cada canal poderá possuir workers independentes.

---

# 155. Throughput

O sistema deverá suportar grandes campanhas sem impactar notificações críticas.

---

# 156. Priority Queues

Exemplo:

```text
Critical

↓

High

↓

Normal

↓

Low
```

---

# 157. SLA

Cada categoria poderá possuir SLA próprio.

---

# 158. Performance

Métricas importantes:

```text
Queue Processing Time

Delivery Latency

Retry Rate

Provider Latency
```

---

# 159. Health Check

Workers deverão expor endpoints de saúde.

---

# 160. Circuit Breaker

Falhas repetidas de um Provider poderão ativar Circuit Breaker.

---

# 161. Fail Fast

Problemas conhecidos deverão ser detectados rapidamente.

---

# 162. Recovery

Após recuperação do Provider:

```text
Circuit Closed

↓

Queue Resume
```

---

# 163. Observabilidade

O módulo deverá produzir:

```text
Logs

Metrics

Distributed Traces
```

---

# 164. Logs

Logs nunca deverão armazenar conteúdo sensível completo.

---

# 165. Metrics

Exemplos:

```text
Notifications Sent

Notifications Delivered

Queue Size

Retries

Failures

Open Rate
```

---

# 166. Dashboards

O módulo deverá permitir dashboards operacionais.

---

# 167. Alertas

Alertas automáticos poderão ocorrer quando:

```text
Fila crescer rapidamente

Provider indisponível

Taxa de erro elevada

Bounce elevado
```

---

# 168. Disaster Recovery

Mensagens persistidas deverão sobreviver a reinicializações do sistema.

---

# 169. Backup

Templates e configurações deverão ser incluídos em políticas de backup.

---

# 170. Testabilidade

O domínio deverá ser altamente testável.

---

# 171. Testes Unitários

Cobrir:

```text
Templates

Rendering

Retry

Queue

Preferences
```

---

# 172. Testes de Integração

Validar:

```text
Providers

Workers

Queues

Webhooks

Broadcast
```

---

# 173. Testes de Carga

Avaliar comportamento durante grandes volumes de envio.

---

# 174. Testes de Recuperação

Simular indisponibilidade de Providers.

---

# 175. Testes de Segurança

Validar:

```text
Tenant Isolation

Permissions

Token Expiration

Webhook Signature
```

---

# 176. Anti-Patterns

Evitar:

```text
Enviar Email diretamente do módulo Appointments.

Acoplar lógica de negócio ao Provider.

Criar Templates hardcoded.

Ignorar Retry.

Ignorar auditoria.

Misturar Marketing com Alertas Críticos.
```

---

# 177. Future Evolution

Possíveis evoluções:

```text
AI Generated Templates

Smart Scheduling

Predictive Delivery

Channel Optimization

Multilingual AI

Notification Analytics
```

---

# 178. Domain Invariants

```text
Every Notification belongs to one Organization.

Every Delivery preserves history.

Templates are immutable after versioning.

Retries are idempotent.

Critical Notifications cannot be silently discarded.

Notification Preferences never override mandatory security communications.

Cross-tenant access is forbidden.

Providers are infrastructure, not domain entities.
```

---

# 179. Decisões Arquiteturais e de Produto

## ADR-971

Notifications utilizará filas como mecanismo padrão de processamento.

---

## ADR-972

Cada canal poderá possuir infraestrutura independente.

---

## ADR-973

Templates serão renderizados antes da fila de entrega.

---

## ADR-974

Links sensíveis utilizarão tokens temporários.

---

## ADR-975

O domínio suportará Circuit Breaker para Providers.

---

## ADR-976

Filas poderão ser particionadas horizontalmente.

---

## ADR-977

Logs nunca armazenarão conteúdo clínico completo.

---

## ADR-978

Todo Broadcast será auditável.

---

## ADR-979

Mensagens críticas terão prioridade operacional.

---

## ADR-980

Notifications permanecerá completamente desacoplado dos módulos de negócio.

---

# 180. Continuação

Na Parte 4 serão abordados:

- Arquitetura final
- APIs consolidadas
- Checklists
- Definition of Done
- Failure Scenarios
- Considerações finais
- Histórico de versões
---

# 181. Arquitetura Geral

O módulo Notifications deverá seguir uma arquitetura orientada a eventos e desacoplada dos módulos de domínio.

Fluxo conceitual:

```text
Business Module

↓

Domain Event

↓

Notifications

↓

Queue

↓

Worker

↓

Provider

↓

Recipient
```

---

# 182. Fluxo Completo

Exemplo:

```text
Appointment Confirmed

↓

appointment.confirmed

↓

Notifications

↓

Template Rendering

↓

Queue

↓

Worker

↓

Email Provider

↓

Patient

↓

Delivery Confirmation

↓

Audit
```

---

# 183. Separação de Responsabilidades

```text
Appointments

↓

Quando notificar
```

```text
Notifications

↓

Como notificar
```

Essa separação deverá ser preservada durante toda a evolução da plataforma.

---

# 184. APIs Consolidadas

Endpoints conceituais:

```text
GET    /notifications

GET    /notifications/{id}

GET    /notification-center

GET    /notification-preferences

POST   /notifications

POST   /notifications/broadcast

POST   /notifications/{id}/retry

POST   /notifications/{id}/cancel

POST   /notifications/{id}/read

PUT    /notification-preferences

DELETE /notifications/{id}
```

---

# 185. Event Bus

Notifications deverá consumir eventos sem depender da implementação do barramento.

A troca de RabbitMQ, Kafka, NATS ou outro sistema não deverá alterar o domínio.

---

# 186. Infraestrutura

Providers representam infraestrutura.

Exemplo:

```text
Email

↓

Resend
```

ou

```text
Email

↓

Amazon SES
```

O domínio permanece o mesmo.

---

# 187. Resiliência

Mesmo que um Provider esteja indisponível, o sistema deverá continuar aceitando novas notificações.

---

# 188. Graceful Degradation

Quando um canal falhar:

```text
Email

↓

Failed

↓

Retry

↓

Fallback (quando suportado)
```

Sem comprometer outros canais.

---

# 189. Escalabilidade

O módulo deverá permitir crescimento independente dos demais componentes da plataforma.

Workers poderão ser adicionados horizontalmente sem alterar a lógica do domínio.

---

# 190. Consistência

Toda Notification deverá possuir estado consistente durante todo seu ciclo de vida.

Mudanças de estado deverão ser rastreáveis.

---

# 191. Histórico

Nenhuma entrega deverá desaparecer do histórico operacional.

Mesmo notificações expiradas ou canceladas deverão permanecer auditáveis.

---

# 192. Integração com Analytics

O módulo poderá fornecer dados para:

```text
Open Rate

Click Rate

Delivery Rate

Failure Rate

Average Delivery Time

Provider Performance
```

Sem assumir responsabilidade pelo módulo Analytics.

---

# 193. Integração com AI

A IA poderá utilizar métricas do módulo para:

- sugerir melhores horários de envio;
- otimizar templates;
- identificar falhas recorrentes;
- prever canais mais eficientes.

As decisões finais permanecerão sob responsabilidade das regras do produto.

---

# 194. Health Monitoring

O módulo deverá disponibilizar indicadores operacionais como:

```text
Workers ativos

Tamanho das filas

Latência média

Falhas por Provider

Retries pendentes

Dead Letter Queue
```

---

# 195. Failure Scenarios

A arquitetura deverá prever cenários como:

```text
Provider indisponível

Fila congestionada

Webhook duplicado

Retry infinito

Template inválido

Token expirado

Broadcast cancelado

Rate Limit atingido

Timeout

Falha de autenticação
```

Cada cenário deverá possuir comportamento previsível e auditável.

---

# 196. Checklists

## Criar Nova Notification

```text
[ ] Organization válida

[ ] Recipient válido

[ ] Template válido

[ ] Canal suportado

[ ] Prioridade definida

[ ] Auditoria registrada
```

---

## Criar Novo Template

```text
[ ] Código único

[ ] Idioma definido

[ ] Variáveis documentadas

[ ] Versionamento criado

[ ] Testado em ambiente de desenvolvimento
```

---

## Criar Novo Provider

```text
[ ] Autenticação configurada

[ ] Retry suportado

[ ] Rate Limit conhecido

[ ] Observabilidade implementada

[ ] Circuit Breaker configurado
```

---

## Criar Novo Canal

```text
[ ] Interface implementada

[ ] Worker criado

[ ] Templates suportados

[ ] Auditoria integrada

[ ] Testes automatizados
```

---

## Broadcast

```text
[ ] Público validado

[ ] Preview aprovado

[ ] Confirmação administrativa

[ ] Agendamento (quando necessário)

[ ] Auditoria criada
```

---

# 197. Checklist de Code Review

```text
[ ] Sem acesso cross-tenant

[ ] Sem envio direto para Providers

[ ] Templates versionados

[ ] Retry idempotente

[ ] Auditoria implementada

[ ] Logs sem dados sensíveis

[ ] Métricas atualizadas

[ ] Testes criados

[ ] Documentação atualizada
```

---

# 198. Definition of Done

Uma funcionalidade do módulo Notifications somente será considerada concluída quando atender aos seguintes critérios:

```text
Arquitetura preservada

+

Desacoplamento mantido

+

Auditoria implementada

+

Observabilidade disponível

+

Retry funcional

+

Segurança validada

+

Testes automatizados

+

Documentação atualizada
```

---

# 199. Anti-Corruption Layer

Integrações externas nunca deverão alterar diretamente o domínio Notifications.

Todo acesso deverá ocorrer através de interfaces oficiais.

---

# 200. Considerações Finais

O módulo Notifications representa a camada oficial de comunicação da plataforma MedFlow.

Sua missão é garantir que toda informação produzida pelos demais módulos seja entregue ao destinatário correto, no momento adequado, pelo canal apropriado, preservando:

```text
Consistência

Auditabilidade

Escalabilidade

Segurança

Observabilidade

Desacoplamento
```

Independentemente da evolução tecnológica da plataforma, esses princípios deverão permanecer inalterados.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação da documentação oficial do módulo Notifications, definindo arquitetura, entidades, canais, templates, filas, auditoria, segurança, observabilidade, escalabilidade e ADR-961 a ADR-980 | Equipe MedFlow |