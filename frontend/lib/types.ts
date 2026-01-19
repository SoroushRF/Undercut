/**
 * Car Interface - The Frontend Contract
 * 
 * This MUST match the backend `CarResponse` schema in `backend/models/car.py`.
 * Any changes here require a "Handshake" with The Controller.
 * 
 * Last synced: 2026-01-19
 */

// ============================================================================
// ENUMS (Match backend/models/car.py)
// ============================================================================

export type CarStatus = "active" | "sold" | "deleted";
export type DealGrade = "S" | "A" | "B" | "C" | "F";
export type FuelType = "gasoline" | "diesel" | "electric" | "hybrid" | "plugin_hybrid";
export type Transmission = "automatic" | "manual" | "cvt";
export type Drivetrain = "fwd" | "rwd" | "awd" | "4wd";
export type SellerType = "dealer" | "private";

// ============================================================================
// CAR INTERFACE
// ============================================================================

export interface Car {
  // === Core Identifiers ===
  id: string;
  vin: string;

  // === Vehicle Info ===
  make: string;
  model: string;
  year: number;
  trim: string | null;

  // === Specs (For Filtering & TCO) ===
  transmission: Transmission | null;
  fuel_type: FuelType | null;
  drivetrain: Drivetrain | null;

  // === Pricing ===
  price: number;
  currency: "CAD" | "USD";
  mileage: number; // In KM

  // === Location ===
  postal_code: string | null;

  // === Seller Info ===
  seller_type: SellerType | null;
  listing_url: string;
  image_url: string | null;

  // === Content ===
  description: string | null;

  // === Timestamps ===
  created_at: string; // ISO Date String
  last_seen_at: string | null; // When scraper last verified

  // === Status (Deleted Post Logic) ===
  status: CarStatus;

  // === AI/Quant Analysis ===
  fair_market_value: number | null;
  deal_grade: DealGrade | null;
  ai_verdict: string | null;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * For creating a new car (used by The Hunter/Scraper)
 */
export type CarCreate = Omit<
  Car,
  | "id"
  | "created_at"
  | "last_seen_at"
  | "status"
  | "fair_market_value"
  | "deal_grade"
  | "ai_verdict"
>;

/**
 * For displaying a car card (minimal fields)
 */
export type CarCardProps = Pick<
  Car,
  | "id"
  | "make"
  | "model"
  | "year"
  | "trim"
  | "price"
  | "mileage"
  | "image_url"
  | "deal_grade"
  | "status"
>;
