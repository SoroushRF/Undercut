package main

import (
	"fmt"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/SoroushRF/Undercut/scraper/analyzer"
	"github.com/SoroushRF/Undercut/scraper/collectors"
	"github.com/SoroushRF/Undercut/scraper/models"
)

func main() {
	header := `
  🕵️  THE DETECTIVE: Live Car Value Analysis
  ==========================================
  Powered by Undercut & Gemini AI
  ==========================================
  `
	fmt.Println(header)

	// Detective Target Configuration
	targetMake := "Mazda"
	targetModel := "3"

	fmt.Printf("🔍 Detective Input: %s %s | Location: Toronto\n", targetMake, targetModel)
	fmt.Println("🕵️  Wait a moment while I infiltrate the market and gather intel...")

	results := make(chan models.CarListing)
	var cars []models.CarListing
	count := 0
	seen := make(map[string]bool)

	// Launch Top 20 "On Demand" Scrape
	go collectors.StartAutoTraderScraper(results, targetMake, targetModel)

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	// Data Collection Phase
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
			count++

			// Visual progress for the Hackathon
			fmt.Printf("✅ Intel Gathered: %s ($%.2f)\n", car.Title, car.Price)

			// Collect top 20 for analysis
			if count >= 20 {
				break L
			}

		case <-sigChan:
			fmt.Println("\n\n🛑 Investigation Aborted.")
			os.Exit(0)

		case <-time.After(300 * time.Second):
			if count > 0 {
				break L
			}
			fmt.Println("\n⌛ The trail went cold. (Timeout)")
			break L
		}
	}

	fmt.Printf("\n📉 Raw Data Collected: %d listings.\n", count)
	fmt.Println("🧠 Handing over intel to Gemini for deep value analysis...")
	fmt.Println(strings.Repeat("-", 45))

	// Analysis Phase
	verdict, err := analyzer.AnalyzeGems(cars)
	if err != nil {
		fmt.Printf("❌ Detective's Brain Freeze: %v\n", err)
	} else {
		fmt.Println("\n" + verdict)
	}

	fmt.Println("\n" + strings.Repeat("=", 45))
	fmt.Printf("🎯 INVESTIGATION COMPLETE | %s\n", time.Now().Format("15:04:05"))
	fmt.Println(strings.Repeat("=", 45))
}
