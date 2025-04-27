import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import Footer from "../components/footer";
import "react-intl-tel-input/dist/main.css";
import ReactIntlTelInput from "react-intl-tel-input"; // Import the phone input component

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    role: "",
    countryCode: "+216", // Default code
    phone: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showTerms, setShowTerms] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.termsAccepted) {
      setError("You must accept the terms and conditions.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/user/signup", {
        name: formData.firstName,
        surname: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: "client",
        tel: `${formData.countryCode}${formData.phone}`,
      });

      setSuccess("Account created successfully!");
      localStorage.setItem("token", res.data.token);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handlePhoneChange = (value, data) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
      countryCode: `+${data.dialCode}`, // Updates the country code when user selects the country
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/login1.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />
      <main className="relative flex-grow flex justify-start">
        <div
          className="min-h-screen bg-white/ backdrop-blur-lg px-10 py-10 relative"
          style={{
            width: "50%",
            clipPath: "polygon(0% 0%, 80% 0%, 100% 100%, 0% 100%)",
            zIndex: 20,
          }}
        >
          <h1 className="text-3xl font-bold text-white mb-8 text-center mx-auto">
            Create an account
          </h1>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col items-start max-w-md ml-10">
              <label className="text-white text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                className="w-full p-2 rounded border border-white/30 bg-white/10 text-white placeholder-white/60"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col items-start max-w-md ml-10">
              <label className="text-white text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="w-full p-2 rounded border border-white/30 bg-white/10 text-white placeholder-white/60"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col items-start max-w-md ml-10">
              <label className="text-white text-sm font-medium mb-1">Phone</label>
              <div className="w-full">
                {/* Phone Input with Flag Dropdown */}
                <ReactIntlTelInput
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  preferredCountries={["us", "tn", "fr", "de"]} // Add country codes you want to support
                  defaultCountry="tn" // Default to Tunisia
                  inputClassName="w-full p-2 rounded border border-white/30 bg-white/10 text-white placeholder-white/60"
                  countryCodeEditable={false} // Prevent editing of the country code directly
                />
              </div>
            </div>

            <div className="flex flex-col items-start max-w-md ml-10">
              <label className="text-white text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                className="w-full p-2 rounded border border-white/30 bg-white/10 text-white placeholder-white/60"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col items-start max-w-md ml-10">
              <label className="text-white text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                className="w-full p-2 rounded border border-white/30 bg-white/10 text-white placeholder-white/60"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col items-start max-w-md ml-10">
              <label className="text-white text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full p-2 rounded border border-white/30 bg-white/10 text-white placeholder-white/60"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center max-w-md ml-10">
              <input
                id="terms"
                type="checkbox"
                name="termsAccepted"
                className="h-4 w-4 text-yellow-500 focus:ring-yellow-500"
                checked={formData.termsAccepted}
                onChange={handleChange}
              />
              <label htmlFor="terms" className="ml-2 text-sm text-white">
                I agree to the{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTerms(true);
                  }}
                  className="text-yellow-500 hover:text-yellow-400"
                >
                  Terms and Conditions
                </a>
              </label>
            </div>

            <div className="flex justify-start ml-10">
              <Button className="w-full max-w-md bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded transition">
                Create Account
              </Button>
            </div>

            <div className="flex items-start mt-2 ml-10">
              <span className="text-white">Already have an account? </span>
              <a href="/login" className="text-yellow-500 hover:text-yellow-400 font-medium ml-2">
                Sign in
              </a>
            </div>
          </form>
        </div>
      </main>

      {/* 🔽 Modal Terms & Conditions 🔽 */}
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white w-[90%] max-w-2xl rounded-lg p-6 shadow-xl relative">
            <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>
            <div className="text-sm text-gray-700 max-h-[60vh] overflow-y-auto">
              <p className="mb-4">
                Welcome to our application. By creating an account, you agree to the following:
              </p>
              <ul className="list-disc ml-5 space-y-2">
                <li>You must provide accurate personal information.</li>
                <li>Your account is personal and should not be shared.</li>
                <li>We reserve the right to suspend accounts for misuse.</li>
                <li>Your data will be handled according to our privacy policy.</li>
                <li>Use of our service is at your own risk.</li>
              </ul>
              <p className="mt-4">For full legal details, please contact us directly.</p>
            </div>
            <button
              onClick={() => setShowTerms(false)}
              className="mt-6 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Register;
