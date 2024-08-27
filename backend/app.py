from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Rota de teste que retorna "Hello, World!"
@app.route('/hello', methods=['GET'])
def hello_world():
    return jsonify(message="meu deus funciona!")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
