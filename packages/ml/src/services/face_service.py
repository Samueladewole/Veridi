import asyncio
import base64
import io
import logging
import random
import time

from PIL import Image

logger = logging.getLogger(__name__)


class FaceService:
    """Face analysis service handling liveness detection and face matching.

    Currently uses mock/simulated responses. Designed so a real ML model
    (e.g. InsightFace, MediaPipe) can be dropped in later by replacing
    the check_liveness and match_faces implementations.
    """

    def __init__(self) -> None:
        self.model_loaded: bool = True  # Mock — would load real model here
        logger.info("FaceService initialized (mock mode)")

    async def check_liveness(self, image_b64: str) -> dict:
        """Analyze a face image for liveness indicators.

        Args:
            image_b64: Base64-encoded face image.

        Returns:
            Dict with is_live, confidence, checks, and ms fields.
        """
        start = time.time()
        logger.info("Liveness check requested")

        is_valid = self._validate_image(image_b64)

        # Simulate ML model processing time
        await asyncio.sleep(random.uniform(0.1, 0.3))

        if not is_valid:
            elapsed_ms = int((time.time() - start) * 1000)
            logger.warning("Liveness check failed: invalid image (%dms)", elapsed_ms)
            return {
                "is_live": False,
                "confidence": 0.15,
                "checks": {"error": "invalid_image"},
                "ms": elapsed_ms,
            }

        confidence = random.uniform(0.92, 0.99)
        elapsed_ms = int((time.time() - start) * 1000)
        logger.info(
            "Liveness check complete: confidence=%.4f (%dms)",
            confidence,
            elapsed_ms,
        )

        return {
            "is_live": confidence > 0.5,
            "confidence": round(confidence, 4),
            "checks": {
                "blink_detected": True,
                "texture_analysis": "pass",
                "depth_estimation": "pass",
                "motion_consistency": "pass",
            },
            "ms": elapsed_ms,
        }

    async def match_faces(
        self,
        selfie_b64: str,
        reference_b64: str | None,
    ) -> dict:
        """Compare a selfie against a reference face image.

        Args:
            selfie_b64: Base64-encoded selfie image.
            reference_b64: Base64-encoded reference image (optional).

        Returns:
            Dict with match, similarity, landmarks_detected, and ms fields.
        """
        start = time.time()
        logger.info("Face match requested")

        selfie_valid = self._validate_image(selfie_b64)
        if not selfie_valid:
            elapsed_ms = int((time.time() - start) * 1000)
            logger.warning("Face match failed: invalid selfie image (%dms)", elapsed_ms)
            return {
                "match": False,
                "similarity": 0.0,
                "landmarks_detected": 0,
                "ms": elapsed_ms,
            }

        if reference_b64 is not None:
            ref_valid = self._validate_image(reference_b64)
            if not ref_valid:
                elapsed_ms = int((time.time() - start) * 1000)
                logger.warning(
                    "Face match failed: invalid reference image (%dms)", elapsed_ms
                )
                return {
                    "match": False,
                    "similarity": 0.0,
                    "landmarks_detected": 0,
                    "ms": elapsed_ms,
                }

        # Simulate ML model processing time
        await asyncio.sleep(random.uniform(0.15, 0.35))

        similarity = random.uniform(0.88, 0.99)
        landmarks = random.randint(68, 128)
        elapsed_ms = int((time.time() - start) * 1000)
        logger.info(
            "Face match complete: similarity=%.4f landmarks=%d (%dms)",
            similarity,
            landmarks,
            elapsed_ms,
        )

        return {
            "match": similarity > 0.7,
            "similarity": round(similarity, 4),
            "landmarks_detected": landmarks,
            "ms": elapsed_ms,
        }

    def _validate_image(self, image_b64: str) -> bool:
        """Validate that a base64 string decodes to a valid image.

        Args:
            image_b64: Base64-encoded image data.

        Returns:
            True if the data decodes to a valid image, False otherwise.
        """
        try:
            data = base64.b64decode(image_b64)
            img = Image.open(io.BytesIO(data))
            img.verify()
            return True
        except Exception:
            logger.debug("Image validation failed for provided base64 data")
            return False
