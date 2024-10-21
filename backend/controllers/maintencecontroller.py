from flask import jsonify
from database.db import db
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql import text

def get_all_Service_Orders():
    try:
        with db.engine.connect() as connection:
            sql = text('SELECT * FROM logs')
            result = connection.execute(sql)
            service_orders = result.fetchall()

        # Use row._mapping to convert Row objects to dictionaries
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
