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

// StartAutoTraderScraper - Optimized for Targeted Quantitative Extraction
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

	// 2. Create Context
	ctx, cancel := chromedp.NewContext(allocCtx)
	defer cancel()

	ctx, cancel = context.WithTimeout(ctx, 90*time.Second)
	defer cancel()

	// 🟢 Targeting specific make and model
	targetURL := fmt.Sprintf("https://www.autotrader.ca/cars/?loc=Toronto&make=%s&model=%s", make, model)
	fmt.Printf("🔍 The Hunter is targeting: %s %s in Toronto\n", make, model)

	var scrapedData []struct {
		Text  string `json:"text"`
		Title string `json:"title"`
		URL   string `json:"url"`
	}

	// 3. Execution with detailed logging
	fmt.Println("⏳ Warming up session (visiting home page)...")
	err := chromedp.Run(ctx,
		network.Enable(),
		chromedp.Navigate("https://www.autotrader.ca"),
		chromedp.Sleep(2*time.Second),
	)
	if err != nil {
		log.Printf("❌ Warup Failed: %v", err)
		return
	}

	fmt.Println("🚀 Navigating to results page...")
	err = chromedp.Run(ctx,
		chromedp.Navigate(targetURL),
		// Wait specifically for either the results OR the error frame
		chromedp.WaitVisible(`.result-item, .listing-details, #main-iframe`, chromedp.ByQuery),
	)
	if err != nil {
		log.Printf("❌ Navigation/Wait Failed: %v", err)
		return
	}

	fmt.Println("📊 Page content detected! Extracting data...")
	err = chromedp.Run(ctx,
		chromedp.Sleep(3*time.Second), // Let JS settle
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

	// 4. Processing
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

		if car.Price > 0 && car.Mileage > 0 && car.Title != "" {
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
