import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import Footer from "../components/footer";
import BlurContainer from "../components/blurContainer";
import { forgotPassword } from "../../service/api";
import { useForm } from 'react-hook-form';


function ResetPasswordEmail() {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =  useState(false);
  
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup


  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const [userData, setUserData]=useState({
    
      
      email:"",
      /*password:"",
      role:"",
      confirmed:"",
      app:"",
      isBlocked:"",*/
    })
  
  
    const submit = async (data) => {
      try {
        setLoading(true); // Optionnel : mettre en mode "chargement"
        setError(""); // Réinitialiser les erreurs si tout va bien
        
        console.log("Data to send:", data); // Vérifier les données envoyées
        await forgotPassword(data); // Appel à la fonction API
        setIsPopupOpen(true); // Show popup on success

        // Si tout se passe bien, on redirige vers une autre page, par exemple "/PasswordChange"
        setTimeout(() => {
          setIsPopupOpen(false);
          navigate("/Reset"); // Change this to your desired route
        }, 2000); // Redirection vers la page "PasswordChange"
        
      } catch (error) {
        console.error(error);
        setError("Something went wrong. Please try again."); // Gestion des erreurs
      } finally {
        setLoading(false); // Réinitialisation du "chargement"
      }
    }; 


  return (
    <div className="flex flex-col min-h-screen items-center justify-between">
    {/* Background Image */}
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
      style={{
        backgroundImage: "url('/login.jpg')",
        backgroundSize: "cover",      // L'image couvre toute la page
        backgroundAttachment: "fixed",
        boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
      }}
    />

    {/* Navbar */}
    <navBar /> {/* Adding Navbar here */}

    {/* Main Content */}
    <main className="relative flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 flex-grow">
      <BlurContainer className="w-full max-w-md sm:max-w-lg lg:max-w-xl p-8 sm:p-10 rounded-2xl bg-white/10 backdrop-blur-xl">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-3xl font-bold text-white text-center">
            Reset Your Password
          </h1>

          {/* Display Error Message */}
          {<p className="text-red-500 text-center"></p>}

          {/* Reset Form */}
          <form className="w-full space-y-6" onSubmit={handleSubmit(submit)}>
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Enter your email address
                </label>
                <input
                  type="email"
                 
                  onChange=""
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
                  placeholder="Enter your email address"
                  required
                  {...register('email')}
                />
              </div>
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
              className="w-full bg-transparent hover:bg-yellow-500 text-white hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300"
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
          <h2 className="text-xl font-bold text-gray-800">Email Sent!</h2>
          <p className="text-gray-600 mt-2">Check your inbox for further instructions.</p>
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

export default ResetPasswordEmail;
