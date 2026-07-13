# Project Structure

| Campo | Valor |
|-------|--------|
| Documento | Project Structure |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Backend |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define a estrutura oficial de diretórios do backend do MedFlow.

A organização do projeto deve permanecer consistente durante toda a vida da plataforma.

Todos os módulos deverão seguir exatamente a mesma estrutura.

Nenhum desenvolvedor deverá criar estruturas diferentes para resolver o mesmo problema.

---

# Filosofia

A organização do projeto deve facilitar:

- navegação;
- manutenção;
- escalabilidade;
- testes;
- documentação;
- reutilização de código.

Encontrar um arquivo deve ser simples e previsível.

---

# Princípios

A estrutura do projeto deve seguir os seguintes princípios:

- organização por domínio;
- responsabilidade única;
- baixo acoplamento;
- alta coesão;
- padronização absoluta.

---

# Estrutura Geral

```text
backend/

src/

app/

modules/

shared/

core/

config/

database/

trpc/

middlewares/

jobs/

providers/

utils/

types/

tests/
```

Cada diretório possui uma responsabilidade específica.

---

# Diretório app

Responsável por iniciar a aplicação.

Contém:

- bootstrap;
- inicialização;
- configuração principal.

Nunca conter regras de negócio.

---

# Diretório modules

Representa o coração do backend.

Cada módulo representa um domínio de negócio.

Exemplo.

```text
modules/

patients/

appointments/

professionals/

medical-records/

payments/

notifications/

authentication/
```

Nenhum módulo deverá depender diretamente da implementação interna de outro.

---

# Estrutura de um Módulo

Todo módulo deverá seguir exatamente esta estrutura.

```text
patients/

procedures/

services/

repositories/

schemas/

entities/

dto/

types/

events/

mappers/

errors/

tests/

index.ts
```

Essa estrutura será utilizada por todos os módulos.

---

# Procedures

Responsáveis apenas pela comunicação com o cliente.

Podem:

- validar entrada;
- autenticar;
- autorizar;
- chamar Services.

Nunca implementar regras de negócio.

---

# Services

Responsáveis pela lógica da aplicação.

Exemplos.

- criar paciente;
- cancelar consulta;
- emitir receita.

Toda regra de negócio pertence aos Services.

---

# Repositories

Responsáveis pelo acesso ao banco.

Nunca implementar regras de negócio.

Toda consulta ao PostgreSQL deverá passar por Repositories.

---

# Schemas

Contêm validações utilizando Zod.

Responsáveis por validar:

- entrada;
- saída;
- filtros;
- parâmetros.

---

# Entities

Representam objetos do domínio.

Exemplos.

- Patient
- Appointment
- Professional

Nunca representam tabelas diretamente.

Representam conceitos do negócio.

---

# DTO

Data Transfer Objects.

Responsáveis pela comunicação entre camadas.

Evitam exposição direta das entidades.

---

# Types

Tipos específicos do módulo.

Interfaces.

Enums.

Aliases.

Tipos compartilhados apenas dentro daquele domínio.

---

# Events

Eventos produzidos pelo módulo.

Exemplos.

PatientCreated

AppointmentCancelled

PrescriptionIssued

Esses eventos poderão ser consumidos por outros módulos.

---

# Mappers

Responsáveis pela conversão entre:

- banco;
- entidades;
- DTO;
- respostas da API.

Nunca misturar transformações dentro dos Services.

---

# Errors

Cada módulo poderá possuir erros específicos.

Exemplo.

PatientAlreadyExistsError

PatientNotFoundError

AppointmentConflictError

Todos deverão seguir o padrão definido em Error Handling.

---

# Shared

Código reutilizável entre módulos.

Exemplos.

- componentes compartilhados;
- helpers;
- validações comuns;
- constantes.

Nunca colocar regras específicas de um domínio.

---

# Core

Contém funcionalidades centrais.

Exemplos.

- autenticação;
- autorização;
- logger;
- cache;
- eventos;
- filas.

Representa a infraestrutura da aplicação.

---

# Config

Configurações oficiais.

Exemplos.

- ambiente;
- banco;
- storage;
- provedores;
- variáveis.

Nenhuma configuração deverá ficar espalhada pelo projeto.

---

# Database

Responsável por:

- conexão;
- migrations;
- seeds;
- Drizzle;
- configuração do PostgreSQL.

---

# Providers

Integrações externas.

Exemplos.

- Mercado Pago;
- Resend;
- OpenAI;
- Supabase Storage.

A troca de um provedor nunca deverá impactar os módulos.

---

# Jobs

Contém tarefas executadas em segundo plano.

Exemplos.

- envio de emails;
- IA;
- geração de PDFs;
- notificações.

---

# Utils

Funções utilitárias.

Devem ser:

- pequenas;
- reutilizáveis;
- independentes.

Nunca conter regras de negócio.

---

# Types

Tipos globais utilizados por toda aplicação.

---

# Tests

Estrutura oficial.

```text
tests/

unit/

integration/

e2e/
```

Todo módulo deverá possuir seus próprios testes.

---

# Imports

Sempre utilizar imports absolutos.

Exemplo.

```typescript
import { PatientService } from "@/modules/patients/services";
```

Evitar imports relativos longos.

---

# Convenções

Todo módulo deverá possuir:

- README próprio (quando necessário);
- testes;
- documentação;
- exports centralizados.

---

# Crescimento

Novos módulos deverão seguir exatamente esta estrutura.

Nunca criar exceções.

A padronização reduz tempo de aprendizado e facilita manutenção.

---

# Checklist

Todo novo módulo deverá possuir.

- procedures;
- services;
- repositories;
- schemas;
- entities;
- dto;
- events;
- tests;
- index.ts

Caso algum item não seja necessário.

A ausência deverá ser justificada.

---

# Declaração Final

A estrutura do projeto representa a organização física da arquitetura do MedFlow.

Manter essa estrutura consistente é fundamental para garantir que o projeto continue escalável, organizado e compreensível mesmo após muitos anos de evolução.

Toda contribuição para o backend deverá respeitar rigorosamente este documento.

---

# Documentos Relacionados

- System Architecture
- API Architecture
- Services
- Repositories
- Validation
- Database
- Testing
- Error Handling