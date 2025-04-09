import {React,useEffect} from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import HomePage from "./pages/homePage";
import Login from "./pages/login";
import Reset from "./pages/resetPassword";
import Register from "./pages/register";
import ResetPasswordEmail from "./pages/resetPasswordEmail";
import ProfilePage from "./pages/profilePage";
import EditProfile from "./pages/editProfile";
import Settings from "./pages/settingPage";
import Navbar from "./components/navBar";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Footer from "./components/footer";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyCode from "./pages/VerifyCode";
import Test from "./pages/test";
import ContactPage from "./pages/ContactPage";
import ServicesPage from "./pages/ServicesPage";
import AboutUs from "./pages/AboutUs";
import LandingPage from "./pages/LandingPage";
import ResetPassword from "./pages/resetPassword";

import Menu from "./pages/Menu";
import Reservation from "./pages/Reservation";
import Orders from "./pages/Orders";

import Panier from "./pages/Panier";
import Success from './pages/Success';
import { isAuthenticated } from "./selectors/AuthSelector"; // Import isAuthenticated
import { useSelector } from 'react-redux'; // Use redux selector for auth
import QrScanner from "./pages/QrScanner";


const App = () => {
  const location = useLocation(); // Get the current route
  const authenticated = useSelector(isAuthenticated); // Get authentication status from redux


  useEffect(() => {
    console.log("authenticated", authenticated);
  }, [authenticated]);

  // Define paths where Navbar should be hidden
  const hiddenNavbarRoutes = [];
  // const hiddenNavbarRoutes = ["/Login","/Reset", "/Register", "/ResetPasswordEmail", "/code"];

  return (
    <GoogleOAuthProvider clientId="361184163851-pve81gsol6s8uuqr0hijoqjgi9gib0jc.apps.googleusercontent.com">
      {/* Arrière-plan global appliqué à tout le contenu */}
      <div
        className="relative min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/bg.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.5)", // Ajoute un léger ombrage si nécessaire
        }}
      >
        {/* Navbar conditionnelle */}
        {!hiddenNavbarRoutes.includes(location.pathname) && <Navbar authenticated={authenticated} />}

        {/* Routes */}
        <Routes>
                  {/* Public routes */}
          <Route path="/contact" element={<ContactPage /> } />
          <Route path="/services" element={<ServicesPage /> } />
          <Route path="/aboutus" element={ <AboutUs />} />
          <Route path="/scan" element={<QrScanner />} />

          <Route path="/Reset" element={!authenticated ? <Reset /> : <Navigate to="/home" />} />

          <Route path="/" element={!authenticated ? <LandingPage /> : <Navigate to="/home" />} />
          <Route path="/Login" element={!authenticated ? <Login /> : <Navigate to="/home" />} />
          <Route path="/Register" element={!authenticated ? <Register /> : <Navigate to="/home" />} />
          <Route path="/ResetPasswordEmail" element={!authenticated ? <ResetPasswordEmail /> : <Navigate to="/home" />} />
          <Route path="/code" element={!authenticated ? <VerifyCode /> : <Navigate to="/home" />} />
          <Route path="/resetpwd" element={!authenticated ? <ResetPassword /> : <Navigate to="/home" />} />

        
                 {/* Authenticated routes */}

          <Route path="/ProfilePage" element={authenticated ? <ProfilePage /> : <Navigate to="/" />} />
          <Route path="/EditProfile" element={authenticated ? <EditProfile /> : <Navigate to="/" />} />
          <Route path="/Settings" element={authenticated ? <Settings /> : <Navigate to="/" />} />
          {/* <Route path="/test" element={authenticated ? <Test /> : <Navigate to="/" />} /> */}
          <Route path="/contact" element={authenticated ? <ContactPage /> : <Navigate to="/" />} />
          <Route path="/services" element={authenticated ? <ServicesPage /> : <Navigate to="/" />} />
          <Route path="/aboutus" element={authenticated ? <AboutUs /> : <Navigate to="/" />} />
          <Route path="/home" element={authenticated ? <HomePage /> : <Navigate to="/" />} />
          
          <Route path="/resto/2/menu" element={authenticated ? <Menu /> : <Navigate to="/" />} />
          <Route path="/reservation" element={authenticated ? <Reservation /> : <Navigate to="/" />} />
          <Route path="/orders" element={authenticated ? <Orders /> : <Navigate to="/" />} />
          <Route path="/cart" element={authenticated ? <Panier /> : <Navigate to="/" />} />
          <Route path="/success"element={authenticated ? <Success /> : <Navigate to="/" />} />



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
        </Routes>

        {/* Footer */}
        {!hiddenNavbarRoutes.includes(location.pathname) && <Footer />}
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
