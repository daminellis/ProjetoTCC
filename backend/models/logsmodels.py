from database.db import db
class Log(db.Model):
    __tablename__ = 'logs'

    # Definição das colunas
    id_log = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_operador = db.Column(db.Integer, nullable=False)
    id_maquina = db.Column(db.Integer, db.ForeignKey('maquinas.id_maquina'), nullable=True)
    descricao = db.Column(db.Text, nullable=False)
    criado_em = db.Column(db.DateTime, default=db.func.current_timestamp(), nullable=False)
    gravidade = db.Column(db.Integer, nullable=False)  

    # Método para retornar um dicionário com os dados
    def to_dict(self):
        return {
            'id_log': self.id_log,
            'id_operador': self.id_operador,  
            'id_maquina': self.id_maquina,
            'descricao': self.descricao,
            'criado_em': self.criado_em.isoformat(),
            'gravidade': self.gravidade,  
            'tabela': 'logs' 
        }
