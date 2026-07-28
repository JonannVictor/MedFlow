# Módulo de Finance

| Campo | Valor |
|-------|--------|
| Documento | Finance |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Modules |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# 1. Visão Geral

O módulo **Finance** é responsável por representar toda a camada financeira do MedFlow.

Seu objetivo não é apenas registrar pagamentos.

Ele deverá representar o fluxo financeiro completo de uma organização de saúde.

O domínio poderá envolver:

```text
Invoices

Payments

Receivables

Refunds

Adjustments

Billing

Taxes

Discounts

Subscriptions

Financial Reports

Cash Flow

Audit
```

Este módulo deverá fornecer uma fonte única, consistente e auditável para todas as informações financeiras da plataforma.

---

# 2. Princípio Fundamental

```text
Finance

≠

Payment Gateway
```

Gateways apenas processam pagamentos.

O domínio financeiro pertence ao MedFlow.

Mesmo que um gateway seja removido ou substituído, o histórico financeiro deverá permanecer íntegro.

---

# 3. Objetivo

O módulo deverá responder perguntas como:

```text
Quanto a clínica faturou?

Quais pagamentos estão pendentes?

Qual paciente possui débitos?

Qual foi a receita deste mês?

Quanto foi recebido via Pix?

Existe algum estorno?

Qual profissional gerou maior receita?

Quanto ainda existe para receber?

Quais lançamentos foram alterados?

Quem realizou alterações financeiras?
```

---

# 4. Source of Truth

Finance deverá ser o Source of Truth para:

```text
Receivables

Financial Transactions

Invoices

Payment Status

Refund History

Financial Audit
```

Outros módulos poderão consumir essas informações, mas não deverão manter cópias independentes.

---

# 5. Escopo

O módulo poderá ser responsável por:

- Cobranças.
- Recebimentos.
- Contas a receber.
- Pagamentos.
- Parcelamentos.
- Descontos.
- Juros.
- Multas.
- Estornos.
- Conciliação.
- Fluxo de caixa.
- Relatórios financeiros.
- Histórico financeiro.
- Eventos financeiros.
- Auditoria.

---

# 6. Fora do Escopo

Finance não deverá ser responsável por:

- Processamento do cartão.
- Autenticação.
- Gestão completa de pacientes.
- Agenda.
- Prontuário.
- Exames.
- IA.
- Armazenamento de arquivos.

---

# 7. Bounded Context

```text
Appointments
        │
        ▼
     Finance
        │
 ┌──────┼───────────────┐
 ▼      ▼               ▼
Patients Payments     Reports
 │
 ▼
Notifications
```

Finance conhecerá apenas as informações necessárias dos demais módulos.

---

# 8. Entidades Principais

O domínio poderá evoluir para:

```text
Invoice

Payment

Transaction

Receivable

Refund

Installment

PaymentMethod

CashFlowEntry

FinancialAdjustment
```

---

# 9. Invoice

Invoice representa uma cobrança.

Ela poderá existir antes do pagamento.

---

# 10. Invoice ≠ Payment

```text
Invoice

↓

Waiting Payment

↓

Payment

↓

Paid
```

Uma Invoice poderá existir mesmo sem pagamento.

---

# 11. Receivable

Receivable representa um valor que ainda deverá ser recebido.

---

# 12. Payment

Payment representa o recebimento financeiro.

---

# 13. Transaction

Transaction representa qualquer movimentação financeira.

Exemplo:

```text
Payment

Refund

Adjustment

Fee

Transfer
```

---

# 14. Refund

Refund representa devolução parcial ou total.

---

# 15. Adjustment

Adjustment representa correção financeira autorizada.

Nunca deverá apagar histórico anterior.

---

# 16. Identity

Todas as entidades financeiras deverão possuir IDs próprios.

Jamais utilizar:

```text
Patient Name

Appointment ID

Invoice Number
```

como identidade primária.

---

# 17. Tenant Ownership

Toda entidade financeira deverá possuir:

```text
organizationId
```

---

# 18. Financial Integrity

Nunca deverá existir movimentação financeira sem organização responsável.

---

# 19. Relação com Pacientes

Finance referencia:

```text
patientId
```

Mas não é responsável pelo cadastro do paciente.

---

# 20. Relação com Appointments

Um Appointment poderá gerar uma Invoice.

Mas:

```text
Appointment

≠

Invoice
```

---

# 21. Appointment Cancellation

Cancelar um Appointment não deverá automaticamente cancelar uma cobrança.

A política financeira deverá definir esse comportamento.

---

# 22. Invoice Lifecycle

Possível fluxo:

```text
Draft

↓

Issued

↓

Pending

↓

Paid

↓

Refunded

↓

Archived
```

---

# 23. Payment Lifecycle

```text
Created

↓

Pending

↓

Authorized

↓

Captured

↓

Completed
```

ou

```text
Failed

Cancelled

Refunded
```

---

# 24. Financial Status

Status possíveis:

```text
pending

paid

cancelled

failed

refunded

expired
```

---

# 25. Explicit Commands

Preferir:

```text
issueInvoice()

receivePayment()

refundPayment()

cancelInvoice()
```

em vez de alterar status manualmente.

---

# 26. Monetary Values

Valores monetários deverão utilizar representação apropriada para evitar erros de precisão.

Nunca utilizar tipos inadequados para cálculos financeiros.

---

# 27. Currency

O domínio deverá suportar moedas explicitamente.

Mesmo que inicialmente opere apenas em:

```text
BRL
```

a arquitetura não deverá assumir moeda fixa.

---

# 28. Taxes

Tributos poderão ser representados separadamente.

Nunca incorporar impostos implicitamente sem rastreabilidade.

---

# 29. Discounts

Descontos deverão registrar:

```text
Reason

Actor

Value

Type
```

---

# 30. Discount Types

Possíveis:

```text
Percentage

Fixed Amount
```

---

# 31. Fees

Taxas cobradas por gateways poderão ser registradas separadamente.

---

# 32. Gateway Independence

```text
Finance

owns

Financial Truth
```

```text
Gateway

owns

Payment Processing
```

---

# 33. Multiple Gateways

A arquitetura deverá permitir múltiplos gateways.

```text
Pix

Card

Bank Transfer

Future Providers
```

---

# 34. Payment Method

Possíveis métodos:

```text
Pix

Credit Card

Debit Card

Cash

Bank Transfer
```

---

# 35. Payment Provider

Provider deverá ser armazenado separadamente do método.

Exemplo:

```text
Method: Pix

Provider: Mercado Pago
```

---

# 36. External Reference

Pagamentos externos deverão possuir:

```text
provider

externalPaymentId
```

---

# 37. External ID

Jamais utilizar ID do gateway como ID interno.

---

# 38. Idempotency

Integrações deverão suportar:

```text
Retry

Duplicate Webhook

Timeout
```

sem criar pagamentos duplicados.

---

# 39. Webhooks

Eventos externos deverão ser autenticados.

---

# 40. Financial History

Todo evento financeiro relevante deverá permanecer preservado.

Nunca apagar histórico.

---

# 41. Audit

Finance deverá possuir auditoria robusta.

Registrar:

```text
Actor

Action

Timestamp

Before

After
```

quando apropriado.

---

# 42. Ledger Principle

Alterações deverão gerar novos registros sempre que possível.

Evitar sobrescrever movimentações históricas.

---

# 43. Reports

Finance fornecerá dados para:

```text
Revenue

Expenses

Cash Flow

Receivables

Refunds
```

---

# 44. Reports ≠ Finance

Reports apenas consome dados.

Finance continua sendo Source of Truth.

---

# 45. Notifications

Finance poderá emitir eventos como:

```text
Payment Received

Invoice Due

Payment Failed

Refund Completed
```

---

# 46. Notification Boundary

Finance informa:

```text
What happened.
```

Notifications decide:

```text
How to communicate.
```

---

# 47. Security

Dados financeiros possuem alto nível de sensibilidade.

---

# 48. Permissions

Possíveis permissões:

```text
finance.read

finance.create

finance.update

finance.refund

finance.reports

finance.audit
```

---

# 49. Least Privilege

Recepção poderá visualizar:

```text
Pending Invoice
```

mas não necessariamente:

```text
Financial Reports

Refund History

Audit
```

---

# 50. AI Integration

AI poderá auxiliar em:

```text
Financial Summary

Revenue Trends

Forecasts

Anomaly Detection
```

Nunca deverá alterar dados financeiros automaticamente.

---

# 51. AI Boundary

```text
AI Suggestion

≠

Financial Record
```

---

# 52. Observability

Finance deverá possuir:

```text
Logs

Metrics

Traces

Audit
```

---

# 53. Logs

Nunca registrar:

```text
Card Numbers

Sensitive Financial Data

Tokens
```

---

# 54. Metrics

Exemplos:

```text
Daily Revenue

Refund Rate

Pending Receivables

Average Payment Time
```

---

# 55. Performance

Consultas financeiras deverão utilizar índices apropriados.

---

# 56. Consistência

Operações financeiras críticas deverão utilizar transações.

Não poderá existir:

```text
Invoice criada

↓

Pagamento registrado

↓

Evento perdido
```

---

# 57. Eventos

Possíveis:

```text
invoice.created

invoice.paid

invoice.cancelled

payment.completed

payment.failed

payment.refunded
```

---

# 58. Event Payload

Payload mínimo:

```json
{
  "event": "payment.completed",
  "paymentId": "...",
  "organizationId": "...",
  "occurredAt": "..."
}
```

---

# 59. Conciliação

Integrações externas poderão exigir reconciliação financeira.

---

# 60. Reconciliation

Sistema deverá identificar diferenças entre:

```text
Internal Records

External Gateway
```

---

# 61. Error Model

Possíveis códigos:

```text
PAYMENT_NOT_FOUND

PAYMENT_ALREADY_REFUNDED

INVOICE_ALREADY_PAID

INVALID_AMOUNT

INVALID_CURRENCY

GATEWAY_ERROR

PAYMENT_DUPLICATED

UNAUTHORIZED_FINANCIAL_ACTION
```

---

# 62. Testing

Cobrir:

```text
Payments

Refunds

Discounts

Taxes

Transactions

Audit

Permissions

Concurrency
```

---

# 63. Domain Invariants

```text
Every financial entity belongs to one Organization.

Invoice is different from Payment.

Payment never silently disappears.

Refund preserves history.

Financial values maintain precision.

Gateway IDs are not internal IDs.

Cross-tenant access is forbidden.

Audit cannot be disabled for critical actions.
```

---

# 64. Decisões Arquiteturais e de Produto

## ADR-911

Finance será o Source of Truth financeiro do MedFlow.

---

## ADR-912

Invoice e Payment permanecerão entidades independentes.

---

## ADR-913

Todo registro financeiro possuirá Organization Ownership explícito.

---

## ADR-914

Histórico financeiro nunca será apagado.

---

## ADR-915

Refunds preservarão todas as versões anteriores.

---

## ADR-916

Finance será independente de Payment Gateway.

---

## ADR-917

Integrações financeiras deverão ser idempotentes.

---

## ADR-918

Eventos financeiros utilizarão payload mínimo.

---

## ADR-919

AI nunca alterará registros financeiros automaticamente.

---

## ADR-920

Dados financeiros seguirão princípios de auditabilidade, integridade e rastreabilidade.

---

# 65. Relação com Outros Módulos

```text
Appointments
      │
      ▼
   Finance
      │
 ┌────┼─────────────┐
 ▼    ▼             ▼
Patients Payments Reports
 │
 ▼
Notifications

Finance
   │
   └────────► AI
```

---

# 66. Checklist — Criar Invoice

```text
[ ] Organization válida
[ ] Patient válido
[ ] Valor válido
[ ] Moeda válida
[ ] Auditoria criada
```

---

# 67. Checklist — Registrar Pagamento

```text
[ ] Invoice válida
[ ] Valor correto
[ ] Método válido
[ ] Gateway validado
[ ] Evento emitido
[ ] Auditoria registrada
```

---

# 68. Checklist — Refund

```text
[ ] Pagamento existente
[ ] Não reembolsado anteriormente
[ ] Permissão válida
[ ] Motivo informado
[ ] Auditoria criada
```

---

# 69. Checklist — Code Review

```text
[ ] Sem acesso cross-tenant
[ ] Precisão monetária preservada
[ ] Sem sobrescrever histórico
[ ] Eventos emitidos
[ ] Auditoria presente
[ ] Testes atualizados
```

---

# 70. Definition of Done

Uma funcionalidade financeira somente estará concluída quando preservar:

```text
Financial Integrity

+

Auditability

+

Precision

+

Authorization

+

History

+

Observability

+

Documentation
```

---

# 71. Failure Scenarios

A arquitetura deverá considerar:

```text
Gateway envia webhook duplicado.

Pagamento chega após timeout.

Refund parcial.

Refund total.

Falha durante transação.

Gateway indisponível.

Mudança de moeda.

Pagamento duplicado.
```

Todos esses cenários deverão possuir comportamento previsível.

---

# 72. Anti-Patterns

Evitar:

```text
Payment = Invoice.
```

```text
Apagar histórico financeiro.
```

```text
Usar float para dinheiro.
```

```text
Sobrescrever transações.
```

```text
Confiar apenas no gateway.
```

---

# 73. Future Evolution

Possível evolução:

```text
Invoices

↓

Payments

↓

Refunds

↓

Cash Flow

↓

Subscriptions

↓

Recurring Billing

↓

Forecasts

↓

Financial AI
```

---

# 74. Para Futuros Desenvolvedores

Antes de alterar qualquer funcionalidade financeira pergunte:

```text
Estamos alterando

o histórico financeiro

ou apenas

adicionando um novo evento?
```

Se a resposta for alterar o histórico, provavelmente a implementação está incorreta.

---

# 75. Invariante Final

Independentemente da evolução do sistema:

```text
Money can change hands.

History cannot change.
```

---

# 76. Considerações Finais

O módulo Finance deverá ser projetado para sobreviver à troca de gateways, mudanças regulatórias e crescimento da plataforma.

A verdade financeira deverá permanecer dentro do MedFlow.

Todos os demais componentes deverão consumir essas informações sem comprometer:

```text
Integridade

Rastreabilidade

Precisão

Auditoria
```

Esse deverá ser o princípio permanente do módulo `Finance`.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação da documentação oficial do módulo Finance, definindo arquitetura financeira, invoices, payments, refunds, auditoria, integrações, segurança, observabilidade e ADR-911 a ADR-920 | Equipe MedFlow |