import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/button";
import Footer from "../components/footer";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check if email and password are not empty before making the request
    if (!email || !password) {
      setError("Please provide both email and password");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/user/login", { email, password });
      
      if (response.data.token) {
        // Store token for authentication
        localStorage.setItem("token", response.data.token);
        navigate("/profilePage"); // Redirect to profile page after successful login
      } else {
        setError("Authentication failed. Please try again.");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/login.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />
      <main className="relative flex-grow flex items-center justify-center sm:justify-start py-6 px-4 sm:px-6 lg:px-20">
        <div className="w-full max-w-md sm:w-[480px] sm:h-[600px] p-10 rounded-2xl bg-white/10 backdrop-blur-xl mr-0 sm:mr-10 flex flex-col justify-between">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-3xl font-bold text-white pt-4">Sign in</h1>

            {error && <p className="text-red-500 text-center w-full">{error}</p>}

            <form className="w-full max-w-sm space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-3">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-300/30 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-gray-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-3">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-300/30 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-gray-400"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-yellow-500" />
                    <label className="ml-2 block text-sm text-white">Remember me</label>
                  </div>
                  <Link to="/resetPassword" className="text-sm text-yellow-500 hover:text-yellow-400">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute w-full border-t border-yellow-500">
                  <div className="relative px-4 my-2 mb-2 text-sm text-white flex justify-center">
                    Or continue with
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300 mt-6"
                type="submit"
              >
                Sign in
              </Button>
            </form>
          </div>

          <div className="text-center mt-4">
            <span className="text-white">Don't have an account? </span>
            <Link to="/register" className="text-yellow-500 hover:text-yellow-400 font-medium">
              Create one
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Login;
