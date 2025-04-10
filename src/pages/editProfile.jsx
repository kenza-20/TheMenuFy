import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory
import Button from "../components/button";
import { Camera } from "lucide-react";
import Rating from 'react-rating';

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Use navigate here

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
    } else {
      setError("No user data found.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prevUser) => ({
          ...prevUser,
          profilePic: reader.result, // Update the profilePic in the user state
        }));
      };
      reader.readAsDataURL(file); // Read the image as a data URL
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Save updated data to localStorage
    localStorage.setItem("user", JSON.stringify(user));

    // Optionally, make a backend API call to update the data on the server
    // await fetch('/api/updateUser', { method: 'POST', body: JSON.stringify(user) });

    setIsLoading(false);
    navigate("/profilePage"); // Use navigate instead of history.push()
  };

  if (isLoading) return <p>Saving...</p>;

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/bg.jpg')" }}>
      <main className="flex items-center justify-center min-h-screen py-30 px-6">
        <div className="max-w-5xl w-full bg-black/20 backdrop-blur-sm p-8 rounded-2xl shadow-sm">
          <div className="flex flex-wrap items-center justify-between">
            {/* Image Section */}
            <div className="w-1/3 mb-6 text-center relative">
              <div className="text-xl font-semibold text-black mb-4">
                {user?.name} {user?.surname}
              </div>

              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-yellow-500 mx-auto mb-4">
                {/* Display profile image or default placeholder */}
                <img
                  src={user?.profilePic || "/default-profile.jpg"} // Image par défaut si aucune image de profil
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {/* Edit icon on top of the profile picture */}
                <label className="absolute bottom-0 right-0 p-2 bg-yellow-500 rounded-full text-white hover:bg-yellow-600 transition-all cursor-pointer">
                  <Camera size={20} />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange} // Handle image change
                  />
                </label>
              </div>
            </div>

            {/* Form Section */}
            <div className="w-2/3 pl-8">
              <h1 className="text-3xl font-bold text-black mb-4">Edit Profile</h1>
              {error && <p className="text-red-500">{error}</p>}

              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex flex-col mb-4">
                  <label htmlFor="surname" className="text-black">Surname</label>
                  <input
                    type="text"
                    name="surname"
                    value={user?.surname || ""}
                    onChange={handleChange}
                    className="mt-2 p-3 rounded-lg bg-gray-200 text-black"
                    placeholder="Surname"
                    required
                  />
                </div>

                <div className="flex flex-col mb-4">
                  <label htmlFor="name" className="text-black">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={user?.name || ""}
                    onChange={handleChange}
                    className="mt-2 p-3 rounded-lg bg-gray-200 text-black"
                    placeholder="Name"
                    required
                  />
                </div>

                <div className="flex flex-col mb-4">
                  <label htmlFor="email" className="text-black">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={user?.email || ""}
                    onChange={handleChange}
                    className="mt-2 p-3 rounded-lg bg-gray-200 text-black"
                    placeholder="Email"
                    required
                  />
                </div>

                <div className="flex flex-col mb-4">
                  <label htmlFor="phone" className="text-black">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={user?.tel || ""}
                    onChange={handleChange}
                    className="mt-2 p-3 rounded-lg bg-gray-200 text-black"
                    placeholder="Phone Number"
                    required
                  />
                </div>

                {/* Rating Section */}
                <div className="flex items-center mb-4">
                  <Rating
                    emptySymbol="fa fa-star-o fa-2x"
                    fullSymbol="fa fa-star fa-2x"
                    initialRating={user?.rating || 0}
                    onChange={(rating) => setUser({ ...user, rating })}
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
