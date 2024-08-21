from controllers.admcontroller import adm_controller
from controllers.admcontroller import adm_editter

def admin(app):
    app.route('/bancarios', methods=['POST','GET'])(adm_controller)
    app.route('/bancarios/<int:idbancario>', methods=['PUT', 'DELETE', 'GET'])(adm_editter)
    
