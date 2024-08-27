from database.db import db

class Operador(db.Model):
    __tablename__ = 'operadores'

    id_operador = db.Column(db.Integer, primary_key=True, autoincrement=True)
    horario_de_trabalho = db.Column(db.DateTime, nullable=False)
    nome = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            'id_operador': self.id_operador,
            'horario_de_trabalho': self.horario_de_trabalho.isoformat(),
            'nome': self.nome,
            'tabela': 'operadores'
        }
