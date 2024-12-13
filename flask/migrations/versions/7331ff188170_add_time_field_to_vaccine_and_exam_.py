"""Add time field to Vaccine and Exam models

Revision ID: 7331ff188170
Revises: 06c7d33971f7
Create Date: 2024-12-04 17:18:10.737656

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7331ff188170'
down_revision = '06c7d33971f7'
branch_labels = None
depends_on = None
def upgrade():
    # Adiciona a coluna 'time' com um valor padrão para evitar valores nulos
    op.add_column('vaccines', sa.Column('time', sa.Time(), nullable=True))
    op.add_column('exams', sa.Column('time', sa.Time(), nullable=True))

    # Atualiza todos os registros existentes com um valor padrão para 'time' (ex.: meio-dia)
    op.execute("UPDATE vaccines SET time = '12:00'")
    op.execute("UPDATE exams SET time = '12:00'")

    # Altera a coluna para 'NOT NULL' depois de preencher os registros existentes
    op.alter_column('vaccines', 'time', nullable=False)
    op.alter_column('exams', 'time', nullable=False)

def downgrade():
    # Remove a coluna 'time'
    op.drop_column('vaccines', 'time')
    op.drop_column('exams', 'time')
