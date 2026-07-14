# Gerenciamento de estado (State Management)

| Campo | Valor |
|-------|--------|
| Documento | State Management |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Mobile |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

## Visão Geral

O gerenciamento de estado (State Management) é responsável por controlar, compartilhar e sincronizar os dados utilizados pelo aplicativo mobile durante sua execução.

No MedFlow, a arquitetura de gerenciamento de estado foi projetada para garantir alta performance, previsibilidade, escalabilidade e facilidade de manutenção, permitindo que diferentes módulos compartilhem informações de maneira segura e eficiente.

---

# Objetivos

O gerenciamento de estado possui os seguintes objetivos:

- Centralizar os dados da aplicação.
- Evitar duplicação de informações.
- Facilitar a comunicação entre telas.
- Minimizar renderizações desnecessárias.
- Melhorar a experiência do usuário.
- Suportar funcionamento Offline.
- Simplificar testes e manutenção.
- Garantir consistência dos dados.

---

# Classificação dos Estados

Os estados da aplicação são divididos em diferentes categorias.

## Local State

Representa informações utilizadas apenas por um componente específico.

### Exemplos

- Campo de pesquisa
- Estado de um formulário
- Modal aberto
- Campo selecionado
- Loading de um botão

---

## Global State

Compartilhado entre diversos módulos do aplicativo.

### Exemplos

- Usuário autenticado
- Permissões
- Configurações
- Tema da aplicação
- Idioma
- Token de autenticação
- Notificações
- Status da conexão

---

## Remote State

Representa dados provenientes da API.

### Exemplos

- Pacientes
- Consultas
- Prontuários
- Exames
- Receitas
- Agenda

O Remote State deve possuir mecanismos de sincronização, atualização e cache.

---

## Persisted State

São informações armazenadas localmente no dispositivo.

### Exemplos

- Token JWT
- Preferências
- Configurações
- Dados Offline
- Cache da aplicação

---

# Arquitetura

O fluxo de gerenciamento de estado segue uma arquitetura previsível.

```text
Interface

↓

Action

↓

State Manager

↓

Repository

↓

API / Database

↓

Novo Estado

↓

Atualização da Interface
```

---

# Organização

A estrutura recomendada para os estados é:

```text
state/

├── auth/
├── patient/
├── appointment/
├── medical_record/
├── notification/
├── settings/
├── profile/
├── connectivity/
├── cache/
└── sync/
```

Cada módulo é responsável apenas pelo seu próprio domínio de negócio.

---

# Fluxo de Atualização

Sempre que uma informação sofrer alteração, o fluxo deverá seguir os seguintes passos:

1. Usuário executa uma ação.
2. A Action é disparada.
3. O State Manager recebe a alteração.
4. O Repository executa a operação.
5. A API retorna a resposta.
6. O estado é atualizado.
7. A interface é reconstruída automaticamente.

---

# Estados de Loading

Toda operação assíncrona deve possuir um estado de Loading.

## Exemplos

- Login
- Cadastro
- Atualização
- Upload
- Download
- Sincronização
- Exclusão

Enquanto o Loading estiver ativo, a interface deve fornecer feedback visual ao usuário utilizando componentes como:

- Skeleton Loading
- Progress Indicator
- Circular Progress
- Linear Progress

---

# Estados de Sucesso

Após uma operação concluída com sucesso, a aplicação deve informar claramente o usuário.

### Exemplos

- Paciente cadastrado.
- Consulta agendada.
- Receita emitida.
- Documento enviado.
- Perfil atualizado.

O feedback pode ocorrer através de:

- Snackbar
- Toast
- Banner
- Dialog

---

# Estados de Erro

Toda operação pode falhar e deve possuir tratamento específico.

## Tipos de Erro

### Validação

Exemplo:

- Campo obrigatório
- CPF inválido
- CRM inválido

---

### Conectividade

Exemplos

- Sem internet
- Timeout
- Servidor indisponível

---

### Autenticação

Exemplos

- Token expirado
- Sessão inválida
- Login inválido

---

### Permissão

Exemplos

- Usuário sem acesso
- Recurso bloqueado

---

### Erros Internos

Exemplos

- Exceções inesperadas
- Dados corrompidos
- Falha de sincronização

---

# Cache

O aplicativo deve utilizar Cache para reduzir chamadas desnecessárias à API.

## Benefícios

- Melhor desempenho
- Redução de consumo de dados
- Maior velocidade
- Melhor experiência Offline

---

## Dados Elegíveis para Cache

- Lista de pacientes
- Agenda
- Perfil do usuário
- Configurações
- Especialidades
- Convênios

---

# Sincronização

Quando houver conexão com a internet, os dados devem ser sincronizados automaticamente.

Fluxo:

```text
Dados Offline

↓

Fila de Sincronização

↓

Validação

↓

API

↓

Confirmação

↓

Atualização do Cache

↓

Interface Atualizada
```

---

# Tratamento de Conflitos

Durante a sincronização podem ocorrer conflitos entre informações locais e remotas.

A aplicação deverá:

- Identificar conflitos.
- Comparar versões dos dados.
- Priorizar a versão mais recente quando aplicável.
- Registrar conflitos para auditoria.
- Permitir resolução manual em cenários críticos.

---

# Atualizações em Tempo Real

Algumas informações podem ser atualizadas automaticamente.

Exemplos

- Novas consultas
- Cancelamentos
- Alterações de agenda
- Notificações
- Mensagens

Essas atualizações devem ocorrer sem necessidade de reiniciar o aplicativo.

---

# Persistência

As seguintes informações devem permanecer armazenadas mesmo após o encerramento do aplicativo.

- Token de autenticação
- Dados do usuário
- Preferências
- Configurações
- Cache Offline
- Última sincronização

---

# Segurança

O gerenciamento de estado nunca deve expor informações sensíveis em memória de forma desprotegida.

Boas práticas incluem:

- Criptografar dados persistidos.
- Invalidar Token expirado.
- Limpar dados após Logout.
- Não armazenar senhas.
- Minimizar tempo de retenção de informações sensíveis.

---

# Performance

Para manter o desempenho da aplicação, recomenda-se:

- Atualizar apenas os componentes necessários.
- Evitar reconstruções desnecessárias da interface.
- Utilizar Lazy Loading quando possível.
- Separar estados por domínio.
- Descartar estados temporários quando não forem mais utilizados.

---

# Boas Práticas

- Manter o State Management previsível.
- Evitar dependências circulares entre módulos.
- Centralizar regras de negócio fora da interface.
- Nunca acessar diretamente a API pela camada de apresentação.
- Utilizar Repository Pattern para acesso aos dados.
- Garantir sincronização consistente entre Cache, API e Interface.
- Documentar todas as alterações de estado relevantes.
- Escrever testes para os principais fluxos de atualização.

---

# Considerações Finais

O gerenciamento de estado do MedFlow foi concebido para suportar uma aplicação médica moderna, escalável e confiável. A separação clara entre estados locais, globais, remotos e persistidos proporciona maior organização da arquitetura, facilita a evolução do sistema e garante uma experiência consistente para os profissionais de saúde, mesmo em cenários de baixa conectividade.