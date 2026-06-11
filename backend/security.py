"""Funções de segurança para senhas.

Antes da refatoração as senhas dos técnicos eram gravadas e comparadas em texto
puro. Aqui centralizamos o hash e a verificação usando `werkzeug.security`,
de modo que nenhum controller precise conhecer o algoritmo.
"""
from werkzeug.security import check_password_hash, generate_password_hash


def hash_password(plain_password: str) -> str:
    """Gera o hash de uma senha para armazenamento seguro.

    Usa pbkdf2:sha256 explicitamente: é seguro e, ao contrário do scrypt
    (default atual do Werkzeug), não depende do OpenSSL do runtime ter suporte
    a scrypt — garantindo portabilidade entre ambientes.
    """
    return generate_password_hash(plain_password, method="pbkdf2:sha256")


def verify_password(stored_hash: str, plain_password: str) -> bool:
    """Confere uma senha em texto puro contra o hash armazenado.

    Tolera dados legados em texto puro: se o valor guardado não for um hash
    válido do werkzeug, cai para uma comparação direta para não travar logins
    de registros antigos enquanto a base não é migrada.
    """
    if not stored_hash:
        return False
    if stored_hash.startswith(("pbkdf2:", "scrypt:")):
        return check_password_hash(stored_hash, plain_password)
    # Fallback para senhas legadas ainda em texto puro.
    return stored_hash == plain_password
