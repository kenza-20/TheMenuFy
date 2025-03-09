import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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

const App = () => {
  const location = useLocation(); // Get the current route

  // Define paths where Navbar should be hidden
  const hiddenNavbarRoutes = ["/Login", "/Register"];

  return (
    <>
        {/* Render Navbar only if the current route is NOT in hiddenNavbarRoutes */}
        {!hiddenNavbarRoutes.includes(location.pathname) && <Navbar />}
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Reset" element={<Reset />} />
          <Route path="/ResetPasswordEmail" element={<ResetPasswordEmail />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/EditProfile" element={<EditProfile />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/code" element={<VerifyCode />} />
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

        {/* Render Footer only if the current route is NOT in hiddenNavbarRoutes */}
        {!hiddenNavbarRoutes.includes(location.pathname) && <Footer />}
    </>
  );
};

export default App;
