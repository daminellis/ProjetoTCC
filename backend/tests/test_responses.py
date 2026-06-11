"""Testes dos helpers de resposta padronizada."""
from datetime import timedelta

from utils.responses import (
    error_response,
    serialize_value,
    success_response,
    validate_required,
)


def test_serialize_value_converte_timedelta():
    assert serialize_value(timedelta(hours=8)) == "8:00:00"


def test_serialize_value_mantem_outros_tipos():
    assert serialize_value("texto") == "texto"
    assert serialize_value(42) == 42


def test_validate_required_detecta_campos_ausentes():
    data = {"nome": "Ana", "senha": ""}
    faltando = validate_required(data, ["nome", "senha", "area"])
    assert set(faltando) == {"senha", "area"}


def test_validate_required_sem_faltantes():
    data = {"nome": "Ana", "senha": "x"}
    assert validate_required(data, ["nome", "senha"]) == []


def test_validate_required_com_dado_invalido():
    assert validate_required(None, ["a", "b"]) == ["a", "b"]


def test_success_response_envelope(app_context):
    body, status = success_response(tecnicos=[{"id_tecnico": 1}])
    assert status == 200
    payload = body.get_json()
    assert payload["success"] is True
    assert payload["tecnicos"] == [{"id_tecnico": 1}]


def test_success_response_status_customizado(app_context):
    _, status = success_response(201, message="criado")
    assert status == 201


def test_error_response_envelope(app_context):
    body, status = error_response("Dados incompletos", 400)
    assert status == 400
    payload = body.get_json()
    assert payload["success"] is False
    assert payload["error"] == "Dados incompletos"
