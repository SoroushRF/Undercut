"""
Fair Market Value (FMV) Estimation

This module estimates what a car SHOULD be worth based on:
- Make, Model, Year, Trim
- Mileage
- Market comparables

In production, this would query a market database or external API.
For now, it uses a simple depreciation formula.
"""

from typing import Optional


def estimate_fair_market_value(
    make: str,
    model: str,
    year: int,
    mileage: int,
    trim: Optional[str] = None,
    fuel_type: Optional[str] = None,
) -> float:
    """
    Estimate the Fair Market Value (FMV) of a vehicle.
    
    This is a PLACEHOLDER algorithm. In production, this would:
    1. Query a database of recent sales
    2. Call an external API (like Black Book or Canadian Black Book)
    3. Use ML model trained on historical data
    
    Current Formula (Simple Depreciation):
    - Base MSRP lookup (hardcoded for common models)
    - 15% first year depreciation
    - 10% per year after that
    - $0.05 per KM penalty above average
    - Premium for electric vehicles
    
    Returns:
        Estimated FMV in CAD
    """
    # Average KM per year for Toronto market
    AVERAGE_KM_PER_YEAR = 15000
    
    # Current year for age calculation
    from datetime import datetime
    current_year = datetime.now().year
    age = current_year - year
    
    # Base MSRP lookup (simplified - would be a real database)
    base_msrp = _get_base_msrp(make, model, trim)
    
    # Calculate depreciation
    if age <= 0:
        depreciation_rate = 1.0  # New car
    elif age == 1:
        depreciation_rate = 0.85  # 15% first year
    else:
        # 15% first year, then 10% per year
        depreciation_rate = 0.85 * (0.90 ** (age - 1))
    
    depreciated_value = base_msrp * depreciation_rate
    
    # Mileage adjustment
    expected_km = age * AVERAGE_KM_PER_YEAR
    excess_km = max(0, mileage - expected_km)
    mileage_penalty = excess_km * 0.05  # $0.05 per excess KM
    
    # Fuel type premium
    fuel_premium = 0
    if fuel_type == "electric":
        fuel_premium = 3000  # EVs hold value better
    elif fuel_type == "hybrid" or fuel_type == "plugin_hybrid":
        fuel_premium = 1500
    
    # Final FMV
    fmv = depreciated_value - mileage_penalty + fuel_premium
    
    # Floor at 10% of MSRP (cars have scrap value)
    fmv = max(fmv, base_msrp * 0.10)
    
    return round(fmv, 2)


def _get_base_msrp(make: str, model: str, trim: Optional[str] = None) -> float:
    """
    Lookup base MSRP for a vehicle.
    
    PLACEHOLDER: In production, this would query a real database.
    These are rough CAD MSRP values for common vehicles.
    """
    # Simplified lookup table (make -> model -> base MSRP in CAD)
    msrp_table = {
        "toyota": {
            "camry": 35000,
            "corolla": 28000,
            "rav4": 42000,
            "highlander": 52000,
        },
        "honda": {
            "civic": 30000,
            "accord": 38000,
            "cr-v": 42000,
            "pilot": 52000,
        },
        "tesla": {
            "model 3": 55000,
            "model y": 65000,
            "model s": 120000,
            "model x": 130000,
        },
        "bmw": {
            "3 series": 55000,
            "m3": 95000,
            "x3": 60000,
            "x5": 85000,
        },
        "mazda": {
            "mazda3": 28000,
            "cx-5": 38000,
            "mx-5": 42000,
        },
        "hyundai": {
            "elantra": 25000,
            "tucson": 38000,
            "ioniq": 55000,
        },
    }
    
    make_lower = make.lower()
    model_lower = model.lower()
    
    # Try exact match
    if make_lower in msrp_table:
        make_models = msrp_table[make_lower]
        if model_lower in make_models:
            return make_models[model_lower]
        
        # Try partial match
        for known_model, msrp in make_models.items():
            if known_model in model_lower or model_lower in known_model:
                return msrp
    
    # Default fallback: assume $40,000 average
    return 40000.0
