from fastapi import FastAPI
from backend.routers import items # Example router import

app = FastAPI(title="Undercut API")

@app.get("/")
def read_root():
    return {"message": "Undercut API - The Controller is Active"}
