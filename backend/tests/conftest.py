"""Configure test environment before any app imports."""

import os

import pytest

# Must be set before app.core.config is imported
os.environ.setdefault("SESSION_SECRET", "test-only-secret-that-is-at-least-32-characters")
os.environ.setdefault("APP_ENV", "test")
os.environ.setdefault(
    "DATABASE_URL", "postgresql+asyncpg://performly:performly@localhost:5432/performly"
)
