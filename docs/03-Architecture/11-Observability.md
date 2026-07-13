# Observability

| Campo | Valor |
|-------|--------|
| Documento | Observability |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Architecture |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define a arquitetura oficial de Observabilidade do MedFlow.

O objetivo é permitir que qualquer problema na plataforma possa ser identificado, entendido e resolvido rapidamente.

Observabilidade não significa apenas monitorar servidores.

Ela permite compreender o comportamento interno do sistema através de métricas, logs, traces e eventos.

---

# Definição

Um sistema observável permite responder perguntas como:

- O sistema está saudável?
- Onde ocorreu o problema?
- Qual módulo falhou?
- Qual usuário foi afetado?
- Quanto tempo uma operação levou?
- Qual integração apresentou erro?
- O problema é recorrente?

Sem necessidade de reproduzir manualmente o erro.

---

# Os Três Pilares

A observabilidade do MedFlow será baseada em três pilares.

```text
Observability

├── Metrics

├── Logs

└── Traces
```

Esses pilares trabalham juntos.

Nenhum substitui o outro.

---

# Métricas

As métricas respondem.

"O sistema está saudável?"

Exemplos.

- CPU
- Memória
- Requests por segundo
- Latência
- Erros por minuto
- Uso de banco
- Uso de Storage

---

# Logs

Os logs respondem.

"O que aconteceu?"

Exemplos.

- Login realizado
- Consulta criada
- Pagamento aprovado
- Erro interno
- Falha de integração

Os padrões oficiais encontram-se em:

Logging.md

---

# Traces

Os traces respondem.

"Como a requisição percorreu o sistema?"

Exemplo.

```text
Request

↓

Authentication

↓

Authorization

↓

Appointment Service

↓

Patient Service

↓

Repository

↓

Database

↓

Resposta
```

Cada etapa deverá registrar sua duração.

---

# Arquitetura

```text
Application

↓

Telemetry

↓

Metrics

↓

Logs

↓

Traces

↓

Observability Platform
```

---

# Objetivos

A arquitetura deverá permitir.

- identificar falhas rapidamente;
- acompanhar desempenho;
- localizar gargalos;
- analisar comportamento;
- facilitar suporte;
- reduzir tempo de resolução.

---

# Indicadores

Os principais indicadores deverão ser acompanhados continuamente.

## Sistema

- disponibilidade;
- tempo de resposta;
- consumo de CPU;
- memória;
- disco;
- rede.

---

## Banco

- consultas por segundo;
- tempo médio das queries;
- conexões;
- locks;
- falhas.

---

## API

- requests por minuto;
- tempo médio;
- erros;
- autenticações;
- timeouts.

---

## Background Jobs

- filas;
- tempo médio;
- jobs pendentes;
- falhas;
- retries.

---

## IA

- requisições;
- tempo de processamento;
- falhas;
- custo estimado;
- utilização.

---

## Notificações

- enviadas;
- entregues;
- falhas;
- retries.

---

# Request Tracing

Toda requisição deverá possuir um Trace ID.

Fluxo.

```text
Cliente

↓

Trace ID

↓

API

↓

Services

↓

Repositories

↓

Database

↓

Workers

↓

Resposta
```

Esse identificador permitirá acompanhar toda a execução.

---

# Dashboards

O sistema deverá possuir dashboards para.

## Infraestrutura

- CPU
- RAM
- Disco
- Rede

---

## Aplicação

- requests;
- erros;
- usuários ativos;
- sessões.

---

## Banco

- consultas;
- conexões;
- índices;
- performance.

---

## Produto

- consultas realizadas;
- pagamentos;
- pacientes;
- profissionais;
- IA.

---

# Alertas

O sistema deverá possuir alertas automáticos.

Exemplos.

API indisponível.

↓

Alerta.

---

Banco indisponível.

↓

Alerta.

---

Fila acumulando.

↓

Alerta.

---

Uso elevado de CPU.

↓

Alerta.

---

Taxa elevada de erros.

↓

Alerta.

---

# SLO

O MedFlow adotará Service Level Objectives.

Exemplos iniciais.

Disponibilidade.

99,9%

---

Tempo médio da API.

< 300 ms

---

Erro das APIs.

< 1%

---

Fila.

< 30 segundos

Esses valores poderão evoluir.

---

# Incidentes

Todo incidente deverá registrar.

- início;
- fim;
- impacto;
- causa;
- solução;
- responsáveis;
- ações preventivas.

---

# Ferramentas

A arquitetura deverá permitir integração com.

- Grafana
- Prometheus
- OpenTelemetry
- Sentry
- Better Stack
- Datadog
- New Relic

A implementação deverá permanecer independente do fornecedor.

---

# Multi-Tenant

Toda observabilidade deverá respeitar isolamento entre clínicas.

Exemplos.

Administrador da clínica.

↓

Visualiza apenas métricas da própria clínica.

---

Equipe MedFlow.

↓

Visualiza métricas globais da plataforma.

---

# Performance

Toda operação acima dos limites deverá gerar eventos.

Exemplos.

Request > 500 ms

↓

Warning.

---

Request > 2 s

↓

Critical.

---

# Eventos

Exemplos.

ApplicationStarted

HighMemoryUsage

DatabaseSlowQuery

ExternalServiceTimeout

JobFailed

WorkerRestarted

HighCPUUsage

StorageUnavailable

---

# Integração com Logging

Toda métrica deverá poder ser relacionada a um Log.

Toda Trace deverá possuir.

- Trace ID
- Request ID

Isso permitirá navegação completa entre eventos.

---

# Escalabilidade

A arquitetura deverá suportar.

- milhões de métricas;
- milhares de traces por minuto;
- múltiplas instâncias;
- observabilidade distribuída.

Sem alterações estruturais.

---

# Checklist

Toda nova funcionalidade deverá responder.

- gera métricas?
- gera logs?
- gera traces?
- possui alertas?
- possui dashboard?
- respeita Tenant?

Caso qualquer resposta seja negativa.

A implementação deverá ser revisada.

---

# Declaração Final

Observabilidade é um dos pilares da confiabilidade do MedFlow.

Uma plataforma de missão crítica precisa fornecer informações suficientes para que qualquer falha possa ser detectada, analisada e resolvida rapidamente.

Toda funcionalidade desenvolvida deverá contribuir para tornar o sistema mais observável.

---

# Documentos Relacionados

- Logging
- Performance
- System Architecture
- Error Handling
- Background Jobs
- Audit
- Security