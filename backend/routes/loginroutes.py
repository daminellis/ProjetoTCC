from controllers.logscontroller import logs_controller

def login(app):
    app.route('/login', methods=['POST'])(logs_controller)

