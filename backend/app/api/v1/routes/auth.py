from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import Principal, get_current_principal, get_current_user
from app.core.config import settings
from app.core.security import SESSION_COOKIE_NAME, create_access_token
from app.db.session import get_db
from app.models.enums import MembershipRole, MembershipStatus
from app.models.token import RevokedToken
from app.models.user import Membership, User
from app.schemas.auth import MeResponse, MockLoginRequest, SessionResponse
from app.schemas.company import CompanyCreateRequest
from app.services.company import create_company_with_admin

router = APIRouter(prefix="/auth")


@router.post("/mock/company-login", response_model=SessionResponse)
async def mock_company_login(
    data: MockLoginRequest, response: Response, db: AsyncSession = Depends(get_db)
) -> SessionResponse:
    """Local/test only — creates or resumes a mock workspace session."""
    if settings.app_env not in {"local", "test"}:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    email = str(data.email).lower()

    # Upsert user
    user = await db.scalar(select(User).where(User.email == email))
    if user is None:
        user = User(email=email, full_name=data.full_name, last_login_at=datetime.now(UTC))
        db.add(user)
        await db.flush()
    else:
        user.full_name = data.full_name
        user.last_login_at = datetime.now(UTC)

    # Re-use existing active membership instead of creating a duplicate company
    existing_membership = await db.scalar(
        select(Membership).where(
            Membership.user_id == user.id,
            Membership.status == MembershipStatus.ACTIVE,
        )
    )

    if existing_membership is not None and not data.force_new:
        membership = existing_membership
        membership.role = data.role
        company_id = membership.company_id
    else:
        company, membership = await create_company_with_admin(
            db, owner=user, data=CompanyCreateRequest(name=data.company_name)
        )
        membership.role = data.role
        membership.status = MembershipStatus.ACTIVE
        company_id = company.id

    await db.commit()
    await db.refresh(membership)

    token = create_access_token(
        user_id=user.id,
        company_id=company_id,
        membership_id=membership.id,
        role=membership.role.value,
    )
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=settings.app_env != "local",
        samesite="lax",
        max_age=settings.access_token_expire_days * 24 * 60 * 60,
    )

    return SessionResponse(
        access_token=token,
        user_id=user.id,
        company_id=company_id,
        membership_id=membership.id,
        role=membership.role,
    )


@router.get("/me", response_model=MeResponse)
async def get_me(
    principal: Principal = Depends(get_current_principal), user: User = Depends(get_current_user)
) -> MeResponse:
    return MeResponse(
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        company_id=principal.company_id,
        membership_id=principal.membership_id,
        role=principal.role,
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    response: Response,
    principal: Principal = Depends(get_current_principal),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Revoke the JWT server-side and clear the session cookie."""
    if principal.jti:
        revoked = RevokedToken(
            jti=principal.jti,
            revoked_at=datetime.now(UTC),
            expires_at=datetime.now(UTC) + timedelta(days=settings.access_token_expire_days),
        )
        db.add(revoked)
        await db.commit()

    response.delete_cookie(
        key=SESSION_COOKIE_NAME,
        httponly=True,
        samesite="lax",
        secure=settings.app_env != "local",
    )
