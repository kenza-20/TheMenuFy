import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import Footer from "../components/footer";
import BlurContainer from "../components/blurContainer";

function ResetPassword() {

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/login.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />

      {/* Main Content */}
      <main className="relative flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8">
        {/* Blur Container */}
        <BlurContainer className="w-full max-w-md sm:max-w-lg lg:max-w-xl p-8 sm:p-10 rounded-2xl bg-white/10 backdrop-blur-xl">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-3xl font-bold text-white">Reset Your Password</h1>

            {/* Display Error Message */}
            {<p className="text-red-500 text-center"></p>}

            {/* Reset Form */}
            <form className="w-full space-y-5" onSubmit="">
              <div className="space-y-4">
                {/* New Password Input */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    value=""
                    onChange=""
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
                    placeholder="Enter your new password"
                    required
                  />
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value=""
                    onChange=""
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
                    placeholder="Confirm your new password"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                className="w-full bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300 mt-4"
                type="submit"
              >
                Reset Password
              </Button>
            </form>
          </div>
        </BlurContainer>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ResetPassword;
