import React, { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import {FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../components/button";
import GoogleAuthButton from "../components/GoogleAuthButton";
import FacebookAuthButton from "../components/FacebookAuthButton";

import { useDispatch,useSelector } from 'react-redux';
import { loadingToggleAction,loginAction,} from '../actions/AuthActions';



function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(""); // 2FA Code
  const [show2FA, setShow2FA] = useState(false); // Show 2FA input if required
  const [error, setError] = useState("");
  const [errors, setErrors] = useState("");
  const dispatch = useDispatch(); // Get Redux dispatcher (add inside the component)

  let errorsObj = { email: '', password: '' };

  const [showPassword, setShowPassword] = useState(false); // Eye icon toggle
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    console.log("useEffect triggered, isAuthenticated:", isAuthenticated); // ✅ Debugging
    if (isAuthenticated) {
      console.log("Navigating to /dashboard..."); // ✅ Confirm before navigation
      navigate("/");
    }
  }, [isAuthenticated, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };
    if (email === '') {
        errorObj.email = 'Email is Required';
        error = true;
    }
    if (password === '') {
        errorObj.password = 'Password is Required';
        error = true;
    }
    setErrors(errorObj);
    if (error) {
  return ;
  }
  dispatch(loadingToggleAction(true));
  // const success = await
  dispatch(loginAction(email, password,navigate));


  }



  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/login1.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />

      <main className="relative flex-grow flex items-center justify-center py-6 px-4 sm:px-6 lg:px-20">
        <div className="w-full max-w-md sm:w-[480px] sm:h-[600px] p-10 rounded-2xl bg-white/10 backdrop-blur-lg mr-0 sm:mr-10 flex flex-col justify-between">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-3xl font-bold text-white pt-4 mb-8">Sign In</h1>

            {error && (
              <p className="text-red-500 text-center w-full">{error}</p>
            )}

            <form className="w-full max-w-sm space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-white text-sm font-medium mb-4">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-300/30 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-gray-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Password + eye icon */}
                {/* Password Input with Eye Icon */}
                <div className="relative w-full">
  <label className="block text-white text-sm font-medium mb-4">
    Password
  </label>
  <input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full px-4 py-3 bg-white/10 border border-gray-300/30 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-gray-400 pr-12"
    placeholder="Enter your password"
    required
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute top-[58px] right-4 text-white"
  >
    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
  </button>
</div>



                {/* 2FA Code */}
                {show2FA && (
                  <div>
                    <label className="block text-white text-sm font-medium mb-3">
                      2FA Code
                    </label>
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-300/30 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-gray-400"
                      placeholder="Enter your 2FA code"
                      required
              />
                  </div>
                )}

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-yellow-500"
                    />
                    <label className="ml-2 block text-sm text-white">
                      Remember me
                    </label>
                  </div>
                  <a
                    href="/ResetPasswordEmail"
                    className="text-sm text-yellow-500 hover:text-yellow-400"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                className="w-full bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300 mt-3"
                type="submit"
              >
                Sign in
              </Button>
            </form>

            {/* Social Login */}
            <div className="text-center text-white mt-0 font-normal">
              Or sign up using
              <div className="flex justify-center mt-2">
                <GoogleAuthButton className="w-12 h-12 p-2 bg-white rounded-full shadow-lg mx-1" />
                <FacebookAuthButton className="w-12 h-12 p-2 bg-white rounded-full shadow-lg mx-1" />
              </div>
            </div>
          </div>

          {/* Signup link */}
          <div className="text-center mt-0">
            <span className="text-white">Don't have an account ? </span>
            <a
              href="/register"
              className="text-yellow-500 hover:text-yellow-400 font-medium"
            >
              Create one
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
