from flask import request, jsonify
from database.db import db
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql import text

def logs_controller():
    if request.method == 'POST':
        data = request.json  # Assuming JSON data is sent in the request body
        email = data.get('email')
        senha = data.get('senha')

        try:
            # Execute raw SQL to get user data with perfil name
            query = text("""
                SELECT u.nome, u.senha, p.nome as nomeperfil
                FROM dbbanco.usuarios u
                JOIN perfil p ON p.id = u.id_perfil
                WHERE u.senha = :senha AND u.email = :email  
            """)
            result = db.session.execute(query, {'email': email, 'senha': senha})
            usuario = result.fetchone()

            # verifica se a variavel usuario possui resultado
            if usuario:
                # Cria um dicionario 
                objeto_usuario  = {
                    'nomeusuario': usuario.nome,
                    'nomeperfil': usuario.nomeperfil
                }

                # retorna o objeto completo 
                return jsonify(objeto_usuario)

            # If no match is found
            return jsonify({'message': 'Conta não encontrada ou senha incorreta'}), 404

        except SQLAlchemyError as e:
            return jsonify({'message': 'Erro ao buscar usuários', 'error': str(e)}), 500

    return jsonify({'message': 'Método não permitido'}), 405
