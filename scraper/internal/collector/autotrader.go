package collector

import (
	"fmt"
	"log"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/SoroushRF/Undercut/scraper/internal/model"
	"github.com/playwright-community/playwright-go"
)

type AutoTraderCollector struct {
	pw      *playwright.Playwright
	browser playwright.Browser
}

func NewAutoTraderCollector() (*AutoTraderCollector, error) {
	pw, err := playwright.Run()
	if err != nil {
		return nil, fmt.Errorf("could not start playwright: %v", err)
	}

	// Headless is TRUE for Docker compatibility
	browser, err := pw.Chromium.Launch(playwright.BrowserTypeLaunchOptions{
		Headless: playwright.Bool(true),
		Args: []string{
			"--disable-blink-features=AutomationControlled",
			"--no-sandbox",
			"--disable-dev-shm-usage",
		},
	})
	if err != nil {
		return nil, fmt.Errorf("could not launch browser: %v", err)
	}

	return &AutoTraderCollector{
		pw:      pw,
		browser: browser,
	}, nil
}

func (c *AutoTraderCollector) Close() {
	if c.browser != nil {
		c.browser.Close()
	}
	if c.pw != nil {
		c.pw.Stop()
	}
}

func (c *AutoTraderCollector) Scrape(make, modelName string, results chan<- model.CarListing) {
	defer close(results)

	context, err := c.browser.NewContext(playwright.BrowserNewContextOptions{
		UserAgent: playwright.String("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"),
		Viewport: &playwright.Size{
			Width:  1920,
			Height: 1080,
		},
	})
	if err != nil {
		log.Printf("❌ Could not create browser context: %v", err)
		return
	}
	defer context.Close()

	page, err := context.NewPage()
	if err != nil {
		log.Printf("❌ Could not create page: %v", err)
		return
	}

	// 🕵️ ULTRA STEALTH: Mask the browser to bypass anti-bot
	_ = page.AddInitScript(playwright.Script{
		Content: playwright.String(`
			Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
			Object.defineProperty(navigator, 'languages', {get: () => ['en-US', 'en']});
			Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3, 4, 5]});
			window.chrome = { runtime: {} };
			// Add more properties to look real
			Object.defineProperty(navigator, 'hardwareConcurrency', {get: () => 8});
			Object.defineProperty(navigator, 'deviceMemory', {get: () => 8});
		`),
	})

	// 1. Warm up session
	fmt.Println("⏳ Warming up session (Home Page)...")
	if _, err := page.Goto("https://www.autotrader.ca", playwright.PageGotoOptions{
		WaitUntil: playwright.WaitUntilStateCommit,
		Timeout:   playwright.Float(45000), // Increase timeout for heavy page
	}); err != nil {
		log.Printf("❌ Home page load failed: %v", err)
	}
	time.Sleep(5 * time.Second)

	// 2. Navigate to results using path-based URL (proven to work)
	pathMake := strings.ToLower(strings.ReplaceAll(make, " ", "-"))
	pathModel := strings.ToLower(strings.ReplaceAll(modelName, " ", "-"))
	targetURL := fmt.Sprintf("https://www.autotrader.ca/cars/%s/%s/on/toronto/", pathMake, pathModel)

	fmt.Printf("🎯 Targeting: %s %s in Toronto (%s)...\n", make, modelName, targetURL)

	if _, err := page.Goto(targetURL, playwright.PageGotoOptions{
		WaitUntil: playwright.WaitUntilStateDomcontentloaded,
		Timeout:   playwright.Float(60000),
	}); err != nil {
		log.Printf("❌ Navigation failed: %v", err)
		return
	}

	// 3. Handle Cookie Banner and Modals
	fmt.Println("⏳ Checking for overlays...")

	// Accept Cookies
	cookieBtn := "#onetrust-accept-btn-handler, button:has-text('Accept')"
	_ = page.Click(cookieBtn, playwright.PageClickOptions{Timeout: playwright.Float(3000)})

	// Close "Discover What's New" modal if it exists
	modalBtn := "button:has-text('Skip intro'), button:has-text('See what’s new')"
	if err := page.Click(modalBtn, playwright.PageClickOptions{Timeout: playwright.Float(3000)}); err == nil {
		fmt.Println("✅ Dismissed onboarding modal.")
	}

	// 4. Scroll to trigger lazy loading and look human
	fmt.Println("⏳ Scrolling for results...")
	for i := 0; i < 3; i++ {
		_, _ = page.Evaluate(`window.scrollBy(0, 500)`)
		time.Sleep(1 * time.Second)
	}

	// 5. Wait for results
	fmt.Println("⏳ Waiting for car listings...")
	_, err = page.WaitForSelector(".result-item, article", playwright.PageWaitForSelectorOptions{
		Timeout: playwright.Float(30000),
	})
	if err != nil {
		title, _ := page.Title()
		log.Printf("❌ Results did not appear. Title: %s", title)

		_, _ = page.Screenshot(playwright.PageScreenshotOptions{
			Path: playwright.String("debug_error.png"),
		})
		return
	}

	// Extract data
	elements, _ := page.QuerySelectorAll(".result-item, article")
	fmt.Printf("📊 Found %d potential cars. Extracting details...\n", len(elements))

	for _, el := range elements {
		titleEl, _ := el.QuerySelector(".result-title, h2, h3, [data-testid='listing-title']")
		var title string
		if titleEl != nil {
			title, _ = titleEl.InnerText()
		}

		if title == "" {
			continue
		}

		// 🛡️ STRICT FILTERING: AutoTrader shows "sponsored" or "similar" cars.
		// Ensure the title actually contains the model we want.
		if !strings.Contains(strings.ToLower(title), strings.ToLower(modelName)) {
			continue
		}

		text, _ := el.InnerText()
		text = strings.ToLower(text)

		var url string
		linkEl, _ := el.QuerySelector("a.result-title-link, a[href*='/a/'], a[data-testid='listing-link']")
		if linkEl != nil {
			href, _ := linkEl.GetAttribute("href")
			if href != "" {
				if strings.HasPrefix(href, "http") {
					url = href
				} else {
					url = "https://www.autotrader.ca" + href
				}
			}
		}

		car := model.CarListing{
			Title:     strings.TrimSpace(title),
			SourceURL: url,
			ScrapedAt: time.Now(),
			Make:      make,
			Model:     modelName,
			Currency:  "CAD",
		}

		// Better Price Detection
		priceEl, _ := el.QuerySelector(".price-amount, .listing-price, .hero-price")
		var priceStr string
		if priceEl != nil {
			priceStr, _ = priceEl.InnerText()
		} else {
			priceStr = text
		}
		car.Price = extractPrice(priceStr)

		// Better Mileage Detection
		mileageEl, _ := el.QuerySelector(".odometer, .kms, .listing-kms")
		var mileageStr string
		if mileageEl != nil {
			mileageStr, _ = mileageEl.InnerText()
		} else {
			mileageStr = text
		}
		car.Mileage = extractMileage(mileageStr)

		car.Year = extractYear(title)
		car.BodyType = extractBodyType(text)

		// Simple filtering
		if car.Price > 500 && car.Year > 0 {
			results <- car
		}
	}
}

// Internal Helper Functions
func extractPrice(raw string) float64 {
	// Find all price-like patterns
	re := regexp.MustCompile(`\$([0-9,]+)`)
	matches := re.FindAllStringSubmatch(raw, -1)

	maxPrice := 0.0
	for _, m := range matches {
		if len(m) > 1 {
			clean := strings.ReplaceAll(m[1], ",", "")
			val, _ := strconv.ParseFloat(clean, 64)
			// We want the total price, which is almost always the largest value found
			// (Avoiding weekly payments like $150)
			if val > maxPrice {
				maxPrice = val
			}
		}
	}
	return maxPrice
}

func extractMileage(raw string) int {
	raw = strings.ToLower(raw)
	// Remove "km away" to avoid matching distance instead of mileage
	raw = regexp.MustCompile(`[0-9,.]+\s*km\s*away`).ReplaceAllString(raw, "")

	// Robust mileage regex: captures numbers, commas, and decimals followed by a unit
	re := regexp.MustCompile(`([0-9,.]+)\s*(km|kilometers|k)\b`)
	matches := re.FindAllStringSubmatch(raw, -1)

	maxMileage := 0
	for _, match := range matches {
		valStr := strings.ReplaceAll(match[1], ",", "")
		unit := match[2]

		val, err := strconv.ParseFloat(valStr, 64)
		if err != nil {
			continue
		}

		mileage := int(val)
		if unit == "k" {
			mileage = int(val * 1000)
		}

		if mileage > maxMileage {
			maxMileage = mileage
		}
	}
	return maxMileage
}

func extractYear(title string) int {
	re := regexp.MustCompile(`(20|19)\d{2}`)
	match := re.FindString(title)
	if match != "" {
		val, _ := strconv.Atoi(match)
		return val
	}
	return 0
}

func extractBodyType(raw string) string {
	raw = strings.ToLower(raw)
	// Priority list: most specific first
	bodyTypes := []struct {
		key      string
		patterns []string
	}{
		{"SUV", []string{"suv", "crossover"}},
		{"Hatchback", []string{"hatchback", "hatch"}},
		{"Coupe", []string{"coupe", "2 dr", "2dr"}},
		{"Sedan", []string{"sedan", "4 dr", "4dr"}},
		{"Truck", []string{"truck", "pickup"}},
		{"Convertible", []string{"convertible", "cabriolet", "soft top"}},
		{"Wagon", []string{"wagon", "estate"}},
		{"Van", []string{"van", "minivan"}},
	}

	for _, bt := range bodyTypes {
		for _, pattern := range bt.patterns {
			// Check for word boundaries to avoid partial matches (e.g., "hatch" inside "thatch")
			re := regexp.MustCompile(`\b` + regexp.QuoteMeta(pattern) + `\b`)
			if re.MatchString(raw) {
				return bt.key
			}
		}
	}
	return ""
}
