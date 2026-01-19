from fastapi import FastAPI
from backend.routers import cars
from backend.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Undercut API")

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Allow Frontend
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods (GET, POST, etc.)
    allow_headers=["*"], # Allow all headers
)
app.include_router(cars.router)

@app.get("/")
def read_root():
    return {"message": "Undercut API - The Controller is Active"}
