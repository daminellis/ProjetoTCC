from database.db import db

class Maquina(db.Model):
    __tablename__ = 'maquinas'

    id_maquina = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome_maquina = db.Column(db.String(255), nullable=False)
    local = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            'id_maquina': self.id_maquina,
            'nome_maquina': self.nome_maquina,
            'local': self.local,
            'tabela': 'maquinas'
        }
