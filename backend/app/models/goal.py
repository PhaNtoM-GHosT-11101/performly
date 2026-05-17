import uuid
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import CheckConstraint, Date, DateTime, Enum, ForeignKey, Numeric, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base
from app.models.enums import GoalCycleType, GoalStatus, UnitOfMeasurement, enum_values
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class GoalCycle(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "goal_cycles"
    __table_args__ = (
        UniqueConstraint("company_id", "name", name="uq_goal_cycle_company_name"),
    )

    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    cycle_type: Mapped[GoalCycleType] = mapped_column(
        Enum(GoalCycleType, values_callable=enum_values, name="goal_cycle_type"), nullable=False
    )
    starts_on: Mapped[date] = mapped_column(Date, nullable=False)
    ends_on: Mapped[date] = mapped_column(Date, nullable=False)


class GoalCategory(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "goal_categories"

    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)


class Goal(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "goals"
    __table_args__ = (
        CheckConstraint("weightage >= 10 AND weightage <= 100", name="ck_goal_weightage"),
    )

    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), index=True
    )
    cycle_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("goal_cycles.id", ondelete="CASCADE"), index=True
    )
    owner_membership_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("memberships.id", ondelete="CASCADE"), index=True
    )
    category_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("goal_categories.id", ondelete="SET NULL")
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    unit_of_measurement: Mapped[UnitOfMeasurement] = mapped_column(
        Enum(UnitOfMeasurement, values_callable=enum_values, name="unit_of_measurement"),
        nullable=False,
    )
    target_value: Mapped[Decimal | None] = mapped_column(Numeric(18, 4))
    target_date: Mapped[date | None] = mapped_column(Date)
    weightage: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    status: Mapped[GoalStatus] = mapped_column(
        Enum(GoalStatus, values_callable=enum_values, name="goal_status"),
        default=GoalStatus.DRAFT,
        nullable=False,
    )
    locked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    approved_by_membership_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("memberships.id", ondelete="SET NULL")
    )


class QuarterlyWindow(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "quarterly_windows"

    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), index=True
    )
    cycle_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("goal_cycles.id", ondelete="CASCADE"), index=True
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    opens_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    closes_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
