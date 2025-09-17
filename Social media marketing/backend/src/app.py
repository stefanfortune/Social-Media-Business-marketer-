from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import content_router, webhooks
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# logging middleware
@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response: {response.status_code}")
    return response

# Include routers
app.include_router(content_router.router, prefix="/api")
app.include_router(webhooks.router, prefix="/webhook")

@app.get("/")
async def root():
    return {"message": "Business Marketing API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}