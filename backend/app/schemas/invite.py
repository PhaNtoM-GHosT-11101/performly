import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.models.enums import MembershipRole


class InviteCreateRequest(BaseModel):
    email: EmailStr
    role: MembershipRole = MembershipRole.EMPLOYEE
    manager_membership_id: uuid.UUID | None = None
    designation: str | None = Field(default=None, max_length=255)


class InviteResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    role: MembershipRole
    expires_at: datetime
    # invite_token intentionally omitted — delivered via email only
