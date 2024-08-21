from flask import Blueprint, request, jsonify
from database.db import db
from models.cadsmodel import Pessoa
from sqlalchemy.exc import SQLAlchemyError

transfer_bp = Blueprint('transfer', __name__)

def transferir_dinheiro():
    if request.method == 'POST':
        data = request.get_json()

        email_remetente = data.get('email_remetente')
        email_destinatario = data.get('email_destinatario')
        quantidade = data.get('quantidade')

        if not all([email_remetente, email_destinatario, quantidade]):
            return jsonify({'message': 'Dados incompletos'}), 400

        try:
            remetente = Pessoa.query.filter_by(email=email_remetente).first()
            destinatario = Pessoa.query.filter_by(email=email_destinatario).first()

            if not remetente or not destinatario:
                return jsonify({'message': 'Usuário remetente ou destinatário não encontrado'}), 404

            if remetente.transferir_dinheiro(destinatario, quantidade):
                db.session.commit()
                return jsonify({'message': 'Transferência realizada com sucesso'})
            else:
                return jsonify({'message': 'Saldo insuficiente'}), 400

        except SQLAlchemyError as e:
            db.session.rollback()
    return jsonify({'message': 'Erro ao realizar transferência', 'error': str(e)}), 500
