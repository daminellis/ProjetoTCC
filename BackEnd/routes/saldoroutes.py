from controllers.saldocontroller import saldo_controller
from controllers.saldocontroller import mostrar_saldos

def saldo(app):
    app.route('/saldos', methods=['GET'])(mostrar_saldos)
    app.route('/saldos/<int:idusuario>', methods=['GET', 'PUT'])(saldo_controller)
