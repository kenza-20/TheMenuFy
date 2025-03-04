import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "@/widgets/layout";
import routes from "@/routes";
import authenticatedRoutes from "@/authenticatedRoutes";
import { Dashboard,Home, Profile, Logout, SignIn, SignUp} from "@/pages";

import { isAuthenticated } from "./selectors/AuthSelector";  // Import isAuthenticated
import { useSelector } from 'react-redux';  // Use redux selector for auth
import { useEffect } from "react";

function App() {
  const { pathname } = useLocation();
  const authenticated = useSelector(isAuthenticated);  // Get authentication status from redux

  useEffect(() => {
    console.log("authenticated", authenticated);
  }, [authenticated]);

  return (
    <>
      {/* Show Navbar only if not on /sign-in or /sign-up */}
      {!(pathname === '/sign-in' || pathname === '/sign-up') && (
        <div className="container absolute left-2/4 z-10 mx-auto -translate-x-2/4 p-4">
          {authenticated ? <Navbar routes={authenticatedRoutes} /> : <Navbar routes={routes} />}
        </div>
      )}
      
      <Routes>
        {/* Protected routes */}
        <Route path="/dashboard" 
          element={authenticated ? <Dashboard /> : <Navigate to="/sign-in" />} />

<Route path="/profile" element={!authenticated ? <Home /> : <Profile />} />

        {/* Authentication routes */}
        <Route path="/sign-in" 
          element={!authenticated ? <SignIn /> : <Navigate to="/dashboard" />} />
        
        <Route path="/sign-up" 
          element={!authenticated ? <SignUp /> : <Navigate to="/dashboard" />} />

<Route path="/logout" element={ <Logout />}  />
        
        {/* Public route */}
        <Route path="/home" 
          element={!authenticated ? <Home /> : <Navigate to="/dashboard" />} />

        {/* Default redirection */}
        <Route path="*" element={<Navigate to={authenticated ? "/dashboard" : "/home"} replace />} />
      </Routes>
    </>
  );
}

export default App;
