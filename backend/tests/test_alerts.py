"""
Alert CRUD Tests

Tests for alert creation, reading, updating, and deletion.
"""

import pytest


class TestAlertCRUD:
    """Test Alert CRUD operations."""

    def test_create_alert(self, client, sample_user_data, sample_alert_data):
        """Test creating a new alert."""
        # Create user first
        client.post("/users/", json=sample_user_data)
        
        response = client.post(
            "/alerts/",
            json=sample_alert_data,
            headers={"X-User-Id": sample_user_data["id"]}
        )
        
        assert response.status_code == 201
        data = response.json()
        
        assert data["name"] == sample_alert_data["name"]
        assert data["make"] == sample_alert_data["make"]
        assert data["model"] == sample_alert_data["model"]
        assert data["price_max"] == sample_alert_data["price_max"]
        assert data["is_active"] == True
        assert "id" in data

    def test_create_alert_no_auth(self, client, sample_alert_data):
        """Test creating alert without authentication."""
        response = client.post("/alerts/", json=sample_alert_data)
        
        assert response.status_code == 401

    def test_get_alerts_list(self, client, sample_user_data, sample_alert_data):
        """Test getting list of alerts."""
        # Create user and alert
        client.post("/users/", json=sample_user_data)
        client.post(
            "/alerts/",
            json=sample_alert_data,
            headers={"X-User-Id": sample_user_data["id"]}
        )
        
        response = client.get(
            "/alerts/",
            headers={"X-User-Id": sample_user_data["id"]}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) == 1

    def test_get_alerts_empty(self, client, sample_user_data):
        """Test getting alerts when user has none."""
        client.post("/users/", json=sample_user_data)
        
        response = client.get(
            "/alerts/",
            headers={"X-User-Id": sample_user_data["id"]}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data == []

    def test_get_alert_by_id(self, client, sample_user_data, sample_alert_data):
        """Test getting a specific alert by ID."""
        # Create user and alert
        client.post("/users/", json=sample_user_data)
        create_response = client.post(
            "/alerts/",
            json=sample_alert_data,
            headers={"X-User-Id": sample_user_data["id"]}
        )
        alert_id = create_response.json()["id"]
        
        response = client.get(
            f"/alerts/{alert_id}",
            headers={"X-User-Id": sample_user_data["id"]}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["id"] == alert_id
        assert data["name"] == sample_alert_data["name"]

    def test_get_alert_not_found(self, client, sample_user_data):
        """Test getting an alert that doesn't exist."""
        client.post("/users/", json=sample_user_data)
        
        response = client.get(
            "/alerts/nonexistent-alert",
            headers={"X-User-Id": sample_user_data["id"]}
        )
        
        assert response.status_code == 404

    def test_update_alert(self, client, sample_user_data, sample_alert_data):
        """Test updating an alert."""
        # Create user and alert
        client.post("/users/", json=sample_user_data)
        create_response = client.post(
            "/alerts/",
            json=sample_alert_data,
            headers={"X-User-Id": sample_user_data["id"]}
        )
        alert_id = create_response.json()["id"]
        
        # Update alert
        update_data = {
            "name": "Updated Alert Name",
            "price_max": 50000,
        }
        
        response = client.patch(
            f"/alerts/{alert_id}",
            json=update_data,
            headers={"X-User-Id": sample_user_data["id"]}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["name"] == "Updated Alert Name"
        assert data["price_max"] == 50000
        # Unchanged fields should remain
        assert data["make"] == sample_alert_data["make"]

    def test_pause_alert(self, client, sample_user_data, sample_alert_data):
        """Test pausing/deactivating an alert."""
        # Create user and alert
        client.post("/users/", json=sample_user_data)
        create_response = client.post(
            "/alerts/",
            json=sample_alert_data,
            headers={"X-User-Id": sample_user_data["id"]}
        )
        alert_id = create_response.json()["id"]
        
        # Pause alert
        response = client.patch(
            f"/alerts/{alert_id}",
            json={"is_active": False},
            headers={"X-User-Id": sample_user_data["id"]}
        )
        
        assert response.status_code == 200
        assert response.json()["is_active"] == False

    def test_delete_alert(self, client, sample_user_data, sample_alert_data):
        """Test deleting an alert."""
        # Create user and alert
        client.post("/users/", json=sample_user_data)
        create_response = client.post(
            "/alerts/",
            json=sample_alert_data,
            headers={"X-User-Id": sample_user_data["id"]}
        )
        alert_id = create_response.json()["id"]
        
        # Delete alert
        response = client.delete(
            f"/alerts/{alert_id}",
            headers={"X-User-Id": sample_user_data["id"]}
        )
        
        assert response.status_code == 204
        
        # Verify alert is gone
        get_response = client.get(
            f"/alerts/{alert_id}",
            headers={"X-User-Id": sample_user_data["id"]}
        )
        assert get_response.status_code == 404

    def test_delete_alert_not_found(self, client, sample_user_data):
        """Test deleting an alert that doesn't exist."""
        client.post("/users/", json=sample_user_data)
        
        response = client.delete(
            "/alerts/nonexistent-alert",
            headers={"X-User-Id": sample_user_data["id"]}
        )
        
        assert response.status_code == 404

    def test_user_can_only_access_own_alerts(self, client, sample_user_data, sample_alert_data):
        """Test that users can only access their own alerts."""
        # Create user 1 and their alert
        client.post("/users/", json=sample_user_data)
        create_response = client.post(
            "/alerts/",
            json=sample_alert_data,
            headers={"X-User-Id": sample_user_data["id"]}
        )
        alert_id = create_response.json()["id"]
        
        # Create user 2
        user2_data = {"id": "user-2", "email": "user2@example.com"}
        client.post("/users/", json=user2_data)
        
        # User 2 should not be able to access user 1's alert
        response = client.get(
            f"/alerts/{alert_id}",
            headers={"X-User-Id": "user-2"}
        )
        
        assert response.status_code == 404
