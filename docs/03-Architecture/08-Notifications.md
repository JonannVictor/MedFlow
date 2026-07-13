# Notifications

| Campo | Valor |
|-------|--------|
| Documento | Notifications |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Architecture |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define a arquitetura oficial do sistema de notificações do MedFlow.

O objetivo é garantir uma comunicação confiável, escalável e desacoplada entre a plataforma e seus usuários.

As notificações fazem parte da experiência do produto e nunca deverão bloquear o funcionamento das funcionalidades principais.

---

# Filosofia

No MedFlow, notificações são consequências de eventos.

Elas nunca iniciam processos de negócio.

Exemplo.

```text
Consulta criada

↓

Evento

↓

Sistema de Notificações

↓

Email

↓

Push

↓

SMS

↓

WhatsApp
```

O módulo que gerou o evento nunca deverá conhecer os canais de comunicação.

---

# Responsabilidades

O módulo Notifications é responsável por:

- receber eventos;
- decidir quais notificações enviar;
- escolher canais;
- agendar envios;
- registrar histórico;
- acompanhar entregas;
- processar falhas;
- permitir reenvios.

---

# Princípios

O sistema deverá ser:

- assíncrono;
- resiliente;
- auditável;
- escalável;
- desacoplado.

---

# Arquitetura

```text
Evento

↓

Notification Service

↓

Notification Queue

↓

Notification Worker

↓

Provider

↓

Usuário
```

Nenhum módulo enviará mensagens diretamente.

---

# Eventos

Exemplos.

AppointmentCreated

↓

AppointmentConfirmed

↓

AppointmentCancelled

↓

AppointmentReminder

↓

PaymentApproved

↓

PaymentFailed

↓

PrescriptionIssued

↓

ExamAvailable

↓

PasswordReset

↓

UserInvited

↓

SubscriptionRenewed

↓

InvoiceGenerated

↓

AIProcessingCompleted

---

# Canais

Inicialmente.

- Push Notification
- Email

Futuramente.

- SMS
- WhatsApp
- Telegram
- Microsoft Teams
- Slack
- Webhooks

A arquitetura deverá permitir novos canais sem alterar os módulos existentes.

---

# Tipos

## Transacionais

Obrigatórias.

Exemplos.

- recuperação de senha;
- confirmação de consulta;
- pagamento aprovado;
- convite de usuário.

---

## Operacionais

Relacionadas à rotina.

Exemplos.

- lembrete de consulta;
- paciente aguardando;
- exame disponível.

---

## Informativas

Não críticas.

Exemplos.

- novidades;
- atualizações;
- comunicados.

---

## Marketing

Opcional.

Sempre respeitando preferências do usuário.

---

# Preferências

Cada usuário poderá configurar.

- canais preferidos;
- horários;
- notificações silenciadas;
- categorias.

O sistema deverá respeitar essas preferências.

---

# Templates

Toda mensagem deverá utilizar templates.

Exemplo.

```text
Appointment Confirmation

↓

Variáveis

↓

Mensagem Final
```

Nunca gerar mensagens diretamente no código.

---

# Variáveis

Templates poderão utilizar.

- nome do paciente;
- nome do profissional;
- data;
- horário;
- clínica;
- endereço;
- links;
- documentos.

---

# Agendamento

O sistema deverá permitir notificações agendadas.

Exemplos.

24 horas antes.

↓

2 horas antes.

↓

15 minutos antes.

↓

Após consulta.

---

# Filas

Todo envio deverá ocorrer através de filas.

Benefícios.

- maior desempenho;
- retries;
- escalabilidade;
- desacoplamento.

---

# Retentativas

Caso um envio falhe.

O sistema deverá.

- registrar erro;
- tentar novamente;
- respeitar limite máximo;
- registrar resultado final.

---

# Histórico

Toda notificação deverá gerar registro.

Informações.

- usuário;
- tenant;
- canal;
- template;
- data;
- status;
- tentativas.

---

# Status

Estados oficiais.

Pending

Queued

Sending

Delivered

Failed

Cancelled

Read (quando suportado)

---

# Auditoria

Toda operação relevante deverá registrar.

- criação;
- envio;
- falha;
- cancelamento;
- leitura (quando disponível).

---

# Segurança

Antes do envio.

Validar.

- usuário;
- tenant;
- permissões;
- preferências.

Nunca enviar informações para destinatário incorreto.

---

# Performance

Boas práticas.

- processamento assíncrono;
- filas;
- batch quando possível;
- templates reutilizáveis;
- cache de configurações.

---

# Integração

O Notification Service poderá utilizar diversos provedores.

Exemplos.

Email.

- Resend
- SendGrid
- Amazon SES

Push.

- Expo Push
- Firebase

SMS.

- Twilio

WhatsApp.

- Meta API

A troca de provedor nunca deverá impactar o restante da plataforma.

---

# Eventos Gerados

O próprio módulo também gera eventos.

NotificationCreated

NotificationQueued

NotificationSent

NotificationDelivered

NotificationRead

NotificationFailed

NotificationCancelled

---

# Escalabilidade

O sistema deverá suportar.

- milhares de notificações por minuto;
- múltiplos provedores;
- múltiplos workers;
- filas distribuídas.

Sem alteração arquitetural.

---

# Checklist

Toda nova notificação deverá responder.

- existe evento?
- existe template?
- existe canal?
- respeita preferências?
- utiliza fila?
- possui auditoria?
- possui tratamento de falhas?

---

# Declaração Final

O sistema de notificações do MedFlow representa a principal camada de comunicação da plataforma.

Sua arquitetura deve garantir que toda mensagem seja entregue de forma confiável, rastreável e desacoplada, preservando desempenho, segurança e excelente experiência para os usuários.

---

# Documentos Relacionados

- System Architecture
- API Architecture
- Background Jobs
- Logging
- Observability
- Multi-Tenant
- Audit
- User Journey
- Clinic Workflow