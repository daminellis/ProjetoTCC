from flask import Flask
from flask_cors import CORS

from config import Config
from database.db import db
from routes.index import default_routes


class App:
    def __init__(self, config: Config | None = None):
        self.config = config or Config()
        self.app = Flask(__name__)
        CORS(self.app)
        self.app.config['SQLALCHEMY_DATABASE_URI'] = self.config.database_uri
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = self.config.SQLALCHEMY_TRACK_MODIFICATIONS
        db.init_app(self.app)
        default_routes(self.app)

    def run(self):
        self.app.run(host=self.config.HOST, port=self.config.PORT, debug=self.config.DEBUG)


if __name__ == '__main__':
    app = App()
    app.run()
