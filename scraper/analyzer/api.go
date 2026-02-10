package analyzer

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/SoroushRF/Undercut/scraper/models"
)

// PostCarToBackend sends a single car listing to the central API
func PostCarToBackend(car models.CarListing) error {
	apiURL := os.Getenv("BACKEND_URL")
	if apiURL == "" {
		apiURL = "http://localhost:8000"
	}
	// Append the endpoint
	apiURL = apiURL + "/cars"

	jsonData, err := json.Marshal(car)
	if err != nil {
		return fmt.Errorf("failed to marshal car data: %v", err)
	}

	client := &http.Client{
		Timeout: 10 * time.Second,
	}

	resp, err := client.Post(apiURL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to POST car to backend: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("backend returned error status: %d", resp.StatusCode)
	}

	return nil
}
