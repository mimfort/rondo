"""Merge branches

Revision ID: 34300a99e720
Revises: 488239f0ae93, update_is_active
Create Date: 2025-03-27 23:26:17.760250

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '34300a99e720'
down_revision: Union[str, None] = ('488239f0ae93', 'update_is_active')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
