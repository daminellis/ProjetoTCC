"""Controllers de autenticação (login de operador e de técnico).

Refatorado: a senha do técnico agora é verificada via hash (`security`) em vez
de comparação em texto puro. A resposta de credencial inválida mantém HTTP 200
com `{success: False, error: ...}` para preservar o contrato que o app consome.
"""
from flask import request

from database.helpers import query_one
from security import verify_password
from utils.responses import error_response, handle_db_errors, success_response


@handle_db_errors
def logs_controller():
    data = request.get_json() or {}
    id_maquina = data.get("id_maquina")
    id_operador = data.get("id_operador")

    usuario = query_one(
        "SELECT id_maquina, id_operador FROM monitores "
        "WHERE id_maquina = :id_maquina AND id_operador = :id_operador",
        {"id_maquina": id_maquina, "id_operador": id_operador},
    )

    if not usuario:
        return error_response("A senha ou usuário estão incorretos.", 200)

    return success_response(
        user={
            "id_maquina": usuario["id_maquina"],
            "id_operador": usuario["id_operador"],
        }
    )


@handle_db_errors
def logstecnico_controller():
    data = request.get_json() or {}
    id_tecnico = data.get("id_tecnico")
    senha = data.get("senha")

    tecnico = query_one(
        "SELECT id_tecnico, nome, senha FROM tecnicos WHERE id_tecnico = :id_tecnico",
        {"id_tecnico": id_tecnico},
    )

    if not tecnico or not verify_password(tecnico.get("senha"), senha or ""):
        return error_response("A senha ou técnico estão incorretos.", 200)

    return success_response(
        user={
            "id_tecnico": tecnico["id_tecnico"],
            "nome": tecnico["nome"],
        }
    )
