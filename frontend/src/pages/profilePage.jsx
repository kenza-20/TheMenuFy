import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Edit3 } from "lucide-react";
import BlurContainer from "../components/blurContainer";
import Button from "../components/button";
import Footer from "../components/footer";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },  // Add Bearer before the token
        });        
        console.log("User Profile Response:", response.data); // Log the response
        setUser(response.data);
      } catch (error) {
        setError(error.response ? error.response.data.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/Profile.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />

      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <BlurContainer className="w-[450px] p-8 rounded-2xl bg-white/10 backdrop-blur-xl text-white">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
              <User size={50} className="text-gray-700" />
            </div>

            <h1 className="text-3xl font-bold">
              {user?.name ?? "Name not available"} {user?.surname ?? "Surname not available"}
            </h1>

            <div className="space-y-6 w-full">
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <Mail className="text-yellow-500" size={20} />
                <p>{user?.email ?? "Email not available"}</p>
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <Lock className="text-yellow-500" size={20} />
                <p>{user?.role ?? "Role not available"}</p>
              </div>
            </div>

            <Link to="/EditProfile">
              <Button className="bg-transparent hover:bg-yellow-500 text-white-500 hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300 flex items-center space-x-2">
                <Edit3 size={18} />
                <span>Edit Profile</span>
              </Button>
            </Link>
          </div>
        </BlurContainer>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
