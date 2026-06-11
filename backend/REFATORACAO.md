# Refatoração do Backend — Análise de Code Smells e Clean Code

> Branch: `refactor/clean-code-tcc`
> Escopo: refatoração **pragmática** do backend Flask, mantendo o **contrato HTTP
> idêntico** (mesmas rotas e mesmo formato de resposta JSON) para o app Expo
> continuar funcionando sem alterações.

Este documento descreve o que foi detectado no código original, o que foi
mudado, e onde cada mudança vive.

---

## 1. Visão geral

O backend é uma API Flask + SQLAlchemy para gestão de manutenção industrial. O
código original concentrava SQL cru, tratamento de erro repetido e regras de
negócio nos controllers, além de problemas concretos de segurança e um bug de
estado global compartilhado entre requisições.

A refatoração **não alterou nenhuma rota nem o formato das respostas** — apenas
a organização interna, a segurança e a robustez. O frontend não precisa de
ajustes.

### Estrutura nova de apoio

| Arquivo | Responsabilidade |
|---|---|
| `config.py` | Configuração via variáveis de ambiente (sem credenciais hardcoded) |
| `security.py` | Hash e verificação de senhas (`werkzeug.security`) |
| `constants.py` | Enum `StatusManutencao` (elimina magic strings) |
| `utils/responses.py` | Respostas padronizadas + decorator de erro + serialização |
| `database/helpers.py` | Acesso a dados centralizado (`query_all`, `query_one`, `execute_write`) |
| `tests/` | Testes com `pytest` da lógica pura |
| `.env.example` | Documentação das variáveis de ambiente esperadas |
| `requirements.txt` | Dependências do projeto |

---

## 2. Problemas de segurança corrigidos

### 2.1 Senhas em texto puro → hash
**Antes:** a senha do técnico era gravada e comparada em texto puro
(`logstecnico_controller`, `create_tecnico`, `update_tecnico`).

**Depois:** `security.py` aplica `generate_password_hash` na escrita e
`check_password_hash` no login. Há um *fallback* tolerante para registros
legados ainda em texto puro, para não travar logins enquanto a base não é
migrada.

> ⚠️ Senhas criadas **após** esta mudança são gravadas com hash. Senhas antigas
> continuam funcionando pelo fallback, mas o ideal é recriar/atualizar os
> técnicos para que todas fiquem com hash.

### 2.2 Credenciais hardcoded → `.env`
**Antes:** `main.py` continha `mysql+pymysql://root:root@localhost:3301/tccdb`.

**Depois:** `config.py` lê tudo de variáveis de ambiente via `python-dotenv`.
O `.env` real não é versionado (ver `.gitignore`); o `.env.example` documenta as
chaves.

### 2.3 Debug ligado em produção
**Antes:** `self.app.run(..., debug=True)` fixo.

**Depois:** `debug` vem de `FLASK_DEBUG` e tem default **`false`**. Só liga
quando o ambiente pedir explicitamente.

### 2.4 Sobre "SQL Injection"
As queries já usavam *bind parameters* (`:param`) do SQLAlchemy `text()`, então
o risco de injeção clássico já era baixo. O smell real era **SQL cru espalhado
e duplicado** nos controllers — tratado na seção 4.1.

---

## 3. Estado global removido

**Antes:** `warningcontroller.py` tinha `id_maquina_global`, uma variável de
módulo compartilhada entre **todas** as requisições. Isso causa condição de
corrida e mistura de dados entre operadores concorrentes. Pior: a primeira
chamada de `save_warning` (com o global ainda `None`) retornava o id da máquina
em vez de salvar o aviso.

**Depois:** o global foi eliminado. `save_warning` usa o `id_maquina` enviado no
corpo da requisição (que o app já manda) e, se ausente, resolve a partir do
operador via `_id_maquina_do_operador`. Cada requisição é independente.

---

## 4. Code smells tratados

### 4.1 God Class / Duplicated Code / Feature Envy
**Antes:** `admincontroller.py` tinha ~15 funções, cada uma repetindo o bloco
`with db.engine.connect() as connection: ... commit()` e o mesmo
`except SQLAlchemyError`. Os controllers conheciam detalhes de conexão e
serialização do banco (Feature Envy).

**Depois:**
- `database/helpers.py` centraliza o acesso a dados:
  - `query_all(sql, params)` — SELECT que retorna lista de dicts (já serializa `timedelta`).
  - `query_one(sql, params)` — SELECT de uma linha.
  - `execute_write([(sql, params), ...])` — escritas em uma única transação/commit.
- Os controllers agora descrevem **o quê** consultar, não **como** conectar.

### 4.2 Inconsistent Error Handling
**Antes:** cada função repetia `try/except SQLAlchemyError`, e alguns endpoints
retornavam erro **sem status code** (default 200).

**Depois:** `utils/responses.py` traz:
- `handle_db_errors` — decorator que captura erro de banco e responde 500 padronizado.
- `success_response(...)` / `error_response(...)` — envelope uniforme
  (`{"success": True, ...}` / `{"success": False, "error": ...}`).
- `validate_required(data, campos)` — valida campos obrigatórios em um lugar só.

> As **chaves de payload** continuam livres (`tecnicos=`, `user=`, `maquinas=`…)
> para preservar exatamente o contrato consumido pelo app.

### 4.3 Magic Strings (status)
**Antes:** strings `"Atribuído"`, `"Em andamento"`, `"Finalizado"` digitadas
soltas nos controllers.

**Depois:** enum `StatusManutencao` em `constants.py`, usado em
`admincontroller.define_logs`, `maintencecontroller.start_job` e `finish_job`.

### 4.4 Bugs de nomenclatura e tipos
- `db.varchar(255)` / `db.varchar(500)` → `db.String(...)` em `logsmodels.py` e
  `manutencaomodels.py`. (`db.varchar` **não existe** — quebraria o boot do ORM.)
- `Manutencao.to_dict` referenciava `self.motivo`, **coluna inexistente**
  (lançaria `AttributeError`). Removido; incluído `id_operador`, que faltava.
- `get_all_Service_Orders` → `get_all_service_orders` (snake_case consistente).
  A rota HTTP `/allserviceorders` **permanece igual**.
- Arquivo `LICENCE` → `LICENSE` (corrige o typo; o README já linkava `./LICENSE`).

---

## 5. Testes

Adicionados testes `pytest` da lógica pura (não dependem de MySQL):

- `tests/test_security.py` — hash ≠ texto puro, verificação correta/incorreta,
  salt, fallback legado.
- `tests/test_constants.py` — valores do enum de status.
- `tests/test_responses.py` — envelope de sucesso/erro, serialização de
  `timedelta`, validação de campos obrigatórios.

```bash
cd backend
.venv/bin/pytest -q
```

---

## 6. Como rodar

```bash
cd backend

# 1. Ambiente virtual + dependências
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt

# 2. Configuração (copie e ajuste)
cp .env.example .env

# 3. Subir a API
.venv/bin/python main.py

# 4. Rodar os testes
.venv/bin/pytest -q
```

---

## 7. O que ficou de fora (por escopo)

Esta foi uma refatoração **pragmática focada em valor**. Itens do plano original
que não foram incluídos por decisão de escopo:

- Camadas formais completas de Repository + Service com injeção de dependência
  (aqui usamos *helpers* de dados, que resolvem a duplicação sem a cerimônia).
- Tooling pesado de qualidade (pre-commit, black, isort, mypy, pylint, bandit,
  docker-compose).
- Migração dos models anêmicos para um Domain Model rico e Value Objects.

Esses pontos podem ser uma próxima fase, mas não eram necessários para sanar os
problemas críticos (segurança, estado global, duplicação e nomenclatura).
