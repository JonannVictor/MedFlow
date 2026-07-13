# Entity Relationship Diagram (ERD)

| Campo | Valor |
|-------|--------|
| Documento | ERD |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Database |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento descreve a organização estrutural do banco de dados do MedFlow através do seu Diagrama Entidade-Relacionamento (ERD).

O objetivo não é apenas apresentar o diagrama.

Este documento define como o ERD deve ser interpretado, organizado e evoluído ao longo da vida da plataforma.

Toda alteração estrutural deverá refletir tanto no banco quanto neste documento.

---

# Filosofia

O ERD representa a visão macro da camada de dados.

Ele não substitui a documentação das entidades.

Não substitui o documento de relacionamentos.

Não substitui a arquitetura do banco.

Seu papel é mostrar como todas as partes do sistema se conectam.

O ERD é o mapa da plataforma.

---

# Objetivos

O ERD deverá permitir que qualquer desenvolvedor compreenda rapidamente.

- os módulos existentes;
- as entidades principais;
- as dependências;
- os relacionamentos;
- os limites entre domínios;
- o fluxo das informações.

---

# Organização por Domínios

O banco de dados do MedFlow será organizado em domínios.

Cada domínio representa uma área de responsabilidade do sistema.

Exemplo.

```text
Authentication

Clinics

Patients

Professionals

Appointments

Medical Records

Finance

Notifications

AI

System
```

Cada domínio poderá possuir diversas entidades.

---

# Visão Geral

A estrutura geral seguirá a organização abaixo.

```text
Clinic
│
├──────────────┐
│              │
Patients   Professionals
│              │
└──────┬───────┘
       │
Appointments
       │
Medical Records
       │
Prescriptions
       │
Exams
```

Outros módulos, como Finance, Notifications e AI, relacionam-se a essas entidades sem alterar a hierarquia principal.

---

# Papel do ERD

O ERD deverá responder perguntas como.

- Esta entidade pertence a qual domínio?
- Quem depende desta tabela?
- Quais módulos serão afetados por uma alteração?
- Qual o caminho percorrido pelos dados?

Essas respostas deverão ser visíveis antes mesmo de abrir o código.

---

# Escopo

O ERD representa apenas a estrutura lógica do banco.

Ele não representa.

- regras de negócio;
- interfaces;
- APIs;
- componentes visuais;
- fluxos de autenticação.

Esses assuntos pertencem a outros documentos.

---

# Convenções

O diagrama deverá seguir os padrões definidos em `01-Database.md`.

Incluindo.

- nomenclatura;
- relacionamentos;
- cardinalidade;
- UUID;
- timestamps;
- Soft Delete;
- auditoria.

Nenhuma entidade poderá contrariar essas convenções.

---

# Evolução

O ERD deverá evoluir juntamente com o produto.

Sempre que uma nova entidade estrutural for criada.

O diagrama deverá ser atualizado.

Nunca permitir divergência entre o banco real e o ERD documentado.

---

# Documentos Relacionados

- Database.md
- Entities.md
- Relationships.md
- Migrations.md

---

---

# Capítulo 2 — Organização dos Domínios

## Objetivo

Este capítulo define a divisão oficial dos domínios de negócio representados no Diagrama Entidade-Relacionamento (ERD) do MedFlow.

A organização por domínios reduz o acoplamento entre módulos, facilita a manutenção e permite que a plataforma evolua de forma organizada.

Cada entidade deverá pertencer a apenas um domínio principal.

---

# Filosofia

O banco de dados do MedFlow não é organizado apenas por tabelas.

Ele é organizado por áreas de responsabilidade.

Cada domínio representa uma parte do negócio.

Essa separação facilita:

- manutenção;
- evolução;
- entendimento;
- escalabilidade;
- desenvolvimento paralelo.

---

# Estrutura Geral

O ERD será dividido em grandes domínios.

```text
Authentication

↓

Organization

↓

Clinical

↓

Scheduling

↓

Medical

↓

Financial

↓

Communication

↓

Artificial Intelligence

↓

Infrastructure
```

Cada domínio possui responsabilidades específicas.

---

# Domínio Authentication

Responsável por identidade e acesso.

Principais entidades.

```text
users

roles

permissions

sessions

refresh_tokens
```

Responsabilidades.

- autenticação;
- autorização;
- permissões;
- sessões.

Este domínio nunca armazenará informações clínicas.

---

# Domínio Organization

Representa a estrutura organizacional da plataforma.

Principais entidades.

```text
clinics

subscriptions

plans

addresses

clinic_settings
```

Responsabilidades.

- clínicas;
- planos;
- configurações;
- assinaturas.

Todas as demais áreas dependem deste domínio.

---

# Domínio Clinical

Representa as pessoas envolvidas no atendimento.

Principais entidades.

```text
patients

professionals

specialties

health_insurance
```

Responsabilidades.

- cadastro de pacientes;
- cadastro de profissionais;
- convênios;
- especialidades.

---

# Domínio Scheduling

Responsável pelos agendamentos.

Principais entidades.

```text
appointments

appointment_status

appointment_history

appointment_reminders
```

Responsabilidades.

- agenda;
- horários;
- confirmações;
- cancelamentos;
- reagendamentos.

---

# Domínio Medical

Representa o núcleo clínico da plataforma.

Principais entidades.

```text
medical_records

prescriptions

diagnoses

exams

attachments

clinical_notes
```

Responsabilidades.

- prontuários;
- prescrições;
- exames;
- histórico clínico.

Este é o domínio mais crítico do sistema.

---

# Domínio Financial

Responsável pela operação financeira.

Principais entidades.

```text
payments

payment_events

subscriptions

invoices

refunds
```

Responsabilidades.

- cobranças;
- pagamentos;
- assinaturas;
- faturamento;
- estornos.

---

# Domínio Communication

Centraliza toda comunicação.

Principais entidades.

```text
notifications

email_queue

sms_queue

push_notifications

notification_templates
```

Responsabilidades.

- notificações;
- e-mails;
- SMS;
- Push;
- templates.

---

# Domínio Artificial Intelligence

Responsável pelos recursos inteligentes.

Principais entidades.

```text
ai_requests

ai_responses

ai_context

ai_feedback
```

Responsabilidades.

- consultas à IA;
- histórico;
- contexto;
- feedback.

---

# Domínio Infrastructure

Representa entidades internas do sistema.

Principais entidades.

```text
audit_logs

background_jobs

webhooks

system_events

feature_flags
```

Responsabilidades.

- auditoria;
- filas;
- eventos;
- monitoramento;
- infraestrutura.

---

# Dependências Entre Domínios

Os domínios deverão possuir baixo acoplamento.

Fluxo principal.

```text
Authentication

↓

Organization

↓

Clinical

↓

Scheduling

↓

Medical

↓

Financial

↓

Communication
```

Sempre evitar dependências circulares.

---

# Regras

Cada entidade deverá responder.

- Qual domínio ela pertence?
- Quem depende dela?
- Ela depende de quem?
- Ela pode ser reutilizada por outros domínios?

Caso essas respostas não sejam claras.

A modelagem deverá ser revisada.

---

# Comunicação Entre Domínios

Os domínios poderão compartilhar informações.

Entretanto.

Sempre através de relacionamentos explícitos.

Nunca através de duplicação de dados.

---

# Escalabilidade

Novos domínios poderão ser adicionados futuramente.

Exemplos.

```text
Telemedicine

Laboratory

Insurance

Marketplace

Research
```

Sem necessidade de alterar os domínios existentes.

---

# Boas Práticas

✔ Um domínio representa uma responsabilidade.

✔ Baixo acoplamento.

✔ Alta coesão.

✔ Entidades agrupadas logicamente.

✔ Dependências bem definidas.

---

# Anti-Patterns

Nunca fazer.

❌ Entidade pertencendo a múltiplos domínios.

❌ Dependências circulares.

❌ Duplicação de entidades.

❌ Misturar infraestrutura com negócio.

❌ Criar domínios extremamente grandes.

---

# Checklist

Todo novo domínio deverá responder.

- possui responsabilidade clara?
- possui limites definidos?
- depende apenas do necessário?
- evita duplicação?
- é escalável?
- está documentado?

Caso qualquer resposta seja negativa.

O domínio deverá ser reavaliado.

---

# Referências Cruzadas

Este capítulo complementa.

- Database.md
- Entities.md
- Relationships.md
- Architecture.md

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O MedFlow organizará sua camada de dados em domínios de negócio independentes, cada um responsável por uma área específica da plataforma.

**Motivação**

- Organização
- Escalabilidade
- Baixo acoplamento
- Facilidade de manutenção
- Evolução contínua

**Alternativas Avaliadas**

- Organização apenas por tabelas
- Estrutura monolítica
- Divisão por equipes

**Resultado**

Foi adotada uma arquitetura baseada em domínios, permitindo crescimento sustentável e melhor compreensão da estrutura do banco de dados.

---

---

# Capítulo 3 — Convenções Visuais do ERD

## Objetivo

Este capítulo define os padrões visuais utilizados no Diagrama Entidade-Relacionamento (ERD) do MedFlow.

O objetivo é garantir que qualquer desenvolvedor consiga interpretar rapidamente o diagrama, independentemente de quem o criou.

Toda representação gráfica deverá seguir estas convenções.

---

# Filosofia

O ERD é uma ferramenta de comunicação.

Ele deve ser compreendido em poucos minutos.

A simplicidade visual é mais importante do que a quantidade de detalhes.

O diagrama não deve substituir a documentação.

Ele deve facilitar sua compreensão.

---

# Organização Geral

As entidades deverão ser agrupadas por domínio.

Exemplo.

```text
┌────────────────────────────┐
│ Authentication             │
└────────────────────────────┘

┌────────────────────────────┐
│ Organization               │
└────────────────────────────┘

┌────────────────────────────┐
│ Clinical                   │
└────────────────────────────┘

┌────────────────────────────┐
│ Scheduling                 │
└────────────────────────────┘

┌────────────────────────────┐
│ Medical                    │
└────────────────────────────┘

┌────────────────────────────┐
│ Financial                  │
└────────────────────────────┘
```

Os domínios deverão permanecer visualmente separados.

---

# Entidades

Cada entidade deverá ser representada utilizando um único bloco.

Exemplo.

```text
┌───────────────────────┐
│ patients              │
├───────────────────────┤
│ id                    │
│ clinic_id             │
│ first_name            │
│ last_name             │
│ birth_date            │
│ created_at            │
└───────────────────────┘
```

Não listar todas as colunas.

O ERD deverá apresentar apenas informações relevantes.

---

# Chaves Primárias

A chave primária deverá aparecer no topo.

Exemplo.

```text
PK

id
```

---

# Chaves Estrangeiras

Foreign Keys deverão ser identificadas.

Exemplo.

```text
FK

clinic_id

patient_id
```

Isso facilita a leitura do relacionamento.

---

# Cardinalidade

Toda relação deverá indicar cardinalidade.

Exemplo.

```text
Clinic

1

───────────────<

N

Patients
```

Outro exemplo.

```text
Appointment

1

───────────────1

Medical Record
```

Nunca deixar cardinalidade implícita.

---

# Direção dos Relacionamentos

Sempre representar a dependência.

Exemplo.

```text
Clinic

↓

Patients

↓

Appointments

↓

Medical Records
```

Evitar linhas cruzadas sempre que possível.

---

# Hierarquia

O fluxo principal deverá seguir.

```text
Organization

↓

Clinical

↓

Scheduling

↓

Medical
```

A leitura deverá ocorrer de cima para baixo.

---

# Cores

Quando houver suporte da ferramenta utilizada.

Padronizar cores por domínio.

Exemplo.

```text
Azul

↓

Organization
```

```text
Verde

↓

Clinical
```

```text
Laranja

↓

Scheduling
```

```text
Vermelho

↓

Medical
```

```text
Roxo

↓

Financial
```

A escolha definitiva das cores será documentada no Design System.

---

# Tabelas Técnicas

Entidades de infraestrutura deverão permanecer separadas.

Exemplos.

```text
audit_logs

background_jobs

feature_flags

webhooks
```

Essas tabelas não deverão poluir o fluxo principal do negócio.

---

# Fluxo Principal

O ERD deverá destacar visualmente o fluxo central do MedFlow.

```text
Clinic

↓

Patient

↓

Appointment

↓

Medical Record

↓

Prescription

↓

Exam
```

Esse é o núcleo funcional da plataforma.

---

# Módulos Auxiliares

Módulos como.

- IA;
- Financeiro;
- Notificações;
- Auditoria.

Deverão aparecer lateralmente.

Conectados apenas às entidades necessárias.

---

# Escalabilidade

Novas entidades deverão ser adicionadas respeitando a organização existente.

Evitar reorganizar completamente o diagrama a cada nova funcionalidade.

---

# Ferramentas

O ERD poderá ser mantido utilizando ferramentas compatíveis com exportação em formato aberto.

Exemplos.

- Draw.io
- Mermaid
- dbdiagram.io
- DBeaver
- PgAdmin

A ferramenta poderá mudar.

As convenções não.

---

# Versionamento

Toda alteração relevante deverá atualizar.

- diagrama;
- documentação;
- data da versão.

Nunca permitir divergência entre o banco e o ERD.

---

# Boas Práticas

✔ Agrupar entidades por domínio.

✔ Evitar cruzamento de linhas.

✔ Mostrar apenas atributos importantes.

✔ Manter leitura simples.

✔ Atualizar junto com as Migrations.

---

# Anti-Patterns

Nunca fazer.

❌ Mostrar todas as colunas.

❌ Cruzar dezenas de linhas.

❌ Misturar domínios.

❌ Utilizar cores aleatórias.

❌ Criar múltiplos padrões de diagrama.

---

# Checklist

Todo ERD deverá responder.

- representa todos os domínios?
- possui cardinalidade?
- identifica PK e FK?
- está atualizado?
- segue convenções visuais?
- é facilmente compreensível?

Caso qualquer resposta seja negativa.

O diagrama deverá ser revisado.

---

# Referências Cruzadas

Este capítulo complementa.

- Database.md
- Entities.md
- Relationships.md
- Design System.md

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O MedFlow utilizará um padrão visual único para todos os Diagramas Entidade-Relacionamento.

**Motivação**

- Clareza
- Consistência
- Facilidade de manutenção
- Evolução contínua
- Comunicação entre equipes

**Alternativas Avaliadas**

- Diagramas sem padronização
- Representações diferentes por módulo
- ERDs gerados automaticamente sem revisão

**Resultado**

Foi adotado um padrão visual único para garantir que qualquer desenvolvedor compreenda rapidamente a estrutura do banco de dados.

---

---

# Capítulo 4 — Fluxo Principal de Dados do MedFlow

## Objetivo

Este capítulo apresenta o fluxo principal das informações dentro do MedFlow.

Enquanto o ERD demonstra como as entidades se relacionam estruturalmente, este capítulo demonstra como os dados percorrem a plataforma durante sua operação diária.

O objetivo é facilitar a compreensão do funcionamento global do sistema.

---

# Filosofia

O MedFlow foi projetado para acompanhar toda a jornada clínica.

Desde o primeiro cadastro até o histórico permanente do paciente.

Cada entidade existe para suportar uma etapa desse processo.

O fluxo de dados representa exatamente essa jornada.

---

# Visão Geral

O fluxo principal da plataforma é representado pelo seguinte diagrama.

```text
Clínica
    │
    ▼
Profissionais
    │
    ▼
Pacientes
    │
    ▼
Agendamentos
    │
    ▼
Atendimento
    │
    ▼
Prontuário
    │
    ▼
Prescrição
    │
    ▼
Exames
    │
    ▼
Pagamento
    │
    ▼
Notificações
```

Esse fluxo representa o núcleo funcional do MedFlow.

---

# Etapa 1 — Clínica

Tudo começa pela clínica.

A clínica representa o Tenant da plataforma.

Ela define.

- usuários;
- profissionais;
- configurações;
- plano contratado;
- permissões.

Todas as demais informações pertencem a uma clínica.

---

# Etapa 2 — Profissionais

Após a criação da clínica.

São cadastrados os profissionais.

Exemplos.

```text
Médicos

Psicólogos

Dentistas

Fisioterapeutas

Recepcionistas
```

Cada profissional possui agenda própria e permissões específicas.

---

# Etapa 3 — Pacientes

Os pacientes representam o principal objeto clínico da plataforma.

Cada paciente pertence a uma única clínica.

Durante sua permanência no sistema.

Todo histórico será associado ao mesmo cadastro.

---

# Etapa 4 — Agendamentos

Após o cadastro.

O paciente poderá possuir diversos agendamentos.

Cada agendamento conecta.

```text
Paciente

↓

Profissional

↓

Horário

↓

Serviço
```

Esse relacionamento inicia oficialmente o atendimento.

---

# Etapa 5 — Atendimento

Quando chega o horário.

O atendimento é iniciado.

Durante essa etapa.

O profissional poderá.

- registrar observações;
- preencher formulários;
- anexar arquivos;
- gerar diagnósticos;
- emitir prescrições.

---

# Etapa 6 — Prontuário

O prontuário representa a memória clínica permanente do paciente.

Ele concentra.

- evolução;
- histórico;
- diagnósticos;
- documentos;
- prescrições;
- exames.

Nenhum atendimento deverá existir sem possibilidade de rastreamento.

---

# Etapa 7 — Prescrições

Quando necessário.

O profissional poderá emitir prescrições.

Exemplos.

```text
Medicamentos

Solicitações

Encaminhamentos

Atestados
```

Todas permanecem vinculadas ao atendimento.

---

# Etapa 8 — Exames

Os exames complementam o atendimento.

Podem possuir.

- solicitações;
- anexos;
- resultados;
- laudos.

Todo histórico permanece associado ao paciente.

---

# Etapa 9 — Financeiro

Após o atendimento.

O módulo financeiro registra.

- cobrança;
- pagamento;
- estorno;
- assinatura.

Essas informações permanecem separadas do domínio clínico.

Entretanto.

Relacionam-se quando necessário.

---

# Etapa 10 — Comunicação

Durante todo o fluxo.

O sistema poderá gerar.

```text
Emails

SMS

Push

WhatsApp

Notificações Internas
```

Essas mensagens são eventos derivados.

Nunca representam a fonte oficial da informação.

---

# Fluxos Paralelos

Além do fluxo principal.

Existem fluxos auxiliares.

```text
IA

↓

Sugestões

↓

Prontuário
```

---

```text
Webhook

↓

Pagamento

↓

Financeiro
```

---

```text
Background Jobs

↓

Processamento

↓

Notificações
```

Esses módulos trabalham em paralelo.

Sem alterar o fluxo principal.

---

# Eventos

Durante o ciclo de vida.

Diversos eventos poderão ser produzidos.

Exemplos.

```text
PatientCreated

AppointmentScheduled

AppointmentConfirmed

ConsultationStarted

MedicalRecordCreated

PrescriptionIssued

PaymentApproved

NotificationSent
```

Esses eventos permitem integração entre módulos.

---

# Dependências

O fluxo principal respeita a seguinte ordem.

```text
Organization

↓

Clinical

↓

Scheduling

↓

Medical

↓

Financial

↓

Communication
```

Nenhum módulo deverá depender de um módulo posterior.

---

# Integridade

Cada etapa depende da anterior.

Exemplo.

```text
Não existe consulta

↓

Sem paciente
```

---

```text
Não existe prontuário

↓

Sem consulta
```

---

```text
Não existe prescrição

↓

Sem atendimento
```

O banco deverá garantir essa integridade.

---

# Escalabilidade

Novos módulos poderão ser inseridos.

Exemplo.

```text
Telemedicina

↓

Entre

Agendamento

e

Atendimento
```

Sem necessidade de alterar o restante do fluxo.

---

# Boas Práticas

✔ Fluxo simples.

✔ Baixo acoplamento.

✔ Eventos entre módulos.

✔ Responsabilidades bem definidas.

✔ Histórico permanente.

---

# Anti-Patterns

Nunca fazer.

❌ Fluxos circulares.

❌ Dependências invertidas.

❌ Módulos acessando dados sem relacionamento.

❌ Duplicação de informações.

❌ Comunicação direta entre módulos não relacionados.

---

# Checklist

Todo novo módulo deverá responder.

- em qual etapa do fluxo ele atua?
- quais entidades utiliza?
- produz eventos?
- consome eventos?
- altera o fluxo principal?
- respeita a arquitetura?

Caso qualquer resposta seja negativa.

O módulo deverá ser reavaliado.

---

# Referências Cruzadas

Este capítulo complementa.

- Database.md
- Entities.md
- Relationships.md
- Architecture.md
- Event-Driven.md

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O MedFlow organizará toda a jornada de dados em um fluxo principal linear, permitindo compreensão rápida da arquitetura e reduzindo dependências entre módulos.

**Motivação**

- Clareza
- Escalabilidade
- Facilidade de manutenção
- Baixo acoplamento
- Evolução contínua

**Alternativas Avaliadas**

- Fluxos distribuídos sem organização
- Dependências circulares
- Arquitetura baseada apenas em tabelas

**Resultado**

Foi adotado um fluxo principal de dados representando a jornada completa do paciente dentro da plataforma.

---

---

# Capítulo 5 — Evolução e Manutenção do ERD

## Objetivo

Este capítulo define como o Diagrama Entidade-Relacionamento (ERD) do MedFlow deverá evoluir ao longo do ciclo de vida da plataforma.

O objetivo é garantir que o diagrama permaneça sincronizado com a implementação real do banco de dados, preservando sua utilidade como ferramenta de arquitetura e documentação.

O ERD deverá representar fielmente a estrutura oficial do banco de dados.

---

# Filosofia

O ERD não é um documento estático.

Ele evolui juntamente com o produto.

Sempre que uma nova entidade, relacionamento ou domínio for introduzido, o diagrama deverá refletir essa mudança.

A documentação deve acompanhar a evolução do software.

Nunca o contrário.

---

# Fonte de Verdade

O banco de dados é a implementação oficial.

O ERD é sua representação arquitetural.

Portanto.

Toda alteração estrutural deverá seguir a seguinte ordem.

```text
Decisão Arquitetural

↓

Atualização da Documentação

↓

Migration

↓

Banco de Dados

↓

Atualização do ERD
```

Nenhuma dessas etapas deverá ser ignorada.

---

# Atualizações Obrigatórias

O ERD deverá ser atualizado sempre que ocorrer.

- criação de nova entidade;
- remoção de entidade;
- alteração de relacionamentos;
- mudança de cardinalidade;
- criação de novo domínio;
- divisão de módulos;
- alterações relevantes na arquitetura.

---

# Revisões

O ERD deverá passar por revisões periódicas.

Objetivos.

- eliminar inconsistências;
- remover entidades obsoletas;
- validar relacionamentos;
- verificar nomenclaturas;
- manter alinhamento com a documentação.

---

# Compatibilidade

Toda alteração deverá preservar consistência com.

- Database.md;
- Entities.md;
- Relationships.md;
- Migrations.md;
- Architecture.md.

Nenhum documento poderá contradizer outro.

---

# Processo de Evolução

Fluxo recomendado.

```text
Nova Funcionalidade

↓

Análise Arquitetural

↓

Atualização do Database.md

↓

Atualização do ERD

↓

Atualização das Entidades

↓

Migration

↓

Implementação

↓

Testes
```

Essa sequência reduz inconsistências e facilita revisões.

---

# Crescimento por Domínios

Novos módulos deverão ser adicionados ao domínio correspondente.

Caso não exista domínio adequado.

Criar um novo domínio somente após avaliação arquitetural.

Evitar concentrar responsabilidades em um único módulo.

---

# Remoção de Entidades

Entidades removidas deverão ser documentadas.

Antes da remoção definitiva.

Avaliar.

- dependências;
- impacto nas Migrations;
- impacto na Auditoria;
- compatibilidade com versões anteriores.

---

# Versionamento

O ERD deverá possuir controle de versão.

Toda alteração relevante deverá registrar.

- versão;
- data;
- responsável;
- descrição da alteração.

Isso facilita auditorias arquiteturais futuras.

---

# Ferramentas

O formato do diagrama poderá mudar.

Entretanto.

A organização arquitetural permanecerá a mesma.

O MedFlow não depende de uma ferramenta específica.

Depende das convenções estabelecidas nesta documentação.

---

# Revisão Arquitetural

Mudanças estruturais deverão responder.

- esta entidade pertence ao domínio correto?
- existe duplicação?
- os relacionamentos continuam consistentes?
- o fluxo principal permanece válido?
- há impacto em outros módulos?

Caso qualquer resposta seja negativa.

A alteração deverá ser reavaliada.

---

# Boas Práticas

✔ Atualizar o ERD junto com a Migration.

✔ Revisar o diagrama periodicamente.

✔ Manter os domínios organizados.

✔ Evitar cruzamento excessivo de relacionamentos.

✔ Documentar mudanças importantes.

---

# Anti-Patterns

Nunca fazer.

❌ Atualizar apenas o banco.

❌ Atualizar apenas o ERD.

❌ Criar entidades sem documentação.

❌ Permitir divergência entre documentos.

❌ Alterar domínios sem revisão arquitetural.

---

# Checklist

Toda alteração estrutural deverá responder.

- o ERD foi atualizado?
- os documentos relacionados foram revisados?
- a Migration foi criada?
- os relacionamentos permanecem corretos?
- o fluxo principal continua consistente?
- a documentação foi versionada?

Caso qualquer resposta seja negativa.

A alteração não deverá ser considerada concluída.

---

# Referências Cruzadas

Este capítulo complementa.

- Database.md
- Entities.md
- Relationships.md
- Migrations.md
- Architecture.md

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O ERD será tratado como um artefato vivo da arquitetura do MedFlow, evoluindo continuamente junto com o banco de dados e a documentação.

**Motivação**

- Consistência
- Manutenção
- Rastreabilidade
- Clareza
- Evolução sustentável

**Alternativas Avaliadas**

- Atualização esporádica
- Diagramas sem versionamento
- Documentação desvinculada da implementação

**Resultado**

Toda evolução estrutural da plataforma deverá ser refletida simultaneamente no banco de dados, na documentação e no ERD, garantindo alinhamento permanente entre arquitetura e implementação.

---

# Encerramento do Documento

O **ERD.md** representa a visão estrutural da camada de dados do MedFlow.

Seu objetivo é permitir que qualquer desenvolvedor compreenda rapidamente como os domínios se relacionam, como as entidades evoluem e como a informação percorre a plataforma.

Este documento deverá permanecer sincronizado com a implementação real do banco de dados e servir como referência visual para toda evolução arquitetural do projeto.