"""
Deal Grade Calculator

This module calculates the deal grade (S/A/B/C/F) based on:
- Listed Price vs Fair Market Value (FMV)
- Price percentage difference

Grading Scale:
- S: >10% below FMV (Steal!)
- A: 5-10% below FMV (Great deal)
- B: Within 5% of FMV (Fair price)
- C: 5-10% above FMV (Overpriced)
- F: >10% above FMV (Avoid)
"""

from typing import Literal

DealGrade = Literal["S", "A", "B", "C", "F"]


def calculate_deal_grade(listed_price: float, fair_market_value: float) -> DealGrade:
    """
    Calculate deal grade based on price vs FMV.
    
    Args:
        listed_price: The seller's asking price
        fair_market_value: Our estimated FMV
    
    Returns:
        Deal grade: S, A, B, C, or F
    """
    if fair_market_value <= 0:
        return "B"  # Can't calculate, assume fair
    
    # Calculate percentage difference
    # Negative = listed below FMV (good for buyer)
    # Positive = listed above FMV (bad for buyer)
    price_diff_pct = ((listed_price - fair_market_value) / fair_market_value) * 100
    
    if price_diff_pct <= -10:
        return "S"  # 10%+ below FMV - Steal!
    elif price_diff_pct <= -5:
        return "A"  # 5-10% below FMV - Great deal
    elif price_diff_pct <= 5:
        return "B"  # Within 5% - Fair price
    elif price_diff_pct <= 10:
        return "C"  # 5-10% above FMV - Overpriced
    else:
        return "F"  # 10%+ above FMV - Avoid


def calculate_deal_grade_with_details(
    listed_price: float, 
    fair_market_value: float
) -> dict:
    """
    Calculate deal grade with detailed breakdown.
    
    Returns:
        Dict with grade, percentage, and savings/overpay amount
    """
    grade = calculate_deal_grade(listed_price, fair_market_value)
    
    if fair_market_value <= 0:
        return {
            "grade": grade,
            "price_diff_pct": 0,
            "price_diff_amount": 0,
            "summary": "Cannot calculate - missing market data",
        }
    
    price_diff_pct = ((listed_price - fair_market_value) / fair_market_value) * 100
    price_diff_amount = listed_price - fair_market_value
    
    # Generate human-readable summary
    if price_diff_amount < 0:
        summary = f"${abs(price_diff_amount):,.0f} below market ({abs(price_diff_pct):.1f}% savings)"
    elif price_diff_amount > 0:
        summary = f"${price_diff_amount:,.0f} above market ({price_diff_pct:.1f}% overpay)"
    else:
        summary = "Priced at market value"
    
    return {
        "grade": grade,
        "price_diff_pct": round(price_diff_pct, 2),
        "price_diff_amount": round(price_diff_amount, 2),
        "fair_market_value": round(fair_market_value, 2),
        "summary": summary,
    }


def get_grade_description(grade: DealGrade) -> str:
    """Get human-readable description for a deal grade."""
    descriptions = {
        "S": "Exceptional Deal - 10%+ below market value",
        "A": "Great Deal - 5-10% below market value",
        "B": "Fair Price - At market value",
        "C": "Overpriced - 5-10% above market value",
        "F": "Avoid - 10%+ above market value",
    }
    return descriptions.get(grade, "Unknown grade")
