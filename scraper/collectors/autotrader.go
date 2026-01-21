package collectors // Package containing all site-specific collectors

import (
	"context"    // For handling timeouts and context-aware operations
	"crypto/md5" // For generating a unique hash ID for listings if needed
	"fmt"        // Formatted I/O
	"log"        // Standard logger
	"strings"    // String manipulation
	"time"       // For time-based delays

	"github.com/SoroushRF/Undercut/scraper/models" // CarListing data structure
	"github.com/chromedp/cdproto/network"          // For low-level browser network control
	"github.com/chromedp/chromedp"                 // Core browser automation library
)

// StartAutoTraderScraper - Orchestrates the browser and extraction logic
func StartAutoTraderScraper(results chan<- models.CarListing, make, model string) { // Takes a results channel and car search parameters
	defer close(results) // Ensure the results channel is closed when the function finishes

	// 1. Setup Browser Allocator with human-like flags
	opts := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("headless", false),                                // Show the browser window (important for CAPTCHAs)
		chromedp.Flag("disable-gpu", true),                              // Common stability flag
		chromedp.Flag("no-sandbox", true),                               // Security bypass for specific environments
		chromedp.Flag("disable-blink-features", "AutomationControlled"), // Hide the "automated" signature
		chromedp.UserAgent(GetRandomUserAgent()),                        // Use a rotating real browser user agent
	)

	// Create a new browser allocator context
	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel() // Cleanup allocator when done

	// Create the browser tab context
	ctx, cancel := chromedp.NewContext(allocCtx)
	defer cancel() // Cleanup tab when done

	// 🟢 LONG TIMEOUT: Essential for manual CAPTCHA solving during a hackathon
	ctx, cancel = context.WithTimeout(ctx, 300*time.Second) // 5-minute timeout window
	defer cancel()

	// Construct the dynamic search URL based on user input
	targetURL := fmt.Sprintf("https://www.autotrader.ca/cars/?loc=Toronto&make=%s&model=%s", make, model)
	fmt.Printf("🔍 The Hunter is targeting: %s %s in Toronto\n", make, model)

	// Temporary slice to hold results from the browser environment
	var scrapedData []struct {
		Text  string `json:"text"`
		Title string `json:"title"`
		URL   string `json:"url"`
	}

	// 2. Simple & Stable Navigation: Visit homepage first to build trust (cookies/session)
	fmt.Println("⏳ Warming up session...")
	err := chromedp.Run(ctx,
		network.Enable(),
		chromedp.Navigate("https://www.autotrader.ca"), // Visit parent site first
		chromedp.Sleep(2*time.Second),                  // Human-like pause after load
	)

	// Navigate to the specific search results page
	fmt.Println("🚀 Navigating to results page...")
	err = chromedp.Run(ctx,
		chromedp.Navigate(targetURL),
		// Wait for actual results OR the blocking CAPTCHA iframe to appear
		chromedp.WaitVisible(`.result-item, .listing-details, #main-iframe`, chromedp.ByQuery),
	)

	if err != nil { // Check if we failed to see results within the timeout
		log.Printf("❌ Navigation Error (Check Chrome window for CAPTCHA): %v", err)
		return
	}

	// Extract the raw data using JavaScript execution in the browser
	fmt.Println("📊 Intelligence stream active. Extracting...")
	err = chromedp.Run(ctx,
		chromedp.Sleep(4*time.Second), // Wait for dynamic content to settle
		chromedp.Evaluate(`
			// Select all listing containers and map them to our temporary structure
			Array.from(document.querySelectorAll('.result-item, .listing-details')).map(el => {
				const titleEl = el.querySelector('h2, .result-title, .listing-title');
				const linkEl = el.querySelector('a[href*="/a/"]');
				return {
					text: el.innerText, // Capture all text in the card for price/mileage extraction later
					title: titleEl ? titleEl.innerText : "",
					url: linkEl ? linkEl.href : ""
				};
			})
		`, &scrapedData), // Bind the browser result to our Go slice
	)

	if err != nil {
		log.Printf("❌ Extraction Failed: %v", err)
		return
	}

	// 3. Data Processing: Clean the raw text into structured Go objects
	for _, data := range scrapedData {
		var car models.CarListing
		car.Title = strings.TrimSpace(data.Title) // Clean whitespace from title
		car.SourceURL = data.URL                  // Store original link
		car.Price = CleanPrice(data.Text)         // Extract price from card text using regex
		car.Mileage = CleanMileage(data.Text)     // Extract mileage from card text using regex

		// Unique ID generation for deduplication
		if car.SourceURL != "" {
			car.ID = extractAutoTraderID(car.SourceURL) // Prefer using the actual AutoTrader listing ID
		} else {
			h := md5.Sum([]byte(car.Title + data.Text)) // Fallback to MD5 hash if URL is missing
			car.ID = fmt.Sprintf("%x", h)
		}

		// Keep the requested filters: Only send real, priced deals to the main loop
		if car.Price > 2500 && car.Mileage > 0 && car.Title != "" {
			results <- car // Stream result back to the UI/Main processor
		}
	}
}

// Helper to extract the specific numeric ID from AutoTrader's URL structure
func extractAutoTraderID(url string) string {
	if strings.Contains(url, "5_") { // Look for their typical ID pattern
		parts := strings.Split(url, "/")
		for _, p := range parts {
			if strings.HasPrefix(p, "5_") {
				return p // Return the "5_xxxxxxx" ID
			}
		}
	}
	h := md5.Sum([]byte(url)) // MD5 fallback for safety
	return fmt.Sprintf("%x", h)
}
