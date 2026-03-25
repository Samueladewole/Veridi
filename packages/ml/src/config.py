import os


class Settings:
    """Application settings loaded from environment variables."""

    SERVICE_NAME: str = "veridi-ml"
    VERSION: str = "0.1.0"
    HOST: str = os.getenv("ML_HOST", "0.0.0.0")
    PORT: int = int(os.getenv("ML_PORT", "8000"))
    LOG_LEVEL: str = os.getenv("ML_LOG_LEVEL", "info")

    # CORS origins allowed to call this service
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "ML_CORS_ORIGINS",
            "http://localhost:3000,http://localhost:3001,http://localhost:3002,"
            "https://veridi.io,https://dashboard.veridi.africa,https://admin.veridi.africa",
        ).split(",")
    ]

    # Model configuration (for future real model loading)
    MODEL_PATH: str = os.getenv("ML_MODEL_PATH", "")
    MODEL_DEVICE: str = os.getenv("ML_MODEL_DEVICE", "cpu")


settings = Settings()
