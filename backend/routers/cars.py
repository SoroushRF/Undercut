from fastapi import APIRouter, HTTPException, Depends, Request
from typing import List
from uuid import uuid4
from datetime import datetime, timezone
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

    new_car_data = car.model_dump()
    
    # Convert HttpUrl types to strings for SQLite compatibility
    if "listing_url" in new_car_data and new_car_data["listing_url"]:
        new_car_data["listing_url"] = str(new_car_data["listing_url"])
    if "image_url" in new_car_data and new_car_data["image_url"]:
        new_car_data["image_url"] = str(new_car_data["image_url"])
    
    db_car = Car(**new_car_data)

    # Set System Fields
    db_car.id = str(uuid4())
    db_car.created_at = datetime.now(timezone.utc)
    db_car.last_seen_at = datetime.now(timezone.utc)
    db_car.status = "active"
    db_car.ai_verdict = "Pending Analysis"

    # --- Quant Service Integration ---
    from backend.services.quant.fmv import estimate_fair_market_value
    from backend.services.quant.deal_grader import calculate_deal_grade

    # 1. Estimate Fair Market Value
    fmv = estimate_fair_market_value(
        make=db_car.make,
        model=db_car.model,
        year=db_car.year,
        mileage=db_car.mileage,
        trim=db_car.trim,
        fuel_type=db_car.fuel_type
    )
    db_car.fair_market_value = fmv

    # 2. Calculate Deal Grade
    db_car.deal_grade = calculate_deal_grade(
        listed_price=db_car.price,
        fair_market_value=fmv
    )
    # ---------------------------------

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


@router.get("/trending", response_model=List[CarResponse])
@limiter.limit("30/minute")
async def get_trending_cars(
    request: Request,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    """
    Get trending/best deals for the landing page.
    
    Returns top S and A tier deals, ordered by:
    1. Deal grade (S first, then A)
    2. Most recently added
    
    Rate Limited: 30 requests/minute
    
    Used by: Frontend landing page "Top Deals" section
    """
    cars = (
        db.query(Car)
        .filter(Car.status == "active")
        .filter(Car.deal_grade.in_(["S", "A"]))  # Only good deals
        .order_by(
            Car.deal_grade.asc(),  # S before A
            Car.created_at.desc()  # Newest first within grade
        )
        .limit(limit)
        .all()
    )
    
    # If we don't have enough S/A deals, fill with B tier
    if len(cars) < limit:
        remaining = limit - len(cars)
        existing_ids = [c.id for c in cars]
        
        filler_cars = (
            db.query(Car)
            .filter(Car.status == "active")
            .filter(Car.deal_grade == "B")
            .filter(Car.id.notin_(existing_ids))
            .order_by(Car.created_at.desc())
            .limit(remaining)
            .all()
        )
        cars.extend(filler_cars)
    
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


# ============================================================================
# SEARCH ENDPOINT
# ============================================================================

from pydantic import BaseModel, Field
from typing import Optional


class CarSearchFilters(BaseModel):
    """
    Search filters for advanced car search.
    All fields are optional - omit to skip that filter.
    """
    # Text search
    query: Optional[str] = Field(None, description="Free text search (make, model)")
    
    # Vehicle filters
    make: Optional[str] = Field(None, description="Filter by make (e.g., Toyota)")
    model: Optional[str] = Field(None, description="Filter by model (e.g., Camry)")
    year_min: Optional[int] = Field(None, description="Minimum year", ge=1900)
    year_max: Optional[int] = Field(None, description="Maximum year", le=2030)
    
    # Price filters
    price_min: Optional[float] = Field(None, description="Minimum price", ge=0)
    price_max: Optional[float] = Field(None, description="Maximum price")
    
    # Mileage filters
    mileage_max: Optional[int] = Field(None, description="Maximum mileage (KM)", ge=0)
    
    # Spec filters
    transmission: Optional[str] = Field(None, description="automatic, manual, cvt")
    fuel_type: Optional[str] = Field(None, description="gasoline, electric, hybrid, etc.")
    drivetrain: Optional[str] = Field(None, description="fwd, rwd, awd, 4wd")
    
    # Seller filters
    seller_type: Optional[str] = Field(None, description="dealer, private")
    
    # Deal filters
    deal_grade: Optional[str] = Field(None, description="S, A, B, C, F")
    only_good_deals: Optional[bool] = Field(False, description="Only show S and A grades")
    
    # Pagination
    skip: int = Field(0, description="Number of results to skip", ge=0)
    limit: int = Field(50, description="Max results to return", ge=1, le=100)


@router.post("/search", response_model=List[CarResponse])
@limiter.limit("20/minute")  # Stricter limit for complex queries
async def search_cars(
    request: Request,
    filters: CarSearchFilters,
    db: Session = Depends(get_db),
):
    """
    Advanced car search with filters.
    
    Rate Limited: 20 requests/minute (complex query protection)
    
    Usage:
    - Send POST with JSON body containing filter criteria
    - Omit fields to skip those filters
    - Use only_good_deals=true for S/A tier deals only
    """
    query = db.query(Car).filter(Car.status == "active")

    # Free text search (make or model contains query)
    if filters.query:
        search_term = f"%{filters.query}%"
        query = query.filter(
            (Car.make.ilike(search_term)) | (Car.model.ilike(search_term))
        )

    # Make filter
    if filters.make:
        query = query.filter(Car.make.ilike(f"%{filters.make}%"))

    # Model filter
    if filters.model:
        query = query.filter(Car.model.ilike(f"%{filters.model}%"))

    # Year range
    if filters.year_min:
        query = query.filter(Car.year >= filters.year_min)
    if filters.year_max:
        query = query.filter(Car.year <= filters.year_max)

    # Price range
    if filters.price_min:
        query = query.filter(Car.price >= filters.price_min)
    if filters.price_max:
        query = query.filter(Car.price <= filters.price_max)

    # Mileage
    if filters.mileage_max:
        query = query.filter(Car.mileage <= filters.mileage_max)

    # Transmission
    if filters.transmission:
        query = query.filter(Car.transmission == filters.transmission)

    # Fuel type
    if filters.fuel_type:
        query = query.filter(Car.fuel_type == filters.fuel_type)

    # Drivetrain
    if filters.drivetrain:
        query = query.filter(Car.drivetrain == filters.drivetrain)

    # Seller type
    if filters.seller_type:
        query = query.filter(Car.seller_type == filters.seller_type)

    # Deal grade
    if filters.deal_grade:
        query = query.filter(Car.deal_grade == filters.deal_grade)
    elif filters.only_good_deals:
        query = query.filter(Car.deal_grade.in_(["S", "A"]))

    # Order by best deals first, then newest
    query = query.order_by(
        Car.deal_grade.asc(),  # S, A, B, C, F
        Car.created_at.desc()
    )

    # Pagination
    cars = query.offset(filters.skip).limit(filters.limit).all()

    return cars


# ============================================================================
# TCO ENDPOINT
# ============================================================================

class TCORequest(BaseModel):
    """Request body for TCO calculation"""
    annual_km: int = Field(15000, description="Expected annual driving distance (KM)", ge=1000, le=100000)
    fuel_price: Optional[float] = Field(None, description="Override fuel price (CAD/L)", ge=0.5, le=5.0)
    vehicle_type: str = Field("sedan", description="sedan, suv, truck, luxury, sports")


class TCOResponse(BaseModel):
    """Response for TCO calculation"""
    car_id: str
    car_title: str
    purchase_price: float
    monthly_total: float
    monthly_fuel: float
    monthly_depreciation: float
    monthly_insurance: float
    monthly_maintenance: float
    annual_total: float
    assumptions: dict


@router.post("/{car_id}/tco", response_model=TCOResponse)
@limiter.limit("30/minute")
async def calculate_car_tco(
    request: Request,
    car_id: str,
    tco_request: TCORequest,
    db: Session = Depends(get_db),
):
    """
    Calculate Total Cost of Ownership for a specific car.
    
    Returns monthly breakdown of:
    - Fuel costs (based on your annual driving)
    - Depreciation
    - Insurance estimate
    - Maintenance estimate
    
    Example:
    ```json
    {
        "annual_km": 20000,
        "vehicle_type": "sedan"
    }
    ```
    """
    from backend.services.tco import calculate_tco
    
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    # Determine fuel type
    fuel_type = car.fuel_type or "gasoline"
    
    # Calculate TCO
    result = calculate_tco(
        purchase_price=car.price,
        vehicle_year=car.year,
        annual_km=tco_request.annual_km,
        fuel_type=fuel_type,
        fuel_price=tco_request.fuel_price,
        vehicle_type=tco_request.vehicle_type,
    )
    
    return TCOResponse(
        car_id=car.id,
        car_title=f"{car.year} {car.make} {car.model}",
        purchase_price=car.price,
        monthly_total=result.monthly_total,
        monthly_fuel=result.monthly_fuel,
        monthly_depreciation=result.monthly_depreciation,
        monthly_insurance=result.monthly_insurance,
        monthly_maintenance=result.monthly_maintenance,
        annual_total=result.annual_total,
        assumptions=result.assumptions,
    )


# ============================================================================
# NEGOTIATION SCRIPT ENDPOINT
# ============================================================================

class NegotiationRequest(BaseModel):
    """Request body for negotiation script"""
    known_issues: Optional[str] = Field(None, description="Any known issues with the car")


class NegotiationResponse(BaseModel):
    """Response for negotiation script"""
    car_id: str
    car_title: str
    deal_grade: str
    listed_price: float
    fair_market_value: float
    price_difference: float
    price_difference_pct: float
    script: str
    quick_tips: list


@router.post("/{car_id}/negotiate", response_model=NegotiationResponse)
@limiter.limit("10/minute")  # Stricter limit - AI calls are expensive
async def generate_negotiation(
    request: Request,
    car_id: str,
    neg_request: NegotiationRequest = None,
    db: Session = Depends(get_db),
):
    """
    Generate a negotiation script for a specific car.
    
    Uses AI to create personalized talking points based on:
    - Price vs fair market value
    - Deal grade
    - Known issues
    
    Rate Limited: 10 requests/minute (AI cost protection)
    """
    from backend.services.ai import generate_negotiation_script, generate_quick_tips
    from backend.services.quant.fmv import estimate_fair_market_value
    
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    # Calculate FMV
    fmv = estimate_fair_market_value(
        make=car.make,
        model=car.model,
        year=car.year,
        mileage=car.mileage or 0,
        fuel_type=car.fuel_type,
    )
    
    price_diff = car.price - fmv
    price_diff_pct = (price_diff / fmv) * 100 if fmv > 0 else 0
    
    # Get issues from request or use None
    known_issues = neg_request.known_issues if neg_request else None
    
    # Generate the AI script
    script = generate_negotiation_script(
        make=car.make,
        model_name=car.model,
        year=car.year,
        listed_price=car.price,
        fair_market_value=fmv,
        mileage=car.mileage or 0,
        deal_grade=car.deal_grade or "B",
        issues=known_issues,
    )
    
    # Get quick tips (no AI, instant)
    tips = generate_quick_tips(car.deal_grade or "B", price_diff_pct)
    
    return NegotiationResponse(
        car_id=car.id,
        car_title=f"{car.year} {car.make} {car.model}",
        deal_grade=car.deal_grade or "B",
        listed_price=car.price,
        fair_market_value=round(fmv, 2),
        price_difference=round(price_diff, 2),
        price_difference_pct=round(price_diff_pct, 2),
        script=script,
        quick_tips=tips,
    )
