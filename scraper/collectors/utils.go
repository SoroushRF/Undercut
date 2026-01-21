package collectors // Shared package for data gathering and processing utilities

import (
	"math/rand" // Mathematical randomness for selection
	"regexp"    // Regular expressions for pattern matching in raw text
	"strconv"   // String conversion to numeric types
	"strings"   // Basic string manipulation functions
	"time"      // Time-based seeds for randomness
)

// GetRandomUserAgent - Returns a random browser identifier to bypass basic bot detection
func GetRandomUserAgent() string {
	userAgents := []string{ // List of modern desktop browser strings
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
	}
	r := rand.New(rand.NewSource(time.Now().UnixNano())) // Seed the random generator with current time
	return userAgents[r.Intn(len(userAgents))]           // Select and return a random agent from the list
}

// CleanPrice - Extracts a numeric price value from raw text (e.g., "$12,345.00" -> 12345.0)
func CleanPrice(raw string) float64 {
	// Pattern for currency: matches '$' followed by digits and optional thousands/cents
	re := regexp.MustCompile(`\$[ ]*([0-9]{1,3}(,?[0-9]{3})*(\.[0-9]{2})?)`)
	matches := re.FindStringSubmatch(raw) // Search for the pattern in the raw input
	if len(matches) < 2 {                 // If no currency pattern is found
		return 0 // Return zero as a fallback
	}

	// Remove currency symbols, commas, and whitespace before parsing
	clean := strings.NewReplacer("$", "", ",", "", " ", "").Replace(matches[1])
	price, _ := strconv.ParseFloat(clean, 64) // Convert the cleaned string to a 64-bit float
	return price                              // Return the final numeric price
}

// CleanMileage - Extracts a numeric mileage value from raw text (e.g., "45,000 km" -> 45000)
func CleanMileage(raw string) int {
	raw = strings.ToLower(raw) // Convert input to lowercase for case-insensitive matching
	// Complex pattern: supports comma/space separators, plain digits, or "k" notation before "km"
	re := regexp.MustCompile(`([0-9]{1,3}([\s,]?[0-9]{3}){1,2}|[0-9]{1,7}|[0-9.]+k)\s?(km|kilometers)`)
	matches := re.FindStringSubmatch(raw) // Search for the mileage pattern
	if len(matches) < 2 {                 // If no mileage pattern is found
		return 0 // Return zero as a fallback
	}

	valStr := matches[1]               // Extract the numeric part of the match
	if strings.Contains(valStr, "k") { // Check if the listing uses "k" shorthand (e.g., "45k")
		numStr := strings.ReplaceAll(valStr, "k", "") // Remove the "k"
		val, _ := strconv.ParseFloat(numStr, 64)      // Parse as float for precision
		return int(val * 1000)                        // Multiply by 1000 to get full km value
	}

	// Remove common thousand separators (commas and spaces)
	clean := strings.NewReplacer(",", "", " ", "").Replace(valStr)
	mileage, _ := strconv.Atoi(clean) // Convert cleaned string to a standard integer
	return mileage                    // Return the final numeric mileage
}
