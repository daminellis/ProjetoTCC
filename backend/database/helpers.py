"""Helpers de acesso a dados.

Centralizam o padrão repetido `with db.engine.connect() as connection: ...` que
aparecia em todos os controllers (Duplicated Code + Feature Envy). Os controllers
passam a descrever "o quê" consultar; o "como" abrir conexão, serializar linhas e
dar commit fica aqui.
"""
from sqlalchemy.sql import text

from database.db import db
from utils.responses import serialize_value


def _row_to_dict(row) -> dict:
    return {key: serialize_value(value) for key, value in row._mapping.items()}


def query_all(sql: str, params: dict | None = None) -> list[dict]:
    """Executa um SELECT e retorna todas as linhas como lista de dicts."""
    with db.engine.connect() as connection:
        result = connection.execute(text(sql), params or {})
        return [_row_to_dict(row) for row in result.fetchall()]


def query_one(sql: str, params: dict | None = None) -> dict | None:
    """Executa um SELECT e retorna a primeira linha como dict (ou None)."""
    with db.engine.connect() as connection:
        result = connection.execute(text(sql), params or {})
        row = result.fetchone()
        return _row_to_dict(row) if row is not None else None


def execute_write(statements: list[tuple[str, dict]]) -> None:
    """Executa um ou mais comandos de escrita em uma única transação.

    `statements` é uma lista de tuplas (sql, params). Todos os comandos
    compartilham a mesma conexão e um único commit ao final.
    """
    with db.engine.connect() as connection:
        for sql, params in statements:
            connection.execute(text(sql), params or {})
        connection.commit()
