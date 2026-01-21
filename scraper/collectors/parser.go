package collectors

import (
	"regexp"
	"strconv"
	"strings"
)

// ParseTitle extracts Year, Make, Model, and Trim from a raw title string
// Use targetMake and targetModel as hints to pick the right words
func ParseTitle(title string, targetMake, targetModel string) (year int, mk, md, trim string) {
	title = strings.TrimSpace(title)

	// 1. Extract Year
	yearRegex := regexp.MustCompile(`(19|20)\d{2}`)
	yearStr := yearRegex.FindString(title)
	if yearStr != "" {
		year, _ = strconv.Atoi(yearStr)
		title = strings.Replace(title, yearStr, "", 1)
	}

	title = strings.TrimSpace(title)

	// Use targets if they exist in the title
	mk = targetMake
	md = targetModel

	// Remove target make/model from title to find the trim
	tempTitle := title
	if mk != "" {
		tempTitle = regexp.MustCompile("(?i)"+regexp.QuoteMeta(mk)).ReplaceAllString(tempTitle, "")
	}
	if md != "" {
		tempTitle = regexp.MustCompile("(?i)"+regexp.QuoteMeta(md)).ReplaceAllString(tempTitle, "")
	}

	// Clean up words for fallback
	words := strings.Fields(title)
	if len(words) == 0 {
		return
	}

	if mk == "" && len(words) >= 1 {
		mk = words[0]
	}
	if md == "" && len(words) >= 2 {
		md = words[1]
	}

	trim = strings.TrimSpace(tempTitle)
	// Truncate multiple spaces
	trim = regexp.MustCompile(`\s+`).ReplaceAllString(trim, " ")

	return
}
