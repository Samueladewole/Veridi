from fastapi import FastAPI

app = FastAPI(title="Veridi ML Service", version="0.1.0")


@app.get("/health")
async def health():
    return {"status": "ok", "service": "ml"}
