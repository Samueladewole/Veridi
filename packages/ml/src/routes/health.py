from fastapi import APIRouter, Request

from src.config import settings
from src.models.schemas import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health(request: Request) -> HealthResponse:
    """Return service health status and metadata."""
    face_service = request.app.state.face_service
    return HealthResponse(
        status="ok",
        service=settings.SERVICE_NAME,
        version=settings.VERSION,
        model_loaded=face_service.model_loaded,
    )
