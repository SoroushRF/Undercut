"""
Alert Model

Stores user-defined search criteria for the "Sniper" feature.
When new cars are scraped, they're checked against active alerts.
If a match is found, the user is notified.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

from backend.database import Base
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean


# ============================================================================
# SQLAlchemy Model (Database Table)
# ============================================================================

class Alert(Base):
    """
    The SQLAlchemy Alert Model.
    This defines the 'alerts' table in the database.
    """
    __tablename__ = "alerts"

    # === Core Identity ===
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)  # FK to users.id

    # === Alert Name (user-defined) ===
    name = Column(String, nullable=True)  # e.g., "Dream Tesla"

    # === Search Criteria (all optional - null means "any") ===
    # Vehicle filters
    make = Column(String, nullable=True)       # e.g., "Tesla"
    model = Column(String, nullable=True)      # e.g., "Model 3"
    year_min = Column(Integer, nullable=True)  # e.g., 2020
    year_max = Column(Integer, nullable=True)  # e.g., 2024

    # Price filters
    price_max = Column(Float, nullable=True)   # e.g., 40000 (notify if below)

    # Mileage filters
    mileage_max = Column(Integer, nullable=True)  # e.g., 50000

    # Spec filters
    transmission = Column(String, nullable=True)  # automatic, manual, cvt
    fuel_type = Column(String, nullable=True)     # gasoline, electric, hybrid
    drivetrain = Column(String, nullable=True)    # fwd, rwd, awd, 4wd

    # Deal filters
    deal_grade_min = Column(String, nullable=True)  # e.g., "A" = only S or A

    # === Status ===
    is_active = Column(Boolean, default=True)  # User can pause alerts
    
    # === Timestamps ===
    created_at = Column(DateTime, default=datetime.utcnow)
    last_triggered_at = Column(DateTime, nullable=True)  # When last match found


# ============================================================================
# Pydantic Schemas (API Validation)
# ============================================================================

class AlertBase(BaseModel):
    """Base alert fields for creation/update"""
    name: Optional[str] = Field(None, description="User-friendly name for the alert")
    
    # Vehicle criteria
    make: Optional[str] = Field(None, description="Car make (e.g., Tesla)")
    model: Optional[str] = Field(None, description="Car model (e.g., Model 3)")
    year_min: Optional[int] = Field(None, description="Minimum year", ge=1900)
    year_max: Optional[int] = Field(None, description="Maximum year", le=2030)
    
    # Price criteria
    price_max: Optional[float] = Field(None, description="Maximum price to alert on", ge=0)
    
    # Mileage criteria
    mileage_max: Optional[int] = Field(None, description="Maximum mileage (KM)", ge=0)
    
    # Spec criteria
    transmission: Optional[str] = Field(None, description="automatic, manual, cvt")
    fuel_type: Optional[str] = Field(None, description="gasoline, electric, hybrid")
    drivetrain: Optional[str] = Field(None, description="fwd, rwd, awd, 4wd")
    
    # Deal criteria
    deal_grade_min: Optional[str] = Field(None, description="Minimum deal grade (S, A, B)")


class AlertCreate(AlertBase):
    """Schema for creating a new alert"""
    pass


class AlertUpdate(BaseModel):
    """Schema for updating an alert"""
    name: Optional[str] = None
    is_active: Optional[bool] = None
    make: Optional[str] = None
    model: Optional[str] = None
    year_min: Optional[int] = None
    year_max: Optional[int] = None
    price_max: Optional[float] = None
    mileage_max: Optional[int] = None
    transmission: Optional[str] = None
    fuel_type: Optional[str] = None
    drivetrain: Optional[str] = None
    deal_grade_min: Optional[str] = None


class AlertResponse(AlertBase):
    """Schema for returning alert data"""
    id: str
    user_id: str
    is_active: bool
    created_at: datetime
    last_triggered_at: Optional[datetime] = None

    class Config:
        from_attributes = True
