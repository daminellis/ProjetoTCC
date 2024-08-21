from database.db import db
from sqlalchemy import func

class Bancarios(db.Model):
    __tablename__ = 'bancario'

    idbancario = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(50), nullable=False)
    numero = db.Column(db.String(15), nullable=False)
    cpf = db.Column(db.String(14), nullable=False)
    nascimento = db.Column(db.Date, nullable=False)
    salario = db.Column(db.String(10,2), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    senha = db.Column(db.String(30), nullable=False)
    criado_em = db.Column(db.DateTime, default=func.now(), nullable=False)
    idperfil = db.Column(db.Integer, nullable=False, default=2)

    def to_dict(self):
        return {
            'idbancario': self.idbancario,
            'nome': self.nome,
            'numero': self.numero,
            'cpf': self.cpf,
            'nascimento': self.nascimento,
            'salario': self.salario,
            'email': self.email,
            'senha': self.senha,
            'criado_em': self.criado_em,
            'idperfil': self.idperfil
        }