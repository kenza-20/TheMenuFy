import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Menu, X } from "lucide-react";
import { useDispatch } from "react-redux";

const Navbar = ({ authenticated }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    dispatch({ type: "LOGOUT_ACTION" });
    navigate("/Login");
  };

  // Cacher la navbar sur les pages spécifiques
  if (
    ["/login", "/register", "/reset"].includes(location.pathname.toLowerCase())
  ) {
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

      {/* Mobile menu button + Profile */}
      <div className="flex md:hidden items-center space-x-4">
        {/* Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Profile (mobile) */}
        {authenticated && (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full hover:ring-2 hover:ring-yellow-500 transition"
            >
              <User className="text-gray-700" size={20} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 text-black z-50">
                <Link to="/ProfilePage" className="block px-4 py-2 hover:text-yellow-500" onClick={() => setIsProfileOpen(false)}>Profile</Link>
                <Link to="/settings" className="block px-4 py-2 hover:text-yellow-500" onClick={() => setIsProfileOpen(false)}>Settings</Link>
                <Link to="/Cart" className="block px-4 py-2 hover:text-yellow-500" onClick={() => setIsProfileOpen(false)}>Cart</Link>
                <Link to="/login" onClick={() => { handleLogout(); setIsProfileOpen(false); }} className="block px-4 py-2 hover:text-yellow-500">Logout</Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Desktop Nav */}
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
            <Link to="/orders" className="text-white hover:text-yellow-500 transition">Orders</Link>
            <Link to="/scan" className="text-white hover:text-yellow-500">Scan QR</Link>
            <Link to="/mealCalendar" className="text-white hover:text-yellow-500">Meal Calendar</Link>



</>
        )}
      </div>

      {/* Desktop Profile */}
      <div className="hidden md:flex items-center space-x-6">
        {authenticated && (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full hover:ring-2 hover:ring-yellow-500 transition"
            >
              <User className="text-gray-700" size={20} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 text-black z-50">
                <Link to="/ProfilePage" className="block px-4 py-2 hover:text-yellow-500" onClick={() => setIsProfileOpen(false)}>Profile</Link>
                <Link to="/settings" className="block px-4 py-2 hover:text-yellow-500" onClick={() => setIsProfileOpen(false)}>Settings</Link>
                <Link to="/Cart" className="block px-4 py-2 hover:text-yellow-500" onClick={() => setIsProfileOpen(false)}>Cart</Link>
                <Link to="/login" onClick={() => { handleLogout(); setIsProfileOpen(false); }} className="block px-4 py-2 hover:text-yellow-500">Logout</Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-black/90 text-white flex flex-col items-center space-y-6 py-6 z-40">
          {!authenticated ? (
            <>
              <Link to="/" className="hover:text-yellow-500" onClick={() => setIsMobileMenuOpen(false)}>Landing Page</Link>
              <Link to="/aboutus" className="hover:text-yellow-500" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
              <Link to="/services" className="hover:text-yellow-500" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
              <Link to="/contact" className="hover:text-yellow-500" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            </>
          ) : (
            <>
              <Link to="/home" className="hover:text-yellow-500" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/menu" className="hover:text-yellow-500" onClick={() => setIsMobileMenuOpen(false)}>Menu</Link>
              <Link to="/reservation" className="hover:text-yellow-500" onClick={() => setIsMobileMenuOpen(false)}>Réserver</Link>
              <Link to="/orders" className="hover:text-yellow-500" onClick={() => setIsMobileMenuOpen(false)}>Mes commandes</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
