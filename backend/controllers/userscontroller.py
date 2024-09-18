from flask import jsonify
from database.db import db
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql import text
import datetime

def users_controller(id_operador):
    try:
        with db.engine.connect() as connection:
            sql = text('SELECT nome, horario_de_trabalho FROM operadores WHERE id_operador = :id_operador')
            result = connection.execute(sql, {'id_operador': id_operador})
            user = result.fetchone()

        if user:
            nome = user[0]  # 'nome' está no índice 0 da tupla
            horario_de_trabalho = user[1]  # 'horario_de_trabalho' está no índice 1

            # Verifique se horario_de_trabalho é uma instância de datetime.time
            if isinstance(horario_de_trabalho, datetime.time):
                # Formata o objeto 'time' como string HH:MM:SS
                horario_de_trabalho_str = horario_de_trabalho.strftime('%H:%M:%S')
            else:
                # Se não for datetime.time, trata como string padrão
                horario_de_trabalho_str = str(horario_de_trabalho)

            return jsonify({
                "success": True,
                "user": {
                    "id_operador": id_operador,
                    "nome": nome,
                    "horario_de_trabalho": horario_de_trabalho_str
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
