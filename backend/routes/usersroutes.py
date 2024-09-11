from controllers.userscontroller import users_controller

def users(app):
    app.route('/users/<int:id_operador>', methods=['GET'])(users_controller)