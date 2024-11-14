from flask import request, jsonify
from database.db import db
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql import text
from datetime import timedelta

# Função para tratar tipos não serializáveis pelo JSON
def serialize_value(value):
    if isinstance(value, timedelta):
        # Converte timedelta para string no formato de horas, minutos e segundos
        return str(value)
    return value

def get_tecnicos():
    try:
        with db.engine.connect() as connection:
            sql = text("SELECT * FROM tecnicos")
            result = connection.execute(sql)
            tecnicos = result.fetchall()

        tecnicos_lista = [
            {key: serialize_value(value) for key, value in row._mapping.items()}
            for row in tecnicos
        ]

        if tecnicos_lista:
            return jsonify({
                "success": True,
                "tecnicos": tecnicos_lista
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": "Técnicos não encontrados"
            }), 404
        
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return jsonify({'error': error}), 500

def get_operadores():
    try:
        with db.engine.connect() as connection:
            sql = text("SELECT operadores.id_operador, operadores.horario_de_trabalho, operadores.nome, monitores.id_monitor, monitores.id_maquina FROM operadores JOIN monitores ON operadores.id_operador = monitores.id_operador")
            result = connection.execute(sql)
            operadores = result.fetchall()

        # Serializa valores não serializáveis, timedelta
        operadores_lista = [
            {key: serialize_value(value) for key, value in row._mapping.items()}
            for row in operadores
        ]

        if operadores_lista:
            return jsonify({
                "success": True,
                "operadores": operadores_lista
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": "Operadores não encontrados"
            }), 404

    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return jsonify({'error': error}), 500

def update_operador():
    try:
        # Coleta os dados da requisição
        data = request.json
        id_operador = data.get('id_operador')
        nome = data.get('nome')
        horario_de_trabalho = data.get('horario_de_trabalho')
        id_maquina = data.get('id_maquina') 

        # Verifica se todos os campos necessários estão presentes
        if not all([id_operador, nome, horario_de_trabalho, id_maquina]):
            return jsonify({"success": False, "error": "Dados incompletos"}), 400

        # Conecta ao banco de dados e executa as queries de atualização
        with db.engine.connect() as connection:
            # Atualiza os dados na tabela de operadores
            update_operador_sql = text("""
                UPDATE operadores 
                SET nome = :nome, horario_de_trabalho = :horario_de_trabalho 
                WHERE id_operador = :id_operador
            """)
            connection.execute(update_operador_sql, {
                'nome': nome,
                'horario_de_trabalho': horario_de_trabalho,
                'id_operador': id_operador
            })
            connection.commit()

            # Atualiza a máquina associada na tabela monitores
            update_monitor_sql = text("""
                UPDATE monitores 
                SET id_maquina = :id_maquina 
                WHERE id_operador = :id_operador
            """)
            connection.execute(update_monitor_sql, {
                'id_maquina': id_maquina,
                'id_operador': id_operador
            })
            connection.commit()

        return jsonify({"success": True, "message": "Operador atualizado com sucesso!"}), 200

    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return jsonify({"success": False, "error": error}), 500