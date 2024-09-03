from flask import Flask
from flask_cors import CORS
from database.db import db
from routes.index import default_routes

class App:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost:3301/tccdb'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        db.init_app(self.app)
        default_routes(self.app)

    def run(self):
        self.app.run(host='0.0.0.0', port=5000, debug=True)

if __name__ == '__main__':
    app = App()
    app.run() 