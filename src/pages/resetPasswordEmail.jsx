import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import BlurContainer from "../components/blurContainer";
import { FaEnvelope } from "react-icons/fa";

function ResetPasswordEmail() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Un e-mail de réinitialisation a été envoyé !");
        localStorage.setItem("resetEmail", email);

        // Redirection vers la page resetpassword après 3 secondes
        setTimeout(() => {
          navigate('/resetpwd');
        }, 3000);
      } else {
        setError(data.message || "Échec de l'envoi de l'e-mail de réinitialisation.");
      }
    } catch (err) {
      setError("Erreur serveur, veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/bg.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.4)",
        }}
      />

      {/* Main Content */}
      <main className="relative flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 pt-35">
        <BlurContainer className="w-full max-w-md sm:max-w-lg lg:max-w-xl p-8 sm:p-10 rounded-2xl bg-white/10 backdrop-blur-xl shadow-lg">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-3xl font-bold text-white text-center">
              Forgot password
            </h1>
            <p className="text-white/80 text-center">
              Enter your email address, and we will send you a link to reset your password.
            </p>

            {/* Display Error or Success Message */}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}

            {/* Reset Form */}
            <form className="w-full space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
                      placeholder="exemple@domaine.com"
                      required
                    />
                    <FaEnvelope className="absolute right-4 top-3 text-white/60" size={18} />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                className={`w-full py-3 px-6 rounded-full transition-all duration-300 font-semibold border-2 ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed text-white border-gray-500"
                    : "bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-yellow-500"
                }`}
                type="submit"
                disabled={loading}
              >
                {loading ? "Envoi en cours..." : "Reset password"}
              </Button>
            </form>
          </div>
        </BlurContainer>
      </main>
    </div>
  );
}

export default ResetPasswordEmail;
