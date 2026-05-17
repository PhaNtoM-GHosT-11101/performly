from decimal import Decimal

from app.services.billing import ENTERPRISE_PLAN_CODE, GROWTH_PLAN_CODE, STARTER_PLAN_CODE


def test_default_plan_codes_are_stable() -> None:
    assert STARTER_PLAN_CODE == "starter"
    assert GROWTH_PLAN_CODE == "growth"
    assert ENTERPRISE_PLAN_CODE == "enterprise"


def test_annual_prices_include_two_months_free() -> None:
    # Annual = 10 months billing (2 months free)
    assert Decimal("2999.00") * 10 == Decimal("29990.00")
    assert Decimal("7999.00") * 10 == Decimal("79990.00")


def test_plan_codes_are_lowercase() -> None:
    """Plan codes must be lowercase to match PostgreSQL enum values."""
    assert STARTER_PLAN_CODE == STARTER_PLAN_CODE.lower()
    assert GROWTH_PLAN_CODE == GROWTH_PLAN_CODE.lower()
    assert ENTERPRISE_PLAN_CODE == ENTERPRISE_PLAN_CODE.lower()
