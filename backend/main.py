from fastapi import FastAPI

app = FastAPI(title="Undercut API")

@app.get("/")
def read_root():
    return {"message": "Undercut API is running"}
