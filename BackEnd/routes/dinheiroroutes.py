from controllers.dinheirocontroller import transferir_dinheiro

def dinheiro(app):
    app.route('/transferencia', methods=['POST'])(transferir_dinheiro)

