const axios = require("axios")

// Function to clean up Wikipedia extract text
const cleanWikipediaText = (text) => {
  return text
    .replace(/$$[^)]*$$/g, "") // Remove content in parentheses
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim()
}

// Function to extract ingredients from text
const extractIngredients = (text) => {
  // Common ingredients that might be mentioned
  const commonIngredients = [
    "rice",
    "flour",
    "wheat",
    "corn",
    "potato",
    "tomato",
    "onion",
    "garlic",
    "beef",
    "chicken",
    "pork",
    "fish",
    "shrimp",
    "lamb",
    "tofu",
    "cheese",
    "milk",
    "cream",
    "butter",
    "oil",
    "egg",
    "salt",
    "pepper",
    "sugar",
    "vinegar",
    "wine",
    "sauce",
    "vegetable",
    "fruit",
    "herb",
    "spice",
  ]

  const ingredients = []
  const lowerText = text.toLowerCase()

  commonIngredients.forEach((ingredient) => {
    if (lowerText.includes(ingredient) && !ingredients.includes(ingredient)) {
      // Capitalize first letter
      ingredients.push(ingredient.charAt(0).toUpperCase() + ingredient.slice(1))
    }
  })

  // If we found less than 3 ingredients, add some generic ones based on cuisine
  if (ingredients.length < 3) {
    if (lowerText.includes("italian")) {
      ingredients.push("Olive Oil", "Tomatoes", "Basil")
    } else if (lowerText.includes("mexican")) {
      ingredients.push("Corn", "Chili Peppers", "Beans")
    } else if (lowerText.includes("indian")) {
      ingredients.push("Rice", "Spices", "Lentils")
    } else if (lowerText.includes("chinese")) {
      ingredients.push("Soy Sauce", "Rice", "Ginger")
    } else if (lowerText.includes("japanese")) {
      ingredients.push("Rice", "Seaweed", "Soy Sauce")
    } else {
      ingredients.push("Regional Spices", "Local Produce", "Traditional Herbs")
    }
  }

  return ingredients.slice(0, 8) // Limit to 8 ingredients
}

// Function to generate fun facts based on text
const generateFunFacts = (text, dishName) => {
  const facts = []
  const lowerText = text.toLowerCase()
  const lowerDishName = dishName.toLowerCase()

  // Check for common patterns and generate facts
  if (lowerText.includes("origin") || lowerText.includes("originated")) {
    facts.push(`${dishName} has origins dating back centuries in its native region.`)
  }

  if (lowerText.includes("tradition") || lowerText.includes("traditional")) {
    facts.push(`${dishName} is often served during traditional celebrations and family gatherings.`)
  }

  if (lowerText.includes("variation") || lowerText.includes("variant")) {
    facts.push(`There are many regional variations of ${dishName} across different communities.`)
  }

  // Add generic facts if we don't have enough
  if (facts.length < 3) {
    facts.push(`The recipe for ${dishName} has evolved significantly over generations.`)
    facts.push(`${dishName} reflects the cultural heritage and available ingredients of its region.`)
    facts.push(`In modern times, ${dishName} has gained popularity beyond its country of origin.`)
  }

  return facts.slice(0, 5) // Limit to 5 facts
}

// Improved cuisine detection function
const detectCuisine = (text, dishName) => {
  // Map of keywords to cuisines
  const cuisineMap = {
    tunisian: "Tunisian",
    tunisia: "Tunisian",
    moroccan: "Moroccan",
    morocco: "Moroccan",
    algerian: "Algerian",
    algeria: "Algerian",
    italian: "Italian",
    italy: "Italian",
    french: "French",
    france: "French",
    chinese: "Chinese",
    china: "Chinese",
    japanese: "Japanese",
    japan: "Japanese",
    indian: "Indian",
    india: "Indian",
    mexican: "Mexican",
    mexico: "Mexican",
    thai: "Thai",
    thailand: "Thai",
    spanish: "Spanish",
    spain: "Spanish",
    greek: "Greek",
    greece: "Greek",
    lebanese: "Lebanese",
    lebanon: "Lebanese",
    turkish: "Turkish",
    turkey: "Turkish",
    american: "American",
    america: "American",
    korean: "Korean",
    korea: "Korean",
    vietnamese: "Vietnamese",
    vietnam: "Vietnamese",
    brazilian: "Brazilian",
    brazil: "Brazilian",
    peruvian: "Peruvian",
    peru: "Peruvian",
    ethiopian: "Ethiopian",
    ethiopia: "Ethiopian",
    mediterranean: "Mediterranean",
    "middle eastern": "Middle Eastern",
    "north african": "North African",
    maghreb: "North African",
  }

  // Convert text to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase()
  const lowerDish = dishName.toLowerCase()

  // First check if the dish name contains "from X"
  const fromMatch = dishName.match(/from\s+(\w+)/i)
  if (fromMatch && fromMatch[1]) {
    const fromCuisine = fromMatch[1]
    // Capitalize first letter
    return fromCuisine.charAt(0).toUpperCase() + fromCuisine.slice(1)
  }

  // Then check for cuisine keywords in the text
  for (const [keyword, cuisine] of Object.entries(cuisineMap)) {
    if (lowerText.includes(keyword) || lowerDish.includes(keyword)) {
      return cuisine
    }
  }

  // Default to International if no cuisine is detected
  return "International"
}

const culturalStory = async (req, res) => {
  try {
    const { dish } = req.body

    if (!dish) {
      return res.status(400).json({ error: "Dish name is required" })
    }

    // Clean up the dish name for search
    const searchTerm = dish.replace(/\s+from\s+/i, " ").trim()

    try {
      // First, search Wikipedia for the dish
      const searchResponse = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          searchTerm,
        )}&format=json&origin=*`,
      )

      if (!searchResponse.data.query.search.length) {
        throw new Error("No Wikipedia results found")
      }

      // Get the first search result
      const pageId = searchResponse.data.query.search[0].pageid

      // Get the page content
      const contentResponse = await axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro=1&explaintext=1&piprop=original&pageids=${pageId}&format=json&origin=*`,
      )

      const page = contentResponse.data.query.pages[pageId]
      const extract = page.extract || ""

      // Clean up the text
      const cleanedExtract = cleanWikipediaText(extract)

      // Split the extract into paragraphs
      const paragraphs = cleanedExtract.split(". ")

      // Extract dish name
      let dishName = searchTerm
      if (dish.includes("from")) {
        dishName = dish.split("from")[0].trim()
      }

      // Determine cuisine using the improved function
      const cuisine = detectCuisine(extract, dish)

      // Create history paragraph
      const history = paragraphs.slice(0, 2).join(". ") + "."

      // Create cultural significance
      const culturalSignificance = paragraphs.slice(2, 4).join(". ") + "."

      // Extract ingredients
      const traditionalIngredients = extractIngredients(extract)

      // Create serving traditions
      let servingTraditions = "Traditionally, this dish is served with care and attention to presentation."
      if (paragraphs.length > 4) {
        servingTraditions = paragraphs.slice(4, 6).join(". ") + "."
      }

      // Generate fun facts
      const funFacts = generateFunFacts(extract, dishName)

      // Get image URL with multiple fallbacks
      let regionImageUrl = null
      if (page.original && page.original.source) {
        regionImageUrl = page.original.source
      } else {
        // Try to get an image from Unsplash with multiple search terms
        const searchTerms = [
          `${encodeURIComponent(dishName)} food`,
          `${encodeURIComponent(cuisine)} cuisine`,
          `${encodeURIComponent(dishName)} ${encodeURIComponent(cuisine)}`,
        ]

        // Use the first search term, but we have backups if needed
        regionImageUrl = `https://source.unsplash.com/featured/?${searchTerms[0]}`
      }

      // Construct the response
      const response = {
        cuisine,
        dishName,
        history,
        culturalSignificance,
        traditionalIngredients,
        servingTraditions,
        funFacts,
        regionImageUrl,
        source: "Wikipedia and culinary knowledge",
      }

      res.json(response)
    } catch (error) {
      console.error("Error fetching from Wikipedia:", error)

      // Extract dish name and cuisine from input
      let dishName = dish
      let cuisine = "International"

      if (dish.includes("from")) {
        const parts = dish.split("from")
        dishName = parts[0].trim()
        cuisine = parts[1].trim()
        // Capitalize first letter of cuisine
        cuisine = cuisine.charAt(0).toUpperCase() + cuisine.slice(1)
      } else {
        // Try to detect cuisine from dish name
        cuisine = detectCuisine("", dish)
      }

      // Multiple fallback image options
      const searchTerms = [
        `${encodeURIComponent(dishName)} food`,
        `${encodeURIComponent(cuisine)} cuisine`,
        `${encodeURIComponent(dishName)} ${encodeURIComponent(cuisine)}`,
        "traditional food",
      ]

      // Use the first search term
      const regionImageUrl = `https://source.unsplash.com/featured/?${searchTerms[0]}`

      // Fallback response with generic information
      const fallbackResponse = {
        cuisine: cuisine,
        dishName: dishName,
        history: `${dishName} has a rich history dating back many generations. It evolved over time as cooking techniques and available ingredients changed.`,
        culturalSignificance: `${dishName} holds special significance in ${cuisine} culture, often being served during important celebrations and family gatherings.`,
        traditionalIngredients: ["Local ingredients", "Regional spices", "Traditional herbs", "Seasonal vegetables"],
        servingTraditions: `${dishName} is traditionally served in special dishware and eaten with specific customs that honor the cultural heritage of ${cuisine}.`,
        funFacts: [
          `${dishName} has variations across different regions of ${cuisine} cuisine`,
          "The recipe has been passed down through generations",
          "It was originally created for a special celebration",
        ],
        regionImageUrl: regionImageUrl,
        source: "Culinary knowledge",
        // Include backup image URLs in case the first one fails
        backupImageUrls: searchTerms.slice(1).map((term) => `https://source.unsplash.com/featured/?${term}`),
      }

      res.json(fallbackResponse)
    }
  } catch (error) {
    console.error("Error in cultural story controller:", error)
    res.status(500).json({ error: "Failed to generate cultural story" })
  }
}

module.exports = {
  culturalStory,
}
