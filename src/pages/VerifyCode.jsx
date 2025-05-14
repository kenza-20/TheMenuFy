import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import Footer from "../components/footer";
import BlurContainer from "../components/blurContainer";

function VerifyCode() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail"); // Retrieve email

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/reset"); // Redirect to password reset page
      } else {
        setError(data.message || "Invalid verification code");
      }
    } catch (err) {
      setError("Server error, please try again later.");
    }
  };

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
      <main className="relative flex flex-col items-center justify-center w-full px-4">
        <BlurContainer className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-white text-center">Enter Verification Code</h1>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60"
              placeholder="Enter the code sent to your email"
              required
            />
            <Button type="submit" className="w-full bg-yellow-500 text-white py-3 px-6 rounded-full">
              Verify Code
            </Button>
          </form>
        </BlurContainer>
      </main>
      <Footer />
    </div>
  );
}

export default VerifyCode;
