"""integrity constraints and token blocklist

Revision ID: 20260517_0002
Revises: 20260517_0001
Create Date: 2026-05-17

"""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "20260517_0002"
down_revision: str | None = "20260517_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # ── 1. Revoked token blocklist ──────────────────────────────────────────
    op.create_table(
        "revoked_tokens",
        sa.Column("jti", sa.String(length=64), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("revoked_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("jti", name="uq_revoked_token_jti"),
    )
    op.create_index("ix_revoked_tokens_jti", "revoked_tokens", ["jti"])

    # ── 2. GoalCycle unique name per company ────────────────────────────────
    op.create_unique_constraint(
        "uq_goal_cycle_company_name", "goal_cycles", ["company_id", "name"]
    )

    # ── 3. Goal weightage check (10 ≤ weightage ≤ 100) ─────────────────────
    op.create_check_constraint(
        "ck_goal_weightage",
        "goals",
        "weightage >= 10 AND weightage <= 100",
    )

    # ── 4. Partial unique index on invites (pending only) ───────────────────
    op.execute(
        """
        CREATE UNIQUE INDEX uq_invite_pending_company_email
        ON invites (company_id, email)
        WHERE accepted_at IS NULL
        """
    )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS uq_invite_pending_company_email")
    op.drop_constraint("ck_goal_weightage", "goals", type_="check")
    op.drop_constraint("uq_goal_cycle_company_name", "goal_cycles", type_="unique")
    op.drop_index("ix_revoked_tokens_jti", table_name="revoked_tokens")
    op.drop_table("revoked_tokens")
