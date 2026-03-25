import logging
import time
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from src.config import settings
from src.routes.health import router as health_router
from src.routes.liveness import router as liveness_router
from src.routes.match import router as match_router
from src.services.face_service import FaceService

logging.basicConfig(
    level=settings.LOG_LEVEL.upper(),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Initialize and tear down application resources."""
    logger.info("Starting %s v%s", settings.SERVICE_NAME, settings.VERSION)
    app.state.face_service = FaceService()
    logger.info("FaceService ready")
    yield
    logger.info("Shutting down %s", settings.SERVICE_NAME)


app = FastAPI(
    title="Veridi ML Service",
    description="Face liveness detection and face matching API for Veridi",
    version=settings.VERSION,
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log every incoming request with method, path, and duration."""
    start = time.time()
    response = await call_next(request)
    elapsed_ms = int((time.time() - start) * 1000)
    logger.info(
        "%s %s -> %d (%dms)",
        request.method,
        request.url.path,
        response.status_code,
        elapsed_ms,
    )
    return response


# Mount routers
app.include_router(health_router)
app.include_router(liveness_router)
app.include_router(match_router)
