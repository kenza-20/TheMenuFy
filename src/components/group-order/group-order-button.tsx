

import { useState } from "react"
import { Users, Plus } from "lucide-react"
import CreateGroupOrderModal from "./create-modal"
import JoinGroupOrderModal from "./join-modal"
import { useNavigate } from "react-router-dom"

const GroupOrderButton = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const handleCreateSuccess = (code:any) => {
    console.log("Navigating to group order page with code:", code);
    setIsCreateModalOpen(false);
    navigate(`/group-order/${code}`);
  };
  const handleJoinSuccess = (code: string) => {
    setIsJoinModalOpen(false)
    navigate(`/group-order/${code}`)
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors"
        >
          <Users className="h-4 w-4" />
          <span>Group Order</span>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-black/70 backdrop-blur-lg border border-white/10 rounded-lg shadow-xl z-10">
            <div className="py-1">
              <button
                onClick={() => {
                  setIsDropdownOpen(false)
                  setIsCreateModalOpen(true)
                }}
                className="cursor-pointer flex items-center w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>Create Group Order</span>
              </button>
              <button
                onClick={() => {
                  setIsDropdownOpen(false)
                  setIsJoinModalOpen(true)
                }}
                className="flex items-center w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors"
              >
                <Users className="h-4 w-4 mr-2" />
                <span>Join Group Order</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateGroupOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <JoinGroupOrderModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={handleJoinSuccess}
      />
    </>
  )
}

export default GroupOrderButton
