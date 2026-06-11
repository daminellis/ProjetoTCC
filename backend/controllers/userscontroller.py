"""Controllers de consulta de usuários (operador e técnico)."""
import datetime

from database.helpers import query_one
from utils.responses import error_response, handle_db_errors, success_response


def _format_horario(horario) -> str:
    if isinstance(horario, datetime.time):
        return horario.strftime("%H:%M:%S")
    return str(horario)


@handle_db_errors
def users_controller(id_operador):
    user = query_one(
        "SELECT nome, horario_de_trabalho FROM operadores WHERE id_operador = :id_operador",
        {"id_operador": id_operador},
    )
    if not user:
        return error_response("Usuário não encontrado", 404)

    return success_response(
        user={
            "id_operador": id_operador,
            "nome": user["nome"],
            "horario_de_trabalho": _format_horario(user["horario_de_trabalho"]),
        }
    )


@handle_db_errors
def users_tecnico_controller(id_tecnico):
    user = query_one(
        "SELECT nome, area_de_manutencao FROM tecnicos WHERE id_tecnico = :id_tecnico",
        {"id_tecnico": id_tecnico},
    )
    if not user:
        return error_response("Técnico não encontrado", 404)

    return success_response(
        user={
            "id_tecnico": id_tecnico,
            "nome": user["nome"],
            "especialidade": user["area_de_manutencao"],
        }
    )
