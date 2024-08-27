from database.db import db

class Tecnico(db.Model):
    __tablename__ = 'tecnicos'

    id_tecnico = db.Column(db.Integer, primary_key=True, autoincrement=True)
    area_de_manutencao = db.Column(db.String(255), nullable=False)
    nome = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            'id_tecnico': self.id_tecnico,
            'area_de_manutencao': self.area_de_manutencao,
            'nome': self.nome,
            'tabela': 'tecnicos'
        }
