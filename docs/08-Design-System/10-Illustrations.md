# Ilustrações (Illustrations)

| Campo | Valor |
|-------|--------|
| Documento | Illustrations |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Design System |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

As ilustrações representam a linguagem gráfica complementar da plataforma MedFlow.

Sua função não é apenas tornar a interface mais agradável visualmente, mas também comunicar estados, orientar usuários, reduzir carga cognitiva e humanizar a experiência sem comprometer a produtividade.

O uso de ilustrações deverá ser criterioso, respeitando o contexto clínico e profissional da plataforma.

---

# Objetivos

O sistema de ilustrações possui os seguintes objetivos:

- Humanizar a interface.
- Comunicar estados do sistema.
- Melhorar compreensão.
- Reduzir sensação de erro.
- Tornar Empty States mais informativos.
- Apoiar onboarding.
- Reforçar identidade visual.

---

# Filosofia

Toda ilustração utilizada no MedFlow deverá transmitir:

- Confiança.
- Organização.
- Tecnologia.
- Saúde.
- Profissionalismo.
- Simplicidade.

Nunca transmitir:

- Infantilidade.
- Exagero.
- Humor excessivo.
- Dramatização.
- Sensacionalismo.

---

# Princípios

## Funcionalidade

Toda ilustração deve possuir um objetivo.

Se ela não comunica informação, não deve existir.

---

## Simplicidade

Evitar excesso de detalhes.

O foco continua sendo o conteúdo da aplicação.

---

## Consistência

Todas as ilustrações deverão compartilhar:

- Mesmo estilo.
- Mesma perspectiva.
- Mesma espessura.
- Mesma paleta.
- Mesma linguagem visual.

---

## Escalabilidade

Novas ilustrações deverão seguir os padrões estabelecidos neste documento.

---

# Estilo Oficial

As ilustrações deverão seguir:

- Flat Design moderno.
- Pouca complexidade.
- Formas suaves.
- Poucas cores.
- Alto contraste.
- Excelente legibilidade.

Evitar:

- Realismo.
- 3D.
- Efeitos exagerados.
- Sombras pesadas.

---

# Paleta

As ilustrações deverão utilizar exclusivamente os Tokens definidos em:

- Colors.md

Nunca utilizar cores fora da paleta oficial.

---

# Tipos de Ilustração

## Empty State

Exemplo:

```text
Nenhum paciente encontrado

↓

Ilustração

↓

Mensagem

↓

Botão de ação
```

---

## Erros

Utilizadas para:

- Página inexistente.
- Falha de conexão.
- Recurso indisponível.

Nunca utilizar imagens que aumentem a sensação de gravidade.

---

## Onboarding

Objetivos:

- Explicar funcionalidades.
- Reduzir curva de aprendizado.
- Guiar novos usuários.

---

## Estados de Carregamento

Podem utilizar ilustrações leves.

Sempre acompanhadas por Skeleton ou Progress.

---

## Sucesso

Utilizadas para:

- Cadastro concluído.
- Configuração realizada.
- Processo finalizado.

Nunca substituir mensagens textuais.

---

# Pessoas

Quando houver representação humana:

- Diversidade.
- Inclusão.
- Profissionalismo.
- Vestimentas adequadas.
- Ambiente clínico.

Evitar estereótipos.

---

# Contexto Médico

As ilustrações poderão representar:

- Médicos.
- Enfermeiros.
- Recepcionistas.
- Pacientes.
- Clínicas.
- Hospitais.
- Consultórios.
- Equipamentos médicos.

Toda representação deverá ser respeitosa e compatível com o ambiente de saúde.

---

# Ícones e Ilustrações

Ícones e ilustrações possuem objetivos diferentes.

Ícones:

- Ações.
- Navegação.
- Componentes.

Ilustrações:

- Contexto.
- Explicação.
- Estados.
- Apoio visual.

Nunca substituir um pelo outro.

---

# Responsividade

Toda ilustração deverá adaptar-se corretamente.

Evitar:

- Cortes.
- Distorções.
- Escalas inadequadas.

---

# Performance

Boas práticas:

- Utilizar SVG sempre que possível.
- Otimizar tamanho dos arquivos.
- Evitar imagens pesadas.
- Lazy Loading em páginas extensas.

---

# Acessibilidade

Toda ilustração informativa deverá possuir descrição alternativa.

Ilustrações decorativas deverão ser ignoradas por tecnologias assistivas.

---

# Casos de Uso

## Correto

✔ Empty State.

✔ Onboarding.

✔ Erros.

✔ Sucesso.

✔ Primeira utilização.

---

## Incorreto

✘ Utilizar ilustrações como decoração.

✘ Ilustrações gigantes.

✘ Personagens caricatos.

✘ Excesso de detalhes.

✘ Misturar estilos gráficos.

---

# Anti-Padrões

São considerados Anti-Padrões:

- Uso de bancos de imagens aleatórios.
- Mistura de estilos.
- Cores fora da paleta.
- Ilustrações sem propósito.
- PNGs de baixa qualidade.
- Personagens incompatíveis com o contexto médico.

---

# Decisões Arquiteturais

## ADR-059

Toda ilustração deverá seguir a identidade visual oficial do MedFlow.

---

## ADR-060

Ilustrações possuem finalidade informativa e nunca decorativa.

---

## ADR-061

Toda representação humana deverá respeitar princípios de diversidade e inclusão.

---

## ADR-062

A biblioteca oficial de ilustrações deverá ser reutilizada em toda a plataforma.

---

# Referência de Implementação

A biblioteca deverá possuir estrutura semelhante a:

```text
illustrations/

├── empty-state/
├── onboarding/
├── errors/
├── success/
├── authentication/
├── dashboard/
├── medical/
├── reports/
├── notifications/
└── shared/
```

Todos os arquivos deverão possuir nomenclatura padronizada e documentação de uso.

---

# Checklist de Conformidade

Antes da aprovação verificar:

| Item | Obrigatório |
|-------|-------------|
| Estilo visual consistente | ✅ |
| Utiliza Colors Tokens | ✅ |
| Compatível com Light Theme | ✅ |
| Compatível com Dark Theme | ✅ |
| SVG otimizado | ✅ |
| Descrição acessível | ✅ |
| Responsividade validada | ✅ |
| Performance validada | ✅ |

---

# Boas Práticas

- Priorizar SVG.
- Utilizar biblioteca oficial.
- Reutilizar ilustrações existentes.
- Validar contraste.
- Respeitar identidade visual.
- Utilizar apenas quando agregarem valor.
- Manter consistência entre Web e Mobile.

---

# Considerações Finais

As ilustrações do MedFlow desempenham papel complementar na experiência do usuário, reforçando a comunicação visual da plataforma sem competir com as informações clínicas. Sua utilização padronizada fortalece a identidade do produto, melhora a compreensão de estados da aplicação e proporciona uma experiência mais acolhedora e profissional para todos os usuários.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação inicial do documento | Equipe MedFlow |