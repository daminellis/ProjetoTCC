from flask import jsonify
from database.db import db
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql import text

def users_controller(id_operador):
    try:
        with db.engine.connect() as connection:
            sql = text('SELECT nome FROM operadores WHERE id_operador = :id_operador')
            result = connection.execute(sql, {'id_operador': id_operador})

            # Obter o primeiro resultado, se existir
            user = result.fetchone()

        if user:
            # user é uma tupla, então acesse pelo índice
            nome = user[0]  # Supondo que 'nome' é o primeiro e único valor retornado
            return jsonify({
                "success": True,
                "user": {
                    "id_operador": id_operador,
                    "nome": nome  # Retorna o nome do operador
                }
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": "Usuário não encontrado"
            }), 404

    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return jsonify({'error': error}), 500
