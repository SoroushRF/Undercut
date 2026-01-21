package collectors

import (
	"context"
	"crypto/md5"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/SoroushRF/Undercut/scraper/models"
	"github.com/chromedp/cdproto/network"
	"github.com/chromedp/chromedp"
)

// StartAutoTraderScraper uses Chromedp to bypass WAF/JS challenges
func StartAutoTraderScraper(results chan<- models.CarListing) {
	defer close(results)

	// 1. Setup Chromedp Context with enhanced stealth
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("headless", true),
		chromedp.Flag("disable-gpu", true),
		chromedp.Flag("no-sandbox", true),
		chromedp.Flag("disable-blink-features", "AutomationControlled"),
		chromedp.UserAgent(GetRandomUserAgent()),
	)

	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel()

	ctx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()

	// 2. Visit AutoTrader
	fmt.Println("🔍 The Hunter is stalking AutoTrader.ca...")
	targetURL := "https://www.autotrader.ca/cars/on/toronto/"

	var scrapedData []struct {
		Text string `json:"text"`
		URL  string `json:"url"`
	}

	err := chromedp.Run(ctx,
		network.Enable(),
		chromedp.Navigate(targetURL),
		chromedp.WaitReady(`body`),
		chromedp.Sleep(5*time.Second), // Allow JS challenges to settle
		chromedp.WaitVisible(`.result-item, .listing-details, #search-results`, chromedp.ByQuery),
		chromedp.Evaluate(`
			Array.from(document.querySelectorAll('.result-item, .listing-details')).map(el => {
				const linkEl = el.querySelector('a[href*="/a/"]');
				return {
					text: el.innerText,
					url: linkEl ? linkEl.href : ""
				};
			})
		`, &scrapedData),
	)

	if err != nil {
		log.Printf("❌ Stalking failed: %v", err)
		return
	}

	// 3. Process extracted data with "Fuzzy Logic" and "Robust ID"
	for _, data := range scrapedData {
		lines := strings.Split(data.Text, "\n")
		if len(lines) == 0 {
			continue
		}

		var car models.CarListing
		car.Title = strings.TrimSpace(lines[0])
		car.SourceURL = data.URL

		car.Price = CleanPrice(data.Text)
		car.Mileage = CleanMileage(data.Text)

		if car.SourceURL != "" {
			car.ID = extractAutoTraderID(car.SourceURL)
		}

		if car.Price > 0 && car.Mileage > 0 && car.Title != "" {
			results <- car
		}
	}
}

func extractAutoTraderID(url string) string {
	if strings.Contains(url, "/5_") {
		parts := strings.Split(url, "/")
		for _, p := range parts {
			if strings.HasPrefix(p, "5_") {
				return p
			}
		}
	}
	hash := md5.Sum([]byte(url))
	return fmt.Sprintf("%x", hash)
}
