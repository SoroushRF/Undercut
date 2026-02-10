"""
Total Cost of Ownership (TCO) Calculator

Calculates the REAL monthly cost of owning a vehicle, including:
- Fuel costs (based on annual mileage)
- Depreciation (based on age and value)
- Insurance estimate
- Maintenance estimate

This helps buyers understand the true cost beyond just the purchase price.
"""

from typing import Optional
from dataclasses import dataclass


@dataclass
class TCOResult:
    """Result of TCO calculation"""
    monthly_total: float
    monthly_fuel: float
    monthly_depreciation: float
    monthly_insurance: float
    monthly_maintenance: float
    annual_total: float
    assumptions: dict


# ============================================================================
# FUEL COST CALCULATION
# ============================================================================

# Average fuel efficiency (L/100km) by fuel type
# These are rough averages for common vehicles
FUEL_EFFICIENCY = {
    "gasoline": 9.0,       # 9L/100km
    "diesel": 7.5,         # 7.5L/100km
    "hybrid": 5.5,         # 5.5L/100km
    "plugin_hybrid": 3.0,  # 3L/100km (mostly electric)
    "electric": 0.0,       # No fuel, but uses electricity
}

# Current average fuel prices in Toronto (CAD per liter)
FUEL_PRICE_PER_LITER = 1.55  # Regular gasoline

# Electricity cost for EVs (CAD per kWh)
ELECTRICITY_PRICE_PER_KWH = 0.13

# EV efficiency (kWh per 100km)
EV_EFFICIENCY_KWH_PER_100KM = 18.0


def calculate_monthly_fuel_cost(
    annual_km: int,
    fuel_type: str = "gasoline",
    fuel_price: Optional[float] = None,
) -> float:
    """
    Calculate monthly fuel/energy cost.
    
    Args:
        annual_km: Expected annual driving distance in KM
        fuel_type: gasoline, diesel, hybrid, plugin_hybrid, electric
        fuel_price: Override fuel price (CAD/L). If None, uses default.
    
    Returns:
        Monthly fuel cost in CAD
    """
    monthly_km = annual_km / 12
    
    if fuel_type == "electric":
        # Electric vehicle: calculate electricity cost
        kwh_used = (monthly_km / 100) * EV_EFFICIENCY_KWH_PER_100KM
        return kwh_used * ELECTRICITY_PRICE_PER_KWH
    
    # Gas/hybrid vehicles
    efficiency = FUEL_EFFICIENCY.get(fuel_type.lower(), FUEL_EFFICIENCY["gasoline"])
    liters_used = (monthly_km / 100) * efficiency
    
    price = fuel_price if fuel_price else FUEL_PRICE_PER_LITER
    return liters_used * price


# ============================================================================
# DEPRECIATION CALCULATION
# ============================================================================

def calculate_monthly_depreciation(
    purchase_price: float,
    current_year: int,
    vehicle_year: int,
) -> float:
    """
    Estimate monthly depreciation.
    
    Uses a simple declining balance model:
    - Year 1: 15% depreciation
    - Year 2-5: 10% per year
    - Year 6+: 5% per year
    
    Args:
        purchase_price: What you're paying for the car
        current_year: Current calendar year
        vehicle_year: Year the car was manufactured
    
    Returns:
        Monthly depreciation in CAD
    """
    age = current_year - vehicle_year
    
    # Estimate value after 5 years of ownership
    if age == 0:
        # New car
        annual_rate = 0.15
    elif age <= 5:
        annual_rate = 0.10
    else:
        annual_rate = 0.05
    
    # Calculate expected value loss over next year
    annual_depreciation = purchase_price * annual_rate
    
    return annual_depreciation / 12


# ============================================================================
# INSURANCE ESTIMATE
# ============================================================================

# Base annual insurance rates by vehicle type (Toronto averages)
INSURANCE_BASE = {
    "sedan": 1800,
    "suv": 2000,
    "truck": 2100,
    "luxury": 2800,
    "sports": 3200,
    "electric": 2200,  # EVs often cost more to insure
}


def estimate_monthly_insurance(
    vehicle_price: float,
    fuel_type: str = "gasoline",
    vehicle_type: str = "sedan",
) -> float:
    """
    Estimate monthly insurance cost.
    
    This is a rough estimate. Actual insurance depends on:
    - Driver age, history, location
    - Specific vehicle make/model
    - Coverage level
    
    Args:
        vehicle_price: Car value
        fuel_type: For EV adjustment
        vehicle_type: sedan, suv, truck, luxury, sports
    
    Returns:
        Monthly insurance estimate in CAD
    """
    # Base rate by vehicle type
    if fuel_type == "electric":
        base = INSURANCE_BASE.get("electric", 2200)
    else:
        base = INSURANCE_BASE.get(vehicle_type.lower(), 1800)
    
    # Adjust for vehicle value (more expensive = higher insurance)
    value_factor = 1.0
    if vehicle_price > 50000:
        value_factor = 1.2
    elif vehicle_price > 75000:
        value_factor = 1.4
    elif vehicle_price > 100000:
        value_factor = 1.6
    
    annual_insurance = base * value_factor
    
    return annual_insurance / 12


# ============================================================================
# MAINTENANCE ESTIMATE
# ============================================================================

def estimate_monthly_maintenance(
    annual_km: int,
    fuel_type: str = "gasoline",
    vehicle_year: int = 2020,
) -> float:
    """
    Estimate monthly maintenance cost.
    
    Includes:
    - Oil changes (gas vehicles)
    - Tire rotation/replacement
    - Brake service
    - General repairs
    
    EVs have lower maintenance costs (no oil, less brake wear).
    
    Args:
        annual_km: Expected driving distance
        fuel_type: electric vehicles cost less to maintain
        vehicle_year: Older cars cost more to maintain
    
    Returns:
        Monthly maintenance estimate in CAD
    """
    from datetime import datetime
    current_year = datetime.now().year
    age = current_year - vehicle_year
    
    # Base cost per 1000 km
    if fuel_type == "electric":
        base_per_1000km = 15  # EVs: ~$15/1000km
    else:
        base_per_1000km = 40  # Gas: ~$40/1000km
    
    # Age multiplier (older = more expensive)
    age_multiplier = 1.0 + (age * 0.05)  # +5% per year
    age_multiplier = min(age_multiplier, 2.0)  # Cap at 2x
    
    annual_cost = (annual_km / 1000) * base_per_1000km * age_multiplier
    
    return annual_cost / 12


# ============================================================================
# MAIN TCO FUNCTION
# ============================================================================

def calculate_tco(
    purchase_price: float,
    vehicle_year: int,
    annual_km: int = 15000,
    fuel_type: str = "gasoline",
    fuel_price: Optional[float] = None,
    vehicle_type: str = "sedan",
) -> TCOResult:
    """
    Calculate Total Cost of Ownership.
    
    Args:
        purchase_price: What you're paying for the car
        vehicle_year: Year the car was manufactured
        annual_km: Expected annual driving distance (default: 15,000 km)
        fuel_type: gasoline, diesel, hybrid, plugin_hybrid, electric
        fuel_price: Override fuel price (CAD/L)
        vehicle_type: sedan, suv, truck, luxury, sports
    
    Returns:
        TCOResult with monthly breakdowns
    """
    from datetime import datetime
    current_year = datetime.now().year
    
    # Calculate each component
    monthly_fuel = calculate_monthly_fuel_cost(annual_km, fuel_type, fuel_price)
    monthly_depreciation = calculate_monthly_depreciation(purchase_price, current_year, vehicle_year)
    monthly_insurance = estimate_monthly_insurance(purchase_price, fuel_type, vehicle_type)
    monthly_maintenance = estimate_monthly_maintenance(annual_km, fuel_type, vehicle_year)
    
    # Total
    monthly_total = monthly_fuel + monthly_depreciation + monthly_insurance + monthly_maintenance
    annual_total = monthly_total * 12
    
    return TCOResult(
        monthly_total=round(monthly_total, 2),
        monthly_fuel=round(monthly_fuel, 2),
        monthly_depreciation=round(monthly_depreciation, 2),
        monthly_insurance=round(monthly_insurance, 2),
        monthly_maintenance=round(monthly_maintenance, 2),
        annual_total=round(annual_total, 2),
        assumptions={
            "annual_km": annual_km,
            "fuel_type": fuel_type,
            "fuel_price_per_liter": fuel_price or FUEL_PRICE_PER_LITER,
            "vehicle_type": vehicle_type,
            "current_year": current_year,
            "note": "Estimates only. Actual costs may vary based on driving habits, location, and vehicle condition.",
        },
    )
