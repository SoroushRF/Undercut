import { Car } from "./types";

/**
 * Mock Data for Frontend Development
 * 
 * This data simulates the API response from `GET /cars`.
 * Used by The Architect and Integrator to build UI without backend.
 * 
 * Last synced: 2026-01-19
 */

export const MOCK_CARS: Car[] = [
  {
    id: "mock-001",
    vin: "1HGBH41JXMN109186",
    make: "Tesla",
    model: "Model 3",
    year: 2021,
    trim: "Long Range",
    transmission: "automatic",
    fuel_type: "electric",
    drivetrain: "awd",
    price: 45000,
    currency: "CAD",
    mileage: 32000,
    postal_code: "M5V 3L9",
    seller_type: "dealer",
    listing_url: "https://autotrader.ca/listing/123456",
    image_url: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
    description: "One owner, clean Carfax. Winter tires included. Full Self-Driving capability.",
    created_at: "2026-01-15T10:30:00Z",
    last_seen_at: "2026-01-19T08:00:00Z",
    status: "active",
    fair_market_value: 48500,
    deal_grade: "S",
    ai_verdict: "VERDICT: Flip Potential. Priced 7% below market. Clean history and FSD adds $8k resale premium.",
  },
  {
    id: "mock-002",
    vin: "2HGFC2F59MH512345",
    make: "Honda",
    model: "Civic",
    year: 2019,
    trim: "Type R",
    transmission: "manual",
    fuel_type: "gasoline",
    drivetrain: "fwd",
    price: 42500,
    currency: "CAD",
    mileage: 55000,
    postal_code: "L5B 4N3",
    seller_type: "private",
    listing_url: "https://autotrader.ca/listing/789012",
    image_url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
    description: "Enthusiast owned. Recent track use. Stage 1 tune installed.",
    created_at: "2026-01-14T14:00:00Z",
    last_seen_at: "2026-01-18T22:00:00Z",
    status: "active",
    fair_market_value: 38000,
    deal_grade: "F",
    ai_verdict: "VERDICT: Pass. Overpriced by 12%. Track use and tune void warranty. High wear risk.",
  },
  {
    id: "mock-003",
    vin: "WBS8M9C50J5K78901",
    make: "BMW",
    model: "M3",
    year: 2023,
    trim: "Competition xDrive",
    transmission: "automatic",
    fuel_type: "gasoline",
    drivetrain: "awd",
    price: 98000,
    currency: "CAD",
    mileage: 4500,
    postal_code: "M4W 1A8",
    seller_type: "dealer",
    listing_url: "https://autotrader.ca/listing/345678",
    image_url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800",
    description: "Isle of Man Green. Carbon bucket seats. Ceramic brakes. Mint condition.",
    created_at: "2026-01-16T09:15:00Z",
    last_seen_at: "2026-01-19T07:30:00Z",
    status: "active",
    fair_market_value: 105000,
    deal_grade: "A",
    ai_verdict: "VERDICT: Flip Potential. Rare spec at 25th percentile pricing. Isle of Man Green commands premium.",
  },
  {
    id: "mock-004",
    vin: "5YJSA1E26MF123456",
    make: "Toyota",
    model: "RAV4",
    year: 2022,
    trim: "Prime XSE",
    transmission: "cvt",
    fuel_type: "plugin_hybrid",
    drivetrain: "awd",
    price: 52000,
    currency: "CAD",
    mileage: 18000,
    postal_code: "L4C 0G5",
    seller_type: "private",
    listing_url: "https://autotrader.ca/listing/901234",
    image_url: null,
    description: "XSE trim. Plug-in hybrid. Great for commuting. No accidents.",
    created_at: "2026-01-17T11:45:00Z",
    last_seen_at: "2026-01-19T06:00:00Z",
    status: "active",
    fair_market_value: 51000,
    deal_grade: "C",
    ai_verdict: "VERDICT: Pass. Priced at market average. No arbitrage opportunity.",
  },
  {
    id: "mock-005",
    vin: "JN1TBNT30Z0123456",
    make: "Mazda",
    model: "MX-5",
    year: 2020,
    trim: "RF GT",
    transmission: "manual",
    fuel_type: "gasoline",
    drivetrain: "rwd",
    price: 35000,
    currency: "CAD",
    mileage: 22000,
    postal_code: "M6K 3E3",
    seller_type: "private",
    listing_url: "https://autotrader.ca/listing/567890",
    image_url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800",
    description: "Soul Red Crystal. Retractable hardtop. Brembo brakes. Garage kept.",
    created_at: "2026-01-10T08:00:00Z",
    last_seen_at: "2026-01-15T10:00:00Z",
    status: "sold",
    fair_market_value: 36500,
    deal_grade: "A",
    ai_verdict: "This listing is no longer available.",
  },
];

/**
 * Helper: Get a car by ID from mock data
 */
export function getMockCarById(id: string): Car | undefined {
  return MOCK_CARS.find((car) => car.id === id);
}

/**
 * Helper: Filter mock cars by status
 */
export function getMockCarsByStatus(status: Car["status"]): Car[] {
  return MOCK_CARS.filter((car) => car.status === status);
}
