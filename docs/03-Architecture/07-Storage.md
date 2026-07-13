# Storage

| Campo | Valor |
|-------|--------|
| Documento | Storage |
| Versão | 1.0 |
| Status | Oficial |
| Categoria | Architecture |
| Última atualização | 2026 |
| Responsável | Equipe MedFlow |

---

# Objetivo

Este documento define a arquitetura oficial de armazenamento de arquivos do MedFlow.

Seu objetivo é estabelecer como documentos, imagens, exames, receitas, anexos e demais arquivos serão armazenados, organizados, protegidos e recuperados.

O banco de dados nunca deverá ser utilizado como armazenamento principal de arquivos.

---

# Filosofia

No MedFlow existem dois tipos de informação.

## Dados Estruturados

São armazenados no PostgreSQL.

Exemplos:

- pacientes;
- consultas;
- pagamentos;
- prontuários;
- profissionais.

---

## Arquivos

São armazenados em um serviço de Storage.

Exemplos:

- exames;
- receitas em PDF;
- imagens;
- anexos;
- documentos.

O banco armazenará apenas os metadados.

---

# Arquitetura

```text
Cliente

↓

Upload

↓

Storage Service

↓

Arquivo

↓

Banco de Dados

↓

Metadados
```

---

# Responsabilidades

O Storage é responsável por:

- armazenar arquivos;
- recuperar arquivos;
- excluir arquivos;
- versionar quando necessário;
- controlar acesso;
- organizar diretórios.

Nunca armazenar regras de negócio.

---

# Tecnologias

Inicialmente.

O MedFlow utilizará:

- Supabase Storage

A arquitetura deverá permitir futura substituição por:

- Amazon S3
- Google Cloud Storage
- Azure Blob Storage
- Cloudflare R2
- MinIO

Sem alteração da camada de negócio.

---

# Tipos de Arquivos

O sistema deverá suportar.

## Documentos

- PDF
- DOCX
- TXT

---

## Imagens

- JPG
- JPEG
- PNG
- WEBP

---

## Exames

- PDF
- DICOM (futuro)
- JPG
- PNG

---

## Arquivos Clínicos

- anexos;
- laudos;
- prescrições;
- documentos diversos.

---

# Organização

Os arquivos deverão permanecer organizados por Tenant.

Exemplo.

```text
clinic/

clinic-001/

patients/

patient-001/

exams/

prescriptions/

attachments/
```

Nunca misturar arquivos entre clínicas.

---

# Nomeação

Os arquivos nunca deverão utilizar nomes enviados pelo usuário como identificador principal.

Utilizar identificadores únicos.

Exemplo.

```text
f9e92a91-9b83-4d41.pdf
```

O nome original poderá ser armazenado apenas como metadado.

---

# Metadados

Cada arquivo deverá possuir.

- id;
- tenantId;
- ownerId;
- nome original;
- nome interno;
- tipo;
- tamanho;
- MIME Type;
- data de criação;
- autor do upload.

---

# Upload

Fluxo.

```text
Usuário

↓

Validação

↓

Upload

↓

Storage

↓

Registro no Banco

↓

Resposta
```

Caso qualquer etapa falhe.

Toda operação deverá ser revertida.

---

# Download

Fluxo.

```text
Usuário

↓

Autenticação

↓

Autorização

↓

Validação Tenant

↓

Storage

↓

Arquivo
```

Nenhum arquivo poderá ser acessado diretamente.

---

# Exclusão

Ao excluir um registro.

O sistema deverá definir se.

- apenas remove referência;
- realiza Soft Delete;
- remove definitivamente.

Essa decisão dependerá das regras do domínio.

---

# Versionamento

Alguns arquivos poderão possuir histórico.

Exemplo.

Receitas.

Laudos.

Documentos administrativos.

O sistema deverá permitir múltiplas versões quando necessário.

---

# Tamanho Máximo

Os limites deverão ser configuráveis.

Exemplos.

Imagem.

10 MB

PDF.

30 MB

Exames.

100 MB

Esses valores poderão variar conforme o plano contratado.

---

# Tipos Permitidos

Todo upload deverá validar.

- extensão;
- MIME Type;
- tamanho.

Arquivos não permitidos deverão ser rejeitados.

---

# Segurança

Todo upload deverá passar por.

- autenticação;
- autorização;
- validação;
- isolamento por Tenant.

Nunca permitir acesso direto ao Storage.

---

# URLs

Sempre utilizar URLs temporárias (Signed URLs) quando possível.

Nunca expor caminhos internos permanentes.

---

# Arquivos Públicos

Inicialmente.

Nenhum arquivo clínico será público.

Arquivos públicos somente poderão existir para.

- logos;
- imagens institucionais;
- materiais públicos.

---

# Criptografia

Arquivos sensíveis deverão permanecer protegidos.

Sempre que possível.

Utilizar criptografia fornecida pelo provedor de Storage.

---

# Auditoria

Toda operação deverá registrar.

- upload;
- download;
- exclusão;
- atualização.

Com:

- usuário;
- data;
- tenant;
- recurso.

---

# Backup

Os arquivos deverão participar da estratégia oficial de backup.

A recuperação deverá preservar.

- estrutura;
- permissões;
- metadados.

---

# Performance

Boas práticas.

- compressão quando aplicável;
- cache para arquivos públicos;
- CDN no futuro;
- lazy loading;
- thumbnails para imagens.

---

# Integração com IA

A IA poderá acessar arquivos apenas através do Storage Service.

Nunca diretamente.

Toda leitura deverá respeitar:

- permissões;
- tenant;
- auditoria.

---

# Eventos

Eventos oficiais.

FileUploaded

FileDownloaded

FileDeleted

FileUpdated

StorageLimitExceeded

---

# Escalabilidade

A arquitetura deverá permitir.

- milhões de arquivos;
- múltiplos provedores;
- replicação;
- CDN;
- armazenamento distribuído.

Sem alteração da camada de negócio.

---

# Checklist

Todo novo upload deverá responder.

- arquivo válido?
- usuário autenticado?
- tenant validado?
- permissão concedida?
- tipo permitido?
- tamanho permitido?
- auditoria registrada?

---

# Declaração Final

O Storage do MedFlow representa a camada oficial de gerenciamento de arquivos da plataforma.

Sua arquitetura deve garantir segurança, organização, rastreabilidade e escalabilidade, preservando o isolamento entre clínicas e protegendo informações sensíveis durante todo o ciclo de vida dos arquivos.

---

# Documentos Relacionados

- System Architecture
- Multi-Tenant
- Database
- LGPD
- Audit
- Security
- Medical Records
- Prescriptions
- Exams
```