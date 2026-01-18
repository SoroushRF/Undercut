from fastapi import FastAPI
from backend.routers import cars
from backend.database import engine, Base

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Undercut API")
app.include_router(cars.router)

@app.get("/")
def read_root():
    return {"message": "Undercut API - The Controller is Active"}
