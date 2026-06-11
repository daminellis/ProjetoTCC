"""Controllers de ordens de serviço / manutenções.

Refatorado: usa os helpers de banco/resposta e o enum de status. A função
`get_all_Service_Orders` foi renomeada para `get_all_service_orders`
(snake_case consistente); a rota HTTP `/allserviceorders` permanece igual.
"""
from flask import request

from constants import StatusManutencao
from database.helpers import execute_write, query_all
from utils.responses import error_response, handle_db_errors, success_response


@handle_db_errors
def get_all_service_orders():
    service_orders = query_all("SELECT * FROM logs")
    if not service_orders:
        return error_response("Ordens de serviço não encontradas", 404)
    return success_response(service_orders=service_orders)


@handle_db_errors
def get_jobs_by_id(id_tecnico):
    service_order = query_all(
        "SELECT * FROM manutencoes WHERE id_tecnico = :id_tecnico",
        {"id_tecnico": id_tecnico},
    )
    if service_order:
        return success_response(service_order=service_order)
    # Mantém o contrato: lista vazia com mensagem, ainda HTTP 200.
    return success_response(
        service_order=[],
        error="Nenhuma ordem de serviço foi encontrada",
    )


@handle_db_errors
def edit_job_details(id_manutencao):
    """Atualiza detalhes da ordem de serviço, como descrição e custo."""
    data = request.get_json()
    if not isinstance(data, dict):
        return error_response("Dados inválidos.", 400)

    execute_write([(
        "UPDATE manutencoes SET descricao = :descricao, custo_de_peca = :custo_de_peca "
        "WHERE id_manutencao = :id_manutencao",
        {
            "descricao": data.get("descricao"),
            "custo_de_peca": data.get("custo_de_peca"),
            "id_manutencao": id_manutencao,
        },
    )])
    return success_response(message="Detalhes atualizados com sucesso.")


@handle_db_errors
def start_job(id_manutencao):
    """Marca a ordem de serviço como iniciada."""
    execute_write([(
        "UPDATE manutencoes SET status = :status, inicio_da_manutencao = NOW() "
        "WHERE id_manutencao = :id_manutencao",
        {"status": StatusManutencao.EM_ANDAMENTO.value, "id_manutencao": id_manutencao},
    )])
    return success_response(message="Serviço iniciado com sucesso.")


@handle_db_errors
def finish_job(id_manutencao):
    """Marca a ordem de serviço como finalizada."""
    execute_write([(
        "UPDATE manutencoes SET status = :status, termino_da_manutencao = NOW() "
        "WHERE id_manutencao = :id_manutencao",
        {"status": StatusManutencao.FINALIZADO.value, "id_manutencao": id_manutencao},
    )])
    return success_response(message="Serviço finalizado com sucesso.")
