import { React, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

import HomePage from "./pages/homePage";
import Login from "./pages/login";
import Reset from "./pages/resetPassword";
import Register from "./pages/register";
import ResetPasswordEmail from "./pages/resetPasswordEmail";
import ProfilePage from "./pages/profilePage";
import EditProfile from "./pages/editProfile";
import Settings from "./pages/settingPage";
import Navbar from "./components/navBar";
import Footer from "./components/footer";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyCode from "./pages/VerifyCode";
import ContactPage from "./pages/ContactPage";
import ServicesPage from "./pages/ServicesPage";
import AboutUs from "./pages/AboutUs";
import LandingPage from "./pages/LandingPage";
import ResetPassword from "./pages/resetPassword";
import DishDetail from "./pages/DishDetail";
import Menu from "./pages/Menu";
import Reservation from "./pages/Reservation";
import Orders from "./pages/Orders";
import Favorites from './pages/Favorite';
import Panier from "./pages/Panier";
import Success from './pages/Success';
import QrScanner from "./pages/QrScanner";
import { isAuthenticated } from "./selectors/AuthSelector";
import BlogTips from './pages/BlogTips';
import MealCalendar from "./pages/MealCalendar";
import OrderHistory from "./pages/OrderHistory";
import ChatBot from './ChatBot';
import { useState } from "react";
import Dashboard from "./pages/dashboard";
import ComposeAssiette from "./pages/ComposeAssiette";

const App = () => {
  const location = useLocation();
  const authenticated = useSelector(isAuthenticated);

  const [showChatBot, setShowChatBot] = useState(true);
  
  useEffect(() => {
    console.log("authenticated", authenticated);
  }, [authenticated]);

  const hiddenNavbarRoutes = [
    "/Login",
    "/Reset",
    "/Register",
    "/ResetPasswordEmail",
    "/code",
    "/resetpwd",
  ];

  return (
    <GoogleOAuthProvider clientId="361184163851-pve81gsol6s8uuqr0hijoqjgi9gib0jc.apps.googleusercontent.com">
      <div
        className="relative min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/bg.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.5)",
        }}
      >
        {!hiddenNavbarRoutes.includes(location.pathname) && (
          <Navbar authenticated={authenticated} />
        )}

        <Routes>
          {/* Public routes */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/scan" element={<QrScanner />} />
          <Route path="/" element={!authenticated ? <LandingPage /> : <Navigate to="/home" />} />
          <Route path="/Login" element={!authenticated ? <Login /> : <Navigate to="/home" />} />
          <Route path="/Register" element={!authenticated ? <Register /> : <Navigate to="/home" />} />
          <Route path="/Reset" element={!authenticated ? <Reset /> : <Navigate to="/home" />} />
          <Route path="/ResetPasswordEmail" element={!authenticated ? <ResetPasswordEmail /> : <Navigate to="/home" />} />
          <Route path="/code" element={!authenticated ? <VerifyCode /> : <Navigate to="/home" />} />
          <Route path="/resetpwd" element={!authenticated ? <ResetPassword /> : <Navigate to="/home" />} />

          {/* Authenticated routes */}
          <Route path="/ProfilePage" element={authenticated ? <ProfilePage /> : <Navigate to="/" />} />
          <Route path="/EditProfile" element={authenticated ? <EditProfile /> : <Navigate to="/" />} />
          <Route path="/Settings" element={authenticated ? <Settings /> : <Navigate to="/" />} />
          <Route path="/home" element={authenticated ? <HomePage /> : <Navigate to="/" />} />
          <Route path="/resto/2/menu" element={authenticated ? <Menu /> : <Navigate to="/" />} />
          <Route path="/reservation" element={authenticated ? <Reservation /> : <Navigate to="/" />} />
          <Route path="/orders" element={authenticated ? <Orders /> : <Navigate to="/" />} />
          <Route path="/cart" element={authenticated ? <Panier /> : <Navigate to="/" />} />
          <Route path="/mealCalendar" element={authenticated ? <MealCalendar /> : <Navigate to="/" />} />
          <Route path="/orderHistory" element={authenticated ? <OrderHistory /> : <Navigate to="/" />} />
          <Route path="/success" element={authenticated ? <Success /> : <Navigate to="/" />} />
          <Route path="/resto/2/menu/dish/:id" element={authenticated ? <DishDetail /> : <Navigate to="/" />} />
          <Route path="/dish/:id" element={authenticated ? <DishDetail /> : <Navigate to="/" />} />
          <Route path="/favorites" element={authenticated ? <Favorites /> : <Navigate to="/" />} />
          <Route path="/tips" element={<BlogTips />} />
          <Route path="/dashboard" element={authenticated ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/IA" element={authenticated ? <ComposeAssiette /> : <Navigate to="/" />} />



          {/* Admin protected routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                {/* <AdminDashboard /> */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute requiredRole="superadmin">
                {/* <SuperAdminPanel /> */}
              </ProtectedRoute>
            }
          />

          {/* Catch all unmatched routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {!hiddenNavbarRoutes.includes(location.pathname) && <Footer />}
          {/* ✅ Affichage du ChatBot uniquement si connecté */}
          {authenticated && (
  <>
    <button
      onClick={() => setShowChatBot(!showChatBot)}
      style={{
        position: 'fixed',
        bottom: '100px',
        right: '20px',
        zIndex: 9999,
        padding: '10px',
        borderRadius: '20px',
        backgroundColor: '#f4ce36',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      {showChatBot ? "Masquer 🤖" : "Ouvrir 🤖"}
    </button>

    {showChatBot && <ChatBot />}
  </>
)}
          </div>


    </GoogleOAuthProvider>
  );
};

export default App;
