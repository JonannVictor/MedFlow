# Subscription

| Campo | Valor |
|-------|--------|
| Documento | Subscription |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Business |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define o modelo de assinaturas do MedFlow.

Seu objetivo é estabelecer como clínicas contratam, utilizam, expandem e gerenciam seus planos dentro da plataforma.

O sistema de assinaturas deve ser flexível, escalável e preparado para acompanhar o crescimento dos clientes.

---

# Visão Geral

O MedFlow será comercializado no modelo **Software as a Service (SaaS)**.

Cada clínica contratará um plano que determinará os recursos disponíveis.

A plataforma deverá permitir evolução de planos sem interrupção da operação.

---

# Filosofia

O cliente não compra funcionalidades.

Ele compra produtividade.

Os planos existem apenas para organizar a oferta comercial.

A experiência da plataforma deve permanecer consistente independentemente do plano contratado.

---

# Estrutura de Assinaturas

Cada assinatura pertence a uma clínica.

```text
Clínica

↓

Assinatura

↓

Plano

↓

Recursos

↓

Limites
```

Uma clínica possui apenas uma assinatura ativa.

---

# Componentes da Assinatura

Cada assinatura deverá possuir:

- Plano contratado
- Status
- Data de início
- Data de renovação
- Ciclo de cobrança
- Valor
- Histórico
- Recursos liberados

---

# Status da Assinatura

Estados oficiais.

## Trial

Período de avaliação.

---

## Active

Assinatura ativa.

Todos os recursos do plano disponíveis.

---

## Past Due

Pagamento pendente.

A plataforma poderá limitar determinadas funcionalidades conforme política comercial.

---

## Suspended

Assinatura suspensa.

A clínica mantém os dados.

Novas operações poderão ser bloqueadas.

---

## Cancelled

Assinatura encerrada.

Os dados permanecem armazenados pelo período definido na política da empresa.

---

## Expired

Assinatura expirada.

Utilizada principalmente para períodos de avaliação.

---

# Ciclos de Cobrança

Inicialmente o MedFlow deverá suportar:

- Mensal
- Trimestral
- Semestral
- Anual

A arquitetura deverá permitir novos ciclos futuramente.

---

# Recursos Controlados

O plano poderá controlar limites como:

- quantidade de profissionais;
- quantidade de usuários administrativos;
- armazenamento;
- recursos de IA;
- integrações;
- telemedicina;
- relatórios avançados;
- API pública.

Esses limites deverão ser configuráveis.

---

# Upgrade

A clínica poderá migrar para um plano superior a qualquer momento.

Regras:

- manter dados existentes;
- manter configurações;
- liberar novos recursos imediatamente após confirmação do pagamento.

---

# Downgrade

A migração para planos inferiores deverá respeitar regras de negócio.

Exemplos:

- impedir downgrade caso existam recursos acima do limite;
- orientar usuário sobre adequações necessárias;
- preservar dados.

---

# Cancelamento

Ao cancelar uma assinatura:

- nenhuma informação deverá ser perdida;
- a clínica poderá exportar seus dados conforme política vigente;
- histórico financeiro deverá permanecer preservado.

---

# Renovação

A renovação deverá ocorrer automaticamente sempre que possível.

Em caso de falha:

- registrar tentativa;
- notificar responsáveis;
- permitir nova tentativa de cobrança.

---

# Trial

O período de avaliação deverá permitir conhecer a plataforma.

Durante o Trial poderão existir limitações previamente definidas.

Ao término:

- converter para assinatura paga;
- ou encerrar acesso conforme política comercial.

---

# Histórico

Toda alteração deverá gerar histórico.

Exemplos:

- criação;
- upgrade;
- downgrade;
- renovação;
- cancelamento;
- reativação.

---

# Integração com Pagamentos

O módulo Subscription depende diretamente do módulo Payments.

Entretanto, as responsabilidades permanecem separadas.

Subscription administra:

- planos;
- recursos;
- acesso.

Payments administra:

- cobranças;
- transações;
- confirmações;
- estornos.

---

# Requisitos

O sistema deverá permitir:

- criar assinatura;
- alterar plano;
- cancelar assinatura;
- reativar assinatura;
- consultar histórico;
- verificar recursos disponíveis;
- validar limites do plano.

---

# Segurança

Nenhuma clínica poderá alterar sua assinatura sem autenticação adequada.

Toda alteração deverá gerar auditoria.

---

# Escalabilidade

O modelo deverá permitir:

- novos planos;
- promoções;
- cupons;
- períodos gratuitos;
- recursos opcionais (Add-ons).

Sem necessidade de alterações estruturais.

---

# Princípios

O sistema de assinaturas deve ser:

- transparente;
- previsível;
- flexível;
- auditável;
- escalável.

---

# Declaração Final

O modelo de assinaturas representa a base comercial do MedFlow.

Sua arquitetura deve permitir evolução constante sem impactar a experiência das clínicas.

A gestão de planos deve ser simples para o cliente e altamente flexível para a plataforma.

---

# Documentos Relacionados

- Billing
- Payments
- Clinics
- Finance
- Multi-Tenant
- Product Requirements