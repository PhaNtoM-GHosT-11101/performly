import uuid

import pytest

from app.core.security import (
    create_access_token,
    decode_access_token,
    generate_invite_token,
    hash_token,
)
from app.models.enums import MembershipRole


def test_access_token_round_trip() -> None:
    user_id = uuid.uuid4()
    company_id = uuid.uuid4()
    membership_id = uuid.uuid4()

    token = create_access_token(
        user_id=user_id,
        company_id=company_id,
        membership_id=membership_id,
        role=MembershipRole.ADMIN.value,
    )
    payload = decode_access_token(token)

    assert payload["sub"] == str(user_id)
    assert payload["company_id"] == str(company_id)
    assert payload["membership_id"] == str(membership_id)
    assert payload["role"] == MembershipRole.ADMIN.value


def test_access_token_contains_jti() -> None:
    """Every token must carry a jti claim for the revocation blocklist."""
    token = create_access_token(
        user_id=uuid.uuid4(),
        company_id=uuid.uuid4(),
        membership_id=uuid.uuid4(),
        role=MembershipRole.EMPLOYEE.value,
    )
    payload = decode_access_token(token)
    assert "jti" in payload
    # jti must be a valid UUID string
    uuid.UUID(payload["jti"])


def test_invalid_access_token_is_rejected() -> None:
    with pytest.raises(ValueError, match="Invalid session token"):
        decode_access_token("not-a-valid-token")


def test_invite_token_hashing_does_not_store_raw_token() -> None:
    token = generate_invite_token()
    token_hash = hash_token(token)

    assert token
    assert token_hash != token
    assert len(token_hash) == 64
    assert hash_token(token) == token_hash
