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

// StartAutoTraderScraper - Stable & Verified Detective Search
func StartAutoTraderScraper(results chan<- models.CarListing, make, model string) {
	defer close(results)

	// 1. Setup Browser Allocator
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("headless", false),
		chromedp.Flag("disable-gpu", true),
		chromedp.Flag("no-sandbox", true),
		chromedp.Flag("disable-blink-features", "AutomationControlled"),
		chromedp.UserAgent(GetRandomUserAgent()),
	)

	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel()

	ctx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()

	// 🟢 LONG TIMEOUT: Essential for manual CAPTCHA solving
	ctx, cancel = context.WithTimeout(ctx, 300*time.Second)
	defer cancel()

	targetURL := fmt.Sprintf("https://www.autotrader.ca/cars/?loc=Toronto&make=%s&model=%s", make, model)
	fmt.Printf("🔍 The Hunter is targeting: %s %s in Toronto\n", make, model)

	var scrapedData []struct {
		Text  string `json:"text"`
		Title string `json:"title"`
		URL   string `json:"url"`
	}

	// 2. Simple & Stable Navigation
	fmt.Println("⏳ Warming up session...")
	err := chromedp.Run(ctx,
		network.Enable(),
		chromedp.Navigate("https://www.autotrader.ca"),
		chromedp.Sleep(2*time.Second),
	)

	fmt.Println("🚀 Navigating to results page...")
	err = chromedp.Run(ctx,
		chromedp.Navigate(targetURL),
		// Wait for results OR the blocking frame
		chromedp.WaitVisible(`.result-item, .listing-details, #main-iframe`, chromedp.ByQuery),
	)

	if err != nil {
		log.Printf("❌ Navigation Error (Check Chrome window for CAPTCHA): %v", err)
		return
	}

	fmt.Println("📊 Intelligence stream active. Extracting...")
	err = chromedp.Run(ctx,
		chromedp.Sleep(4*time.Second),
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
		log.Printf("❌ Extraction Failed: %v", err)
		return
	}

	// 3. Data Processing
	for _, data := range scrapedData {
		var car models.CarListing
		car.Title = strings.TrimSpace(data.Title)
		car.SourceURL = data.URL
		car.Price = CleanPrice(data.Text)
		car.Mileage = CleanMileage(data.Text)

		if car.SourceURL != "" {
			car.ID = extractAutoTraderID(car.SourceURL)
		} else {
			h := md5.Sum([]byte(car.Title + data.Text))
			car.ID = fmt.Sprintf("%x", h)
		}

		// Keep the requested Price Filter
		if car.Price > 2500 && car.Mileage > 0 && car.Title != "" {
			results <- car
		}
	}
}

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
