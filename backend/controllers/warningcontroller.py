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

def get_nome_maquina(id_maquina):
    try:
        with db.engine.connect() as connection:
            # SQL para buscar o nome da máquina
            sql = text('SELECT nome_maquina FROM maquinas WHERE id_maquina = :id_maquina')
            result = connection.execute(sql, {'id_maquina': id_maquina})
            nome_maquina = result.fetchone()

        if nome_maquina:
            # Retornar o nome da máquina como JSON
            return jsonify({
                "success": True,
                "nome_maquina": nome_maquina[0]
            }), 200
        else:
            # Retornar 404 caso a máquina não seja encontrada
            return jsonify({
                "success": False,
                "error": "Máquina não encontrada"
            }), 404

    except SQLAlchemyError as e:
        # Capturar erros de banco de dados e retornar mensagem de erro
        error = str(e.__dict__['orig'])
        print(f"Erro ao buscar nome da máquina: {error}")
        return jsonify({
            "success": False,
            "error": "Erro interno no servidor"
        }), 500
    
def get_warnings():
    try:
        with db.engine.connect() as connection:
            sql = text('SELECT * FROM problemas')
            result = connection.execute(sql)
            problemas = result.fetchall()

        problemas_lista = [dict(row._mapping) for row in problemas]

        if problemas_lista:
            return jsonify({
                "success": True,
                "warnings": problemas_lista
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": "Avisos não encontrados"
            }), 404

    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return jsonify({'error': error}), 500

def save_warning():
    global id_maquina_global

    try:
        data = request.json
        id_operador = data.get('id_operador')
        descricao = data.get('descricao')
        criado_em = datetime.datetime.now().isoformat()
        gravidade = data.get('gravidade')

        if id_maquina_global is None:
            response = get_maquina(id_operador)
            return response

        with db.engine.connect() as connection:
            sql = text("""
                INSERT INTO logs (id_operador, id_maquina, descricao, criado_em, gravidade) 
                VALUES (:id_operador, :id_maquina, :descricao, :criado_em, :gravidade)
            """)
            connection.execute(sql, {
                'id_operador': id_operador,
                'id_maquina': id_maquina_global,
                'descricao': descricao,
                'criado_em': criado_em,
                'gravidade': gravidade
            })
            connection.commit()

        return jsonify({
            "success": True,
            "message": "Aviso salvo com sucesso!"
        }), 201

    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(f"Erro ao salvar aviso: {error}")
        return jsonify({'error': error}), 500
    except Exception as e:
        print(f"Erro inesperado: {str(e)}")
        return jsonify({'error': str(e)}), 500
