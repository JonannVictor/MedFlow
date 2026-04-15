# MedFlow — Documentação do Projeto

## 🎯 Visão Geral

**MedFlow** é uma plataforma de saúde digital que conecta pacientes e profissionais de saúde para consultas online de triagem. O aplicativo permite que pacientes busquem profissionais por especialidade, agendem consultas e gerenciem seu histórico de consultas. Profissionais podem gerenciar sua agenda, visualizar consultas recebidas e manter seu perfil atualizado.

**Stack Tecnológico:**
- **Frontend**: React Native com Expo SDK 54, TypeScript, NativeWind (Tailwind CSS)
- **Backend**: Node.js com Express, tRPC, Drizzle ORM
- **Banco de Dados**: MySQL (Supabase)
- **Autenticação**: Supabase Auth (OAuth)
- **Estado**: React Context + AsyncStorage
- **API**: tRPC para comunicação cliente-servidor

---

## 🔐 Autenticação e Fluxo de Usuário (CORRIGIDO - ENGENHEIRO SENIOR)

### 🎯 Solução Final Implementada

**PROBLEMA IDENTIFICADO:**
- Dois sistemas de auth separados: `useAuth` (Manus OAuth) e `useAuthSupabase` (Supabase)
- Professional screens usavam `useAuth` que não reconhecia usuários Supabase
- Resultado: "Acesso Restrito" mesmo após login bem-sucedido

**SOLUÇÃO IMPLEMENTADA:**
1. **`useUnifiedAuth`** - Hook único de autenticação com Supabase
2. **`useUnifiedAuthRedirect`** - Redirecionamento simples (não autenticado → landing | autenticado → tabs)
3. **`useRouteProtection`** - Proteção de rotas por userType
4. **Todas as telas** usam `useUnifiedAuth` (paciente e profissional)

### 📱 Fluxo de Login Corrigido

```
1. Usuário acessa app
   ↓
2. useUnifiedAuthRedirect verifica se está autenticado
   ├─ Não autenticado → Redireciona para "landing"
   └─ Autenticado → Redireciona para "(tabs)"
   ↓
3. Usuário clica "Entrar" na landing
   ↓
4. Preenche email/senha e clica "Login"
   ↓
5. useUnifiedAuth.login() autentica com Supabase
   ├─ Sucesso → Salva sessão em AsyncStorage
   ├─ Busca userType do Supabase metadata
   └─ Atualiza estado de autenticação
   ↓
6. useUnifiedAuthRedirect detecta autenticação
   ↓
7. Redireciona para "(tabs)"
   ↓
8. Layout de tabs renderiza telas corretas:
   ├─ Se userType === "patient" → Tabs de paciente
   └─ Se userType === "professional" → Tabs de profissional
```

### 🔑 Campos Obrigatórios no Banco

Todo usuário deve ter:
- `id` (UUID)
- `email` (string, unique)
- `userType` (enum: "patient" | "professional") - **OBRIGATÓRIO**
- `createdAt` (timestamp)

### 📝 Cadastro Corrigido

**Paciente:**
```
1. Clica "Sou Paciente" na landing
2. Preenche: nome, email, senha
3. Clica "Cadastrar"
4. useUnifiedAuth.signup(email, password, "patient", name)
5. Cria usuário no Supabase com userType = "patient"
6. Redireciona para login
```

**Profissional:**
```
1. Clica "Sou Profissional" na landing
2. Preenche: nome, email, senha, especialidade, CRM
3. Clica "Cadastrar"
4. useUnifiedAuth.signup(email, password, "professional", name)
5. Cria usuário no Supabase com userType = "professional"
6. Redireciona para login
```

### 🛡️ Proteção de Rotas

- **Layout de tabs** renderiza telas diferentes baseado em `userType`
- **Professional screens** têm safety check que mostra "Acesso Restrito" se userType !== "professional"
- **Patient screens** renderizam normalmente para pacientes
- **Redirecionamento automático** previne acesso a rotas inválidas

### 🔄 Persistência de Sessão

1. Ao fazer login, `useUnifiedAuth` salva sessão em AsyncStorage
2. Ao abrir o app, `useUnifiedAuth` restaura sessão do AsyncStorage
3. Se sessão válida, `isAuthenticated = true`
4. `useUnifiedAuthRedirect` redireciona automaticamente para "(tabs)"

---

## 📋 Estrutura do Projeto

```
medflow-app/
├── app/                          # Rotas e telas (Expo Router)
│   ├── _layout.tsx              # Layout raiz com providers
│   ├── landing.tsx              # Tela inicial (Landing Page)
│   ├── auth/                    # Fluxo de autenticação
│   │   ├── _layout.tsx
│   │   ├── login.tsx            # Tela de Login
│   │   ├── patient-signup.tsx   # Cadastro Paciente
│   │   └── professional-signup.tsx # Cadastro Profissional
│   ├── (tabs)/                  # Dashboard com abas
│   │   ├── _layout.tsx          # Configuração de tabs dinâmicas
│   │   ├── index.tsx            # Home Paciente (busca profissionais)
│   │   ├── appointments.tsx     # Minhas Consultas (Paciente)
│   │   ├── profile.tsx          # Perfil Paciente
│   │   ├── professional-home.tsx    # Home Profissional
│   │   ├── professional-schedule.tsx # Agenda Profissional
│   │   └── professional-profile.tsx  # Perfil Profissional
│   └── professional-detail.tsx  # Detalhes do profissional + agendamento
├── hooks/
│   ├── use-unified-auth.ts      # Hook unificado de autenticação (CRÍTICO)
│   ├── use-unified-auth-redirect.ts # Hook de redirecionamento (CRÍTICO)
│   ├── use-route-protection.ts  # Hook de proteção de rotas
│   ├── use-colors.ts            # Hook de cores do tema
│   └── use-color-scheme.ts      # Hook de modo claro/escuro
├── lib/
│   ├── supabase.ts              # Cliente Supabase
│   ├── trpc.ts                  # Cliente tRPC
│   └── utils.ts                 # Utilitários (cn)
├── components/
│   ├── screen-container.tsx     # Wrapper SafeArea
│   └── ui/
│       └── icon-symbol.tsx      # Mapeamento de ícones
├── server/
│   ├── routers.ts               # Rotas tRPC
│   ├── db.ts                    # Funções de banco de dados
│   └── README.md                # Documentação do servidor
├── drizzle/
│   └── schema.ts                # Schema do banco de dados
├── app.config.ts                # Configuração Expo
├── tailwind.config.js           # Configuração Tailwind
├── theme.config.js              # Paleta de cores
└── PROJECT_INFO.md              # Este arquivo
```

---

## 🚀 Como Usar

### Desenvolvimento Local

```bash
# Instalar dependências
pnpm install

# Iniciar dev server
pnpm dev

# Abrir Expo Go no celular e escanear QR code
```

### Testar Fluxo de Autenticação

1. **Criar conta de paciente:**
   - Clique "Sou Paciente"
   - Preencha dados e clique "Cadastrar"
   - Será redirecionado para login
   - Faça login com as credenciais

2. **Criar conta de profissional:**
   - Clique "Sou Profissional"
   - Preencha dados (incluindo especialidade e CRM)
   - Clique "Cadastrar"
   - Será redirecionado para login
   - Faça login com as credenciais

3. **Verificar redirecionamento:**
   - Paciente deve ver: Home (busca), Consultas, Perfil
   - Profissional deve ver: Home, Agenda, Perfil

---

## 🐛 Logs para Debug

Adicione `console.log` em:
- `hooks/use-unified-auth.ts` - Autenticação
- `hooks/use-unified-auth-redirect.ts` - Redirecionamento
- `app/auth/login.tsx` - Login
- `app/auth/patient-signup.tsx` - Cadastro paciente
- `app/auth/professional-signup.tsx` - Cadastro profissional

Procure por tags `[useUnifiedAuth]`, `[useUnifiedAuthRedirect]`, `[Login]`, etc.

---

## ✅ Checklist de Implementação

- [x] Unificar auth sources (useUnifiedAuth)
- [x] Corrigir redirecionamento (useUnifiedAuthRedirect)
- [x] Implementar proteção de rotas (useRouteProtection)
- [x] Corrigir professional screens (usar useUnifiedAuth)
- [x] Garantir userType obrigatório no banco
- [x] Adicionar logs para debug
- [x] Testar fluxos end-to-end

---

## 📞 Suporte

Para problemas com autenticação:
1. Verifique os logs no console
2. Confirme que userType está sendo salvo no Supabase
3. Verifique se as variáveis de ambiente estão configuradas
4. Teste com credenciais diferentes


---

## 🔧 Correção de Navegação (Fase 13 - Concluída)

### ✅ Problema Resolvido: "Unmatched Route"

**Causa:** O app não tinha uma rota inicial e tentava navegar para rotas específicas dentro de grupos de rotas.

**Solução:**

1. **`app/index.tsx`** - Rota inicial que verifica autenticação e redireciona
2. **`app/(tabs)/_layout.tsx`** - Layout que renderiza tabs correto baseado em userType
3. **`app/_layout.tsx`** - Simplificado para registrar apenas rotas necessárias
4. **`hooks/use-unified-auth-redirect.ts`** - Redirecionamento simplificado

### 🔄 Fluxo Correto

App abre → app/index.tsx → Verifica autenticação → /landing ou /(tabs) → Layout renderiza tela correta
