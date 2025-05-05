import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Menu, X, Bell } from "lucide-react";
import { useDispatch } from "react-redux";

const Navbar = ({ authenticated }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notifications] = useState(5);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        localStorage.removeItem("userDetails");
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        dispatch({ type: "LOGOUT_ACTION" });
        navigate("/login");
    };

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
        setIsNotificationOpen(false); // Close notification if open
    };

    const toggleNotification = () => {
        setIsNotificationOpen(!isNotificationOpen);
        setIsProfileOpen(false); // Close profile if open
    };

    if (["/login", "/register", "/reset"].includes(location.pathname.toLowerCase())) {
        return null;
    }

    return (
        <nav className="fixed top-0 left-0 w-full px-6 md:px-12 py-4 flex items-center justify-between
                    bg-amber-800/10 backdrop-blur-sm shadow-lg z-50 transition-all">

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
                        <button onClick={toggleProfile} className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full hover:ring-2 hover:ring-yellow-500 transition">
                            <User className="text-gray-700" size={20} />
                        </button>
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 text-black z-50">
                                <Link to="/ProfilePage" onClick={toggleProfile} className="block px-4 py-2 hover:text-yellow-500">Profile</Link>
                                <Link to="/favorites" onClick={toggleProfile} className="block px-4 py-2 hover:text-yellow-500">Favorites</Link>
                                <Link to="/Cart" onClick={toggleProfile} className="block px-4 py-2 hover:text-yellow-500">Cart</Link>
                                <Link to="/settings" onClick={toggleProfile} className="block px-4 py-2 hover:text-yellow-500">Settings</Link>
                                <button onClick={() => { handleLogout(); toggleProfile(); }} className="block w-full text-left px-4 py-2 hover:text-yellow-500">Logout</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Desktop Center Nav */}
            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8">
                {!authenticated ? (
                    <>
                        <Link to="/aboutus" className="text-white hover:text-yellow-500 transition">About Us</Link>
                        <Link to="/services" className="text-white hover:text-yellow-500 transition">Services</Link>
                        <Link to="/contact" className="text-white hover:text-yellow-500 transition">Contact</Link>
                    </>
                ) : (
                    <>
                        <Link to="/resto/2/menu" className="text-white hover:text-yellow-500 transition">Menu</Link>
                        <Link to="/reservation" className="text-white hover:text-yellow-500 transition">Reservations</Link>
                        <Link to="/tips" className="text-white hover:text-yellow-500 transition">Tips</Link>
                        <Link to="/scan" className="text-white hover:text-yellow-500 transition">Scan QR</Link>
                        <Link to="/mealCalendar" className="text-white hover:text-yellow-500">
                            Meal Calendar
                        </Link>
                        <Link to="/orderHistory" className="text-white hover:text-yellow-500">
                            Order History
                        </Link>
                        <Link to="/meteo" className="text-white hover:text-yellow-500">
                            WeatherRecommadations
                        </Link>
                    </>
                )}
            </div>

            {/* Desktop Profile + Notification */}
            <div className="hidden md:flex items-center space-x-6">
                {authenticated && (
                    <>
                        <div className="relative">
                            <button onClick={toggleNotification} className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full hover:ring-2 hover:ring-yellow-500 transition">
                                <Bell className="text-gray-700" size={20} />
                            </button>
                            {notifications > 0 && (
                                <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                                    {notifications}
                                </span>
                            )}
                            {isNotificationOpen && (
                                <div className="absolute top-10 right-0 mt-2 w-56 bg-white shadow-lg rounded-lg py-2 text-black z-50">
                                    <div className="px-4 py-2">New notifications:</div>
                                    <ul className="text-sm">
                                        <li className="hover:bg-gray-100 px-4 py-2">You have 5 new messages</li>
                                        <li className="hover:bg-gray-100 px-4 py-2">Your order has been shipped</li>
                                        <li className="hover:bg-gray-100 px-4 py-2">New promotional offers available</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button onClick={toggleProfile} className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full hover:ring-2 hover:ring-yellow-500 transition">
                                <User className="text-gray-700" size={20} />
                            </button>
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 text-black z-50">
                                    <Link to="/ProfilePage" onClick={toggleProfile} className="block px-4 py-2 hover:text-yellow-500">Profile</Link>
                                    <Link to="/favorites" onClick={toggleProfile} className="block px-4 py-2 hover:text-yellow-500">Favorites</Link>
                                    <Link to="/Cart" onClick={toggleProfile} className="block px-4 py-2 hover:text-yellow-500">Cart</Link>
                                    <Link to="/settings" onClick={toggleProfile} className="block px-4 py-2 hover:text-yellow-500">Settings</Link>
                                    <button onClick={() => { handleLogout(); toggleProfile(); }} className="block w-full text-left px-4 py-2 hover:text-yellow-500">Logout</button>
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
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500">Landing Page</Link>
                            <Link to="/aboutus" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500">About Us</Link>
                            <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500">Services</Link>
                            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500">Contact</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/home" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500">Home</Link>
                            <Link to="/resto/2/menu" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500">Menu</Link>
                            <Link to="/reservation" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500">Réserver</Link>
                            <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-yellow-500">Mes commandes</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
