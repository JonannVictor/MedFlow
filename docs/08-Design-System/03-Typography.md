# Tipografia (Typography)

| Campo | Valor |
|-------|--------|
| Documento | Typography |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Design System |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

A tipografia é um dos elementos mais importantes da interface do MedFlow.

Como a plataforma é utilizada continuamente por médicos, recepcionistas, enfermeiros e administradores, a leitura rápida das informações é um requisito funcional da aplicação.

O sistema deverá priorizar legibilidade, consistência e hierarquia visual, reduzindo o esforço cognitivo do usuário durante longos períodos de utilização.

Toda interface da plataforma deverá utilizar exclusivamente os estilos tipográficos definidos neste documento.

---

# Objetivos

A tipografia possui os seguintes objetivos:

- Melhorar a legibilidade.
- Criar hierarquia visual.
- Padronizar títulos e conteúdos.
- Facilitar escaneabilidade.
- Melhorar acessibilidade.
- Garantir consistência entre Web e Mobile.

---

# Filosofia Tipográfica

A tipografia do MedFlow segue cinco princípios.

- Clareza
- Consistência
- Legibilidade
- Hierarquia
- Escalabilidade

O usuário nunca deverá precisar aumentar o zoom da aplicação para compreender uma informação.

---

# Família Tipográfica

A plataforma deverá utilizar apenas uma família tipográfica principal.

Características desejadas:

- Sans-serif
- Alta legibilidade
- Boa renderização em telas
- Excelente suporte Unicode
- Compatibilidade Web e Mobile

Caso seja necessária uma segunda família tipográfica, sua utilização deverá ser aprovada pela equipe responsável pelo Design System.

---

# Estrutura Tipográfica

Toda tipografia deverá utilizar Design Tokens.

```text
Typography

├── Display
├── Heading
├── Title
├── Subtitle
├── Body
├── Label
├── Caption
└── Overline
```

---

# Escala Tipográfica

## Display

Utilizada apenas para páginas institucionais ou telas especiais.

Nunca utilizar em formulários ou interfaces operacionais.

---

## Heading

Responsável pelos principais títulos da aplicação.

Exemplos:

- Dashboard
- Pacientes
- Agenda
- Relatórios

---

## Title

Utilizado em:

- Cards
- Modais
- Dialogs
- Widgets
- Seções

---

## Subtitle

Complementa títulos.

Utilizado para pequenas descrições.

---

## Body

Principal estilo de texto do sistema.

Todo conteúdo deverá utilizar Body como padrão.

---

## Label

Utilizado em:

- Inputs
- Selects
- Checkboxes
- Switches
- Radio Buttons

---

## Caption

Informações secundárias.

Exemplos:

- Datas
- Horários
- Informações auxiliares
- Observações

---

## Overline

Utilizado apenas para identificação de categorias.

Uso limitado.

---

# Design Tokens

Os seguintes Tokens deverão existir.

```text
typography.display.xl

typography.display.lg

typography.heading.xl

typography.heading.lg

typography.heading.md

typography.title.lg

typography.title.md

typography.body.lg

typography.body.md

typography.body.sm

typography.label.md

typography.label.sm

typography.caption

typography.overline
```

Todos os componentes deverão consumir apenas estes Tokens.

---

# Pesos Tipográficos

Pesos permitidos.

| Peso | Utilização |
|-------|------------|
| Regular | Texto comum |
| Medium | Ênfase leve |
| SemiBold | Subtítulos |
| Bold | Títulos |

Evitar utilizar pesos extremamente finos ou muito pesados.

---

# Line Height

A altura da linha deverá facilitar leitura prolongada.

Regras:

- Nunca utilizar textos comprimidos.
- Evitar espaços excessivos.
- Priorizar conforto visual.

Toda escala deverá possuir Line Height próprio.

---

# Letter Spacing

O espaçamento entre caracteres deverá seguir Tokens.

Nunca utilizar valores arbitrários.

O objetivo é manter consistência entre plataformas.

---

# Hierarquia Visual

Toda página deverá possuir hierarquia clara.

Exemplo:

```text
Heading

↓

Title

↓

Subtitle

↓

Body

↓

Caption
```

O usuário deve identificar rapidamente:

- onde está;
- qual a informação principal;
- quais informações são complementares.

---

# Alinhamento

O alinhamento padrão deverá ser:

- Esquerda para textos longos.
- Centro apenas para telas específicas.
- Direita apenas para números e valores financeiros.

Evitar centralização excessiva.

---

# Comprimento das Linhas

Para melhorar a leitura:

- Evitar linhas excessivamente longas.
- Evitar blocos muito largos.
- Priorizar leitura horizontal confortável.

---

# Uso em Componentes

## Buttons

Utilizar Label.

Nunca utilizar Heading.

---

## Inputs

Utilizar Label para identificação.

Body para conteúdo digitado.

---

## Cards

Title para título.

Body para descrição.

Caption para informações secundárias.

---

## Tables

Heading para cabeçalhos.

Body para conteúdo.

Caption para observações.

---

## Dialogs

Heading para título.

Body para descrição.

Label para ações.

---

# Responsividade

A escala tipográfica deverá adaptar-se automaticamente.

Desktop poderá utilizar tamanhos maiores.

Tablets utilizarão escala intermediária.

Nunca reduzir a legibilidade em telas menores.

---

# Acessibilidade

Toda tipografia deverá atender às recomendações WCAG.

Boas práticas:

- Contraste adequado.
- Não utilizar apenas cor para comunicar importância.
- Evitar textos pequenos.
- Suportar aumento de fonte.
- Preservar legibilidade com Zoom.

---

# Performance

Boas práticas:

- Limitar quantidade de pesos carregados.
- Evitar múltiplas famílias tipográficas.
- Utilizar fontes otimizadas.
- Priorizar carregamento rápido.

---

# Casos de Uso

## Correto

✔ Heading para títulos.

✔ Body para conteúdos.

✔ Caption para informações secundárias.

✔ Label para componentes interativos.

---

## Incorreto

✘ Utilizar Heading em botões.

✘ Misturar pesos aleatoriamente.

✘ Criar novos tamanhos sem documentação.

✘ Utilizar textos muito pequenos.

---

# Anti-Padrões

São considerados Anti-Padrões:

- Hardcode de tamanho.
- Hardcode de peso.
- Múltiplas famílias tipográficas.
- Misturar estilos sem hierarquia.
- Utilizar Display em interfaces operacionais.
- Ignorar Design Tokens.

---

# Decisões Arquiteturais

## ADR-027

Toda tipografia deverá utilizar Design Tokens.

---

## ADR-028

Nenhum componente poderá definir tamanho de fonte manualmente.

---

## ADR-029

A hierarquia visual deverá permanecer consistente entre Web e Mobile.

---

## ADR-030

Novos estilos tipográficos somente poderão ser adicionados mediante atualização deste documento.

---

# Boas Práticas

- Utilizar Tokens.
- Priorizar legibilidade.
- Manter consistência.
- Evitar excesso de pesos.
- Respeitar hierarquia visual.
- Validar acessibilidade.
- Não utilizar textos menores que o mínimo definido pelo Design System.

---

# Considerações Finais

A tipografia do MedFlow foi concebida para suportar longos períodos de utilização em ambientes clínicos, onde rapidez de leitura e precisão são essenciais. A utilização de uma escala tipográfica consistente, baseada em Design Tokens, garante uniformidade entre plataformas, facilita manutenção e permite evolução contínua da interface sem comprometer a identidade visual da plataforma.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação inicial do documento | Equipe MedFlow |