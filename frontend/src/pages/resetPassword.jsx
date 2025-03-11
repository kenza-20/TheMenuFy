import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/button";
import Footer from "../components/footer";
import BlurContainer from "../components/blurContainer";
import axios from "axios";
function ResetPassword() {


  const [password, setPassword] = useState("");
  const [resetCode, setResetCode] = useState("");
  //const [email, setEmail] = useState("");
  //const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {id,token}=useParams()

  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup
 
  const handleSubmit = async (e) => {
    e.preventDefault();
   

    try {
      const response = await axios.post(`http://localhost:3000/api/user/reset-password`, {
          // Send resetCode to backend
          newPassword: password,resetCode:resetCode 
          
      });

      setIsPopupOpen(true);

   console.log(response);
      if (response.status === 200) {
        setTimeout(() => {
          setIsPopupOpen(false);
          navigate("/Login"); // Change this to your desired route
        }, 2000);
      }
    } catch (err) {
      console.log(err);
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

      {/* Main Content */}
      <main className="relative flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8">
        {/* Blur Container */}
        <BlurContainer className="w-full max-w-md sm:max-w-lg lg:max-w-xl p-8 sm:p-10 rounded-2xl bg-white/10 backdrop-blur-xl">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-3xl font-bold text-white">Reset Your Password</h1>

            {/* Display Error Message */}
            {error && <p className="text-red-500 text-center">{error}</p>}


            {/* Reset Form */}
            <form className="w-full space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* New Password Input */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">New Password</label>
                  <input
                    
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
                    placeholder="Enter your new password"
                    required
                    //{...register('password')}
                  />
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">The Email Code</label>
                  <input
                    
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
                    placeholder="Enter your Email Code"
                    required
                    //{...register('password')}
                  />
                </div>
                
              </div>

              <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    
                    <label className="ml-2 block text-sm text-white">
                      Back To Email Check :
                    </label>
                  </div>
                  <a
                    href="/ResetPasswordEmail"
                    className="text-sm text-yellow-500 hover:text-yellow-400"
                  >
                    Set Your Email?
                  </a>
                </div>

              <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    
                    <label className="ml-2 block text-sm text-white">
                      Back To Sign In :
                    </label>
                  </div>
                  <a
                    href="/Login"
                    className="text-sm text-yellow-500 hover:text-yellow-400"
                  >
                    Sign In?
                  </a>
                </div>


              {/* Submit Button */}
              <Button
                className="w-full bg-transparent hover:bg-yellow-500 text-white hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300 mt-4"
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
      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-bold text-gray-800">Your Password has been Reset !</h2>
            <p className="text-gray-600 mt-2">Now you can LogIn.</p>
            <button
              className="mt-4 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-all"
              onClick={() => setIsPopupOpen(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResetPassword;
