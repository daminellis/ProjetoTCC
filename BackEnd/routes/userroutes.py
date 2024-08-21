from controllers.usuariocontroller import mostrar_dados
from controllers.usuariocontroller import alterar_dados
from controllers.usuariocontroller import deletar_usuario

def user(app):
    app.route('/dadosdousuario', methods=['GET'])(mostrar_dados)
    app.route('/alterardados', methods=['PUT',])(alterar_dados)
    app.route('/deletarusuario', methods=['DELETE'])(deletar_usuario)