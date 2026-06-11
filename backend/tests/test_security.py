"""Testes do módulo de segurança de senhas."""
from security import hash_password, verify_password


def test_hash_nao_e_texto_puro():
    senha = "minhaSenha123"
    hashed = hash_password(senha)
    assert hashed != senha
    assert len(hashed) > len(senha)


def test_verify_aceita_senha_correta():
    hashed = hash_password("segredo")
    assert verify_password(hashed, "segredo") is True


def test_verify_rejeita_senha_errada():
    hashed = hash_password("segredo")
    assert verify_password(hashed, "errada") is False


def test_verify_rejeita_hash_vazio():
    assert verify_password("", "qualquer") is False


def test_verify_fallback_para_senha_legada_em_texto_puro():
    # Registros antigos ainda em texto puro devem conseguir logar.
    assert verify_password("senhaAntiga", "senhaAntiga") is True
    assert verify_password("senhaAntiga", "outra") is False


def test_hashes_distintos_para_mesma_senha():
    # O salt garante hashes diferentes a cada chamada.
    assert hash_password("igual") != hash_password("igual")
