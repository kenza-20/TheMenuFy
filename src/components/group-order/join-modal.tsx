

import type React from "react"

import { useState } from "react"
import { X, LogIn, AlertCircle } from "lucide-react"
import axios from "axios"

interface JoinGroupOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (code: string) => void
}

const JoinGroupOrderModal = ({ isOpen, onClose, onSuccess }: JoinGroupOrderModalProps) => {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null
  const userName = typeof window !== "undefined" ? localStorage.getItem("userName") || "User" : "User"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!code.trim()) {
      setError("Please enter a group order code")
      return
    }

    setLoading(true)

    try {
      // First check if the group order exists and is active
      const checkResponse = await axios.get(`http://localhost:3000/api/group-orders/get?code=${code.toUpperCase()}`)

      const groupOrder = checkResponse.data.groupOrder

      // Check if the group order is active
      if (groupOrder.status !== "active") {
        setError(`This group order is ${groupOrder.status}. You cannot join it.`)
        setLoading(false)
        return
      }

      // Check if expired
      if (new Date() > new Date(groupOrder.expiresAt)) {
        setError("This group order has expired")
        setLoading(false)
        return
      }

      // If all checks pass, proceed with joining
      const response = await axios.post("http://localhost:3000/api/group-orders/join", {
        code: code.toUpperCase(),
        userId,
        userName,
      })

      if (response.data.success) {
        onSuccess(response.data.groupOrder.code)
      }
    } catch (error: any) {
      console.error("Error joining group order:", error)
      setError(error.response?.data?.message || "Failed to join group order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <LogIn className="mr-2 h-5 w-5 text-yellow-500" />
            Join Group Order
          </h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-500 rounded-md p-3 flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-white mb-1">
                Enter Group Order Code
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g., ABC123"
                className="w-full p-3 bg-white/10 text-white rounded-md border border-white/20 focus:ring-2 focus:ring-yellow-500 focus:border-transparent uppercase"
                maxLength={6}
              />
              <p className="text-white/60 text-xs mt-1">
                Enter the 6-character code shared with you by the group order creator
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 ${
                  loading ? "bg-yellow-500/50" : "bg-yellow-500 hover:bg-yellow-400"
                } text-black font-medium rounded-md transition-colors`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-black/20 border-t-black rounded-full"></div>
                    <span>Joining...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    <span>Join Group Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default JoinGroupOrderModal
