"""
User CRUD Tests

Tests for user creation, profile updates, and saved cars.
"""

import pytest


class TestUserCRUD:
    """Test User CRUD operations."""

    def test_create_user(self, client, sample_user_data):
        """Test creating a new user."""
        response = client.post("/users/", json=sample_user_data)
        
        assert response.status_code == 201
        data = response.json()
        
        assert data["id"] == sample_user_data["id"]
        assert data["email"] == sample_user_data["email"]
        assert data["profile_complete"] == False

    def test_create_duplicate_user_returns_existing(self, client, sample_user_data):
        """Test that creating a user with same ID returns existing user."""
        # Create first user
        response1 = client.post("/users/", json=sample_user_data)
        user1 = response1.json()
        
        # Try to create same user again
        response2 = client.post("/users/", json=sample_user_data)
        user2 = response2.json()
        
        # Should return the same user
        assert user1["id"] == user2["id"]

    def test_get_current_user(self, client, sample_user_data):
        """Test getting current user profile."""
        # Create user first
        client.post("/users/", json=sample_user_data)
        
        # Get user profile
        response = client.get(
            "/users/me",
            headers={"X-User-Id": sample_user_data["id"]}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["id"] == sample_user_data["id"]
        assert data["email"] == sample_user_data["email"]

    def test_get_current_user_not_found(self, client):
        """Test getting user that doesn't exist."""
        response = client.get(
            "/users/me",
            headers={"X-User-Id": "nonexistent-user"}
        )
        
        assert response.status_code == 404

    def test_get_current_user_no_auth(self, client):
        """Test getting user without authentication."""
        response = client.get("/users/me")
        
        assert response.status_code == 401

    def test_update_user_profile(self, client, sample_user_data):
        """Test updating user profile."""
        # Create user first
        client.post("/users/", json=sample_user_data)
        
        # Update profile
        update_data = {
            "first_name": "John",
            "last_name": "Doe",
            "commute_distance_km": 25,
        }
        
        response = client.patch(
            "/users/me",
            json=update_data,
            headers={"X-User-Id": sample_user_data["id"]}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["first_name"] == "John"
        assert data["last_name"] == "Doe"
        assert data["commute_distance_km"] == 25
        # Profile should be marked complete after first_name is set
        assert data["profile_complete"] == True

    def test_delete_user(self, client, sample_user_data):
        """Test deleting a user."""
        # Create user first
        client.post("/users/", json=sample_user_data)
        
        # Delete user
        response = client.delete(
            "/users/me",
            headers={"X-User-Id": sample_user_data["id"]}
        )
        
        assert response.status_code == 204
        
        # Verify user is gone
        get_response = client.get(
            "/users/me",
            headers={"X-User-Id": sample_user_data["id"]}
        )
        assert get_response.status_code == 404


class TestSavedCars:
    """Test Saved Cars functionality."""

    def test_save_car(self, client, sample_user_data, sample_car_data):
        """Test saving a car."""
        # Create user and car
        client.post("/users/", json=sample_user_data)
        car_response = client.post("/cars/", json=sample_car_data)
        car_id = car_response.json()["id"]
        
        # Save the car
        response = client.post(
            f"/users/saved-cars/{car_id}",
            headers={"X-User-Id": sample_user_data["id"]}
        )
        
        assert response.status_code == 201
        data = response.json()
        
        assert data["car_id"] == car_id
        assert data["user_id"] == sample_user_data["id"]

    def test_save_car_not_found(self, client, sample_user_data):
        """Test saving a car that doesn't exist."""
        client.post("/users/", json=sample_user_data)
        
        response = client.post(
            "/users/saved-cars/nonexistent-car",
            headers={"X-User-Id": sample_user_data["id"]}
        )
        
        assert response.status_code == 404

    def test_get_saved_cars(self, client, sample_user_data, sample_car_data):
        """Test getting list of saved cars."""
        # Create user and car
        client.post("/users/", json=sample_user_data)
        car_response = client.post("/cars/", json=sample_car_data)
        car_id = car_response.json()["id"]
        
        # Save the car
        client.post(
            f"/users/saved-cars/{car_id}",
            headers={"X-User-Id": sample_user_data["id"]}
        )
        
        # Get saved cars
        response = client.get(
            "/users/saved-cars",
            headers={"X-User-Id": sample_user_data["id"]}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]["id"] == car_id

    def test_unsave_car(self, client, sample_user_data, sample_car_data):
        """Test removing a saved car."""
        # Create user and car
        client.post("/users/", json=sample_user_data)
        car_response = client.post("/cars/", json=sample_car_data)
        car_id = car_response.json()["id"]
        
        # Save the car
        client.post(
            f"/users/saved-cars/{car_id}",
            headers={"X-User-Id": sample_user_data["id"]}
        )
        
        # Unsave the car
        response = client.delete(
            f"/users/saved-cars/{car_id}",
            headers={"X-User-Id": sample_user_data["id"]}
        )
        
        assert response.status_code == 204
        
        # Verify car is no longer saved
        get_response = client.get(
            "/users/saved-cars",
            headers={"X-User-Id": sample_user_data["id"]}
        )
        assert len(get_response.json()) == 0

    def test_save_car_twice_returns_existing(self, client, sample_user_data, sample_car_data):
        """Test that saving the same car twice returns existing entry."""
        # Create user and car
        client.post("/users/", json=sample_user_data)
        car_response = client.post("/cars/", json=sample_car_data)
        car_id = car_response.json()["id"]
        
        # Save the car twice
        response1 = client.post(
            f"/users/saved-cars/{car_id}",
            headers={"X-User-Id": sample_user_data["id"]}
        )
        response2 = client.post(
            f"/users/saved-cars/{car_id}",
            headers={"X-User-Id": sample_user_data["id"]}
        )
        
        # Should return the same saved car entry
        assert response1.json()["id"] == response2.json()["id"]
