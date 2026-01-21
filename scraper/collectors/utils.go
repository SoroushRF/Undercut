package collectors

import (
	"math/rand"
	"regexp"
	"strconv"
	"strings"
	"time"
)

func GetRandomUserAgent() string {
	userAgents := []string{
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
	}
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	return userAgents[r.Intn(len(userAgents))]
}

// CleanPrice ensures we get a single valid price
func CleanPrice(raw string) float64 {
	// Look for pattern: $ followed by digits/commas/decimals
	// We use [^0-9,.] to stop the match if we hit a space or a year (e.g. "$24,990 2022")
	re := regexp.MustCompile(`\$[ ]*([0-9]{1,3}(,?[0-9]{3})*(\.[0-9]{2})?)`)
	matches := re.FindStringSubmatch(raw)
	if len(matches) < 2 {
		return 0
	}

	clean := strings.NewReplacer("$", "", ",", "", " ", "").Replace(matches[1])
	price, _ := strconv.ParseFloat(clean, 64)
	return price
}

func CleanMileage(raw string) int {
	raw = strings.ToLower(raw)
	// Match numbers before "km" or "kilometers"
	re := regexp.MustCompile(`([0-9]{1,3}(,?[0-9]{3})*|([0-9.]+k))\s?(km|kilometers)`)
	matches := re.FindStringSubmatch(raw)
	if len(matches) < 2 {
		return 0
	}

	valStr := matches[1]
	if strings.Contains(valStr, "k") {
		numStr := strings.ReplaceAll(valStr, "k", "")
		val, _ := strconv.ParseFloat(numStr, 64)
		return int(val * 1000)
	}

	clean := strings.ReplaceAll(valStr, ",", "")
	mileage, _ := strconv.Atoi(clean)
	return mileage
}
