import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Camera } from "lucide-react";
import Button from "../components/button";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found!");

        const response = await fetch("http://localhost:3000/api/user/bytoken", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch profile data");

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
        const response = await fetch("http://localhost:3000/api/user/bytoken", {
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

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10" style={{ backgroundImage: "url('/Profile.jpg')" }} />

      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-md px-6 py-8 rounded-2xl bg-white/20 backdrop-blur-lg text-white">
          <div className="flex flex-col items-center space-y-6">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={user.profilePic || "/default-profile.jpg"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
              
            </div>

            {/* Name */}
            <h1 className="text-2xl font-bold">{user.name} {user.surname}</h1>

            {/* Profile Info */}
            <div className="space-y-4 w-full">
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <Mail className="text-yellow-500" size={20} />
                <p>{user.email}</p>
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <span className="text-yellow-500">Phone:</span>
                <p>{user.tel || "Not provided"}</p>
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <span className="text-yellow-500">Role:</span>
                <p>{user.role}</p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <Link to="/EditProfile">
              <Button className="bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300">
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
