from flask import jsonify, request
from database.db import db
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql import text
import datetime

def get_maquina(id_operador):
    try:
        with db.engine.connect() as connection:
            sql = text('SELECT id_maquina FROM monitores WHERE id_operador = :id_operador')
            result = connection.execute(sql, {'id_operador': id_operador})
            maquina = result.fetchone()

        if maquina:
            return maquina[0]  # Retorna apenas o id_maquina
        else:
            return None  # Retorna None se nenhuma máquina for encontrada

    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        print(f"Erro ao buscar máquina: {error}")
        return None

def save_warning():
    try:
        # Obtendo os dados da requisição JSON
        data = request.json
        
        # Extrair diretamente do JSON
        id_operador = data.get('id_operador')
        descricao = data.get('descricao')
        criado_em = datetime.datetime.now().isoformat()

        # Obter id_maquina chamando a função get_maquina
        id_maquina = get_maquina(id_operador)

        # Se o id_maquina for None, retorna um erro 404
        if id_maquina is None:
            return jsonify({'success': False, 'error': 'Máquina não encontrada para o operador'}), 404

        # Conectando ao banco de dados
        with db.engine.connect() as connection:
            # Inserindo o aviso na tabela warnings
            sql = text("""
                INSERT INTO logs (id_operador, id_maquina, descricao, criado_em) 
                VALUES (:id_operador, :id_maquina, :descricao, :criado_em)
            """)
            connection.execute(sql, {
                'id_operador': id_operador,
                'id_maquina': id_maquina,
                'descricao': descricao,
                'criado_em': criado_em
            })

        return jsonify({
            "success": True,
            "message": "Aviso salvo com sucesso!"
        }), 201

    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return jsonify({'error': error}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
