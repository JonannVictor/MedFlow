# Error Handling

| Campo | Valor |
|-------|--------|
| Documento | Error Handling |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Architecture |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define a estratégia oficial de tratamento de erros do MedFlow.

O objetivo é garantir que toda falha seja tratada de maneira consistente, previsível, segura e rastreável.

Nenhum erro deverá ser ignorado ou tratado de forma improvisada.

---

# Filosofia

Erros fazem parte de qualquer sistema.

Um erro bem tratado:

- protege o usuário;
- facilita manutenção;
- reduz tempo de diagnóstico;
- melhora observabilidade;
- evita falhas em cascata.

---

# Princípios

Todo erro deverá ser:

- previsível;
- tipado;
- documentado;
- registrado;
- rastreável.

Nunca lançar erros genéricos.

---

# Fluxo

```text
Erro

↓

Captura

↓

Classificação

↓

Log

↓

Auditoria (quando necessário)

↓

Resposta Padronizada

↓

Usuário
```

---

# Tipos de Erro

## Validation Error

Erro causado por entrada inválida.

Exemplos.

- campo obrigatório;
- CPF inválido;
- data incorreta.

Retorno.

400 Bad Request

---

## Authentication Error

Usuário não autenticado.

Retorno.

401 Unauthorized

---

## Authorization Error

Usuário autenticado.

Sem permissão.

Retorno.

403 Forbidden

---

## Not Found

Recurso inexistente.

Retorno.

404 Not Found

---

## Conflict

Conflito de negócio.

Exemplos.

- horário ocupado;
- e-mail já utilizado;
- consulta duplicada.

Retorno.

409 Conflict

---

## Business Rule Error

Violação de regra de negócio.

Exemplos.

- consulta concluída não pode ser cancelada;
- pagamento já processado;
- assinatura expirada.

Retorno.

422 Unprocessable Entity

---

## External Service Error

Falhas em integrações externas.

Exemplos.

- gateway de pagamento;
- IA;
- e-mail;
- storage.

Retorno.

502 Bad Gateway

---

## Internal Error

Falha inesperada.

Retorno.

500 Internal Server Error

---

# Estrutura do Erro

Toda resposta deverá seguir o mesmo padrão.

```json
{
  "success": false,
  "error": {
    "code": "APPOINTMENT_CONFLICT",
    "message": "O horário selecionado já está ocupado.",
    "requestId": "req_81F4A2"
  }
}
```

---

# Código do Erro

Todo erro deverá possuir um código único.

Exemplos.

```text
AUTH_INVALID_CREDENTIALS

AUTH_SESSION_EXPIRED

PATIENT_NOT_FOUND

PATIENT_ALREADY_EXISTS

APPOINTMENT_CONFLICT

APPOINTMENT_CANCELLED

PAYMENT_FAILED

PAYMENT_DECLINED

AI_TIMEOUT

FILE_TOO_LARGE

PERMISSION_DENIED

TENANT_NOT_FOUND
```

Os códigos nunca deverão mudar.

---

# Mensagens

Separar mensagens técnicas das mensagens exibidas ao usuário.

Errado.

```text
SQLSTATE 23505
```

Correto.

```text
Já existe um paciente com este CPF.
```

---

# Exceções

Criar exceções específicas.

Exemplos.

```text
ValidationException

AuthenticationException

AuthorizationException

ConflictException

BusinessRuleException

ExternalServiceException
```

Nunca utilizar Exception genérica.

---

# Tratamento Global

Toda exceção deverá passar por um Error Handler central.

Fluxo.

```text
Exception

↓

Global Handler

↓

Logger

↓

Resposta Padronizada
```

---

# Logs

Todo erro deverá gerar log.

Informações mínimas.

- requestId;
- tenant;
- usuário;
- módulo;
- operação;
- stack trace (interno).

---

# Auditoria

Nem todo erro gera auditoria.

Auditar apenas erros relevantes.

Exemplos.

- tentativa de acesso proibido;
- alteração indevida;
- tentativa entre tenants;
- falha de autenticação.

---

# Integrações

Falhas externas deverão utilizar.

- timeout;
- retries;
- circuit breaker (futuro).

Nunca propagar erros internos do provedor.

---

# Frontend

O Frontend nunca deverá decidir mensagens baseado em texto.

Sempre utilizar o código do erro.

Exemplo.

```text
PAYMENT_DECLINED

↓

Mensagem localizada
```

Isso facilita internacionalização.

---

# Segurança

Nunca retornar.

- stack trace;
- SQL;
- tokens;
- caminhos internos;
- informações da infraestrutura.

Esses dados pertencem apenas aos logs.

---

# Retry

Alguns erros poderão ser repetidos automaticamente.

Exemplos.

- timeout;
- falha temporária;
- indisponibilidade de integração.

Erros de negócio nunca deverão ser repetidos.

---

# Eventos

Eventos oficiais.

ValidationFailed

AuthenticationFailed

AuthorizationFailed

BusinessRuleViolated

ExternalServiceFailed

UnhandledException

---

# Checklist

Toda funcionalidade deverá responder.

- possui erros tipados?
- utiliza Error Handler?
- registra logs?
- respeita LGPD?
- possui códigos oficiais?
- evita mensagens técnicas?

---

# Escalabilidade

Novos módulos poderão criar novos códigos.

Entretanto.

Todos deverão seguir a mesma arquitetura.

---

# Declaração Final

Um tratamento consistente de erros é essencial para a confiabilidade do MedFlow.

Toda falha deve ser previsível, rastreável e compreensível, tanto para os usuários quanto para a equipe de engenharia.

O sistema nunca deverá falhar de maneira silenciosa ou imprevisível.

---

# Documentos Relacionados

- API Architecture
- Logging
- Observability
- Security
- Authentication
- Authorization
- Business Rules
- Audit