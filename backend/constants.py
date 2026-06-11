"""Constantes de domínio.

Elimina as "magic strings" de status que estavam espalhadas pelos controllers
(ex.: "Atribuído", "Em andamento", "Finalizado"). Centralizar evita erros de
digitação e mantém os valores consistentes em todo o sistema.
"""
from enum import Enum


class StatusManutencao(str, Enum):
    """Status possíveis de uma ordem de serviço / manutenção."""

    ATRIBUIDO = "Atribuído"
    EM_ANDAMENTO = "Em andamento"
    FINALIZADO = "Finalizado"
