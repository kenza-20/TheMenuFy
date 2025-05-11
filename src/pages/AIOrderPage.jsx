import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"

export default function AIOrderPage() {
  const [recipes, setRecipes] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [story, setStory] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get("http://localhost:3000/api/recipes/all").then((res) => {
      setRecipes(res.data)
    })
  }, [])

  const updateQuantity = (recipe, quantity) => {
    if (quantity <= 0) {
      setSelectedItems((prev) => prev.filter((item) => item.name !== recipe.name))
    } else {
      setSelectedItems((prev) => {
        const existing = prev.find((i) => i.name === recipe.name)
        if (existing) {
          return prev.map((i) => (i.name === recipe.name ? { ...i, quantity } : i))
        } else {
          return [...prev, { name: recipe.name, quantity }]
        }
      })
    }
  }

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await axios.post("http://localhost:3000/api/ai-order/generate-summary", {
        items: selectedItems,
        tone: "poétique"
      })
      setStory(res.data.story)
    } catch (err) {
      alert("Erreur génération IA")
    } finally {
      setLoading(false)
    }
  }

const handleOrder = async () => {
  try {
    const userId = localStorage.getItem("userId")
    
    // 1. Supprimer les anciennes commandes
    await axios.delete(`http://localhost:3000/api/orders/clear/${userId}`)

    // 2. Ajouter chaque élément sélectionné
    for (const item of selectedItems) {
      const r = recipes.find((rec) => rec.name === item.name)
      if (!r) continue

      const newOrder = {
        id_user: userId,
        name: item.name,
        description: r.description,
        image: r.image,
        price: r.price,
        price_id: r.price_id,
        quantity: item.quantity,
        orderedAt: Date.now(),
      }

      await axios.post("http://localhost:3000/api/orders/add", newOrder)
    }

    // 3. Redirection
    navigate("/cart")
  } catch (err) {
    alert("Erreur lors de l'ajout au panier.")
    console.error(err)
  }
}



  return (
    <div className="relative min-h-screen flex flex-col items-center text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.jpg')", boxShadow: "inset 0 0 0 2000px rgba(0,0,0,0.7)" }}
      />

      <div className="relative z-10 w-full max-w-6xl px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 text-center mb-4">
          🤖 Assistant IA de Commande Intelligente
        </h1>
        <p className="text-center text-gray-300 mb-6 text-sm">
          Choisissez vos plats préférés et laissez l’IA vous générer un résumé magique ✨
        </p>

        <div className="grid md:grid-cols-2 gap-6 bg-black/30 p-6 rounded-xl shadow-lg">
          {/* Liste des plats */}
          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2">
            {recipes.map((r) => (
              <div key={r._id} className="bg-white/10 rounded-lg p-3 flex gap-3 items-start border border-yellow-500/10">
                <img
                  src={r.image || "/placeholder.svg"}
                  alt={r.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex flex-col justify-between w-full">
                  <div>
                    <h3 className="text-yellow-300 text-sm font-semibold">{r.name}</h3>
                    <p className="text-gray-300 text-xs line-clamp-2">{r.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <label htmlFor={`q-${r._id}`} className="text-xs">Quantité :</label>
                    <input
                      id={`q-${r._id}`}
                      type="number"
                      min="0"
                      defaultValue={0}
                      className="bg-white text-black text-xs rounded px-2 py-1 w-16"
                      onChange={(e) => updateQuantity(r, parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Résumé IA */}
          <div className="bg-white/10 p-4 rounded-lg border border-yellow-400 min-h-[300px]">
            <h2 className="text-md font-bold mb-2 text-yellow-300">📜 Résumé IA de votre festin :</h2>
            {story ? (
              <>
                <p className="text-sm text-gray-200 mb-3 whitespace-pre-line">{story}</p>
                <div className="space-y-2">
                  {selectedItems.map((item) => {
                    const r = recipes.find((r) => r.name === item.name)
                    return (
                      <div key={item.name} className="flex items-center gap-3 bg-white/5 p-2 rounded">
                        <img
                          src={r?.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <h4 className="text-yellow-200 text-sm font-medium">{item.name}</h4>
                          <p className="text-xs text-gray-300">Quantité : {item.quantity}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="text-center mt-4">
                  <Button className="bg-green-500 hover:bg-green-600 text-sm px-4 py-2" onClick={handleOrder}>
                    ✅ Ajouter au Panier
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm italic text-gray-400">Aucun plat généré pour l'instant...</p>
            )}
          </div>
        </div>

        {/* Bouton Générer */}
        <div className="text-center mt-6">
          <Button
            onClick={handleGenerate}
            disabled={loading || selectedItems.length === 0}
            className="px-6 py-2 text-sm"
          >
            {loading ? "🧠 Génération..." : "🪄 Générer Résumé IA"}
          </Button>
        </div>
      </div>
    </div>
  )
}
