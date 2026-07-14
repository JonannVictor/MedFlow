# Espaçamento (Spacing)

| Campo | Valor |
|-------|--------|
| Documento | Spacing |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Design System |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

O sistema de espaçamento (**Spacing System**) define a distância entre todos os elementos da interface do MedFlow.

Um espaçamento consistente melhora significativamente a legibilidade, reduz a carga cognitiva do usuário e transmite organização visual.

Nenhum componente deverá utilizar valores arbitrários de margem ou preenchimento. Todo espaçamento deverá ser obtido através dos **Spacing Tokens** definidos neste documento.

---

# Objetivos

O sistema de espaçamento possui os seguintes objetivos:

- Padronizar a interface.
- Melhorar a organização visual.
- Facilitar manutenção.
- Reduzir inconsistências.
- Melhorar responsividade.
- Tornar componentes reutilizáveis.
- Facilitar implementação.

---

# Filosofia

O MedFlow utiliza um sistema baseado em uma **escala de 4px**.

Todos os espaçamentos da plataforma deverão ser múltiplos desta unidade.

Essa abordagem garante previsibilidade e consistência em todas as interfaces.

---

# Escala Oficial

## Design Tokens

| Token | Valor |
|--------|-------|
| space.0 | 0px |
| space.1 | 4px |
| space.2 | 8px |
| space.3 | 12px |
| space.4 | 16px |
| space.5 | 20px |
| space.6 | 24px |
| space.8 | 32px |
| space.10 | 40px |
| space.12 | 48px |
| space.16 | 64px |
| space.20 | 80px |
| space.24 | 96px |
| space.32 | 128px |

Estes Tokens representam a única fonte oficial para definição de espaçamentos.

---

# Estrutura

```text
Spacing

├── Margin
├── Padding
├── Gap
├── Grid
├── Container
└── Section
```

Cada categoria possui finalidade específica.

---

# Padding

Padding representa o espaço interno de um componente.

Aplicações:

- Buttons
- Cards
- Inputs
- Dialogs
- Tables
- Sidebars

Nunca utilizar valores diferentes dos Tokens oficiais.

---

# Margin

Margin representa o espaço externo entre componentes.

Utilizações:

- Separação entre Cards.
- Distância entre Seções.
- Espaçamento entre formulários.
- Organização vertical.

Evitar Margin negativo.

---

# Gap

Sempre utilizar **Gap** para organizar elementos em:

- Flex Layout
- Grid Layout
- Lists

Evitar substituir Gap por Margin entre elementos irmãos.

---

# Espaçamento entre Componentes

Recomendações:

| Componentes | Token |
|--------------|-------|
| Button ↔ Button | space.2 |
| Campo ↔ Campo | space.4 |
| Card ↔ Card | space.6 |
| Seção ↔ Seção | space.12 |
| Página ↔ Página | space.16 |

---

# Espaçamento Interno

Valores recomendados:

| Componente | Padding |
|-------------|---------|
| Button | space.3 |
| Input | space.3 |
| Card | space.4 |
| Modal | space.6 |
| Dialog | space.6 |
| Sidebar | space.4 |

---

# Layout

Toda página deverá seguir uma hierarquia consistente.

```text
Container

↓

Header

↓

Content

↓

Section

↓

Card

↓

Component
```

Cada nível deverá possuir espaçamento proporcional.

---

# Grid

O Layout deverá utilizar Grid consistente.

Recomendações:

- Grid responsivo.
- Espaçamento uniforme.
- Colunas alinhadas.
- Containers consistentes.

O Grid deverá utilizar os mesmos Tokens do sistema de espaçamento.

---

# Containers

Os Containers deverão respeitar Padding padrão.

Nunca encostar conteúdo nas bordas da tela.

Estrutura recomendada:

```text
Tela

↓

Container

↓

Section

↓

Card

↓

Conteúdo
```

---

# Formulários

Espaçamento recomendado:

```text
Label

↓

space.2

↓

Input

↓

space.4

↓

Próximo Campo
```

Grupos relacionados deverão permanecer visualmente próximos.

---

# Cards

Estrutura recomendada:

```text
Card

↓

Padding

↓

Título

↓

space.3

↓

Conteúdo

↓

space.4

↓

Ações
```

O conteúdo nunca deverá tocar as bordas.

---

# Tabelas

Espaçamento interno:

- Linhas confortáveis.
- Cabeçalhos destacados.
- Padding uniforme.

Evitar tabelas excessivamente compactas.

---

# Sidebar

A Sidebar deverá utilizar espaçamentos constantes.

Itens relacionados deverão permanecer agrupados.

Separações deverão utilizar múltiplos da escala oficial.

---

# Responsividade

O sistema de espaçamento deverá adaptar-se automaticamente.

Desktop poderá utilizar espaçamentos maiores.

Tablet utilizará escala intermediária.

Nunca reduzir drasticamente o espaço entre elementos.

---

# Densidade da Interface

O MedFlow adota densidade **Comfortable**.

Objetivos:

- Melhor leitura.
- Facilidade de interação.
- Redução de erros.

Interfaces excessivamente compactas são desencorajadas.

---

# Casos de Uso

## Correto

✔ Utilizar Tokens.

✔ Utilizar Gap.

✔ Manter ritmo visual.

✔ Agrupar informações relacionadas.

---

## Incorreto

✘ Utilizar valores como 13px, 17px ou 29px.

✘ Criar espaçamentos diferentes para componentes iguais.

✘ Misturar múltiplas escalas.

✘ Utilizar Margin negativo.

---

# Anti-Padrões

São considerados Anti-Padrões:

- Hardcode de espaçamento.
- Padding diferente em componentes iguais.
- Margin arbitrário.
- Espaçamento inconsistente.
- Ignorar Grid.
- Encostar conteúdo nas bordas da tela.

---

# Decisões Arquiteturais

## ADR-031

Todo espaçamento deverá utilizar exclusivamente os Spacing Tokens.

---

## ADR-032

É proibido utilizar valores arbitrários de Margin ou Padding.

---

## ADR-033

Componentes compartilhados deverão possuir espaçamento interno padronizado.

---

## ADR-034

Toda nova interface deverá respeitar a escala oficial de 4px.

---

# Referência de Implementação

A documentação deste módulo deverá resultar em um arquivo semelhante a:

```text
tokens/

spacing.ts
```

Estrutura esperada:

```text
spacing

├── 0
├── 1
├── 2
├── 3
├── 4
├── 5
├── 6
├── 8
├── 10
├── 12
├── 16
├── 20
├── 24
└── 32
```

Todos os componentes deverão consumir estes Tokens.

---

# Boas Práticas

- Utilizar apenas Tokens.
- Manter ritmo visual consistente.
- Utilizar Gap em layouts.
- Evitar Margin negativo.
- Agrupar informações relacionadas.
- Separar grupos distintos visualmente.
- Priorizar conforto visual.

---

# Considerações Finais

O sistema de espaçamento do MedFlow estabelece um padrão único para organização visual da plataforma. A utilização consistente dos Spacing Tokens garante interfaces organizadas, facilita manutenção, melhora a experiência dos usuários e simplifica a implementação por diferentes equipes de desenvolvimento.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação inicial do documento | Equipe MedFlow |