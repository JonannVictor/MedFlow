# MedFlow — Design System

## 🎨 Identidade Visual

### Paleta de Cores

| Token | Claro | Escuro | Uso |
|-------|-------|--------|-----|
| **primary** | #0066CC | #3399FF | Botões, links, ações principais |
| **background** | #FFFFFF | #0F1419 | Fundo de telas |
| **surface** | #F5F7FA | #1A1F26 | Cards, superfícies elevadas |
| **foreground** | #1A202C | #E8EAED | Texto principal |
| **muted** | #718096 | #9CA3AF | Texto secundário, hints |
| **border** | #E2E8F0 | #2D3748 | Bordas, divisores |
| **success** | #10B981 | #34D399 | Estados de sucesso |
| **warning** | #F59E0B | #FBBF24 | Alertas, avisos |
| **error** | #EF4444 | #F87171 | Erros, validações |

### Tipografia

- **Heading 1 (32px)**: Títulos de telas principais
- **Heading 2 (24px)**: Subtítulos, seções
- **Heading 3 (18px)**: Títulos de cards
- **Body (16px)**: Texto principal
- **Small (14px)**: Texto secundário
- **Tiny (12px)**: Labels, hints

### Componentes Base

- **Botão Primário**: Azul (#0066CC), 48px altura, 16px padding horizontal
- **Botão Secundário**: Contorno azul, fundo transparente
- **Card**: Fundo surface, 12px border-radius, sombra suave
- **Input**: 48px altura, 12px border-radius, border 1px
- **Divider**: 1px, cor border

---

## 📱 Estrutura de Telas

### 1. Landing Page (Pré-autenticação)
**Rota**: `/`
**Conteúdo**:
- Hero com logo MedFlow
- Texto: "Conectando pacientes e profissionais de saúde"
- Dois botões principais:
  - "Sou Paciente" → `/auth/patient-signup`
  - "Sou Profissional" → `/auth/professional-signup`
- Link "Já tenho conta" → `/auth/login`

---

### 2. Autenticação

#### 2.1 Login
**Rota**: `/auth/login`
**Campos**:
- Email (input)
- Senha (input, masked)
- Botão "Entrar"
- Link "Criar conta" (redireciona para landing)
- Link "Esqueci minha senha"

#### 2.2 Cadastro Paciente
**Rota**: `/auth/patient-signup`
**Campos**:
- Nome completo
- Email
- Senha
- Confirmação de senha
- Botão "Criar Conta"
- Link "Já tenho conta" → `/auth/login`

#### 2.3 Cadastro Profissional
**Rota**: `/auth/professional-signup`
**Campos**:
- Nome completo
- Email
- Senha
- Confirmação de senha
- Especialidade (dropdown)
- CRM/Registro profissional
- Botão "Criar Conta"
- Link "Já tenho conta" → `/auth/login`

---

### 3. Dashboard Paciente

#### 3.1 Home (Busca de Profissionais)
**Rota**: `/patient/home`
**Conteúdo**:
- Header com "Olá, [Nome]" e ícone de perfil
- Barra de busca: "Buscar especialidade"
- Filtros: Especialidade, Disponibilidade
- Lista de profissionais em cards:
  - Foto/Avatar
  - Nome
  - Especialidade
  - Preço da consulta
  - Rating (se aplicável)
  - Botão "Agendar"
- Tab bar: Home | Consultas | Perfil

#### 3.2 Agendamento de Consulta
**Rota**: `/patient/booking/[professionalId]`
**Fluxo**:
1. Selecionar data (calendário)
2. Selecionar horário (lista de disponibilidades)
3. Revisar informações (profissional, data, hora, preço)
4. Botão "Confirmar Agendamento"
5. Tela de confirmação com número de consulta

#### 3.3 Minhas Consultas
**Rota**: `/patient/appointments`
**Conteúdo**:
- Abas: Próximas | Passadas
- Cards de consulta com:
  - Nome do profissional
  - Especialidade
  - Data e hora
  - Status (Agendada, Cancelada, Realizada)
  - Botão "Entrar na Consulta" (se próxima)
  - Botão "Cancelar" (se próxima)

#### 3.4 Perfil Paciente
**Rota**: `/patient/profile`
**Conteúdo**:
- Avatar e nome
- Email
- Histórico de consultas (resumo)
- Botão "Editar Perfil"
- Botão "Sair"

---

### 4. Dashboard Profissional

#### 4.1 Agenda
**Rota**: `/professional/agenda`
**Conteúdo**:
- Calendário com disponibilidades
- Lista de consultas agendadas para hoje/próximos dias
- Cards com:
  - Nome do paciente
  - Horário
  - Status (Agendada, Iniciada, Cancelada)
  - Botão "Iniciar Consulta"
  - Botão "Recusar" (se ainda não iniciada)

#### 4.2 Consultas Recebidas
**Rota**: `/professional/requests`
**Conteúdo**:
- Abas: Pendentes | Aceitas | Recusadas
- Cards de solicitação com:
  - Nome do paciente
  - Data/hora solicitada
  - Especialidade
  - Botões "Aceitar" e "Recusar" (se pendente)

#### 4.3 Perfil Profissional
**Rota**: `/professional/profile`
**Conteúdo**:
- Avatar
- Nome e especialidade
- CRM/Registro
- Bio/Descrição
- Preço da consulta
- Horários disponíveis (gerenciar)
- Localização
- Botão "Editar Perfil"
- Botão "Sair"

---

## 🔄 Fluxos Principais

### Fluxo 1: Paciente Agendando Consulta
1. Paciente faz login
2. Vê dashboard com profissionais
3. Clica em "Agendar"
4. Seleciona data e hora
5. Confirma agendamento
6. Recebe confirmação com número de consulta

### Fluxo 2: Profissional Recebendo Consulta
1. Profissional faz login
2. Vê solicitações de consulta
3. Aceita ou recusa
4. Consulta aparece na agenda
5. No horário, clica "Iniciar Consulta"

### Fluxo 3: Consulta Online
1. Paciente clica "Entrar na Consulta"
2. Profissional clica "Iniciar Consulta"
3. Ambos entram em sala de vídeo (futura integração)
4. Após consulta, profissional pode encaminhar para presencial

---

## 📐 Layout Mobile (Portrait 9:16)

### Padrão de Tela
```
┌─────────────────────┐
│  Status Bar (Safe)  │ ← 44px (iOS) / 24px (Android)
├─────────────────────┤
│                     │
│    Header/Title     │ ← 56px
│                     │
├─────────────────────┤
│                     │
│   Content Area      │ ← Scrollable
│   (Flex-1)          │
│                     │
├─────────────────────┤
│    Tab Bar (Safe)   │ ← 56px + bottom inset
└─────────────────────┘
```

### Espaçamento Padrão
- **Padding horizontal**: 16px
- **Padding vertical**: 16px
- **Gap entre elementos**: 12px
- **Border radius**: 12px (cards), 8px (inputs)

---

## 🎯 Princípios de Design

1. **Minimalista**: Sem excesso de elementos visuais
2. **Profissional**: Cores sóbrias, tipografia clara
3. **Acessível**: Contraste adequado, textos legíveis
4. **Responsivo**: Funciona em diferentes tamanhos de tela
5. **One-handed**: Elementos interativos no terço inferior
6. **Feedback claro**: Usuário sempre sabe o que está acontecendo

---

## 🚀 Próximos Passos

- [ ] Implementar autenticação (Supabase Auth)
- [ ] Criar banco de dados (Users, Professionals, Appointments, Availability)
- [ ] Desenvolver telas de autenticação
- [ ] Implementar dashboard do paciente
- [ ] Implementar dashboard do profissional
- [ ] Integrar cores e componentes do design system
