import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import Button from "../components/button";
import BlurContainer from "../components/blurContainer";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(""); // Store the reset code here
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate the inputs (you can add more validation here)
    if (!password || !code) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      // Send a POST request to reset the password
      const response = await fetch("http://localhost:3000/api/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetCode: code, newPassword: password }), // Send resetCode and newPassword
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Your password has been reset successfully!");
        setTimeout(() => navigate("/login"), 2000); // Redirect to login after success
      } else {
        setError(data.error || "Reset failed");
      }
    } catch (err) {
      setError("Server error, please try again later.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/bg.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.5)",
        }}
      />

      <main className="relative flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 mt-35">
        <BlurContainer className="w-full max-w-md sm:max-w-lg lg:max-w-xl p-8 sm:p-10 rounded-2xl bg-white/10 backdrop-blur-xl shadow-lg">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-3xl font-bold text-white">Reset Your Password</h1>
            <p className="text-white/80 text-center">
              Enter your new password below to reset your account.
            </p>

            {/* Display Messages */}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}

            {/* Reset Form */}
            <form className="w-full space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* New Password Input */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
                      placeholder="Enter new password"
                      required
                    />
                    <FaLock className="absolute right-4 top-3 text-white/60" size={18} />
                  </div>
                </div>

                {/* Code Input */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Reset Code</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
                      placeholder="Enter the code you received"
                      required
                    />
                    <FaLock className="absolute right-4 top-3 text-white/60" size={18} />
                  </div>
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
    </div>
  );
}

export default ResetPassword;
