# Authentication

| Campo | Valor |
|-------|--------|
| Documento | Authentication |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Architecture |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define a arquitetura oficial de autenticação do MedFlow.

Seu objetivo é garantir que apenas usuários devidamente autenticados possam acessar os recursos da plataforma.

A autenticação é responsável exclusivamente por verificar **quem é o usuário**.

Ela não decide **o que o usuário pode fazer**.

Essa responsabilidade pertence ao módulo de Authorization.

---

# Escopo

Este documento define:

- login;
- logout;
- gerenciamento de sessões;
- refresh tokens;
- recuperação de senha;
- verificação de identidade;
- dispositivos confiáveis;
- autenticação em múltiplos dispositivos.

---

# Princípios

Toda autenticação deve ser:

- segura;
- simples;
- rápida;
- auditável;
- escalável.

---

# Responsabilidades

Authentication é responsável por:

- identificar usuários;
- validar credenciais;
- criar sessões;
- renovar sessões;
- encerrar sessões;
- invalidar tokens.

Authentication nunca decide permissões.

---

# Fluxo Geral

```text
Usuário

↓

Login

↓

Validação das credenciais

↓

Criação da Sessão

↓

Emissão dos Tokens

↓

Acesso à Plataforma
```

---

# Métodos de Login

Inicialmente o MedFlow suportará:

- Email + Senha

No futuro:

- Google
- Microsoft
- Apple
- Gov.br
- SSO
- SAML
- OAuth2

A arquitetura deverá permitir novos provedores sem alterações estruturais.

---

# Identidade do Usuário

Todo usuário deverá possuir um identificador único.

Exemplo:

- userId

Este identificador nunca deverá ser alterado.

---

# Credenciais

As credenciais nunca poderão ser armazenadas em texto puro.

Toda senha deverá ser armazenada utilizando algoritmo seguro de hash.

Nunca armazenar:

- senha original;
- senha descriptografável.

---

# Sessão

Após autenticação bem-sucedida será criada uma sessão.

A sessão representa um usuário autenticado.

Cada sessão deverá possuir:

- sessionId;
- userId;
- clinicId (quando aplicável);
- data de criação;
- data de expiração;
- dispositivo;
- IP (quando disponível).

---

# Tokens

A autenticação utilizará dois tipos de tokens.

## Access Token

Utilizado em todas as requisições autenticadas.

Características:

- curta duração;
- assinado;
- não persistente.

---

## Refresh Token

Utilizado para renovar o Access Token.

Características:

- longa duração;
- armazenado com segurança;
- revogável.

---

# Renovação

Fluxo.

```text
Access Token expirou

↓

Refresh Token válido

↓

Novo Access Token

↓

Sessão continua
```

Caso o Refresh Token esteja inválido.

O usuário deverá realizar novo login.

---

# Logout

Ao realizar logout.

O sistema deverá:

- invalidar Refresh Token;
- encerrar sessão;
- registrar auditoria.

---

# Recuperação de Senha

Fluxo.

```text
Solicitação

↓

Token temporário

↓

Validação

↓

Nova senha

↓

Sessão atual invalidada

↓

Login novamente
```

O token deverá possuir tempo de vida limitado.

---

# Alteração de Senha

Sempre que a senha for alterada.

O sistema deverá:

- invalidar todas as sessões existentes;
- exigir novo login.

---

# Sessões Simultâneas

Inicialmente o MedFlow permitirá múltiplas sessões por usuário.

Cada sessão será independente.

O usuário poderá visualizar:

- dispositivo;
- data;
- localização aproximada (quando disponível).

Também poderá encerrar sessões remotamente.

---

# Dispositivos Confiáveis

No futuro será possível marcar dispositivos como confiáveis.

Isso reduzirá solicitações repetidas de autenticação adicional.

---

# MFA (Futuro)

A arquitetura deverá permitir autenticação multifator.

Exemplos.

- TOTP
- SMS
- Email
- Aplicativos autenticadores
- Chaves FIDO2

---

# Expiração

Sessões deverão possuir tempo máximo configurável.

Após expiração.

Novo login será obrigatório.

---

# Tentativas de Login

O sistema deverá limitar tentativas consecutivas.

Objetivos.

- reduzir ataques;
- proteger contas.

Após determinado limite.

A conta poderá sofrer bloqueio temporário.

---

# Conta Bloqueada

Motivos possíveis.

- excesso de tentativas;
- atividade suspeita;
- decisão administrativa.

Usuários bloqueados não poderão autenticar.

---

# Auditoria

Toda autenticação deverá gerar registro.

Eventos.

- Login realizado
- Login falhou
- Logout
- Sessão criada
- Sessão encerrada
- Senha alterada
- Recuperação iniciada

---

# Segurança

Toda autenticação deverá considerar.

- HTTPS obrigatório;
- proteção contra replay;
- proteção contra brute force;
- proteção contra session hijacking;
- proteção contra token leakage.

---

# Responsabilidades da API

A API deverá.

- validar Access Token;
- recuperar usuário;
- recuperar tenant;
- disponibilizar contexto autenticado.

Nunca executar regras de autorização nesta camada.

---

# Contexto da Requisição

Após autenticação bem-sucedida.

Toda requisição possuirá:

```text
Context

↓

User

↓

Clinic

↓

Role

↓

Permissions

↓

Session
```

Esse contexto será utilizado pela camada de Authorization.

---

# Escalabilidade

A autenticação deverá funcionar em múltiplas instâncias da aplicação.

Nenhum servidor deverá depender de memória local para validar sessões.

---

# Eventos

Eventos oficiais.

- UserAuthenticated
- LoginFailed
- SessionCreated
- SessionExpired
- SessionRevoked
- PasswordChanged
- PasswordResetRequested
- PasswordResetCompleted

---

# Checklist

Toda implementação deverá responder.

- usuário autenticado?
- sessão válida?
- token válido?
- refresh disponível?
- auditoria registrada?
- tenant identificado?

Caso qualquer resposta seja negativa.

A requisição deverá ser interrompida.

---

# Declaração Final

Authentication representa a primeira barreira de segurança do MedFlow.

Sua responsabilidade é garantir que a identidade de cada usuário seja validada de forma segura, consistente e auditável.

Toda decisão relacionada à autenticação deverá priorizar segurança sem comprometer a experiência do usuário.

---

# Documentos Relacionados

- Authorization
- Permissions
- Multi-Tenant
- System Architecture
- Security
- Logging
- Audit
- LGPD
```