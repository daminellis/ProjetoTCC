from controllers.admincontroller import get_tecnicos
from controllers.admincontroller import get_operadores 
from controllers.admincontroller import update_operador

def admin(app):
    app.route('/gettecnicos', methods=['GET'])(get_tecnicos)
    app.route('/getoperadores', methods=['GET'])(get_operadores)
    app.route('/updateoperador', methods=['PUT'])(update_operador)