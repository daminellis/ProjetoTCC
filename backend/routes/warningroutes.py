from controllers.warningcontroller import save_warning
from controllers.warningcontroller import get_maquina

def warning(app):
    app.route('/monitores/<int:id_operador>', methods=['GET'])(get_maquina)
    app.route('/warning', methods=['POST'])(save_warning)

