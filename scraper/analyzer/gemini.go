package analyzer // Define the package name for the analyzer module

import ( // Start the list of required external and internal dependencies
	"context" // Context package to manage timeouts and request lifecycles
	"fmt"     // Package for formatted I/O like string formatting

	"github.com/SoroushRF/Undercut/scraper/models" // Custom data models for car listings
	"github.com/google/generative-ai-go/genai"     // Official Google SDK for Gemini AI
	"google.golang.org/api/option"                 // Package to provide configuration options to Google APIs
) // End of dependency imports

// AnalyzeGems - The Detective's Brain: This function processes car listings through Gemini AI
func AnalyzeGems(cars []models.CarListing) (string, error) { // Accept a slice of cars and return the AI verdict as a string
	// Re-verifying the key provided by the user
	apiKey := "" // Variable to store the Google AI API key (currently empty for security)

	if apiKey == "" { // Check if the API key variable is empty
		return "⚠️ [Detective Note]: API Key is missing!", nil // Inform the user that the Detective can't work without a key
	} // End of API key validation check

	ctx := context.Background()                                    // Create a base background context for the AI request
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey)) // Initialize the Gemini client using the provided API key
	if err != nil {                                                // Check if the client failed to initialize
		return "", err // Return the connection error back to the main program
	} // End of client initialization check
	defer client.Close() // Ensure the connection to Google is closed once the function finishes

	// Using gemini-flash-latest based on discovery results
	model := client.GenerativeModel("gemini-flash-latest") // Select the high-speed "Flash" model for real-time analysis

	var dataToAnalyze string // Initialize a string buffer to hold the listing data for the prompt
	if len(cars) == 0 {      // Check if the scraper actually found any cars to analyze
		return "🕵️ No data collected. The Detective has nothing to investigate!", nil // Notify if the dataset is empty
	} // End of data presence check

	for i, car := range cars { // Loop through each car listing gathered by the scraper
		dataToAnalyze += fmt.Sprintf("[%d] %s | $%.2f | %d km | %s\n", // Format each car's details into a readable list
			i+1, car.Title, car.Price, car.Mileage, car.SourceURL) // Map index, title, price, mileage, and URL to the string
	} // End of car listing iteration loop

	prompt := fmt.Sprintf(` // Create the structured instructions (prompt) for the AI
Analyze these car listings and find the single best "Underpriced Gem" based on Price vs Mileage. // Instruction core

LISTINGS: // Header for the dataset
%s // Inject the formatted car data here

FORMAT: // Instruction on how the output should look
🏆 THE GEM: [Title] // Headline for the best deal
💰 PRICE: $[Price] // Price point of the deal
📏 SPECS: [Mileage] // Mileage of the deal
🕵️ ANALYSIS: Why this is a deal. // Narrative explanation of the value
`, dataToAnalyze) // Close the prompt string and inject dataToAnalyze

	resp, err := model.GenerateContent(ctx, genai.Text(prompt)) // Send the full prompt to Gemini for processing
	if err != nil {                                             // Check if the AI request failed or timed out
		return fmt.Sprintf("❌ AI Analysis failed: %v", err), nil // Return a readable error message
	} // End of AI response check

	if len(resp.Candidates) == 0 { // Check if the AI returned zero response options
		return "🕵️ No verdict reached.", nil // Return a fallback message if Gemini stayed silent
	} // End of response candidate check

	var result string                                       // Initialize the string to hold the final AI text
	for _, part := range resp.Candidates[0].Content.Parts { // Iterate through the parts of the first AI response
		result += fmt.Sprintf("%v", part) // Append each part of the response to our result string
	} // End of response content iteration

	return result, nil // Return the final detective's verdict string to the caller
} // End of AnalyzeGems function
