"""Configuração da aplicação carregada a partir de variáveis de ambiente.

Substitui as credenciais hardcoded que ficavam no `main.py`. Os valores reais
vivem no arquivo `.env` (que não é versionado); o `.env.example` documenta as
chaves esperadas.
"""
import os

from dotenv import load_dotenv

load_dotenv()


def _as_bool(value: str) -> bool:
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


class Config:
    """Lê as configurações do ambiente, com defaults seguros para dev."""

    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "root")
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "3301")
    DB_NAME = os.getenv("DB_NAME", "tccdb")

    # debug NUNCA é ligado por default — só quando o ambiente pedir explicitamente.
    DEBUG = _as_bool(os.getenv("FLASK_DEBUG", "false"))
    HOST = os.getenv("FLASK_HOST", "0.0.0.0")
    PORT = int(os.getenv("FLASK_PORT", "5000"))

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    @property
    def database_uri(self) -> str:
        return (
            f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )
