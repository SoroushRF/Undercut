"""
Car CRUD Tests

Tests for car creation, reading, updating, and searching.
"""

import pytest


class TestCarCRUD:
    """Test Car CRUD operations."""

    def test_create_car(self, client, sample_car_data):
        """Test creating a new car."""
        response = client.post("/cars/", json=sample_car_data)
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["vin"] == sample_car_data["vin"]
        assert data["make"] == sample_car_data["make"]
        assert data["model"] == sample_car_data["model"]
        assert data["year"] == sample_car_data["year"]
        assert data["price"] == sample_car_data["price"]
        assert "id" in data
        assert "created_at" in data

    def test_create_duplicate_car_returns_existing(self, client, sample_car_data):
        """Test that creating a car with same VIN returns existing car."""
        # Create first car
        response1 = client.post("/cars/", json=sample_car_data)
        car1 = response1.json()
        
        # Try to create same car again
        response2 = client.post("/cars/", json=sample_car_data)
        car2 = response2.json()
        
        # Should return the same car
        assert car1["id"] == car2["id"]

    def test_get_cars_list(self, client, sample_car_data):
        """Test getting list of cars."""
        # Create a car first
        client.post("/cars/", json=sample_car_data)
        
        response = client.get("/cars/")
        
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) >= 1

    def test_get_car_by_id(self, client, sample_car_data):
        """Test getting a single car by ID."""
        # Create a car first
        create_response = client.post("/cars/", json=sample_car_data)
        car_id = create_response.json()["id"]
        
        response = client.get(f"/cars/{car_id}")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["id"] == car_id
        assert data["make"] == sample_car_data["make"]

    def test_get_car_not_found(self, client):
        """Test getting a car that doesn't exist."""
        response = client.get("/cars/nonexistent-id")
        
        assert response.status_code == 404

    def test_get_trending_cars(self, client, sample_car_data):
        """Test getting trending cars."""
        # Create a car with good deal grade
        sample_car_data["deal_grade"] = "S"
        client.post("/cars/", json=sample_car_data)
        
        response = client.get("/cars/trending")
        
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)


class TestCarSearch:
    """Test Car search functionality."""

    def test_search_by_make(self, client, sample_car_data):
        """Test searching cars by make."""
        # Create a Tesla
        client.post("/cars/", json=sample_car_data)
        
        # Create a Toyota
        toyota_data = sample_car_data.copy()
        toyota_data["vin"] = "2HGBH41JXMN109187"
        toyota_data["make"] = "Toyota"
        toyota_data["model"] = "Camry"
        client.post("/cars/", json=toyota_data)
        
        # Search for Tesla
        response = client.post("/cars/search", json={"make": "Tesla"})
        
        assert response.status_code == 200
        data = response.json()
        
        assert len(data) >= 1
        assert all(car["make"] == "Tesla" for car in data)

    def test_search_by_price_range(self, client, sample_car_data):
        """Test searching cars by price range."""
        # Create car at $38,000
        client.post("/cars/", json=sample_car_data)
        
        # Search for cars under $40,000
        response = client.post("/cars/search", json={"price_max": 40000})
        
        assert response.status_code == 200
        data = response.json()
        
        assert len(data) >= 1
        assert all(car["price"] <= 40000 for car in data)

    def test_search_good_deals_only(self, client, sample_car_data):
        """Test filtering for only good deals (S and A grades)."""
        # Create an A-grade car
        sample_car_data["deal_grade"] = "A"
        client.post("/cars/", json=sample_car_data)
        
        # Create a C-grade car
        bad_car = sample_car_data.copy()
        bad_car["vin"] = "3HGBH41JXMN109188"
        bad_car["deal_grade"] = "C"
        client.post("/cars/", json=bad_car)
        
        # Search for good deals only
        response = client.post("/cars/search", json={"only_good_deals": True})
        
        assert response.status_code == 200
        data = response.json()
        
        # All results should be S or A grade
        for car in data:
            assert car["deal_grade"] in ["S", "A"]

    def test_search_empty_filters(self, client, sample_car_data):
        """Test searching with no filters returns all cars."""
        client.post("/cars/", json=sample_car_data)
        
        response = client.post("/cars/search", json={})
        
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
