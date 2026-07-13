# Webhooks

| Campo | Valor |
|-------|--------|
| Documento | Webhooks |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Backend |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define a arquitetura oficial de Webhooks do MedFlow.

Os Webhooks permitem que sistemas externos comuniquem eventos ao MedFlow de forma segura, confiável e assíncrona.

Toda integração baseada em eventos deverá seguir as diretrizes deste documento.

---

# Filosofia

Webhooks representam notificações de eventos externos.

O papel do Webhook é apenas receber, validar e encaminhar a informação.

Ele nunca deverá executar lógica pesada diretamente.

---

# Arquitetura

```text
Sistema Externo

↓

Webhook Endpoint

↓

Validação

↓

Autenticação

↓

Persistência

↓

Queue

↓

Worker

↓

Service

↓

Database
```

A resposta ao provedor deve ser rápida.

O processamento acontece posteriormente.

---

# Responsabilidades

O módulo Webhooks é responsável por:

- receber eventos;
- validar origem;
- autenticar requisições;
- validar payload;
- registrar eventos;
- enfileirar processamento;
- responder rapidamente ao provedor.

---

# Fluxo

Exemplo.

```text
Mercado Pago

↓

Webhook

↓

Validar assinatura

↓

Registrar evento

↓

Adicionar Job

↓

Responder HTTP 200

↓

Worker processa pagamento
```

O processamento nunca deve ocorrer durante a requisição.

---

# Endpoints

Cada integração deverá possuir seu próprio endpoint.

Exemplos.

```text
/webhooks/mercadopago

/webhooks/stripe

/webhooks/asaas

/webhooks/openai

/webhooks/resend
```

Nunca compartilhar o mesmo endpoint para provedores diferentes.

---

# Segurança

Todo Webhook deverá validar.

- assinatura digital;
- token secreto;
- origem da requisição;
- formato do payload.

Caso qualquer validação falhe.

A requisição deverá ser rejeitada.

---

# Idempotência

Todo Webhook deverá ser idempotente.

Receber o mesmo evento duas vezes nunca deverá gerar efeitos duplicados.

Exemplo.

```text
Pagamento aprovado

↓

Evento recebido novamente

↓

Ignorar duplicidade
```

---

# Registro

Todo evento recebido deverá ser armazenado.

Informações mínimas.

- provider;
- eventId;
- tipo;
- payload bruto;
- data;
- status;
- tentativas.

Isso facilita auditorias e reprocessamentos.

---

# Processamento

Após validação.

O Webhook deverá criar um Job.

Exemplo.

```text
Webhook

↓

Queue

↓

Worker

↓

Service
```

Nunca executar processamento pesado diretamente.

---

# Status

Estados oficiais.

```text
Received

Validated

Queued

Processing

Completed

Failed

Ignored
```

---

# Falhas

Toda falha deverá registrar.

- provider;
- eventId;
- erro;
- horário;
- payload.

Nunca descartar eventos silenciosamente.

---

# Reprocessamento

Eventos com falha poderão ser reprocessados.

Fluxo.

```text
Evento Falhou

↓

Corrigir problema

↓

Reprocessar

↓

Atualizar Status
```

Sem necessidade de reenviar pelo provedor.

---

# Timeout

O endpoint deverá responder rapidamente.

Tempo recomendado.

Menos de 2 segundos.

Caso o processamento seja longo.

Utilizar Background Jobs.

---

# Logs

Registrar.

- recebimento;
- validação;
- autenticação;
- fila;
- processamento;
- conclusão;
- falha.

---

# Auditoria

Eventos financeiros ou clínicos deverão gerar auditoria.

Exemplos.

- pagamento aprovado;
- pagamento recusado;
- assinatura renovada.

---

# Eventos

Exemplos.

PaymentApproved

PaymentRefunded

SubscriptionRenewed

InvoicePaid

EmailDelivered

AICompleted

BackupFinished

---

# Performance

Boas práticas.

- resposta imediata;
- processamento assíncrono;
- payload mínimo;
- filas;
- retries.

---

# Retry

Caso o processamento falhe.

O sistema deverá utilizar política de retries.

Nunca solicitar manualmente novo envio ao provedor quando não for necessário.

---

# Versionamento

Cada integração deverá suportar evolução.

Mudanças incompatíveis deverão utilizar novas versões de endpoint quando necessário.

---

# Monitoramento

Acompanhar.

- eventos recebidos;
- eventos processados;
- falhas;
- retries;
- tempo médio;
- provedores indisponíveis.

---

# Escalabilidade

A arquitetura deverá permitir.

- milhares de Webhooks por minuto;
- múltiplos provedores;
- múltiplos Workers;
- filas independentes.

Sem alterações estruturais.

---

# Checklist

Toda nova integração deverá responder.

- valida assinatura?
- valida origem?
- é idempotente?
- registra logs?
- gera auditoria?
- utiliza fila?
- suporta retries?

Caso qualquer resposta seja negativa.

A implementação deverá ser revisada.

---

# Declaração Final

Os Webhooks representam a principal porta de entrada para eventos externos no MedFlow.

Sua arquitetura deve garantir segurança, confiabilidade e processamento assíncrono, protegendo a plataforma contra duplicidades, falhas e integrações inconsistentes.

---

# Documentos Relacionados

- Background Jobs
- Payments
- Services
- Logging
- Observability
- Security
- Error Handling
- Audit