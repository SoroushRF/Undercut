from fastapi import APIRouter, HTTPException, Depends, Request
from typing import List
from uuid import uuid4
from datetime import datetime
from sqlalchemy.orm import Session

from backend.models.car import Car, CarCreate, CarResponse
from backend.database import get_db

# Rate Limiting
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

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
    Note: No rate limit - internal use only
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
    db_car.last_seen_at = datetime.utcnow()
    db_car.status = "active"
    db_car.ai_verdict = "Pending Analysis"

    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car


@router.get("/", response_model=List[CarResponse])
@limiter.limit("30/minute")  # Guest rate limit: 30 requests per minute
async def read_cars(
    request: Request,  # Required for rate limiter
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """
    Get all available cars.
    Used by: The Integrator (Frontend)
    Rate Limited: 30 requests/minute (Guest protection)
    """
    cars = db.query(Car).filter(Car.status == "active").offset(skip).limit(limit).all()
    return cars


@router.get("/{car_id}", response_model=CarResponse)
@limiter.limit("60/minute")  # Higher limit for detail views
async def read_car(request: Request, car_id: str, db: Session = Depends(get_db)):
    """
    Get a single car by ID.
    Rate Limited: 60 requests/minute
    """
    car = db.query(Car).filter(Car.id == car_id).first()
    if car is None:
        raise HTTPException(status_code=404, detail="Car not found")
    return car


@router.post("/{car_id}/analyze", response_model=CarResponse)
@limiter.limit("10/minute")  # Strict limit - AI calls are expensive
async def analyze_car(request: Request, car_id: str, db: Session = Depends(get_db)):
    """
    Trigger Gemini AI analysis for a specific car.
    Rate Limited: 10 requests/minute (AI cost protection)
    """
    from backend.services.ai import analyze_car_listing

    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")

    # Perform Analysis
    description_text = car.description if car.description else "No description provided."

    verdict = analyze_car_listing(
        make=car.make,
        model_name=car.model,
        year=car.year,
        price=car.price,
        mileage=car.mileage,
        description=description_text,
    )

    # Update DB
    car.ai_verdict = verdict
    db.commit()
    db.refresh(car)

    return car
