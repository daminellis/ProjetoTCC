"""Testes das constantes de domínio (status de manutenção)."""
from constants import StatusManutencao


def test_valores_dos_status():
    assert StatusManutencao.ATRIBUIDO.value == "Atribuído"
    assert StatusManutencao.EM_ANDAMENTO.value == "Em andamento"
    assert StatusManutencao.FINALIZADO.value == "Finalizado"


def test_status_e_string_enum():
    # Por herdar de str, o valor pode ser usado direto em queries.
    assert StatusManutencao.FINALIZADO == "Finalizado"
