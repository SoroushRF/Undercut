package analyzer

import (
	"context"
	"fmt"

	"github.com/SoroushRF/Undercut/scraper/models"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

// AnalyzeGems - The Detective's Brain
func AnalyzeGems(cars []models.CarListing) (string, error) {
	// Re-verifying the key provided by the user
	apiKey := ""

	if apiKey == "" {
		return "⚠️ [Detective Note]: API Key is missing!", nil
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return "", err
	}
	defer client.Close()

	// Using gemini-flash-latest based on discovery results
	model := client.GenerativeModel("gemini-flash-latest")

	var dataToAnalyze string
	if len(cars) == 0 {
		return "🕵️ No data collected. The Detective has nothing to investigate!", nil
	}

	for i, car := range cars {
		dataToAnalyze += fmt.Sprintf("[%d] %s | $%.2f | %d km | %s\n",
			i+1, car.Title, car.Price, car.Mileage, car.SourceURL)
	}

	prompt := fmt.Sprintf(`
Analyze these car listings and find the single best "Underpriced Gem" based on Price vs Mileage.

LISTINGS:
%s

FORMAT:
🏆 THE GEM: [Title]
💰 PRICE: $[Price]
📏 SPECS: [Mileage]
🕵️ ANALYSIS: Why this is a deal.
`, dataToAnalyze)

	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return fmt.Sprintf("❌ AI Analysis failed: %v", err), nil
	}

	if len(resp.Candidates) == 0 {
		return "🕵️ No verdict reached.", nil
	}

	var result string
	for _, part := range resp.Candidates[0].Content.Parts {
		result += fmt.Sprintf("%v", part)
	}

	return result, nil
}
