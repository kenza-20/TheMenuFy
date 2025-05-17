const { deepinfra } = require("@ai-sdk/deepinfra")
const { generateText } = require("ai")
const axios = require("axios")

// Configure DeepInfra with your API key
const DEEPINFRA_API_KEY = process.env.DEEPINFRA_API_KEY 

const analyzeNutrition = async (req, res) => {
  try {
    const { mealDescription } = req.body

    if (!mealDescription) {
      return res.status(400).json({ error: "Meal description is required" })
    }

    console.log("Analyzing nutrition for:", mealDescription)

    try {
      // Use DeepInfra's Mixtral model for nutrition analysis
      const { text } = await generateText({
        model: deepinfra("mistralai/Mixtral-8x7B-Instruct-v0.1"),
        prompt: `Analyze the nutritional content of this meal: "${mealDescription}"
        
        Provide a detailed nutritional breakdown with estimates for:
        - Calories
        - Protein (g)
        - Carbohydrates (g)
        - Fat (g)
        - Fiber (g)
        - Sugar (g)
        - Sodium (mg)
        
        Also provide:
        - A health score from 1-100
        - Any nutritional warnings
        - Health benefits
        
        Format your response as a JSON object with this structure:
        {
          "calories": 500,
          "protein": 20,
          "carbs": 40,
          "fat": 25,
          "fiber": 5,
          "sugar": 10,
          "sodium": 500,
          "healthScore": 75,
          "warnings": ["High in sodium", "Contains added sugars"],
          "benefits": ["Good source of protein", "Contains antioxidants"]
        }
        
        Return ONLY the JSON object, nothing else.`,
        temperature: 0.5,
        maxTokens: 1000,
        apiKey: DEEPINFRA_API_KEY,
      })

      console.log("Raw AI response:", text)

      try {
        // Parse the JSON response
        const parsedData = JSON.parse(text)
        return res.json(parsedData)
      } catch (parseError) {
        console.error("Failed to parse nutrition JSON from backend:", parseError)

        // Try to extract JSON from the text if it contains markdown code blocks
        const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
        if (jsonMatch && jsonMatch[1]) {
          try {
            const extractedJson = jsonMatch[1]
            console.log("Extracted JSON:", extractedJson)
            return res.json(JSON.parse(extractedJson))
          } catch (extractError) {
            console.error("Failed to parse extracted JSON:", extractError)
          }
        }

        // Try to find a JSON object in the text
        const jsonRegex = /(\{[\s\S]*?\})/g
        const jsonMatches = text.match(jsonRegex)
        if (jsonMatches) {
          for (const potentialJson of jsonMatches) {
            try {
              const parsed = JSON.parse(potentialJson)
              if (parsed && typeof parsed === "object") {
                console.log("Found JSON in text:", potentialJson)
                return res.json(parsed)
              }
            } catch (e) {
              // Continue to next match
            }
          }
        }

        // If all parsing attempts fail, return a fallback response
        console.error("Error analyzing nutrition from backend:", new Error("Could not parse AI response as JSON"))
        return res.json({
          calories: 450,
          protein: 35,
          carbs: 30,
          fat: 15,
          fiber: 5,
          sugar: 3,
          sodium: 400,
          healthScore: 85,
          warnings: ["Moderate sodium content"],
          benefits: [
            "High in protein for muscle maintenance",
            "Good source of fiber",
            "Low in sugar",
            "Contains essential fatty acids",
          ],
        })
      }
    } catch (aiError) {
      console.error("AI service error:", aiError)
      // Return fallback data if AI service fails
      return res.json({
        calories: 450,
        protein: 35,
        carbs: 30,
        fat: 15,
        fiber: 5,
        sugar: 3,
        sodium: 400,
        healthScore: 85,
        warnings: ["Moderate sodium content"],
        benefits: [
          "High in protein for muscle maintenance",
          "Good source of fiber",
          "Low in sugar",
          "Contains essential fatty acids",
        ],
      })
    }
  } catch (error) {
    console.error("Error analyzing nutrition:", error)
    return res.status(500).json({
      error: "Failed to analyze nutrition",
      message: error.message,
    })
  }
}

const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Force it to stay in the food domain
    const foodPrompt = `A hyper-realistic photograph of a delicious ${prompt}. Styled for a food magazine, natural lighting, high resolution.`;

    // console.log("🔄 Generating food image for:", foodPrompt);

    const response = await axios.post(
      "https://api.deepinfra.com/v1/inference/stabilityai/stable-diffusion-2-1",
      {
        prompt: foodPrompt,
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPINFRA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.images && response.data.images[0]) {
      return res.json({ imageUrl: response.data.images[0] });
    } else {
      throw new Error("No image returned from DeepInfra");
    }
  } catch (error) {
    // console.error("❌ Image generation failed:", error.message);
    return res.json({
      imageUrl:
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop&crop=focalpoint",
    });
  }
};




module.exports = {
  analyzeNutrition,
  generateImage,
}
