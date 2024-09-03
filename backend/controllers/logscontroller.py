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
            query = text("SELECT COUNT(*) FROM monitores WHERE id_maquina = :id_maquina AND id_operador = :id_operador")
            result = db.engine.execute(query, id_maquina=id_maquina, id_operador=id_operador)
            count = result.scalar()

            if count == 0:
                return jsonify({'error': 'id_maquina or id_operador does not exist in the table monitores'})


        except SQLAlchemyError as e:
            error = str(e.__dict__['orig'])
            return jsonify({'error': error})