"""add courts

Revision ID: 2cc44ef44518
Revises: 42552a1741db
Create Date: 2025-04-13 18:04:50.609621

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2cc44ef44518'
down_revision: Union[str, None] = '42552a1741db'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('court_reservations', 'date',
               existing_type=sa.VARCHAR(),
               type_=sa.Date(),
               existing_nullable=True,
               postgresql_using="date::date")
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('court_reservations', 'date',
               existing_type=sa.Date(),
               type_=sa.VARCHAR(),
               existing_nullable=True)
    # ### end Alembic commands ###
