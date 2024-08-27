from database.db import db

class Monitor(db.Model):
    __tablename__ = 'monitores'

    id_monitor = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_maquina = db.Column(db.Integer, db.ForeignKey('maquinas.id_maquina'), nullable=False)
    id_operador = db.Column(db.Integer, db.ForeignKey('operadores.id_operador'), nullable=False)

    def to_dict(self):
        return {
            'id_monitor': self.id_monitor,
            'id_maquina': self.id_maquina,
            'id_operador': self.id_operador,
            'tabela': 'monitores'
        }
