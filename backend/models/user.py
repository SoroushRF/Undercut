from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

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

    # === Preferences (for recommendations) ===
    commute_distance_km = Column(Integer, nullable=True)  # Daily commute in KM
    family_size = Column(Integer, nullable=True)          # Number of passengers
    postal_code = Column(String, nullable=True)           # For proximity filtering
    
    # === Flexible Preferences (JSONB for future expansion) ===
    # e.g., {"preferred_fuel": "electric", "must_have_awd": true}
    preferences = Column(JSON, nullable=True, default={})

    # === Status ===
    profile_complete = Column(Boolean, default=False)  # Has completed onboarding?
    
    # === Timestamps ===
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# ============================================================================
# Pydantic Schemas (API Validation)
# ============================================================================

class UserBase(BaseModel):
    """Base user fields for creation/update"""
    first_name: Optional[str] = Field(None, description="User's first name")
    last_name: Optional[str] = Field(None, description="User's last name")
    commute_distance_km: Optional[int] = Field(None, description="Daily commute in KM", ge=0)
    family_size: Optional[int] = Field(None, description="Family/passenger count", ge=1, le=10)
    postal_code: Optional[str] = Field(None, description="Postal code for proximity")
    preferences: Optional[dict] = Field(default={}, description="Flexible preferences JSON")


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

    class Config:
        from_attributes = True


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
    saved_at = Column(DateTime, default=datetime.utcnow)
    
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

    class Config:
        from_attributes = True
