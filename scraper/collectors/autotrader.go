package collectors

import (
	"context"
	"crypto/md5"
	"fmt"
	"log"
	"math/rand"
	"strings"
	"time"

	"github.com/SoroushRF/Undercut/scraper/models"
	"github.com/chromedp/cdproto/network"
	"github.com/chromedp/chromedp"
)

// StartAutoTraderScraper - Simple, Working, and Human-Like Scraper
func StartAutoTraderScraper(results chan<- models.CarListing) {
	defer close(results)

	// 1. Setup Browser Allocator with Essential Stealth Flags
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("headless", true), // Headless for clean execution
		chromedp.Flag("disable-gpu", true),
		chromedp.Flag("no-sandbox", true),
		// 🟢 Essential: Hides automation detection
		chromedp.Flag("disable-blink-features", "AutomationControlled"),
		chromedp.UserAgent(GetRandomUserAgent()),
	)

	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel()

	ctx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()

	// 2. Set Target and Start Session
	targetURL := "https://www.autotrader.ca/cars/on/toronto/"
	fmt.Printf("🔍 The Hunter is seeking deals at: %s\n", targetURL)

	var scrapedData []struct {
		Text  string `json:"text"`
		Title string `json:"title"`
		URL   string `json:"url"`
	}

	// 3. Human-pattern navigation & extraction
	err := chromedp.Run(ctx,
		network.Enable(),
		// Visit home first (Polite & Stealthy)
		chromedp.Navigate("https://www.autotrader.ca"),
		chromedp.Sleep(time.Duration(3+rand.Intn(2))*time.Second),

		// Navigate to results
		chromedp.Navigate(targetURL),

		// Wait for content
		chromedp.WaitVisible(`.result-item, .listing-details`, chromedp.ByQuery),
		chromedp.Sleep(3*time.Second),

		// Quantitative Extraction via JS
		chromedp.Evaluate(`
			Array.from(document.querySelectorAll('.result-item, .listing-details')).map(el => {
				const titleEl = el.querySelector('h2, .result-title, .listing-title');
				const linkEl = el.querySelector('a[href*="/a/"]');
				return {
					text: el.innerText,
					title: titleEl ? titleEl.innerText : "",
					url: linkEl ? linkEl.href : ""
				};
			})
		`, &scrapedData),
	)

	if err != nil {
		log.Printf("❌ Connection Issue: %v", err)
		return
	}

	// 4. Process the Bounty
	for _, data := range scrapedData {
		if data.Text == "" {
			continue
		}

		var car models.CarListing
		car.SourceURL = data.URL
		car.Title = strings.TrimSpace(data.Title)

		// Fallback title if necessary
		if car.Title == "" {
			lines := strings.Split(data.Text, "\n")
			for _, l := range lines {
				if strings.TrimSpace(l) != "" {
					car.Title = strings.TrimSpace(l)
					break
				}
			}
		}

		// Math Extraction
		car.Price = CleanPrice(data.Text)
		car.Mileage = CleanMileage(data.Text)

		// Unique ID Strategy
		if car.SourceURL != "" {
			car.ID = extractAutoTraderID(car.SourceURL)
		} else {
			h := md5.Sum([]byte(car.Title + data.Text))
			car.ID = fmt.Sprintf("%x", h)
		}

		// Validation
		if car.Price > 0 && car.Mileage > 0 && car.Title != "" {
			results <- car
		}
	}
}

// extractAutoTraderID pulls the numerical ID or hashes URL
func extractAutoTraderID(url string) string {
	if strings.Contains(url, "5_") {
		parts := strings.Split(url, "/")
		for _, p := range parts {
			if strings.HasPrefix(p, "5_") {
				return p
			}
		}
	}
	h := md5.Sum([]byte(url))
	return fmt.Sprintf("%x", h)
}
