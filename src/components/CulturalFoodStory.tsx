

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Globe, AlertCircle, BookOpen, History, MapPin, Utensils, Check } from "lucide-react"
import axios from "axios"

interface CulturalStory {
  cuisine: string
  dishName: string
  history: string
  culturalSignificance: string
  traditionalIngredients: string[]
  servingTraditions: string
  funFacts: string[]
  regionImageUrl?: string
  backupImageUrls?: string[]
}

export default function CulturalFoodStory() {
  const [loading, setLoading] = useState(false)
  const [dishInput, setDishInput] = useState("")
  const [culturalStory, setCulturalStory] = useState<CulturalStory | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")
  const [activeTab, setActiveTab] = useState<"history" | "ingredients" | "traditions">("history")

  // Example dishes for inspiration
  const exampleDishes = [
    "Paella from Spain",
    "Sushi from Japan",
    "Pho from Vietnam",
    "Biryani from India",
    "Tacos from Mexico",
  ]

  const displayToast = (message: string, type: "success" | "error") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const getStory = async () => {
    if (!dishInput.trim()) {
      setError("Please enter a dish name")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post("http://localhost:3000/api/cultural-story", {
        dish: dishInput,
      })

      setCulturalStory(response.data)
      setActiveTab("history")
      displayToast("Cultural story generated!", "success")
    } catch (error) {
      console.error("Error getting cultural story:", error)
      setError("Failed to generate cultural story. Please try again.")
      displayToast("Failed to generate story", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleExampleClick = (example: string) => {
    setDishInput(example)
  }

  // Add this function to handle image loading errors
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, backupUrls?: string[]) => {
    const img = event.currentTarget

    // If we have backup URLs and the current src isn't the last one
    if (backupUrls && backupUrls.length > 0) {
      // Get the current URL index or default to -1
      const currentIndex = backupUrls.indexOf(img.src)

      // If we haven't tried all backup URLs yet
      if (currentIndex < backupUrls.length - 1) {
        // Try the next URL
        const nextIndex = currentIndex === -1 ? 0 : currentIndex + 1
        img.src = backupUrls[nextIndex]
        return
      }
    }

    // If all else fails, use a generic food image
    img.src = "https://source.unsplash.com/featured/?food,cuisine"

    // Remove the onerror handler to prevent infinite loops
    img.onerror = null
  }

  return (
    <div className="w-full max-w-4xl mx-auto relative z-10 overflow-visible">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center ${
              toastType === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {toastType === "success" ? (
              <Check className="h-5 w-5 text-white mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-white mr-2" />
            )}
            <p className="text-white font-medium">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-xl"
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-white">Culinary Cultural Storyteller</h2>
          </div>

          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter a dish name (e.g., Paella, Sushi, Pho, Biryani)"
                value={dishInput}
                onChange={(e) => setDishInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white h-12 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {exampleDishes.map((dish, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(dish)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full transition-colors"
                >
                  {dish}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-red-500 font-medium">Error</h3>
                <p className="text-white/80 text-sm">{error}</p>
              </div>
            </div>
          )}

          <button
            onClick={getStory}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg flex items-center justify-center font-medium transition-all ${
              loading
                ? "bg-yellow-500/50 cursor-not-allowed text-black/70"
                : "bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg hover:shadow-yellow-500/20"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Exploring Culinary History...
              </>
            ) : (
              <>
                <BookOpen className="mr-2 h-5 w-5" />
                Discover Cultural Story
              </>
            )}
          </button>
        </div>

        {culturalStory && (
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                  <div className="aspect-w-1 aspect-h-1 relative">
                    <img
                      src={
                        culturalStory.regionImageUrl ||
                        `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(culturalStory.cuisine) || "Food"}`
                      }
                      alt={culturalStory.cuisine}
                      className="w-full h-full object-cover"
                      onError={(e) => handleImageError(e, culturalStory.backupImageUrls)}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-white">{culturalStory.dishName}</h3>
                    <p className="text-yellow-500 font-medium">{culturalStory.cuisine} Cuisine</p>
                  </div>
                </div>

                <div className="mt-4 bg-white/5 border border-white/10 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                    <MapPin className="h-5 w-5 text-yellow-500 mr-2" />
                    Fun Facts
                  </h3>
                  <ul className="space-y-2">
                    {culturalStory.funFacts.map((fact, index) => (
                      <li key={index} className="text-white/80 text-sm flex items-start">
                        <span className="inline-block bg-yellow-500/20 text-yellow-500 p-1 rounded-full mr-2 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="md:w-2/3">
                <div className="flex border-b border-white/10 mb-4">
                  <button
                    onClick={() => setActiveTab("history")}
                    className={`px-4 py-2 font-medium text-sm transition-colors ${
                      activeTab === "history"
                        ? "text-yellow-500 border-b-2 border-yellow-500"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <History className="h-4 w-4 inline-block mr-1" />
                    History
                  </button>
                  <button
                    onClick={() => setActiveTab("ingredients")}
                    className={`px-4 py-2 font-medium text-sm transition-colors ${
                      activeTab === "ingredients"
                        ? "text-yellow-500 border-b-2 border-yellow-500"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <Utensils className="h-4 w-4 inline-block mr-1" />
                    Ingredients
                  </button>
                  <button
                    onClick={() => setActiveTab("traditions")}
                    className={`px-4 py-2 font-medium text-sm transition-colors ${
                      activeTab === "traditions"
                        ? "text-yellow-500 border-b-2 border-yellow-500"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <Globe className="h-4 w-4 inline-block mr-1" />
                    Traditions
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === "history" && (
                    <motion.div
                      key="history"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-xl font-semibold text-white mb-3">History & Origins</h3>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                        <p className="text-white/90 leading-relaxed">{culturalStory.history}</p>
                      </div>

                      <h3 className="text-xl font-semibold text-white mt-6 mb-3">Cultural Significance</h3>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                        <p className="text-white/90 leading-relaxed">{culturalStory.culturalSignificance}</p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "ingredients" && (
                    <motion.div
                      key="ingredients"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-xl font-semibold text-white mb-3">Traditional Ingredients</h3>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {culturalStory.traditionalIngredients.map((ingredient, index) => (
                            <li key={index} className="flex items-center">
                              <span className="inline-block bg-yellow-500/20 text-yellow-500 p-1 rounded-full mr-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                              <span className="text-white/90">{ingredient}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "traditions" && (
                    <motion.div
                      key="traditions"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-xl font-semibold text-white mb-3">Serving Traditions</h3>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                        <p className="text-white/90 leading-relaxed">{culturalStory.servingTraditions}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
