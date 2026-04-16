# MedFlow - Project TODO

## Fase 1: Configuracao Inicial
- [x] Atualizar design system (cores, tipografia)
- [x] Configurar banco de dados (Supabase)
- [x] Configurar autenticacao (Supabase Auth)
- [x] Criar estrutura de navegacao (Auth Stack + App Stack)
- [x] Gerar logo e icone do app

## Fase 2: Autenticacao
- [x] Tela de Landing Page
- [x] Tela de Login
- [x] Tela de Cadastro Paciente
- [x] Tela de Cadastro Profissional
- [x] Integracao com Supabase Auth
- [x] Persistencia de sessao

## Fase 3: Dashboard Paciente
- [x] Tela Home (busca de profissionais)
- [ ] Tela de Agendamento
- [x] Tela de Minhas Consultas
- [x] Tela de Perfil Paciente
- [x] Filtros de busca (especialidade, disponibilidade)
- [x] Integracao com banco de dados

## Fase 4: Dashboard Profissional
- [x] Tela de Agenda
- [x] Tela de Consultas Recebidas
- [x] Tela de Perfil Profissional
- [x] Gerenciamento de horarios disponiveis
- [x] Aceitar/recusar consultas

## Fase 5: Design System
- [x] Aplicar paleta de cores (azul, branco, cinza)
- [x] Implementar componentes reutilizaveis
- [x] Garantir consistencia visual
- [ ] Testar modo claro/escuro

## Fase 6: Refinamentos
- [ ] Validacoes de formularios
- [ ] Mensagens de erro/sucesso
- [x] Loading states
- [ ] Tratamento de edge cases

## Fase 7: Entrega
- [ ] Criar checkpoint final
- [ ] Gerar APK/IPA
- [ ] Instrucoes de uso

## Fase Futura: Marketplace e Repasse
- [ ] Integrar Mercado Pago Marketplace com OAuth por profissional
- [ ] Implementar split automatico de pagamentos
- [ ] Configurar comissao automatica de 10% para a plataforma
- [ ] Repassar 90% automaticamente ao medico
- [ ] Validar onboarding financeiro do profissional

## Fase 8: Dashboard Profissional (Em Desenvolvimento)
- [x] Tela Home Profissional (proximas consultas)
- [x] Tela de Agenda (calendario)
- [x] Tela de Perfil Profissional
- [x] Navegacao entre tabs profissional

## Fase 9: Fluxo de Agendamento
- [x] Tela de Detalhes do Profissional
- [x] Seletor de Data
- [x] Seletor de Horario
- [x] Confirmacao de Agendamento
- [x] Integracao com banco de dados
- [x] Conectar horarios reais da tabela `availability` na tela de agendamento

## Fase 10: Integracao de Autenticacao
- [x] Cadastro Paciente funcional com banco
- [x] Cadastro Profissional funcional com banco
- [x] Login funcional com banco
- [x] Persistencia de sessao
- [x] Redirecionamento baseado em tipo de usuario

## Fase 11: Navegacao e Fluxos
- [x] Landing -> Login
- [x] Login -> Dashboard (paciente/profissional)
- [x] Dashboard -> Agendamento
- [x] Botao "Agendar" da lista de profissionais navega para a rota de booking
- [x] Logout -> Landing
- [x] Protecao de rotas autenticadas

## Fase 12: Integracao Supabase
- [x] Configurar variaveis de ambiente (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [x] Instalar pacotes @supabase/supabase-js e @supabase/auth-js
- [x] Criar cliente Supabase (lib/supabase.ts)
- [x] Implementar hook useAuthSupabase com signup, login, logout
- [x] Conectar cadastro paciente ao Supabase
- [x] Conectar cadastro profissional ao Supabase
- [x] Conectar login ao Supabase
- [x] Persistir sessao em AsyncStorage
- [x] Validar credenciais com testes

## Fase 13: Correcao de Navegacao (Concluida)
- [x] Criar app/index.tsx como rota inicial
- [x] Implementar redirecionamento baseado em autenticacao
- [x] Criar app/(tabs)/_layout.tsx para renderizar layout correto
- [x] Corrigir estrutura de rotas em app/_layout.tsx
- [x] Corrigir tipagem de environment variables
- [x] Remover erro "Unmatched Route"
- [x] Garantir fluxo correto: nao logado -> landing, logado -> tabs

## Bug Critico: Unmatched Route apos login (Corrigido)
- [x] Diagnosticar redirecionamento apos login
- [x] Corrigir rota de destino para /(tabs)/patient ou /(tabs)/professional
- [x] Corrigir app/index.tsx para redirecionar baseado em userType
- [x] Corrigir hooks/use-unified-auth-redirect.ts
- [x] Corrigir app/(tabs)/_layout.tsx para usar Slot
- [x] Remover conteudo condicional de app/_layout.tsx
- [x] Testar fluxo completo

## Fase 14: Recuperacao do Backup
- [x] Ler o backup e reconstruir a arquitetura atual do projeto
- [x] Instalar dependencias com pnpm
- [x] Restaurar variaveis de ambiente do Supabase em `.env`
- [x] Ajustar `scripts/inject-env.js` para nao sobrescrever credenciais preservadas
- [x] Corrigir e habilitar a suite de testes basica
- [x] Validar o projeto com TypeScript
- [x] Conectar fluxo de agendamento e consultas ao Supabase no codigo
- [x] Preparar schema SQL do Supabase para `professionals` e `appointments`
- [x] Corrigir navegacao das abas do profissional (`consultas` e `perfil`)
- [x] Remover mock do perfil profissional e preencher dados reais do cadastro
- [x] Adicionar trigger/backfill no SQL para criar profissionais a partir do signup
- [x] Persistir horarios disponiveis do profissional no codigo
- [x] Garantir criacao automatica do registro profissional antes de salvar agenda
- [x] Corrigir erro de ordem de hooks na tela de agendamento do paciente
- [x] Corrigir script `dev:metro` para subir corretamente no Windows
- [x] Corrigir selecao de datas do agendamento para nao mudar o dia por causa do fuso
- [x] Ocultar horarios ja reservados da tela de agendamento
- [x] Bloquear criacao de consulta em horario indisponivel ou ja ocupado
- [x] Adicionar link padrao de videochamada no perfil profissional
- [x] Fazer `Entrar/Iniciar Consulta` abrir o link da consulta
- [x] Sincronizar link de videochamada em consultas confirmadas sem link
- [x] Ligar acoes rapidas da home do profissional
- [x] Evitar toques repetidos nas acoes de confirmar, recusar e cancelar consultas
- [x] Melhorar feedback de sucesso e erro nas acoes principais de consulta
- [x] Manter o botao `Confirmar Consulta` visivel para o profissional mesmo antes do pagamento
- [x] Criar fluxo de pagamento com Mercado Pago via Checkout Pro
- [x] Abrir checkout do pagamento antes de confirmar a consulta
- [x] Confirmar consulta apenas apos retorno com pagamento aprovado
- [x] Preparar colunas e envs para status e referencia de pagamento
- [x] Aplicar `supabase/schema.sql` no projeto Supabase remoto
- [x] Popular `public.professionals` com pelo menos um profissional real para validar o fluxo do paciente
- [ ] Investigar instabilidade do `dev:server` ao subir fora do sandbox (`exit code 3221225786`)
- [x] Subir o app localmente e validar o boot web
- [ ] Definir a proxima frente principal de desenvolvimento apos a retomada
