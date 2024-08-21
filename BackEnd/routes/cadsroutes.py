from controllers.cadscontroller import cads_controller

def cadastro(app):
    app.route('/cads', methods=['POST'])(cads_controller)

