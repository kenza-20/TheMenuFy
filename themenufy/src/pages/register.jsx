import React, { useState } from "react";
import Button from "../components/button";
import Footer from "../components/footer";

function Register() {
  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/Register.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />
      <main className="relative flex-grow flex items-center justify-center sm:justify-end py-6 px-4 sm:px-6 lg:px-20">
        <div className="w-full max-w-md sm:w-[480px] sm:h-auto p-10 rounded-2xl bg-white/10 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            { (
              <p className="text-red-500 text-center w-full"></p>
            )}
            {(
              <p className="text-green-500 text-center w-full"></p>
            )}
            <form className="w-full space-y-5" onSubmit="">
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className="w-full p-3 rounded-lg border border-white/30 bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
                    placeholder="Enter your full name"
                    value=""
                    onChange=""
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full p-3 rounded-lg border border-white/30 bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
                    placeholder="Enter your email"
                    value=""
                    onChange=""
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="w-full p-3 rounded-lg border border-white/30 bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
                    placeholder="Create a password"
                    value=""
                    onChange=""
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="w-full p-3 rounded-lg border border-white/30 bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
                    placeholder="Confirm your password"
                    value=""
                    onChange=""
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    name="termsAccepted"
                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-500"
                    checked=""
                    onChange=""
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-white">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-yellow-500 hover:text-yellow-400"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute w-full border-t border-yellow-500">
                  {" "}
                  <div className="relative px-4 my-2 mb-2 text-sm text-white items-center flex justify-center">
                    Or continue with
                  </div>
                </div>
              </div>
              <Button className="w-full bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300">
                Create Account
              </Button>
              <div className="text-center mt-4">
                <span className="text-white">Already have an account? </span>
                <a
                  href="/login"
                  className="text-yellow-500 hover:text-yellow-400 font-medium"
                >
                  Sign in
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Register;
