from sqlalchemy.ext.asyncio import AsyncSession

from app.models.company import Company
from app.models.enums import MembershipRole, MembershipStatus
from app.models.user import Membership, User
from app.schemas.company import CompanyCreateRequest
from app.services.billing import create_trial_subscription


async def create_company_with_admin(
    db: AsyncSession, *, owner: User, data: CompanyCreateRequest
) -> tuple[Company, Membership]:
    company = Company(
        name=data.name,
        legal_name=data.legal_name,
        email_domain=data.email_domain,
        gstin=data.gstin,
        billing_address=data.billing_address,
    )
    db.add(company)
    await db.flush()

    membership = Membership(
        company_id=company.id,
        user_id=owner.id,
        role=MembershipRole.ADMIN,
        status=MembershipStatus.ACTIVE,
    )
    db.add(membership)
    await db.flush()

    await create_trial_subscription(db, company)
    return company, membership
