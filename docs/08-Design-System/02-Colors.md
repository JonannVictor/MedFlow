# Cores (Colors)

| Campo | Valor |
|-------|--------|
| Documento | Colors |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Design System |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

As cores são um dos pilares do Design System do MedFlow.

Além da função estética, elas possuem papel fundamental na comunicação visual da plataforma, auxiliando usuários na identificação de estados, prioridades, ações e informações críticas.

A paleta foi projetada para transmitir confiança, profissionalismo e clareza, características essenciais para um sistema utilizado diariamente por profissionais da saúde.

Todas as interfaces Web e Mobile deverão utilizar exclusivamente as cores documentadas neste arquivo.

---

# Objetivos

A paleta de cores possui os seguintes objetivos:

- Criar identidade visual consistente.
- Facilitar reconhecimento de elementos.
- Melhorar legibilidade.
- Garantir acessibilidade.
- Comunicar estados da aplicação.
- Reduzir carga cognitiva.
- Facilitar manutenção da interface.

---

# Filosofia da Paleta

O MedFlow utiliza uma paleta baseada em poucos grupos de cores.

Cada grupo possui uma responsabilidade específica.

Nenhuma cor deve ser utilizada apenas por preferência estética.

Toda cor comunica uma informação.

---

# Estrutura das Cores

Todas as cores deverão ser organizadas em **Design Tokens**.

```text
Color

├── Brand
├── Semantic
├── Neutral
├── Background
├── Surface
├── Border
├── Text
├── Overlay
└── States
```

Essa organização facilita manutenção, troca de temas e futuras evoluções.

---

# Brand Colors

As Brand Colors representam a identidade visual do MedFlow.

Escala recomendada:

| Token | Utilização |
|--------|------------|
| Brand 50 | Fundos muito claros |
| Brand 100 | Hover muito leve |
| Brand 200 | Componentes suaves |
| Brand 300 | Elementos secundários |
| Brand 400 | Apoio visual |
| Brand 500 | Cor principal da plataforma |
| Brand 600 | Hover |
| Brand 700 | Pressed |
| Brand 800 | Elementos escuros |
| Brand 900 | Máximo contraste |

A cor **Brand 500** representa oficialmente a identidade do MedFlow.

---

# Semantic Colors

As Semantic Colors comunicam estados da aplicação.

## Success

Utilizada para:

- Cadastro realizado.
- Atualização concluída.
- Operações bem-sucedidas.

Nunca utilizar para ações clicáveis.

---

## Warning

Utilizada para:

- Atenção.
- Pendências.
- Informações importantes.

Não representa erro.

---

## Error

Utilizada para:

- Falhas.
- Campos inválidos.
- Operações canceladas.
- Problemas críticos.

Deve chamar atenção imediatamente.

---

## Info

Utilizada para:

- Informações.
- Atualizações.
- Avisos neutros.

Não representa sucesso nem erro.

---

# Neutral Colors

As Neutral Colors são responsáveis pela estrutura visual da interface.

Escala recomendada:

```text
Neutral

50

100

200

300

400

500

600

700

800

900
```

Utilizações:

- Background
- Textos
- Bordas
- Divisores
- Cards

---

# Background Colors

As cores de fundo possuem função estrutural.

Categorias:

- App Background
- Screen Background
- Card Background
- Modal Background
- Sidebar Background
- Overlay Background

Evitar utilizar Brand Colors como fundo principal.

---

# Surface Colors

Surface representa superfícies elevadas.

Exemplos:

- Cards
- Dialogs
- Bottom Sheets
- Menus
- Popovers

Toda Surface deverá possuir contraste adequado com o Background.

---

# Border Colors

Utilizadas para:

- Separadores.
- Inputs.
- Cards.
- Containers.
- Tabelas.

As bordas nunca deverão competir visualmente com o conteúdo.

---

# Text Colors

Os textos deverão utilizar apenas tokens específicos.

Categorias:

| Token | Utilização |
|--------|------------|
| Text Primary | Conteúdo principal |
| Text Secondary | Conteúdo complementar |
| Text Tertiary | Informações auxiliares |
| Text Disabled | Componentes desabilitados |
| Text Inverse | Fundos escuros |

Evitar utilizar Brand Colors em textos extensos.

---

# Action Colors

Utilizadas exclusivamente para ações do usuário.

Exemplos:

- Botões.
- Links.
- Ícones clicáveis.
- FAB.
- Tabs.

Os estados deverão seguir:

```text
Default

↓

Hover

↓

Focus

↓

Pressed

↓

Disabled
```

---

# Feedback Colors

Todo feedback visual deverá utilizar Semantic Colors.

Exemplos:

| Evento | Cor |
|----------|-----|
| Sucesso | Success |
| Erro | Error |
| Atenção | Warning |
| Informação | Info |

Nunca utilizar Brand Colors para indicar erros.

---

# Dark Theme

O Dark Theme deverá utilizar os mesmos Design Tokens.

A alteração ocorrerá apenas nos valores.

```text
Light Theme

↓

Design Tokens

↓

Dark Theme
```

Nenhum componente deverá possuir cores fixas.

Todos deverão consumir Tokens.

---

# Opacidade

As opacidades deverão seguir valores padronizados.

| Token | Valor |
|--------|-------|
| Opacity Disabled | 38% |
| Opacity Hover | 8% |
| Opacity Focus | 12% |
| Opacity Pressed | 16% |
| Overlay | 60% |

Evitar valores arbitrários.

---

# Contraste

Toda combinação de cores deverá atender aos requisitos mínimos da WCAG.

Objetivos:

- Texto normal → AA
- Texto grande → AA
- Componentes críticos → AAA quando possível

Nunca sacrificar legibilidade por estética.

---

# Estados dos Componentes

Todo componente visual deverá possuir suporte para:

- Default
- Hover
- Focus
- Pressed
- Disabled
- Loading
- Success
- Warning
- Error

Cada estado deverá utilizar Tokens específicos.

---

# Casos de Uso

## Correto

✔ Botão principal utilizando Brand.

✔ Mensagem de sucesso utilizando Success.

✔ Alerta utilizando Warning.

✔ Campo inválido utilizando Error.

---

## Incorreto

✘ Utilizar vermelho para botão principal.

✘ Utilizar Brand para mensagens de erro.

✘ Utilizar cores diferentes para componentes iguais.

✘ Misturar tons sem utilizar Design Tokens.

---

# Anti-Padrões

São considerados Anti-Padrões:

- Hardcode de cores.
- Utilização direta de códigos HEX nos componentes.
- Cores diferentes para o mesmo estado.
- Componentes ignorando o Theme.
- Criação de novas cores sem documentação.

---

# Decisões Arquiteturais

## ADR-023

Nenhum componente poderá utilizar valores HEX diretamente.

Toda cor deverá ser obtida através dos Design Tokens.

---

## ADR-024

Todos os componentes deverão suportar Light Theme e Dark Theme utilizando a mesma estrutura de Tokens.

---

## ADR-025

Semantic Colors possuem prioridade sobre Brand Colors para comunicação de estados.

---

## ADR-026

Novas cores somente poderão ser adicionadas após atualização deste documento e revisão do Design System.

---

# Boas Práticas

- Utilizar sempre Design Tokens.
- Evitar excesso de cores.
- Priorizar contraste.
- Manter consistência entre Web e Mobile.
- Validar acessibilidade.
- Não utilizar cores como única forma de comunicar informações.
- Utilizar ícones e textos como apoio quando necessário.

---

# Considerações Finais

A paleta de cores do MedFlow representa um dos principais elementos da identidade visual da plataforma. O uso consistente dos Design Tokens garante padronização entre Web e Mobile, facilita manutenção, reduz inconsistências e possibilita evolução futura sem necessidade de refatorações em larga escala.

Toda alteração na paleta oficial deverá ser registrada neste documento antes de sua implementação.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação inicial do documento | Equipe MedFlow |