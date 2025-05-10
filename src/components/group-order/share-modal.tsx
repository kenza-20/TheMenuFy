

import { useState, useEffect } from "react"
import { X, Copy, Check, Share2 } from "lucide-react"

interface ShareGroupOrderModalProps {
  isOpen: boolean
  onClose: () => void
  code: string
  groupName: string
}

const ShareGroupOrderModal = ({ isOpen, onClose, code, groupName }: ShareGroupOrderModalProps) => {
  const [copied, setCopied] = useState(false)
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/group-order/${code}` : ""

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join my group order: ${groupName}`,
          text: `Join my group order on MenuFy! Use code: ${code}`,
          url: shareUrl,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      handleCopy()
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setCopied(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Share2 className="mr-2 h-5 w-5 text-yellow-500" />
            Share Group Order
          </h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-white mb-2">{groupName}</h3>
            <div className="bg-yellow-500 text-black text-2xl font-bold py-3 px-6 rounded-lg inline-block">{code}</div>
            <p className="text-white/70 text-sm mt-2">Share this code with others to join your group order</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Share Link</label>
            <div className="flex">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 p-3 bg-white/10 text-white rounded-l-md border border-white/20 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <button
                onClick={handleCopy}
                className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-r-md border-t border-r border-b border-white/20 transition-colors"
              >
                {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-md transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Share Group Order</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 px-4 bg-transparent hover:bg-white/10 text-white border border-white/20 rounded-md transition-colors"
            >
              Continue to Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareGroupOrderModal
