from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


@router.get("/health")
async def health_check() -> dict[str, str]:
    # Do NOT expose environment name — it reveals deployment context to attackers
    return {"status": "ok", "app": settings.app_name}
