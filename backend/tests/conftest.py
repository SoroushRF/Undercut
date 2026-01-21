"""
Pytest Configuration and Fixtures

This module provides shared fixtures for all tests.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.main import app
from backend.database import Base, get_db


# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override the database dependency with test database."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def test_db():
    """
    Create fresh database tables for each test.
    
    Yields a database session, then cleans up after test.
    """
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Drop all tables after test
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(test_db):
    """
    Create a test client with the test database.
    
    Uses the test database instead of the real one.
    """
    app.dependency_overrides[get_db] = override_get_db
    
    # Create tables before test
    Base.metadata.create_all(bind=engine)
    
    with TestClient(app) as c:
        yield c
    
    # Clean up
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()


@pytest.fixture
def sample_car_data():
    """Sample car data for testing."""
    return {
        "vin": "1HGBH41JXMN109186",  # Valid 17-char VIN
        "make": "Tesla",
        "model": "Model 3",
        "year": 2021,
        "price": 38000.0,
        "mileage": 32000,
        "currency": "CAD",
        "fuel_type": "electric",
        "transmission": "automatic",
        "drivetrain": "rwd",
        "deal_grade": "A",
        "listing_url": "https://example.com/car1",
    }


@pytest.fixture
def sample_user_data():
    """Sample user data for testing."""
    return {
        "id": "test-user-123",
        "email": "test@example.com",
    }


@pytest.fixture
def sample_alert_data():
    """Sample alert data for testing."""
    return {
        "name": "Dream Tesla",
        "make": "Tesla",
        "model": "Model 3",
        "price_max": 45000,
        "fuel_type": "electric",
    }
