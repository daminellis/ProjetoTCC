from flask import jsonify, request
from database.db import db
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql import text
import datetime

id_maquina_global = None

def get_maquina(id_operador):
    global id_maquina_global

    try:
        with db.engine.connect() as connection:
            sql = text('SELECT id_maquina FROM monitores WHERE id_operador = :id_operador')
            result = connection.execute(sql, {'id_operador': id_operador})
            maquina = result.fetchone()

        if maquina:
            id_maquina_global = maquina[0]
            return jsonify(id_maquina=id_maquina_global)
        else:
            return jsonify(message="Nenhuma máquina encontrada"), 404

    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(f"Erro ao buscar máquina: {error}")
        return jsonify(message="Erro ao buscar máquina"), 500

def save_warning():
    global id_maquina_global

    try:
        data = request.json
        id_operador = data.get('id_operador')
        descricao = data.get('descricao')
        criado_em = datetime.datetime.now().isoformat()

        if id_maquina_global is None:
            response = get_maquina(id_operador)
            return response

        with db.engine.connect() as connection:
            sql = text("""
                INSERT INTO logs (id_operador, id_maquina, descricao, criado_em) 
                VALUES (:id_operador, :id_maquina, :descricao, :criado_em)
            """)
            connection.execute(sql, {
                'id_operador': id_operador,
                'id_maquina': id_maquina_global,
                'descricao': descricao,
                'criado_em': criado_em
            })
            connection.commit() 

        return jsonify({
            "success": True,
            "message": "Aviso salvo com sucesso!"
        }), 201

    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(f"Erro ao salvar aviso: {error}")  # Log do erro
        return jsonify({'error': error}), 500
    except Exception as e:
        print(f"Erro inesperado: {str(e)}")  # Log do erro
        return jsonify({'error': str(e)}), 500
