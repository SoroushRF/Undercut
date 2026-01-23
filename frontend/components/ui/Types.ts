// frontend/lib/types.ts

export type DealGrade = "S" | "A" | "B" | "C" | "D" | "F";

export interface Car {
    id: string;

    // Identity
    make: string;
    model: string;
    year: number;
    trim?: string;

    // Listing
    price_cad: number;
    mileage_km: number;
    location_label: string; // e.g. "North York, ON"
    listing_url?: string;

    // Analytics (optional until backend provides)
    fmv_score?: number; // 0..100
    deal_grade?: DealGrade;
    negotiation_script?: string;

    // Meta
    created_at?: string; // ISO
    updated_at?: string; // ISO
}

export interface CarsResponse {
    items: Car[];
    total: number;
}
