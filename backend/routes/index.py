#  Criação basica de rota
#  from routes.nomedarota import nome da definicao
from routes.loginroutes import login
from routes.usersroutes import users
from routes.warningroutes import warning
from routes.maintenceroutes import maintence
from routes.adminroutes import admin

def default_routes(app):
    #nomde da definicao
    login(app)
    users(app)
    warning(app)
    maintence(app)
    admin(app)