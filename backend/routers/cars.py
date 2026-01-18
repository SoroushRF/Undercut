from fastapi import APIRouter, HTTPException, Depends
from typing import List
from uuid import uuid4
from datetime import datetime
from sqlalchemy.orm import Session

from backend.models.car import Car, CarCreate, CarResponse
from backend.database import get_db

router = APIRouter(
    prefix="/cars",
    tags=["cars"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=CarResponse)
async def create_car(car: CarCreate, db: Session = Depends(get_db)):
    """
    Ingest a new car listing.
    Used by: The Hunter (Scraper)
    """
    # Check if car exists (by VIN)
    existing_car = db.query(Car).filter(Car.vin == car.vin).first()
    if existing_car:
        # For now, just return existing. Logic could update price history here.
        return existing_car

    new_car_data = car.dict()
    db_car = Car(**new_car_data)
    
    # Set System Fields
    db_car.id = str(uuid4())
    db_car.created_at = datetime.utcnow()
    db_car.ai_verdict = "Pending Analysis"
    
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car

@router.get("/", response_model=List[CarResponse])
async def read_cars(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get all available cars.
    Used by: The Integrator (Frontend)
    """
    cars = db.query(Car).offset(skip).limit(limit).all()
    return cars

@router.get("/{car_id}", response_model=CarResponse)
async def read_car(car_id: str, db: Session = Depends(get_db)):
    car = db.query(Car).filter(Car.id == car_id).first()
    if car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    return car

@router.post("/{car_id}/analyze", response_model=CarResponse)
async def analyze_car(car_id: str, db: Session = Depends(get_db)):
    """
    Trigger Gemini AI analysis for a specific car.
    """
    from backend.services.ai import analyze_car_listing

    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    # Perform Analysis
    # Note: We pass empty string if description is None to avoid errors
    description_text = car.description if car.description else "No description provided."
    
    verdict = analyze_car_listing(
        make=car.make,
        model_name=car.model,
        year=car.year,
        price=car.price,
        mileage=car.mileage,
        description=description_text
    )
    
    # Update DB
    car.ai_verdict = verdict
    db.commit()
    db.refresh(car)
    
    return car
