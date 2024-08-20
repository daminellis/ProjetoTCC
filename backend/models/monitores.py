from sqlalchemy import Table, Column, Integer, String, MetaData

metadata = MetaData()

users = Table(
    "monitores",
    metadata,
    Column("id_monitor", Integer, primary_key=True),
    Column("id_maquina", String(50), foreign_key=True),
    Column("id_operador", String(50), foreign_key=True),
)
