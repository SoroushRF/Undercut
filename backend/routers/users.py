from fastapi import APIRouter, HTTPException, Depends, Request, Header
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timezone
from uuid import uuid4

from backend.models.user import (
    User,
    UserCreate,
    UserProfileUpdate,
    UserResponse,
)
from backend.database import get_db

# Rate Limiting
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


# ============================================================================
# TEMPORARY AUTH HELPER (Replace with Supabase JWT validation later)
# ============================================================================

async def get_current_user_id(
    x_user_id: Optional[str] = Header(None, description="Temporary: User ID header")
) -> str:
    """
    TEMPORARY: Get user ID from header.
    
    In production, this will validate the Supabase JWT token
    and extract the user ID from the token claims.
    
    For now, pass user ID via X-User-Id header for testing.
    """
    if not x_user_id:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated. Provide X-User-Id header (temporary) or JWT token.",
        )
    return x_user_id


# ============================================================================
# USER ENDPOINTS
# ============================================================================

@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user after OAuth signup.
    Called by frontend after Supabase Auth returns.
    
    Note: This should only be called once per user.
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.id == user_data.id).first()
    if existing_user:
        return existing_user

    # Create new user
    db_user = User(
        id=user_data.id,
        email=user_data.email,
        profile_complete=False,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/me", response_model=UserResponse)
@limiter.limit("60/minute")
async def get_current_user(
    request: Request,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Get the current user's profile.
    
    Returns profile_complete=false if user hasn't finished onboarding.
    Frontend should redirect to profile setup if incomplete.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/me", response_model=UserResponse)
@limiter.limit("30/minute")
async def update_current_user(
    request: Request,
    profile_update: UserProfileUpdate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Update the current user's profile.
    
    On first completion (when first_name is set), marks profile_complete=true.
    This unblocks the user from the onboarding flow.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update only provided fields
    update_data = profile_update.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(user, field, value)

    # Auto-complete profile if first_name is now set
    if user.first_name and not user.profile_complete:
        user.profile_complete = True

    user.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(user)
    return user


@router.delete("/me", status_code=204)
async def delete_current_user(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Delete the current user's account.
    
    Warning: This also deletes all saved cars for this user.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Delete user (cascade will handle saved_cars if configured)
    db.delete(user)
    db.commit()
    return None


# ============================================================================
# SAVED CARS ENDPOINTS
# ============================================================================

from backend.models.user import SavedCar, SavedCarCreate, SavedCarResponse
from backend.models.car import Car, CarResponse
from typing import List


class SavedCarWithDetails(SavedCarResponse):
    """Extended response that includes car details and status"""
    car: CarResponse


@router.post("/saved-cars/{car_id}", response_model=SavedCarResponse, status_code=201)
@limiter.limit("30/minute")
async def save_car(
    request: Request,
    car_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Save a car to user's garage.
    
    If car is already saved, returns the existing entry.
    """
    # Check if car exists
    car = db.query(Car).filter(Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")

    # Check if already saved
    existing = db.query(SavedCar).filter(
        SavedCar.user_id == user_id,
        SavedCar.car_id == car_id,
    ).first()
    
    if existing:
        return existing

    # Create saved car entry
    saved_car = SavedCar(
        id=str(uuid4()),
        user_id=user_id,
        car_id=car_id,
        saved_at=datetime.now(timezone.utc),
    )

    db.add(saved_car)
    db.commit()
    db.refresh(saved_car)
    return saved_car


@router.get("/saved-cars", response_model=List[CarResponse])
@limiter.limit("30/minute")
async def get_saved_cars(
    request: Request,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Get all cars saved by the current user.
    
    IMPORTANT: This returns cars even if they are sold/deleted.
    The frontend should check the 'status' field and show a "SOLD" badge.
    Cars with status 'sold' or 'deleted' should NOT allow clicking to details.
    """
    # Get all saved car entries for this user
    saved_entries = db.query(SavedCar).filter(SavedCar.user_id == user_id).all()
    
    if not saved_entries:
        return []

    # Get the car IDs
    car_ids = [entry.car_id for entry in saved_entries]
    
    # Fetch all cars (including sold/deleted ones)
    cars = db.query(Car).filter(Car.id.in_(car_ids)).all()
    
    return cars


@router.delete("/saved-cars/{car_id}", status_code=204)
@limiter.limit("30/minute")
async def unsave_car(
    request: Request,
    car_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Remove a car from user's saved list.
    """
    saved_entry = db.query(SavedCar).filter(
        SavedCar.user_id == user_id,
        SavedCar.car_id == car_id,
    ).first()
    
    if not saved_entry:
        raise HTTPException(status_code=404, detail="Saved car not found")

    db.delete(saved_entry)
    db.commit()
    return None
