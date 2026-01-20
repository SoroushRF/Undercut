from fastapi import APIRouter, HTTPException, Depends, Request, Header
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime
from uuid import uuid4

from backend.models.alert import (
    Alert,
    AlertCreate,
    AlertUpdate,
    AlertResponse,
)
from backend.database import get_db

# Rate Limiting
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(
    prefix="/alerts",
    tags=["alerts"],
    responses={404: {"description": "Not found"}},
)


# ============================================================================
# TEMPORARY AUTH HELPER (Same as users.py - will be centralized later)
# ============================================================================

async def get_current_user_id(
    x_user_id: Optional[str] = Header(None, description="Temporary: User ID header")
) -> str:
    """
    TEMPORARY: Get user ID from header.
    For testing, pass user ID via X-User-Id header.
    """
    if not x_user_id:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated. Provide X-User-Id header.",
        )
    return x_user_id


# ============================================================================
# ALERT ENDPOINTS
# ============================================================================

@router.post("/", response_model=AlertResponse, status_code=201)
@limiter.limit("20/minute")
async def create_alert(
    request: Request,
    alert_data: AlertCreate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Create a new sniper alert.
    
    The alert will trigger when a new car matches ALL specified criteria.
    Omit criteria fields to match "any" value for that field.
    
    Example: Alert for "Tesla Model 3 under $40k"
    ```json
    {
        "name": "Dream Tesla",
        "make": "Tesla",
        "model": "Model 3",
        "price_max": 40000
    }
    ```
    """
    # Create new alert
    db_alert = Alert(
        id=str(uuid4()),
        user_id=user_id,
        name=alert_data.name,
        make=alert_data.make,
        model=alert_data.model,
        year_min=alert_data.year_min,
        year_max=alert_data.year_max,
        price_max=alert_data.price_max,
        mileage_max=alert_data.mileage_max,
        transmission=alert_data.transmission,
        fuel_type=alert_data.fuel_type,
        drivetrain=alert_data.drivetrain,
        deal_grade_min=alert_data.deal_grade_min,
        is_active=True,
        created_at=datetime.utcnow(),
    )

    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert


@router.get("/", response_model=List[AlertResponse])
@limiter.limit("30/minute")
async def get_alerts(
    request: Request,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Get all alerts for the current user.
    
    Returns both active and paused alerts.
    """
    alerts = db.query(Alert).filter(Alert.user_id == user_id).all()
    return alerts


@router.get("/{alert_id}", response_model=AlertResponse)
@limiter.limit("30/minute")
async def get_alert(
    request: Request,
    alert_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Get a specific alert by ID.
    """
    alert = db.query(Alert).filter(
        Alert.id == alert_id,
        Alert.user_id == user_id,
    ).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    return alert


@router.patch("/{alert_id}", response_model=AlertResponse)
@limiter.limit("20/minute")
async def update_alert(
    request: Request,
    alert_id: str,
    alert_update: AlertUpdate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Update an alert's criteria or status.
    
    Use this to:
    - Pause/resume an alert (is_active)
    - Change search criteria
    - Rename the alert
    """
    alert = db.query(Alert).filter(
        Alert.id == alert_id,
        Alert.user_id == user_id,
    ).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    # Update only provided fields
    update_data = alert_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(alert, field, value)

    db.commit()
    db.refresh(alert)
    return alert


@router.delete("/{alert_id}", status_code=204)
@limiter.limit("20/minute")
async def delete_alert(
    request: Request,
    alert_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """
    Delete an alert.
    """
    alert = db.query(Alert).filter(
        Alert.id == alert_id,
        Alert.user_id == user_id,
    ).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    db.delete(alert)
    db.commit()
    return None
