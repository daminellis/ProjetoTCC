"""Controllers de administração (técnicos, operadores, máquinas, logs).

Refatorado: o SQL cru e o tratamento de erro repetidos foram movidos para
`database.helpers` e `utils.responses`. As funções aqui descrevem apenas a
intenção de cada endpoint. Senhas de técnico passam por hash (`security`).
"""
from flask import request
from sqlalchemy.sql import text

from constants import StatusManutencao
from database.db import db
from database.helpers import execute_write, query_all
from security import hash_password
from utils.responses import (
    error_response,
    handle_db_errors,
    success_response,
    validate_required,
)


# ----------------------------- Técnicos ------------------------------------ #
@handle_db_errors
def get_tecnicos():
    tecnicos = query_all("SELECT * FROM tecnicos")
    if not tecnicos:
        return error_response("Técnicos não encontrados", 404)
    return success_response(tecnicos=tecnicos)


@handle_db_errors
def create_tecnico():
    data = request.json or {}
    if validate_required(data, ["nome", "area_de_manutencao", "senha"]):
        return error_response("Dados incompletos", 400)

    execute_write([(
        "INSERT INTO tecnicos (nome, area_de_manutencao, senha) "
        "VALUES (:nome, :area_de_manutencao, :senha)",
        {
            "nome": data["nome"],
            "area_de_manutencao": data["area_de_manutencao"],
            "senha": hash_password(data["senha"]),
        },
    )])
    return success_response(message="Técnico criado com sucesso!")


@handle_db_errors
def update_tecnico():
    data = request.json or {}
    if validate_required(data, ["id_tecnico", "nome", "area_de_manutencao", "senha"]):
        return error_response("Dados incompletos", 400)

    execute_write([(
        "UPDATE tecnicos SET nome = :nome, area_de_manutencao = :area_de_manutencao, "
        "senha = :senha WHERE id_tecnico = :id_tecnico",
        {
            "nome": data["nome"],
            "area_de_manutencao": data["area_de_manutencao"],
            "senha": hash_password(data["senha"]),
            "id_tecnico": data["id_tecnico"],
        },
    )])
    return success_response(message="Técnico atualizado com sucesso!")


@handle_db_errors
def delete_tecnico():
    data = request.json or {}
    if not data.get("id_tecnico"):
        return error_response("ID do técnico não foi passado", 400)

    execute_write([(
        "DELETE FROM tecnicos WHERE id_tecnico = :id_tecnico",
        {"id_tecnico": data["id_tecnico"]},
    )])
    return success_response(message="Técnico deletado com sucesso!")


# ----------------------------- Operadores ---------------------------------- #
@handle_db_errors
def get_operadores():
    operadores = query_all(
        "SELECT operadores.id_operador, operadores.horario_de_trabalho, operadores.nome, "
        "monitores.id_monitor, monitores.id_maquina FROM operadores "
        "JOIN monitores ON operadores.id_operador = monitores.id_operador"
    )
    if not operadores:
        return error_response("Operadores não encontrados", 404)
    return success_response(operadores=operadores)


@handle_db_errors
def create_operador():
    data = request.json or {}
    if validate_required(data, ["nome", "horario_de_trabalho", "id_maquina"]):
        return error_response("Dados incompletos", 400)

    # Precisa do id recém-inserido para vincular o monitor, por isso usa uma
    # única conexão/transação em vez de execute_write.
    with db.engine.connect() as connection:
        connection.execute(
            text(
                "INSERT INTO operadores (nome, horario_de_trabalho) "
                "VALUES (:nome, :horario_de_trabalho)"
            ),
            {"nome": data["nome"], "horario_de_trabalho": data["horario_de_trabalho"]},
        )
        novo_id = connection.execute(
            text(
                "SELECT id_operador FROM operadores WHERE nome = :nome "
                "ORDER BY id_operador DESC LIMIT 1"
            ),
            {"nome": data["nome"]},
        ).fetchone()[0]
        connection.execute(
            text("INSERT INTO monitores (id_operador, id_maquina) VALUES (:id_operador, :id_maquina)"),
            {"id_operador": novo_id, "id_maquina": data["id_maquina"]},
        )
        connection.commit()

    return success_response(message="Operador criado com sucesso!")


@handle_db_errors
def update_operador():
    data = request.json or {}
    if validate_required(data, ["id_operador", "nome", "horario_de_trabalho", "id_maquina"]):
        return error_response("Dados incompletos", 400)

    execute_write([
        (
            "UPDATE operadores SET nome = :nome, horario_de_trabalho = :horario_de_trabalho "
            "WHERE id_operador = :id_operador",
            {
                "nome": data["nome"],
                "horario_de_trabalho": data["horario_de_trabalho"],
                "id_operador": data["id_operador"],
            },
        ),
        (
            "UPDATE monitores SET id_maquina = :id_maquina WHERE id_operador = :id_operador",
            {"id_maquina": data["id_maquina"], "id_operador": data["id_operador"]},
        ),
    ])
    return success_response(message="Operador atualizado com sucesso!")


@handle_db_errors
def delete_operador():
    data = request.json or {}
    if not data.get("id_operador"):
        return error_response("ID do operador não foi passado", 400)

    execute_write([
        ("DELETE FROM monitores WHERE id_operador = :id_operador", {"id_operador": data["id_operador"]}),
        ("DELETE FROM operadores WHERE id_operador = :id_operador", {"id_operador": data["id_operador"]}),
    ])
    return success_response(message="Operador deletado com sucesso!")


# ------------------------------- Logs -------------------------------------- #
@handle_db_errors
def get_all_logs():
    logs = query_all("SELECT * FROM logs")
    if not logs:
        return error_response("Logs não encontrados", 404)
    return success_response(logs=logs)


@handle_db_errors
def define_logs():
    data = request.json or {}
    required = ["id_operador", "id_tecnico", "id_maquina", "descricao", "id_log", "data_criacao"]
    if validate_required(data, required):
        return error_response("Dados incompletos", 400)

    status = StatusManutencao.ATRIBUIDO.value
    execute_write([
        (
            "INSERT INTO manutencoes (id_operador, id_tecnico, id_maquina, descricao, status, data_criacao) "
            "VALUES (:id_operador, :id_tecnico, :id_maquina, :descricao, :status, :data_criacao)",
            {
                "id_operador": data["id_operador"],
                "id_tecnico": data["id_tecnico"],
                "id_maquina": data["id_maquina"],
                "descricao": data["descricao"],
                "status": status,
                "data_criacao": data["data_criacao"],
            },
        ),
        (
            "UPDATE logs SET status = :status, id_tecnico = :id_tecnico WHERE id_log = :id_log",
            {"id_log": data["id_log"], "id_tecnico": data["id_tecnico"], "status": status},
        ),
    ])
    return success_response(message="Log definido com sucesso!")


# ------------------------------ Máquinas ----------------------------------- #
@handle_db_errors
def get_all_machines():
    maquinas = query_all("SELECT * FROM maquinas")
    if not maquinas:
        return error_response("Máquinas não encontradas", 404)
    return success_response(maquinas=maquinas)


@handle_db_errors
def create_machine():
    data = request.json or {}
    if validate_required(data, ["nome_maquina", "local"]):
        return error_response("Dados incompletos", 400)

    execute_write([(
        "INSERT INTO maquinas (nome_maquina, local) VALUES (:nome_maquina, :local)",
        {"nome_maquina": data["nome_maquina"], "local": data["local"]},
    )])
    return success_response(message="Máquina criada com sucesso!")


@handle_db_errors
def delete_machine():
    data = request.json or {}
    if not data.get("id_maquina"):
        return error_response("ID da máquina não foi passado", 400)

    execute_write([(
        "DELETE FROM maquinas WHERE id_maquina = :id_maquina",
        {"id_maquina": data["id_maquina"]},
    )])
    return success_response(message="Máquina deletada com sucesso!")


@handle_db_errors
def update_machine():
    data = request.json or {}
    if validate_required(data, ["id_maquina", "nome_maquina", "local"]):
        return error_response("Dados incompletos", 400)

    execute_write([(
        "UPDATE maquinas SET nome_maquina = :nome_maquina, local = :local "
        "WHERE id_maquina = :id_maquina",
        {
            "nome_maquina": data["nome_maquina"],
            "local": data["local"],
            "id_maquina": data["id_maquina"],
        },
    )])
    return success_response(message="Máquina atualizada com sucesso!")
