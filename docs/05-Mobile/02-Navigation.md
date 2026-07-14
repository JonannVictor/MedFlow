# Navigation

## Objetivo

Este documento define a estratégia oficial de navegação do aplicativo móvel do MedFlow.

Seu objetivo é garantir uma navegação consistente, intuitiva e escalável, facilitando a experiência do usuário e a manutenção da aplicação.

---

# Princípios

A navegação deverá ser.

- previsível;
- consistente;
- desacoplada;
- segura;
- centralizada.

Toda navegação deverá ocorrer através do sistema oficial de rotas da aplicação.

---

# Estratégia

O aplicativo utilizará navegação declarativa.

Toda rota deverá possuir.

- identificador único;
- parâmetros tipados;
- controle de autenticação;
- controle de permissões.

---

# Estrutura

```text
App

↓

Splash

↓

Authentication

↓

Main Navigation

↓

Feature

↓

Screen
```

---

# Fluxo Inicial

```text
Splash

↓

Verificação de Sessão

↓

Login
```

ou

```text
Splash

↓

Dashboard
```

Caso exista sessão válida.

---

# Navegação Principal

Após autenticação.

```text
Dashboard

├── Agenda
├── Pacientes
├── Financeiro
├── IA
├── Notificações
└── Configurações
```

Cada módulo possuirá navegação própria.

---

# Navegação por Feature

Exemplo.

```text
Pacientes

↓

Lista

↓

Detalhes

↓

Prontuário

↓

Prescrições

↓

Exames
```

Cada feature deverá controlar apenas suas próprias rotas.

---

# Rotas Públicas

```text
Splash

Login

Recuperar Senha

Verificar E-mail
```

Não exigem autenticação.

---

# Rotas Protegidas

```text
Dashboard

Agenda

Pacientes

Prontuários

Financeiro

IA

Configurações
```

Exigem autenticação válida.

---

# Controle de Permissões

Antes da navegação.

A aplicação deverá verificar.

- autenticação;
- permissões;
- papel do usuário;
- vínculo com a clínica.

Usuários não autorizados deverão ser redirecionados para uma tela apropriada.

---

# Passagem de Parâmetros

Os parâmetros deverão ser fortemente tipados.

Exemplo.

```text
Patient Details

↓

patientId
```

Nunca utilizar parâmetros globais para compartilhar informações entre telas.

---

# Deep Links

A navegação deverá suportar.

```text
Notificações

Links Externos

QR Codes

Convites

Compartilhamento
```

Todos os Deep Links deverão passar pelo processo de autenticação quando necessário.

---

# Navegação Offline

Quando não houver conexão.

O aplicativo deverá permitir acesso às telas compatíveis com modo Offline.

A sincronização ocorrerá quando a conexão for restabelecida.

---

# Tratamento de Erros

Rotas inexistentes deverão direcionar para.

```text
Página Não Encontrada
```

ou

```text
Tela Inicial
```

Conforme o contexto.

---

# Performance

A navegação deverá priorizar.

- Lazy Loading;
- carregamento sob demanda;
- reutilização de telas;
- baixo consumo de memória.

---

# Segurança

Nenhuma rota protegida deverá ser acessível sem autenticação.

Mudanças de permissões durante a sessão deverão atualizar imediatamente o acesso às rotas.

---

# Boas Práticas

Sempre.

- utilizar navegação centralizada;
- evitar navegação por strings literais;
- utilizar parâmetros tipados;
- validar permissões antes da navegação;
- manter rotas organizadas por feature.

---

# Status

**Documento:** Navigation.md

**Versão:** 1.0

**Status:** ✅ Concluído

**Última atualização:** 2026

---
