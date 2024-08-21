from flask import Flask
from flask_cors import CORS 
from database.db import db
from routes.index import default_routes

class App:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost:3301/dbbanco'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Recomenda-se definir isso como False
        db.init_app(self.app)
        default_routes(self.app)

    def run(self):
        self.app.run(port=3000, host='localhost', debug=True)

if __name__ == '__main__':
    app = App()
    app.run()
