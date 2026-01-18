from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime

from backend.database import Base
from sqlalchemy import Column, String, Integer, Float, DateTime

class Car(Base):
    """
    The SQLAlchemy Database Model.
    This defines the 'cars' table in the database.
    """
    __tablename__ = "cars"

    id = Column(String, primary_key=True, index=True)
    vin = Column(String, index=True)
    make = Column(String, index=True)
    model = Column(String, index=True)
    year = Column(Integer)
    price = Column(Float)
    mileage = Column(Integer)
    currency = Column(String, default="USD")
    listing_url = Column(String)
    image_url = Column(String, nullable=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # AI/Quant Fields
    fair_market_value = Column(Float, nullable=True)
    deal_grade = Column(String, nullable=True)
    ai_verdict = Column(String, nullable=True)

# Pydantic Models for API validation (Request/Response schemas)
class CarBase(BaseModel):
    """
    The Core Car Schema (Pydantic). 
    Used for type checking and API docs.
    """
    vin: str = Field(..., description="Vehicle Identification Number", min_length=17, max_length=17)
    make: str = Field(..., description="Car Manufacturer (e.g., Toyota, BMW)")
    model: str = Field(..., description="Car Model (e.g., Camry, M3)")
    year: int = Field(..., description="Manufacturing Year", ge=1900, le=2026)
    price: float = Field(..., description="Listed Price")
    mileage: int = Field(..., description="Odometer reading in miles")
    currency: str = Field(default="USD", description="Currency code")
    listing_url: HttpUrl = Field(..., description="Original URL of the listing")
    image_url: Optional[HttpUrl] = Field(None, description="Main display image")
    description: Optional[str] = Field(None, description="Raw seller description")

class CarCreate(CarBase):
    pass

class CarResponse(CarBase):
    id: str
    created_at: datetime
    fair_market_value: Optional[float] = None
    deal_grade: Optional[str] = None
    ai_verdict: Optional[str] = None

    class Config:
        from_attributes = True
