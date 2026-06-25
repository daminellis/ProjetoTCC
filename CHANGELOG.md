# Changelog

Todas as mudanças relevantes deste projeto serão documentadas neste arquivo.

O formato segue as recomendações de [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [1.1.0] — 2026-06-11

### Adicionado
- `config.py`: configuração da aplicação lida via variáveis de ambiente (`python-dotenv`), substituindo credenciais hardcoded.
- `.env.example`: documenta todas as variáveis de ambiente esperadas; o `.env` real não é versionado.
- `security.py`: funções `hash_password` e `verify_password` centralizando o hash de senhas com `werkzeug.security` (pbkdf2:sha256).
- `constants.py`: enum `StatusManutencao` com os valores `ATRIBUIDO`, `EM_ANDAMENTO` e `FINALIZADO`, eliminando magic strings.
- `utils/responses.py`: helpers padronizados de resposta HTTP — `success_response`, `error_response`, `validate_required`, `serialize_value` e decorator `handle_db_errors`.
- `database/helpers.py`: funções `query_all`, `query_one` e `execute_write` centralizando o padrão de acesso ao banco de dados.
- `tests/test_security.py`: testes unitários para hash, verificação e fallback de senhas legadas.
- `tests/test_constants.py`: testes unitários para os valores do enum de status.
- `tests/test_responses.py`: testes unitários para os helpers de resposta, serialização e validação.
- `tests/conftest.py`: configuração do pytest com fixture de contexto Flask.
- `requirements.txt`: dependências declaradas explicitamente com versões mínimas.
- `pyproject.toml`: configuração do `ruff` (linter) e do `pytest-cov` (cobertura).
- `.github/workflows/ci.yml`: pipeline de CI com jobs de lint (`ruff`) e testes (`pytest`).
- `.pre-commit-config.yaml`: hook de pre-commit com `ruff` para verificação antes de cada commit.

### Alterado
- `main.py`: refatorado para a classe `App` com injeção de dependência de configuração via `Config`.
- `admincontroller.py`: eliminado o bloco repetido de conexão/commit e `try/except`; usa `query_all`, `execute_write`, `handle_db_errors` e `validate_required`.
- `logscontroller.py` (login): verificação de senha do técnico migrada de comparação em texto puro para `verify_password`.
- `maintencecontroller.py`: usa helpers de banco e enum de status em vez de strings literais.
- `userscontroller.py`: extrai `_format_horario` para tratar `datetime.time` sem repetição.
- `warningcontroller.py`: variável global `id_maquina_global` removida; a máquina agora vem do corpo da requisição ou é resolvida por operador a cada chamada.
- `LICENCE` renomeado para `LICENSE` (corrige typo; o README já referenciava `./LICENSE`).
- Models: `db.varchar(255)` / `db.varchar(500)` corrigidos para `db.String(...)` (método correto do SQLAlchemy).
- `Manutencao.to_dict`: removida referência a `self.motivo` (coluna inexistente que causaria `AttributeError`).
- `get_all_Service_Orders` → `get_all_service_orders` (snake_case consistente); rota HTTP preservada.

### Corrigido
- Bug de estado global: `id_maquina_global` em `warningcontroller.py` causava condição de corrida entre operadores concorrentes e retornava o ID da máquina em vez de salvar o aviso na primeira chamada.
- Senhas dos técnicos gravadas e comparadas em texto puro — agora usam hash seguro.
- Credenciais do banco de dados expostas no código-fonte — movidas para variáveis de ambiente.
- `FLASK_DEBUG=True` fixo no código — agora controlado por variável de ambiente com default `false`.

### Segurança
- Senhas migradas de texto puro para hash `pbkdf2:sha256` via `werkzeug.security`.
- Credenciais de banco de dados removidas do código e movidas para `.env`.
- Debug mode desativado por padrão.

---

## [1.0.0] — 2024-11-26

### Adicionado
- Sistema de gerenciamento de manutenção industrial com perfis de Operador, Técnico e Administrador.
- Backend em Python/Flask com banco de dados MySQL.
- Frontend em React Native (Expo).
- Autenticação de operador por máquina monitorada e de técnico por ID e senha.
- Tela de abertura de chamados de manutenção (avisos) com gravidade pelo operador.
- Tela de ordens de serviço para o técnico (iniciar, editar detalhes e finalizar).
- Painel administrativo com CRUD de técnicos, operadores e máquinas, e atribuição de técnico a chamados.
- Registro de logs de chamados com timestamps automáticos de início e fim.

[1.1.0]: https://github.com/MatheusADamasceno/ProjetoTCC/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/MatheusADamasceno/ProjetoTCC/releases/tag/v1.0.0
