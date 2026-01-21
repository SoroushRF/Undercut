package main

import (
	"fmt"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/SoroushRF/Undercut/scraper/collectors"
	"github.com/SoroushRF/Undercut/scraper/models"
)

func main() {
	fmt.Println("\n" + strings.Repeat("=", 80))
	fmt.Println("  🎯 THE HUNTER: AutoTrader Targeted Quantitative Engine")
	fmt.Println("  Strategy: The Quant | Mode: Stealth Targeted Search")
	fmt.Println(strings.Repeat("=", 80))

	results := make(chan models.CarListing)
	count := 0
	seen := make(map[string]bool)

	// User configuration for the Hunt
	targetMake := "Honda"
	targetModel := "Civic"

	// Launch scraper in a goroutine
	go collectors.StartAutoTraderScraper(results, targetMake, targetModel)

	// Setup signal handling
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	// Table Header
	fmt.Printf("\n%-45s | %-12s | %-12s\n", "CAR MODEL / TITLE", "PRICE ($)", "MILEAGE (km)")
	fmt.Println(strings.Repeat("-", 80))

L:
	for {
		select {
		case car, ok := <-results:
			if !ok {
				break L
			}

			// Deduplication by ID
			if seen[car.ID] {
				continue
			}
			seen[car.ID] = true
			count++

			// Clean title for display (truncate if too long)
			displayTitle := car.Title
			if len(displayTitle) > 42 {
				displayTitle = displayTitle[:40] + "..."
			}

			fmt.Printf("%-45s | %10.2f | %12d\n",
				displayTitle, car.Price, car.Mileage)

		case <-sigChan:
			fmt.Println("\n\n🛑 Shutdown signal received. Cleaning up...")
			break L

		case <-time.After(120 * time.Second):
			if count > 0 {
				fmt.Println("\n⌛ Session completion: No more results.")
				break L
			} else {
				fmt.Println("\n⌛ Search Timeout: The browser might be stuck or blocked. Please check the Chrome window for CAPTCHAs or challenges.")
				break L
			}
		}
	}

	fmt.Println(strings.Repeat("-", 80))
	fmt.Printf("🎯 HUNT COMPLETE. Total Records Found: %d\n", count)
	fmt.Println(strings.Repeat("=", 80) + "\n")
}
