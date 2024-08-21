from database.db import db

class Usuario(db.Model):
    __tablename__ = 'usuarios'

    email = db.Column(db.String(50),primary_key=True, nullable=False)
    senha = db.Column(db.String(30), nullable=False)
    id_perfil = db.Column(db.Integer, nullable=False)
    nome = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            'email': self.email,
            'senha': self.senha,
            'idperfil': self.id_perfil,
            'nome': self.nome,
            'tabela': 'usuarios'
        }
