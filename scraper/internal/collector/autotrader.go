package collector

import (
	"fmt"
	"log"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/SoroushRF/Undercut/scraper/models"
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

func (c *AutoTraderCollector) Scrape(make, modelName string, results chan<- models.CarListing) {
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

	// stealth setup
	_ = page.AddInitScript(playwright.Script{
		Content: playwright.String(`
			Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
			Object.defineProperty(navigator, 'languages', {get: () => ['en-US', 'en']});
			Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3, 4, 5]});
			window.chrome = { runtime: {} };
		`),
	})

	fmt.Println("⏳ Warming up session...")
	if _, err := page.Goto("https://www.autotrader.ca", playwright.PageGotoOptions{
		WaitUntil: playwright.WaitUntilStateCommit,
		Timeout:   playwright.Float(45000),
	}); err != nil {
		log.Printf("❌ Warmup failed: %v", err)
	}
	time.Sleep(3 * time.Second)

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

	cookieBtn := "#onetrust-accept-btn-handler, button:has-text('Accept')"
	_ = page.Click(cookieBtn, playwright.PageClickOptions{Timeout: playwright.Float(3000)})

	// Skip "What's new" popup if it appears
	skipBtn := "button:has-text('Skip intro'), .popup-close, [aria-label='Close']"
	_ = page.Click(skipBtn, playwright.PageClickOptions{Timeout: playwright.Float(3000)})

	for i := 0; i < 3; i++ {
		_, _ = page.Evaluate(`window.scrollBy(0, 500)`)
		time.Sleep(1 * time.Second)
	}

	_, err = page.WaitForSelector(".result-item", playwright.PageWaitForSelectorOptions{
		Timeout: playwright.Float(30000),
	})
	if err != nil {
		log.Printf("❌ Results did not appear.")
		return
	}

	elements, _ := page.QuerySelectorAll(".result-item")
	for _, el := range elements {
		// Better title extraction
		titleEl, _ := el.QuerySelector(".result-title, h2, h3, .listing-title")
		var title string
		if titleEl != nil {
			title, _ = titleEl.InnerText()
		}

		if title == "" || !strings.Contains(strings.ToLower(title), strings.ToLower(modelName)) {
			continue
		}

		// Collect more descriptive text for extraction
		text, _ := el.InnerText()
		specEl, _ := el.QuerySelector(".listing-specs, .item-proxies, .specs")
		specText := ""
		if specEl != nil {
			specText, _ = specEl.InnerText()
		}

		combinedText := strings.ToLower(text + " " + title + " " + specText)

		var url string
		linkEl, _ := el.QuerySelector("a.result-title-link, a[href*='/a/']")
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

		car := models.CarListing{
			Title:     strings.TrimSpace(title),
			SourceURL: url,
			Make:      make,
			Model:     modelName,
			Currency:  "CAD",
		}

		// extraction
		priceEl, _ := el.QuerySelector(".price-amount, .listing-price, .hero-price")
		var priceStr string
		if priceEl != nil {
			priceStr, _ = priceEl.InnerText()
		} else {
			priceStr = text
		}
		car.Price = extractPrice(priceStr)

		mileageEl, _ := el.QuerySelector(".odometer, .kms, .listing-kms")
		var mileageStr string
		if mileageEl != nil {
			mileageStr, _ = mileageEl.InnerText()
		} else {
			mileageStr = text
		}
		car.Mileage = extractMileage(mileageStr)
		car.MileageUnit = "km"

		car.Year = extractYear(title)

		// Advanced extraction
		car.Transmission = extractTransmission(combinedText)
		car.Drivetrain = extractDrivetrain(combinedText)

		car.BodyType = extractBodyType(combinedText)

		if car.Price > 500 && car.Year > 0 {
			results <- car
		}
	}
}

func extractPrice(raw string) float64 {
	re := regexp.MustCompile(`\$([0-9,]+)`)
	matches := re.FindAllStringSubmatch(raw, -1)
	maxPrice := 0.0
	for _, m := range matches {
		if len(m) > 1 {
			clean := strings.ReplaceAll(m[1], ",", "")
			val, _ := strconv.ParseFloat(clean, 64)
			if val > maxPrice {
				maxPrice = val
			}
		}
	}
	return maxPrice
}

func extractMileage(raw string) int {
	raw = strings.ToLower(raw)
	raw = regexp.MustCompile(`[0-9,.]+\s*km\s*away`).ReplaceAllString(raw, "")
	re := regexp.MustCompile(`([0-9,.]+)\s*(km|kilometers|k)\b`)
	matches := re.FindAllStringSubmatch(raw, -1)
	maxMileage := 0
	for _, match := range matches {
		valStr := strings.ReplaceAll(match[1], ",", "")
		unit := match[2]
		val, _ := strconv.ParseFloat(valStr, 64)
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

func extractTransmission(raw string) string {
	if strings.Contains(raw, "automatic") {
		return "Automatic"
	}
	if strings.Contains(raw, "manual") {
		return "Manual"
	}
	return ""
}

func extractDrivetrain(raw string) string {
	if strings.Contains(raw, "awd") {
		return "AWD"
	}
	if strings.Contains(raw, "fwd") {
		return "FWD"
	}
	if strings.Contains(raw, "rwd") {
		return "RWD"
	}
	return ""
}

func extractBodyType(raw string) string {
	raw = strings.ToLower(raw)
	if strings.Contains(raw, "suv") {
		return "SUV"
	}
	if strings.Contains(raw, "sedan") {
		return "Sedan"
	}
	if strings.Contains(raw, "coupe") {
		return "Coupe"
	}
	if strings.Contains(raw, "hatchback") {
		return "Hatchback"
	}
	if strings.Contains(raw, "truck") || strings.Contains(raw, "pickup") {
		return "Truck"
	}
	if strings.Contains(raw, "van") || strings.Contains(raw, "minivan") {
		return "Van"
	}
	if strings.Contains(raw, "wagon") {
		return "Wagon"
	}
	if strings.Contains(raw, "convertible") {
		return "Convertible"
	}
	return ""
}
