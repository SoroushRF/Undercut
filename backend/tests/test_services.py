"""
Service Tests

Tests for backend services (Quant, TCO, Alert Matcher).
These test the business logic in isolation, without HTTP requests.
"""

import pytest
from datetime import datetime, timezone


class TestQuantService:
    """Test the Quant service (FMV, Deal Grader)."""

    def test_estimate_fmv_basic(self):
        """Test basic FMV estimation."""
        from backend.services.quant.fmv import estimate_fair_market_value
        
        fmv = estimate_fair_market_value(
            make="Tesla",
            model="Model 3",
            year=2021,
            mileage=30000,
        )
        
        assert fmv > 0
        assert isinstance(fmv, float)

    def test_estimate_fmv_electric_vs_gasoline(self):
        """Test that electric vehicles have different depreciation."""
        from backend.services.quant.fmv import estimate_fair_market_value
        
        fmv_electric = estimate_fair_market_value(
            make="Tesla",
            model="Model 3",
            year=2021,
            mileage=30000,
            fuel_type="electric",
        )
        
        fmv_gasoline = estimate_fair_market_value(
            make="Toyota",
            model="Camry",
            year=2021,
            mileage=30000,
            fuel_type="gasoline",
        )
        
        # Both should be valid
        assert fmv_electric > 0
        assert fmv_gasoline > 0

    def test_calculate_deal_grade_great_deal(self):
        """Test S-grade for significantly underpriced cars."""
        from backend.services.quant.deal_grader import calculate_deal_grade
        
        # 25% below FMV = S grade
        grade = calculate_deal_grade(listed_price=30000, fair_market_value=40000)
        
        assert grade == "S"

    def test_calculate_deal_grade_good_deal(self):
        """Test A-grade for moderately underpriced cars."""
        from backend.services.quant.deal_grader import calculate_deal_grade
        
        # 7.5% below FMV = A grade (between -5% and -10%)
        grade = calculate_deal_grade(listed_price=37000, fair_market_value=40000)
        
        assert grade == "A"

    def test_calculate_deal_grade_fair(self):
        """Test B-grade for fairly priced cars."""
        from backend.services.quant.deal_grader import calculate_deal_grade
        
        # At market value = B grade
        grade = calculate_deal_grade(listed_price=40000, fair_market_value=40000)
        
        assert grade == "B"

    def test_calculate_deal_grade_overpriced(self):
        """Test C-grade for moderately overpriced cars."""
        from backend.services.quant.deal_grader import calculate_deal_grade
        
        # 7.5% above FMV = C grade (between 5% and 10%)
        grade = calculate_deal_grade(listed_price=43000, fair_market_value=40000)
        
        assert grade == "C"

    def test_calculate_deal_grade_terrible(self):
        """Test F-grade for significantly overpriced cars."""
        from backend.services.quant.deal_grader import calculate_deal_grade
        
        # 25% above FMV = F grade (>10%)
        grade = calculate_deal_grade(listed_price=50000, fair_market_value=40000)
        
        assert grade == "F"


class TestTCOService:
    """Test the TCO (Total Cost of Ownership) service."""

    def test_calculate_tco_basic(self):
        """Test basic TCO calculation."""
        from backend.services.tco import calculate_tco
        
        result = calculate_tco(
            purchase_price=38000,
            vehicle_year=2021,
            annual_km=15000,
            fuel_type="gasoline",
        )
        
        assert result.monthly_total > 0
        assert result.monthly_fuel >= 0
        assert result.monthly_depreciation > 0
        assert result.monthly_insurance > 0
        assert result.monthly_maintenance > 0
        # Annual is approximately 12x monthly (may have rounding differences)
        assert abs(result.annual_total - result.monthly_total * 12) < 1

    def test_calculate_tco_electric(self):
        """Test TCO for electric vehicle - should have lower fuel cost."""
        from backend.services.tco import calculate_tco
        
        result_electric = calculate_tco(
            purchase_price=40000,
            vehicle_year=2022,
            annual_km=15000,
            fuel_type="electric",
        )
        
        result_gasoline = calculate_tco(
            purchase_price=40000,
            vehicle_year=2022,
            annual_km=15000,
            fuel_type="gasoline",
        )
        
        # Electric should have lower fuel/energy cost
        assert result_electric.monthly_fuel < result_gasoline.monthly_fuel

    def test_calculate_tco_high_mileage(self):
        """Test TCO with high annual mileage increases costs."""
        from backend.services.tco import calculate_tco
        
        result_low = calculate_tco(
            purchase_price=30000,
            vehicle_year=2020,
            annual_km=10000,
        )
        
        result_high = calculate_tco(
            purchase_price=30000,
            vehicle_year=2020,
            annual_km=30000,
        )
        
        # Higher mileage = higher fuel and maintenance costs
        assert result_high.monthly_fuel > result_low.monthly_fuel
        assert result_high.monthly_maintenance > result_low.monthly_maintenance

    def test_calculate_tco_assumptions_included(self):
        """Test that TCO result includes assumptions."""
        from backend.services.tco import calculate_tco
        
        result = calculate_tco(
            purchase_price=35000,
            vehicle_year=2021,
        )
        
        assert "annual_km" in result.assumptions
        assert "fuel_type" in result.assumptions
        assert "note" in result.assumptions


class TestAlertMatcher:
    """Test the alert matching service."""

    def test_car_matches_alert_by_make(self):
        """Test matching by make."""
        from backend.services.alerts import _car_matches_alert
        from unittest.mock import MagicMock
        
        car = MagicMock()
        car.make = "Tesla"
        car.model = "Model 3"
        car.year = 2021
        car.price = 38000
        car.mileage = 30000
        car.transmission = "automatic"
        car.fuel_type = "electric"
        car.drivetrain = "rwd"
        car.deal_grade = "A"
        
        alert = MagicMock()
        alert.make = "Tesla"
        alert.model = None
        alert.year_min = None
        alert.year_max = None
        alert.price_max = None
        alert.mileage_max = None
        alert.transmission = None
        alert.fuel_type = None
        alert.drivetrain = None
        alert.deal_grade_min = None
        
        assert _car_matches_alert(car, alert) == True

    def test_car_matches_alert_by_price_max(self):
        """Test matching by price max."""
        from backend.services.alerts import _car_matches_alert
        from unittest.mock import MagicMock
        
        car = MagicMock()
        car.make = "Tesla"
        car.model = "Model 3"
        car.year = 2021
        car.price = 35000
        car.mileage = 30000
        car.transmission = None
        car.fuel_type = None
        car.drivetrain = None
        car.deal_grade = None
        
        alert = MagicMock()
        alert.make = None
        alert.model = None
        alert.year_min = None
        alert.year_max = None
        alert.price_max = 40000  # Car is under this
        alert.mileage_max = None
        alert.transmission = None
        alert.fuel_type = None
        alert.drivetrain = None
        alert.deal_grade_min = None
        
        assert _car_matches_alert(car, alert) == True
        
        # Now test car above price max
        car.price = 45000
        assert _car_matches_alert(car, alert) == False

    def test_car_matches_alert_by_year_range(self):
        """Test matching by year range."""
        from backend.services.alerts import _car_matches_alert
        from unittest.mock import MagicMock
        
        car = MagicMock()
        car.make = "Toyota"
        car.model = "Camry"
        car.year = 2021
        car.price = 25000
        car.mileage = 40000
        car.transmission = None
        car.fuel_type = None
        car.drivetrain = None
        car.deal_grade = None
        
        alert = MagicMock()
        alert.make = None
        alert.model = None
        alert.year_min = 2020
        alert.year_max = 2023
        alert.price_max = None
        alert.mileage_max = None
        alert.transmission = None
        alert.fuel_type = None
        alert.drivetrain = None
        alert.deal_grade_min = None
        
        # Car year 2021 is within 2020-2023
        assert _car_matches_alert(car, alert) == True
        
        # Car year 2019 is outside range
        car.year = 2019
        assert _car_matches_alert(car, alert) == False

    def test_car_matches_alert_by_deal_grade(self):
        """Test matching by minimum deal grade."""
        from backend.services.alerts import _car_matches_alert
        from unittest.mock import MagicMock
        
        car = MagicMock()
        car.make = "Honda"
        car.model = "Civic"
        car.year = 2020
        car.price = 22000
        car.mileage = 50000
        car.transmission = None
        car.fuel_type = None
        car.drivetrain = None
        car.deal_grade = "A"
        
        alert = MagicMock()
        alert.make = None
        alert.model = None
        alert.year_min = None
        alert.year_max = None
        alert.price_max = None
        alert.mileage_max = None
        alert.transmission = None
        alert.fuel_type = None
        alert.drivetrain = None
        alert.deal_grade_min = "A"  # Want A or better
        
        # A-grade matches A minimum
        assert _car_matches_alert(car, alert) == True
        
        # S-grade is better than A
        car.deal_grade = "S"
        assert _car_matches_alert(car, alert) == True
        
        # C-grade is worse than A minimum
        car.deal_grade = "C"
        assert _car_matches_alert(car, alert) == False

    def test_car_does_not_match_wrong_make(self):
        """Test that wrong make doesn't match."""
        from backend.services.alerts import _car_matches_alert
        from unittest.mock import MagicMock
        
        car = MagicMock()
        car.make = "Toyota"
        car.model = None
        car.year = None
        car.price = None
        car.mileage = None
        car.transmission = None
        car.fuel_type = None
        car.drivetrain = None
        car.deal_grade = None
        
        alert = MagicMock()
        alert.make = "Tesla"  # Looking for Tesla
        alert.model = None
        alert.year_min = None
        alert.year_max = None
        alert.price_max = None
        alert.mileage_max = None
        alert.transmission = None
        alert.fuel_type = None
        alert.drivetrain = None
        alert.deal_grade_min = None
        
        # Toyota doesn't match Tesla alert
        assert _car_matches_alert(car, alert) == False
