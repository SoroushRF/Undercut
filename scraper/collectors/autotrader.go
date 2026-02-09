package collectors

import (
	"crypto/md5"
	"fmt"
	"log"
	"math/rand"
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

func getRandomUserAgent() string {
	userAgents := []string{
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
		"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
	}
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	return userAgents[r.Intn(len(userAgents))]
}

func (c *AutoTraderCollector) Scrape(make, modelName string, results chan<- models.CarListing) {
	defer close(results)

	// Improved Stealth Headers
	context, err := c.browser.NewContext(playwright.BrowserNewContextOptions{
		UserAgent: playwright.String(getRandomUserAgent()),
		Viewport: &playwright.Size{
			Width:  1920,
			Height: 1080,
		},
		ExtraHttpHeaders: map[string]string{
			"Accept":                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
			"Accept-Language":           "en-US,en;q=0.9",
			"Sec-Ch-Ua":                 `"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"`,
			"Sec-Ch-Ua-Mobile":          "?0",
			"Sec-Ch-Ua-Platform":        `"Windows"`,
			"Sec-Fetch-Dest":            "document",
			"Sec-Fetch-Mode":            "navigate",
			"Sec-Fetch-Site":            "none",
			"Sec-Fetch-User":            "?1",
			"Upgrade-Insecure-Requests": "1",
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
	// Try a softer warmup (ignore errors if it's just a connection reset)
	_, _ = page.Goto("https://www.autotrader.ca", playwright.PageGotoOptions{
		WaitUntil: playwright.WaitUntilStateCommit,
		Timeout:   playwright.Float(15000),
	})
	time.Sleep(2 * time.Second)

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

	// Accept cookies and skip intro popups
	cookieBtn := "#onetrust-accept-btn-handler, button:has-text('Accept')"
	_ = page.Click(cookieBtn, playwright.PageClickOptions{Timeout: playwright.Float(3000)})
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
		titleEl, _ := el.QuerySelector(".result-title, h2, h3, .listing-title")
		var title string
		if titleEl != nil {
			title, _ = titleEl.InnerText()
		}

		if title == "" || !strings.Contains(strings.ToLower(title), strings.ToLower(modelName)) {
			continue
		}

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

		// ID Generation (from old logic)
		car.ID = generateCarID(url, title, text)

		// Pricing
		priceEl, _ := el.QuerySelector(".price-amount, .listing-price, .hero-price")
		priceStr := ""
		if priceEl != nil {
			priceStr, _ = priceEl.InnerText()
		} else {
			priceStr = text
		}
		car.Price = extractPrice(priceStr)

		// Mileage
		mileageEl, _ := el.QuerySelector(".odometer, .kms, .listing-kms")
		mileageStr := ""
		if mileageEl != nil {
			mileageStr, _ = mileageEl.InnerText()
		} else {
			mileageStr = text
		}
		car.Mileage = extractMileage(mileageStr)
		car.MileageUnit = "km"

		// Year and Trim
		car.Year, car.Trim = extractYearAndTrim(title, make, modelName)

		// Sub-details
		car.Transmission = extractTransmission(combinedText)
		car.Drivetrain = extractDrivetrain(combinedText)
		car.BodyType = extractBodyType(combinedText)

		// filtering
		if car.Price > 500 && car.Year > 0 {
			results <- car
		}
	}
}

// --- MERGED LOGIC HELPERS ---

func generateCarID(url, title, text string) string {
	// Precise ID from URL if available
	if strings.Contains(url, "5_") {
		parts := strings.Split(url, "/")
		for _, p := range parts {
			if strings.HasPrefix(p, "5_") {
				return p
			}
		}
	}
	// Fallback to MD5 hash of unique attributes
	h := md5.Sum([]byte(url + title))
	return fmt.Sprintf("%x", h)
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

func extractYearAndTrim(title string, targetMake, targetModel string) (int, string) {
	title = strings.TrimSpace(title)
	yearRegex := regexp.MustCompile(`(19|20)\d{2}`)
	yearStr := yearRegex.FindString(title)
	year := 0
	if yearStr != "" {
		year, _ = strconv.Atoi(yearStr)
		title = strings.Replace(title, yearStr, "", 1)
	}

	trim := title
	if targetMake != "" {
		trim = regexp.MustCompile("(?i)"+regexp.QuoteMeta(targetMake)).ReplaceAllString(trim, "")
	}
	if targetModel != "" {
		trim = regexp.MustCompile("(?i)"+regexp.QuoteMeta(targetModel)).ReplaceAllString(trim, "")
	}

	trim = strings.TrimSpace(trim)
	trim = regexp.MustCompile(`\s+`).ReplaceAllString(trim, " ")
	return year, trim
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
	types := map[string]string{
		"suv":         "SUV",
		"sedan":       "Sedan",
		"coupe":       "Coupe",
		"hatchback":   "Hatchback",
		"truck":       "Truck",
		"pickup":      "Truck",
		"van":         "Van",
		"minivan":     "Van",
		"wagon":       "Wagon",
		"convertible": "Convertible",
	}
	for key, val := range types {
		if strings.Contains(raw, key) {
			return val
		}
	}
	return ""
}
