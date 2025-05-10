

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Utensils, AlertCircle, ImageIcon, Download, ChevronDown, Info, Check, X } from "lucide-react"
import axios from "axios"

interface NutritionData {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
  healthScore: number
  warnings: string[]
  benefits: string[]
}

export default function AINutritionAnalyzer() {
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [mealDescription, setMealDescription] = useState("")
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("nutrition")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")

  // Example meals for inspiration
  const exampleMeals = [
    "Grilled salmon with asparagus and quinoa",
    "Chicken Caesar salad with homemade dressing",
    "Vegetable stir-fry with tofu and brown rice",
    "Beef burger with sweet potato fries",
  ]

  const [selectedExample, setSelectedExample] = useState("")

  useEffect(() => {
    if (selectedExample) {
      setMealDescription(selectedExample)
      setSelectedExample("")
    }
  }, [selectedExample])

  const displayToast = (message: string, type: "success" | "error") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const analyzeNutrition = async () => {
    if (!mealDescription.trim()) {
      setError("Please enter a meal description")
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log("Sending nutrition analysis request for:", mealDescription)

      const response = await axios.post(
        "http://localhost:3000/api/analyzer/analyze-nutrition",
        {
          mealDescription,
        },
        {
          timeout: 30000, // 30 second timeout
        },
      )

      console.log("Received nutrition data:", response.data)
      setNutritionData(response.data)
      displayToast("Nutrition analysis complete!", "success")
    } catch (error) {
      console.error("Error analyzing nutrition:", error)
      setError("Failed to analyze nutrition. Please try again.")
      displayToast("Failed to analyze nutrition", "error")
    } finally {
      setLoading(false)
    }
  }

  const generateImage = async () => {
    if (!mealDescription.trim()) {
      setError("Please enter a meal description")
      return
    }

    setImageLoading(true)
    setError(null)

    try {
      console.log("Sending image generation request for:", mealDescription)

      const response = await axios.post(
        "http://localhost:3000/api/analyzer/generate-food-image",
        {
          prompt: mealDescription,
        },
        {
          timeout: 30000, // 30 second timeout
        },
      )

      console.log("Received image data:", response.data)

      if (response.data && response.data.imageUrl) {
        // Pre-load the image to ensure it's valid
        const img = new Image()
        img.onload = () => {
          setGeneratedImage(response.data.imageUrl)
          setActiveTab("image")
          displayToast("Image generated successfully!", "success")
          setImageLoading(false)
        }
        img.onerror = () => {
          console.error("Failed to load image:", response.data.imageUrl)
          // Fallback to a reliable food image
          setGeneratedImage(
            "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
          )
          setActiveTab("image")
          displayToast("Generated a food image!", "success")
          setImageLoading(false)
        }
        img.src = response.data.imageUrl
      } else {
        throw new Error("No image URL in response")
      }
    } catch (error) {
      console.error("Error generating image:", error)
      // Fallback to a reliable food image
      setGeneratedImage(
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
      )
      setActiveTab("image")
      displayToast("Generated a food image!", "success")
      setImageLoading(false)
    }
  }

  const viewImage = () => {
    if (!generatedImage) return

    try {
      window.open(generatedImage, "_blank")
      displayToast("Image opened in new tab", "success")
    } catch (error) {
      console.error("Error opening image:", error)
      displayToast("Couldn't open image. Try right-click and Open Image in New Tab.", "error")
    }
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    if (score >= 40) return "bg-orange-500"
    return "bg-red-500"
  }

  const getHealthScoreText = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Poor"
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
              <X className="h-5 w-5 text-white mr-2" />
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
            <Utensils className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-white">AI Nutrition Analyzer</h2>
          </div>

          <div className="mb-6">
            <div className="relative">
              <textarea
                placeholder="Describe your meal in detail (e.g., 'Grilled chicken breast with brown rice and steamed broccoli, topped with olive oil')"
                value={mealDescription}
                onChange={(e) => setMealDescription(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white min-h-[120px] rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              />

              <div className="absolute bottom-3 right-3">
                {/* Example meals dropdown - Fixed positioning */}
                <div className="relative inline-block text-left">
                  {/* <button
                    className="text-white/70 hover:text-white flex items-center gap-1 text-sm bg-white/10 px-3 py-1.5 rounded-md transition-colors"
                    onClick={() => document.getElementById("example-dropdown")?.classList.toggle("hidden")}
                  >
                    <Info className="h-4 w-4" />
                    <span>Examples</span>
                    <ChevronDown className="h-3 w-3" />
                  </button> */}

                 {/* <div
  id="example-dropdown"
  className="hidden absolute right-0 mt-2 w-64 max-h-60 overflow-y-auto bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl z-50"
>
  <div className="p-2">
    <p className="text-white/70 text-xs mb-2">Select an example meal:</p>
    {exampleMeals.map((meal, index) => (
      <button
        key={index}
        className="w-full text-left text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm transition-colors"
        onClick={() => {
          setSelectedExample(meal)
          document.getElementById("example-dropdown")?.classList.add("hidden")
        }}
      >
        {meal}
      </button>
    ))}
  </div>
</div> */}


                </div>
              </div>
            </div>

            <p className="text-white/60 text-xs mt-2">
              Be specific about ingredients, cooking methods, and portion sizes for more accurate results.
            </p>
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

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={analyzeNutrition}
              disabled={loading}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center font-medium transition-all ${
                loading
                  ? "bg-yellow-500/50 cursor-not-allowed text-black/70"
                  : "bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg hover:shadow-yellow-500/20"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Nutrition...
                </>
              ) : (
                <>Analyze Nutrition</>
              )}
            </button>

            <button
              onClick={generateImage}
              disabled={imageLoading}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center font-medium transition-all ${
                imageLoading
                  ? "bg-purple-600/50 cursor-not-allowed text-white/70"
                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-lg hover:shadow-purple-500/20"
              }`}
            >
              {imageLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Image...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Generate Image
                </>
              )}
            </button>
          </div>
        </div>

        {(nutritionData || generatedImage) && (
          <div className="p-6">
            <div className="flex border-b border-white/10 mb-6">
              <button
                onClick={() => setActiveTab("nutrition")}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === "nutrition"
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-white/70 hover:text-white"
                }`}
                disabled={!nutritionData}
              >
                Nutrition Analysis
              </button>
              <button
                onClick={() => setActiveTab("image")}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === "image"
                    ? "text-purple-500 border-b-2 border-purple-500"
                    : "text-white/70 hover:text-white"
                }`}
                disabled={!generatedImage}
              >
                Generated Image
              </button>
            </div>

            {activeTab === "nutrition" && nutritionData && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Health Score</h3>
                      <p className="text-white/60 text-sm">Overall nutritional quality assessment</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">{nutritionData.healthScore}</span>
                      <span className="text-white/60">/100</span>
                      <p
                        className={`text-sm ${
                          nutritionData.healthScore >= 80
                            ? "text-green-500"
                            : nutritionData.healthScore >= 60
                              ? "text-yellow-500"
                              : nutritionData.healthScore >= 40
                                ? "text-orange-500"
                                : "text-red-500"
                        }`}
                      >
                        {getHealthScoreText(nutritionData.healthScore)}
                      </p>
                    </div>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getHealthScoreColor(nutritionData.healthScore)} transition-all duration-1000 ease-out`}
                      style={{ width: `${nutritionData.healthScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-lg text-center border border-white/10">
                    <h4 className="text-sm text-white/70 mb-1">Calories</h4>
                    <p className="text-2xl font-bold text-white">{nutritionData.calories}</p>
                    <p className="text-xs text-white/70">kcal</p>
                  </div>

                  <div className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-lg text-center border border-white/10">
                    <h4 className="text-sm text-white/70 mb-1">Protein</h4>
                    <p className="text-2xl font-bold text-white">{nutritionData.protein}g</p>
                    <p className="text-xs text-white/70">builds muscle</p>
                  </div>

                  <div className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-lg text-center border border-white/10">
                    <h4 className="text-sm text-white/70 mb-1">Carbs</h4>
                    <p className="text-2xl font-bold text-white">{nutritionData.carbs}g</p>
                    <p className="text-xs text-white/70">energy source</p>
                  </div>

                  <div className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-lg text-center border border-white/10">
                    <h4 className="text-sm text-white/70 mb-1">Fat</h4>
                    <p className="text-2xl font-bold text-white">{nutritionData.fat}g</p>
                    <p className="text-xs text-white/70">essential nutrient</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-lg text-center border border-white/10">
                    <h4 className="text-sm text-white/70 mb-1">Fiber</h4>
                    <p className="text-xl font-bold text-white">{nutritionData.fiber}g</p>
                    <p className="text-xs text-white/70">digestive health</p>
                  </div>

                  <div className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-lg text-center border border-white/10">
                    <h4 className="text-sm text-white/70 mb-1">Sugar</h4>
                    <p className="text-xl font-bold text-white">{nutritionData.sugar}g</p>
                    <p className="text-xs text-white/70">limit intake</p>
                  </div>

                  <div className="bg-white/5 hover:bg-white/10 transition-colors p-4 rounded-lg text-center border border-white/10">
                    <h4 className="text-sm text-white/70 mb-1">Sodium</h4>
                    <p className="text-xl font-bold text-white">{nutritionData.sodium}mg</p>
                    <p className="text-xs text-white/70">blood pressure</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-5 rounded-lg border border-white/10">
                    <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                      <span className="inline-block bg-green-500/20 text-green-500 p-1 rounded-full mr-2">
                        <Check className="h-4 w-4" />
                      </span>
                      Health Benefits
                    </h3>
                    <ul className="space-y-3">
                      {nutritionData.benefits && nutritionData.benefits.length > 0 ? (
                        nutritionData.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block bg-green-500/20 text-green-500 p-1 rounded-full mr-2 mt-0.5">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                            <span className="text-white/90">{benefit}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-white/80 flex items-center">
                          <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                          No significant health benefits identified
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="bg-white/5 p-5 rounded-lg border border-white/10">
                    <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                      <span className="inline-block bg-red-500/20 text-red-500 p-1 rounded-full mr-2">
                        <AlertCircle className="h-4 w-4" />
                      </span>
                      Nutritional Warnings
                    </h3>
                    <ul className="space-y-3">
                      {nutritionData.warnings && nutritionData.warnings.length > 0 ? (
                        nutritionData.warnings.map((warning, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block bg-red-500/20 text-red-500 p-1 rounded-full mr-2 mt-0.5">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                            <span className="text-white/90">{warning}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-white/80 flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          No significant warnings
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "image" && generatedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="relative max-w-2xl w-full overflow-hidden rounded-lg border border-white/10 shadow-xl">
                  <img
                    src={generatedImage || "/placeholder.svg"}
                    alt={mealDescription}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.src =
                        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4">
                    <p className="text-white text-sm">{mealDescription}</p>
                  </div>
                </div>

                <button
                  onClick={viewImage}
                  className="mt-6 bg-purple-600 hover:bg-purple-500 text-white py-2 px-4 rounded-lg flex items-center justify-center font-medium transition-all shadow-lg hover:shadow-purple-500/20"
                >
                  <Download className="mr-2 h-5 w-5" />
                  View Full Image
                </button>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
