# Sistema de Gestão de Manutenção Industrial

Sistema desenvolvido como Trabalho de Conclusão de Curso (TCC) do Técnico em Informática. Gerencia manutenções de maquinários industriais, conectando operadores, técnicos e administradores em um único fluxo de chamados.

> **Branch de entrega:** `refactor/clean-code-tcc` (versão refatorada) | `original` (versão original)

---

## Descrição e Funcionalidades Principais

O sistema permite:

- **Operador**: abre chamados de manutenção informando o problema e a gravidade; acompanha o status da máquina que monitora.
- **Técnico**: visualiza as ordens de serviço atribuídas a ele; registra início e fim da manutenção (timestamps automáticos); descreve o problema encontrado e informa custo de peças.
- **Administrador**: gerencia cadastro de técnicos, operadores e máquinas; visualiza todos os chamados abertos e atribui um técnico responsável a cada um.

### Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/login` | Login do operador |
| POST | `/logintecnicos` | Login do técnico |
| GET | `/users/<id>` | Dados do operador |
| GET | `/users/tecnicos/<id>` | Dados do técnico |
| GET | `/users/nome_maquina/<id>` | Nome da máquina |
| GET | `/monitores/<id_operador>` | Máquina monitorada pelo operador |
| POST | `/warning` | Abre chamado de manutenção |
| GET | `/getwarning` | Lista todos os problemas cadastrados |
| GET | `/allserviceorders` | Lista todas as ordens de serviço |
| GET | `/jobsbyid/<id_tecnico>` | Ordens atribuídas a um técnico |
| PUT | `/startjob/<id>` | Inicia uma manutenção |
| PUT | `/finishjob/<id>` | Finaliza uma manutenção |
| PUT | `/editjobdetails/<id>` | Edita detalhes da ordem |
| GET | `/gettecnicos` | Lista técnicos (admin) |
| GET | `/getoperadores` | Lista operadores (admin) |
| GET | `/getallmaquinas` | Lista máquinas (admin) |
| GET | `/getalllogs` | Lista todos os logs (admin) |
| POST | `/createtecnico` | Cadastra técnico |
| PUT | `/updatetecnico` | Atualiza técnico |
| DELETE | `/deletetecnico` | Remove técnico |
| POST | `/createoperador` | Cadastra operador |
| PUT | `/updateoperador` | Atualiza operador |
| DELETE | `/deleteoperador` | Remove operador |
| POST | `/createmaquinas` | Cadastra máquina |
| PUT | `/updatemaquinas` | Atualiza máquina |
| DELETE | `/deletemaquinas` | Remove máquina |
| POST/PUT | `/definelogs` | Atribui técnico a um chamado |

---

## Análise dos Principais Problemas Detectados (Code Smells)

### 1. Duplicated Code + Feature Envy — acesso a dados espalhado
Todos os controllers repetiam o mesmo bloco `with db.engine.connect() as conn: ... conn.commit()` e o mesmo `try/except SQLAlchemyError`. Os controllers conheciam detalhes internos de conexão e serialização que não eram de sua responsabilidade.

### 2. Estado Global Compartilhado — bug crítico de concorrência
`warningcontroller.py` usava `id_maquina_global`, uma variável de módulo compartilhada entre todas as requisições simultâneas. Isso causava condição de corrida: o dado de um operador podia sobrescrever o de outro. Além disso, a primeira chamada de `save_warning` retornava o ID da máquina em vez de salvar o aviso.

### 3. Senhas em Texto Puro — falha de segurança
As senhas dos técnicos eram gravadas no banco e comparadas em texto puro. Qualquer acesso ao banco expunha todas as credenciais.

### 4. Credenciais Hardcoded
A string de conexão `mysql+pymysql://root:root@localhost:3301/tccdb` estava diretamente no código-fonte versionado.

### 5. Magic Strings de Status
As strings `"Atribuído"`, `"Em andamento"` e `"Finalizado"` eram digitadas literalmente em múltiplos controllers, sem garantia de consistência.

### 6. Inconsistent Error Handling
Cada função repetia `try/except` de forma diferente. Alguns endpoints retornavam erro com status HTTP 200 (sem código de status adequado).

### 7. Bugs de Nomenclatura e Tipos nos Models
- `db.varchar(255)` não existe no SQLAlchemy — quebraria o boot do ORM.
- `Manutencao.to_dict` referenciava `self.motivo`, coluna inexistente, que lançaria `AttributeError` em runtime.
- Nomes de função com PascalCase misturado (`get_all_Service_Orders`).

### 8. Debug Mode Fixo em Produção
`app.run(debug=True)` estava hardcoded, expondo stack traces completos em qualquer ambiente.

---

## Estratégias de Refatoração Utilizadas

| Problema | Solução |
|---|---|
| Acesso a dados duplicado | `database/helpers.py` com `query_all`, `query_one`, `execute_write` |
| Estado global | Eliminado; parâmetros resolvidos por requisição em `warningcontroller.py` |
| Senhas em texto puro | `security.py` com `hash_password` / `verify_password` (werkzeug pbkdf2:sha256) |
| Credenciais hardcoded | `config.py` com `python-dotenv`; `.env.example` documenta as chaves |
| Magic strings | Enum `StatusManutencao` em `constants.py` |
| Tratamento de erro inconsistente | `handle_db_errors` (decorator), `success_response`, `error_response` em `utils/responses.py` |
| Bugs de types/nomes | Corrigidos nos models e controllers; snake_case aplicado |
| Debug em produção | `FLASK_DEBUG` via variável de ambiente, default `false` |

A refatoração manteve o **contrato HTTP idêntico** (mesmas rotas e mesmo formato JSON) para que o frontend React Native continuasse funcionando sem alterações.

---

## Testes Implementados e Cobertura

Os testes cobrem a **lógica pura** do backend — módulos que não dependem de conexão com MySQL:

| Arquivo | O que testa |
|---|---|
| `tests/test_security.py` | Hash ≠ texto puro, verificação correta/incorreta, salt aleatório, fallback para senhas legadas |
| `tests/test_constants.py` | Valores do enum `StatusManutencao`; compatibilidade com string |
| `tests/test_responses.py` | Envelope de sucesso/erro, serialização de `timedelta`, validação de campos obrigatórios |

### Executar testes e relatório de cobertura

```bash
cd backend
pip install -r requirements.txt
pytest -q
```

A cobertura abrange os módulos `security.py`, `constants.py` e `utils/responses.py`. Controllers e helpers de banco de dados dependem de contexto Flask e MySQL, sendo testados em integração.

---

## Instalação e Execução

### Pré-requisitos
- Python 3.11+
- MySQL 8.0+ (com banco `tccdb` criado)
- Node.js 18+ e Expo CLI (para o frontend)

### Backend

```bash
cd backend

# 1. Criar e ativar ambiente virtual
python3 -m venv .venv
source .venv/bin/activate        # Linux/Mac
.venv\Scripts\activate           # Windows

# 2. Instalar dependências
pip install -r requirements.txt

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com as credenciais do seu banco MySQL

# 4. Subir a API
python main.py
```

A API ficará disponível em `http://localhost:5000`.

### Testes

```bash
cd backend
pytest -q
```

### Linter

```bash
cd backend
ruff check .
```

### Frontend (React Native / Expo)

```bash
cd frontend
npm install
npx expo start
```

### Pre-commit Hook (desenvolvimento)

```bash
# Na raiz do projeto
pip install pre-commit
pre-commit install
```

A partir daí, `ruff` será executado automaticamente antes de cada commit.

---

## Estrutura do Projeto (versão refatorada)

```
ProjetoTCC/
├── backend/
│   ├── config.py              # Configuração via variáveis de ambiente
│   ├── constants.py           # Enum StatusManutencao
│   ├── security.py            # Hash e verificação de senhas
│   ├── main.py                # Ponto de entrada (classe App)
│   ├── controllers/           # Lógica dos endpoints
│   ├── routes/                # Registro de rotas Flask
│   ├── models/                # Modelos SQLAlchemy
│   ├── database/
│   │   ├── db.py              # Instância do SQLAlchemy
│   │   └── helpers.py         # query_all, query_one, execute_write
│   ├── utils/
│   │   └── responses.py       # Respostas padronizadas + decorators
│   ├── tests/                 # Testes unitários (pytest)
│   ├── pyproject.toml         # Config do ruff e pytest-cov
│   ├── requirements.txt       # Dependências Python
│   └── .env.example           # Variáveis de ambiente documentadas
├── frontend/                  # App React Native (Expo)
├── .github/
│   └── workflows/ci.yml       # Pipeline CI: lint + testes
├── .pre-commit-config.yaml    # Hook de pre-commit com ruff
└── CHANGELOG.md               # Histórico de mudanças
```

---

## Tecnologias

- **Backend:** Python 3.11 · Flask 3 · SQLAlchemy 2 · PyMySQL · Werkzeug · python-dotenv
- **Frontend:** React Native · Expo
- **Banco de dados:** MySQL 8
- **Qualidade de código:** ruff (linter) · pytest · pytest-cov
- **CI/CD:** GitHub Actions

---

## Licença

Este repositório está licenciado sob a [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)](./LICENSE).
