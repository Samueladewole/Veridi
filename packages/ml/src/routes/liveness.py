import logging

from fastapi import APIRouter, HTTPException, Request

from src.models.schemas import LivenessRequest, LivenessResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/v1/face", tags=["face"])


@router.post("/liveness", response_model=LivenessResponse)
async def check_liveness(
    body: LivenessRequest,
    request: Request,
) -> LivenessResponse:
    """Analyze a face image for liveness indicators.

    Validates that the submitted image contains a live person
    (not a photo of a photo, mask, or deepfake).
    """
    face_service = request.app.state.face_service

    if not body.image:
        raise HTTPException(status_code=400, detail="Image data is required")

    if not body.consent_token:
        raise HTTPException(status_code=400, detail="Consent token is required")

    try:
        result = await face_service.check_liveness(body.image)
    except Exception as exc:
        logger.error("Liveness check failed unexpectedly: %s", exc)
        raise HTTPException(
            status_code=500,
            detail="Internal error during liveness analysis",
        ) from exc

    return LivenessResponse(**result)
