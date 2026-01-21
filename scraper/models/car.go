package models

// CarListing represents a single car entry from the scraper
type CarListing struct {
	ID        string  `json:"id"`
	Title     string  `json:"title"`
	Price     float64 `json:"price"`
	Mileage   int     `json:"mileage"`
	SourceURL string  `json:"source_url"`
}
