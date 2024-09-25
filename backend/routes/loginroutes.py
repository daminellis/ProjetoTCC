from controllers.logscontroller import logs_controller 
from controllers.logscontroller import logstecnico_controller

def login(app):
    app.route('/login', methods=['POST'])(logs_controller)
    app.route('/logintecnicos', methods=['POST'])(logstecnico_controller)
