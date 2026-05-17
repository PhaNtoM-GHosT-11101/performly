import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class CompanyCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    legal_name: str | None = Field(default=None, max_length=255)
    email_domain: str | None = Field(default=None, max_length=255)
    gstin: str | None = Field(default=None, max_length=32)
    billing_address: str | None = None


class CompanyResponse(BaseModel):
    id: uuid.UUID
    name: str
    trial_started_at: datetime | None
    trial_ends_at: datetime | None
