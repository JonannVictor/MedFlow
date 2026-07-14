# Componentes (Components)

| Campo | Valor |
|-------|--------|
| Documento | Components |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Design System |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

Os componentes representam os blocos fundamentais da interface do MedFlow.

Todo elemento visual utilizado pela plataforma deverá ser composto por componentes reutilizáveis, documentados e padronizados.

Nenhuma tela deverá criar componentes exclusivos quando existir um componente oficial que atenda à mesma necessidade.

O Design System deve ser considerado a única fonte de verdade para construção da interface.

---

# Objetivos

O sistema de componentes possui os seguintes objetivos:

- Padronizar a interface.
- Maximizar reutilização.
- Reduzir duplicação de código.
- Facilitar manutenção.
- Garantir acessibilidade.
- Melhorar consistência visual.
- Acelerar desenvolvimento.

---

# Filosofia

Todo componente deverá seguir cinco princípios.

## Reutilização

Um componente deve resolver um problema genérico.

Nunca desenvolver um componente específico quando um componente reutilizável puder atender ao caso.

---

## Responsabilidade Única

Cada componente deverá possuir apenas uma responsabilidade.

Exemplo:

Um Button não deve possuir regras de autenticação.

Um Input não deve validar CPF internamente.

---

## Composição

Componentes maiores deverão ser compostos por componentes menores.

Exemplo:

```text
PatientCard

↓

Avatar

↓

Badge

↓

Button

↓

Typography
```

Evitar componentes monolíticos.

---

## Previsibilidade

Todo componente deverá comportar-se da mesma forma em qualquer parte da plataforma.

---

## Escalabilidade

Novas funcionalidades deverão ser adicionadas sem quebrar APIs existentes.

---

# Hierarquia

```text
Tokens

↓

Primitive Components

↓

Base Components

↓

Business Components

↓

Screens
```

---

# Primitive Components

São os componentes básicos.

Exemplos:

- Box
- Stack
- Text
- Icon
- Divider
- Spacer

Nunca conter regras de negócio.

---

# Base Components

Representam elementos reutilizáveis.

Biblioteca oficial:

- Button
- Input
- Select
- Checkbox
- Radio
- Switch
- Badge
- Chip
- Avatar
- Card
- Modal
- Dialog
- Drawer
- Tooltip
- Snackbar
- Toast
- Alert
- Progress
- Skeleton
- Tabs
- Accordion
- Table
- Pagination
- Search
- DatePicker
- TimePicker

Todos deverão ser reutilizados por toda a plataforma.

---

# Business Components

São componentes específicos do domínio médico.

Exemplos:

- PatientCard
- AppointmentCard
- DoctorCard
- MedicalTimeline
- PrescriptionCard
- VitalSignsCard
- MedicalHistory
- AppointmentStatus
- PatientStatusBadge
- MedicalRecordSummary

Esses componentes poderão utilizar Base Components internamente.

---

# Estrutura Oficial

Cada componente deverá seguir a mesma organização.

```text
Component

├── index.ts

├── Component.tsx

├── Component.styles.ts

├── Component.types.ts

├── Component.test.tsx

├── Component.stories.tsx

└── README.md
```

---

# Anatomia

Todo componente deverá documentar:

- Objetivo.
- Anatomia.
- Props.
- Eventos.
- Estados.
- Variantes.
- Tamanhos.
- Acessibilidade.
- Casos de uso.
- Anti-padrões.

---

# Estados

Todo componente interativo deverá suportar:

- Default
- Hover
- Focus
- Active
- Pressed
- Disabled
- Loading
- Error
- Success

Nunca implementar estados diferentes para componentes semelhantes.

---

# Variantes

Sempre que possível utilizar variantes padronizadas.

Exemplo:

```text
Primary

Secondary

Outline

Ghost

Destructive
```

---

# Tamanhos

Escala oficial.

```text
XS

SM

MD

LG

XL
```

Evitar tamanhos arbitrários.

---

# Props

As Props deverão ser:

- Claras.
- Consistentes.
- Tipadas.
- Documentadas.

Evitar Props duplicadas.

---

# Eventos

Eventos deverão possuir nomenclatura consistente.

Exemplos:

```text
onClick

onPress

onChange

onFocus

onBlur

onOpen

onClose

onSelect
```

---

# Composição

Componentes deverão privilegiar Composition em vez de herança.

Exemplo:

```text
<Card>

<Card.Header />

<Card.Body />

<Card.Footer />

</Card>
```

---

# Temas

Todos os componentes deverão suportar:

- Light Theme
- Dark Theme

Utilizando exclusivamente Design Tokens.

---

# Responsividade

Todos os componentes deverão funcionar corretamente em:

- Desktop
- Tablet
- Mobile

---

# Acessibilidade

Todo componente deverá possuir:

- Navegação por teclado.
- Focus Ring.
- Nome acessível.
- Compatibilidade com leitores de tela.
- Área mínima de toque.
- Contraste adequado.

Nenhum componente poderá ser aprovado sem validação de acessibilidade.

---

# Performance

Boas práticas:

- Memoização quando necessário.
- Renderização eficiente.
- Lazy Loading quando aplicável.
- Evitar re-renderizações desnecessárias.
- Componentes leves.

---

# Testes

Cada componente deverá possuir:

- Unit Test.
- Component Test.
- Accessibility Test.

Componentes críticos deverão possuir testes de integração.

---

# Documentação

Todo componente deverá possuir documentação contendo:

- Objetivo.
- API.
- Exemplos.
- Casos de uso.
- Anti-padrões.

Nenhum componente será considerado concluído sem documentação.

---

# Catálogo Oficial

A biblioteca oficial deverá conter, no mínimo:

## Navegação

- Sidebar
- Topbar
- Breadcrumb
- Tabs
- Navigation Rail

---

## Entrada de Dados

- Input
- Textarea
- Select
- DatePicker
- TimePicker
- Checkbox
- Radio
- Switch

---

## Feedback

- Alert
- Snackbar
- Toast
- Dialog
- Modal
- Progress
- Skeleton

---

## Exibição

- Card
- Table
- Badge
- Avatar
- Chip
- Timeline
- Tooltip

---

## Ações

- Button
- FAB
- IconButton
- Dropdown
- Menu

---

# Anti-Padrões

São considerados Anti-Padrões:

- Componentes duplicados.
- Hardcode de estilos.
- Regras de negócio dentro de componentes.
- Uso de cores sem Tokens.
- Componentes sem testes.
- Componentes sem documentação.
- Componentes inacessíveis.

---

# Decisões Arquiteturais

## ADR-047

Todo componente deverá utilizar exclusivamente Design Tokens.

---

## ADR-048

Componentes deverão ser compostos por componentes menores sempre que possível.

---

## ADR-049

Toda interface da plataforma deverá utilizar exclusivamente a biblioteca oficial de componentes.

---

## ADR-050

Nenhum componente poderá conter regras de negócio relacionadas ao domínio da aplicação.

---

# Boas Práticas

- Priorizar reutilização.
- Documentar alterações.
- Escrever testes.
- Garantir acessibilidade.
- Utilizar Composition.
- Evitar duplicação.
- Respeitar os Design Tokens.
- Seguir os padrões deste documento.

---

# Considerações Finais

A biblioteca de componentes do MedFlow constitui a base de toda a experiência visual da plataforma. Sua padronização garante consistência entre Web e Mobile, reduz o custo de manutenção, acelera o desenvolvimento de novas funcionalidades e assegura uma experiência uniforme para os usuários.

Toda evolução do Design System deverá iniciar por este documento, que estabelece as diretrizes para criação, manutenção e reutilização dos componentes oficiais da plataforma.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação inicial do documento | Equipe MedFlow |