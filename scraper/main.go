package main

import (
	"fmt"
	"log"

	"github.com/gocolly/colly/v2"
)

func main() {
	c := colly.NewCollector()

	c.OnHTML("title", func(e *colly.HTMLElement) {
		fmt.Println("Title found:", e.Text)
	})

	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting", r.URL)
	})

	log.Println("Scraper started...")
}
