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
    
def update_tecnico():
    try:
        # Coleta os dados da requisição
        data = request.json
        id_tecnico = data.get('id_tecnico')
        nome = data.get('nome')
        area_de_manutencao = data.get('area_de_manutencao')
        senha = data.get('senha')

        # Verifica se todos os campos necessários estão presentes
        if not all([id_tecnico, nome, area_de_manutencao, senha]):
            return jsonify({"success": False, "error": "Dados incompletos"}), 400
        
        # Conecta ao banco de dados e executa a query de atualização

        with db.engine.connect() as connection:
            update_tecnico_sql = text("""
                UPDATE tecnicos 
                SET nome = :nome, area_de_manutencao = :area_de_manutencao, senha = :senha 
                WHERE id_tecnico = :id_tecnico
            """)
            connection.execute(update_tecnico_sql, {
                'nome': nome,
                'area_de_manutencao': area_de_manutencao,
                'senha': senha,
                'id_tecnico': id_tecnico
            })
            connection.commit()

        return jsonify({"success": True, "message": "Técnico atualizado com sucesso!"}), 200
    
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return jsonify({"success": False, "error": error}), 500
    
def delete_operador():
    try:
        # Coleta os dados da requisição
        data = request.json
        id_operador = data.get('id_operador')

        # Verifica se o id do operador foi passado
        if not id_operador:
            return jsonify({"success": False, "error": "ID do operador não foi passado"}), 400

        # Conecta ao banco de dados e executa a query de exclusão
        with db.engine.connect() as connection:
            delete_monitor_sql = text("DELETE FROM monitores WHERE id_operador = :id_operador")
            connection.execute(delete_monitor_sql, {'id_operador': id_operador})
            connection.commit()

            delete_operador_sql = text("DELETE FROM operadores WHERE id_operador = :id_operador")
            connection.execute(delete_operador_sql, {'id_operador': id_operador})
            connection.commit()

        return jsonify({"success": True, "message": "Operador deletado com sucesso!"}), 200
    
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return jsonify({"success": False, "error": error}), 500
    
def delete_tecnico():
    try:
        # Coleta os dados da requisição
        data = request.json
        id_tecnico = data.get('id_tecnico')

        # Verifica se o id do técnico foi passado
        if not id_tecnico:
            return jsonify({"success": False, "error": "ID do técnico não foi passado"}), 400

        # Conecta ao banco de dados e executa a query de exclusão
        with db.engine.connect() as connection:
            delete_tecnico_sql = text("DELETE FROM tecnicos WHERE id_tecnico = :id_tecnico")
            connection.execute(delete_tecnico_sql, {'id_tecnico': id_tecnico})
            connection.commit()

        return jsonify({"success": True, "message": "Técnico deletado com sucesso!"}), 200
    
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return jsonify({"success": False, "error": error}), 500
    
def create_operador():
    try:
        # Coleta os dados da requisição
        data = request.json
        nome = data.get('nome')
        horario_de_trabalho = data.get('horario_de_trabalho')
        id_maquina = data.get('id_maquina')

        # Verifica se todos os campos necessários estão presentes
        if not all([nome, horario_de_trabalho, id_maquina]):
            return jsonify({"success": False, "error": "Dados incompletos"}), 400

        # Conecta ao banco de dados e executa a query de inserção
        with db.engine.connect() as connection:
            insert_operador_sql = text("""
                INSERT INTO operadores (nome, horario_de_trabalho) 
                VALUES (:nome, :horario_de_trabalho)
            """)
            connection.execute(insert_operador_sql, {
                'nome': nome,
                'horario_de_trabalho': horario_de_trabalho
            })
            connection.commit()

            # Coleta o id do operador inserido
            get_operador_id_sql = text("SELECT id_operador FROM operadores WHERE nome = :nome")
            result = connection.execute(get_operador_id_sql, {'nome': nome})
            id_operador = result.fetchone()[0]

            # Insere o id do operador e a máquina associada na tabela monitores
            insert_monitor_sql = text("""
                INSERT INTO monitores (id_operador, id_maquina) 
                VALUES (:id_operador, :id_maquina)
            """)
            connection.execute(insert_monitor_sql, {
                'id_operador': id_operador,
                'id_maquina': id_maquina
            })
            connection.commit()

        return jsonify({"success": True, "message": "Operador criado com sucesso!"}), 200
    
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return jsonify({"success": False, "error": error}), 500
    
def create_tecnico():
    try:
        # Coleta os dados da requisição
        data = request.json
        nome = data.get('nome')
        area_de_manutencao = data.get('area_de_manutencao')
        senha = data.get('senha')

        # Verifica se todos os campos necessários estão presentes
        if not all([nome, area_de_manutencao, senha]):
            return jsonify({"success": False, "error": "Dados incompletos"}), 400
        
        # Conecta ao banco de dados e executa a query de inserção

        with db.engine.connect() as connection:
            insert_tecnico_sql = text("""
                INSERT INTO tecnicos (nome, area_de_manutencao, senha) 
                VALUES (:nome, :area_de_manutencao, :senha)
            """)
            connection.execute(insert_tecnico_sql, {
                'nome': nome,
                'area_de_manutencao': area_de_manutencao,
                'senha': senha
            })
            connection.commit()
        
        return jsonify({"success": True, "message": "Técnico criado com sucesso!"}), 200
    
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return jsonify({"success": False, "error": error}), 500
    
def get_all_logs():
    try:
        with db.engine.connect() as connection:
            sql = text("SELECT * FROM logs")
            result = connection.execute(sql)
            logs = result.fetchall()

        logs_lista = [
            {key: serialize_value(value) for key, value in row._mapping.items()}
            for row in logs
        ]

        if logs_lista:
            return jsonify({
                "success": True,
                "logs": logs_lista
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": "Logs não encontrados"
            }), 404
        
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return jsonify({'error': error}), 500
    
def define_logs():
    try:
        data = request.json
        id_operador = data.get('id_operador')
        id_tecnico = data.get('id_tecnico')
        id_maquina = data.get('id_maquina')
        descricao = data.get('descricao')
        id_log = data.get('id_log')
        data_criacao = data.get('data_criacao')

        status = "Atibuido"

        if not all([id_operador, id_tecnico, id_maquina, descricao, id_log, data_criacao]):
            return jsonify({"success": False, "error": "Dados incompletos"}), 400

        with db.engine.connect() as connection:
            define_logs_sql = text("""
                INSERT INTO manutencoes (id_operador, id_tecnico, id_maquina, descricao, status, data_criacao)
                VALUES (:id_operador,:id_tecnico, :id_maquina, :descricao, :status, :data_criacao)
            """)
            connection.execute(define_logs_sql, {
                'id_operador': id_operador,
                'id_tecnico': id_tecnico,
                'id_maquina': id_maquina,
                'descricao': descricao,
                'status': status,
                'data_criacao': data_criacao
            })
            connection.commit()
            
            set_status_log = text("""
                UPDATE logs SET status = :status WHERE id_log = :id_log
            """)
            connection.execute(set_status_log, {
                'id_log': id_log,
                'status': status
            })
            connection.commit()

        return jsonify({"success": True, "message": "Log definido com sucesso!"}), 200

    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return jsonify({"success": False, "error": error}), 500
