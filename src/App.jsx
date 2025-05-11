import { React, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SharedRecommendations from './pages/SharedRecommendations';
import VoiceSearch from './components/VoiceSearch';
import InteractiveStory from './pages/InteractiveStory';

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
import TimeBasedMealSuggestions from "./pages/TimeBasedMealSuggestions";
import WeatherRecommendations from "./pages/WeatherRecommendations";
import Mood from "./pages/Mood";
import Dashboard from "./pages/dahsboard"; // en haut du fichier
import VoiceMenu from './pages/VoiceMenu';
import WhatsAppContactPage from "./pages/contact";
import GroupOrderPage from "./app/group-order/[code]/page";
import ChatSupport from "./components/chat-support"
import NutritionAnalyzerPage from "./pages/NutritionAnalyzerPage";
import CulturalStoriesPage from "./pages/CulturalStoriesPage";
import CultureQuiz from './pages/CultureQuiz';
import AIOrderPage from "./pages/AIOrderPage"

import EnhancedSidebar from "./components/EnhancedSidebar"


import { useState } from "react"; // en haut du fichier

const App = () => {
  const location = useLocation();
  const authenticated = useSelector(isAuthenticated);
  const [showChatBot, setShowChatBot] = useState(false);
  
  useEffect(() => {
    console.log("authenticated", authenticated);
  }, [authenticated]);

  const hiddenNavbarRoutes = [
    "/Login",
    "/Reset",
    "/Register",
    "/ResetPasswordEmail",
    "/code",
    "/resetpwd"
  ];
    const showSidebar = authenticated && !hiddenNavbarRoutes.includes(location.pathname)


  return (
    <GoogleOAuthProvider clientId="361184163851-pve81gsol6s8uuqr0hijoqjgi9gib0jc.apps.googleusercontent.com">
      <div
        className="relative min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/bg.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.5)",
        }}
      >
          {/* Enhanced Sidebar */}
        {showSidebar && <EnhancedSidebar authenticated={authenticated} />}

        {!hiddenNavbarRoutes.includes(location.pathname) && (
          <Navbar authenticated={authenticated} />
        )}

        <Routes>
          {/* Public routes */}
          <Route path="/contactt" element={<ContactPage />} />
          <Route path="/contact" element={<WhatsAppContactPage />} />
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
          <Route path="/tips" element={authenticated ? <BlogTips /> : <Navigate to="/" />} />
          <Route path="/time-based-meals" element={authenticated ? <TimeBasedMealSuggestions /> : <Navigate to="/" />} />
          <Route path="/shared/:userId"   element={authenticated ? <SharedRecommendations /> : <Navigate to="/" />} />
          <Route path="/meteo" element={authenticated ? <WeatherRecommendations /> : <Navigate to="/" />} />
          <Route path="/mood" element={authenticated ? <Mood /> : <Navigate to="/" />} />
          <Route path="/dashboard" element={authenticated ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/voice-menu" element={authenticated ? <VoiceMenu /> : <Navigate to="/" />} />
          <Route path="/analyzer" element={authenticated ? <NutritionAnalyzerPage /> : <Navigate to="/" />} />
          <Route path="/cultural-story" element={authenticated ? <CulturalStoriesPage /> : <Navigate to="/" />} />
          <Route path="/group-order/:code" element={authenticated ? <GroupOrderPage /> : <Navigate to="/" />} />
<Route path="/interactive-story" element={<InteractiveStory />} />
<Route path="/culture/:country" element={<CultureQuiz />} />
<Route path="/ai-order" element={<AIOrderPage />} />




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


{/* ✅ Composants IA uniquement si connecté */}
{authenticated && (
          <>
            {/* Bouton chatbot */}
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

            {/* Chatbot et support */}
            {showChatBot && <ChatBot />}
            {<ChatSupport />}

            {/* 🎤 Commande vocale + résultats */}
           {/* <div className="p-4 max-w-3xl mx-auto">
              <VoiceSearch onResults={setMenuItems} />
              <ul className="mt-4">
                {menuItems.map((item) => (
                  <li key={item.name} className="border-b py-2 text-white">
                    <strong>{item.name}</strong> — {item.category} — {item.origin}
                  </li>
                ))}
              </ul>
            </div>*/}
          </>
        )}

        {!hiddenNavbarRoutes.includes(location.pathname) && <Footer />}
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;