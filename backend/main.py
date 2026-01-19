import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from backend.routers import cars, users
from backend.database import engine, Base
from backend.models import car, user  # Import models to register tables
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Rate Limiting
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Load environment variables
load_dotenv()

# Initialize Rate Limiter
limiter = Limiter(key_func=get_remote_address)

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Undercut API")

# Attach limiter to app state (required for SlowAPI)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Configuration (Environment-based for Dev/Prod)
# Dev: CORS_ORIGINS=http://localhost:3000
# Prod: CORS_ORIGINS=https://undercut.com,https://www.undercut.com
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(cars.router)
app.include_router(users.router)


@app.get("/")
def read_root():
    return {"message": "Undercut API - The Controller is Active"}
