# Business Rules

| Campo | Valor |
|-------|--------|
| Documento | Business Rules |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Business |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define as regras oficiais de negócio do MedFlow.

As regras aqui descritas representam o comportamento esperado da plataforma.

Nenhuma implementação poderá contrariar este documento.

Caso uma regra precise ser alterada, este documento deverá ser atualizado antes da implementação.

---

# Introdução

Uma regra de negócio define como o sistema deve se comportar diante de determinadas situações.

Ela não depende da tecnologia utilizada.

Mesmo que o backend, banco de dados ou frontend mudem no futuro, estas regras devem permanecer válidas até que sejam oficialmente modificadas.

---

# Regra Geral

Toda operação realizada no MedFlow deve respeitar cinco princípios.

- Integridade
- Segurança
- Rastreabilidade
- Consistência
- Isolamento entre clínicas

Nenhuma regra poderá violar esses princípios.

---

# Clínicas

## BR-001

Toda informação cadastrada pertence a uma clínica.

Nenhum dado operacional poderá existir sem estar vinculado a uma clínica.

---

## BR-002

Uma clínica pode possuir vários profissionais.

---

## BR-003

Uma clínica pode possuir vários recepcionistas.

---

## BR-004

Uma clínica possui configurações próprias.

Exemplos:

- horário de funcionamento;
- duração padrão das consultas;
- especialidades;
- políticas de cancelamento;
- identidade visual;
- plano contratado.

---

## BR-005

Nenhuma clínica poderá visualizar dados pertencentes a outra clínica.

---

# Usuários

## BR-006

Todo usuário deve possuir autenticação.

---

## BR-007

Todo usuário pertence a pelo menos uma clínica.

Exceto Super Administradores.

---

## BR-008

Todo usuário possui um papel (Role).

Exemplos:

- Paciente
- Profissional
- Recepcionista
- Administrador
- Super Administrador

---

## BR-009

Permissões devem ser determinadas pelo papel do usuário.

Nunca pela interface.

---

# Pacientes

## BR-010

Um paciente pode possuir várias consultas.

---

## BR-011

Um paciente pode ser atendido por diferentes profissionais.

---

## BR-012

Todo paciente possui um prontuário único dentro da clínica.

---

## BR-013

A exclusão de pacientes nunca deverá remover informações clínicas.

Registros históricos devem ser preservados.

---

## BR-014

Informações clínicas somente poderão ser acessadas por usuários autorizados.

---

# Profissionais

## BR-015

Um profissional pode atender em uma ou mais clínicas.

---

## BR-016

Um profissional possui agenda própria.

---

## BR-017

Um profissional define seus horários de atendimento.

---

## BR-018

Um profissional não poderá possuir consultas sobrepostas.

---

# Agenda

## BR-019

Cada horário pertence a apenas uma consulta.

---

## BR-020

Não permitir conflitos de agenda.

---

## BR-021

Horários indisponíveis não poderão ser reservados.

---

## BR-022

Consultas canceladas liberam automaticamente o horário.

---

## BR-023

Consultas concluídas não poderão retornar ao estado de agendada.

---

# Consultas

## BR-024

Toda consulta possui um status.

Status oficiais:

- Agendada
- Confirmada
- Em Atendimento
- Concluída
- Cancelada
- Não Compareceu

---

## BR-025

Toda mudança de status deve ser registrada.

---

## BR-026

Uma consulta concluída gera histórico permanente.

---

## BR-027

Consultas nunca deverão ser excluídas fisicamente.

---

# Prontuário

## BR-028

Todo prontuário pertence a um paciente.

---

## BR-029

Toda alteração deve possuir histórico.

---

## BR-030

O histórico clínico nunca poderá ser perdido.

---

## BR-031

Anotações devem possuir autor e data.

---

## BR-032

Arquivos anexados deverão permanecer vinculados ao prontuário.

---

# Receitas

## BR-033

Receitas pertencem a uma consulta.

---

## BR-034

Receitas nunca poderão ser alteradas após assinatura.

---

## BR-035

Toda emissão deverá ser registrada.

---

# Exames

## BR-036

Solicitações pertencem a uma consulta.

---

## BR-037

Resultados deverão permanecer disponíveis para consultas futuras.

---

# Financeiro

## BR-038

Todo pagamento pertence a uma clínica.

---

## BR-039

Todo pagamento deverá possuir status.

Exemplos:

- Pendente
- Pago
- Cancelado
- Estornado

---

## BR-040

Toda movimentação financeira deverá gerar registro permanente.

---

# Notificações

## BR-041

Notificações nunca deverão impedir funcionamento do sistema.

Caso uma notificação falhe, a operação principal continua.

---

## BR-042

Toda notificação importante deverá possuir registro de envio.

---

# Inteligência Artificial

## BR-043

A IA nunca poderá alterar informações clínicas automaticamente.

---

## BR-044

Toda sugestão da IA deverá ser validada por um usuário.

---

## BR-045

A IA nunca poderá substituir decisões médicas.

---

# Auditoria

## BR-046

Toda operação crítica deverá gerar log.

---

## BR-047

Toda alteração de informações clínicas deverá registrar:

- usuário;
- data;
- horário;
- operação realizada.

---

# Exclusões

## BR-048

Sempre que possível utilizar Soft Delete.

---

## BR-049

Dados clínicos não deverão ser removidos definitivamente.

---

# Segurança

## BR-050

Toda operação deve verificar permissões antes da execução.

---

## BR-051

Toda requisição deve possuir usuário autenticado.

Exceto recursos públicos definidos oficialmente.

---

# Multi-Tenant

## BR-052

Nenhuma consulta poderá acessar dados de outra clínica.

---

## BR-053

Todo filtro deverá respeitar isolamento entre tenants.

---

## BR-054

Logs também devem respeitar isolamento entre clínicas.

---

# Integridade

## BR-055

Toda operação deve manter consistência dos dados.

Caso uma etapa falhe, toda operação deverá ser revertida quando aplicável.

---

# Evolução

Novas regras deverão receber numeração sequencial.

Exemplo:

BR-056

BR-057

BR-058

Jamais reutilizar números.

Regras removidas deverão permanecer registradas como obsoletas para manter histórico.

---

# Revisão

Toda alteração de regra de negócio deverá:

- ser documentada;
- ser aprovada;
- gerar atualização deste documento;
- refletir na implementação.

---

# Declaração Final

As Regras de Negócio representam o comportamento oficial do MedFlow.

Elas existem para garantir consistência, previsibilidade e segurança durante toda a evolução da plataforma.

Toda implementação deve ser considerada apenas uma tradução técnica destas regras.

---

# Documentos Relacionados

- Product Requirements
- Personas
- User Journey
- Domain Model
- System Architecture
- Permissions
- Authentication
- Authorization
- Database
```