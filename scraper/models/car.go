package models

// CarListing represents a single car entry from the scraper
type CarListing struct {
	VIN          string  `json:"vin"` // May be empty from some scrapers
	Make         string  `json:"make"`
	Model        string  `json:"model"`
	Year         int     `json:"year"`
	Trim         string  `json:"trim"`
	Price        float64 `json:"price"`
	Mileage      int     `json:"mileage"`
	Currency     string  `json:"currency"`
	Transmission string  `json:"transmission"`
	Drivetrain   string  `json:"drivetrain"`
	BodyType     string  `json:"body_type"`
	ListingURL   string  `json:"listing_url"`
	ImageURL     string  `json:"image_url"`
	Description  string  `json:"description"`
}
