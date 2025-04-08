import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, User, Menu, X } from "lucide-react";
import { useDispatch } from 'react-redux';

const Navbar = ({ authenticated }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const isLoggedIn = !!localStorage.getItem("token");

  // // Masquer la navbar sur certaines pages
  // if (
  //   location.pathname === "/login" ||
  //   location.pathname === "/register" ||
  //   location.pathname === "/reset"
  // ) {
  //   return null;
  // }

  const handleLogout = () => {
    localStorage.removeItem('userDetails'); // Clear the token
    localStorage.removeItem('token'); // Clear the token
    localStorage.removeItem('userRole'); // Clear the token
    localStorage.removeItem('userId'); // Clear the token
    dispatch({ type: "LOGOUT_ACTION" }); // Dispatch LOGOUT_ACTION to update Redux state
    navigate("/Login");  // Redirect to login page
};

useEffect(()=>{
  console.log("authenticated :: navbar", authenticated)
},[])

  return (
    <nav className="fixed top-0 left-0 w-full px-6 md:px-12 py-4 flex items-center justify-between 
                    bg-amber-800/10 backdrop-blur-sm shadow-lg z-50 transition-all">
      {/* Logo Section */}
      <div className="flex items-center space-x-4">
        <img src="logo.png" alt="Logo" className="h-8" />
  
            <Link
              to="/"
              className="text-white hover:text-yellow-500 transition"
            >
              <h1 className="text-2xl font-bold text-white">TheMenuFy</h1>
            </Link>
      
        
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
       

        {/* Show login and register links only if not authenticated */}
        {!authenticated && (
          <>
            {/* <Link
              to="/Login"
              className="text-white hover:text-yellow-500 transition"
            >
              Login
            </Link>
            <Link
              to="/Register"
              className="text-white hover:text-yellow-500 transition"
            >
              Register
            </Link> */}
            
            <Link
              to="/ResetPasswordEmail"
              className="text-white hover:text-yellow-500 transition"
            >
              Reset Password Email
            </Link>

            {/* <Link to="/" className="text-white hover:text-yellow-500 transition">Landing Page</Link> */}
            <Link to="/aboutus" className="text-white hover:text-yellow-500 transition">About Us</Link>
            <Link to="/services" className="text-white hover:text-yellow-500 transition">Services</Link>
            <Link to="/contact" className="text-white hover:text-yellow-500 transition">Contact</Link>
         
          </>
        )}

      </div>

       {/* Show profile, edit profile, and settings only if authenticated */}
       {authenticated && (
          <>
            {/* <Link to="/home" className="text-white hover:text-yellow-500 transition">Home</Link> */}
            <Link to="/menu" className="text-white hover:text-yellow-500 transition">Menu</Link>
            <Link to="/reservation" className="text-white hover:text-yellow-500 transition">Réserver</Link>
            <Link to="/orders" className="text-white hover:text-yellow-500 transition">Mes commandes</Link>
         
            {/* <Link
              to="/ProfilePage"
              className="text-white hover:text-yellow-500 transition"
            >
              Profile
            </Link> */}
            <Link
              to="/EditProfile"
              className="text-white hover:text-yellow-500 transition"
            >
              Edit Profile
            </Link>
            <Link
              to="/Reset"
              className="text-white hover:text-yellow-500 transition"
            >
              Reset
            </Link>
            <Link to="/aboutus" className="text-white hover:text-yellow-500 transition">About Us</Link>
            <Link to="/services" className="text-white hover:text-yellow-500 transition">Services</Link>
            <Link to="/contact" className="text-white hover:text-yellow-500 transition">Contact</Link>
            {/* <Link
              to="/Settings"
              className="text-white hover:text-yellow-500 transition"
            >
              Settings
            </Link> */}


          </>
        )}

   {/* Right Section: Search Bar & Profile */}
   <div className="hidden md:flex items-center space-x-6">
        {/* Search Bar */}
        {authenticated && (
        <div className="relative">
          <input
            type="text"
            className="bg-white text-black px-4 py-1 rounded-full w-48 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-2 text-gray-500" size={20} />
        </div>)}

        {/* Profile Icon */}
        {authenticated && (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="relative w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full hover:ring-2 hover:ring-yellow-500 transition"
            >
              <User className="text-gray-700" size={20} />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2">
                <Link
                  to="/ProfilePage"
                  className="block px-4 py-2 text-gray-700 hover:text-yellow-500"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-gray-700 hover:text-yellow-500"
                >
                  Settings
                </Link>
                <Link
                  to="/login"
                  onClick={handleLogout}
                  className="block px-4 py-2 text-gray-700 hover:text-yellow-500"
                >
                  Logout
                </Link>
               
              </div>
            )}
            
          </div>
        )}
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-black/90 text-white flex flex-col items-center space-y-6 py-6">
          {!authenticated && (
           
            <>
            <Link
              to="/Login"
              className="text-white hover:text-yellow-500 transition"
              onClick={() => setIsMobileMenuOpen(false)}>
              Login
            </Link>
            <Link
              to="/Register"
              className="text-white hover:text-yellow-500 transition"
              onClick={() => setIsMobileMenuOpen(false)}>
              Register
            </Link>
            
            <Link
              to="/ResetPasswordEmail"
              className="text-white hover:text-yellow-500 transition"
              onClick={() => setIsMobileMenuOpen(false)} >
              Reset Password Email
            </Link>

            <Link to="/" className="text-white hover:text-yellow-500 transition" onClick={() => setIsMobileMenuOpen(false)}>Landing Page</Link>
            <Link to="/aboutus" className="text-white hover:text-yellow-500 transition" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            <Link to="/services" className="text-white hover:text-yellow-500 transition" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
            <Link to="/contact" className="text-white hover:text-yellow-500 transition" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
         
          </>
          )}
          {authenticated && (
            <>
            <Link to="/home" className="text-white hover:text-yellow-500 transition">Home</Link>
            <Link to="/menu" className="text-white hover:text-yellow-500 transition"onClick={() => setIsMobileMenuOpen(false)}>Menu</Link>
            <Link to="/reservation" className="text-white hover:text-yellow-500 transition"onClick={() => setIsMobileMenuOpen(false)}>Réserver</Link>
            <Link to="/orders" className="text-white hover:text-yellow-500 transition"onClick={() => setIsMobileMenuOpen(false)}>Mes commandes</Link>
         
            <Link
              to="/ProfilePage"
              className="text-white hover:text-yellow-500 transition"
              onClick={() => setIsMobileMenuOpen(false)}>
              Profile
            </Link>
            <Link
              to="/EditProfile"
              className="text-white hover:text-yellow-500 transition"
              onClick={() => setIsMobileMenuOpen(false)}>
              Edit Profile
            </Link>
            <Link
              to="/Reset"
              className="text-white hover:text-yellow-500 transition"
              onClick={() => setIsMobileMenuOpen(false)} >
              Reset
            </Link>
            <Link
              to="/Settings"
              className="text-white hover:text-yellow-500 transition"
              onClick={() => setIsMobileMenuOpen(false)} >
              Settings
            </Link>
          </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
