from flask import Flask, request, jsonify
from database.db import db
from models.cadsmodel import Pessoa

def mostrar_saldos(idusuario=None):
    if request.method == 'GET':
        try:
            pessoas = Pessoa.query.all()
            return jsonify([pessoas.to_dict() for pessoas in pessoas]), 200
        except Exception as e:
            return jsonify({'error': 'Erro ao buscar saldos: {}'.format(str(e))}), 400

def saldo_controller(idusuario=None):
    if request.method == 'PUT':
        try:
            data = request.get_json()
            pessoa = Pessoa.query.get_or_404(idusuario)

            # Atualizar o campo dinheiroguardado
            pessoa.dinheiroguardado = data.get('dinheiroguardado', pessoa.dinheiroguardado)

            db.session.commit()
            return jsonify(pessoa.to_dict()), 200
        except Exception as e:
            return jsonify({'error': 'Erro ao atualizar saldo: {}'.format(str(e))}), 400

    elif request.method == 'GET':
        if idusuario:
            try:
                pessoa = Pessoa.query.get_or_404(idusuario)
                return jsonify(pessoa.to_dict()), 200
            except Exception as e:
                return jsonify({'error': 'Pessoa não encontrada'}), 404
        else:
            try:
                pessoas = Pessoa.query.all()
                return jsonify([pessoa.to_dict() for pessoa in pessoas]), 200
            except Exception as e:
                return jsonify({'error': 'Erro ao buscar pessoas: {}'.format(str(e))}), 400

    else:
        return jsonify({'error': 'Método HTTP não suportado'}), 405
