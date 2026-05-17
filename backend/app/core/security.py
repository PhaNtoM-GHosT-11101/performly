import hashlib
import secrets
import uuid
from datetime import UTC, datetime, timedelta
from typing import Any

from jose import JWTError, jwt

from app.core.config import settings

ALGORITHM = "HS256"
SESSION_COOKIE_NAME = "performly_session"


def create_access_token(
    *, user_id: uuid.UUID, company_id: uuid.UUID, membership_id: uuid.UUID, role: str
) -> str:
    jti = str(uuid.uuid4())
    expires_at = datetime.now(UTC) + timedelta(days=settings.access_token_expire_days)
    payload: dict[str, Any] = {
        "sub": str(user_id),
        "company_id": str(company_id),
        "membership_id": str(membership_id),
        "role": role,
        "exp": expires_at,
        "jti": jti,  # JWT ID — used for server-side revocation on logout
    }
    return jwt.encode(payload, settings.session_secret, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict[str, Any]:
    try:
        return jwt.decode(token, settings.session_secret, algorithms=[ALGORITHM])
    except JWTError as exc:
        raise ValueError("Invalid session token") from exc


def generate_invite_token() -> str:
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()
