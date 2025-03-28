"""update is_active

Revision ID: update_is_active
Revises: 2fd47454f7cd
Create Date: 2024-03-23 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'update_is_active'
down_revision: str = '2fd47454f7cd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Update is_active to false for all users."""
    op.execute("UPDATE users SET is_active = false WHERE is_active = true")


def downgrade() -> None:
    """Revert is_active back to true."""
    op.execute("UPDATE users SET is_active = true WHERE is_active = false") 