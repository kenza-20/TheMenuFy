import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebook } from "react-icons/fa"; // Tu peux aussi changer cette ligne avec d'autres icônes si besoin

const FacebookAuthButton = () => {
  const navigate = useNavigate();

  useEffect(() => {
    /* Charger le SDK Facebook */
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "TON_APP_ID", // Remplace par ton App ID Facebook
        cookie: true,
        xfbml: true,
        version: "v12.0",
      });
    };

    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleFacebookLogin = () => {
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          fetch("http://localhost:5000/api/users/facebook", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ accessToken: response.authResponse.accessToken }),
          })
            .then((res) => res.json())
            .then((data) => {
              localStorage.setItem("token", data.token);
              navigate("/profilePage");
            })
            .catch((error) => console.error("Facebook authentication error:", error));
        }
      },
      { scope: "public_profile,email" }
    );
  };

  return (
    <div className="w-full flex justify-center my-4">
      <button
        onClick={handleFacebookLogin}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-transparent hover:bg-gray-200"
      >
        <FaFacebook size={20} className="text-blue-600" />
      </button>
    </div>
  );
};

export default FacebookAuthButton;
