from datetime import UTC, datetime, timedelta
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.billing import Plan, Subscription
from app.models.company import Company
from app.models.enums import BillingStatus

STARTER_PLAN_CODE = "starter"
GROWTH_PLAN_CODE = "growth"
ENTERPRISE_PLAN_CODE = "enterprise"


async def seed_default_plans(db: AsyncSession) -> None:
    """Idempotent plan seeding — called from CLI only, not at runtime."""
    for plan_data in [
        {
            "code": STARTER_PLAN_CODE,
            "name": "Starter",
            "monthly_price_inr": Decimal("2999.00"),
            "annual_price_inr": Decimal("29990.00"),
            "employee_limit": 25,
            "is_contact_sales": False,
        },
        {
            "code": GROWTH_PLAN_CODE,
            "name": "Growth",
            "monthly_price_inr": Decimal("7999.00"),
            "annual_price_inr": Decimal("79990.00"),
            "employee_limit": 100,
            "is_contact_sales": False,
        },
        {
            "code": ENTERPRISE_PLAN_CODE,
            "name": "Enterprise",
            "monthly_price_inr": None,
            "annual_price_inr": None,
            "employee_limit": None,
            "is_contact_sales": True,
        },
    ]:
        exists = await db.scalar(select(Plan).where(Plan.code == plan_data["code"]))
        if exists is None:
            db.add(Plan(**plan_data))

    await db.flush()


# Keep for backward compat with CLI
async def ensure_default_plans(db: AsyncSession) -> Plan | None:
    """Deprecated: use seed_default_plans() from CLI instead."""
    return await db.scalar(select(Plan).where(Plan.code == STARTER_PLAN_CODE))


async def create_trial_subscription(db: AsyncSession, company: Company) -> Subscription:
    now = datetime.now(UTC)
    trial_ends_at = now + timedelta(days=30)

    # Look up starter plan — may be None if CLI seed hasn't run yet (graceful degradation)
    starter = await db.scalar(select(Plan).where(Plan.code == STARTER_PLAN_CODE))

    company.trial_started_at = now
    company.trial_ends_at = trial_ends_at

    subscription = Subscription(
        company_id=company.id,
        plan_id=starter.id if starter else None,
        status=BillingStatus.TRIALING,
        current_period_ends_at=trial_ends_at,
    )
    db.add(subscription)
    await db.flush()
    return subscription
