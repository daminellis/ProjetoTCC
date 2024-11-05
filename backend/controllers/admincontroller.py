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
