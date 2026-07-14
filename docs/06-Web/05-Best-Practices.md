# Boas Práticas Web (Best Practices)

| Campo | Valor |
|-------|--------|
| Documento | Best Practices |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Web |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

Este documento estabelece os padrões oficiais para o desenvolvimento da aplicação Web do MedFlow.

Seu objetivo é garantir consistência arquitetural, qualidade do código, facilidade de manutenção, escalabilidade e previsibilidade durante toda a evolução da plataforma.

As diretrizes descritas neste documento são obrigatórias para qualquer desenvolvedor que contribua com o projeto.

---

# Objetivos

As boas práticas da aplicação Web possuem os seguintes objetivos:

- Padronizar o desenvolvimento.
- Facilitar manutenção.
- Melhorar legibilidade.
- Reduzir débito técnico.
- Garantir escalabilidade.
- Melhorar performance.
- Aumentar segurança.
- Facilitar testes.
- Simplificar onboarding de novos desenvolvedores.

---

# Filosofia de Desenvolvimento

O desenvolvimento do MedFlow deverá seguir os seguintes princípios.

- Clean Code
- Clean Architecture
- SOLID
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)
- YAGNI (You Aren't Gonna Need It)
- Separation of Concerns
- Composition over Inheritance

Esses princípios devem orientar qualquer decisão técnica dentro da aplicação.

---

# Organização do Projeto

A estrutura da aplicação deverá permanecer organizada por domínio de negócio.

```text
src/

├── app/
├── assets/
├── components/
├── features/
├── layouts/
├── hooks/
├── contexts/
├── services/
├── repositories/
├── routes/
├── models/
├── types/
├── constants/
├── utils/
├── styles/
├── localization/
└── tests/
```

Nenhuma Feature deverá depender diretamente da implementação interna de outra Feature.

---

# Organização das Features

Cada Feature deverá possuir estrutura própria.

```text
patients/

├── components/
├── pages/
├── hooks/
├── services/
├── models/
├── validations/
├── types/
├── utils/
└── tests/
```

Toda regra relacionada ao domínio deverá permanecer dentro da própria Feature.

---

# Componentização

Todo componente deverá possuir responsabilidade única.

Estrutura recomendada:

```text
Component

↓

Props

↓

State

↓

Events

↓

Render
```

Evitar componentes excessivamente grandes.

Caso um componente ultrapasse aproximadamente 300 linhas de código, deverá ser avaliada sua divisão em componentes menores.

---

# Componentes Compartilhados

Componentes reutilizáveis deverão permanecer em:

```text
components/
```

Exemplos:

- Button
- Card
- Modal
- Table
- Badge
- Avatar
- Snackbar
- Dialog
- Input
- Select
- Loading
- EmptyState

Nunca duplicar componentes entre Features.

---

# Nomenclatura

## Componentes

Utilizar PascalCase.

Exemplos:

```text
PatientCard
AppointmentTable
DashboardWidget
```

---

## Hooks

Sempre iniciar com "use".

Exemplos:

```text
useAuth()
usePatient()
useDashboard()
```

---

## Services

Sempre utilizar o sufixo Service.

Exemplos:

```text
PatientService
AppointmentService
NotificationService
```

---

## Repositories

Sempre utilizar o sufixo Repository.

Exemplos:

```text
PatientRepository
ReportRepository
```

---

## Interfaces

Sempre iniciar com "I" apenas quando necessário e padronizado no projeto.

Preferencialmente utilizar Type quando a linguagem oferecer melhor ergonomia.

---

# Gerenciamento de Estado

Os estados deverão ser classificados em:

## Local State

Utilizado apenas pelo componente.

---

## Feature State

Compartilhado entre componentes da mesma Feature.

---

## Global State

Compartilhado entre toda aplicação.

Exemplos:

- Usuário
- Tema
- Sessão
- Permissões

---

## Remote State

Dados provenientes da API.

Nunca duplicar Remote State desnecessariamente.

---

# Comunicação com API

Toda comunicação deverá seguir o fluxo abaixo.

```text
Component

↓

Hook

↓

Service

↓

Repository

↓

HTTP Client

↓

API
```

Componentes nunca deverão consumir APIs diretamente.

---

# Tratamento de Erros

Todo erro deverá seguir fluxo padronizado.

```text
Erro

↓

Logger

↓

Tratamento

↓

Mensagem amigável

↓

Recuperação
```

Mensagens técnicas nunca deverão ser apresentadas ao usuário final.

---

# Performance

A aplicação deverá utilizar:

- Lazy Loading.
- Code Splitting.
- Memoization.
- Debounce.
- Throttle.
- Virtualização.
- Cache.
- Paginação.

Sempre priorizar renderizações parciais.

---

# Segurança

Todas as funcionalidades deverão seguir Security by Design.

Obrigatório:

- HTTPS.
- CSP.
- Sanitização.
- Escape de conteúdo.
- Proteção contra XSS.
- Proteção contra CSRF.
- Validação de permissões.
- Validação de sessão.
- Logout automático quando necessário.

---

# Acessibilidade (Accessibility)

Toda interface deverá seguir recomendações WCAG.

Boas práticas:

- Navegação por teclado.
- Labels apropriadas.
- Contraste adequado.
- Leitores de tela.
- Áreas de clique adequadas.
- Feedback visual.

---

# Responsividade

A aplicação deverá oferecer experiência consistente em:

- Desktop
- Notebook
- Tablet

A interface deverá adaptar-se automaticamente aos diferentes tamanhos de tela.

---

# Logs

Registrar apenas eventos relevantes.

Exemplos:

- Falhas.
- Exceções.
- Login.
- Logout.
- Alterações críticas.
- Erros inesperados.

Nunca registrar:

- Senhas.
- Tokens.
- Dados médicos.
- Informações protegidas pela LGPD.

---

# Testes

Todo módulo deverá possuir cobertura de testes.

Tipos obrigatórios:

- Unit Tests
- Integration Tests
- Component Tests

Tipos recomendados:

- End-to-End Tests (E2E)
- Visual Regression Tests

---

# Versionamento

Utilizar Git como sistema oficial de versionamento.

Boas práticas:

- Branches pequenas.
- Commits objetivos.
- Pull Requests revisados.
- Code Review obrigatório.
- Merge apenas após aprovação.

---

# Convenção de Commits

Padrão recomendado:

```text
feat:
fix:
docs:
style:
refactor:
perf:
test:
build:
ci:
chore:
```

Exemplo:

```text
feat(patient): adicionar cadastro de pacientes

fix(login): corrigir renovação automática do token

refactor(report): reorganizar geração de gráficos
```

---

# Documentação

Toda alteração deverá possuir documentação correspondente.

Atualizar sempre que houver mudanças em:

- Arquitetura.
- API.
- Banco de Dados.
- Fluxos.
- Permissões.
- Regras de Negócio.

Código sem documentação não deverá ser considerado concluído.

---

# Critérios para Aprovação de Pull Request

Um Pull Request somente poderá ser aprovado quando:

- Código revisado.
- Testes executados.
- Linter sem erros.
- Build concluída.
- Documentação atualizada.
- Sem conflitos.
- Arquitetura respeitada.
- Performance validada.

---

# Checklist de Desenvolvimento

Antes de concluir qualquer funcionalidade verificar:

- Arquitetura respeitada.
- Código limpo.
- Componentes reutilizados.
- Sem duplicação.
- Tratamento de erros implementado.
- Testes escritos.
- Documentação atualizada.
- Performance validada.
- Segurança revisada.
- Acessibilidade considerada.

---

# Anti-Padrões

As seguintes práticas são proibidas no projeto:

- Componentes gigantes.
- Duplicação de código.
- Chamadas diretas à API pela interface.
- Regras de negócio dentro de componentes.
- Dependências circulares.
- Variáveis com nomes genéricos.
- Comentários desnecessários para explicar código mal escrito.
- Uso de `any` sem justificativa.
- Hardcode de URLs, Tokens ou configurações.

---

# Decisões Arquiteturais

## ADR-015

Toda lógica de negócio deverá permanecer fora da camada de apresentação.

---

## ADR-016

Nenhuma Feature poderá acessar diretamente outra Feature.

A comunicação deverá ocorrer através de Services, eventos ou estados compartilhados.

---

## ADR-017

Todo componente deverá ser reutilizável sempre que possível.

Duplicação somente será aceita mediante justificativa técnica.

---

## ADR-018

Toda nova funcionalidade deverá respeitar a estrutura modular definida pela arquitetura do MedFlow.

---

# Métricas de Qualidade

O projeto deverá monitorar continuamente:

| Indicador | Objetivo |
|-----------|----------|
| Cobertura de Testes | ≥ 80% |
| Tempo de Build | Reduzido |
| Tempo de Carregamento | < 2 segundos |
| Erros em Produção | Mínimos |
| Débito Técnico | Controlado |
| Componentes Reutilizados | Elevado |
| Performance (Lighthouse) | ≥ 90 |
| Acessibilidade (Lighthouse) | ≥ 95 |

---

# Considerações Finais

As boas práticas definidas neste documento estabelecem o padrão oficial para o desenvolvimento da aplicação Web do MedFlow. Seu cumprimento garante que o sistema permaneça consistente, escalável e de fácil manutenção ao longo dos anos, independentemente da equipe responsável pela evolução da plataforma.

Este documento deverá ser considerado referência obrigatória durante a implementação de novas funcionalidades, revisões de código e processos de onboarding de novos desenvolvedores.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação inicial do documento | Equipe MedFlow |