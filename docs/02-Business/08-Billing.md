# Billing

| Campo | Valor |
|-------|--------|
| Documento | Billing |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Business |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define como o MedFlow gerencia todo o processo de faturamento das clínicas.

Billing é responsável pela geração das cobranças da assinatura da plataforma.

É importante diferenciar Billing de Payments.

Billing decide **o que deve ser cobrado**.

Payments é responsável por **processar o pagamento**.

---

# Responsabilidades

O módulo Billing é responsável por:

- geração de cobranças;
- recorrência;
- vencimentos;
- controle de faturas;
- descontos;
- cupons;
- créditos;
- impostos (quando aplicável);
- histórico financeiro da assinatura.

Não é responsabilidade deste módulo processar pagamentos.

---

# Fluxo Geral

```text
Plano

↓

Assinatura

↓

Fatura

↓

Cobrança

↓

Pagamento

↓

Confensação

↓

Renovação
```

---

# Entidades

O domínio Billing é composto pelas seguintes entidades.

## Invoice

Representa uma fatura.

---

## Billing Cycle

Representa um ciclo de cobrança.

---

## Coupon

Representa descontos.

---

## Credit

Representa créditos financeiros.

---

## Tax

Representa impostos incidentes.

---

## Billing Address

Endereço utilizado para faturamento.

---

# Ciclo de Cobrança

Cada assinatura deverá possuir um ciclo.

Exemplos:

- Mensal
- Trimestral
- Semestral
- Anual

Cada ciclo gera automaticamente novas faturas.

---

# Geração de Faturas

Uma nova Invoice deverá ser criada sempre que:

- uma assinatura for criada;
- uma renovação ocorrer;
- houver upgrade;
- houver cobrança avulsa.

---

Cada Invoice deverá conter:

- identificador;
- assinatura;
- clínica;
- valor;
- vencimento;
- status;
- data de emissão;
- itens cobrados.

---

# Status da Invoice

Estados oficiais.

Draft

Fatura criada.

Ainda não enviada.

---

Open

Disponível para pagamento.

---

Paid

Pagamento confirmado.

---

Overdue

Pagamento vencido.

---

Cancelled

Cobrança cancelada.

---

Refunded

Pagamento devolvido.

---

# Itens da Fatura

Uma Invoice poderá conter diversos itens.

Exemplo.

```text
Plano Professional

+

Usuário adicional

+

Armazenamento Extra

+

Módulo Premium

+

Desconto

=

Valor Final
```

---

# Add-ons

O MedFlow deverá permitir recursos adicionais.

Exemplos:

- IA Premium;
- armazenamento extra;
- profissionais adicionais;
- integrações avançadas;
- telemedicina premium.

Esses recursos serão adicionados como itens da fatura.

---

# Cupons

O sistema deverá suportar cupons.

Cada cupom poderá definir:

- percentual;
- valor fixo;
- validade;
- quantidade máxima;
- plano permitido.

---

# Créditos

A clínica poderá possuir créditos.

Exemplos.

- bônus promocionais;
- estornos;
- compensações.

Os créditos deverão ser abatidos antes da cobrança.

---

# Upgrade

Quando ocorrer um upgrade durante o ciclo.

O sistema deverá calcular proporcionalmente.

Exemplo.

```text
Plano Basic

↓

15 dias utilizados

↓

Upgrade Professional

↓

Cobrar apenas diferença proporcional
```

---

# Downgrade

O downgrade deverá entrar em vigor apenas no próximo ciclo.

Isso evita inconsistências financeiras.

---

# Renovação

A renovação deverá ocorrer automaticamente.

Fluxo.

```text
Assinatura

↓

Nova Invoice

↓

Cobrança

↓

Pagamento

↓

Novo ciclo
```

---

# Cobranças Falhadas

Caso uma cobrança falhe.

O sistema deverá:

- registrar tentativa;
- tentar novamente conforme política;
- notificar responsáveis;
- atualizar status da assinatura quando necessário.

---

# Histórico

Toda movimentação deverá gerar histórico.

Exemplos.

- criação;
- alteração;
- desconto;
- renovação;
- cancelamento;
- estorno.

---

# Auditoria

Toda alteração financeira deverá registrar.

- usuário;
- data;
- horário;
- operação;
- valores antigos;
- valores novos.

---

# Requisitos Funcionais

O sistema deverá permitir.

- gerar invoices;
- consultar invoices;
- cancelar invoices;
- aplicar cupons;
- aplicar créditos;
- visualizar histórico;
- recalcular cobranças.

---

# Requisitos Não Funcionais

Billing deverá ser.

- consistente;
- auditável;
- escalável;
- seguro;
- independente do gateway de pagamento.

---

# Integrações

Billing poderá integrar-se com.

- Mercado Pago;
- Stripe;
- Asaas;
- Pagar.me;
- gateways futuros.

A arquitetura nunca deverá depender de um único provedor.

---

# Eventos

Eventos oficiais.

InvoiceCreated

InvoiceUpdated

InvoicePaid

InvoiceCancelled

InvoiceRefunded

CouponApplied

CreditApplied

SubscriptionRenewed

---

# Princípios

Billing nunca deverá.

- perder histórico;
- recalcular valores antigos;
- modificar faturas pagas;
- excluir registros financeiros.

Toda operação deve preservar rastreabilidade.

---

# Escalabilidade

O módulo deverá permitir futuramente.

- múltiplas moedas;
- múltiplos países;
- impostos regionais;
- faturamento internacional;
- cobrança por uso (Usage Based Billing);
- múltiplos gateways.

Sem necessidade de reestruturação.

---

# Declaração Final

Billing representa a fonte oficial de faturamento do MedFlow.

Sua principal responsabilidade é garantir que todas as cobranças sejam geradas de forma correta, transparente e auditável.

A separação entre Billing e Payments é obrigatória e representa um dos pilares da arquitetura financeira da plataforma.

---

# Documentos Relacionados

- Subscription
- Payments
- Finance
- Clinics
- Product Requirements
- System Architecture
- Audit
```