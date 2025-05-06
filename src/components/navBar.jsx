"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { User, Menu, X, Bell, Info, MessageSquare } from "lucide-react"
import { useDispatch } from "react-redux"
import axios from "axios"

// Add this style for the Gold badge shine animation
const shineAnimation = `
@keyframes shine {
  0% {
    transform: translateX(-100%) skewX(-12deg);
  }
  100% {
    transform: translateX(400%) skewX(-12deg);
  }
}
.animate-shine {
  animation: shine 3s infinite;
}
`

const Navbar = ({ authenticated }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState(5)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [showLoyaltyTooltip, setShowLoyaltyTooltip] = useState(false)
  const [orderCount, setOrderCount] = useState(0)
  const [loyaltyLevel, setLoyaltyLevel] = useState("Bronze")

  const handleLogout = () => {
    localStorage.removeItem("userDetails")
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userId")
    dispatch({ type: "LOGOUT_ACTION" })
    navigate("/")
  }

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
    setIsNotificationOpen(false) // Close notification if open
  }

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen)
    setIsProfileOpen(false) // Close profile if open
  }

  if (["/login", "/register", "/reset"].includes(location.pathname.toLowerCase())) {
    return null
  }

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null

  //   const storedUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("userDetails")) : null
  //   const orderCount = storedUser?.user?.orderCount || 0 // orderCount < 10 ==> Bronze -- orderCount >= 10 ==> Silver -- orderCount >= 20 Gold
  //   const loyaltyLevel = storedUser?.user?.loyaltyLevel || "Bronze"

  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/user/level/${userId}`)
        console.log("ressss", res)
        setLoyaltyLevel(res.data.loyaltyLevel)
        setOrderCount(res.data.orderCount)
      } catch (err) {
        console.error("Error fetching Level:", err)
      }
    }

    if (userId) {
      fetchLevel()
    }
  }, [])

  // Loyalty level descriptions and benefits
  const loyaltyInfo = {
    Bronze: {
      description: "Entry level membership",
      benefits: ["Access to basic menu items", "Standard delivery times", "Earn 1 point per $1 spent"],
      requirement: "Less than 10 orders",
    },
    Silver: {
      description: "Mid-tier membership",
      benefits: [
        "5% discount on all orders",
        "Priority delivery",
        "Earn 1.5 points per $1 spent",
        "Exclusive monthly offers",
      ],
      requirement: "10 or more orders",
    },
    Gold: {
      description: "Premium membership",
      benefits: [
        "10% discount on all orders",
        "Express delivery",
        "Earn 2 points per $1 spent",
        "Exclusive weekly offers",
        "Free dessert on your birthday",
      ],
      requirement: "20 or more orders",
    },
  }

  // Add this style tag to the component
  return (
    <>
      <style>{`
        ${shineAnimation}
      `}</style>
      <nav
        className="fixed top-0 left-0 w-full px-6 md:px-12 py-4 flex items-center justify-between
                    bg-amber-800/10 backdrop-blur-sm shadow-lg z-50 transition-all"
      >
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <img src="logo.png" alt="Logo" className="h-8" />
          <Link to="/" className="text-white hover:text-yellow-500 transition">
            <h1 className="text-2xl font-bold">TheMenuFy</h1>
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center space-x-4">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {authenticated && (
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full hover:ring-2 hover:ring-yellow-500 transition"
              >
                <User className="text-gray-700" size={20} />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 text-black z-50">
                  <Link to="/ProfilePage" onClick={toggleProfile} className="block px-4 py-2 hover:text-yellow-500">
                    Profile
                  </Link>
                  <Link to="/favorites" onClick={toggleProfile} className="block px-4 py-2 hover:text-yellow-500">
                    Favorites
                  </Link>
                  <Link to="/Cart" onClick={toggleProfile} className="block px-4 py-2 hover:text-yellow-500">
                    Cart
                  </Link>
                  <Link to="/settings" onClick={toggleProfile} className="block px-4 py-2 hover:text-yellow-500">
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      toggleProfile()
                    }}
                    className="block w-full text-left px-4 py-2 hover:text-yellow-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Center Nav */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8">
          {!authenticated ? (
            <>
              <Link to="/aboutus" className="text-white hover:text-yellow-500 transition">
                About Us
              </Link>
              <Link to="/services" className="text-white hover:text-yellow-500 transition">
                Services
              </Link>
              <Link to="/contact" className="text-white hover:text-yellow-500 transition">
                Contact
              </Link>
            </>
          ) : (
            <>
              <Link to="/resto/2/menu" className="text-white hover:text-yellow-500 transition">
                Menu
              </Link>
              <Link to="/reservation" className="text-white hover:text-yellow-500 transition">
                Reservations
              </Link>
              <Link to="/tips" className="text-white hover:text-yellow-500 transition">
                Tips
              </Link>
              <Link to="/scan" className="text-white hover:text-yellow-500 transition">
                Scan QR
              </Link>
              <Link to="/mealCalendar" className="text-white hover:text-yellow-500">
                Meal Calendar
              </Link>
              <Link to="/orderHistory" className="text-white hover:text-yellow-500">
                Order History
              </Link>
              <Link to="/meteo" className="text-white hover:text-yellow-500">
                Weather Recommendations
              </Link>
            </>
          )}
        </div>

        {/* Desktop Profile + Notification */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Support Chat Button */}
          {authenticated && (
            // <button
            //   onClick={() => document.dispatchEvent(new CustomEvent("toggle-chat-support"))}
            //   className="flex items-center gap-2 px-4 py-2 text-white hover:text-yellow-500 transition-colors"
            // >
            <Link
              to="/contact"
              className="flex items-center gap-2 px-4 py-2 text-white hover:text-yellow-500 transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Support</span>
            </Link>
            // </button>
          )}
          {authenticated && (
            <>
              {/* Replace the loyalty badge span in the desktop view with this enhanced version */}
              <div
                className="relative flex items-center cursor-pointer group"
                onMouseEnter={() => setShowLoyaltyTooltip(true)}
                onMouseLeave={() => setShowLoyaltyTooltip(false)}
              >
                <span
                  className={`inline-flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 shadow-sm ${
                    loyaltyLevel === "Gold"
                      ? "bg-gradient-to-r from-yellow-300 to-yellow-500 text-black border border-yellow-600"
                      : loyaltyLevel === "Silver"
                        ? "bg-gradient-to-r from-gray-200 to-gray-400 text-gray-800 border border-gray-500"
                        : "bg-gradient-to-r from-orange-200 to-orange-400 text-orange-900 border border-orange-500"
                  }`}
                >
                  {loyaltyLevel === "Gold" && (
                    <svg
                      className="w-4 h-4 text-yellow-800"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  )}
                  {loyaltyLevel === "Silver" && (
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {loyaltyLevel === "Bronze" && (
                    <svg
                      className="w-4 h-4 text-orange-800"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {loyaltyLevel} Member
                  <Info size={14} className="ml-1 opacity-70 group-hover:opacity-100" />
                </span>

                {/* Add a subtle shine effect to Gold badge */}
                {loyaltyLevel === "Gold" && (
                  <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                    <div className="w-1/2 h-full bg-white/20 transform -skew-x-12 -translate-x-full animate-shine"></div>
                  </div>
                )}

                {/* Tooltip remains the same */}
                {showLoyaltyTooltip && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-sm text-black rounded-lg shadow-xl p-4 z-50 border border-gray-200 transform transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className={`font-bold text-lg ${
                          loyaltyLevel === "Gold"
                            ? "text-yellow-600"
                            : loyaltyLevel === "Silver"
                              ? "text-gray-600"
                              : "text-orange-600"
                        }`}
                      >
                        {loyaltyLevel} Level
                      </h3>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          loyaltyLevel === "Gold"
                            ? "bg-yellow-400"
                            : loyaltyLevel === "Silver"
                              ? "bg-gray-400"
                              : "bg-orange-400"
                        }`}
                      ></div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{loyaltyInfo[loyaltyLevel].description}</p>

                    <div className="mb-2">
                      <p className="text-xs font-semibold text-gray-500">Requirement:</p>
                      <p className="text-sm">{loyaltyInfo[loyaltyLevel].requirement}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500">Benefits:</p>
                      <ul className="text-sm list-disc pl-4 mt-1 space-y-1">
                        {loyaltyInfo[loyaltyLevel].benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>

                    {loyaltyLevel !== "Gold" ? (
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        {/* Bronze level with progress to Silver */}
                        {loyaltyLevel === "Bronze" && (
                          <>
                            {orderCount >= 10 ? (
                              <p className="text-xs text-green-600 font-medium">
                                Congratulations! You've reached Silver level! Refresh to see your new badge.
                              </p>
                            ) : (
                              <p className="text-xs text-gray-500">
                                {10 - orderCount} more {10 - orderCount === 1 ? "order" : "orders"} to reach Silver
                                level!
                              </p>
                            )}
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1 overflow-hidden">
                              <div
                                className="h-2 rounded-full bg-orange-400"
                                style={{
                                  width: `${Math.min((orderCount / 10) * 100, 100)}%`,
                                }}
                              ></div>
                            </div>
                          </>
                        )}

                        {/* Silver level with progress to Gold */}
                        {loyaltyLevel === "Silver" && (
                          <>
                            {orderCount >= 20 ? (
                              <p className="text-xs text-green-600 font-medium">
                                Congratulations! You've reached Gold level! Refresh to see your new badge.
                              </p>
                            ) : (
                              <p className="text-xs text-gray-500">
                                {20 - orderCount} more {20 - orderCount === 1 ? "order" : "orders"} to reach Gold level!
                              </p>
                            )}
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1 overflow-hidden">
                              <div
                                className="h-2 rounded-full bg-gray-400"
                                style={{
                                  width: `${Math.min(((orderCount - 10) / 10) * 100, 100)}%`,
                                }}
                              ></div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        <p className="text-xs text-green-600 font-medium">
                          Congratulations! You've reached the highest loyalty tier!
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1 overflow-hidden">
                          <div className="h-2 rounded-full bg-yellow-400 w-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

             

              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full hover:ring-2 hover:ring-yellow-500 transition"
                >
                  <User className="text-gray-700" size={20} />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 text-black z-50">
                    <Link to="/ProfilePage" onClick={toggleProfile} className="block px-4 py-2 hover:text-yellow-500">
                      Profile
                    </Link>
                    <Link to="/favorites" onClick={toggleProfile} className="block px-4 py-2 hover:text-yellow-500">
                      Favorites
                    </Link>
                    <Link to="/Cart" onClick={toggleProfile} className="block px-4 py-2 hover:text-yellow-500">
                      Cart
                    </Link>
                    <Link to="/settings" onClick={toggleProfile} className="block px-4 py-2 hover:text-yellow-500">
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        toggleProfile()
                      }}
                      className="block w-full text-left px-4 py-2 hover:text-yellow-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-black/90 text-white flex flex-col items-center space-y-6 py-6 z-40">
            {!authenticated ? (
              <>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500">
                  Landing Page
                </Link>
                <Link to="/aboutus" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500">
                  About Us
                </Link>
                <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500">
                  Services
                </Link>
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500">
                  Contact
                </Link>
              </>
            ) : (
              <>
                {/* Replace the mobile loyalty badge button with this enhanced version */}
                <button
                  className={`inline-flex items-center gap-1 px-4 py-1.5 text-sm font-medium rounded-full shadow-sm ${
                    loyaltyLevel === "Gold"
                      ? "bg-gradient-to-r from-yellow-300 to-yellow-500 text-black border border-yellow-600"
                      : loyaltyLevel === "Silver"
                        ? "bg-gradient-to-r from-gray-200 to-gray-400 text-gray-800 border border-gray-500"
                        : "bg-gradient-to-r from-orange-200 to-orange-400 text-orange-900 border border-orange-500"
                  }`}
                  onClick={() => setShowLoyaltyTooltip(!showLoyaltyTooltip)}
                >
                  {loyaltyLevel === "Gold" && (
                    <svg
                      className="w-4 h-4 text-yellow-800"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  )}
                  {loyaltyLevel === "Silver" && (
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {loyaltyLevel === "Bronze" && (
                    <svg
                      className="w-4 h-4 text-orange-800"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {loyaltyLevel} Member
                  <Info size={14} className="ml-1" />
                </button>

                {showLoyaltyTooltip && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white/95 text-black rounded-lg shadow-xl p-4 z-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className={`font-bold text-lg ${
                          loyaltyLevel === "Gold"
                            ? "text-yellow-600"
                            : loyaltyLevel === "Silver"
                              ? "text-gray-600"
                              : "text-orange-600"
                        }`}
                      >
                        {loyaltyLevel} Level
                      </h3>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          loyaltyLevel === "Gold"
                            ? "bg-yellow-400"
                            : loyaltyLevel === "Silver"
                              ? "bg-gray-400"
                              : "bg-orange-400"
                        }`}
                      ></div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{loyaltyInfo[loyaltyLevel].description}</p>

                    <div className="mb-2">
                      <p className="text-xs font-semibold text-gray-500">Requirement:</p>
                      <p className="text-sm">{loyaltyInfo[loyaltyLevel].requirement}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-500">Benefits:</p>
                      <ul className="text-sm list-disc pl-4 mt-1 space-y-1">
                        {loyaltyInfo[loyaltyLevel].benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>

                    {loyaltyLevel !== "Gold" ? (
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        {/* Bronze level with progress to Silver */}
                        {loyaltyLevel === "Bronze" && (
                          <>
                            {orderCount >= 10 ? (
                              <p className="text-xs text-green-600 font-medium">
                                Congratulations! You've reached Silver level! Refresh to see your new badge.
                              </p>
                            ) : (
                              <p className="text-xs text-gray-500">
                                {10 - orderCount} more {10 - orderCount === 1 ? "order" : "orders"} to reach Silver
                                level!
                              </p>
                            )}
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1 overflow-hidden">
                              <div
                                className="h-2 rounded-full bg-orange-400"
                                style={{
                                  width: `${Math.min((orderCount / 10) * 100, 100)}%`,
                                }}
                              ></div>
                            </div>
                          </>
                        )}

                        {/* Silver level with progress to Gold */}
                        {loyaltyLevel === "Silver" && (
                          <>
                            {orderCount >= 20 ? (
                              <p className="text-xs text-green-600 font-medium">
                                Congratulations! You've reached Gold level! Refresh to see your new badge.
                              </p>
                            ) : (
                              <p className="text-xs text-gray-500">
                                {20 - orderCount} more {20 - orderCount === 1 ? "order" : "orders"} to reach Gold level!
                              </p>
                            )}
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1 overflow-hidden">
                              <div
                                className="h-2 rounded-full bg-gray-400"
                                style={{
                                  width: `${Math.min(((orderCount - 10) / 10) * 100, 100)}%`,
                                }}
                              ></div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        <p className="text-xs text-green-600 font-medium">
                          Congratulations! You've reached the highest loyalty tier!
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1 overflow-hidden">
                          <div className="h-2 rounded-full bg-yellow-400 w-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <Link to="/home" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500">
                  Home
                </Link>
                <Link to="/resto/2/menu" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500">
                  Menu
                </Link>
                <Link to="/reservation" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500">
                  Réserver
                </Link>
                <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500">
                  Mes commandes
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
      {/* Chat Support Widget */}
    </>
  )
}

export default Navbar
