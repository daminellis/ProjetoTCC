from database.db import db

class Log(db.Model):
    __tablename__ = 'logs'

    id_log = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, nullable=False)
    id_maquina = db.Column(db.Integer, db.ForeignKey('maquinas.id_maquina'), nullable=True)
    descricao = db.Column(db.Text, nullable=False)
    criado_em = db.Column(db.DateTime, default=db.func.current_timestamp(), nullable=False)

    def to_dict(self):
        return {
            'id_log': self.id_log,
            'user_id': self.user_id,
            'id_maquina': self.id_maquina,
            'descricao': self.descricao,
            'criado_em': self.criado_em.isoformat(),
            'tabela': 'logs'
        }
