import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa"; // Tu peux changer cette ligne avec d'autres icônes si besoin

const GoogleAuthButton = () => {
  const navigate = useNavigate();

  useEffect(() => {
    /* Charger le script Google */
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCallbackResponse = (response) => {
    fetch("http://localhost:5000/api/users/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credential: response.credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("token", data.token);
        navigate("/profilePage");
      })
      .catch((error) => console.error("Google authentication error:", error));
  };

  const handleGoogleLogin = () => {
    /* Lancer l'authentification Google */
    google.accounts.id.initialize({
      client_id: "TON_CLIENT_ID", // Remplace par ton Client ID Google
      callback: handleCallbackResponse,
    });
    google.accounts.id.prompt(); // Affiche la fenêtre de connexion Google
  };

  return (
    <div className="w-full flex justify-center my-4">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-transparent hover:bg-gray-200"
      >
        <FaGoogle size={20} className="text-red-500" />
      </button>
    </div>
  );
};

export default GoogleAuthButton;
