import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, User, Menu, X } from "lucide-react";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  // Masquer la navbar sur certaines pages
  if (
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/reset"
  ) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full px-6 md:px-12 py-4 flex items-center justify-between 
                    bg-amber-800/10 backdrop-blur-sm shadow-lg z-50 transition-all">
      {/* Logo Section */}
      <div className="flex items-center space-x-4">
        <img src="logo.png" alt="Logo" className="h-8" />
        <h1 className="text-2xl font-bold text-white">TheMenuFy</h1>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden text-white"
      >
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8">
        {!isLoggedIn && (
          <>
            <Link to="/" className="text-white hover:text-yellow-500 transition">Home</Link>
            <Link to="/aboutus" className="text-white hover:text-yellow-500 transition">About Us</Link>
            <Link to="/services" className="text-white hover:text-yellow-500 transition">Services</Link>
            <Link to="/contact" className="text-white hover:text-yellow-500 transition">Contact</Link>
          </>
        )}
        {isLoggedIn && (
          <>
          <Link to="/home" className="text-white hover:text-yellow-500 transition">Home</Link>
            <Link to="/menu" className="text-white hover:text-yellow-500 transition">Menu</Link>
            <Link to="/reservation" className="text-white hover:text-yellow-500 transition">Réserver</Link>
            <Link to="/orders" className="text-white hover:text-yellow-500 transition">Mes commandes</Link>
          </>
        )}
      </div>

      {/* Right Section: Search Bar & Profile */}
      {isLoggedIn && (
        <div className="hidden md:flex items-center space-x-6">
          {/* Profile Icon */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="relative w-9 h-9 flex items-center justify-center bg-white/20 rounded-full 
                        hover:ring-2 hover:ring-yellow-500 transition"
            >
              <User className="text-white" size={20} />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white/20 backdrop-blur-md shadow-lg rounded-lg py-2">
                <Link to="/ProfilePage" className="block px-4 py-2 text-white hover:text-yellow-500">Profile</Link>
                <Link to="/settings" className="block px-4 py-2 text-white hover:text-yellow-500">Settings</Link>
                <Link to="/login" onClick={handleLogout} className="block px-4 py-2 text-white hover:text-yellow-500">Logout</Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-black/90 text-white flex flex-col items-center space-y-6 py-6">
          {!isLoggedIn && (
            <>
              <Link to="/" className="text-white hover:text-yellow-500 transition">Home</Link>
              <Link to="/aboutus" className="text-lg hover:text-yellow-500" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
              <Link to="/services" className="text-lg hover:text-yellow-500" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
              <Link to="/contact" className="text-lg hover:text-yellow-500" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            </>
          )}
          {isLoggedIn && (
            <>
               <Link to="/home" className="text-white hover:text-yellow-500 transition">Home</Link>
              <Link to="/menu" className="text-lg hover:text-yellow-500" onClick={() => setIsMobileMenuOpen(false)}>Menu</Link>
              <Link to="/reservation" className="text-lg hover:text-yellow-500" onClick={() => setIsMobileMenuOpen(false)}>Réserver</Link>
              <Link to="/orders" className="text-lg hover:text-yellow-500" onClick={() => setIsMobileMenuOpen(false)}>Mes commandes</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
