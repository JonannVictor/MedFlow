# Engenharia de Prompts (Prompt Engineering)

| Campo | Valor |
|-------|--------|
| Documento | Prompt Engineering |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | AI |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

A Engenharia de Prompts do MedFlow define os padrões oficiais para construção, organização, versionamento, validação e evolução de todos os prompts utilizados pela plataforma.

Os prompts representam uma camada crítica da arquitetura de Inteligência Artificial e devem ser tratados como ativos de software, seguindo os mesmos princípios de qualidade aplicados ao código-fonte.

Nenhum prompt poderá ser criado diretamente na aplicação sem seguir as diretrizes estabelecidas neste documento.

---

# Objetivos

A Engenharia de Prompts possui os seguintes objetivos:

- Padronizar prompts.
- Facilitar manutenção.
- Garantir previsibilidade.
- Melhorar qualidade das respostas.
- Permitir auditoria.
- Reduzir regressões.
- Facilitar testes.
- Possibilitar versionamento.

---

# Filosofia

Todo prompt deverá seguir cinco princípios.

## Clareza

As instruções devem ser objetivas.

Evitar ambiguidades.

---

## Contexto

O modelo deve receber apenas o contexto necessário.

Contexto excessivo aumenta custo e reduz qualidade.

---

## Modularidade

Prompts deverão ser compostos por blocos reutilizáveis.

Nunca duplicar instruções.

---

## Segurança

Nenhum prompt poderá expor informações sensíveis desnecessariamente.

---

## Evolução

Todo prompt deverá poder evoluir sem quebrar funcionalidades existentes.

---

# Arquitetura

Todo prompt deverá ser construído pela seguinte estrutura.

```text
Prompt

├── Metadata
├── System Prompt
├── Context
├── Instructions
├── Rules
├── Examples
├── Output Schema
└── Validation
```

---

# Metadata

Todo prompt deverá possuir metadados.

Campos obrigatórios:

- Nome.
- Identificador.
- Versão.
- Responsável.
- Agente.
- Skill.
- Data de criação.
- Última alteração.

Exemplo:

```yaml
id: clinical-summary

version: 1.4.2

agent: Clinical Agent

skill: SOAP Summary
```

---

# System Prompt

Define o comportamento permanente do modelo.

Exemplos:

- Papel.
- Especialidade.
- Limitações.
- Regras.
- Linguagem.

Nunca inserir dados específicos do paciente nesta camada.

---

# Context

Representa os dados enviados durante a execução.

Exemplos:

- Paciente.
- Consulta.
- Exames.
- Histórico.
- Preferências.
- Configuração da clínica.

O Context Manager será responsável por montar esse bloco.

---

# Instructions

Define exatamente o que deve ser executado.

Exemplo:

```text
Organize o texto em formato SOAP.

Não invente informações.

Mantenha linguagem técnica.

Preserve termos médicos.
```

---

# Rules

Toda tarefa poderá possuir regras específicas.

Exemplos:

- Nunca diagnosticar.
- Nunca prescrever.
- Nunca omitir incertezas.
- Nunca criar informações inexistentes.

---

# Few-shot Examples

Sempre que possível utilizar exemplos.

Estrutura:

```text
Entrada

↓

Resposta Esperada
```

Os exemplos deverão representar casos reais anonimizados.

---

# Output Schema

Toda resposta deverá seguir um formato conhecido.

Exemplos:

JSON

Markdown

Texto estruturado

Tabela

Lista

SOAP

FHIR

Nunca retornar formatos imprevisíveis.

---

# Prompt Registry

Todos os prompts deverão ser registrados.

Estrutura recomendada:

```text
prompts/

├── clinical/
├── administrative/
├── financial/
├── assistant/
├── reports/
├── analytics/
└── shared/
```

Nenhum prompt deverá existir apenas no código.

---

# Versionamento

Todo prompt deverá possuir versionamento semântico.

Formato:

```text
Major.Minor.Patch
```

Exemplo:

```text
2.1.4
```

---

# Prompt Templates

Sempre utilizar templates reutilizáveis.

Exemplo:

```text
Medical Prompt

↓

Context

↓

Rules

↓

Examples

↓

Output
```

---

# Prompt Builder

A construção dos prompts deverá ocorrer exclusivamente pelo Prompt Engine.

Fluxo:

```text
Template

↓

Context

↓

Rules

↓

Examples

↓

Prompt Final
```

Nenhum módulo poderá montar prompts manualmente.

---

# Prompt Validation

Antes da execução verificar:

- Contexto.
- Permissões.
- Dados obrigatórios.
- Limite de Tokens.
- Estrutura.
- Output esperado.

---

# Prompt Testing

Todo prompt deverá possuir testes.

Tipos:

- Unit Test.
- Snapshot Test.
- Regression Test.
- Evaluation Test.
- Hallucination Test.

---

# Prompt Evaluation

Métricas recomendadas:

- Precisão.
- Consistência.
- Tempo de resposta.
- Tokens.
- Custo.
- Taxa de erro.
- Aprovação dos usuários.

---

# Prompt Security

Todo prompt deverá proteger contra:

- Prompt Injection.
- Jailbreak.
- Context Leakage.
- Prompt Override.
- Data Exfiltration.

Toda entrada deverá ser sanitizada.

---

# Prompt Cache

Prompts idênticos poderão reutilizar respostas quando permitido.

Nunca utilizar cache para informações clínicas personalizadas.

---

# Observabilidade

Registrar:

- Prompt utilizado.
- Versão.
- Modelo.
- Tokens.
- Tempo.
- Custos.
- Ferramentas executadas.
- Resultado.

---

# Escalabilidade

A arquitetura deverá suportar:

- Milhares de prompts.
- Múltiplos modelos.
- Múltiplos idiomas.
- Novos agentes.
- Novas Skills.

---

# Estrutura Oficial

```text
Prompt

↓

Prompt Registry

↓

Prompt Engine

↓

Model Router

↓

LLM

↓

Validator

↓

Response Pipeline
```

---

# Anti-Padrões

São considerados Anti-Padrões:

- Prompt hardcoded.
- Prompt sem versão.
- Prompt sem testes.
- Prompt gigante.
- Prompt duplicado.
- Dados sensíveis desnecessários.
- Contexto excessivo.
- Output não estruturado.

---

# Decisões Arquiteturais

## ADR-078

Todo prompt deverá ser versionado.

---

## ADR-079

O Prompt Engine será o único responsável pela montagem de prompts.

---

## ADR-080

Nenhum prompt poderá permanecer hardcoded na aplicação.

---

## ADR-081

Todos os prompts deverão possuir testes automatizados.

---

## ADR-082

Todo prompt deverá possuir documentação e responsável definido.

---

# Checklist de Conformidade

Antes da aprovação verificar:

| Item | Obrigatório |
|-------|-------------|
| Prompt registrado | ✅ |
| Versionamento | ✅ |
| Template oficial | ✅ |
| Prompt testado | ✅ |
| Segurança validada | ✅ |
| Output estruturado | ✅ |
| Observabilidade | ✅ |
| Documentação atualizada | ✅ |

---

# Boas Práticas

- Reutilizar templates.
- Versionar alterações.
- Reduzir contexto desnecessário.
- Utilizar exemplos reais anonimizados.
- Medir desempenho continuamente.
- Escrever prompts simples.
- Priorizar respostas estruturadas.
- Revisar periodicamente os prompts em produção.

---

# Considerações Finais

No MedFlow, prompts são tratados como componentes arquiteturais e não como simples textos enviados a modelos de IA. A adoção de um Prompt Registry, versionamento semântico, testes automatizados e observabilidade garante previsibilidade, segurança e evolução contínua da plataforma.

Este documento estabelece o padrão oficial para desenvolvimento e manutenção de todos os prompts utilizados pela Inteligência Artificial do MedFlow.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação da especificação oficial de Prompt Engineering | Equipe MedFlow |