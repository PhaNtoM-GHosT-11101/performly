from enum import StrEnum


def enum_values(enum_cls: type[StrEnum]) -> list[str]:
    return [item.value for item in enum_cls]


class MembershipRole(StrEnum):
    ADMIN = "admin"
    MANAGER = "manager"
    EMPLOYEE = "employee"


class MembershipStatus(StrEnum):
    ACTIVE = "active"
    INVITED = "invited"
    DISABLED = "disabled"


class BillingStatus(StrEnum):
    TRIALING = "trialing"
    ACTIVE = "active"
    GRACE_PERIOD = "grace_period"
    READ_ONLY = "read_only"
    CANCELLED = "cancelled"


class GoalStatus(StrEnum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    LOCKED = "locked"


class GoalCycleType(StrEnum):
    ANNUAL = "annual"
    QUARTERLY = "quarterly"


class UnitOfMeasurement(StrEnum):
    MIN = "min"
    MAX = "max"
    PERCENTAGE = "percentage"
    TIMELINE = "timeline"
    ZERO = "zero"
    BOOLEAN = "boolean"
    CURRENCY = "currency"
