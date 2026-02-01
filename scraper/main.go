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
	fmt.Printf("\n%-6s | %-12s | %-12s | %-10s | %-12s | %-10s\n", "YEAR", "MAKE", "MODEL", "PRICE ($)", "MILEAGE (km)", "BODY")
	fmt.Println(strings.Repeat("-", 80))

	count := 0
	for car := range results {
		fmt.Printf("%-6d | %-12s | %-12s | %10.2f | %12d | %-10s\n",
			car.Year, car.Make, car.Model, car.Price, car.Mileage, car.BodyType)
		count++
	}

	fmt.Println(strings.Repeat("-", 90))
	fmt.Printf("🎯 HUNT COMPLETE. Total Records Found: %d\n", count)
	fmt.Println(strings.Repeat("=", 60) + "\n")
}
