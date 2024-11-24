from controllers.userscontroller import users_controller
from controllers.userscontroller import users_tecnico_controller
from controllers.warningcontroller import get_nome_maquina

def users(app):
    app.route('/users/<int:id_operador>', methods=['GET'])(users_controller)
    app.route('/users/tecnicos/<int:id_tecnico>', methods=['GET'])(users_tecnico_controller)
    app.route('/users/nome_maquina/<int:id_maquina>', methods=['GET'])(get_nome_maquina)