from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime, timezone

from backend.database import Base
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, JSON


# ============================================================================
# SQLAlchemy Model (Database Table)
# ============================================================================

class User(Base):
    """
    The SQLAlchemy User Model.
    This defines the 'users' table in the database.
    
    Note: Authentication is handled by Supabase Auth.
    This table stores additional profile data.
    """
    __tablename__ = "users"

    # === Core Identity (from Supabase Auth) ===
    id = Column(String, primary_key=True, index=True)  # Supabase Auth UUID
    email = Column(String, unique=True, index=True)

    # === Profile Info ===
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    street_address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    # postal_code is used for Zip Code

    # === Preferences (for recommendations) ===
    commute_distance_km = Column(Integer, nullable=True)
    family_size = Column(Integer, nullable=True)
    postal_code = Column(String, nullable=True)           # Zip Code
    
    # === Financials ===
    annual_income = Column(Integer, nullable=True)
    buying_power = Column(Integer, nullable=True)

    # === Flexible Preferences ===
    preferences = Column(JSON, nullable=True, default={})
    preferred_body_types = Column(JSON, nullable=True, default=[])
    preferred_brands = Column(JSON, nullable=True, default=[])
    additional_instructions = Column(String, nullable=True)

    # === Status ===
    profile_complete = Column(Boolean, default=False)  # Has completed onboarding?
    
    # === Timestamps ===
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


# ============================================================================
# Pydantic Schemas (API Validation)
# ============================================================================

class UserBase(BaseModel):
    """Base user fields for creation/update"""
    first_name: Optional[str] = Field(None, description="User's first name")
    last_name: Optional[str] = Field(None, description="User's last name")
    street_address: Optional[str] = Field(None, description="Street address")
    city: Optional[str] = Field(None, description="City")
    state: Optional[str] = Field(None, description="State")
    postal_code: Optional[str] = Field(None, description="Zip/Postal code")
    
    annual_income: Optional[int] = Field(None, description="Annual income")
    buying_power: Optional[int] = Field(None, description="Buying power/budget")
    
    commute_distance_km: Optional[int] = Field(None, description="Daily commute in KM", ge=0)
    family_size: Optional[int] = Field(None, description="Family/passenger count", ge=1, le=10)
    
    preferences: Optional[dict] = Field(default={}, description="Flexible preferences JSON")
    preferred_body_types: Optional[list[str]] = Field(default=[], description="List of preferred body types")
    preferred_brands: Optional[list[str]] = Field(default=[], description="List of preferred brands")
    additional_instructions: Optional[str] = Field(None, description="Custom user instructions for recommendations")


class UserCreate(BaseModel):
    """Schema for creating a new user (after OAuth)"""
    id: str = Field(..., description="Supabase Auth UUID")
    email: EmailStr = Field(..., description="User email from OAuth")


class UserProfileUpdate(UserBase):
    """Schema for updating profile (PATCH /users/me)"""
    pass


class UserResponse(UserBase):
    """Schema for returning user data"""
    id: str
    email: str
    profile_complete: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Saved Cars Model (Junction Table)
# ============================================================================

class SavedCar(Base):
    """
    Junction table: User <-> Car (many-to-many)
    Tracks which users have saved which cars.
    """
    __tablename__ = "saved_cars"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)  # FK to users.id
    car_id = Column(String, index=True)   # FK to cars.id
    saved_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Note: When car.status becomes 'sold' or 'deleted',
    # we don't delete this row. Frontend shows "SOLD" badge.


class SavedCarCreate(BaseModel):
    """Schema for saving a car"""
    car_id: str = Field(..., description="ID of the car to save")


class SavedCarResponse(BaseModel):
    """Schema for returning saved car entry"""
    id: str
    user_id: str
    car_id: str
    saved_at: datetime

    model_config = ConfigDict(from_attributes=True)
