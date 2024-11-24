from controllers.admincontroller import get_tecnicos
from controllers.admincontroller import get_operadores 
from controllers.admincontroller import get_all_machines

from controllers.admincontroller import update_operador
from controllers.admincontroller import update_tecnico
from controllers.admincontroller import update_machine

from controllers.admincontroller import delete_operador
from controllers.admincontroller import delete_tecnico
from controllers.admincontroller import delete_machine

from controllers.admincontroller import create_operador
from controllers.admincontroller import create_tecnico
from controllers.admincontroller import create_machine


from controllers.admincontroller import get_all_logs
from controllers.admincontroller import define_logs

def admin(app):
    app.route('/gettecnicos', methods=['GET'])(get_tecnicos)
    app.route('/getoperadores', methods=['GET'])(get_operadores)

    app.route('/updateoperador', methods=['PUT'])(update_operador)
    app.route('/updatetecnico', methods=['PUT'])(update_tecnico)
    
    app.route('/deleteoperador', methods=['DELETE'])(delete_operador)
    app.route('/deletetecnico', methods=['DELETE'])(delete_tecnico)
    
    app.route('/createoperador', methods=['POST'])(create_operador)
    app.route('/createtecnico', methods=['POST'])(create_tecnico)

    # rotas de gerenciamento de manutenção:

    app.route('/getalllogs', methods=['GET'])(get_all_logs)

    app.route('/definelogs', methods=['POST', 'PUT'])(define_logs)

    # rotas de gerenciamento de maquinas:

    app.route('/getallmaquinas', methods=['GET'])(get_all_machines)

    app.route('/createmaquinas', methods=['POST'])(create_machine)

    app.route('/deletemaquinas', methods=['DELETE'])(delete_machine)

    app.route('/updatemaquinas', methods=['PUT'])(update_machine)