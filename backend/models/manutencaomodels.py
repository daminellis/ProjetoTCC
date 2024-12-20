from database.db import db

class Manutencao(db.Model):
    __tablename__ = 'manutencoes'

    id_manutencao = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_maquina = db.Column(db.Integer, db.ForeignKey('maquinas.id_maquina'), nullable=False)
    inicio_da_manutencao = db.Column(db.DateTime, nullable=False)
    termino_da_manutencao = db.Column(db.DateTime, nullable=True)
    custo_de_peca = db.Column(db.String(255), nullable=True)
    id_tecnico = db.Column(db.Integer, db.ForeignKey('tecnicos.id_tecnico'), nullable=False)
    id_operador = db.Column(db.Integer, db.ForeignKey('operadores.id_operador'), nullable=False)
    status = db.Column(db.String(255), nullable=False)
    descricao = db.Column(db.varchar(500), nullable=False)
    data_criacao = db.Column(db.DateTime, default=db.func.datetime(), nullable=False)

    def to_dict(self):
        return {
            'id_manutencao': self.id_manutencao,
            'id_maquina': self.id_maquina,
            'motivo': self.motivo,
            'inicio_da_manutencao': self.inicio_da_manutencao.isoformat(),
            'termino_da_manutencao': self.termino_da_manutencao.isoformat() if self.termino_da_manutencao else None,
            'custo_de_peca': self.custo_de_peca,
            'id_tecnico': self.id_tecnico,
            'status': self.status,
            'descricao': self.descricao,
            'data_criacao': self.data_criacao.isoformat(),
            'tabela': 'manutencoes'
        }
