from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, Literal
from datetime import datetime
from enum import Enum

from backend.database import Base
from sqlalchemy import Column, String, Integer, Float, DateTime

# ============================================================================
# ENUMS (For type safety and Frontend clarity)
# ============================================================================

class CarStatus(str, Enum):
    """Listing status for deleted post handling"""
    ACTIVE = "active"
    SOLD = "sold"
    DELETED = "deleted"

class DealGrade(str, Enum):
    """The Quant's deal rating"""
    S = "S"  # 10%+ below FMV (Steal)
    A = "A"  # 5-9% below FMV (Great)
    B = "B"  # At market (Fair)
    C = "C"  # Slightly overpriced
    F = "F"  # Overpriced (Avoid)

class FuelType(str, Enum):
    """For TCO Calculator"""
    GASOLINE = "gasoline"
    DIESEL = "diesel"
    ELECTRIC = "electric"
    HYBRID = "hybrid"
    PLUGIN_HYBRID = "plugin_hybrid"

class Transmission(str, Enum):
    AUTOMATIC = "automatic"
    MANUAL = "manual"
    CVT = "cvt"

class Drivetrain(str, Enum):
    FWD = "fwd"
    RWD = "rwd"
    AWD = "awd"
    FOUR_WD = "4wd"

class SellerType(str, Enum):
    DEALER = "dealer"
    PRIVATE = "private"

# ============================================================================
# SQLAlchemy Model (Database Table)
# ============================================================================

class Car(Base):
    """
    The SQLAlchemy Database Model.
    This defines the 'cars' table in the database.
    """
    __tablename__ = "cars"

    # === Core Identifiers ===
    id = Column(String, primary_key=True, index=True)
    vin = Column(String, index=True)

    # === Vehicle Info ===
    make = Column(String, index=True)
    model = Column(String, index=True)
    year = Column(Integer, index=True)
    trim = Column(String, nullable=True)  # e.g., "Sport", "Touring", "Type R"

    # === Specs (For Filtering & TCO) ===
    transmission = Column(String, nullable=True)  # automatic, manual, cvt
    fuel_type = Column(String, nullable=True)     # gasoline, electric, hybrid
    drivetrain = Column(String, nullable=True)    # fwd, rwd, awd, 4wd

    # === Pricing ===
    price = Column(Float)
    currency = Column(String, default="CAD")  # Toronto market = CAD
    mileage = Column(Integer)  # In KM

    # === Location ===
    postal_code = Column(String, nullable=True)  # For proximity filtering

    # === Seller Info ===
    seller_type = Column(String, nullable=True)  # dealer, private
    listing_url = Column(String)
    image_url = Column(String, nullable=True)

    # === Content ===
    description = Column(String, nullable=True)

    # === Timestamps ===
    created_at = Column(DateTime, default=datetime.utcnow)
    last_seen_at = Column(DateTime, nullable=True)  # When scraper last verified

    # === Status (Deleted Post Logic) ===
    status = Column(String, default="active")  # active, sold, deleted

    # === AI/Quant Fields ===
    fair_market_value = Column(Float, nullable=True)
    deal_grade = Column(String, nullable=True)  # S, A, B, C, F
    ai_verdict = Column(String, nullable=True)

# ============================================================================
# Pydantic Schemas (API Validation)
# ============================================================================

class CarBase(BaseModel):
    """
    Base schema for creating/updating cars.
    Used by The Hunter (Scraper) to ingest data.
    """
    # Core
    vin: str = Field(..., description="Vehicle Identification Number", min_length=17, max_length=17)
    make: str = Field(..., description="Manufacturer (e.g., Toyota, BMW)")
    model: str = Field(..., description="Model name (e.g., Camry, M3)")
    year: int = Field(..., description="Manufacturing year", ge=1900, le=2030)
    trim: Optional[str] = Field(None, description="Trim level (e.g., Sport, Touring)")

    # Specs
    transmission: Optional[str] = Field(None, description="automatic, manual, cvt")
    fuel_type: Optional[str] = Field(None, description="gasoline, diesel, electric, hybrid")
    drivetrain: Optional[str] = Field(None, description="fwd, rwd, awd, 4wd")

    # Pricing
    price: float = Field(..., description="Listed price")
    mileage: int = Field(..., description="Odometer reading (KM)")
    currency: str = Field(default="CAD", description="Currency code")

    # Location
    postal_code: Optional[str] = Field(None, description="Postal code for proximity")

    # Seller
    seller_type: Optional[str] = Field(None, description="dealer or private")
    listing_url: HttpUrl = Field(..., description="Original listing URL")
    image_url: Optional[HttpUrl] = Field(None, description="Main display image")

    # Content
    description: Optional[str] = Field(None, description="Raw seller description")


class CarCreate(CarBase):
    """Schema for creating a new car (from Scraper)"""
    pass


class CarResponse(CarBase):
    """
    Schema for reading a car (API Response).
    Includes all computed and system fields.
    """
    # System Fields
    id: str
    created_at: datetime
    last_seen_at: Optional[datetime] = None
    status: str = "active"  # active, sold, deleted

    # AI/Quant Fields
    fair_market_value: Optional[float] = None
    deal_grade: Optional[str] = None  # S, A, B, C, F
    ai_verdict: Optional[str] = None

    class Config:
        from_attributes = True
