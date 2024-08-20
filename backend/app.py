from flask import Flask, jsonify, request
import psycopg2
from urllib.parse import urlparse

app = Flask(__name__)

# URL de conexão do Neon
DATABASE_URL = "postgresql://tccdb_owner:PAoa8cC2XsBV@ep-misty-bush-a51001v8.us-east-2.aws.neon.tech/tccdb?sslmode=require"

# Parse a URL de conexão
url = urlparse(DATABASE_URL)

# Configuração de conexão com o banco de dados Neon
conn = psycopg2.connect(
    host=url.hostname,
    port=url.port,
    database=url.path[1:],  # Remove a primeira barra "/"
    user=url.username,
    password=url.password,
    sslmode='require'  # Certifique-se de que o SSL está ativado
)

@app.route('/dados', methods=['GET'])
def get_dados():
    cur = conn.cursor()
    cur.execute('SELECT * FROM sua_tabela')
    rows = cur.fetchall()
    cur.close()
    return jsonify(rows)

if __name__ == '__main__':
    app.run(debug=True)
