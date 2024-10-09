from controllers.userscontroller import users_controller
from controllers.userscontroller import users_tecnico_controller

def users(app):
    app.route('/users/<int:id_operador>', methods=['GET'])(users_controller)
    app.route('/users/tecnicos/<int:id_tecnico>', methods=['GET'])(users_tecnico_controller)