from controllers.admincontroller import get_tecnicos
from controllers.admincontroller import get_operadores 

def admin(app):
    app.route('/gettecnicos', methods=['GET'])(get_tecnicos)
    app.route('/getoperadores', methods=['GET'])(get_operadores)
