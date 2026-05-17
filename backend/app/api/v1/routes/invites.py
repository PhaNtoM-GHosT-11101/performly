from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import Principal, require_role
from app.db.session import get_db
from app.models.enums import MembershipRole
from app.models.user import Invite
from app.schemas.invite import InviteCreateRequest, InviteResponse
from app.services.invites import create_invite

router = APIRouter(prefix="/invites")


@router.post("", response_model=InviteResponse, status_code=status.HTTP_201_CREATED)
async def invite_user(
    data: InviteCreateRequest,
    db: AsyncSession = Depends(get_db),
    principal: Principal = Depends(require_role(MembershipRole.ADMIN)),
) -> InviteResponse:
    # Block duplicate pending invites for the same email in this company
    existing = await db.scalar(
        select(Invite).where(
            Invite.company_id == principal.company_id,
            Invite.email == str(data.email).lower(),
            Invite.accepted_at.is_(None),
        )
    )
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A pending invite for this email already exists.",
        )

    invite, _token = await create_invite(
        db,
        company_id=principal.company_id,
        invited_by_membership_id=principal.membership_id,
        data=data,
    )
    await db.commit()
    return InviteResponse(
        id=invite.id,
        email=invite.email,
        role=invite.role,
        expires_at=invite.expires_at,
    )
