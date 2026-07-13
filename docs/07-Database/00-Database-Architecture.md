# Database

| Campo | Valor |
|-------|--------|
| Documento | Database |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Database |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define a arquitetura oficial da camada de dados do MedFlow.

O banco de dados representa um dos ativos mais importantes da plataforma.

Toda funcionalidade implementada depende direta ou indiretamente desta camada.

Por esse motivo, toda decisão relacionada à persistência deverá seguir rigorosamente as diretrizes estabelecidas neste documento.

Este documento funciona como a especificação oficial da arquitetura de dados do MedFlow.

---

# Introdução

Softwares mudam constantemente.

Frameworks são substituídos.

Linguagens evoluem.

Bibliotecas deixam de existir.

Entretanto, os dados permanecem.

O banco de dados representa a memória permanente da plataforma.

Cada consulta realizada.

Cada prontuário criado.

Cada pagamento processado.

Cada exame anexado.

Tudo isso dependerá da qualidade da arquitetura de dados.

Uma decisão incorreta na modelagem poderá afetar milhares de clínicas durante muitos anos.

Por esse motivo, a camada de dados recebe um nível de documentação significativamente superior às demais áreas do projeto.

---

# Filosofia

No MedFlow, o banco de dados não é tratado apenas como um mecanismo de armazenamento.

Ele representa um componente estratégico da arquitetura.

Toda modelagem deve considerar que a plataforma poderá operar durante décadas.

Isso significa que cada tabela, relacionamento, índice e constraint deve ser projetado pensando em evolução contínua.

Toda decisão deverá equilibrar:

- simplicidade;
- desempenho;
- integridade;
- segurança;
- escalabilidade;
- facilidade de manutenção.

---

# Princípios Fundamentais

A camada de dados do MedFlow foi construída sobre dez princípios fundamentais.

---

## 1. Integridade acima de conveniência

Dados incorretos custam muito mais caro do que código complexo.

Sempre que possível, o próprio banco deverá impedir estados inválidos.

Utilizar:

- Constraints;
- Foreign Keys;
- Transactions;
- Checks;
- Índices únicos.

Nunca confiar exclusivamente na aplicação.

---

## 2. Clareza acima de criatividade

Uma tabela representa um único conceito.

Uma coluna representa uma única informação.

Evitar nomes ambíguos.

Evitar múltiplos significados.

Evitar estruturas difíceis de compreender.

---

## 3. Evolução contínua

Toda modelagem deverá permitir crescimento.

Novos módulos deverão ser adicionados sem necessidade de reconstrução do banco.

Toda estrutura deverá ser preparada para evolução incremental.

---

## 4. Performance desde o início

Performance nunca será tratada como uma etapa posterior.

Toda tabela deverá nascer considerando:

- índices;
- consultas;
- crescimento esperado;
- volume de registros;
- frequência de acesso.

---

## 5. Segurança como padrão

Todo dado deverá possuir proteção adequada.

Incluindo:

- autenticação;
- autorização;
- isolamento por Tenant;
- auditoria;
- criptografia quando aplicável.

Segurança nunca será opcional.

---

## 6. Baixo acoplamento

As regras de negócio pertencem à aplicação.

O banco existe para garantir consistência dos dados.

Evitar lógica complexa dentro da camada de persistência.

---

## 7. Rastreabilidade

Toda alteração relevante deverá poder ser identificada futuramente.

O sistema deverá permitir responder perguntas como:

- Quem alterou?
- Quando alterou?
- O que foi alterado?
- Qual era o valor anterior?
- Qual é o valor atual?

---

## 8. Escalabilidade

A arquitetura deverá suportar crescimento constante.

Sem necessidade de alterações estruturais profundas.

O objetivo é permitir:

- milhares de clínicas;
- milhões de pacientes;
- dezenas de milhões de consultas;
- centenas de milhões de registros clínicos.

---

## 9. Padronização

Toda tabela deverá seguir os mesmos padrões.

Toda coluna deverá seguir convenções.

Toda chave deverá seguir convenções.

Toda migration deverá seguir convenções.

Padronização reduz erros.

---

## 10. Simplicidade

A solução mais simples deverá ser preferida.

Complexidade somente será aceita quando produzir benefícios claros para a arquitetura.

---

# Responsabilidades da Camada de Dados

A camada de dados é responsável por:

- persistir informações;
- garantir integridade;
- manter relacionamentos;
- proteger consistência;
- oferecer desempenho adequado;
- preservar histórico.

Ela não é responsável por:

- regras de negócio;
- autenticação;
- autorização;
- interface;
- lógica da aplicação.

Essas responsabilidades pertencem às demais camadas.

---

# Banco Oficial

O MedFlow utiliza oficialmente:

## PostgreSQL

Motivos.

- maturidade;
- estabilidade;
- excelente desempenho;
- recursos avançados;
- suporte a JSONB;
- Full Text Search;
- índices avançados;
- Row Level Security;
- transações robustas;
- grande comunidade.

Nenhum outro banco é oficialmente suportado neste momento.

---

# ORM Oficial

Toda comunicação ocorrerá através do Drizzle ORM.

O objetivo é manter:

- tipagem completa;
- migrations controladas;
- baixo acoplamento;
- facilidade de manutenção.

Consultas SQL diretas somente serão permitidas quando houver justificativa técnica documentada.

---

# Arquitetura Geral

```text
Application

↓

Services

↓

Repositories

↓

Drizzle ORM

↓

PostgreSQL

↓

Storage (quando necessário)
```

Cada camada possui responsabilidades bem definidas.

---

# Objetivos deste Documento

Os próximos capítulos irão definir detalhadamente:

- convenções de modelagem;
- tabelas;
- colunas;
- UUID;
- relacionamentos;
- índices;
- constraints;
- transações;
- auditoria;
- Soft Delete;
- RLS;
- migrations;
- performance;
- backup;
- escalabilidade.

Nenhuma decisão relacionada ao banco deverá contradizer este documento.

---

# Declaração Final

A camada de dados representa um dos pilares fundamentais do MedFlow.

Sua arquitetura foi projetada para suportar anos de evolução, milhões de registros e milhares de clínicas sem comprometer desempenho, segurança ou consistência.

Toda implementação relacionada ao banco de dados deverá seguir rigorosamente os princípios estabelecidos neste documento.

---

# Capítulo 2 — Convenções Gerais da Modelagem

## Objetivo

Este capítulo estabelece os padrões obrigatórios para modelagem do banco de dados do MedFlow.

Todas as tabelas, colunas, relacionamentos e estruturas futuras deverão seguir estas convenções.

Essas regras existem para manter consistência entre todos os módulos da plataforma.

Nenhuma exceção deverá ser criada sem justificativa técnica documentada.

---

# Filosofia

A modelagem do banco deve ser previsível.

Um desenvolvedor deve conseguir abrir qualquer tabela e imediatamente compreender sua estrutura.

Toda entidade deverá seguir exatamente os mesmos padrões.

A consistência é mais importante do que preferências individuais.

---

# Convenções Gerais

Toda tabela deverá possuir:

- identificador único;
- timestamps;
- controle de atualização;
- suporte à auditoria;
- suporte ao Multi-Tenant quando aplicável;
- nomenclatura padronizada.

---

# Nome das Tabelas

Todas as tabelas deverão utilizar:

- inglês;
- letras minúsculas;
- snake_case;
- plural.

Exemplos.

Correto.

```text
patients

appointments

medical_records

payment_transactions

notification_templates
```

Incorreto.

```text
Patient

Patients

patientTable

tb_patients

PACIENTES
```

---

# Nome das Colunas

Todas as colunas deverão utilizar.

- inglês;
- snake_case;
- nomes completos;
- sem abreviações desnecessárias.

Correto.

```text
first_name

last_name

birth_date

created_at

updated_at

deleted_at
```

Incorreto.

```text
fname

birth

dt

upd

cad
```

---

# Nome das Chaves Primárias

Toda tabela deverá possuir uma única chave primária.

Nome obrigatório.

```text
id
```

Nunca utilizar.

```text
patient_id

appointment_id

pk_patient
```

Dentro da própria tabela.

Sempre utilizar apenas:

```text
id
```

---

# Chaves Estrangeiras

Toda chave estrangeira deverá seguir o padrão.

```text
nome_da_tabela_id
```

Exemplos.

```text
patient_id

clinic_id

professional_id

appointment_id

subscription_id
```

---

# Datas

Toda coluna de data deverá terminar com.

```text
_at
```

Exemplos.

```text
created_at

updated_at

deleted_at

confirmed_at

scheduled_at

paid_at

cancelled_at
```

Nunca utilizar.

```text
date

dt

creation

lastUpdate
```

---

# Valores Booleanos

Utilizar nomes que representem estados.

Exemplos.

```text
is_active

is_default

is_verified

is_public
```

Evitar.

```text
active

default

verified
```

---

# Campos Obrigatórios

Sempre que possível.

Utilizar NOT NULL.

Campos opcionais deverão ser exceções.

Não regra.

---

# Valores Monetários

Nunca utilizar FLOAT.

Nunca utilizar DOUBLE.

Utilizar tipos apropriados para precisão financeira.

Exemplo.

```text
DECIMAL

NUMERIC
```

---

# Texto

Escolher o tipo de coluna considerando o uso.

Exemplos.

```text
VARCHAR

TEXT
```

Evitar limites arbitrários.

---

# Enumerações

Sempre que possível.

Utilizar ENUMs ou tabelas auxiliares.

Evitar Strings livres para representar estados.

Exemplo.

Correto.

```text
status

↓

PENDING

CONFIRMED

CANCELLED
```

Incorreto.

```text
status

↓

"ok"

↓

"waiting"

↓

"talvez"

↓

"abc"
```

---

# Chaves Naturais

Nunca utilizar CPF, Email ou Telefone como chave primária.

Sempre utilizar um identificador independente.

---

# Dados Calculados

Sempre que possível.

Evitar armazenar dados derivados.

Exemplo.

Errado.

```text
idade
```

Correto.

```text
birth_date
```

A idade é calculada pela aplicação.

---

# Campos Duplicados

Nunca duplicar informações.

Exemplo.

Errado.

```text
patient_name

patient_email

patient_phone
```

Dentro da tabela de consultas.

Essas informações pertencem à entidade Patient.

---

# Relacionamentos

Sempre utilizar Foreign Keys.

Nunca relacionamentos implícitos.

---

# Null

Campos NULL deverão representar ausência de informação.

Nunca utilizar NULL para representar estados.

Exemplo.

Errado.

```text
paid_at = NULL

↓

Pagamento recusado
```

Correto.

```text
status = REJECTED
```

---

# Comentários

Toda tabela deverá possuir descrição.

Toda coluna crítica deverá possuir documentação.

O objetivo é facilitar manutenção futura.

---

# Padronização

Todas as tabelas deverão possuir aparência semelhante.

Exemplo.

```text
id

clinic_id

...

created_at

updated_at

deleted_at
```

A previsibilidade reduz erros durante desenvolvimento.

---

# Anti-Patterns

Nunca fazer.

❌ Tabelas com nomes diferentes do padrão.

❌ Colunas duplicadas.

❌ Chaves compostas sem necessidade.

❌ Campos genéricos.

```text
field1

field2

obs

info
```

❌ Armazenar listas em texto.

❌ Misturar múltiplos conceitos na mesma tabela.

---

# Checklist

Toda nova tabela deverá responder.

- utiliza inglês?
- utiliza snake_case?
- possui id?
- possui timestamps?
- possui Foreign Keys?
- evita duplicação?
- respeita Multi-Tenant?
- segue nomenclatura oficial?

Caso qualquer resposta seja negativa.

A modelagem deverá ser revisada.

---

# Declaração Final

As convenções definidas neste capítulo representam o padrão oficial de modelagem do MedFlow.

Sua aplicação consistente garante organização, previsibilidade e facilidade de manutenção ao longo de toda a evolução da plataforma.

Nenhuma tabela deverá ser criada fora desses padrões.

---

# Capítulo 3 — Identificadores (UUID, Chaves Primárias e Chaves Estrangeiras)

## Objetivo

Este capítulo define a estratégia oficial de identificação de registros do MedFlow.

Toda entidade persistida deverá seguir rigorosamente as convenções descritas neste documento.

A escolha da estratégia de identificação impacta diretamente:

- segurança;
- escalabilidade;
- sincronização;
- integrações;
- desempenho;
- arquitetura distribuída.

Por esse motivo, esta decisão é considerada permanente.

---

# Filosofia

No MedFlow, cada registro representa uma entidade única.

Esse registro deverá possuir um identificador que jamais será reutilizado.

Mesmo após exclusão lógica ou física.

Um identificador representa a identidade permanente daquele registro.

---

# Estratégia Oficial

O MedFlow utilizará oficialmente:

**UUID versão 7 (UUIDv7)**

Como chave primária para todas as entidades da plataforma.

Caso o UUIDv7 ainda não esteja disponível na stack utilizada.

Utilizar UUIDv4 até migração futura.

---

# Por que UUID?

UUID oferece diversas vantagens.

## Unicidade Global

Dois servidores podem criar registros ao mesmo tempo.

Sem risco de colisão.

---

## Arquitetura Distribuída

Permite múltiplas instâncias da aplicação.

Sem depender do banco para gerar identificadores.

---

## Segurança

URLs deixam de ser previsíveis.

Exemplo.

Errado.

```text
/patients/15

/patients/16

/patients/17
```

Correto.

```text
/patients/0198407f-6e44-72d8-a3b8-b1d64b4e9a12
```

Isso dificulta ataques de enumeração.

---

## Integrações

Sistemas externos podem armazenar nossos IDs.

Sem risco de conflitos.

---

## Offline First

No futuro.

O aplicativo poderá criar registros localmente.

Mesmo sem conexão.

Quando sincronizar.

Os IDs continuarão válidos.

---

# Nome da Chave Primária

Toda tabela deverá utilizar.

```text
id
```

Nunca.

```text
patient_id

appointment_id

clinic_pk
```

Dentro da própria tabela.

Sempre apenas:

```text
id
```

---

# Tipo

Toda chave primária utilizará.

```sql
UUID
```

Nunca utilizar.

```sql
INTEGER

BIGINT

SERIAL

AUTO_INCREMENT
```

---

# Geração

A geração do UUID deverá ocorrer preferencialmente na aplicação.

Não depender exclusivamente do banco.

Isso facilita:

- testes;
- sincronização;
- processamento distribuído;
- criação offline.

---

# Imutabilidade

Um ID nunca poderá ser alterado.

Mesmo que:

- o paciente mude de nome;
- a clínica seja alterada;
- o registro seja restaurado.

A identidade permanece a mesma.

---

# Chaves Estrangeiras

Toda referência utilizará o mesmo tipo.

Exemplo.

```text
patients

id (UUID)

↓

appointments

patient_id (UUID)
```

Nunca misturar tipos.

---

# Consistência

Se uma tabela utiliza UUID.

Todas as tabelas relacionadas também deverão utilizar UUID.

Misturar UUID com INTEGER é proibido.

---

# Índices

Toda chave primária já será indexada automaticamente.

As Foreign Keys também deverão possuir índices quando utilizadas frequentemente em consultas.

Os detalhes sobre índices serão abordados em capítulo específico.

---

# IDs Públicos

O UUID poderá ser utilizado externamente.

Exemplos.

- URLs;
- APIs;
- QR Codes;
- Integrações.

Nunca expor identificadores internos diferentes do UUID.

---

# IDs Humanos

Quando necessário.

O sistema poderá gerar identificadores amigáveis.

Exemplo.

```text
CONS-2026-000153

REC-2026-001024
```

Esses identificadores nunca substituirão o UUID.

Eles existem apenas para facilitar comunicação humana.

---

# Chaves Naturais

Nunca utilizar como identificador principal.

- CPF;
- Email;
- CRM;
- Telefone;
- Número da Receita.

Esses dados podem mudar.

A identidade do registro não.

---

# Performance

UUID possui custo ligeiramente maior que INTEGER.

Entretanto.

Os benefícios arquiteturais superam esse impacto.

Especialmente considerando.

- segurança;
- escalabilidade;
- sincronização;
- arquitetura distribuída.

---

# Migrações

Toda nova tabela deverá nascer utilizando UUID.

Não criar tabelas utilizando SERIAL esperando migrar futuramente.

---

# Anti-Patterns

Nunca fazer.

❌ AUTO_INCREMENT

❌ SERIAL

❌ BIGINT

❌ INTEGER

❌ Utilizar CPF como Primary Key

❌ Alterar IDs existentes

❌ Misturar UUID com INTEGER

---

# Checklist

Toda nova entidade deverá responder.

- utiliza UUID?
- possui coluna id?
- gera UUID corretamente?
- utiliza UUID nas Foreign Keys?
- evita chaves naturais?
- respeita imutabilidade?

Caso qualquer resposta seja negativa.

A modelagem deverá ser revisada.

---

# Declaração Final

Os identificadores representam a identidade permanente das entidades do MedFlow.

A utilização de UUID fortalece a segurança, simplifica integrações, permite arquiteturas distribuídas e prepara a plataforma para futuras funcionalidades como sincronização offline e múltiplas instâncias da aplicação.

Toda nova entidade deverá seguir rigorosamente esta estratégia.

---

---

# Capítulo 4 — Convenções de Tabelas

## Objetivo

Este capítulo estabelece as convenções oficiais para criação de tabelas no banco de dados do MedFlow.

Toda nova tabela deverá seguir rigorosamente estas diretrizes.

O objetivo é garantir consistência, previsibilidade, facilidade de manutenção e escalabilidade em toda a plataforma.

---

# Filosofia

Cada tabela representa um único conceito do domínio.

Ela deve ser simples de compreender, possuir responsabilidade única e evitar armazenar informações que pertençam a outras entidades.

A modelagem deverá privilegiar clareza em vez de conveniência.

---

# Uma Tabela = Um Conceito

Cada tabela deverá representar apenas uma entidade do domínio.

Exemplos.

```text
patients

appointments

clinics

professionals

medical_records

payments
```

Nunca criar tabelas que representem múltiplos conceitos simultaneamente.

---

# Estrutura Padrão

Sempre que aplicável, todas as tabelas deverão seguir a seguinte organização.

```text
id

tenant_id (quando aplicável)

...

created_at

updated_at

deleted_at
```

Essa organização facilita leitura e manutenção.

---

# Ordem das Colunas

A ordem recomendada será:

1. Chave Primária
2. Chaves Estrangeiras
3. Dados principais
4. Campos de configuração
5. Campos de controle
6. Timestamps

Exemplo.

```text
id

clinic_id

patient_id

first_name

last_name

email

phone

status

created_at

updated_at

deleted_at
```

---

# Nomeação

Toda tabela deverá utilizar.

- inglês;
- snake_case;
- plural;
- nomes completos.

Exemplos.

```text
patients

medical_records

payment_transactions

notification_templates
```

Evitar.

```text
patient

tb_patient

tbl_patients

patients_table
```

---

# Tabelas de Relacionamento

Relacionamentos N:N deverão utilizar tabelas específicas.

Exemplo.

```text
professionals

specialties

↓

professional_specialties
```

Nunca armazenar listas dentro de uma única coluna.

---

# Colunas Obrigatórias

Sempre que possível.

Utilizar NOT NULL.

Campos opcionais devem representar exceções.

Não regra.

---

# Campos de Controle

Toda entidade persistente deverá possuir.

```text
created_at

updated_at
```

Quando houver exclusão lógica.

Também deverá possuir.

```text
deleted_at
```

---

# Soft Delete

Quando utilizado.

Os registros nunca serão removidos imediatamente.

A coluna.

```text
deleted_at
```

Indica que o registro foi desativado.

Consultas padrão nunca deverão retornar registros excluídos.

---

# Tenant

Toda tabela pertencente a uma clínica deverá possuir.

```text
clinic_id
```

Ou outro identificador oficial do Tenant.

Esse campo será obrigatório para garantir isolamento entre clínicas.

---

# Auditoria

Entidades críticas poderão possuir informações adicionais.

Exemplos.

```text
created_by

updated_by

deleted_by
```

Esses campos complementam o sistema oficial de auditoria.

---

# Status

Estados deverão utilizar ENUMs.

Exemplo.

```text
PENDING

CONFIRMED

CANCELLED

COMPLETED
```

Evitar armazenar estados como texto livre.

---

# Valores Monetários

Sempre utilizar tipos numéricos de precisão.

Nunca utilizar FLOAT.

Exemplos.

```text
NUMERIC

DECIMAL
```

---

# Dados Clínicos

Informações clínicas deverão permanecer normalizadas.

Evitar armazenar documentos completos em uma única coluna quando houver necessidade de consultas frequentes.

JSONB poderá ser utilizado apenas quando houver justificativa arquitetural.

---

# Campos Derivados

Não armazenar informações que possam ser calculadas.

Exemplo.

Errado.

```text
age
```

Correto.

```text
birth_date
```

A idade será calculada pela aplicação.

---

# Integridade

Toda relação deverá utilizar Foreign Keys.

Nunca confiar apenas na aplicação para manter consistência.

---

# Índices

Os índices deverão ser definidos conforme o padrão estabelecido em `Indexes.md`.

Não criar índices sem necessidade.

Também não deixar consultas críticas sem indexação.

---

# Documentação

Toda nova tabela deverá possuir.

- descrição;
- finalidade;
- relacionamentos;
- observações importantes.

A documentação faz parte da modelagem.

---

# Evolução

Toda tabela deverá ser preparada para crescimento.

Evitar soluções que dificultem futuras alterações.

Sempre considerar.

- novas funcionalidades;
- novos módulos;
- aumento do volume de dados.

---

# Anti-Patterns

Nunca fazer.

❌ Uma tabela para múltiplos conceitos.

❌ Campos genéricos.

```text
field1

field2

extra

obs
```

❌ Duplicação de informações.

❌ Armazenar listas separadas por vírgula.

❌ Utilizar JSON como substituto de modelagem relacional.

❌ Criar tabelas sem timestamps.

---

# Checklist

Toda nova tabela deverá responder.

- representa apenas um conceito?
- utiliza nomenclatura oficial?
- possui timestamps?
- possui chaves corretamente definidas?
- respeita Multi-Tenant?
- evita duplicação?
- possui documentação?

Caso qualquer resposta seja negativa.

A modelagem deverá ser revisada.

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

Toda tabela do MedFlow seguirá uma estrutura padronizada de identificação, relacionamentos, dados, controle e timestamps.

**Motivação**

- Consistência
- Facilidade de manutenção
- Evolução da plataforma
- Leitura previsível
- Padronização entre módulos

**Alternativas Avaliadas**

- Estruturas livres por módulo
- Convenções diferentes por equipe
- Organização baseada apenas na preferência do desenvolvedor

**Resultado**

Foi adotada uma convenção única para todas as tabelas do MedFlow.

---

---

# Capítulo 5 — Convenções de Colunas

## Objetivo

Este capítulo define os padrões oficiais para criação de colunas no banco de dados do MedFlow.

Toda coluna criada na plataforma deverá seguir rigorosamente estas convenções.

O objetivo é garantir uniformidade, legibilidade, consistência e facilidade de manutenção ao longo de toda a evolução do sistema.

---

# Filosofia

As colunas representam atributos das entidades.

Cada coluna deve possuir um único significado.

Nunca utilizar uma coluna para armazenar informações diferentes dependendo do contexto.

A clareza da modelagem é mais importante do que reduzir a quantidade de colunas.

---

# Convenções Gerais

Toda coluna deverá possuir.

- nome descritivo;
- tipo apropriado;
- responsabilidade única;
- documentação quando necessário.

---

# Idioma

Todos os nomes deverão utilizar.

- inglês;
- snake_case;
- letras minúsculas.

Correto.

```text
first_name

last_name

birth_date

created_at

updated_at
```

Incorreto.

```text
Nome

primeiroNome

BirthDate

DtNascimento

campo1
```

---

# Clareza

Os nomes deverão ser autoexplicativos.

Evitar abreviações.

Correto.

```text
appointment_date

payment_status

medical_license_number
```

Incorreto.

```text
appt

dt

sts

lic
```

---

# Tipos de Texto

Utilizar.

```text
VARCHAR
```

Quando existir tamanho conhecido.

Exemplos.

- nome;
- email;
- telefone.

Utilizar.

```text
TEXT
```

Quando não houver limite previsível.

Exemplos.

- observações;
- descrição;
- evolução clínica.

---

# Datas

Todas as datas deverão terminar com.

```text
_at
```

Exemplos.

```text
created_at

updated_at

deleted_at

scheduled_at

confirmed_at

paid_at

expires_at
```

Quando representar apenas uma data sem horário.

Utilizar.

```text
_date
```

Exemplos.

```text
birth_date

admission_date
```

---

# Horários

Quando representar apenas horário.

Utilizar.

```text
_time
```

Exemplos.

```text
start_time

end_time
```

---

# Valores Booleanos

Todo booleano deverá iniciar com.

```text
is_
```

ou.

```text
has_
```

Exemplos.

```text
is_active

is_verified

is_deleted

has_signature

has_photo
```

Evitar.

```text
active

verified

deleted
```

---

# Valores Monetários

Sempre utilizar.

```text
NUMERIC
```

ou.

```text
DECIMAL
```

Nunca.

```text
FLOAT

DOUBLE
```

Exemplos.

```text
amount

total_amount

discount_amount

paid_amount
```

---

# Quantidades

Sempre utilizar tipos inteiros.

Exemplos.

```text
quantity

available_slots

retry_count
```

---

# Percentuais

Sempre armazenar como valor decimal.

Exemplo.

```text
15.50
```

Representando.

15,50%

Nunca armazenar.

```text
0.155
```

Sem documentação clara.

---

# Enumerações

Estados deverão utilizar ENUMs.

Exemplos.

```text
status

role

payment_status

appointment_status
```

Nunca utilizar texto livre.

---

# Identificadores

Toda chave estrangeira deverá terminar com.

```text
_id
```

Exemplos.

```text
patient_id

clinic_id

appointment_id

subscription_id
```

---

# Arquivos

Arquivos deverão armazenar apenas referências.

Exemplo.

```text
file_path

storage_key

mime_type

file_size
```

Nunca armazenar arquivos binários diretamente nas tabelas de negócio.

---

# URLs

Sempre utilizar nomes explícitos.

Exemplos.

```text
avatar_url

document_url

payment_url
```

---

# JSON

JSONB deverá ser utilizado apenas quando existir justificativa técnica.

Exemplos aceitáveis.

- configurações;
- metadados;
- integrações externas;
- respostas de APIs.

Nunca utilizar JSON para substituir relacionamentos.

---

# Senhas

Nunca armazenar senhas em texto puro.

Somente armazenar.

```text
password_hash
```

Jamais.

```text
password
```

---

# Tokens

Tokens deverão possuir.

```text
token

expires_at

created_at
```

Sempre considerar expiração.

---

# Valores Calculados

Evitar armazenar informações derivadas.

Exemplo.

Errado.

```text
patient_age
```

Correto.

```text
birth_date
```

---

# Auditoria

Campos recomendados.

```text
created_by

updated_by

deleted_by
```

Quando aplicável.

---

# Soft Delete

Toda entidade que utilizar exclusão lógica deverá possuir.

```text
deleted_at
```

Nunca utilizar.

```text
is_deleted
```

O timestamp fornece muito mais contexto.

---

# Valores Obrigatórios

Sempre preferir.

```text
NOT NULL
```

Campos opcionais devem ser exceções.

---

# Comentários

Colunas críticas deverão possuir descrição.

Principalmente.

- financeiras;
- clínicas;
- integrações;
- auditoria.

---

# Anti-Patterns

Nunca fazer.

❌ Abreviações.

❌ Campos genéricos.

```text
value

data

info

obs

field1
```

❌ Misturar múltiplos significados.

❌ Utilizar FLOAT para dinheiro.

❌ Utilizar JSON sem necessidade.

❌ Armazenar idade.

❌ Armazenar senha em texto puro.

---

# Checklist

Toda nova coluna deverá responder.

- possui nome descritivo?
- utiliza inglês?
- utiliza snake_case?
- possui tipo adequado?
- evita duplicação?
- respeita as convenções?
- necessita documentação?

Caso qualquer resposta seja negativa.

A modelagem deverá ser revisada.

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

Todas as colunas do MedFlow seguirão uma convenção única de nomenclatura, tipagem e organização.

**Motivação**

- Facilidade de leitura
- Padronização
- Manutenção
- Escalabilidade
- Redução de erros

**Alternativas Avaliadas**

- Convenções por módulo
- Convenções por desenvolvedor
- Abreviações

**Resultado**

Foi adotada uma convenção única para toda a plataforma.

---

---

# Capítulo 6 — Relacionamentos e Integridade Referencial

## Objetivo

Este capítulo define as regras oficiais para criação de relacionamentos entre entidades do MedFlow.

Relacionamentos representam uma das bases da arquitetura de dados e garantem que todas as informações da plataforma permaneçam consistentes durante toda sua vida útil.

Toda relação entre tabelas deverá seguir rigorosamente as convenções definidas neste documento.

---

# Filosofia

No MedFlow nenhuma informação existe isoladamente.

Pacientes possuem consultas.

Consultas pertencem a clínicas.

Profissionais atendem pacientes.

Prontuários pertencem a consultas.

Pagamentos pertencem a assinaturas.

Essas conexões fazem parte do domínio do sistema e devem ser representadas explicitamente pelo banco de dados.

Nunca pela aplicação.

---

# Integridade Referencial

Toda relação deverá utilizar Foreign Keys.

O banco deverá impedir automaticamente referências inválidas.

Exemplo.

Errado.

```text
appointment.patient_id

↓

Paciente inexistente
```

Correto.

```text
appointment.patient_id

↓

patients.id
```

---

# Tipos de Relacionamento

O MedFlow utilizará apenas os relacionamentos oficiais do modelo relacional.

---

## Um para Um (1:1)

Utilizado quando uma entidade possui exatamente outra.

Exemplo.

```text
Patient

↓

PatientSettings
```

Outro exemplo.

```text
Clinic

↓

ClinicConfiguration
```

Evitar esse relacionamento quando as informações puderem permanecer na mesma tabela.

---

## Um para Muitos (1:N)

É o relacionamento mais utilizado.

Exemplo.

```text
Clinic

↓

Patients
```

Outro exemplo.

```text
Professional

↓

Appointments
```

---

## Muitos para Muitos (N:N)

Sempre utilizar tabela intermediária.

Exemplo.

```text
Professionals

↓

professional_specialties

↓

Specialties
```

Nunca armazenar listas em texto.

---

# Tabelas Intermediárias

Toda relação N:N deverá possuir sua própria tabela.

Exemplo.

```text
patient_allergies

professional_specialties

role_permissions

user_roles
```

Essas tabelas também deverão seguir todas as convenções do projeto.

---

# Cardinalidade

Toda relação deverá possuir cardinalidade claramente definida.

Exemplo.

```text
Clinic

1

↓

N

Patients
```

Outro exemplo.

```text
Appointment

1

↓

1

MedicalRecord
```

A documentação deverá deixar isso explícito.

---

# Foreign Keys

Toda chave estrangeira deverá possuir.

- constraint;
- índice quando necessário;
- nomenclatura oficial;
- mesmo tipo da chave primária.

Nunca utilizar tipos diferentes.

---

# ON DELETE

As ações deverão ser escolhidas cuidadosamente.

Exemplos.

## RESTRICT

Utilizado quando a exclusão não deve ocorrer caso existam dependências.

Exemplo.

```text
Clinic

↓

Patients
```

Uma clínica não poderá ser removida caso possua pacientes vinculados.

---

## CASCADE

Utilizar apenas quando a exclusão automática fizer sentido.

Exemplo.

```text
Appointment

↓

AppointmentAttachments
```

Ao remover a consulta.

Os anexos podem ser removidos automaticamente.

---

## SET NULL

Utilizar quando a relação puder deixar de existir.

Exemplo.

```text
Professional

↓

updated_by
```

Caso o usuário seja removido.

O histórico permanece.

---

# ON UPDATE

Sempre que possível.

Utilizar.

```text
RESTRICT
```

As chaves primárias nunca deverão ser alteradas.

---

# Relacionamentos Obrigatórios

Quando a existência de uma entidade depender de outra.

Utilizar NOT NULL.

Exemplo.

```text
appointments.patient_id
```

Nunca permitir uma consulta sem paciente.

---

# Relacionamentos Opcionais

Somente utilizar NULL quando a ausência da relação fizer sentido.

Exemplo.

```text
cancelled_by
```

Uma consulta pode nunca ter sido cancelada.

---

# Integridade de Negócio

A integridade referencial garante apenas a existência da relação.

As regras de negócio continuam pertencendo aos Services.

Exemplo.

O banco garante.

```text
patient_id existe.
```

O Service garante.

```text
O paciente pertence à mesma clínica.
```

---

# Exclusão Lógica

Quando houver Soft Delete.

As Foreign Keys permanecem válidas.

Os registros continuam relacionados.

A aplicação decidirá se registros excluídos deverão aparecer nas consultas.

---

# Multi-Tenant

Toda relação deverá respeitar isolamento entre clínicas.

Nunca permitir que uma entidade faça referência a registros pertencentes a outro Tenant.

Essa validação deverá existir tanto na aplicação quanto no banco sempre que possível.

---

# Performance

Relacionamentos frequentemente consultados deverão possuir índices apropriados.

Exemplos.

```text
patient_id

clinic_id

professional_id

appointment_id
```

A estratégia completa de indexação será definida em `Indexes.md`.

---

# Documentação

Todo relacionamento deverá ser documentado.

Informações mínimas.

- origem;
- destino;
- cardinalidade;
- obrigatoriedade;
- comportamento em exclusão;
- comportamento em atualização.

---

# Anti-Patterns

Nunca fazer.

❌ Relacionamentos implícitos.

❌ IDs armazenados em texto.

❌ Listas separadas por vírgula.

❌ Duplicação de informações.

❌ Chaves estrangeiras sem constraint.

❌ CASCADE sem justificativa.

❌ Relacionamentos entre Tenants diferentes.

---

# Checklist

Todo novo relacionamento deverá responder.

- utiliza Foreign Key?
- possui cardinalidade definida?
- possui comportamento ON DELETE?
- possui comportamento ON UPDATE?
- respeita Multi-Tenant?
- possui índice quando necessário?
- está documentado?

Caso qualquer resposta seja negativa.

O relacionamento deverá ser revisado.

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

Todo relacionamento do MedFlow será explícito, utilizando Foreign Keys e integridade referencial nativa do PostgreSQL.

**Motivação**

- Consistência
- Segurança
- Facilidade de manutenção
- Performance
- Clareza da modelagem

**Alternativas Avaliadas**

- Relacionamentos implícitos
- IDs armazenados em texto
- Controle apenas pela aplicação

**Resultado**

Foi adotado o uso obrigatório de Foreign Keys e integridade referencial para toda a plataforma.

---

---

# Capítulo 7 — Índices e Otimização de Consultas

## Objetivo

Este capítulo define a estratégia oficial de indexação do banco de dados do MedFlow.

Os índices têm como objetivo acelerar consultas, reduzir o tempo de resposta e garantir que a plataforma permaneça performática durante seu crescimento.

Toda criação de índices deverá seguir as diretrizes estabelecidas neste documento.

---

# Filosofia

Índices são ferramentas de otimização.

Eles não existem para todas as colunas.

Cada índice possui um custo.

Enquanto aceleram consultas, também aumentam o custo de:

- INSERT;
- UPDATE;
- DELETE;
- armazenamento.

Portanto, todo índice deverá possuir uma justificativa clara.

---

# Objetivos

A estratégia de indexação deve garantir.

- consultas rápidas;
- baixo consumo de recursos;
- escalabilidade;
- previsibilidade;
- facilidade de manutenção.

---

# Como Funcionam

Sem índice.

```text
Consulta

↓

Tabela

↓

Percorre todos os registros

↓

Resultado
```

---

Com índice.

```text
Consulta

↓

Índice

↓

Localiza registros

↓

Resultado
```

Quanto maior a tabela.

Maior será o benefício.

---

# Índices Obrigatórios

Toda tabela deverá possuir automaticamente.

## Primary Key

```text
id
```

---

## Foreign Keys

Sempre avaliar indexação para.

```text
clinic_id

patient_id

professional_id

appointment_id

subscription_id
```

Essas colunas participam da maioria das consultas.

---

# Índices por Tenant

Como o MedFlow é Multi-Tenant.

Grande parte das consultas possuirá.

```sql
WHERE clinic_id = ?
```

Por esse motivo.

As colunas de Tenant deverão ser indexadas.

---

# Índices Compostos

Quando consultas utilizarem frequentemente múltiplas colunas.

Criar índices compostos.

Exemplo.

```sql
clinic_id

+

status
```

Outro exemplo.

```sql
patient_id

+

created_at
```

Nunca criar índices compostos sem analisar o padrão real de consultas.

---

# Índices Únicos

Utilizar UNIQUE quando o domínio exigir unicidade.

Exemplos.

```text
cpf

crm

email

cnpj
```

Sempre considerar o contexto do Tenant.

Exemplo.

```text
email

+

clinic_id
```

---

# Índices para Datas

Consultas ordenadas por data deverão possuir índices apropriados.

Exemplos.

```text
created_at

scheduled_at

paid_at
```

Principalmente quando utilizadas em dashboards.

---

# Índices para Ordenação

Sempre analisar consultas que utilizam.

```sql
ORDER BY
```

Caso sejam frequentes.

Criar índices apropriados.

---

# Índices para Pesquisa

Campos frequentemente pesquisados deverão ser avaliados.

Exemplos.

```text
email

phone

document

license_number
```

---

# Índices Parciais

Quando apenas parte dos registros é consultada frequentemente.

Utilizar índices parciais.

Exemplo.

```sql
WHERE deleted_at IS NULL
```

ou.

```sql
WHERE status = 'PENDING'
```

Isso reduz tamanho e melhora desempenho.

---

# Índices em Soft Delete

Como consultas normalmente ignoram registros excluídos.

Os índices deverão considerar.

```text
deleted_at IS NULL
```

Sempre que fizer sentido.

---

# JSONB

Caso JSONB seja utilizado.

Criar índices específicos.

Exemplo.

GIN Index.

Nunca depender de Full Scan em JSONB.

---

# Full Text Search

Campos utilizados para pesquisa textual deverão utilizar índices apropriados.

Exemplos.

- pacientes;
- medicamentos;
- diagnósticos;
- observações.

A estratégia completa será definida em capítulo específico.

---

# Índices Desnecessários

Evitar criar índices para.

- colunas raramente pesquisadas;
- colunas booleanas isoladas;
- tabelas pequenas;
- dados temporários.

---

# Monitoramento

Todos os índices deverão ser monitorados.

Avaliar periodicamente.

- utilização;
- tamanho;
- impacto;
- consultas lentas.

Índices não utilizados deverão ser removidos.

---

# Performance

Sempre analisar.

```sql
EXPLAIN

EXPLAIN ANALYZE
```

Antes de otimizar consultas críticas.

Nunca criar índices por tentativa e erro.

---

# Convenções

Os nomes dos índices deverão seguir o padrão.

```text
idx_patients_email

idx_patients_clinic_id

idx_appointments_status

idx_payments_created_at
```

Para índices únicos.

```text
uq_patients_cpf

uq_users_email
```

---

# Anti-Patterns

Nunca fazer.

❌ Indexar todas as colunas.

❌ Índices duplicados.

❌ Índices sem análise.

❌ Ignorar EXPLAIN ANALYZE.

❌ Muitos índices em tabelas com alta escrita.

---

# Checklist

Todo novo índice deverá responder.

- melhora consultas reais?
- possui justificativa?
- evita duplicação?
- possui nome padronizado?
- foi analisado com EXPLAIN?
- não prejudica gravações?

Caso qualquer resposta seja negativa.

O índice deverá ser reavaliado.

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O MedFlow utilizará uma estratégia de indexação baseada em padrões reais de consulta e crescimento da plataforma.

**Motivação**

- Alta performance
- Escalabilidade
- Redução de latência
- Menor consumo de recursos

**Alternativas Avaliadas**

- Indexação automática de todas as colunas
- Ausência de estratégia formal
- Índices definidos apenas durante problemas de performance

**Resultado**

Toda indexação deverá ser planejada, documentada e revisada continuamente conforme a evolução do sistema.

---

---

# Capítulo 8 — Constraints e Regras de Integridade

## Objetivo

Este capítulo define a estratégia oficial de Constraints do banco de dados do MedFlow.

As Constraints representam a última linha de defesa da integridade dos dados, impedindo que informações inconsistentes sejam persistidas mesmo quando a aplicação apresentar falhas.

Toda tabela deverá utilizar Constraints sempre que fizer sentido.

---

# Filosofia

A aplicação valida.

O banco garante.

Mesmo que uma validação seja esquecida na aplicação, o PostgreSQL deverá impedir que dados inválidos sejam armazenados.

As Constraints representam contratos permanentes da camada de dados.

---

# Objetivos

As Constraints existem para garantir.

- integridade;
- consistência;
- previsibilidade;
- segurança;
- qualidade dos dados.

---

# Tipos de Constraints

O MedFlow utilizará oficialmente.

- Primary Key
- Foreign Key
- NOT NULL
- UNIQUE
- CHECK
- DEFAULT

Cada uma possui responsabilidades específicas.

---

# Primary Key

Toda tabela deverá possuir exatamente uma chave primária.

Padrão oficial.

```text
id UUID
```

Nunca utilizar múltiplas chaves primárias.

---

# Foreign Key

Toda relação entre entidades deverá utilizar Foreign Keys.

Exemplo.

```text
appointments.patient_id

↓

patients.id
```

A aplicação nunca deverá controlar relacionamentos sozinha.

---

# NOT NULL

Campos obrigatórios deverão utilizar.

```sql
NOT NULL
```

Exemplos.

```text
first_name

clinic_id

created_at

status
```

Evitar permitir NULL quando a informação sempre deverá existir.

---

# UNIQUE

Utilizar UNIQUE quando o domínio exigir unicidade.

Exemplos.

```text
CPF

CRM

CNPJ

Número do Conselho
```

Quando houver Multi-Tenant.

A unicidade deverá considerar o Tenant.

Exemplo.

```text
(clinic_id, email)
```

Em vez de.

```text
email
```

---

# CHECK

CHECK deverá ser utilizado para impedir estados inválidos.

Exemplos.

Valor monetário.

```sql
amount >= 0
```

Idade.

```sql
birth_date <= CURRENT_DATE
```

Status.

```sql
status IN (...)
```

Sempre que uma regra simples puder ser garantida pelo banco.

Utilizar CHECK.

---

# DEFAULT

Valores padrão deverão ser definidos no banco.

Exemplos.

```text
created_at

↓

NOW()
```

---

```text
is_active

↓

TRUE
```

---

```text
retry_count

↓

0
```

Evitar depender exclusivamente da aplicação.

---

# Integridade Temporal

Datas deverão respeitar sequência lógica.

Exemplo.

```text
updated_at

>=

created_at
```

Quando possível.

Essa regra deverá ser protegida.

---

# Integridade Financeira

Valores financeiros nunca poderão ser negativos.

Exemplo.

```text
payment_amount

>=

0
```

Descontos nunca poderão ultrapassar o valor original.

---

# Integridade Clínica

Sempre que possível.

O banco deverá impedir estados impossíveis.

Exemplo.

Uma consulta concluída deverá possuir.

```text
completed_at
```

Uma receita cancelada deverá possuir motivo de cancelamento.

Essas regras poderão utilizar CHECK quando forem simples.

---

# Multi-Tenant

As Constraints deverão colaborar com o isolamento.

Sempre considerar.

```text
clinic_id
```

Nas restrições de unicidade.

---

# Soft Delete

Registros removidos logicamente continuam existindo.

As Constraints deverão continuar funcionando normalmente.

Quando necessário.

Utilizar índices parciais para manter unicidade apenas entre registros ativos.

---

# Nomeação

Toda Constraint deverá possuir nome padronizado.

Primary Key.

```text
pk_patients
```

Foreign Key.

```text
fk_appointments_patient
```

Unique.

```text
uq_patients_cpf
```

Check.

```text
chk_payment_amount_positive
```

Default.

Utilizar convenções do ORM quando apropriado.

---

# Performance

Constraints possuem custo extremamente baixo quando comparadas ao benefício.

Nunca remover Constraints visando ganho de performance sem evidências concretas.

---

# Exemplos do MedFlow

Tabela Patients.

```text
id

↓

PRIMARY KEY
```

---

```text
clinic_id

↓

FOREIGN KEY
```

---

```text
first_name

↓

NOT NULL
```

---

```text
cpf

↓

UNIQUE
```

---

```text
created_at

↓

DEFAULT NOW()
```

---

# Boas Práticas

✔ Validar também na aplicação.

✔ Utilizar CHECK para regras simples.

✔ Definir DEFAULT quando existir valor padrão.

✔ Nomear todas as Constraints.

✔ Documentar restrições importantes.

---

# Quando Não Utilizar

Evitar CHECK extremamente complexos.

Evitar lógica de negócio dentro das Constraints.

Regras dependentes de múltiplas entidades pertencem aos Services.

---

# Anti-Patterns

Nunca fazer.

❌ Banco sem Foreign Keys.

❌ Campos obrigatórios permitindo NULL.

❌ Valores financeiros negativos.

❌ Constraints sem documentação.

❌ Regras complexas implementadas apenas no banco.

---

# Checklist

Toda nova tabela deverá responder.

- possui Primary Key?
- possui Foreign Keys?
- utiliza NOT NULL?
- possui UNIQUE quando necessário?
- possui CHECK quando apropriado?
- possui DEFAULT?
- possui nomes padronizados?

Caso qualquer resposta seja negativa.

A modelagem deverá ser revisada.

---

# Referências Cruzadas

Este capítulo complementa.

- ERD.md
- Relationships.md
- RLS.md
- Migrations.md

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

Toda integridade estrutural do MedFlow deverá ser protegida tanto pela aplicação quanto pelo PostgreSQL através de Constraints oficiais.

**Motivação**

- Consistência
- Segurança
- Integridade
- Redução de bugs
- Confiabilidade

**Alternativas Avaliadas**

- Controle apenas pela aplicação
- Uso mínimo de Constraints
- Validação exclusivamente via ORM

**Resultado**

Toda entidade deverá utilizar Constraints apropriadas para proteger permanentemente a integridade dos dados.

---

---

# Capítulo 9 — Transactions e Consistência de Dados

## Objetivo

Este capítulo define a estratégia oficial de utilização de Transactions no MedFlow.

As Transactions garantem que operações compostas sejam executadas de forma atômica, preservando a consistência dos dados mesmo diante de falhas inesperadas.

Toda operação que altera múltiplas entidades deverá avaliar a necessidade de utilizar uma Transaction.

---

# Filosofia

Uma operação de negócio deve acontecer completamente.

Ou não acontecer.

Nunca deverá existir um estado intermediário.

Se qualquer etapa falhar.

Toda operação deverá ser revertida automaticamente.

Esse princípio é conhecido como **Atomicidade**.

---

# Os Princípios ACID

O PostgreSQL implementa as propriedades ACID.

O MedFlow deverá respeitar essas propriedades em todas as operações críticas.

---

## Atomicity

A operação acontece completamente.

Ou nenhuma alteração é aplicada.

Exemplo.

```text
Criar Consulta

↓

Criar Prontuário

↓

Criar Cobrança

↓

Enviar Evento
```

Caso a cobrança falhe.

Nada deverá permanecer salvo.

---

## Consistency

Toda Transaction deve preservar a integridade do banco.

Nunca deixar dados inconsistentes.

Exemplo.

Uma consulta nunca poderá existir sem um paciente válido.

---

## Isolation

Transactions simultâneas não deverão interferir entre si.

Cada operação deverá enxergar um estado consistente do banco.

---

## Durability

Após o commit.

Os dados devem permanecer persistidos mesmo em caso de falha da aplicação.

---

# Quando Utilizar Transactions

Sempre utilizar quando uma única operação alterar múltiplas tabelas.

Exemplos.

- criação de consulta;
- cancelamento de consulta;
- aprovação de pagamento;
- renovação de assinatura;
- cadastro inicial da clínica;
- importação de pacientes.

---

# Quando Não Utilizar

Evitar Transactions para operações simples.

Exemplos.

- atualizar nome do paciente;
- alterar telefone;
- consultar informações.

Transactions desnecessárias aumentam contenção e reduzem desempenho.

---

# Fluxo

```text
Início

↓

BEGIN

↓

Operação 1

↓

Operação 2

↓

Operação 3

↓

Commit

↓

Fim
```

Caso qualquer operação falhe.

```text
Erro

↓

ROLLBACK

↓

Banco retorna ao estado anterior
```

---

# Exemplo do MedFlow

Agendamento de consulta.

```text
Criar Appointment

↓

Criar Medical Record

↓

Reservar Horário

↓

Registrar Auditoria

↓

Commit
```

Se qualquer etapa falhar.

Toda operação deverá ser cancelada.

---

# Transações Financeiras

Toda movimentação financeira deverá utilizar Transactions.

Exemplo.

```text
Atualizar Pagamento

↓

Atualizar Assinatura

↓

Registrar Evento Financeiro

↓

Auditoria

↓

Commit
```

Nunca permitir estados parciais.

---

# Integração com Background Jobs

Background Jobs nunca deverão iniciar antes do Commit.

Fluxo correto.

```text
BEGIN

↓

Salvar Dados

↓

COMMIT

↓

Adicionar Job à Fila
```

Caso contrário.

Um Worker poderá processar dados que ainda não existem.

---

# Integração com Eventos

Eventos de domínio deverão ser publicados somente após a confirmação da Transaction.

```text
BEGIN

↓

Salvar Dados

↓

COMMIT

↓

Publicar Evento
```

Nunca publicar eventos durante uma Transaction aberta.

---

# Rollback

O Rollback deverá ocorrer automaticamente sempre que houver falha.

Exemplos.

- erro de banco;
- constraint violada;
- timeout;
- exceção inesperada.

Nenhuma alteração parcial deverá permanecer.

---

# Transactions Longas

Evitar Transactions demoradas.

Nunca realizar dentro de uma Transaction.

- chamadas HTTP;
- envio de e-mails;
- processamento de IA;
- uploads;
- downloads;
- geração de PDFs.

Essas operações deverão ocorrer após o Commit.

---

# Deadlocks

Toda implementação deverá minimizar riscos de Deadlock.

Boas práticas.

- acessar tabelas sempre na mesma ordem;
- manter Transactions curtas;
- evitar bloqueios desnecessários;
- atualizar apenas os registros necessários.

---

# Concorrência

Quando múltiplos usuários alterarem os mesmos registros.

A estratégia deverá considerar.

- Locking;
- Versionamento;
- Controle otimista quando aplicável.

A decisão dependerá do caso de uso.

---

# Performance

Transactions possuem custo.

Utilizar apenas quando realmente necessárias.

Uma Transaction curta é mais eficiente e reduz bloqueios.

---

# Boas Práticas

✔ Transactions pequenas.

✔ Commit rápido.

✔ Rollback automático.

✔ Nunca misturar operações externas.

✔ Publicar eventos somente após Commit.

✔ Registrar Logs.

---

# Quando Não Utilizar

Evitar Transactions para.

- consultas simples;
- operações somente leitura;
- processos independentes.

---

# Anti-Patterns

Nunca fazer.

❌ Transaction envolvendo chamadas HTTP.

❌ Transaction envolvendo IA.

❌ Transaction aberta durante upload.

❌ Transaction aberta aguardando usuário.

❌ Publicar eventos antes do Commit.

---

# Exemplos Reais do MedFlow

## Cadastro de Clínica

```text
BEGIN

↓

Criar Clínica

↓

Criar Usuário Administrador

↓

Criar Plano

↓

Criar Configurações Iniciais

↓

COMMIT

↓

Enviar Email de Boas-vindas
```

---

## Cancelamento de Consulta

```text
BEGIN

↓

Atualizar Consulta

↓

Liberar Agenda

↓

Registrar Auditoria

↓

COMMIT

↓

Enviar Notificação
```

---

# Checklist

Toda operação deverá responder.

- altera múltiplas tabelas?
- precisa de Transaction?
- possui Rollback?
- evita operações externas?
- publica eventos após Commit?
- possui logs?

Caso qualquer resposta seja negativa.

A implementação deverá ser revisada.

---

# Referências Cruzadas

Este capítulo complementa.

- Services.md
- Background Jobs.md
- Payments.md
- Audit.md
- Logging.md

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

Toda operação crítica do MedFlow deverá utilizar Transactions para garantir consistência dos dados.

**Motivação**

- Integridade
- Segurança
- Atomicidade
- Confiabilidade
- Recuperação automática

**Alternativas Avaliadas**

- Controle apenas na aplicação
- Operações independentes
- Rollbacks manuais

**Resultado**

Foi adotado o uso de Transactions para todas as operações compostas e críticas da plataforma.

---

---

# Capítulo 10 — Soft Delete e Estratégias de Exclusão

## Objetivo

Este capítulo define a estratégia oficial de exclusão de registros no banco de dados do MedFlow.

O objetivo é garantir que informações importantes possam ser recuperadas, auditadas e rastreadas, preservando a integridade histórica da plataforma.

A exclusão definitiva será considerada uma exceção.

---

# Filosofia

No MedFlow, excluir um registro não significa apagá-lo.

Na maioria dos casos.

Excluir significa apenas torná-lo invisível para o funcionamento normal da aplicação.

Essa abordagem protege:

- histórico médico;
- histórico financeiro;
- auditoria;
- integridade referencial;
- conformidade com legislações.

---

# Estratégia Oficial

Toda entidade deverá ser classificada em uma das seguintes categorias.

```text
Soft Delete

Hard Delete

Arquivamento
```

Cada categoria possui objetivos diferentes.

---

# Soft Delete

Soft Delete representa a estratégia padrão do MedFlow.

O registro continua existindo no banco.

Apenas deixa de ser considerado ativo.

---

# Implementação

Toda tabela que utilizar Soft Delete deverá possuir.

```text
deleted_at
```

Opcionalmente.

```text
deleted_by
```

Quando houver necessidade de identificar quem realizou a exclusão.

---

# Fluxo

```text
Usuário

↓

Excluir

↓

UPDATE

↓

deleted_at = NOW()

↓

Registro permanece armazenado
```

Nenhum dado é perdido.

---

# Consultas

Todas as consultas da aplicação deverão ignorar registros excluídos.

Fluxo.

```sql
WHERE deleted_at IS NULL
```

Essa regra deverá ser aplicada automaticamente pelos Repositories sempre que possível.

---

# Recuperação

Registros excluídos poderão ser restaurados.

Fluxo.

```text
deleted_at

↓

NULL

↓

Registro volta a ser ativo
```

A restauração deverá respeitar todas as regras de negócio vigentes.

---

# Hard Delete

Hard Delete representa a remoção definitiva do registro.

Essa operação deverá ser extremamente rara.

Somente será utilizada quando:

- exigido por legislação;
- solicitado formalmente pelo titular dos dados, quando aplicável;
- tratar-se de dados temporários;
- registros de testes;
- caches;
- filas temporárias.

---

# Arquivamento

Algumas informações poderão deixar de participar das operações do sistema sem serem removidas.

Exemplos.

- consultas antigas;
- notificações antigas;
- logs antigos;
- eventos históricos.

Esses dados poderão ser arquivados para reduzir impacto operacional.

---

# Integridade Referencial

Soft Delete nunca deverá quebrar relacionamentos.

Exemplo.

```text
Patient

↓

Appointments

↓

Medical Records
```

Mesmo que um paciente seja desativado.

Os registros históricos permanecem íntegros.

---

# Auditoria

Toda exclusão lógica deverá gerar auditoria.

Informações mínimas.

- usuário;
- data;
- entidade;
- motivo (quando aplicável).

---

# Motivo da Exclusão

Entidades críticas poderão armazenar.

```text
delete_reason
```

Exemplo.

```text
Cadastro duplicado

Solicitação do paciente

Erro operacional
```

---

# Multi-Tenant

Toda exclusão deverá respeitar isolamento entre clínicas.

Nunca permitir que um Tenant exclua registros pertencentes a outro.

---

# Performance

Como consultas normalmente ignoram registros excluídos.

Os índices deverão considerar.

```sql
WHERE deleted_at IS NULL
```

Sempre que apropriado.

---

# LGPD

A existência de Soft Delete não substitui anonimização ou exclusão definitiva quando exigidas por lei.

Quando houver obrigação legal.

O sistema deverá executar o procedimento adequado.

---

# Dados Clínicos

Prontuários e informações médicas normalmente não deverão ser removidos.

Apenas desativados quando permitido pela legislação.

A preservação do histórico clínico é prioridade.

---

# Dados Financeiros

Pagamentos nunca deverão ser excluídos.

Caso exista necessidade de invalidação.

Utilizar status apropriados.

Nunca remover registros financeiros históricos.

---

# Exemplos do MedFlow

## Paciente

```text
Paciente

↓

Soft Delete

↓

Permanece no banco

↓

Consultas continuam preservadas
```

---

## Consulta

```text
Consulta

↓

Cancelada

↓

Status alterado

↓

Não excluída
```

---

## Usuário

```text
Usuário

↓

Desativado

↓

Conta bloqueada

↓

Histórico preservado
```

---

# Boas Práticas

✔ Utilizar Soft Delete como padrão.

✔ Preservar histórico.

✔ Gerar auditoria.

✔ Permitir restauração quando apropriado.

✔ Aplicar filtros automáticos.

---

# Quando Não Utilizar

Evitar Soft Delete para.

- cache;
- tokens expirados;
- filas temporárias;
- tabelas de sessão;
- dados descartáveis.

Nesses casos.

Hard Delete é aceitável.

---

# Anti-Patterns

Nunca fazer.

❌ DELETE definitivo em entidades críticas.

❌ Excluir pagamentos.

❌ Excluir prontuários.

❌ Ignorar deleted_at nas consultas.

❌ Restaurar registros sem validar regras atuais.

---

# Checklist

Toda nova entidade deverá responder.

- utiliza Soft Delete?
- possui deleted_at?
- necessita deleted_by?
- gera auditoria?
- pode ser restaurada?
- respeita LGPD?
- respeita Multi-Tenant?

Caso qualquer resposta seja negativa.

A modelagem deverá ser revisada.

---

# Referências Cruzadas

Este capítulo complementa.

- Audit.md
- RLS.md
- Relationships.md
- Migrations.md
- Services.md

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O MedFlow adotará Soft Delete como estratégia padrão para exclusão de dados.

**Motivação**

- Preservação do histórico
- Auditoria
- Recuperação de registros
- Integridade referencial
- Conformidade legal

**Alternativas Avaliadas**

- Hard Delete como padrão
- Exclusão física imediata
- Exclusão apenas pela aplicação

**Resultado**

Toda entidade persistente deverá utilizar Soft Delete, salvo exceções devidamente documentadas.

---

---

# Capítulo 11 — Auditoria e Histórico de Alterações

## Objetivo

Este capítulo define a arquitetura oficial de Auditoria do banco de dados do MedFlow.

O objetivo é garantir rastreabilidade completa sobre operações críticas realizadas na plataforma, permitindo identificar quem realizou uma ação, quando ela ocorreu, quais dados foram alterados e qual foi seu impacto.

A auditoria representa um dos pilares de segurança, conformidade e confiabilidade do MedFlow.

---

# Filosofia

Em um sistema de saúde.

Toda alteração importante deve deixar evidências.

O sistema deverá ser capaz de responder perguntas como.

- Quem realizou esta alteração?
- Quando ocorreu?
- Qual era o valor anterior?
- Qual é o valor atual?
- De qual dispositivo foi realizada?
- Qual usuário estava autenticado?
- Qual clínica foi afetada?

Nenhuma informação crítica deverá ser alterada sem possibilidade de rastreamento.

---

# Objetivos

A auditoria deverá permitir.

- rastrear alterações;
- identificar responsáveis;
- investigar incidentes;
- atender requisitos legais;
- auxiliar suporte técnico;
- preservar histórico.

---

# Escopo

Nem toda alteração precisa ser auditada.

A auditoria será aplicada principalmente em.

- pacientes;
- profissionais;
- prontuários;
- consultas;
- prescrições;
- pagamentos;
- assinaturas;
- permissões;
- usuários;
- configurações da clínica.

---

# Eventos Auditáveis

Os seguintes eventos deverão gerar auditoria.

## Criação

```text
CREATE
```

---

## Atualização

```text
UPDATE
```

---

## Exclusão Lógica

```text
SOFT DELETE
```

---

## Restauração

```text
RESTORE
```

---

## Login

```text
LOGIN
```

---

## Logout

```text
LOGOUT
```

---

## Alteração de Permissões

```text
PERMISSION_UPDATED
```

---

## Alteração de Assinatura

```text
SUBSCRIPTION_UPDATED
```

---

## Eventos Financeiros

```text
PAYMENT_APPROVED

PAYMENT_REFUNDED

PAYMENT_CANCELLED
```

---

# Informações Registradas

Todo evento deverá armazenar.

- Audit ID
- Entity
- Entity ID
- Action
- User ID
- Clinic ID
- Timestamp
- IP
- User Agent
- Request ID

Sempre que aplicável.

---

# Valores Alterados

Atualizações deverão registrar.

```text
Valor Anterior

↓

Valor Atual
```

Exemplo.

```text
Telefone

Antes

11999999999

Depois

11888888888
```

---

# Identificação

Cada evento deverá possuir um identificador único.

```text
audit_id
```

Esse identificador nunca será reutilizado.

---

# Origem

Toda auditoria deverá registrar.

```text
WEB

MOBILE

API

SYSTEM

WORKER
```

Isso facilita investigações futuras.

---

# Usuário

Toda alteração deverá identificar.

- usuário autenticado;
- usuário do sistema;
- processo automático.

Quando não houver usuário.

Registrar.

```text
SYSTEM
```

---

# Integridade

Registros de auditoria nunca poderão ser alterados.

Após persistidos.

Serão considerados imutáveis.

Qualquer correção deverá gerar novo evento.

Nunca editar registros existentes.

---

# Auditoria Automática

Sempre que possível.

A geração de auditoria deverá ocorrer automaticamente.

Evitar depender do desenvolvedor lembrar de registrar eventos.

---

# Retenção

Registros de auditoria deverão possuir política própria de retenção.

Nunca utilizar a mesma política dos Logs.

Auditoria representa evidência histórica.

---

# Pesquisa

O sistema deverá permitir consultas por.

- usuário;
- clínica;
- entidade;
- período;
- ação;
- Request ID.

---

# Performance

Consultas operacionais nunca deverão depender diretamente da tabela de auditoria.

A auditoria deverá ser otimizada para gravação e pesquisa histórica.

---

# Segurança

Apenas usuários autorizados poderão visualizar auditorias.

Nem todos os administradores terão acesso completo.

O acesso deverá respeitar permissões específicas.

---

# LGPD

Informações registradas deverão respeitar a legislação vigente.

Evitar armazenar dados sensíveis desnecessariamente.

Quando necessário.

Registrar apenas referências.

---

# Exemplos do MedFlow

## Atualização de Paciente

```text
Paciente

↓

Telefone alterado

↓

Registrar auditoria

↓

Salvar alteração
```

---

## Aprovação de Pagamento

```text
Pagamento aprovado

↓

Registrar auditoria

↓

Atualizar assinatura
```

---

## Alteração de Permissão

```text
Administrador

↓

Concede acesso

↓

Registrar auditoria
```

---

# Boas Práticas

✔ Auditar operações críticas.

✔ Tornar registros imutáveis.

✔ Registrar contexto completo.

✔ Relacionar auditoria ao Request ID.

✔ Permitir pesquisas rápidas.

---

# Quando Não Auditar

Evitar auditoria para.

- consultas somente leitura;
- operações temporárias;
- cache;
- sessões efêmeras;
- dados descartáveis.

---

# Anti-Patterns

Nunca fazer.

❌ Permitir edição da auditoria.

❌ Excluir auditorias.

❌ Registrar senhas.

❌ Registrar tokens.

❌ Registrar informações desnecessárias.

❌ Depender apenas de Logs.

---

# Checklist

Toda funcionalidade deverá responder.

- precisa de auditoria?
- registra usuário?
- registra Tenant?
- registra Request ID?
- registra alterações?
- respeita LGPD?

Caso qualquer resposta seja negativa.

A implementação deverá ser revisada.

---

# Referências Cruzadas

Este capítulo complementa.

- Logging.md
- Observability.md
- Security.md
- RLS.md
- Services.md
- Payments.md

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O MedFlow utilizará uma arquitetura de auditoria imutável para registrar todas as operações críticas da plataforma.

**Motivação**

- Rastreabilidade
- Segurança
- Conformidade
- Investigação de incidentes
- Histórico permanente

**Alternativas Avaliadas**

- Utilizar apenas Logs
- Auditoria parcial
- Auditoria apenas financeira

**Resultado**

Foi adotada auditoria completa para todas as operações críticas do MedFlow, garantindo rastreabilidade e preservação do histórico.

---

---

# Capítulo 12 — Row Level Security (RLS) e Isolamento Multi-Tenant

## Objetivo

Este capítulo define a arquitetura oficial de isolamento de dados do MedFlow utilizando **Row Level Security (RLS)** do PostgreSQL.

O objetivo é garantir que cada clínica tenha acesso exclusivamente aos seus próprios dados, impedindo vazamentos entre Tenants mesmo na presença de falhas na aplicação.

O isolamento entre clínicas é considerado um requisito obrigatório da plataforma.

---

# Filosofia

O MedFlow é uma plataforma Multi-Tenant.

Isso significa que milhares de clínicas poderão compartilhar a mesma infraestrutura física.

Entretanto.

Cada clínica deverá enxergar apenas seus próprios dados.

O isolamento não depende apenas da aplicação.

O próprio banco de dados deverá impedir acessos indevidos.

---

# Objetivos

A arquitetura de RLS deverá garantir.

- isolamento entre clínicas;
- proteção contra falhas da aplicação;
- segurança por padrão;
- menor risco de vazamento;
- conformidade com a LGPD.

---

# O Que é RLS

Row Level Security é um recurso nativo do PostgreSQL.

Ele permite que o próprio banco decida quais linhas podem ser visualizadas, inseridas, atualizadas ou removidas.

Mesmo que uma consulta esqueça um filtro.

O banco continuará protegendo os dados.

---

# Arquitetura

```text
Usuário

↓

Autenticação

↓

Tenant Resolvido

↓

Contexto

↓

Repository

↓

PostgreSQL

↓

RLS

↓

Dados Permitidos
```

A aplicação solicita os dados.

O PostgreSQL decide quais registros podem ser retornados.

---

# Tenant

Todo registro pertencente a uma clínica deverá possuir.

```text
clinic_id
```

Esse campo representa o proprietário do registro.

Exemplos.

```text
patients

appointments

medical_records

payments

professionals
```

---

# Política Geral

Toda consulta deverá obedecer.

```text
registro.clinic_id

=

tenant_atual
```

Caso contrário.

O registro não será retornado.

---

# Operações Protegidas

As políticas deverão proteger.

## SELECT

O usuário visualiza apenas registros da própria clínica.

---

## INSERT

Só poderá criar registros para sua própria clínica.

---

## UPDATE

Só poderá alterar registros da própria clínica.

---

## DELETE

Só poderá excluir registros pertencentes ao seu Tenant.

---

# Exemplo Conceitual

Clínica A.

```text
clinic_id = A
```

↓

Visualiza.

```text
Pacientes A

Consultas A

Pagamentos A
```

---

Clínica B.

```text
clinic_id = B
```

↓

Visualiza.

```text
Pacientes B

Consultas B

Pagamentos B
```

Mesmo utilizando a mesma tabela.

Nunca existirão cruzamentos.

---

# Contexto da Aplicação

Toda requisição autenticada deverá resolver.

```text
tenant_id
```

Esse valor deverá acompanhar toda a execução.

Fluxo.

```text
JWT

↓

Authentication

↓

Context

↓

Repositories

↓

PostgreSQL
```

---

# Defesa em Camadas

O isolamento ocorrerá em duas camadas.

## Camada 1

Aplicação.

Repositories.

Services.

Validação.

---

## Camada 2

PostgreSQL.

Row Level Security.

Mesmo que a primeira falhe.

A segunda continua protegendo.

---

# Exemplo de Política

Conceitualmente.

```sql
clinic_id = current_tenant()
```

Toda operação será comparada com o Tenant autenticado.

---

# Tabelas sem RLS

Nem todas as tabelas utilizarão isolamento.

Exemplos.

```text
countries

states

cities

medical_specialties

system_settings
```

Essas tabelas representam informações globais.

---

# Administradores da Plataforma

Usuários internos do MedFlow poderão possuir políticas específicas.

Essas permissões deverão ser extremamente restritas.

Todo acesso administrativo deverá gerar auditoria.

---

# Auditoria

Toda violação de política deverá registrar.

- usuário;
- Tenant;
- horário;
- operação;
- Request ID.

Esses eventos deverão ser tratados como incidentes de segurança.

---

# Performance

As políticas de RLS deverão considerar índices.

Principalmente.

```text
clinic_id
```

Consultas Multi-Tenant nunca deverão depender de Full Scan.

---

# Desenvolvimento

Durante o desenvolvimento.

Nunca desabilitar RLS permanentemente.

Caso seja necessário.

Documentar claramente a justificativa.

---

# Testes

Toda entidade protegida deverá possuir testes.

Exemplos.

✔ Clínica A acessa dados da Clínica A.

✔ Clínica A não acessa dados da Clínica B.

✔ UPDATE bloqueado entre Tenants.

✔ DELETE bloqueado entre Tenants.

✔ INSERT inválido rejeitado.

---

# Exemplos do MedFlow

## Pacientes

```text
Clinic A

↓

patients

↓

Somente registros da Clinic A
```

---

## Consultas

```text
Clinic B

↓

appointments

↓

Somente registros da Clinic B
```

---

## Pagamentos

```text
Clinic C

↓

payments

↓

Somente pagamentos da Clinic C
```

---

# Boas Práticas

✔ Toda tabela Multi-Tenant possui clinic_id.

✔ Toda tabela Multi-Tenant possui política RLS.

✔ Toda requisição resolve o Tenant.

✔ Todo acesso administrativo gera auditoria.

✔ Testar todas as políticas.

---

# Quando Não Utilizar

Não utilizar RLS em tabelas globais.

Exemplos.

- países;
- estados;
- cidades;
- especialidades médicas;
- configurações globais.

---

# Anti-Patterns

Nunca fazer.

❌ Confiar apenas na aplicação.

❌ Desabilitar RLS em produção.

❌ Consultas sem Tenant.

❌ Misturar registros de múltiplas clínicas.

❌ Criar exceções sem documentação.

---

# Checklist

Toda nova tabela deverá responder.

- pertence a um Tenant?
- possui clinic_id?
- possui política RLS?
- possui testes?
- possui índices?
- gera auditoria quando necessário?

Caso qualquer resposta seja negativa.

A implementação deverá ser revisada.

---

# Referências Cruzadas

Este capítulo complementa.

- Multi-Tenant.md
- Authentication.md
- Authorization.md
- Repositories.md
- Audit.md
- Security.md

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O MedFlow utilizará Row Level Security (RLS) como segunda camada de proteção para todo o isolamento Multi-Tenant.

**Motivação**

- Segurança
- LGPD
- Defesa em profundidade
- Redução de risco
- Isolamento garantido pelo banco

**Alternativas Avaliadas**

- Controle apenas pela aplicação
- Bancos separados por clínica
- Schemas separados por Tenant

**Resultado**

Foi adotado um banco compartilhado com isolamento por `clinic_id` e políticas RLS obrigatórias para todas as entidades Multi-Tenant.

---

---

# Capítulo 14 — Performance, Escalabilidade e Crescimento

## Objetivo

Este capítulo define a estratégia oficial de evolução da camada de dados do MedFlow.

O objetivo é garantir que o banco de dados permaneça confiável, rápido e sustentável durante todo o crescimento da plataforma, desde os primeiros clientes até uma operação em larga escala.

As decisões descritas neste capítulo deverão orientar futuras otimizações sem comprometer a arquitetura existente.

---

# Filosofia

O banco de dados deverá crescer junto com o produto.

Nenhuma decisão de curto prazo deverá impedir a evolução da plataforma.

A arquitetura deverá privilegiar soluções simples hoje, mas preparadas para suportar volumes significativamente maiores no futuro.

Escalabilidade é consequência de boas decisões contínuas.

---

# Objetivos

A estratégia de crescimento deverá garantir.

- baixa latência;
- alta disponibilidade;
- facilidade de manutenção;
- expansão horizontal quando necessária;
- estabilidade operacional;
- previsibilidade de desempenho.

---

# Crescimento Esperado

A arquitetura deverá suportar.

- milhares de clínicas;
- milhões de pacientes;
- dezenas de milhões de consultas;
- centenas de milhões de registros clínicos;
- bilhões de eventos de auditoria ao longo dos anos.

Esses volumes deverão ser considerados em toda decisão estrutural.

---

# Evolução Gradual

O MedFlow seguirá uma estratégia de evolução incremental.

Ordem recomendada.

```text
Modelagem Correta

↓

Índices

↓

Otimização de Consultas

↓

Cache

↓

Read Replicas

↓

Particionamento

↓

Escalabilidade Horizontal
```

Nunca iniciar diretamente pelas soluções mais complexas.

---

# Consultas

Toda consulta crítica deverá priorizar.

- índices adequados;
- filtros eficientes;
- paginação;
- seleção apenas das colunas necessárias.

Evitar consultas genéricas.

```sql
SELECT *
```

Sempre que possível.

Selecionar apenas os campos utilizados.

---

# Paginação

Consultas que retornam listas deverão utilizar paginação.

Nunca carregar milhares de registros em uma única requisição.

Quando apropriado.

Utilizar paginação baseada em Cursor para grandes volumes.

---

# Batch Processing

Operações sobre grandes quantidades de registros deverão ser executadas em lotes.

Exemplos.

- importação;
- exportação;
- migração;
- sincronização;
- auditoria.

Evitar operações gigantescas em uma única Transaction.

---

# Cache

O banco de dados nunca deverá ser utilizado para responder informações altamente repetitivas quando houver alternativa de cache.

Exemplos.

- configurações;
- especialidades;
- países;
- estados;
- municípios.

O cache deverá sempre possuir estratégia clara de invalidação.

---

# Read Replicas

Quando o volume justificar.

Consultas poderão ser distribuídas para réplicas de leitura.

Fluxo.

```text
Write

↓

Primary Database

↓

Replication

↓

Read Replicas
```

Toda escrita continuará ocorrendo no banco principal.

---

# Particionamento

O particionamento será considerado apenas quando houver evidências concretas de necessidade.

Tabelas candidatas.

- audit_logs;
- notifications;
- payment_events;
- medical_events.

A escolha da estratégia dependerá do padrão de consultas.

---

# Arquivamento

Registros históricos poderão ser arquivados.

Exemplos.

- logs antigos;
- auditorias antigas;
- notificações expiradas.

O arquivamento nunca deverá comprometer consultas operacionais.

---

# Monitoramento

A camada de dados deverá ser monitorada continuamente.

Indicadores mínimos.

- tempo médio das consultas;
- consultas lentas;
- uso de CPU;
- uso de memória;
- conexões ativas;
- tamanho do banco;
- crescimento diário;
- utilização dos índices.

---

# Observabilidade

Toda degradação significativa deverá gerar alertas.

Exemplos.

- consultas lentas;
- aumento de latência;
- bloqueios;
- deadlocks;
- falhas de conexão.

---

# Crescimento Horizontal

A arquitetura deverá permitir.

- múltiplas instâncias da aplicação;
- múltiplos Workers;
- múltiplas APIs.

Sem necessidade de alterar o banco de dados.

---

# Crescimento Vertical

Sempre que possível.

Priorizar otimizações antes de aumentar recursos de hardware.

Escalar infraestrutura não substitui modelagem correta.

---

# Backup

O crescimento do banco deverá ser acompanhado por estratégias proporcionais de backup.

Quanto maior o volume.

Maior a necessidade de automação.

---

# Recuperação

Todo plano de crescimento deverá considerar.

- Recovery Time Objective (RTO);
- Recovery Point Objective (RPO).

Esses indicadores deverão ser definidos conforme a evolução da plataforma.

---

# Exemplos do MedFlow

## Dashboard

```text
Filtros

↓

Índices

↓

Consulta otimizada

↓

Paginação

↓

Resposta rápida
```

---

## Histórico Clínico

```text
Paciente

↓

Consultas

↓

Prontuários

↓

Resultados paginados
```

---

## Auditoria

```text
Filtros

↓

Particionamento futuro

↓

Pesquisa eficiente
```

---

# Boas Práticas

✔ Monitorar continuamente.

✔ Otimizar antes de escalar.

✔ Revisar índices periodicamente.

✔ Evitar consultas desnecessárias.

✔ Planejar crescimento incremental.

---

# Quando Não Escalar

Não aumentar infraestrutura para resolver problemas causados por.

- consultas mal escritas;
- ausência de índices;
- duplicação de dados;
- modelagem incorreta.

Primeiro corrigir a arquitetura.

Depois considerar expansão.

---

# Anti-Patterns

Nunca fazer.

❌ Escalar sem métricas.

❌ Criar cache sem estratégia.

❌ Ignorar consultas lentas.

❌ Resolver problemas apenas aumentando hardware.

❌ Particionar tabelas prematuramente.

---

# Checklist

Toda otimização deverá responder.

- existe gargalo comprovado?
- há métricas?
- índices foram analisados?
- consultas foram revisadas?
- cache é realmente necessário?
- a solução aumenta a complexidade?

Caso qualquer resposta seja negativa.

A otimização deverá ser reavaliada.

---

# Referências Cruzadas

Este capítulo complementa.

- Indexes.md
- Backup.md
- Audit.md
- Deployment.md
- Observability.md

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O MedFlow adotará uma estratégia de crescimento incremental, priorizando otimização da arquitetura antes da expansão da infraestrutura.

**Motivação**

- Sustentabilidade
- Performance
- Facilidade de manutenção
- Controle de custos
- Evolução contínua

**Alternativas Avaliadas**

- Escalar hardware como primeira opção
- Particionamento prematuro
- Cache indiscriminado

**Resultado**

Toda evolução da camada de dados deverá seguir uma abordagem orientada por métricas, garantindo crescimento previsível e sustentável da plataforma.

---

---

# Capítulo 15 — Backup, Recuperação de Desastres e Continuidade de Negócio

## Objetivo

Este capítulo define a estratégia oficial de Backup, Disaster Recovery (DR) e Continuidade de Negócio do MedFlow.

O objetivo é garantir que informações críticas possam ser recuperadas rapidamente em caso de falhas, ataques, erros humanos ou desastres, preservando a integridade dos dados e minimizando impactos para clínicas e pacientes.

A perda definitiva de dados é considerada um evento inaceitável.

---

# Filosofia

Dados médicos possuem valor permanente.

A perda de um prontuário, consulta ou pagamento pode gerar impactos operacionais, financeiros e legais.

Por esse motivo.

Toda informação armazenada pelo MedFlow deverá possuir mecanismos de recuperação adequados.

Backup não é uma opção.

É parte da arquitetura.

---

# Objetivos

A estratégia deverá garantir.

- recuperação rápida;
- integridade dos dados;
- disponibilidade;
- rastreabilidade;
- continuidade operacional;
- proteção contra falhas humanas e técnicas.

---

# Conceitos

## Backup

Cópia de segurança dos dados.

---

## Restore

Processo de recuperação de um Backup.

---

## Disaster Recovery

Conjunto de procedimentos utilizados para restaurar a operação após eventos críticos.

---

## Business Continuity

Estratégias que permitem manter o serviço funcionando mesmo diante de falhas.

---

# Tipos de Backup

O MedFlow deverá suportar.

## Full Backup

Cópia completa do banco.

---

## Incremental Backup

Armazena apenas alterações desde o último backup.

---

## Point-in-Time Recovery (PITR)

Sempre que possível.

Permitir recuperação até um instante específico.

Essa funcionalidade reduz significativamente perdas de dados.

---

# Frequência

A frequência dependerá da criticidade dos dados.

Recomendação inicial.

```text
Full Backup

↓

Diário
```

```text
Incremental

↓

Contínuo ou periódico
```

A estratégia poderá evoluir conforme o crescimento da plataforma.

---

# Armazenamento

Backups deverão ser armazenados em locais independentes da infraestrutura principal.

Nunca manter a única cópia no mesmo ambiente do banco.

Sempre utilizar redundância.

---

# Criptografia

Todo Backup deverá ser criptografado.

Principalmente quando armazenado fora da infraestrutura principal.

A criptografia protege dados sensíveis mesmo em caso de acesso indevido aos arquivos.

---

# Integridade

Todo Backup deverá passar por validação.

Não basta gerar o arquivo.

É necessário garantir que ele pode ser restaurado com sucesso.

---

# Testes de Restore

Backups deverão ser restaurados periodicamente em ambiente controlado.

Objetivos.

- validar integridade;
- medir tempo de recuperação;
- identificar problemas.

Backup não testado não deve ser considerado confiável.

---

# Recovery Point Objective (RPO)

Representa a quantidade máxima aceitável de dados perdidos.

O RPO deverá evoluir conforme o crescimento do MedFlow.

O objetivo é minimizar perdas.

---

# Recovery Time Objective (RTO)

Representa o tempo máximo aceitável para restaurar a operação.

Esse indicador deverá ser monitorado continuamente.

---

# Cenários de Recuperação

A arquitetura deverá prever recuperação para.

- falha de hardware;
- falha do banco;
- exclusão acidental;
- corrupção de dados;
- erro humano;
- falha durante deploy;
- ataques à infraestrutura.

Cada cenário deverá possuir procedimento documentado.

---

# Continuidade de Negócio

Mesmo durante incidentes.

O objetivo é reduzir indisponibilidade.

Sempre que possível.

Priorizar recuperação gradual da operação.

---

# Monitoramento

Acompanhar continuamente.

- sucesso dos Backups;
- falhas;
- tempo de execução;
- tamanho dos arquivos;
- disponibilidade dos armazenamentos.

Toda falha deverá gerar alerta.

---

# Retenção

Os Backups deverão possuir política de retenção.

Exemplo conceitual.

```text
Diários

↓

30 dias
```

```text
Mensais

↓

12 meses
```

A política definitiva dependerá de requisitos legais e operacionais.

---

# Segurança

Somente usuários autorizados poderão acessar.

- Backups;
- procedimentos de Restore;
- chaves de criptografia.

Todo acesso deverá gerar auditoria.

---

# Auditoria

Registrar.

- criação de Backup;
- falhas;
- restaurações;
- testes;
- acessos.

Esses eventos deverão permanecer disponíveis para investigação.

---

# Ambientes

Os procedimentos de Backup e Restore deverão ser testados.

- desenvolvimento;
- homologação;
- produção (quando aplicável).

Nunca executar restaurações experimentais diretamente em produção.

---

# Exemplos do MedFlow

## Exclusão Acidental

```text
Usuário remove registros

↓

Detectado

↓

Restore

↓

Sistema recuperado
```

---

## Falha no Servidor

```text
Servidor indisponível

↓

Provisionar nova infraestrutura

↓

Restore

↓

Aplicação retorna
```

---

## Corrupção de Dados

```text
Corrupção detectada

↓

PITR

↓

Recuperação até instante anterior
```

---

# Boas Práticas

✔ Automatizar Backups.

✔ Criptografar arquivos.

✔ Testar restaurações.

✔ Monitorar falhas.

✔ Documentar procedimentos.

✔ Auditar todas as operações.

---

# Quando Revisar a Estratégia

A estratégia deverá ser reavaliada quando ocorrer.

- aumento significativo do volume de dados;
- novos requisitos legais;
- mudança de infraestrutura;
- alteração dos objetivos de disponibilidade.

---

# Anti-Patterns

Nunca fazer.

❌ Backup apenas local.

❌ Backup sem criptografia.

❌ Nunca testar Restore.

❌ Compartilhar credenciais.

❌ Executar Restore diretamente em produção sem planejamento.

❌ Assumir que Backup sempre funciona.

---

# Checklist

Toda estratégia deverá responder.

- backups são automatizados?
- existe redundância?
- backups são criptografados?
- restores são testados?
- existe monitoramento?
- há política de retenção?
- existe documentação?

Caso qualquer resposta seja negativa.

A estratégia deverá ser revisada.

---

# Referências Cruzadas

Este capítulo complementa.

- Migrations.md
- Audit.md
- Deployment.md
- Security.md
- Observability.md

---

# Decisão Arquitetural

**Status:** ✅ Aprovada

**Decisão**

O MedFlow adotará uma estratégia de Backup automatizado, criptografado e continuamente validado, garantindo recuperação rápida e preservação dos dados em caso de incidentes.

**Motivação**

- Proteção de dados
- Continuidade de negócio
- Conformidade
- Segurança
- Alta disponibilidade

**Alternativas Avaliadas**

- Backups manuais
- Backups locais
- Ausência de testes de restauração

**Resultado**

Toda infraestrutura do MedFlow deverá possuir mecanismos de Backup, Restore e Disaster Recovery documentados, monitorados e testados periodicamente.

---

# Encerramento do Documento

O **Database.md** estabelece os princípios, padrões e decisões arquiteturais que regem toda a camada de persistência do MedFlow.

Todas as tabelas, relacionamentos, índices, migrations e estratégias de crescimento deverão respeitar as definições descritas neste documento.

Este documento é considerado a referência oficial para qualquer implementação relacionada ao banco de dados da plataforma e deverá evoluir juntamente com o MedFlow, preservando consistência, segurança, desempenho e escalabilidade ao longo de toda sua vida útil.