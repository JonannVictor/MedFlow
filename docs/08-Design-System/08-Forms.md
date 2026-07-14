# Formulários (Forms)

| Campo | Valor |
|-------|--------|
| Documento | Forms |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Design System |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Visão Geral

Os formulários representam um dos elementos mais críticos da experiência do usuário no MedFlow.

Grande parte da operação da plataforma consiste na criação, edição e consulta de informações através de formulários, incluindo cadastro de pacientes, prontuários, consultas, receitas, exames, usuários, profissionais, convênios e configurações.

Por esse motivo, todos os formulários deverão seguir um padrão único de comportamento, validação, acessibilidade e interação.

Este documento estabelece as diretrizes oficiais para o desenvolvimento de formulários em toda a plataforma.

---

# Objetivos

O sistema de formulários possui os seguintes objetivos:

- Padronizar a experiência do usuário.
- Reduzir erros de preenchimento.
- Aumentar produtividade.
- Melhorar acessibilidade.
- Facilitar manutenção.
- Garantir consistência entre Web e Mobile.
- Reduzir tempo de treinamento dos usuários.

---

# Filosofia

Todo formulário do MedFlow deverá seguir quatro princípios fundamentais.

## Clareza

O usuário deve compreender imediatamente:

- O que deve preencher.
- O que é obrigatório.
- O que é opcional.
- O formato esperado.

---

## Eficiência

O preenchimento deve exigir o menor número possível de ações.

Sempre que possível utilizar:

- Autocomplete.
- Valores padrão.
- Seleções inteligentes.
- Preenchimento automático.

---

## Segurança

Nenhum dado informado pelo usuário deverá ser perdido sem confirmação.

---

## Feedback

Toda ação deverá gerar uma resposta visual imediata.

---

# Estrutura de um Formulário

Todo formulário deverá seguir a estrutura abaixo.

```text
Título

↓

Descrição

↓

Campos

↓

Validação

↓

Resumo (quando necessário)

↓

Ações
```

---

# Organização dos Campos

Campos relacionados deverão permanecer agrupados.

Exemplo:

```text
Dados Pessoais

↓

Contato

↓

Endereço

↓

Informações Médicas

↓

Observações
```

Nunca misturar assuntos diferentes na mesma seção.

---

# Campos Obrigatórios

Campos obrigatórios deverão:

- Ser identificados visualmente.
- Informar claramente quando estiverem inválidos.
- Nunca depender apenas da cor para identificação.

---

# Componentes Permitidos

Os formulários deverão utilizar exclusivamente componentes oficiais.

Exemplos:

- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- DatePicker
- TimePicker
- Search
- Autocomplete

---

# Tipos de Validação

## Validação Imediata

Executada durante o preenchimento.

Exemplos:

- CPF
- E-mail
- Telefone
- CEP

---

## Validação ao Perder o Foco

Executada quando o usuário sai do campo.

Indicada para:

- Nome
- Documento
- Endereço

---

## Validação Antes do Envio

Executada ao finalizar o formulário.

Responsável por validar regras de negócio.

---

## Validação Assíncrona

Executada através da API.

Exemplos:

- CPF já cadastrado.
- E-mail existente.
- CRM válido.
- Convênio ativo.

O usuário deverá receber feedback durante a consulta.

---

# Máscaras

Sempre utilizar máscaras quando facilitarem o preenchimento.

Exemplos:

- CPF
- CNPJ
- CEP
- Telefone
- Data
- Hora
- CRM
- CNS

Máscaras nunca deverão impedir a edição.

---

# Autocomplete

Sempre que possível utilizar preenchimento inteligente.

Exemplos:

- CEP
- Endereço
- Cidade
- Especialidade
- Convênio
- Medicamentos

---

# Navegação

A navegação deverá permitir:

- TAB
- Shift + TAB
- Enter (quando apropriado)
- Setas (listas)
- ESC (fechar componentes)

O mouse nunca deverá ser obrigatório.

---

# Mensagens de Erro

Mensagens deverão ser:

- Claras.
- Objetivas.
- Educadas.
- Específicas.

Exemplo correto:

```text
CPF inválido.

Verifique os números informados.
```

Exemplo incorreto:

```text
Erro 500.
```

---

# Mensagens de Sucesso

Após operações bem-sucedidas informar claramente:

- O que aconteceu.
- Qual será o próximo passo.

Exemplo:

```text
Paciente cadastrado com sucesso.
```

---

# Auto Save

Formulários longos deverão suportar Auto Save.

Exemplos:

- Prontuário.
- Evolução médica.
- Anamnese.
- Prescrição.

A frequência do Auto Save deverá ser configurável.

---

# Prevenção de Perda de Dados

Caso existam alterações não salvas, o sistema deverá solicitar confirmação antes de:

- Fechar página.
- Atualizar navegador.
- Navegar para outra tela.
- Encerrar sessão.

---

# Estados

Todo formulário deverá prever:

- Initial
- Editing
- Validating
- Saving
- Success
- Error
- Disabled
- Read Only

Nenhum estado deverá deixar o usuário sem feedback.

---

# Performance

Boas práticas:

- Lazy Validation.
- Campos independentes.
- Evitar re-renderizações.
- Carregar listas sob demanda.
- Cache de pesquisas frequentes.

---

# Responsividade

Os formulários deverão adaptar-se automaticamente.

Desktop:

- Campos lado a lado quando possível.

Tablet:

- Layout intermediário.

Mobile:

- Campos empilhados.

---

# Acessibilidade

Todos os formulários deverão possuir:

- Labels associadas.
- Navegação por teclado.
- Focus visível.
- Compatibilidade com leitores de tela.
- Mensagens acessíveis.
- Ordem lógica de navegação.

---

# Segurança

Nunca confiar apenas na validação do Frontend.

Toda validação crítica deverá ocorrer também na API.

Jamais armazenar informações sensíveis em armazenamento local sem criptografia.

---

# Casos de Uso

## Cadastro de Paciente

Fluxo:

```text
Dados Pessoais

↓

Contato

↓

Endereço

↓

Convênio

↓

Responsável

↓

Salvar
```

---

## Agendamento

Fluxo:

```text
Paciente

↓

Profissional

↓

Especialidade

↓

Data

↓

Hora

↓

Confirmar
```

---

## Prontuário

Fluxo:

```text
Paciente

↓

Anamnese

↓

Exame Físico

↓

Hipótese Diagnóstica

↓

Conduta

↓

Salvar Automaticamente
```

---

# Anti-Padrões

São considerados Anti-Padrões:

- Campos sem Label.
- Erros genéricos.
- Máscaras que impedem edição.
- Perda de dados sem aviso.
- Campos obrigatórios sem indicação.
- Validação apenas no Backend.
- Ordem de TAB incorreta.

---

# Decisões Arquiteturais

## ADR-051

Todo formulário deverá utilizar exclusivamente componentes oficiais do Design System.

---

## ADR-052

Validações deverão ocorrer em múltiplas camadas.

---

## ADR-053

Formulários críticos deverão suportar Auto Save.

---

## ADR-054

Nenhum usuário poderá perder informações sem confirmação explícita.

---

# Referência de Implementação

Este documento deverá resultar em uma estrutura semelhante a:

```text
forms/

├── validation/
├── masks/
├── formatters/
├── schemas/
├── hooks/
├── components/
├── utils/
└── examples/
```

Toda implementação deverá utilizar esquemas de validação compartilhados entre Frontend e Backend sempre que possível.

---

# Boas Práticas

- Agrupar informações relacionadas.
- Utilizar validação progressiva.
- Priorizar preenchimento rápido.
- Utilizar mensagens claras.
- Reduzir quantidade de cliques.
- Garantir acessibilidade.
- Nunca perder dados do usuário.
- Reutilizar componentes oficiais.

---

# Considerações Finais

Os formulários são responsáveis pela maior parte da interação dos usuários com o MedFlow. Sua padronização garante consistência operacional, reduz erros, melhora a produtividade e proporciona uma experiência previsível para profissionais de saúde que utilizam o sistema diariamente.

Este documento deverá servir como referência obrigatória para qualquer funcionalidade que envolva entrada, edição ou validação de dados.

---

# Histórico de Versões

| Versão | Data | Alterações | Responsável |
|---------|------|------------|-------------|
| 1.0 | 2026 | Criação inicial do documento | Equipe MedFlow |