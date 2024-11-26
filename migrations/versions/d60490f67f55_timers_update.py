"""Timers Update

Revision ID: d60490f67f55
Revises: bbf6e4bc26f5
Create Date: 2024-11-26 10:59:30.886380

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'd60490f67f55'
down_revision = 'bbf6e4bc26f5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('timer', schema=None) as batch_op:
        batch_op.alter_column('duration',
               existing_type=mysql.INTEGER(display_width=11),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('timer', schema=None) as batch_op:
        batch_op.alter_column('duration',
               existing_type=mysql.INTEGER(display_width=11),
               nullable=False)

    # ### end Alembic commands ###
