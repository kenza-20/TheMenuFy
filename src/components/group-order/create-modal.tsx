

import type React from "react"

import { useState } from "react"
import { X, Users, Share2 } from "lucide-react"
import axios from "axios"
import Swal from "sweetalert2"

interface CreateGroupOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (code: string) => void
}

const CreateGroupOrderModal = ({ isOpen, onClose, onSuccess }: CreateGroupOrderModalProps) => {
  const [name, setName] = useState("")
  const [expiresIn, setExpiresIn] = useState("24")
  const [loading, setLoading] = useState(false)

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null
  const userName = typeof window !== "undefined" ? localStorage.getItem("userName") || "User" : "User"

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Form submitted with name:", name);
    e.preventDefault()

    if (!name.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a name for your group order",
      })
      return
    }

    setLoading(true)

    try {
      const response = await axios.post("http://localhost:3000/api/group-orders/create", {
        userId,
        userName,
        name,
        expiresIn: Number.parseInt(expiresIn),
      })

      if (response.data.success) {
        onSuccess(response.data.groupOrder.code)
      }
    } catch (error) {
      console.error("Error creating group order:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create group order. Please try again.",
      })
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
            <Users className="mr-2 h-5 w-5 text-yellow-500" />
            Create Group Order
          </h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                Group Order Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Office Lunch, Team Meeting"
                className="w-full p-3 bg-black/70 text-white rounded-md border border-white/20 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="expiresIn" className="block text-sm font-medium text-white mb-1">
                Expires In
              </label>
              <select
                id="expiresIn"
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value)}
                className="w-full p-3 bg-black/70 text-white rounded-md border border-white/20 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="4">4 hours</option>
                <option value="8">8 hours</option>
                <option value="24">24 hours</option>
                <option value="48">48 hours</option>
              </select>
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
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    <span>Create & Share</span>
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

export default CreateGroupOrderModal
