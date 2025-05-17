import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export default function VoicePanier() {
  const [command, setCommand] = useState("")
  const [feedback, setFeedback] = useState("")
  const [listening, setListening] = useState(false)
  const navigate = useNavigate()

  const startVoiceCommand = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    recognition.lang = "fr-FR"
    setListening(true)
    recognition.start()

 recognition.onresult = async (event) => {
  const text = event.results[0][0].transcript
  console.log("🎙️ Texte vocal reconnu :", text) // 🟡 LOG 1
  setCommand(text)
  setListening(false)

try {
  console.log("📡 Envoi vers /api/voice-command :", { text })
  const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/voice-command`, { text })
console.log("🧾 Contenu complet renvoyé par le backend :", JSON.stringify(res.data.order.items, null, 2))

  setFeedback(res.data.message || "Commande vocale enregistrée.")
  toast.success(`✅ ${res.data.message || "Commande vocale enregistrée."}`)

  // ✅ Attendre 1.5 secondes pour laisser le message s'afficher
  setTimeout(() => {
navigate("/cart", { state: { voiceOrder: res.data.order } })
  }, 1500)
} catch (err) {
  console.error("❌ Erreur Axios :", err)
  setFeedback("❌ Erreur : commande non comprise ou plat introuvable")
  toast.error("❌ Plat non reconnu ou erreur vocale")
}


}


    recognition.onerror = (err) => {
      console.error("Erreur vocale :", err)
      setListening(false)
      toast.error("Erreur de reconnaissance vocale")
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat min-h-screen"
        style={{
          backgroundImage: "url('/bg.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.4)",
        }}
      />

      {/* Main content */}
      <div className="relative flex-grow flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-16">
        <div className="w-full max-w-4xl pt-10">
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 w-full mx-auto text-center space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white">Commande Vocale</h2>
              <p className="mt-4 text-lg text-white">Parlez pour ajouter un plat à votre commande</p>
              <div className="mt-5 mb-8 border-b-4 border-yellow-500 w-48 mx-auto rounded-full shadow-lg" />
            </div>

            {/* Microphone */}
            <div className="flex flex-col items-center">
              <button
                onClick={startVoiceCommand}
                className={`rounded-full p-6 shadow-lg transition ${
                  listening ? "animate-ping bg-yellow-500" : "bg-yellow-500 hover:bg-yellow-400"
                }`}
              >
                🎤
              </button>
              <p className="text-white mt-3">{listening ? "Écoute en cours..." : "Cliquez pour parler"}</p>
            </div>

            {/* Résultat */}
            {command && (
              <div className="text-white">
                <p className="mt-6">
                  <strong>Vous avez dit :</strong> {command}
                </p>
                {feedback && (
                  <p className="mt-2 text-green-400">
                    <strong>Réponse :</strong> {feedback}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
