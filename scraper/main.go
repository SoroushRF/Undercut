package main

import (
	"fmt"
	"log"
	"strings"

	"github.com/SoroushRF/Undercut/scraper/internal/collector"
	"github.com/SoroushRF/Undercut/scraper/internal/model"
)

func main() {
	fmt.Println("\n" + strings.Repeat("=", 60))
	fmt.Println("  🎯 THE HUNTER v2: Rebuilt from Scratch (Playwright)")
	fmt.Println("  Mode: Stealth Headless | Target: AutoTrader.ca")
	fmt.Println(strings.Repeat("=", 60))

	// 1. Initialize Collector
	c, err := collector.NewAutoTraderCollector()
	if err != nil {
		log.Fatalf("❌ Initialization failed: %v", err)
	}
	defer c.Close()

	// 2. Setup Results Channel
	results := make(chan model.CarListing)

	targetMake := "Honda"
	targetModel := "Civic"

	// 3. Start Scraping
	go c.Scrape(targetMake, targetModel, results)

	// 4. Print results as they come in
	fmt.Printf("\n%-6s | %-12s | %-12s | %-10s | %-12s\n", "YEAR", "MAKE", "MODEL", "PRICE ($)", "MILEAGE (km)")
	fmt.Println(strings.Repeat("-", 60))

	count := 0
	for car := range results {
		fmt.Printf("%-6d | %-12s | %-12s | %10.2f | %12d\n",
			car.Year, car.Make, car.Model, car.Price, car.Mileage)
		count++
	}

	fmt.Println(strings.Repeat("-", 60))
	fmt.Printf("🎯 HUNT COMPLETE. Total Records Found: %d\n", count)
	fmt.Println(strings.Repeat("=", 60) + "\n")
	"os"
	"os/signal"
	"sort"
	"strings"
	"syscall"
	"time"

	"github.com/SoroushRF/Undercut/scraper/analyzer"
	"github.com/SoroushRF/Undercut/scraper/collectors"
	"github.com/SoroushRF/Undercut/scraper/models"
)

func main() {
	fmt.Println("\n" + strings.Repeat("=", 80))
	fmt.Println("  🎯 THE HUNTER: AutoTrader Targeted Quantitative Engine")
	fmt.Println("  Strategy: The Quant | Mode: Stealth Targeted Search")
	fmt.Println(strings.Repeat("=", 80))

	results := make(chan models.CarListing)
	seen := make(map[string]bool)

	// User configuration for the Hunt
	targetMake := "Honda"
	targetModel := "Civic"

	// Launch scraper
	go collectors.StartAutoTraderScraper(results, targetMake, targetModel)

	// Setup signal handling
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	// Table Header
	fmt.Printf("\n%-6s | %-12s | %-12s | %-10s | %-12s\n", "YEAR", "MAKE", "MODEL", "PRICE ($)", "MILEAGE (km)")
	fmt.Println(strings.Repeat("-", 80))

	var cars []models.CarListing

L:
	for {
		select {
		case car, ok := <-results:
			if !ok {
				break L
			}
			if seen[car.ID] {
				continue
			}
			seen[car.ID] = true
			cars = append(cars, car)

		case <-sigChan:
			fmt.Println("\n\n🛑 Shutdown signal received. Cleaning up...")
			break L

		case <-time.After(150 * time.Second):
			if len(cars) > 0 {
				fmt.Println("\n⌛ Session completion: No more results.")
				break L
			} else {
				fmt.Println("\n⌛ Search Timeout: The browser might be stuck or blocked.")
				break L
			}
		}
	}

	// 🎨 Sort Findings by Year (Newest First)
	sort.Slice(cars, func(i, j int) bool {
		return cars[i].Year > cars[j].Year
	})

	// Table Rows
	for _, car := range cars {
		fmt.Printf("%-6d | %-12s | %-12s | %10.2f | %12d\n",
			car.Year, car.Make, car.Model, car.Price, car.Mileage)

		// Hand over to backend API (Non-blocking)
		go func(c models.CarListing) {
			_ = analyzer.PostCarToBackend(c)
		}(car)
	}

	fmt.Println(strings.Repeat("-", 80))
	fmt.Printf("🎯 HUNT COMPLETE. Total Records Found: %d\n", len(cars))
	fmt.Println(strings.Repeat("=", 80) + "\n")
}
