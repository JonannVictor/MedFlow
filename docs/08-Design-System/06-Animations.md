# Animações (Animations)

| Campo | Valor |
|-------|--------|
| Documento | Animations |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Design System |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

As animações do MedFlow têm como objetivo melhorar a experiência do usuário, fornecendo feedback visual, reforçando a continuidade das interações e tornando a navegação mais intuitiva.

As animações **não possuem finalidade estética isolada**. Toda animação deve comunicar uma mudança de estado, orientar a atenção do usuário ou confirmar uma ação executada.

Uma interface médica deve transmitir estabilidade, confiança e previsibilidade. Portanto, o uso de animações deve ser discreto, consistente e funcional.

---

# Objetivos

O sistema de animações possui os seguintes objetivos:

- Fornecer feedback imediato.
- Guiar a atenção do usuário.
- Facilitar a compreensão das transições.
- Reduzir sensação de lentidão.
- Melhorar percepção de qualidade.
- Padronizar o comportamento visual.
- Garantir acessibilidade.

---

# Filosofia

As animações do MedFlow seguem quatro princípios fundamentais.

## Funcionalidade

Toda animação deve possuir um propósito claro.

Se uma animação não comunica nenhuma informação, ela não deve existir.

---

## Rapidez

O sistema deve parecer responsivo.

Animações longas aumentam a percepção de lentidão.

---

## Consistência

Componentes semelhantes devem utilizar as mesmas animações.

O usuário não deve aprender comportamentos diferentes para elementos iguais.

---

## Discrição

A interface nunca deve competir com o conteúdo.

Movimentos exagerados são proibidos.

---

# Motion Language

Todas as animações deverão seguir a linguagem visual oficial da plataforma.

Características:

- Suaves.
- Naturais.
- Curtas.
- Objetivas.
- Sem exageros.

O movimento deve reforçar a interação e nunca distrair o usuário.

---

# Motion Tokens

Todas as animações deverão utilizar Motion Tokens.

```text
Motion

├── Duration
├── Easing
├── Delay
├── Scale
├── Opacity
└── Transform
```

---

# Duração Oficial

| Token | Tempo | Utilização |
|--------|--------|------------|
| motion.instant | 0ms | Mudanças imediatas |
| motion.fast | 100ms | Hover |
| motion.normal | 200ms | Botões |
| motion.medium | 300ms | Modais |
| motion.slow | 500ms | Transições maiores |

Evitar animações superiores a 500ms.

---

# Curvas de Easing

Curvas recomendadas:

| Token | Utilização |
|--------|------------|
| Ease Out | Entrada de componentes |
| Ease In | Saída de componentes |
| Ease In-Out | Transições |
| Linear | Loading contínuo |

Toda a plataforma deverá reutilizar apenas estas curvas.

---

# Tipos de Animação

## Fade

Utilizada para:

- Mensagens.
- Tooltips.
- Alertas.
- Snackbars.

---

## Scale

Utilizada para:

- Dialogs.
- Modais.
- Menus.

Escala recomendada:

```text
95%

↓

100%
```

---

## Slide

Utilizada para:

- Sidebar.
- Drawer.
- Bottom Sheet.
- Navegação.

---

## Opacity

Utilizada durante:

- Skeleton Loading.
- Placeholders.
- Troca de conteúdo.

---

# Componentes

## Buttons

Estados animados:

- Hover
- Pressed
- Disabled
- Loading

A transição deve ocorrer em `motion.normal`.

---

## Cards

Permitir apenas:

- Hover discreto.
- Focus.

Nunca utilizar animações exageradas.

---

## Inputs

Estados:

- Focus
- Error
- Success

A animação deve reforçar a mudança de estado.

---

## Dialogs

Fluxo:

```text
Scale

+

Fade
```

Entrada suave.

Saída rápida.

---

## Sidebar

Fluxo recomendado:

```text
Slide

+

Fade
```

Nunca utilizar animações bruscas.

---

## Dropdown

Fluxo recomendado:

```text
Fade

+

Scale
```

---

## Tooltip

Fluxo:

```text
Fade

↓

Opacity
```

---

## Toast

Fluxo recomendado:

```text
Slide

↓

Fade
```

---

# Skeleton Loading

Todo Skeleton deverá utilizar animação contínua.

Características:

- Discreta.
- Suave.
- Baixo consumo de recursos.

Evitar animações chamativas.

---

# Loading

Tipos suportados:

- Spinner
- Progress Bar
- Skeleton Loading

A escolha dependerá do contexto da operação.

---

# Feedback Visual

Toda ação do usuário deverá produzir feedback.

Exemplos:

- Clique.
- Hover.
- Focus.
- Pressed.
- Loading.
- Success.

A ausência de feedback é considerada falha de experiência.

---

# Transições Entre Telas

As transições deverão ser discretas.

Objetivos:

- Manter continuidade.
- Reduzir sensação de troca brusca.
- Não atrasar navegação.

---

# Redução de Movimento

A plataforma deverá respeitar preferências de acessibilidade.

Quando o usuário optar por reduzir animações:

- Remover movimentos desnecessários.
- Manter apenas transições essenciais.
- Preservar feedback visual.

---

# Performance

Boas práticas:

- Utilizar aceleração por GPU sempre que possível.
- Priorizar `transform` e `opacity`.
- Evitar animações que alterem Layout.
- Evitar reflows desnecessários.

---

# Casos de Uso

## Correto

✔ Hover discreto.

✔ Fade em mensagens.

✔ Scale em Dialogs.

✔ Skeleton durante carregamento.

---

## Incorreto

✘ Bounce.

✘ Piscar continuamente.

✘ Rotações desnecessárias.

✘ Zoom exagerado.

✘ Movimentos longos.

---

# Anti-Padrões

São considerados Anti-Padrões:

- Animações sem propósito.
- Durações inconsistentes.
- Movimentos excessivos.
- Componentes utilizando animações diferentes para o mesmo comportamento.
- Ignorar preferência de redução de movimento.
- Bloquear interação durante animações desnecessárias.

---

# Decisões Arquiteturais

## ADR-043

Toda animação deverá possuir finalidade funcional.

---

## ADR-044

É proibido utilizar animações decorativas que prejudiquem produtividade.

---

## ADR-045

Todos os componentes deverão reutilizar Motion Tokens.

---

## ADR-046

O sistema deverá respeitar configurações de acessibilidade relacionadas à redução de movimento.

---

# Referência de Implementação

Este documento deverá resultar em uma estrutura semelhante a:

```text
design-system/

motion/

├── duration.ts
├── easing.ts
├── transitions.ts
├── keyframes.ts
└── animations.ts
```

Todos os componentes deverão consumir esses Tokens.

---

# Boas Práticas

- Priorizar rapidez.
- Utilizar animações curtas.
- Reutilizar Motion Tokens.
- Animar apenas quando necessário.
- Preservar desempenho.
- Garantir acessibilidade.
- Validar consistência entre Web e Mobile.

---

# Considerações Finais

O sistema de animações do MedFlow foi concebido para tornar a interface mais fluida, intuitiva e agradável sem comprometer produtividade ou desempenho. Ao padronizar durações, curvas, transições e comportamentos através de Motion Tokens, a plataforma garante uma experiência consistente, acessível e preparada para evoluções futuras.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação inicial do documento | Equipe MedFlow |