"""Configuração do pytest: garante que os módulos do backend sejam importáveis."""
import os
import sys

import pytest

# Adiciona a raiz do backend ao path para permitir `import security`, etc.
BACKEND_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)


@pytest.fixture
def app_context():
    """Contexto de aplicação Flask mínimo para testar helpers que usam jsonify."""
    from flask import Flask

    app = Flask(__name__)
    with app.app_context():
        yield app
