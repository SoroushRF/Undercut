"""
Alert Matching Service

This module checks new/updated cars against active user alerts.
Called by The Hunter (Scraper) after ingesting new listings.
"""

from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from backend.models.alert import Alert
from backend.models.car import Car


def check_alerts_for_car(car: Car, db: Session) -> List[Alert]:
    """
    Check if a car matches any active alerts.
    
    Called by The Hunter after creating/updating a car.
    
    Args:
        car: The Car object to check
        db: Database session
    
    Returns:
        List of Alert objects that match this car
    """
    # Get all active alerts
    active_alerts = db.query(Alert).filter(Alert.is_active == True).all()
    
    matching_alerts = []
    
    for alert in active_alerts:
        if _car_matches_alert(car, alert):
            matching_alerts.append(alert)
            
            # Update last_triggered_at
            alert.last_triggered_at = datetime.now(timezone.utc)
    
    # Commit the timestamp updates
    if matching_alerts:
        db.commit()
    
    return matching_alerts


def _car_matches_alert(car: Car, alert: Alert) -> bool:
    """
    Check if a single car matches an alert's criteria.
    
    Logic: Car must match ALL specified criteria.
    If a criteria is None/null, it matches any value.
    """
    # Make filter (case-insensitive partial match)
    if alert.make:
        if not car.make or alert.make.lower() not in car.make.lower():
            return False
    
    # Model filter (case-insensitive partial match)
    if alert.model:
        if not car.model or alert.model.lower() not in car.model.lower():
            return False
    
    # Year range
    if alert.year_min:
        if not car.year or car.year < alert.year_min:
            return False
    
    if alert.year_max:
        if not car.year or car.year > alert.year_max:
            return False
    
    # Price (must be at or below max)
    if alert.price_max:
        if not car.price or car.price > alert.price_max:
            return False
    
    # Mileage (must be at or below max)
    if alert.mileage_max:
        if not car.mileage or car.mileage > alert.mileage_max:
            return False
    
    # Transmission (exact match)
    if alert.transmission:
        if not car.transmission or car.transmission.lower() != alert.transmission.lower():
            return False
    
    # Fuel type (exact match)
    if alert.fuel_type:
        if not car.fuel_type or car.fuel_type.lower() != alert.fuel_type.lower():
            return False
    
    # Drivetrain (exact match)
    if alert.drivetrain:
        if not car.drivetrain or car.drivetrain.lower() != alert.drivetrain.lower():
            return False
    
    # Deal grade (must be at or better than minimum)
    if alert.deal_grade_min:
        if not car.deal_grade:
            return False
        
        grade_order = {"S": 1, "A": 2, "B": 3, "C": 4, "F": 5}
        min_order = grade_order.get(alert.deal_grade_min.upper(), 5)
        car_order = grade_order.get(car.deal_grade.upper(), 5)
        
        if car_order > min_order:
            return False
    
    # All criteria passed!
    return True


def get_alerts_for_notification(
    matching_alerts: List[Alert],
    car: Car,
) -> List[dict]:
    """
    Format matching alerts for notification.
    
    Returns a list of notification payloads ready to be sent.
    """
    notifications = []
    
    for alert in matching_alerts:
        notifications.append({
            "alert_id": alert.id,
            "user_id": alert.user_id,
            "alert_name": alert.name or "Unnamed Alert",
            "car_id": car.id,
            "car_title": f"{car.year} {car.make} {car.model}",
            "car_price": car.price,
            "car_deal_grade": car.deal_grade,
            "message": f"🎯 Match found for '{alert.name or 'your alert'}'! "
                       f"{car.year} {car.make} {car.model} at ${car.price:,.0f}",
        })
    
    return notifications
