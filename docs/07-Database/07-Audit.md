# Audit

## Objetivo

Este documento define a estratégia oficial de auditoria do MedFlow.

Seu objetivo é garantir rastreabilidade, integridade e transparência sobre todas as operações relevantes realizadas na plataforma.

A auditoria é um componente fundamental para segurança, conformidade regulatória, investigação de incidentes e governança de dados.

---

# Escopo

As políticas de auditoria aplicam-se a todos os domínios.

```text
Organization

Authentication

Clinical

Medical

Financial

Communication

Infrastructure

Artificial Intelligence
```

---

# Objetivos da Auditoria

A auditoria deverá permitir.

- rastrear alterações;
- identificar responsáveis;
- reconstruir eventos;
- investigar incidentes;
- atender requisitos legais;
- apoiar conformidade com LGPD.

---

# Eventos Auditáveis

## Autenticação

Registrar.

```text
Login

Logout

Falha de Login

Alteração de Senha

Reset de Senha

Verificação de E-mail

MFA

Troca de Sessão
```

---

## Usuários

Registrar.

```text
Criação

Atualização

Desativação

Reativação

Alteração de Perfil

Alteração de Permissões
```

---

## Clínicas

Registrar.

```text
Criação

Atualização

Mudança de Plano

Ativação

Inativação
```

---

## Pacientes

Registrar.

```text
Cadastro

Atualização

Arquivamento

Reativação
```

---

## Prontuário

Registrar.

```text
Criação

Atualização

Assinatura

Adendo

Visualização

Exportação
```

---

## Financeiro

Registrar.

```text
Cobranças

Pagamentos

Estornos

Faturas

Mudança de Assinatura
```

---

## Comunicação

Registrar.

```text
Envio

Falha

Reenvio

Leitura

Cancelamento
```

---

## Infraestrutura

Registrar.

```text
API Keys

Integrações

Webhooks

Background Jobs

Migrações

Backups
```

---

## Inteligência Artificial

Registrar.

```text
Conversas

Mensagens

Recomendações

Prompts

Consumo

Falhas
```

---

# Informações Obrigatórias

Cada registro deverá possuir.

```text
ID

Timestamp

Usuário

Clínica

Entidade

Identificador da Entidade

Operação

Endereço IP

User Agent

Resultado

Origem
```

---

# Dados Opcionais

Quando aplicável.

```text
Valores Anteriores

Valores Novos

Correlation ID

Request ID

Session ID

ApiKey

Motivo
```

---

# Imutabilidade

Os registros de auditoria deverão ser.

- imutáveis;
- somente leitura;
- protegidos contra alterações.

Nenhum usuário poderá modificar registros de auditoria.

---

# Retenção

Tempo mínimo recomendado.

```text
AuditLog

10 anos
```

Quando exigido por legislação específica.

Os registros poderão permanecer armazenados por período superior.

---

# Consulta

Somente poderão consultar registros.

- Administradores autorizados;
- Auditores;
- Equipe de Segurança;
- Administradores da Plataforma.

Usuários comuns não deverão acessar os logs completos.

---

# Exportação

A plataforma deverá permitir.

```text
CSV

JSON

PDF
```

Toda exportação deverá ser registrada em AuditLog.

---

# Integridade

Os registros deverão preservar.

- ordem cronológica;
- integridade dos dados;
- identificação do responsável;
- histórico completo.

---

# Correlação

Eventos relacionados deverão compartilhar.

```text
Correlation ID
```

Exemplo.

```text
Login

↓

Criação de Sessão

↓

Consulta ao Prontuário

↓

Prescrição

↓

Assinatura
```

Todos esses eventos poderão ser agrupados por um mesmo Correlation ID.

---

# Monitoramento

Eventos críticos deverão gerar alertas.

Exemplos.

```text
Falhas repetidas de Login

Tentativas de acesso não autorizado

Alteração de Permissões

Exportação em massa

Revogação de API Keys

Falhas de Backup
```

---

# Conformidade

A estratégia de auditoria deverá atender.

```text
LGPD

Boas práticas de segurança

Princípios de rastreabilidade

Governança de dados
```

---

# Boas Práticas

Sempre.

- registrar operações críticas;
- manter registros imutáveis;
- sincronizar horário utilizando UTC;
- utilizar Correlation IDs;
- registrar origem da operação;
- proteger os logs contra alterações.

---

# Status

**Documento:** Audit.md

**Versão:** 1.0

**Status:** ✅ Concluído

**Última atualização:** 2026

