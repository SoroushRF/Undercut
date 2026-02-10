package main

import (
	"fmt"
	"log"
	"math/rand"
	"strings"
	"time"

	"github.com/SoroushRF/Undercut/scraper/analyzer"
	"github.com/SoroushRF/Undercut/scraper/collectors"
	"github.com/SoroushRF/Undercut/scraper/models"
)

// Toronto's Top 5 Popular Models for Demo
var targets = []struct{ Make, Model string }{
	{"Honda", "Civic"},
	{"Toyota", "Corolla"},
	{"Toyota", "RAV4"},
	{"Honda", "CR-V"},
	{"Tesla", "Model 3"},
}

func main() {
	fmt.Println("\n" + strings.Repeat("=", 60))
	fmt.Println("  🎯 THE HUNTER v2: Multi-Target Stealth Mode")
	fmt.Println("  Mode: Sequential | Anti-Ban Delays | Target: AutoTrader.ca")
	fmt.Println(strings.Repeat("=", 60))

	// Seed random for delays
	rand.Seed(time.Now().UnixNano())

	totalCount := 0

	// SEQUENTIAL: Process one target at a time to avoid detection
	for i, target := range targets {
		fmt.Printf("\n🔍 [%d/%d] Hunting: %s %s\n", i+1, len(targets), target.Make, target.Model)

		// Initialize fresh collector for each target (new browser context)
		c, err := collectors.NewAutoTraderCollector()
		if err != nil {
			log.Printf("❌ Collector init failed for %s %s: %v", target.Make, target.Model, err)
			continue
		}

		results := make(chan models.CarListing)
		go c.Scrape(target.Make, target.Model, results)

		// Process results
		count := 0
		for car := range results {
			fmt.Printf("  %-6d | %-12s | %-12s | $%10.2f | %8d km\n",
				car.Year, car.Make, car.Model, car.Price, car.Mileage)

			err := analyzer.PostCarToBackend(car)
			if err != nil {
				fmt.Printf("    ⚠️ Backend: %v\n", err)
			}
			count++
		}

		c.Close()
		totalCount += count
		fmt.Printf("  ✅ Found %d listings for %s %s\n", count, target.Make, target.Model)

		// Anti-Ban: Random delay before next target (30-60 seconds)
		if i < len(targets)-1 {
			delay := 30 + rand.Intn(31) // 30-60 seconds
			fmt.Printf("  ⏳ Cooling down for %d seconds to avoid detection...\n", delay)
			time.Sleep(time.Duration(delay) * time.Second)
		}
	}

	fmt.Println("\n" + strings.Repeat("=", 60))
	fmt.Printf("🎯 HUNT COMPLETE. Total Records: %d across %d models\n", totalCount, len(targets))
	fmt.Println(strings.Repeat("=", 60) + "\n")
}
