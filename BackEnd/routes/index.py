from routes.logroutes import login
from routes.cadsroutes import cadastro
from routes.admroutes import admin
from routes.saldoroutes import saldo
from routes.userroutes import user
from routes.dinheiroroutes import dinheiro

def default_routes(app):
    login(app)
    cadastro(app)
    admin(app)
    saldo(app)
    user(app)
    dinheiro(app)