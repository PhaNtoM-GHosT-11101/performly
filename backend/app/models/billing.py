import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base
from app.models.enums import BillingStatus, enum_values
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class Plan(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "plans"

    code: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    monthly_price_inr: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))
    annual_price_inr: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))
    employee_limit: Mapped[int | None] = mapped_column(Integer)
    is_contact_sales: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class Subscription(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "subscriptions"

    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), index=True
    )
    plan_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("plans.id"))
    status: Mapped[BillingStatus] = mapped_column(
        Enum(BillingStatus, values_callable=enum_values, name="billing_status"),
        default=BillingStatus.TRIALING,
        nullable=False,
    )
    razorpay_subscription_id: Mapped[str | None] = mapped_column(String(255), unique=True)
    current_period_ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    grace_ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class Payment(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "payments"

    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), index=True
    )
    subscription_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("subscriptions.id", ondelete="SET NULL")
    )
    razorpay_payment_id: Mapped[str | None] = mapped_column(String(255), unique=True)
    amount_inr: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(100), nullable=False)
    raw_payload: Mapped[dict | None] = mapped_column(JSONB)


class RazorpayWebhookEvent(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "razorpay_webhook_events"

    event_id: Mapped[str | None] = mapped_column(String(255), unique=True)
    event_type: Mapped[str] = mapped_column(String(255), nullable=False)
    processed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    raw_payload: Mapped[dict] = mapped_column(JSONB, nullable=False)
    processing_error: Mapped[str | None] = mapped_column(Text)
