import { useEffect, React } from "react";
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
import { useSelector } from 'react-redux'; // Use redux selector for auth
import { isAuthenticated } from "./selectors/AuthSelector"; // Import isAuthenticated
import VerifyCode from "./pages/VerifyCode";

const App = () => {
  const { pathname } = useLocation();
  const authenticated = useSelector(isAuthenticated); // Get authentication status from redux

  useEffect(() => {
    console.log("authenticated", authenticated);
  }, [authenticated]);

  // Define paths where Navbar should be hidden
  const hiddenNavbarRoutes = ["/Login", "/Register", "/Reset", "/ResetPasswordEmail", "/code"];

  return (
    <>
      {/* Render Navbar only if not on hidden routes */}
      {/* {!hiddenNavbarRoutes.includes(pathname) && (
        <div className="container absolute left-2/4 z-10 mx-auto -translate-x-2/4 p-4">
          <Navbar />
        </div>
      )} */}

<Navbar authenticated={authenticated} />


      <Routes>
        {/* Public routes */}
        <Route path="/Login" element={!authenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/Register" element={!authenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/Reset" element={!authenticated ? <Reset /> : <Navigate to="/" />} />
        <Route path="/ResetPasswordEmail" element={!authenticated ? <ResetPasswordEmail /> : <Navigate to="/" />} />
        <Route path="/code" element={!authenticated ? <VerifyCode /> : <Navigate to="/" />} />

        {/* Authenticated routes */}
        <Route path="/" element={authenticated ? <HomePage /> : <Navigate to="/Login" />} />
        <Route path="/ProfilePage" element={authenticated ? <ProfilePage /> : <Navigate to="/Login" />} />
        <Route path="/EditProfile" element={authenticated ? <EditProfile /> : <Navigate to="/Login" />} />
        <Route path="/Settings" element={authenticated ? <Settings /> : <Navigate to="/Login" />} />

        {/* Default redirection */}
        <Route path="*" element={authenticated ? <Navigate to="/" /> : <Navigate to="/Login" />} />
      </Routes>

      {/* Render Footer only if not on hidden routes */}
      {!hiddenNavbarRoutes.includes(pathname) && <Footer />}
    </>
  );
};

export default App;
