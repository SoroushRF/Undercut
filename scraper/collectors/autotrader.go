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
		return nil, fmt.Errorf("could not start playwright: %w", err)
	}

	browser, err := pw.Chromium.Launch(playwright.BrowserTypeLaunchOptions{
		Headless: playwright.Bool(true),
	})
	if err != nil {
		pw.Stop()
		return nil, fmt.Errorf("could not launch browser: %w", err)
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
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Edge/121.0.0.0",
	}
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	return userAgents[r.Intn(len(userAgents))]
}

func (c *AutoTraderCollector) Scrape(make, modelName string, results chan<- models.CarListing) {
	defer close(results)

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

	// Accept cookies
	cookieBtn := "#onetrust-accept-btn-handler, button:has-text('Accept')"
	_ = page.Click(cookieBtn, playwright.PageClickOptions{Timeout: playwright.Float(3000)})

	// Aggressive human-like scrolling to trigger lazy loading for ALL images
	fmt.Println("🚀 Triggering lazy-load (scrolling)...")
	for i := 0; i < 8; i++ {
		page.Evaluate(fmt.Sprintf("window.scrollTo(0, %d)", (i+1)*1200))
		time.Sleep(800 * time.Millisecond)
	}
	page.Evaluate("window.scrollTo(0, 0)")
	time.Sleep(1 * time.Second)

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
		linkEl, _ := el.QuerySelector("a")
		if linkEl != nil {
			href, _ := linkEl.GetAttribute("href")
			if href != "" {
				if strings.HasPrefix(href, "http") {
					url = href
				} else {
					// Ensure there's exactly one slash between domain and relative path
					href = strings.TrimPrefix(href, "/")
					url = "https://www.autotrader.ca/" + href
				}
			}
		}

		car := models.CarListing{
			ListingURL: url,
			Make:       make,
			Model:      modelName,
			Currency:   "CAD",
		}

		car.VIN = ""

		// Pricing
		priceEl, _ := el.QuerySelector(".price-amount, .listing-price, .hero-price")
		priceStr := ""
		if priceEl != nil {
			priceStr, _ = priceEl.InnerText()
		} else {
			priceStr = text
		}
		car.Price = extractPrice(priceStr)

		// Mileage - look for specific element or check combined text
		mileageEl, _ := el.QuerySelector(".odometer, .kms, .listing-kms, [class*='odometer'], [class*='kms']")
		mileageStr := ""
		if mileageEl != nil {
			mileageStr, _ = mileageEl.InnerText()
		} else {
			mileageStr = combinedText
		}
		car.Mileage = extractMileage(mileageStr)

		car.Year, car.Trim = extractYearAndTrim(title, make, modelName)
		car.Transmission = extractTransmission(combinedText)
		car.Drivetrain = extractDrivetrain(combinedText)
		car.BodyType = extractBodyType(combinedText)

		// Robust Image Extraction
		var imgSrc string
		// Try multiple selectors
		imgEl, _ := el.QuerySelector("img.main-photo, img.result-image, img[src*='media.dealer'], img[src*='autotrader'], picture img, .photo-gallery img, .listing-photo img")
		if imgEl != nil {
			for _, attr := range []string{"src", "data-src", "data-original", "srcset"} {
				val, _ := imgEl.GetAttribute(attr)
				if val != "" {
					if attr == "srcset" {
						val = strings.Split(val, " ")[0]
					}
					imgSrc = val
					break
				}
			}
		}

		// Fallback: check background-image
		if imgSrc == "" {
			divEl, _ := el.QuerySelector(".photo-area, .listing-photo, .image-container")
			if divEl != nil {
				style, _ := divEl.GetAttribute("style")
				if strings.Contains(style, "background-image") {
					re := regexp.MustCompile(`url\(["']?([^"']+)["']?\)`)
					matches := re.FindStringSubmatch(style)
					if len(matches) > 1 {
						imgSrc = matches[1]
					}
				}
			}
		}

		if imgSrc != "" {
			if strings.HasPrefix(imgSrc, "//") {
				imgSrc = "https:" + imgSrc
			} else if strings.HasPrefix(imgSrc, "/") && !strings.HasPrefix(imgSrc, "http") {
				imgSrc = "https://www.autotrader.ca" + imgSrc
			}
			car.ImageURL = imgSrc
		}

		if car.Price > 500 && car.Year > 0 {
			results <- car
		}
	}
}

// --- HELPERS ---

func extractPrice(raw string) float64 {
	re := regexp.MustCompile(`\$([0-9,]+)`)
	matches := re.FindAllStringSubmatch(raw, -1)
	maxPrice := 0.0
	for _, m := range matches {
		if len(m) > 1 {
			p, _ := strconv.ParseFloat(strings.ReplaceAll(m[1], ",", ""), 64)
			if p > maxPrice {
				maxPrice = p
			}
		}
	}
	return maxPrice
}

func extractMileage(raw string) int {
	raw = strings.ToLower(raw)
	// Match numbers followed by km/kms (handles commas, spaces, and no-space)
	re := regexp.MustCompile(`([0-9\s,]+)\s*(km|kms)`)
	match := re.FindStringSubmatch(raw)
	if len(match) > 1 {
		// Clean the number: remove spaces and commas
		cleanNum := strings.ReplaceAll(match[1], ",", "")
		cleanNum = strings.ReplaceAll(cleanNum, " ", "")
		cleanNum = strings.TrimSpace(cleanNum)

		val, _ := strconv.Atoi(cleanNum)
		return val
	}
	return 0
}

func extractYearAndTrim(title, make, modelName string) (int, string) {
	reYear := regexp.MustCompile(`(20\d{2}|19\d{2})`)
	yearMatch := reYear.FindString(title)
	year, _ := strconv.Atoi(yearMatch)

	// Trim is usually what's left after Year, Make, Model
	trim := title
	trim = strings.ReplaceAll(trim, yearMatch, "")
	trim = strings.ReplaceAll(trim, make, "")
	trim = strings.ReplaceAll(trim, modelName, "")
	trim = strings.TrimSpace(trim)

	return year, trim
}

func extractTransmission(text string) string {
	if strings.Contains(text, "manual") {
		return "Manual"
	}
	if strings.Contains(text, "automatic") || strings.Contains(text, "cvt") {
		return "Automatic"
	}
	return "Other"
}

func extractDrivetrain(text string) string {
	if strings.Contains(text, "awd") || strings.Contains(text, "4wd") || strings.Contains(text, "all-wheel") {
		return "AWD"
	}
	if strings.Contains(text, "fwd") || strings.Contains(text, "front-wheel") {
		return "FWD"
	}
	if strings.Contains(text, "rwd") || strings.Contains(text, "rear-wheel") {
		return "RWD"
	}
	return "FWD" // Default for most Toronto cars
}

func extractBodyType(text string) string {
	types := []string{"SUV", "Sedan", "Truck", "Hatchback", "Coupe", "Van"}
	for _, t := range types {
		if strings.Contains(text, strings.ToLower(t)) {
			return t
		}
	}
	return "Sedan"
}
func (c *AutoTraderCollector) generateCarID(url, title, text string) string {
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
