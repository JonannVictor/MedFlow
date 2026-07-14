# Ícones (Icons)

| Campo | Valor |
|-------|--------|
| Documento | Icons |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Design System |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

Os ícones representam uma camada essencial da comunicação visual do MedFlow. Eles auxiliam o usuário na identificação rápida de ações, funcionalidades e estados da aplicação, reduzindo a necessidade de leitura e tornando a navegação mais intuitiva.

Todo ícone utilizado na plataforma deve possuir significado claro, manter consistência visual e complementar o conteúdo textual, nunca substituí-lo completamente.

Este documento estabelece os padrões oficiais para utilização, implementação e manutenção da biblioteca de ícones do MedFlow.

---

# Objetivos

O sistema de ícones possui os seguintes objetivos:

- Melhorar a experiência do usuário.
- Reduzir carga cognitiva.
- Facilitar reconhecimento de ações.
- Padronizar toda a plataforma.
- Garantir consistência entre Web e Mobile.
- Melhorar acessibilidade.
- Facilitar manutenção.

---

# Filosofia

Os ícones do MedFlow devem ser:

- Simples.
- Minimalistas.
- Modernos.
- Objetivos.
- Universais.
- Consistentes.

Todo ícone deve comunicar uma ação ou conceito imediatamente.

Caso um ícone gere dúvidas, ele não deve ser utilizado.

---

# Biblioteca Oficial

A plataforma deverá utilizar apenas uma biblioteca oficial de ícones.

Critérios obrigatórios:

- Open Source.
- Boa documentação.
- Grande cobertura de ícones.
- Compatibilidade com React e React Native.
- Suporte contínuo.
- Alto desempenho.

A utilização de múltiplas bibliotecas de ícones não é recomendada.

---

# Estilo Visual

Todos os ícones deverão seguir o mesmo estilo gráfico.

Características:

- Outline como padrão.
- Geometria consistente.
- Espessura uniforme.
- Bordas suaves.
- Boa legibilidade em tamanhos pequenos.

Misturar estilos (Outline, Filled e Duotone) na mesma interface é proibido.

---

# Design Tokens

Todo ícone deverá utilizar Tokens.

```text
Icon

├── Size
├── Stroke
├── Color
├── State
└── Animation
```

---

# Tamanhos Oficiais

| Token | Tamanho |
|--------|----------|
| icon.xs | 12px |
| icon.sm | 16px |
| icon.md | 20px |
| icon.lg | 24px |
| icon.xl | 32px |
| icon.2xl | 40px |

Novos tamanhos somente poderão ser adicionados mediante atualização deste documento.

---

# Espessura (Stroke)

A espessura deverá permanecer consistente.

Valores recomendados:

- Thin
- Regular
- Bold

A plataforma utilizará **Regular** como padrão.

---

# Cores

Os ícones nunca deverão utilizar cores fixas.

Sempre deverão consumir os Design Tokens definidos em **Colors.md**.

Exemplos:

- Text Primary
- Text Secondary
- Brand
- Success
- Warning
- Error

---

# Estados

Todo ícone interativo deverá possuir os seguintes estados:

- Default
- Hover
- Focus
- Pressed
- Disabled
- Active

As alterações deverão ocorrer através dos Tokens oficiais.

---

# Categorias

Os ícones deverão ser classificados por domínio.

## Navegação

Exemplos:

- Home
- Dashboard
- Menu
- Back
- Forward

---

## Pacientes

Exemplos:

- Usuário
- Grupo
- Cadastro
- Histórico

---

## Agenda

Exemplos:

- Calendar
- Clock
- Reminder

---

## Atendimento

Exemplos:

- Stethoscope
- Clipboard
- Medical Cross
- Prescription

---

## Financeiro

Exemplos:

- Wallet
- Credit Card
- Receipt
- Invoice

---

## Sistema

Exemplos:

- Settings
- Notification
- Help
- Search
- Filter

---

## Segurança

Exemplos:

- Shield
- Lock
- Unlock
- Key
- Fingerprint

---

# Utilização

Ícones deverão complementar elementos visuais.

Exemplos:

✔ Botões

✔ Menus

✔ Cards

✔ Tabs

✔ Inputs

✔ Alertas

✔ Tabelas

Evitar utilizar ícones isolados sem contexto.

---

# Buttons

Botões poderão utilizar ícones.

Posições permitidas:

```text
[Ícone] Texto

Texto [Ícone]
```

Nunca utilizar apenas ícones quando a ação não for universalmente conhecida.

---

# Inputs

Ícones poderão ser utilizados para:

- Pesquisa.
- Calendário.
- Senha.
- Upload.
- Download.

Sempre respeitando acessibilidade.

---

# Tabelas

Ícones poderão representar:

- Status.
- Ações.
- Ordenação.
- Prioridade.

Evitar excesso de ícones por linha.

---

# Feedback Visual

Ícones deverão reforçar mensagens.

Exemplos:

✔ Success

✔ Warning

✔ Error

✔ Info

Nunca substituir completamente mensagens textuais.

---

# Responsividade

Os ícones deverão adaptar seu tamanho utilizando apenas os Tokens oficiais.

Nunca escalar manualmente.

---

# Acessibilidade

Todos os ícones interativos deverão possuir:

- Nome acessível.
- Descrição quando necessário.
- Área mínima de clique de 44x44 px.
- Compatibilidade com leitores de tela.

Ícones decorativos deverão ser ignorados por tecnologias assistivas.

---

# Performance

Boas práticas:

- Importar apenas ícones utilizados.
- Evitar bibliotecas excessivamente grandes.
- Utilizar SVG sempre que possível.
- Evitar imagens PNG para ícones.

---

# Casos de Uso

## Correto

✔ Botão "Salvar" acompanhado de ícone.

✔ Campo de pesquisa com lupa.

✔ Calendário utilizando ícone de agenda.

✔ Alertas utilizando ícones semânticos.

---

## Incorreto

✘ Misturar estilos diferentes.

✘ Utilizar múltiplas bibliotecas.

✘ Utilizar ícones sem significado.

✘ Alterar espessura individualmente.

✘ Utilizar cores arbitrárias.

---

# Anti-Padrões

São considerados Anti-Padrões:

- Hardcode de tamanho.
- Hardcode de cor.
- Múltiplas bibliotecas.
- Mistura de estilos.
- Ícones pixelados.
- Ícones sem acessibilidade.

---

# Decisões Arquiteturais

## ADR-039

Toda a plataforma deverá utilizar apenas uma biblioteca oficial de ícones.

---

## ADR-040

Todos os ícones deverão utilizar Design Tokens para tamanho e cor.

---

## ADR-041

Misturar estilos visuais de ícones é proibido.

---

## ADR-042

Todo ícone interativo deverá atender aos requisitos de acessibilidade definidos pelo Design System.

---

# Referência de Implementação

Este documento deverá resultar em uma estrutura semelhante a:

```text
design-system/

icons/

├── navigation/
├── patients/
├── appointments/
├── medical/
├── financial/
├── system/
├── security/
└── shared/
```

Além disso, deverá existir um catálogo oficial documentando cada ícone utilizado na plataforma.

---

# Boas Práticas

- Utilizar apenas ícones documentados.
- Priorizar clareza.
- Manter consistência.
- Utilizar Tokens.
- Garantir acessibilidade.
- Evitar excesso de ícones.
- Reutilizar componentes existentes.

---

# Considerações Finais

O sistema de ícones do MedFlow faz parte da identidade visual da plataforma e desempenha papel fundamental na experiência do usuário. A utilização consistente da biblioteca oficial, aliada aos Design Tokens e às diretrizes de acessibilidade, garante interfaces intuitivas, modernas e de fácil manutenção, preservando a identidade visual da aplicação ao longo de sua evolução.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação inicial do documento | Equipe MedFlow |