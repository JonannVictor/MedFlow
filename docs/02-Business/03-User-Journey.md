# User Journey

| Campo | Valor |
|-------|--------|
| Documento | User Journey |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Business |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define a jornada completa de cada persona dentro do MedFlow.

O objetivo é garantir que toda experiência do usuário seja consistente, previsível e intuitiva.

Toda nova funcionalidade deve integrar-se naturalmente às jornadas descritas neste documento.

---

# Introdução

Uma funcionalidade isolada possui pouco valor.

Valor é gerado quando diversas funcionalidades trabalham juntas para permitir que um usuário alcance seu objetivo.

Por esse motivo, o MedFlow é projetado considerando jornadas completas e não apenas telas individuais.

---

# Jornada do Paciente

## Objetivo

Permitir que o paciente resolva toda sua relação com a clínica através do MedFlow.

---

## Fluxo Geral

```text
Cadastro

↓

Login

↓

Escolha da Clínica

↓

Escolha do Profissional

↓

Escolha da Especialidade

↓

Escolha da Data

↓

Escolha do Horário

↓

Confirmação

↓

Pagamento (quando necessário)

↓

Consulta

↓

Recebimento de Receita

↓

Recebimento de Exames

↓

Histórico
```

---

## Funcionalidades Envolvidas

- Cadastro
- Login
- Agenda
- Pagamentos
- Consultas
- Receitas
- Exames
- Histórico
- Perfil
- Notificações

---

## Pontos Críticos

A jornada deve ser extremamente simples.

O paciente nunca deve:

- ficar perdido;
- repetir informações;
- realizar cadastros duplicados;
- procurar funcionalidades escondidas.

---

# Jornada do Profissional

## Objetivo

Permitir que o profissional concentre toda sua rotina clínica em uma única plataforma.

---

## Fluxo Geral

```text
Login

↓

Dashboard

↓

Agenda do Dia

↓

Consulta

↓

Prontuário

↓

Receita

↓

Solicitação de Exames

↓

Conclusão

↓

Próximo Paciente
```

---

## Funcionalidades Envolvidas

- Dashboard
- Agenda
- Pacientes
- Prontuário
- Receitas
- Exames
- Histórico
- Financeiro
- IA

---

## Objetivo da Jornada

Reduzir ao máximo tarefas administrativas.

Toda informação necessária deve estar disponível durante o atendimento.

---

# Jornada da Recepcionista

## Objetivo

Administrar toda operação diária da clínica.

---

## Fluxo Geral

```text
Login

↓

Dashboard

↓

Agenda

↓

Cadastro de Paciente

↓

Confirmação

↓

Check-in

↓

Pagamento

↓

Encerramento
```

---

## Funcionalidades Envolvidas

- Agenda
- Pacientes
- Pagamentos
- Notificações
- Financeiro

---

## Objetivos

- rapidez;
- organização;
- poucos cliques;
- baixo índice de erros.

---

# Jornada do Administrador

## Objetivo

Gerenciar toda operação da clínica.

---

## Fluxo Geral

```text
Login

↓

Dashboard Executivo

↓

Indicadores

↓

Financeiro

↓

Profissionais

↓

Usuários

↓

Configurações

↓

Relatórios
```

---

## Funcionalidades Envolvidas

- Dashboard
- Financeiro
- Usuários
- Configurações
- Relatórios

---

## Objetivos

Ter visão completa da operação.

Identificar problemas rapidamente.

Tomar decisões baseadas em dados.

---

# Jornada do Super Administrador

## Objetivo

Administrar o próprio MedFlow.

---

## Fluxo Geral

```text
Login

↓

Dashboard Global

↓

Clientes

↓

Assinaturas

↓

Infraestrutura

↓

Logs

↓

Suporte

↓

Monitoramento
```

---

## Funcionalidades

- Clientes
- Planos
- Assinaturas
- Auditoria
- Logs
- Monitoramento
- Métricas
- Suporte

---

# Jornada da Inteligência Artificial

Embora não seja uma persona humana, a IA participa de diversas jornadas.

Seu papel será sempre auxiliar.

Jamais substituir usuários.

---

## Durante uma Consulta

Recebe:

- anotações;
- contexto;
- histórico.

↓

Organiza informações.

↓

Gera resumo.

↓

Sugere estrutura.

↓

Retorna ao profissional.

---

## Durante Administração

Recebe:

- dados;
- indicadores;
- históricos.

↓

Produz relatórios.

↓

Aponta tendências.

↓

Sugere melhorias.

---

# Jornada Entre Módulos

As jornadas não acontecem apenas entre usuários.

Também existem jornadas internas.

Exemplo:

```text
Paciente

↓

Agenda

↓

Pagamento

↓

Consulta

↓

Prontuário

↓

Receita

↓

Exame

↓

Notificação

↓

Histórico
```

Cada módulo deve comunicar-se de forma transparente.

O usuário nunca deve perceber transições entre módulos.

---

# Estados das Jornadas

Toda jornada deve considerar diferentes estados.

## Estado Inicial

Primeiro acesso.

---

## Estado Ativo

Utilização normal.

---

## Estado de Erro

Falhas.

Conexão.

Validação.

Permissões.

---

## Estado Vazio

Sem consultas.

Sem pacientes.

Sem dados.

Sempre apresentar orientações úteis.

---

## Estado de Carregamento

Toda ação deve informar ao usuário que está sendo processada.

Nunca deixar a interface aparentemente travada.

---

# Princípios

Toda jornada deve possuir:

- início claro;
- objetivo definido;
- poucas etapas;
- feedback constante;
- conclusão evidente.

Nenhum fluxo deve deixar o usuário em dúvida sobre o próximo passo.

---

# Critérios de Qualidade

Uma jornada é considerada boa quando:

- pode ser realizada sem treinamento;
- exige poucos cliques;
- reduz esforço;
- evita erros;
- possui linguagem clara;
- responde rapidamente.

---

# Evolução

Novas jornadas deverão ser documentadas sempre que novos módulos forem adicionados.

Nenhuma funcionalidade poderá alterar jornadas existentes sem atualização desta documentação.

---

# Declaração Final

O MedFlow não é composto apenas por funcionalidades.

Ele é composto por experiências completas.

Projetar jornadas bem definidas garante que toda evolução da plataforma continue intuitiva, consistente e centrada nas necessidades dos usuários.

---

# Documentos Relacionados

- Personas
- Product Requirements
- Business Rules
- Clinic Workflow
- Design Principles
- Navigation
- System Architecture
```