"""Add Vaccine and Exam tables

Revision ID: 06c7d33971f7
Revises: c8ddb0aedb65
Create Date: 2024-12-04 16:56:18.981004

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '06c7d33971f7'
down_revision = 'c8ddb0aedb65'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('exams',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('time', sa.Time(), nullable=False),  # Adicionando o campo time
        sa.Column('pet_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['pet_id'], ['pets.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table('vaccines',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('time', sa.Time(), nullable=False),  # Adicionando o campo time
        sa.Column('pet_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['pet_id'], ['pets.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('vaccines')
    op.drop_table('exams')
    # ### end Alembic commands ###

