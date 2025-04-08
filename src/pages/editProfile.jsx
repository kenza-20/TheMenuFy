import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, Star } from "lucide-react";
import Button from "../components/button";
import Footer from "../components/footer";
import Rating from 'react-rating';
import { Mail, Camera } from "lucide-react";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rating: 0,
    profilePic: "", 
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fonction pour récupérer les données de l'utilisateur avec le token
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/user/bytoken", // L'API getByToken
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
               // En-tête avec le token
            },
            
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFormData({
            firstName: data.user.name || "",
            lastName: data.user.surname || "",
            email: data.user.email || "",
            password: data.user.password,
          });
        } else {
          setError("Failed to fetch user data.");
        }
      } catch (err) {
        setError("Server error, please try again later.");
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/user/update-profile", {
        method: "PUT", // Mise à jour des données de l'utilisateur
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Token pour l'authentification
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password || undefined,
          rating: formData.rating,
        }),
      });

      if (response.ok) {
        navigate("/profilePage"); // Rediriger vers la page de profil après succès
      } else {
        setError("Update failed. Try again.");
      }
    } catch (err) {
      setError("Server error, please try again later.");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image/jpeg") && !file.type.match("image/png") && !file.type.match("image/webp")) {
      setError("Only JPEG, PNG, and WebP formats are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result;

      try {
        const response = await fetch("http://localhost:3000/api/user/update-profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ profilePic: base64Image }),
        });

        if (response.ok) {
          const data = await response.json();
          setUser((prev) => ({ ...prev, profilePic: data.profilePic }));
        } else {
          setError("Error uploading image.");
        }
      } catch (err) {
        setError("Server issue, please try again later.");
      }
    };
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/bg.jpg')" }}>
      <main className="flex items-center justify-center min-h-screen py-30 px-6">
        <div className="max-w-5xl w-full bg-black/20 backdrop-blur-sm p-8 rounded-2xl shadow-sm">
          <div className="flex flex-wrap items-center justify-between">
            {/* Image Section */}
            <div className="w-1/3 mb-6 text-center relative">
              <div className="text-xl font-semibold text-black mb-4">
                {formData.firstName} {formData.lastName}
              </div>

              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-yellow-500 mx-auto mb-4">
                {/* Display profile image or default placeholder */}
                <img
                  src={formData.profilePic || "/default-profile.jpg"} // Image par défaut si aucune image de profil
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {/* Edit icon on top of the profile picture */}
                <label className="absolute bottom-0 right-0 p-2 bg-yellow-500 rounded-full text-white hover:bg-yellow-600 transition-all cursor-pointer">
                <Camera size={20} />
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              </div>
            </div>

            {/* Form Section */}
            <div className="w-2/3 pl-8">
              <h1 className="text-3xl font-bold text-black mb-4">Edit Profile</h1>
              {error && <p className="text-red-500">{error}</p>}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col mb-4">
                  <label htmlFor="firstName" className="text-black">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-2 p-3 rounded-lg bg-gray-200 text-black"
                    placeholder="First Name"
                    required
                  />
                </div>

                <div className="flex flex-col mb-4">
                  <label htmlFor="lastName" className="text-black">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-2 p-3 rounded-lg bg-gray-200 text-black"
                    placeholder="Last Name"
                    required
                  />
                </div>

                <div className="flex flex-col mb-4">
                  <label htmlFor="email" className="text-black">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 p-3 rounded-lg bg-gray-200 text-black"
                    placeholder="Email"
                    required
                  />
                </div>

                <div className="flex flex-col mb-4">
                  <label htmlFor="password" className="text-black">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-2 p-3 rounded-lg bg-gray-200 text-black"
                    placeholder="New Password (optional)"
                  />
                </div>

                <div className="flex items-center mb-4">
                  <Star className="text-yellow-500" size={20} />
                  <Rating
                    emptySymbol="fa fa-star-o fa-2x"
                    fullSymbol="fa fa-star fa-2x"
                    initialRating={formData.rating}
                    onChange={handleRatingChange}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-yellow-500 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300"
                >
                  Save Changes
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
