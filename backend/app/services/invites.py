import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import generate_invite_token, hash_token
from app.models.user import Invite
from app.schemas.invite import InviteCreateRequest

INVITE_EXPIRY_DAYS = 7


async def create_invite(
    db: AsyncSession,
    *,
    company_id: uuid.UUID,
    invited_by_membership_id: uuid.UUID,
    data: InviteCreateRequest,
) -> tuple[Invite, str]:
    token = generate_invite_token()
    invite = Invite(
        company_id=company_id,
        email=str(data.email).lower(),
        role=data.role,
        token_hash=hash_token(token),
        invited_by_membership_id=invited_by_membership_id,
        expires_at=datetime.now(UTC) + timedelta(days=INVITE_EXPIRY_DAYS),
    )
    db.add(invite)
    await db.flush()
    return invite, token
