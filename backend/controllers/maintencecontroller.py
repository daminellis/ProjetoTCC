from flask import jsonify, request
from database.db import db
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql import text

def get_all_Service_Orders():
    try:
        with db.engine.connect() as connection:
            sql = text('SELECT * FROM logs')
            result = connection.execute(sql)
            service_orders = result.fetchall()

        service_orders_list = [dict(row._mapping) for row in service_orders]

        if service_orders_list:
            return jsonify({
                "success": True,
                "service_orders": service_orders_list
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": "Ordens de serviço não encontradas"
            }), 404

    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return jsonify({'error': error}), 500

def get_jobs_by_id(id_tecnico):
    try:
        with db.engine.connect() as connection:
            sql = text('SELECT * FROM manutencoes WHERE id_tecnico = :id_tecnico')
            result = connection.execute(sql, {'id_tecnico': id_tecnico})
            service_order = result.fetchall()

        if service_order:
            service_order_list = [dict(row._mapping) for row in service_order]
            return jsonify({
                "success": True,
                "service_order": service_order_list
            }), 200
        else:
            return jsonify({
                "success": True,
                "service_order": [],
                "error": "Nenhuma ordem de serviço foi encontrada"
            }), 200

    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return jsonify({'error': error}), 500
    
def edit_jobs(id_manutencao):
    try:
        # Obtenha os dados da requisição
        data = request.get_json()
        
        # Verifique se os campos obrigatórios estão presentes
        if not data or not isinstance(data, dict):
            return jsonify({'error': 'Dados inválidos.'}), 400

        # Construa a consulta SQL
        with db.engine.connect() as connection:
            sql = text('UPDATE manutencoes SET descricao = :descricao, custo_de_peca = :custo_de_peca, '
                        'status = :status, inicio_da_manutencao = :inicio_da_manutencao, '
                        'termino_da_manutencao = :termino_da_manutencao WHERE id_manutencao = :id_manutencao')
            result = connection.execute(sql, {
                'descricao': data.get('descricao'),
                'custo_de_peca': data.get('custo_de_peca'),
                'status': data.get('status'),
                'inicio_da_manutencao': data.get('inicio_da_manutencao'),
                'termino_da_manutencao': data.get('termino_da_manutencao'),
                'id_manutencao': id_manutencao
            })
            connection.commit()

        return jsonify({'success': True, 'message': 'Ordem de serviço atualizada com sucesso.'}), 200

    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return jsonify({'error': error}), 500