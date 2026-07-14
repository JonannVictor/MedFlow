# Acessibilidade (Accessibility)

| Campo | Valor |
|-------|--------|
| Documento | Accessibility |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Design System |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

A acessibilidade constitui um requisito funcional obrigatório da plataforma MedFlow.

A aplicação deverá ser utilizável pelo maior número possível de pessoas, independentemente de limitações visuais, motoras, cognitivas ou tecnológicas, garantindo uma experiência consistente e inclusiva.

Além das recomendações internacionais de acessibilidade, o MedFlow prioriza conforto visual e ergonomia, considerando que seus usuários permanecem longos períodos utilizando o sistema durante a rotina clínica.

---

# Objetivos

O sistema de acessibilidade possui os seguintes objetivos:

- Garantir inclusão digital.
- Reduzir barreiras de uso.
- Atender às recomendações WCAG.
- Melhorar a experiência de todos os usuários.
- Reduzir erros operacionais.
- Tornar a interface previsível.
- Facilitar navegação.

---

# Princípios

Toda funcionalidade deverá respeitar os quatro princípios definidos pela WCAG.

## Perceptível

As informações devem ser apresentadas de forma que possam ser percebidas por qualquer usuário.

---

## Operável

Todos os recursos deverão ser acessíveis por diferentes métodos de interação.

---

## Compreensível

A interface deve ser previsível.

O usuário nunca deverá precisar adivinhar como utilizar um componente.

---

## Robusto

A plataforma deverá funcionar corretamente com tecnologias assistivas atuais e futuras.

---

# Navegação por Teclado

Toda a aplicação deverá ser completamente utilizável sem mouse.

Navegação obrigatória:

- TAB
- Shift + TAB
- Enter
- Espaço
- ESC
- Setas direcionais

Nenhum fluxo crítico poderá depender exclusivamente do mouse.

---

# Ordem de Navegação

A ordem de foco deverá seguir exatamente a ordem visual da interface.

Exemplo:

```text
Header

↓

Menu

↓

Conteúdo

↓

Formulário

↓

Botões

↓

Rodapé
```

Nunca permitir saltos inesperados.

---

# Focus

Todo componente interativo deverá possuir Focus visível.

Características:

- Alto contraste.
- Fácil identificação.
- Consistente entre Web e Mobile.

É proibido remover o Focus Ring sem substituição equivalente.

---

# Contraste

Toda combinação de cores deverá atender, no mínimo, ao padrão WCAG AA.

Recomendações:

- Texto comum → AA
- Texto grande → AA
- Componentes críticos → AAA quando possível

O contraste deverá ser validado antes da publicação.

---

# Tipografia

A tipografia deverá priorizar legibilidade.

Diretrizes:

- Tamanho adequado.
- Boa altura de linha.
- Hierarquia consistente.
- Alto contraste.

Evitar textos excessivamente pequenos.

---

# Componentes

Todos os componentes deverão possuir:

- Nome acessível.
- Papel semântico.
- Estados identificáveis.
- Labels claras.
- Feedback compreensível.

---

# Formulários

Todo formulário deverá possuir:

- Label associada.
- Campo obrigatório identificado.
- Mensagens de erro claras.
- Descrição quando necessária.

Nunca utilizar Placeholder como substituto da Label.

---

# Ícones

Ícones decorativos deverão ser ignorados por leitores de tela.

Ícones interativos deverão possuir descrição acessível.

---

# Tabelas

Toda tabela deverá possuir:

- Cabeçalhos semânticos.
- Associação correta entre linhas e colunas.
- Navegação por teclado.

---

# Imagens

Toda imagem deverá possuir descrição alternativa quando transmitir informação.

Imagens puramente decorativas deverão ser ignoradas por tecnologias assistivas.

---

# Feedback

Mudanças importantes deverão ser comunicadas.

Exemplos:

- Cadastro realizado.
- Exclusão concluída.
- Erro de conexão.
- Upload finalizado.

O usuário nunca deverá depender apenas de alterações visuais.

---

# Estados

Nunca utilizar apenas cor para comunicar estados.

Sempre combinar:

- Cor.
- Texto.
- Ícone.

---

# Tempo

O sistema deverá respeitar o ritmo do usuário.

Evitar:

- Expiração rápida de sessão.
- Fechamento automático de diálogos.
- Mensagens temporárias muito rápidas.

---

# Redução de Movimento

Caso o usuário prefira reduzir animações:

- Remover efeitos decorativos.
- Preservar apenas feedback essencial.
- Reduzir movimentos complexos.

---

# Responsividade

A acessibilidade deverá permanecer consistente em todas as resoluções suportadas.

---

# Compatibilidade

O sistema deverá funcionar corretamente com:

- Screen Readers.
- Navegação por teclado.
- Zoom do navegador.
- Alto contraste do sistema operacional.

---

# Performance

A implementação de recursos de acessibilidade não deverá comprometer o desempenho da aplicação.

---

# Anti-Padrões

São considerados Anti-Padrões:

- Remover Focus Ring.
- Utilizar apenas Placeholder.
- Utilizar apenas cor para indicar erro.
- Contraste insuficiente.
- Componentes inacessíveis.
- Falta de Labels.
- Navegação por teclado incompleta.

---

# Decisões Arquiteturais

## ADR-055

Toda funcionalidade deverá ser desenvolvida considerando acessibilidade desde sua concepção.

---

## ADR-056

Nenhum componente poderá ser aprovado sem suporte à navegação por teclado.

---

## ADR-057

Todo feedback importante deverá possuir representação visual e textual.

---

## ADR-058

O Design System deverá manter conformidade mínima com WCAG AA.

---

# Checklist de Conformidade

Antes da aprovação de qualquer funcionalidade verificar:

| Item | Obrigatório |
|-------|-------------|
| Navegação por teclado | ✅ |
| Focus visível | ✅ |
| Contraste WCAG AA | ✅ |
| Labels corretas | ✅ |
| Screen Reader | ✅ |
| Tokens oficiais | ✅ |
| Responsividade | ✅ |
| Feedback acessível | ✅ |
| Testes executados | ✅ |

---

# Boas Práticas

- Desenvolver acessibilidade desde o início.
- Testar navegação sem mouse.
- Priorizar legibilidade.
- Validar contraste.
- Utilizar HTML semântico quando aplicável.
- Garantir compatibilidade com tecnologias assistivas.
- Revisar acessibilidade em todas as Pull Requests.

---

# Considerações Finais

A acessibilidade do MedFlow não deve ser tratada como um recurso adicional, mas como parte integrante da qualidade do produto. O cumprimento das diretrizes deste documento garante uma plataforma mais inclusiva, confortável e segura para todos os usuários, além de reduzir erros operacionais e melhorar a experiência geral de utilização.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação inicial do documento | Equipe MedFlow |