# Logging

| Campo | Valor |
|-------|--------|
| Documento | Logging |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Architecture |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define a arquitetura oficial de Logging do MedFlow.

O sistema de logs é responsável por registrar eventos relevantes da plataforma, permitindo monitoramento, auditoria, investigação de problemas e análise operacional.

Logs não substituem auditoria.

Logs não substituem métricas.

Logs representam o histórico técnico da execução do sistema.

---

# Filosofia

Todo software em produção falha.

O objetivo do Logging é permitir identificar:

- o que aconteceu;
- quando aconteceu;
- onde aconteceu;
- quem executou a ação;
- qual foi a consequência.

Sem logs adequados, problemas tornam-se praticamente impossíveis de diagnosticar.

---

# Objetivos

O sistema de Logging deve permitir:

- identificar erros rapidamente;
- investigar incidentes;
- monitorar comportamento do sistema;
- facilitar suporte;
- auxiliar auditorias;
- acompanhar integrações;
- identificar gargalos.

---

# Princípios

Todo log deve ser:

- estruturado;
- consistente;
- pesquisável;
- seguro;
- útil.

Nunca registrar informações apenas "por registrar".

Todo log deve possuir propósito.

---

# Arquitetura

```text
Application

↓

Logger Service

↓

Structured Log

↓

Log Provider

↓

Dashboard / Storage
```

Nenhum módulo deverá gravar logs diretamente.

Todos utilizarão o Logger Service.

---

# Níveis Oficiais

O MedFlow utilizará os seguintes níveis.

---

## TRACE

Informações extremamente detalhadas.

Utilizado apenas durante desenvolvimento.

---

## DEBUG

Informações úteis para depuração.

Nunca habilitado permanentemente em produção.

---

## INFO

Eventos normais do sistema.

Exemplos:

- usuário autenticado;
- consulta criada;
- pagamento confirmado.

---

## WARN

Situações inesperadas que não interrompem a operação.

Exemplos:

- tentativa repetida;
- recurso inexistente;
- integração indisponível temporariamente.

---

## ERROR

Falhas que impediram determinada operação.

Exemplos:

- erro de banco;
- erro de integração;
- erro de processamento.

---

## FATAL

Falhas críticas.

Exemplos:

- sistema indisponível;
- perda de conexão essencial;
- falha de inicialização.

---

# Estrutura do Log

Todo log deverá possuir.

- timestamp;
- nível;
- serviço;
- módulo;
- operação;
- tenant;
- usuário (quando existir);
- requestId;
- mensagem.

Opcionalmente.

- stack trace;
- duração;
- contexto.

---

# Exemplo

```json
{
  "level": "INFO",
  "module": "appointments",
  "operation": "createAppointment",
  "tenantId": "clinic_001",
  "userId": "usr_103",
  "requestId": "req_98AF2",
  "message": "Appointment created successfully",
  "timestamp": "2026-07-12T15:30:20Z"
}
```

---

# Request ID

Toda requisição deverá possuir um identificador único.

Esse identificador acompanhará:

- API;
- Services;
- Repositories;
- Workers;
- Integrações.

Facilitando rastreamento completo.

---

# Correlação

Fluxo.

```text
Request

↓

Request ID

↓

Service

↓

Repository

↓

Notification

↓

Background Job

↓

Logs relacionados
```

---

# O Que Registrar

Registrar.

- autenticação;
- falhas;
- integrações;
- eventos importantes;
- processamento;
- filas;
- inicialização;
- encerramento.

---

# O Que Nunca Registrar

Nunca registrar.

- senhas;
- tokens;
- códigos MFA;
- dados clínicos completos;
- cartões;
- informações pessoais desnecessárias.

Sempre respeitar a LGPD.

---

# Logs por Módulo

Todos os módulos deverão produzir logs.

Exemplo.

Authentication

↓

Login realizado.

↓

Sessão criada.

↓

Login falhou.

---

Appointments

↓

Consulta criada.

↓

Consulta cancelada.

↓

Consulta concluída.

---

Payments

↓

Cobrança criada.

↓

Pagamento aprovado.

↓

Pagamento recusado.

---

AI

↓

Processamento iniciado.

↓

Resumo concluído.

↓

Falha na IA.

---

# Integrações

Toda integração deverá registrar.

- requisição;
- resposta;
- tempo;
- falhas;
- retries.

Nunca registrar dados sensíveis enviados.

---

# Performance

Operações lentas deverão gerar WARN.

Exemplo.

Consultas acima de 500ms.

↓

WARN

Consultas acima de 2 segundos.

↓

ERROR

Esses valores poderão ser ajustados futuramente.

---

# Background Jobs

Toda execução deverá registrar.

- início;
- conclusão;
- duração;
- falhas;
- retries.

---

# Tratamento de Erros

Toda exceção não tratada deverá gerar.

- ERROR;
- stack trace;
- requestId;
- contexto.

Nunca ocultar erros importantes.

---

# Retenção

Os logs deverão possuir política de retenção.

Exemplo.

TRACE

7 dias

---

DEBUG

15 dias

---

INFO

90 dias

---

ERROR

180 dias

---

FATAL

Retenção estendida conforme política operacional.

Os prazos poderão ser ajustados.

---

# Pesquisa

O sistema de logs deverá permitir filtros por.

- tenant;
- usuário;
- módulo;
- requestId;
- nível;
- período.

---

# Observabilidade

Logs fazem parte da estratégia de observabilidade.

Eles trabalham em conjunto com.

- métricas;
- traces;
- auditoria;
- monitoramento.

Cada ferramenta possui responsabilidade própria.

---

# Eventos

Exemplos.

ApplicationStarted

ApplicationStopped

UserLoggedIn

AppointmentCreated

PaymentProcessed

NotificationSent

WorkerFailed

AICompleted

DatabaseError

ExternalServiceTimeout

---

# Escalabilidade

O sistema deverá suportar.

- milhões de registros;
- múltiplas instâncias;
- processamento distribuído;
- pesquisa rápida;
- armazenamento centralizado.

---

# Checklist

Todo novo módulo deverá responder.

- gera logs?
- utiliza Logger Service?
- registra erros?
- respeita LGPD?
- utiliza Request ID?
- possui contexto suficiente?

---

# Declaração Final

O sistema de Logging representa a memória técnica do MedFlow.

Uma plataforma escalável depende de logs consistentes para identificar problemas, acompanhar operações e garantir alta confiabilidade.

Todo desenvolvimento deverá considerar Logging como parte obrigatória da implementação.

---

# Documentos Relacionados

- System Architecture
- Observability
- Audit
- Multi-Tenant
- Security
- Background Jobs
- Error Handling
- LGPD