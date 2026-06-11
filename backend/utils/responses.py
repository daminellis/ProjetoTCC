"""Helpers de resposta HTTP e tratamento de erro padronizados.

Antes, cada controller montava manualmente `jsonify({"success": ...})` e
repetia o mesmo bloco `except SQLAlchemyError` dezenas de vezes. Aqui o padrão
fica em um único lugar:

- `success_response` / `error_response`: formato uniforme de resposta.
- `serialize_value`: converte tipos não serializáveis (ex.: timedelta).
- `handle_db_errors`: decorator que captura erros de banco e responde 500.

As CHAVES de payload continuam livres (ex.: `tecnicos=...`, `user=...`) para
preservar o contrato HTTP que o frontend já consome.
"""
from datetime import timedelta
from functools import wraps

from flask import jsonify
from sqlalchemy.exc import SQLAlchemyError


def serialize_value(value):
    """Converte valores não serializáveis pelo JSON (ex.: timedelta)."""
    if isinstance(value, timedelta):
        return str(value)
    return value


def success_response(status_code: int = 200, **payload):
    """Resposta de sucesso: {"success": True, **payload}."""
    body = {"success": True}
    body.update(payload)
    return jsonify(body), status_code


def error_response(message: str, status_code: int = 400):
    """Resposta de erro: {"success": False, "error": message}."""
    return jsonify({"success": False, "error": message}), status_code


def validate_required(data: dict, fields: list[str]):
    """Retorna a lista de campos obrigatórios ausentes/vazios."""
    if not isinstance(data, dict):
        return list(fields)
    return [field for field in fields if not data.get(field)]


def handle_db_errors(func):
    """Decorator que padroniza o tratamento de erros de banco de dados."""

    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except SQLAlchemyError as exc:
            detail = str(exc.__dict__.get("orig", exc))
            return error_response(detail, 500)

    return wrapper
