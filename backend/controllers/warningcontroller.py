"""Controllers de avisos/alertas de máquina.

Refatorado: removida a variável global `id_maquina_global`, que era
compartilhada entre todas as requisições e causava condição de corrida /
inconsistência entre operadores. Agora a máquina vem do corpo da requisição
e, se ausente, é resolvida a partir do operador.
"""
import datetime

from flask import jsonify, request

from database.helpers import execute_write, query_all, query_one
from utils.responses import error_response, handle_db_errors, success_response


def _id_maquina_do_operador(id_operador):
    row = query_one(
        "SELECT id_maquina FROM monitores WHERE id_operador = :id_operador",
        {"id_operador": id_operador},
    )
    return row["id_maquina"] if row else None


@handle_db_errors
def get_maquina(id_operador):
    id_maquina = _id_maquina_do_operador(id_operador)
    if id_maquina is None:
        return jsonify(message="Nenhuma máquina encontrada"), 404
    # Formato dedicado consumido pelo app (response.data.id_maquina).
    return jsonify(id_maquina=id_maquina)


@handle_db_errors
def get_nome_maquina(id_maquina):
    maquina = query_one(
        "SELECT nome_maquina FROM maquinas WHERE id_maquina = :id_maquina",
        {"id_maquina": id_maquina},
    )
    if not maquina:
        return error_response("Máquina não encontrada", 404)
    return success_response(nome_maquina=maquina["nome_maquina"])


@handle_db_errors
def get_warnings():
    warnings = query_all("SELECT * FROM problemas")
    if not warnings:
        return error_response("Avisos não encontrados", 404)
    return success_response(warnings=warnings)


@handle_db_errors
def save_warning():
    data = request.json or {}
    id_operador = data.get("id_operador")
    descricao = data.get("descricao")
    gravidade = data.get("gravidade")

    # A máquina vem do corpo; se faltar, resolve a partir do operador.
    id_maquina = data.get("id_maquina") or _id_maquina_do_operador(id_operador)
    if id_maquina is None:
        return error_response("Nenhuma máquina encontrada para o operador", 404)

    criado_em = datetime.datetime.now().isoformat()
    execute_write([(
        "INSERT INTO logs (id_operador, id_maquina, descricao, criado_em, gravidade) "
        "VALUES (:id_operador, :id_maquina, :descricao, :criado_em, :gravidade)",
        {
            "id_operador": id_operador,
            "id_maquina": id_maquina,
            "descricao": descricao,
            "criado_em": criado_em,
            "gravidade": gravidade,
        },
    )])
    return success_response(201, message="Aviso salvo com sucesso!")
