from fastapi import APIRouter, HTTPException, Depends, Request, Header
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
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
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
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
    update_data = profile_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(user, field, value)

    # Auto-complete profile if first_name is now set
    if user.first_name and not user.profile_complete:
        user.profile_complete = True

    user.updated_at = datetime.utcnow()

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
