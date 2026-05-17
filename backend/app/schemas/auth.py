import uuid

from pydantic import BaseModel, EmailStr, Field

from app.models.enums import MembershipRole


class MockLoginRequest(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=1, max_length=255)
    company_name: str = Field(min_length=1, max_length=255)
    role: MembershipRole = MembershipRole.ADMIN
    force_new: bool = False  # Set True to create a fresh company even if one exists


class SessionResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: uuid.UUID
    company_id: uuid.UUID
    membership_id: uuid.UUID
    role: MembershipRole


class MeResponse(BaseModel):
    user_id: uuid.UUID
    email: EmailStr
    full_name: str
    company_id: uuid.UUID
    membership_id: uuid.UUID
    role: MembershipRole
