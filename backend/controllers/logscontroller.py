from flask import request, jsonify
from database.db import db
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql import text

def logs_controller():
    if request.method == 'POST':
        data = request.get_json()
        id_maquina = data.get('id_maquina')
        id_operador = data.get('id_operador')

        try:
            query = text("SELECT id_maquina, id_operador FROM monitores WHERE id_maquina = :id_maquina AND id_operador = :id_operador")
            result = db.session.execute(query, {'id_maquina': id_maquina, 'id_operador': id_operador})
            usuario = result.fetchone()

            if not usuario:
                return jsonify({'error': 'A senha ou usuário estão incorretos.'})

            objeto_usuario = {
                'id_maquina': usuario.id_maquina,
                'id_operador': usuario.id_operador,
            }

            return jsonify({'success': True, 'user': objeto_usuario})

        except SQLAlchemyError as e:
            error = str(e.__dict__['orig'])
            return jsonify({'error': error})
