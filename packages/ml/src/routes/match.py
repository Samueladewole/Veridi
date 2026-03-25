import logging

from fastapi import APIRouter, HTTPException, Request

from src.models.schemas import FaceMatchRequest, FaceMatchResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/v1/face", tags=["face"])


@router.post("/match", response_model=FaceMatchResponse)
async def match_faces(
    body: FaceMatchRequest,
    request: Request,
) -> FaceMatchResponse:
    """Compare a selfie against a reference face image.

    Either reference_image (base64) or reference_nin must be provided.
    When reference_nin is provided, the reference image is fetched from
    the government identity database (not yet implemented).
    """
    face_service = request.app.state.face_service

    if not body.selfie:
        raise HTTPException(status_code=400, detail="Selfie image is required")

    if not body.consent_token:
        raise HTTPException(status_code=400, detail="Consent token is required")

    if body.reference_image is None and body.reference_nin is None:
        raise HTTPException(
            status_code=400,
            detail="Either reference_image or reference_nin must be provided",
        )

    # If NIN is provided without a reference image, we would fetch from
    # government DB. For MVP, require reference_image directly.
    if body.reference_image is None and body.reference_nin is not None:
        raise HTTPException(
            status_code=501,
            detail="NIN-based reference lookup is not yet implemented",
        )

    try:
        result = await face_service.match_faces(
            selfie_b64=body.selfie,
            reference_b64=body.reference_image,
        )
    except Exception as exc:
        logger.error("Face match failed unexpectedly: %s", exc)
        raise HTTPException(
            status_code=500,
            detail="Internal error during face matching",
        ) from exc

    return FaceMatchResponse(**result)
