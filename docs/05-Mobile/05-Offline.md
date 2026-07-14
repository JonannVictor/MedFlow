# Funcionamento Offline (Offline Support)

| Campo | Valor |
|-------|--------|
| Documento | Offline Support |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Mobile |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

O **Offline Support** do MedFlow tem como objetivo garantir que funcionalidades críticas do aplicativo permaneçam disponíveis mesmo na ausência de conexão com a internet.

Em ambientes hospitalares, clínicas e unidades de atendimento, é comum ocorrerem instabilidades de rede ou interrupções temporárias de conectividade. O aplicativo deve continuar operando normalmente sempre que possível, sincronizando automaticamente os dados quando a conexão for restabelecida.

A estratégia Offline First aumenta a confiabilidade do sistema, reduz interrupções durante os atendimentos e melhora significativamente a experiência dos profissionais de saúde.

---

# Objetivos

O módulo Offline possui os seguintes objetivos:

- Permitir a continuidade do atendimento sem conexão.
- Evitar perda de informações.
- Armazenar alterações localmente.
- Sincronizar automaticamente quando houver internet.
- Garantir consistência entre dispositivo e servidor.
- Reduzir dependência da conexão em operações frequentes.
- Melhorar desempenho utilizando dados em cache.

---

# Arquitetura Offline

O funcionamento do modo Offline segue o fluxo abaixo.

```text
                API
                 │
                 ▼
         Banco de Dados
                 │
                 ▼
      Serviço de Sincronização
                 │
        ┌────────┴────────┐
        ▼                 ▼
 Cache Local        Fila de Sincronização
        │                 │
        └────────┬────────┘
                 ▼
         Aplicativo Mobile
```

Toda informação consultada é armazenada localmente para reutilização futura.

Alterações realizadas sem conexão permanecem na fila de sincronização até que possam ser enviadas ao servidor.

---

# Componentes

## Cache Local

Responsável pelo armazenamento temporário de informações frequentemente utilizadas.

### Exemplos

- Perfil do usuário
- Lista de pacientes
- Agenda
- Especialidades
- Configurações
- Convênios
- Histórico recente

---

## Storage Seguro

Informações sensíveis devem permanecer protegidas utilizando armazenamento seguro do dispositivo.

### Exemplos

- Access Token
- Refresh Token
- Preferências do usuário
- Configurações da sessão

---

## Fila de Sincronização (Sync Queue)

Toda operação realizada Offline deve ser registrada em uma fila.

Cada item da fila representa uma operação pendente.

Exemplos:

- Cadastro de paciente
- Atualização de prontuário
- Agendamento
- Cancelamento
- Upload de documentos
- Alteração de perfil

---

# Fluxo Offline

Quando não houver conexão:

```text
Usuário

↓

Executa uma ação

↓

Validação Local

↓

Persistência Local

↓

Registro na Sync Queue

↓

Atualização imediata da Interface
```

A aplicação nunca deve bloquear o usuário caso a operação possa ser executada posteriormente.

---

# Fluxo de Sincronização

Quando a internet retornar:

```text
Conexão Restabelecida

↓

Verificação da Sync Queue

↓

Envio para API

↓

Validação

↓

Confirmação

↓

Atualização do Cache

↓

Remoção da Operação da Fila
```

Caso ocorra erro durante o envio, o item permanece na fila até uma nova tentativa.

---

# Detecção de Conectividade

O aplicativo deve monitorar continuamente o estado da conexão.

Estados possíveis:

- Online
- Offline
- Conexão Limitada
- Sincronizando

A mudança de estado deve refletir imediatamente na interface do usuário.

---

# Dados Disponíveis Offline

As seguintes informações deverão permanecer acessíveis mesmo sem internet.

| Módulo | Disponível Offline |
|---------|-------------------|
| Perfil | Sim |
| Agenda | Sim |
| Pacientes sincronizados | Sim |
| Prontuários recentes | Sim |
| Histórico clínico sincronizado | Sim |
| Configurações | Sim |
| Especialidades | Sim |
| Convênios | Sim |
| Notificações antigas | Sim |

---

# Dados Não Disponíveis Offline

Algumas operações dependem obrigatoriamente da comunicação com o servidor.

Exemplos:

- Login inicial
- Recuperação de senha
- Consulta de informações nunca sincronizadas
- Download de novos anexos
- Atualização da aplicação

Nestes casos, o aplicativo deverá informar claramente a indisponibilidade da funcionalidade.

---

# Estratégia de Cache

O Cache deve priorizar informações frequentemente utilizadas.

Critérios:

- Dados recentes
- Dados acessados frequentemente
- Dados essenciais para atendimento
- Configurações da aplicação

O Cache deve possuir mecanismos automáticos de limpeza para evitar consumo excessivo de armazenamento.

---

# Política de Atualização

Os dados em Cache deverão ser atualizados nas seguintes situações:

- Login
- Sincronização concluída
- Atualização manual
- Alteração realizada pelo usuário
- Recebimento de novos dados da API

---

# Tratamento de Conflitos

Durante a sincronização podem ocorrer alterações simultâneas entre servidor e dispositivo.

O sistema deverá:

- Detectar conflitos automaticamente.
- Comparar data de modificação.
- Comparar versão do registro.
- Registrar eventos para auditoria.
- Solicitar intervenção do usuário quando necessário.

Toda resolução de conflito deve preservar a integridade dos dados clínicos.

---

# Indicadores Visuais

A interface deve informar claramente o estado da aplicação.

Exemplos:

- Indicador Offline
- Indicador de Sincronização
- Última sincronização realizada
- Operações pendentes
- Falhas de sincronização

Esses indicadores devem permanecer discretos, porém sempre visíveis ao usuário.

---

# Estratégia de Retry

Quando ocorrer falha na sincronização, o sistema deverá realizar novas tentativas automáticas.

Estratégia recomendada:

1. Primeira tentativa imediata.
2. Segunda tentativa após curto intervalo.
3. Aplicação de Exponential Backoff.
4. Limite máximo de tentativas.
5. Notificação ao usuário caso a sincronização permaneça pendente.

Essa abordagem reduz sobrecarga na infraestrutura e melhora a estabilidade da comunicação.

---

# Segurança

Mesmo em modo Offline, informações sensíveis devem permanecer protegidas.

Boas práticas:

- Criptografia dos dados persistidos.
- Armazenamento seguro de Tokens.
- Limpeza automática após Logout.
- Bloqueio de acesso após período de inatividade.
- Validação da sessão ao restabelecer conexão.

Nenhuma informação confidencial deve ser armazenada em texto puro.

---

# Performance

A estratégia Offline deve contribuir para o desempenho geral da aplicação.

Recomendações:

- Evitar consultas repetidas.
- Utilizar Lazy Loading quando possível.
- Minimizar operações de escrita.
- Sincronizar apenas registros modificados.
- Reduzir consumo de bateria durante sincronizações.

---

# Boas Práticas

- Adotar a filosofia **Offline First** sempre que possível.
- Nunca bloquear o fluxo de trabalho do profissional por falta de internet.
- Sincronizar automaticamente sem intervenção do usuário.
- Manter a Sync Queue organizada e resiliente.
- Registrar todas as operações críticas para auditoria.
- Informar claramente o estado da sincronização.
- Validar integridade dos dados antes e após a sincronização.
- Garantir consistência entre Cache Local e servidor.

---

# Considerações Finais

O suporte Offline é um dos pilares da arquitetura mobile do MedFlow. Ao permitir que atendimentos continuem mesmo em cenários de baixa conectividade, o sistema torna-se mais confiável, resiliente e adequado para ambientes de saúde, onde a disponibilidade da informação é um requisito crítico. A combinação entre Cache Local, Sync Queue e sincronização automática garante continuidade operacional, preservação dos dados e uma experiência consistente para os profissionais de saúde.