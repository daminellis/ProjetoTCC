from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

db = SQLAlchemy()

def default_routes(app):
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:19000"] }})  # Adicione esta linha
    @app.route('/api/data', methods=['GET'])
    def get_data():
        try:
            # Substitua 'sua_tabela' pelo nome real da tabela
            query = text("SELECT * FROM sua_tabela")
            result = db.session.execute(query)

            # Obter a descrição das colunas do cursor
            column_names = [col[0] for col in result.cursor.description]

            # Criar uma lista de dicionários, um para cada linha
            data = [dict(zip(column_names, row)) for row in result.fetchall()]

            return jsonify(data)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

class App:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)  # Adicione esta linha
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost:3301/tccdb'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        db.init_app(self.app)
        default_routes(self.app)

    def run(self):
        self.app.run(port=3000, host='localhost', debug=True)

if __name__ == '__main__':
    app = App()
    app.run()
