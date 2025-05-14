import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Home,
  User,
  Settings,
  Calendar,
  ShoppingCart,
  Heart,
  Clock,
  FileText,
  Cloud,
  Smile,
  Coffee,
  Utensils,
  BookOpen,
  BarChart,
  Users,
  ChevronRight,
  LogOut,
  Menu,
} from "lucide-react"
import { useDispatch } from "react-redux"

const EnhancedSidebar = ({ authenticated} :any) => {
  const [isOpen, setIsOpen] = useState(false)
  const [firstVisit, setFirstVisit] = useState(true)
  const location = useLocation()
  const sidebarRef = useRef(null)
  const dispatch = useDispatch()

  // Check if this is the first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem("sidebar_visited")
    if (hasVisited) {
      setFirstVisit(false)
    } else {
      // Show sidebar automatically on first visit
      setIsOpen(true)
      // Mark as visited
      localStorage.setItem("sidebar_visited", "true")

      // Auto-close after 3 seconds on first visit
      const timer = setTimeout(() => {
        setIsOpen(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  // Register a global event listener to open the sidebar when the logo is clicked
  useEffect(() => {
    const handleLogoClick = () => {
      setIsOpen(true)
    }

    // Create a custom event for the logo click
    document.addEventListener("logo-click", handleLogoClick)

    return () => {
      document.removeEventListener("logo-click", handleLogoClick)
    }
  }, [])

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event:any) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".sidebar-toggle") &&
        isOpen
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Only show sidebar for authenticated users
  if (!authenticated) return null

  const handleLogout = () => {
    localStorage.removeItem("userDetails")
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userId")
    dispatch({ type: "LOGOUT_ACTION" })
    setIsOpen(false)
  }

  // Group navigation items by category for better organization
  const navigationGroups = [
    {
      title: "Main",
      items: [
        { title: "Home", path: "/home", icon: Home },
        { title: "Profile", path: "/ProfilePage", icon: User },
        { title: "Settings", path: "/Settings", icon: Settings },
      ],
    },
    {
      title: "Food & Ordering",
      items: [
        { title: "Menu", path: "/resto/2/menu", icon: Utensils },
        { title: "Cart", path: "/cart", icon: ShoppingCart },
        { title: "Favorites", path: "/favorites", icon: Heart },
        { title: "Order History", path: "/orderHistory", icon: Clock },
      ],
    },
    {
      title: "Planning",
      items: [
        { title: "Meal Calendar", path: "/mealCalendar", icon: Calendar },
        { title: "Reservation", path: "/reservation", icon: Calendar },
      ],
    },
    {
      title: "Analysis",
      items: [
        { title: "Dashboard", path: "/dashboard", icon: BarChart },
        { title: "Compose dish", path: "/compose", icon: Utensils },
        { title: "Nutrition Analyzer", path: "/analyzer", icon: BookOpen },
        { title: "Cultural Stories", path: "/cultural-story", icon: BookOpen },
      ],
    },
    {
      title: "Recommendations",
      items: [
        { title: "Tips", path: "/tips", icon: FileText },
        { title: "Weather Meals", path: "/meteo", icon: Cloud },
        { title: "Mood Meals", path: "/mood", icon: Smile },
        { title: "Voice Menu", path: "/voice-menu", icon: Coffee },
      ],
    },
    {
      title: "Statistiques",
      items: [
        { title: "Static", path: "/stat", icon: BarChart },

      ],
    }
  ]

  return (
    <>
      {/* Sidebar Toggle Button - visible on mobile and desktop */}
      {/* <button
        onClick={() => setIsOpen(true)}
        className="sidebar-toggle fixed left-4 top-20 z-[9999] flex h-10 w-10 items-center justify-center rounded-full shadow-lg"
        style={{
          background: "linear-gradient(135deg, #f4ce36 0%, #e6a819 100%)",
          color: "#000",
          animation: !isOpen ? "pulse 2s infinite" : "none",
        }}
        aria-label="Toggle Sidebar"
      >
        <Menu className="h-5 w-5" />
      </button> */}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-[9999] w-72 transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,20,0.98) 100%)",
          boxShadow: isOpen ? "0 0 25px rgba(0,0,0,0.5)" : "none",
          borderRight: "1px solid rgba(244, 206, 54, 0.2)",
          // Make sure the sidebar doesn't affect the layout
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
        }}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div
            className="flex items-center justify-between p-4"
            style={{
              borderBottom: "1px solid rgba(244, 206, 54, 0.2)",
              background: "linear-gradient(to right, rgba(244, 206, 54, 0.1), transparent)",
            }}
          >
            <div className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-8 mr-3" />
              <h2 className="text-xl font-bold" style={{ color: "#f4ce36" }}>
                TheMenuFy
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 hover:bg-yellow-500/10"
              style={{ color: "#f4ce36" }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile Section */}
          <div className="p-4 flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <User className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <div className="text-white font-medium">
                {localStorage.getItem("userDetails")
                  ? JSON.parse(localStorage.getItem("userDetails"))?.user?.name || "User"
                  : "User"}
              </div>
              <div className="text-xs text-gray-400">
                {localStorage.getItem("userDetails")
                  ? JSON.parse(localStorage.getItem("userDetails"))?.user?.email || "user@example.com"
                  : "user@example.com"}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
            {navigationGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-4">
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {group.title}
                </div>
                <nav>
                  {group.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center rounded-md px-4 py-2.5 text-sm transition-all mb-1 hover:bg-yellow-500/10"
                      style={{
                        backgroundColor: location.pathname === item.path ? "rgba(244, 206, 54, 0.15)" : "transparent",
                        color: location.pathname === item.path ? "#f4ce36" : "#e5e5e5",
                        borderLeft: location.pathname === item.path ? "3px solid #f4ce36" : "3px solid transparent",
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>

          {/* Footer with logout */}
          <div className="p-4 flex items-center" style={{ borderTop: "1px solid rgba(244, 206, 54, 0.2)" }}>
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-md px-4 py-2.5 text-sm text-white hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pulse animation for the toggle button */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(244, 206, 54, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(244, 206, 54, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(244, 206, 54, 0);
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(244, 206, 54, 0.3);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(244, 206, 54, 0.5);
        }
        
        /* Hide scrollbar for Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(244, 206, 54, 0.3) transparent;
        }
      `}</style>
    </>
  )
}

export default EnhancedSidebar
