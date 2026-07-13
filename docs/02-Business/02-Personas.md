# Personas

| Campo | Valor |
|-------|--------|
| Documento | Personas |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Business |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define todos os perfis de usuários que utilizam o MedFlow.

Cada funcionalidade desenvolvida deve existir para atender uma necessidade real de pelo menos uma dessas personas.

Nenhuma funcionalidade deve ser criada sem saber exatamente qual usuário ela beneficia.

---

# Visão Geral

O MedFlow é uma plataforma multiusuário.

Isso significa que diferentes pessoas utilizam o sistema para objetivos completamente diferentes.

Cada perfil possui permissões, necessidades, responsabilidades e jornadas próprias.

Essas diferenças devem ser respeitadas durante todo o desenvolvimento.

---

# Personas Oficiais

Atualmente o MedFlow possui cinco personas principais.

- Paciente
- Profissional da Saúde
- Recepcionista
- Administrador da Clínica
- Super Administrador

Novas personas poderão surgir futuramente.

---

# Persona 01 — Paciente

## Descrição

Pessoa responsável por receber atendimento.

O paciente utiliza o MedFlow para gerenciar sua relação com a clínica.

Seu foco é simplicidade.

Ele não deseja aprender um sistema.

Ele deseja resolver seu problema rapidamente.

---

## Objetivos

- agendar consultas;
- remarcar consultas;
- cancelar consultas;
- acompanhar histórico;
- acessar documentos;
- visualizar receitas;
- visualizar exames;
- realizar pagamentos;
- receber notificações;
- participar de consultas online.

---

## Necessidades

- interface extremamente simples;
- poucos cliques;
- respostas rápidas;
- comunicação clara;
- confiança.

---

## Frustrações

- dificuldade para marcar consultas;
- excesso de formulários;
- informações desatualizadas;
- demora;
- falta de comunicação.

---

## Métricas de sucesso

O paciente consegue:

- marcar uma consulta em poucos minutos;
- localizar informações rapidamente;
- entender todo o processo sem treinamento.

---

# Persona 02 — Profissional da Saúde

## Descrição

Principal usuário da plataforma.

É responsável pelo atendimento dos pacientes.

Sua produtividade representa um dos principais indicadores de sucesso do MedFlow.

---

## Objetivos

- organizar agenda;
- atender pacientes;
- registrar evoluções;
- emitir receitas;
- solicitar exames;
- acompanhar histórico;
- consultar indicadores;
- reduzir tarefas administrativas.

---

## Necessidades

- velocidade;
- estabilidade;
- segurança;
- organização;
- automação.

---

## Frustrações

- prontuários lentos;
- excesso de burocracia;
- retrabalho;
- perda de informações;
- sistemas fragmentados.

---

## Métricas de sucesso

O profissional consegue:

- encontrar qualquer informação em segundos;
- registrar consultas rapidamente;
- reduzir tempo gasto com documentação.

---

# Persona 03 — Recepcionista

## Descrição

Responsável pela operação administrativa da clínica.

Grande parte da rotina operacional passa por esta persona.

---

## Objetivos

- cadastrar pacientes;
- confirmar consultas;
- organizar agenda;
- realizar check-in;
- registrar pagamentos;
- remarcar horários;
- comunicar pacientes.

---

## Necessidades

- rapidez;
- facilidade;
- boa visualização da agenda;
- poucos cliques.

---

## Frustrações

- agenda confusa;
- conflitos de horários;
- informações inconsistentes;
- lentidão.

---

## Métricas de sucesso

A recepcionista consegue:

- atender rapidamente;
- organizar agenda sem erros;
- localizar pacientes instantaneamente.

---

# Persona 04 — Administrador da Clínica

## Descrição

Responsável pela gestão da clínica.

Seu foco é operacional e estratégico.

---

## Objetivos

- administrar usuários;
- acompanhar indicadores;
- controlar financeiro;
- configurar a plataforma;
- acompanhar crescimento.

---

## Necessidades

- dashboards;
- relatórios;
- indicadores;
- controle financeiro;
- segurança.

---

## Frustrações

- falta de informações;
- baixa visibilidade;
- relatórios incompletos.

---

## Métricas de sucesso

O administrador consegue entender rapidamente:

- situação financeira;
- produtividade;
- agenda;
- faturamento;
- desempenho da clínica.

---

# Persona 05 — Super Administrador

## Descrição

Equipe responsável pela administração da própria plataforma MedFlow.

Este perfil não pertence às clínicas.

Ele administra o SaaS.

---

## Objetivos

- administrar clientes;
- acompanhar infraestrutura;
- monitorar erros;
- gerenciar planos;
- acompanhar métricas globais.

---

## Necessidades

- observabilidade;
- auditoria;
- monitoramento;
- métricas.

---

## Responsabilidades

- suporte;
- manutenção;
- evolução da plataforma.

---

# Relação Entre Personas

```text
                    Super Admin
                         │
        ┌────────────────┼────────────────┐
        │                                 │
 Administrador                  Plataforma
      │
      │
Recepcionista
      │
      │
Profissional
      │
      │
Paciente
```

Cada perfil possui permissões específicas.

Nenhum usuário poderá acessar informações além daquelas necessárias para executar sua função.

---

# Evolução

Novas personas poderão surgir conforme a plataforma evoluir.

Exemplos futuros:

- Laboratório
- Convênio
- Farmácia
- Parceiro
- Contador
- Auditor
- Pesquisador

A arquitetura deverá permitir essa expansão sem alterações estruturais significativas.

---

# Princípios

Todas as funcionalidades devem responder às seguintes perguntas:

- Qual persona utilizará esta funcionalidade?
- Qual problema ela resolve?
- Ela reduz trabalho?
- Ela melhora a experiência?
- Ela aumenta produtividade?

Caso essas perguntas não possam ser respondidas, a funcionalidade deverá ser reavaliada.

---

# Declaração Final

O MedFlow é construído para pessoas.

Tecnologia é apenas o meio.

Cada tela, cada fluxo e cada decisão devem existir para facilitar a vida de quem utiliza a plataforma.

Compreender profundamente nossas personas é o primeiro passo para construir uma experiência verdadeiramente excelente.

---

# Documentos Relacionados

- Product Requirements
- User Journey
- Business Rules
- Permissions
- Authentication
- Authorization