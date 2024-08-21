from flask import Blueprint, request, jsonify
from database.db import db
from sqlalchemy.exc import SQLAlchemyError
from models.cadsmodel import Pessoa  
from models.logmodels import Usuario 
def mostrar_dados():
    if request.method == 'GET':
        email = request.args.get('email')

        if not email:
            return jsonify({'message': 'Email do usuário não fornecido'}), 400
        
        try:
            # Consulta no banco de dados usando SQLAlchemy ORM
            usuario = Pessoa.query.filter_by(email=email).first()

            if usuario:
                # Converte o objeto Pessoa para um dicionário usando o método to_dict()
                user_dict = usuario.to_dict()
                user_dict['back_button'] = {
                    'url': '/mostrar_dados?email=' + email,
                    'text': 'Voltar'
                }
                return jsonify(user_dict)

            return jsonify({'message': 'Usuário não encontrado'}), 404

        except SQLAlchemyError as e:
            return jsonify({'message': 'Erro ao buscar usuário', 'error': str(e)}), 500

    return jsonify({'message': 'Método não permitido'}), 405


def alterar_dados():
    if request.method == 'PUT':
        data = request.get_json()

        if not data.get('email'):
            return jsonify({'message': 'Email do usuário não fornecido'}), 400
        
        try:
            # Consulta no banco de dados usando SQLAlchemy ORM
            usuario_pessoa = Pessoa.query.filter_by(email=data['email']).first()
            usuario_usuario = Usuario.query.filter_by(email=data['email']).first()

            if not usuario_pessoa and not usuario_usuario:
                return jsonify({'message': 'Usuário não encontrado'}), 404

            # Atualiza os dados do usuário com base nos dados recebidos no JSON
            if usuario_pessoa:
                if data.get('nome'):
                    usuario_pessoa.nome = data['nome']
                if data.get('numero'):
                    usuario_pessoa.numero = data['numero']
                if data.get('cpf'):
                    usuario_pessoa.cpf = data['cpf']
                if data.get('senha'):
                    usuario_pessoa.senha = data['senha']
            
            if usuario_usuario:
                if data.get('nome'):
                    usuario_usuario.nome = data['nome']
                if data.get('senha'):
                    usuario_usuario.senha = data['senha']

            # Commit da transação
            db.session.commit()

            return jsonify({'message': 'Dados do usuário atualizados com sucesso'})

        except SQLAlchemyError as e:
            # Rollback em caso de erro
            db.session.rollback()
            return jsonify({'message': 'Erro ao atualizar usuário', 'error': str(e)}), 500

    return jsonify({'message': 'Método não permitido'}), 405

def deletar_usuario():
    if request.method == 'DELETE':
        data = request.get_json()

        if not data.get('email'):
            return jsonify({'message': 'Email do usuário não fornecido'}), 400
        
        try:
            # Consulta no banco de dados usando SQLAlchemy ORM
            usuario_pessoa = Pessoa.query.filter_by(email=data['email']).first()
            usuario_usuario = Usuario.query.filter_by(email=data['email']).first()

            if not usuario_pessoa and not usuario_usuario:
                return jsonify({'message': 'Usuário não encontrado'}), 404

            # Deleta o usuário e seus dados associados
            if usuario_pessoa:
                db.session.delete(usuario_pessoa)
            if usuario_usuario:
                db.session.delete(usuario_usuario)

            # Commit da transação
            db.session.commit()

            return jsonify({'message': 'Usuário e seus dados associados deletados com sucesso'})

        except SQLAlchemyError as e:
            # Rollback em caso de erro
            db.session.rollback()
            return jsonify({'message': 'Erro ao deletar usuário', 'error': str(e)}), 500

    return jsonify({'message': 'Método não permitido'}), 405