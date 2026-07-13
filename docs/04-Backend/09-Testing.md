# Testing

| Campo | Valor |
|-------|--------|
| Documento | Testing |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Backend |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define a estratégia oficial de testes do MedFlow.

Todo código desenvolvido deverá ser verificável através de testes automatizados.

Os testes representam uma garantia de que novas funcionalidades não comprometerão comportamentos já existentes.

A ausência de testes aumenta significativamente o risco de regressões.

---

# Filosofia

No MedFlow, testes não representam uma etapa final do desenvolvimento.

Eles fazem parte da implementação.

Toda funcionalidade deverá nascer preparada para ser testada.

Uma arquitetura testável é consequência direta de uma arquitetura bem projetada.

---

# Objetivos

A estratégia de testes deverá garantir:

- estabilidade;
- previsibilidade;
- segurança;
- facilidade de refatoração;
- redução de regressões;
- confiança durante deploys.

---

# Pirâmide de Testes

O MedFlow seguirá a pirâmide clássica de testes.

```text
               E2E
             ───────
          Integration
      ──────────────────
          Unit Tests
────────────────────────────
```

A maior parte dos testes deverá ser composta por testes unitários.

---

# Tipos de Testes

## Unit Tests

Validam unidades isoladas.

Exemplos.

- Services;
- Validators;
- Helpers;
- Mappers.

Dependências externas deverão ser simuladas utilizando Mocks.

---

## Integration Tests

Validam integração entre componentes.

Exemplos.

- Repository + PostgreSQL;
- Service + Repository;
- Webhooks;
- Providers.

Utilizar banco de testes sempre que possível.

---

## End-to-End (E2E)

Validam fluxos completos.

Exemplos.

- Login;
- Criar paciente;
- Agendar consulta;
- Aprovar pagamento.

Esses testes simulam o comportamento real do usuário.

---

# Estrutura

```text
tests/

unit/

integration/

e2e/

fixtures/

mocks/

helpers/
```

Cada categoria possui responsabilidade própria.

---

# Cobertura

O objetivo não é atingir 100%.

O objetivo é proteger funcionalidades críticas.

Prioridade.

1. Services
2. Repositories
3. Providers
4. Procedures
5. Helpers

---

# O Que Testar

Sempre testar.

- regras de negócio;
- validações;
- permissões;
- autenticação;
- autorização;
- fluxos financeiros;
- processamento de IA;
- notificações;
- integrações.

---

# O Que Não Testar

Evitar testar.

- bibliotecas externas;
- funcionamento interno do ORM;
- comportamento do TypeScript;
- funcionalidades já garantidas pelo framework.

---

# Nomeação

Utilizar nomes descritivos.

Correto.

```text
should_create_patient_successfully

should_not_allow_duplicate_cpf

should_cancel_appointment_when_status_is_pending
```

Evitar nomes genéricos.

```text
test1

patient_test
```

---

# Independência

Todo teste deverá ser independente.

Nunca depender da execução de outro teste.

A ordem de execução jamais poderá alterar os resultados.

---

# Dados de Teste

Utilizar.

- Factories;
- Builders;
- Fixtures.

Nunca depender de dados existentes manualmente no banco.

---

# Mocks

Utilizar Mocks apenas para dependências externas.

Exemplos.

- Email;
- IA;
- Gateway de pagamento;
- Storage;
- APIs externas.

Evitar Mockar regras de negócio.

---

# Banco de Dados

Testes de integração deverão utilizar banco dedicado.

Nunca executar testes contra ambientes de produção.

---

# Performance

Os testes deverão ser rápidos.

Objetivos.

Unit Tests.

Menos de 100 ms por teste.

Integration Tests.

Menos de 1 segundo quando possível.

---

# CI/CD

Toda Pull Request deverá executar automaticamente.

- Unit Tests;
- Integration Tests;
- Lint;
- Type Check.

Nenhum código poderá ser aprovado caso existam testes falhando.

---

# Casos Extremos

Além dos fluxos normais.

Testar.

- valores nulos;
- listas vazias;
- limites;
- datas inválidas;
- concorrência;
- duplicidade.

---

# Regressão

Todo bug corrigido deverá gerar um novo teste.

O objetivo é impedir que o mesmo problema volte a ocorrer.

---

# Ambientes

Os testes deverão possuir ambientes próprios.

- desenvolvimento;
- testes;
- homologação;
- produção.

Nunca compartilhar configurações.

---

# Métricas

Acompanhar.

- quantidade de testes;
- tempo de execução;
- falhas;
- cobertura;
- regressões.

---

# Anti-Patterns

Nunca fazer.

❌ Testes dependentes.

❌ Esperas utilizando tempo fixo.

❌ Dados compartilhados.

❌ Testes extremamente longos.

❌ Mockar tudo.

---

# Checklist

Toda nova funcionalidade deverá responder.

- possui testes?
- cobre casos de sucesso?
- cobre casos de erro?
- cobre casos extremos?
- utiliza dados independentes?
- executa rapidamente?

Caso qualquer resposta seja negativa.

A implementação deverá ser revisada.

---

# Escalabilidade

A arquitetura de testes deverá permitir milhares de testes automatizados.

O crescimento da plataforma nunca deverá comprometer a confiabilidade da suíte de testes.

---

# Declaração Final

Os testes representam um dos principais mecanismos de proteção do MedFlow.

Eles permitem evolução contínua da plataforma com segurança, reduzindo regressões e aumentando a confiança durante refatorações, integrações e novas funcionalidades.

Todo código desenvolvido deverá ser considerado incompleto até possuir testes adequados.

---

# Documentos Relacionados

- Services
- Repositories
- Validation
- Error Handling
- CI/CD
- Performance
- Observability