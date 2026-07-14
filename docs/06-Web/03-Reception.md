# Recepção (Reception)

| Campo | Valor |
|-------|--------|
| Documento | Reception |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Web |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

O módulo **Reception** é responsável por centralizar todas as operações executadas pela recepção da clínica, atuando como ponto de controle para o fluxo diário de pacientes.

Sua principal função é garantir que o processo entre a chegada do paciente e o início do atendimento médico ocorra de forma organizada, eficiente e rastreável.

Este módulo deverá reduzir o tempo de atendimento na recepção, minimizar erros operacionais e fornecer visibilidade em tempo real sobre o estado de cada paciente dentro da clínica.

---

# Objetivos

O módulo Reception possui os seguintes objetivos:

- Gerenciar o fluxo de entrada dos pacientes.
- Agilizar o processo de Check-in.
- Reduzir filas de atendimento.
- Centralizar informações da recepção.
- Facilitar a comunicação entre recepção e equipe médica.
- Controlar o status de cada atendimento.
- Registrar todas as movimentações para auditoria.

---

# Escopo

O módulo é responsável por:

- Check-in de pacientes.
- Check-out.
- Gerenciamento da fila de atendimento.
- Confirmação de consultas.
- Cancelamentos.
- Reagendamentos.
- Controle de chegada.
- Controle de atraso.
- Atualização do status dos atendimentos.

Não faz parte deste módulo:

- Atendimento médico.
- Prontuário.
- Emissão de receitas.
- Gestão financeira completa.
- Administração do sistema.

---

# Requisitos Funcionais

| Código | Descrição |
|---------|-----------|
| RF-001 | Permitir localizar pacientes rapidamente. |
| RF-002 | Realizar Check-in. |
| RF-003 | Registrar chegada do paciente. |
| RF-004 | Atualizar o status do atendimento. |
| RF-005 | Permitir cancelamento da consulta. |
| RF-006 | Permitir reagendamento. |
| RF-007 | Registrar ausência do paciente. |
| RF-008 | Exibir fila em tempo real. |
| RF-009 | Atualizar automaticamente a fila. |
| RF-010 | Exibir histórico do atendimento. |

---

# Requisitos Não Funcionais

| Código | Descrição |
|---------|-----------|
| RNF-001 | Atualização automática da fila em tempo real. |
| RNF-002 | Tempo máximo de atualização inferior a 3 segundos. |
| RNF-003 | Interface otimizada para uso contínuo durante o expediente. |
| RNF-004 | Compatibilidade com diferentes resoluções de tela. |
| RNF-005 | Baixo tempo de resposta nas pesquisas. |

---

# Fluxo Operacional

```text
Paciente Agenda Consulta

↓

Paciente Chega à Clínica

↓

Recepcionista Localiza Agendamento

↓

Check-in

↓

Paciente Aguardando Atendimento

↓

Médico Inicia Consulta

↓

Consulta Finalizada

↓

Check-out

↓

Atendimento Encerrado
```

---

# Estados do Atendimento

Cada consulta poderá assumir apenas um dos estados abaixo.

| Status | Descrição |
|---------|-----------|
| Agendada | Consulta criada, aguardando chegada. |
| Confirmada | Consulta confirmada previamente. |
| Check-in Realizado | Paciente presente na clínica. |
| Aguardando Atendimento | Paciente aguardando o médico. |
| Em Atendimento | Consulta iniciada. |
| Finalizada | Atendimento concluído. |
| Cancelada | Consulta cancelada. |
| Não Compareceu | Paciente ausente. |

Toda mudança de estado deverá ser registrada para auditoria.

---

# Componentes da Interface

## Barra Superior (Top Bar)

Responsável por apresentar:

- Usuário autenticado.
- Unidade atual.
- Data.
- Hora.
- Atalhos rápidos.

---

## Campo de Pesquisa

Permite localizar pacientes utilizando:

- Nome.
- CPF.
- Telefone.
- Número do prontuário.
- Código do agendamento.

A pesquisa deverá possuir **Debounce** para reduzir requisições desnecessárias.

---

## Lista de Atendimentos

Exibe os atendimentos do dia.

Cada registro deverá apresentar:

- Horário.
- Paciente.
- Médico.
- Especialidade.
- Convênio.
- Status.
- Tempo de espera.

---

## Painel de Fila

Apresenta os pacientes aguardando atendimento.

Ordenação padrão:

1. Horário agendado.
2. Prioridade.
3. Ordem de chegada.

---

## Painel de Ações

Cada atendimento deverá disponibilizar ações contextuais.

Exemplos:

- Check-in
- Confirmar presença
- Reagendar
- Cancelar
- Registrar ausência
- Abrir cadastro
- Abrir prontuário
- Imprimir comprovante

---

# Casos de Uso

## UC-001 — Realizar Check-in

### Atores

- Recepcionista

### Fluxo Principal

1. Localizar paciente.
2. Confirmar identidade.
3. Confirmar consulta.
4. Registrar horário de chegada.
5. Alterar status para **Check-in Realizado**.
6. Inserir paciente na fila de atendimento.
7. Notificar o médico responsável.

---

## UC-002 — Cancelar Consulta

Fluxo:

1. Selecionar atendimento.
2. Informar motivo.
3. Confirmar operação.
4. Atualizar agenda.
5. Registrar evento na auditoria.

---

## UC-003 — Registrar Não Comparecimento

Fluxo:

1. Identificar paciente ausente.
2. Alterar status.
3. Registrar horário.
4. Atualizar indicadores.
5. Encerrar atendimento.

---

# Comunicação com Outros Módulos

O módulo Reception depende dos seguintes serviços:

- Authentication Service
- Patient Service
- Appointment Service
- Notification Service
- Audit Service
- User Service

---

# Eventos Consumidos

| Evento | Origem |
|----------|---------|
| AppointmentCreated | Appointment Service |
| AppointmentUpdated | Appointment Service |
| AppointmentCancelled | Appointment Service |
| PatientUpdated | Patient Service |

---

# Eventos Disparados

| Evento | Destino |
|----------|----------|
| PatientCheckedIn | Dashboard |
| PatientWaiting | Medical Module |
| AppointmentCancelled | Dashboard |
| AppointmentRescheduled | Appointment Module |
| AttendanceFinished | Reports |

---

# Permissões

| Perfil | Permissões |
|---------|------------|
| Administrador | Total |
| Recepcionista | Completo |
| Médico | Somente consulta da fila |
| Financeiro | Apenas visualização |
| Gestor | Visualização completa |

---

# Regras de Negócio

| Código | Regra |
|---------|--------|
| RN-001 | Um paciente só poderá realizar Check-in para consultas agendadas. |
| RN-002 | O horário real de chegada deverá ser registrado automaticamente. |
| RN-003 | Um paciente não poderá permanecer simultaneamente em dois atendimentos ativos. |
| RN-004 | Cancelamentos deverão registrar motivo obrigatório. |
| RN-005 | Toda alteração de status deverá gerar registro de auditoria. |
| RN-006 | Pacientes prioritários deverão aparecer no topo da fila. |
| RN-007 | Consultas iniciadas não poderão retornar para o estado "Agendada". |
| RN-008 | O tempo de espera deverá ser recalculado automaticamente. |

---

# Estratégia de Atualização

Os seguintes dados deverão ser atualizados em tempo real:

- Fila de espera.
- Status dos atendimentos.
- Check-ins.
- Cancelamentos.
- Reagendamentos.
- Tempo médio de espera.

---

# Tratamento de Erros

O sistema deverá tratar cenários como:

- Paciente inexistente.
- Consulta inexistente.
- Horário inválido.
- Médico indisponível.
- Falha de comunicação.
- Sessão expirada.

Nenhuma operação deverá resultar em perda de informações.

---

# Segurança

O módulo deverá:

- Registrar todas as operações.
- Validar permissões.
- Utilizar comunicação HTTPS.
- Impedir acesso não autorizado.
- Registrar alterações para auditoria.

---

# Performance

Recomendações:

- Atualização incremental da fila.
- Cache para consultas frequentes.
- Pesquisa otimizada.
- Paginação quando necessário.
- Componentes independentes.
- Renderização seletiva.

---

# Decisões Arquiteturais

## ADR-008

A fila de atendimento deverá ser atualizada em tempo real, sem necessidade de recarregar a página.

---

## ADR-009

Toda alteração de status deverá gerar um evento para manter Dashboard, Agenda e demais módulos sincronizados.

---

## ADR-010

O módulo Reception não deverá conter regras de negócio relacionadas ao atendimento médico, limitando-se ao gerenciamento operacional da recepção.

---

# Considerações Finais

O módulo **Reception** é um dos pilares operacionais do MedFlow. Sua arquitetura foi projetada para garantir agilidade, rastreabilidade e integração com os demais módulos da plataforma, proporcionando uma experiência eficiente para recepcionistas e profissionais de saúde. A utilização de eventos em tempo real, regras de negócio bem definidas e auditoria completa assegura consistência operacional e suporte ao crescimento da plataforma.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação inicial do documento | Equipe MedFlow |