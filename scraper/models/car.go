package models

// CarListing represents a single car entry from the scraper
type CarListing struct {
	ID            string  `json:"id"`
	Title         string  `json:"title"`
	Year          int     `json:"year"`
	Make          string  `json:"make"`
	Model         string  `json:"model"`
	Trim          string  `json:"trim"`
	Price         float64 `json:"price"`
	Currency      string  `json:"currency"`
	Mileage       int     `json:"mileage"`
	MileageUnit   string  `json:"mileage_unit"`
	Transmission  string  `json:"transmission"`
	Drivetrain    string  `json:"drivetrain"`
	ExteriorColor string  `json:"exterior_color"`
	SourceURL     string  `json:"source_url"`
}
