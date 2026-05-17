import uuid
from dataclasses import dataclass

from fastapi import Cookie, Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import SESSION_COOKIE_NAME, decode_access_token
from app.db.session import get_db
from app.models.enums import MembershipRole, MembershipStatus
from app.models.token import RevokedToken
from app.models.user import Membership, User


@dataclass(frozen=True)
class Principal:
    user_id: uuid.UUID
    company_id: uuid.UUID
    membership_id: uuid.UUID
    role: MembershipRole
    jti: str  # JWT ID — used to revoke the token on logout


def _extract_bearer_token(authorization: str | None) -> str | None:
    if not authorization:
        return None
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None
    return token


async def get_current_principal(
    db: AsyncSession = Depends(get_db),
    authorization: str | None = Header(default=None),
    session_cookie: str | None = Cookie(default=None, alias=SESSION_COOKIE_NAME),
) -> Principal:
    token = _extract_bearer_token(authorization) or session_cookie
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    try:
        payload = decode_access_token(token)
        user_id = uuid.UUID(payload["sub"])
        company_id = uuid.UUID(payload["company_id"])
        membership_id = uuid.UUID(payload["membership_id"])
        role = MembershipRole(payload["role"])
        jti: str = payload.get("jti", "")
    except (KeyError, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session"
        ) from None

    # Check server-side token blocklist (logout invalidation)
    if jti:
        revoked = await db.scalar(select(RevokedToken).where(RevokedToken.jti == jti))
        if revoked is not None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Session has been revoked"
            )

    membership = await db.scalar(
        select(Membership).where(
            Membership.id == membership_id,
            Membership.user_id == user_id,
            Membership.company_id == company_id,
            Membership.status == MembershipStatus.ACTIVE,
        )
    )
    if membership is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive membership")

    return Principal(
        user_id=user_id,
        company_id=company_id,
        membership_id=membership_id,
        role=role,
        jti=jti,
    )


async def get_current_user(
    db: AsyncSession = Depends(get_db), principal: Principal = Depends(get_current_principal)
) -> User:
    user = await db.get(User, principal.user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def require_role(*allowed_roles: MembershipRole):
    async def dependency(principal: Principal = Depends(get_current_principal)) -> Principal:
        if principal.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions"
            )
        return principal

    return dependency
