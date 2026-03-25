from pydantic import BaseModel, Field


class LivenessRequest(BaseModel):
    """Request body for face liveness detection."""

    image: str = Field(..., description="Base64-encoded face image")
    consent_token: str = Field(
        ..., description="User consent token for biometric processing"
    )


class LivenessResponse(BaseModel):
    """Response from face liveness detection."""

    is_live: bool
    confidence: float = Field(ge=0.0, le=1.0)
    checks: dict[str, str | bool]
    ms: int = Field(description="Processing time in milliseconds")


class FaceMatchRequest(BaseModel):
    """Request body for face matching between selfie and reference."""

    selfie: str = Field(..., description="Base64-encoded selfie image")
    reference_image: str | None = Field(
        default=None, description="Base64-encoded reference image"
    )
    reference_nin: str | None = Field(
        default=None,
        description="NIN to fetch reference image from government DB",
    )
    consent_token: str = Field(
        ..., description="User consent token for biometric processing"
    )


class FaceMatchResponse(BaseModel):
    """Response from face matching."""

    match: bool
    similarity: float = Field(ge=0.0, le=1.0)
    landmarks_detected: int
    ms: int = Field(description="Processing time in milliseconds")


class HealthResponse(BaseModel):
    """Health check response."""

    status: str
    service: str
    version: str
    model_loaded: bool
