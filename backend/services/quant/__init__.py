"""
Quant Service Package

The Quant is responsible for numerical analysis:
- Fair Market Value (FMV) estimation
- Deal Grade calculation (S/A/B/C/F)
- Price trend analysis
- Market comparison
"""

from backend.services.quant.deal_grader import calculate_deal_grade
from backend.services.quant.fmv import estimate_fair_market_value
